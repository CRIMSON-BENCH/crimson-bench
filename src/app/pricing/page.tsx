import type { Metadata } from 'next'
import { PRODUCTS, getMonthlyProducts, getOneTimeProducts, formatPrice } from '@/lib/pricing'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema, faqSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Pricing — 22 Products & Engagement Tiers | The Crimson Bench',
  description:
    'Transparent flat-rate pricing for every Crimson Bench engagement. From a $500 Executive Written Audit to $30,000+/month PE Corporate Package. No marketplace markup. No hourly billing. No conversion fee.',
  alternates: { canonical: '/pricing' },
}

const PRICING_FAQS = [
  {
    q: 'Does The Crimson Bench charge by the hour?',
    a: 'No. Every engagement is priced at a flat monthly rate or fixed project fee. There is no hourly billing, no time-tracking, no invoices that expand mid-engagement. You know the price before you start.',
  },
  {
    q: 'Is there a marketplace markup or placement fee?',
    a: 'No. The Crimson Bench is not a marketplace. We do not charge a percentage markup on our executives\' rates, and we do not charge a conversion fee if you decide to hire someone full-time. Our fees are the fees.',
  },
  {
    q: 'What is included in a monthly engagement?',
    a: 'Monthly engagements include weekly leadership sessions, async Slack/email access, written strategic recommendations, and attendance at key meetings (board, leadership team, etc.) within the agreed schedule. The Embedded Executive tier (3+ days/week) includes near-full-time operational presence. See each product page for specifics.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. All monthly engagements can be cancelled with 14 days written notice — no penalty, no lock-in period, no minimum term. We believe in earning the relationship each month, not locking you into it.',
  },
  {
    q: 'Do you offer discounts for startups or nonprofits?',
    a: 'We do not offer blanket discounts by organization type. Our Startup Scale-Up Package ($9,500/month, which includes both a fractional CTO and CFO) and Board Observer Program ($1,500/month) are purpose-built entry points for earlier-stage companies. Contact us to discuss your specific situation.',
  },
  {
    q: 'What if I need multiple executives?',
    a: 'Our PE Corporate Package ($30,000+/month) and Enterprise Executive Suite (custom) are designed for organizations requiring multiple C-suite capacities. We also offer individual engagements for each role that can be combined. Many PE-backed companies use us for two to four roles simultaneously.',
  },
]

const TYPE_ORDER = ['monthly', 'project', 'one-time', 'custom']

