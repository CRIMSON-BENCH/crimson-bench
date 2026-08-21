// Generates src/lib/digital-products.ts — the Crimson Bench instant-download store.
// Run: node scripts/gen-digital-products.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// [name, format, price, tagline, includeA, includeB]
const CATEGORIES = [
  ['Board & Fundraising', 'Board & fundraising toolkits used by Ivy League operators to raise capital and run boards.', [
    ['Seed Pitch Deck Template', 'Slide Template', 79, 'The 12-slide narrative investors actually fund.', 'Editable Keynote, PowerPoint & Google Slides', 'Slide-by-slide guidance notes'],
    ['Series A Pitch Deck Template', 'Slide Template', 129, 'The metrics-forward deck that clears a partner meeting.', 'Traction, cohort & GTM slide frameworks', 'Appendix & data-room slide set'],
    ['Investor Data Room Kit', 'Toolkit', 149, 'Every folder a diligence team expects — pre-built.', 'Full folder tree + file checklist', 'Investor-ready index template'],
    ['Cap Table Model', 'Excel Model', 99, 'Model dilution across every round before you sign.', 'SAFE, priced-round & option-pool logic', 'Exit-waterfall scenarios'],
    ['Monthly Investor Update Template', 'Notion Template', 49, 'The update that keeps investors leaning in.', 'KPI block + ask section', 'Email + Notion versions'],
    ['Board Deck Template', 'Slide Template', 99, 'Run a board meeting like a public-company CEO.', 'Standard board-meeting agenda flow', 'Metrics, risks & asks sections'],
    ['Board Meeting Minutes Kit', 'PDF Playbook', 49, 'Governance-clean minutes in minutes.', 'Minutes + resolutions templates', 'Consent & approval language'],
    ['Fundraising CRM Tracker', 'Notion Template', 59, 'Run your raise like a sales pipeline.', 'Investor pipeline board', 'Stage, check-size & status tracking'],
    ['Valuation & Dilution Explainer', 'PDF Playbook', 39, 'Never get out-negotiated on terms again.', 'Pre/post-money worked examples', 'Term-sheet red-flag checklist'],
    ['SAFE & Term Sheet Cheat Sheet', 'PDF Playbook', 39, 'Every key term, decoded in plain English.', 'Founder-friendly vs standard terms', 'Negotiation talking points'],
    ['Fundraising Narrative Workbook', 'PDF Playbook', 49, 'Turn your numbers into a story that funds.', 'Story-arc worksheet', 'Objection-handling scripts'],
    ['Angel Outreach Email Pack', 'Toolkit', 39, 'Cold-to-close investor email sequences.', '9 proven email templates', 'Follow-up cadence guide'],
    ['Board Recruiting Kit', 'Toolkit', 69, 'Find, vet, and seat the right directors.', 'Role scorecards + outreach scripts', 'Reference-check question bank'],
    ['Due Diligence Checklist', 'Checklist', 49, 'Be diligence-ready before investors ask.', 'Financial, legal & tech sections', '120-point readiness audit'],
    ['Convertible Note Model', 'Excel Model', 79, 'See exactly how notes convert at the next round.', 'Cap + discount conversion logic', 'Multiple-note stacking'],
    ['Investor FAQ & Objection Bank', 'PDF Playbook', 39, 'A crisp answer to every hard question.', '40+ investor questions answered', 'Founder response frameworks'],
  ]],
  ['Finance & Cash', 'CFO-grade models and dashboards to run cash, margins, and the numbers that decide survival.', [
    ['13-Week Cash Flow Model', 'Excel Model', 99, 'The model that keeps you from running out of money.', 'Rolling 13-week forecast engine', 'Scenario & stress-test toggles'],
    ['Annual Operating Budget Model', 'Excel Model', 129, 'Build a board-ready budget in an afternoon.', 'Departmental budget builder', 'Actuals-vs-budget variance view'],
    ['Startup Financial Model (3-Statement)', 'Excel Model', 199, 'Investor-grade P&L, balance sheet & cash flow.', 'Fully-linked 3-statement engine', 'Driver-based revenue build'],
    ['SaaS Metrics Dashboard', 'Excel Model', 129, 'MRR, churn, CAC, LTV — live, in one view.', 'Cohort retention analysis', 'CAC payback & LTV\\:CAC'],
    ['Unit Economics Calculator', 'Excel Model', 79, 'Know if every sale actually makes money.', 'Contribution-margin breakdown', 'Break-even & payback outputs'],
    ['KPI Dashboard Template', 'Excel Model', 89, 'The one dashboard your leadership team needs.', 'North-star + supporting metrics', 'Auto-charting from raw data'],
    ['Runway & Burn Tracker', 'Excel Model', 69, 'Always know exactly how many months you have.', 'Gross vs net burn tracking', 'Runway-by-scenario projections'],
    ['Pricing Strategy Toolkit', 'PDF Playbook', 79, 'Price for value and expand margin on purpose.', 'Value-based pricing frameworks', 'Willingness-to-pay survey kit'],
    ['Fractional CFO Playbook', 'PDF Playbook', 99, 'The first-90-days finance operating manual.', 'Week-by-week priority map', 'Close, forecast & board cadence'],
    ['Monthly Close Checklist', 'Checklist', 49, 'A clean, fast month-end close, every time.', '60-point close workflow', 'Reconciliation & sign-off tracker'],
    ['Expense Policy & Approval Kit', 'Toolkit', 39, 'Control spend without slowing the team.', 'Editable expense policy', 'Approval-threshold matrix'],
    ['Revenue Forecast Model', 'Excel Model', 99, 'Bottoms-up revenue you can defend to a board.', 'Pipeline-weighted forecast', 'Cohort expansion modeling'],
    ['Fundable Metrics Explainer', 'PDF Playbook', 39, 'The numbers investors judge you on.', 'Benchmark ranges by stage', 'Metric-definition glossary'],
    ['Financial Statement Reading Guide', 'PDF Playbook', 39, 'Read any P&L or balance sheet like a CFO.', 'Line-by-line walkthroughs', 'Red-flag spotting checklist'],
    ['Cost-Cutting Triage Playbook', 'PDF Playbook', 59, 'Where to cut first when cash gets tight.', 'Ranked cut framework', 'Zero-based budgeting worksheet'],
    ['Investor Reporting Pack', 'Toolkit', 69, 'Monthly numbers that build investor trust.', 'Metrics pack + commentary template', 'Automated chart set'],
  ]],
  ['Strategy & Turnaround', 'Operating playbooks for planning, focus, and pulling a company back from the edge.', [
    ['100-Day CEO Plan', 'PDF Playbook', 99, 'Your first 100 days, sequenced for wins.', '30/60/90 milestone map', 'Stakeholder & quick-win planner'],
    ['Turnaround Playbook', 'PDF Playbook', 129, 'Stop the bleeding and rebuild in 100 days.', 'Crisis triage sequence', 'Cash, team & customer stabilization'],
    ['OKR System Template', 'Notion Template', 69, 'Goals that actually cascade and get done.', 'Company→team→individual OKRs', 'Quarterly scoring workflow'],
    ['Annual Strategic Plan Kit', 'Toolkit', 99, 'A one-page strategy your whole team follows.', 'Strategy-on-a-page template', 'Initiative prioritization matrix'],
    ['Decision-Making Frameworks Pack', 'PDF Playbook', 59, 'The mental models operators decide with.', '15 frameworks, worked examples', 'Reversible-vs-irreversible guide'],
    ['Business Model Canvas Kit', 'Notion Template', 49, 'Map and pressure-test your whole model.', 'Interactive canvas + prompts', 'Assumption-testing tracker'],
    ['Competitive Analysis Template', 'Toolkit', 59, 'See your market the way an analyst does.', 'Competitor teardown grid', 'Positioning & moat map'],
    ['Pre-Mortem & Risk Register', 'Toolkit', 49, 'Kill failure modes before they happen.', 'Pre-mortem workshop guide', 'Risk register + owner tracker'],
    ['Scenario Planning Model', 'Excel Model', 89, 'Plan for three futures, not one guess.', 'Base/bull/bear scenario engine', 'Trigger & response planner'],
    ['Weekly Operating Rhythm Kit', 'Notion Template', 59, 'The meeting cadence that keeps focus.', 'Weekly/monthly/quarterly agendas', 'Metrics-review scorecard'],
    ['Prioritization Toolkit', 'Toolkit', 39, 'Say no to good ideas, on purpose.', 'RICE + impact/effort scoring', 'Kill-criteria worksheet'],
    ['Company Vision & Values Kit', 'PDF Playbook', 49, 'Put words to what you are building.', 'Vision/mission worksheets', 'Values-to-behaviors mapping'],
    ['Bottleneck-Finder Playbook', 'PDF Playbook', 49, 'Find the one constraint holding you back.', 'Theory-of-constraints guide', 'Throughput diagnostic'],
    ['Pivot Decision Kit', 'Toolkit', 59, 'Decide to pivot with data, not fear.', 'Pivot-signal checklist', 'Option-scoring model'],
    ['Quarterly Business Review Deck', 'Slide Template', 79, 'The QBR that impresses any board.', 'Full QBR slide flow', 'Metrics, wins, risks & asks'],
  ]],
  ['Revenue & GTM', 'Sales, pricing, and go-to-market systems that turn strategy into pipeline.', [
    ['Go-to-Market Playbook', 'PDF Playbook', 99, 'Launch into a market without guessing.', 'ICP & positioning frameworks', 'Channel & motion selection'],
    ['Sales Playbook Template', 'Toolkit', 89, 'A repeatable sales motion your reps can run.', 'Discovery-to-close scripts', 'Objection-handling library'],
    ['Cold Outbound Sequence Pack', 'Toolkit', 59, 'Email + LinkedIn sequences that book meetings.', '12 multi-touch sequences', 'Subject-line & CTA swipe file'],
    ['Sales Pipeline Tracker', 'Notion Template', 49, 'Forecast revenue you can actually trust.', 'Stage-weighted pipeline board', 'Win-rate & velocity metrics'],
    ['Pricing & Packaging Toolkit', 'PDF Playbook', 79, 'Tiers and prices that lift ARPU.', 'Good/better/best builder', 'Discount-guardrail matrix'],
    ['Discovery Call Framework', 'PDF Playbook', 39, 'Run calls that surface real buying pain.', 'Question bank by persona', 'Qualification scorecard'],
    ['Proposal & SOW Template', 'Toolkit', 59, 'Send proposals that close faster.', 'Editable proposal + SOW', 'Pricing & terms sections'],
    ['Sales Comp Plan Builder', 'Excel Model', 89, 'Design quotas and commissions that motivate.', 'OTE & accelerator modeling', 'Quota-setting worksheet'],
    ['Customer Onboarding Kit', 'Toolkit', 59, 'Turn new customers into retained revenue.', '30/60/90 onboarding plan', 'Success-milestone tracker'],
    ['Churn Reduction Playbook', 'PDF Playbook', 69, 'Find and fix the leaks in your revenue.', 'Churn-diagnosis framework', 'Save-play & win-back scripts'],
    ['Partnerships & Channel Kit', 'Toolkit', 69, 'Build a channel that compounds pipeline.', 'Partner-tiering framework', 'Co-sell & rev-share templates'],
    ['GTM Metrics Dashboard', 'Excel Model', 89, 'CAC, pipeline, and coverage in one view.', 'Funnel-conversion analytics', 'Pipeline-coverage tracker'],
    ['Account-Based Playbook', 'PDF Playbook', 79, 'Land named accounts with a team play.', 'Account-tiering & research kit', 'Multithreading map'],
    ['Sales Forecast Model', 'Excel Model', 79, 'A forecast your board won\\u2019t poke holes in.', 'Rep-level roll-up', 'Commit/best-case/pipeline views'],
    ['Win-Loss Analysis Kit', 'Toolkit', 49, 'Learn exactly why deals are won and lost.', 'Interview guide + template', 'Theme-tagging tracker'],
  ]],
  ['Operations & Scaling', 'Systems that let a company run without the founder in every decision.', [
    ['SOP Library Starter Kit', 'Notion Template', 79, 'Document your business so it runs itself.', '40 pre-built SOP templates', 'Process-owner tracker'],
    ['Hiring & Interview Kit', 'Toolkit', 79, 'Hire A-players with a repeatable process.', 'Scorecards + structured guides', 'Reference-check question bank'],
    ['Org Design & Headcount Model', 'Excel Model', 99, 'Plan your org and payroll before you grow.', 'Headcount + fully-loaded cost', 'Span-of-control planner'],
    ['Employee Onboarding Kit', 'Toolkit', 59, 'First-week clarity for every new hire.', '30/60/90 onboarding plan', 'Role-readiness checklist'],
    ['Project Management System', 'Notion Template', 59, 'One system to run every initiative.', 'Projects + tasks + sprints', 'Status & blocker dashboard'],
    ['Vendor & Contract Tracker', 'Notion Template', 39, 'Never miss a renewal or overpay again.', 'Contract & renewal tracker', 'Spend-by-vendor view'],
    ['Standard Operating Cadence Kit', 'PDF Playbook', 49, 'The meeting rhythm that scales.', 'Meeting-type playbook', 'Agenda & notes templates'],
    ['Delegation & RACI Toolkit', 'Toolkit', 49, 'Get out of the critical path for good.', 'RACI matrix builder', 'Delegation-ladder worksheet'],
    ['Incident Response Runbook', 'PDF Playbook', 59, 'Handle outages and crises calmly.', 'Severity & escalation matrix', 'Postmortem template'],
    ['Quality & Process Audit Kit', 'Toolkit', 49, 'Find the broken steps before customers do.', 'Process-mapping template', 'Audit scorecard'],
    ['Remote Team Operating Manual', 'PDF Playbook', 49, 'Run a tight ship across time zones.', 'Async-comms guidelines', 'Handbook starter template'],
    ['Capacity Planning Model', 'Excel Model', 79, 'Match team capacity to the roadmap.', 'Utilization & load modeling', 'Hiring-trigger thresholds'],
    ['Supply Chain / Inventory Tracker', 'Excel Model', 79, 'Keep stock and cash in balance.', 'Reorder-point calculator', 'Lead-time & safety-stock logic'],
    ['Business Continuity Plan Kit', 'Toolkit', 59, 'Be ready when something breaks.', 'Continuity plan template', 'Risk & recovery matrix'],
  ]],
  ['Leadership & People', 'The people systems that turn a group of hires into a high-performing team.', [
    ['1:1 Meeting System', 'Notion Template', 49, 'The 1:1s that build trust and momentum.', 'Agenda + notes templates', 'Growth & feedback tracker'],
    ['Performance Review Kit', 'Toolkit', 69, 'Fair, fast reviews people actually value.', 'Review templates by level', 'Calibration & rating guide'],
    ['Compensation Bands Model', 'Excel Model', 89, 'Pay fairly and defensibly at every level.', 'Level & band builder', 'Offer & equity calculator'],
    ['Hiring Scorecard Pack', 'Toolkit', 49, 'Interview for signal, not vibes.', 'Role scorecards + rubrics', 'Structured-interview guides'],
    ['Culture & Values Playbook', 'PDF Playbook', 59, 'Make culture a system, not a poster.', 'Values-to-behaviors mapping', 'Ritual & recognition ideas'],
    ['Feedback & Difficult Conversations Kit', 'PDF Playbook', 49, 'Say the hard thing, keep the person.', 'SBI feedback scripts', 'Conversation-prep worksheet'],
    ['Leadership Development Toolkit', 'Toolkit', 69, 'Grow the leaders under you.', 'Competency framework', 'Individual development plans'],
    ['Employee Handbook Starter', 'Toolkit', 59, 'A clean handbook without the legal bill.', 'Editable handbook template', 'Policy-section library'],
    ['Team Operating Manual (You)', 'PDF Playbook', 39, 'Help your team work with you faster.', '\\u201CHow I work\\u201D template', 'Communication-preferences guide'],
    ['Org Health Survey Kit', 'Toolkit', 49, 'Measure engagement before it drops.', 'Survey question bank', 'Results-to-action planner'],
    ['Manager Onboarding Kit', 'Toolkit', 59, 'Turn great ICs into great managers.', 'First-90-days manager plan', 'Team-transition checklist'],
    ['Layoffs Done Right Playbook', 'PDF Playbook', 59, 'Handle the hardest day with dignity.', 'Planning & comms sequence', 'Legal & logistics checklist'],
    ['Recognition & Retention Kit', 'Toolkit', 39, 'Keep your best people longer.', 'Retention-risk scorecard', 'Recognition-program templates'],
    ['Hiring Plan & Budget Model', 'Excel Model', 79, 'Plan every hire against the budget.', 'Role-by-role hiring plan', 'Fully-loaded cost projections'],
  ]],
  ['Marketing & Brand', 'Positioning, content, and demand systems to make the market pay attention.', [
    ['Brand Positioning Kit', 'Toolkit', 79, 'Own a clear position in your market.', 'Positioning-statement builder', 'Messaging-hierarchy template'],
    ['Content Strategy & Calendar', 'Notion Template', 59, 'A content engine that compounds.', 'Editorial calendar system', 'Pillar & repurposing planner'],
    ['Marketing Metrics Dashboard', 'Excel Model', 79, 'Prove marketing drives pipeline.', 'Funnel & channel analytics', 'CAC & ROI by channel'],
    ['Launch Playbook', 'PDF Playbook', 69, 'Launch products and features that land.', 'T-minus launch timeline', 'Channel & asset checklist'],
    ['Messaging & Copy Framework', 'PDF Playbook', 49, 'Copy that converts, on every page.', 'Value-prop worksheets', 'Website & email frameworks'],
    ['SEO Content Toolkit', 'Toolkit', 59, 'Rank for what your buyers search.', 'Keyword & brief templates', 'On-page optimization checklist'],
    ['Social Media Playbook', 'PDF Playbook', 49, 'A faceless, repeatable social system.', 'Platform-by-platform playbook', 'Hook & format swipe file'],
    ['Executive LinkedIn Kit', 'Toolkit', 59, 'Build authority as a founder or exec.', '30-day content calendar', 'Post-template library'],
    ['Email Marketing Kit', 'Toolkit', 59, 'Turn a list into recurring revenue.', 'Welcome & nurture sequences', 'Broadcast & segmentation guide'],
    ['Case Study & Testimonial Kit', 'Toolkit', 39, 'Turn happy customers into proof.', 'Interview & template pack', 'Approval & repurposing flow'],
    ['Webinar & Event Playbook', 'PDF Playbook', 49, 'Fill and convert live events.', 'Promotion & run-of-show', 'Follow-up conversion sequence'],
    ['Brand Style Guide Template', 'Toolkit', 49, 'Keep every asset on-brand.', 'Logo, color & type system', 'Voice & tone guidelines'],
  ]],
]

