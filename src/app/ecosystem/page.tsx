import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import Ecosystem from '@/components/Ecosystem'
import { ECO_DISCOUNT_PCT, ECO_COUPON, RECIPROCAL_PCT, RECIPROCAL_COUPON } from '@/lib/ecosystem'

export const metadata: Metadata = {
  title: 'The Ecosystem — More Tools from the Makers of Crimson Bench',
  description:
    'The other operator tools we build — AI for pitches, RFPs, simulations, 3D builds, and disputes. Crimson Bench customers get a standing discount on all of them.',
  alternates: { canonical: '/ecosystem' },
}

export default function EcosystemPage() {
  return (
    <>
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Ecosystem', href: '/ecosystem' }]} />
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">Built by the Same Team</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            The rest of the operator’s toolkit.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Crimson Bench is one of several tools we build for founders and operators. Each one solves a different
            piece of the job — and as a Crimson Bench customer, you get{' '}
            <strong className="text-slate-800 dark:text-slate-200">{ECO_DISCOUNT_PCT}% off</strong> every one of them
            with code <span className="font-mono text-[#B01C24]">{ECO_COUPON}</span>.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <Ecosystem />
      </section>

      {/* Reciprocal / inbound offer */}
      <section className="bg-[#B01C24]/5 dark:bg-[#B01C24]/10 border-y border-[#B01C24]/20 py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-3">It Works Both Ways</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-slate-900 dark:text-white mb-3">
            Already a customer of one of our apps?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5 max-w-xl mx-auto">
            If you use PitchReadyAI, RFPScript, PolySimOS, 3DBuildBot, or AIDisputeEngine, you get{' '}
            <strong className="text-slate-800 dark:text-slate-200">{RECIPROCAL_PCT}% off Crimson Bench</strong> — every
            simulator, toolkit, and company model. Just use the code at checkout.
          </p>
          <div className="inline-flex items-center gap-3 border border-[#B01C24]/40 bg-white dark:bg-slate-950 px-5 py-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">Your code:</span>
            <span className="font-mono text-lg font-semibold text-[#B01C24]">{RECIPROCAL_COUPON}</span>
          </div>
          <div className="mt-6">
            <a href="/start" className="btn-crimson py-2.5 px-6 text-sm">Browse Crimson Bench →</a>
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  )
}
