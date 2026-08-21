import type { Metadata } from 'next'
import EmailCapture from '@/components/EmailCapture'
import { getBundles } from '@/lib/bundles'
import { TOOLKIT_PRO } from '@/lib/digital-products'

export const metadata: Metadata = {
  title: 'Start Here — Free Operator Tools + 15% Off | The Crimson Bench',
  description:
    'Welcome from the channel. Get the free Operator’s Kit, try 500 simulators free, and take 15% off any toolkit with code CRIMSON15.',
  alternates: { canonical: '/start' },
}

const PROMO = 'CRIMSON15'
const money = (n: number) => `$${n.toLocaleString('en-US')}`

export default function StartPage() {
  const topBundle = getBundles()[0]
  return (
    <>
      {/* Promo bar */}
      <div className="bg-[#B01C24] text-white text-center py-3 px-4">
        <p className="text-sm font-medium">
          🎬 Welcome from the videos — take <strong>15% off any toolkit</strong> with code{' '}
          <span className="font-mono bg-white/20 px-2 py-0.5 rounded">{PROMO}</span>
        </p>
      </div>

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-eyebrow mb-4">Start Here</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white mb-6">
            The tools elite operators use — free to start.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            500 interactive simulators, 515 Excel toolkits, and 20 end-to-end company models. Model the decision
            before you make it. Pick where to begin 👇
          </p>
        </div>
      </section>

      {/* Three paths */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {/* 1 — Free lead magnet */}
        <div className="border border-emerald-600/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 flex flex-col">
          <p className="font-mono text-[10px] tracking-widest uppercase text-emerald-700 dark:text-emerald-400 mb-2">
            Free · No card
          </p>
          <h2 className="font-serif text-xl text-slate-900 dark:text-white mb-2">The Operator&apos;s Kit</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
            Cheat sheet, investor-grade chart pack, assumptions checklist &amp; quick-start guide — free.
          </p>
          <a href="#free-kit" className="btn-crimson py-2.5 px-4 text-sm text-center">Get it free →</a>
        </div>

        {/* 2 — Try simulators free */}
        <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
          <p className="font-mono text-[10px] tracking-widest uppercase text-slate-400 mb-2">Try free</p>
          <h2 className="font-serif text-xl text-slate-900 dark:text-white mb-2">500 Live Simulators</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
            Pressure-test cash flow, unit economics, fundraising, and more — right in your browser.
          </p>
          <a href="/pro-tools" className="btn-outline py-2.5 px-4 text-sm text-center">Explore simulators →</a>
        </div>

        {/* 3 — Save with a bundle */}
        <div className="border border-[#B01C24]/40 bg-[#B01C24]/5 dark:bg-[#B01C24]/10 p-6 flex flex-col">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#B01C24] mb-2">Best value</p>
          <h2 className="font-serif text-xl text-slate-900 dark:text-white mb-2">System Bundles</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
            {topBundle
              ? `Complete stacks at 20% off — e.g. ${topBundle.name} for ${money(topBundle.bundlePrice)} (save ${money(topBundle.savings)}).`
              : 'Complete toolkit stacks at 20% off.'}{' '}
            Stack code <span className="font-mono text-[#B01C24]">{PROMO}</span> for another 15%.
          </p>
          <a href="/bundles" className="btn-crimson py-2.5 px-4 text-sm text-center">See bundles →</a>
        </div>
      </section>

      {/* Free kit capture */}
      <section id="free-kit" className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <EmailCapture
            source="start-page"
            heading="Get the Operator&rsquo;s Kit — free."
            sub="Drop your email and we&rsquo;ll send the free bonus pack instantly — cheat sheet, chart pack, assumptions checklist &amp; quick-start guide. No spam, unsubscribe anytime."
          />
        </div>
      </section>

      {/* Toolkit Pro nudge */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">Want all of it?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-xl mx-auto">
          Toolkit Pro unlocks all 515 toolkits and all 500 simulators — {money(TOOLKIT_PRO.monthly)}/mo or{' '}
          {money(TOOLKIT_PRO.annual)}/yr. Use code <span className="font-mono text-[#B01C24]">{PROMO}</span> for 15% off.
        </p>
        <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson py-2.5 px-6 text-sm">
          Explore Toolkit Pro →
        </a>
      </section>
    </>
  )
}