// Bundles (built after the base catalog so we can reference categories)
const BUNDLES = [
  ['The CFO Toolkit', 'Bundle', 249, 'Every finance model and playbook in one download.', 'All Finance & Cash products', 'Free lifetime updates'],
  ['The Fundraising War Chest', 'Bundle', 249, 'Everything you need to run a raise, end to end.', 'All Board & Fundraising products', 'Deck, data room, cap table & more'],
  ['The Founder Operating System', 'Bundle', 299, 'The systems to run and scale the whole company.', 'Strategy, Ops & Leadership kits', 'Free lifetime updates'],
  ['The Revenue Engine Bundle', 'Bundle', 249, 'Turn strategy into pipeline and closed revenue.', 'All Revenue & GTM products', 'Sales, pricing & GTM systems'],
  ['The People & Leadership Bundle', 'Bundle', 199, 'Build a team that performs without you.', 'All Leadership & People products', 'Reviews, comp, hiring & culture'],
  ['The Marketing Growth Bundle', 'Bundle', 199, 'A full demand and brand system.', 'All Marketing & Brand products', 'Positioning, content & channels'],
  ['The Crimson Bench Vault', 'Bundle', 499, 'Every digital product we make — one price, forever.', 'All 100+ products, all categories', 'Every future product, free'],
]

