import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Plan } from '../../models/plan.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import { toMinorUnits } from '../../utils/money';

const createPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required').trim(),
  productId: z.string().min(1, 'Product ID is required'),
  pricing: z.number().min(0, 'Pricing must be non-negative'),
  currency: z.string().default('USD'),
  billingInterval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('MONTHLY'),
  intervalCount: z.number().min(1).default(1),
  minimumQuantity: z.number().min(1).default(1),
  availabilityStart: z.string().optional(),
  availabilityEnd: z.string().optional(),
  autoClose: z.boolean().default(false),
  allowEarlyClose: z.boolean().default(true),
  allowPause: z.boolean().default(true),
  allowRenewal: z.boolean().default(true),
  active: z.boolean().default(true),
});

export async function listPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { productId, interval, active } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (active !== undefined && active !== 'ALL') {
      query.active = active === 'true';
    }
    if (productId) {
      query.productId = productId;
    }
    if (interval) {
      query.billingInterval = interval;
    }

    const plans = await Plan.find(query)
      .populate('productId', 'name SKU salesPrice type variants')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
}

export async function getPlanById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const plan = await Plan.findOne({ _id: req.params.id, organizationId: org._id })
      .populate('productId', 'name SKU salesPrice type variants')
      .lean();

    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
}

export async function createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createPlanSchema.parse(req.body);

    const plan = await Plan.create({
      organizationId: org._id,
      name: parsed.name,
      productId: parsed.productId,
      pricing: toMinorUnits(parsed.pricing),
      currency: parsed.currency.toUpperCase(),
      billingInterval: parsed.billingInterval,
      intervalCount: parsed.intervalCount,
      minimumQuantity: parsed.minimumQuantity,
      availabilityStart: parsed.availabilityStart ? new Date(parsed.availabilityStart) : undefined,
      availabilityEnd: parsed.availabilityEnd ? new Date(parsed.availabilityEnd) : undefined,
      autoClose: parsed.autoClose,
      allowEarlyClose: parsed.allowEarlyClose,
      allowPause: parsed.allowPause,
      allowRenewal: parsed.allowRenewal,
      active: parsed.active,
    });

    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
}

export async function updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const updateData: Record<string, unknown> = { ...req.body };
    if (typeof updateData.pricing === 'number') {
      updateData.pricing = toMinorUnits(updateData.pricing);
    }

    const updated = await Plan.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: updateData },
      { returnDocument: 'after' },
    ).lean();

    if (!updated) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const updated = await Plan.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: { active: false } },
      { returnDocument: 'after' },
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    res.json({ success: true, message: 'Plan deactivated successfully' });
  } catch (err) {
    next(err);
  }
}

