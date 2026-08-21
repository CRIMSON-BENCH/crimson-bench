import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscription & Auto-Renewal Terms | The Crimson Bench',
  description: 'Billing, automatic renewal, and cancellation terms for Toolkit Pro subscriptions from The Crimson Bench.',
  alternates: { canonical: '/legal/subscription-terms' },
}

export default function SubscriptionTermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Subscription &amp; Auto-Renewal Terms</h1>
      <div className="space-y-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>Last updated: August 2026</p>

        <div className="border border-[#B01C24]/30 bg-[#B01C24]/5 dark:bg-[#B01C24]/10 p-5">
          <p className="text-slate-800 dark:text-slate-200">
            <strong>Plain-language summary:</strong> Toolkit Pro is a recurring subscription. Unless you cancel, it renews automatically and your payment method is charged each period — <strong>$180/month</strong> for monthly plans, or <strong>$1,728/year</strong> for annual plans. You can cancel anytime, effective at the end of the current period.
          </p>
        </div>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">What you are enrolling in</h2>
        <p>
          When you subscribe to Toolkit Pro, you authorize The Crimson Bench (and its payment processor) to charge your payment method the applicable fee on a recurring basis until you cancel: monthly plans renew every month, and annual plans renew every 12 months.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Automatic renewal</h2>
        <p>
          Your subscription <strong>renews automatically</strong> at the end of each billing period at the then-current price for your plan, using the payment method on file, <strong>unless you cancel before the renewal date</strong>. We will send a reminder in advance of an annual renewal where required by law.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">How to cancel</h2>
        <p>
          You can cancel at any time from your account settings, or by emailing{' '}
          <a href="mailto:support@crimsonbench.com" className="text-[#B01C24] underline">support@crimsonbench.com</a>. Cancellation takes effect at the end of your current billing period; you keep access until then. Cancelling stops all future charges. You may keep any files you have already downloaded, subject to our{' '}
          <a href="/legal/license" className="text-[#B01C24] underline">License Terms</a>.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Refunds</h2>
        <p>
          Subscription fees are charged in advance and are non-refundable for the current period except where required by law. See our{' '}
          <a href="/legal/refund" className="text-[#B01C24] underline">Refund Policy</a>.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Price changes</h2>
        <p>
          We may change subscription pricing. If we do, we will give you advance notice, and any change will apply only to billing periods that begin after the notice period. Your continued use after a price change constitutes acceptance; if you do not agree, you may cancel before the change takes effect.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Failed payments</h2>
        <p>
          If a charge fails, we may retry the payment method and may suspend access until payment succeeds. We are not obligated to provide access during any period for which payment has not been received.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 pt-4">
          These terms supplement our <a href="/legal/terms" className="text-[#B01C24] underline">Terms of Service</a>. Nothing here limits non-waivable rights under applicable auto-renewal and consumer-protection laws (including, where applicable, California&apos;s Automatic Renewal Law).
        </p>
      </div>
    </div>
  )
}
