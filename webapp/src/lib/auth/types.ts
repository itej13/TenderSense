export type UserRole = 'admin' | 'employee'
export type AuthProviderId = 'google' | 'demo'

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  role: UserRole
  provider: AuthProviderId
}

export interface GoogleIdentity {
  sub: string
  email: string
  email_verified?: boolean
  name?: string
  picture?: string
  given_name?: string
  family_name?: string
}
