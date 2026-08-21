import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  DIGITAL_PRODUCTS,
  getDigitalProductById,
  getDigitalProductsByCategory,
  getIndustryVariants,
  formatDigitalPrice,
  TOOLKIT_PRO,
} from '@/lib/digital-products'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import BuyButton from '@/components/BuyButton'
import { productSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return DIGITAL_PRODUCTS.map(p => ({ slug: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getDigitalProductById(slug)
  if (!product) return {}
  return {
    title: `${product.name} — ${formatDigitalPrice(product)} Instant Download`,
    description: `${product.tagline} ${product.description}`,
    alternates: { canonical: `/digital-products/${product.id}` },
  }
}

export default async function DigitalProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getDigitalProductById(slug)
  if (!product) notFound()

  const related = getDigitalProductsByCategory(product.category)
    .filter(p => p.id !== product.id && !p.industry)
    .slice(0, 4)
  const vault = getDigitalProductById('the-crimson-bench-vault')

  // Industry editions: if this is a core product, list its variants; if a variant, list its siblings + parent.
  const editions = product.industry
    ? getIndustryVariants(product.baseId!).filter(p => p.id !== product.id)
    : getIndustryVariants(product.id)
  const parent = product.baseId ? getDigitalProductById(product.baseId) : null

  // Stripe Payment Link when wired; falls back to the contact page until then.

  const productFaqs = [
    {
      q: `What do I get with the ${product.shortName}?`,
      a: `The ${product.name} is an instant-download ${product.format.toLowerCase()}. It includes: ${product.includes.join('; ')}. You download it immediately after purchase and keep it forever.`,
    },
    {
      q: `Is the ${product.shortName} editable?`,
      a: `Yes. The ${product.name} is fully editable — rebrand it, adjust it, and make it your own. Nothing is locked.`,
    },
    {
      q: `Do I get updates?`,
      a: `Yes. Your purchase includes free lifetime updates. When we improve the ${product.shortName}, you get the new version at no extra cost.`,
    },
    {
      q: `Who built the ${product.shortName}?`,
      a: `It was built by The Crimson Bench's Ivy League-educated operators — the same people we deploy into C-suites. This is the self-serve version of that expertise.`,
    },
  ]

  return (
    <>
      <JsonLd data={productSchema(product.name, product.description, product.price, undefined)} />
      <JsonLd data={faqSchema(productFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Digital Products', url: 'https://www.crimsonbench.com/digital-products' },
        { name: product.shortName, url: `https://www.crimsonbench.com/digital-products/${product.id}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Digital Products', href: '/digital-products' },
        { name: product.shortName, href: `/digital-products/${product.id}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">
            {product.category} · {product.format}{product.isBundle ? ' · Bundle' : ''}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4">
            {product.name}
          </h1>
          <p className="font-mono text-3xl font-bold text-[#B01C24] mb-6 tabular-nums">{formatDigitalPrice(product)}</p>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            {product.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <BuyButton
              type={product.isSubscription ? 'subscription_monthly' : 'toolkit'}
              itemId={product.id}
              name={product.name}
              amount={product.price * 100}
              className="btn-crimson py-3 px-6"
            >
              {product.isSubscription
                ? `Start Toolkit Pro — ${formatDigitalPrice(product)} →`
                : `Buy & Download — ${formatDigitalPrice(product)} →`}
            </BuyButton>
            <a href="/digital-products" className="btn-outline py-3 px-6">Browse All {DIGITAL_PRODUCTS.length}+ Products</a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Description */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              About This {product.isBundle ? 'Bundle' : 'Product'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>
          </div>

          {/* What's inside — the actual model files */}
          {product.deliverables && product.deliverables.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">
                What&apos;s Inside — {product.fileCount} Excel Models
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Every model is formula-driven: the pale-gold cells are your inputs, everything else calculates automatically. Works in Microsoft Excel and Google Sheets.
              </p>
              <div className="grid gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                {product.deliverables.map((d, i) => (
                  <div key={d.title} className="bg-white dark:bg-slate-950 p-5 flex gap-4">
                    <span className="font-mono text-xs text-[#B01C24] font-bold flex-shrink-0 mt-1 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {d.title}
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">.xlsx</span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's included (perks) */}
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

          {/* Cross-promo: matching simulators */}
          {product.pairsWith && product.pairsWith.length > 0 && (
            <div className="border border-[#B01C24]/30 bg-[#B01C24]/5 dark:bg-[#B01C24]/10 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">Pairs With These Simulators</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Pressure-test the assumptions behind this toolkit with our live simulators.
              </p>
              <ul className="space-y-2 mb-4">
                {product.pairsWith.map(s => (
                  <li key={s.slug}>
                    <a href={`/pro-tools/${s.slug}`} className="text-sm text-slate-800 dark:text-slate-200 hover:text-[#B01C24] transition-colors">
                      → {s.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlock any 3 simulators for <span className="font-semibold text-[#B01C24]">${TOOLKIT_PRO.tripack}</span>, or go unlimited with Toolkit Pro (${TOOLKIT_PRO.monthly}/mo · ${TOOLKIT_PRO.annual.toLocaleString()}/yr).
              </p>
            </div>
          )}

          {/* Toolkit Pro all-access upsell (not on the vault itself) */}
          {vault && product.id !== vault.id && (
            <div className="border border-[#B01C24]/30 bg-[#B01C24]/5 dark:bg-[#B01C24]/10 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">Best Value · All-Access</p>
              <h3 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-1">Toolkit Pro</h3>
              <p className="font-mono text-lg text-[#B01C24] font-bold mb-3">${TOOLKIT_PRO.monthly}/mo <span className="text-sm font-normal text-slate-500">· or ${TOOLKIT_PRO.annual.toLocaleString()}/yr (save 20%)</span></p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Skip buying one at a time. Get all 515 Excel toolkits (2,500+ models) <em>and</em> all 500 premium simulators — with exports and AI analysis — for one membership.</p>
              <a href={`/digital-products/${vault.id}`} className="btn-crimson py-2 px-4 text-sm">Get Toolkit Pro →</a>
            </div>
          )}

          {/* Parent link for a variant */}
          {parent && (
            <div className="border border-slate-200 dark:border-slate-800 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-2">General Edition</p>
              <a href={`/digital-products/${parent.id}`} className="font-serif text-lg text-slate-900 dark:text-white hover:text-[#B01C24] transition-colors">
                {parent.name} →
              </a>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The non-industry-specific version of this product.</p>
            </div>
          )}

          {/* Industry editions */}
          {editions.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">
                {product.industry ? 'Also Available For' : 'Specialized For Your Industry'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Same product, tuned with the benchmarks and language of your vertical.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                {editions.map(e => (
                  <a key={e.id} href={`/digital-products/${e.id}`} className="bg-white dark:bg-slate-950 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                    <p className="font-mono text-[9px] tracking-widest uppercase text-slate-400 mb-1">{e.industry}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-[#B01C24] transition-colors leading-snug">{e.shortName}</p>
                    <p className="font-mono text-xs text-[#B01C24] mt-1">{formatDigitalPrice(e)}</p>
                  </a>
                ))}
              </div>
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
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">{product.format}</p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mb-4 tabular-nums">{formatDigitalPrice(product)}</p>
            <ul className="space-y-2 mb-6">
              {product.includes.slice(0, 4).map(inc => (
                <li key={inc} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                  <span className="text-[#B01C24]">✓</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
            <BuyButton
              type={product.isSubscription ? 'subscription_monthly' : 'toolkit'}
              itemId={product.id}
              name={product.name}
              amount={product.price * 100}
              className="btn-crimson w-full text-center block mb-3"
            >
              {product.isSubscription ? 'Start Toolkit Pro →' : 'Buy & Download →'}
            </BuyButton>
            <p className="text-xs text-slate-400 text-center font-mono">
              {product.isSubscription ? 'Cancel anytime · new files added continuously' : 'Instant download · Lifetime updates'}
            </p>
          </div>

          {related.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-800 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">More in {product.category}</p>
              <ul className="space-y-3">
                {related.map(p => (
                  <li key={p.id}>
                    <a href={`/digital-products/${p.id}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors block">
                      {p.shortName}
                      <span className="block font-mono text-xs text-[#B01C24]">{formatDigitalPrice(p)}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/digital-products" className="text-xs text-[#B01C24] font-mono uppercase tracking-wider mt-4 inline-block">All {DIGITAL_PRODUCTS.length}+ Products →</a>
            </div>
          )}
        </aside>
      </div>

      <CTABlock heading={`Get the ${product.shortName} Now`} />
    </>
  )
}
