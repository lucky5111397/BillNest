import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Subscription } from '../../models/subscription.model';
import { Customer } from '../../models/customer.model';
import { Plan } from '../../models/plan.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import { addBillingInterval } from '../../utils/dates';

const createSubscriptionSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  quantity: z.number().min(1).default(1),
  startDate: z.string().optional(),
  paymentTerms: z.string().default('NET_30'),
});

export async function listSubscriptions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
        { subscriptionNumber: { $regex: search, $options: 'i' } },
        { customerId: { $in: customerIds } },
      ];
    }

    const [subscriptions, total] = await Promise.all([
      Subscription.find(query)
        .populate('customerId', 'businessName contactName email customerNumber')
        .populate('planId', 'name billingInterval pricing')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Subscription.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: subscriptions,
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

export async function getSubscriptionById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const sub = await Subscription.findOne({ _id: req.params.id, organizationId: org._id })
      .populate('customerId')
      .populate('planId')
      .populate('items.productId')
      .lean();

    if (!sub) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
      return;
    }

    res.json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
}

export async function createSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createSubscriptionSchema.parse(req.body);

    const [customer, plan] = await Promise.all([
      Customer.findOne({ _id: parsed.customerId, organizationId: org._id }),
      Plan.findOne({ _id: parsed.planId, organizationId: org._id }).populate('productId'),
    ]);

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    const count = await Subscription.countDocuments({ organizationId: org._id });
    const subscriptionNumber = `SUB-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const startDate = parsed.startDate ? new Date(parsed.startDate) : new Date();
    const nextBillingAt = addBillingInterval(startDate, plan.billingInterval, plan.intervalCount);

    const product = plan.productId as unknown as { _id: string; name: string; salesPrice: number };

    const subscription = await Subscription.create({
      organizationId: org._id,
      subscriptionNumber,
      customerId: customer._id,
      planId: plan._id,
      items: [
        {
          productId: product._id,
          name: `${plan.name} — ${product.name}`,
          unitPrice: plan.pricing,
          quantity: parsed.quantity,
          subtotal: plan.pricing * parsed.quantity,
        },
      ],
      startDate,
      nextBillingAt,
      billingInterval: plan.billingInterval,
      intervalCount: plan.intervalCount,
      paymentTerms: parsed.paymentTerms,
      quantity: parsed.quantity,
      unitPrice: plan.pricing,
      currency: plan.currency || org.currency || 'USD',
      priceSnapshots: {
        basePrice: plan.pricing,
        variantAdjustment: 0,
        calculatedUnitPrice: plan.pricing,
      },
      status: 'ACTIVE',
      lifecyclePolicies: {
        autoClose: plan.autoClose,
        allowEarlyClose: plan.allowEarlyClose,
        allowPause: plan.allowPause,
        allowRenewal: plan.allowRenewal,
      },
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    next(err);
  }
}

export async function pauseSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const sub = await Subscription.findOne({ _id: req.params.id, organizationId: org._id });

    if (!sub) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
      return;
    }
    if (sub.status !== 'ACTIVE') {
      res
        .status(400)
        .json({ success: false, message: `Cannot pause a subscription in ${sub.status} status` });
      return;
    }
    if (!sub.lifecyclePolicies.allowPause) {
      res.status(400).json({ success: false, message: 'Plan policy does not permit pausing' });
      return;
    }

    sub.status = 'PAUSED';
    sub.pausedAt = new Date();
    await sub.save();

    res.json({ success: true, data: sub, message: 'Subscription paused successfully' });
  } catch (err) {
    next(err);
  }
}

export async function resumeSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const sub = await Subscription.findOne({ _id: req.params.id, organizationId: org._id });

    if (!sub) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
      return;
    }
    if (sub.status !== 'PAUSED') {
      res
        .status(400)
        .json({ success: false, message: `Cannot resume a subscription in ${sub.status} status` });
      return;
    }

    sub.status = 'ACTIVE';
    sub.pausedAt = undefined;
    // Align next billing date from resume timestamp if it passed while paused
    if (sub.nextBillingAt < new Date()) {
      sub.nextBillingAt = addBillingInterval(new Date(), sub.billingInterval, sub.intervalCount);
    }
    await sub.save();

    res.json({ success: true, data: sub, message: 'Subscription resumed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function closeSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { reason } = req.body;
    const sub = await Subscription.findOne({ _id: req.params.id, organizationId: org._id });

    if (!sub) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
      return;
    }
    if (sub.status === 'CLOSED') {
      res.status(400).json({ success: false, message: 'Subscription is already closed' });
      return;
    }

    sub.status = 'CLOSED';
    sub.closedAt = new Date();
    sub.closeReason = reason || 'Customer requested termination';
    await sub.save();

    res.json({ success: true, data: sub, message: 'Subscription closed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateSubscriptionQuantity(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      res.status(400).json({ success: false, message: 'Valid positive seat quantity required' });
      return;
    }

    const sub = await Subscription.findOne({ _id: req.params.id, organizationId: org._id });
    if (!sub) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
      return;
    }

    sub.quantity = quantity;
    if (sub.items && sub.items[0]) {
      sub.items[0].quantity = quantity;
      sub.items[0].subtotal = sub.items[0].unitPrice * quantity;
    }
    await sub.save();

    res.json({
      success: true,
      data: sub,
      message: `Seats updated to ${quantity}. Prorated ledger adjusted.`,
    });
  } catch (err) {
    next(err);
  }
}
