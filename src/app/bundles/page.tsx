import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'Role Bundles — Curated Toolkits for Founders, CFOs & Operators',
  description: 'Hand-picked collections of Crimson Bench toolkits, simulators, and models for your role. Everything included with Toolkit Pro.',
  alternates: { canonical: '/bundles' },
}

type Item = { label: string; type: string; href: string }
type Bundle = { role: string; who: string; blurb: string; items: Item[] }

const BUNDLES: Bundle[] = [
  {
    role: 'The Founder Bundle',
    who: 'Founders raising and scaling',
    blurb: 'Everything to build the story, model the raise, and steer to the next round.',
    items: [
      { label: 'Seed Pitch Deck Toolkit', type: 'Toolkit', href: '/digital-products/seed-pitch-deck-template' },
      { label: 'Cap Table & Dilution Model', type: 'Toolkit', href: '/digital-products/cap-table-model' },
      { label: 'Startup Financial Model (3-Statement)', type: 'Toolkit', href: '/digital-products/startup-financial-model-3-statement' },
      { label: 'SaaS Company — Operating Model', type: 'Company Model', href: '/enterprise/saas-company-operating-model' },
      { label: 'All the fundraising & growth simulators', type: 'Simulators', href: '/pro-tools' },
    ],
  },
  {
    role: 'The CFO Bundle',
    who: 'Finance leaders running the numbers',
    blurb: 'The cash, budget, and unit-economics stack that keeps a company solvent and fundable.',
    items: [
      { label: '13-Week Cash Flow Toolkit', type: 'Toolkit', href: '/digital-products/13-week-cash-flow-model' },
      { label: 'Annual Operating Budget Model', type: 'Toolkit', href: '/digital-products/annual-operating-budget-model' },
      { label: 'Unit Economics Calculator', type: 'Toolkit', href: '/digital-products/unit-economics-calculator' },
      { label: 'Runway & Burn Tracker', type: 'Toolkit', href: '/digital-products/runway-burn-tracker' },
      { label: 'Any end-to-end company model', type: 'Company Model', href: '/enterprise' },
    ],
  },
  {
    role: 'The Operator Bundle',
    who: 'Operators running the machine',
    blurb: 'The systems to plan headcount, track what matters, and scale without the founder in every decision.',
    items: [
      { label: 'KPI Dashboard Toolkit', type: 'Toolkit', href: '/digital-products/kpi-dashboard-template' },
      { label: 'Org Design & Headcount Model', type: 'Toolkit', href: '/digital-products/org-design-headcount-model' },
      { label: 'SOP Library Starter Kit', type: 'Toolkit', href: '/digital-products/sop-library-starter-kit' },
      { label: 'The full simulator library', type: 'Simulators', href: '/pro-tools' },
      { label: 'Your industry’s company model', type: 'Company Model', href: '/enterprise' },
    ],
  },
]

export default function BundlesPage() {
  return (
    <>
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Bundles', href: '/bundles' }]} />
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">Curated by Role</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Start with the bundle built for your job.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Not sure where to begin? These are the hand-picked collections we&apos;d reach for in each seat. Buy the pieces individually — or get all of it, and everything else, with Toolkit Pro.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        {BUNDLES.map(b => (
          <div key={b.role} className="border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-1">{b.who}</p>
              <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">{b.role}</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{b.blurb}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800">
              {b.items.map(it => (
                <a key={it.label} href={it.href} className="bg-white dark:bg-slate-950 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-[#B01C24] transition-colors">{it.label}</span>
                  <span className="font-mono text-[9px] tracking-widest uppercase text-slate-400 whitespace-nowrap">{it.type}</span>
                </a>
              ))}
            </div>
            <div className="p-6 bg-[#B01C24]/5 dark:bg-[#B01C24]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm text-slate-700 dark:text-slate-300">Everything here is included in <strong>Toolkit Pro</strong> — $180/mo or $1,728/yr.</p>
              <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson py-2 px-4 text-sm whitespace-nowrap">Get Toolkit Pro →</a>
            </div>
          </div>
        ))}
      </section>

      <CTABlock heading="Want it built around your business?" />
    </>
  )
}
