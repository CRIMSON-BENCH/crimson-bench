import { OPERATOR_KIT } from '@/lib/bonus-kit'

/** The free "Operator's Kit" bonus pack included with every toolkit. */
export default function OperatorKit({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="border border-emerald-600/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
        <p className="font-mono text-[10px] tracking-widest uppercase text-emerald-700 dark:text-emerald-400 mb-1">
          Included Free · A $0 add-on that costs you nothing
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <strong>{OPERATOR_KIT.name}</strong> — cheat sheet, chart pack, assumptions checklist &amp; quick-start guide,
          bundled with this toolkit.
        </p>
      </div>
    )
  }
  return (
    <div className="border border-slate-200 dark:border-slate-800">
      <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
        <p className="font-mono text-xs tracking-widest uppercase text-emerald-700 dark:text-emerald-400 mb-2">
          Included Free With Every Toolkit
        </p>
        <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-1">{OPERATOR_KIT.name}</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">{OPERATOR_KIT.blurb}</p>
      </div>
      <ul className="grid sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800">
        {OPERATOR_KIT.items.map(item => (
          <li key={item.title} className="bg-white dark:bg-slate-950 p-4">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-0.5 flex items-center gap-2">
              <span className="text-emerald-600">✓</span>
              {item.title}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug pl-6">{item.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
