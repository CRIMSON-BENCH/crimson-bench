'use client'

import { useMemo, useState } from 'react'
import { getMegaSimById } from '@/lib/mega-sims'

export default function MegaSimRunner({ id }: { id: string }) {
  const sim = getMegaSimById(id)
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries((sim?.modules ?? []).flatMap(m => m.inputs).map(i => [i.key, i.default]))
  )
  const result = useMemo(() => (sim ? sim.compute(vals) : null), [sim, vals])
  if (!sim || !result) return null

  return (
    <div className="border border-slate-200 dark:border-slate-800">
      {/* Input modules */}
      <div className="bg-white dark:bg-slate-950 p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
        <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-6">Business Drivers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sim.modules.map(mod => (
            <div key={mod.title}>
              <p className="font-serif text-lg text-slate-900 dark:text-white">{mod.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{mod.blurb}</p>
              <div className="space-y-3">
                {mod.inputs.map(inp => (
                  <label key={inp.key} className="block">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{inp.label}</span>
                    <div className="mt-1 flex items-center border border-slate-300 dark:border-slate-700 focus-within:border-[#B01C24] bg-[#FFF7E6] dark:bg-slate-900 transition-colors">
                      {inp.prefix && <span className="pl-3 text-slate-500 font-mono text-sm">{inp.prefix}</span>}
                      <input
                        type="number"
                        step="any"
                        value={Number.isFinite(vals[inp.key]) ? vals[inp.key] : ''}
                        onChange={e => setVals(v => ({ ...v, [inp.key]: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-transparent px-3 py-2 text-slate-900 dark:text-white font-mono tabular-nums outline-none"
                      />
                      {inp.suffix && <span className="pr-3 text-slate-500 font-mono text-sm">{inp.suffix}</span>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outputs */}
      <div className="bg-slate-900 dark:bg-black p-6 md:p-8">
        {/* Summary metrics */}
        <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-4">The Integrated Picture</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {result.summary.map(m => (
            <div key={m.label}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">{m.label}</p>
              <p className={`font-mono tabular-nums ${m.highlight ? 'text-2xl font-bold' : 'text-lg'} ${m.bad ? 'text-red-400' : m.highlight ? 'text-[#F0B34A]' : 'text-white/80'}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {result.sections.map(sec => (
            <div key={sec.title}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">{sec.title}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {sec.columns.map(c => (
                        <th key={c} className="text-left font-mono text-[10px] tracking-widest uppercase text-white/40 pb-2 pr-6 whitespace-nowrap">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.rows.map((row, i) => (
                      <tr key={i} className="border-t border-white/10">
                        {row.map((cell, j) => (
                          <td key={j} className={`py-2 pr-6 whitespace-nowrap tabular-nums font-mono ${j === 0 ? 'text-white/60 text-xs' : 'text-white/90'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Operator's read */}
        <div className="mt-8 border-l-2 border-[#B01C24] pl-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#F0B34A] mb-1">The Operator&apos;s Read</p>
          <p className="text-sm text-white/85 leading-relaxed">{result.note}</p>
        </div>
      </div>
    </div>
  )
}
