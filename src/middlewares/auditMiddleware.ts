import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';
import { logAction, getClientIp } from '@/utils/auditLogger';

/**
 * Higher-order function that wraps a Next.js route handler with automatic
 * audit logging. It authenticates the user, calls the original handler,
 * and logs the action on success.
 *
 * Usage:
 *   export const POST = withAuditLog('CREATE', 'appointment', async (req, payload) => {
 *     // your route logic here
 *     return NextResponse.json({ success: true });
 *   });
 */
export function withAuditLog(
  action: string,
  resource: string,
  handler: (
    req: Request,
    payload: { userId: string; email: string; name: string; role: string }
  ) => Promise<NextResponse>,
  detailsFn?: (req: Request) => Promise<Record<string, unknown>>
) {
  return async (req: Request): Promise<NextResponse> => {
    // Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await decrypt(token);

    if (!payload?.userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Execute the actual route handler
    const response = await handler(req, payload);

    // Only log if the handler returned a success response (2xx)
    if (response.status >= 200 && response.status < 300) {
      const details = detailsFn ? await detailsFn(req) : {};

      // Fire-and-forget: don't await so it doesn't slow down the response
      logAction({
        userId: payload.userId,
        action,
        resource,
        details,
        ipAddress: getClientIp(req.headers),
        userAgent: req.headers.get('user-agent') ?? '',
      });
    }

    return response;
  };
}
