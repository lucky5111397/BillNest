import mongoose, { Schema, Document, Types } from 'mongoose';
import { BillingInterval } from '../utils/dates';

export interface IPlan extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  productId: Types.ObjectId;
  pricing: number; // Base plan rate in minor units
  currency: string;
  billingInterval: BillingInterval;
  intervalCount: number;
  minimumQuantity: number;
  availabilityStart?: Date;
  availabilityEnd?: Date;
  autoClose: boolean;
  allowEarlyClose: boolean;
  allowPause: boolean;
  allowRenewal: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    pricing: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    billingInterval: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
      required: true,
      default: 'MONTHLY',
    },
    intervalCount: { type: Number, required: true, default: 1, min: 1 },
    minimumQuantity: { type: Number, required: true, default: 1, min: 1 },
    availabilityStart: { type: Date },
    availabilityEnd: { type: Date },
    autoClose: { type: Boolean, default: false },
    allowEarlyClose: { type: Boolean, default: true },
    allowPause: { type: Boolean, default: true },
    allowRenewal: { type: Boolean, default: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

PlanSchema.index({ organizationId: 1, active: 1 });
PlanSchema.index({ organizationId: 1, productId: 1 });
PlanSchema.index({ organizationId: 1, name: 1 });

export const Plan = mongoose.model<IPlan>('Plan', PlanSchema);
