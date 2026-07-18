import { Link } from 'react-router-dom'
import { SECTORS } from '../lib/sectors'
import { useSectorStore } from '../lib/DataContext'

export default function Home() {
  const { ready, error, byId, totalTenders } = useSectorStore()

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-950 text-white blueprint-grid">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-cyan-line/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-stamp/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="rise-in font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/90">
            Built for consultants bidding on Government of India infrastructure tenders
          </p>
          <h1 className="rise-in rise-in-delay-1 font-display mt-4 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            TenderSense
          </h1>
          <p className="rise-in rise-in-delay-2 mt-4 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Know how your consultancy bid will be scored — before you submit it. Seven sector
            workspaces, {ready ? `${totalTenders} analyzed tenders` : 'research loading'}, and an
            evaluator that mirrors QCBS / QBS / LCS practice.
          </p>
          <div className="rise-in rise-in-delay-3 mt-8 flex flex-wrap gap-3">
            <a
              href="#sectors"
              className="rounded-md bg-stamp px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Browse all 7 sectors
            </a>
            <Link
              to="/sector/road?tab=evaluate"
              className="rounded-md border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Open bid evaluator
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-200/70 sm:grid-cols-4">
          {[
            { label: 'Sectors covered', value: '7' },
            { label: 'Tenders analyzed', value: ready ? String(totalTenders) : '…' },
            { label: 'Dominant method', value: 'QCBS' },
            { label: 'Use case', value: 'Consultants' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/90 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {stat.label}
              </p>
              <p className="font-display mt-1 text-2xl font-bold text-ink-950">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sectors" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-950">Seven sector workspaces</h2>
            <p className="mt-1 text-sm text-slate-600">
              Each workspace has an overview, tender library, and bid evaluator fed by sector research.
            </p>
          </div>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
        </div>

        {!ready && !error && (
          <p className="mt-8 font-mono text-sm text-slate-500">Loading sector research datasets…</p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SECTORS.map((s, i) => {
            const data = byId?.[s.id]
            const tenderCount = data?.tenders.length ?? 0
            const method = data?.evaluationFramework.dominantMethod ?? '—'
            return (
              <Link
                key={s.id}
                to={`/sector/${s.id}`}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                style={{ animationDelay: `${0.04 * i}s` }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: s.accentHex }}
                />
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl" aria-hidden>
                    {s.icon}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold text-white"
                    style={{ backgroundColor: s.accentHex }}
                  >
                    {ready ? `${tenderCount} tenders` : '…'}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-lg font-bold text-ink-950">{s.label}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{s.tagline}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {ready ? method : 'loading'}
                </p>
                <p className={`mt-3 text-sm font-semibold ${s.accentText}`}>
                  Open workspace →
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3 sm:p-8">
          {[
            {
              title: 'Browse analyzed tenders',
              body: 'Real consultancy RFPs from CPPP, NHAI, IREPS, AAI, Smart City SPVs, Sagarmala and more — eligibility, QCBS ratios and marks tables extracted.',
            },
            {
              title: 'Enter your tender & firm',
              body: 'Describe the tender you are bidding on and rate your firm against the criteria authorities actually score in that sector.',
            },
            {
              title: 'Read the indicative score',
              body: 'See projected technical score, pass/fail against the minimum threshold, and QCBS combined score with an optional financial component.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-base font-bold text-ink-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
