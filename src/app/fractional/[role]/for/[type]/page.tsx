import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoleByKey, getAllRoleSlugs } from '@/lib/roles'
import { COMPANY_TYPES, getCompanyTypeBySlug, getAllCompanyTypeSlugs } from '@/lib/company-types'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const params: { role: string; type: string }[] = []
  for (const role of getAllRoleSlugs()) {
    for (const type of getAllCompanyTypeSlugs()) {
      params.push({ role, type })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string; type: string }>
}): Promise<Metadata> {
  const { role: roleKey, type: typeSlug } = await params
  const role = getRoleByKey(roleKey)
  const companyType = getCompanyTypeBySlug(typeSlug)
  if (!role || !companyType) return {}
  return {
    title: `Fractional ${role.title} for ${companyType.name} | The Crimson Bench`,
    description: `Ivy League-educated fractional ${role.fullTitle} for ${companyType.name.toLowerCase()}. Deployed within 48 hours. Flat-rate pricing. The Crimson Bench — founded in NYC, est. 2002.`,
    alternates: { canonical: `/fractional/${role.key}/for/${companyType.slug}` },
  }
}

export default async function RoleCompanyTypePage({
  params,
}: {
  params: Promise<{ role: string; type: string }>
}) {
  const { role: roleKey, type: typeSlug } = await params
  const role = getRoleByKey(roleKey)
  const companyType = getCompanyTypeBySlug(typeSlug)
  if (!role || !companyType) notFound()

  const relatedTypes = COMPANY_TYPES.filter(t => t.slug !== companyType.slug && t.topRoles.includes(role.key)).slice(0, 4)

  const typeFaqs = [
    {
      q: `Why do ${companyType.name.toLowerCase()} hire fractional ${role.title}s?`,
      a: `${companyType.description} A fractional ${role.fullTitle} from The Crimson Bench provides Ivy League-educated C-suite leadership without the cost or commitment of a full-time hire — typically costing $200,000–$450,000+ annually including equity and benefits.`,
    },
    {
      q: `What are the typical pain points a fractional ${role.title} solves for ${companyType.name.toLowerCase()}?`,
      a: `${companyType.painPoints.join('. ')}.`,
    },
    {
      q: `How quickly can The Crimson Bench deploy a fractional ${role.title} for our ${companyType.name.toLowerCase()}?`,
      a: `The Crimson Bench deploys within 48 hours of engagement authorization. No sourcing period. No candidate browsing. An Ivy League-educated ${role.fullTitle} in your first leadership meeting within the first week.`,
    },
    {
      q: `What engagement model works best for ${companyType.name.toLowerCase()}?`,
      a: `Most ${companyType.name.toLowerCase()} start with our Advisory Retainer ($4,000/month, 2 sessions/month) or Scale-Up Fractional ($7,500/month, 1 day/week) — then scale up as the engagement deepens. ${companyType.typicalRevenue ? `Given the typical revenue range of ${companyType.typicalRevenue} for ${companyType.name.toLowerCase()}, the Advisory Retainer or Scale-Up tier is most common.` : ''}`,
    },
  ]

  return (
    <>
      <JsonLd data={faqSchema(typeFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'The Bench', url: 'https://www.crimsonbench.com/bench' },
        { name: `Fractional ${role.title}`, url: `https://www.crimsonbench.com/bench/${role.key}` },
        { name: companyType.name, url: `https://www.crimsonbench.com/fractional/${role.key}/for/${companyType.slug}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'The Bench', href: '/bench' },
        { name: `Fractional ${role.title}`, href: `/bench/${role.key}` },
        { name: companyType.name, href: `/fractional/${role.key}/for/${companyType.slug}` },
      ]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{companyType.name} · {role.tagline}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Fractional {role.fullTitle} for {companyType.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            {companyType.description} The Crimson Bench deploys Ivy League-educated fractional {role.fullTitle}s to {companyType.name.toLowerCase()} within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">Deploy a Fractional {role.title} →</a>
            <a href="/services/executive-diagnostic" className="btn-outline py-3 px-6">Start with a $1,500 Diagnostic</a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              Pain Points a Fractional {role.title} Solves
            </h2>
            <ul className="space-y-3">
              {companyType.painPoints.map(p => (
                <li key={p} className="flex gap-3 text-slate-600 dark:text-slate-400">
                  <span className="text-[#B01C24] font-bold flex-shrink-0">→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
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

          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {typeFaqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {relatedTypes.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
                Also For
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {relatedTypes.map(t => (
                  <a key={t.slug} href={`/fractional/${role.key}/for/${t.slug}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors py-1 border-b border-slate-100 dark:border-slate-800">
                    {t.name} →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">Deploy Now</p>
            <a href="/contact" className="btn-crimson w-full text-center block mb-3 text-sm">Deploy a Fractional {role.title}</a>
            <a href="/services/executive-diagnostic" className="btn-outline w-full text-center block text-sm py-2">$1,500 Diagnostic</a>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Deploy a Fractional ${role.title} for Your ${companyType.name}`} />
    </>
  )
}
