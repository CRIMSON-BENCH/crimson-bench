import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { STATES, getStateBySlug, getAllStateSlugs } from '@/lib/states'
import { ROLES } from '@/lib/roles'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return getAllStateSlugs().map(slug => ({ state: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = getStateBySlug(stateSlug)
  if (!state) return {}
  return {
    title: `Executive Resources for ${state.name} Companies | The Crimson Bench`,
    description: `C-suite resources, fractional executive guides, and deployment information for companies in ${state.name}. The Crimson Bench — 25,000+ Ivy League executives, 48-hour deployment, est. 2002.`,
    alternates: { canonical: `/resources/${state.slug}` },
  }
}

export default async function StateResourcePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params
  const state = getStateBySlug(stateSlug)
  if (!state) notFound()

  const otherStates = STATES.filter(s => s.slug !== stateSlug).slice(0, 8)

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Resources', url: 'https://www.crimsonbench.com/resources' },
        { name: state.name, url: `https://www.crimsonbench.com/resources/${state.slug}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Resources', href: '/resources' },
        { name: state.name, href: `/resources/${state.slug}` },
      ]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{state.name} · Executive Resources</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            C-Suite Executive Resources for {state.name} Companies
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Guides, cost comparisons, and deployment information for companies in {state.name} seeking fractional executive leadership. Capital: {state.capital}. Major business hub: {state.majorCity}.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 mb-12">
          {ROLES.map(role => (
            <div key={role.key} className="bg-white dark:bg-slate-950 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">{role.title}</p>
              <h2 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-3">{role.fullTitle}</h2>
              <ul className="space-y-1">
                <li>
                  <a href={`/fractional/${role.key}/${state.slug}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
                    Fractional {role.title} in {state.name} →
                  </a>
                </li>
                <li>
                  <a href={`/cost/${role.key}/${state.slug}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
                    {role.title} Cost in {state.name} →
                  </a>
                </li>
                {state.businessHubs.slice(0, 2).map(hub => (
                  <li key={hub}>
                    <a href={`/fractional/${role.key}/${state.slug}/${hub.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">
                      Fractional {role.title} in {hub} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">About {state.name} Business</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {state.name} (population {state.population.toLocaleString()}) is home to major business hubs including {state.businessHubs.join(', ')}. Companies in {state.name} — from early-stage startups to PE-backed growth companies — rely on The Crimson Bench for fractional C-suite leadership deployed within 48 hours at flat-rate pricing.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The Crimson Bench's 25,000+ Ivy League-educated executives and 150,000+ global consultants are deployed remotely, with in-person availability for {state.name}-area engagements. No location markup. Founded in New York City, est. 2002.
          </p>
        </div>
      </div>

      <CTABlock heading={`Deploy a C-Suite Executive to ${state.name}`} />
    </>
  )
}
