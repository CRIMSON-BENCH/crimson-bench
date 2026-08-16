import type { Metadata } from 'next'
import { ROLES } from '@/lib/roles'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'The Bench — All Eight C-Suite Roles | The Crimson Bench',
  description:
    'Browse all eight C-suite fractional executive roles at The Crimson Bench: CEO, CFO, CTO, COO, CRO, CMO, CHRO, and CISO. Every executive is Ivy League-educated and deployed within 48 hours.',
  alternates: { canonical: '/bench' },
}

export default function BenchPage() {
  return (
    <>
      <JsonLd data={orgSchema()} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">The Crimson Bench Roster</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Eight C-Suite Capacities. One Vetted Bench.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-6 leading-relaxed">
            Every executive on The Crimson Bench holds an Ivy League credential and has been deployed into
            operating companies. No junior analysts. No AI ghostwriters. No offshore talent.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              ['25,000+', 'Ivy League Executives'],
              ['48 hrs', 'Deployment SLA'],
              ['14 days', 'No-Cause Cancellation'],
            ].map(([n, l]) => (
              <div key={l}>
                <span className="font-mono font-bold text-[#B01C24]">{n}</span>
                <span className="font-mono text-xs text-slate-500 uppercase tracking-wider ml-2">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {ROLES.map(role => (
              <a
                key={role.key}
                href={`/bench/${role.key}`}
                className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
              >
                <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">{role.title}</p>
                <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-3 group-hover:text-[#B01C24] transition-colors">
                  {role.fullTitle}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-4 leading-relaxed text-sm">{role.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {role.searchTerms.slice(0, 3).map(term => (
                    <span key={term} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] tracking-wide uppercase px-2 py-1">
                      {term}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Deploy a Fractional {role.title} →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
