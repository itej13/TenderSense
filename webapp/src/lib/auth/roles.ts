import { adminEmails } from './config'
import type { UserRole } from './types'

/** Map a signed-in email to app role. Admins are env-allowlisted. */
export function resolveRole(email: string): UserRole {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return 'employee'
  return adminEmails.includes(normalized) ? 'admin' : 'employee'
}
