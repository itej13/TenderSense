import { resolveRole } from './roles'
import type { GoogleIdentity, User } from './types'

/** Decode the Google ID token payload (client-side profile only — not crypto verification). */
export function decodeGoogleCredential(credential: string): GoogleIdentity | null {
  try {
    const [, payload] = credential.split('.')
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const data = JSON.parse(json) as GoogleIdentity
    if (!data.sub || !data.email) return null
    return data
  } catch {
    return null
  }
}

export function userFromGoogleCredential(credential: string): User | null {
  const identity = decodeGoogleCredential(credential)
  if (!identity) return null
  if (identity.email_verified === false) return null

  const email = identity.email.trim().toLowerCase()
  return {
    id: `google:${identity.sub}`,
    email,
    name: identity.name?.trim() || email.split('@')[0] || 'Google user',
    picture: identity.picture,
    role: resolveRole(email),
    provider: 'google',
  }
}
