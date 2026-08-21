import { ECOSYSTEM, ECO_DISCOUNT_PCT, ECO_COUPON } from '@/lib/ecosystem'

/** Cross-promo cards for the founder's other apps. `limit` trims for compact strips. */
export default function Ecosystem({ limit }: { limit?: number }) {
  const apps = limit ? ECOSYSTEM.slice(0, limit) : ECOSYSTEM
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
      {apps.map(app => (
        <a
          key={app.name}
          href={`${app.url}?ref=crimsonbench`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-slate-950 p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group flex flex-col"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-lg text-slate-900 dark:text-white group-hover:text-[#B01C24] transition-colors">
              {app.name}
            </h3>
            <span className="font-mono text-[9px] tracking-widest uppercase text-slate-400 whitespace-nowrap mt-1">↗ Visit</span>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{app.tagline}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug mb-3 flex-1">{app.desc}</p>
          <p className="text-xs text-slate-400 mb-2">{app.pairs}</p>
          <p className="font-mono text-[11px] tracking-wide text-[#B01C24]">
            {ECO_DISCOUNT_PCT}% off with code {ECO_COUPON}
          </p>
        </a>
      ))}
    </div>
  )
}
