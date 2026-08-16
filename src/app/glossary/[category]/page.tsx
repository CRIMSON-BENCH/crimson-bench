import type { Metadata } from 'next'
import { GLOSSARY_TERMS } from '@/lib/glossary'
import CTABlock from '@/components/CTABlock'

interface Props { params: Promise<{ category: string }> }

const TERM_CATEGORIES = [
  { slug: 'finance', name: 'Financial Leadership', description: 'M&A, valuation, capital markets, and CFO-level financial strategy terms.' },
  { slug: 'strategy', name: 'Strategy & Leadership', description: 'CEO strategy, organizational leadership, and growth planning terminology.' },
  { slug: 'operations', name: 'Operations', description: 'COO-level operational terms: supply chain, process design, and scaling systems.' },
  { slug: 'people', name: 'People Operations & HR', description: 'CHRO and HR terms: talent acquisition, comp design, culture, and workforce planning.' },
  { slug: 'technology', name: 'Technology Leadership', description: 'CTO and CISO terminology: architecture, AI, security, and digital transformation.' },
  { slug: 'legal', name: 'Legal & Compliance', description: 'Corporate legal terms: governance, IP, regulatory compliance, and risk management.' },
  { slug: 'general', name: 'General Executive Terms', description: 'Cross-functional executive leadership vocabulary.' },
]

export async function generateStaticParams() {
  return TERM_CATEGORIES.map(c => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = TERM_CATEGORIES.find(c => c.slug === category)
  if (!cat) return {}
  return {
    title: `${cat.name} Glossary | The Crimson Bench`,
    description: `${cat.description} Definitions from The Crimson Bench — 24,000+ executive mandates, est. 2002 New York City.`,
    alternates: { canonical: `/glossary/${category}` },
  }
}

export default async function GlossaryCategoryPage({ params }: Props) {
  const { category } = await params
  const cat = TERM_CATEGORIES.find(c => c.slug === category)!
  const terms = GLOSSARY_TERMS.filter(t => t.category === category)

  const grouped: Record<string, typeof terms> = {}
  for (const term of terms) {
    const letter = term.term[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(term)
  }
  const letters = Object.keys(grouped).sort()

  return (
    <>
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">
            <a href="/glossary" className="hover:text-[#B01C24] transition-colors">Glossary</a> / {cat.name}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">{cat.name}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">{cat.description}</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          {letters.map(letter => (
            <div key={letter} className="mb-12">
              <h2 className="font-mono text-2xl text-[#B01C24] mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">{letter}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grouped[letter].map(term => (
                  <a key={term.slug} href={`/glossary/${term.slug}`} className="group">
                    <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-1 group-hover:text-[#B01C24] transition-colors">{term.term}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{term.shortDef}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABlock />
    </>
  )
}
