import type { Metadata } from 'next'
import { ROLES } from '@/lib/roles'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'How to Hire a Fractional Executive — Complete Guides | The Crimson Bench',
  description:
    'Complete step-by-step guides for hiring fractional executives: CEO, CFO, CTO, COO, CRO, CMO, CHRO, and CISO. Written by The Crimson Bench — 24,000+ mandates, est. 2002.',
  alternates: { canonical: '/guides/how-to-hire' },
}

export default function HiringGuideIndexPage() {
  return (
    <>
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">Executive Hiring Guides · 2026</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            How to Hire a Fractional Executive
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Eight complete guides from The Crimson Bench — one for each C-suite role. What to look for, what to pay, how to structure the engagement, and how to deploy in 48 hours.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {ROLES.map(role => (
              <a
                key={role.key}
                href={`/guides/how-to-hire/${role.key}`}
                className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
              >
                <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">{role.title} Hiring Guide</p>
                <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-3 group-hover:text-[#B01C24] transition-colors">
                  How to Hire a Fractional {role.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{role.tagline}</p>
                <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Read Guide →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
