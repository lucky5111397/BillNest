import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Product } from '../../models/product.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import { toMinorUnits } from '../../utils/money';

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').trim(),
  SKU: z.string().min(1, 'SKU is required').trim(),
  type: z.enum(['SOFTWARE', 'SERVICE', 'PHYSICAL', 'CONSUMABLE']).default('SOFTWARE'),
  description: z.string().optional(),
  salesPrice: z.number().min(0, 'Sales price must be non-negative'),
  costPrice: z.number().min(0).optional().default(0),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        brand: z.string().optional(),
        SKU: z.string().min(1),
        priceAdjustment: z.number().default(0),
        active: z.boolean().default(true),
      }),
    )
    .optional()
    .default([]),
});

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { search, type, status, page = '1', limit = '50' } = req.query;

    const query: Record<string, unknown> = { organizationId: org._id };

    if (status && status !== 'ALL') {
      query.status = status;
    } else {
      query.status = { $ne: 'ARCHIVED' };
    }

    if (type && type !== 'ALL') {
      query.type = type;
    }

    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { SKU: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
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

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const product = await Product.findOne({
      _id: req.params.id,
      organizationId: org._id,
    }).lean();

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createProductSchema.parse(req.body);

    const existing = await Product.findOne({
      organizationId: org._id,
      SKU: parsed.SKU,
    });

    if (existing) {
      res
        .status(409)
        .json({ success: false, message: `Product with SKU ${parsed.SKU} already exists` });
      return;
    }

    const product = await Product.create({
      organizationId: org._id,
      name: parsed.name,
      SKU: parsed.SKU,
      type: parsed.type,
      description: parsed.description,
      salesPrice: toMinorUnits(parsed.salesPrice),
      costPrice: toMinorUnits(parsed.costPrice),
      currency: parsed.currency.toUpperCase(),
      notes: parsed.notes,
      variants: parsed.variants.map((v) => ({
        ...v,
        priceAdjustment: toMinorUnits(v.priceAdjustment),
      })),
      status: 'ACTIVE',
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const updateData: Record<string, unknown> = { ...req.body };

    if (typeof updateData.salesPrice === 'number') {
      updateData.salesPrice = toMinorUnits(updateData.salesPrice);
    }
    if (typeof updateData.costPrice === 'number') {
      updateData.costPrice = toMinorUnits(updateData.costPrice);
    }
    if (Array.isArray(updateData.variants)) {
      updateData.variants = (updateData.variants as Array<{ priceAdjustment?: number }>).map(
        (v) => ({
          ...v,
          priceAdjustment:
            typeof v.priceAdjustment === 'number' ? toMinorUnits(v.priceAdjustment) : 0,
        }),
      );
    }

    const updated = await Product.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: updateData },
      { returnDocument: 'after' },
    ).lean();

    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: { status: 'ARCHIVED' } },
      { returnDocument: 'after' },
    );

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, message: 'Product archived successfully' });
  } catch (err) {
    next(err);
  }
}
