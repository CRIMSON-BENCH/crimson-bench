import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | The Crimson Bench',
  description: 'How The Crimson Bench uses cookies and local storage across its website, tools, and simulators.',
  alternates: { canonical: '/legal/cookies' },
}

export default function CookiePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Cookie Policy</h1>
      <div className="space-y-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>Last updated: August 2026</p>
        <p>
          This Cookie Policy explains how The Crimson Bench uses cookies and similar technologies (such as browser local storage) when you visit our website and use our tools.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">What we use</h2>
        <ul className="space-y-2 list-none">
          <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span><strong>Strictly necessary</strong> — to keep you signed in, remember your Toolkit Pro entitlement, and secure the site. These are required for the site to function.</span></li>
          <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span><strong>Preferences &amp; local storage</strong> — to remember settings such as light/dark theme and inputs you enter into our tools, which are stored on your device.</span></li>
          <li className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span><strong>Analytics</strong> — if enabled, privacy-respecting, aggregated analytics that help us understand which pages and tools are useful. These do not identify you personally.</span></li>
        </ul>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Tool inputs stay on your device</h2>
        <p>
          The numbers you type into our calculators and simulators are processed in your browser. We do not transmit or store your model inputs on our servers unless you explicitly use a feature (such as saving a scenario or requesting AI analysis) that requires it.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Managing cookies</h2>
        <p>
          You can control or delete cookies through your browser settings. Blocking strictly-necessary cookies may prevent parts of the site (such as staying signed in) from working. Where required by law, we will ask for your consent to non-essential cookies before setting them.
        </p>
        <p>
          For more on how we handle personal data, see our{' '}
          <a href="/legal/privacy" className="text-[#B01C24] underline">Privacy Policy</a>. Questions:{' '}
          <a href="mailto:support@crimsonbench.com" className="text-[#B01C24] underline">support@crimsonbench.com</a>.
        </p>
      </div>
    </div>
  )
}
