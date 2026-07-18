/**
 * Auth environment config.
 *
 * Required for Google sign-in:
 *   VITE_GOOGLE_CLIENT_ID=....apps.googleusercontent.com
 *
 * Optional — comma-separated emails that receive the admin role:
 *   VITE_ADMIN_EMAILS=you@company.com,ops@company.com
 *
 * Everyone else who signs in with Google becomes an employee.
 */

function clean(value: string | undefined): string {
  return (value ?? '').trim()
}

export const googleClientId = clean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

export const isGoogleAuthConfigured = googleClientId.length > 0

export const adminEmails: string[] = clean(import.meta.env.VITE_ADMIN_EMAILS)
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

/** Temporary username/password login when Google Client ID is not set yet. */
export const isDemoAuthEnabled = !isGoogleAuthConfigured
