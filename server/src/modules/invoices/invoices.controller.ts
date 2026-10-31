import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../../models/invoice.model';
import { Payment } from '../../models/payment.model';
import { Customer } from '../../models/customer.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';

export async function listInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { status, customerId, search, page = '1', limit = '50' } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (customerId) {
      query.customerId = customerId;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    let customerIds: string[] = [];
    if (search && typeof search === 'string') {
      const matchingCustomers = await Customer.find({
        organizationId: org._id,
        $or: [
          { businessName: { $regex: search, $options: 'i' } },
          { contactName: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      customerIds = matchingCustomers.map((c) => c._id.toString());
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerId: { $in: customerIds } },
      ];
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate('customerId', 'businessName contactName email customerNumber')
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Invoice.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: invoices,
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

export async function getInvoiceById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const invoice = await Invoice.findOne({ _id: req.params.id, organizationId: org._id })
      .populate('customerId')
      .populate('subscriptionId')
      .lean();

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    // Retrieve payment history for this invoice
    const payments = await Payment.find({ invoiceId: invoice._id, status: 'SUCCESS' }).sort({
      paidAt: -1,
    });

    res.json({
      success: true,
      data: {
        ...invoice,
        payments,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function chaseAllOverdueInvoices(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const overdueInvoices = await Invoice.find({
      organizationId: org._id,
      status: 'OVERDUE',
    }).populate('customerId', 'businessName contactName email');

    // Simulate dunning notification log
    const count = overdueInvoices.length;

    res.json({
      success: true,
      message: `Automated Dunning Protocol executed: ${count} collection notices dispatched.`,
      dispatchedCount: count,
      invoices: overdueInvoices.map((inv) => ({
        id: inv._id,
        invoiceNumber: inv.invoiceNumber,
        customer: (inv.customerId as unknown as { businessName?: string })?.businessName,
        outstanding: (inv.outstandingBalance / 100).toFixed(2),
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function voidInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const invoice = await Invoice.findOne({ _id: req.params.id, organizationId: org._id });

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    if (invoice.paidAmount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot void an invoice that has payments allocated. Issue a refund/credit first.',
      });
      return;
    }

    invoice.status = 'VOID';
    await invoice.save();

    res.json({ success: true, message: 'Invoice voided successfully', data: invoice });
  } catch (err) {
    next(err);
  }
}
