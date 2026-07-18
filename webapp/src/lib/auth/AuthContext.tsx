import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { googleClientId, isDemoAuthEnabled, isGoogleAuthConfigured } from './config'
import { authenticateDemo } from './demo'
import { userFromGoogleCredential } from './google'
import { loadSession, saveSession } from './session'
import type { User, UserRole } from './types'

interface AuthContextValue {
  user: User | null
  ready: boolean
  /** True when VITE_GOOGLE_CLIENT_ID is set. */
  googleEnabled: boolean
  /** Temporary password login until Google is configured. */
  demoEnabled: boolean
  loginWithGoogleCredential: (
    credential: string,
  ) => { ok: true; user: User } | { ok: false; error: string }
  loginWithDemo: (
    username: string,
    password: string,
  ) => { ok: true; user: User } | { ok: false; error: string }
  logout: () => void
  isAdmin: boolean
  isEmployee: boolean
  hasRole: (...roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function AuthStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUser(loadSession())
    setReady(true)
  }, [])

  const loginWithGoogleCredential = (credential: string) => {
    const next = userFromGoogleCredential(credential)
    if (!next) {
      return { ok: false as const, error: 'Could not read Google account details.' }
    }
    saveSession(next)
    setUser(next)
    return { ok: true as const, user: next }
  }

  const loginWithDemo = (username: string, password: string) => {
    if (!isDemoAuthEnabled) {
      return { ok: false as const, error: 'Demo login is disabled. Use Google sign-in.' }
    }
    const next = authenticateDemo(username, password)
    if (!next) return { ok: false as const, error: 'Invalid username or password.' }
    saveSession(next)
    setUser(next)
    return { ok: true as const, user: next }
  }

  const logout = () => {
    saveSession(null)
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    ready,
    googleEnabled: isGoogleAuthConfigured,
    demoEnabled: isDemoAuthEnabled,
    loginWithGoogleCredential,
    loginWithDemo,
    logout,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    hasRole: (...roles) => !!user && roles.includes(user.role),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (isGoogleAuthConfigured) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthStateProvider>{children}</AuthStateProvider>
      </GoogleOAuthProvider>
    )
  }

  return <AuthStateProvider>{children}</AuthStateProvider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
