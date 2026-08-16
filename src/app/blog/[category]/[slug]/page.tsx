import type { Metadata } from 'next'
import { BLOG_ARTICLES } from '@/lib/blog'
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import CTABlock from '@/components/CTABlock'

interface Props { params: Promise<{ category: string; slug: string }> }

const CATEGORY_NAMES: Record<string, string> = {
  strategy: 'CEO Strategy',
  finance: 'CFO Insights',
  technology: 'CTO Insights',
  operations: 'Operations',
  people: 'People Operations',
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map(a => ({ category: a.category, slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = BLOG_ARTICLES.find(a => a.slug === slug)
  if (!article) return {}
  return {
    title: `${article.title} | The Crimson Bench`,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.category}/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.datePublished,
    },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { category, slug } = await params
  const article = BLOG_ARTICLES.find(a => a.slug === slug)!
  const catName = CATEGORY_NAMES[category] ?? category
  const related = BLOG_ARTICLES.filter(a => a.category === category && a.slug !== slug).slice(0, 3)

  const jsonLd = [
    articleSchema({
      headline: article.title,
      description: article.excerpt,
      datePublished: article.datePublished,
      category: catName,
      slug: `/blog/${category}/${slug}`,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: catName, url: `/blog/${category}` },
      { name: article.title, url: `/blog/${category}/${slug}` },
    ]),
    ...(article.faqs?.length ? [faqSchema(article.faqs)] : []),
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-eyebrow mb-4">
            <a href="/blog" className="hover:text-[#B01C24] transition-colors">Blog</a>
            {' / '}
            <a href={`/blog/${category}`} className="hover:text-[#B01C24] transition-colors">{catName}</a>
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">{article.title}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">{article.excerpt}</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">{article.datePublished}</span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">{article.readTime} min read</span>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {article.sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">{section.heading}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{section.body}</p>
              </div>
            ))}
          </div>

          {article.faqs && article.faqs.length > 0 && (
            <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-12">
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {article.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-6">
                    <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              {related.map(rel => (
                <a key={rel.slug} href={`/blog/${rel.category}/${rel.slug}`} className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                  <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-2 group-hover:text-[#B01C24] transition-colors">{rel.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{rel.excerpt}</p>
                  <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider">Read →</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABlock />
    </>
  )
}
