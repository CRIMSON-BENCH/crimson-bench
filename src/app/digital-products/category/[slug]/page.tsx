import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CATEGORY_ORDER, CATEGORY_META, getDigitalProductsByCategory, formatDigitalPrice } from '@/lib/digital-products'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function generateStaticParams() {
  return CATEGORY_ORDER.map(c => ({ slug: slugify(c) }))
}

function catFromSlug(slug: string) {
  return CATEGORY_ORDER.find(c => slugify(c) === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = catFromSlug(slug)
  if (!cat) return {}
  const n = getDigitalProductsByCategory(cat).filter(p => !p.industry).length
  return {
    title: `${cat} Toolkits — ${n} Excel Toolkits | The Crimson Bench`,
    description: `${CATEGORY_META[cat] ?? ''} ${n} formula-driven Excel toolkits, instant download. Built by Ivy League operators.`,
    alternates: { canonical: `/digital-products/category/${slug}` },
  }
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = catFromSlug(slug)
  if (!cat) notFound()
  const products = getDigitalProductsByCategory(cat).filter(p => !p.industry)
  const others = CATEGORY_ORDER.filter(c => c !== cat)

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Toolkits', url: 'https://www.crimsonbench.com/digital-products' },
        { name: cat, url: `https://www.crimsonbench.com/digital-products/category/${slug}` },
      ])} />
      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Toolkits', href: '/digital-products' },
        { name: cat, href: `/digital-products/category/${slug}` },
      ]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">{products.length} Toolkits · {cat}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4">
            {cat} Toolkits
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {CATEGORY_META[cat] ?? `Formula-driven Excel toolkits for ${cat.toLowerCase()}.`}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {products.map(p => (
            <a key={p.id} href={`/digital-products/${p.id}`} className="bg-white dark:bg-slate-950 p-5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#B01C24] transition-colors">{p.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{p.tagline}</p>
              </div>
              <span className="font-mono text-xs text-[#B01C24] whitespace-nowrap mt-0.5">{formatDigitalPrice(p)}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-4">Browse other categories</h2>
        <div className="flex flex-wrap gap-2">
          {others.map(c => (
            <a key={c} href={`/digital-products/category/${slugify(c)}`} className="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#B01C24] hover:text-[#B01C24] transition-colors">{c}</a>
          ))}
        </div>
      </section>

      <CTABlock heading="Get every toolkit with Toolkit Pro" />
    </>
  )
}
