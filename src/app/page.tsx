import type { Metadata } from 'next'
import { ROLES } from '@/lib/roles'
import { PRODUCTS, formatPrice } from '@/lib/pricing'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema, faqSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'The Crimson Bench — Ivy League Executive Deployment in 48 Hours',
  description:
    'Founded in New York City. 25,000+ Ivy League executives. 150,000+ global consultants — scientists, engineers, ex-military. Fractional CEO, CFO, CTO, COO, CRO, CMO, CHRO, CISO deployed within 48 hours. Flat-rate pricing. 14-day cancellation.',
}

const HOMEPAGE_FAQS = [
  {
    q: 'What is The Crimson Bench?',
    a: 'The Crimson Bench is a global executive consulting firm founded in New York City in 2002. We maintain a network of 25,000+ Ivy League-educated C-suite executives and 150,000+ total global consultants — including scientists, engineers, and ex-military operators — and deploy them to organizations within 48 hours at transparent flat-rate pricing.',
  },
  {
    q: 'How quickly can you deploy an executive?',
    a: 'Our standard deployment SLA is 48 hours from engagement authorization. Our executives are pre-vetted and on-call — there is no sourcing period. Most clients have their executive in their first leadership meeting within the first week of engagement.',
  },
  {
    q: 'What does "Ivy League" mean in this context?',
    a: 'Every executive on The Crimson Bench\'s C-suite tier holds an undergraduate or graduate degree from an Ivy League institution: Harvard, Yale, Princeton, Columbia, Penn, Dartmouth, Brown, or Cornell. This is a guarantee — not a claim about a subset of our network.',
  },
  {
    q: 'What is the difference between The Crimson Bench and a staffing agency?',
    a: 'The Crimson Bench is a consulting firm, not a staffing agency. Our executives are deployed as consultants under Consulting Services Agreements — they are not placed as employees. They are accountable to clear deliverables, operate on defined schedules, and can be terminated with 14-day notice. This structure is faster, more flexible, and carries none of the compliance burden of a traditional hire.',
  },
  {
    q: 'What roles does The Crimson Bench cover?',
    a: 'We deploy fractional executives across all eight C-suite positions: Chief Executive Officer (CEO), Chief Financial Officer (CFO), Chief Technology Officer (CTO), Chief Operating Officer (COO), Chief Revenue Officer (CRO), Chief Marketing Officer (CMO), Chief Human Resources Officer (CHRO), and Chief Information Security Officer (CISO). Beyond the C-suite, we can also tap our 150,000+ global consultant network for specialized scientific, engineering, and technical expertise.',
  },
]

const STATS = [
  { num: '25,000+', label: 'Ivy League Executives' },
  { num: '150,000+', label: 'Global Consultants' },
  { num: '48 hrs', label: 'Avg. Deployment Time' },
  { num: 'Est. 2002', label: 'Founded in New York City' },
]

const FEATURED_PRODUCTS = PRODUCTS.filter(p =>
  ['executive-diagnostic', 'advisory-retainer', 'scale-up-fractional', 'growth-fractional', 'embedded-executive', 'crisis-intervention-retainer'].includes(p.id)
)

