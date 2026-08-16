import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoleByKey, getAllRoleSlugs } from '@/lib/roles'
import { getStateBySlug, getAllStateSlugs } from '@/lib/states'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const params: { role: string; state: string }[] = []
  for (const role of getAllRoleSlugs()) {
    for (const state of getAllStateSlugs()) {
      params.push({ role, state })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ role: string; state: string }> }): Promise<Metadata> {
  const { role: roleKey, state: stateSlug } = await params
  const role = getRoleByKey(roleKey)
  const state = getStateBySlug(stateSlug)
  if (!role || !state) return {}
  return {
    title: `How Much Does a Fractional ${role.title} Cost in ${state.name}? | The Crimson Bench`,
    description: `2026 cost guide: fractional ${role.fullTitle} pricing in ${state.name}. Full-time vs. fractional comparison, engagement tier breakdown, and ROI analysis. The Crimson Bench — flat-rate, no markup.`,
    alternates: { canonical: `/cost/${role.key}/${state.slug}` },
  }
}

const SALARY_RANGES: Record<string, { low: number; high: number }> = {
  ceo: { low: 250000, high: 600000 },
  cfo: { low: 200000, high: 450000 },
  cto: { low: 190000, high: 420000 },
  coo: { low: 180000, high: 400000 },
  cro: { low: 170000, high: 380000 },
  cmo: { low: 160000, high: 350000 },
  chro: { low: 150000, high: 320000 },
  ciso: { low: 170000, high: 380000 },
}

function formatUSD(n: number) {
  return '$' + n.toLocaleString('en-US')
}

