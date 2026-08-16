import type { Metadata } from 'next'
import { BLOG_ARTICLES } from '@/lib/blog'
import CTABlock from '@/components/CTABlock'

interface Props { params: Promise<{ category: string }> }

const CATEGORIES = [
  { slug: 'strategy', name: 'CEO Strategy', description: 'Growth strategy, scaling, and organizational leadership from The Crimson Bench.' },
  { slug: 'finance', name: 'CFO Insights', description: 'Financial leadership, fundraising, capital strategy, and M&A execution.' },
  { slug: 'technology', name: 'CTO Insights', description: 'Technology leadership, AI adoption, and digital transformation.' },
  { slug: 'operations', name: 'Operations', description: 'Operational excellence, COO best practices, and scaling systems.' },
  { slug: 'people', name: 'People Operations', description: 'CHRO insights: talent strategy, culture, comp, and organizational design.' },
]

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) return {}
  return {
    title: `${cat.name} Articles | The Crimson Bench`,
    description: `${cat.description} Expert insights from The Crimson Bench — 24,000+ executive mandates, est. 2002.`,
    alternates: { canonical: `/blog/${category}` },
  }
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.slug === category)!
  const articles = BLOG_ARTICLES.filter(a => a.category === category)

  return (
    <>
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">
            <a href="/blog" className="hover:text-[#B01C24] transition-colors">Blog</a> / {cat.name}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">{cat.name}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">{cat.description}</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {articles.map(article => (
              <a key={article.slug} href={`/blog/${category}/${article.slug}`} className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-3">{article.readTime} min read</p>
                <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mb-3 group-hover:text-[#B01C24] transition-colors leading-snug">{article.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{article.excerpt}</p>
                <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Read Article →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
