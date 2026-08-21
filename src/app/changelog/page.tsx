import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'What’s New — The Crimson Bench Changelog',
  description: 'The latest releases from The Crimson Bench: new simulators, Excel toolkits, end-to-end company models, and site improvements.',
  alternates: { canonical: '/changelog' },
}

const RELEASES: { date: string; title: string; items: string[] }[] = [
  {
    date: 'August 2026',
    title: 'The Enterprise tier',
    items: [
      'Launched 20 end-to-end company operating models ($250 each) — SaaS, e-commerce, marketplace, manufacturing, restaurant group, agency, clinic group, real estate, retail, fintech, subscription box, franchise, construction, logistics, hotel, creator, biotech, hardware, fitness, nonprofit.',
      'Added bespoke enterprise builds — a live model of your entire business, wired to your real numbers.',
      'Every company model links growth → revenue → margin → cash → runway → valuation in one interactive model.',
    ],
  },
  {
    date: 'August 2026',
    title: 'Toolkit Pro & the toolkits',
    items: [
      'Introduced Toolkit Pro: all 500 simulators + 515 Excel toolkits, with exports and AI analysis — $180/mo or $1,728/yr (save 20%).',
      'Every digital package is now a 4–5 file, formula-driven Excel toolkit — not a single sheet.',
      'Added the $20 simulator 3-pack for à-la-carte access.',
    ],
  },
  {
    date: 'August 2026',
    title: 'The simulator library',
    items: [
      'Reached 500 Pro simulators across finance, real estate, healthcare, trades, hospitality, and more.',
      '298 free front-door calculators — no signup.',
      'Every simulator page now shows a live worked example and its methodology.',
    ],
  },
  {
    date: 'August 2026',
    title: 'Site',
    items: [
      'Added site-wide search across all 800+ tools, toolkits, and models.',
      'Cleaned up navigation around the new product ladder.',
      'Published full legal + subscription + license terms and a 30-day guarantee.',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <>
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Changelog', href: '/changelog' }]} />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="section-eyebrow mb-4">Updated 2026 · Actively maintained</p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white mb-4">What&apos;s new</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-12">
          We ship constantly — new models, better tools, and improvements based on how operators actually use them. Every Toolkit Pro member gets it all, free.
        </p>

        <div className="space-y-12">
          {RELEASES.map((r, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400">{r.date}</p>
                <p className="font-serif text-lg text-slate-900 dark:text-white mt-1">{r.title}</p>
              </div>
              <ul className="md:col-span-3 space-y-3">
                {r.items.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="text-[#B01C24] flex-shrink-0">+</span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CTABlock heading="Get every release with Toolkit Pro" />
    </>
  )
}
