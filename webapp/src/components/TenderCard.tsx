import { useState } from 'react'
import type { Tender } from '../types'
import type { SectorMeta } from '../types'
import { formatINR } from '../lib/data'

const SOURCE_BADGES: Record<string, string> = {
  'live-tender': 'bg-green-100 text-green-800',
  'archived-tender': 'bg-slate-200 text-slate-700',
  'policy-document': 'bg-purple-100 text-purple-800',
  'model-rfp': 'bg-blue-100 text-blue-800',
}

export default function TenderCard({ tender, meta }: { tender: Tender; meta: SectorMeta }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.accentSoft} ${meta.accentText} border`}>
              {tender.consultancyType}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                SOURCE_BADGES[tender.sourceType] ?? 'bg-slate-200 text-slate-700'
              }`}
            >
              {tender.sourceType.replace(/-/g, ' ')}
            </span>
            {tender.evaluationMethod && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {tender.evaluationMethod}
              </span>
            )}
          </div>
          <h3 className="mt-2 font-semibold text-slate-900">{tender.title}</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            {tender.issuingAuthority}
            {tender.datePublished ? ` · ${tender.datePublished}` : ''}
            {' · '}
            {formatINR(tender.estimatedValueINR, tender.estimatedValueLabel)}
          </p>
        </div>
        <span className="mt-1 shrink-0 text-slate-400">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-4 text-sm">
          <p className="text-slate-700">{tender.scopeSummary}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {tender.eligibility && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Eligibility
                </h4>
                <ul className="mt-1.5 space-y-1 text-slate-700">
                  {tender.eligibility.minAnnualTurnoverINR != null && (
                    <li>Min. annual turnover: {formatINR(tender.eligibility.minAnnualTurnoverINR)}</li>
                  )}
                  {tender.eligibility.similarProjectsRequired && (
                    <li>{tender.eligibility.similarProjectsRequired}</li>
                  )}
                  {tender.eligibility.keyPersonnel?.map((p) => (
                    <li key={p}>Key personnel: {p}</li>
                  ))}
                  {tender.eligibility.other?.map((o) => <li key={o}>{o}</li>)}
                </ul>
              </div>
            )}

            {tender.technicalCriteria && tender.technicalCriteria.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Technical scoring
                  {tender.minTechnicalScore != null && (
                    <span className="ml-1 normal-case text-slate-400">
                      (min. {tender.minTechnicalScore} to qualify)
                    </span>
                  )}
                </h4>
                <ul className="mt-1.5 space-y-1 text-slate-700">
                  {tender.technicalCriteria.map((c) => (
                    <li key={c.criterion} className="flex justify-between gap-3">
                      <span>{c.criterion}</span>
                      <span className="shrink-0 font-medium text-slate-900">
                        {c.maxMarks != null ? c.maxMarks : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {tender.tenderRef && <span>Ref: {tender.tenderRef}</span>}
            {tender.sourceDocument && <span>Source: {tender.sourceDocument}</span>}
            <a
              href={tender.url}
              target="_blank"
              rel="noreferrer"
              className={`font-medium underline-offset-2 hover:underline ${meta.accentText}`}
            >
              View source ↗
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
