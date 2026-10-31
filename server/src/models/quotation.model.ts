import mongoose, { Schema, Document, Types } from 'mongoose';

export type QuotationStatus = 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

export interface IQuotationItem {
  productId: Types.ObjectId;
  variantId?: string;
  planId?: Types.ObjectId;
  description: string;
  unitPrice: number; // Minor units
  quantity: number;
  subtotal: number; // Minor units
  discount: number; // Minor units
  tax: number; // Minor units
  total: number; // Minor units
}

export interface IQuotation extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  quoteNumber: string;
  customerId: Types.ObjectId;
  templateId?: Types.ObjectId;
  items: IQuotationItem[];
  subtotal: number; // Minor units
  discountTotal: number; // Minor units
  taxTotal: number; // Minor units
  total: number; // Minor units
  currency: string;
  issueDate: Date;
  expiryDate: Date;
  paymentTerms: string;
  status: QuotationStatus;
  convertedSubscriptionId?: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationItemSchema = new Schema<IQuotationItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: String },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan' },
    description: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const QuotationSchema = new Schema<IQuotation>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    quoteNumber: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'QuotationTemplate' },
    items: [QuotationItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    taxTotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    issueDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: true },
    paymentTerms: { type: String, default: 'NET_30' },
    status: {
      type: String,
      enum: ['DRAFT', 'QUOTATION', 'CONFIRMED', 'CANCELLED', 'EXPIRED'],
      default: 'DRAFT',
      index: true,
    },
    convertedSubscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

QuotationSchema.index({ organizationId: 1, quoteNumber: 1 }, { unique: true });
QuotationSchema.index({ customerId: 1, status: 1 });
QuotationSchema.index({ organizationId: 1, status: 1 });

export const Quotation = mongoose.model<IQuotation>('Quotation', QuotationSchema);
