import mongoose, { Schema, Document } from 'mongoose';
import { AUDIT_ACTIONS, type AuditAction } from '@/utils/auditActions';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId | string;
  action: AuditAction;
  resource: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    // Reference to the user who performed the action
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // Action performed — validated against AUDIT_ACTIONS enum at the DB level
    action: { type: String, enum: Object.values(AUDIT_ACTIONS), required: true, index: true },

    // Resource affected (e.g., 'appointment', 'user', 'doctor')
    resource: { type: String, required: true, index: true },

    // Additional context about the action (flexible object)
    details: { type: Schema.Types.Mixed, default: {} },

    // Client IP address
    ipAddress: { type: String, default: '' },

    // Client user-agent string
    userAgent: { type: String, default: '' },

    // Timestamp of the action
    timestamp: {type: Date,default: Date.now,index: { expires: "90d" }}
  },
  {
    // Disable updatedAt/createdAt since we have our own timestamp
    timestamps: false,
  }
);

// Compound index for efficient querying by user + time range
AuditLogSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
