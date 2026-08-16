import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoleByKey, getAllRoleSlugs, ROLES } from '@/lib/roles'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { articleSchema, howToSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return getAllRoleSlugs().map(key => ({ role: key }))
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role: roleKey } = await params
  const role = getRoleByKey(roleKey)
  if (!role) return {}
  return {
    title: `How to Hire a Fractional ${role.title} in 2026 | The Crimson Bench`,
    description: `Complete guide to hiring a fractional ${role.fullTitle} in 2026: what to look for, how to evaluate candidates, what to pay, and how to deploy one in 48 hours via The Crimson Bench.`,
    alternates: { canonical: `/guides/how-to-hire/${role.key}` },
  }
}

const HOW_TO_STEPS = (roleTitle: string, roleKey: string) => [
  {
    name: 'Define the scope and mandate',
    text: `Before engaging a fractional ${roleTitle}, document the specific outcomes you need: Are you preparing for a Series B audit? Rebuilding a GTM function? Addressing a regulatory gap? The clearer the mandate, the faster a fractional ${roleTitle} can deliver value.`,
  },
  {
    name: 'Determine your time commitment',
    text: `Fractional ${roleTitle}s operate on defined schedules — from 2 advisory sessions/month to 3+ embedded days/week. Match the time commitment to the urgency and complexity of the mandate. An interim ${roleTitle} covering a gap needs more time than a strategic advisor guiding existing management.`,
  },
  {
    name: 'Verify credentials, not just experience',
    text: `The fractional executive market is unregulated. Anyone can claim to be a "${roleTitle}." Require proof of educational credentials (The Crimson Bench guarantees Ivy League degrees), verify former roles with direct reference calls to board members or investors — not just the candidates they pre-select.`,
  },
  {
    name: 'Evaluate for operating experience, not advisory résumés',
    text: `Ask: "Tell me about a time you led [specific function] through [specific challenge]." Look for P&L ownership, team accountability, and decisions under real constraints — not advisory relationships where they recommended but didn't execute.`,
  },
  {
    name: 'Structure the engagement with clear deliverables',
    text: `Every fractional ${roleTitle} engagement should have: a 30-day plan with clear milestones, defined meeting cadence, explicit async communication expectations, and quarterly business reviews. Ambiguity is the enemy of a successful fractional engagement.`,
  },
  {
    name: 'Start with a diagnostic before a retainer',
    text: `The Crimson Bench's Executive Diagnostic ($1,500) provides a 3-hour structured assessment of your current ${roleTitle} function and a written strategic brief before any monthly commitment. This identifies fit, validates priorities, and gives the executive visibility into your actual situation.`,
  },
]

