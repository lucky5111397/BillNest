import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrganization extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  currency: string;
  timezone: string;
  settings: {
    allowOverdueGraceDays?: number;
    autoDunningEnabled?: boolean;
    defaultPaymentTerms?: string;
  };
  taxConfig: {
    defaultTaxJurisdiction?: string;
    inclusiveTax?: boolean;
  };
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    currency: { type: String, required: true, default: 'USD', uppercase: true, trim: true },
    timezone: { type: String, required: true, default: 'UTC' },
    settings: {
      allowOverdueGraceDays: { type: Number, default: 7 },
      autoDunningEnabled: { type: Boolean, default: true },
      defaultPaymentTerms: { type: String, default: 'NET_30' },
    },
    taxConfig: {
      defaultTaxJurisdiction: { type: String, default: 'US-FED' },
      inclusiveTax: { type: Boolean, default: false },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

OrganizationSchema.index({ status: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