export default function PricingPage() {
  const monthly = getMonthlyProducts()
  const oneTime = getOneTimeProducts()
  const projects = PRODUCTS.filter(p => p.type === 'fixed-scope')
  const custom = PRODUCTS.filter(p => p.type === 'custom' || p.type === 'annual' || p.type === 'affiliate')

  const sections = [
    { label: 'Monthly Retainers', products: monthly, id: 'monthly' },
    { label: 'Fixed-Scope Engagements', products: projects, id: 'projects' },
    { label: 'One-Time Engagements', products: oneTime, id: 'one-time' },
    { label: 'Custom & Enterprise', products: custom, id: 'custom' },
  ].filter(s => s.products.length > 0)

  return (
    <>
      <JsonLd data={orgSchema()} />
      <JsonLd data={faqSchema(PRICING_FAQS)} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">22 Products · Flat-Rate · No Markup</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Pricing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            Every engagement at The Crimson Bench is priced at a flat rate — no hourly billing, no marketplace
            markup, no conversion fee. Know what you pay before you start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">
              Deploy an Executive →
            </a>
            <a href="/services/executive-diagnostic" className="btn-outline py-3 px-6">
              Start with a $1,500 Diagnostic
            </a>
          </div>
        </div>
      </section>

      {/* Guarantee bar */}
      <section className="bg-slate-900 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-10 gap-y-2 justify-center md:justify-start">
          {[
            'Flat-Rate Pricing',
            'No Marketplace Markup',
            'No Hourly Billing',
            '14-Day Cancellation',
            'No Conversion Fee',
          ].map(g => (
            <span key={g} className="font-mono text-xs tracking-widest uppercase text-white/60">
              ✓ {g}
            </span>
          ))}
        </div>
      </section>

      {/* Self-serve ladder */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-slate-200 dark:border-slate-800">
        <p className="section-eyebrow mb-3">Self-Serve · Do It Yourself</p>
        <h2 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-3">The Toolkit ladder</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Not ready for a retainer? Start with the models. The same operator-grade thinking, self-serve — from free calculators up to a custom model of your whole business.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {[
            { name: 'Free Tools', price: '$0', unit: '', blurb: '298 instant calculators. No signup.', href: '/tools', cta: 'Use free tools' },
            { name: 'Simulator 3-Pack', price: '$20', unit: 'one-time', blurb: 'Unlock any 3 Pro simulators — full projections + exports.', href: '/pro-tools', cta: 'Browse simulators' },
            { name: 'Toolkit Pro', price: '$180', unit: '/mo', blurb: 'All 500 simulators + 515 Excel toolkits + AI analysis. Or $1,728/yr.', href: '/digital-products/the-crimson-bench-vault', cta: 'Get Toolkit Pro', featured: true },
            { name: 'Company Models', price: '$250', unit: 'each', blurb: 'End-to-end integrated model of a whole business type.', href: '/enterprise', cta: 'See company models' },
            { name: 'Bespoke Build', price: 'Custom', unit: '', blurb: 'Your entire business, modeled end to end, wired to your numbers.', href: '/enterprise', cta: 'Request a build' },
          ].map(tier => (
            <div key={tier.name} className={`p-6 flex flex-col ${tier.featured ? 'bg-[#B01C24]/5 dark:bg-[#B01C24]/10' : 'bg-white dark:bg-slate-950'}`}>
              {tier.featured && <p className="font-mono text-[9px] tracking-widest uppercase text-[#B01C24] mb-2">Best Value</p>}
              <p className="font-serif text-lg text-slate-900 dark:text-white">{tier.name}</p>
              <p className="font-mono text-2xl font-bold text-[#B01C24] mt-1 mb-3 tabular-nums">{tier.price}<span className="text-xs font-normal text-slate-500">{tier.unit}</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug flex-1 mb-4">{tier.blurb}</p>
              <a href={tier.href} className={`text-center py-2 px-3 text-xs font-mono uppercase tracking-wider ${tier.featured ? 'btn-crimson' : 'btn-outline'}`}>{tier.cta} →</a>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
          Prefer a human in the room? The flat-rate consulting engagements below deploy an actual Ivy League operator into your company. ↓
        </p>
      </section>

      {/* Product sections */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {sections.map(section => (
          <div key={section.id} id={section.id}>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
              {section.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              {section.products.map(product => (
                <a
                  key={product.id}
                  href={`/services/${product.id}`}
                  className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group relative"
                >
                  {product.isBestValue && (
                    <span className="absolute top-4 right-4 bg-[#B01C24] text-white font-mono text-[9px] tracking-widest uppercase px-2 py-1">
                      Most Popular
                    </span>
                  )}
                  {product.isNew && (
                    <span className="absolute top-4 right-4 bg-slate-900 text-white font-mono text-[9px] tracking-widest uppercase px-2 py-1">
                      New
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-mono text-[9px] tracking-widest uppercase text-slate-400">
                      {product.num.toString().padStart(2, '0')}
                    </p>
                  </div>
                  <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-1 group-hover:text-[#B01C24] transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-mono text-xl text-[#B01C24] font-bold mb-3 tabular-nums">
                    {formatPrice(product)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {product.tagline}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {product.includes.slice(0, 3).map(inc => (
                      <li key={inc} className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                        <span className="text-[#B01C24]">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                    {product.includes.length > 3 && (
                      <li className="text-xs text-slate-400">+{product.includes.length - 3} more included</li>
                    )}
                  </ul>
                  <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">View Details →</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison note */}
      <section className="py-12 px-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-eyebrow mb-3">Compare</p>
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
            How Our Pricing Compares to the Market
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            A full-time Chief Financial Officer costs $200,000–$450,000+ annually in base salary — before
            equity, benefits, and recruiting fees. A GoFractional or Bolster placement carries marketplace
            overhead that inflates the effective rate. The Crimson Bench offers flat-rate access to the same
            Ivy League talent, deployed in 48 hours, cancellable in 14 days.
          </p>
          <a href="/compare" className="btn-outline py-3 px-6">
            View Full Competitor Comparison →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">
            Pricing FAQs
          </h2>
          <div className="space-y-6">
            {PRICING_FAQS.map(f => (
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
