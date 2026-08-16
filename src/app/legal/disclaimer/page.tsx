import type { Metadata } from 'next'
import Disclaimer from '@/components/Disclaimer'

export const metadata: Metadata = {
  title: 'Legal Disclaimer | The Crimson Bench',
  description: 'Legal disclaimer for The Crimson Bench — consulting services, no staffing or legal advice, engagement terms.',
  alternates: { canonical: '/legal/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Legal Disclaimer</h1>
      <Disclaimer />
      <div className="mt-12 space-y-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        <p>Last updated: January 2026</p>
        <p>
          The Crimson Bench LLC provides fractional consulting and advisory services only. We are not a licensed employment agency, staffing firm, placement agency, law firm, financial advisor, registered investment advisor, broker-dealer, or insurance provider.
        </p>
        <p>
          Nothing on this website, in our marketing materials, in our deliverables, or in any communication from The Crimson Bench or its executives constitutes legal, financial, accounting, tax, regulatory, medical, or professional advice of any kind. All information is provided for general informational purposes only.
        </p>
        <p>
          Engagement outcomes depend on client circumstances, organizational readiness, market conditions, and factors entirely outside our control. Past mandates and outcomes referenced on this website are provided for illustrative purposes only and do not guarantee future results. The Crimson Bench makes no representations about the results any specific client will achieve.
        </p>
        <p>
          &ldquo;Ivy League&rdquo; refers to the educational credentials of individual executive consultants and is descriptive of individual backgrounds — it is not an endorsement by, affiliation with, or approval from any Ivy League university or the Ivy League athletic association.
        </p>
        <p>
          All engagements are subject to signed Consulting Services Agreements (CSAs). The terms of the CSA govern the relationship between The Crimson Bench and the client. In the event of any conflict between this website and a signed CSA, the CSA controls.
        </p>
        <p>
          The Crimson Bench is not responsible for any decisions made by clients or third parties based on advisory deliverables, written recommendations, or oral guidance provided by The Crimson Bench or its consultants.
        </p>
      </div>
    </div>
  )
}