export default async function HowToHireGuidePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleKey } = await params
  const role = getRoleByKey(roleKey)
  if (!role) notFound()

  const steps = HOW_TO_STEPS(role.title, role.key)
  const otherRoles = ROLES.filter(r => r.key !== role.key).slice(0, 4)

  const guideFaqs = [
    {
      q: `What is a fractional ${role.title}?`,
      a: `A fractional ${role.fullTitle} is an Ivy League-educated executive who provides C-suite ${role.title.toLowerCase()} leadership to your organization on a part-time, contract basis. They are not employees — they operate under Consulting Services Agreements with defined schedules, clear deliverables, and flexible cancellation terms. ${role.tagline}.`,
    },
    {
      q: `How long does it take to hire a fractional ${role.title}?`,
      a: `Through The Crimson Bench: 48 hours from engagement authorization. Through a marketplace like GoFractional or Bolster: 1–3 weeks of browsing, interviewing, and onboarding. Through a traditional executive search: 3–6 months. If you have an urgent need, The Crimson Bench is the only option that guarantees deployment within 48 hours.`,
    },
    {
      q: `What should I pay a fractional ${role.title}?`,
      a: `The Crimson Bench charges flat monthly rates: Advisory Retainer ($4,000/month), Scale-Up Fractional ($7,500/month), Growth Fractional ($12,500/month), and Embedded Executive ($22,500/month). Market rates for independent fractional ${role.title}s vary widely from $5,000 to $25,000+/month depending on experience and time commitment — and many charge additional marketplace fees.`,
    },
    {
      q: `What is the difference between a fractional ${role.title} and an interim ${role.title}?`,
      a: `A fractional ${role.fullTitle} provides part-time, ongoing leadership — typically 1–3 days per week — while your company continues to operate and potentially builds toward a full-time hire. An interim ${role.fullTitle} typically operates full-time for a defined period (3–12 months) to cover a gap, transition, or crisis. The Crimson Bench provides both through our Embedded Executive and Crisis Intervention tiers.`,
    },
  ]

  return (
    <>
      <JsonLd data={articleSchema({
        headline: `How to Hire a Fractional ${role.title} in 2026`,
        description: `Complete guide to hiring a fractional ${role.fullTitle}: what to look for, credentials, engagement structure, and how to deploy in 48 hours.`,
        datePublished: '2026-01-01',
        category: 'hiring-guides',
        slug: `how-to-hire-fractional-${role.key}`,
      })} />
      <JsonLd data={howToSchema(
        `How to Hire a Fractional ${role.title}`,
        `A step-by-step guide to hiring a fractional ${role.fullTitle} for your company.`,
        steps
      )} />
      <JsonLd data={faqSchema(guideFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Guides', url: 'https://www.crimsonbench.com/guides/how-to-hire' },
        { name: `How to Hire a Fractional ${role.title}`, url: `https://www.crimsonbench.com/guides/how-to-hire/${role.key}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Guides', href: '/guides/how-to-hire' },
        { name: `Fractional ${role.title}`, href: `/guides/how-to-hire/${role.key}` },
      ]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">Executive Hiring Guide · 2026</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            How to Hire a Fractional {role.title} in 2026
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            A complete guide from The Crimson Bench on evaluating, engaging, and deploying a fractional {role.fullTitle} — including what to look for, what to pay, and how to structure the engagement for maximum impact.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* What is a fractional role */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              What Is a Fractional {role.title}?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{role.description}</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike a management consultant who advises from the outside or a traditional hire who requires 3–6 months to recruit, a fractional {role.fullTitle} operates as an embedded member of your leadership team on a defined schedule — with accountability to clear deliverables, flexible cancellation terms, and access to the full depth of a real C-suite operator.
            </p>
          </div>

          {/* Step-by-step guide */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              How to Hire a Fractional {role.title}: Step-by-Step
            </h2>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={step.name} className="flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#B01C24] text-white font-mono text-xs font-bold flex items-center justify-center">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{step.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Red flags */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Red Flags When Hiring a Fractional {role.title}
            </h2>
            <ul className="space-y-3">
              {[
                'No verifiable Ivy League or top-tier educational credential',
                'Can\'t name specific companies they led through (not advised on) the challenge you\'re facing',
                'Reference calls lead to peers or direct reports, not board members or investors',
                'No standard Consulting Services Agreement template — wants to operate informally',
                'Unwilling to define deliverables or success metrics before starting',
                'Marketplace engagement where you\'re browsing a catalog, not being matched by a firm',
                'No defined operating cadence — "we\'ll figure out the schedule as we go"',
              ].map(flag => (
                <li key={flag} className="flex gap-3 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="text-red-400 font-bold flex-shrink-0">✗</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why Crimson Bench */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              Why Hire Through The Crimson Bench?
            </h2>
            <ul className="space-y-3">
              {[
                ['Ivy League Guaranteed', 'Every C-suite executive holds an Ivy League degree. Verified before deployment — not claimed retroactively.'],
                ['48-Hour Deployment', 'No sourcing period. No marketplace browsing. Your executive is scheduled within 24–48 hours of contract execution.'],
                ['Flat-Rate Pricing', 'No hourly billing, no marketplace markup, no conversion fee. Six transparent tiers from $4K to $22.5K/month.'],
                ['14-Day Cancellation', 'Cancel any monthly engagement with 14 days notice and no penalty. No lock-in.'],
                ['150,000+ Global Network', 'Beyond the 25K Ivy League C-suite network, we can tap 150K+ scientists, engineers, and ex-military for any specialized need.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-4">
                  <span className="text-[#B01C24] font-bold flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">{title}:</span>
                    <span className="text-slate-600 dark:text-slate-400 text-sm ml-1">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {guideFaqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">Ready to Deploy?</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Start with a $1,500 Executive Diagnostic — 3 hours, written brief, no commitment.
            </p>
            <a href="/services/executive-diagnostic" className="btn-crimson w-full text-center block mb-3 text-sm">Book a $1,500 Diagnostic</a>
            <a href="/contact" className="btn-outline w-full text-center block text-sm py-2">Deploy in 48 Hours →</a>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Other Hiring Guides</p>
            <ul className="space-y-2">
              {otherRoles.map(r => (
                <li key={r.key}>
                  <a href={`/guides/how-to-hire/${r.key}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
                    How to Hire a Fractional {r.title} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Hire a Fractional ${role.title} in 48 Hours`} />
    </>
  )
}
