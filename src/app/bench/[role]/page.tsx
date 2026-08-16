import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ROLES, getRoleByKey, getAllRoleSlugs } from '@/lib/roles'
import { STATES } from '@/lib/states'
import { INDUSTRIES } from '@/lib/industries'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, productSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return getAllRoleSlugs().map(key => ({ role: key }))
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role: roleKey } = await params
  const role = getRoleByKey(roleKey)
  if (!role) return {}
  return {
    title: `Fractional ${role.title} — ${role.fullTitle} | The Crimson Bench`,
    description: `Ivy League-educated fractional ${role.fullTitle} deployed within 48 hours. 25,000+ credentialed executives. Flat-rate pricing from $4,000/month. Founded in New York City, est. 2002. ${role.tagline}.`,
    alternates: { canonical: `/bench/${role.key}` },
  }
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleKey } = await params
  const role = getRoleByKey(roleKey)
  if (!role) notFound()

  const otherRoles = ROLES.filter(r => r.key !== role.key).slice(0, 4)
  const topStates = STATES.slice(0, 10)
  const topIndustries = INDUSTRIES.filter(i => i.topRoles.includes(role.key)).slice(0, 8)

  return (
    <>
      <JsonLd data={faqSchema(role.faqs)} />
      <JsonLd data={productSchema(`Fractional ${role.title}`, role.description, 4000, '/month')} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'The Bench', url: 'https://www.crimsonbench.com/bench' },
        { name: `Fractional ${role.title}`, url: `https://www.crimsonbench.com/bench/${role.key}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'The Bench', href: '/bench' },
        { name: `Fractional ${role.title}`, href: `/bench/${role.key}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{role.title} · {role.tagline}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Fractional {role.fullTitle}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            {role.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">Deploy a Fractional {role.title} →</a>
            <a href="/services/executive-diagnostic" className="btn-outline py-3 px-6">Start with a $1,500 Diagnostic</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ['48 hours', 'Deployment SLA'],
            ['25,000+', 'Ivy League Executives'],
            ['100%', 'Credential-Verified'],
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
        <div className="md:col-span-2 space-y-14">
          {/* Responsibilities */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              What a Fractional {role.title} Does
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
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
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

          {/* Outcomes */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Outcomes From Our {role.title} Mandates
            </h2>
            <ul className="space-y-3">
              {role.outcomes.map(o => (
                <li key={o} className="flex gap-3 text-slate-600 dark:text-slate-400">
                  <span className="text-[#B01C24] font-bold flex-shrink-0">✓</span>
                  <span>{o}</span>
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
              {role.faqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* By industry */}
          {topIndustries.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
                Fractional {role.title} by Industry
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {topIndustries.map(ind => (
                  <a
                    key={ind.slug}
                    href={`/fractional/${role.key}/industries/${ind.slug}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors py-1 border-b border-slate-100 dark:border-slate-800"
                  >
                    Fractional {role.title} for {ind.name} →
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* By state */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Fractional {role.title} by Location
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {topStates.map(s => (
                <a
                  key={s.slug}
                  href={`/fractional/${role.key}/${s.slug}`}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors py-1 border-b border-slate-100 dark:border-slate-800"
                >
                  Fractional {role.title} in {s.name} →
                </a>
              ))}
            </div>
            <a href={`/fractional/${role.key}`} className="text-sm text-[#B01C24] font-mono uppercase tracking-wider mt-4 inline-block">
              View All States →
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">Deploy Now</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Ivy League-educated. Deployed in 48 hours. Flat-rate pricing. 14-day cancellation.
            </p>
            <a href="/contact" className="btn-crimson w-full text-center block mb-3">Deploy a Fractional {role.title}</a>
            <a href="/services/executive-diagnostic" className="btn-outline w-full text-center block text-sm py-2">
              Start with a $1,500 Diagnostic
            </a>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Other Roles</p>
            <ul className="space-y-2">
              {otherRoles.map(r => (
                <li key={r.key}>
                  <a href={`/bench/${r.key}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
                    Fractional {r.title} →
                  </a>
                </li>
              ))}
              <li>
                <a href="/bench" className="text-sm text-[#B01C24] font-mono uppercase tracking-wider">View All →</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Deploy a Fractional ${role.title} in 48 Hours`} />
    </>
  )
}
