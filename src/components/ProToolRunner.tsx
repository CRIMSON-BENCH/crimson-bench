'use client'

import { useMemo, useState } from 'react'
import { getProToolById } from '@/lib/pro-tools'
import { downloadResults, requestAIAnalysis } from '@/lib/tool-actions'
import { TOOLKIT_PRO_URL } from '@/lib/entitlement'

export default function ProToolRunner({ id, locked = false }: { id: string; locked?: boolean }) {
  const tool = getProToolById(id)
  const [vals, setVals] = useState<Record<string, number>>(
    () => Object.fromEntries((tool?.inputs ?? []).map(i => [i.key, i.default]))
  )
  const [aiText, setAiText] = useState('')
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'soon' | 'error'>('idle')

  const result = useMemo(() => (tool ? tool.compute(vals) : null), [tool, vals])
  if (!tool || !result) return null

  const visibleRows = locked ? result.rows.slice(0, 2) : result.rows
  const hiddenRows = locked ? result.rows.slice(2) : []

  const onDownload = () => {
    const rows: [string, string][] = [
      ...tool.inputs.map(i => [i.label, `${i.prefix ?? ''}${vals[i.key]}${i.suffix ?? ''}`] as [string, string]),
      ...result.metrics.map(m => [m.label, m.value] as [string, string]),
      [result.columns.join(' | '), ''],
      ...result.rows.map(r => [r[0], r.slice(1).join(' | ')] as [string, string]),
      ['Operator’s Read', result.note],
    ]
    downloadResults(`${tool.id}-projection.csv`, rows)
  }

  const onAI = async () => {
    setAiState('loading'); setAiText('')
    try {
      const results = Object.fromEntries(result.metrics.map(m => [m.label, m.value]))
      const text = await requestAIAnalysis({ tool: tool.name, inputs: vals, results })
      if (!text) setAiState('soon'); else { setAiText(text); setAiState('idle') }
    } catch { setAiState('error') }
  }

  return (
    <div>
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

        {/* Metrics + table */}
        <div className="bg-slate-900 dark:bg-black p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {result.metrics.map(m => (
              <div key={m.label}>
                <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">{m.label}</p>
                <p className={`font-mono tabular-nums ${m.highlight ? 'text-2xl font-bold text-[#F0B34A]' : 'text-lg text-white/80'}`}>{m.value}</p>
              </div>
            ))}
          </div>
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
                {visibleRows.map((row, i) => (
                  <tr key={i} className="border-t border-white/10">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-2.5 pr-6 whitespace-nowrap tabular-nums ${j === 0 ? 'text-white/70 font-mono text-xs' : 'text-white/90 font-mono'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Locked preview: blurred remaining rows + unlock overlay */}
          {locked && hiddenRows.length > 0 && (
            <div className="relative mt-1 overflow-hidden">
              <div className="pointer-events-none select-none blur-[6px] opacity-60">
                <table className="w-full text-sm">
                  <tbody>
                    {hiddenRows.map((row, i) => (
                      <tr key={i} className="border-t border-white/10">
                        {row.map((cell, j) => (
                          <td key={j} className={`py-2.5 pr-6 whitespace-nowrap tabular-nums ${j === 0 ? 'text-white/70 font-mono text-xs' : 'text-white/90 font-mono'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gradient-to-b from-transparent to-black/60 px-6">
                <p className="text-2xl mb-1">🔒</p>
                <p className="text-white font-serif text-lg mb-1">Unlock the full projection</p>
                <p className="text-white/60 text-sm mb-4">Every row, plus Excel/PDF export and AI analysis.</p>
                <a href={TOOLKIT_PRO_URL} className="btn-crimson py-2.5 px-6">Unlock Toolkit Pro →</a>
              </div>
            </div>
          )}

          {/* Operator's read (unlocked) */}
          {!locked && (
            <div className="mt-6 border-l-2 border-[#B01C24] pl-4">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[#F0B34A] mb-1">The Operator&apos;s Read</p>
              <p className="text-sm text-white/85 leading-relaxed">{result.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {locked ? (
        <div className="mt-4 border border-[#F0B34A]/40 bg-[#F0B34A]/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">🔒 Save scenarios, export to Excel &amp; PDF, run AI analysis, and unlock every simulator.</p>
          <a href={TOOLKIT_PRO_URL} className="btn-crimson py-2.5 px-5 whitespace-nowrap">Unlock Toolkit Pro →</a>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={onDownload} className="btn-outline py-2 px-4 text-sm">↓ Download projection (CSV)</button>
          <button onClick={onAI} disabled={aiState === 'loading'} className="btn-crimson py-2 px-4 text-sm disabled:opacity-60">
            {aiState === 'loading' ? 'Analyzing…' : '✦ Get AI analysis'}
          </button>
          <a href="/contact" className="btn-outline py-2 px-4 text-sm">Ask an operator →</a>
        </div>
      )}

      {!locked && (aiText || aiState === 'soon' || aiState === 'error') && (
        <div className="mt-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#B01C24] mb-2">AI Analysis</p>
          {aiState === 'soon' && (
            <p className="text-sm text-slate-500 dark:text-slate-400">Our AI is being connected and will be available here shortly. In the meantime, <a href="/contact" className="text-[#B01C24] underline">talk to an operator</a>.</p>
          )}
          {aiState === 'error' && <p className="text-sm text-red-600">Couldn&apos;t reach the AI service. Try again in a moment.</p>}
          {aiText && <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{aiText}</p>}
        </div>
      )}
    </div>
  )
}
