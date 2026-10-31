import mongoose, { Schema, Document, Types } from 'mongoose';
import { BillingInterval } from '../utils/dates';

export type SubscriptionStatus =
  'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface ISubscriptionItem {
  productId: Types.ObjectId;
  variantId?: string;
  name: string;
  description?: string;
  unitPrice: number; // Minor units snapshot
  quantity: number;
  subtotal: number; // Minor units
}

export interface ISubscription extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  subscriptionNumber: string;
  customerId: Types.ObjectId;
  quotationId?: Types.ObjectId;
  planId: Types.ObjectId;
  items: ISubscriptionItem[];
  startDate: Date;
  expiryDate?: Date;
  nextBillingAt: Date;
  billingInterval: BillingInterval;
  intervalCount: number;
  paymentTerms: string;
  quantity: number;
  unitPrice: number; // Minor units
  currency: string;
  priceSnapshots: {
    basePrice: number;
    variantAdjustment: number;
    calculatedUnitPrice: number;
    taxRate?: number;
    discountValue?: number;
  };
  taxConfig?: {
    taxRuleId?: Types.ObjectId;
    rate: number;
    inclusive: boolean;
  };
  discountConfig?: {
    discountRuleId?: Types.ObjectId;
    code?: string;
    type?: string;
    value?: number;
  };
  status: SubscriptionStatus;
  lifecyclePolicies: {
    autoClose: boolean;
    allowEarlyClose: boolean;
    allowPause: boolean;
    allowRenewal: boolean;
  };
  pausedAt?: Date;
  closedAt?: Date;
  closeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionItemSchema = new Schema<ISubscriptionItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const SubscriptionSchema = new Schema<ISubscription>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    subscriptionNumber: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true, index: true },
    items: [SubscriptionItemSchema],
    startDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date },
    nextBillingAt: { type: Date, required: true, index: true },
    billingInterval: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
      required: true,
      default: 'MONTHLY',
    },
    intervalCount: { type: Number, required: true, default: 1, min: 1 },
    paymentTerms: { type: String, default: 'NET_30' },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    priceSnapshots: {
      basePrice: { type: Number, required: true },
      variantAdjustment: { type: Number, default: 0 },
      calculatedUnitPrice: { type: Number, required: true },
      taxRate: { type: Number, default: 0 },
      discountValue: { type: Number, default: 0 },
    },
    taxConfig: {
      taxRuleId: { type: Schema.Types.ObjectId, ref: 'TaxRule' },
      rate: { type: Number, default: 0 },
      inclusive: { type: Boolean, default: false },
    },
    discountConfig: {
      discountRuleId: { type: Schema.Types.ObjectId, ref: 'DiscountRule' },
      code: { type: String },
      type: { type: String },
      value: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['DRAFT', 'QUOTATION', 'CONFIRMED', 'ACTIVE', 'PAUSED', 'CLOSED'],
      default: 'ACTIVE',
      index: true,
    },
    lifecyclePolicies: {
      autoClose: { type: Boolean, default: false },
      allowEarlyClose: { type: Boolean, default: true },
      allowPause: { type: Boolean, default: true },
      allowRenewal: { type: Boolean, default: true },
    },
    pausedAt: { type: Date },
    closedAt: { type: Date },
    closeReason: { type: String, trim: true },
  },
  { timestamps: true },
);

SubscriptionSchema.index({ organizationId: 1, subscriptionNumber: 1 }, { unique: true });
SubscriptionSchema.index({ organizationId: 1, status: 1 });
SubscriptionSchema.index({ organizationId: 1, nextBillingAt: 1, status: 1 });
SubscriptionSchema.index({ customerId: 1, status: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
