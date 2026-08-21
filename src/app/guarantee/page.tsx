import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'The Crimson Bench Guarantee — 30-Day Money Back',
  description: 'Our promise: if a Crimson Bench toolkit, simulator, or model isn’t what you expected, we make it right — a 30-day money-back guarantee on digital products.',
  alternates: { canonical: '/guarantee' },
}

export default function GuaranteePage() {
  return (
    <>
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Guarantee', href: '/guarantee' }]} />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="section-eyebrow mb-4">Our Promise</p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white mb-6">
          The 30-day, no-hard-feelings guarantee.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          We build these models the way we build them for the companies we advise. If a toolkit, simulator, or company model isn&apos;t what you expected, tell us within 30 days and we&apos;ll fix it or refund it. No forms to fight, no fine print.
        </p>

        <div className="grid sm:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 mb-10">
          {[
            ['30 days', 'to change your mind on any digital product'],
            ['Full refund', 'or we repair the file — your call'],
            ['One email', 'support@crimsonbench.com, that’s it'],
          ].map(([big, small]) => (
            <div key={big} className="bg-white dark:bg-slate-950 p-6">
              <p className="font-serif text-2xl text-[#B01C24] mb-1">{big}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{small}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            The guarantee covers our digital products — Excel toolkits, one-time simulator purchases, and the $250 company models. For Toolkit Pro subscriptions, cancel anytime and your access runs to the end of the period; see our{' '}
            <a href="/legal/subscription-terms" className="text-[#B01C24] underline">Subscription Terms</a>.
          </p>
          <p>
            Bespoke and enterprise engagements are governed by their own statement of work. Full details live in our{' '}
            <a href="/legal/refund" className="text-[#B01C24] underline">Refund Policy</a>.
          </p>
        </div>
      </section>
      <CTABlock heading="Try a model risk-free" />
    </>
  )
}