// Industry specialization — same core artifact, tailored per vertical (real differentiation + SEO).
const SPECIALIZABLE = new Set(['Finance & Cash', 'Revenue & GTM', 'Strategy & Turnaround', 'Marketing & Brand'])
const INDUSTRIES = [
  ['SaaS', 'saas', 'recurring-revenue SaaS'],
  ['E-Commerce', 'ecommerce', 'DTC and e-commerce'],
  ['Agencies & Professional Services', 'agencies', 'agency and professional-services'],
  ['Healthcare', 'healthcare', 'healthcare and life-sciences'],
  ['Fintech', 'fintech', 'fintech and financial-services'],
  ['Manufacturing', 'manufacturing', 'manufacturing and industrials'],
  ['Hospitality & Restaurants', 'hospitality', 'hospitality and restaurant'],
]

// ---- The real 5-model Excel toolkit that ships inside every package ----
// Matches CATEGORY_BUNDLES in crimson-bench-deliverables/gen_packages.py
const M = {
  pnl: ['12-Month P&L Projection', 'Driver-based profit & loss with EBITDA and margins, month by month.'],
  captable: ['Cap Table & Dilution', 'Model ownership and post-round dilution before you sign a term sheet.'],
  budget: ['Budget vs. Actual Tracker', 'Plan the budget, log actuals, and see variance by category at a glance.'],
  hiring: ['Hiring Plan & Payroll Model', 'Roles, fully-loaded salaries, and cumulative payroll by start month.'],
  kpi: ['KPI Dashboard', 'Track your metrics against targets with red/amber/green status.'],
  cashflow: ['12-Month Cash Flow Forecast', 'A rolling forecast with automatic ending-balance rollforward.'],
  runway: ['Runway & Burn Tracker', 'Always know how many months of runway you have at current burn.'],
  unitecon: ['Unit Economics Calculator', 'Gross margin, CAC, LTV, LTV:CAC, and payback — the survival math.'],
  pipeline: ['Sales Pipeline & Forecast', 'Stage-weighted pipeline that forecasts bookings you can defend.'],
  cac: ['CAC by Channel', 'Compare acquisition cost and efficiency across every channel.'],
  campaign: ['Campaign ROI Tracker', 'Log spend and revenue per campaign to see ROI and ROAS.'],
  pricing: ['Pricing & Margin Calculator', 'Good/better/best pricing from cost-plus and target-margin logic.'],
  breakeven: ['Break-Even Analysis', 'The units and revenue you need just to cover your costs.'],
  scenario: ['Scenario & Sensitivity Model', 'Stress-test profit under bear, base, and bull assumptions.'],
}
const CATEGORY_TOOLKIT = {
  'Board & Fundraising': ['pnl', 'captable', 'budget', 'hiring', 'kpi'],
  'Finance & Cash': ['cashflow', 'runway', 'pnl', 'budget', 'unitecon'],
  'Strategy & Turnaround': ['scenario', 'pnl', 'breakeven', 'kpi', 'budget'],
  'Revenue & GTM': ['pipeline', 'cac', 'pricing', 'unitecon', 'kpi'],
  'Marketing & Brand': ['campaign', 'cac', 'budget', 'kpi', 'pricing'],
  'Operations & Scaling': ['hiring', 'kpi', 'budget', 'breakeven', 'scenario'],
  'Leadership & People': ['hiring', 'budget', 'kpi', 'scenario', 'pnl'],
  'Bundles & Vaults': ['pnl', 'cashflow', 'captable', 'pipeline', 'kpi'],
}
const CATEGORY_SIMS = {
  'Board & Fundraising': [['Real Estate Syndication LP Simulator', 'syndication-lp-simulator'], ['Private Credit Fund Simulator', 'private-credit-fund-simulator'], ['Opportunity Zone Fund Simulator', 'opportunity-zone-fund-simulator']],
  'Finance & Cash': [['Dividend Growth Simulator', 'dividend-growth-simulator'], ['Annuity Income Simulator', 'annuity-income-simulator'], ['HSA Growth Simulator', 'hsa-simulator']],
  'Strategy & Turnaround': [['Shopify DTC Brand Simulator', 'shopify-dtc-simulator'], ['Amazon FBA Simulator', 'amazon-fba-simulator'], ['CRM SaaS Simulator', 'crm-saas-simulator']],
  'Revenue & GTM': [['CRM SaaS Simulator', 'crm-saas-simulator'], ['E-Signature SaaS Simulator', 'esign-saas-simulator'], ['Shopify DTC Brand Simulator', 'shopify-dtc-simulator']],
  'Marketing & Brand': [['Dropshipping Simulator', 'dropshipping-simulator'], ['UGC Creator Agency Simulator', 'ugc-creator-agency-simulator'], ['Supplement Brand Simulator', 'supplement-brand-simulator']],
  'Operations & Scaling': [['Freight Brokerage Simulator', 'freight-brokerage-simulator'], ['Staffing Agency Simulator', 'staffing-agency-simulator'], ['Commercial Cleaning Simulator', 'commercial-cleaning-simulator']],
  'Leadership & People': [['Staffing Agency Simulator', 'staffing-agency-simulator'], ['Bookkeeping Firm Simulator', 'bookkeeping-firm-simulator'], ['Insurance Agency Simulator', 'insurance-agency-simulator']],
  'Bundles & Vaults': [['CRM SaaS Simulator', 'crm-saas-simulator'], ['Real Estate Syndication LP Simulator', 'syndication-lp-simulator'], ['Amazon FBA Simulator', 'amazon-fba-simulator']],
}
const toolkitFor = cat => (CATEGORY_TOOLKIT[cat] || CATEGORY_TOOLKIT['Finance & Cash']).map(k => ({ title: M[k][0], desc: M[k][1] }))
const simsFor = cat => (CATEGORY_SIMS[cat] || CATEGORY_SIMS['Finance & Cash']).map(([name, s]) => ({ name, slug: s }))
const toolkitIncludes = deliverables => [
  ...deliverables.map(d => `${d.title} — ${d.desc}`),
  'Works in Microsoft Excel & Google Sheets — fully editable',
  'Instant download · free lifetime updates',
]

