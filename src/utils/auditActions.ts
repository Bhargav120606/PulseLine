/**
 * Centralized audit action constants.
 * Using `as const` ensures TypeScript infers literal types,
 * enabling compile-time validation of action strings.
 */
export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  SEND_MESSAGE: 'SEND_MESSAGE',
} as const;

/** Union type of all valid audit action values */
export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];