export default function HomePage() {
  return (
    <>
      <JsonLd data={orgSchema()} />
      <JsonLd data={faqSchema(HOMEPAGE_FAQS)} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36">
          <p className="section-eyebrow mb-6">Founded in New York City · Est. 2002 · 24,000+ Mandates</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight text-slate-900 dark:text-white max-w-4xl mb-8 leading-tight">
            The Antidote to<br />Automated Strategy.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
            25,000+ Ivy League-educated executive operators — plus 150,000+ global consultants including scientists, engineers, and ex-military — deployed directly into your C-suite within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-4 px-8 text-center">
              Deploy an Executive →
            </a>
            <a href="/services/executive-diagnostic" className="btn-outline py-4 px-8 text-center">
              Start with a $1,500 Diagnostic
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-900 dark:bg-black border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="font-mono text-2xl font-bold text-white tabular-nums">{s.num}</div>
                <div className="font-mono text-xs tracking-widest uppercase text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Bench — 8 roles */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-3">The Bench</p>
          <h2 className="section-heading mb-4">Eight C-Suite Capacities. One Vetted Roster.</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl">
            Every executive on our bench holds an Ivy League credential and has been deployed into operating companies. No junior analysts. No AI ghostwriters. No offshore talent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {ROLES.map(role => (
              <a
                key={role.key}
                href={`/bench/${role.key}`}
                className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
              >
                <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">{role.title}</p>
                <h3 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-3 group-hover:text-[#B01C24] transition-colors">
                  {role.fullTitle}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{role.tagline}</p>
                <p className="font-mono text-xs text-[#B01C24] mt-4 uppercase tracking-wider">Review Mandate →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The Domestic Guarantee */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow mb-3">The Crimson Bench Difference</p>
              <h2 className="section-heading mb-6">What No Competitor Can Match</h2>
              <div className="space-y-6">
                {[
                  ['25,000+ Ivy League Executives', 'Every executive on our C-suite bench holds an Ivy League degree. This is a guarantee — verified before deployment — not a claim about a portion of our network.'],
                  ['150,000+ Global Consultant Pool', 'Beyond the C-suite, we can deploy scientists, engineers, technologists, and ex-military operators from our 150,000-strong global network for any specialized need.'],
                  ['48-Hour Deployment SLA', 'We guarantee deployment within 48 hours of engagement authorization. GoFractional has no SLA. Bolster takes 5–7 days. We are the fastest credentialed executive firm in the market.'],
                  ['Flat-Rate Pricing', 'No marketplace markup. No hourly billing that balloons. No 20% conversion fee if you want to hire someone full-time. Six transparent engagement tiers from $500 to $30,000+/month.'],
                  ['14-Day No-Cause Cancellation', 'Cancel any monthly engagement with 14 days notice and no penalty. No long-term commitment required to access Ivy League C-suite talent.'],
                  ['Founded in New York City · Est. 2002', 'Twenty-two years of institutional operating experience. 24,000+ mandates across capital markets, PE-backed companies, startups, and turnarounds.'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-1 bg-[#B01C24] flex-shrink-0 rounded-full mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              {/* Comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 pr-4 font-mono text-xs tracking-wide uppercase text-slate-400">Feature</th>
                      <th className="text-center py-2 px-3 font-mono text-xs tracking-wide uppercase text-[#B01C24]">Us</th>
                      <th className="text-center py-2 px-3 font-mono text-xs tracking-wide uppercase text-slate-400">GoFract.</th>
                      <th className="text-center py-2 px-3 font-mono text-xs tracking-wide uppercase text-slate-400">Bolster</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Ivy League Guarantee', true, false, false],
                      ['48-Hour SLA', true, false, false],
                      ['Flat-Rate Pricing', true, false, false],
                      ['14-Day Cancellation', true, false, false],
                      ['150K+ Consultant Pool', true, false, false],
                      ['Scientists & Engineers', true, false, false],
                      ['NYC Founded · Est. 2002', true, false, false],
                    ].map(([label, us, gf, bo]) => (
                      <tr key={String(label)} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-400 text-xs">{String(label)}</td>
                        <td className="py-2.5 px-3 text-center text-[#B01C24] font-bold">{us ? '✓' : '✗'}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">{gf ? '✓' : '✗'}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">{bo ? '✓' : '✗'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Tiers */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-3">Engagement Tiers</p>
          <h2 className="section-heading mb-4">Transparent. Flat-Rate. No Markup.</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl">
            Six engagement levels from a $500 written audit to a $30,000+/month PE corporate package. No hourly billing. No marketplace markup. No conversion fee.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {FEATURED_PRODUCTS.map(p => (
              <a
                key={p.id}
                href={`/services/${p.id}`}
                className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group relative"
              >
                {p.isBestValue && (
                  <span className="absolute top-4 right-4 bg-[#B01C24] text-white font-mono text-[9px] tracking-widest uppercase px-2 py-1">
                    Most Popular
                  </span>
                )}
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-2">{p.type === 'one-time' ? 'One-Time' : p.type === 'monthly' ? 'Monthly' : 'Fixed Scope'}</p>
                <h3 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-2 group-hover:text-[#B01C24] transition-colors">
                  {p.shortName}
                </h3>
                <p className="font-mono text-2xl text-[#B01C24] font-bold mb-3 tabular-nums">{formatPrice(p)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{p.tagline}</p>
                <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Learn More →</p>
              </a>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/pricing" className="btn-outline py-3 px-8">View All 22 Products &amp; Pricing →</a>
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase text-slate-400 text-center mb-8">
            The Organizations We Deploy Into
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {['Top-Tier PE & Buyout Funds', 'Global Venture Firms', 'Fortune 500 Boards', 'Category-Defining Startups', 'Sovereign & Family Offices', 'PE-Backed Scale-Ups', 'Public-Company C-Suites', 'Hyper-Growth SaaS'].map(co => (
              <span key={co} className="font-mono text-xs tracking-widest text-slate-400 uppercase">{co}</span>
            ))}
          </div>

          <p className="font-mono text-xs tracking-widest uppercase text-slate-400 text-center mt-12 mb-6">
            Recent Mandates
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {['A $4B Buyout Fund', 'A Top-5 Cloud Platform', 'A Series C Fintech', 'A National Healthcare System', 'A Category-Leading SaaS Co.', 'A Sovereign Wealth Office', 'A Public Industrials Manufacturer', 'A Hyper-Growth Marketplace'].map(co => (
              <span key={co} className="font-mono text-xs tracking-wide text-slate-500 dark:text-slate-400">{co}</span>
            ))}
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-6">Representative engagements. Specific identities protected under standard mutual NDA.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <p className="section-eyebrow mb-3">Common Questions</p>
          <h2 className="section-heading mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {HOMEPAGE_FAQS.map(f => (
              <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-8">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{f.q}</h3>
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
