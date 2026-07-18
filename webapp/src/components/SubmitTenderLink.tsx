import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { SectorId } from '../types'
import { useAuth } from '../lib/auth'
import { useSubmissions } from '../lib/SubmissionsContext'

export default function SubmitTenderLink({ sector }: { sector: SectorId }) {
  const { user, isEmployee } = useAuth()
  const { submitLink, submissions } = useSubmissions()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const myPending = user
    ? submissions.filter(
        (s) => s.submittedById === user.id && s.sector === sector && s.status === 'pending',
      )
    : []

  if (!user) {
    return (
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-display font-bold text-slate-900">Suggest a tender for the library</h2>
        <p className="mt-1 text-sm text-slate-600">
          Employees can submit document links for admin review before they enter the research
          library.
        </p>
        <Link
          to="/login"
          state={{ from: `/sector/${sector}?tab=tenders` }}
          className="mt-3 inline-flex rounded-lg bg-ink-900 px-3 py-2 text-sm font-semibold text-white hover:bg-ink-800"
        >
          Sign in to submit
        </Link>
      </div>
    )
  }

  if (!isEmployee) {
    return null
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setDone(false)
    let parsed: URL
    try {
      parsed = new URL(url.trim())
    } catch {
      setError('Enter a valid http(s) URL to the tender documents.')
      return
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      setError('URL must start with http:// or https://')
      return
    }

    submitLink({
      url: parsed.toString(),
      title,
      sector,
      notes,
      submittedById: user.id,
      submittedByName: user.name,
    })
    setUrl('')
    setTitle('')
    setNotes('')
    setDone(true)
  }

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-display font-bold text-slate-900">Submit tender document link</h2>
      <p className="mt-1 text-sm text-slate-600">
        Sends a link to the admin review queue. Nothing is added to the library until an admin
        approves it.
      </p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-slate-700">Document / tender URL</span>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://eprocure.gov.in/…"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-cyan-line/30 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-700">Title (optional)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short tender title"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-cyan-line/30 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-700">Notes for admin (optional)</span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why this should be included"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-cyan-line/30 focus:ring-2"
          />
        </label>
        {error && (
          <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {done && (
          <p className="sm:col-span-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Submitted for admin review.
          </p>
        )}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-stamp px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Submit for review
          </button>
        </div>
      </form>

      {myPending.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
            Your pending in this sector ({myPending.length})
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {myPending.slice(0, 5).map((s) => (
              <li key={s.id} className="truncate">
                · {s.title || s.url}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
