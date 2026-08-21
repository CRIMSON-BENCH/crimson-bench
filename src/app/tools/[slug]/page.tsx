import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TOOLS, getToolById, type OutFormat } from '@/lib/tools'
import { getDigitalProductById, formatDigitalPrice } from '@/lib/digital-products'
import ToolRunner from '@/components/ToolRunner'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolById(slug)
  if (!tool) return {}
  return {
    title: `${tool.name} — Free Online Calculator`,
    description: `${tool.tagline} ${tool.description} A free, no-signup ${tool.category.toLowerCase()} calculator from The Crimson Bench.`,
    alternates: { canonical: `/tools/${tool.id}` },
    keywords: [tool.name, `${tool.name} calculator`, tool.name.toLowerCase(), `free ${tool.category} calculator`],
  }
}

function fmt(value: number, format: OutFormat): string {
  if (!isFinite(value)) return '—'
  switch (format) {
    case 'money': return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value >= 1000 ? 0 : 2 })
    case 'percent': return `${(value * 100).toFixed(1)}%`
    case 'x': return `${value.toFixed(1)}x`
    case 'months': return `${value.toFixed(1)} mo`
    case 'years': return `${value.toFixed(1)} yr`
    default: return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }
}

function fmtInput(i: { default: number; prefix?: string; suffix?: string }): string {
  return `${i.prefix ?? ''}${i.default.toLocaleString('en-US')}${i.suffix ?? ''}`
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolById(slug)
  if (!tool) notFound()

  const product = tool.sells ? getDigitalProductById(tool.sells) : null

  // Worked example from the tool's own defaults (build-time, deterministic).
  const defaults = Object.fromEntries(tool.inputs.map(i => [i.key, i.default])) as Record<string, number>
  const outputs = tool.compute(defaults)
  const insight = tool.insight(defaults, outputs)

  const related = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6)
  const inputNames = tool.inputs.map(i => i.label)
  const outputNames = tool.outputs.map(o => o.label)

  const faqs = [
    { q: `What does the ${tool.name} calculate?`, a: `${tool.description} It takes ${tool.inputs.length} inputs — ${inputNames.join(', ')} — and returns ${outputNames.join(', ')}.` },
    { q: `How do I use the ${tool.name}?`, a: `Enter your figures in the fields above and the result updates instantly. No signup, no limits, and nothing leaves your browser — the math runs on your device.` },
    { q: `Is the ${tool.name} free?`, a: `Yes, completely free. For the full time-based simulation — projection tables, scenarios, Excel/PDF export, and AI analysis — see the matching Toolkit Pro simulator.` },
    { q: `Who built this tool?`, a: `The Crimson Bench's Ivy League-educated operators — the same people we deploy into C-suites. It uses the exact method they'd apply in an engagement.` },
    { q: `Is this financial advice?`, a: `No. The ${tool.name} is an educational tool for directional planning — not financial, investment, tax, or legal advice.` },
  ]

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: tool.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'The Crimson Bench' },
      }} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Tools', url: 'https://www.crimsonbench.com/tools' },
        { name: tool.name, url: `https://www.crimsonbench.com/tools/${tool.id}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Tools', href: '/tools' },
        { name: tool.name, href: `/tools/${tool.id}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">{tool.category} · Free Interactive Tool</p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4">
            {tool.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{tool.tagline}</p>
        </div>
      </section>

      {/* The live tool */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <ToolRunner id={tool.id} />
          <p className="text-xs text-slate-400 mt-4 font-mono text-center">
            Built by The Crimson Bench · Educational tool, not financial advice
          </p>
        </div>
      </section>

      {/* Detail body */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">About the {tool.name}</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tool.description}</p>
            </div>

            {/* How it works — inputs & outputs */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">How the {tool.name} Works</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {tool.inputs.length} inputs in, {tool.outputs.length} results out — computed live on your device. Here&apos;s exactly what it uses.
              </p>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th className="text-left font-mono text-[10px] tracking-widest uppercase text-slate-400 p-3">Input</th>
                      <th className="text-right font-mono text-[10px] tracking-widest uppercase text-slate-400 p-3">Example value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tool.inputs.map(i => (
                      <tr key={i.key} className="border-t border-slate-200 dark:border-slate-800">
                        <td className="p-3 text-slate-700 dark:text-slate-300">{i.label}</td>
                        <td className="p-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">{fmtInput(i)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Worked example */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">Worked Example</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Using the example inputs above, the tool returns:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900">
                {tool.outputs.map(o => (
                  <div key={o.key}>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-slate-400 mb-1">{o.label}</p>
                    <p className={`font-mono tabular-nums ${o.highlight ? 'text-xl font-bold text-[#B01C24]' : 'text-lg text-slate-800 dark:text-slate-200'}`}>{fmt(outputs[o.key], o.format)}</p>
                  </div>
                ))}
              </div>
              {insight && (
                <div className="border-l-2 border-[#B01C24] pl-4">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-[#B01C24] mb-1">The Operator&apos;s Read</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insight}</p>
                </div>
              )}
            </div>

            {/* Assumptions */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">Assumptions &amp; Limitations</h2>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>This is a single-point calculator — it answers one question at a time. For a full time-based projection, use the matching Toolkit Pro simulator.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>Defaults are illustrative. Replace them with your real numbers before relying on the result.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>Educational tool only — <strong>not financial, investment, tax, or legal advice</strong>.</span></li>
              </ul>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {faqs.map(f => (
                  <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-5">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{f.q}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related tools */}
            {related.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">Related {tool.category} Tools</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">More free calculators in the same category.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                  {related.map(r => (
                    <a key={r.id} href={`/tools/${r.id}`} className="bg-white dark:bg-slate-950 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#B01C24] transition-colors">{r.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{r.tagline}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="border border-[#F0B34A]/40 bg-[#F0B34A]/5 p-6 sticky top-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B0801A] dark:text-[#F0B34A] mb-2">Go Further</p>
              <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-2">Toolkit Pro Simulators</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Turn this one-shot calculator into a full projection — tables, scenarios, Excel/PDF export, and AI analysis.</p>
              <a href="/pro-tools" className="btn-crimson w-full text-center block">Explore Simulators →</a>
            </div>

            {product && (
              <div className="border border-slate-200 dark:border-slate-800 p-6">
                <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">Prefer the spreadsheet?</p>
                <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-1">{product.name}</h3>
                <p className="font-mono text-lg text-[#B01C24] font-bold mb-3">{formatDigitalPrice(product)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{product.tagline}</p>
                <a href={`/digital-products/${product.id}`} className="btn-outline w-full text-center block">Get the Toolkit →</a>
              </div>
            )}
          </aside>
        </div>
      </section>

      <CTABlock heading="Need more than a calculator?" />
    </>
  )
}
