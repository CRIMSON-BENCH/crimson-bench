import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | The Crimson Bench',
  description: 'Privacy policy for The Crimson Bench — how we collect, use, and protect your information.',
  alternates: { canonical: '/legal/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p className="text-xs font-mono tracking-wide uppercase text-slate-400">Last Updated: January 2026</p>

        <p>
          The Crimson Bench LLC (&ldquo;The Crimson Bench,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This Privacy Policy describes how we collect, use, disclose, and protect information about you when you visit our website (crimsonbench.com) or engage with our services.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">Information We Collect</h2>
        <p>We collect information you provide directly to us, including:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Contact information (name, email, company, title) submitted via inquiry forms</li>
          <li>Engagement details and mandate descriptions you share with us</li>
          <li>Payment information processed through our payment processor (Stripe)</li>
          <li>Communications with our team</li>
        </ul>
        <p>We also collect information automatically, including IP address, browser type, pages visited, and referring URLs through standard server logs and analytics tools.</p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>To respond to your inquiries and process engagement requests</li>
          <li>To match you with appropriate executives from our network</li>
          <li>To process payments and manage your account</li>
          <li>To send relevant communications about your engagement</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">Information Sharing</h2>
        <p>
          We do not sell, rent, or trade your personal information to third parties. We may share information with service providers who assist in operating our business (payment processing, email delivery, analytics) under confidentiality obligations. We will disclose information if required by law, court order, or regulatory authority.
        </p>
        <p>
          Executive candidates in our network have signed confidentiality agreements. Client identities are protected under NDA and are not disclosed to third parties without explicit consent.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">Data Retention</h2>
        <p>
          We retain engagement inquiry data for 24 months. Signed CSAs and billing records are retained for 7 years as required by law. You may request deletion of your personal information at any time by emailing privacy@crimsonbench.com.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">Security</h2>
        <p>
          We implement industry-standard security measures to protect your information. Payment information is processed by Stripe and is never stored on our servers. No data transmission over the Internet is 100% secure; we cannot guarantee absolute security.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact privacy@crimsonbench.com.
        </p>

        <h2 className="font-serif text-xl font-normal text-slate-900 dark:text-white mt-8 mb-2">Contact</h2>
        <p>
          For privacy inquiries: privacy@crimsonbench.com<br />
          The Crimson Bench LLC, New York, New York
        </p>
      </div>
    </div>
  )
}
