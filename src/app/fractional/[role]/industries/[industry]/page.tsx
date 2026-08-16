import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoleByKey, getAllRoleSlugs } from '@/lib/roles'
import { INDUSTRIES, getIndustryBySlug, getAllIndustrySlugs } from '@/lib/industries'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const params: { role: string; industry: string }[] = []
  for (const role of getAllRoleSlugs()) {
    for (const industry of getAllIndustrySlugs()) {
      params.push({ role, industry })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string; industry: string }>
}): Promise<Metadata> {
  const { role: roleKey, industry: industrySlug } = await params
  const role = getRoleByKey(roleKey)
  const industry = getIndustryBySlug(industrySlug)
  if (!role || !industry) return {}
  return {
    title: `Fractional ${role.title} for ${industry.name} Companies | The Crimson Bench`,
    description: `Ivy League-educated fractional ${role.fullTitle} for ${industry.name} companies. Deployed within 48 hours. Flat-rate pricing. 14-day cancellation. The Crimson Bench — founded in NYC, est. 2002.`,
    alternates: { canonical: `/fractional/${role.key}/industries/${industry.slug}` },
  }
}

export default async function RoleIndustryPage({
  params,
}: {
  params: Promise<{ role: string; industry: string }>
}) {
  const { role: roleKey, industry: industrySlug } = await params
  const role = getRoleByKey(roleKey)
  const industry = getIndustryBySlug(industrySlug)
  if (!role || !industry) notFound()

  const relatedIndustries = INDUSTRIES.filter(
    i => i.slug !== industry.slug && i.topRoles.includes(role.key)
  ).slice(0, 6)

  const industryFaqs = [
    {
      q: `Why do ${industry.name} companies hire fractional ${role.title}s?`,
      a: `${industry.name} companies face specific C-suite leadership challenges — from regulatory complexity to capital-intensive cycles to specialized talent markets. A fractional ${role.fullTitle} from The Crimson Bench brings Ivy League-educated executive capability scaled to the exact time commitment you need, without the cost of a full-time hire.`,
    },
    {
      q: `What does a fractional ${role.title} do for ${industry.name} companies?`,
      a: `In ${industry.name}, a fractional ${role.fullTitle} typically focuses on: ${role.responsibilities.slice(0, 3).join('; ')}. The specific mandate is tailored to your company's stage, competitive landscape, and ${industry.name}-specific challenges.`,
    },
    {
      q: `How quickly can a fractional ${role.title} be deployed to a ${industry.name} company?`,
      a: `The Crimson Bench deploys within 48 hours of engagement authorization — faster than any traditional executive search or marketplace alternative. Our ${industry.name} executives are pre-vetted and on-call.`,
    },
    {
      q: `What does a fractional ${role.title} for a ${industry.name} company cost?`,
      a: `Our flat-rate monthly engagement tiers range from $4,000/month (Advisory Retainer) to $22,500/month (Embedded Executive, 3+ days/week). This is a fraction of the cost of a full-time ${role.fullTitle} in ${industry.name}, which typically runs $200,000–$450,000+ annually.`,
    },
  ]

  return (
    <>
      <JsonLd data={faqSchema(industryFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'The Bench', url: 'https://www.crimsonbench.com/bench' },
        { name: `Fractional ${role.title}`, url: `https://www.crimsonbench.com/bench/${role.key}` },
        { name: industry.name, url: `https://www.crimsonbench.com/fractional/${role.key}/industries/${industry.slug}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'The Bench', href: '/bench' },
        { name: `Fractional ${role.title}`, href: `/bench/${role.key}` },
        { name: industry.name, href: `/fractional/${role.key}/industries/${industry.slug}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{industry.name} · {role.tagline}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Fractional {role.fullTitle} for {industry.name} Companies
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            {industry.description} The Crimson Bench deploys Ivy League-educated fractional {role.fullTitle}s to {industry.name} companies within 48 hours.
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
              What a Fractional {role.title} Does for {industry.name} Companies
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {industry.name} companies face unique leadership challenges at the {role.title} level. The Crimson Bench has deployed fractional {role.fullTitle}s into {industry.name} organizations across 24,000+ mandates since 2002 — from early-stage companies seeking their first executive to PE-backed portfolio companies navigating high-stakes growth cycles.
            </p>
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
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
              When to Hire a Fractional {role.title} for Your {industry.name} Company
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

          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {industryFaqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {relatedIndustries.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">
                Fractional {role.title} for Related Industries
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {relatedIndustries.map(ind => (
                  <a
                    key={ind.slug}
                    href={`/fractional/${role.key}/industries/${ind.slug}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors py-1 border-b border-slate-100 dark:border-slate-800"
                  >
                    {ind.name} →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">Deploy Now</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              48-hour deployment. Ivy League-educated. Flat-rate pricing.
            </p>
            <a href="/contact" className="btn-crimson w-full text-center block mb-3 text-sm">Deploy a Fractional {role.title}</a>
            <a href="/services/executive-diagnostic" className="btn-outline w-full text-center block text-sm py-2">$1,500 Diagnostic</a>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Deploy a Fractional ${role.title} for Your ${industry.name} Company`} />
    </>
  )
}
