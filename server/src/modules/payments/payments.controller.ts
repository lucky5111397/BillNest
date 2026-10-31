import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Payment } from '../../models/payment.model';
import { Invoice } from '../../models/invoice.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import { toMinorUnits, addMoney, subtractMoney } from '../../utils/money';

const createPaymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  amount: z.number().min(0.01, 'Payment amount must be greater than zero'),
  method: z.enum(['UPI', 'BANK_TRANSFER', 'CASH', 'CARD', 'OTHER']).default('BANK_TRANSFER'),
  reference: z.string().optional(),
  paidAt: z.string().optional(),
  note: z.string().optional(),
});

export async function listPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { customerId, invoiceId, method, page = '1', limit = '50' } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (customerId) {
      query.customerId = customerId;
    }
    if (invoiceId) {
      query.invoiceId = invoiceId;
    }
    if (method && method !== 'ALL') {
      query.method = method;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('customerId', 'businessName contactName email')
        .populate('invoiceId', 'invoiceNumber total outstandingBalance')
        .sort({ paidAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Payment.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: payments,
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

export async function recordManualPayment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createPaymentSchema.parse(req.body);

    const invoice = await Invoice.findOne({ _id: parsed.invoiceId, organizationId: org._id });
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    if (invoice.status === 'PAID') {
      res.status(400).json({ success: false, message: 'Invoice is already settled in full' });
      return;
    }
    if (invoice.status === 'VOID') {
      res
        .status(400)
        .json({ success: false, message: 'Cannot record payment against a voided invoice' });
      return;
    }

    const paymentAmountMinor = toMinorUnits(parsed.amount);

    if (paymentAmountMinor > invoice.outstandingBalance) {
      res.status(400).json({
        success: false,
        message: `Payment amount (${(paymentAmountMinor / 100).toFixed(2)}) exceeds outstanding invoice balance (${(invoice.outstandingBalance / 100).toFixed(2)})`,
      });
      return;
    }

    const paymentCount = await Payment.countDocuments({ organizationId: org._id });
    const paymentNumber = `PAY-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(4, '0')}`;

    // Atomically create payment and update invoice balance
    const payment = await Payment.create({
      organizationId: org._id,
      paymentNumber,
      invoiceId: invoice._id,
      customerId: invoice.customerId,
      amount: paymentAmountMinor,
      method: parsed.method,
      reference: parsed.reference || `MANUAL-${Date.now()}`,
      paidAt: parsed.paidAt ? new Date(parsed.paidAt) : new Date(),
      note: parsed.note,
      status: 'SUCCESS',
      allocations: [{ invoiceId: invoice._id, amount: paymentAmountMinor }],
      createdBy: 'STAFF_MANUAL',
    });

    const newPaidAmount = addMoney(invoice.paidAmount, paymentAmountMinor);
    const newOutstanding = subtractMoney(invoice.total, newPaidAmount);

    invoice.paidAmount = newPaidAmount;
    invoice.outstandingBalance = newOutstanding;
    invoice.status = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';
    if (newOutstanding === 0) {
      invoice.paidAt = new Date();
    }
    await invoice.save();

    res.status(201).json({
      success: true,
      data: {
        payment,
        invoice: {
          id: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          paidAmount: invoice.paidAmount,
          outstandingBalance: invoice.outstandingBalance,
          status: invoice.status,
        },
      },
      message: `Payment of ${(paymentAmountMinor / 100).toFixed(2)} recorded. Invoice balance: ${(newOutstanding / 100).toFixed(2)}`,
    });
  } catch (err) {
    next(err);
  }
}
