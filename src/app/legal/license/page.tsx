import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product License Terms | The Crimson Bench',
  description: 'License terms for The Crimson Bench digital products, Excel models, templates, and simulators — permitted use, restrictions, and ownership.',
  alternates: { canonical: '/legal/license' },
}

export default function LicensePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Product License Terms</h1>
      <div className="space-y-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>Last updated: August 2026</p>
        <p>
          These License Terms govern your use of digital products purchased or accessed from The Crimson Bench, including Excel toolkits, financial models, templates, spreadsheets, simulators, and any related files (the &ldquo;Products&rdquo;).
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">License granted</h2>
        <p>
          Subject to your compliance with these terms, The Crimson Bench grants you a <strong>non-exclusive, non-transferable, perpetual license</strong> to use the Products for your own business or that of your employer/client (&ldquo;single-business use&rdquo;). You may edit, rebrand for internal use, and adapt the Products to your needs.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">You may not</h2>
        <ul className="space-y-2 list-none">
          {[
            'Resell, sublicense, redistribute, or give away the Products or any derivative of them, whether modified or not.',
            'Publish the Products to a public repository, template marketplace, or file-sharing service.',
            'Use the Products to build a competing library of templates or models for distribution.',
            'Represent the Products, or outputs generated from them, as certified financial, investment, tax, or legal advice.',
            'Remove Crimson Bench attribution or license notices from files except where you are rebranding for permitted internal use.',
          ].map(x => (
            <li key={x} className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>{x}</span></li>
          ))}
        </ul>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Teams &amp; agencies</h2>
        <p>
          Single-business use covers your organization&apos;s internal use. If you are an agency, consultancy, or advisor who wishes to use the Products across multiple client engagements, or to deliver adapted versions to clients, contact us at{' '}
          <a href="mailto:support@crimsonbench.com" className="text-[#B01C24] underline">support@crimsonbench.com</a> for a multi-client or reseller license.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Ownership</h2>
        <p>
          The Crimson Bench retains all intellectual-property rights in the Products. This is a license, not a sale of the underlying work. Your rights are limited to those expressly granted here.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">No warranty; educational use</h2>
        <p>
          The Products are provided &ldquo;as is,&rdquo; for educational and decision-support purposes, and are <strong>not financial, investment, tax, or legal advice</strong>. Outputs depend entirely on the assumptions you enter. See our{' '}
          <a href="/legal/disclaimer" className="text-[#B01C24] underline">Legal Disclaimer</a>.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Termination</h2>
        <p>
          This license terminates automatically if you breach these terms. On termination you must stop using and delete distributed copies of the Products. Files you already downloaded for legitimate single-business use may be retained subject to these terms.
        </p>
      </div>
    </div>
  )
}
