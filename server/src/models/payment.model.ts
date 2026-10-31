import mongoose, { Schema, Document, Types } from 'mongoose';

export type PaymentMethod = 'UPI' | 'BANK_TRANSFER' | 'CASH' | 'CARD' | 'OTHER';
export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface IPaymentAllocation {
  invoiceId: Types.ObjectId;
  amount: number; // Minor units
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  paymentNumber: string;
  invoiceId: Types.ObjectId;
  customerId: Types.ObjectId;
  amount: number; // Minor units
  method: PaymentMethod;
  reference?: string;
  paidAt: Date;
  note?: string;
  status: PaymentStatus;
  allocations: IPaymentAllocation[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentAllocationSchema = new Schema<IPaymentAllocation>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const PaymentSchema = new Schema<IPayment>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    paymentNumber: { type: String, required: true, trim: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    method: {
      type: String,
      enum: ['UPI', 'BANK_TRANSFER', 'CASH', 'CARD', 'OTHER'],
      default: 'BANK_TRANSFER',
      required: true,
    },
    reference: { type: String, trim: true },
    paidAt: { type: Date, required: true, default: Date.now },
    note: { type: String, trim: true },
    status: {
      type: String,
      enum: ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'SUCCESS',
      index: true,
    },
    allocations: [PaymentAllocationSchema],
    createdBy: { type: String, default: 'SYSTEM' },
  },
  { timestamps: true },
);

PaymentSchema.index({ organizationId: 1, paymentNumber: 1 }, { unique: true });
PaymentSchema.index({ organizationId: 1, paidAt: -1 });
PaymentSchema.index({ customerId: 1, paidAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
