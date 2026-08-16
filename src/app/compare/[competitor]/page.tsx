import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COMPETITORS, getCompetitorBySlug, getAllCompetitorSlugs } from '@/lib/competitors'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return getAllCompetitorSlugs().map(slug => ({ competitor: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
  const { competitor: slug } = await params
  const comp = getCompetitorBySlug(slug)
  if (!comp) return {}
  return {
    title: `The Crimson Bench vs. ${comp.name} — Full Comparison | The Crimson Bench`,
    description: `Detailed comparison: The Crimson Bench vs. ${comp.name}. Pricing model, deployment time, Ivy League credentials, cancellation policy, and which is better for your company.`,
    alternates: { canonical: `/compare/${comp.slug}` },
  }
}

export default async function CompetitorPage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor: slug } = await params
  const comp = getCompetitorBySlug(slug)
  if (!comp) notFound()

  const otherComps = COMPETITORS.filter(c => c.slug !== comp.slug).slice(0, 5)

  const compFaqs = [
    {
      q: `How does The Crimson Bench compare to ${comp.name} on pricing?`,
      a: `The Crimson Bench uses flat-rate monthly pricing — no marketplace markup, no hourly billing, no conversion fee. ${comp.name} uses ${comp.pricing}. For most companies, The Crimson Bench's total cost of engagement is lower because there are no hidden fees and no rate inflation from marketplace overhead.`,
    },
    {
      q: `Is ${comp.name} or The Crimson Bench faster to deploy?`,
      a: `The Crimson Bench deploys within 48 hours of engagement authorization. ${comp.name}'s typical deployment is ${comp.deploymentTime}. If time-to-deployment matters for your situation — a leadership gap, a board meeting, a crisis — The Crimson Bench is the faster option.`,
    },
    {
      q: `Does ${comp.name} offer Ivy League-educated executives?`,
      a: comp.ivyLeague
        ? `${comp.name} does include some Ivy League-educated executives in its network, but does not guarantee Ivy League credentials as a baseline for every engagement. The Crimson Bench guarantees that every C-suite executive on our bench holds an Ivy League degree — this is a firm standard, not a search filter.`
        : `${comp.name} does not guarantee Ivy League credentials and does not publicly verify the educational background of executives in its network. The Crimson Bench guarantees every C-suite executive holds an Ivy League degree — this is verified before deployment, not claimed retroactively.`,
    },
    {
      q: `When should I choose ${comp.name} over The Crimson Bench?`,
      a: `${comp.bestFor}. In all other cases — particularly when you need Ivy League credentials guaranteed, 48-hour deployment, flat-rate pricing, and flexible cancellation — The Crimson Bench is the stronger choice.`,
    },
  ]

  const CB_WINS = [
    { label: 'Ivy League Guarantee', us: true, them: comp.ivyLeague },
    { label: '48-Hour Deployment', us: true, them: comp.deploymentTime === '48 hours' },
    { label: 'Flat-Rate Pricing', us: true, them: comp.flatRate },
    { label: '14-Day Cancellation', us: true, them: false },
    { label: '150K+ Consultant Pool', us: true, them: false },
    { label: 'US-Only Network', us: false, them: comp.usOnly },
    { label: 'Founded Before 2010', us: true, them: false },
  ]

  return (
    <>
      <JsonLd data={faqSchema(compFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Compare', url: 'https://www.crimsonbench.com/compare' },
        { name: `vs. ${comp.name}`, url: `https://www.crimsonbench.com/compare/${comp.slug}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Compare', href: '/compare' },
        { name: `vs. ${comp.name}`, href: `/compare/${comp.slug}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">Competitor Comparison</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6">
            The Crimson Bench vs. {comp.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            A detailed, objective comparison of two fractional executive firms — pricing models, deployment
            times, credential standards, and which is the right fit for your company.
          </p>
          <a href="/contact" className="btn-crimson py-3 px-6">Deploy with The Crimson Bench →</a>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Head-to-head table */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Head-to-Head Comparison
            </h2>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 font-mono text-xs tracking-wide uppercase text-slate-500">
                      Feature
                    </th>
                    <th className="text-center py-3 px-4 font-mono text-xs tracking-wide uppercase text-[#B01C24]">
                      The Crimson Bench
                    </th>
                    <th className="text-center py-3 px-4 font-mono text-xs tracking-wide uppercase text-slate-500">
                      {comp.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Business Model', 'Consulting firm', comp.model],
                    ['Pricing Model', 'Flat-rate monthly', comp.pricing],
                    ['Deployment Time', '48 hours', comp.deploymentTime],
                    ['Ivy League Guarantee', 'Yes — all C-suite', comp.ivyLeague ? 'Partial' : 'No'],
                    ['Cancellation', '14-day notice', comp.cancellationPolicy],
                    ['Network Size', '25K exec / 150K total', 'N/A'],
                    ['Founded', '2002 · New York City', 'N/A'],
                  ].map(([label, us, them]) => (
                    <tr key={String(label)} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium text-xs">{String(label)}</td>
                      <td className="py-3 px-4 text-center text-[#B01C24] text-xs font-semibold">{String(us)}</td>
                      <td className="py-3 px-4 text-center text-slate-500 text-xs">{String(them)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              Our Verdict
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{comp.verdictVsCrimson}</p>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-4">
                {comp.name} Strengths
              </h3>
              <ul className="space-y-3">
                {comp.strengths.map(s => (
                  <li key={s} className="flex gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <span className="text-emerald-500 font-bold flex-shrink-0">+</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-4">
                {comp.name} Weaknesses
              </h3>
              <ul className="space-y-3">
                {comp.weaknesses.map(w => (
                  <li key={w} className="flex gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <span className="text-red-400 font-bold flex-shrink-0">−</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* When to choose */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-[#B01C24]/30 bg-[#B01C24]/5 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-3">Choose The Crimson Bench When</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {[
                  'Ivy League credentials are non-negotiable',
                  'You need someone in 48 hours or less',
                  'You want flat-rate pricing with no surprises',
                  'Flexible 14-day cancellation matters',
                  'You need scientists, engineers, or ex-military alongside C-suite',
                  'You want a consulting firm, not a marketplace',
                ].map(i => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#B01C24]">✓</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">Consider {comp.name} When</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{comp.bestFor}</p>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {compFaqs.map(f => (
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
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">The Crimson Bench</p>
            <ul className="space-y-2 mb-6">
              {CB_WINS.filter(r => r.us).map(r => (
                <li key={r.label} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="text-[#B01C24]">✓</span>
                  {r.label}
                </li>
              ))}
            </ul>
            <a href="/contact" className="btn-crimson w-full text-center block mb-3 text-sm">Deploy an Executive →</a>
            <a href="/pricing" className="btn-outline w-full text-center block text-sm py-2">View Pricing</a>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">More Comparisons</p>
            <ul className="space-y-2">
              {otherComps.map(c => (
                <li key={c.slug}>
                  <a href={`/compare/${c.slug}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
                    vs. {c.name} →
                  </a>
                </li>
              ))}
            </ul>
            <a href="/compare" className="text-xs text-[#B01C24] font-mono uppercase tracking-wider mt-4 inline-block">All Comparisons →</a>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Why Companies Choose The Crimson Bench Over ${comp.name}`} />
    </>
  )
}