// Toolkit Pro — the all-access membership (replaces the old flat $499 Vault).
const TOOLKIT_PRO = { monthly: 180, annual: 1728, tripack: 20 }

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const short = name => name.replace(/^The /, '').replace(/ Template| Kit| Model| Playbook| Toolkit| Starter| Pack| System| Builder| \(You\)/g, '').trim()

const products = []
let num = 1
const popular = new Set(['13-Week Cash Flow Model', 'Seed Pitch Deck Template', '100-Day CEO Plan', 'Go-to-Market Playbook', 'The Crimson Bench Vault'])
const fresh = new Set(products.length ? [] : [])

const PKG_FORMAT = 'Excel Toolkit · 5 models'
const coreProducts = []
for (const [category, catDesc, items] of CATEGORIES) {
  for (const [name, , price, tagline, incA, incB] of items) {
    const deliverables = toolkitFor(category)
    const pairsWith = simsFor(category)
    const p = {
      id: slug(name), num: num++, name, shortName: short(name), category, format: PKG_FORMAT, price,
      tagline,
      description: `${tagline} A ready-to-use toolkit from The Crimson Bench, built by Ivy League-educated operators — ${deliverables.length} formula-driven Excel models you open, plug your numbers into, and use forever. Buy once, download instantly. No calls, no retainers.`,
      includes: toolkitIncludes(deliverables),
      deliverables, fileCount: deliverables.length, pairsWith,
      focus: [incA, incB],
      stripeMode: 'payment',
      isBestValue: popular.has(name),
    }
    products.push(p)
    coreProducts.push(p)
  }
}

