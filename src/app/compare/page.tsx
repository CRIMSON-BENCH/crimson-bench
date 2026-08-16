import type { Metadata } from 'next'
import { COMPETITORS } from '@/lib/competitors'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Compare Fractional Executive Firms | The Crimson Bench vs. Competitors',
  description:
    'Detailed comparisons of The Crimson Bench vs. GoFractional, Bolster, Catalant, BTG, YC Talent, and 10+ more fractional executive firms. Pricing, deployment time, credentials, and who wins.',
  alternates: { canonical: '/compare' },
}

export default function ComparePage() {
  return (
    <>
      <JsonLd data={orgSchema()} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">Competitor Analysis</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            The Crimson Bench vs. Every Competitor
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            We compare ourselves to every major fractional executive firm in the market — on pricing, deployment
            time, credential standards, network size, and flexibility. The data speaks for itself.
          </p>
        </div>
      </section>

      {/* Global comparison table */}
      <section className="py-12 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 pr-4 font-mono tracking-wide uppercase text-slate-500">Company</th>
                <th className="text-left py-3 px-3 font-mono tracking-wide uppercase text-slate-500">Model</th>
                <th className="text-center py-3 px-3 font-mono tracking-wide uppercase text-slate-500">Ivy League</th>
                <th className="text-center py-3 px-3 font-mono tracking-wide uppercase text-slate-500">Flat-Rate</th>
                <th className="text-left py-3 px-3 font-mono tracking-wide uppercase text-slate-500">Deploy</th>
                <th className="text-left py-3 px-3 font-mono tracking-wide uppercase text-slate-500">Cancel</th>
                <th className="text-left py-3 px-3 font-mono tracking-wide uppercase text-slate-500">Detail</th>
              </tr>
            </thead>
            <tbody>
              {/* Crimson Bench row */}
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#B01C24]/5">
                <td className="py-3 pr-4 font-semibold text-[#B01C24]">The Crimson Bench</td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">Consulting firm</td>
                <td className="py-3 px-3 text-center text-[#B01C24] font-bold">✓</td>
                <td className="py-3 px-3 text-center text-[#B01C24] font-bold">✓</td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">48 hours</td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">14 days</td>
                <td className="py-3 px-3"><span className="text-[#B01C24] font-mono">YOU ARE HERE</span></td>
              </tr>
              {COMPETITORS.map(comp => (
                <tr key={comp.slug} className="border-b border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-300">{comp.name}</td>
                  <td className="py-3 px-3 text-slate-500">{comp.model}</td>
                  <td className="py-3 px-3 text-center">{comp.ivyLeague ? <span className="text-emerald-500">✓</span> : <span className="text-slate-300 dark:text-slate-600">✗</span>}</td>
                  <td className="py-3 px-3 text-center">{comp.flatRate ? <span className="text-emerald-500">✓</span> : <span className="text-slate-300 dark:text-slate-600">✗</span>}</td>
                  <td className="py-3 px-3 text-slate-500">{comp.deploymentTime}</td>
                  <td className="py-3 px-3 text-slate-500">{comp.cancellationPolicy}</td>
                  <td className="py-3 px-3">
                    <a href={`/compare/${comp.slug}`} className="text-[#B01C24] font-mono uppercase tracking-wide hover:underline">
                      Compare →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Individual comparison cards */}
      <section className="py-16 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-8">
            Detailed Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            {COMPETITORS.map(comp => (
              <a
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="bg-white dark:bg-slate-950 p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
              >
                <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-white mb-2 group-hover:text-[#B01C24] transition-colors">
                  vs. {comp.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
                  {comp.verdictVsCrimson}
                </p>
                <div className="flex flex-wrap gap-2">
                  {!comp.ivyLeague && (
                    <span className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5">
                      No Ivy Guarantee
                    </span>
                  )}
                  {!comp.flatRate && (
                    <span className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5">
                      Markup Fees
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-[#B01C24] uppercase tracking-wider mt-4">
                  Full Comparison →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock heading="Why Crimson Bench Wins. Every Time." />
    </>
  )
}
