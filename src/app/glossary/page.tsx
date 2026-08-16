import type { Metadata } from 'next'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'Executive Leadership Glossary | The Crimson Bench',
  description:
    '300+ definitions for fractional executive, C-suite strategy, and organizational leadership terms. The definitive glossary from The Crimson Bench — est. 2002, New York City.',
  alternates: { canonical: '/glossary' },
}

const CATEGORIES = [
  { slug: 'fractional-executive', name: 'Fractional Executive Terms', count: 45 },
  { slug: 'financial-leadership', name: 'Financial Leadership', count: 50 },
  { slug: 'technology-leadership', name: 'Technology Leadership', count: 45 },
  { slug: 'revenue-operations', name: 'Revenue & GTM Operations', count: 40 },
  { slug: 'people-operations', name: 'People Operations & HR', count: 38 },
  { slug: 'pe-venture', name: 'PE, VC & Corporate Finance', count: 55 },
  { slug: 'security-compliance', name: 'Security & Compliance', count: 30 },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossaryPage() {
  return (
    <>
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">300+ Definitions · Executive Terminology</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Executive Leadership Glossary
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Definitions for every term in C-suite strategy, fractional executive engagements, finance, technology, operations, and organizational leadership. Written by the team behind 24,000+ executive mandates.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {ALPHABET.map(letter => (
              <a key={letter} href={`/glossary?letter=${letter}`} className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-400 hover:border-[#B01C24] hover:text-[#B01C24] transition-colors">
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {CATEGORIES.map(cat => (
              <a key={cat.slug} href={`/glossary/${cat.slug}`} className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-1 group-hover:text-[#B01C24] transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{cat.count} terms</p>
                </div>
                <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Browse →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