// Industry-specialized variants of every specializable core product.
for (const base of coreProducts) {
  if (!SPECIALIZABLE.has(base.category)) continue
  for (const [label, islug, descr] of INDUSTRIES) {
    const deliverables = base.deliverables
    products.push({
      id: `${base.id}-${islug}`, num: num++,
      name: `${base.name} — ${label}`,
      shortName: `${base.shortName} (${label})`,
      category: base.category, format: PKG_FORMAT, price: base.price,
      industry: label, baseId: base.id,
      tagline: `${base.tagline} Tuned for ${descr} companies.`,
      description: `${base.tagline} A ${deliverables.length}-model Excel toolkit specialized for ${descr} companies — with the benchmarks, assumptions, and language that fit your industry. Built by Ivy League-educated operators. Buy once, download instantly, keep forever.`,
      includes: [`${label}-specific benchmarks and assumptions baked into every model`, ...toolkitIncludes(deliverables)],
      deliverables, fileCount: deliverables.length, pairsWith: base.pairsWith,
      focus: base.focus,
      stripeMode: 'payment',
    })
  }
}
for (const [name, , price, tagline, incA, incB] of BUNDLES) {
  const isVault = name === 'The Crimson Bench Vault'
  const deliverables = toolkitFor('Bundles & Vaults')
  products.push({
    id: slug(name), num: num++, name, shortName: short(name), category: 'Bundles & Vaults',
    format: isVault ? 'All-Access Membership' : 'Bundle · every toolkit in the category',
    price,
    tagline: isVault ? 'Every toolkit and every simulator — one membership.' : tagline,
    description: isVault
      ? 'The all-access membership: every one of our 515 Excel toolkits (2,500+ models) plus all 500 premium simulators, with exports and AI analysis. Included with Toolkit Pro — $180/mo, or $1,728/yr (20% off). Cancel anytime; keep every file you download.'
      : `${tagline} A bundle from The Crimson Bench — every Excel toolkit in the category, buy once, download instantly, keep forever. The best value for operators who want the whole system, not one piece.`,
    includes: isVault
      ? ['All 515 Excel toolkits — 2,500+ formula-driven models', 'All 500 premium simulators + Excel/PDF exports + AI analysis', 'Everything works in Excel & Google Sheets', 'New toolkits and simulators added continuously', '$180/mo or $1,728/yr (save 20%) · cancel anytime']
      : [`Every toolkit in this category — each ${deliverables.length} formula-driven Excel models`, incA, incB, 'Works in Excel & Google Sheets', 'Instant download · free lifetime updates'],
    deliverables: isVault ? [] : deliverables,
    fileCount: isVault ? 2575 : deliverables.length,
    pairsWith: simsFor('Bundles & Vaults'),
    stripeMode: isVault ? 'subscription' : 'payment',
    isSubscription: isVault,
    monthlyPrice: isVault ? TOOLKIT_PRO.monthly : undefined,
    annualPrice: isVault ? TOOLKIT_PRO.annual : undefined,
    isBestValue: isVault,
    isBundle: true,
  })
}

