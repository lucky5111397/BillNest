import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  customerNumber: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  taxIdentifier?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' },
  },
  { _id: false },
);

const CustomerSchema = new Schema<ICustomer>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    customerNumber: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    billingAddress: { type: AddressSchema, default: () => ({}) },
    shippingAddress: { type: AddressSchema, default: () => ({}) },
    taxIdentifier: { type: String, trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
      index: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

CustomerSchema.index({ organizationId: 1, customerNumber: 1 }, { unique: true });
CustomerSchema.index({ organizationId: 1, email: 1 });
CustomerSchema.index({ organizationId: 1, status: 1 });
CustomerSchema.index({ organizationId: 1, createdAt: -1 });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
