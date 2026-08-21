import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | The Crimson Bench',
  description: 'Refund and return policy for The Crimson Bench digital products, simulators, and Toolkit Pro subscriptions.',
  alternates: { canonical: '/legal/refund' },
}

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Refund Policy</h1>
      <div className="space-y-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>Last updated: August 2026</p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Digital products &amp; downloads</h2>
        <p>
          Our digital products — Excel toolkits, models, templates, and one-time simulator purchases — are delivered electronically and are usable immediately. Because of the instant, non-returnable nature of digital goods, <strong>all sales are generally final</strong>.
        </p>
        <p>
          That said, we stand behind our work. If a file is defective, corrupted, materially not as described, or you were charged in error, contact us within <strong>14 days</strong> of purchase at{' '}
          <a href="mailto:support@crimsonbench.com" className="text-[#B01C24] underline">support@crimsonbench.com</a> and we will repair the file or issue a full refund at our discretion.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Toolkit Pro subscriptions</h2>
        <p>
          Toolkit Pro is billed in advance on a monthly or annual basis. You may cancel at any time; cancellation stops future renewals and your access continues through the end of the current billing period. We do not provide prorated refunds for the unused portion of a billing period, except where required by law. See our{' '}
          <a href="/legal/subscription-terms" className="text-[#B01C24] underline">Subscription &amp; Auto-Renewal Terms</a>.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Bespoke &amp; enterprise engagements</h2>
        <p>
          Custom-built models and enterprise engagements are governed by the specific statement of work or agreement signed for that engagement, which sets out any milestones, deposits, and refund terms. Where such an agreement exists, it controls over this policy.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">How to request a refund</h2>
        <p>
          Email <a href="mailto:support@crimsonbench.com" className="text-[#B01C24] underline">support@crimsonbench.com</a> with your order number and the reason for the request. Approved refunds are returned to the original payment method and typically post within 5–10 business days, depending on your bank or card issuer.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 pt-4">
          This policy does not limit any non-waivable statutory rights you may have under applicable consumer-protection law.
        </p>
      </div>
    </div>
  )
}
