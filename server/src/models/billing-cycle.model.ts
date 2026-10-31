import mongoose, { Schema, Document, Types } from 'mongoose';

export type BillingCycleStatus = 'PENDING' | 'PROCESSED' | 'FAILED' | 'SKIPPED';

export interface IBillingCycle extends Document {
  _id: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  idempotencyKey: string;
  status: BillingCycleStatus;
  invoiceId?: Types.ObjectId;
  attemptCount: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BillingCycleSchema = new Schema<IBillingCycle>(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
      index: true,
    },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'FAILED', 'SKIPPED'],
      default: 'PENDING',
      index: true,
    },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    attemptCount: { type: Number, default: 0 },
    lastError: { type: String },
  },
  { timestamps: true },
);

BillingCycleSchema.index({ idempotencyKey: 1 }, { unique: true });
BillingCycleSchema.index({ subscriptionId: 1, periodStart: 1 });

export const BillingCycle = mongoose.model<IBillingCycle>('BillingCycle', BillingCycleSchema);
