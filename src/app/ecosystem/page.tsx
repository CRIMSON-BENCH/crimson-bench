import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import Ecosystem from '@/components/Ecosystem'
import { ECO_DISCOUNT_PCT, ECO_COUPON } from '@/lib/ecosystem'

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

      <CTABlock />
    </>
  )
}
