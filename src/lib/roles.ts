export type RoleKey = 'ceo' | 'cfo' | 'cto' | 'coo' | 'cro' | 'cmo' | 'chro' | 'ciso'

export interface Role {
  key: RoleKey
  title: string
  fullTitle: string
  tagline: string
  description: string
  responsibilities: string[]
  whenToHire: string[]
  outcomes: string[]
  faqs: { q: string; a: string }[]
  searchTerms: string[]
}

export const ROLES: Role[] = [
  {
    key: 'ceo',
    title: 'CEO',
    fullTitle: 'Chief Executive Officer',
    tagline: 'Turnarounds, Fundraising Strategy & Strategic Vision',
    description:
      'A fractional CEO from The Crimson Bench provides board-level strategic leadership without the full-time compensation burden. Our Ivy League-educated fractional CEOs have guided companies through Series A fundraises, distressed turnarounds, carve-outs, and succession transitions across two decades of engagements.',
    responsibilities: [
      'Board reporting and investor relations',
      'Capital structure and fundraising strategy',
      'Executive team hiring and performance management',
      'Strategic plan development and OKR cadence',
      'M&A target identification and integration oversight',
      'Turnaround triage and cash preservation',
    ],
    whenToHire: [
      'Your founding CEO has departed and you need a bridge leader',
      'You are preparing for a Series A or B fundraise',
      'The business is in distress and needs rapid operational triage',
      'The board wants a neutral strategic leader for a transition period',
      'You need credentialed leadership to satisfy investor requirements',
    ],
    outcomes: [
      'Fundraising targets hit within 12-month engagement windows',
      'EBITDA improvements averaging 18–34% in turnaround mandates',
      'Clean CEO succession plans with internal promotions supported',
      'Board confidence restored in governance and reporting quality',
    ],
    faqs: [
      {
        q: 'What does a fractional CEO actually do?',
        a: 'A fractional CEO performs all the same functions as a full-time chief executive — setting strategy, managing the leadership team, representing the company to investors and the board, and owning execution accountability — but on a defined schedule (typically 1–3 days per week) and for a flat monthly fee rather than a full-time salary and equity package.',
      },
      {
        q: 'How is a fractional CEO different from a business consultant?',
        a: 'A fractional CEO is in the seat. They own decisions and are accountable to the board. A consultant delivers a report and leaves. Our fractional CEOs run your weekly leadership team meetings, manage your direct reports, and show up in your investor calls. The accountability is executive, not advisory.',
      },
      {
        q: 'How quickly can a fractional CEO start?',
        a: 'The Crimson Bench deploys within 48 hours of engagement authorization. Our bench is pre-vetted — there is no sourcing period. Most clients have their fractional CEO in their first leadership meeting within the first week.',
      },
      {
        q: 'Can a fractional CEO help us raise a Series A?',
        a: 'Yes. Many of our CEO mandates are specifically structured around fundraising: cleaning up the financial model, sharpening the pitch narrative, preparing the data room, and fronting investor conversations with the credibility a Goldman Sachs- or McKinsey-pedigreed executive carries.',
      },
    ],
    searchTerms: ['fractional ceo', 'interim ceo', 'part-time ceo', 'outsourced ceo', 'temporary ceo'],
  },
  {
    key: 'cfo',
    title: 'CFO',
    fullTitle: 'Chief Financial Officer',
    tagline: 'Capital Allocation, Cash Flow & Audit Readiness',
    description:
      'A fractional CFO from The Crimson Bench delivers institutional-quality financial leadership — GAAP-clean books, board-ready reporting, and strategic capital allocation — at a fraction of the cost of a full-time hire. Our CFOs carry pedigrees from Goldman Sachs, BlackRock, and Bain Capital, and have overseen hundreds of fundraising rounds and audit cycles.',
    responsibilities: [
      'Monthly close, financial statements, and board packages',
      'Cash flow modeling and treasury management',
      'Fundraising preparation: financial model, data room, investor Q&A',
      'Audit coordination and GAAP compliance',
      'Unit economics analysis and margin improvement',
      'Finance team hiring and management',
    ],
    whenToHire: [
      'You are approaching a Series A, B, or C fundraise',
      'Your books are behind or your audit is approaching',
      'The business has hired a full-time CFO and needs bridge coverage',
      'Investors or lenders have asked for improved financial reporting',
      'You need to model a complex M&A, carve-out, or restructuring',
    ],
    outcomes: [
      'Fundraising data rooms completed in under 3 weeks',
      'Clean audit opinions secured within engagement windows',
      'Cash runway extended through working capital optimization',
      'Finance teams upgraded with best-in-class processes and systems',
    ],
    faqs: [
      {
        q: 'What is a fractional CFO?',
        a: 'A fractional CFO is a senior finance leader who works with your company on a part-time basis — typically 1–3 days per week — at a flat monthly retainer. They perform all the functions of a full-time CFO: closing the books, building the financial model, preparing board packages, managing the audit, and advising on capital strategy.',
      },
      {
        q: 'Do I need a fractional CFO or a bookkeeper?',
        a: 'A bookkeeper records transactions. A CFO interprets them, builds forward-looking models, prepares investor-ready financials, and advises the CEO on capital strategy. If you are raising money, preparing for an audit, managing multiple revenue streams, or trying to improve margins, you need a CFO — not a bookkeeper.',
      },
      {
        q: 'How much does a fractional CFO cost?',
        a: 'The Crimson Bench charges a flat monthly fee starting at $4,000 for advisory engagements and $7,500–$18,500 for hands-on fractional roles. Compare this to a full-time CFO at $250,000–$400,000 in base salary plus equity — our model delivers the same caliber of talent at 15–30% of the cost.',
      },
      {
        q: 'Can your fractional CFO lead our Series A fundraise?',
        a: 'Yes. Our CFOs have led the financial preparation for hundreds of fundraising rounds, including Series A through D. This includes building the financial model, structuring the data room, preparing investor Q&A materials, and participating in investor calls to field due diligence questions.',
      },
    ],
    searchTerms: ['fractional cfo', 'part-time cfo', 'outsourced cfo', 'interim cfo', 'virtual cfo', 'fractional chief financial officer'],
  },
  {
    key: 'cto',
    title: 'CTO',
    fullTitle: 'Chief Technology Officer',
    tagline: 'Architecture, Tech Debt Auditing & Product Scaling',
    description:
      'A fractional CTO from The Crimson Bench provides the technical leadership your engineering organization needs to scale — without the $300,000+ full-time package. Our CTOs have built systems at scale at companies backed by Sequoia, Andreessen Horowitz, and Thoma Bravo, and bring institutional engineering rigor to your product and platform decisions.',
    responsibilities: [
      'Engineering team structure, hiring, and performance management',
      'Technology stack evaluation and architecture decisions',
      'Technical debt audit and remediation roadmap',
      'Product roadmap alignment with engineering capacity',
      'Security and compliance posture for SOC2, ISO 27001',
      'CTO-level representation to board and investors',
    ],
    whenToHire: [
      'Your founding engineer is no longer the right technical leader',
      'Engineering velocity has stalled or quality has degraded',
      'You are preparing for a technical due diligence audit',
      'A major platform migration or architecture decision is pending',
      'You need a CTO to represent the technical vision to investors',
    ],
    outcomes: [
      'Engineering velocity improvements measured within 90 days',
      'Technical debt remediation plans with clear ROI timelines',
      'SOC2 Type II and ISO 27001 audit readiness achieved',
      'Platform architectures designed to support 10× scale',
    ],
    faqs: [
      {
        q: 'What does a fractional CTO do?',
        a: 'A fractional CTO owns your technical vision and engineering organization on a part-time basis. They set architecture standards, manage engineering leadership, evaluate and make technology stack decisions, lead security and compliance initiatives, and represent the technical side of your business to investors, boards, and enterprise customers.',
      },
      {
        q: 'Do I need a fractional CTO or a lead engineer?',
        a: 'A lead engineer writes code and manages a team. A CTO owns the technical strategy, architecture, and organizational design of your engineering function. If you are raising money, entering enterprise sales cycles, or navigating a major platform decision, you need a CTO. If you just need more engineering capacity, you need a lead engineer.',
      },
      {
        q: 'Can your fractional CTO help us pass a technical due diligence audit?',
        a: 'Yes. Technical due diligence is one of the most common engagements for our CTOs. We audit your codebase, infrastructure, security posture, and engineering processes, then produce the documentation and fixes required to pass PE or strategic acquirer due diligence.',
      },
    ],
    searchTerms: ['fractional cto', 'part-time cto', 'outsourced cto', 'interim cto', 'fractional chief technology officer'],
  },
  {
    key: 'coo',
    title: 'COO',
    fullTitle: 'Chief Operating Officer',
    tagline: 'Supply Chain, SOPs & Cross-Departmental Efficiency',
    description:
      'A fractional COO from The Crimson Bench brings operational precision to growing companies that have outpaced their systems. Our COOs have built the operating infrastructure at portfolio companies of KKR, Vista Equity, and Warburg Pincus — and they apply that institutional rigor to your organization from day one.',
    responsibilities: [
      'Operating cadence design: OKRs, QBRs, weekly standups',
      'Cross-departmental workflow optimization',
      'Supply chain and vendor management',
      'SOP documentation and process standardization',
      'Headcount planning and organizational design',
      'KPI tracking and operations dashboard build-out',
    ],
    whenToHire: [
      'The business is growing faster than your systems can support',
      'You have departmental silos with no operational connective tissue',
      'Supply chain inefficiencies are compressing margins',
      'You are preparing for a PE transaction or operational due diligence',
      'The CEO needs an operational second-in-command to free bandwidth',
    ],
    outcomes: [
      'Operating cadences installed within the first 30 days',
      'Supply chain cost reductions of 8–22% across mandates',
      'SOPs documented and implemented across all major departments',
      'Headcount plans aligned to revenue targets with clear accountability',
    ],
    faqs: [
      {
        q: 'What does a fractional COO do?',
        a: 'A fractional COO owns the operational execution of the business — process design, cross-functional coordination, vendor and supply chain management, and the operating systems (OKRs, KPIs, SOPs) that make the business run efficiently. They are the counterpart to the CEO\'s strategic focus.',
      },
      {
        q: 'When does a company need a COO versus a CEO?',
        a: 'A CEO sets vision and direction. A COO builds the machine that executes it. Many early-stage companies only have one — and it\'s usually the CEO. When execution is suffering — missed deadlines, departmental miscommunication, supply chain failures, or scaling pains — the gap is typically a COO-shaped one.',
      },
    ],
    searchTerms: ['fractional coo', 'part-time coo', 'outsourced coo', 'interim coo', 'fractional chief operating officer'],
  },
  {
    key: 'cro',
    title: 'CRO',
    fullTitle: 'Chief Revenue Officer',
    tagline: 'Enterprise Pipeline, Deal Structuring & Revenue Expansion',
    description:
      'A fractional CRO from The Crimson Bench builds the revenue architecture — sales process, enterprise pipeline, deal structure, and expansion playbook — that companies need to hit their growth targets. Our CROs have scaled revenue organizations at companies backed by General Atlantic, SoftBank, and Sequoia.',
    responsibilities: [
      'Sales process design and pipeline architecture',
      'Enterprise account strategy and deal structuring',
      'Revenue operations and CRM implementation',
      'SDR/AE team hiring, onboarding, and performance management',
      'Pricing strategy and packaging optimization',
      'Expansion revenue: upsell, cross-sell, and renewal architecture',
    ],
    whenToHire: [
      'Revenue is growing but sales process is inconsistent',
      'You are moving from founder-led sales to a repeatable sales motion',
      'Enterprise deals are stalling in procurement or legal',
      'You are entering a new market or launching a new product tier',
      'Churn is eroding net revenue retention below 100%',
    ],
    outcomes: [
      'Sales cycles shortened by 20–40% through process standardization',
      'Pipeline coverage ratios improved to 3–5× quota within 90 days',
      'Enterprise deal structures negotiated and closed',
      'Net revenue retention improved above 110% through expansion programs',
    ],
    faqs: [
      {
        q: 'What is a fractional CRO?',
        a: 'A fractional Chief Revenue Officer owns all revenue-generating functions — sales, marketing (in many organizations), and customer success — on a part-time basis. They build the systems, process, and team that create predictable, scalable revenue growth.',
      },
      {
        q: 'When should I hire a fractional CRO instead of a VP of Sales?',
        a: 'A VP of Sales manages a team and quota. A CRO builds the entire revenue architecture — pricing, go-to-market strategy, sales process, expansion playbook, and the organizational design of the revenue team. If you are at $2M–$20M ARR and trying to build a repeatable, scalable revenue motion, you need a CRO.',
      },
    ],
    searchTerms: ['fractional cro', 'part-time cro', 'outsourced cro', 'interim cro', 'fractional chief revenue officer'],
  },
  {
    key: 'cmo',
    title: 'CMO',
    fullTitle: 'Chief Marketing Officer',
    tagline: 'Brand Positioning & Acquisition Architecture',
    description:
      'A fractional CMO from The Crimson Bench builds the brand and demand generation engine that drives qualified pipeline at scale. Our CMOs have led marketing for companies backed by Andreessen Horowitz, General Atlantic, and Palantir — and they bring institutional marketing rigor to companies that cannot yet afford a $250,000/year full-time hire.',
    responsibilities: [
      'Brand positioning and messaging architecture',
      'Demand generation strategy: content, paid, SEO, events',
      'Marketing team structure, hiring, and agency management',
      'Product marketing: launch strategy, competitive positioning, sales enablement',
      'Marketing attribution and ROI measurement',
      'Account-based marketing (ABM) for enterprise pipeline',
    ],
    whenToHire: [
      'Marketing is creating activity but not qualified pipeline',
      'You are relaunching a brand or entering a new category',
      'You need to build a marketing function from scratch',
      'Sales is complaining about lead quality',
      'You are launching a new product and need a go-to-market strategy',
    ],
    outcomes: [
      'Brand positioning frameworks built in the first 30 days',
      'Demand generation programs producing qualified pipeline within 60 days',
      'Marketing-attributed pipeline growth of 40–80% within 6 months',
      'Product launches executed with full sales enablement packages',
    ],
    faqs: [
      {
        q: 'What does a fractional CMO do?',
        a: 'A fractional CMO owns all marketing strategy and execution on a part-time basis. They set brand positioning, build and manage the demand generation engine, oversee content, paid media, SEO, and events, and produce the marketing attribution reporting that shows what is driving pipeline and revenue.',
      },
      {
        q: 'Should I hire a fractional CMO or a marketing manager?',
        a: 'A marketing manager executes tasks. A CMO sets strategy, allocates budget, hires and manages the team, and is accountable to pipeline and revenue metrics. If you have no marketing strategy — or your strategy is producing activity but not pipeline — you need a CMO, not another executor.',
      },
    ],
    searchTerms: ['fractional cmo', 'part-time cmo', 'outsourced cmo', 'interim cmo', 'fractional chief marketing officer'],
  },
  {
    key: 'chro',
    title: 'CHRO',
    fullTitle: 'Chief Human Resources Officer',
    tagline: 'Org Design, Talent Strategy & Executive Compensation',
    description:
      'A fractional CHRO from The Crimson Bench builds the people infrastructure that high-growth companies need — compensation benchmarks, org design, performance management, and executive recruiting — without the $200,000+ full-time package. Our CHROs have designed the people architecture at PE-backed portfolio companies through growth, acquisition, and exit.',
    responsibilities: [
      'Organizational design and headcount planning',
      'Executive compensation benchmarking and equity plan design',
      'Performance management framework and calibration',
      'Culture and engagement programs',
      'HR compliance and employment policy',
      'Executive recruiting and onboarding',
    ],
    whenToHire: [
      'Headcount is growing faster than HR infrastructure',
      'Executive compensation is misaligned with market benchmarks',
      'A PE sponsor has flagged people process gaps in due diligence',
      'You are managing a reduction in force and need experienced guidance',
      'Culture and attrition problems are compressing team performance',
    ],
    outcomes: [
      'Compensation benchmarks refreshed and aligned to market within 45 days',
      'Performance management systems installed and running within 60 days',
      'Org design documents produced for board and investor review',
      'Attrition reduced through structured retention and engagement programs',
    ],
    faqs: [
      {
        q: 'What is a fractional CHRO?',
        a: 'A fractional CHRO is a senior human resources leader who manages all people strategy and HR operations on a part-time basis. They handle everything from organizational design and executive compensation to performance management, HR compliance, and culture — at a fraction of the cost of a full-time C-suite hire.',
      },
    ],
    searchTerms: ['fractional chro', 'part-time chro', 'outsourced chro', 'interim chro', 'fractional chief human resources officer', 'fractional hr director'],
  },
  {
    key: 'ciso',
    title: 'CISO',
    fullTitle: 'Chief Information Security Officer',
    tagline: 'Data Governance, Compliance & Threat Modeling',
    description:
      'A fractional CISO from The Crimson Bench delivers enterprise-grade information security leadership — SOC 2 readiness, data governance, and threat modeling — without the $300,000+ full-time security executive package. Our CISOs have built security programs at companies serving Fortune 500 clients, government agencies, and regulated financial institutions.',
    responsibilities: [
      'Security posture assessment and risk register development',
      'SOC 2 Type I and Type II audit preparation and oversight',
      'ISO 27001 and NIST framework implementation',
      'Vendor security assessment and third-party risk management',
      'Incident response planning and tabletop exercises',
      'Security team hiring and managed security service provider (MSSP) oversight',
    ],
    whenToHire: [
      'An enterprise customer has asked for your SOC 2 Type II report',
      'A PE sponsor has flagged security gaps in technical due diligence',
      'You are handling sensitive customer data and have no security program',
      'A security incident has occurred and you need expert incident response',
      'You are entering regulated industries: healthcare, finance, government',
    ],
    outcomes: [
      'SOC 2 Type II readiness achieved within 6-month engagement windows',
      'ISO 27001 certification supported from gap assessment to certification',
      'Security programs built that satisfy Fortune 500 enterprise customer requirements',
      'Risk registers and incident response plans documented and tested',
    ],
    faqs: [
      {
        q: 'What is a fractional CISO?',
        a: 'A fractional CISO is a senior information security executive who leads your security strategy, compliance programs, and risk management on a part-time basis. They perform all the functions of a full-time CISO — building security policy, managing audits, overseeing your security team or MSSP — at a fraction of the cost.',
      },
      {
        q: 'Do I need a fractional CISO to get SOC 2 certified?',
        a: 'You do not need a CISO to complete a SOC 2 audit — but you will move significantly faster and with fewer costly surprises if you have one. Our fractional CISOs have navigated SOC 2 Type I and Type II for dozens of companies, and they know exactly what auditors want to see.',
      },
    ],
    searchTerms: ['fractional ciso', 'part-time ciso', 'outsourced ciso', 'interim ciso', 'fractional chief information security officer', 'virtual ciso', 'vciso'],
  },
]

export function getRoleByKey(key: string): Role | undefined {
  return ROLES.find(r => r.key === key)
}

export function getAllRoleSlugs(): string[] {
  return ROLES.map(r => r.key)
}
