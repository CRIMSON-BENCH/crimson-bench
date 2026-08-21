import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Crimson Bench vs. Modeling Tools & Template Shops — Compared',
  description:
    'How The Crimson Bench compares to dedicated modeling platforms and generic spreadsheet-template shops: breadth, price, learning curve, and who builds it.',
  alternates: { canonical: '/compare-tools' },
}

const ROWS: { feature: string; cb: string; platform: string; templates: string }[] = [
  { feature: 'What you get', cb: '500 simulators + 515 Excel toolkits + 20 end-to-end company models', platform: 'One flexible modeling canvas you build from scratch', templates: 'A single spreadsheet per purchase' },
  { feature: 'Time to an answer', cb: 'Open it, plug in numbers, done', platform: 'Learn the tool, then build the model', templates: 'Depends how good the template is' },
  { feature: 'Works where you work', cb: 'In-browser + native Excel / Google Sheets', platform: 'Proprietary web app', templates: 'Usually Excel only' },
  { feature: 'Who built it', cb: 'Ivy League operators — the models they use in engagements', platform: 'You (the tool is the blank canvas)', templates: 'Varies — often anonymous sellers' },
  { feature: 'Integrated company model', cb: 'Yes — growth → cash → runway → valuation, linked', platform: 'If you build it yourself', templates: 'Rarely' },
  { feature: 'AI analysis of your scenario', cb: 'Yes (Toolkit Pro)', platform: 'Sometimes', templates: 'No' },
  { feature: 'Price', cb: '$180/mo all-access, or $250 per company model', platform: 'Per-seat SaaS, often $$$', templates: '$20–$200 per file' },
  { feature: 'Guarantee', cb: '30-day money-back', platform: 'Varies', templates: 'Usually none' },
]

const faqs = [
  { q: 'Is this a replacement for a modeling platform like Causal or Foresight?', a: 'Different jobs. Those are blank canvases you build a model in. The Crimson Bench gives you 1,000+ ready-built models and simulators — plus editable Excel — so you get an answer in minutes instead of building from zero. Many people use both.' },
  { q: 'How is it different from buying a template on Etsy or Gumroad?', a: 'Generic templates are one file from an anonymous seller. Ours are operator-built, come as multi-file toolkits, are cross-linked to live simulators, and are backed by a guarantee and continuous updates.' },
  { q: 'Do I need to learn a new tool?', a: 'No. The simulators run in your browser with plain inputs, and the toolkits open in Excel or Google Sheets. There is no platform to learn.' },
]

export default function CompareToolsPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Compare Tools', url: 'https://www.crimsonbench.com/compare-tools' },
      ])} />
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Compare Tools', href: '/compare-tools' }]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">How We Compare</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Ready-built models vs. a blank canvas vs. a random template.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Modeling platforms give you a powerful empty canvas. Template shops give you one file. The Crimson Bench gives you a library of operator-built models and simulators that answer the question today.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-slate-400"></th>
                <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-[#B01C24]">The Crimson Bench</th>
                <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-slate-400">Modeling Platforms</th>
                <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-slate-400">Template Shops</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.feature} className="border-t border-slate-200 dark:border-slate-800 align-top">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{r.feature}</td>
                  <td className="p-4 text-slate-800 dark:text-slate-200 bg-[#B01C24]/5 dark:bg-[#B01C24]/10">{r.cb}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{r.platform}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{r.templates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-4">Comparison reflects our positioning and typical market offerings; specific competitor features and prices change — check their current terms.</p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Questions</h2>
        <div className="space-y-5">
          {faqs.map(f => (
            <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{f.q}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <CTABlock heading="See what ready-built feels like" />
    </>
  )
}
