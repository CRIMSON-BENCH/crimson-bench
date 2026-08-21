import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRO_TOOLS, PRO_TOOL_CATEGORIES } from '@/lib/pro-tools'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function generateStaticParams() {
  return PRO_TOOL_CATEGORIES.map(c => ({ slug: slugify(c) }))
}

function catFromSlug(slug: string) {
  return PRO_TOOL_CATEGORIES.find(c => slugify(c) === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = catFromSlug(slug)
  if (!cat) return {}
  const n = PRO_TOOLS.filter(t => t.category === cat).length
  return {
    title: `${cat} Simulators & Models — ${n} Tools | The Crimson Bench`,
    description: `${n} interactive ${cat.toLowerCase()} simulators and financial models — projections, scenarios, and exports. Built by Ivy League operators.`,
    alternates: { canonical: `/pro-tools/category/${slug}` },
  }
}

export default async function ProCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = catFromSlug(slug)
  if (!cat) notFound()
  const tools = PRO_TOOLS.filter(t => t.category === cat)
  const others = PRO_TOOL_CATEGORIES.filter(c => c !== cat)

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Toolkit Pro', url: 'https://www.crimsonbench.com/pro-tools' },
        { name: cat, url: `https://www.crimsonbench.com/pro-tools/category/${slug}` },
      ])} />
      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Toolkit Pro', href: '/pro-tools' },
        { name: cat, href: `/pro-tools/category/${slug}` },
      ]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">{tools.length} Simulators · {cat}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4">
            {cat} Simulators &amp; Models
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {tools.length} interactive {cat.toLowerCase()} models — project the full trajectory, compare scenarios, and export the results. Built by Ivy League operators.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {tools.map(t => (
            <a key={t.id} href={`/pro-tools/${t.id}`} className="bg-white dark:bg-slate-950 p-5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#B01C24] transition-colors">{t.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{t.tagline}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-4">Browse other categories</h2>
        <div className="flex flex-wrap gap-2">
          {others.map(c => (
            <a key={c} href={`/pro-tools/category/${slugify(c)}`} className="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#B01C24] hover:text-[#B01C24] transition-colors">{c}</a>
          ))}
        </div>
      </section>

      <CTABlock heading="Unlock every simulator with Toolkit Pro" />
    </>
  )
}
