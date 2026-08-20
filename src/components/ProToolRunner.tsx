'use client'

import { useMemo, useState } from 'react'
import { getProToolById } from '@/lib/pro-tools'

export default function ProToolRunner({ id }: { id: string }) {
  const tool = getProToolById(id)
  const [vals, setVals] = useState<Record<string, number>>(
    () => Object.fromEntries((tool?.inputs ?? []).map(i => [i.key, i.default]))
  )
  const result = useMemo(() => (tool ? tool.compute(vals) : null), [tool, vals])
  if (!tool || !result) return null

  return (
    <div className="border border-slate-200 dark:border-slate-800">
      {/* Inputs */}
      <div className="bg-white dark:bg-slate-950 p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
        <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-5">Assumptions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tool.inputs.map(inp => (
            <label key={inp.key} className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">{inp.label}</span>
              <div className="mt-1 flex items-center border border-slate-300 dark:border-slate-700 focus-within:border-[#B01C24] bg-[#FFF7E6] dark:bg-slate-900 transition-colors">
                {inp.prefix && <span className="pl-3 text-slate-500 font-mono text-sm">{inp.prefix}</span>}
                <input
                  type="number"
                  step="any"
                  value={Number.isFinite(vals[inp.key]) ? vals[inp.key] : ''}
                  onChange={e => setVals(v => ({ ...v, [inp.key]: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-transparent px-3 py-2.5 text-slate-900 dark:text-white font-mono tabular-nums outline-none"
                />
                {inp.suffix && <span className="pr-3 text-slate-500 font-mono text-sm">{inp.suffix}</span>}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-slate-900 dark:bg-black p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {result.metrics.map(m => (
            <div key={m.label}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">{m.label}</p>
              <p className={`font-mono tabular-nums ${m.highlight ? 'text-2xl font-bold text-[#F0B34A]' : 'text-lg text-white/80'}`}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Projection table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {result.columns.map(c => (
                  <th key={c} className="text-left font-mono text-[10px] tracking-widest uppercase text-white/40 pb-3 pr-6 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} className="border-t border-white/10">
                  {row.map((cell, j) => (
                    <td key={j} className={`py-2.5 pr-6 whitespace-nowrap tabular-nums ${j === 0 ? 'text-white/70 font-mono text-xs' : 'text-white/90 font-mono'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-l-2 border-[#B01C24] pl-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#F0B34A] mb-1">The Operator&apos;s Read</p>
          <p className="text-sm text-white/85 leading-relaxed">{result.note}</p>
        </div>
      </div>
    </div>
  )
}
