import connectToDatabase from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';

export interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Logs an audit action to MongoDB.
 * Errors are caught and logged to console — they never propagate
 * to the caller, so audit failures cannot crash the application.
 */
export async function logAction(entry: AuditLogEntry): Promise<void> {
  try {
    await connectToDatabase();

    await AuditLog.create({
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      details: entry.details ?? {},
      ipAddress: entry.ipAddress ?? '',
      userAgent: entry.userAgent ?? '',
      timestamp: new Date(),
    });
  } catch (error) {
    // Log to console but never throw — audit failures must not break the app
    console.error('[AuditLog] Failed to write audit log entry:', error);
  }
}

/**
 * Extracts client IP from common proxy headers, falling back to
 * the direct connection address.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    ''
  );
}

/**
 * Helper to build an AuditLogEntry from a Next.js Request and session payload.
 */
export function buildAuditEntry(
  req: Request,
  payload: { userId: string },
  action: string,
  resource: string,
  details: Record<string, unknown> = {}
): AuditLogEntry {
  return {
    userId: payload.userId,
    action,
    resource,
    details,
    ipAddress: getClientIp(req.headers),
    userAgent: req.headers.get('user-agent') ?? '',
  };
}
