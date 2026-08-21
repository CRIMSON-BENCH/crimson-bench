import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | The Crimson Bench',
  description: 'Acceptable use policy for The Crimson Bench website, tools, simulators, and services.',
  alternates: { canonical: '/legal/acceptable-use' },
}

export default function AcceptableUsePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Acceptable Use Policy</h1>
      <div className="space-y-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>Last updated: August 2026</p>
        <p>
          This Acceptable Use Policy applies to everyone who accesses The Crimson Bench website, tools, simulators, downloads, and services. By using them, you agree not to misuse them.
        </p>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">You agree not to</h2>
        <ul className="space-y-2 list-none">
          {[
            'Access, scrape, or harvest the site or its content by automated means beyond ordinary search-engine indexing, or in a way that places unreasonable load on our infrastructure.',
            'Attempt to gain unauthorized access to any account, system, or data, or to bypass access controls, paywalls, or entitlement checks.',
            'Reverse engineer, resell, or redistribute our tools, models, or downloads except as permitted by the applicable license.',
            'Use the site or services for any unlawful, fraudulent, deceptive, or harmful purpose.',
            'Upload or transmit malware, or interfere with the operation or security of the site.',
            'Infringe the intellectual-property or privacy rights of The Crimson Bench or any third party.',
            'Misrepresent outputs from our tools as certified professional advice, or use them to mislead others.',
          ].map(x => (
            <li key={x} className="flex gap-3"><span className="text-[#B01C24] flex-shrink-0">•</span><span>{x}</span></li>
          ))}
        </ul>

        <h2 className="font-serif text-xl text-slate-900 dark:text-white pt-4">Enforcement</h2>
        <p>
          We may suspend or terminate access for any violation of this policy, and may report unlawful activity to the appropriate authorities. We reserve the right to investigate and take appropriate legal action.
        </p>
        <p>
          Questions or reports of abuse: <a href="mailto:support@crimsonbench.com" className="text-[#B01C24] underline">support@crimsonbench.com</a>.
        </p>
      </div>
    </div>
  )
}
