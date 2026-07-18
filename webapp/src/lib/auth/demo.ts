import type { User } from './types'

interface SeedUser {
  username: string
  password: string
  email: string
  name: string
  role: 'admin' | 'employee'
}

/**
 * Temporary accounts while VITE_GOOGLE_CLIENT_ID is unset.
 * Remove once Google OAuth is live in production.
 */
const SEED_USERS: SeedUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@tendersense.local',
    name: 'Library Admin',
    role: 'admin',
  },
  {
    username: 'employee',
    password: 'employee123',
    email: 'employee@tendersense.local',
    name: 'Research Employee',
    role: 'employee',
  },
]

export function authenticateDemo(username: string, password: string): User | null {
  const match = SEED_USERS.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password,
  )
  if (!match) return null

  return {
    id: `demo:${match.username}`,
    email: match.email,
    name: match.name,
    role: match.role,
    provider: 'demo',
  }
}
