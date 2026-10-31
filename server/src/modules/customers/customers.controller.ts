import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Customer } from '../../models/customer.model';
import { Subscription } from '../../models/subscription.model';
import { Invoice } from '../../models/invoice.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';

const createCustomerSchema = z.object({
  customerNumber: z.string().optional(),
  businessName: z.string().min(1, 'Business name is required').trim(),
  contactName: z.string().min(1, 'Contact name is required').trim(),
  email: z.string().email('Valid email is required').trim().toLowerCase(),
  phone: z.string().optional(),
  billingAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().default('USA'),
    })
    .optional(),
  taxIdentifier: z.string().optional(),
  notes: z.string().optional(),
});

export async function listCustomers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { search, status, page = '1', limit = '50' } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search && typeof search === 'string') {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Customer.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: customers,
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

export async function getCustomerById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const customer = await Customer.findOne({
      _id: req.params.id,
      organizationId: org._id,
    }).lean();

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    // Include summary stats: active subscriptions, outstanding balance
    const [subscriptions, invoices] = await Promise.all([
      Subscription.find({ customerId: customer._id, status: 'ACTIVE' }).select(
        'subscriptionNumber quantity nextBillingAt',
      ),
      Invoice.find({
        customerId: customer._id,
        status: { $in: ['CONFIRMED', 'PARTIALLY_PAID', 'OVERDUE'] },
      }).select('invoiceNumber total outstandingBalance status dueDate'),
    ]);

    const totalOutstandingMinor = invoices.reduce(
      (sum, inv) => sum + (inv.outstandingBalance || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        ...customer,
        activeSubscriptionsCount: subscriptions.length,
        subscriptions,
        unpaidInvoicesCount: invoices.length,
        invoices,
        totalOutstandingMinor,
        totalOutstandingFormatted: (totalOutstandingMinor / 100).toFixed(2),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createCustomerSchema.parse(req.body);

    const existingEmail = await Customer.findOne({
      organizationId: org._id,
      email: parsed.email,
    });

    if (existingEmail) {
      res
        .status(409)
        .json({ success: false, message: `Customer with email ${parsed.email} already exists` });
      return;
    }

    // Auto-generate customer number if not provided: CUST-2026-XXXX
    let customerNum = parsed.customerNumber;
    if (!customerNum) {
      const count = await Customer.countDocuments({ organizationId: org._id });
      customerNum = `CUST-2026-${String(count + 1).padStart(4, '0')}`;
    }

    const customer = await Customer.create({
      organizationId: org._id,
      customerNumber: customerNum,
      businessName: parsed.businessName,
      contactName: parsed.contactName,
      email: parsed.email,
      phone: parsed.phone,
      billingAddress: parsed.billingAddress,
      taxIdentifier: parsed.taxIdentifier,
      notes: parsed.notes,
      status: 'ACTIVE',
    });

    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function updateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const updated = await Customer.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: req.body },
      { returnDocument: 'after' },
    ).lean();

    if (!updated) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}
