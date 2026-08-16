import type { Metadata } from 'next'
import CTABlock from '@/components/CTABlock'
import JsonLd from '@/components/JsonLd'
import { orgSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'About The Crimson Bench — Founded in New York City, Est. 2002',
  description:
    'The Crimson Bench was founded in New York City in 2002. 25,000+ Ivy League-educated executives. 150,000+ global consultants — scientists, engineers, ex-military. 24,000+ mandates. The story behind the firm.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={orgSchema()} />

      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow mb-4">About · Est. 2002</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-slate-900 dark:text-white max-w-3xl mb-6">
            Founded in New York City. Built on Institutional Experience.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            The Crimson Bench was established in 2002 in New York City — before "fractional executive" was a category, before platforms, before the gig economy rationalized what we had always done: deploy exceptional operators into organizations that need them.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <div>
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">The Firm</h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              The Crimson Bench is a global executive consulting firm headquartered in New York City. We maintain a network of 25,000+ Ivy League-educated C-suite executives and 150,000+ total global consultants — including scientists, engineers, and ex-military operators — and deploy them to organizations within 48 hours at transparent flat-rate pricing.
            </p>
            <p>
              Our name reflects what we have always believed: the best executives are not permanent employees of a single company. They are a bench — a deep, credentialed, tested roster of operators who can step into any situation and immediately deliver institutional-grade leadership.
            </p>
            <p>
              Over twenty-two years and 24,000+ mandates, we have deployed fractional CEOs, CFOs, CTOs, COOs, CROs, CMOs, CHROs, and CISOs across capital markets, PE-backed growth companies, VC-funded startups, family-owned businesses, nonprofits, and government-adjacent organizations.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: '25,000+ Ivy League Executives',
                body: 'Every executive on our C-suite bench holds an undergraduate or graduate degree from an Ivy League institution. This is a guaranteed standard — verified before deployment — not a claim about a subset of our network or a filter you apply when browsing a marketplace.',
              },
              {
                title: '150,000+ Global Consultants',
                body: 'Beyond the C-suite, we can tap our 150,000-strong global consultant network for any specialized need — including PhD scientists, aerospace and materials engineers, data scientists, and ex-military operators with specialized technical and operational backgrounds.',
              },
              {
                title: '48-Hour Deployment SLA',
                body: 'We guarantee deployment within 48 hours of engagement authorization. Our executives are pre-vetted and on-call. There is no sourcing period, no candidate browsing, no waiting for introductions. The people are ready. The question is whether your organization is.',
              },
              {
                title: 'Flat-Rate Pricing',
                body: 'No marketplace markup. No hourly billing that expands unpredictably. No conversion fee if you decide to hire someone full-time. Six transparent engagement tiers from $4,000 to $22,500+/month — plus one-time diagnostic and audit products starting at $500.',
              },
              {
                title: '14-Day No-Cause Cancellation',
                body: 'Every monthly engagement can be cancelled with 14 days written notice — no penalty, no minimum term, no questions asked. We believe in earning the relationship each month, not trapping you in it. This is our commitment to accountability.',
              },
              {
                title: 'Founded in New York City · Est. 2002',
                body: 'Two decades of institutional operating experience in the world\'s most demanding capital markets environment. 24,000+ mandates across every sector, stage, and market condition. We have seen everything — and our executives have lived through it.',
              },
            ].map(item => (
              <div key={item.title} className="border-t-2 border-[#B01C24] pt-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Our Network</h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              The 25,000+ Ivy League executives on our C-suite bench have served as CEOs, CFOs, CTOs, COOs, CROs, CMOs, CHROs, and CISOs at companies ranging from pre-revenue startups to Fortune 500 corporations to sovereign wealth-backed entities. They have led IPOs, navigated Chapter 11, closed billions in capital raises, and built global commercial operations from zero.
            </p>
            <p>
              The broader 150,000+ consultant network includes specialists across deep technical domains: aerospace and defense, biotechnology, materials science, quantum computing, nuclear engineering, cybersecurity, supply chain optimization, and more. When your company faces a challenge that requires scientific or engineering expertise alongside executive leadership, The Crimson Bench can field both in a single coordinated engagement.
            </p>
            <p>
              Our ex-military operators bring operational rigor, logistics expertise, crisis management capability, and clearance backgrounds that translate directly to high-stakes corporate environments — from CMMC compliance to supply chain integrity to emergency operations.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-6">Legal &amp; Compliance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The Crimson Bench provides fractional consulting and advisory services only. We are not a licensed employment agency, staffing firm, law firm, financial advisor, or registered investment advisor. All engagements are governed by signed Consulting Services Agreements. &ldquo;Ivy League&rdquo; refers to the educational credentials of individual operators and is not an endorsement by any university.
          </p>
        </div>
      </div>

      <CTABlock heading="Work With The Crimson Bench" />
    </>
  )
}
