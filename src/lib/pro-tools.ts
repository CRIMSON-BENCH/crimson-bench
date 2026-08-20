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

  {
    id: 'gym-growth-simulator', name: 'Gym Membership Growth Simulator', category: 'Fitness',
    tagline: 'Project members and revenue as you add and lose them.',
    description: 'Model 24 months of membership: new joins each month against churn, and watch active members and MRR compound — or stall.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Starting members', default: 200 },
      { key: 'new', label: 'New members / month', default: 30 },
      { key: 'churn', label: 'Monthly churn', default: 4, suffix: '%' },
      { key: 'fee', label: 'Monthly fee', default: 50, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let active = v.start
      for (let m = 1; m <= 24; m++) {
        active = active * (1 - v.churn / 100) + v.new
        if (m % 3 === 0) rows.push([`Month ${m}`, Math.round(active).toString(), money(active * v.fee)])
      }
      return {
        metrics: [
          { label: 'Members (mo 24)', value: Math.round(active).toString(), highlight: true },
          { label: 'MRR (mo 24)', value: money(active * v.fee), highlight: true },
          { label: 'Net growth', value: pct(v.start > 0 ? active / v.start - 1 : 0) },
        ],
        columns: ['Month', 'Members', 'MRR'],
        rows,
        note: `Churn caps your ceiling: members plateau where new joins equal losses. Cutting churn from ${v.churn}% raises both the ceiling and how fast you reach it — retention beats acquisition here.`,
      }
    },
  },
  {
    id: 'restaurant-pnl-simulator', name: 'Restaurant P&L Simulator', category: 'Hospitality',
    tagline: 'Project a year of restaurant profit from prime cost.',
    description: 'Model 12 months of revenue against food, labor, and fixed costs to see monthly profit and full-year margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Month 1 revenue', default: 120000, prefix: '$' },
      { key: 'food', label: 'Food cost %', default: 32, suffix: '%' },
      { key: 'labor', label: 'Labor cost %', default: 30, suffix: '%' },
      { key: 'other', label: 'Other variable %', default: 8, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 15000, prefix: '$' },
      { key: 'growth', label: 'Revenue growth / mo', default: 2, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let rev = v.revenue, yearRev = 0, yearProfit = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) rev *= 1 + v.growth / 100
        const costs = rev * ((v.food + v.labor + v.other) / 100) + v.fixed
        const profit = rev - costs
        yearRev += rev; yearProfit += profit
        if (m % 2 === 0) rows.push([`Month ${m}`, money(rev), money(costs), money(profit)])
      }
      return {
        metrics: [
          { label: 'Year revenue', value: money(yearRev) },
          { label: 'Year profit', value: money(yearProfit), highlight: yearProfit < 0 },
          { label: 'Avg margin', value: pct(yearRev > 0 ? yearProfit / yearRev : 0), highlight: true },
        ],
        columns: ['Month', 'Revenue', 'Costs', 'Profit'],
        rows,
        note: `Prime cost (food + labor = ${v.food + v.labor}%) is the whole game. A couple points off either flows almost entirely to this profit line — restaurants are won in the cost percentages, not the top line.`,
      }
    },
    sells: '13-week-cash-flow-model',
  },
  {
    id: 'rental-property-simulator', name: 'Rental Property 10-Year Simulator', category: 'Real Estate',
    tagline: 'Project a rental’s cash flow as rents rise.',
    description: 'Model ten years of a rental property: rent growth against expenses and mortgage, with annual and cumulative cash flow.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'rent', label: 'Monthly rent', default: 2500, prefix: '$' },
      { key: 'expenses', label: 'Monthly expenses', default: 800, prefix: '$' },
      { key: 'mortgage', label: 'Monthly mortgage', default: 1400, prefix: '$' },
      { key: 'growth', label: 'Annual rent growth', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let rent = v.rent, cum = 0
      for (let y = 1; y <= 10; y++) {
        if (y > 1) rent *= 1 + v.growth / 100
        const annualCash = (rent - v.expenses - v.mortgage) * 12
        cum += annualCash
        rows.push([`Year ${y}`, money(rent), money(annualCash), money(cum)])
      }
      return {
        metrics: [
          { label: 'Year 10 cash flow', value: money((rent - v.expenses - v.mortgage) * 12), highlight: true },
          { label: '10-yr cumulative', value: money(cum), highlight: true },
        ],
        columns: ['Year', 'Monthly Rent', 'Annual Cash Flow', 'Cumulative'],
        rows,
        note: `Cash flow grows as rent outpaces a fixed mortgage — and this ignores loan paydown and appreciation, which stack more return on top. Time is the real estate investor's ally.`,
      }
    },
    sells: 'startup-financial-model-3-statement',
  },
  {
    id: 'agency-growth-simulator', name: 'Agency MRR Growth Simulator', category: 'Agency',
    tagline: 'Project agency MRR as clients come and churn.',
    description: 'Model a year of agency growth: new retainers each month against client churn, to see MRR and ARR build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'startMRR', label: 'Starting MRR', default: 80000, prefix: '$' },
      { key: 'newClients', label: 'New clients / month', default: 2 },
      { key: 'retainer', label: 'Average retainer', default: 6000, prefix: '$' },
      { key: 'churn', label: 'Monthly revenue churn', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let mrr = v.startMRR
      for (let m = 1; m <= 12; m++) {
        mrr = mrr * (1 - v.churn / 100) + v.newClients * v.retainer
        if (m % 2 === 0) rows.push([`Month ${m}`, money(mrr), money(mrr * 12)])
      }
      return {
        metrics: [
          { label: 'MRR (mo 12)', value: money(mrr), highlight: true },
          { label: 'ARR (mo 12)', value: money(mrr * 12), highlight: true },
          { label: 'Growth', value: pct(v.startMRR > 0 ? mrr / v.startMRR - 1 : 0) },
        ],
        columns: ['Month', 'MRR', 'ARR'],
        rows,
        note: `Client churn is the agency's hidden tax — a 3% monthly churn means you replace over a third of revenue a year just to stand still. Retention work compounds faster than new business.`,
      }
    },
  },
  {
    id: 'freelance-income-simulator', name: 'Freelance Income Ramp Simulator', category: 'Freelance',
    tagline: 'Project your income as your client base grows.',
    description: 'Model a year of freelancing: new clients each month against churn, to see your active clients and monthly income build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Starting clients', default: 3 },
      { key: 'new', label: 'New clients / month', default: 1 },
      { key: 'value', label: 'Monthly value / client', default: 2500, prefix: '$' },
      { key: 'churn', label: 'Monthly churn', default: 5, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let active = v.start
      for (let m = 1; m <= 12; m++) {
        active = active * (1 - v.churn / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, active.toFixed(1), money(active * v.value)])
      }
      return {
        metrics: [
          { label: 'Clients (mo 12)', value: active.toFixed(1), highlight: true },
          { label: 'Monthly income (mo 12)', value: money(active * v.value), highlight: true },
          { label: 'Annualized', value: money(active * v.value * 12) },
        ],
        columns: ['Month', 'Clients', 'Monthly Income'],
        rows,
        note: `Even one client a month compounds fast — but churn sets your ceiling. Retainers and great delivery lower churn, which raises the plateau your income climbs to.`,
      }
    },
  },
  {
    id: 'ecommerce-growth-simulator', name: 'E-Commerce Growth Simulator', category: 'E-Commerce',
    tagline: 'Project orders, revenue, and contribution over a year.',
    description: 'Model 12 months of order growth at your AOV and contribution margin to see revenue and cumulative contribution build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'orders', label: 'Month 1 orders', default: 1000 },
      { key: 'growth', label: 'Order growth / month', default: 8, suffix: '%' },
      { key: 'aov', label: 'Average order value', default: 60, prefix: '$' },
      { key: 'cm', label: 'Contribution margin', default: 40, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let orders = v.orders, cumContribution = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) orders *= 1 + v.growth / 100
        const revenue = orders * v.aov
        const contribution = revenue * (v.cm / 100)
        cumContribution += contribution
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(orders).toString(), money(revenue), money(contribution)])
      }
      return {
        metrics: [
          { label: 'Revenue (mo 12)', value: money(orders * v.aov), highlight: true },
          { label: 'Contribution (mo 12)', value: money(orders * v.aov * (v.cm / 100)) },
          { label: '12-mo contribution', value: money(cumContribution), highlight: true },
        ],
        columns: ['Month', 'Orders', 'Revenue', 'Contribution'],
        rows,
        note: `Contribution — not revenue — funds ads and overhead. Growth only compounds if your contribution margin covers rising acquisition cost; watch both lines move together.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'course-funnel-simulator', name: 'Course Funnel Growth Simulator', category: 'Creator',
    tagline: 'Project course revenue as your audience grows.',
    description: 'Model an evergreen course funnel: monthly leads growing over a year, converting at your rate and price, with cumulative revenue.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'leads', label: 'Month 1 leads', default: 500 },
      { key: 'growth', label: 'Lead growth / month', default: 5, suffix: '%' },
      { key: 'conversion', label: 'Conversion rate', default: 2, suffix: '%' },
      { key: 'price', label: 'Course price', default: 297, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let leads = v.leads, cum = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) leads *= 1 + v.growth / 100
        const buyers = leads * (v.conversion / 100)
        const revenue = buyers * v.price
        cum += revenue
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(leads).toString(), buyers.toFixed(1), money(revenue)])
      }
      return {
        metrics: [
          { label: 'Revenue (mo 12)', value: money(leads * (v.conversion / 100) * v.price), highlight: true },
          { label: '12-mo revenue', value: money(cum), highlight: true },
          { label: 'Leads (mo 12)', value: Math.round(leads).toString() },
        ],
        columns: ['Month', 'Leads', 'Buyers', 'Revenue'],
        rows,
        note: `An evergreen funnel turns audience growth into compounding revenue. Doubling conversion (better sales page, testimonials) is usually cheaper than doubling traffic — optimize the funnel first.`,
      }
    },
    sells: 'digital-product-launch-kit',
  },
  {
    id: 'law-firm-revenue-simulator', name: 'Law Firm Revenue Simulator', category: 'Legal',
    tagline: 'Project billings and collections over a year.',
    description: 'Model 12 months of firm billings growing at your rate, net of your collection rate, to see collected revenue build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Month 1 billings', default: 200000, prefix: '$' },
      { key: 'growth', label: 'Growth / month', default: 3, suffix: '%' },
      { key: 'collection', label: 'Collection rate', default: 92, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let rev = v.revenue, cum = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) rev *= 1 + v.growth / 100
        const collected = rev * (v.collection / 100)
        cum += collected
        if (m % 2 === 0) rows.push([`Month ${m}`, money(rev), money(collected)])
      }
      return {
        metrics: [
          { label: 'Collected (mo 12)', value: money(rev * (v.collection / 100)), highlight: true },
          { label: 'Year collected', value: money(cum), highlight: true },
          { label: 'Uncollected / yr', value: money(cum / (v.collection / 100) - cum) },
        ],
        columns: ['Month', 'Billings', 'Collected'],
        rows,
        note: `The gap between billings and collections is pure lost revenue. Lifting collection a few points requires no new clients — it's the cleanest growth a firm can find.`,
      }
    },
  },
  {
    id: 'trucking-pnl-simulator', name: 'Trucking Monthly P&L Simulator', category: 'Logistics',
    tagline: 'Break a trucking operation down to monthly profit.',
    description: 'Enter miles, rate, cost per mile, and truck payment to see a full monthly P&L and profit per mile.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'miles', label: 'Miles / month', default: 10000 },
      { key: 'rate', label: 'Rate per mile', default: 2.5, prefix: '$' },
      { key: 'cost', label: 'Cost per mile', default: 1.6, prefix: '$' },
      { key: 'payment', label: 'Truck payment / month', default: 2500, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.miles * v.rate
      const variable = v.miles * v.cost
      const profit = revenue - variable - v.payment
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: true },
          { label: 'Annual profit', value: money(profit * 12), highlight: true },
          { label: 'Profit / mile', value: `$${(v.miles > 0 ? profit / v.miles : 0).toFixed(2)}` },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Variable (fuel, maintenance)', money(variable)],
          ['Truck payment', money(v.payment)],
          ['Profit', money(profit)],
        ],
        note: `Profit per mile is the number that matters — $${(v.miles > 0 ? profit / v.miles : 0).toFixed(2)} here. Cheap loads and deadhead miles quietly erase it; load selection beats just running more miles.`,
      }
    },
  },
  {
    id: 'advisor-aum-simulator', name: 'Advisor AUM Growth Simulator', category: 'Advisor',
    tagline: 'Project assets and fee revenue over ten years.',
    description: 'Model AUM compounding from market returns and net client flows, and the recurring fee revenue it generates.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'aum', label: 'Starting AUM', default: 50000000, prefix: '$' },
      { key: 'flows', label: 'Net flows / year', default: 5000000, prefix: '$' },
      { key: 'return', label: 'Market return', default: 7, suffix: '%' },
      { key: 'fee', label: 'Advisory fee', default: 1, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let aum = v.aum
      for (let y = 1; y <= 10; y++) {
        aum = aum * (1 + v.return / 100) + v.flows
        if (y % 2 === 0 || y === 10) rows.push([`Year ${y}`, money(aum), money(aum * (v.fee / 100))])
      }
      return {
        metrics: [
          { label: 'Year 10 AUM', value: money(aum), highlight: true },
          { label: 'Year 10 fee revenue', value: money(aum * (v.fee / 100)), highlight: true },
        ],
        columns: ['Year', 'AUM', 'Fee Revenue'],
        rows,
        note: `AUM compounds two ways — markets and net flows — and your fee rides on top. This is why advisory practices are such durable, saleable businesses: the revenue grows even when you're not selling.`,
      }
    },
  },
  {
    id: 'manufacturing-profit-simulator', name: 'Manufacturing Profit Simulator', category: 'Manufacturing',
    tagline: 'Project profit as volume scales against fixed costs.',
    description: 'Model 12 months of production growth to see contribution and profit — and watch operating leverage kick in as volume rises.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'units', label: 'Month 1 units', default: 30000 },
      { key: 'price', label: 'Price per unit', default: 40, prefix: '$' },
      { key: 'variable', label: 'Variable cost / unit', default: 25, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed cost', default: 200000, prefix: '$' },
      { key: 'growth', label: 'Volume growth / month', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let u = v.units, yearProfit = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) u *= 1 + v.growth / 100
        const contribution = (v.price - v.variable) * u
        const profit = contribution - v.fixed
        yearProfit += profit
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(u).toString(), money(contribution), money(profit)])
      }
      return {
        metrics: [
          { label: 'Profit (mo 12)', value: money((v.price - v.variable) * u - v.fixed), highlight: true },
          { label: 'Year profit', value: money(yearProfit), highlight: true },
          { label: 'Units (mo 12)', value: Math.round(u).toString() },
        ],
        columns: ['Month', 'Units', 'Contribution', 'Profit'],
        rows,
        note: `Watch operating leverage: once volume covers the fixed cost, each additional unit's full contribution drops to profit. That's why manufacturers fight so hard for the next increment of volume.`,
      }
    },
    sells: 'annual-operating-budget-model',
  },
]

export function getProToolById(id: string): ProTool | undefined {
  return PRO_TOOLS.find(t => t.id === id)
}

export const PRO_TOOL_CATEGORIES = Array.from(new Set(PRO_TOOLS.map(t => t.category)))
