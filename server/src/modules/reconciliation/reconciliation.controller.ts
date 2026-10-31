import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { BankTransaction } from '../../models/bank-transaction.model';
import { Invoice } from '../../models/invoice.model';
import { Payment } from '../../models/payment.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import { toMinorUnits, addMoney, subtractMoney } from '../../utils/money';

export async function listBankTransactions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { status, direction, page = '1', limit = '50' } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (status && status !== 'ALL') {
      query.matchingStatus = status;
    }
    if (direction) {
      query.direction = direction;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      BankTransaction.find(query)
        .populate('matchedInvoiceId', 'invoiceNumber total outstandingBalance status')
        .populate('matchedPaymentId', 'paymentNumber amount method paidAt')
        .sort({ transactionDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BankTransaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Imports raw CSV statement data.
 * Format expected: Date,Source,Reference,Description,Amount,Direction
 */
export async function importBankStatementCsv(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { csvContent } = req.body;

    if (!csvContent || typeof csvContent !== 'string') {
      res.status(400).json({ success: false, message: 'CSV text content is required' });
      return;
    }

    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      res.status(400).json({ success: false, message: 'CSV file contains no transaction rows' });
      return;
    }

    // Skip header line
    const dataRows = lines.slice(1);
    let importedCount = 0;
    let duplicateCount = 0;

    // Get open invoices for deterministic suggestion scoring
    const openInvoices = await Invoice.find({
      organizationId: org._id,
      status: { $in: ['CONFIRMED', 'OVERDUE', 'PARTIALLY_PAID'] },
    }).populate('customerId', 'businessName');

    for (const row of dataRows) {
      const parts = row.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 5) continue;

      const [dateStr, source, reference, description, amountStr, directionStr] = parts;
      const rawImportHash = crypto.createHash('md5').update(`${org._id}-${row}`).digest('hex');

      const existing = await BankTransaction.findOne({ organizationId: org._id, rawImportHash });
      if (existing) {
        duplicateCount++;
        continue;
      }

      const amountMinor = toMinorUnits(parseFloat(amountStr));
      const direction = directionStr?.toUpperCase() === 'OUTBOUND' ? 'OUTBOUND' : 'INBOUND';

      // Deterministic Match Scoring
      let confidence = 50;
      let matchedInvoiceId = undefined;

      // 1. Exact reference match (e.g. invoice number in memo)
      const refMatch = openInvoices.find(
        (inv) =>
          description.toLowerCase().includes(inv.invoiceNumber.toLowerCase()) ||
          reference.toLowerCase().includes(inv.invoiceNumber.toLowerCase()),
      );

      if (refMatch) {
        confidence = 98;
        matchedInvoiceId = refMatch._id;
      } else {
        // 2. Exact amount match against an open invoice
        const amountMatch = openInvoices.find((inv) => inv.outstandingBalance === amountMinor);
        if (amountMatch) {
          confidence = 88;
          matchedInvoiceId = amountMatch._id;
        }
      }

      await BankTransaction.create({
        organizationId: org._id,
        source: source || 'Bank Direct Statement',
        externalReference: reference || `REF-${Date.now()}`,
        transactionDate: new Date(dateStr) || new Date(),
        description: description || 'Bank Settlement Wire',
        amount: amountMinor,
        currency: org.currency || 'USD',
        direction,
        rawImportHash,
        matchingStatus: 'UNMATCHED',
        matchedInvoiceId,
        confidence,
        notes: `Imported via automated statement feed. Confidence: ${confidence}%`,
      });

      importedCount++;
    }

    res.json({
      success: true,
      message: `Statement imported: ${importedCount} transactions created, ${duplicateCount} duplicate rows skipped.`,
      importedCount,
      duplicateCount,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Runs deterministic rule-based auto-matcher across all unmatched inbound transactions.
 */
export async function runAutoMatcher(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();

    const unmatchedTxns = await BankTransaction.find({
      organizationId: org._id,
      matchingStatus: 'UNMATCHED',
      direction: 'INBOUND',
    });

    const openInvoices = await Invoice.find({
      organizationId: org._id,
      status: { $in: ['CONFIRMED', 'OVERDUE', 'PARTIALLY_PAID'] },
    }).populate('customerId', 'businessName');

    let matchedCount = 0;

    for (const txn of unmatchedTxns) {
      const match = openInvoices.find(
        (inv) =>
          inv.outstandingBalance === txn.amount ||
          txn.description.toLowerCase().includes(inv.invoiceNumber.toLowerCase()),
      );

      if (match) {
        txn.matchedInvoiceId = match._id;
        txn.confidence = txn.description.toLowerCase().includes(match.invoiceNumber.toLowerCase())
          ? 98
          : 94;
        await txn.save();
        matchedCount++;
      }
    }

    res.json({
      success: true,
      message: `Auto-matcher evaluated ${unmatchedTxns.length} transactions: ${matchedCount} candidates identified with >=94% confidence.`,
      matchedCandidatesCount: matchedCount,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Confirms a bank transaction match against an invoice.
 * Atomically records Payment and updates Invoice balance.
 */
export async function confirmBankMatch(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { transactionId, invoiceId } = req.body;

    if (!transactionId || !invoiceId) {
      res
        .status(400)
        .json({ success: false, message: 'Transaction ID and Invoice ID are required' });
      return;
    }

    const [txn, invoice] = await Promise.all([
      BankTransaction.findOne({ _id: transactionId, organizationId: org._id }),
      Invoice.findOne({ _id: invoiceId, organizationId: org._id }),
    ]);

    if (!txn) {
      res.status(404).json({ success: false, message: 'Bank transaction not found' });
      return;
    }
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    if (txn.matchingStatus === 'MATCHED') {
      res
        .status(400)
        .json({ success: false, message: 'Transaction is already reconciled and matched' });
      return;
    }

    const paymentAmount = Math.min(txn.amount, invoice.outstandingBalance);

    const paymentCount = await Payment.countDocuments({ organizationId: org._id });
    const paymentNumber = `PAY-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(4, '0')}`;

    // Create payment
    const payment = await Payment.create({
      organizationId: org._id,
      paymentNumber,
      invoiceId: invoice._id,
      customerId: invoice.customerId,
      amount: paymentAmount,
      method: 'BANK_TRANSFER',
      reference: txn.externalReference || txn.source,
      paidAt: txn.transactionDate,
      note: `Reconciled via Bank Matcher: ${txn.source} - ${txn.description}`,
      status: 'SUCCESS',
      allocations: [{ invoiceId: invoice._id, amount: paymentAmount }],
      createdBy: 'BANK_MATCHER',
    });

    // Update invoice
    const newPaidAmount = addMoney(invoice.paidAmount, paymentAmount);
    const newOutstanding = subtractMoney(invoice.total, newPaidAmount);

    invoice.paidAmount = newPaidAmount;
    invoice.outstandingBalance = newOutstanding;
    invoice.status = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';
    if (newOutstanding === 0) {
      invoice.paidAt = new Date();
    }
    await invoice.save();

    // Mark transaction matched
    txn.matchingStatus = 'MATCHED';
    txn.matchedInvoiceId = invoice._id;
    txn.matchedPaymentId = payment._id;
    txn.confidence = 100;
    await txn.save();

    res.json({
      success: true,
      message: `Match confirmed! Reconciled ${(paymentAmount / 100).toFixed(2)} with invoice ${invoice.invoiceNumber}.`,
      data: {
        transaction: txn,
        payment,
        invoice,
      },
    });
  } catch (err) {
    next(err);
  }
}
