import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.crimsonbench.com'),
  title: {
    default: 'The Crimson Bench — Ivy League Executive Deployment',
    template: '%s | The Crimson Bench',
  },
  description:
    'Founded in New York City. 25,000+ Ivy League executives. 150,000+ global consultants — scientists, engineers, and ex-military. C-suite deployed within 48 hours.',
  openGraph: {
    siteName: 'The Crimson Bench',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const DISCLAIMER =
  'The Crimson Bench provides fractional consulting and advisory services only. We are not a licensed employment agency, staffing firm, law firm, financial advisor, or registered investment advisor. Nothing on this website constitutes legal, financial, accounting, or professional advice of any kind. Past mandates are provided for illustrative purposes only and do not guarantee future results. "Ivy League" refers to the educational background of individual operators. All engagements are subject to signed Consulting Services Agreements.'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-serif text-lg tracking-tight text-slate-900 dark:text-white">
              The Crimson Bench
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/bench" className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">The Bench</a>
              <a href="/pricing" className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Pricing</a>
              <a href="/tools" className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Tools</a>
              <a href="/pro-tools" className="font-mono text-xs tracking-wider uppercase text-[#B0801A] dark:text-[#F0B34A] hover:text-[#B01C24] transition-colors">Pro</a>
              <a href="/digital-products" className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Store</a>
              <a href="/enterprise" className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Enterprise</a>
              <a href="/blog" className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Insights</a>
              <a href="/glossary" className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Glossary</a>
              <a href="/contact" className="btn-crimson py-2">Deploy Now</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-24">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">The Bench</p>
                <ul className="space-y-2">
                  {['CEO','CFO','CTO','COO','CRO','CMO','CHRO','CISO'].map(r => (
                    <li key={r}><a href={`/bench/${r.toLowerCase()}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">Fractional {r}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Services</p>
                <ul className="space-y-2">
                  {[
                    ['Executive Diagnostic','services/executive-diagnostic'],
                    ['Advisory Retainer','services/advisory-retainer'],
                    ['Scale-Up Fractional','services/scale-up-fractional'],
                    ['Embedded Executive','services/embedded-executive'],
                    ['Board Advisory Seat','services/board-advisory'],
                    ['Crisis Retainer','services/crisis-retainer'],
                  ].map(([label,href]) => (
                    <li key={href}><a href={`/${href}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Resources</p>
                <ul className="space-y-2">
                  {[
                    ['Blog','blog'],
                    ['Glossary','glossary'],
                    ['Templates','templates'],
                    ['Compare','compare'],
                    ['Sitemap','sitemap.xml'],
                  ].map(([label,href]) => (
                    <li key={href}><a href={`/${href}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-4">Legal</p>
                <ul className="space-y-2">
                  {[
                    ['Terms of Service','legal/terms'],
                    ['Privacy Policy','legal/privacy'],
                    ['Refund Policy','legal/refund'],
                    ['Subscription Terms','legal/subscription-terms'],
                    ['Product License','legal/license'],
                    ['Acceptable Use','legal/acceptable-use'],
                    ['Cookie Policy','legal/cookies'],
                    ['Disclaimer','legal/disclaimer'],
                  ].map(([label,href]) => (
                    <li key={href}><a href={`/${href}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="disclaimer">
              <p className="mb-2 font-mono text-xs tracking-widest uppercase text-slate-500">Legal Disclaimer</p>
              <p>{DISCLAIMER}</p>
              <p className="mt-4">© {new Date().getFullYear()} The Crimson Bench. All rights reserved. Est. 2002 · Founded in New York City · 150,000+ Global Consultants.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
