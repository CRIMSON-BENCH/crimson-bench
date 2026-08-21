import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRO_TOOLS, getProToolById } from '@/lib/pro-tools'
import { getDigitalProductById, formatDigitalPrice } from '@/lib/digital-products'
import ProGate from '@/components/ProGate'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export function generateStaticParams() {
  return PRO_TOOLS.map(t => ({ slug: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = getProToolById(slug)
  if (!tool) return {}
  return {
    title: `${tool.name} — Free Online Calculator & Model`,
    description: `${tool.tagline} ${tool.description} A free, interactive ${tool.category.toLowerCase()} simulator from The Crimson Bench — enter your numbers and see the full projection.`,
    alternates: { canonical: `/pro-tools/${tool.id}` },
    keywords: [tool.name, `${tool.name} calculator`, tool.name.toLowerCase(), `${tool.category} model`, 'financial simulator', 'business calculator'],
  }
}

function fmtInput(i: { default: number; prefix?: string; suffix?: string }): string {
  const n = i.default.toLocaleString('en-US')
  return `${i.prefix ?? ''}${n}${i.suffix ?? ''}`
}

export default async function ProToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getProToolById(slug)
  if (!tool) notFound()

  const product = tool.sells ? getDigitalProductById(tool.sells) : null

  // Compute a real worked example from the model's own default assumptions (build-time, deterministic).
  const defaults = Object.fromEntries(tool.inputs.map(i => [i.key, i.default])) as Record<string, number>
  const example = tool.compute(defaults)
  const exampleRows = example.rows.slice(0, 6)

  const related = PRO_TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6)

  const inputNames = tool.inputs.map(i => i.label)
  const metricNames = example.metrics.map(m => m.label)

  const faqs = [
    { q: `What does the ${tool.name} calculate?`, a: `${tool.description} It takes ${tool.inputs.length} assumptions — ${inputNames.join(', ')} — and returns ${metricNames.join(', ')}, along with a full projection table you can export.` },
    { q: `How do I use the ${tool.name}?`, a: `Enter your own figures in the input fields above — ${inputNames.slice(0, 3).join(', ')}, and the rest. The model recalculates instantly and shows the resulting ${metricNames[0] ?? 'projection'} and full breakdown. No sign-up needed to run it.` },
    { q: `Is the ${tool.name} free?`, a: `Yes — you can run the simulator and see the headline results for free. Toolkit Pro unlocks the full projection table, Excel/PDF export, saved scenarios, and AI analysis: $180/mo, $1,728/yr, or unlock any 3 simulators for $20.` },
    { q: `What's the difference between this and a free calculator?`, a: `A calculator answers one question. This simulator models the full picture — multiple linked assumptions, a projection table, and scenario comparison — the way an operator would build it in a spreadsheet, but instantly.` },
    { q: `Who built the ${tool.name}?`, a: `The Crimson Bench's Ivy League-educated operators — the same people we deploy into C-suites. This is the self-serve version of a model they'd build inside a live engagement.` },
    { q: `Is this financial advice?`, a: `No. The ${tool.name} is an educational modeling tool for directional planning — not financial, investment, tax, or legal advice. Validate any real decision with a qualified professional.` },
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
        { name: 'Toolkit Pro', url: 'https://www.crimsonbench.com/pro-tools' },
        { name: tool.name, url: `https://www.crimsonbench.com/pro-tools/${tool.id}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Toolkit Pro', href: '/pro-tools' },
        { name: tool.name, href: `/pro-tools/${tool.id}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">
            <span className="bg-[#F0B34A] text-slate-900 font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 mr-2">Pro</span>
            {tool.category} · Simulator
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4">{tool.name}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{tool.tagline}</p>
        </div>
      </section>

      {/* The simulator */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <ProGate id={tool.id} />

          {/* Pro unlock bar */}
          <div className="mt-6 border border-[#F0B34A]/40 bg-[#F0B34A]/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-[#B0801A] dark:text-[#F0B34A] mb-1">Toolkit Pro</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">Save your scenarios, export to Excel &amp; PDF, run AI analysis, and unlock every simulator — $180/mo, $1,728/yr, or any 3 for $20.</p>
            </div>
            <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson py-2.5 px-5 whitespace-nowrap">Unlock Toolkit Pro →</a>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-mono text-center">Built by The Crimson Bench · Educational model, not financial advice</p>
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                It&apos;s built for directional planning: change any assumption and watch the whole projection move, the way a seasoned operator pressure-tests a plan before committing capital. Everything is computed live in your browser — nothing is sent anywhere.
              </p>
            </div>

            {/* How it works — inputs */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">How the {tool.name} Works</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                The model takes {tool.inputs.length} assumptions and returns {example.metrics.length} headline metrics plus a full breakdown. Here is exactly what goes in and what comes out — no black box.
              </p>
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-3">The Inputs</h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th className="text-left font-mono text-[10px] tracking-widest uppercase text-slate-400 p-3">Assumption</th>
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

            {/* Worked example — computed live */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">Worked Example</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Every figure below is produced by the live model using the example assumptions above. Change any input in the simulator to see your own numbers.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900">
                {example.metrics.map(m => (
                  <div key={m.label}>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-slate-400 mb-1">{m.label}</p>
                    <p className={`font-mono tabular-nums ${m.highlight ? 'text-xl font-bold text-[#B01C24]' : 'text-lg text-slate-800 dark:text-slate-200'}`}>{m.value}</p>
                  </div>
                ))}
              </div>
              {exampleRows.length > 0 && (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900">
                        {example.columns.map(c => (
                          <th key={c} className="text-left font-mono text-[10px] tracking-widest uppercase text-slate-400 p-3 whitespace-nowrap">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {exampleRows.map((row, i) => (
                        <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                          {row.map((cell, j) => (
                            <td key={j} className={`p-3 whitespace-nowrap tabular-nums ${j === 0 ? 'text-slate-500 dark:text-slate-400 font-mono text-xs' : 'text-slate-900 dark:text-white font-mono'}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {example.note && (
                <div className="mt-6 border-l-2 border-[#B01C24] pl-4">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-[#B01C24] mb-1">The Operator&apos;s Read</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{example.note}</p>
                </div>
              )}
            </div>

            {/* Assumptions & limitations */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">Assumptions &amp; Limitations</h2>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>The model is <strong>deterministic</strong>: it projects your inputs forward with clear arithmetic, not a Monte-Carlo or probabilistic forecast. It shows one scenario at a time — run several to bracket a range.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>Defaults are illustrative benchmarks, not your business. Replace every field with your real numbers before drawing conclusions.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>It abstracts away taxes, financing, seasonality, and one-off events unless a field explicitly captures them. Treat the output as a directional estimate.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>This is an educational tool, <strong>not financial, investment, tax, or legal advice</strong>. Validate real decisions with a qualified professional.</span></li>
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

            {/* Related simulators */}
            {related.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">Related {tool.category} Simulators</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">More models in the same category.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                  {related.map(r => (
                    <a key={r.id} href={`/pro-tools/${r.id}`} className="bg-white dark:bg-slate-950 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
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
              <p className="font-mono text-xs tracking-widest uppercase text-[#B0801A] dark:text-[#F0B34A] mb-2">Toolkit Pro</p>
              <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mb-1 tabular-nums">$180<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">or $1,728/yr (save 20%) · any 3 simulators for $20</p>
              <ul className="space-y-2 mb-5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>Full projection tables, unblurred</span></li>
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>Export to Excel &amp; PDF</span></li>
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>AI analysis &amp; saved scenarios</span></li>
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>All 500 simulators + 515 toolkits</span></li>
              </ul>
              <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson w-full text-center block">Unlock Toolkit Pro →</a>
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

      <CTABlock heading="Need an operator, not just a model?" />
    </>
  )
}
