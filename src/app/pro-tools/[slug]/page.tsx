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
    title: `${tool.name} — Toolkit Pro`,
    description: `${tool.tagline} ${tool.description}`,
    alternates: { canonical: `/pro-tools/${tool.id}` },
  }
}

export default async function ProToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getProToolById(slug)
  if (!tool) notFound()

  const product = tool.sells ? getDigitalProductById(tool.sells) : null
  const vault = getDigitalProductById('the-crimson-bench-vault')

  const faqs = [
    { q: `What does the ${tool.name} do?`, a: `${tool.description}` },
    { q: `What's the difference between this and the free tools?`, a: `The free tools answer a single question. Toolkit Pro simulates the full trajectory over time — projections, scenarios, and tables you can save and export. It's the difference between a calculator and a model.` },
    { q: `Who built it?`, a: `The Crimson Bench's Ivy League-educated operators — the same models they build inside a live engagement.` },
    { q: `Is this financial advice?`, a: `No. It's an educational modeling tool for directional planning, not financial, investment, tax, or legal advice.` },
  ]

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
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
              <p className="text-sm text-slate-700 dark:text-slate-300">Save your scenarios, export to Excel &amp; PDF, and unlock every simulator and model.</p>
            </div>
            <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson py-2.5 px-5 whitespace-nowrap">Unlock Toolkit Pro →</a>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-mono text-center">Built by The Crimson Bench · Educational model, not financial advice</p>
        </div>
      </section>

      {/* About + upsell */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white">About This Simulator</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tool.description}</p>
            <div className="space-y-4 pt-4">
              {faqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {product && (
            <aside>
              <div className="border border-slate-200 dark:border-slate-800 p-6 sticky top-6">
                <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">Prefer the file?</p>
                <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-1">{product.name}</h3>
                <p className="font-mono text-lg text-[#B01C24] font-bold mb-3">{formatDigitalPrice(product)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{product.tagline}</p>
                <a href={`/digital-products/${product.id}`} className="btn-outline w-full text-center block mb-3">Get the Download →</a>
                {vault && <a href={`/digital-products/${vault.id}`} className="btn-crimson w-full text-center block">Or get the Vault →</a>}
              </div>
            </aside>
          )}
        </div>
      </section>

      <CTABlock heading="Need an operator, not just a model?" />
    </>
  )
}
