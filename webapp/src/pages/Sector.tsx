import { useMemo, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import type { SectorId } from '../types'
import { useSectorStore } from '../lib/DataContext'
import { sectorMeta, SECTORS } from '../lib/sectors'
import TenderCard from '../components/TenderCard'
import Evaluate from '../components/Evaluate'

type Tab = 'overview' | 'tenders' | 'evaluate'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tenders', label: 'Tender library' },
  { id: 'evaluate', label: 'Evaluate my bid' },
]

export default function Sector() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const { ready, error, byId } = useSectorStore()

  const tabParam = searchParams.get('tab')
  const tab: Tab =
    tabParam === 'tenders' || tabParam === 'evaluate' || tabParam === 'overview'
      ? tabParam
      : 'overview'

  const valid = SECTORS.some((s) => s.id === id)
  const meta = sectorMeta(id ?? 'water')
  const data = valid && byId ? byId[id as SectorId] : null

  const types = useMemo(
    () => (data ? Array.from(new Set(data.tenders.map((t) => t.consultancyType))).sort() : []),
    [data],
  )

  const setTab = (next: Tab) => {
    setSearchParams(next === 'overview' ? {} : { tab: next }, { replace: true })
  }

  if (!valid) return <Navigate to="/" replace />

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-sm text-slate-500 sm:px-6">
        {error ?? 'Loading sector research…'}
      </div>
    )
  }

  if (!data) return <Navigate to="/" replace />

  const fw = data.evaluationFramework
  const fwTotalWeight = fw.criteria.reduce((s, c) => s + c.typicalWeightPct, 0) || 100
  const normWeight = (pct: number) => (pct / fwTotalWeight) * 100
  const tenders =
    typeFilter === 'all' ? data.tenders : data.tenders.filter((t) => t.consultancyType === typeFilter)

  return (
    <div>
      <section className={`${meta.accent} text-white`}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            Sector workspace · {data.tenders.length} tenders researched
          </p>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-4xl" aria-hidden>
              {meta.icon}
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{meta.label}</h1>
              <p className="mt-1 max-w-2xl text-sm text-white/85">{meta.tagline}</p>
            </div>
          </div>
          <div className="mt-6 flex w-fit gap-1 rounded-lg bg-black/15 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-md px-4 py-2 text-sm transition-colors ${
                  tab === t.id
                    ? 'bg-white font-medium text-slate-900 shadow'
                    : 'text-white/85 hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-display font-bold text-slate-900">How consultants are evaluated</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {fw.summary}
                </p>
              </section>

              {fw.criteria.length > 0 && (
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="font-display font-bold text-slate-900">Typical criteria & weights</h2>
                  <ul className="mt-4 space-y-3">
                    {fw.criteria.map((c) => (
                      <li key={c.id}>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-800">{c.label}</span>
                          <span className="text-slate-500">
                            {normWeight(c.typicalWeightPct).toFixed(0)}%
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${meta.accent}`}
                            style={{ width: `${normWeight(c.typicalWeightPct)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{c.description}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  At a glance
                </h2>
                <dl className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Tenders analyzed</dt>
                    <dd className="font-semibold text-slate-900">{data.tenders.length}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Dominant method</dt>
                    <dd className="text-right font-semibold text-slate-900">{fw.dominantMethod}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Typical min. tech score</dt>
                    <dd className="font-semibold text-slate-900">{fw.typicalMinTechnicalScore}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Data refreshed</dt>
                    <dd className="font-semibold text-slate-900">{data.generatedAt}</dd>
                  </div>
                </dl>
              </section>

              {(fw.keyPolicies?.length ?? 0) > 0 && (
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Governing policies
                  </h2>
                  <ul className="mt-3 space-y-3 text-sm">
                    {fw.keyPolicies!.map((p) => (
                      <li key={p.name}>
                        {p.url ? (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`font-medium ${meta.accentText} underline-offset-2 hover:underline`}
                          >
                            {p.name} ↗
                          </a>
                        ) : (
                          <span className="font-medium text-slate-800">{p.name}</span>
                        )}
                        {p.relevance && (
                          <p className="mt-0.5 text-xs text-slate-500">{p.relevance}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {data.sources.length > 0 && (
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Research sources
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {data.sources.map((s) => (
                      <li key={`${s.name}-${s.url}`}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-700 underline-offset-2 hover:underline"
                        >
                          {s.name}
                        </a>
                        <span className="ml-1.5 text-xs text-slate-400">{s.type}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        )}

        {tab === 'tenders' && (
          <div>
            {data.tenders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No tenders in this sector dataset yet.
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTypeFilter('all')}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      typeFilter === 'all'
                        ? `${meta.accent} font-medium text-white`
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    All ({data.tenders.length})
                  </button>
                  {types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeFilter(t)}
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        typeFilter === t
                          ? `${meta.accent} font-medium text-white`
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {tenders.map((t) => (
                    <TenderCard key={t.id} tender={t} meta={meta} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'evaluate' && <Evaluate data={data} meta={meta} />}
      </div>
    </div>
  )
}
