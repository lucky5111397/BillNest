import mongoose, { Schema, Document, Types } from 'mongoose';

export type TransactionDirection = 'INBOUND' | 'OUTBOUND';
export type BankMatchingStatus = 'UNMATCHED' | 'MATCHED' | 'IGNORED';

export interface IBankTransaction extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  source: string; // e.g. 'Wells Fargo', 'SVB', 'Barclays'
  externalReference?: string;
  transactionDate: Date;
  description: string;
  amount: number; // Minor units
  currency: string;
  direction: TransactionDirection;
  rawImportHash: string; // MD5/SHA256 hash of original CSV line to prevent duplicate imports
  matchingStatus: BankMatchingStatus;
  matchedInvoiceId?: Types.ObjectId;
  matchedPaymentId?: Types.ObjectId;
  confidence?: number; // 0 - 100
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BankTransactionSchema = new Schema<IBankTransaction>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    source: { type: String, required: true, trim: true },
    externalReference: { type: String, trim: true },
    transactionDate: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    direction: { type: String, enum: ['INBOUND', 'OUTBOUND'], default: 'INBOUND', required: true },
    rawImportHash: { type: String, required: true, index: true },
    matchingStatus: {
      type: String,
      enum: ['UNMATCHED', 'MATCHED', 'IGNORED'],
      default: 'UNMATCHED',
      index: true,
    },
    matchedInvoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    matchedPaymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    confidence: { type: Number, min: 0, max: 100 },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

BankTransactionSchema.index({ organizationId: 1, rawImportHash: 1 }, { unique: true });
BankTransactionSchema.index({ organizationId: 1, matchingStatus: 1 });
BankTransactionSchema.index({ organizationId: 1, transactionDate: -1 });

export const BankTransaction = mongoose.model<IBankTransaction>(
  'BankTransaction',
  BankTransactionSchema,
);
