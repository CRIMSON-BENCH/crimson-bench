import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoleByKey, getAllRoleSlugs } from '@/lib/roles'
import { STATES } from '@/lib/states'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return getAllRoleSlugs().map(key => ({ role: key }))
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role: roleKey } = await params
  const role = getRoleByKey(roleKey)
  if (!role) return {}
  return {
    title: `Fractional ${role.title} — All 50 States | The Crimson Bench`,
    description: `Deploy a fractional ${role.fullTitle} anywhere in the US — all 50 states, 1,500+ cities. Ivy League-educated, deployed within 48 hours, flat-rate pricing. The Crimson Bench — est. 2002, New York City.`,
    alternates: { canonical: `/fractional/${role.key}` },
  }
}

export default async function RoleOverviewPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleKey } = await params
  const role = getRoleByKey(roleKey)
  if (!role) notFound()

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'The Bench', url: 'https://www.crimsonbench.com/bench' },
        { name: `Fractional ${role.title}`, url: `https://www.crimsonbench.com/fractional/${role.key}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'The Bench', href: '/bench' },
        { name: `Fractional ${role.title}`, href: `/fractional/${role.key}` },
      ]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">All Locations · 48-Hour Deployment</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Fractional {role.fullTitle} — All 50 States
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            The Crimson Bench deploys Ivy League-educated fractional {role.fullTitle}s to companies across all 50 US states within 48 hours. Flat-rate pricing — no location markup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">Deploy a Fractional {role.title} →</a>
            <a href={`/bench/${role.key}`} className="btn-outline py-3 px-6">Learn About {role.title} Mandates</a>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">
            Fractional {role.title} by State
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {STATES.map(state => (
              <a
                key={state.slug}
                href={`/fractional/${role.key}/${state.slug}`}
                className="border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:border-[#B01C24] hover:text-[#B01C24] transition-colors group"
              >
                <span className="font-mono text-[9px] tracking-widest uppercase text-slate-400 group-hover:text-[#B01C24] block mb-0.5">{state.abbr}</span>
                {state.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock heading={`Deploy a Fractional ${role.title} Anywhere in the US`} />
    </>
  )
}
