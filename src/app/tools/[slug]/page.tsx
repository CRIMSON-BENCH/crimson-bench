import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TOOLS, getToolById } from '@/lib/tools'
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
    title: `${tool.name} — Free Tool by The Crimson Bench`,
    description: `${tool.tagline} ${tool.description}`,
    alternates: { canonical: `/tools/${tool.id}` },
  }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolById(slug)
  if (!tool) notFound()

  const product = tool.sells ? getDigitalProductById(tool.sells) : null

  const faqs = [
    { q: `Is the ${tool.name} free?`, a: `Yes. The ${tool.name} is completely free to use — no signup, no limits. Enter your numbers and get an instant result.` },
    { q: `Who built this tool?`, a: `It was built by The Crimson Bench's Ivy League-educated operators — the same people we deploy into C-suites. It uses the exact method they'd apply in an engagement.` },
    { q: `Is this financial advice?`, a: `No. This is an educational tool for directional planning, not financial, investment, tax, or legal advice. For a real engagement, deploy an executive from our bench.` },
  ]

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
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

      {/* About + upsell */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white">About This Tool</h2>
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
                <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">Go Deeper</p>
                <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-1">{product.name}</h3>
                <p className="font-mono text-lg text-[#B01C24] font-bold mb-3">{formatDigitalPrice(product)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{product.tagline}</p>
                <a href={`/digital-products/${product.id}`} className="btn-crimson w-full text-center block">Get the Full Model →</a>
              </div>
            </aside>
          )}
        </div>
      </section>

      <CTABlock heading="Need more than a calculator?" />
    </>
  )
}
