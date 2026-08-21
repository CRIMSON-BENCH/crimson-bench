import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MEGA_SIMS, getMegaSimById } from '@/lib/mega-sims'
import MegaSimRunner from '@/components/MegaSimRunner'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import BuyButton from '@/components/BuyButton'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export function generateStaticParams() {
  return MEGA_SIMS.map(s => ({ slug: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const sim = getMegaSimById(slug)
  if (!sim) return {}
  return {
    title: `${sim.name} — Integrated Company Model`,
    description: `${sim.tagline} ${sim.description}`,
    alternates: { canonical: `/enterprise/${sim.id}` },
  }
}

export default async function CompanyModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sim = getMegaSimById(slug)
  if (!sim) notFound()

  const related = MEGA_SIMS.filter(s => s.id !== sim.id).slice(0, 6)

  const faqs = [
    { q: `What is the ${sim.name}?`, a: `${sim.description}` },
    { q: `What makes it "end-to-end"?`, a: `Unlike a single calculator, this model links ${sim.modules.length} driver groups — ${sim.modules.map(m => m.title).join(', ')} — into one integrated picture. Change any driver and revenue, margin, cash, runway, and valuation all move together.` },
    { q: `What do I get for $${sim.price}?`, a: `The full interactive model plus an editable Excel version, a documented methodology, and board-ready base/bull/bear scenarios. Want it wired to your real numbers and chart of accounts? That's a bespoke engagement — see the Enterprise page.` },
    { q: `Is this financial advice?`, a: `No. It's an educational decision-support model built to your assumptions — not financial, investment, tax, or legal advice.` },
  ]

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Enterprise', url: 'https://www.crimsonbench.com/enterprise' },
        { name: sim.name, url: `https://www.crimsonbench.com/enterprise/${sim.id}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Enterprise', href: '/enterprise' },
        { name: sim.name, href: `/enterprise/${sim.id}` },
      ]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">
            <span className="bg-[#B01C24] text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 mr-2">Company Model</span>
            {sim.category}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4">{sim.name}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-6">{sim.tagline}</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-3xl font-bold text-[#B01C24] tabular-nums">${sim.price}</span>
            <BuyButton type="company_model" itemId={sim.id} className="btn-crimson py-3 px-6">Get This Model →</BuyButton>
          </div>
        </div>
      </section>

      {/* The model */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <MegaSimRunner id={sim.id} />
          <p className="text-xs text-slate-400 mt-4 font-mono text-center">
            Interactive preview · Educational model, not financial advice · Built by The Crimson Bench
          </p>
        </div>
      </section>

      {/* Detail */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-12">
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">About This Model</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{sim.description}</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-2">The Linked Driver Groups</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Everything is connected — here is what feeds the model.</p>
              <div className="grid sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                {sim.modules.map(m => (
                  <div key={m.title} className="bg-white dark:bg-slate-950 p-5">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{m.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{m.blurb}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{m.inputs.map(i => i.label).join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">Assumptions &amp; Limitations</h2>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>The model is deterministic and monthly — it projects your drivers forward with clear arithmetic, one scenario at a time.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>Defaults are illustrative benchmarks. The paid version ships in Excel so you can wire in your real chart of accounts.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>For a model built entirely around your business — hiring waves, fundraising rounds, working capital — commission a bespoke engagement.</span></li>
                <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>Educational decision-support tool — <strong>not financial, investment, tax, or legal advice</strong>.</span></li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {faqs.map(f => (
                  <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-5">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{f.q}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Other Company Models</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                  {related.map(r => (
                    <a key={r.id} href={`/enterprise/${r.id}`} className="bg-white dark:bg-slate-950 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#B01C24] transition-colors">{r.name.replace(' — End-to-End Operating Model', '')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{r.tagline}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="border border-slate-200 dark:border-slate-800 p-6 sticky top-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">Integrated Company Model</p>
              <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mb-4 tabular-nums">${sim.price}</p>
              <ul className="space-y-2 mb-5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>Full interactive + Excel model</span></li>
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>Every driver linked, end to end</span></li>
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>Base / bull / bear scenarios</span></li>
                <li className="flex gap-2"><span className="text-[#B01C24]">✓</span><span>Documented methodology</span></li>
              </ul>
              <BuyButton type="company_model" itemId={sim.id} className="btn-crimson w-full text-center block mb-3">Get This Model →</BuyButton>
              <p className="text-xs text-slate-400 text-center font-mono">One-time · instant download</p>
            </div>

            <div className="border border-[#B01C24]/30 bg-[#B01C24]/5 dark:bg-[#B01C24]/10 p-6">
              <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-2">Want it custom?</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Have us wire this model to your actual business — bespoke, end to end.</p>
              <a href="/enterprise" className="btn-outline w-full text-center block text-sm">See Bespoke Builds →</a>
            </div>
          </aside>
        </div>
      </section>

      <CTABlock heading="Want this model built around your real numbers?" />
    </>
  )
}
