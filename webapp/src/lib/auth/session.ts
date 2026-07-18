import type { User } from './types'

const SESSION_KEY = 'tendersense.auth.session'

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false
  const u = value as Partial<User>
  return (
    typeof u.id === 'string' &&
    typeof u.email === 'string' &&
    typeof u.name === 'string' &&
    (u.role === 'admin' || u.role === 'employee') &&
    (u.provider === 'google' || u.provider === 'demo')
  )
}

export function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isUser(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveSession(user: User | null) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}
