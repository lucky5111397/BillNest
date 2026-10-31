import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  actorId?: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    actorId: { type: String, default: 'SYSTEM' },
    actorRole: { type: String, default: 'SYSTEM' },
    action: { type: String, required: true, trim: true },
    entityType: { type: String, required: true, trim: true },
    entityId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: () => ({}) },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AuditLogSchema.index({ organizationId: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
