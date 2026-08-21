'use client'

import { useState } from 'react'

// Defaults to the live Lovable endpoint; override with NEXT_PUBLIC_CONTACT_ENDPOINT if it moves.
const ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
  'https://crimson-bench-connect.lovable.app/api/public/contact'

const inputCls =
  'w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-[#B01C24] transition-colors'
const labelCls = 'block font-mono text-xs tracking-widest uppercase text-slate-500 mb-2'

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [f, setF] = useState({
    firstName: '', lastName: '', email: '', company: '',
    role: '', tier: '', message: '', website: '', // website = honeypot
  })
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.firstName || !f.email || !f.message) { setState('error'); return }
    setState('sending')
    const message =
      `${f.message}\n\n— Role needed: ${f.role || 'Not specified'}` +
      `\n— Engagement tier: ${f.tier || 'Not specified'}`
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: f.firstName, lastName: f.lastName, email: f.email,
          company: f.company, message,
          urgent: /urgent/i.test(f.message),
          website: f.website,
        }),
      })
      const data = await res.json().catch(() => null)
      setState(res.ok && data && data.ok ? 'sent' : 'error')
    } catch { setState('error') }
  }

  if (state === 'sent') {
    return (
      <div className="border border-[#1E7F4F]/40 bg-[#1E7F4F]/5 p-8 text-center">
        <p className="text-3xl mb-2">✓</p>
        <p className="font-serif text-xl text-slate-900 dark:text-white mb-2">Inquiry received.</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          A Crimson Bench partner will respond within 4 business hours. Check your inbox for a confirmation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* honeypot — hidden from users, catches bots */}
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={f.website} onChange={e => set('website', e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>First Name *</label>
          <input className={inputCls} placeholder="Alexandra" value={f.firstName} onChange={e => set('firstName', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Last Name *</label>
          <input className={inputCls} placeholder="Chen" value={f.lastName} onChange={e => set('lastName', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Work Email *</label>
        <input type="email" className={inputCls} placeholder="alexandra@company.com" value={f.email} onChange={e => set('email', e.target.value)} required />
      </div>

      <div>
        <label className={labelCls}>Company Name *</label>
        <input className={inputCls} placeholder="Acme Corp" value={f.company} onChange={e => set('company', e.target.value)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Role Needed *</label>
          <select className={inputCls} value={f.role} onChange={e => set('role', e.target.value)}>
            <option value="">Select a role</option>
            {['Fractional CEO', 'Fractional CFO', 'Fractional CTO', 'Fractional COO', 'Fractional CRO', 'Fractional CMO', 'Fractional CHRO', 'Fractional CISO', 'Executive Diagnostic', 'Multiple Roles / PE Package', 'Other'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Engagement Tier</label>
          <select className={inputCls} value={f.tier} onChange={e => set('tier', e.target.value)}>
            <option value="">Not sure yet</option>
            {['Executive Diagnostic ($1,500)', 'Advisory Retainer ($4,000/mo)', 'Scale-Up Fractional ($7,500/mo)', 'Growth Fractional ($12,500/mo)', 'Embedded Executive ($22,500/mo)', 'PE / Enterprise Package'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Mandate Description *</label>
        <textarea rows={5} className={`${inputCls} resize-none`} value={f.message} onChange={e => set('message', e.target.value)}
          placeholder="Describe what you need accomplished. Include: current situation, urgency, company stage, and any specific constraints. The more specific, the faster we can match and deploy." required />
      </div>

      {state === 'error' && (
        <p className="text-sm text-red-600">Please fill in your name, email, and mandate description — then try again.</p>
      )}

      <div>
        <button type="submit" disabled={state === 'sending'} className="btn-crimson py-4 px-10 w-full md:w-auto disabled:opacity-60">
          {state === 'sending' ? 'Sending…' : 'Submit Engagement Inquiry →'}
        </button>
        <p className="text-xs text-slate-400 font-mono mt-3">
          * Verified corporate accounts only · Response within 4 business hours
        </p>
      </div>
    </form>
  )
}
