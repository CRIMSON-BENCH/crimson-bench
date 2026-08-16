import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoleByKey, getAllRoleSlugs } from '@/lib/roles'
import { getStateBySlug, getAllStateSlugs } from '@/lib/states'
import { getCityBySlug, getCitiesByState, getAllCitySlugs } from '@/lib/cities'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, localBusinessSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const params: { role: string; state: string; city: string }[] = []
  for (const role of getAllRoleSlugs()) {
    for (const stateSlug of getAllStateSlugs()) {
      const cities = getCitiesByState(stateSlug)
      for (const city of cities) {
        params.push({ role, state: stateSlug, city: city.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string; state: string; city: string }>
}): Promise<Metadata> {
  const { role: roleKey, state: stateSlug, city: citySlug } = await params
  const role = getRoleByKey(roleKey)
  const state = getStateBySlug(stateSlug)
  const city = getCityBySlug(citySlug)
  if (!role || !state || !city) return {}
  return {
    title: `Fractional ${role.title} in ${city.name}, ${state.abbr} | The Crimson Bench`,
    description: `Ivy League-educated fractional ${role.fullTitle} deployed to ${city.name}, ${state.name} companies within 48 hours. 25,000+ credentialed executives. Flat-rate pricing. The Crimson Bench — founded in NYC, est. 2002.`,
    alternates: { canonical: `/fractional/${role.key}/${state.slug}/${city.slug}` },
  }
}

export default async function RoleCityPage({
  params,
}: {
  params: Promise<{ role: string; state: string; city: string }>
}) {
  const { role: roleKey, state: stateSlug, city: citySlug } = await params
  const role = getRoleByKey(roleKey)
  const state = getStateBySlug(stateSlug)
  const city = getCityBySlug(citySlug)
  if (!role || !state || !city) notFound()

  const nearbyCities = getCitiesByState(stateSlug)
    .filter(c => c.slug !== city.slug)
    .slice(0, 6)

  const cityFaqs = [
    {
      q: `How quickly can The Crimson Bench deploy a fractional ${role.title} in ${city.name}?`,
      a: `The Crimson Bench deploys within 48 hours of engagement authorization — including to companies in ${city.name}, ${state.name}. Our executives operate remotely by default, with in-person availability for board meetings, all-hands, or critical on-site needs in the ${city.name} area.`,
    },
    {
      q: `What does a fractional ${role.title} cost for a ${city.name} company?`,
      a: `The Crimson Bench charges flat monthly rates with no location markup. Advisory Retainer: $4,000/month. Scale-Up Fractional (1 day/week): $7,500/month. Growth Fractional (2 days/week): $12,500/month. Embedded Executive (3+ days/week): $22,500/month. Compare this to a full-time ${role.fullTitle} in ${city.name}, which typically costs $200,000–$450,000+ annually in total compensation.`,
    },
    {
      q: `What is a fractional ${role.title} and does my ${city.name} company need one?`,
      a: `A fractional ${role.fullTitle} is an Ivy League-educated executive who provides C-suite leadership to your company on a part-time, contract basis. ${role.tagline}. Companies in ${city.name} hire fractional ${role.title}s when they need executive-level ${role.title.toLowerCase()} capability but cannot yet justify or afford a full-time hire — or need someone faster than a traditional search allows.`,
    },
    {
      q: `Can a fractional ${role.title} work on-site in ${city.name}?`,
      a: `Yes. While our engagements are designed to operate primarily remotely — leveraging async communication, structured weekly sessions, and digital-first operating cadences — our ${city.name}-area and ${state.name}-based executives can provide on-site presence for key moments including board presentations, leadership team offsites, key client meetings, and critical operational situations.`,
    },
  ]

  return (
    <>
      <JsonLd
        data={localBusinessSchema({
          role: role.title,
          city: city.name,
          state: state.name,
          stateAbbr: state.abbr,
        })}
      />
      <JsonLd data={faqSchema(cityFaqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: 'https://www.crimsonbench.com/' },
          { name: 'The Bench', url: 'https://www.crimsonbench.com/bench' },
          { name: `Fractional ${role.title}`, url: `https://www.crimsonbench.com/bench/${role.key}` },
          { name: state.name, url: `https://www.crimsonbench.com/fractional/${role.key}/${state.slug}` },
          {
            name: city.name,
            url: `https://www.crimsonbench.com/fractional/${role.key}/${state.slug}/${city.slug}`,
          },
        ])}
      />

      <Breadcrumb
        items={[
          { name: 'Home', href: '/' },
          { name: 'The Bench', href: '/bench' },
          { name: `Fractional ${role.title}`, href: `/bench/${role.key}` },
          { name: state.name, href: `/fractional/${role.key}/${state.slug}` },
          { name: city.name, href: `/fractional/${role.key}/${state.slug}/${city.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">
            {city.name}, {state.abbr} · {role.tagline}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Fractional {role.fullTitle} in {city.name}, {state.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            The Crimson Bench deploys Ivy League-educated fractional {role.fullTitle}s to companies in{' '}
            {city.name} within 48 hours. Flat-rate pricing. 14-day no-cause cancellation. No marketplace
            markup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">
              Deploy a Fractional {role.title} in {city.name} →
            </a>
            <a href="/services/executive-diagnostic" className="btn-outline py-3 px-6">
              Start with a $1,500 Diagnostic
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ['48 hours', 'Deployment SLA'],
            ['25,000+', 'Ivy League Executives'],
            ['Flat-Rate', 'No Location Markup'],
            ['14 days', 'No-Cause Cancellation'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-mono text-xl font-bold text-white tabular-nums">{n}</div>
              <div className="font-mono text-xs tracking-widest uppercase text-slate-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Body copy */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              Fractional {role.title} Services in {city.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Companies in {city.name}, {state.name} — from early-stage startups to PE-backed growth
              companies to family-owned businesses navigating succession — face the same C-suite leadership
              challenges that Crimson Bench executives have solved across 24,000+ mandates since 2002.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              A fractional {role.fullTitle} from The Crimson Bench delivers{' '}
              {role.tagline.toLowerCase()} for {city.name} companies without the cost or commitment of a
              full-time hire. Our engagements range from 2 advisory calls per month to 3+ embedded days per
              week — all at transparent flat-rate pricing with no location markup.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The Crimson Bench deploys within 48 hours of engagement authorization — no sourcing period, no
              candidate browsing. An Ivy League-educated {role.fullTitle} in your first leadership meeting
              within the first week.
            </p>
          </div>

          {/* What they do */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              What a Fractional {role.title} Does for {city.name} Companies
            </h2>
            <ul className="space-y-3">
              {role.responsibilities.map(r => (
                <li key={r} className="flex gap-3 text-slate-600 dark:text-slate-400">
                  <span className="text-[#B01C24] font-bold flex-shrink-0">◆</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* When to hire */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              When to Hire a Fractional {role.title}
            </h2>
            <ul className="space-y-3">
              {role.whenToHire.map(w => (
                <li key={w} className="flex gap-3 text-slate-600 dark:text-slate-400">
                  <span className="text-[#B01C24] font-bold flex-shrink-0">→</span>
                  <span>{w}</span>
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
              {cityFaqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby cities */}
          {nearbyCities.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
                Fractional {role.title} in Nearby {state.name} Cities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {nearbyCities.map(c => (
                  <a
                    key={c.slug}
                    href={`/fractional/${role.key}/${state.slug}/${c.slug}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors py-1 border-b border-slate-100 dark:border-slate-800"
                  >
                    {c.name} →
                  </a>
                ))}
              </div>
              <a
                href={`/fractional/${role.key}/${state.slug}`}
                className="text-sm text-[#B01C24] font-mono uppercase tracking-wider mt-4 inline-block"
              >
                All {state.name} Cities →
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">
              Deploy in {city.name}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Ivy League-educated. 48-hour deployment. No location markup.
            </p>
            <a
              href="/contact"
              className="btn-crimson w-full text-center block mb-3 text-sm"
            >
              Deploy a Fractional {role.title}
            </a>
            <a
              href="/services/executive-diagnostic"
              className="btn-outline w-full text-center block text-sm py-2"
            >
              $1,500 Diagnostic
            </a>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Pricing</p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex justify-between">
                <span>Advisory Retainer</span>
                <span className="font-mono text-[#B01C24]">$4K/mo</span>
              </li>
              <li className="flex justify-between">
                <span>Scale-Up (1 day/wk)</span>
                <span className="font-mono text-[#B01C24]">$7.5K/mo</span>
              </li>
              <li className="flex justify-between">
                <span>Growth (2 days/wk)</span>
                <span className="font-mono text-[#B01C24]">$12.5K/mo</span>
              </li>
              <li className="flex justify-between">
                <span>Embedded (3+ days/wk)</span>
                <span className="font-mono text-[#B01C24]">$22.5K/mo</span>
              </li>
            </ul>
            <a
              href="/pricing"
              className="text-xs text-[#B01C24] font-mono uppercase tracking-wider mt-4 inline-block"
            >
              View All 22 Products →
            </a>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Deploy a Fractional ${role.title} in ${city.name}`} />
    </>
  )
}
