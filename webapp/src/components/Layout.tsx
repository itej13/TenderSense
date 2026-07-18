import { Link, NavLink, Outlet } from 'react-router-dom'
import { SECTORS } from '../lib/sectors'
import { useAuth } from '../lib/auth'
import { useSectorStore } from '../lib/DataContext'
import { useSubmissions } from '../lib/SubmissionsContext'

export default function Layout() {
  const { totalTenders, ready } = useSectorStore()
  const { user, logout, isAdmin } = useAuth()
  const { pendingCount } = useSubmissions()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/95 text-white backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-stamp text-sm font-bold tracking-tight">
                TS
              </span>
              <span>
                <span className="font-display block text-base font-bold tracking-tight">
                  TenderSense
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  Consultancy bid intelligence
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
                {ready ? `${totalTenders} tenders · 7 sectors` : 'loading research…'}
              </span>
              <Link
                to="/sector/water?tab=evaluate"
                className="hidden rounded-md bg-stamp px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 sm:inline"
              >
                Evaluate a bid
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/review"
                  className="rounded-md border border-white/20 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                >
                  Review
                  {pendingCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-ink-950">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-2">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt=""
                      className="hidden h-7 w-7 rounded-full border border-white/20 md:block"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <span className="hidden max-w-[11rem] truncate font-mono text-[10px] uppercase tracking-wider text-slate-400 md:inline">
                    {user.name} · {user.role}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-md px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-md border border-white/20 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
          <nav
            aria-label="Sectors"
            className="-mx-4 flex gap-1 overflow-x-auto border-t border-white/10 px-4 py-2 sm:-mx-6 sm:flex-wrap sm:overflow-visible sm:px-6"
          >
            {SECTORS.map((s) => (
              <NavLink
                key={s.id}
                to={`/sector/${s.id}`}
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs transition-colors sm:text-sm ${
                    isActive
                      ? 'bg-white/15 font-semibold text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="mr-1">{s.icon}</span>
                <span className="sm:hidden">{s.shortLabel}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Research from CPPP, NHAI, IREPS, AAI, Sagarmala, Smart Cities SPVs and MoF consultancy
            manuals. Scores are indicative — verify against the actual RFP.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider">7 sectors · live research sync</p>
        </div>
      </footer>
    </div>
  )
}
