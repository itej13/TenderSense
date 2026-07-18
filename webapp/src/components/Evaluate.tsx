import { useMemo, useState } from 'react'
import type { SectorData, SectorMeta } from '../types'
import type { Assessments } from '../lib/scoring'
import { evaluate, levelPct, parseMethodWeights } from '../lib/scoring'

const METHODS = ['QCBS 80:20', 'QCBS 70:30', 'QCBS 90:10', 'QBS', 'LCS']

/** Map a free-text dominant method (e.g. "QCBS 70:30 (domestic) / 80:20 (funded)") onto a dropdown option. */
function normalizeMethod(method: string): string {
  const { tech, fin } = parseMethodWeights(method)
  const exact = METHODS.find((m) => {
    const w = parseMethodWeights(m)
    return w.tech === tech && w.fin === fin
  })
  return exact ?? 'QCBS 80:20'
}

interface TenderInput {
  title: string
  authority: string
  method: string
  minTechnicalScore: string
  yourFee: string
  lowestFee: string
}

export default function Evaluate({ data, meta }: { data: SectorData; meta: SectorMeta }) {
  const fw = data.evaluationFramework
  const [tender, setTender] = useState<TenderInput>({
    title: '',
    authority: '',
    method: normalizeMethod(fw.dominantMethod || 'QCBS 80:20'),
    minTechnicalScore: String(fw.typicalMinTechnicalScore ?? 75),
    yourFee: '',
    lowestFee: '',
  })
  const [assessments, setAssessments] = useState<Assessments>({})

  const result = useMemo(
    () =>
      evaluate(fw, assessments, {
        minTechnicalScore: Number(tender.minTechnicalScore) || 0,
        method: tender.method,
        yourFeeINR: tender.yourFee ? Number(tender.yourFee) : null,
        lowestFeeINR: tender.lowestFee ? Number(tender.lowestFee) : null,
      }),
    [fw, assessments, tender],
  )

  if (fw.criteria.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        The evaluation framework for this sector is still being researched. Check back once the
        sector research agents have completed their analysis.
      </div>
    )
  }

  const weights = parseMethodWeights(tender.method)
  const totalWeight = fw.criteria.reduce((s, c) => s + c.typicalWeightPct, 0) || 100
  const normWeight = (pct: number) => (pct / totalWeight) * 100
  const set = (patch: Partial<TenderInput>) => setTender((t) => ({ ...t, ...patch }))

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* Step 1: tender details */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">1. Your tender</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Details of the tender you are bidding on, from its RFP.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-slate-600">Tender title</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. PMC for 24x7 Water Supply Scheme, Pune"
                value={tender.title}
                onChange={(e) => set({ title: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">Issuing authority</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. Maharashtra Jeevan Pradhikaran"
                value={tender.authority}
                onChange={(e) => set({ authority: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">Evaluation method</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                value={tender.method}
                onChange={(e) => set({ method: e.target.value })}
              >
                {METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">Minimum technical score to qualify</span>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={tender.minTechnicalScore}
                onChange={(e) => set({ minTechnicalScore: e.target.value })}
              />
            </label>
          </div>
        </section>

        {/* Step 2: criteria */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">2. Your firm, criterion by criterion</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            These are the criteria {data.sectorLabel.toLowerCase()} authorities typically score,
            weighted as observed across {data.tenders.length} analyzed tenders.
          </p>

          <div className="mt-4 space-y-5">
            {fw.criteria.map((c) => {
              const a = assessments[c.id] ?? { levelIndex: null, fieldValues: {} }
              return (
                <div key={c.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-slate-900">{c.label}</h4>
                      <p className="mt-0.5 text-sm text-slate-500">{c.description}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${meta.accent}`}
                    >
                      {normWeight(c.typicalWeightPct).toFixed(0)}%
                    </span>
                  </div>

                  {c.inputFields.length > 0 && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {c.inputFields.map((f) => (
                        <label key={f.key} className="block text-sm">
                          <span className="text-slate-600">{f.label}</span>
                          {f.type === 'select' ? (
                            <select
                              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                              value={a.fieldValues[f.key] ?? ''}
                              onChange={(e) =>
                                setAssessments((prev) => ({
                                  ...prev,
                                  [c.id]: {
                                    ...a,
                                    fieldValues: { ...a.fieldValues, [f.key]: e.target.value },
                                  },
                                }))
                              }
                            >
                              <option value="">—</option>
                              {(f.options ?? []).map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={f.type === 'number' ? 'number' : 'text'}
                              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                              value={a.fieldValues[f.key] ?? ''}
                              onChange={(e) =>
                                setAssessments((prev) => ({
                                  ...prev,
                                  [c.id]: {
                                    ...a,
                                    fieldValues: { ...a.fieldValues, [f.key]: e.target.value },
                                  },
                                }))
                              }
                            />
                          )}
                          {f.scoring && (
                            <span className="mt-1 block text-xs text-slate-400">{f.scoring}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Where does your firm stand?
                    </span>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {c.scoringGuidance.map((g, i) => {
                        const selected = a.levelIndex === i
                        return (
                          <button
                            key={g.level}
                            type="button"
                            onClick={() =>
                              setAssessments((prev) => ({
                                ...prev,
                                [c.id]: { ...a, levelIndex: i },
                              }))
                            }
                            className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                              selected
                                ? `${meta.accentSoft} ${meta.accentText} border-2 font-medium`
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className="block font-medium">
                              {g.level}
                              <span className="ml-1 text-xs font-normal text-slate-400">
                                ≈ {(levelPct(g, i, c.scoringGuidance.length) * 100).toFixed(0)}% of{' '}
                                {normWeight(c.typicalWeightPct).toFixed(0)} marks
                              </span>
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">{g.meaning}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Step 3: financial */}
        {weights.fin > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">3. Financial proposal (optional)</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Under {tender.method}, financial score = (lowest fee ÷ your fee) × 100, weighted{' '}
              {weights.fin}%.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-slate-600">Your proposed fee (₹)</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={tender.yourFee}
                  onChange={(e) => set({ yourFee: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Expected lowest competing fee (₹)</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={tender.lowestFee}
                  onChange={(e) => set({ lowestFee: e.target.value })}
                />
              </label>
            </div>
          </section>
        )}
      </div>

      {/* Results panel */}
      <aside className="lg:sticky lg:top-20 h-fit space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">Indicative result</h3>
          {tender.title && (
            <p className="mt-0.5 truncate text-xs text-slate-500" title={tender.title}>
              {tender.title}
            </p>
          )}

          <div className="mt-4 text-center">
            <span className="text-5xl font-bold text-slate-900">
              {result.technicalScore != null ? result.technicalScore.toFixed(1) : '—'}
            </span>
            <span className="text-lg text-slate-400"> / 100</span>
            <p className="mt-1 text-xs text-slate-500">projected technical score</p>
          </div>

          {result.assessedWeight > 0 && result.assessedWeight < 99.9 && (
            <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {result.assessedWeight.toFixed(0)}% of criteria weight assessed — rate every criterion
              for a complete score.
            </p>
          )}

          {result.qualifies != null && (
            <p
              className={`mt-3 rounded-md px-3 py-2 text-center text-sm font-semibold ${
                result.qualifies ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {result.qualifies
                ? `Clears the ${tender.minTechnicalScore}-mark technical threshold`
                : `Below the ${tender.minTechnicalScore}-mark technical threshold`}
            </p>
          )}

          {result.combinedScore != null && (
            <div className="mt-4 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Financial score</span>
                <span className="font-medium text-slate-900">
                  {result.financialScore?.toFixed(1)}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-slate-600">
                <span>
                  Combined ({weights.tech}:{weights.fin})
                </span>
                <span className="font-semibold text-slate-900">
                  {result.combinedScore.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Criterion breakdown
          </h4>
          <ul className="mt-3 space-y-2">
            {result.criterionScores.map((cs) => (
              <li key={cs.criterion.id} className="text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-600">{cs.criterion.label}</span>
                  <span className="shrink-0 font-medium text-slate-900">
                    {cs.marks != null
                      ? `${cs.marks.toFixed(1)} / ${cs.weightPct.toFixed(0)}`
                      : `— / ${cs.weightPct.toFixed(0)}`}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${meta.accent}`}
                    style={{ width: `${(cs.attainment ?? 0) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
