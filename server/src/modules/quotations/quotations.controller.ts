import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Quotation } from '../../models/quotation.model';
import { Subscription } from '../../models/subscription.model';
import { Customer } from '../../models/customer.model';
import { Plan } from '../../models/plan.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import { toMinorUnits, addMoney, multiplyMoney } from '../../utils/money';
import { addBillingInterval } from '../../utils/dates';

const createQuotationSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        planId: z.string().optional(),
        description: z.string().min(1),
        unitPrice: z.number().min(0),
        quantity: z.number().min(1).default(1),
        discount: z.number().min(0).default(0),
        tax: z.number().min(0).default(0),
      }),
    )
    .min(1, 'At least one line item is required'),
  expiryDays: z.number().min(1).default(30),
  paymentTerms: z.string().default('NET_30'),
  notes: z.string().optional(),
});

export async function listQuotations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { customerId, status } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (customerId) {
      query.customerId = customerId;
    }
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const quotes = await Quotation.find(query)
      .populate('customerId', 'businessName contactName email customerNumber')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: quotes });
  } catch (err) {
    next(err);
  }
}

export async function getQuotationById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const quote = await Quotation.findOne({ _id: req.params.id, organizationId: org._id })
      .populate('customerId')
      .populate('items.productId')
      .populate('items.planId')
      .lean();

    if (!quote) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    res.json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
}

export async function createQuotation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createQuotationSchema.parse(req.body);

    const customer = await Customer.findOne({ _id: parsed.customerId, organizationId: org._id });
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    // Auto-generate quotation number
    const count = await Quotation.countDocuments({ organizationId: org._id });
    const quoteNumber = `QUOTE-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Compute line items with authoritative minor units math
    let subtotalMinor = 0;
    let discountTotalMinor = 0;
    let taxTotalMinor = 0;

    const processedItems = parsed.items.map((item) => {
      const unitPriceMinor = toMinorUnits(item.unitPrice);
      const lineSubtotal = multiplyMoney(unitPriceMinor, item.quantity);
      const lineDiscount = toMinorUnits(item.discount);
      const lineTax = toMinorUnits(item.tax);
      const lineTotal = addMoney(lineSubtotal - lineDiscount, lineTax);

      subtotalMinor = addMoney(subtotalMinor, lineSubtotal);
      discountTotalMinor = addMoney(discountTotalMinor, lineDiscount);
      taxTotalMinor = addMoney(taxTotalMinor, lineTax);

      return {
        productId: item.productId,
        variantId: item.variantId,
        planId: item.planId,
        description: item.description,
        unitPrice: unitPriceMinor,
        quantity: item.quantity,
        subtotal: lineSubtotal,
        discount: lineDiscount,
        tax: lineTax,
        total: lineTotal,
      };
    });

    const grandTotalMinor = addMoney(subtotalMinor - discountTotalMinor, taxTotalMinor);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parsed.expiryDays);

    const quotation = await Quotation.create({
      organizationId: org._id,
      quoteNumber,
      customerId: customer._id,
      items: processedItems,
      subtotal: subtotalMinor,
      discountTotal: discountTotalMinor,
      taxTotal: taxTotalMinor,
      total: grandTotalMinor,
      currency: org.currency || 'USD',
      issueDate: new Date(),
      expiryDate,
      paymentTerms: parsed.paymentTerms,
      status: 'QUOTATION',
      notes: parsed.notes,
    });

    res.status(201).json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
}

export async function confirmQuotation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const quote = await Quotation.findOne({ _id: id, organizationId: org._id });
    if (!quote) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    if (quote.status === 'CANCELLED' || quote.status === 'EXPIRED') {
      res.status(400).json({
        success: false,
        message: `Cannot confirm a ${quote.status.toLowerCase()} quotation`,
      });
      return;
    }

    quote.status = 'CONFIRMED';
    await quote.save();

    res.json({ success: true, data: quote, message: 'Quotation confirmed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function cancelQuotation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const quote = await Quotation.findOne({ _id: id, organizationId: org._id });
    if (!quote) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    quote.status = 'CANCELLED';
    await quote.save();

    res.json({ success: true, data: quote, message: 'Quotation cancelled' });
  } catch (err) {
    next(err);
  }
}

/**
 * Idempotently converts a confirmed quotation into an active subscription.
 */
export async function convertQuotationToSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const quote = await Quotation.findOne({ _id: id, organizationId: org._id });
    if (!quote) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    // Idempotency check: if already converted, return existing subscription
    if (quote.convertedSubscriptionId) {
      const existingSub = await Subscription.findById(quote.convertedSubscriptionId);
      if (existingSub) {
        res.json({
          success: true,
          data: existingSub,
          message: 'Quotation was already converted into subscription (idempotent)',
        });
        return;
      }
    }

    if (quote.status !== 'CONFIRMED' && quote.status !== 'QUOTATION') {
      res.status(400).json({
        success: false,
        message: `Cannot convert quotation in status ${quote.status}. It must be confirmed.`,
      });
      return;
    }

    // Determine target plan
    let plan = await Plan.findOne({ organizationId: org._id, active: true });
    if (quote.items[0]?.planId) {
      plan = (await Plan.findById(quote.items[0].planId)) || plan;
    }

    if (!plan) {
      res
        .status(400)
        .json({ success: false, message: 'No active plan available for subscription conversion' });
      return;
    }

    const subCount = await Subscription.countDocuments({ organizationId: org._id });
    const subscriptionNumber = `SUB-${new Date().getFullYear()}-${String(subCount + 1).padStart(4, '0')}`;

    const startDate = new Date();
    const nextBillingAt = addBillingInterval(startDate, plan.billingInterval, plan.intervalCount);

    const subscription = await Subscription.create({
      organizationId: org._id,
      subscriptionNumber,
      customerId: quote.customerId,
      quotationId: quote._id,
      planId: plan._id,
      items: quote.items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        name: i.description,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
      startDate,
      nextBillingAt,
      billingInterval: plan.billingInterval,
      intervalCount: plan.intervalCount,
      paymentTerms: quote.paymentTerms,
      quantity: quote.items[0]?.quantity || 1,
      unitPrice: quote.items[0]?.unitPrice || plan.pricing,
      currency: quote.currency,
      priceSnapshots: {
        basePrice: quote.items[0]?.unitPrice || plan.pricing,
        variantAdjustment: 0,
        calculatedUnitPrice: quote.items[0]?.unitPrice || plan.pricing,
      },
      status: 'ACTIVE',
      lifecyclePolicies: {
        autoClose: plan.autoClose,
        allowEarlyClose: plan.allowEarlyClose,
        allowPause: plan.allowPause,
        allowRenewal: plan.allowRenewal,
      },
    });

    // Mark quotation as confirmed and record converted subscription id
    quote.status = 'CONFIRMED';
    quote.convertedSubscriptionId = subscription._id;
    await quote.save();

    res.status(201).json({
      success: true,
      data: subscription,
      message: 'Quotation successfully converted to active subscription',
    });
  } catch (err) {
    next(err);
  }
}
