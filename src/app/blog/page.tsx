import type { Metadata } from 'next'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'Blog — Executive Leadership Insights | The Crimson Bench',
  description:
    'Articles on fractional executive leadership, C-suite strategy, and organizational growth from The Crimson Bench — 24,000+ mandates, est. 2002, New York City.',
  alternates: { canonical: '/blog' },
}

const CATEGORIES = [
  { slug: 'strategy', name: 'CEO Strategy', description: 'Growth strategy, scaling, and organizational leadership' },
  { slug: 'finance', name: 'CFO Insights', description: 'Financial leadership, fundraising, and capital strategy' },
  { slug: 'technology', name: 'CTO Insights', description: 'Technology leadership, AI, and digital transformation' },
  { slug: 'operations', name: 'Operations', description: 'COO-level operational excellence and scaling systems' },
  { slug: 'people', name: 'People Operations', description: 'Talent strategy, culture, compensation, and HR leadership' },
]

export default function BlogPage() {
  return (
    <>
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">Executive Insights · Est. 2002</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            The Crimson Bench Blog
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Insights on fractional executive leadership, C-suite strategy, and organizational growth from the team behind 24,000+ mandates.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {CATEGORIES.map(cat => (
              <a key={cat.slug} href={`/blog/${cat.slug}`} className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                <h3 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-2 group-hover:text-[#B01C24] transition-colors">{cat.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{cat.description}</p>
                <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Read Articles →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
