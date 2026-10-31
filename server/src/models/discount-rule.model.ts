import mongoose, { Schema, Document, Types } from 'mongoose';

export type DiscountType = 'FIXED_AMOUNT' | 'PERCENTAGE';
export type DiscountStatus = 'ACTIVE' | 'EXPIRED' | 'DISABLED';

export interface IDiscountRule extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  code: string;
  type: DiscountType;
  value: number; // Minor units for FIXED_AMOUNT, percentage (1-100) for PERCENTAGE
  minimumPurchase: number; // In minor units
  minimumQuantity: number;
  applicableProducts: Types.ObjectId[];
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number | null;
  usedCount: number;
  applicableScope: 'ORDER' | 'LINE_ITEM';
  status: DiscountStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DiscountRuleSchema = new Schema<IDiscountRule>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ['FIXED_AMOUNT', 'PERCENTAGE'], required: true },
    value: { type: Number, required: true, min: 0 },
    minimumPurchase: { type: Number, default: 0, min: 0 },
    minimumQuantity: { type: Number, default: 1, min: 1 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    startDate: { type: Date },
    endDate: { type: Date },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0, min: 0 },
    applicableScope: { type: String, enum: ['ORDER', 'LINE_ITEM'], default: 'ORDER' },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'DISABLED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  { timestamps: true },
);

DiscountRuleSchema.index({ organizationId: 1, code: 1 }, { unique: true });
DiscountRuleSchema.index({ organizationId: 1, status: 1 });

export const DiscountRule = mongoose.model<IDiscountRule>('DiscountRule', DiscountRuleSchema);
