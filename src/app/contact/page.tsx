import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ContactForm from '@/components/ContactForm'
import { orgSchema, localBusinessSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Deploy an Executive — Contact The Crimson Bench',
  description:
    'Contact The Crimson Bench to deploy an Ivy League-educated fractional executive within 48 hours. All 8 C-suite roles available. Flat-rate pricing. 14-day cancellation. Founded in New York City.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={orgSchema()} />
      <JsonLd data={localBusinessSchema({ role: 'Executive', city: 'New York', state: 'New York', stateAbbr: 'NY' })} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">Deploy in 48 Hours</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Contact The Crimson Bench
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Tell us about your mandate. We deploy within 48 hours of engagement authorization — whether you need a fractional CEO, CFO, CTO, COO, CRO, CMO, CHRO, or CISO.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <div className="border border-slate-200 dark:border-slate-800 p-8">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-6">Engagement Inquiry</p>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">
              This form is processed by verified corporate accounts only. We respond to all inquiries within 4 business hours. For urgent needs, state &ldquo;URGENT&rdquo; in the mandate description.
            </p>
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#B01C24] mb-4">What Happens Next</p>
            <ol className="space-y-4">
              {[
                'You submit your mandate description',
                'We review within 4 business hours',
                'A Crimson Bench partner calls to confirm scope',
                'CSA executed and executive assigned',
                'First session scheduled within 48 hours',
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-mono text-[#B01C24] font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Our Guarantees</p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {[
                '48-hour deployment SLA',
                'Ivy League credential verified',
                'Flat-rate pricing — no markup',
                '14-day no-cause cancellation',
                'No conversion fee if you hire full-time',
              ].map(g => (
                <li key={g} className="flex gap-2">
                  <span className="text-[#B01C24]">✓</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">Prefer to Start Smaller?</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Our Executive Diagnostic ($1,500 one-time) gives you a 3-hour session and written brief before any monthly commitment.
            </p>
            <a href="/services/executive-diagnostic" className="btn-outline w-full text-center block text-sm py-2">Book a $1,500 Diagnostic</a>
          </div>
        </aside>
      </div>
    </>
  )
}
