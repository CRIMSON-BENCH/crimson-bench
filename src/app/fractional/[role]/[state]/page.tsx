import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoleByKey, getAllRoleSlugs } from '@/lib/roles'
import { getStateBySlug, getAllStateSlugs, STATES } from '@/lib/states'
import { getCitiesByState } from '@/lib/cities'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, localBusinessSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const params: { role: string; state: string }[] = []
  for (const role of getAllRoleSlugs()) {
    for (const state of getAllStateSlugs()) {
      params.push({ role, state })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ role: string; state: string }> }): Promise<Metadata> {
  const { role: roleKey, state: stateSlug } = await params
  const role = getRoleByKey(roleKey)
  const state = getStateBySlug(stateSlug)
  if (!role || !state) return {}
  return {
    title: `Fractional ${role.title} in ${state.name} | The Crimson Bench`,
    description: `Ivy League-educated fractional ${role.fullTitle} deployed to companies in ${state.name} within 48 hours. 25,000+ credentialed executives. Flat-rate pricing. The Crimson Bench — founded in NYC, est. 2002.`,
    alternates: { canonical: `/fractional/${role.key}/${state.slug}` },
  }
}

export default async function RoleStatePage({ params }: { params: Promise<{ role: string; state: string }> }) {
  const { role: roleKey, state: stateSlug } = await params
  const role = getRoleByKey(roleKey)
  const state = getStateBySlug(stateSlug)
  if (!role || !state) notFound()

  const cities = getCitiesByState(stateSlug).slice(0, 20)
  const otherStates = STATES.filter(s => s.slug !== stateSlug).slice(0, 8)

  const stateFaqs = [
    {
      q: `How quickly can The Crimson Bench deploy a fractional ${role.title} in ${state.name}?`,
      a: `The Crimson Bench deploys within 48 hours of engagement authorization — whether you are in ${state.majorCity}, ${state.businessHubs[1] ?? state.capital}, or anywhere else in ${state.name}. Our executives operate remotely by default and can be on-site for key meetings as needed.`,
    },
    {
      q: `What does a fractional ${role.title} cost in ${state.name}?`,
      a: `The Crimson Bench charges flat monthly rates regardless of location. Our Advisory Retainer starts at $4,000/month, our Scale-Up Fractional (1 day/week) is $7,500/month, and our Growth Fractional (2 days/week) is $12,500/month. This is significantly below the cost of a full-time ${role.fullTitle} in ${state.name} — which typically ranges from $180,000 to $400,000+ in annual compensation.`,
    },
    {
      q: `Does The Crimson Bench serve companies across all of ${state.name}?`,
      a: `Yes. We deploy executives to companies throughout ${state.name} — including ${state.businessHubs.join(', ')}. Our executives work primarily remotely with in-person availability for board meetings, leadership offsites, and critical on-site requirements.`,
    },
    {
      q: `What industries does The Crimson Bench serve in ${state.name}?`,
      a: `We serve companies across all industries in ${state.name} — including technology, healthcare, manufacturing, financial services, professional services, real estate, and nonprofit organizations. Our executives have deep experience in the industries most prominent in ${state.name}'s economy.`,
    },
  ]

  return (
    <>
      <JsonLd data={localBusinessSchema({ role: role.title, city: state.majorCity, state: state.name, stateAbbr: state.abbr })} />
      <JsonLd data={faqSchema(stateFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'The Bench', url: 'https://www.crimsonbench.com/bench' },
        { name: `Fractional ${role.title}`, url: `https://www.crimsonbench.com/bench/${role.key}` },
        { name: state.name, url: `https://www.crimsonbench.com/fractional/${role.key}/${state.slug}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'The Bench', href: '/bench' },
        { name: `Fractional ${role.title}`, href: `/bench/${role.key}` },
        { name: state.name, href: `/fractional/${role.key}/${state.slug}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{state.name} · {role.tagline}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Fractional {role.fullTitle} in {state.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            The Crimson Bench deploys Ivy League-educated fractional {role.fullTitle}s to companies in {state.name} within 48 hours. Flat-rate pricing. 14-day no-cause cancellation. Founded in New York City, est. 2002.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">Deploy a Fractional {role.title} in {state.name} →</a>
            <a href="/services/executive-diagnostic" className="btn-outline py-3 px-6">Start with a $1,500 Diagnostic</a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* About the state */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              Fractional {role.title} Services in {state.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {state.name} is home to a diverse economy spanning {state.businessHubs.join(', ')} and beyond. Companies in {state.name} — from early-stage startups to PE-backed growth companies to established family-owned businesses — face the same C-suite leadership challenges that Crimson Bench executives have solved across 24,000+ mandates since 2002.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              A fractional {role.fullTitle} from The Crimson Bench delivers {role.tagline.toLowerCase()} for {state.name} companies without the cost of a full-time hire. Our {state.name} clients gain access to Ivy League-educated executive talent on a flexible engagement schedule — from 2 advisory calls per month to 3+ days per week of embedded leadership — at transparent flat-rate pricing.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether your company is headquartered in {state.majorCity} or operates across {state.name}, The Crimson Bench deploys within 48 hours of engagement authorization. No sourcing period. No marketplace browsing. An Ivy League-educated {role.fullTitle} in your first leadership meeting within the first week.
            </p>
          </div>

          {/* What they do */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              What a Fractional {role.title} Does for {state.name} Companies
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

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {stateFaqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cities */}
          {cities.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
                Fractional {role.title} in {state.name} Cities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cities.map(city => (
                  <a
                    key={city.slug}
                    href={`/fractional/${role.key}/${state.slug}/${city.slug}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors py-1 border-b border-slate-100 dark:border-slate-800"
                  >
                    {city.name} →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">Deploy in {state.abbr}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Ivy League-educated. 48-hour deployment. Flat-rate pricing.
            </p>
            <a href="/contact" className="btn-crimson w-full text-center block mb-3 text-sm">Deploy a Fractional {role.title}</a>
            <a href="/services/executive-diagnostic" className="btn-outline w-full text-center block text-sm py-2">$1,500 Diagnostic</a>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Other States</p>
            <ul className="space-y-2">
              {otherStates.map(s => (
                <li key={s.slug}>
                  <a href={`/fractional/${role.key}/${s.slug}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
                    {s.name} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Deploy a Fractional ${role.title} in ${state.name}`} />
    </>
  )
}
