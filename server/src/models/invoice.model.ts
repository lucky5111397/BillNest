import mongoose, { Schema, Document, Types } from 'mongoose';

export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'VOID';

export interface IInvoiceItemSnapshot {
  productId?: Types.ObjectId;
  variantId?: string;
  name: string;
  description?: string;
  unitPrice: number; // Minor units
  quantity: number;
  subtotal: number; // Minor units
  tax: number; // Minor units
  discount: number; // Minor units
  total: number; // Minor units
}

export interface IInvoice extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  invoiceNumber: string;
  customerId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  quotationId?: Types.ObjectId;
  billingPeriodStart?: Date;
  billingPeriodEnd?: Date;
  issueDate: Date;
  dueDate: Date;
  itemSnapshots: IInvoiceItemSnapshot[];
  subtotal: number; // Minor units
  taxTotal: number; // Minor units
  discountTotal: number; // Minor units
  total: number; // Minor units
  paidAmount: number; // Minor units
  outstandingBalance: number; // Minor units
  currency: string;
  idempotencyKey?: string;
  status: InvoiceStatus;
  notes?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSnapshotSchema = new Schema<IInvoiceItemSnapshot>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    variantId: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    invoiceNumber: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', index: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    billingPeriodStart: { type: Date },
    billingPeriodEnd: { type: Date },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true, index: true },
    itemSnapshots: [InvoiceItemSnapshotSchema],
    subtotal: { type: Number, required: true, min: 0 },
    taxTotal: { type: Number, default: 0, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    outstandingBalance: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    idempotencyKey: { type: String, sparse: true, index: true },
    status: {
      type: String,
      enum: ['DRAFT', 'CONFIRMED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'VOID'],
      default: 'CONFIRMED',
      index: true,
    },
    notes: { type: String, trim: true },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

InvoiceSchema.index({ organizationId: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ organizationId: 1, status: 1 });
InvoiceSchema.index({ organizationId: 1, dueDate: 1, status: 1 });
InvoiceSchema.index({ customerId: 1, status: 1 });

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
