import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Affiliate & Partner Program | The Crimson Bench',
  description: 'Earn recurring commission referring The Crimson Bench simulators, toolkits, and company models. Built for creators, operators, advisors, and communities.',
  alternates: { canonical: '/affiliate' },
}

const faqs = [
  { q: 'Who is this for?', a: 'Creators, newsletter writers, fractional operators, accountants, consultants, and communities whose audience builds and runs businesses. If your people would use our tools, you can earn referring them.' },
  { q: 'How does it pay?', a: 'You earn a commission on every purchase you refer — one-time products and the first year of Toolkit Pro subscriptions — tracked with a cookie window. Payouts are monthly once you clear the minimum threshold.' },
  { q: 'How do I get paid?', a: 'Via your linked payout account once approved. We handle tracking, attribution, and reporting; you focus on the referral.' },
  { q: 'Is there a cost?', a: 'No. Joining is free. You get a unique referral link and a small asset kit (copy, images, and example posts).' },
]

export default function AffiliatePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Affiliate', url: 'https://www.crimsonbench.com/affiliate' },
      ])} />
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Affiliate', href: '/affiliate' }]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">Affiliate &amp; Partner Program</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Get paid to put the right tools in front of your audience.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
            If your audience builds or runs companies, our simulators, toolkits, and models are things they already need. Refer them, earn recurring commission, and give them genuinely useful tools — not a spammy pitch.
          </p>
          <a href="/contact" className="btn-crimson py-3 px-6">Apply to the Program →</a>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {[
            ['01', 'Apply & get your link', 'Tell us about your audience. Approved partners get a unique referral link and an asset kit.'],
            ['02', 'Share what fits', 'Point people to the specific tool, toolkit, or model that solves their problem — inside a post, video, or newsletter.'],
            ['03', 'Earn on every sale', 'You earn commission on one-time purchases and the first year of Toolkit Pro subscriptions you refer. Paid monthly.'],
          ].map(([n, t, d]) => (
            <div key={n} className="bg-white dark:bg-slate-950 p-6">
              <p className="font-mono text-xs text-[#B01C24] tabular-nums mb-2">{n}</p>
              <p className="font-serif text-lg text-slate-900 dark:text-white mb-1">{t}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it fits */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-6">Built for</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Finance & startup creators', 'Newsletter writers', 'Fractional operators', 'Accountants & bookkeepers', 'Consultants & advisors', 'Founder communities', 'Business coaches', 'B-school & educators'].map(x => (
            <div key={x} className="border border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300">{x}</div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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
        <p className="text-xs text-slate-400 mt-8">
          Program terms, commission rates, and payout thresholds are confirmed on approval and subject to our{' '}
          <a href="/legal/terms" className="text-[#B01C24] underline">Terms of Service</a>.
        </p>
      </section>

      <CTABlock heading="Ready to partner?" />
    </>
  )
}
