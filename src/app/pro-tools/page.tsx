import type { Metadata } from 'next'
import { PRO_TOOLS, PRO_TOOL_CATEGORIES } from '@/lib/pro-tools'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Toolkit Pro — Executive Simulators & Financial Models',
  description:
    'Toolkit Pro: multi-year financial projections, fundraising dilution simulators, SaaS growth models, and a valuation suite — built by Ivy League operators. Model your business, not just a metric.',
  alternates: { canonical: '/pro-tools' },
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function ProToolsPage() {
  const sections = PRO_TOOL_CATEGORIES.map(cat => ({ label: cat, tools: PRO_TOOLS.filter(t => t.category === cat) }))

  return (
    <>
      <JsonLd data={orgSchema()} />

      <section className="bg-slate-900 dark:bg-black border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase text-[#F0B34A] mb-4">Toolkit Pro · Full Simulators</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-white max-w-3xl mb-6">
            Model the whole business — not just one metric.
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mb-8 leading-relaxed">
            The free calculators answer one question. Toolkit Pro simulates the entire trajectory — five-year
            projections, dilution across every round, 24-month growth curves, and full valuations — the models our
            operators build inside a live engagement.
          </p>
          <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson py-3 px-6">Unlock Toolkit Pro →</a>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">Browse by category</p>
        <div className="flex flex-wrap gap-2">
          {sections.map(s => (
            <a key={s.label} href={`/pro-tools/category/${slugify(s.label)}`} className="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#B01C24] hover:text-[#B01C24] transition-colors">{s.label} <span className="opacity-50">{s.tools.length}</span></a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-14">
        {sections.map(section => (
          <div key={section.label} id={slugify(section.label)}>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
              <a href={`/pro-tools/category/${slugify(section.label)}`} className="hover:text-[#B01C24] transition-colors">{section.label}</a>
              <a href={`/pro-tools/category/${slugify(section.label)}`} className="font-mono text-xs tracking-wider uppercase text-slate-400 hover:text-[#B01C24]">View all →</a>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              {section.tools.map(tool => (
                <a key={tool.id} href={`/pro-tools/${tool.id}`} className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group relative">
                  <span className="absolute top-4 right-4 bg-[#F0B34A] text-slate-900 font-mono text-[9px] tracking-widest uppercase px-2 py-1">Pro</span>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-slate-400 mb-2">{tool.category} · Simulator</p>
                  <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-2 group-hover:text-[#B01C24] transition-colors">{tool.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{tool.tagline}</p>
                  <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Open Simulator →</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CTABlock />
    </>
  )
}
