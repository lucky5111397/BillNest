import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProductVariant {
  _id?: Types.ObjectId;
  name: string;
  brand?: string;
  SKU: string;
  priceAdjustment: number; // Additive minor units (e.g. 56000 cents for $560.00)
  attributes?: Record<string, string>;
  active: boolean;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  SKU: string;
  type: 'SOFTWARE' | 'SERVICE' | 'PHYSICAL' | 'CONSUMABLE';
  description?: string;
  salesPrice: number; // Minor units (e.g. 200000 cents for $2,000.00)
  costPrice: number; // Minor units (kept internal, never exposed to customer portal)
  currency: string;
  notes?: string;
  variants: IProductVariant[];
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    SKU: { type: String, required: true, trim: true },
    priceAdjustment: { type: Number, required: true, default: 0 },
    attributes: { type: Map, of: String, default: () => new Map() },
    active: { type: Boolean, default: true },
  },
  { timestamps: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    SKU: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['SOFTWARE', 'SERVICE', 'PHYSICAL', 'CONSUMABLE'],
      default: 'SOFTWARE',
    },
    description: { type: String, trim: true },
    salesPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    notes: { type: String, trim: true },
    variants: [ProductVariantSchema],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  { timestamps: true },
);

ProductSchema.index({ organizationId: 1, SKU: 1 }, { unique: true });
ProductSchema.index({ organizationId: 1, status: 1 });
ProductSchema.index({ organizationId: 1, name: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
