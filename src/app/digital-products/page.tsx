import type { Metadata } from 'next'
import {
  DIGITAL_PRODUCTS,
  CATEGORY_ORDER,
  CATEGORY_META,
  getCoreDigitalProducts,
  getIndustryVariants,
  formatDigitalPrice,
} from '@/lib/digital-products'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema, faqSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Digital Products — 100+ Executive Templates, Models & Playbooks | The Crimson Bench',
  description:
    'Instant-download templates, financial models, and playbooks built by Ivy League-educated operators. Board decks, 13-week cash models, 100-day plans, sales playbooks and more — from $39. Buy once, download instantly, keep forever.',
  alternates: { canonical: '/digital-products' },
}

const STORE_FAQS = [
  {
    q: 'What exactly do I receive when I buy a digital product?',
    a: 'An instant download. Every digital product is a ready-to-use file — an editable spreadsheet model, slide template, Notion template, or PDF playbook. There is no call, no waiting, and no retainer. You download it immediately after checkout and keep it forever.',
  },
  {
    q: 'How are these different from your executive engagements?',
    a: 'Our engagements deploy a live Ivy League-educated executive into your company. Digital products are the self-serve version of that expertise — the same frameworks and models our operators use, packaged so you can use them yourself for a fraction of the cost.',
  },
  {
    q: 'Can I edit the templates and models?',
    a: 'Yes. Every product is fully editable. Spreadsheets are unlocked, slide templates are yours to rebrand, and Notion templates are duplicated straight into your workspace.',
  },
  {
    q: 'Do I get future updates?',
    a: 'Yes. Every purchase includes free lifetime updates to that product. When we improve a model or playbook, you get the new version at no additional cost.',
  },
  {
    q: 'Is there a bundle if I want everything?',
    a: 'Yes. The Crimson Bench Vault includes every digital product we make — 100+ files across every category — plus every future product, for one flat price. Individual category bundles are also available.',
  },
]

export default function DigitalProductsPage() {
  const core = getCoreDigitalProducts()
  const sections = CATEGORY_ORDER.map(cat => ({
    label: cat,
    blurb: CATEGORY_META[cat],
    products: core.filter(p => p.category === cat),
    id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  })).filter(s => s.products.length > 0)

  return (
    <>
      <JsonLd data={orgSchema()} />
      <JsonLd data={faqSchema(STORE_FAQS)} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{DIGITAL_PRODUCTS.length}+ Products · Instant Download · From $39</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Digital Products
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            The templates, financial models, and playbooks our Ivy League-educated operators use — packaged for
            you to download and use today. No calls. No retainers. Buy once, keep forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson py-3 px-6">
              Get the Vault — All {DIGITAL_PRODUCTS.length}+ →
            </a>
            <a href="#finance-cash" className="btn-outline py-3 px-6">
              Browse by Category
            </a>
          </div>
        </div>
      </section>

      {/* Guarantee bar */}
      <section className="bg-slate-900 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-10 gap-y-2 justify-center md:justify-start">
          {['Instant Download', 'Fully Editable', 'Free Lifetime Updates', 'Built by Ivy League Operators', 'Buy Once, Keep Forever'].map(g => (
            <span key={g} className="font-mono text-xs tracking-widest uppercase text-white/60">
              ✓ {g}
            </span>
          ))}
        </div>
      </section>

      {/* Category nav */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-6 gap-y-2">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* Product sections */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {sections.map(section => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              {section.label}
              <span className="font-mono text-xs text-slate-400 ml-3">{section.products.length}</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">{section.blurb}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              {section.products.map(product => (
                <a
                  key={product.id}
                  href={`/digital-products/${product.id}`}
                  className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group relative"
                >
                  {product.isBestValue && (
                    <span className="absolute top-4 right-4 bg-[#B01C24] text-white font-mono text-[9px] tracking-widest uppercase px-2 py-1">
                      {product.isBundle ? 'Best Value' : 'Popular'}
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-mono text-[9px] tracking-widest uppercase text-slate-400">
                      {product.num.toString().padStart(3, '0')} · {product.format}
                    </p>
                  </div>
                  <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-1 group-hover:text-[#B01C24] transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-mono text-xl text-[#B01C24] font-bold mb-3 tabular-nums">
                    {formatDigitalPrice(product)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {product.tagline}
                  </p>
                  {getIndustryVariants(product.id).length > 0 && (
                    <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                      + {getIndustryVariants(product.id).length} industry editions
                    </p>
                  )}
                  <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">View Details →</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">
            Digital Product FAQs
          </h2>
          <div className="space-y-6">
            {STORE_FAQS.map(f => (
              <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
