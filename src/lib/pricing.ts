export interface Product {
  id: string
  num: number
  name: string
  shortName: string
  price: number | string
  priceSuffix?: string
  type: 'one-time' | 'monthly' | 'annual' | 'fixed-scope' | 'affiliate' | 'custom'
  tagline: string
  description: string
  includes: string[]
  upsellTo?: string
  stripeMode: 'payment' | 'subscription' | 'custom'
  isNew?: boolean
  isBestValue?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'industry-audit-report',
    num: 1,
    name: 'Industry Audit Report',
    shortName: 'Audit Report',
    price: 500,
    type: 'one-time',
    tagline: 'Written analysis. No call required.',
    description:
      'Submit your P&L, org chart, or operational overview and receive a written industry audit from an Ivy League-educated executive within 48 hours. No call required. Ideal for budget-constrained companies that need expert analysis before committing to a deeper engagement.',
    includes: [
      'Written executive analysis (4–6 pages)',
      'Identification of top 3–5 operational or financial risks',
      'Benchmark comparison to industry peers',
      'Recommended next steps with priority ranking',
    ],
    upsellTo: 'executive-diagnostic',
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'executive-diagnostic',
    num: 2,
    name: 'Executive Diagnostic',
    shortName: 'Diagnostic',
    price: 1500,
    type: 'one-time',
    tagline: '2-hour intensive audit. 3-page triage roadmap.',
    description:
      'Our flagship entry product. Submit your financial statements, org chart, or operational overview. Your dedicated Ivy League-educated executive runs a 2-hour intensive audit and delivers a 3-page triage roadmap within 48 hours. Fee is credited toward any retainer engagement started within 30 days.',
    includes: [
      '2-hour live executive working session',
      '3-page prioritized triage roadmap',
      'Identification of top 5 critical gaps',
      'Recommended engagement tier and scope',
      'Fee credited toward any retainer started within 30 days',
    ],
    upsellTo: 'advisory-retainer',
    stripeMode: 'payment',
  },
  {
    id: 'diagnostic-bundle',
    num: 3,
    name: 'Diagnostic Bundle — 3×',
    shortName: 'Bundle',
    price: 3750,
    type: 'one-time',
    tagline: 'Three diagnostics at a bundle rate.',
    description:
      'Three Executive Diagnostics at a bundle rate — saving $750 versus individual pricing. Ideal for private equity firms or family offices evaluating multiple portfolio companies, or for companies that want to audit multiple functions (finance, operations, and technology) simultaneously.',
    includes: [
      '3× Executive Diagnostic sessions (2 hours each)',
      '3× 3-page triage roadmaps',
      'Can be applied across different C-suite roles',
      'Can be applied across multiple portfolio companies',
      '$750 savings versus 3× individual pricing',
    ],
    upsellTo: 'scale-up-fractional',
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'advisory-retainer',
    num: 4,
    name: 'Advisory Retainer',
    shortName: 'Advisory',
    price: 4000,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: 'Strategic sounding board. Two calls per month.',
    description:
      'Two 90-minute advisory calls per month with your dedicated Ivy League-educated executive, plus asynchronous email and Slack access for high-level decision support between sessions. The strategic sounding board for executives who need a credentialed thought partner without a deeper operational commitment.',
    includes: [
      '2× 90-minute advisory calls per month',
      'Async email and Slack access between sessions',
      'Written summary and action items after each session',
      '14-day no-cause cancellation',
      'Dedicated Ivy League-educated executive',
    ],
    upsellTo: 'scale-up-fractional',
    stripeMode: 'subscription',
  },
  {
    id: 'scale-up-fractional',
    num: 5,
    name: 'Scale-Up Fractional — 1 Day/Week',
    shortName: 'Scale-Up',
    price: 7500,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: 'Dedicated C-suite oversight. One day per week.',
    description:
      'The most popular fractional engagement tier. Your executive is in your operations one full day per week — owning KPI tracking, running team meetings, managing key vendor relationships, and driving weekly execution. The equivalent of a $180,000/year hire at a fraction of the cost.',
    includes: [
      '1 full day per week of dedicated executive time (in-person or remote)',
      'Weekly team meeting facilitation',
      'KPI tracking and dashboard ownership',
      'Async availability throughout the week',
      '14-day no-cause cancellation',
    ],
    upsellTo: 'growth-fractional',
    stripeMode: 'subscription',
    isBestValue: true,
  },
  {
    id: 'growth-fractional',
    num: 6,
    name: 'Growth Fractional — 2 Days/Week',
    shortName: 'Growth',
    price: 12500,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: 'Intensive oversight. Two days per week.',
    description:
      'Intensive fractional engagement for companies in active growth phases. Your executive is present two full days per week — covering board reporting, team management, cross-departmental execution, and active hiring oversight. Equivalent to $300,000/year full-time at 40% of the cost.',
    includes: [
      '2 full days per week of dedicated executive time',
      'Board and investor reporting ownership',
      'Active team management and hiring oversight',
      'Cross-departmental execution and accountability',
      'Async availability throughout the week',
      '14-day no-cause cancellation',
    ],
    upsellTo: 'embedded-executive',
    stripeMode: 'subscription',
    isNew: true,
  },
  {
    id: 'embedded-executive',
    num: 7,
    name: 'Embedded Executive — 3+ Days/Week',
    shortName: 'Embedded',
    price: 18500,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: 'Near-full-time. In the seat.',
    description:
      'Near-full-time executive presence. Your Crimson Bench executive operates as effectively your C-suite leader — owning hiring decisions, investor relations, full P&L accountability, and operational oversight. Equivalent value to a $400,000/year executive package at approximately 55% of the cost.',
    includes: [
      '3+ full days per week of dedicated executive time',
      'Full P&L and functional accountability',
      'Hiring decision authority (agreed scope)',
      'Direct investor and board-level representation',
      'All team meetings and operational reviews',
      '14-day no-cause cancellation',
    ],
    stripeMode: 'subscription',
    isNew: true,
  },
  {
    id: 'emergency-role-transition',
    num: 8,
    name: 'Emergency Role Transition Pack',
    shortName: 'Emergency Pack',
    price: 8500,
    type: 'fixed-scope',
    tagline: '30-day rapid deployment. Clear deliverable.',
    description:
      "Fixed-scope 30-day emergency engagement designed for urgent leadership gaps. A defined deliverable — stabilize a leadership void, close a board reporting cycle, navigate a critical hire window, or manage a regulatory deadline — with the Crimson Bench's 48-hour deployment SLA.",
    includes: [
      '30-day fixed engagement, deployed within 48 hours',
      'Defined deliverable agreed at engagement start',
      'Up to 3 days per week of executive time',
      'End-of-engagement transition document',
      'Option to convert to ongoing retainer at conclusion',
    ],
    upsellTo: 'scale-up-fractional',
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'board-advisory-seat',
    num: 9,
    name: 'Board Advisory Seat',
    shortName: 'Board Advisory',
    price: 2500,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: 'Independent director-level strategic counsel.',
    description:
      'An Ivy League-educated Crimson Bench executive joins your board or advisory board as an independent director or strategic advisor. Quarterly board meetings plus availability for ad hoc strategic counsel between sessions. Adds institutional credibility to your governance structure.',
    includes: [
      'Quarterly board meeting attendance',
      'Ad hoc strategic counsel between board meetings',
      'Written perspectives on major strategic decisions',
      'Introductions to relevant network contacts on request',
      'Annual board calendar and governance calendar review',
    ],
    stripeMode: 'subscription',
    isNew: true,
  },
  {
    id: 'succession-planning-assessment',
    num: 10,
    name: 'Executive Succession Planning Assessment',
    shortName: 'Succession Assessment',
    price: 2500,
    type: 'one-time',
    tagline: 'Leadership bench strength, mapped and ranked.',
    description:
      "A formal written assessment of your current leadership team's succession readiness. Identifies internal candidates for each C-suite role, gaps in bench strength, development plans for high-potential leaders, and external search criteria for roles with no internal successor. Delivered in 5–7 business days.",
    includes: [
      'Assessment of internal succession readiness for each C-suite role',
      'Scoring rubric for internal candidates',
      'Gap analysis and development plan recommendations',
      'External search criteria for roles with no viable internal successor',
      'Written report (8–12 pages) plus executive briefing call',
    ],
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'leadership-team-audit',
    num: 11,
    name: 'Leadership Team Audit',
    shortName: 'Team Audit',
    price: 1200,
    type: 'one-time',
    tagline: '2-hour session. Team structure, comp, and gaps.',
    description:
      "A focused 2-hour session auditing your leadership team's structure, compensation benchmarks, and performance gaps. Distinct from the Executive Diagnostic (which audits the business) — this audits the team running it. Produces a written report with specific team design and compensation recommendations.",
    includes: [
      '2-hour leadership team audit session',
      'Compensation benchmark analysis vs. market data',
      'Org design assessment and gap identification',
      'Individual performance gap observations',
      'Written recommendations report',
    ],
    upsellTo: 'advisory-retainer',
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'investor-readiness-package',
    num: 12,
    name: 'Investor Readiness Package',
    shortName: 'Investor Readiness',
    price: 5000,
    type: 'one-time',
    tagline: 'CFO-led. Series A/B fundraise preparation.',
    description:
      'A structured package for companies preparing for a Series A or B fundraise. Led by a Crimson Bench CFO with capital markets experience, this engagement prepares your financials, data room, and investor narrative to withstand institutional due diligence. Average engagement window is 3–4 weeks.',
    includes: [
      'Financial model review and institutional-quality cleanup',
      'Data room structure and documentation checklist',
      'Investor Q&A preparation and mock diligence session',
      'Key metrics dashboard aligned to Series A/B investor expectations',
      'Cap table review and pre-money valuation analysis',
    ],
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'permanent-executive-search',
    num: 13,
    name: 'Permanent Executive Search',
    shortName: 'Perm Search',
    price: '25% of first-year comp',
    type: 'custom',
    tagline: 'Full-time C-suite sourced from our bench and network.',
    description:
      "When a permanent C-suite hire is the right answer, The Crimson Bench sources and vets candidates from our extended network of Ivy League-educated operators. We charge 25% of first-year compensation — payable upon successful hire — with a 90-day replacement guarantee if the hire doesn't work out.",
    includes: [
      'Role specification and market positioning',
      'Candidate sourcing from Crimson Bench extended network',
      'Resume screening and first-round interviews',
      'Structured reference checks',
      '90-day replacement guarantee',
    ],
    stripeMode: 'custom',
    isNew: true,
  },
  {
    id: 'strategic-planning-sprint',
    num: 14,
    name: 'Strategic Planning Sprint',
    shortName: 'Strategy Sprint',
    price: 4500,
    type: 'fixed-scope',
    tagline: '2-week facilitated planning. 12-month roadmap output.',
    description:
      'A structured 2-week facilitated strategic planning engagement. Your Crimson Bench executive leads your leadership team through a disciplined process — market analysis, competitive positioning, resource prioritization — and produces a 12-month strategic plan with quarterly milestones and financial targets.',
    includes: [
      '2-week facilitated engagement (2–3 working sessions)',
      'Market and competitive landscape analysis',
      'Resource allocation and prioritization framework',
      '12-month strategic plan document',
      'Quarterly milestone and OKR structure',
      'Financial target modeling',
    ],
    upsellTo: 'advisory-retainer',
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'crisis-intervention-retainer',
    num: 15,
    name: 'Crisis Intervention Retainer',
    shortName: 'Crisis Retainer',
    price: 15000,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: '24-hour response SLA. Distress-grade support.',
    description:
      'Priority access retainer for companies in acute distress — cash flow crises, sudden leadership departures, regulatory emergencies, or activist investor situations. Includes a 24-hour executive response SLA and up to 4 days per week of dedicated executive time. Structured for the worst 90 days your company will ever face.',
    includes: [
      'Up to 4 days per week of dedicated executive time',
      '24-hour response SLA for critical escalations',
      'Board and investor crisis communication support',
      'Cash preservation and emergency capital planning',
      'Leadership stabilization and team communication',
      '14-day no-cause cancellation',
    ],
    stripeMode: 'subscription',
    isNew: true,
  },
  {
    id: 'bench-membership',
    num: 16,
    name: 'The Bench Membership',
    shortName: 'Membership',
    price: 1000,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: 'Self-serve access to the full bench directory.',
    description:
      'Monthly membership providing self-serve access to the full Crimson Bench executive directory. Book 1-hour consultation sessions with any executive on the bench at $500/session (credited against membership). Ideal for companies that need occasional expert access without committing to a full retainer.',
    includes: [
      'Full access to the Crimson Bench executive directory',
      '1 complimentary 1-hour consultation per month',
      'Additional sessions at $500 each (member pricing)',
      'Priority access to new bench additions',
      'Monthly Executive Intelligence newsletter',
    ],
    upsellTo: 'advisory-retainer',
    stripeMode: 'subscription',
    isNew: true,
  },
  {
    id: 'nonprofit-fractional',
    num: 17,
    name: 'Nonprofit Fractional Tier',
    shortName: 'Nonprofit',
    price: 3500,
    priceSuffix: '/month',
    type: 'monthly',
    tagline: 'Institutional leadership at a mission-aligned rate.',
    description:
      'A dedicated fractional engagement tier for 501(c)(3) nonprofit organizations. Provides the same Ivy League-educated executive talent and 48-hour deployment SLA at a mission-aligned rate — because great governance and strategic leadership should not be reserved only for for-profit organizations.',
    includes: [
      '1 day per week of dedicated executive time',
      'Board and donor reporting support',
      'Grant-aligned financial and operational reporting',
      'Org design for nonprofit-specific structures',
      '14-day no-cause cancellation',
      'Verification of 501(c)(3) status required',
    ],
    stripeMode: 'subscription',
    isNew: true,
  },
  {
    id: 'ma-due-diligence-assessment',
    num: 18,
    name: 'M&A Due Diligence Executive Assessment',
    shortName: 'M&A Assessment',
    price: 2000,
    type: 'one-time',
    tagline: '3rd-party C-suite capability assessment for acquirers.',
    description:
      "A third-party executive capability assessment for private equity investors, strategic acquirers, or lenders who need an independent view of a target company's leadership team. Crimson Bench evaluates the C-suite's capability, completeness, and succession risk — and delivers a written assessment within 5 business days.",
    includes: [
      'Executive interviews with key C-suite members',
      'Capability assessment against industry benchmarks',
      'Leadership risk and succession gap analysis',
      'Written assessment report (6–10 pages)',
      'Recommended actions for post-close talent integration',
    ],
    stripeMode: 'payment',
    isNew: true,
  },
  {
    id: 'corporate-leadership-workshop',
    num: 19,
    name: 'Corporate Leadership Workshop',
    shortName: 'Workshop',
    price: '3,000–8,000',
    type: 'fixed-scope',
    tagline: 'Half-day C-suite development session.',
    description:
      'A facilitated half-day leadership development workshop delivered by a Crimson Bench executive. Topics include: capital allocation decision-making, strategic planning frameworks, board communication best practices, or crisis leadership. Designed for corporate leadership teams, PE portfolio company management teams, or executive onboarding programs.',
    includes: [
      '3.5-hour facilitated workshop session (in-person or virtual)',
      'Custom curriculum built for your team and context',
      'Pre-workshop participant survey and preparation guide',
      'Post-workshop action plan and resource package',
      'Follow-up 30-minute debrief call included',
    ],
    stripeMode: 'custom',
    isNew: true,
  },
  {
    id: 'annual-prepay',
    num: 20,
    name: 'Annual Prepay — 2 Months Free',
    shortName: 'Annual',
    price: 'Tier × 10',
    type: 'annual',
    tagline: '12 months of access for the price of 10.',
    description:
      'Prepay any monthly retainer tier for 12 months and receive 2 months free — an effective 17% discount. Locking in an annual engagement also guarantees priority access to your dedicated executive and eliminates billing variability. Available for Advisory Retainer through Embedded Executive tiers.',
    includes: [
      '12 months of access for 10 months of billing',
      '17% effective discount on any monthly tier',
      'Priority scheduling and executive access',
      'Annual strategic review session (bonus session)',
      'Locked-in rate protection for 12 months',
    ],
    stripeMode: 'subscription',
    isNew: true,
  },
  {
    id: 'pe-corporate-package',
    num: 21,
    name: 'PE / Family Office Corporate Package',
    shortName: 'Corporate',
    price: '30,000+',
    priceSuffix: '/month',
    type: 'custom',
    tagline: 'Multi-executive deployment across portfolio companies.',
    description:
      'A custom multi-executive engagement for private equity firms, family offices, and holding companies that need C-suite leadership deployed across multiple portfolio companies simultaneously. Includes a dedicated partner contact, priority deployment access, and consolidated billing with volume pricing.',
    includes: [
      'Multi-executive deployment across portfolio companies',
      'Dedicated Crimson Bench partner contact',
      'Priority 48-hour deployment across all portfolio engagements',
      'Consolidated billing and reporting',
      'Quarterly portfolio-level executive review',
      'Custom volume pricing',
    ],
    stripeMode: 'custom',
    isNew: true,
  },
  {
    id: 'referral-partner-program',
    num: 22,
    name: 'Referral Partner Program',
    shortName: 'Referral',
    price: '10% rev share',
    type: 'affiliate',
    tagline: '12-month revenue share on referred engagements.',
    description:
      'Earn 10% revenue share for the first 12 months of any client engagement you refer to The Crimson Bench. Designed for M&A advisors, investment bankers, accountants, attorneys, and other professional services firms whose clients regularly face C-suite leadership gaps. Paid monthly, tracked transparently.',
    includes: [
      '10% revenue share for first 12 months per referred client',
      'Monthly payments via ACH or wire',
      'Dedicated partner dashboard and referral tracking',
      'Crimson Bench co-marketing materials for partner use',
      'Priority introductions to our executive bench for partner events',
    ],
    stripeMode: 'custom',
    isNew: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getMonthlyProducts(): Product[] {
  return PRODUCTS.filter(p => p.type === 'monthly')
}

export function getOneTimeProducts(): Product[] {
  return PRODUCTS.filter(p => p.type === 'one-time' || p.type === 'fixed-scope')
}

export function formatPrice(product: Product): string {
  if (typeof product.price === 'number') {
    return `$${product.price.toLocaleString()}${product.priceSuffix ?? ''}`
  }
  return `$${product.price}${product.priceSuffix ?? ''}`
}
