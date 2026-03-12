import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId | string;
  action: string;
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

    // Action performed (e.g., 'LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'SEND_MESSAGE')
    action: { type: String, required: true, index: true },

    // Resource affected (e.g., 'appointment', 'user', 'doctor')
    resource: { type: String, required: true, index: true },

    // Additional context about the action (flexible object)
    details: { type: Schema.Types.Mixed, default: {} },

    // Client IP address
    ipAddress: { type: String, default: '' },

    // Client user-agent string
    userAgent: { type: String, default: '' },

    // Timestamp of the action
    timestamp: { type: Date, default: Date.now, index: true },
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
