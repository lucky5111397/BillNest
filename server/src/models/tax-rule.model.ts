import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITaxRule extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  rate: number; // e.g. 18 for 18%
  jurisdiction: string;
  inclusive: boolean;
  applicableProducts: Types.ObjectId[];
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaxRuleSchema = new Schema<ITaxRule>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    rate: { type: Number, required: true, min: 0, max: 100 },
    jurisdiction: { type: String, required: true, trim: true },
    inclusive: { type: Boolean, default: false },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

TaxRuleSchema.index({ organizationId: 1, active: 1 });
TaxRuleSchema.index({ organizationId: 1, jurisdiction: 1 });

export const TaxRule = mongoose.model<ITaxRule>('TaxRule', TaxRuleSchema);
