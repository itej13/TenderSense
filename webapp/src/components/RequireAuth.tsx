import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, type UserRole } from '../lib/auth'
import type { ReactNode } from 'react'

export default function RequireAuth({
  children,
  roles,
}: {
  children: ReactNode
  roles?: UserRole[]
}) {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-sm text-slate-500 sm:px-6">
        Checking session…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
