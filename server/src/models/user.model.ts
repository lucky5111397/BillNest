import mongoose, { Schema, Document, Types } from 'mongoose';

export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';

export interface IUser extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  customerId?: Types.ObjectId;
  refreshTokenHash?: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  status: UserStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'STAFF', 'CUSTOMER'],
      default: 'CUSTOMER',
      required: true,
      index: true,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    refreshTokenHash: { type: String },
    resetPasswordTokenHash: { type: String },
    resetPasswordExpires: { type: Date },
    status: {
      type: String,
      enum: ['ACTIVE', 'INVITED', 'SUSPENDED'],
      default: 'ACTIVE',
      index: true,
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

UserSchema.index({ organizationId: 1, email: 1 }, { unique: true });
UserSchema.index({ organizationId: 1, role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
