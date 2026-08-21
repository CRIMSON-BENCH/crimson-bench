'use client'

import { useMemo, useState } from 'react'

export interface SearchItem { type: string; name: string; tagline: string; category: string; url: string }

const TYPE_LABEL: Record<string, string> = {
  tool: 'Free Tool',
  sim: 'Pro Simulator',
  product: 'Toolkit',
  model: 'Company Model',
}
const TYPE_COLOR: Record<string, string> = {
  tool: 'text-slate-500',
  sim: 'text-[#B0801A] dark:text-[#F0B34A]',
  product: 'text-[#B01C24]',
  model: 'text-[#1E7F4F]',
}

export default function SearchClient({ index }: { index: SearchItem[] }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('all')

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    let items = index
    if (type !== 'all') items = items.filter(i => i.type === type)
    if (!term) return items.slice(0, 40)
    const scored = items
      .map(i => {
        const name = i.name.toLowerCase()
        const hay = `${name} ${i.tagline.toLowerCase()} ${i.category.toLowerCase()}`
        if (!hay.includes(term)) return null
        // rank: name-start > name-contains > other
        const score = name.startsWith(term) ? 0 : name.includes(term) ? 1 : 2
        return { i, score }
      })
      .filter(Boolean) as { i: SearchItem; score: number }[]
    return scored.sort((a, b) => a.score - b.score).slice(0, 60).map(s => s.i)
  }, [q, type, index])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: index.length }
    for (const i of index) c[i.type] = (c[i.type] || 0) + 1
    return c
  }, [index])

  return (
    <div>
      <div className="relative mb-6">
        <input
          autoFocus
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search 800+ tools, toolkits, and models…"
          className="w-full border border-slate-300 dark:border-slate-700 focus:border-[#B01C24] bg-white dark:bg-slate-950 px-5 py-4 text-lg text-slate-900 dark:text-white outline-none transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[['all', 'Everything'], ['tool', 'Free Tools'], ['sim', 'Pro Simulators'], ['product', 'Toolkits'], ['model', 'Company Models']].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setType(k)}
            className={`font-mono text-xs tracking-wider uppercase px-3 py-1.5 border transition-colors ${type === k ? 'border-[#B01C24] bg-[#B01C24] text-white' : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#B01C24]'}`}
          >
            {label} <span className="opacity-60">{counts[k] ?? 0}</span>
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'} for "${q.trim()}"` : `Showing ${results.length} of ${counts[type] ?? counts.all}`}
      </p>

      <div className="grid gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
        {results.map(r => (
          <a key={r.url} href={r.url} className="bg-white dark:bg-slate-950 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#B01C24] transition-colors">{r.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{r.tagline}</p>
            </div>
            <span className={`font-mono text-[9px] tracking-widest uppercase whitespace-nowrap mt-1 ${TYPE_COLOR[r.type] ?? 'text-slate-400'}`}>{TYPE_LABEL[r.type] ?? r.type}</span>
          </a>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <p className="mb-2">No matches for &ldquo;{q}&rdquo;.</p>
          <p className="text-sm">Try a broader term, or <a href="/contact" className="text-[#B01C24] underline">ask an operator</a>.</p>
        </div>
      )}
    </div>
  )
}
