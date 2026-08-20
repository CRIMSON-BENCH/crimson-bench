'use client'

import { useMemo, useState } from 'react'
import { getToolById, type OutFormat } from '@/lib/tools'
import { downloadResults, requestAIAnalysis, AI_ENDPOINT } from '@/lib/tool-actions'

function fmt(value: number, format: OutFormat): string {
  if (!isFinite(value)) return '—'
  switch (format) {
    case 'money':
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value >= 1000 ? 0 : 2 })
    case 'percent':
      return `${(value * 100).toFixed(1)}%`
    case 'x':
      return `${value.toFixed(1)}x`
    case 'months':
      return `${value.toFixed(1)} mo`
    case 'years':
      return `${value.toFixed(1)} yr`
    default:
      return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }
}

export default function ToolRunner({ id }: { id: string }) {
  const tool = getToolById(id)
  const [vals, setVals] = useState<Record<string, number>>(
    () => Object.fromEntries((tool?.inputs ?? []).map(i => [i.key, i.default]))
  )
  const [aiText, setAiText] = useState('')
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'soon' | 'error'>('idle')

  const { outputs, insight } = useMemo(() => {
    if (!tool) return { outputs: {} as Record<string, number>, insight: '' }
    const o = tool.compute(vals)
    return { outputs: o, insight: tool.insight(vals, o) }
  }, [tool, vals])

  if (!tool) return null

  const resultRows = (): [string, string][] => [
    ...tool.inputs.map(i => [i.label, `${i.prefix ?? ''}${vals[i.key]}${i.suffix ?? ''}`] as [string, string]),
    ...tool.outputs.map(o => [o.label, fmt(outputs[o.key], o.format)] as [string, string]),
    ['Operator’s Read', insight],
  ]

  const onDownload = () => downloadResults(`${tool.id}-results.csv`, resultRows())

  const onAI = async () => {
    setAiState('loading'); setAiText('')
    try {
      const results = Object.fromEntries(tool.outputs.map(o => [o.label, fmt(outputs[o.key], o.format)]))
      const text = await requestAIAnalysis({ tool: tool.name, inputs: vals, results })
      if (!text) { setAiState('soon') } else { setAiText(text); setAiState('idle') }
    } catch { setAiState('error') }
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
        {/* Inputs */}
        <div className="bg-white dark:bg-slate-950 p-8">
          <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-6">Your Numbers</p>
          <div className="space-y-5">
            {tool.inputs.map(inp => (
              <label key={inp.key} className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">{inp.label}</span>
                <div className="mt-1 flex items-center border border-slate-300 dark:border-slate-700 focus-within:border-[#B01C24] bg-[#FFF7E6] dark:bg-slate-900 transition-colors">
                  {inp.prefix && <span className="pl-3 text-slate-500 font-mono text-sm">{inp.prefix}</span>}
                  <input
                    type="number"
                    step={inp.step ?? 'any'}
                    value={Number.isFinite(vals[inp.key]) ? vals[inp.key] : ''}
                    onChange={e => setVals(v => ({ ...v, [inp.key]: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-transparent px-3 py-2.5 text-slate-900 dark:text-white font-mono tabular-nums outline-none"
                  />
                  {inp.suffix && <span className="pr-3 text-slate-500 font-mono text-sm">{inp.suffix}</span>}
                </div>
                {inp.help && <span className="text-xs text-slate-400 mt-1 block">{inp.help}</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div className="bg-slate-900 dark:bg-black p-8 flex flex-col">
          <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-6">The Result</p>
          <div className="space-y-4 flex-1">
            {tool.outputs.map(out => (
              <div key={out.key} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
                <span className={`text-sm ${out.highlight ? 'text-white' : 'text-white/60'}`}>{out.label}</span>
                <span className={`font-mono tabular-nums ${out.highlight ? 'text-2xl font-bold text-[#F0B34A]' : 'text-lg text-white/80'}`}>
                  {fmt(outputs[out.key], out.format)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-l-2 border-[#B01C24] pl-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#F0B34A] mb-1">The Operator&apos;s Read</p>
            <p className="text-sm text-white/85 leading-relaxed">{insight}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={onDownload} className="btn-outline py-2 px-4 text-sm">↓ Download results (CSV)</button>
        <button onClick={onAI} disabled={aiState === 'loading'} className="btn-crimson py-2 px-4 text-sm disabled:opacity-60">
          {aiState === 'loading' ? 'Analyzing…' : '✦ Get AI analysis'}
        </button>
        <a href="/contact" className="btn-outline py-2 px-4 text-sm">Ask an operator →</a>
      </div>

      {(aiText || aiState === 'soon' || aiState === 'error') && (
        <div className="mt-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#B01C24] mb-2">AI Analysis</p>
          {aiState === 'soon' && (
            <p className="text-sm text-slate-500 dark:text-slate-400">AI analysis connects to your Gemini endpoint — set <code className="font-mono text-xs">NEXT_PUBLIC_AI_ENDPOINT</code> to turn it on. Your numbers are ready to send the moment it&apos;s wired.</p>
          )}
          {aiState === 'error' && <p className="text-sm text-red-600">Couldn&apos;t reach the AI service. Try again in a moment.</p>}
          {aiText && <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{aiText}</p>}
        </div>
      )}
    </div>
  )
}
