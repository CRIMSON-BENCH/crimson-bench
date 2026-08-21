import type { Metadata } from 'next'
import MegaSimRunner from '@/components/MegaSimRunner'
import Breadcrumb from '@/components/Breadcrumb'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Bespoke Enterprise Models — A Live Simulation of Your Entire Company',
  description:
    'The Crimson Bench builds custom, end-to-end operating models: many integrated simulations linked into one live model of your whole business — growth, margin, cash, runway, and valuation. Try the interactive demo.',
  alternates: { canonical: '/enterprise' },
}

// The 20 end-to-end company operating models (integrated multi-simulation).
const COMPANY_MODELS: { name: string; blurb: string; live?: boolean; slug?: string }[] = [
  { name: 'SaaS Company', blurb: 'Growth, churn, ARR, burn, runway, and valuation — linked.', live: true, slug: 'saas-company-operating-model' },
  { name: 'E-Commerce / DTC Brand', blurb: 'Orders, AOV, CAC, contribution, cash, and margin.', live: true, slug: 'ecommerce-brand-operating-model' },
  { name: 'Two-Sided Marketplace', blurb: 'GMV liquidity, take rate, net revenue, and unit economics.', live: true, slug: 'marketplace-operating-model' },
  { name: 'Manufacturing Company', blurb: 'Volume, factory margin, overhead, cash, and valuation.', live: true, slug: 'manufacturing-operating-model' },
  { name: 'Multi-Unit Restaurant Group', blurb: 'Per-unit P&L, new-unit rollout, build cost, and cash.', live: true, slug: 'restaurant-group-operating-model' },
  { name: 'Professional Services / Agency', blurb: 'Utilization, billings, bench, and pipeline-to-cash.', live: true, slug: 'agency-operating-model' },
  { name: 'Healthcare Clinic Group', blurb: 'Visit volume, clinic margin, de-novo rollout, and cash.', live: true, slug: 'clinic-group-operating-model' },
  { name: 'Real Estate Portfolio', blurb: 'Rent, NOI, debt service, acquisitions, and value at cap.', live: true, slug: 'real-estate-portfolio-operating-model' },
  { name: 'Retail Chain', blurb: 'Store sales, contribution, new stores, cash, and margin.', live: true, slug: 'retail-chain-operating-model' },
  { name: 'Fintech / Lending Book', blurb: 'Originations, book, net interest margin, and losses.', live: true, slug: 'fintech-lending-operating-model' },
  { name: 'Subscription Box', blurb: 'Acquisition, churn, contribution, cash, and valuation.', live: true, slug: 'subscription-box-operating-model' },
  { name: 'Franchise System', blurb: 'System sales, royalties + fees, and franchisor EBITDA.', live: true, slug: 'franchise-system-operating-model' },
  { name: 'Construction / Contractor', blurb: 'Billings, gross profit, retention drag, and cash.', live: true, slug: 'construction-operating-model' },
  { name: 'Logistics / Fleet', blurb: 'Miles, cost-per-mile, fleet growth, cash, and valuation.', live: true, slug: 'logistics-fleet-operating-model' },
  { name: 'Hospitality / Hotel', blurb: 'Occupancy, ADR, RevPAR, NOI, debt, and value at cap.', live: true, slug: 'hotel-operating-model' },
  { name: 'Media / Creator Business', blurb: 'Reach, ad + sponsor + product revenue, and valuation.', live: true, slug: 'creator-business-operating-model' },
  { name: 'Biotech / R&D-Stage', blurb: 'Program burn, milestone inflow, runway, and cash at data.', live: true, slug: 'biotech-operating-model' },
  { name: 'Consumer Hardware', blurb: 'Units, thin unit margin, tooling, cash, and valuation.', live: true, slug: 'hardware-operating-model' },
  { name: 'Fitness / Membership Chain', blurb: 'Members × dues, club margin, rollout, and valuation.', live: true, slug: 'fitness-chain-operating-model' },
  { name: 'Nonprofit / Social Enterprise', blurb: 'Grants, earned revenue, program cost, and reserves.', live: true, slug: 'nonprofit-operating-model' },
]

const GIANT_SIMS = [
  'Integrated 3-Statement Model', 'Leveraged Buyout (LBO)', 'DCF Valuation + Sensitivity', 'M&A Accretion / Dilution',
  'Full Cap Table + Exit Waterfall', 'Venture Fund Return Model', 'Private Equity Fund (J-curve + carry)', 'Real Estate Development Pro Forma',
  'Real Estate Fund / REIT', 'Project Finance (debt sculpting)', 'Monte Carlo Retirement', 'Monte Carlo Startup Survival',
  'Pension / Actuarial Liability', 'Insurance Float + Combined Ratio', 'Bank Lending Book (NIM)', 'Loan Portfolio Credit Loss (vintages)',
  'Options Pricing + Greeks', 'Portfolio Efficient Frontier', 'Bond Duration & Convexity', 'FX Exposure & Hedging',
  'Commodity Hedging', 'SaaS Cohort + Forecast', 'Marketplace GMV / Take-Rate', 'Subscription Cohort LTV',
  'Ad-Network Yield', 'Manufacturing Capacity', 'Supply Chain / Inventory', 'Workforce Capacity Planning',
  'Sales Quota Coverage', 'Pricing Elasticity / Revenue', 'Churn Predictive Model', 'Fundraising Dilution to Exit',
  'Employee Equity / 409A', 'Entity Structure Tax Model', 'Debt Restructuring / Turnaround', 'Liquidation Waterfall',
  'ESG / Carbon Financial Impact', 'Energy Project Finance', 'Resource Extraction NPV', 'Municipal Budget Model',
]

