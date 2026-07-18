import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useSubmissions } from '../lib/SubmissionsContext'
import { SECTORS } from '../lib/sectors'
import type { SubmissionStatus } from '../lib/submissions'

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-50 text-red-800 border-red-200',
}

export default function AdminReview() {
  const { user } = useAuth()
  const { submissions, review } = useSubmissions()
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('pending')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [flash, setFlash] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return submissions
    return submissions.filter((s) => s.status === filter)
  }, [filter, submissions])

  const onReview = (id: string, status: 'approved' | 'rejected') => {
    if (!user) return
    review({
      id,
      status,
      adminNotes: notes[id] ?? '',
      reviewedByName: user.name,
    })
    setFlash(status === 'approved' ? 'Submission approved for library inclusion.' : 'Submission rejected.')
    window.setTimeout(() => setFlash(null), 2800)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-line">
        Admin · review queue
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold text-slate-900">
        Tender link submissions
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Employees submit document links from sector tender libraries. Approve if the tender
        should be researched and added; reject if it should not.
      </p>

      {flash && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {flash}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm capitalize ${
              filter === f
                ? 'bg-ink-900 font-medium text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {f}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({submissions.filter((s) => s.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No {filter === 'all' ? '' : filter} submissions yet.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {filtered.map((s) => {
            const sector = SECTORS.find((x) => x.id === s.sector)
            return (
              <li
                key={s.id}
                className="rise-in rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[s.status]}`}
                      >
                        {s.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {sector?.icon} {sector?.label ?? s.sector}
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-lg font-bold text-slate-900">
                      {s.title || 'Untitled tender link'}
                    </h2>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 break-all text-sm text-cyan-line hover:underline"
                    >
                      {s.url}
                    </a>
                    {s.notes && (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-800">Notes:</span> {s.notes}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-[11px] text-slate-400">
                      Submitted by {s.submittedByName} · {new Date(s.submittedAt).toLocaleString()}
                    </p>
                    {s.reviewedAt && (
                      <p className="mt-1 font-mono text-[11px] text-slate-400">
                        Reviewed by {s.reviewedByName} · {new Date(s.reviewedAt).toLocaleString()}
                        {s.adminNotes ? ` · ${s.adminNotes}` : ''}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/sector/${s.sector}?tab=tenders`}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Open sector library →
                  </Link>
                </div>

                {s.status === 'pending' && (
                  <form
                    className="mt-4 border-t border-slate-100 pt-4"
                    onSubmit={(e: FormEvent) => e.preventDefault()}
                  >
                    <label className="block">
                      <span className="text-xs font-medium text-slate-700">Admin notes</span>
                      <textarea
                        value={notes[s.id] ?? ''}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-cyan-line/30 focus:ring-2"
                        placeholder="Optional reason for approve/reject…"
                      />
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onReview(s.id, 'approved')}
                        className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                      >
                        Approve for library
                      </button>
                      <button
                        type="button"
                        onClick={() => onReview(s.id, 'rejected')}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </div>
                  </form>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
