import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TaxRule } from '../../models/tax-rule.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';

const createTaxRuleSchema = z.object({
  name: z.string().min(1, 'Tax rule name is required').trim(),
  rate: z.number().min(0, 'Rate must be positive').max(100, 'Rate cannot exceed 100%'),
  jurisdiction: z.string().min(1, 'Jurisdiction is required').trim(),
  inclusive: z.boolean().default(false),
  applicableProducts: z.array(z.string()).optional().default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  active: z.boolean().default(true),
});

export async function listTaxRules(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { active, jurisdiction } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (active !== undefined && active !== 'ALL') {
      query.active = active === 'true';
    }
    if (jurisdiction) {
      query.jurisdiction = jurisdiction;
    }

    const rules = await TaxRule.find(query)
      .populate('applicableProducts', 'name SKU')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: rules });
  } catch (err) {
    next(err);
  }
}

export async function createTaxRule(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createTaxRuleSchema.parse(req.body);

    const rule = await TaxRule.create({
      organizationId: org._id,
      name: parsed.name,
      rate: parsed.rate,
      jurisdiction: parsed.jurisdiction,
      inclusive: parsed.inclusive,
      applicableProducts: parsed.applicableProducts,
      startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
      endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
      active: parsed.active,
    });

    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    next(err);
  }
}

export async function updateTaxRule(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const updated = await TaxRule.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: req.body },
      { returnDocument: 'after' },
    ).lean();

    if (!updated) {
      res.status(404).json({ success: false, message: 'Tax rule not found' });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteTaxRule(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const updated = await TaxRule.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: { active: false } },
      { returnDocument: 'after' },
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Tax rule not found' });
      return;
    }

    res.json({ success: true, message: 'Tax rule deactivated successfully' });
  } catch (err) {
    next(err);
  }
}