export default async function CostGuidePage({ params }: { params: Promise<{ role: string; state: string }> }) {
  const { role: roleKey, state: stateSlug } = await params
  const role = getRoleByKey(roleKey)
  const state = getStateBySlug(stateSlug)
  if (!role || !state) notFound()

  const salary = SALARY_RANGES[role.key] ?? { low: 180000, high: 400000 }
  const annualLow = Math.round(salary.low * 1.2)
  const annualHigh = Math.round(salary.high * 1.4)

  const costFaqs = [
    {
      q: `How much does a full-time ${role.fullTitle} cost in ${state.name}?`,
      a: `A full-time ${role.fullTitle} in ${state.name} typically costs ${formatUSD(annualLow)}–${formatUSD(annualHigh)} per year in total compensation — including base salary, bonus, equity, benefits, payroll taxes, and recruiting fees. In high-cost metros like ${state.majorCity}, the upper range is higher.`,
    },
    {
      q: `How much does a fractional ${role.title} cost vs. a full-time hire in ${state.name}?`,
      a: `A fractional ${role.fullTitle} from The Crimson Bench costs $48,000–$270,000 per year depending on the engagement tier (Advisory Retainer at $4K/month to Embedded Executive at $22.5K/month). This is 40%–80% less than a full-time hire — without equity dilution, benefits overhead, or recruiting fees.`,
    },
    {
      q: `What are the different fractional ${role.title} pricing tiers?`,
      a: `The Crimson Bench offers five core monthly tiers: Advisory Retainer ($4,000/month — 2 sessions/month), Scale-Up Fractional ($7,500/month — 1 day/week), Growth Fractional ($12,500/month — 2 days/week), Embedded Executive ($22,500/month — 3+ days/week), and Enterprise Suite (custom). All are flat-rate with no markup.`,
    },
    {
      q: `Is there a cheaper way to access fractional ${role.title} services in ${state.name}?`,
      a: `Our Executive Written Audit ($500) and Executive Diagnostic ($1,500) are one-time engagements that give you written strategic recommendations without a monthly commitment. These are the lowest-cost entry points and are ideal if you want to assess fit before a full retainer.`,
    },
  ]

  return (
    <>
      <JsonLd data={faqSchema(costFaqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: `Fractional ${role.title}`, url: `https://www.crimsonbench.com/bench/${role.key}` },
        { name: `Cost in ${state.name}`, url: `https://www.crimsonbench.com/cost/${role.key}/${state.slug}` },
      ])} />

      <Breadcrumb items={[
        { name: 'Home', href: '/' },
        { name: `Fractional ${role.title}`, href: `/bench/${role.key}` },
        { name: `Cost in ${state.name}`, href: `/cost/${role.key}/${state.slug}` },
      ]} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">{state.name} · 2026 Cost Guide</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            How Much Does a Fractional {role.title} Cost in {state.name}?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            A complete 2026 breakdown of fractional {role.fullTitle} costs in {state.name} — compared to full-time, by engagement tier, and with ROI analysis.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Full-time vs. fractional */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Full-Time {role.title} vs. Fractional: {state.name} Cost Comparison
            </h2>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wide text-slate-500">Cost Item</th>
                    <th className="text-right py-3 px-4 font-mono text-xs uppercase tracking-wide text-slate-500">Full-Time {role.title}</th>
                    <th className="text-right py-3 px-4 font-mono text-xs uppercase tracking-wide text-[#B01C24]">Crimson Bench Fractional</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Base Salary', `${formatUSD(salary.low)}–${formatUSD(salary.high)}`, '$0 (included)'],
                    ['Annual Bonus', '15–30% of base', '$0 (included)'],
                    ['Equity (est.)', '0.5–2% of company', '$0 — no dilution'],
                    ['Benefits & Payroll', '~25% of salary', '$0 (included)'],
                    ['Recruiting Fee', '20–30% of salary', '$0 — no fee'],
                    ['Total Year 1 Cost', `${formatUSD(annualLow)}–${formatUSD(annualHigh)}+`, '$48,000–$270,000'],
                    ['Minimum Commitment', '2–3 year expected', '14-day cancellation'],
                  ].map(([item, ft, frac]) => (
                    <tr key={String(item)} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">{String(item)}</td>
                      <td className="py-3 px-4 text-right text-slate-500 text-xs tabular-nums">{String(ft)}</td>
                      <td className="py-3 px-4 text-right text-[#B01C24] font-semibold text-xs tabular-nums">{String(frac)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engagement tiers */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Fractional {role.title} Pricing Tiers (2026)
            </h2>
            <div className="space-y-4">
              {[
                { tier: 'Executive Written Audit', price: '$500', suffix: 'one-time', detail: 'Written assessment of current function. No sessions. Delivered within 5 business days.', href: '/services/executive-written-audit' },
                { tier: 'Executive Diagnostic', price: '$1,500', suffix: 'one-time', detail: '3-hour structured assessment + written strategic brief. Best first engagement.', href: '/services/executive-diagnostic' },
                { tier: 'Advisory Retainer', price: '$4,000', suffix: '/month', detail: '2 sessions/month + async access. Ideal for ongoing strategic guidance.', href: '/services/advisory-retainer' },
                { tier: 'Scale-Up Fractional', price: '$7,500', suffix: '/month', detail: '1 day/week dedicated engagement. Active leadership and execution.', href: '/services/scale-up-fractional' },
                { tier: 'Growth Fractional', price: '$12,500', suffix: '/month', detail: '2 days/week. Deep operational involvement. Most popular tier.', href: '/services/growth-fractional' },
                { tier: 'Embedded Executive', price: '$22,500', suffix: '/month', detail: '3+ days/week. Near full-time presence. For critical transitions.', href: '/services/embedded-executive' },
              ].map(t => (
                <a key={t.tier} href={t.href} className="block border border-slate-200 dark:border-slate-800 p-5 hover:border-[#B01C24]/50 transition-colors group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#B01C24] transition-colors">{t.tier}</h3>
                    <div className="text-right">
                      <span className="font-mono text-lg font-bold text-[#B01C24] tabular-nums">{t.price}</span>
                      <span className="font-mono text-xs text-slate-400">{t.suffix}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t.detail}</p>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {costFaqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">Get Started</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Flat-rate pricing. No markup. 14-day cancellation.
            </p>
            <a href="/contact" className="btn-crimson w-full text-center block mb-3 text-sm">Deploy a Fractional {role.title} →</a>
            <a href="/services/executive-diagnostic" className="btn-outline w-full text-center block text-sm py-2">$1,500 Diagnostic</a>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Related Guides</p>
            <ul className="space-y-2 text-sm">
              <li><a href={`/guides/how-to-hire/${role.key}`} className="text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">How to Hire a Fractional {role.title} →</a></li>
              <li><a href={`/bench/${role.key}`} className="text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Fractional {role.title} Overview →</a></li>
              <li><a href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">All 22 Products & Pricing →</a></li>
            </ul>
          </div>
        </aside>
      </div>

      <CTABlock heading={`Hire a Fractional ${role.title} in ${state.name} for Less`} />
    </>
  )
}
