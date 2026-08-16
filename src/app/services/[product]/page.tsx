import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS, getProductById, formatPrice } from '@/lib/pricing'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { productSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ product: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const { product: productId } = await params
  const product = getProductById(productId)
  if (!product) return {}
  return {
    title: `${product.name} — ${formatPrice(product)} | The Crimson Bench`,
    description: `${product.tagline}. ${product.description} Flat-rate pricing. 14-day no-cause cancellation. Ivy League-educated executives deployed within 48 hours.`,
    alternates: { canonical: `/services/${product.id}` },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productId } = await params
  const product = getProductById(productId)
  if (!product) notFound()

  const upsell = product.upsellTo ? getProductById(product.upsellTo) : null
  const otherProducts = PRODUCTS.filter(p => p.id !== product.id && p.type === product.type).slice(0, 3)

  const productFaqs = [
    {
      q: `What is included in the ${product.shortName}?`,
      a: `The ${product.name} includes: ${product.includes.join('; ')}.`,
    },
    {
      q: `Is the ${product.shortName} available for all eight C-suite roles?`,
      a: `Yes. The ${product.name} can be deployed for any of The Crimson Bench's eight C-suite capacities: fractional CEO, CFO, CTO, COO, CRO, CMO, CHRO, and CISO. All executives on our bench hold Ivy League credentials and are deployed within 48 hours.`,
    },
    {
      q: `Can I cancel the ${product.shortName} at any time?`,
      a: product.type === 'monthly'
        ? `Yes. All monthly engagements — including the ${product.name} — can be cancelled with 14 days written notice, no penalty, no minimum term.`
        : `The ${product.name} is a ${product.type === 'one-time' ? 'one-time' : 'fixed-scope'} engagement. There are no recurring cancellation terms — the engagement concludes upon delivery of the agreed scope.`,
    },
    {
      q: `How quickly can I get started with the ${product.shortName}?`,
      a: `The Crimson Bench deploys within 48 hours of engagement authorization and contract execution. For the ${product.name}, your executive will be scheduled for their first session within the first week, with deliverables beginning immediately.`,
    },
  ]

  return (
    <>
      <JsonLd data={productSchema(product.name, product.description, product.price, product.priceSuffix)} />
      <JsonLd data={faqSchema(productFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Pricing', url: 'https://www.crimsonbench.com/pricing' },
        { name: product.shortName, url: `https://www.crimsonbench.com/services/${product.id}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Pricing', href: '/pricing' },
        { name: product.shortName, href: `/services/${product.id}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">
            {product.type === 'monthly' ? 'Monthly Retainer' : product.type === 'one-time' ? 'One-Time Engagement' : product.type === 'fixed-scope' ? 'Fixed-Scope Engagement' : product.type === 'annual' ? 'Annual Engagement' : product.type === 'affiliate' ? 'Partner Program' : 'Custom / Enterprise'}
            {' · '}Product {product.num.toString().padStart(2, '0')} of 22
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4">
            {product.name}
          </h1>
          <p className="font-mono text-3xl font-bold text-[#B01C24] mb-6 tabular-nums">{formatPrice(product)}</p>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            {product.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">Get Started →</a>
            <a href="/pricing" className="btn-outline py-3 px-6">View All 22 Products</a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Description */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              About This Engagement
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>
          </div>

          {/* What's included */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              What&apos;s Included
            </h2>
            <ul className="space-y-4">
              {product.includes.map(inc => (
                <li key={inc} className="flex gap-4">
                  <span className="text-[#B01C24] font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upsell */}
          {upsell && (
            <div className="border border-slate-200 dark:border-slate-800 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-2">Next Step Up</p>
              <h3 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-1">{upsell.name}</h3>
              <p className="font-mono text-lg text-[#B01C24] font-bold mb-3">{formatPrice(upsell)}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{upsell.tagline}</p>
              <a href={`/services/${upsell.id}`} className="btn-outline py-2 px-4 text-sm">View {upsell.shortName} →</a>
            </div>
          )}

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {productFaqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6 sticky top-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">{product.shortName}</p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mb-4 tabular-nums">{formatPrice(product)}</p>
            <ul className="space-y-2 mb-6">
              {product.includes.slice(0, 4).map(inc => (
                <li key={inc} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                  <span className="text-[#B01C24]">✓</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
            <a href="/contact" className="btn-crimson w-full text-center block mb-3">Get Started →</a>
            {product.type === 'monthly' && (
              <p className="text-xs text-slate-400 text-center font-mono">14-day no-cause cancellation</p>
            )}
          </div>

          {otherProducts.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-800 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Other {product.type === 'monthly' ? 'Retainers' : 'Products'}</p>
              <ul className="space-y-3">
                {otherProducts.map(p => (
                  <li key={p.id}>
                    <a href={`/services/${p.id}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors block">
                      {p.shortName}
                      <span className="block font-mono text-xs text-[#B01C24]">{formatPrice(p)}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/pricing" className="text-xs text-[#B01C24] font-mono uppercase tracking-wider mt-4 inline-block">All 22 Products →</a>
            </div>
          )}
        </aside>
      </div>

      <CTABlock heading={`Get Started with ${product.shortName}`} />
    </>
  )
}
