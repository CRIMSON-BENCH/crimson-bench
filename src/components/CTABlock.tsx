interface CTABlockProps {
  heading?: string
  subheading?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  variant?: 'default' | 'dark'
}

export default function CTABlock({
  heading = 'Deploy an Executive in 48 Hours',
  subheading = 'Verified corporate accounts only. Ivy League-educated. Flat-rate pricing. 14-day no-cause cancellation.',
  primaryLabel = 'Deploy Now →',
  primaryHref = '/contact',
  secondaryLabel = 'Start with a $1,500 Diagnostic',
  secondaryHref = '/services/executive-diagnostic',
  variant = 'default',
}: CTABlockProps) {
  const dark = variant === 'dark'
  return (
    <section className={`py-20 px-6 ${dark ? 'bg-slate-950' : 'bg-[#B01C24]'}`}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-4">
          The Crimson Bench · Est. 2002 · Founded in New York City
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 tracking-tight">
          {heading}
        </h2>
        <p className="text-white/70 text-base mb-10 max-w-xl mx-auto">
          {subheading}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={primaryHref}
            className="bg-white text-[#B01C24] font-mono text-xs tracking-widest uppercase px-8 py-4 hover:bg-slate-100 transition-colors font-bold"
          >
            {primaryLabel}
          </a>
          <a
            href={secondaryHref}
            className="border border-white/40 text-white font-mono text-xs tracking-widest uppercase px-8 py-4 hover:border-white/80 transition-colors"
          >
            {secondaryLabel}
          </a>
        </div>
        <p className="text-white/40 text-xs font-mono mt-8 tracking-wide uppercase">
          25,000+ Ivy League Executives · 150,000+ Global Consultants · 48-Hour Deployment
        </p>
      </div>
    </section>
  )
}
