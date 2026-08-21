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

  {
    id: 'saas-arr-buildout-simulator', name: 'SaaS ARR Buildout Simulator', category: 'SaaS',
    tagline: 'Project ARR from new logos, expansion, and churn.',
    description: 'Model 24 months of ARR: new bookings plus expansion against gross churn, to see recurring revenue compound.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'arr', label: 'Starting ARR', default: 1000000, prefix: '$' },
      { key: 'newARR', label: 'New ARR / month', default: 80000, prefix: '$' },
      { key: 'expansion', label: 'Monthly expansion', default: 1.5, suffix: '%' },
      { key: 'churn', label: 'Monthly gross churn', default: 1, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let arr = v.arr
      for (let m = 1; m <= 24; m++) {
        arr = arr + v.newARR + arr * (v.expansion / 100) - arr * (v.churn / 100)
        if (m % 3 === 0) rows.push([`Month ${m}`, money(arr), money(arr / 12)])
      }
      return {
        metrics: [
          { label: 'ARR (mo 24)', value: money(arr), highlight: true },
          { label: 'MRR (mo 24)', value: money(arr / 12), highlight: true },
          { label: 'Multiple of start', value: `${(v.arr > 0 ? arr / v.arr : 0).toFixed(1)}x` },
        ],
        columns: ['Month', 'ARR', 'MRR'],
        rows,
        note: `Expansion above churn means the base grows itself — new logos then compound on a rising floor. Net revenue retention is the quiet engine of every great SaaS ARR curve.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'healthcare-practice-simulator', name: 'Healthcare Practice Revenue Simulator', category: 'Healthcare',
    tagline: 'Project practice revenue as the patient panel grows.',
    description: 'Model a year of patient-panel growth against attrition to see how monthly revenue builds.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'patients', label: 'Starting patients', default: 3000 },
      { key: 'new', label: 'New patients / month', default: 60 },
      { key: 'attrition', label: 'Monthly attrition', default: 1, suffix: '%' },
      { key: 'annualValue', label: 'Annual value / patient', default: 300, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let p = v.patients
      for (let m = 1; m <= 12; m++) {
        p = p * (1 - v.attrition / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(p).toString(), money(p * v.annualValue / 12)])
      }
      return {
        metrics: [
          { label: 'Patients (mo 12)', value: Math.round(p).toString(), highlight: true },
          { label: 'Monthly revenue', value: money(p * v.annualValue / 12), highlight: true },
          { label: 'Annualized', value: money(p * v.annualValue) },
        ],
        columns: ['Month', 'Patients', 'Monthly Revenue'],
        rows,
        note: `Attrition sets the ceiling — the panel plateaus where new patients equal those lost. Recall systems and access (getting patients seen) lower attrition and lift the plateau.`,
      }
    },
  },
  {
    id: 'dental-production-simulator', name: 'Dental Production Ramp Simulator', category: 'Dental',
    tagline: 'Project production as your patient base grows.',
    description: 'Model a year of patient growth and per-patient production to see monthly production build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'patients', label: 'Active patients', default: 1500 },
      { key: 'new', label: 'New patients / month', default: 40 },
      { key: 'attrition', label: 'Monthly attrition', default: 0.5, suffix: '%' },
      { key: 'prod', label: 'Production / patient / month', default: 75, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let p = v.patients
      for (let m = 1; m <= 12; m++) {
        p = p * (1 - v.attrition / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(p).toString(), money(p * v.prod)])
      }
      return {
        metrics: [
          { label: 'Patients (mo 12)', value: Math.round(p).toString(), highlight: true },
          { label: 'Monthly production', value: money(p * v.prod), highlight: true },
          { label: 'Annualized', value: money(p * v.prod * 12) },
        ],
        columns: ['Month', 'Patients', 'Monthly Production'],
        rows,
        note: `New-patient flow drives the ramp, but production per patient — hygiene recall plus accepted treatment — is what separates a busy practice from a profitable one.`,
      }
    },
  },
  {
    id: 'mortgage-payoff-simulator', name: 'Mortgage Payoff Simulator', category: 'Money',
    tagline: 'See how extra payments crush a mortgage.',
    description: 'Enter your mortgage plus an extra monthly payment to see how many years and how much interest you save.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'balance', label: 'Loan balance', default: 350000, prefix: '$' },
      { key: 'rate', label: 'Interest rate', default: 6.5, suffix: '%' },
      { key: 'payment', label: 'Monthly payment (P&I)', default: 2200, prefix: '$' },
      { key: 'extra', label: 'Extra payment / month', default: 300, prefix: '$' },
    ],
    compute: v => {
      const r = v.rate / 1200
      const pay = v.payment + v.extra
      const rows: string[][] = []
      let bal = v.balance, totalInt = 0, months = 0
      if (pay <= bal * r) {
        return { metrics: [{ label: 'Payoff', value: 'Never', highlight: true }, { label: 'Note', value: 'Payment ≤ interest' }], columns: ['Year', 'Interest', 'Balance'], rows: [['—', '—', money(bal)]], note: `The payment barely covers interest — raise it above the monthly interest to make progress.` }
      }
      for (let y = 1; y <= 40 && bal > 0; y++) {
        let yInt = 0
        for (let m = 0; m < 12 && bal > 0; m++) { const i = bal * r; const p = Math.min(pay - i, bal); bal -= p; yInt += i; totalInt += i; months++ }
        rows.push([`Year ${y}`, money(yInt), money(Math.max(0, bal))])
      }
      return {
        metrics: [
          { label: 'Payoff time', value: `${(months / 12).toFixed(1)} yr`, highlight: true },
          { label: 'Total interest', value: money(totalInt), highlight: true },
          { label: 'Months saved', value: `${Math.max(0, 360 - months)}` },
        ],
        columns: ['Year', 'Interest', 'Balance'],
        rows,
        note: `An extra $${v.extra}/month pays the loan off in about ${(months / 12).toFixed(1)} years. Extra principal early is astonishingly powerful — it skips all the future interest that dollar would have carried.`,
      }
    },
  },
  {
    id: 'savings-goal-simulator', name: 'Savings Goal Simulator', category: 'Money',
    tagline: 'How long until you hit your number.',
    description: 'Enter a goal, current savings, monthly contribution, and return to see how long it takes to get there.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'goal', label: 'Savings goal', default: 100000, prefix: '$' },
      { key: 'current', label: 'Current savings', default: 10000, prefix: '$' },
      { key: 'monthly', label: 'Monthly contribution', default: 800, prefix: '$' },
      { key: 'return', label: 'Annual return', default: 5, suffix: '%' },
    ],
    compute: v => {
      const r = v.return / 1200
      const rows: string[][] = []
      let bal = v.current, months = 0, contributed = v.current
      while (bal < v.goal && months < 600) { bal = bal * (1 + r) + v.monthly; contributed += v.monthly; months++; if (months % 12 === 0) rows.push([`Year ${months / 12}`, money(bal), money(contributed)]) }
      if (bal < v.goal) rows.push(['50 yr', money(bal), money(contributed)])
      return {
        metrics: [
          { label: 'Time to goal', value: bal >= v.goal ? `${(months / 12).toFixed(1)} yr` : '50+ yr', highlight: true },
          { label: 'Total contributed', value: money(contributed) },
          { label: 'Growth earned', value: money(Math.max(0, v.goal - contributed)) },
        ],
        columns: ['Year', 'Balance', 'Contributed'],
        rows,
        note: `You reach the goal in about ${(months / 12).toFixed(1)} years. Raising the monthly contribution shortens this far more than chasing a higher return early on — savings rate beats rate of return until the balance is large.`,
      }
    },
  },
  {
    id: 'subscription-box-simulator', name: 'Subscription Box Growth Simulator', category: 'E-Commerce',
    tagline: 'Project subscribers and revenue against churn.',
    description: 'Model a year of a subscription box: new sign-ups against churn, with MRR and monthly contribution.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Starting subscribers', default: 500 },
      { key: 'new', label: 'New subs / month', default: 80 },
      { key: 'churn', label: 'Monthly churn', default: 8, suffix: '%' },
      { key: 'price', label: 'Box price', default: 40, prefix: '$' },
      { key: 'cogs', label: 'Box COGS', default: 18, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let subs = v.start
      for (let m = 1; m <= 12; m++) {
        subs = subs * (1 - v.churn / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(subs).toString(), money(subs * v.price), money(subs * (v.price - v.cogs))])
      }
      return {
        metrics: [
          { label: 'Subscribers (mo 12)', value: Math.round(subs).toString(), highlight: true },
          { label: 'MRR (mo 12)', value: money(subs * v.price), highlight: true },
          { label: 'Monthly contribution', value: money(subs * (v.price - v.cogs)) },
        ],
        columns: ['Month', 'Subscribers', 'MRR', 'Contribution'],
        rows,
        note: `At 8% churn you replace nearly your whole base each year — subscription boxes live or die on the first three shipments. Onboarding and product delight beat acquisition every time.`,
      }
    },
  },
  {
    id: 'coaching-cohort-simulator', name: 'Coaching Cohort Revenue Simulator', category: 'Creator',
    tagline: 'Project revenue from cohort-based programs.',
    description: 'Model quarterly cohorts at your size and price to project a year of program revenue.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'size', label: 'Cohort size', default: 20 },
      { key: 'price', label: 'Price per seat', default: 2000, prefix: '$' },
      { key: 'cohortsPerQuarter', label: 'Cohorts / quarter', default: 1 },
      { key: 'growth', label: 'Cohort size growth / qtr', default: 10, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let size = v.size, yearRevenue = 0
      for (let q = 1; q <= 4; q++) {
        if (q > 1) size *= 1 + v.growth / 100
        const seats = size * v.cohortsPerQuarter
        const revenue = seats * v.price
        yearRevenue += revenue
        rows.push([`Q${q}`, Math.round(seats).toString(), money(revenue)])
      }
      return {
        metrics: [
          { label: 'Year revenue', value: money(yearRevenue), highlight: true },
          { label: 'Q4 revenue', value: money(size * v.cohortsPerQuarter * v.price), highlight: true },
          { label: 'Per-seat price', value: money(v.price) },
        ],
        columns: ['Quarter', 'Seats', 'Revenue'],
        rows,
        note: `Cohort models create urgency and community that evergreen courses lack — and let you raise price as demand grows. Filling each cohort fuller is the cleanest lever on this revenue.`,
      }
    },
    sells: 'digital-product-launch-kit',
  },
  {
    id: 'brrrr-portfolio-simulator', name: 'BRRRR Portfolio Simulator', category: 'Real Estate',
    tagline: 'Recycle capital into a growing rental portfolio.',
    description: 'Model acquiring properties each year via BRRRR and watch your doors and monthly cash flow compound.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'dealsPerYear', label: 'Deals per year', default: 3 },
      { key: 'cashFlow', label: 'Cash flow / door / month', default: 300, prefix: '$' },
      { key: 'years', label: 'Years', default: 5 },
    ],
    compute: v => {
      const rows: string[][] = []
      let properties = 0
      const yrs = Math.min(Math.max(v.years, 1), 20)
      for (let y = 1; y <= yrs; y++) {
        properties += v.dealsPerYear
        rows.push([`Year ${y}`, properties.toString(), money(properties * v.cashFlow), money(properties * v.cashFlow * 12)])
      }
      return {
        metrics: [
          { label: 'Doors', value: properties.toString(), highlight: true },
          { label: 'Monthly cash flow', value: money(properties * v.cashFlow), highlight: true },
          { label: 'Annual cash flow', value: money(properties * v.cashFlow * 12) },
        ],
        columns: ['Year', 'Doors', 'Monthly Cash Flow', 'Annual'],
        rows,
        note: `BRRRR's magic is recycling the same capital deal after deal — so the portfolio compounds without new savings. The real constraints are deal flow and financing, not cash.`,
      }
    },
  },
  {
    id: 'franchise-expansion-simulator', name: 'Franchise Expansion Simulator', category: 'Franchise',
    tagline: 'Project system revenue as you open units.',
    description: 'Model opening units over several years to see system revenue and owner profit scale.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Starting units', default: 1 },
      { key: 'newPerYear', label: 'New units / year', default: 1 },
      { key: 'revPerUnit', label: 'Revenue per unit', default: 800000, prefix: '$' },
      { key: 'margin', label: 'Unit margin', default: 12, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let units = v.start
      for (let y = 1; y <= 5; y++) {
        if (y > 1) units += v.newPerYear
        const rev = units * v.revPerUnit
        rows.push([`Year ${y}`, units.toString(), money(rev), money(rev * (v.margin / 100))])
      }
      return {
        metrics: [
          { label: 'Units (yr 5)', value: units.toString(), highlight: true },
          { label: 'System revenue', value: money(units * v.revPerUnit), highlight: true },
          { label: 'Owner profit', value: money(units * v.revPerUnit * (v.margin / 100)) },
        ],
        columns: ['Year', 'Units', 'System Revenue', 'Profit'],
        rows,
        note: `Multi-unit ownership spreads management overhead across locations, so later units are often more profitable than the first. The constraint is usually operators and capital, not demand.`,
      }
    },
  },
  {
    id: 'nonprofit-sustainer-simulator', name: 'Nonprofit Sustainer Growth Simulator', category: 'Nonprofit',
    tagline: 'Project recurring donor revenue over a year.',
    description: 'Model monthly-donor growth against churn to see your recurring giving base build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Starting sustainers', default: 300 },
      { key: 'new', label: 'New sustainers / month', default: 40 },
      { key: 'churn', label: 'Monthly churn', default: 2, suffix: '%' },
      { key: 'gift', label: 'Average monthly gift', default: 25, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let s = v.start
      for (let m = 1; m <= 12; m++) {
        s = s * (1 - v.churn / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(s).toString(), money(s * v.gift)])
      }
      return {
        metrics: [
          { label: 'Sustainers (mo 12)', value: Math.round(s).toString(), highlight: true },
          { label: 'Monthly giving', value: money(s * v.gift), highlight: true },
          { label: 'Annual recurring', value: money(s * v.gift * 12) },
        ],
        columns: ['Month', 'Sustainers', 'Monthly Giving'],
        rows,
        note: `Sustainer revenue is the most stable money a nonprofit can build — low churn, low cost, and it funds the mission predictably. Growing this base beats chasing one-time gifts.`,
      }
    },
  },
  {
    id: 'insurance-book-simulator', name: 'Insurance Book Growth Simulator', category: 'Advisor',
    tagline: 'Project your book and recurring commission.',
    description: 'Model premium book growth from new business and retention to see recurring commission build over years.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'premium', label: 'Starting book premium', default: 2000000, prefix: '$' },
      { key: 'newPerYear', label: 'New premium / year', default: 400000, prefix: '$' },
      { key: 'retention', label: 'Retention rate', default: 88, suffix: '%' },
      { key: 'commission', label: 'Commission rate', default: 12, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let premium = v.premium
      for (let y = 1; y <= 5; y++) {
        premium = premium * (v.retention / 100) + v.newPerYear
        rows.push([`Year ${y}`, money(premium), money(premium * (v.commission / 100))])
      }
      return {
        metrics: [
          { label: 'Book (yr 5)', value: money(premium), highlight: true },
          { label: 'Commission (yr 5)', value: money(premium * (v.commission / 100)), highlight: true },
        ],
        columns: ['Year', 'Book Premium', 'Commission'],
        rows,
        note: `Retention compounds a book into an annuity — each renewal pays again for little new effort. It's why a high-retention insurance book sells for a healthy multiple of commission.`,
      }
    },
  },

  {
    id: 'hotel-revenue-simulator', name: 'Hotel Revenue Simulator', category: 'Hospitality',
    tagline: 'Project revenue as occupancy ramps at your ADR.',
    description: 'Model a year of hotel revenue: occupancy climbing toward stabilization at your average daily rate, with monthly revenue and RevPAR.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'rooms', label: 'Rooms', default: 80 },
      { key: 'occ', label: 'Starting occupancy', default: 60, suffix: '%' },
      { key: 'ramp', label: 'Occupancy gain / month (pts)', default: 1.5 },
      { key: 'adr', label: 'Average daily rate', default: 150, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let occ = v.occ
      for (let m = 1; m <= 12; m++) {
        if (m > 1) occ = Math.min(95, occ + v.ramp)
        const revenue = v.rooms * (occ / 100) * v.adr * 30
        if (m % 2 === 0) rows.push([`Month ${m}`, `${occ.toFixed(0)}%`, money(revenue)])
      }
      const revpar = (occ / 100) * v.adr
      return {
        metrics: [
          { label: 'Occupancy (mo 12)', value: `${occ.toFixed(0)}%`, highlight: true },
          { label: 'Monthly revenue', value: money(v.rooms * (occ / 100) * v.adr * 30), highlight: true },
          { label: 'RevPAR', value: money(revpar) },
        ],
        columns: ['Month', 'Occupancy', 'Monthly Revenue'],
        rows,
        note: `RevPAR (rate × occupancy) is the number hotels live by. Pushing ADR on high-demand nights usually beats chasing the last points of occupancy — full rooms at a low rate leave money on the table.`,
      }
    },
  },
  {
    id: 'sales-team-ramp-simulator', name: 'Sales Team Ramp Simulator', category: 'Revenue',
    tagline: 'Project bookings as new reps ramp to quota.',
    description: 'Model a sales team ramping to full productivity to see monthly bookings build toward capacity.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'reps', label: 'Reps', default: 5 },
      { key: 'ramp', label: 'Ramp to full (months)', default: 4 },
      { key: 'quota', label: 'Full monthly quota / rep', default: 50000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let cum = 0
      for (let m = 1; m <= 12; m++) {
        const factor = Math.min(m / v.ramp, 1)
        const bookings = v.reps * v.quota * factor
        cum += bookings
        if (m % 2 === 0) rows.push([`Month ${m}`, `${(factor * 100).toFixed(0)}%`, money(bookings)])
      }
      return {
        metrics: [
          { label: 'Bookings (mo 12)', value: money(v.reps * v.quota), highlight: true },
          { label: 'At-capacity / mo', value: money(v.reps * v.quota), highlight: true },
          { label: '12-mo bookings', value: money(cum) },
        ],
        columns: ['Month', 'Ramp', 'Bookings'],
        rows,
        note: `Ramp time is a real, hidden cost — a rep who takes ${v.ramp} months to full quota carries months of salary before full output. Faster onboarding is worth more than it looks.`,
      }
    },
    sells: 'sales-comp-plan-builder',
  },
  {
    id: 'marketing-payback-simulator', name: 'Marketing Payback Simulator', category: 'Marketing',
    tagline: 'When does your ad spend turn net-positive?',
    description: 'Model monthly spend acquiring customers who pay back over time, and find the month cumulative margin overtakes cumulative spend.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'spend', label: 'Monthly spend', default: 20000, prefix: '$' },
      { key: 'cac', label: 'CAC', default: 40, prefix: '$' },
      { key: 'contribution', label: 'Contribution / customer / mo', default: 30, prefix: '$' },
      { key: 'churn', label: 'Monthly churn', default: 4, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let active = 0, cumSpend = 0, cumMargin = 0, payback = 0
      const newPer = v.cac > 0 ? v.spend / v.cac : 0
      for (let m = 1; m <= 12; m++) {
        active = active * (1 - v.churn / 100) + newPer
        cumSpend += v.spend
        cumMargin += active * v.contribution
        if (payback === 0 && cumMargin >= cumSpend) payback = m
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(active).toString(), money(cumMargin - cumSpend)])
      }
      return {
        metrics: [
          { label: 'Payback month', value: payback ? `Month ${payback}` : '> 12mo', highlight: true },
          { label: 'Active (mo 12)', value: Math.round(active).toString() },
          { label: 'Net (mo 12)', value: money(cumMargin - cumSpend), highlight: true },
        ],
        columns: ['Month', 'Active Customers', 'Cumulative Net'],
        rows,
        note: `Steady spend runs a loss until the customer base is large enough to out-earn it. That trough is the cash you must fund — under-capitalized growth dies in this valley even when the model works.`,
      }
    },
    sells: 'marketing-metrics-dashboard',
  },
  {
    id: 'auto-shop-growth-simulator', name: 'Auto Shop Growth Simulator', category: 'Auto',
    tagline: 'Project revenue as car count grows.',
    description: 'Model a year of repair-order growth at your average RO to see revenue build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'ros', label: 'Repair orders / month', default: 250 },
      { key: 'growth', label: 'Growth / month', default: 3, suffix: '%' },
      { key: 'avgRO', label: 'Average repair order', default: 450, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let ros = v.ros
      for (let m = 1; m <= 12; m++) {
        if (m > 1) ros *= 1 + v.growth / 100
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(ros).toString(), money(ros * v.avgRO)])
      }
      return {
        metrics: [
          { label: 'Revenue (mo 12)', value: money(ros * v.avgRO), highlight: true },
          { label: 'Annualized', value: money(ros * v.avgRO * 12), highlight: true },
          { label: 'ROs (mo 12)', value: Math.round(ros).toString() },
        ],
        columns: ['Month', 'Repair Orders', 'Revenue'],
        rows,
        note: `Average RO — through recommended maintenance and inspections — usually grows revenue faster and cheaper than chasing more cars. Fill the bays you have before adding more.`,
      }
    },
  },
  {
    id: 'construction-backlog-simulator', name: 'Construction Backlog Simulator', category: 'Construction',
    tagline: 'Project recognized revenue from your job pipeline.',
    description: 'Model winning jobs each month and recognizing revenue over the build period to see revenue and backlog.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'newJobs', label: 'New jobs / month', default: 2 },
      { key: 'avgJob', label: 'Average job value', default: 150000, prefix: '$' },
      { key: 'months', label: 'Months to complete', default: 3 },
    ],
    compute: v => {
      const rows: string[][] = []
      let cumRecognized = 0
      for (let m = 1; m <= 12; m++) {
        const active = Math.min(m, v.months) * v.newJobs
        const recognized = active * (v.avgJob / v.months)
        cumRecognized += recognized
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(active).toString(), money(recognized)])
      }
      const totalStartedValue = 12 * v.newJobs * v.avgJob
      return {
        metrics: [
          { label: 'Steady revenue / mo', value: money(v.months * v.newJobs * (v.avgJob / v.months)), highlight: true },
          { label: '12-mo recognized', value: money(cumRecognized), highlight: true },
          { label: 'Backlog value', value: money(Math.max(0, totalStartedValue - cumRecognized)) },
        ],
        columns: ['Month', 'Active Jobs', 'Revenue Recognized'],
        rows,
        note: `Backlog is a contractor's best asset and worst trap — it feels like money but it's cash you haven't collected yet. Watch backlog and cash flow together; growing backlog can still starve you.`,
      }
    },
  },
  {
    id: 'childcare-enrollment-simulator', name: 'Childcare Enrollment Simulator', category: 'Childcare',
    tagline: 'Project tuition revenue as enrollment fills.',
    description: 'Model a year of enrollment growth against attrition to see monthly tuition revenue build toward capacity.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'children', label: 'Starting enrollment', default: 40 },
      { key: 'new', label: 'New / month', default: 6 },
      { key: 'attrition', label: 'Monthly attrition', default: 2, suffix: '%' },
      { key: 'tuition', label: 'Monthly tuition', default: 1200, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let c = v.children
      for (let m = 1; m <= 12; m++) {
        c = c * (1 - v.attrition / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(c).toString(), money(c * v.tuition)])
      }
      return {
        metrics: [
          { label: 'Enrollment (mo 12)', value: Math.round(c).toString(), highlight: true },
          { label: 'Monthly revenue', value: money(c * v.tuition), highlight: true },
          { label: 'Annualized', value: money(c * v.tuition * 12) },
        ],
        columns: ['Month', 'Children', 'Monthly Tuition'],
        rows,
        note: `Because staffing ratios are near-fixed, filling every licensed slot is where the profit is. An empty seat is lost revenue against a cost you're already paying.`,
      }
    },
  },
  {
    id: 'investment-tax-drag-simulator', name: 'Investment Tax Drag Simulator', category: 'Money',
    tagline: 'How much taxes quietly cost your portfolio.',
    description: 'Compare a taxable account to a tax-advantaged one over the years, so you can see the long-run cost of tax drag.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'principal', label: 'Starting balance', default: 100000, prefix: '$' },
      { key: 'return', label: 'Annual return', default: 8, suffix: '%' },
      { key: 'drag', label: 'Annual tax drag', default: 1.5, suffix: '%' },
      { key: 'years', label: 'Years', default: 20 },
    ],
    compute: v => {
      const rows: string[][] = []
      let taxable = v.principal, advantaged = v.principal
      const yrs = Math.min(Math.max(v.years, 1), 50)
      for (let y = 1; y <= yrs; y++) {
        taxable *= 1 + (v.return - v.drag) / 100
        advantaged *= 1 + v.return / 100
        if (y % 5 === 0 || y === yrs) rows.push([`Year ${y}`, money(taxable), money(advantaged)])
      }
      return {
        metrics: [
          { label: 'Taxable (end)', value: money(taxable) },
          { label: 'Tax-advantaged (end)', value: money(advantaged), highlight: true },
          { label: 'Cost of tax drag', value: money(advantaged - taxable), highlight: true },
        ],
        columns: ['Year', 'Taxable Account', 'Tax-Advantaged'],
        rows,
        note: `Tax drag compounds against you the same way returns compound for you — over ${yrs} years it costs about ${money(advantaged - taxable)} here. Maxing tax-advantaged accounts is one of the highest-return "investments" available.`,
      }
    },
  },
  {
    id: 'debt-freedom-simulator', name: 'Debt Freedom Simulator', category: 'Money',
    tagline: 'What an extra payment really buys you.',
    description: 'Compare paying the minimum to adding an extra payment, and see the months and interest you save.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'balance', label: 'Balance', default: 40000, prefix: '$' },
      { key: 'apr', label: 'APR', default: 18, suffix: '%' },
      { key: 'payment', label: 'Monthly payment', default: 1000, prefix: '$' },
      { key: 'extra', label: 'Extra payment', default: 250, prefix: '$' },
    ],
    compute: v => {
      const r = v.apr / 1200
      const payoff = (pay: number) => {
        if (pay <= v.balance * r) return { months: 999, interest: v.balance }
        let b = v.balance, ti = 0, m = 0
        while (b > 0 && m < 600) { const i = b * r; const p = Math.min(pay - i, b); b -= p; ti += i; m++ }
        return { months: m, interest: ti }
      }
      const base = payoff(v.payment)
      const acc = payoff(v.payment + v.extra)
      return {
        metrics: [
          { label: 'Months saved', value: `${Math.max(0, base.months - acc.months)}`, highlight: true },
          { label: 'Interest saved', value: money(base.interest - acc.interest), highlight: true },
          { label: 'Debt-free in', value: acc.months >= 999 ? 'Never' : `${(acc.months / 12).toFixed(1)} yr` },
        ],
        columns: ['Scenario', 'Months to Free', 'Interest'],
        rows: [
          ['Minimum only', base.months >= 999 ? 'Never' : `${base.months}`, money(base.interest)],
          [`With +$${v.extra}/mo`, acc.months >= 999 ? 'Never' : `${acc.months}`, money(acc.interest)],
        ],
        note: `An extra $${v.extra}/month saves about ${money(base.interest - acc.interest)} in interest and years of payments. High-interest debt is a guaranteed return — paying it down beats most investments risk-free.`,
      }
    },
  },
  {
    id: 'veterinary-wellness-simulator', name: 'Vet Wellness Plan Simulator', category: 'Veterinary',
    tagline: 'Project recurring revenue from wellness plans.',
    description: 'Model a year of wellness-plan growth against churn to see recurring revenue build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Starting members', default: 200 },
      { key: 'new', label: 'New members / month', default: 25 },
      { key: 'churn', label: 'Monthly churn', default: 2, suffix: '%' },
      { key: 'fee', label: 'Monthly plan fee', default: 45, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let m2 = v.start
      for (let m = 1; m <= 12; m++) {
        m2 = m2 * (1 - v.churn / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(m2).toString(), money(m2 * v.fee)])
      }
      return {
        metrics: [
          { label: 'Members (mo 12)', value: Math.round(m2).toString(), highlight: true },
          { label: 'MRR (mo 12)', value: money(m2 * v.fee), highlight: true },
          { label: 'Annual recurring', value: money(m2 * v.fee * 12) },
        ],
        columns: ['Month', 'Members', 'MRR'],
        rows,
        note: `Wellness plans turn lumpy vet revenue into a predictable base — and members visit more and stay loyal. It's the closest a clinic gets to SaaS-like recurring revenue.`,
      }
    },
  },
  {
    id: 'consulting-pipeline-simulator', name: 'Consulting Pipeline Simulator', category: 'Freelance',
    tagline: 'Project revenue from leads through wins.',
    description: 'Model a growing lead flow through proposal and win rates to project monthly consulting revenue.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'leads', label: 'Leads / month', default: 30 },
      { key: 'growth', label: 'Lead growth / month', default: 5, suffix: '%' },
      { key: 'proposalRate', label: 'Lead → proposal', default: 40, suffix: '%' },
      { key: 'winRate', label: 'Proposal → win', default: 30, suffix: '%' },
      { key: 'project', label: 'Average project', default: 15000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let leads = v.leads, cum = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) leads *= 1 + v.growth / 100
        const wins = leads * (v.proposalRate / 100) * (v.winRate / 100)
        const revenue = wins * v.project
        cum += revenue
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(leads).toString(), wins.toFixed(1), money(revenue)])
      }
      return {
        metrics: [
          { label: 'Revenue (mo 12)', value: money(leads * (v.proposalRate / 100) * (v.winRate / 100) * v.project), highlight: true },
          { label: '12-mo revenue', value: money(cum), highlight: true },
          { label: 'Leads (mo 12)', value: Math.round(leads).toString() },
        ],
        columns: ['Month', 'Leads', 'Wins', 'Revenue'],
        rows,
        note: `Win rate compounds through the funnel — lifting proposal quality and qualification moves revenue more than raw lead volume. Fix conversion before buying more leads.`,
      }
    },
  },
  {
    id: 'flip-portfolio-simulator', name: 'Fix & Flip Portfolio Simulator', category: 'Real Estate',
    tagline: 'Project profit as you scale flips per year.',
    description: 'Model doing several flips a year with growing per-flip profit to see cumulative profit build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'flips', label: 'Flips per year', default: 4 },
      { key: 'profit', label: 'Profit per flip', default: 35000, prefix: '$' },
      { key: 'growth', label: 'Profit growth / year', default: 5, suffix: '%' },
      { key: 'years', label: 'Years', default: 5 },
    ],
    compute: v => {
      const rows: string[][] = []
      let profit = v.profit, cum = 0
      const yrs = Math.min(Math.max(v.years, 1), 20)
      for (let y = 1; y <= yrs; y++) {
        if (y > 1) profit *= 1 + v.growth / 100
        const yearProfit = v.flips * profit
        cum += yearProfit
        rows.push([`Year ${y}`, v.flips.toString(), money(yearProfit), money(cum)])
      }
      return {
        metrics: [
          { label: 'Year profit (end)', value: money(v.flips * profit), highlight: true },
          { label: 'Cumulative profit', value: money(cum), highlight: true },
          { label: 'Total flips', value: (v.flips * yrs).toString() },
        ],
        columns: ['Year', 'Flips', 'Year Profit', 'Cumulative'],
        rows,
        note: `Flipping is active income, not passive — it stops when you do. Many flippers use the profits to buy rentals, converting one-time gains into a cash-flowing portfolio.`,
      }
    },
  },
  {
    id: 'service-plan-simulator', name: 'Home Service Plan Simulator', category: 'Home Services',
    tagline: 'Project recurring revenue from maintenance plans.',
    description: 'Model a year of service-plan membership growth against churn to see recurring revenue build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Starting plans', default: 200 },
      { key: 'new', label: 'New plans / month', default: 30 },
      { key: 'churn', label: 'Monthly churn', default: 3, suffix: '%' },
      { key: 'fee', label: 'Monthly plan fee', default: 20, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let p = v.start
      for (let m = 1; m <= 12; m++) {
        p = p * (1 - v.churn / 100) + v.new
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(p).toString(), money(p * v.fee)])
      }
      return {
        metrics: [
          { label: 'Plans (mo 12)', value: Math.round(p).toString(), highlight: true },
          { label: 'MRR (mo 12)', value: money(p * v.fee), highlight: true },
          { label: 'Annual recurring', value: money(p * v.fee * 12) },
        ],
        columns: ['Month', 'Plans', 'MRR'],
        rows,
        note: `Maintenance plans transform a home-service business — recurring revenue, guaranteed repeat visits, and first crack at every repair. They also make the business far more valuable to a buyer.`,
      }
    },
  },

  {
    id: 'lbo-returns-simulator', name: 'LBO Returns Simulator', category: 'Fundraising',
    tagline: 'Model private-equity returns — MOIC and IRR.',
    description: 'Enter entry EBITDA, multiple, leverage, growth, and exit multiple to project the equity return, MOIC, and IRR of a leveraged buyout.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'ebitda', label: 'Entry EBITDA', default: 5000000, prefix: '$' },
      { key: 'entryMult', label: 'Entry multiple', default: 8 },
      { key: 'debtPct', label: 'Debt %', default: 60, suffix: '%' },
      { key: 'growth', label: 'EBITDA growth / yr', default: 8, suffix: '%' },
      { key: 'exitMult', label: 'Exit multiple', default: 9 },
      { key: 'years', label: 'Hold (years)', default: 5 },
    ],
    compute: v => {
      const entryEV = v.ebitda * v.entryMult
      const debt = entryEV * (v.debtPct / 100)
      const equityIn = entryEV - debt
      const rows: string[][] = []
      let ebitda = v.ebitda
      const yrs = Math.min(Math.max(v.years, 1), 15)
      for (let y = 1; y <= yrs; y++) {
        ebitda *= 1 + v.growth / 100
        const ev = ebitda * v.exitMult
        rows.push([`Year ${y}`, money(ebitda), money(ev), money(ev - debt)])
      }
      const exitEV = ebitda * v.exitMult
      const equityOut = exitEV - debt
      const moic = equityIn > 0 ? equityOut / equityIn : 0
      const irr = moic > 0 ? Math.pow(moic, 1 / yrs) - 1 : 0
      return {
        metrics: [
          { label: 'Equity out', value: money(equityOut), highlight: true },
          { label: 'MOIC', value: `${moic.toFixed(1)}x`, highlight: true },
          { label: 'IRR', value: pct(irr), highlight: true },
        ],
        columns: ['Year', 'EBITDA', 'Exit EV', 'Equity Value'],
        rows,
        note: `Leverage magnifies returns: with ${v.debtPct}% debt, a ${moic.toFixed(1)}x equity return (${pct(irr)} IRR). Debt paydown and multiple expansion both add to this — and both cut the other way if things go wrong.`,
      }
    },
    sells: 'cap-table-model',
  },
  {
    id: 'retirement-drawdown-simulator', name: 'Retirement Drawdown Simulator', category: 'Money',
    tagline: 'Will your nest egg last?',
    description: 'Model spending down a portfolio with inflation-adjusted withdrawals to see how many years it lasts.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'nestEgg', label: 'Nest egg', default: 1000000, prefix: '$' },
      { key: 'withdrawal', label: 'Annual withdrawal', default: 45000, prefix: '$' },
      { key: 'return', label: 'Annual return', default: 5, suffix: '%' },
      { key: 'inflation', label: 'Inflation', default: 2.5, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let bal = v.nestEgg, w = v.withdrawal, year = 0
      while (bal > 0 && year < 50) {
        year++
        bal = bal * (1 + v.return / 100) - w
        w *= 1 + v.inflation / 100
        if (year % 5 === 0 || bal <= 0) rows.push([`Year ${year}`, money(w), money(Math.max(0, bal))])
      }
      const lasts = bal > 0
      return {
        metrics: [
          { label: 'Portfolio lasts', value: lasts ? '50+ years' : `${year} years`, highlight: true },
          { label: 'Withdrawal rate', value: pct(v.nestEgg > 0 ? v.withdrawal / v.nestEgg : 0) },
          { label: 'Status', value: lasts ? 'Sustainable' : 'Runs out', highlight: !lasts },
        ],
        columns: ['Year', 'Withdrawal', 'Balance'],
        rows,
        note: lasts ? `At this rate the portfolio outlasts a long retirement. A withdrawal rate near 4% is the classic rule of thumb for lasting 30+ years.` : `The money runs out in about ${year} years. Lower the withdrawal, delay a bit, or grow the nest egg — small changes early buy many years later.`,
      }
    },
  },
  {
    id: 'retail-store-pnl-simulator', name: 'Retail Store P&L Simulator', category: 'Retail',
    tagline: 'Project a retail store’s monthly profit.',
    description: 'Model a year of retail sales against COGS, labor, and fixed costs to see monthly profit and margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'sales', label: 'Month 1 sales', default: 80000, prefix: '$' },
      { key: 'cogs', label: 'COGS %', default: 55, suffix: '%' },
      { key: 'labor', label: 'Labor %', default: 15, suffix: '%' },
      { key: 'rent', label: 'Rent + fixed / mo', default: 13000, prefix: '$' },
      { key: 'growth', label: 'Sales growth / mo', default: 2, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let sales = v.sales, yearSales = 0, yearProfit = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) sales *= 1 + v.growth / 100
        const profit = sales * (1 - (v.cogs + v.labor) / 100) - v.rent
        yearSales += sales; yearProfit += profit
        if (m % 2 === 0) rows.push([`Month ${m}`, money(sales), money(profit)])
      }
      return {
        metrics: [
          { label: 'Year sales', value: money(yearSales) },
          { label: 'Year profit', value: money(yearProfit), highlight: yearProfit < 0 },
          { label: 'Avg margin', value: pct(yearSales > 0 ? yearProfit / yearSales : 0), highlight: true },
        ],
        columns: ['Month', 'Sales', 'Profit'],
        rows,
        note: `Retail lives on thin margins and fixed rent — a couple points of COGS or a slow month swings the whole result. Sales per square foot and inventory turns are the levers that matter most.`,
      }
    },
  },
  {
    id: 'fleet-expansion-simulator', name: 'Fleet Expansion Simulator', category: 'Logistics',
    tagline: 'Project revenue and profit as you add trucks.',
    description: 'Model adding trucks over several years to see how revenue and profit scale with the fleet.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'trucks', label: 'Starting trucks', default: 3 },
      { key: 'add', label: 'Trucks added / year', default: 2 },
      { key: 'revPerTruck', label: 'Revenue / truck / yr', default: 220000, prefix: '$' },
      { key: 'costPerTruck', label: 'Cost / truck / yr', default: 160000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let trucks = v.trucks
      for (let y = 1; y <= 5; y++) {
        if (y > 1) trucks += v.add
        const revenue = trucks * v.revPerTruck
        const profit = trucks * (v.revPerTruck - v.costPerTruck)
        rows.push([`Year ${y}`, trucks.toString(), money(revenue), money(profit)])
      }
      return {
        metrics: [
          { label: 'Trucks (yr 5)', value: trucks.toString(), highlight: true },
          { label: 'Revenue (yr 5)', value: money(trucks * v.revPerTruck), highlight: true },
          { label: 'Profit (yr 5)', value: money(trucks * (v.revPerTruck - v.costPerTruck)) },
        ],
        columns: ['Year', 'Trucks', 'Revenue', 'Profit'],
        rows,
        note: `Each truck is a mini-business — but expansion adds dispatch, maintenance, and driver-management overhead that per-truck math hides. Grow only as fast as you can keep trucks loaded and drivers seated.`,
      }
    },
  },
  {
    id: 'ad-saturation-simulator', name: 'Ad Spend Saturation Simulator', category: 'Marketing',
    tagline: 'See CAC rise as you scale ad spend.',
    description: 'Model how customer acquisition cost climbs as you push budget higher — the diminishing returns every marketer eventually hits.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'baseSpend', label: 'Starting monthly budget', default: 10000, prefix: '$' },
      { key: 'increment', label: 'Budget step', default: 10000, prefix: '$' },
      { key: 'baseCAC', label: 'CAC at starting budget', default: 30, prefix: '$' },
      { key: 'cacRise', label: 'CAC rise per step', default: 15, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let topCustomers = 0, topCAC = 0, topSpend = 0
      for (let step = 0; step < 6; step++) {
        const spend = v.baseSpend + step * v.increment
        const cac = v.baseCAC * Math.pow(1 + v.cacRise / 100, step)
        const customers = cac > 0 ? spend / cac : 0
        rows.push([money(spend), money(cac), Math.round(customers).toString()])
        topCustomers = customers; topCAC = cac; topSpend = spend
      }
      return {
        metrics: [
          { label: 'CAC at top budget', value: money(topCAC), highlight: true },
          { label: 'Customers at top', value: Math.round(topCustomers).toString() },
          { label: 'Top budget', value: money(topSpend) },
        ],
        columns: ['Monthly Budget', 'CAC', 'Customers'],
        rows,
        note: `Every channel saturates — CAC climbs as you exhaust the cheap audience. The art is scaling until CAC approaches your max allowable, then opening a new channel rather than overpaying the old one.`,
      }
    },
    sells: 'marketing-metrics-dashboard',
  },
  {
    id: 'inventory-cash-gap-simulator', name: 'Inventory Cash Gap Simulator', category: 'E-Commerce',
    tagline: 'Why profitable growth can still run you out of cash.',
    description: 'Model how scaling sales ties up more cash in inventory — the trap that sinks fast-growing product businesses.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Month 1 revenue', default: 100000, prefix: '$' },
      { key: 'growth', label: 'Growth / month', default: 8, suffix: '%' },
      { key: 'cogs', label: 'COGS %', default: 60, suffix: '%' },
      { key: 'days', label: 'Inventory days', default: 60 },
    ],
    compute: v => {
      const rows: string[][] = []
      let revenue = v.revenue, prevInv = 0, cumCash = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) revenue *= 1 + v.growth / 100
        const invValue = revenue * (v.cogs / 100) * (v.days / 30)
        const cashOut = invValue - prevInv
        cumCash += cashOut
        prevInv = invValue
        if (m % 2 === 0) rows.push([`Month ${m}`, money(revenue), money(invValue), money(cumCash)])
      }
      return {
        metrics: [
          { label: 'Inventory (mo 12)', value: money(prevInv), highlight: true },
          { label: 'Cash absorbed by growth', value: money(cumCash), highlight: true },
          { label: 'Revenue (mo 12)', value: money(revenue) },
        ],
        columns: ['Month', 'Revenue', 'Inventory Value', 'Cumulative Cash'],
        rows,
        note: `Growth eats cash: every new sale needs inventory bought before payment arrives. Profitable companies go bankrupt in exactly this gap — fund growth deliberately, with financing or supplier terms.`,
      }
    },
  },
  {
    id: 'franchise-vs-independent-simulator', name: 'Franchise vs. Independent Simulator', category: 'Franchise',
    tagline: 'Do the royalties pay for the brand?',
    description: 'Compare running a franchise (fees, but a brand lift) to going independent, over five years of profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Independent annual revenue', default: 800000, prefix: '$' },
      { key: 'brandLift', label: 'Franchise revenue lift', default: 20, suffix: '%' },
      { key: 'royalty', label: 'Royalty', default: 6, suffix: '%' },
      { key: 'marketing', label: 'Marketing fund', default: 2, suffix: '%' },
      { key: 'margin', label: 'Operating margin', default: 15, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      const franchiseRev = v.revenue * (1 + v.brandLift / 100)
      const indProfit = v.revenue * (v.margin / 100)
      const franProfit = franchiseRev * (v.margin / 100) - franchiseRev * ((v.royalty + v.marketing) / 100)
      let indCum = 0, franCum = 0
      for (let y = 1; y <= 5; y++) {
        indCum += indProfit; franCum += franProfit
        rows.push([`Year ${y}`, money(indCum), money(franCum)])
      }
      return {
        metrics: [
          { label: 'Independent (5yr)', value: money(indCum) },
          { label: 'Franchise (5yr)', value: money(franCum), highlight: true },
          { label: 'Franchise edge', value: money(franCum - indCum), highlight: true },
        ],
        columns: ['Year', 'Independent (cum)', 'Franchise (cum)'],
        rows,
        note: franCum > indCum ? `The brand lift outweighs the fees here by about ${money(franCum - indCum)} over five years. Franchises pay off when the brand genuinely drives more revenue than the royalties cost.` : `Independent wins — the fees exceed the brand's lift at these numbers. The franchise only pays if it drives materially more traffic than you could alone.`,
      }
    },
  },
  {
    id: 'refi-cashout-simulator', name: 'Cash-Out Refinance Simulator', category: 'Real Estate',
    tagline: 'How much equity you can pull as value grows.',
    description: 'Model a property appreciating over the years and see the cash you could pull via a cash-out refinance at your target LTV.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'value', label: 'Current value', default: 400000, prefix: '$' },
      { key: 'appreciation', label: 'Annual appreciation', default: 4, suffix: '%' },
      { key: 'loan', label: 'Current loan balance', default: 300000, prefix: '$' },
      { key: 'ltv', label: 'Refinance LTV', default: 75, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let value = v.value
      for (let y = 1; y <= 5; y++) {
        value *= 1 + v.appreciation / 100
        const maxLoan = value * (v.ltv / 100)
        const cashOut = Math.max(0, maxLoan - v.loan)
        rows.push([`Year ${y}`, money(value), money(maxLoan), money(cashOut)])
      }
      const maxLoanFinal = value * (v.ltv / 100)
      return {
        metrics: [
          { label: 'Value (yr 5)', value: money(value), highlight: true },
          { label: 'Cash-out available', value: money(Math.max(0, maxLoanFinal - v.loan)), highlight: true },
        ],
        columns: ['Year', 'Value', 'Max Loan', 'Cash-Out'],
        rows,
        note: `Appreciation lets you pull tax-free cash via refinance to buy the next property — the engine of leveraged real-estate growth. Just remember the new loan raises your payment and lowers cash flow.`,
      }
    },
  },
  {
    id: 'practice-associate-simulator', name: 'Add-an-Associate Simulator', category: 'Healthcare',
    tagline: 'Does adding a provider actually add profit?',
    description: 'Model adding provider capacity over several years to see how revenue and profit scale in a practice.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'providers', label: 'Current providers', default: 2 },
      { key: 'add', label: 'Added / year', default: 1 },
      { key: 'revPer', label: 'Revenue / provider / yr', default: 500000, prefix: '$' },
      { key: 'costPct', label: 'Provider comp %', default: 40, suffix: '%' },
      { key: 'overheadPer', label: 'Added overhead / provider', default: 100000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let providers = v.providers
      for (let y = 1; y <= 5; y++) {
        if (y > 1) providers += v.add
        const revenue = providers * v.revPer
        const profit = revenue * (1 - v.costPct / 100) - providers * v.overheadPer
        rows.push([`Year ${y}`, providers.toString(), money(revenue), money(profit)])
      }
      return {
        metrics: [
          { label: 'Providers (yr 5)', value: providers.toString(), highlight: true },
          { label: 'Revenue (yr 5)', value: money(providers * v.revPer), highlight: true },
          { label: 'Profit (yr 5)', value: money(providers * v.revPer * (1 - v.costPct / 100) - providers * v.overheadPer) },
        ],
        columns: ['Year', 'Providers', 'Revenue', 'Profit'],
        rows,
        note: `Associates add profit only if they stay busy — an underutilized provider is pure cost. Have the patient demand (or referral flow) lined up before you add capacity.`,
      }
    },
  },
  {
    id: 'tam-penetration-simulator', name: 'Market Penetration Simulator', category: 'Revenue',
    tagline: 'Project revenue as you capture more of the market.',
    description: 'Model growing your share of a market over several years to see revenue scale with penetration.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'market', label: 'Total market customers', default: 500000 },
      { key: 'spend', label: 'Average annual spend', default: 1200, prefix: '$' },
      { key: 'start', label: 'Starting penetration', default: 0.5, suffix: '%' },
      { key: 'gain', label: 'Penetration gain / yr (pts)', default: 0.3 },
    ],
    compute: v => {
      const rows: string[][] = []
      for (let y = 1; y <= 5; y++) {
        const pen = v.start + (y - 1) * v.gain
        const customers = v.market * (pen / 100)
        const revenue = customers * v.spend
        rows.push([`Year ${y}`, `${pen.toFixed(2)}%`, Math.round(customers).toLocaleString(), money(revenue)])
      }
      const penFinal = v.start + 4 * v.gain
      return {
        metrics: [
          { label: 'Penetration (yr 5)', value: `${penFinal.toFixed(2)}%`, highlight: true },
          { label: 'Revenue (yr 5)', value: money(v.market * (penFinal / 100) * v.spend), highlight: true },
          { label: 'Customers (yr 5)', value: Math.round(v.market * (penFinal / 100)).toLocaleString() },
        ],
        columns: ['Year', 'Penetration', 'Customers', 'Revenue'],
        rows,
        note: `Even low single-digit penetration of a big market is a large business — which is why investors love a huge TAM. But penetration gets harder as you go; early adopters are far easier than the mainstream.`,
      }
    },
  },
  {
    id: 'saas-tier-migration-simulator', name: 'SaaS Tier Migration Simulator', category: 'SaaS',
    tagline: 'Project ARPU as users upgrade tiers.',
    description: 'Model users migrating from a basic to a pro tier over a year to see MRR and ARPU climb.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'users', label: 'Total users', default: 5000 },
      { key: 'basic', label: 'Basic price', default: 20, prefix: '$' },
      { key: 'pro', label: 'Pro price', default: 50, prefix: '$' },
      { key: 'startProPct', label: 'Starting pro %', default: 20, suffix: '%' },
      { key: 'upgradeRate', label: 'Monthly upgrade rate', default: 2, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let proUsers = v.users * (v.startProPct / 100)
      let basicUsers = v.users - proUsers
      for (let m = 1; m <= 12; m++) {
        const migrate = basicUsers * (v.upgradeRate / 100)
        basicUsers -= migrate; proUsers += migrate
        const mrr = basicUsers * v.basic + proUsers * v.pro
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(proUsers).toString(), money(mrr)])
      }
      const mrrFinal = basicUsers * v.basic + proUsers * v.pro
      return {
        metrics: [
          { label: 'MRR (mo 12)', value: money(mrrFinal), highlight: true },
          { label: 'ARPU (mo 12)', value: money(v.users > 0 ? mrrFinal / v.users : 0), highlight: true },
          { label: 'Pro share', value: pct(v.users > 0 ? proUsers / v.users : 0) },
        ],
        columns: ['Month', 'Pro Users', 'MRR'],
        rows,
        note: `Migrating existing users up a tier is the cheapest revenue in SaaS — no new acquisition required. Feature gating and usage nudges that pull basic users to pro compound your ARPU month after month.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'event-business-simulator', name: 'Event Business Growth Simulator', category: 'Hospitality',
    tagline: 'Project profit as you book more events.',
    description: 'Model a growing volume of events at your average revenue and cost to see monthly profit build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'events', label: 'Events / month', default: 4 },
      { key: 'revenue', label: 'Revenue / event', default: 8000, prefix: '$' },
      { key: 'cost', label: 'Cost / event', default: 4500, prefix: '$' },
      { key: 'growth', label: 'Event growth / month', default: 5, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let events = v.events
      for (let m = 1; m <= 12; m++) {
        if (m > 1) events *= 1 + v.growth / 100
        const profit = events * (v.revenue - v.cost)
        if (m % 2 === 0) rows.push([`Month ${m}`, events.toFixed(1), money(events * v.revenue), money(profit)])
      }
      return {
        metrics: [
          { label: 'Events (mo 12)', value: events.toFixed(1), highlight: true },
          { label: 'Profit (mo 12)', value: money(events * (v.revenue - v.cost)), highlight: true },
          { label: 'Annualized profit', value: money(events * (v.revenue - v.cost) * 12) },
        ],
        columns: ['Month', 'Events', 'Revenue', 'Profit'],
        rows,
        note: `Events are capacity-constrained — there are only so many weekends. Once you're full, raising price per event beats trying to cram in more; premium positioning is how event businesses scale profit.`,
      }
    },
  },

  {
    id: 'breakeven-ramp-simulator', name: 'Break-Even Ramp Simulator', category: 'Finance',
    tagline: 'Chart the path from launch to your first profitable month.',
    description: 'Model revenue ramping against fixed and variable costs to find the month you turn profitable and the cash you burn getting there.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revenue', label: 'Month 1 revenue', default: 20000, prefix: '$' },
      { key: 'growth', label: 'Growth / month', default: 15, suffix: '%' },
      { key: 'variable', label: 'Variable cost %', default: 40, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed cost', default: 30000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let rev = v.revenue, cum = 0, be = 0, trough = 0
      for (let m = 1; m <= 18; m++) {
        if (m > 1) rev *= 1 + v.growth / 100
        const profit = rev * (1 - v.variable / 100) - v.fixed
        cum += profit
        if (cum < trough) trough = cum
        if (be === 0 && profit >= 0) be = m
        if (m % 3 === 0) rows.push([`Month ${m}`, money(rev), money(profit)])
      }
      return {
        metrics: [
          { label: 'Break-even month', value: be ? `Month ${be}` : '> 18mo', highlight: true },
          { label: 'Max cash burned', value: money(-trough), highlight: true },
          { label: 'Profit (mo 18)', value: money(rev * (1 - v.variable / 100) - v.fixed) },
        ],
        columns: ['Month', 'Revenue', 'Monthly Profit'],
        rows,
        note: `The deepest cumulative loss — about ${money(-trough)} — is the capital you must have to reach profitability. Most startups die in this trough, not from a bad model but from running out before month ${be || 18}.`,
      }
    },
  },
  {
    id: 'capital-efficiency-simulator', name: 'Capital Efficiency Simulator', category: 'SaaS',
    tagline: 'How many dollars you burn per dollar of ARR.',
    description: 'Model monthly burn against net new ARR to track your burn multiple as you scale — the number investors use to judge efficiency.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'burn', label: 'Monthly net burn', default: 150000, prefix: '$' },
      { key: 'newARR', label: 'Net new ARR / month', default: 60000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let cumBurn = 0, arr = 0
      for (let m = 1; m <= 18; m++) {
        cumBurn += v.burn; arr += v.newARR
        if (m % 3 === 0) rows.push([`Month ${m}`, money(arr), money(cumBurn), `${(arr > 0 ? cumBurn / arr : 0).toFixed(2)}x`])
      }
      return {
        metrics: [
          { label: 'ARR added', value: money(arr), highlight: true },
          { label: 'Total burned', value: money(cumBurn) },
          { label: 'Burn multiple', value: `${(arr > 0 ? cumBurn / arr : 0).toFixed(2)}x`, highlight: true },
        ],
        columns: ['Month', 'ARR Added', 'Cumulative Burn', 'Burn Multiple'],
        rows,
        note: `Under 1x burn multiple is elite; over 2x, investors get nervous. This single number tells them whether your growth is efficient or just expensive — and it sets your valuation as much as growth does.`,
      }
    },
    sells: 'runway-burn-tracker',
  },
  {
    id: 'support-cost-simulator', name: 'Support Cost Scaling Simulator', category: 'SaaS',
    tagline: 'How your support cost grows with the customer base.',
    description: 'Model customers growing and generating tickets to see support cost scale — and why self-serve matters as you grow.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'customers', label: 'Starting customers', default: 2000 },
      { key: 'growth', label: 'Growth / month', default: 8, suffix: '%' },
      { key: 'tickets', label: 'Tickets / customer / mo', default: 0.4 },
      { key: 'cost', label: 'Cost per ticket', default: 12, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let c = v.customers
      for (let m = 1; m <= 12; m++) {
        if (m > 1) c *= 1 + v.growth / 100
        const t = c * v.tickets
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(c).toString(), Math.round(t).toString(), money(t * v.cost)])
      }
      return {
        metrics: [
          { label: 'Support cost (mo 12)', value: money(c * v.tickets * v.cost), highlight: true },
          { label: 'Annualized', value: money(c * v.tickets * v.cost * 12), highlight: true },
          { label: 'Cost / customer', value: money(v.tickets * v.cost) },
        ],
        columns: ['Month', 'Customers', 'Tickets', 'Support Cost'],
        rows,
        note: `Support cost scales with customers unless you break the link. Docs, in-app help, and self-serve lower tickets-per-customer — the only way support doesn't eat your gross margin at scale.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'content-compounding-simulator', name: 'Content Compounding Simulator', category: 'Marketing',
    tagline: 'Watch a content library compound into traffic.',
    description: 'Model publishing consistently as each piece keeps drawing traffic — the compounding engine that makes content marketing pay off.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'posts', label: 'Posts / month', default: 8 },
      { key: 'trafficPer', label: 'Monthly traffic / post', default: 300 },
      { key: 'conversion', label: 'Visitor → lead', default: 2, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let total = 0
      for (let m = 1; m <= 12; m++) {
        total += v.posts
        const traffic = total * v.trafficPer
        const leads = traffic * (v.conversion / 100)
        if (m % 2 === 0) rows.push([`Month ${m}`, total.toString(), Math.round(traffic).toLocaleString(), Math.round(leads).toString()])
      }
      const trafficFinal = total * v.trafficPer
      return {
        metrics: [
          { label: 'Monthly traffic (mo 12)', value: Math.round(trafficFinal).toLocaleString(), highlight: true },
          { label: 'Monthly leads (mo 12)', value: Math.round(trafficFinal * (v.conversion / 100)).toString(), highlight: true },
          { label: 'Total posts', value: total.toString() },
        ],
        columns: ['Month', 'Posts', 'Monthly Traffic', 'Leads'],
        rows,
        note: `Unlike ads, content compounds — every piece keeps working, so traffic accelerates even at a steady publishing pace. It's slow for months, then suddenly the library carries you.`,
      }
    },
    sells: 'content-strategy-calendar',
  },
  {
    id: 'viral-loop-simulator', name: 'Viral Loop (K-Factor) Simulator', category: 'Revenue',
    tagline: 'Does your product grow itself?',
    description: 'Model invites and their conversion to compute your viral coefficient (k) and watch users grow — or fade — cycle by cycle.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'users', label: 'Starting users', default: 1000 },
      { key: 'invites', label: 'Invites per user', default: 3 },
      { key: 'conversion', label: 'Invite conversion', default: 20, suffix: '%' },
    ],
    compute: v => {
      const k = v.invites * (v.conversion / 100)
      const rows: string[][] = []
      let users = v.users, newLast = v.users
      for (let c = 1; c <= 8; c++) {
        const newThis = newLast * k
        users += newThis
        newLast = newThis
        rows.push([`Cycle ${c}`, Math.round(newThis).toLocaleString(), Math.round(users).toLocaleString()])
      }
      return {
        metrics: [
          { label: 'K-factor', value: k.toFixed(2), highlight: true },
          { label: 'Users (cycle 8)', value: Math.round(users).toLocaleString(), highlight: true },
          { label: 'Status', value: k >= 1 ? 'Viral' : 'Fades', highlight: k < 1 },
        ],
        columns: ['Cycle', 'New Users', 'Total Users'],
        rows,
        note: k >= 1 ? `A k-factor of ${k.toFixed(2)} means each cohort more than replaces itself — true viral growth. Rare and precious; protect whatever drives it.` : `A k-factor of ${k.toFixed(2)} — under 1, so virality tapers and each push fades. It still lowers CAC by amplifying paid acquisition; getting k even close to 1 is a huge tailwind.`,
      }
    },
  },
  {
    id: 'newsletter-sponsorship-simulator', name: 'Newsletter Sponsorship Simulator', category: 'Creator',
    tagline: 'Project ad revenue as your list grows.',
    description: 'Model subscriber growth and sponsorship CPM to project monthly newsletter ad revenue.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'subscribers', label: 'Subscribers', default: 10000 },
      { key: 'growth', label: 'Growth / month', default: 8, suffix: '%' },
      { key: 'openRate', label: 'Open rate', default: 40, suffix: '%' },
      { key: 'cpm', label: 'Sponsor CPM (per 1k opens)', default: 40, prefix: '$' },
      { key: 'sends', label: 'Sponsored sends / month', default: 4 },
    ],
    compute: v => {
      const rows: string[][] = []
      let subs = v.subscribers
      for (let m = 1; m <= 12; m++) {
        if (m > 1) subs *= 1 + v.growth / 100
        const opens = subs * (v.openRate / 100)
        const revenue = (opens / 1000) * v.cpm * v.sends
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(subs).toLocaleString(), money(revenue)])
      }
      const opensFinal = subs * (v.openRate / 100)
      return {
        metrics: [
          { label: 'Subscribers (mo 12)', value: Math.round(subs).toLocaleString(), highlight: true },
          { label: 'Monthly revenue', value: money((opensFinal / 1000) * v.cpm * v.sends), highlight: true },
          { label: 'Annualized', value: money((opensFinal / 1000) * v.cpm * v.sends * 12) },
        ],
        columns: ['Month', 'Subscribers', 'Monthly Revenue'],
        rows,
        note: `Sponsorship revenue scales with engaged opens, not raw subscribers — a smaller, higher-open list out-earns a big dead one. Protect open rate as you grow, or the CPM you can charge falls.`,
      }
    },
    sells: 'email-marketing-kit',
  },
  {
    id: 'multifamily-valueadd-simulator', name: 'Multifamily Value-Add Simulator', category: 'Real Estate',
    tagline: 'How a rent bump creates outsized value.',
    description: 'Model raising rents across units and see how the NOI increase multiplies into property value at your cap rate.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'units', label: 'Units', default: 20 },
      { key: 'rent', label: 'Current rent / unit', default: 1200, prefix: '$' },
      { key: 'bump', label: 'Rent increase / unit', default: 150, prefix: '$' },
      { key: 'expenseRatio', label: 'Expense ratio', default: 45, suffix: '%' },
      { key: 'capRate', label: 'Cap rate', default: 6, suffix: '%' },
    ],
    compute: v => {
      const curNOI = v.units * v.rent * 12 * (1 - v.expenseRatio / 100)
      const newNOI = v.units * (v.rent + v.bump) * 12 * (1 - v.expenseRatio / 100)
      const curVal = curNOI / (v.capRate / 100)
      const newVal = newNOI / (v.capRate / 100)
      return {
        metrics: [
          { label: 'Value created', value: money(newVal - curVal), highlight: true },
          { label: 'New value', value: money(newVal), highlight: true },
          { label: 'NOI lift', value: money(newNOI - curNOI) },
        ],
        columns: ['Line', 'Current', 'After Value-Add'],
        rows: [
          ['NOI', money(curNOI), money(newNOI)],
          ['Value', money(curVal), money(newVal)],
        ],
        note: `At a ${v.capRate}% cap, every $1 of added NOI creates about $${(100 / v.capRate).toFixed(0)} of value — so a $${v.bump}/unit rent bump adds about ${money(newVal - curVal)}. That multiplier is the entire thesis of value-add real estate.`,
      }
    },
  },
  {
    id: 'solar-payback-simulator', name: 'Solar Payback Simulator', category: 'Money',
    tagline: 'When does a solar install pay for itself?',
    description: 'Model install cost against rising utility savings to find the payback year and lifetime net savings.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cost', label: 'Install cost (net)', default: 25000, prefix: '$' },
      { key: 'savings', label: 'Monthly savings (year 1)', default: 180, prefix: '$' },
      { key: 'escalation', label: 'Utility rate rise / yr', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let cum = 0, savings = v.savings, payback = 0
      for (let y = 1; y <= 25; y++) {
        cum += savings * 12
        if (payback === 0 && cum >= v.cost) payback = y
        if (y % 5 === 0) rows.push([`Year ${y}`, money(savings * 12), money(cum - v.cost)])
        savings *= 1 + v.escalation / 100
      }
      return {
        metrics: [
          { label: 'Payback year', value: payback ? `Year ${payback}` : '> 25yr', highlight: true },
          { label: '25-yr net savings', value: money(cum - v.cost), highlight: true },
          { label: 'ROI', value: pct(v.cost > 0 ? (cum - v.cost) / v.cost : 0) },
        ],
        columns: ['Year', 'Annual Savings', 'Net vs. Cost'],
        rows,
        note: `Solar pays back around year ${payback || 25}, then produces free power — and rising utility rates make it look better every year. The financing rate versus your savings is what really decides if it's worth it.`,
      }
    },
  },
  {
    id: 'ev-tco-simulator', name: 'EV vs. Gas TCO Simulator', category: 'Money',
    tagline: 'Which car actually costs less to own?',
    description: 'Compare the total cost of ownership of an EV and a gas car over the years, including running and maintenance costs.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'evPrice', label: 'EV price', default: 45000, prefix: '$' },
      { key: 'gasPrice', label: 'Gas car price', default: 32000, prefix: '$' },
      { key: 'miles', label: 'Miles / year', default: 12000 },
      { key: 'evPerMile', label: 'EV cost / mile', default: 0.05, prefix: '$' },
      { key: 'gasPerMile', label: 'Gas cost / mile', default: 0.15, prefix: '$' },
      { key: 'maintDiff', label: 'EV maintenance savings / yr', default: 600, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let ev = v.evPrice, gas = v.gasPrice, crossover = 0
      for (let y = 1; y <= 8; y++) {
        ev += v.miles * v.evPerMile
        gas += v.miles * v.gasPerMile + v.maintDiff
        if (crossover === 0 && ev <= gas) crossover = y
        rows.push([`Year ${y}`, money(ev), money(gas)])
      }
      return {
        metrics: [
          { label: 'EV cheaper by year', value: crossover ? `Year ${crossover}` : 'Not in 8yr', highlight: true },
          { label: '8-yr EV TCO', value: money(ev) },
          { label: '8-yr savings', value: money(gas - ev), highlight: true },
        ],
        columns: ['Year', 'EV TCO', 'Gas TCO'],
        rows,
        note: `The EV's higher sticker is repaid by lower running and maintenance costs — crossing over around year ${crossover || 8}. The more you drive, the faster the EV wins; low-mileage drivers may never cross over.`,
      }
    },
  },
  {
    id: 'manufacturing-shift-simulator', name: 'Add-a-Shift Simulator', category: 'Manufacturing',
    tagline: 'Is adding a production shift worth it?',
    description: 'Model the incremental output, cost, and profit of adding a shift — high-leverage if you can sell the extra units.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'addUnits', label: 'Added units / month', default: 20000 },
      { key: 'price', label: 'Price per unit', default: 40, prefix: '$' },
      { key: 'variable', label: 'Variable cost / unit', default: 25, prefix: '$' },
      { key: 'shiftCost', label: 'Added shift cost / mo', default: 80000, prefix: '$' },
    ],
    compute: v => {
      const addedContribution = v.addUnits * (v.price - v.variable)
      const incremental = addedContribution - v.shiftCost
      return {
        metrics: [
          { label: 'Incremental profit / mo', value: money(incremental), highlight: true },
          { label: 'Annualized', value: money(incremental * 12), highlight: true },
          { label: 'Verdict', value: incremental > 0 ? 'Worth it' : 'Not yet', highlight: incremental <= 0 },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Added units / mo', v.addUnits.toLocaleString()],
          ['Added contribution', money(addedContribution)],
          ['Added shift cost', money(v.shiftCost)],
          ['Incremental profit', money(incremental)],
        ],
        note: incremental > 0 ? `The extra shift adds about ${money(incremental)}/month — but only if you can sell every unit. Idle output turns this high-leverage move into a loss. Confirm the demand first.` : `At these numbers the shift loses money — the extra cost outweighs the contribution. You need more units, higher price, or lower variable cost to justify it.`,
      }
    },
    sells: 'annual-operating-budget-model',
  },
  {
    id: 'gym-pt-upsell-simulator', name: 'Gym PT Upsell Simulator', category: 'Fitness',
    tagline: 'Project revenue as personal-training attach grows.',
    description: 'Model a rising personal-training attach rate across your members to see the high-margin revenue it adds.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'members', label: 'Members', default: 800 },
      { key: 'startAttach', label: 'Starting PT attach %', default: 10, suffix: '%' },
      { key: 'attachGain', label: 'Attach gain / month (pts)', default: 1 },
      { key: 'sessions', label: 'PT sessions / member / mo', default: 4 },
      { key: 'price', label: 'PT session price', default: 70, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let attach = v.startAttach
      for (let m = 1; m <= 12; m++) {
        if (m > 1) attach += v.attachGain
        const ptMembers = v.members * (attach / 100)
        const revenue = ptMembers * v.sessions * v.price
        if (m % 2 === 0) rows.push([`Month ${m}`, `${attach.toFixed(0)}%`, money(revenue)])
      }
      const attachFinal = v.startAttach + 11 * v.attachGain
      return {
        metrics: [
          { label: 'PT revenue (mo 12)', value: money(v.members * (attachFinal / 100) * v.sessions * v.price), highlight: true },
          { label: 'Annualized', value: money(v.members * (attachFinal / 100) * v.sessions * v.price * 12), highlight: true },
          { label: 'PT attach (mo 12)', value: `${attachFinal.toFixed(0)}%` },
        ],
        columns: ['Month', 'PT Attach', 'PT Revenue'],
        rows,
        note: `Personal training is high-margin and boosts retention — every point of attach rate stacks profitable revenue on the same member base. It's usually a bigger lever than adding new members.`,
      }
    },
  },
  {
    id: 'restaurant-expansion-simulator', name: 'Restaurant Group Expansion Simulator', category: 'Hospitality',
    tagline: 'Project a restaurant group as you open locations.',
    description: 'Model opening locations over several years to see system revenue and profit scale.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'locations', label: 'Starting locations', default: 1 },
      { key: 'add', label: 'New locations / year', default: 1 },
      { key: 'revPer', label: 'Revenue / location', default: 1200000, prefix: '$' },
      { key: 'margin', label: 'Location margin', default: 10, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let loc = v.locations
      for (let y = 1; y <= 5; y++) {
        if (y > 1) loc += v.add
        const rev = loc * v.revPer
        rows.push([`Year ${y}`, loc.toString(), money(rev), money(rev * (v.margin / 100))])
      }
      return {
        metrics: [
          { label: 'Locations (yr 5)', value: loc.toString(), highlight: true },
          { label: 'System revenue', value: money(loc * v.revPer), highlight: true },
          { label: 'Profit (yr 5)', value: money(loc * v.revPer * (v.margin / 100)) },
        ],
        columns: ['Year', 'Locations', 'Revenue', 'Profit'],
        rows,
        note: `Restaurant expansion is where thin margins meet real risk — each location needs its own management and can dilute quality. Prove repeatable, profitable unit economics before you scale the group.`,
      }
    },
  },

  {
    id: 'dividend-growth-simulator', name: 'Dividend Growth Simulator', category: 'Money',
    tagline: 'Watch a dividend portfolio compound its income.',
    description: 'Model a dividend portfolio with price growth and reinvested dividends to see how both value and annual income climb over the years.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'portfolio', label: 'Portfolio value', default: 100000, prefix: '$' },
      { key: 'yield', label: 'Dividend yield', default: 3.5, suffix: '%' },
      { key: 'priceGrowth', label: 'Annual price growth', default: 5, suffix: '%' },
      { key: 'years', label: 'Years', default: 20 },
    ],
    compute: v => {
      const rows: string[][] = []
      let value = v.portfolio, totalIncome = 0
      const yrs = Math.min(Math.max(v.years, 1), 50)
      for (let y = 1; y <= yrs; y++) {
        const dividend = value * (v.yield / 100)
        totalIncome += dividend
        value = value * (1 + v.priceGrowth / 100) + dividend
        if (y % 5 === 0 || y === yrs) rows.push([`Year ${y}`, money(value), money(dividend)])
      }
      return {
        metrics: [
          { label: 'Portfolio (end)', value: money(value), highlight: true },
          { label: 'Annual income (end)', value: money(value * (v.yield / 100)), highlight: true },
          { label: 'Total dividends', value: money(totalIncome) },
        ],
        columns: ['Year', 'Portfolio Value', 'Annual Dividend'],
        rows,
        note: `Reinvested dividends plus price growth compound together — yield-on-cost climbs far above the headline yield over time. This is why dividend growth investing is a favorite for building passive income.`,
      }
    },
  },
  {
    id: '401k-match-simulator', name: '401(k) Employer Match Simulator', category: 'Money',
    tagline: 'See the free money an employer match adds.',
    description: 'Model your contributions plus an employer match compounding to retirement — and how much of the balance is the match alone.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'salary', label: 'Salary', default: 80000, prefix: '$' },
      { key: 'contribution', label: 'Your contribution', default: 6, suffix: '%' },
      { key: 'match', label: 'Employer match (of your %)', default: 50, suffix: '%' },
      { key: 'cap', label: 'Match cap (% of salary)', default: 6, suffix: '%' },
      { key: 'return', label: 'Annual return', default: 7, suffix: '%' },
      { key: 'years', label: 'Years', default: 30 },
    ],
    compute: v => {
      const yourAnnual = v.salary * (v.contribution / 100)
      const employerAnnual = v.salary * (Math.min(v.contribution, v.cap) / 100) * (v.match / 100)
      const rows: string[][] = []
      let bal = 0, yourTotal = 0, empTotal = 0
      const yrs = Math.min(Math.max(v.years, 1), 50)
      for (let y = 1; y <= yrs; y++) {
        bal = bal * (1 + v.return / 100) + yourAnnual + employerAnnual
        yourTotal += yourAnnual; empTotal += employerAnnual
        if (y % 5 === 0 || y === yrs) rows.push([`Year ${y}`, money(bal), money(yourTotal), money(empTotal)])
      }
      return {
        metrics: [
          { label: 'Balance (end)', value: money(bal), highlight: true },
          { label: 'Employer contributed', value: money(empTotal), highlight: true },
          { label: 'Your contributions', value: money(yourTotal) },
        ],
        columns: ['Year', 'Balance', 'You', 'Employer'],
        rows,
        note: `The match is an instant, guaranteed return on your money — and it compounds for decades. Contributing at least up to the cap is the single clearest win in personal finance.`,
      }
    },
  },
  {
    id: 'roth-vs-traditional-simulator', name: 'Roth vs. Traditional Simulator', category: 'Money',
    tagline: 'Which retirement account leaves you more?',
    description: 'Compare after-tax retirement value of Roth vs. traditional contributions given your tax rates now and in retirement.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'contribution', label: 'Annual contribution', default: 6500, prefix: '$' },
      { key: 'return', label: 'Annual return', default: 7, suffix: '%' },
      { key: 'years', label: 'Years', default: 30 },
      { key: 'nowRate', label: 'Tax rate now', default: 24, suffix: '%' },
      { key: 'retireRate', label: 'Tax rate in retirement', default: 22, suffix: '%' },
    ],
    compute: v => {
      let fv = 0
      const yrs = Math.min(Math.max(v.years, 1), 50)
      for (let y = 1; y <= yrs; y++) fv = fv * (1 + v.return / 100) + v.contribution
      const trad = fv * (1 - v.retireRate / 100)
      const roth = fv * (1 - v.nowRate / 100)
      return {
        metrics: [
          { label: 'Traditional (after tax)', value: money(trad), highlight: v.retireRate <= v.nowRate },
          { label: 'Roth (after tax)', value: money(roth), highlight: v.nowRate < v.retireRate },
          { label: 'Difference', value: money(Math.abs(roth - trad)) },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Balance before tax', money(fv)],
          ['Traditional — taxed in retirement', money(trad)],
          ['Roth — taxed now', money(roth)],
        ],
        note: v.nowRate < v.retireRate ? `Roth wins: you pay tax at today's lower rate and withdraw tax-free later. When you expect higher future rates, pre-paying tax is the smart move.` : `Traditional wins here: deferring tax to a lower retirement rate leaves more. The whole decision hinges on now-vs-later tax rates — everything else is a wash.`,
      }
    },
  },
  {
    id: 'college-529-simulator', name: '529 College Savings Simulator', category: 'Money',
    tagline: 'Will you have enough saved for college?',
    description: 'Model monthly contributions growing until college to see your projected balance against the projected cost.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'monthly', label: 'Monthly contribution', default: 300, prefix: '$' },
      { key: 'current', label: 'Current savings', default: 5000, prefix: '$' },
      { key: 'return', label: 'Annual return', default: 6, suffix: '%' },
      { key: 'years', label: 'Years to college', default: 15 },
      { key: 'cost', label: 'Projected total cost', default: 150000, prefix: '$' },
    ],
    compute: v => {
      const r = v.return / 1200
      const rows: string[][] = []
      let bal = v.current
      const yrs = Math.min(Math.max(v.years, 1), 25)
      for (let y = 1; y <= yrs; y++) {
        for (let m = 0; m < 12; m++) bal = bal * (1 + r) + v.monthly
        if (y % 3 === 0 || y === yrs) rows.push([`Year ${y}`, money(bal), pct(v.cost > 0 ? bal / v.cost : 0)])
      }
      return {
        metrics: [
          { label: 'Projected balance', value: money(bal), highlight: true },
          { label: 'Funded', value: pct(v.cost > 0 ? bal / v.cost : 0), highlight: true },
          { label: 'Gap', value: money(Math.max(0, v.cost - bal)) },
        ],
        columns: ['Year', 'Balance', 'Funded %'],
        rows,
        note: `529 growth is tax-free for education — a powerful edge over a taxable account. Starting early matters most; the first years of compounding do the heaviest lifting toward the goal.`,
      }
    },
  },
  {
    id: 'hsa-triple-tax-simulator', name: 'HSA Triple-Tax Simulator', category: 'Money',
    tagline: 'The most tax-advantaged account there is.',
    description: 'Compare investing in an HSA (tax-free in, growth, and out) against a taxable account over the years.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'annual', label: 'Annual contribution', default: 4000, prefix: '$' },
      { key: 'return', label: 'Annual return', default: 7, suffix: '%' },
      { key: 'years', label: 'Years', default: 25 },
      { key: 'taxRate', label: 'Your tax rate', default: 30, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let hsa = 0, taxable = 0
      const taxableReturn = v.return * (1 - 0.15) // rough drag on gains
      const afterTaxContribution = v.annual * (1 - v.taxRate / 100)
      const yrs = Math.min(Math.max(v.years, 1), 50)
      for (let y = 1; y <= yrs; y++) {
        hsa = hsa * (1 + v.return / 100) + v.annual
        taxable = taxable * (1 + taxableReturn / 100) + afterTaxContribution
        if (y % 5 === 0 || y === yrs) rows.push([`Year ${y}`, money(hsa), money(taxable)])
      }
      return {
        metrics: [
          { label: 'HSA value', value: money(hsa), highlight: true },
          { label: 'Taxable equivalent', value: money(taxable) },
          { label: 'HSA advantage', value: money(hsa - taxable), highlight: true },
        ],
        columns: ['Year', 'HSA', 'Taxable Account'],
        rows,
        note: `The HSA is uniquely triple-tax-free — deductible in, growth untaxed, and tax-free out for medical costs. Paying medical bills out of pocket and letting the HSA invest turns it into a stealth retirement account.`,
      }
    },
  },
  {
    id: 'covered-call-income-simulator', name: 'Covered Call Income Simulator', category: 'Money',
    tagline: 'Income you can generate selling calls on a position.',
    description: 'Model monthly option premium on a stock position to project annual income and yield — a common income strategy, with its trade-offs.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'shares', label: 'Shares owned', default: 1000 },
      { key: 'price', label: 'Stock price', default: 50, prefix: '$' },
      { key: 'premium', label: 'Monthly premium', default: 1, suffix: '%' },
    ],
    compute: v => {
      const position = v.shares * v.price
      const monthly = position * (v.premium / 100)
      const rows: string[][] = []
      let cum = 0
      for (let m = 1; m <= 12; m++) { cum += monthly; if (m % 2 === 0) rows.push([`Month ${m}`, money(monthly), money(cum)]) }
      return {
        metrics: [
          { label: 'Monthly income', value: money(monthly), highlight: true },
          { label: 'Annual income', value: money(monthly * 12), highlight: true },
          { label: 'Annual yield', value: pct(position > 0 ? (monthly * 12) / position : 0) },
        ],
        columns: ['Month', 'Premium', 'Cumulative'],
        rows,
        note: `Covered calls generate steady income, but cap your upside — if the stock rockets past your strike, the shares get called away. It's an income strategy, not a growth one; know the trade you're making.`,
      }
    },
  },
  {
    id: 'sba-acquisition-simulator', name: 'SBA Acquisition Simulator', category: 'Fundraising',
    tagline: 'Can the business service the loan that buys it?',
    description: 'Model buying a business with an SBA loan to see debt service, DSCR, and cash-on-cash return on your down payment.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'price', label: 'Purchase price', default: 1000000, prefix: '$' },
      { key: 'down', label: 'Down payment', default: 10, suffix: '%' },
      { key: 'rate', label: 'Loan rate', default: 11, suffix: '%' },
      { key: 'term', label: 'Loan term (years)', default: 10 },
      { key: 'cashFlow', label: 'Business cash flow (SDE)', default: 250000, prefix: '$' },
    ],
    compute: v => {
      const loan = v.price * (1 - v.down / 100)
      const r = v.rate / 1200, n = v.term * 12
      const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
      const annualDebt = monthly * 12
      const dscr = annualDebt > 0 ? v.cashFlow / annualDebt : 0
      const afterDebt = v.cashFlow - annualDebt
      const cashInvested = v.price * (v.down / 100)
      return {
        metrics: [
          { label: 'DSCR', value: `${dscr.toFixed(2)}x`, highlight: true },
          { label: 'Cash flow after debt', value: money(afterDebt), highlight: afterDebt < 0 },
          { label: 'Cash-on-cash', value: pct(cashInvested > 0 ? afterDebt / cashInvested : 0), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Loan amount', money(loan)],
          ['Annual debt service', money(annualDebt)],
          ['Business cash flow', money(v.cashFlow)],
          ['Owner cash after debt', money(afterDebt)],
        ],
        note: dscr < 1.25 ? `A DSCR of ${dscr.toFixed(2)} is thin — lenders want ~1.25+, and so should you. Little cushion means one soft year threatens the loan and your paycheck.` : `A ${dscr.toFixed(2)} DSCR with ${pct(cashInvested > 0 ? afterDebt / cashInvested : 0)} cash-on-cash — this is the appeal of acquisition: control a large cash flow with a small down payment. Buy on verified earnings, not projections.`,
      }
    },
    sells: 'cap-table-model',
  },
  {
    id: 'earnout-simulator', name: 'M&A Earnout Simulator', category: 'Fundraising',
    tagline: 'What a deal with an earnout is really worth.',
    description: 'Model an upfront payment plus a probability-weighted earnout to see the expected total deal value.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'upfront', label: 'Upfront payment', default: 2000000, prefix: '$' },
      { key: 'earnout', label: 'Maximum earnout', default: 1500000, prefix: '$' },
      { key: 'probability', label: 'Chance of full earnout', default: 60, suffix: '%' },
    ],
    compute: v => {
      const expected = v.earnout * (v.probability / 100)
      const total = v.upfront + expected
      return {
        metrics: [
          { label: 'Expected total', value: money(total), highlight: true },
          { label: 'Expected earnout', value: money(expected), highlight: true },
          { label: 'Upfront share', value: pct(total > 0 ? v.upfront / total : 0) },
        ],
        columns: ['Component', 'Amount'],
        rows: [
          ['Upfront (guaranteed)', money(v.upfront)],
          ['Maximum earnout', money(v.earnout)],
          ['Expected earnout', money(expected)],
          ['Expected total value', money(total)],
        ],
        note: `Earnouts bridge a price gap but shift risk to the seller — the "headline" price and the expected price differ by whatever you don't hit. Negotiate the milestones as hard as the number; achievable targets are worth more than a big maximum.`,
      }
    },
    sells: 'cap-table-model',
  },
  {
    id: 'rsu-vesting-simulator', name: 'RSU Vesting Value Simulator', category: 'Money',
    tagline: 'What your equity vests into over four years.',
    description: 'Model an RSU grant vesting over time with stock-price growth to see the value you actually realize each year.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'shares', label: 'Total RSUs granted', default: 4000 },
      { key: 'price', label: 'Current price', default: 40, prefix: '$' },
      { key: 'years', label: 'Vesting years', default: 4 },
      { key: 'growth', label: 'Annual stock growth', default: 12, suffix: '%' },
    ],
    compute: v => {
      const perYear = v.shares / v.years
      const rows: string[][] = []
      let price = v.price, cum = 0
      const yrs = Math.min(Math.max(v.years, 1), 10)
      for (let y = 1; y <= yrs; y++) {
        if (y > 1) price *= 1 + v.growth / 100
        const value = perYear * price
        cum += value
        rows.push([`Year ${y}`, Math.round(perYear).toString(), money(price), money(value)])
      }
      return {
        metrics: [
          { label: 'Total value realized', value: money(cum), highlight: true },
          { label: 'Value / year (avg)', value: money(cum / yrs) },
          { label: 'Final price', value: money(price), highlight: true },
        ],
        columns: ['Year', 'Shares Vested', 'Price', 'Value'],
        rows,
        note: `RSUs are taxed as income when they vest — plan for the tax bill each year. And remember it's concentrated risk: a big unvested balance ties your net worth to one stock, so diversifying as it vests is usually wise.`,
      }
    },
  },
  {
    id: 'dca-vs-lumpsum-simulator', name: 'DCA vs. Lump Sum Simulator', category: 'Money',
    tagline: 'Invest it all now, or spread it out?',
    description: 'Compare investing a sum all at once against dollar-cost averaging it over a year, in a steadily rising market.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'total', label: 'Amount to invest', default: 60000, prefix: '$' },
      { key: 'months', label: 'DCA over months', default: 12 },
      { key: 'return', label: 'Expected annual return', default: 8, suffix: '%' },
    ],
    compute: v => {
      const r = v.return / 1200
      const lump = v.total * Math.pow(1 + r, v.months)
      const per = v.total / v.months
      let dca = 0
      for (let m = 1; m <= v.months; m++) dca += per * Math.pow(1 + r, v.months - m)
      return {
        metrics: [
          { label: 'Lump sum value', value: money(lump), highlight: true },
          { label: 'DCA value', value: money(dca), highlight: true },
          { label: 'Lump sum edge', value: money(lump - dca) },
        ],
        columns: ['Strategy', 'End Value'],
        rows: [
          ['Lump sum (all now)', money(lump)],
          [`DCA (over ${v.months} mo)`, money(dca)],
        ],
        note: `In a rising market lump sum wins — your money is invested longer. DCA's real value is behavioral: it removes the risk of buying right before a drop and the regret that follows. Math favors lump sum; nerves often favor DCA.`,
      }
    },
  },
  {
    id: 'net-worth-glidepath-simulator', name: 'Net Worth Glidepath Simulator', category: 'Money',
    tagline: 'Project your net worth across a career.',
    description: 'Model rising income, a steady savings rate, and investment returns to see net worth compound over decades.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'income', label: 'Annual income', default: 90000, prefix: '$' },
      { key: 'incomeGrowth', label: 'Income growth / yr', default: 3, suffix: '%' },
      { key: 'savingsRate', label: 'Savings rate', default: 20, suffix: '%' },
      { key: 'return', label: 'Investment return', default: 7, suffix: '%' },
      { key: 'current', label: 'Current net worth', default: 20000, prefix: '$' },
      { key: 'years', label: 'Years', default: 25 },
    ],
    compute: v => {
      const rows: string[][] = []
      let nw = v.current, inc = v.income, saved = 0
      const yrs = Math.min(Math.max(v.years, 1), 50)
      for (let y = 1; y <= yrs; y++) {
        const annualSave = inc * (v.savingsRate / 100)
        nw = nw * (1 + v.return / 100) + annualSave
        saved += annualSave
        inc *= 1 + v.incomeGrowth / 100
        if (y % 5 === 0 || y === yrs) rows.push([`Year ${y}`, money(inc), money(nw)])
      }
      return {
        metrics: [
          { label: 'Net worth (end)', value: money(nw), highlight: true },
          { label: 'Total saved', value: money(saved) },
          { label: 'Growth earned', value: money(nw - saved - v.current), highlight: true },
        ],
        columns: ['Year', 'Income', 'Net Worth'],
        rows,
        note: `Savings rate — not income — is the strongest driver early on; compounding takes over later. Someone saving 20% of a modest income out-builds a high earner who saves nothing. The rate is the lever you control.`,
      }
    },
  },
]

export function getProToolById(id: string): ProTool | undefined {
  return PRO_TOOLS.find(t => t.id === id)
}

export const PRO_TOOL_CATEGORIES = Array.from(new Set(PRO_TOOLS.map(t => t.category)))
