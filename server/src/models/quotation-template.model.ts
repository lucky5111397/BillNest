import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuotationTemplateItem {
  productId: Types.ObjectId;
  variantId?: string;
  quantity: number;
  description?: string;
}

export interface IQuotationTemplate extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  planId?: Types.ObjectId;
  preconfiguredLines: IQuotationTemplateItem[];
  validityDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationTemplateSchema = new Schema<IQuotationTemplate>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan' },
    preconfiguredLines: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: String },
        quantity: { type: Number, required: true, default: 1, min: 1 },
        description: { type: String },
      },
    ],
    validityDays: { type: Number, default: 30, min: 1 },
  },
  { timestamps: true },
);

QuotationTemplateSchema.index({ organizationId: 1, name: 1 });

export const QuotationTemplate = mongoose.model<IQuotationTemplate>(
  'QuotationTemplate',
  QuotationTemplateSchema,
);