const CATEGORY_ORDER = [...CATEGORIES.map(c => c[0]), 'Bundles & Vaults']
const CATEGORY_META = Object.fromEntries([...CATEGORIES.map(c => [c[0], c[1]]), ['Bundles & Vaults', 'Save big — get an entire category, or the whole store, in one download.']])

const header = `// AUTO-GENERATED by scripts/gen-digital-products.mjs — do not edit by hand.
// The Crimson Bench instant-download store: ${products.length} digital products.
// Regenerate: node scripts/gen-digital-products.mjs

export interface DigitalProduct {
  id: string
  num: number
  name: string
  shortName: string
  category: string
  format: string
  price: number
  tagline: string
  description: string
  includes: string[]
  /** The actual Excel model files that ship in this package (title + one-liner). */
  deliverables?: { title: string; desc: string }[]
  /** Number of files in the package. */
  fileCount?: number
  /** Cross-promo: matching Crimson Bench simulators. */
  pairsWith?: { name: string; slug: string }[]
  /** The two headline capabilities of the original product concept. */
  focus?: string[]
  stripeMode: 'payment' | 'subscription'
  /** Membership tiers on the all-access Vault. */
  isSubscription?: boolean
  monthlyPrice?: number
  annualPrice?: number
  /** Stripe Payment Link URL — filled in by scripts/create-stripe-products.mjs output. */
  paymentLink?: string
  isBestValue?: boolean
  isNew?: boolean
  isBundle?: boolean
  /** Set on industry-specialized variants (e.g. "SaaS"). Undefined on core products. */
  industry?: string
  /** Set on variants — the id of the core product they specialize. */
  baseId?: string
}

/** All-access membership pricing (replaces the old flat $499 Vault). */
export const TOOLKIT_PRO = { monthly: ${TOOLKIT_PRO.monthly}, annual: ${TOOLKIT_PRO.annual}, tripack: ${TOOLKIT_PRO.tripack} }

export function getCoreDigitalProducts(): DigitalProduct[] {
  return DIGITAL_PRODUCTS.filter(p => !p.industry)
}

export function getIndustryVariants(baseId: string): DigitalProduct[] {
  return DIGITAL_PRODUCTS.filter(p => p.baseId === baseId)
}

export const CATEGORY_ORDER: string[] = ${JSON.stringify(CATEGORY_ORDER, null, 2)}

export const CATEGORY_META: Record<string, string> = ${JSON.stringify(CATEGORY_META, null, 2)}

export const DIGITAL_PRODUCTS: DigitalProduct[] = ${JSON.stringify(products, null, 2)}

export function getDigitalProductById(id: string): DigitalProduct | undefined {
  return DIGITAL_PRODUCTS.find(p => p.id === id)
}

export function getDigitalProductsByCategory(category: string): DigitalProduct[] {
  return DIGITAL_PRODUCTS.filter(p => p.category === category)
}

export function formatDigitalPrice(p: DigitalProduct): string {
  if (p.isSubscription && p.monthlyPrice) return \`$\${p.monthlyPrice.toLocaleString()}/mo\`
  return \`$\${p.price.toLocaleString()}\`
}
`

const outPath = join(__dirname, '..', 'src', 'lib', 'digital-products.ts')
writeFileSync(outPath, header)
console.log(`Wrote ${products.length} products to src/lib/digital-products.ts`)
const byCat = {}
for (const p of products) byCat[p.category] = (byCat[p.category] || 0) + 1
for (const c of CATEGORY_ORDER) console.log(`  ${String(byCat[c]).padStart(3)}  ${c}`)
