import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DiscountRule } from '../../models/discount-rule.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import { toMinorUnits, calculatePercentage } from '../../utils/money';

const createDiscountRuleSchema = z.object({
  name: z.string().min(1, 'Discount rule name is required').trim(),
  code: z.string().min(1, 'Discount code is required').trim().toUpperCase(),
  type: z.enum(['FIXED_AMOUNT', 'PERCENTAGE']),
  value: z.number().min(0, 'Value must be non-negative'),
  minimumPurchase: z.number().min(0).default(0),
  minimumQuantity: z.number().min(1).default(1),
  applicableProducts: z.array(z.string()).optional().default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.number().min(1).nullable().optional(),
  applicableScope: z.enum(['ORDER', 'LINE_ITEM']).default('ORDER'),
  status: z.enum(['ACTIVE', 'EXPIRED', 'DISABLED']).default('ACTIVE'),
});

export async function listDiscountRules(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { status, type } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (type && type !== 'ALL') {
      query.type = type;
    }

    const rules = await DiscountRule.find(query)
      .populate('applicableProducts', 'name SKU')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: rules });
  } catch (err) {
    next(err);
  }
}

export async function createDiscountRule(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createDiscountRuleSchema.parse(req.body);

    const existing = await DiscountRule.findOne({
      organizationId: org._id,
      code: parsed.code,
    });

    if (existing) {
      res
        .status(409)
        .json({ success: false, message: `Discount code ${parsed.code} already exists` });
      return;
    }

    const valueInUnits = parsed.type === 'FIXED_AMOUNT' ? toMinorUnits(parsed.value) : parsed.value;

    const rule = await DiscountRule.create({
      organizationId: org._id,
      name: parsed.name,
      code: parsed.code,
      type: parsed.type,
      value: valueInUnits,
      minimumPurchase: toMinorUnits(parsed.minimumPurchase),
      minimumQuantity: parsed.minimumQuantity,
      applicableProducts: parsed.applicableProducts,
      startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
      endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
      usageLimit: parsed.usageLimit || null,
      usedCount: 0,
      applicableScope: parsed.applicableScope,
      status: parsed.status,
    });

    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    next(err);
  }
}

export async function updateDiscountRule(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const updateData: Record<string, unknown> = { ...req.body };

    if (typeof updateData.value === 'number' && updateData.type === 'FIXED_AMOUNT') {
      updateData.value = toMinorUnits(updateData.value);
    }
    if (typeof updateData.minimumPurchase === 'number') {
      updateData.minimumPurchase = toMinorUnits(updateData.minimumPurchase);
    }

    const updated = await DiscountRule.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: updateData },
      { returnDocument: 'after' },
    ).lean();

    if (!updated) {
      res.status(404).json({ success: false, message: 'Discount rule not found' });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * Validates a discount code against a purchase amount and product line items.
 */
export async function validateDiscountCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { code, purchaseAmount, quantity = 1 } = req.body;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ success: false, message: 'Discount code is required' });
      return;
    }

    const rule = await DiscountRule.findOne({
      organizationId: org._id,
      code: code.trim().toUpperCase(),
    });

    if (!rule) {
      res.status(404).json({ success: false, message: 'Invalid discount coupon code' });
      return;
    }

    if (rule.status !== 'ACTIVE') {
      res
        .status(400)
        .json({ success: false, message: `Discount coupon is ${rule.status.toLowerCase()}` });
      return;
    }

    const now = new Date();
    if (rule.startDate && rule.startDate > now) {
      res.status(400).json({ success: false, message: 'Discount coupon is not active yet' });
      return;
    }
    if (rule.endDate && rule.endDate < now) {
      res.status(400).json({ success: false, message: 'Discount coupon has expired' });
      return;
    }

    if (rule.usageLimit && rule.usedCount >= rule.usageLimit) {
      res
        .status(400)
        .json({ success: false, message: 'Discount coupon usage limit has been reached' });
      return;
    }

    const purchaseAmountMinor =
      typeof purchaseAmount === 'number' ? toMinorUnits(purchaseAmount) : 0;
    if (rule.minimumPurchase > 0 && purchaseAmountMinor < rule.minimumPurchase) {
      res.status(400).json({
        success: false,
        message: `Minimum purchase of ${(rule.minimumPurchase / 100).toFixed(2)} required for this discount`,
      });
      return;
    }

    if (rule.minimumQuantity > 1 && quantity < rule.minimumQuantity) {
      res.status(400).json({
        success: false,
        message: `Minimum quantity of ${rule.minimumQuantity} required for this discount`,
      });
      return;
    }

    let discountMinor = 0;
    if (rule.type === 'PERCENTAGE') {
      discountMinor = calculatePercentage(purchaseAmountMinor, rule.value);
    } else {
      discountMinor = Math.min(rule.value, purchaseAmountMinor);
    }

    res.json({
      success: true,
      data: {
        code: rule.code,
        name: rule.name,
        type: rule.type,
        value: rule.value,
        calculatedDiscountMinor: discountMinor,
        calculatedDiscount: discountMinor / 100,
      },
    });
  } catch (err) {
    next(err);
  }
}
