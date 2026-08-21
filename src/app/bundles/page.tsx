import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import BuyButton from '@/components/BuyButton'
import { getBundles } from '@/lib/bundles'
import { TOOLKIT_PRO } from '@/lib/digital-products'

export const metadata: Metadata = {
  title: 'System Bundles — Complete Toolkit Sets at 20% Off',
  description:
    'Curated sets of Crimson Bench toolkits sold together at 20% off the individual prices. Build the founder, CFO, or operator stack in one download — or get everything with Toolkit Pro.',
  alternates: { canonical: '/bundles' },
}

const money = (n: number) => `$${n.toLocaleString('en-US')}`

export default function BundlesPage() {
  const bundles = getBundles()
  return (
    <>
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Bundles', href: '/bundles' }]} />
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">Complete the System · Save 20%</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            The whole stack for your seat — one download, 20% off.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Each bundle is the exact set of models we&apos;d reach for in that role, priced at{' '}
            <strong className="text-slate-800 dark:text-slate-200">20% below</strong> buying the pieces one by one.
            Buy once, download instantly, keep forever — or unlock all of it with Toolkit Pro.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {bundles.map(b => (
          <div key={b.id} className="border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-1">{b.who}</p>
                <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                  {b.name}
                  {b.featured && (
                    <span className="font-mono text-[9px] tracking-widest uppercase bg-[#B01C24] text-white px-2 py-0.5">
                      Best Value
                    </span>
                  )}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">{b.blurb}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-xs text-slate-400 line-through">{money(b.listPrice)}</p>
                <p className="font-serif text-3xl text-slate-900 dark:text-white leading-none">{money(b.bundlePrice)}</p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#B01C24] mt-1">
                  Save {money(b.savings)} · {b.discountPct}% off
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800">
              {b.members.map(m => (
                <a
                  key={m.id}
                  href={`/digital-products/${m.id}`}
                  className="bg-white dark:bg-slate-950 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-[#B01C24] transition-colors">
                    {m.shortName || m.name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap">{money(m.price)}</span>
                </a>
              ))}
            </div>

            {b.perks && b.perks.length > 0 && (
              <ul className="px-6 md:px-8 py-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                {b.perks.map(p => (
                  <li key={p} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="text-[#B01C24] mt-0.5">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="p-6 bg-[#B01C24]/5 dark:bg-[#B01C24]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-700 dark:text-slate-300">
                <p>
                  Get all {b.members.length} models for <strong>{money(b.bundlePrice)}</strong>{' '}
                  <span className="text-slate-400">(normally {money(b.listPrice)})</span>.
                </p>
                {b.addOn && (
                  <a href={b.addOn.href} className="text-[#B01C24] hover:underline text-xs">
                    {b.addOn.label} →
                  </a>
                )}
              </div>
              <BuyButton
                type="toolkit"
                name={`${b.name} (Bundle · ${b.members.length} toolkits)`}
                amount={b.bundlePrice * 100}
                items={b.memberIds}
                className="btn-crimson py-2.5 px-5 text-sm whitespace-nowrap"
              >
                Get the bundle — save {money(b.savings)} →
              </BuyButton>
            </div>
          </div>
        ))}

        <div className="border border-dashed border-slate-300 dark:border-slate-700 p-6 md:p-8 text-center">
          <p className="font-serif text-xl text-slate-900 dark:text-white mb-2">Want all of it — every toolkit, forever?</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-xl mx-auto">
            Toolkit Pro unlocks all 515 toolkits, all 500 simulators, and every update — {money(TOOLKIT_PRO.monthly)}/mo or{' '}
            {money(TOOLKIT_PRO.annual)}/yr (20% off).
          </p>
          <a href="/digital-products/the-crimson-bench-vault" className="btn-crimson py-2.5 px-6 text-sm">
            Explore Toolkit Pro →
          </a>
        </div>
      </section>

      <CTABlock heading="Want it built around your business?" />
    </>
  )
}
