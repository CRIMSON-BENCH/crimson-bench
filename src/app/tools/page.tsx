import type { Metadata } from 'next'
import { TOOLS, TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tools'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Free Executive Tools — Calculators & Models Built by Ivy League Operators',
  description:
    'Free interactive tools from The Crimson Bench: unit economics, runway, break-even, SaaS valuation, pricing, and ROI calculators. Input your numbers, get an instant operator-grade read. No signup.',
  alternates: { canonical: '/tools' },
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function ToolsPage() {
  const sections = TOOL_CATEGORIES.map(cat => ({ label: cat, tools: getToolsByCategory(cat) }))

  return (
    <>
      <JsonLd data={orgSchema()} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{TOOLS.length} Free Tools · No Signup · Instant</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            The Operator&apos;s Toolkit
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            The calculators our Ivy League-educated operators reach for — free to use. Put in your numbers,
            get an instant read on the metric that matters. Then grab the full model when you need to go deeper.
          </p>
        </div>
      </section>

      {/* Pro upsell banner */}
      <section className="bg-slate-900 dark:bg-black px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#F0B34A] mb-1">Toolkit Pro</p>
            <p className="text-white/85">Need to model the whole business? Full simulators — 5-year projections, dilution, growth &amp; valuation.</p>
          </div>
          <a href="/pro-tools" className="btn-crimson py-2.5 px-5 whitespace-nowrap">See the Pro Simulators →</a>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">Browse by category</p>
        <div className="flex flex-wrap gap-2">
          {sections.map(s => (
            <a key={s.label} href={`/tools/category/${slugify(s.label)}`} className="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#B01C24] hover:text-[#B01C24] transition-colors">{s.label} <span className="opacity-50">{s.tools.length}</span></a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-14">
        {sections.map(section => (
          <div key={section.label} id={slugify(section.label)}>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
              <a href={`/tools/category/${slugify(section.label)}`} className="hover:text-[#B01C24] transition-colors">{section.label}</a>
              <a href={`/tools/category/${slugify(section.label)}`} className="font-mono text-xs tracking-wider uppercase text-slate-400 hover:text-[#B01C24]">View all →</a>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              {section.tools.map(tool => (
                <a
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                >
                  <p className="font-mono text-[9px] tracking-widest uppercase text-slate-400 mb-2">{tool.category} · Free Tool</p>
                  <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-2 group-hover:text-[#B01C24] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{tool.tagline}</p>
                  <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Open Tool →</p>
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
