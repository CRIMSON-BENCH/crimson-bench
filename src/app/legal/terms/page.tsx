import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | The Crimson Bench',
  description: 'Terms of service for The Crimson Bench — consulting engagement terms, acceptable use, and governing law.',
  alternates: { canonical: '/legal/terms' },
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Terms of Service</h1>
      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p className="text-xs font-mono tracking-wide uppercase text-slate-400">Last Updated: January 2026</p>

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the website located at crimsonbench.com (the &ldquo;Site&rdquo;) operated by The Crimson Bench LLC (&ldquo;The Crimson Bench,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the Site, you agree to be bound by these Terms.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">1. Services</h2>
        <p>
          The Crimson Bench provides fractional consulting and advisory services through signed Consulting Services Agreements (CSAs). Engagement terms, pricing, deliverables, and cancellation terms are governed exclusively by the applicable CSA — not by these Terms of Service or any other content on this Site.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">2. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Use the Site for any unlawful purpose or in violation of these Terms</li>
          <li>Scrape, crawl, or extract data from the Site without written permission</li>
          <li>Submit false, misleading, or fraudulent inquiry information</li>
          <li>Attempt to gain unauthorized access to any portion of the Site or its infrastructure</li>
          <li>Use the Site to solicit our executive network for purposes other than engaging The Crimson Bench</li>
        </ul>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">3. Intellectual Property</h2>
        <p>
          All content on this Site — including text, design, logos, methodology frameworks, and executive profiles — is the intellectual property of The Crimson Bench LLC or its content providers and is protected by applicable copyright, trademark, and other laws. You may not reproduce, distribute, or create derivative works without express written permission.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">4. Disclaimer of Warranties</h2>
        <p>
          THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. THE CRIMSON BENCH DISCLAIMS ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">5. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE CRIMSON BENCH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE OR RELIANCE ON ANY CONTENT HEREIN. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS SHALL NOT EXCEED $100.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">6. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of New York, without regard to its conflict of law provisions. Any dispute arising under these Terms shall be resolved in the courts of New York County, New York.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Continued use of the Site following notice of changes constitutes acceptance of the revised Terms.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">8. Contact</h2>
        <p>
          legal@crimsonbench.com<br />
          The Crimson Bench LLC, New York, New York
        </p>
      </div>
    </div>
  )
}
