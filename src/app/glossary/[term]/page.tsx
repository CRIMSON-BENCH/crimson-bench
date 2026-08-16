import type { Metadata } from 'next'
import { GLOSSARY_TERMS } from '@/lib/glossary'
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import CTABlock from '@/components/CTABlock'

interface Props { params: Promise<{ term: string }> }

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map(t => ({ term: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params
  const entry = GLOSSARY_TERMS.find(t => t.slug === term)
  if (!entry) return {}
  return {
    title: `${entry.term}: Definition & Guide | The Crimson Bench`,
    description: `${entry.shortDef} Complete definition, examples, and context from The Crimson Bench — 24,000+ executive mandates since 2002.`,
    alternates: { canonical: `/glossary/${term}` },
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params
  const entry = GLOSSARY_TERMS.find(t => t.slug === term)!
  const related = GLOSSARY_TERMS.filter(t =>
    t.category === entry.category && t.slug !== term
  ).slice(0, 5)

  const jsonLd = [
    articleSchema({
      headline: `${entry.term}: Definition, Examples & Guide`,
      description: entry.shortDef,
      datePublished: '2025-01-01',
      category: 'Glossary',
      slug: `/glossary/${term}`,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Glossary', url: '/glossary' },
      { name: entry.term, url: `/glossary/${term}` },
    ]),
    faqSchema([
      { q: `What is ${entry.term}?`, a: entry.shortDef },
      ...(entry.faqs ?? []),
    ]),
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-eyebrow mb-4">
            <a href="/glossary" className="hover:text-[#B01C24] transition-colors">Glossary</a>
            {' / '}
            <a href={`/glossary/${entry.category}`} className="hover:text-[#B01C24] transition-colors capitalize">{entry.category.replace(/-/g, ' ')}</a>
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white mb-6">{entry.term}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed border-l-4 border-[#B01C24] pl-6">{entry.shortDef}</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">Full Definition</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{entry.fullDef}</p>
            </div>

            {entry.faqs && entry.faqs.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">FAQs</h2>
                <div className="space-y-5">
                  {entry.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-5">
                      <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.relatedRoles && entry.relatedRoles.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-4">Relevant Executive Roles</h2>
                <div className="flex flex-wrap gap-3">
                  {entry.relatedRoles.map(role => (
                    <a key={role} href={`/bench/${role}`} className="font-mono text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400 hover:border-[#B01C24] hover:text-[#B01C24] transition-colors">
                      Fractional {role.toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            {related.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-4">Related Terms</h3>
                <ul className="space-y-3">
                  {related.map(rel => (
                    <li key={rel.slug}>
                      <a href={`/glossary/${rel.slug}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">{rel.term}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-3">Deploy an Executive</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Put this knowledge into practice. Deploy a fractional C-suite executive within 48 hours.</p>
              <a href="/contact" className="btn-primary w-full text-center block">Get Started</a>
            </div>
          </aside>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
