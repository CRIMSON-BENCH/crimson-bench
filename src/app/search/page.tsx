import type { Metadata } from 'next'
import { TOOLS } from '@/lib/tools'
import { PRO_TOOLS } from '@/lib/pro-tools'
import { DIGITAL_PRODUCTS } from '@/lib/digital-products'
import { MEGA_SIMS } from '@/lib/mega-sims'
import SearchClient, { type SearchItem } from '@/components/SearchClient'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'Search — Tools, Toolkits & Models | The Crimson Bench',
  description: 'Search every free tool, Pro simulator, Excel toolkit, and end-to-end company model from The Crimson Bench.',
  alternates: { canonical: '/search' },
}

export default function SearchPage() {
  // Build a slim, function-free index at build time (only plain strings ship to the client).
  const index: SearchItem[] = [
    ...TOOLS.map(t => ({ type: 'tool', name: t.name, tagline: t.tagline, category: t.category, url: `/tools/${t.id}` })),
    ...PRO_TOOLS.map(t => ({ type: 'sim', name: t.name, tagline: t.tagline, category: t.category, url: `/pro-tools/${t.id}` })),
    ...DIGITAL_PRODUCTS.filter(p => !p.industry).map(p => ({ type: 'product', name: p.name, tagline: p.tagline, category: p.category, url: `/digital-products/${p.id}` })),
    ...MEGA_SIMS.map(m => ({ type: 'model', name: m.name.replace(' — End-to-End Operating Model', ''), tagline: m.tagline, category: m.category, url: `/enterprise/${m.id}` })),
  ]

  return (
    <>
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Search', href: '/search' }]} />
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 dark:text-white mb-2">Search everything</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Every free tool, Pro simulator, Excel toolkit, and company model in one place.</p>
        <SearchClient index={index} />
      </section>
    </>
  )
}