const faqs = [
  { q: 'What is a bespoke enterprise model?', a: 'A custom, end-to-end simulation of your specific business — many linked models (revenue, unit economics, hiring, cash, fundraising, valuation) built around your actual numbers, so changing one driver moves the whole company. It is the model our operators build inside a live engagement, delivered to you.' },
  { q: 'How is it different from Toolkit Pro?', a: 'Toolkit Pro gives you 500 ready-made simulators and 515 Excel toolkits. A bespoke model is one integrated model of your entire business, custom-built to your structure — the demo on this page shows the shape, but your version is wired to your real drivers.' },
  { q: 'What do I get?', a: 'A live, interactive model (web and/or Excel), a walkthrough with the operator who built it, scenario libraries for your board, and a documented methodology. Optionally, ongoing updates as your business changes.' },
  { q: 'Is this financial advice?', a: 'The models are decision-support tools built to your assumptions. Engagements can include advisory from our Ivy League-educated operators; the models themselves are not a substitute for your own professional judgment.' },
]

export default function EnterprisePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.crimsonbench.com/' },
        { name: 'Enterprise', url: 'https://www.crimsonbench.com/enterprise' },
      ])} />

      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Enterprise', href: '/enterprise' }]} />

      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-4">
            <span className="bg-[#B01C24] text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 mr-2">Bespoke</span>
            Enterprise · Custom Model
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6">
            A live simulation of your entire company.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
            Not one calculator — your whole business, modeled end to end. Growth feeds revenue, revenue feeds margin, margin feeds cash, cash sets your runway, and ARR sets your valuation. Move one driver and the entire company responds. This is what our operators build inside a live engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="btn-crimson py-3 px-6">Request Your Custom Model →</a>
            <a href="#demo" className="btn-outline py-3 px-6">Try the Live Demo ↓</a>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-3">Demo: A SaaS Company, End to End</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              This is a working demo — one integrated model linking growth, pricing, cost, cash, and valuation. Change any driver and watch the whole company move. <strong className="text-slate-900 dark:text-white">Your bespoke version</strong> is wired to your real chart of accounts, hiring plan, and fundraising rounds.
            </p>
          </div>
          <MegaSimRunner id="saas-company-operating-model" />
          <p className="text-xs text-slate-400 mt-4 font-mono text-center">
            Illustrative demo · Educational model, not financial advice · Built by The Crimson Bench
          </p>
        </div>
      </section>

      {/* 20 company models */}
      <section className="px-6 py-16 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-3">20 End-to-End Company Models — $250 each</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-10">
            Whatever kind of business you run, there&apos;s an integrated model for it — every driver linked, board-ready, interactive and Excel, for <strong className="text-slate-900 dark:text-white">$250</strong>. All 20 are live now. Want any of them wired to your real numbers? That&apos;s a bespoke build.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {COMPANY_MODELS.map(m => (
              <div key={m.name} className="bg-white dark:bg-slate-950 p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{m.name}</p>
                  {m.live && <span className="bg-[#1E7F4F] text-white font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5">Live</span>}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mb-3 flex-1">{m.blurb}</p>
                {m.live && m.slug
                  ? <a href={`/enterprise/${m.slug}`} className="font-mono text-[10px] uppercase tracking-widest text-[#B01C24]">Open the model · $250 →</a>
                  : <a href="/contact" className="font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#B01C24] transition-colors">Request build →</a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 40 giant sims */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-3">The Giant-Model Library</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-10">
            Beyond the company models, a bespoke engagement can include any of these institutional-grade financial models — the kind used in banking, private equity, and the boardroom.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {GIANT_SIMS.map((s, i) => (
              <div key={s} className="border border-slate-200 dark:border-slate-800 p-3 flex gap-2 items-start">
                <span className="font-mono text-[10px] text-[#B01C24] tabular-nums mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-snug">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included + FAQ */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">What a Bespoke Engagement Includes</h2>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              {[
                'A live, interactive model of your whole business — web and Excel',
                'Every driver linked: growth → revenue → margin → cash → runway → valuation',
                'A working session with the Ivy League operator who built it',
                'Board- and investor-ready scenario libraries (base / bull / bear)',
                'Documented methodology and assumptions — no black box',
                'Optional ongoing updates as your business evolves',
              ].map(x => (
                <li key={x} className="flex gap-3"><span className="text-[#B01C24] font-bold flex-shrink-0">✓</span><span>{x}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Questions</h2>
            <div className="space-y-5">
              {faqs.map(f => (
                <div key={f.q} className="border-b border-slate-200 dark:border-slate-800 pb-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">{f.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABlock heading="Ready to see your business modeled end to end?" />
    </>
  )
}
