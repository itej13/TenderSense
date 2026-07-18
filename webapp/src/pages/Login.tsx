import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useAuth } from '../lib/auth'

function postLoginPath(role: 'admin' | 'employee', from: string) {
  if (role === 'admin') return '/admin/review'
  return from === '/login' ? '/' : from
}

export default function Login() {
  const { user, loginWithDemo, loginWithGoogleCredential, googleEnabled, demoEnabled } =
    useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to={postLoginPath(user.role, from)} replace />
  }

  const finish = (role: 'admin' | 'employee') => {
    navigate(postLoginPath(role, from), { replace: true })
  }

  const onDemoSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = loginWithDemo(username, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    finish(result.user.role)
  }

  const onGoogleSuccess = (response: CredentialResponse) => {
    setError(null)
    if (!response.credential) {
      setError('Google did not return a credential. Try again.')
      return
    }
    const result = loginWithGoogleCredential(response.credential)
    if (!result.ok) {
      setError(result.error)
      return
    }
    finish(result.user.role)
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rise-in rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-line">
          Sign in
        </p>
        <h1 className="font-display mt-2 text-2xl font-bold text-slate-900">
          TenderSense access
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Admins review library submissions. Employees submit new tender document links for
          review.
        </p>

        {googleEnabled ? (
          <div className="mt-6 space-y-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => setError('Google sign-in failed. Try again.')}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="320"
              />
            </div>
            <p className="text-center text-xs text-slate-500">
              Your role is assigned from the admin email allowlist (
              <code className="font-mono">VITE_ADMIN_EMAILS</code>).
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900">
            Google OAuth is not configured yet. Add{' '}
            <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> to{' '}
            <code className="font-mono">webapp/.env.local</code>, then restart the dev server.
            Demo login stays available until then.
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {demoEnabled && (
          <>
            <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              Demo login
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={onDemoSubmit} className="space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-700">Username</span>
                <input
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-line/30 focus:ring-2"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-line/30 focus:ring-2"
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
              >
                Sign in with demo account
              </button>
            </form>

            <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Demo accounts
              </p>
              <ul className="mt-2 space-y-1">
                <li>
                  Admin — <code className="font-mono">admin</code> /{' '}
                  <code className="font-mono">admin123</code>
                </li>
                <li>
                  Employee — <code className="font-mono">employee</code> /{' '}
                  <code className="font-mono">employee123</code>
                </li>
              </ul>
            </div>
          </>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          <Link to="/" className="text-cyan-line hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
