// Shared client actions for tools: download results + AI analysis (Gemini via your API).
import { supabase } from '@/lib/supabase'

/** Endpoint that runs the Gemini analysis. Defaults to the live Lovable function;
 *  override with NEXT_PUBLIC_AI_ENDPOINT. */
export const AI_ENDPOINT =
  process.env.NEXT_PUBLIC_AI_ENDPOINT || 'https://crimson-bench-connect.lovable.app/api/public/ai-analysis'

/** Trigger a CSV download of a tool's inputs + results, entirely client-side. */
export function downloadResults(filename: string, rows: [string, string][]) {
  const csv = ['Field,Value', ...rows.map(([k, v]) => `"${k.replace(/"/g, '""')}","${String(v).replace(/"/g, '""')}"`)].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export interface AIPayload {
  tool: string
  inputs: Record<string, number>
  results: Record<string, string>
  question?: string
}

/** POST the scenario to the AI endpoint and return its written analysis.
 *  Returns '' when no endpoint is configured yet (caller shows a friendly state). */
export async function requestAIAnalysis(payload: AIPayload): Promise<string> {
  if (!AI_ENDPOINT) return ''
  const { data: sess } = await supabase.auth.getSession()
  const token = sess.session?.access_token
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) return 'Sign in (top-right) to run AI analysis on your scenario.'
  if (res.status === 402) return 'AI analysis is a Toolkit Pro feature — unlock it to get an operator’s read on these numbers.'
  if (!res.ok) throw new Error(`AI request failed (${res.status})`)
  const data = await res.json().catch(() => null)
  return (data && (data.analysis || data.text || data.result || data.message)) || ''
}
