// Paid "Toolkit Pro" simulators — richer than the free calculators: multi-period
// projections and scenario models that return a metrics row + a full table.
// Isomorphic (server lists + client ProToolRunner). Gating is applied by <ProGate>.

export interface ProInput {
  key: string
  label: string
  default: number
  prefix?: string
  suffix?: string
}

export interface ProResult {
  /** Headline tiles shown above the table. */
  metrics: { label: string; value: string; highlight?: boolean }[]
  columns: string[]
  rows: string[][]
  /** One-line operator's read. */
  note: string
}

export interface ProTool {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  price: string
  inputs: ProInput[]
  compute: (v: Record<string, number>) => ProResult
  sells?: string
}

const money = (n: number) =>
  isFinite(n) ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : '—'
const pct = (n: number) => (isFinite(n) ? `${(n * 100).toFixed(0)}%` : '—')

export const PRO_TOOLS: ProTool[] = [
  {
    id: 'financial-projection-simulator',
    name: '5-Year Financial Projection Simulator',
    category: 'Finance',
    tagline: 'A full P&L and cash projection you can defend to any board.',
    description:
      'Drive a five-year projection from a handful of assumptions: revenue, growth, margin, opex, and starting cash. Returns a year-by-year P&L (revenue, gross profit, EBITDA, net income) and your cash balance — the model investors expect to see.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Year 1 revenue', default: 1000000, prefix: '$' },
      { key: 'growth', label: 'Annual growth', default: 60, suffix: '%' },
      { key: 'grossMargin', label: 'Gross margin', default: 75, suffix: '%' },
      { key: 'opexPct', label: 'Operating expenses (% of revenue)', default: 65, suffix: '%' },
      { key: 'startCash', label: 'Starting cash', default: 500000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let rev = v.revenue
      let cash = v.startCash
      let cumNet = 0
      let endEbitda = 0
      for (let y = 1; y <= 5; y++) {
        if (y > 1) rev = rev * (1 + v.growth / 100)
        const gp = rev * (v.grossMargin / 100)
        const opex = rev * (v.opexPct / 100)
        const ebitda = gp - opex
        const tax = ebitda > 0 ? ebitda * 0.21 : 0
        const net = ebitda - tax
        cash += net
        cumNet += net
        endEbitda = ebitda
        rows.push([`Year ${y}`, money(rev), money(gp), money(ebitda), money(net), money(cash)])
      }
      return {
        metrics: [
          { label: 'Year 5 revenue', value: money(rev), highlight: true },
          { label: 'Year 5 EBITDA', value: money(endEbitda), highlight: true },
          { label: 'Cumulative net', value: money(cumNet) },
          { label: 'Ending cash', value: money(cash), highlight: cash < 0 },
        ],
        columns: ['Year', 'Revenue', 'Gross Profit', 'EBITDA', 'Net Income', 'Cash'],
        rows,
        note:
          cash < 0
            ? `Your cash goes negative before Year 5 — this plan needs a raise or lower burn. Adjust growth vs. opex until cash stays positive.`
            : `Profitable and cash-positive through Year 5. Stress-test it: drop growth 20 points and see if the plan still holds.`,
      }
    },
    sells: 'startup-financial-model-3-statement',
  },
  {
    id: 'fundraising-dilution-simulator',
    name: 'Fundraising Dilution Simulator',
    category: 'Fundraising',
    tagline: 'See your ownership across every round — before you sign the first.',
    description:
      'Model a Seed, Series A, and Series B in sequence. Returns post-money, new-investor ownership, and exactly what founders retain after each round — so you can see the full dilution path from day one.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'seedRaise', label: 'Seed raise', default: 1500000, prefix: '$' },
      { key: 'seedPre', label: 'Seed pre-money', default: 6000000, prefix: '$' },
      { key: 'aRaise', label: 'Series A raise', default: 8000000, prefix: '$' },
      { key: 'aPre', label: 'Series A pre-money', default: 24000000, prefix: '$' },
      { key: 'bRaise', label: 'Series B raise', default: 20000000, prefix: '$' },
      { key: 'bPre', label: 'Series B pre-money', default: 80000000, prefix: '$' },
    ],
    compute: v => {
      let founder = 1
      const rounds = [
        ['Seed', v.seedRaise, v.seedPre],
        ['Series A', v.aRaise, v.aPre],
        ['Series B', v.bRaise, v.bPre],
      ] as [string, number, number][]
      const rows: string[][] = []
      let totalRaised = 0
      let lastPost = 0
      for (const [name, raise, pre] of rounds) {
        const post = pre + raise
        const investor = post > 0 ? raise / post : 0
        founder = founder * (1 - investor)
        totalRaised += raise
        lastPost = post
        rows.push([name, money(raise), money(post), pct(investor), pct(founder)])
      }
      return {
        metrics: [
          { label: 'Founders retain', value: pct(founder), highlight: true },
          { label: 'Total raised', value: money(totalRaised) },
          { label: 'Final valuation', value: money(lastPost), highlight: true },
        ],
        columns: ['Round', 'Raise', 'Post-money', 'New Investor %', 'Founders After'],
        rows,
        note:
          founder < 0.2
            ? `Founders end under 20% — heavy dilution. Raising less, or at higher pre-money, protects ownership more than any later cleanup.`
            : `Founders keep ${pct(founder)} through Series B. Healthy. Each point of pre-money you negotiate now compounds across every future round.`,
      }
    },
    sells: 'cap-table-model',
  },
  {
    id: 'saas-growth-simulator',
    name: 'SaaS Growth Simulator',
    category: 'Revenue',
    tagline: 'Project 24 months of MRR from new-sales, churn, and expansion.',
    description:
      'Model your recurring revenue forward two years. Enter starting MRR, monthly new MRR, churn, and expansion to see the MRR curve, ending ARR, and how retention quietly makes or breaks the trajectory.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'startMRR', label: 'Starting MRR', default: 20000, prefix: '$' },
      { key: 'newMRR', label: 'New MRR added / month', default: 5000, prefix: '$' },
      { key: 'churn', label: 'Monthly churn', default: 3, suffix: '%' },
      { key: 'expansion', label: 'Monthly expansion', default: 1.5, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let mrr = v.startMRR
      let startAnnual = mrr * 12
      for (let m = 1; m <= 24; m++) {
        mrr = mrr * (1 - v.churn / 100 + v.expansion / 100) + v.newMRR
        if (m % 3 === 0) rows.push([`Month ${m}`, money(mrr), money(mrr * 12)])
      }
      const endingARR = mrr * 12
      return {
        metrics: [
          { label: 'Ending MRR', value: money(mrr), highlight: true },
          { label: 'Ending ARR', value: money(endingARR), highlight: true },
          { label: 'ARR growth', value: pct(endingARR / startAnnual - 1) },
        ],
        columns: ['Month', 'MRR', 'ARR (run-rate)'],
        rows,
        note:
          v.expansion >= v.churn
            ? `Expansion outpaces churn — your base grows on its own. That's the compounding engine of great SaaS.`
            : `Churn outruns expansion, so you're leaking. Try lifting expansion a point or two — it moves the 24-month number more than new sales do.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'valuation-suite',
    name: 'Company Valuation Suite',
    category: 'Fundraising',
    tagline: 'Three valuation methods, one defensible range.',
    description:
      'Triangulate your company’s value using revenue-multiple, EBITDA-multiple, and DCF-lite approaches at once. Returns each method’s number and a blended range — the way an analyst actually frames a valuation.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Annual revenue / ARR', default: 5000000, prefix: '$' },
      { key: 'growth', label: 'Revenue growth', default: 50, suffix: '%' },
      { key: 'ebitda', label: 'EBITDA', default: 800000, prefix: '$' },
      { key: 'fcf', label: 'Annual free cash flow', default: 600000, prefix: '$' },
    ],
    compute: v => {
      const revMult = v.growth >= 80 ? 12 : v.growth >= 40 ? 8 : v.growth >= 20 ? 5 : 3
      const revVal = v.revenue * revMult
      const ebitdaMult = 12
      const ebitdaVal = v.ebitda * ebitdaMult
      // DCF-lite: 5 yrs FCF growing at half the revenue growth, 12% discount, + terminal.
      const g = v.growth / 200
      const disc = 0.12
      let dcf = 0
      let fcf = v.fcf
      for (let y = 1; y <= 5; y++) {
        fcf = fcf * (1 + g)
        dcf += fcf / Math.pow(1 + disc, y)
      }
      const terminal = (fcf * 1.03) / (disc - 0.03) / Math.pow(1 + disc, 5)
      const dcfVal = dcf + terminal
      const vals = [revVal, ebitdaVal, dcfVal].filter(x => x > 0)
      const low = Math.min(...vals)
      const high = Math.max(...vals)
      const mid = vals.reduce((a, b) => a + b, 0) / vals.length
      return {
        metrics: [
          { label: 'Low', value: money(low) },
          { label: 'Midpoint', value: money(mid), highlight: true },
          { label: 'High', value: money(high) },
        ],
        columns: ['Method', 'Basis', 'Valuation'],
        rows: [
          ['Revenue multiple', `${revMult}x revenue`, money(revVal)],
          ['EBITDA multiple', `${ebitdaMult}x EBITDA`, money(ebitdaVal)],
          ['DCF (lite)', '5-yr + terminal', money(dcfVal)],
        ],
        note: `A defensible range is ${money(low)}–${money(high)}. Methods disagree for a reason: growth companies price off revenue, profitable ones off EBITDA/cash. Lead with whichever your buyer values.`,
      }
    },
    sells: 'cap-table-model',
  },

  {
    id: 'cash-flow-projection-simulator',
    name: '12-Month Cash Flow Simulator',
    category: 'Finance',
    tagline: 'Watch your cash balance month by month before it happens.',
    description: 'Project 12 months of cash from starting balance, revenue, and expenses — each growing at its own rate. Returns the month-by-month cash curve, your lowest point, and when you turn cash-flow positive.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'startCash', label: 'Starting cash', default: 200000, prefix: '$' },
      { key: 'revenue', label: 'Month 1 revenue', default: 80000, prefix: '$' },
      { key: 'revGrowth', label: 'Revenue growth / month', default: 8, suffix: '%' },
      { key: 'expenses', label: 'Month 1 expenses', default: 120000, prefix: '$' },
      { key: 'expGrowth', label: 'Expense growth / month', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let rev = v.revenue, exp = v.expenses, cash = v.startCash, low = v.startCash, posMonth = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) { rev *= 1 + v.revGrowth / 100; exp *= 1 + v.expGrowth / 100 }
        const net = rev - exp
        cash += net
        if (cash < low) low = cash
        if (posMonth === 0 && net >= 0) posMonth = m
        rows.push([`Month ${m}`, money(rev), money(exp), money(net), money(cash)])
      }
      return {
        metrics: [
          { label: 'Lowest cash', value: money(low), highlight: low < 0 },
          { label: 'Ending cash', value: money(cash), highlight: true },
          { label: 'Cash-flow positive', value: posMonth ? `Month ${posMonth}` : 'Not in 12mo' },
        ],
        columns: ['Month', 'Revenue', 'Expenses', 'Net', 'Cash'],
        rows,
        note: low < 0 ? `Your cash dips below zero — you'd need a raise or cuts before then. The lowest point, not the ending balance, is what kills companies.` : `Cash stays positive all year, bottoming at ${money(low)}. Keep a buffer under that line for the month everything slips at once.`,
      }
    },
    sells: '13-week-cash-flow-model',
  },
  {
    id: 'hiring-plan-simulator',
    name: 'Hiring Plan & Payroll Simulator',
    category: 'People',
    tagline: 'See what your hiring plan does to payroll and burn.',
    description: 'Model headcount growth over eight quarters. Returns quarterly payroll, fully-loaded run-rate, and how fast your people cost compounds — the biggest line in most budgets.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'headcount', label: 'Current headcount', default: 10 },
      { key: 'salary', label: 'Average salary', default: 120000, prefix: '$' },
      { key: 'benefits', label: 'Benefits & overhead', default: 30, suffix: '%' },
      { key: 'hires', label: 'Hires per quarter', default: 3 },
    ],
    compute: v => {
      const rows: string[][] = []
      let hc = v.headcount, cumulative = 0
      const loaded = v.salary * (1 + v.benefits / 100)
      for (let q = 1; q <= 8; q++) {
        if (q > 1) hc += v.hires
        const quarterly = (hc * loaded) / 4
        cumulative += quarterly
        rows.push([`Q${q}`, `${hc}`, money(quarterly), money(hc * loaded)])
      }
      return {
        metrics: [
          { label: 'Ending headcount', value: `${hc}`, highlight: true },
          { label: 'Annual run-rate', value: money(hc * loaded), highlight: true },
          { label: '2-year payroll', value: money(cumulative) },
        ],
        columns: ['Quarter', 'Headcount', 'Quarterly Payroll', 'Annual Run-Rate'],
        rows,
        note: `This plan takes you to ${hc} people and a ${money(hc * loaded)} annual payroll run-rate. Hire against revenue milestones, not the calendar — payroll is the hardest cost to reverse.`,
      }
    },
    sells: 'hiring-plan-budget-model',
  },
  {
    id: 'loan-amortization-simulator',
    name: 'Loan Amortization Schedule',
    category: 'Finance',
    tagline: 'The full year-by-year breakdown of any loan.',
    description: 'Enter principal, rate, and term to generate a complete amortization schedule — how each year splits between interest and principal, and your falling balance.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'principal', label: 'Loan amount', default: 300000, prefix: '$' },
      { key: 'rate', label: 'Annual interest rate', default: 7, suffix: '%' },
      { key: 'years', label: 'Term (years)', default: 10 },
    ],
    compute: v => {
      const r = v.rate / 1200, n = v.years * 12
      const pmt = r === 0 ? v.principal / n : (v.principal * r) / (1 - Math.pow(1 + r, -n))
      const rows: string[][] = []
      let bal = v.principal, totalInt = 0
      for (let y = 1; y <= v.years; y++) {
        let yearInt = 0, yearPrin = 0
        for (let m = 0; m < 12; m++) {
          const i = bal * r
          const p = pmt - i
          yearInt += i; yearPrin += p; bal -= p; totalInt += i
        }
        rows.push([`Year ${y}`, money(pmt * 12), money(yearInt), money(yearPrin), money(Math.max(0, bal))])
      }
      return {
        metrics: [
          { label: 'Monthly payment', value: money(pmt), highlight: true },
          { label: 'Total interest', value: money(totalInt), highlight: true },
          { label: 'Total repaid', value: money(pmt * n) },
        ],
        columns: ['Year', 'Payments', 'Interest', 'Principal', 'Ending Balance'],
        rows,
        note: `You'll pay ${money(totalInt)} in interest over the life of the loan. Early years are mostly interest — extra principal payments now save far more than the same dollars later.`,
      }
    },
    sells: 'annual-operating-budget-model',
  },
  {
    id: 'tam-sam-som-simulator',
    name: 'TAM / SAM / SOM Market Sizer',
    category: 'Revenue',
    tagline: 'Size your market the way investors expect to see it.',
    description: 'Build a bottoms-up market size from customer counts and spend. Returns your Total, Serviceable, and Obtainable market — the three-layer slide every deck needs.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'customers', label: 'Total potential customers', default: 1000000 },
      { key: 'spend', label: 'Average annual spend', default: 1200, prefix: '$' },
      { key: 'serviceable', label: 'Serviceable share', default: 30, suffix: '%' },
      { key: 'obtainable', label: 'Obtainable share (of serviceable)', default: 10, suffix: '%' },
    ],
    compute: v => {
      const tam = v.customers * v.spend
      const samCust = v.customers * (v.serviceable / 100)
      const sam = samCust * v.spend
      const somCust = samCust * (v.obtainable / 100)
      const som = somCust * v.spend
      return {
        metrics: [
          { label: 'TAM', value: money(tam) },
          { label: 'SAM', value: money(sam) },
          { label: 'SOM (near-term)', value: money(som), highlight: true },
        ],
        columns: ['Layer', 'Customers', 'Annual Value'],
        rows: [
          ['TAM — total market', v.customers.toLocaleString(), money(tam)],
          ['SAM — serviceable', Math.round(samCust).toLocaleString(), money(sam)],
          ['SOM — obtainable', Math.round(somCust).toLocaleString(), money(som)],
        ],
        note: `Your realistic near-term market (SOM) is ${money(som)}. Investors trust bottoms-up sizing like this far more than "1% of a huge TAM" — the SOM is the number that matters.`,
      }
    },
    sells: 'go-to-market-playbook',
  },
  {
    id: 'mrr-waterfall-simulator',
    name: 'MRR Waterfall Simulator',
    category: 'Revenue',
    tagline: 'Project recurring revenue with every moving part.',
    description: 'Model MRR forward with new, expansion, contraction, and churn each month. Returns the full waterfall and where your net new revenue actually comes from.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'startMRR', label: 'Starting MRR', default: 50000, prefix: '$' },
      { key: 'newMRR', label: 'New MRR / month', default: 8000, prefix: '$' },
      { key: 'expansion', label: 'Expansion', default: 2, suffix: '%' },
      { key: 'churn', label: 'Churn', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let mrr = v.startMRR, totalNet = 0
      for (let m = 1; m <= 12; m++) {
        const exp = mrr * (v.expansion / 100)
        const ch = mrr * (v.churn / 100)
        const net = v.newMRR + exp - ch
        mrr += net; totalNet += net
        if (m % 2 === 0) rows.push([`Month ${m}`, money(v.newMRR), money(exp), money(-ch), money(mrr)])
      }
      return {
        metrics: [
          { label: 'Ending MRR', value: money(mrr), highlight: true },
          { label: 'Ending ARR', value: money(mrr * 12), highlight: true },
          { label: 'Avg net new / mo', value: money(totalNet / 12) },
        ],
        columns: ['Month', '+ New', '+ Expansion', '− Churn', 'MRR'],
        rows,
        note: v.expansion >= v.churn ? `Expansion offsets churn — your base is a tailwind, not a leak. That compounds beautifully over a year.` : `Churn outpaces expansion, so new sales are fighting a headwind every month. Fixing retention lifts every future number at once.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'roi-over-time-simulator',
    name: 'Investment ROI-Over-Time Simulator',
    category: 'Finance',
    tagline: 'When does an investment actually pay for itself?',
    description: 'Model an upfront investment against a growing monthly return. Returns cumulative return, the exact payback month, and total ROI over your horizon.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'investment', label: 'Upfront investment', default: 50000, prefix: '$' },
      { key: 'monthlyReturn', label: 'Month 1 return', default: 6000, prefix: '$' },
      { key: 'growth', label: 'Return growth / month', default: 3, suffix: '%' },
      { key: 'months', label: 'Horizon (months)', default: 18 },
    ],
    compute: v => {
      const rows: string[][] = []
      let ret = v.monthlyReturn, cum = 0, payback = 0
      const horizon = Math.min(Math.max(v.months, 1), 60)
      for (let m = 1; m <= horizon; m++) {
        if (m > 1) ret *= 1 + v.growth / 100
        cum += ret
        if (payback === 0 && cum >= v.investment) payback = m
        if (m % 3 === 0 || m === horizon) rows.push([`Month ${m}`, money(ret), money(cum), money(cum - v.investment)])
      }
      const roi = v.investment > 0 ? (cum - v.investment) / v.investment : 0
      return {
        metrics: [
          { label: 'Payback', value: payback ? `Month ${payback}` : 'Not reached', highlight: true },
          { label: 'Total return', value: money(cum) },
          { label: 'ROI', value: pct(roi), highlight: true },
        ],
        columns: ['Month', 'Return', 'Cumulative', 'Net vs. Investment'],
        rows,
        note: payback ? `The investment pays for itself in month ${payback}, ending at a ${pct(roi)} return. Everything after payback is profit — that's the month to watch.` : `It doesn't pay back within the horizon. Extend the timeline or raise the monthly return before committing.`,
      }
    },
    sells: 'annual-operating-budget-model',
  },

  {
    id: 'cohort-ltv-simulator', name: 'Cohort Retention & LTV Simulator', category: 'Revenue',
    tagline: 'Watch one cohort decay — and see its true lifetime value.',
    description: 'Track a single customer cohort month by month as churn erodes it, and see cumulative revenue and lifetime value per customer. The honest way to value a customer.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cohort', label: 'Cohort size', default: 100 },
      { key: 'arpu', label: 'Monthly revenue / customer', default: 50, prefix: '$' },
      { key: 'margin', label: 'Gross margin', default: 80, suffix: '%' },
      { key: 'churn', label: 'Monthly churn', default: 5, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let cum = 0
      let active = v.cohort
      for (let m = 1; m <= 12; m++) {
        active = v.cohort * Math.pow(1 - v.churn / 100, m - 1)
        const rev = active * v.arpu * (v.margin / 100)
        cum += rev
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(active).toString(), money(rev), money(cum)])
      }
      const retained = Math.pow(1 - v.churn / 100, 11)
      return {
        metrics: [
          { label: 'Retained at 12mo', value: pct(retained) },
          { label: 'LTV / customer', value: money(v.cohort > 0 ? cum / v.cohort : 0), highlight: true },
          { label: 'Cohort value (12mo)', value: money(cum), highlight: true },
        ],
        columns: ['Month', 'Active', 'Margin Revenue', 'Cumulative'],
        rows,
        note: `Each customer is worth about ${money(v.cohort > 0 ? cum / v.cohort : 0)} in the first year. Churn is the lever — halving it roughly doubles this without a single new sale.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'sales-pipeline-forecast', name: 'Sales Pipeline Forecast Simulator', category: 'Revenue',
    tagline: 'Turn top-of-funnel into a revenue forecast you can defend.',
    description: 'Enter leads and stage-by-stage conversion rates to see how many deals and how much revenue your pipeline actually produces — and where it leaks.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'leads', label: 'Leads', default: 500 },
      { key: 'mql', label: 'Lead → MQL', default: 40, suffix: '%' },
      { key: 'sql', label: 'MQL → SQL', default: 50, suffix: '%' },
      { key: 'win', label: 'SQL → Won', default: 25, suffix: '%' },
      { key: 'deal', label: 'Average deal size', default: 8000, prefix: '$' },
    ],
    compute: v => {
      const mql = v.leads * (v.mql / 100)
      const sql = mql * (v.sql / 100)
      const won = sql * (v.win / 100)
      const revenue = won * v.deal
      return {
        metrics: [
          { label: 'Deals won', value: won.toFixed(0) },
          { label: 'Revenue', value: money(revenue), highlight: true },
          { label: 'Lead → won', value: pct(v.leads > 0 ? won / v.leads : 0), highlight: true },
        ],
        columns: ['Stage', 'Count', 'Conversion'],
        rows: [
          ['Leads', Math.round(v.leads).toString(), '—'],
          ['MQLs', Math.round(mql).toString(), pct(v.mql / 100)],
          ['SQLs', Math.round(sql).toString(), pct(v.sql / 100)],
          ['Won', won.toFixed(1), pct(v.win / 100)],
        ],
        note: `This pipeline yields about ${money(revenue)}. Find your weakest conversion stage — a 2x there beats a 10% lift everywhere else, and it costs nothing but focus.`,
      }
    },
    sells: 'sales-playbook-template',
  },
  {
    id: 'annual-budget-simulator', name: 'Annual Budget Simulator', category: 'Finance',
    tagline: 'Allocate revenue across departments and see the profit left.',
    description: 'Set departmental spend as a percentage of revenue and instantly see the budget, operating profit, and margin — a board-ready budget in seconds.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Revenue', default: 2000000, prefix: '$' },
      { key: 'payroll', label: 'Payroll %', default: 45, suffix: '%' },
      { key: 'marketing', label: 'Marketing %', default: 15, suffix: '%' },
      { key: 'product', label: 'Product / R&D %', default: 12, suffix: '%' },
      { key: 'gna', label: 'G&A %', default: 10, suffix: '%' },
    ],
    compute: v => {
      const depts = [
        ['Payroll', v.payroll], ['Marketing', v.marketing], ['Product / R&D', v.product], ['G&A', v.gna],
      ] as [string, number][]
      const rows = depts.map(([name, pct2]) => [name, money(v.revenue * (pct2 / 100)), `${pct2}%`])
      const totalPct = depts.reduce((a, [, p]) => a + p, 0)
      const opex = v.revenue * (totalPct / 100)
      const profit = v.revenue - opex
      return {
        metrics: [
          { label: 'Total opex', value: money(opex) },
          { label: 'Operating profit', value: money(profit), highlight: profit < 0 },
          { label: 'Operating margin', value: pct(v.revenue > 0 ? profit / v.revenue : 0), highlight: true },
        ],
        columns: ['Department', 'Budget', '% of Revenue'],
        rows: [...rows, ['Operating profit', money(profit), pct(v.revenue > 0 ? profit / v.revenue : 0)]],
        note: profit < 0 ? `Your allocations spend more than you earn — margin is negative. Something has to come down before this is a real budget.` : `A ${pct(v.revenue > 0 ? profit / v.revenue : 0)} operating margin. Budget from a target profit backward, not spending forward — it forces the hard trade-offs early.`,
      }
    },
    sells: 'annual-operating-budget-model',
  },
  {
    id: 'debt-payoff-schedule', name: 'Debt Payoff Schedule Simulator', category: 'Finance',
    tagline: 'The full year-by-year path out of debt.',
    description: 'Enter a balance, APR, and monthly payment to generate a complete payoff schedule — how each year splits between interest and principal until you hit zero.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'balance', label: 'Balance', default: 25000, prefix: '$' },
      { key: 'apr', label: 'APR', default: 18, suffix: '%' },
      { key: 'payment', label: 'Monthly payment', default: 600, prefix: '$' },
    ],
    compute: v => {
      const r = v.apr / 1200
      const rows: string[][] = []
      let bal = v.balance, totalInt = 0, months = 0
      if (v.payment <= bal * r) {
        return { metrics: [{ label: 'Months to payoff', value: 'Never', highlight: true }, { label: 'Warning', value: 'Payment ≤ interest' }, { label: 'Total interest', value: '∞' }], columns: ['Year', 'Paid', 'Interest', 'Balance'], rows: [['—', '—', '—', money(bal)]], note: `Your payment barely covers interest — the balance never falls. Raise the payment above the monthly interest to make any progress at all.` }
      }
      for (let y = 1; y <= 30 && bal > 0; y++) {
        let yearInt = 0, yearPaid = 0
        for (let m = 0; m < 12 && bal > 0; m++) {
          const i = bal * r
          const principal = Math.min(v.payment - i, bal)
          bal -= principal; yearInt += i; yearPaid += principal + i; totalInt += i; months++
        }
        rows.push([`Year ${y}`, money(yearPaid), money(yearInt), money(Math.max(0, bal))])
      }
      return {
        metrics: [
          { label: 'Months to payoff', value: months.toString(), highlight: true },
          { label: 'Total interest', value: money(totalInt), highlight: true },
          { label: 'Total paid', value: money(v.balance + totalInt) },
        ],
        columns: ['Year', 'Paid', 'Interest', 'Balance'],
        rows,
        note: `You're debt-free in ${months} months, paying ${money(totalInt)} of interest. Adding even $50/month to the payment cuts both the time and the interest sharply.`,
      }
    },
    sells: 'annual-operating-budget-model',
  },
  {
    id: 'retirement-projection-simulator', name: 'Retirement Projection Simulator', category: 'Money',
    tagline: 'Watch your nest egg grow to your retirement year.',
    description: 'Project savings from your current age to retirement with contributions and compounding. See your balance climb — and how much of it is pure growth.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'age', label: 'Current age', default: 35 },
      { key: 'retire', label: 'Retirement age', default: 65 },
      { key: 'savings', label: 'Current savings', default: 50000, prefix: '$' },
      { key: 'monthly', label: 'Monthly contribution', default: 1000, prefix: '$' },
      { key: 'return', label: 'Annual return', default: 7, suffix: '%' },
    ],
    compute: v => {
      const years = Math.max(0, v.retire - v.age)
      const r = v.return / 1200
      const rows: string[][] = []
      let bal = v.savings, contributed = v.savings
      for (let y = 1; y <= years; y++) {
        for (let m = 0; m < 12; m++) { bal = bal * (1 + r) + v.monthly; contributed += v.monthly }
        if (y % 5 === 0 || y === years) rows.push([`Age ${v.age + y}`, money(bal), money(contributed)])
      }
      return {
        metrics: [
          { label: 'Balance at retirement', value: money(bal), highlight: true },
          { label: 'Total contributed', value: money(contributed) },
          { label: 'Growth', value: money(bal - contributed), highlight: true },
        ],
        columns: ['Age', 'Balance', 'Contributed'],
        rows,
        note: `You'd retire with about ${money(bal)} — and ${money(bal - contributed)} of it is compounding, not your own deposits. Starting earlier matters more than saving more.`,
      }
    },
  },
  {
    id: 'marketing-growth-simulator', name: 'Marketing Growth Simulator', category: 'Marketing',
    tagline: 'Turn ad spend into a 12-month customer and revenue curve.',
    description: 'Model spend, CAC, churn, and ARPU forward a year to see your active customers and MRR — and whether your spend actually compounds or just treads water.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'spend', label: 'Monthly spend', default: 20000, prefix: '$' },
      { key: 'cac', label: 'CAC', default: 40, prefix: '$' },
      { key: 'churn', label: 'Monthly churn', default: 4, suffix: '%' },
      { key: 'arpu', label: 'ARPU / month', default: 60, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let active = 0
      const newPer = v.cac > 0 ? v.spend / v.cac : 0
      for (let m = 1; m <= 12; m++) {
        active = active * (1 - v.churn / 100) + newPer
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(newPer).toString(), Math.round(active).toString(), money(active * v.arpu)])
      }
      return {
        metrics: [
          { label: 'Customers (mo 12)', value: Math.round(active).toString(), highlight: true },
          { label: 'MRR (mo 12)', value: money(active * v.arpu), highlight: true },
          { label: 'CAC payback', value: `${(v.arpu > 0 ? v.cac / v.arpu : 0).toFixed(1)} mo` },
        ],
        columns: ['Month', 'New', 'Active', 'MRR'],
        rows,
        note: `Spend builds to about ${money(active * v.arpu)} MRR by month 12. If active customers plateau, churn is eating your spend — fix retention before adding budget.`,
      }
    },
    sells: 'marketing-metrics-dashboard',
  },
  {
    id: 'cash-runway-scenarios', name: 'Cash Runway Scenario Simulator', category: 'Finance',
    tagline: 'Three burn scenarios, side by side.',
    description: 'Enter cash and burn to compare lean, base, and growth spending scenarios — and exactly how many months each one buys you.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cash', label: 'Cash in bank', default: 500000, prefix: '$' },
      { key: 'burn', label: 'Base monthly burn', default: 80000, prefix: '$' },
    ],
    compute: v => {
      const scenarios: [string, number][] = [['Lean (−30%)', v.burn * 0.7], ['Base', v.burn], ['Growth (+40%)', v.burn * 1.4]]
      const rows = scenarios.map(([name, burn]) => [name, money(burn), burn > 0 ? `${(v.cash / burn).toFixed(1)} mo` : '∞'])
      const base = v.burn > 0 ? v.cash / v.burn : 0
      return {
        metrics: [
          { label: 'Lean runway', value: `${(v.cash / (v.burn * 0.7)).toFixed(1)} mo` },
          { label: 'Base runway', value: `${base.toFixed(1)} mo`, highlight: true },
          { label: 'Growth runway', value: `${(v.cash / (v.burn * 1.4)).toFixed(1)} mo` },
        ],
        columns: ['Scenario', 'Monthly Burn', 'Runway'],
        rows,
        note: `Base case gives you about ${base.toFixed(1)} months. Decide which scenario you're in *before* the market does — raise or cut with 9–12 months left, never 3.`,
      }
    },
    sells: 'runway-burn-tracker',
  },
]

export function getProToolById(id: string): ProTool | undefined {
  return PRO_TOOLS.find(t => t.id === id)
}

export const PRO_TOOL_CATEGORIES = Array.from(new Set(PRO_TOOLS.map(t => t.category)))
