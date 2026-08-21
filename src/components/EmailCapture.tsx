'use client'

import { useState } from 'react'

// Reuses the contact backend by default; override with NEXT_PUBLIC_SUBSCRIBE_ENDPOINT
// when a dedicated Lovable /subscribe function exists.
const ENDPOINT =
  process.env.NEXT_PUBLIC_SUBSCRIBE_ENDPOINT ||
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
  'https://crimson-bench-connect.lovable.app/api/public/contact'

export default function EmailCapture({
  heading = 'Get the Operator’s Kit — free.',
  sub = 'Drop your email and we’ll send you the free bonus pack (cheat sheet, chart pack, checklist & quick-start) plus new toolkits as they drop. No spam, unsubscribe anytime.',
  source = 'lead-magnet',
  cta = 'Send me the free kit →',
}: {
  heading?: string
  sub?: string
  source?: string
  cta?: string
}) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setState('error'); return }
    setState('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Subscriber',
          email,
          company: '',
          message: `Lead magnet signup — source: ${source}. Send the free Operator's Kit + updates.`,
          subscribe: true,
          source,
          website,
        }),
      })
      const data = await res.json().catch(() => null)
      setState(res.ok && data && (data.ok ?? true) ? 'sent' : 'error')
    } catch { setState('error') }
  }

  if (state === 'sent') {
    return (
      <div className="border border-emerald-600/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-8 text-center">
        <p className="text-3xl mb-2">✓</p>
        <p className="font-serif text-xl text-slate-900 dark:text-white mb-1">Check your inbox.</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your free Operator’s Kit is on its way. (If it’s not there in a minute, check spam.)
        </p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8">
      <p className="section-eyebrow mb-3">Free Download</p>
      <h3 className="font-serif text-2xl md:text-3xl font-normal text-slate-900 dark:text-white mb-2">{heading}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 max-w-xl leading-relaxed">{sub}</p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <input
          type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={website} onChange={e => setWebsite(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-[#B01C24] transition-colors"
        />
        <button type="submit" disabled={state === 'sending'} className="btn-crimson py-3 px-6 whitespace-nowrap disabled:opacity-60">
          {state === 'sending' ? 'Sending…' : cta}
        </button>
      </form>
      {state === 'error' && (
        <p className="text-sm text-red-600 mt-3">Please enter a valid email address.</p>
      )}
    </div>
  )
}
