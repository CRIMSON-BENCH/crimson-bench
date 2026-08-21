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

  {
    id: 'marketplace-gmv-simulator', name: 'Marketplace GMV Simulator', category: 'Revenue',
    tagline: 'Project GMV and take-rate revenue over a year.',
    description: 'Model transaction growth at your average order value and take rate to see gross merchandise value and the revenue you actually keep.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'tx', label: 'Transactions / month', default: 2000 },
      { key: 'growth', label: 'Growth / month', default: 10, suffix: '%' },
      { key: 'aov', label: 'Average order value', default: 80, prefix: '$' },
      { key: 'take', label: 'Take rate', default: 15, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let tx = v.tx, cumRev = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) tx *= 1 + v.growth / 100
        const gmv = tx * v.aov
        const rev = gmv * (v.take / 100)
        cumRev += rev
        if (m % 2 === 0) rows.push([`Month ${m}`, money(gmv), money(rev)])
      }
      const gmvFinal = tx * v.aov
      return {
        metrics: [
          { label: 'GMV (mo 12)', value: money(gmvFinal), highlight: true },
          { label: 'Revenue (mo 12)', value: money(gmvFinal * (v.take / 100)), highlight: true },
          { label: '12-mo revenue', value: money(cumRev) },
        ],
        columns: ['Month', 'GMV', 'Revenue'],
        rows,
        note: `GMV is the vanity number; take-rate revenue pays the bills. Marketplaces win by growing GMV and defending take rate — raise it too far and supply or demand routes around you.`,
      }
    },
  },
  {
    id: 'app-iap-simulator', name: 'App In-App Purchase Simulator', category: 'SaaS',
    tagline: 'Project revenue from installs and paying users.',
    description: 'Model monthly installs converting to payers against payer churn to see your recurring in-app revenue.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'installs', label: 'Installs / month', default: 50000 },
      { key: 'payingPct', label: 'Install → payer', default: 3, suffix: '%' },
      { key: 'arppu', label: 'Revenue / payer / mo', default: 15, prefix: '$' },
      { key: 'churn', label: 'Payer churn / mo', default: 15, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let payers = 0
      for (let m = 1; m <= 12; m++) {
        payers = payers * (1 - v.churn / 100) + v.installs * (v.payingPct / 100)
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(payers).toString(), money(payers * v.arppu)])
      }
      return {
        metrics: [
          { label: 'Payers (mo 12)', value: Math.round(payers).toString(), highlight: true },
          { label: 'Revenue (mo 12)', value: money(payers * v.arppu), highlight: true },
          { label: 'Annualized', value: money(payers * v.arppu * 12) },
        ],
        columns: ['Month', 'Paying Users', 'Revenue'],
        rows,
        note: `High payer churn caps the base fast — apps live on retention and re-engagement, not just installs. A small lift in payer retention outperforms buying more downloads.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'activation-funnel-simulator', name: 'Activation Funnel Simulator', category: 'SaaS',
    tagline: 'Project paid growth through activation and conversion.',
    description: 'Model signups moving through activation and paid conversion, accumulating a paid base against churn.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'signups', label: 'Signups / month', default: 3000 },
      { key: 'activation', label: 'Activation rate', default: 40, suffix: '%' },
      { key: 'conversion', label: 'Activated → paid', default: 8, suffix: '%' },
      { key: 'price', label: 'Price / month', default: 30, prefix: '$' },
      { key: 'churn', label: 'Paid churn / mo', default: 4, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let base = 0
      for (let m = 1; m <= 12; m++) {
        const activated = v.signups * (v.activation / 100)
        const newPaid = activated * (v.conversion / 100)
        base = base * (1 - v.churn / 100) + newPaid
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(activated).toString(), Math.round(newPaid).toString(), money(base * v.price)])
      }
      return {
        metrics: [
          { label: 'Paid base (mo 12)', value: Math.round(base).toString(), highlight: true },
          { label: 'MRR (mo 12)', value: money(base * v.price), highlight: true },
          { label: 'Signup → paid', value: pct((v.activation / 100) * (v.conversion / 100)) },
        ],
        columns: ['Month', 'Activated', 'New Paid', 'MRR'],
        rows,
        note: `Activation is the most-ignored lever — a user who never reaches value never pays. Improving activation lifts every downstream number, and it's usually cheaper than driving more signups.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'safety-stock-simulator', name: 'Safety Stock & Reorder Simulator', category: 'Manufacturing',
    tagline: 'Set inventory buffers for your service level.',
    description: 'Enter demand, its variability, and lead time to see the safety stock and reorder point for different service levels.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'demand', label: 'Average daily demand', default: 100 },
      { key: 'stdDev', label: 'Demand std. deviation', default: 30 },
      { key: 'leadTime', label: 'Lead time (days)', default: 14 },
    ],
    compute: v => {
      const levels: [string, number][] = [['90%', 1.28], ['95%', 1.65], ['99%', 2.33]]
      const sqrtLT = Math.sqrt(v.leadTime)
      const rows = levels.map(([label, z]) => {
        const safety = z * v.stdDev * sqrtLT
        return [label, Math.round(safety).toString(), Math.round(v.demand * v.leadTime + safety).toString()]
      })
      const safety95 = 1.65 * v.stdDev * sqrtLT
      return {
        metrics: [
          { label: 'Safety stock (95%)', value: Math.round(safety95).toString(), highlight: true },
          { label: 'Reorder point (95%)', value: Math.round(v.demand * v.leadTime + safety95).toString(), highlight: true },
          { label: 'Cycle demand', value: Math.round(v.demand * v.leadTime).toString() },
        ],
        columns: ['Service Level', 'Safety Stock', 'Reorder Point'],
        rows,
        note: `Higher service levels cost exponentially more inventory — going from 95% to 99% often nearly doubles safety stock. Match the service level to the cost of a stockout, not to perfectionism.`,
      }
    },
  },
  {
    id: 'insurance-loss-ratio-simulator', name: 'Insurance Combined Ratio Simulator', category: 'Advisor',
    tagline: 'Is the underwriting actually profitable?',
    description: 'Enter premiums, losses, and expenses to see loss, expense, and combined ratios — and whether the book makes an underwriting profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'premium', label: 'Earned premium', default: 5000000, prefix: '$' },
      { key: 'losses', label: 'Incurred losses', default: 3200000, prefix: '$' },
      { key: 'expenses', label: 'Expenses', default: 1500000, prefix: '$' },
    ],
    compute: v => {
      const lossRatio = v.premium > 0 ? v.losses / v.premium : 0
      const expenseRatio = v.premium > 0 ? v.expenses / v.premium : 0
      const combined = lossRatio + expenseRatio
      const uw = v.premium - v.losses - v.expenses
      return {
        metrics: [
          { label: 'Combined ratio', value: pct(combined), highlight: true },
          { label: 'Underwriting profit', value: money(uw), highlight: uw < 0 },
          { label: 'Loss ratio', value: pct(lossRatio) },
        ],
        columns: ['Metric', 'Value'],
        rows: [
          ['Loss ratio', pct(lossRatio)],
          ['Expense ratio', pct(expenseRatio)],
          ['Combined ratio', pct(combined)],
          ['Underwriting profit', money(uw)],
        ],
        note: combined < 1 ? `A combined ratio under 100% means the book earns an underwriting profit before any investment income — the mark of disciplined underwriting.` : `Over 100% — the book loses money on underwriting and relies on investment income to profit. Sustainable only if float returns cover the gap; tighten pricing or claims.`,
      }
    },
  },
  {
    id: 'crop-profit-simulator', name: 'Crop Profit Simulator', category: 'Manufacturing',
    tagline: 'Project farm profit from yield and price.',
    description: 'Enter acres, yield, price, and cost per acre to see total profit, profit per acre, and your break-even price.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'acres', label: 'Acres', default: 500 },
      { key: 'yield', label: 'Yield / acre (bushels)', default: 180 },
      { key: 'price', label: 'Price / bushel', default: 5, prefix: '$' },
      { key: 'cost', label: 'Cost / acre', default: 550, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.acres * v.yield * v.price
      const cost = v.acres * v.cost
      const profit = revenue - cost
      const breakeven = v.yield > 0 ? v.cost / v.yield : 0
      return {
        metrics: [
          { label: 'Total profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / acre', value: money(v.acres > 0 ? profit / v.acres : 0), highlight: true },
          { label: 'Break-even price', value: `$${breakeven.toFixed(2)}`, highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Cost', money(cost)],
          ['Profit', money(profit)],
          ['Profit / acre', money(v.acres > 0 ? profit / v.acres : 0)],
        ],
        note: `Your break-even is about $${breakeven.toFixed(2)}/bushel — below that, the crop loses money. Since farmers can't set price, controlling cost per acre and locking in prices (hedging) is where the margin is protected.`,
      }
    },
  },
  {
    id: 'solar-farm-simulator', name: 'Solar Farm Revenue Simulator', category: 'Manufacturing',
    tagline: 'Project revenue and profit from a solar installation.',
    description: 'Enter capacity, capacity factor, and power price to project a utility-scale solar farm’s annual generation and profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'mw', label: 'Capacity (MW)', default: 10 },
      { key: 'cf', label: 'Capacity factor', default: 24, suffix: '%' },
      { key: 'price', label: 'Price per MWh', default: 45, prefix: '$' },
      { key: 'opex', label: 'Opex / MW / year', default: 20000, prefix: '$' },
    ],
    compute: v => {
      const mwh = v.mw * 8760 * (v.cf / 100)
      const revenue = mwh * v.price
      const opex = v.mw * v.opex
      const profit = revenue - opex
      return {
        metrics: [
          { label: 'Annual generation', value: `${Math.round(mwh).toLocaleString()} MWh`, highlight: true },
          { label: 'Annual revenue', value: money(revenue), highlight: true },
          { label: 'Annual profit', value: money(profit) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Annual generation', `${Math.round(mwh).toLocaleString()} MWh`],
          ['Revenue', money(revenue)],
          ['Opex', money(opex)],
          ['Profit (pre-financing)', money(profit)],
        ],
        note: `Capacity factor — real-world output vs. nameplate — drives everything; a sunnier site or better tracking beats raw panel count. This is pre-financing; the debt on the build is usually the biggest cost of all.`,
      }
    },
  },
  {
    id: 'price-increase-simulator', name: 'Price Increase Impact Simulator', category: 'SaaS',
    tagline: 'How much churn a price hike can absorb.',
    description: 'Model raising prices against the extra churn it triggers to see the net revenue impact — and the churn you can afford.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'customers', label: 'Customers', default: 1000 },
      { key: 'price', label: 'Current price', default: 50, prefix: '$' },
      { key: 'increase', label: 'Price increase', default: 20, suffix: '%' },
      { key: 'churn', label: 'Extra churn from increase', default: 5, suffix: '%' },
    ],
    compute: v => {
      const newPrice = v.price * (1 + v.increase / 100)
      const retained = v.customers * (1 - v.churn / 100)
      const oldRev = v.customers * v.price
      const newRev = retained * newPrice
      const breakevenChurn = v.increase / (100 + v.increase)
      return {
        metrics: [
          { label: 'New MRR', value: money(newRev), highlight: true },
          { label: 'Net change', value: money(newRev - oldRev), highlight: newRev < oldRev },
          { label: 'Break-even churn', value: pct(breakevenChurn), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Old MRR', money(oldRev)],
          ['New MRR', money(newRev)],
          ['Net change', money(newRev - oldRev)],
        ],
        note: `You could lose up to ${pct(breakevenChurn)} of customers and still come out even — most price increases churn far less. Pricing is the highest-leverage growth lever, and the most under-used.`,
      }
    },
    sells: 'pricing-strategy-toolkit',
  },
  {
    id: 'upsell-crosssell-simulator', name: 'Upsell & Cross-Sell Simulator', category: 'Revenue',
    tagline: 'Project the revenue in add-ons to your base.',
    description: 'Model upsell and cross-sell attach rates across your customer base to see the incremental revenue and lifted ARPU.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'customers', label: 'Customers', default: 2000 },
      { key: 'baseARPU', label: 'Base ARPU / mo', default: 50, prefix: '$' },
      { key: 'upsellRate', label: 'Upsell attach', default: 15, suffix: '%' },
      { key: 'upsellValue', label: 'Upsell value / mo', default: 30, prefix: '$' },
      { key: 'crossRate', label: 'Cross-sell attach', default: 10, suffix: '%' },
      { key: 'crossValue', label: 'Cross-sell value / mo', default: 20, prefix: '$' },
    ],
    compute: v => {
      const base = v.customers * v.baseARPU
      const upsell = v.customers * (v.upsellRate / 100) * v.upsellValue
      const cross = v.customers * (v.crossRate / 100) * v.crossValue
      const total = base + upsell + cross
      return {
        metrics: [
          { label: 'Total MRR', value: money(total), highlight: true },
          { label: 'From add-ons', value: money(upsell + cross), highlight: true },
          { label: 'New ARPU', value: money(v.customers > 0 ? total / v.customers : 0) },
        ],
        columns: ['Source', 'Monthly Revenue'],
        rows: [
          ['Base subscriptions', money(base)],
          ['Upsells', money(upsell)],
          ['Cross-sells', money(cross)],
          ['Total', money(total)],
        ],
        note: `Add-ons raise ARPU with customers you already have — no acquisition cost. A few points of attach rate on an existing base is some of the cheapest revenue growth available.`,
      }
    },
  },
  {
    id: 'retail-seasonality-simulator', name: 'Retail Seasonality Simulator', category: 'Retail',
    tagline: 'See how your year’s revenue really lands by month.',
    description: 'Distribute annual revenue across a typical retail seasonal curve to see peak and trough months — and plan cash and inventory around them.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'annual', label: 'Annual revenue', default: 1200000, prefix: '$' },
      { key: 'cogs', label: 'COGS %', default: 55, suffix: '%' },
    ],
    compute: v => {
      const weights = [0.75, 0.75, 0.85, 0.9, 0.95, 0.9, 0.9, 0.95, 1.0, 1.1, 1.5, 1.7]
      const sum = weights.reduce((a, b) => a + b, 0)
      const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthly = weights.map(w => v.annual * (w / sum))
      const avg = v.annual / 12
      const rows = names.map((n, i) => [n, money(monthly[i]), `${((monthly[i] / avg) * 100).toFixed(0)}%`])
      const peak = Math.max(...monthly), trough = Math.min(...monthly)
      return {
        metrics: [
          { label: 'Peak month', value: money(peak), highlight: true },
          { label: 'Slowest month', value: money(trough) },
          { label: 'Pre-peak inventory cash', value: money(peak * (v.cogs / 100)), highlight: true },
        ],
        columns: ['Month', 'Revenue', 'vs. Average'],
        rows,
        note: `The peak needs inventory bought (and paid for) months ahead — that pre-season cash squeeze sinks under-capitalized retailers even in a great year. Plan financing around the trough, not the average.`,
      }
    },
  },
  {
    id: 'consulting-utilization-simulator', name: 'Consulting Utilization Simulator', category: 'Agency',
    tagline: 'Project revenue as consultants ramp to full utilization.',
    description: 'Model a services team ramping toward target utilization at your bill rate to see monthly revenue build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'consultants', label: 'Consultants', default: 10 },
      { key: 'target', label: 'Target utilization', default: 75, suffix: '%' },
      { key: 'hours', label: 'Available hours / mo', default: 160 },
      { key: 'rate', label: 'Bill rate', default: 200, prefix: '$' },
      { key: 'ramp', label: 'Ramp to target (months)', default: 3 },
    ],
    compute: v => {
      const rows: string[][] = []
      for (let m = 1; m <= 12; m++) {
        const util = Math.min(40 + (v.target - 40) * (m / v.ramp), v.target)
        const revenue = v.consultants * v.hours * (util / 100) * v.rate
        if (m % 2 === 0) rows.push([`Month ${m}`, `${util.toFixed(0)}%`, money(revenue)])
      }
      const steady = v.consultants * v.hours * (v.target / 100) * v.rate
      return {
        metrics: [
          { label: 'Steady revenue / mo', value: money(steady), highlight: true },
          { label: 'Annualized', value: money(steady * 12), highlight: true },
          { label: 'At target', value: `${v.target}%` },
        ],
        columns: ['Month', 'Utilization', 'Revenue'],
        rows,
        note: `Utilization is the heartbeat of a services firm — a few points either way swings the whole P&L. Too low wastes payroll; too high burns people out and quality slips. The target is a balance, not a max.`,
      }
    },
  },
  {
    id: 'warehouse-labor-simulator', name: 'Warehouse Labor Simulator', category: 'Logistics',
    tagline: 'Project pick labor cost as order volume grows.',
    description: 'Model order growth through pick rates and labor cost to see fulfillment labor scale — and cost per order.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'orders', label: 'Orders / day', default: 2000 },
      { key: 'growth', label: 'Growth / month', default: 5, suffix: '%' },
      { key: 'picks', label: 'Picks per order', default: 3 },
      { key: 'rate', label: 'Picks / labor hour', default: 60 },
      { key: 'cost', label: 'Labor cost / hour', default: 22, prefix: '$' },
      { key: 'days', label: 'Operating days / mo', default: 26 },
    ],
    compute: v => {
      const rows: string[][] = []
      let orders = v.orders
      for (let m = 1; m <= 12; m++) {
        if (m > 1) orders *= 1 + v.growth / 100
        const hours = (orders * v.picks) / v.rate
        const monthlyLabor = hours * v.cost * v.days
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(orders).toLocaleString(), money(monthlyLabor)])
      }
      const hoursFinal = (orders * v.picks) / v.rate
      const monthlyFinal = hoursFinal * v.cost * v.days
      return {
        metrics: [
          { label: 'Monthly labor (mo 12)', value: money(monthlyFinal), highlight: true },
          { label: 'Annualized', value: money(monthlyFinal * 12), highlight: true },
          { label: 'Labor / order', value: `$${(orders * v.days > 0 ? monthlyFinal / (orders * v.days) : 0).toFixed(2)}` },
        ],
        columns: ['Month', 'Orders / Day', 'Monthly Labor'],
        rows,
        note: `Pick rate is the lever — slotting, batching, and layout that lift picks-per-hour cut cost per order directly. At scale, small productivity gains compound into large labor savings.`,
      }
    },
  },

  {
    id: 'self-storage-simulator', name: 'Self-Storage Lease-Up Simulator', category: 'Real Estate',
    tagline: 'Project occupancy, NOI, and value for a storage facility.',
    description: 'Model a self-storage facility leasing up over a year to see stabilized revenue, NOI, and value at your cap rate.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'units', label: 'Units', default: 300 },
      { key: 'occ', label: 'Starting occupancy', default: 70, suffix: '%' },
      { key: 'ramp', label: 'Occupancy gain / mo (pts)', default: 2 },
      { key: 'rent', label: 'Rent / unit / mo', default: 120, prefix: '$' },
      { key: 'expenseRatio', label: 'Expense ratio', default: 35, suffix: '%' },
      { key: 'capRate', label: 'Cap rate', default: 6.5, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let occ = v.occ
      for (let m = 1; m <= 12; m++) {
        if (m > 1) occ = Math.min(92, occ + v.ramp)
        if (m % 3 === 0) rows.push([`Month ${m}`, `${occ.toFixed(0)}%`, money(v.units * (occ / 100) * v.rent)])
      }
      const monthlyRev = v.units * (occ / 100) * v.rent
      const noi = monthlyRev * 12 * (1 - v.expenseRatio / 100)
      const value = noi / (v.capRate / 100)
      return {
        metrics: [
          { label: 'Stabilized monthly rev', value: money(monthlyRev), highlight: true },
          { label: 'Annual NOI', value: money(noi), highlight: true },
          { label: 'Estimated value', value: money(value), highlight: true },
        ],
        columns: ['Month', 'Occupancy', 'Monthly Revenue'],
        rows,
        note: `Self-storage runs on low expenses and sticky tenants — once leased up, the NOI is remarkably stable. Value is NOI ÷ cap rate, so raising rents on existing tenants flows almost entirely to value.`,
      }
    },
  },
  {
    id: 'airbnb-str-simulator', name: 'Short-Term Rental (Airbnb) Simulator', category: 'Real Estate',
    tagline: 'Project the monthly profit of a short-term rental.',
    description: 'Model nightly rate, occupancy, and costs to see the real monthly and annual profit of an STR after expenses and mortgage.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'rate', label: 'Nightly rate', default: 180, prefix: '$' },
      { key: 'occupancy', label: 'Occupancy', default: 65, suffix: '%' },
      { key: 'expenses', label: 'Monthly operating expenses', default: 1500, prefix: '$' },
      { key: 'mortgage', label: 'Monthly mortgage', default: 1400, prefix: '$' },
    ],
    compute: v => {
      const gross = v.rate * (v.occupancy / 100) * 30
      const net = gross - v.expenses - v.mortgage
      return {
        metrics: [
          { label: 'Net monthly', value: money(net), highlight: net < 0 },
          { label: 'Net annual', value: money(net * 12), highlight: true },
          { label: 'Revenue / avail. night', value: money(v.rate * (v.occupancy / 100)) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Gross monthly revenue', money(gross)],
          ['Operating expenses', money(v.expenses)],
          ['Mortgage', money(v.mortgage)],
          ['Net profit', money(net)],
        ],
        note: `STR income swings with seasonality and occupancy far more than a long-term lease — model a conservative occupancy. And it's a hospitality business: cleaning, messaging, and reviews are real work, not passive income.`,
      }
    },
  },
  {
    id: 'car-wash-simulator', name: 'Car Wash Profit Simulator', category: 'Small Business',
    tagline: 'Project a car wash’s profit as volume grows.',
    description: 'Model daily car count growth against per-car cost and fixed overhead to see monthly profit build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cars', label: 'Cars / day', default: 150 },
      { key: 'price', label: 'Price per wash', default: 12, prefix: '$' },
      { key: 'variable', label: 'Cost per car', default: 3, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed cost', default: 25000, prefix: '$' },
      { key: 'growth', label: 'Volume growth / mo', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let cars = v.cars
      for (let m = 1; m <= 12; m++) {
        if (m > 1) cars *= 1 + v.growth / 100
        const profit = cars * (v.price - v.variable) * 30 - v.fixed
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(cars).toString(), money(profit)])
      }
      return {
        metrics: [
          { label: 'Profit (mo 12)', value: money(cars * (v.price - v.variable) * 30 - v.fixed), highlight: true },
          { label: 'Annualized', value: money((cars * (v.price - v.variable) * 30 - v.fixed) * 12), highlight: true },
          { label: 'Cars / day (mo 12)', value: Math.round(cars).toString() },
        ],
        columns: ['Month', 'Cars / Day', 'Monthly Profit'],
        rows,
        note: `Car washes are high-fixed-cost, low-variable-cost — so profit explodes once you clear break-even volume. Membership/unlimited plans smooth revenue and are the industry's big profit unlock.`,
      }
    },
  },
  {
    id: 'laundromat-simulator', name: 'Laundromat Profit Simulator', category: 'Small Business',
    tagline: 'Project a laundromat’s monthly profit.',
    description: 'Model machines and cycle volume against utility and fixed costs to see monthly profit and revenue per machine.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'machines', label: 'Machines', default: 30 },
      { key: 'cycles', label: 'Cycles / machine / day', default: 4 },
      { key: 'price', label: 'Price per cycle', default: 3.5, prefix: '$' },
      { key: 'utility', label: 'Utility cost / cycle', default: 0.9, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed cost', default: 6000, prefix: '$' },
    ],
    compute: v => {
      const monthlyCycles = v.machines * v.cycles * 30
      const revenue = monthlyCycles * v.price
      const utilities = monthlyCycles * v.utility
      const profit = revenue - utilities - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: true },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue / machine', value: money(v.machines > 0 ? revenue / v.machines : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Monthly cycles', Math.round(monthlyCycles).toLocaleString()],
          ['Revenue', money(revenue)],
          ['Utilities', money(utilities)],
          ['Fixed costs', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Laundromats are beloved for being semi-passive and cash-flowing — but utility cost per cycle and vend price set the whole margin. Add-ons (wash-and-fold, vending) lift revenue per square foot meaningfully.`,
      }
    },
  },
  {
    id: 'vending-machine-simulator', name: 'Vending Machine Business Simulator', category: 'Small Business',
    tagline: 'Project profit across a route of machines.',
    description: 'Model revenue per machine against product cost and servicing to see route-level profit and profit per machine.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'machines', label: 'Machines', default: 20 },
      { key: 'revPer', label: 'Revenue / machine / mo', default: 600, prefix: '$' },
      { key: 'cogs', label: 'Product cost %', default: 55, suffix: '%' },
      { key: 'servicing', label: 'Servicing / machine / mo', default: 40, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.machines * v.revPer
      const cogs = revenue * (v.cogs / 100)
      const servicing = v.machines * v.servicing
      const profit = revenue - cogs - servicing
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: true },
          { label: 'Profit / machine', value: money(v.machines > 0 ? profit / v.machines : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Product cost', money(cogs)],
          ['Servicing', money(servicing)],
          ['Profit', money(profit)],
        ],
        note: `Vending scales by adding machines in good locations — profit per machine is small, so location quality and route density (less driving) make or break the economics.`,
      }
    },
  },
  {
    id: 'food-truck-simulator', name: 'Food Truck Profit Simulator', category: 'Hospitality',
    tagline: 'Project a food truck’s monthly profit.',
    description: 'Model service days, covers, and ticket size against food, labor, and fixed costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'days', label: 'Service days / month', default: 22 },
      { key: 'covers', label: 'Covers / day', default: 120 },
      { key: 'ticket', label: 'Average ticket', default: 12, prefix: '$' },
      { key: 'foodPct', label: 'Food cost %', default: 30, suffix: '%' },
      { key: 'laborPerDay', label: 'Labor / day', default: 300, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 4000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.covers * v.ticket * v.days
      const food = revenue * (v.foodPct / 100)
      const labor = v.laborPerDay * v.days
      const profit = revenue - food - labor - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / day', value: money(v.days > 0 ? profit / v.days : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Food cost', money(food)],
          ['Labor', money(labor)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Food trucks trade a restaurant's rent for lower overhead — but covers per day swing wildly with location and weather. High-traffic spots and catering gigs are what turn a good day into a good month.`,
      }
    },
  },
  {
    id: 'parking-lot-simulator', name: 'Parking Lot Simulator', category: 'Real Estate',
    tagline: 'Project revenue and profit from a parking asset.',
    description: 'Model spaces, daily rate, and occupancy against expenses to see monthly profit and revenue per space.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'spaces', label: 'Spaces', default: 200 },
      { key: 'rate', label: 'Daily rate', default: 15, prefix: '$' },
      { key: 'occupancy', label: 'Occupancy', default: 70, suffix: '%' },
      { key: 'days', label: 'Paid days / month', default: 26 },
      { key: 'expenses', label: 'Monthly expenses', default: 8000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.spaces * (v.occupancy / 100) * v.rate * v.days
      const profit = revenue - v.expenses
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: true },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue / space', value: money(v.spaces > 0 ? revenue / v.spaces : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Expenses', money(v.expenses)],
          ['Profit', money(profit)],
        ],
        note: `Parking is low-effort cash flow with minimal staffing — and pricing power in dense areas. Dynamic pricing (events, peak hours) and monthly contracts lift revenue per space without adding a single spot.`,
      }
    },
  },
  {
    id: 'atm-business-simulator', name: 'ATM Business Simulator', category: 'Small Business',
    tagline: 'Project profit from a fleet of ATMs.',
    description: 'Model transactions and surcharge across machines against costs to see monthly profit and profit per machine.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'machines', label: 'ATMs', default: 10 },
      { key: 'tx', label: 'Transactions / machine / mo', default: 300 },
      { key: 'surcharge', label: 'Surcharge', default: 3, prefix: '$' },
      { key: 'cost', label: 'Cost / machine / mo', default: 60, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.machines * v.tx * v.surcharge
      const cost = v.machines * v.cost
      const profit = revenue - cost
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: true },
          { label: 'Profit / machine', value: money(v.machines > 0 ? profit / v.machines : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Surcharge revenue', money(revenue)],
          ['Machine costs', money(cost)],
          ['Profit', money(profit)],
        ],
        note: `ATM economics live or die on transactions per machine — location traffic is everything. The main working-capital constraint is the cash you must load into each machine, which ties up capital as you scale.`,
      }
    },
  },
  {
    id: 'podcast-monetization-simulator', name: 'Podcast Monetization Simulator', category: 'Creator',
    tagline: 'Project podcast revenue from ads and memberships.',
    description: 'Model downloads, ad CPM, ad slots, and membership revenue to see total monthly podcast income.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'downloads', label: 'Downloads / episode', default: 20000 },
      { key: 'episodes', label: 'Episodes / month', default: 4 },
      { key: 'cpm', label: 'Ad CPM', default: 25, prefix: '$' },
      { key: 'slots', label: 'Ad slots / episode', default: 3 },
      { key: 'membership', label: 'Membership revenue / mo', default: 2000, prefix: '$' },
    ],
    compute: v => {
      const ad = (v.downloads / 1000) * v.cpm * v.slots * v.episodes
      const total = ad + v.membership
      return {
        metrics: [
          { label: 'Monthly revenue', value: money(total), highlight: true },
          { label: 'Ad revenue', value: money(ad) },
          { label: 'Annualized', value: money(total * 12), highlight: true },
        ],
        columns: ['Source', 'Monthly Revenue'],
        rows: [
          ['Ad revenue', money(ad)],
          ['Memberships', money(v.membership)],
          ['Total', money(total)],
        ],
        note: `Ad revenue scales with downloads, but memberships and premium feeds monetize your true fans at far higher value per listener. The biggest shows layer ads, memberships, courses, and live events on the same audience.`,
      }
    },
    sells: 'email-marketing-kit',
  },
  {
    id: 'medspa-simulator', name: 'Med Spa Profit Simulator', category: 'Healthcare',
    tagline: 'Project a med spa’s monthly profit.',
    description: 'Model treatment volume and price against consumables, provider pay, and fixed costs to see profit and margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'treatments', label: 'Treatments / month', default: 400 },
      { key: 'price', label: 'Average price', default: 250, prefix: '$' },
      { key: 'consumables', label: 'Consumable cost %', default: 20, suffix: '%' },
      { key: 'providerPay', label: 'Provider pay %', default: 30, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 40000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.treatments * v.price
      const cons = revenue * (v.consumables / 100)
      const pay = revenue * (v.providerPay / 100)
      const profit = revenue - cons - pay - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Margin', value: pct(revenue > 0 ? profit / revenue : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Consumables', money(cons)],
          ['Provider pay', money(pay)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Med spas blend healthcare and retail margins — cash-pay, high-ticket, repeat treatments. Memberships and packages (prepaid series) smooth revenue and dramatically raise client lifetime value.`,
      }
    },
  },
  {
    id: 'boutique-fitness-simulator', name: 'Boutique Fitness Studio Simulator', category: 'Fitness',
    tagline: 'Project a class-based studio’s profit.',
    description: 'Model class volume and attendance against instructor pay and rent to see a boutique studio’s monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'classes', label: 'Classes / week', default: 40 },
      { key: 'attendees', label: 'Avg. attendees', default: 12 },
      { key: 'price', label: 'Price per class', default: 22, prefix: '$' },
      { key: 'instructorPay', label: 'Instructor pay / class', default: 40, prefix: '$' },
      { key: 'rent', label: 'Monthly rent + fixed', default: 12000, prefix: '$' },
    ],
    compute: v => {
      const monthlyClasses = v.classes * 4.33
      const revenue = monthlyClasses * v.attendees * v.price
      const instructor = monthlyClasses * v.instructorPay
      const profit = revenue - instructor - v.rent
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue / class', value: money(v.attendees * v.price) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Instructor pay', money(instructor)],
          ['Rent + fixed', money(v.rent)],
          ['Profit', money(profit)],
        ],
        note: `Boutique fitness lives on class fill — a half-empty class costs the same instructor and rent as a full one. Memberships, class packs, and retail lift revenue per member above the drop-in rate.`,
      }
    },
  },
  {
    id: 'coworking-simulator', name: 'Coworking Space Simulator', category: 'Real Estate',
    tagline: 'Project a coworking space’s profit.',
    description: 'Model desks, occupancy, and price against operating costs and rent to see monthly profit and revenue per desk.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'desks', label: 'Desks', default: 120 },
      { key: 'occupancy', label: 'Occupancy', default: 80, suffix: '%' },
      { key: 'price', label: 'Price / desk / mo', default: 350, prefix: '$' },
      { key: 'opex', label: 'Opex / desk / mo', default: 120, prefix: '$' },
      { key: 'rent', label: 'Monthly rent', default: 20000, prefix: '$' },
    ],
    compute: v => {
      const occupied = v.desks * (v.occupancy / 100)
      const revenue = occupied * v.price
      const opex = occupied * v.opex + v.rent
      const profit = revenue - opex
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue / desk', value: money(v.desks > 0 ? revenue / v.desks : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Opex + rent', money(opex)],
          ['Profit', money(profit)],
        ],
        note: `Coworking is a spread business — you lease space wholesale and sell it retail by the desk. The risk is the mismatch: long lease obligations against month-to-month members, which is exactly what bites in a downturn.`,
      }
    },
  },

  {
    id: 'dental-implant-roi-simulator', name: 'Dental Implant ROI Simulator', category: 'Dental',
    tagline: 'The profit behind a high-value procedure.',
    description: 'Model implant volume and price against lab and chair-time costs to see the profit of adding implants to a practice.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'implants', label: 'Implants / month', default: 30 },
      { key: 'price', label: 'Price per implant', default: 3500, prefix: '$' },
      { key: 'lab', label: 'Lab cost per implant', default: 400, prefix: '$' },
      { key: 'chairHours', label: 'Chair hours per implant', default: 2 },
      { key: 'overhead', label: 'Overhead per chair hour', default: 200, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.implants * v.price
      const cost = v.implants * (v.lab + v.chairHours * v.overhead)
      const profit = revenue - cost
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: true },
          { label: 'Profit / implant', value: money(v.implants > 0 ? profit / v.implants : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Lab + chair cost', money(cost)],
          ['Profit', money(profit)],
        ],
        note: `Implants are among the highest-margin procedures in dentistry — the case is whether to invest in the training and equipment to keep them in-house vs. referring them out. This shows the profit you'd keep.`,
      }
    },
  },
  {
    id: 'optometry-retail-simulator', name: 'Optometry Practice Simulator', category: 'Healthcare',
    tagline: 'Exams plus eyewear retail — the real revenue.',
    description: 'Model exam volume and eyewear attach to see how retail turns an optometry practice’s economics.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'exams', label: 'Exams / month', default: 500 },
      { key: 'examFee', label: 'Exam fee', default: 90, prefix: '$' },
      { key: 'attach', label: 'Eyewear attach rate', default: 60, suffix: '%' },
      { key: 'frame', label: 'Average eyewear sale', default: 220, prefix: '$' },
      { key: 'cogs', label: 'Eyewear COGS %', default: 40, suffix: '%' },
    ],
    compute: v => {
      const examRev = v.exams * v.examFee
      const buyers = v.exams * (v.attach / 100)
      const frameRev = buyers * v.frame
      const frameProfit = frameRev * (1 - v.cogs / 100)
      const total = examRev + frameProfit
      return {
        metrics: [
          { label: 'Total contribution / mo', value: money(total), highlight: true },
          { label: 'Retail profit', value: money(frameProfit), highlight: true },
          { label: 'Exam revenue', value: money(examRev) },
        ],
        columns: ['Source', 'Amount'],
        rows: [
          ['Exam revenue', money(examRev)],
          ['Eyewear revenue', money(frameRev)],
          ['Eyewear profit', money(frameProfit)],
          ['Total contribution', money(total)],
        ],
        note: `Exams get patients in the door; eyewear retail is where the margin lives. A few points of attach rate — and higher-value frames — move practice profit more than seeing more patients.`,
      }
    },
  },
  {
    id: 'semiconductor-yield-simulator', name: 'Semiconductor Yield Simulator', category: 'Manufacturing',
    tagline: 'Why yield is everything in chips.',
    description: 'Model wafers, dies per wafer, and yield against wafer cost to see how good-die yield drives chip revenue and profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'wafers', label: 'Wafers / month', default: 1000 },
      { key: 'dies', label: 'Dies per wafer', default: 500 },
      { key: 'yield', label: 'Yield', default: 85, suffix: '%' },
      { key: 'price', label: 'Price per good die', default: 8, prefix: '$' },
      { key: 'cost', label: 'Cost per wafer', default: 2000, prefix: '$' },
    ],
    compute: v => {
      const goodDies = v.wafers * v.dies * (v.yield / 100)
      const revenue = goodDies * v.price
      const cost = v.wafers * v.cost
      const profit = revenue - cost
      return {
        metrics: [
          { label: 'Good dies / mo', value: Math.round(goodDies).toLocaleString(), highlight: true },
          { label: 'Revenue', value: money(revenue), highlight: true },
          { label: 'Profit', value: money(profit) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Good dies', Math.round(goodDies).toLocaleString()],
          ['Revenue', money(revenue)],
          ['Wafer cost', money(cost)],
          ['Profit', money(profit)],
        ],
        note: `Wafer cost is fixed whether yield is 60% or 95% — so every point of yield drops almost entirely to profit. This is why fabs obsess over yield, and why leading-edge nodes are so hard to make money on early.`,
      }
    },
  },
  {
    id: 'hardware-razor-blade-simulator', name: 'Hardware + Subscription (Razor-Blade) Simulator', category: 'SaaS',
    tagline: 'Lose on the device, win on the subscription?',
    description: 'Model selling a device at or below cost to earn recurring subscription revenue, and see the true customer LTV and payback.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'devicePrice', label: 'Device price', default: 99, prefix: '$' },
      { key: 'deviceCost', label: 'Device cost', default: 130, prefix: '$' },
      { key: 'subscription', label: 'Subscription / month', default: 15, prefix: '$' },
      { key: 'months', label: 'Avg. subscription months', default: 24 },
      { key: 'cac', label: 'CAC', default: 40, prefix: '$' },
    ],
    compute: v => {
      const deviceMargin = v.devicePrice - v.deviceCost
      const subLTV = v.subscription * v.months
      const ltv = deviceMargin + subLTV - v.cac
      const upfrontLoss = -(deviceMargin) + v.cac
      const payback = v.subscription > 0 ? upfrontLoss / v.subscription : 0
      return {
        metrics: [
          { label: 'Customer LTV', value: money(ltv), highlight: true },
          { label: 'Payback', value: `${payback.toFixed(1)} mo`, highlight: true },
          { label: 'Subscription LTV', value: money(subLTV) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Device margin', money(deviceMargin)],
          ['Subscription LTV', money(subLTV)],
          ['Less CAC', money(-v.cac)],
          ['Net customer LTV', money(ltv)],
        ],
        note: `The razor-blade model bets recurring revenue outweighs the hardware loss — it only works if retention holds past payback (month ${payback.toFixed(1)} here). Subsidize the device too much and short-lived customers sink you.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'sports-franchise-simulator', name: 'Sports Franchise Revenue Simulator', category: 'Entertainment',
    tagline: 'How a team makes its money.',
    description: 'Model gate, concessions, sponsorship, and media to see a sports franchise’s total revenue.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'games', label: 'Home games / year', default: 41 },
      { key: 'capacity', label: 'Capacity', default: 18000 },
      { key: 'attendance', label: 'Attendance', default: 85, suffix: '%' },
      { key: 'ticket', label: 'Average ticket', default: 60, prefix: '$' },
      { key: 'concessions', label: 'Concessions / fan', default: 25, prefix: '$' },
      { key: 'sponsorship', label: 'Sponsorship / year', default: 15000000, prefix: '$' },
      { key: 'media', label: 'Media rights / year', default: 40000000, prefix: '$' },
    ],
    compute: v => {
      const fans = v.games * v.capacity * (v.attendance / 100)
      const gate = fans * (v.ticket + v.concessions)
      const total = gate + v.sponsorship + v.media
      return {
        metrics: [
          { label: 'Total revenue', value: money(total), highlight: true },
          { label: 'Gate + concessions', value: money(gate), highlight: true },
          { label: 'Revenue / game', value: money(v.games > 0 ? total / v.games : 0) },
        ],
        columns: ['Source', 'Annual Revenue'],
        rows: [
          ['Gate + concessions', money(gate)],
          ['Sponsorship', money(v.sponsorship)],
          ['Media rights', money(v.media)],
          ['Total', money(total)],
        ],
        note: `For modern franchises, media and sponsorship dwarf ticket sales — the building is almost a media studio. That's why franchise values keep climbing even when a team struggles at the gate.`,
      }
    },
  },
  {
    id: 'concert-tour-simulator', name: 'Concert Tour Profit Simulator', category: 'Entertainment',
    tagline: 'Project the economics of a tour.',
    description: 'Model shows, capacity, and ticket price against per-show costs to see tour revenue and profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'shows', label: 'Shows', default: 30 },
      { key: 'capacity', label: 'Capacity / show', default: 8000 },
      { key: 'attendance', label: 'Attendance', default: 90, suffix: '%' },
      { key: 'ticket', label: 'Average ticket', default: 75, prefix: '$' },
      { key: 'costPerShow', label: 'Cost per show', default: 120000, prefix: '$' },
    ],
    compute: v => {
      const revPerShow = v.capacity * (v.attendance / 100) * v.ticket
      const revenue = v.shows * revPerShow
      const cost = v.shows * v.costPerShow
      const profit = revenue - cost
      return {
        metrics: [
          { label: 'Tour revenue', value: money(revenue), highlight: true },
          { label: 'Tour profit', value: money(profit), highlight: true },
          { label: 'Profit / show', value: money(v.shows > 0 ? profit / v.shows : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue per show', money(revPerShow)],
          ['Total revenue', money(revenue)],
          ['Total cost', money(cost)],
          ['Profit', money(profit)],
        ],
        note: `Touring is now where music money is made — but production, crew, and travel costs per show are heavy. Merch and VIP packages (not modeled here) often carry the real margin on top of ticket sales.`,
      }
    },
  },
  {
    id: 'film-roi-simulator', name: 'Film Box-Office ROI Simulator', category: 'Entertainment',
    tagline: 'Did the movie actually make money?',
    description: 'Model budget, marketing, box office, and the studio’s share to see film profit, ROI, and break-even box office.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'budget', label: 'Production budget', default: 20000000, prefix: '$' },
      { key: 'marketing', label: 'Marketing spend', default: 15000000, prefix: '$' },
      { key: 'boxOffice', label: 'Global box office', default: 80000000, prefix: '$' },
      { key: 'studioShare', label: 'Studio share of gross', default: 50, suffix: '%' },
    ],
    compute: v => {
      const studioRev = v.boxOffice * (v.studioShare / 100)
      const totalCost = v.budget + v.marketing
      const profit = studioRev - totalCost
      const breakeven = v.studioShare > 0 ? totalCost / (v.studioShare / 100) : 0
      return {
        metrics: [
          { label: 'Studio profit', value: money(profit), highlight: profit < 0 },
          { label: 'ROI', value: pct(totalCost > 0 ? profit / totalCost : 0), highlight: true },
          { label: 'Break-even box office', value: money(breakeven), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Studio revenue', money(studioRev)],
          ['Production budget', money(v.budget)],
          ['Marketing', money(v.marketing)],
          ['Profit', money(profit)],
        ],
        note: `Studios keep only about half of box office (theaters take the rest), and marketing often rivals the budget — so a film needs to gross roughly ${money(breakeven)} just to break even here. Merchandising and streaming are where franchises really pay off.`,
      }
    },
  },
  {
    id: 'staking-yield-simulator', name: 'Staking Yield Simulator', category: 'Money',
    tagline: 'Project compounding yield on a staked balance.',
    description: 'Model a balance earning a stated APY with monthly compounding to see the value and yield over time. Educational only — yields and principal can vary widely.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'amount', label: 'Staked amount', default: 10000, prefix: '$' },
      { key: 'apy', label: 'APY', default: 6, suffix: '%' },
      { key: 'months', label: 'Months', default: 24 },
    ],
    compute: v => {
      const r = v.apy / 1200
      const rows: string[][] = []
      let bal = v.amount
      const mo = Math.min(Math.max(v.months, 1), 120)
      for (let m = 1; m <= mo; m++) {
        bal = bal * (1 + r)
        if (m % 6 === 0 || m === mo) rows.push([`Month ${m}`, money(bal), money(bal - v.amount)])
      }
      return {
        metrics: [
          { label: 'Ending value', value: money(bal), highlight: true },
          { label: 'Total yield', value: money(bal - v.amount), highlight: true },
          { label: 'Monthly income (end)', value: money(bal * r) },
        ],
        columns: ['Month', 'Value', 'Yield'],
        rows,
        note: `Compounding turns a steady APY into an accelerating balance. Remember this is mechanical math — real yields, token prices, and platform risk all vary. This is an educational tool, not investment advice.`,
      }
    },
  },
  {
    id: 'mining-rig-simulator', name: 'Mining Rig Profit Simulator', category: 'Money',
    tagline: 'Does the rig out-earn the power bill?',
    description: 'Model mining revenue against electricity cost to see daily and monthly profit — and your break-even power rate. Highly variable with prices and difficulty.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'revPerDay', label: 'Gross revenue / day', default: 12, prefix: '$' },
      { key: 'watts', label: 'Power draw (watts)', default: 3000 },
      { key: 'rate', label: 'Electricity rate / kWh', default: 0.1, prefix: '$' },
    ],
    compute: v => {
      const powerCost = (v.watts / 1000) * 24 * v.rate
      const dailyProfit = v.revPerDay - powerCost
      const breakeven = (v.watts / 1000) * 24 > 0 ? v.revPerDay / ((v.watts / 1000) * 24) : 0
      return {
        metrics: [
          { label: 'Daily profit', value: money(dailyProfit), highlight: dailyProfit < 0 },
          { label: 'Monthly profit', value: money(dailyProfit * 30), highlight: true },
          { label: 'Break-even rate / kWh', value: `$${breakeven.toFixed(3)}` },
        ],
        columns: ['Line', 'Daily Amount'],
        rows: [
          ['Revenue', money(v.revPerDay)],
          ['Power cost', money(powerCost)],
          ['Profit', money(dailyProfit)],
        ],
        note: `Mining is a race against your power rate — above about $${breakeven.toFixed(3)}/kWh this rig loses money. Revenue also swings with coin price and network difficulty, so today's profit is not tomorrow's. Educational only.`,
      }
    },
  },
  {
    id: 'fx-exposure-simulator', name: 'FX Exposure & Hedge Simulator', category: 'Finance',
    tagline: 'How much a currency move costs you — hedged or not.',
    description: 'Model foreign-currency exposure and a hedge ratio against an adverse rate move to see the P&L impact.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'exposure', label: 'Foreign exposure', default: 1000000, prefix: '$' },
      { key: 'move', label: 'Adverse rate move', default: 5, suffix: '%' },
      { key: 'hedge', label: 'Hedge ratio', default: 60, suffix: '%' },
    ],
    compute: v => {
      const unhedged = v.exposure * (1 - v.hedge / 100)
      const hedged = v.exposure * (v.hedge / 100)
      const loss = unhedged * (v.move / 100)
      const lossUnhedgedAll = v.exposure * (v.move / 100)
      return {
        metrics: [
          { label: 'Loss (this hedge)', value: money(loss), highlight: true },
          { label: 'Loss if unhedged', value: money(lossUnhedgedAll) },
          { label: 'Protection', value: money(lossUnhedgedAll - loss), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Total exposure', money(v.exposure)],
          ['Hedged portion', money(hedged)],
          ['Unhedged portion', money(unhedged)],
          ['P&L from the move', money(-loss)],
        ],
        note: `Hedging trades away upside for certainty — the ${v.hedge}% hedge cuts this loss to ${money(loss)}. The right ratio depends on how much currency risk your margins can absorb, not on predicting the rate.`,
      }
    },
  },
  {
    id: 'import-landed-cost-simulator', name: 'Import Landed Cost Simulator', category: 'E-Commerce',
    tagline: 'What imported goods really cost after duty and freight.',
    description: 'Model unit cost, freight, duty, and fees to see the true landed cost and the margin it leaves at your sell price.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'unit', label: 'Unit cost (factory)', default: 8, prefix: '$' },
      { key: 'freight', label: 'Freight / unit', default: 1.2, prefix: '$' },
      { key: 'duty', label: 'Import duty', default: 12, suffix: '%' },
      { key: 'fees', label: 'Other fees / unit', default: 0.5, prefix: '$' },
      { key: 'price', label: 'Sell price', default: 30, prefix: '$' },
    ],
    compute: v => {
      const landed = v.unit + v.freight + v.unit * (v.duty / 100) + v.fees
      const profit = v.price - landed
      return {
        metrics: [
          { label: 'Landed cost', value: money(landed), highlight: true },
          { label: 'Profit / unit', value: money(profit), highlight: profit < 0 },
          { label: 'Margin', value: pct(v.price > 0 ? profit / v.price : 0), highlight: true },
        ],
        columns: ['Component', 'Per Unit'],
        rows: [
          ['Factory cost', money(v.unit)],
          ['Freight', money(v.freight)],
          ['Duty', money(v.unit * (v.duty / 100))],
          ['Other fees', money(v.fees)],
          ['Landed cost', money(landed)],
        ],
        note: `A "cheap" factory price can arrive expensive once freight and duty stack on — this is the number to price and negotiate against. Tariff changes hit this line directly, so build in a buffer.`,
      }
    },
  },
  {
    id: 'international-expansion-simulator', name: 'International Expansion Simulator', category: 'SaaS',
    tagline: 'When does a new market pay back its cost?',
    description: 'Model localization investment against ramping new-market revenue to find the payback month and net position.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cost', label: 'Localization / setup cost', default: 200000, prefix: '$' },
      { key: 'newMRR', label: 'New MRR added / month (full)', default: 30000, prefix: '$' },
      { key: 'ramp', label: 'Ramp to full (months)', default: 6 },
    ],
    compute: v => {
      const rows: string[][] = []
      let running = 0, cum = 0, payback = 0
      for (let m = 1; m <= 24; m++) {
        running += v.newMRR * Math.min(m / v.ramp, 1)
        cum += running
        if (payback === 0 && cum >= v.cost) payback = m
        if (m % 3 === 0) rows.push([`Month ${m}`, money(running), money(cum - v.cost)])
      }
      return {
        metrics: [
          { label: 'Payback month', value: payback ? `Month ${payback}` : '> 24mo', highlight: true },
          { label: 'MRR (mo 24)', value: money(running), highlight: true },
          { label: 'Net (mo 24)', value: money(cum - v.cost) },
        ],
        columns: ['Month', 'New-Market MRR', 'Cumulative Net'],
        rows,
        note: `New markets carry upfront localization, legal, and support cost before revenue ramps — this shows when they turn net-positive. Expand where the payback is clear; a long payback ties up cash you may need at home.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },

  {
    id: 'position-size-simulator', name: 'Position Size Calculator', category: 'Trading',
    tagline: 'Risk a fixed amount — let the stop set your size.',
    description: 'Enter account size, risk per trade, entry, and stop to get the exact position size that keeps your loss capped. Educational only, not trading advice.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'account', label: 'Account size', default: 50000, prefix: '$' },
      { key: 'riskPct', label: 'Risk per trade', default: 1, suffix: '%' },
      { key: 'entry', label: 'Entry price', default: 100, prefix: '$' },
      { key: 'stop', label: 'Stop price', default: 95, prefix: '$' },
    ],
    compute: v => {
      const riskAmount = v.account * (v.riskPct / 100)
      const perShare = Math.abs(v.entry - v.stop)
      const shares = perShare > 0 ? riskAmount / perShare : 0
      return {
        metrics: [
          { label: 'Risk amount', value: money(riskAmount), highlight: true },
          { label: 'Position size (shares)', value: Math.floor(shares).toLocaleString(), highlight: true },
          { label: 'Position value', value: money(Math.floor(shares) * v.entry) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Risk per trade', money(riskAmount)],
          ['Risk per share', money(perShare)],
          ['Shares', Math.floor(shares).toLocaleString()],
          ['Position value', money(Math.floor(shares) * v.entry)],
        ],
        note: `Position sizing off a fixed risk % is the core of survival — the stop distance, not a gut feeling, sets your size. Risking 1% means 20 losses in a row still leaves you standing. Educational only.`,
      }
    },
  },
  {
    id: 'risk-reward-simulator', name: 'Risk / Reward Calculator', category: 'Trading',
    tagline: 'The win rate a trade actually needs.',
    description: 'Enter entry, stop, and target to get the risk-reward ratio and the win rate you need just to break even.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'entry', label: 'Entry price', default: 100, prefix: '$' },
      { key: 'stop', label: 'Stop price', default: 95, prefix: '$' },
      { key: 'target', label: 'Target price', default: 115, prefix: '$' },
    ],
    compute: v => {
      const risk = Math.abs(v.entry - v.stop)
      const reward = Math.abs(v.target - v.entry)
      const rr = risk > 0 ? reward / risk : 0
      const breakeven = 1 / (1 + rr)
      return {
        metrics: [
          { label: 'Risk : Reward', value: `1 : ${rr.toFixed(1)}`, highlight: true },
          { label: 'Break-even win rate', value: pct(breakeven), highlight: true },
          { label: 'Reward per $1 risk', value: money(rr) },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Risk per share', money(risk)],
          ['Reward per share', money(reward)],
          ['R:R ratio', `${rr.toFixed(2)}x`],
        ],
        note: `A ${rr.toFixed(1)}:1 reward-to-risk trade only needs to win ${pct(breakeven)} of the time to break even. Favorable R:R is why disciplined traders can be profitable while losing most of their trades. Educational only.`,
      }
    },
  },
  {
    id: 'trading-expectancy-simulator', name: 'Trading Expectancy Simulator', category: 'Trading',
    tagline: 'Is your strategy actually profitable?',
    description: 'Enter win rate, average win, and average loss to see expectancy per trade — the single number that decides if a system makes money.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'winRate', label: 'Win rate', default: 45, suffix: '%' },
      { key: 'avgWin', label: 'Average win', default: 300, prefix: '$' },
      { key: 'avgLoss', label: 'Average loss', default: 150, prefix: '$' },
      { key: 'trades', label: 'Trades / month', default: 40 },
    ],
    compute: v => {
      const expectancy = (v.winRate / 100) * v.avgWin - (1 - v.winRate / 100) * v.avgLoss
      return {
        metrics: [
          { label: 'Expectancy / trade', value: money(expectancy), highlight: expectancy < 0 },
          { label: 'Monthly', value: money(expectancy * v.trades), highlight: true },
          { label: 'Annualized', value: money(expectancy * v.trades * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Expected value per trade', money(expectancy)],
          ['Trades per month', v.trades.toString()],
          ['Monthly expectancy', money(expectancy * v.trades)],
        ],
        note: expectancy > 0 ? `Positive expectancy of ${money(expectancy)}/trade — over enough trades, volume works for you. Protect the edge; it's the whole game.` : `Negative expectancy — this system loses money on average, so more trading just loses faster. No amount of position sizing fixes a negative edge. Educational only.`,
      }
    },
  },
  {
    id: 'kelly-criterion-simulator', name: 'Kelly Criterion Calculator', category: 'Trading',
    tagline: 'The mathematically optimal bet size.',
    description: 'Enter your win probability and win/loss ratio to get the Kelly-optimal fraction of capital to risk — and the safer half-Kelly.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'winProb', label: 'Win probability', default: 55, suffix: '%' },
      { key: 'ratio', label: 'Win / loss size ratio', default: 1.5 },
    ],
    compute: v => {
      const p = v.winProb / 100, q = 1 - p, b = v.ratio
      const kelly = b > 0 ? (b * p - q) / b : 0
      return {
        metrics: [
          { label: 'Full Kelly', value: pct(Math.max(0, kelly)), highlight: true },
          { label: 'Half Kelly', value: pct(Math.max(0, kelly / 2)), highlight: true },
          { label: 'Edge', value: kelly > 0 ? 'Positive' : 'None', highlight: kelly <= 0 },
        ],
        columns: ['Sizing', 'Fraction of Capital'],
        rows: [
          ['Full Kelly', pct(Math.max(0, kelly))],
          ['Half Kelly (recommended)', pct(Math.max(0, kelly / 2))],
          ['Quarter Kelly (conservative)', pct(Math.max(0, kelly / 4))],
        ],
        note: kelly > 0 ? `Full Kelly maximizes long-run growth but is wild — most practitioners use half-Kelly to cut volatility for nearly the same growth. Never size above full Kelly; it guarantees eventual ruin. Educational only.` : `A negative Kelly means no edge — the math says don't bet at all. If you have no edge, sizing doesn't matter; you lose over time. Educational only.`,
      }
    },
  },
  {
    id: 'drawdown-recovery-simulator', name: 'Drawdown Recovery Calculator', category: 'Trading',
    tagline: 'Why losses hurt more than they look.',
    description: 'See the gain required to recover from a drawdown — the brutal asymmetry every trader and investor must respect.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'drawdown', label: 'Your drawdown', default: 30, suffix: '%' },
    ],
    compute: v => {
      const gain = (1 / (1 - v.drawdown / 100) - 1)
      const rows = [10, 20, 30, 50, 70].map(dd => [`${dd}%`, pct(1 / (1 - dd / 100) - 1)])
      return {
        metrics: [
          { label: 'Your drawdown', value: `${v.drawdown}%` },
          { label: 'Gain to recover', value: pct(gain), highlight: true },
        ],
        columns: ['Drawdown', 'Gain to Recover'],
        rows,
        note: `A ${v.drawdown}% loss needs a ${pct(gain)} gain just to get back to even — losses and gains are not symmetric. This is why capital preservation and stop-losses matter more than home runs. Educational only.`,
      }
    },
  },
  {
    id: 'leverage-liquidation-simulator', name: 'Leverage Liquidation Calculator', category: 'Trading',
    tagline: 'How small a move wipes a leveraged position.',
    description: 'Enter entry price and leverage to see your approximate liquidation price and how little the market must move against you.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'entry', label: 'Entry price', default: 100, prefix: '$' },
      { key: 'leverage', label: 'Leverage', default: 10 },
    ],
    compute: v => {
      const distance = v.leverage > 0 ? 1 / v.leverage : 0
      const liqLong = v.entry * (1 - distance)
      const liqShort = v.entry * (1 + distance)
      return {
        metrics: [
          { label: 'Move to liquidation', value: pct(distance), highlight: true },
          { label: 'Long liquidation ~', value: money(liqLong), highlight: true },
          { label: 'Short liquidation ~', value: money(liqShort) },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Leverage', `${v.leverage}x`],
          ['Move to wipe out', pct(distance)],
          ['Long liquidation price', money(liqLong)],
          ['Short liquidation price', money(liqShort)],
        ],
        note: `At ${v.leverage}x, only a ~${pct(distance)} move against you wipes the position (before fees and funding). High leverage magnifies gains and destroys accounts — it is the fastest way to lose everything. Educational only.`,
      }
    },
  },
  {
    id: 'compound-trading-simulator', name: 'Compound Trading Returns Simulator', category: 'Trading',
    tagline: 'What a small per-trade edge compounds to.',
    description: 'Model a steady average return per trade compounding over time. A deterministic illustration — real trading has variance and losing streaks.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'capital', label: 'Starting capital', default: 10000, prefix: '$' },
      { key: 'perTrade', label: 'Avg. return / trade', default: 1, suffix: '%' },
      { key: 'trades', label: 'Trades / month', default: 20 },
      { key: 'months', label: 'Months', default: 12 },
    ],
    compute: v => {
      const rows: string[][] = []
      let eq = v.capital
      const mo = Math.min(Math.max(v.months, 1), 60)
      for (let m = 1; m <= mo; m++) {
        eq *= Math.pow(1 + v.perTrade / 100, v.trades)
        if (m % 2 === 0) rows.push([`Month ${m}`, money(eq)])
      }
      return {
        metrics: [
          { label: 'Ending equity', value: money(eq), highlight: true },
          { label: 'Total return', value: pct(v.capital > 0 ? eq / v.capital - 1 : 0), highlight: true },
          { label: 'Multiple', value: `${(v.capital > 0 ? eq / v.capital : 0).toFixed(1)}x` },
        ],
        columns: ['Month', 'Equity'],
        rows,
        note: `Even a 1% edge compounds dramatically on paper — but this assumes no losing streaks or variance, which real trading always has. Use it to see the power of consistency, not as a forecast. Educational only.`,
      }
    },
  },
  {
    id: 'crypto-dca-simulator', name: 'Crypto DCA Simulator', category: 'Crypto',
    tagline: 'Model dollar-cost-averaging into a volatile asset.',
    description: 'Model regular purchases growing at an assumed rate. Crypto is far more volatile than any steady rate — this is an educational illustration, not a prediction.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'monthly', label: 'Monthly purchase', default: 500, prefix: '$' },
      { key: 'months', label: 'Months', default: 24 },
      { key: 'appreciation', label: 'Assumed annual appreciation', default: 20, suffix: '%' },
    ],
    compute: v => {
      const r = v.appreciation / 1200
      const mo = Math.min(Math.max(v.months, 1), 120)
      let value = 0
      for (let m = 1; m <= mo; m++) value += v.monthly * Math.pow(1 + r, mo - m)
      const invested = v.monthly * mo
      return {
        metrics: [
          { label: 'Ending value', value: money(value), highlight: true },
          { label: 'Invested', value: money(invested) },
          { label: 'Gain', value: money(value - invested), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Total invested', money(invested)],
          ['Ending value', money(value)],
          ['Gain', money(value - invested)],
        ],
        note: `DCA removes the pressure of timing a volatile market by buying steadily. This uses a smooth assumed rate; real crypto can swing wildly in both directions, so never invest more than you can afford to lose. Educational only, not investment advice.`,
      }
    },
  },
  {
    id: 'impermanent-loss-simulator', name: 'Impermanent Loss Simulator', category: 'Crypto',
    tagline: 'The hidden cost of providing liquidity.',
    description: 'Enter a price change in one paired asset to see the impermanent loss versus simply holding — the risk every DeFi liquidity provider takes.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'change', label: 'Price change of one asset', default: 50, suffix: '%' },
    ],
    compute: v => {
      const il = (change: number) => { const r = 1 + change / 100; return r > 0 ? 2 * Math.sqrt(r) / (1 + r) - 1 : -1 }
      const rows = [25, 50, 100, 200, -50].map(c => [`${c > 0 ? '+' : ''}${c}%`, pct(il(c))])
      return {
        metrics: [
          { label: 'Impermanent loss', value: pct(il(v.change)), highlight: true },
        ],
        columns: ['Price Change', 'Impermanent Loss'],
        rows,
        note: `Impermanent loss is what you give up versus just holding the two assets — the more one asset moves, the larger it grows. Trading fees earned must exceed this loss to make liquidity provision worthwhile. Educational only.`,
      }
    },
  },
  {
    id: 'yield-farming-apy-simulator', name: 'APR → APY Yield Simulator', category: 'Crypto',
    tagline: 'What compounding turns an APR into.',
    description: 'Enter an APR and compounding frequency to see the effective APY and annual earnings. High advertised yields usually carry high risk.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'principal', label: 'Principal', default: 10000, prefix: '$' },
      { key: 'apr', label: 'APR', default: 40, suffix: '%' },
      { key: 'compounds', label: 'Compounds / year', default: 365 },
    ],
    compute: v => {
      const n = Math.max(1, v.compounds)
      const apy = Math.pow(1 + v.apr / 100 / n, n) - 1
      return {
        metrics: [
          { label: 'Effective APY', value: pct(apy), highlight: true },
          { label: 'Annual earnings', value: money(v.principal * apy), highlight: true },
          { label: 'vs. simple APR', value: money(v.principal * (v.apr / 100)) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['APR', pct(v.apr / 100)],
          ['APY (compounded)', pct(apy)],
          ['Annual earnings', money(v.principal * apy)],
        ],
        note: `Frequent compounding turns a ${v.apr}% APR into a ${pct(apy)} APY. But eye-popping DeFi yields usually come from inflationary token rewards and carry smart-contract and de-peg risk — the yield can vanish faster than it compounds. Educational only.`,
      }
    },
  },
  {
    id: 'token-unlock-simulator', name: 'Token Unlock / Sell-Pressure Simulator', category: 'Crypto',
    tagline: 'How vesting unlocks dilute a token.',
    description: 'Model monthly token unlocks growing the circulating supply to see the sell pressure they add over time.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'total', label: 'Total supply', default: 1000000000 },
      { key: 'circulating', label: 'Circulating now', default: 200000000 },
      { key: 'unlock', label: 'Monthly unlock', default: 30000000 },
    ],
    compute: v => {
      const rows: string[][] = []
      let circ = v.circulating
      for (let m = 1; m <= 12; m++) {
        circ = Math.min(v.total, circ + v.unlock)
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(circ).toLocaleString(), pct(v.total > 0 ? circ / v.total : 0), pct(circ > 0 ? v.unlock / circ : 0)])
      }
      return {
        metrics: [
          { label: 'Circulating (mo 12)', value: Math.round(circ).toLocaleString(), highlight: true },
          { label: '% of total (mo 12)', value: pct(v.total > 0 ? circ / v.total : 0), highlight: true },
          { label: 'Monthly unlock / circ', value: pct(v.circulating > 0 ? v.unlock / v.circulating : 0) },
        ],
        columns: ['Month', 'Circulating', '% of Total', 'Unlock / Circ'],
        rows,
        note: `Unlocks add new supply that can be sold — when the monthly unlock is large relative to circulating supply, it's persistent sell pressure. Big "cliff" unlocks often precede price drops. Check vesting schedules before buying. Educational only.`,
      }
    },
  },
  {
    id: 'house-edge-simulator', name: 'House Edge Simulator', category: 'Betting',
    tagline: 'The math of why the house always wins.',
    description: 'Enter bet size, pace, and the game’s house edge to see your mathematically expected loss over a session. An odds-awareness tool.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'bet', label: 'Average bet', default: 50, prefix: '$' },
      { key: 'perHour', label: 'Bets per hour', default: 60 },
      { key: 'edge', label: 'House edge', default: 2.7, suffix: '%' },
      { key: 'hours', label: 'Hours played', default: 4 },
    ],
    compute: v => {
      const wagered = v.bet * v.perHour * v.hours
      const expectedLoss = wagered * (v.edge / 100)
      return {
        metrics: [
          { label: 'Expected loss', value: money(expectedLoss), highlight: true },
          { label: 'Total wagered', value: money(wagered) },
          { label: 'Loss per hour', value: money(v.hours > 0 ? expectedLoss / v.hours : 0), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Total wagered', money(wagered)],
          ['House edge', pct(v.edge / 100)],
          ['Expected loss', money(expectedLoss)],
        ],
        note: `The house edge guarantees that, over time, the math favors the casino — the longer you play, the closer your results move to this expected loss. Gamble only for entertainment with money you can afford to lose, never as income. If gambling is a problem, call 1-800-522-4700 (US).`,
      }
    },
  },
  {
    id: 'bet-expected-value-simulator', name: 'Bet Expected Value Calculator', category: 'Betting',
    tagline: 'Is a bet +EV — or is the book taking its cut?',
    description: 'Enter the odds, your true win probability, and stake to see the bet’s expected value and the break-even probability the odds imply.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'stake', label: 'Stake', default: 100, prefix: '$' },
      { key: 'odds', label: 'Decimal odds', default: 2.5 },
      { key: 'trueProb', label: 'Your true win probability', default: 35, suffix: '%' },
    ],
    compute: v => {
      const payout = v.stake * v.odds
      const p = v.trueProb / 100
      const ev = p * (payout - v.stake) - (1 - p) * v.stake
      const impliedProb = v.odds > 0 ? 1 / v.odds : 0
      return {
        metrics: [
          { label: 'Expected value', value: money(ev), highlight: ev < 0 },
          { label: 'EV per $1 staked', value: money(v.stake > 0 ? ev / v.stake : 0) },
          { label: 'Break-even probability', value: pct(impliedProb), highlight: true },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Potential payout', money(payout)],
          ['Break-even (implied) probability', pct(impliedProb)],
          ['Your probability', pct(p)],
          ['Expected value', money(ev)],
        ],
        note: ev > 0 ? `Positive EV only because you've assumed your probability beats the ${pct(impliedProb)} the odds imply — and books build in a margin (vig) that makes most bets negative EV. Be honest about your true edge. If gambling is a problem, call 1-800-522-4700 (US).` : `Negative EV — the odds imply you need to win ${pct(impliedProb)} of the time, more than your ${pct(p)}. Most bets are -EV by design; the house margin is the point. Educational only.`,
      }
    },
  },
  {
    id: 'gambling-risk-of-ruin-simulator', name: 'Gambling Risk of Ruin Simulator', category: 'Betting',
    tagline: 'How fast a bankroll disappears against an edge.',
    description: 'With any house edge, ruin is the long-run certainty — this shows the expected number of bets until a bankroll is gone.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'bankroll', label: 'Bankroll', default: 1000, prefix: '$' },
      { key: 'bet', label: 'Bet size', default: 50, prefix: '$' },
      { key: 'edge', label: 'House edge', default: 2, suffix: '%' },
    ],
    compute: v => {
      const lossPerBet = v.bet * (v.edge / 100)
      const bets = lossPerBet > 0 ? v.bankroll / lossPerBet : 0
      return {
        metrics: [
          { label: 'Expected bets to ruin', value: Math.round(bets).toLocaleString(), highlight: true },
          { label: 'Expected loss / bet', value: money(lossPerBet) },
          { label: 'Long-run outcome', value: 'Ruin', highlight: true },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Bankroll', money(v.bankroll)],
          ['Expected loss per bet', money(lossPerBet)],
          ['Expected bets to broke', Math.round(bets).toLocaleString()],
        ],
        note: `Against a house edge, the only question is how fast — the expected end state is always ruin. Variance can let you win for a while, which is exactly what keeps people playing. Set a hard loss limit and treat any wager as entertainment spending. Help: 1-800-522-4700 (US).`,
      }
    },
  },
  {
    id: 'parlay-odds-simulator', name: 'Parlay Odds Calculator', category: 'Betting',
    tagline: 'Why big parlay payouts are long shots.',
    description: 'Enter the number of legs and odds per leg to see the combined payout and how unlikely winning the whole parlay really is.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'legs', label: 'Number of legs', default: 4 },
      { key: 'oddsPerLeg', label: 'Decimal odds / leg', default: 1.9 },
      { key: 'stake', label: 'Stake', default: 50, prefix: '$' },
    ],
    compute: v => {
      const legs = Math.min(Math.max(Math.round(v.legs), 1), 15)
      const combined = Math.pow(v.oddsPerLeg, legs)
      const payout = v.stake * combined
      const implied = combined > 0 ? 1 / combined : 0
      return {
        metrics: [
          { label: 'Combined odds', value: `${combined.toFixed(1)}x`, highlight: true },
          { label: 'Potential payout', value: money(payout), highlight: true },
          { label: 'Implied win chance', value: pct(implied), highlight: true },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Legs', legs.toString()],
          ['Combined odds', `${combined.toFixed(1)}x`],
          ['Payout', money(payout)],
          ['Implied probability', pct(implied)],
        ],
        note: `Every added leg multiplies the payout — and the house edge. A ${legs}-leg parlay here has only about a ${pct(implied)} chance to hit, which is why books love them and long-term expected value is deeply negative. Educational only. Help: 1-800-522-4700 (US).`,
      }
    },
  },

  {
    id: 'pe-carry-waterfall-simulator', name: 'PE Carry Waterfall Simulator', category: 'Fundraising',
    tagline: 'How fund profits split between LPs and the GP.',
    description: 'Model a fund’s return through a preferred return and carried interest to see what LPs keep and what the GP earns.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'fund', label: 'Fund size', default: 100000000, prefix: '$' },
      { key: 'moic', label: 'Gross return (MOIC)', default: 2.5 },
      { key: 'hurdle', label: 'Preferred return / yr', default: 8, suffix: '%' },
      { key: 'carry', label: 'Carried interest', default: 20, suffix: '%' },
      { key: 'years', label: 'Fund life (years)', default: 5 },
    ],
    compute: v => {
      const totalValue = v.fund * v.moic
      const profit = totalValue - v.fund
      const pref = v.fund * (Math.pow(1 + v.hurdle / 100, v.years) - 1)
      const remaining = Math.max(0, profit - pref)
      const gpCarry = remaining * (v.carry / 100)
      const lpTotal = v.fund + pref + remaining * (1 - v.carry / 100)
      return {
        metrics: [
          { label: 'LP net MOIC', value: `${(v.fund > 0 ? lpTotal / v.fund : 0).toFixed(2)}x`, highlight: true },
          { label: 'GP carry', value: money(gpCarry), highlight: true },
          { label: 'LP total', value: money(lpTotal) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Total value', money(totalValue)],
          ['Return of capital (LP)', money(v.fund)],
          ['Preferred return (LP)', money(pref)],
          ['GP carried interest', money(gpCarry)],
          ['LP total', money(lpTotal)],
        ],
        note: `LPs get their capital plus a preferred return before the GP earns carry — that hurdle protects investors. The carry only kicks in on profits above it, aligning the GP to actually outperform. Educational only.`,
      }
    },
    sells: 'cap-table-model',
  },
  {
    id: 'vc-portfolio-simulator', name: 'VC Portfolio Returns Simulator', category: 'Fundraising',
    tagline: 'The power law behind venture returns.',
    description: 'Model a portfolio of investments with a mix of outcomes to see the fund’s overall return — and why a few winners carry everything.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'investments', label: 'Investments', default: 20 },
      { key: 'check', label: 'Check size', default: 500000, prefix: '$' },
      { key: 'zero', label: '% that return 0x', default: 50, suffix: '%' },
      { key: 'one', label: '% that return ~1x', default: 30, suffix: '%' },
      { key: 'ten', label: '% that return 10x', default: 15, suffix: '%' },
      { key: 'fifty', label: '% that return 50x', default: 5, suffix: '%' },
    ],
    compute: v => {
      const invested = v.investments * v.check
      const value = v.investments * v.check * ((v.one / 100) * 1 + (v.ten / 100) * 10 + (v.fifty / 100) * 50)
      return {
        metrics: [
          { label: 'Invested', value: money(invested) },
          { label: 'Portfolio value', value: money(value), highlight: true },
          { label: 'Fund MOIC', value: `${(invested > 0 ? value / invested : 0).toFixed(1)}x`, highlight: true },
        ],
        columns: ['Outcome', 'Deals', 'Value'],
        rows: [
          ['0x (write-offs)', Math.round(v.investments * v.zero / 100).toString(), money(0)],
          ['~1x', Math.round(v.investments * v.one / 100).toString(), money(v.investments * v.one / 100 * v.check)],
          ['10x', Math.round(v.investments * v.ten / 100).toString(), money(v.investments * v.ten / 100 * v.check * 10)],
          ['50x', Math.round(v.investments * v.fifty / 100).toString(), money(v.investments * v.fifty / 100 * v.check * 50)],
        ],
        note: `Half the portfolio can go to zero and the fund still wins — because the 50x winner returns more than everything else combined. Venture is a power-law game: you're hunting outliers, not batting average. Educational only.`,
      }
    },
    sells: 'cap-table-model',
  },
  {
    id: 'bond-pricing-simulator', name: 'Bond Pricing Simulator', category: 'Finance',
    tagline: 'Why bond prices move opposite to yields.',
    description: 'Enter coupon, yield-to-maturity, and term to price a bond and see whether it trades at a premium or discount.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'face', label: 'Face value', default: 1000, prefix: '$' },
      { key: 'coupon', label: 'Coupon rate', default: 5, suffix: '%' },
      { key: 'ytm', label: 'Yield to maturity', default: 6, suffix: '%' },
      { key: 'years', label: 'Years to maturity', default: 10 },
    ],
    compute: v => {
      const c = v.face * (v.coupon / 100)
      const y = v.ytm / 100
      let price = 0
      for (let t = 1; t <= v.years; t++) price += c / Math.pow(1 + y, t)
      price += v.face / Math.pow(1 + y, v.years)
      return {
        metrics: [
          { label: 'Bond price', value: money(price), highlight: true },
          { label: 'Current yield', value: pct(price > 0 ? c / price : 0), highlight: true },
          { label: 'Trades at', value: price > v.face ? 'Premium' : price < v.face ? 'Discount' : 'Par' },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Annual coupon', money(c)],
          ['Price', money(price)],
          ['vs. face', money(price - v.face)],
        ],
        note: `Because the coupon is fixed, when market yields rise above it the bond must fall below face to compete — and vice versa. That inverse relationship is the core of fixed-income risk. Educational only.`,
      }
    },
  },
  {
    id: 'annuity-income-simulator', name: 'Annuity Income Simulator', category: 'Money',
    tagline: 'Trade a lump sum for guaranteed income.',
    description: 'Enter a premium and payout rate to see the guaranteed annual and monthly income an annuity provides.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'premium', label: 'Premium (lump sum)', default: 250000, prefix: '$' },
      { key: 'payout', label: 'Annual payout rate', default: 6, suffix: '%' },
      { key: 'years', label: 'Payout years', default: 20 },
    ],
    compute: v => {
      const annual = v.premium * (v.payout / 100)
      return {
        metrics: [
          { label: 'Annual income', value: money(annual), highlight: true },
          { label: 'Monthly income', value: money(annual / 12), highlight: true },
          { label: 'Total over period', value: money(annual * v.years) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Premium', money(v.premium)],
          ['Annual income', money(annual)],
          ['Total received', money(annual * v.years)],
        ],
        note: `Annuities convert savings into guaranteed income you can't outlive — the trade is liquidity and upside for certainty. Weigh the payout rate against what a diversified portfolio might yield, and watch the fees. Educational only.`,
      }
    },
  },
  {
    id: 'pension-lump-vs-annuity-simulator', name: 'Pension: Lump Sum vs. Annuity', category: 'Money',
    tagline: 'Take the lump sum, or the monthly check?',
    description: 'Compare a pension lump sum to lifetime monthly payments to see the payout rate and simple break-even.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'lump', label: 'Lump sum offer', default: 500000, prefix: '$' },
      { key: 'monthly', label: 'Monthly pension', default: 2800, prefix: '$' },
    ],
    compute: v => {
      const annual = v.monthly * 12
      const rate = v.lump > 0 ? annual / v.lump : 0
      const payback = annual > 0 ? v.lump / annual : 0
      return {
        metrics: [
          { label: 'Pension payout rate', value: pct(rate), highlight: true },
          { label: 'Simple break-even', value: `${payback.toFixed(1)} yr`, highlight: true },
          { label: 'Annual pension', value: money(annual) },
        ],
        columns: ['Line', 'Value'],
        rows: [
          ['Lump sum', money(v.lump)],
          ['Annual pension', money(annual)],
          ['Payout rate', pct(rate)],
          ['Years to recover lump', `${payback.toFixed(1)}`],
        ],
        note: `The pension effectively pays ${pct(rate)} a year for life. Take the annuity if you value longevity insurance and can't reliably beat that rate; take the lump if you want flexibility, can invest well, or want to leave an estate. Educational only.`,
      }
    },
  },
  {
    id: 'reverse-mortgage-simulator', name: 'Reverse Mortgage Estimator', category: 'Money',
    tagline: 'Roughly how much equity you could access.',
    description: 'Estimate the funds a reverse mortgage might make available based on home value and age. A rough educational estimate only.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'value', label: 'Home value', default: 500000, prefix: '$' },
      { key: 'age', label: 'Borrower age', default: 70 },
      { key: 'mortgage', label: 'Existing mortgage', default: 50000, prefix: '$' },
    ],
    compute: v => {
      const plf = Math.max(0.2, Math.min(0.6, 0.30 + (v.age - 62) * 0.01))
      const gross = v.value * plf
      const net = Math.max(0, gross - v.mortgage)
      return {
        metrics: [
          { label: 'Available (net)', value: money(net), highlight: true },
          { label: 'Principal limit', value: money(gross) },
          { label: 'Limit factor', value: pct(plf) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Home value', money(v.value)],
          ['Principal limit', money(gross)],
          ['Existing mortgage payoff', money(v.mortgage)],
          ['Net available', money(net)],
        ],
        note: `Older borrowers can access a larger share of equity. This is a rough estimate — actual amounts depend on interest rates, program limits, and fees, which can be significant. Reverse mortgages reduce the estate you leave. Educational only.`,
      }
    },
  },
  {
    id: 'development-proforma-simulator', name: 'Real Estate Development Pro Forma', category: 'Real Estate',
    tagline: 'Does the build pencil out?',
    description: 'Model land plus construction cost against stabilized rent and an exit cap rate to see development profit and return on cost.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'land', label: 'Land cost', default: 2000000, prefix: '$' },
      { key: 'construction', label: 'Construction cost', default: 8000000, prefix: '$' },
      { key: 'units', label: 'Units', default: 40 },
      { key: 'rent', label: 'Rent / unit / mo', default: 1800, prefix: '$' },
      { key: 'expenseRatio', label: 'Expense ratio', default: 35, suffix: '%' },
      { key: 'exitCap', label: 'Exit cap rate', default: 5.5, suffix: '%' },
    ],
    compute: v => {
      const cost = v.land + v.construction
      const noi = v.units * v.rent * 12 * (1 - v.expenseRatio / 100)
      const exitValue = noi / (v.exitCap / 100)
      const profit = exitValue - cost
      const yieldOnCost = cost > 0 ? noi / cost : 0
      return {
        metrics: [
          { label: 'Development profit', value: money(profit), highlight: profit < 0 },
          { label: 'Return on cost', value: pct(cost > 0 ? profit / cost : 0), highlight: true },
          { label: 'Yield on cost', value: pct(yieldOnCost), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Total cost', money(cost)],
          ['Stabilized NOI', money(noi)],
          ['Exit value', money(exitValue)],
          ['Profit', money(profit)],
        ],
        note: `The "development spread" — yield on cost (${pct(yieldOnCost)}) minus the market exit cap (${v.exitCap}%) — is the developer's margin for risk. A thin spread leaves no room for cost overruns or a softening market. Educational only.`,
      }
    },
  },
  {
    id: 'syndication-return-simulator', name: 'RE Syndication LP Return Simulator', category: 'Real Estate',
    tagline: 'What a passive investor earns in a syndication.',
    description: 'Model cash flow plus a sale to estimate an LP’s equity multiple and approximate annualized return.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'investment', label: 'LP investment', default: 100000, prefix: '$' },
      { key: 'cashFlow', label: 'Annual cash-on-cash', default: 6, suffix: '%' },
      { key: 'hold', label: 'Hold (years)', default: 5 },
      { key: 'saleMultiple', label: 'Equity multiple at sale', default: 1.6 },
    ],
    compute: v => {
      const annualCash = v.investment * (v.cashFlow / 100)
      const totalCash = annualCash * v.hold
      const saleReturn = v.investment * v.saleMultiple
      const total = totalCash + saleReturn
      const em = v.investment > 0 ? total / v.investment : 0
      const irr = v.hold > 0 && em > 0 ? Math.pow(em, 1 / v.hold) - 1 : 0
      return {
        metrics: [
          { label: 'Equity multiple', value: `${em.toFixed(2)}x`, highlight: true },
          { label: 'Approx. annual return', value: pct(irr), highlight: true },
          { label: 'Total received', value: money(total) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Cash flow (total)', money(totalCash)],
          ['Sale proceeds', money(saleReturn)],
          ['Total', money(total)],
          ['Equity multiple', `${em.toFixed(2)}x`],
        ],
        note: `Passive real-estate returns come in two parts: steady cash flow plus a lump at sale. Equity multiple and IRR tell different stories — a quick flip can show a high IRR but a low multiple. Educational only; deals carry real risk.`,
      }
    },
  },
  {
    id: 'nnn-lease-simulator', name: 'NNN Lease Yield Simulator', category: 'Real Estate',
    tagline: 'Project yield on a triple-net investment.',
    description: 'Model a net-lease property’s cap rate and rent escalations to see yield-on-cost climb over the hold.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'rent', label: 'Annual rent', default: 120000, prefix: '$' },
      { key: 'price', label: 'Purchase price', default: 2000000, prefix: '$' },
      { key: 'escalation', label: 'Annual rent escalation', default: 2, suffix: '%' },
      { key: 'years', label: 'Hold (years)', default: 10 },
    ],
    compute: v => {
      const cap = v.price > 0 ? v.rent / v.price : 0
      const rows: string[][] = []
      let rent = v.rent
      const yrs = Math.min(Math.max(v.years, 1), 25)
      for (let y = 1; y <= yrs; y++) {
        if (y > 1) rent *= 1 + v.escalation / 100
        if (y % 2 === 0 || y === yrs) rows.push([`Year ${y}`, money(rent), pct(v.price > 0 ? rent / v.price : 0)])
      }
      return {
        metrics: [
          { label: 'Going-in cap rate', value: pct(cap), highlight: true },
          { label: `Yield on cost (yr ${yrs})`, value: pct(v.price > 0 ? rent / v.price : 0), highlight: true },
          { label: `Rent (yr ${yrs})`, value: money(rent) },
        ],
        columns: ['Year', 'Rent', 'Yield on Cost'],
        rows,
        note: `Triple-net is about as passive as real estate gets — the tenant pays taxes, insurance, and maintenance. Your return rides on the tenant's credit and the rent escalations; a strong tenant on a long lease is the whole thesis. Educational only.`,
      }
    },
  },
  {
    id: 'wholesale-vs-dtc-simulator', name: 'Wholesale vs. DTC Simulator', category: 'Retail',
    tagline: 'Higher margin, or more volume?',
    description: 'Compare selling direct-to-consumer against wholesale to see which channel makes more profit at your volumes.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cost', label: 'Unit cost', default: 10, prefix: '$' },
      { key: 'dtcPrice', label: 'DTC price', default: 40, prefix: '$' },
      { key: 'dtcVolume', label: 'DTC units / mo', default: 1000 },
      { key: 'wholesalePrice', label: 'Wholesale price', default: 20, prefix: '$' },
      { key: 'wholesaleVolume', label: 'Wholesale units / mo', default: 4000 },
    ],
    compute: v => {
      const dtc = (v.dtcPrice - v.cost) * v.dtcVolume
      const wholesale = (v.wholesalePrice - v.cost) * v.wholesaleVolume
      return {
        metrics: [
          { label: 'DTC profit / mo', value: money(dtc), highlight: dtc >= wholesale },
          { label: 'Wholesale profit / mo', value: money(wholesale), highlight: wholesale > dtc },
          { label: 'Winner', value: dtc >= wholesale ? 'DTC' : 'Wholesale' },
        ],
        columns: ['Channel', 'Margin / Unit', 'Monthly Profit'],
        rows: [
          ['DTC', money(v.dtcPrice - v.cost), money(dtc)],
          ['Wholesale', money(v.wholesalePrice - v.cost), money(wholesale)],
        ],
        note: `DTC keeps the full margin and the customer relationship; wholesale trades margin for volume and shelf space you couldn't reach alone. Most durable brands run both — DTC for margin and data, wholesale for scale. Educational only.`,
      }
    },
  },
  {
    id: 'retention-curve-ltv-simulator', name: 'Retention Curve LTV Simulator', category: 'SaaS',
    tagline: 'A realistic LTV — churn that improves with age.',
    description: 'Model a cohort whose churn declines as it matures (as real ones do) to get an LTV that flat-churn models miss.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'start', label: 'Cohort size', default: 1000 },
      { key: 'firstChurn', label: 'Month-1 churn', default: 10, suffix: '%' },
      { key: 'decline', label: 'Churn decline / mo (pts)', default: 0.5 },
      { key: 'arpu', label: 'ARPU / mo', default: 50, prefix: '$' },
      { key: 'margin', label: 'Gross margin', default: 80, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let active = v.start, cumMargin = 0, churn = v.firstChurn
      for (let m = 1; m <= 24; m++) {
        active = active * (1 - churn / 100)
        cumMargin += active * v.arpu * (v.margin / 100)
        churn = Math.max(2, churn - v.decline)
        if (m % 3 === 0) rows.push([`Month ${m}`, Math.round(active).toString(), money(cumMargin)])
      }
      return {
        metrics: [
          { label: 'LTV / customer', value: money(v.start > 0 ? cumMargin / v.start : 0), highlight: true },
          { label: 'Retained (mo 24)', value: pct(v.start > 0 ? active / v.start : 0), highlight: true },
          { label: '24-mo margin', value: money(cumMargin) },
        ],
        columns: ['Month', 'Active', 'Cumulative Margin'],
        rows,
        note: `Real retention curves flatten — the customers who survive the early months tend to stay for years. Flat-churn LTV models understate the value of those loyal survivors, and with it how much you can spend to acquire. Educational only.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'franchisor-revenue-simulator', name: 'Franchisor Revenue Simulator', category: 'Franchise',
    tagline: 'How a franchisor makes money as it sells units.',
    description: 'Model selling franchises over several years to see franchise-fee and royalty revenue build for the franchisor.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'units', label: 'Starting units', default: 10 },
      { key: 'newPerYear', label: 'New units / year', default: 8 },
      { key: 'fee', label: 'Franchise fee', default: 40000, prefix: '$' },
      { key: 'unitRevenue', label: 'Avg. unit revenue', default: 900000, prefix: '$' },
      { key: 'royalty', label: 'Royalty rate', default: 6, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let units = v.units
      for (let y = 1; y <= 5; y++) {
        const newUnits = y === 1 ? 0 : v.newPerYear
        units += newUnits
        const feeRev = (y === 1 ? v.units : v.newPerYear) * v.fee
        const royaltyRev = units * v.unitRevenue * (v.royalty / 100)
        rows.push([`Year ${y}`, units.toString(), money(feeRev), money(royaltyRev)])
      }
      const royaltyFinal = units * v.unitRevenue * (v.royalty / 100)
      return {
        metrics: [
          { label: 'Units (yr 5)', value: units.toString(), highlight: true },
          { label: 'Royalty revenue (yr 5)', value: money(royaltyFinal), highlight: true },
          { label: 'Fee revenue (yr 5)', value: money(v.newPerYear * v.fee) },
        ],
        columns: ['Year', 'Units', 'Fee Revenue', 'Royalty Revenue'],
        rows,
        note: `Franchisors earn two ways: lumpy upfront fees from selling units, and recurring royalties on every unit's sales. The royalty stream is the real asset — it compounds as the system grows and is what makes franchising so scalable. Educational only.`,
      }
    },
  },

  {
    id: 'shopify-dtc-simulator', name: 'Shopify DTC Store Simulator', category: 'E-Commerce',
    tagline: 'Project a DTC store from traffic to profit.',
    description: 'Model traffic growth through conversion and AOV against COGS and ad spend to see monthly revenue and profit build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'traffic', label: 'Month 1 traffic', default: 30000 },
      { key: 'growth', label: 'Traffic growth / mo', default: 8, suffix: '%' },
      { key: 'conversion', label: 'Conversion rate', default: 2, suffix: '%' },
      { key: 'aov', label: 'Average order value', default: 65, prefix: '$' },
      { key: 'cogs', label: 'COGS %', default: 40, suffix: '%' },
      { key: 'adPct', label: 'Ad spend (% of revenue)', default: 20, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let traffic = v.traffic
      for (let m = 1; m <= 12; m++) {
        if (m > 1) traffic *= 1 + v.growth / 100
        const revenue = traffic * (v.conversion / 100) * v.aov
        const profit = revenue * (1 - v.cogs / 100) - revenue * (v.adPct / 100)
        if (m % 2 === 0) rows.push([`Month ${m}`, money(revenue), money(profit)])
      }
      const revFinal = traffic * (v.conversion / 100) * v.aov
      return {
        metrics: [
          { label: 'Revenue (mo 12)', value: money(revFinal), highlight: true },
          { label: 'Profit (mo 12)', value: money(revFinal * (1 - v.cogs / 100) - revFinal * (v.adPct / 100)), highlight: true },
          { label: 'Annualized profit', value: money((revFinal * (1 - v.cogs / 100) - revFinal * (v.adPct / 100)) * 12) },
        ],
        columns: ['Month', 'Revenue', 'Profit'],
        rows,
        note: `DTC profit hides between COGS and ad spend — if the two together approach your price, growth just loses money faster. Conversion rate and repeat purchases are what make the ad math work. Educational only.`,
      }
    },
  },
  {
    id: 'amazon-fba-launch-simulator', name: 'Amazon FBA Launch Simulator', category: 'E-Commerce',
    tagline: 'Project a product launch to break-even.',
    description: 'Model unit sales ramping as rank improves against per-unit profit and launch cost to find the break-even month.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'units', label: 'Month 1 units', default: 200 },
      { key: 'growth', label: 'Unit growth / mo', default: 20, suffix: '%' },
      { key: 'profitPerUnit', label: 'Profit per unit (post-fees)', default: 8, prefix: '$' },
      { key: 'launchCost', label: 'Launch cost (inventory + setup)', default: 15000, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let units = v.units, cum = -v.launchCost, be = 0
      for (let m = 1; m <= 12; m++) {
        if (m > 1) units *= 1 + v.growth / 100
        cum += units * v.profitPerUnit
        if (be === 0 && cum >= 0) be = m
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(units).toString(), money(cum)])
      }
      return {
        metrics: [
          { label: 'Break-even month', value: be ? `Month ${be}` : '> 12mo', highlight: true },
          { label: 'Profit (mo 12)', value: money(units * v.profitPerUnit), highlight: true },
          { label: 'Net (mo 12)', value: money(cum) },
        ],
        columns: ['Month', 'Units', 'Cumulative Net'],
        rows,
        note: `FBA launches burn cash early — inventory and PPC come before the rank that drives organic sales. The winners survive to break-even (month ${be || '12+'}) and then compound; the losers run out of inventory cash first. Educational only.`,
      }
    },
  },
  {
    id: 'ev-charging-station-simulator', name: 'EV Charging Station Simulator', category: 'Energy',
    tagline: 'Project profit from a charging site.',
    description: 'Model chargers and session volume against energy cost and fixed overhead to see monthly profit and revenue per charger.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'chargers', label: 'Chargers', default: 8 },
      { key: 'sessions', label: 'Sessions / charger / day', default: 6 },
      { key: 'kwh', label: 'kWh per session', default: 30 },
      { key: 'price', label: 'Price per kWh', default: 0.45, prefix: '$' },
      { key: 'cost', label: 'Electricity cost / kWh', default: 0.12, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 3000, prefix: '$' },
    ],
    compute: v => {
      const monthlyKwh = v.chargers * v.sessions * 30 * v.kwh
      const revenue = monthlyKwh * v.price
      const energy = monthlyKwh * v.cost
      const profit = revenue - energy - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue / charger', value: money(v.chargers > 0 ? revenue / v.chargers : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Energy delivered', `${Math.round(monthlyKwh).toLocaleString()} kWh`],
          ['Revenue', money(revenue)],
          ['Electricity cost', money(energy)],
          ['Fixed costs', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Utilization is everything — a charger sitting idle still costs demand charges and capital. The margin between what you charge per kWh and what you pay is thin, so site traffic and uptime make or break the economics. Educational only.`,
      }
    },
  },
  {
    id: 'oil-well-decline-simulator', name: 'Oil Well Decline Simulator', category: 'Energy',
    tagline: 'Project production and revenue as a well declines.',
    description: 'Model a well’s natural production decline against price and operating cost to see revenue fall over the years.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'initial', label: 'Initial production (bbl/day)', default: 100 },
      { key: 'decline', label: 'Annual decline', default: 30, suffix: '%' },
      { key: 'price', label: 'Price per barrel', default: 70, prefix: '$' },
      { key: 'opex', label: 'Opex per barrel', default: 25, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let daily = v.initial, cumProfit = 0
      for (let y = 1; y <= 6; y++) {
        if (y > 1) daily *= 1 - v.decline / 100
        const annualBbl = daily * 365
        const profit = annualBbl * (v.price - v.opex)
        cumProfit += profit
        rows.push([`Year ${y}`, daily.toFixed(0), money(annualBbl * v.price), money(profit)])
      }
      return {
        metrics: [
          { label: 'Year 1 profit', value: money(v.initial * 365 * (v.price - v.opex)), highlight: true },
          { label: '6-yr cumulative', value: money(cumProfit), highlight: true },
          { label: 'Production (yr 6)', value: `${daily.toFixed(0)} bbl/day` },
        ],
        columns: ['Year', 'Bbl / Day', 'Revenue', 'Profit'],
        rows,
        note: `Wells front-load their returns — most cash comes in the first couple of years before decline sets in. That's why payback speed matters more than headline reserves, and why price at the start is so critical. Educational only.`,
      }
    },
  },
  {
    id: 'cattle-ranch-simulator', name: 'Cattle Ranch Profit Simulator', category: 'Manufacturing',
    tagline: 'Project profit on a cattle operation.',
    description: 'Model buying, feeding, and selling cattle to see the margin — and how sensitive it is to price spreads.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'head', label: 'Head of cattle', default: 200 },
      { key: 'buyWeight', label: 'Purchase weight (lbs)', default: 500 },
      { key: 'buyPrice', label: 'Buy price / lb', default: 1.8, prefix: '$' },
      { key: 'sellWeight', label: 'Sale weight (lbs)', default: 1200 },
      { key: 'sellPrice', label: 'Sell price / lb', default: 1.45, prefix: '$' },
      { key: 'feed', label: 'Feed cost / head', default: 400, prefix: '$' },
    ],
    compute: v => {
      const buyCost = v.head * v.buyWeight * v.buyPrice
      const saleRev = v.head * v.sellWeight * v.sellPrice
      const feed = v.head * v.feed
      const profit = saleRev - buyCost - feed
      return {
        metrics: [
          { label: 'Total profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / head', value: money(v.head > 0 ? profit / v.head : 0), highlight: true },
          { label: 'Margin', value: pct(saleRev > 0 ? profit / saleRev : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Sale revenue', money(saleRev)],
          ['Purchase cost', money(buyCost)],
          ['Feed cost', money(feed)],
          ['Profit', money(profit)],
        ],
        note: `Cattle margins are thin and brutally price-sensitive — a small drop in sell price or spike in feed can flip a profit to a loss. Ranchers often hedge cattle and feed prices for exactly this reason. Educational only.`,
      }
    },
  },
  {
    id: 'tutoring-center-simulator', name: 'Tutoring Center Simulator', category: 'Education',
    tagline: 'Project a tutoring center’s monthly profit.',
    description: 'Model student volume and session pricing against tutor pay and fixed costs to see profit and margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'students', label: 'Active students', default: 120 },
      { key: 'sessions', label: 'Sessions / student / mo', default: 8 },
      { key: 'price', label: 'Price per session', default: 40, prefix: '$' },
      { key: 'tutorPay', label: 'Tutor pay / session', default: 20, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 8000, prefix: '$' },
    ],
    compute: v => {
      const sessions = v.students * v.sessions
      const revenue = sessions * v.price
      const tutor = sessions * v.tutorPay
      const profit = revenue - tutor - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Margin', value: pct(revenue > 0 ? profit / revenue : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Tutor pay', money(tutor)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Tutoring scales on the spread between session price and tutor pay, times volume. Group sessions and packages lift revenue per tutor-hour — the biggest lever once your schedule is full. Educational only.`,
      }
    },
  },
  {
    id: 'coding-bootcamp-simulator', name: 'Coding Bootcamp Simulator', category: 'Education',
    tagline: 'Project a bootcamp’s annual profit.',
    description: 'Model cohorts and tuition against instructor, marketing, and fixed costs to see annual profit and per-student economics.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cohorts', label: 'Cohorts / year', default: 6 },
      { key: 'students', label: 'Students / cohort', default: 25 },
      { key: 'tuition', label: 'Tuition', default: 12000, prefix: '$' },
      { key: 'instructor', label: 'Instructor cost / cohort', default: 40000, prefix: '$' },
      { key: 'marketing', label: 'Marketing / student', default: 800, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 20000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.cohorts * v.students * v.tuition
      const instructor = v.cohorts * v.instructor
      const marketing = v.cohorts * v.students * v.marketing
      const fixed = v.fixed * 12
      const profit = revenue - instructor - marketing - fixed
      return {
        metrics: [
          { label: 'Annual profit', value: money(profit), highlight: profit < 0 },
          { label: 'Margin', value: pct(revenue > 0 ? profit / revenue : 0), highlight: true },
          { label: 'Profit / student', value: money(v.cohorts * v.students > 0 ? profit / (v.cohorts * v.students) : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Instructor cost', money(instructor)],
          ['Marketing', money(marketing)],
          ['Fixed', money(fixed)],
          ['Profit', money(profit)],
        ],
        note: `Bootcamps live on filling cohorts — an under-filled cohort still costs a full instructor. Marketing cost per enrolled student and outcomes (which drive referrals) are what make the model sustainable. Educational only.`,
      }
    },
  },
  {
    id: 'accounting-firm-simulator', name: 'Accounting Firm Simulator', category: 'Professional',
    tagline: 'Project a firm’s profit and profit per partner.',
    description: 'Model client fees against staff leverage to see firm profit and what each partner earns.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'clients', label: 'Clients', default: 200 },
      { key: 'fee', label: 'Average annual fee', default: 5000, prefix: '$' },
      { key: 'partners', label: 'Partners', default: 3 },
      { key: 'staffPerPartner', label: 'Staff per partner', default: 4 },
      { key: 'staffCost', label: 'Cost per staff', default: 70000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.clients * v.fee
      const staff = v.partners * v.staffPerPartner
      const staffCost = staff * v.staffCost
      const profit = revenue - staffCost
      return {
        metrics: [
          { label: 'Revenue', value: money(revenue) },
          { label: 'Profit', value: money(profit), highlight: true },
          { label: 'Profit / partner', value: money(v.partners > 0 ? profit / v.partners : 0), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Staff cost', money(staffCost)],
          ['Profit', money(profit)],
          ['Per partner', money(v.partners > 0 ? profit / v.partners : 0)],
        ],
        note: `Leverage — staff generating fees above their cost — is what lets a firm's profit-per-partner exceed a solo practitioner's. Recurring compliance work plus advisory upsells is the durable model. Educational only.`,
      }
    },
  },
  {
    id: 'rideshare-driver-simulator', name: 'Rideshare Driver Earnings Simulator', category: 'Transportation',
    tagline: 'What you actually keep after the platform and the car.',
    description: 'Model fares against the platform cut and vehicle costs to see true net earnings and effective hourly pay.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'hours', label: 'Hours / week', default: 40 },
      { key: 'fares', label: 'Gross fares / hour', default: 25, prefix: '$' },
      { key: 'cut', label: 'Platform cut', default: 25, suffix: '%' },
      { key: 'expenses', label: 'Vehicle cost / hour', default: 6, prefix: '$' },
    ],
    compute: v => {
      const gross = v.hours * v.fares
      const afterPlatform = gross * (1 - v.cut / 100)
      const expenses = v.hours * v.expenses
      const net = afterPlatform - expenses
      return {
        metrics: [
          { label: 'Weekly net', value: money(net), highlight: true },
          { label: 'Effective hourly', value: money(v.hours > 0 ? net / v.hours : 0), highlight: true },
          { label: 'Annualized', value: money(net * 52) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Gross fares', money(gross)],
          ['Platform cut', money(-(gross * (v.cut / 100)))],
          ['Vehicle costs', money(-expenses)],
          ['Net', money(net)],
        ],
        note: `The headline fare is misleading — after the platform's cut and real vehicle costs (gas, maintenance, depreciation), the effective hourly is much lower. Track cost per mile; it's the number most drivers underestimate. Educational only.`,
      }
    },
  },
  {
    id: 'nonprofit-endowment-simulator', name: 'Nonprofit Endowment Simulator', category: 'Nonprofit',
    tagline: 'Will the endowment last forever — or erode?',
    description: 'Model corpus, spending rate, return, and inflation to see whether an endowment grows or shrinks in real terms.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'corpus', label: 'Endowment corpus', default: 5000000, prefix: '$' },
      { key: 'spend', label: 'Spending rate', default: 4, suffix: '%' },
      { key: 'return', label: 'Investment return', default: 6, suffix: '%' },
      { key: 'inflation', label: 'Inflation', default: 2.5, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let corpus = v.corpus
      for (let y = 1; y <= 20; y++) {
        const spend = corpus * (v.spend / 100)
        corpus = corpus * (1 + v.return / 100) - spend
        if (y % 5 === 0 || y === 20) rows.push([`Year ${y}`, money(corpus), money(spend)])
      }
      const realGrowth = v.return - v.spend - v.inflation
      return {
        metrics: [
          { label: 'Corpus (yr 20)', value: money(corpus), highlight: true },
          { label: 'Real growth / yr', value: pct(realGrowth / 100), highlight: realGrowth < 0 },
          { label: 'Sustainable?', value: realGrowth >= 0 ? 'Yes' : 'Eroding', highlight: realGrowth < 0 },
        ],
        columns: ['Year', 'Corpus', 'Annual Spending'],
        rows,
        note: realGrowth >= 0 ? `Return minus spending exceeds inflation, so the endowment grows in real terms — it can support the mission in perpetuity.` : `Spending plus inflation outpaces return, so the corpus erodes in real terms over time. Trim the spending rate or accept a shrinking real endowment. Educational only.`,
      }
    },
  },
  {
    id: 'recurring-revenue-valuation-simulator', name: 'Recurring Revenue Valuation Simulator', category: 'SaaS',
    tagline: 'Watch ARR and valuation compound together.',
    description: 'Model ARR growth at a revenue multiple to see how a recurring-revenue business’s valuation climbs over the years.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'arr', label: 'Current ARR', default: 2000000, prefix: '$' },
      { key: 'growth', label: 'Annual growth', default: 60, suffix: '%' },
      { key: 'multiple', label: 'Revenue multiple', default: 8 },
      { key: 'years', label: 'Years', default: 3 },
    ],
    compute: v => {
      const rows: string[][] = []
      let arr = v.arr
      const yrs = Math.min(Math.max(v.years, 1), 10)
      for (let y = 1; y <= yrs; y++) {
        arr *= 1 + v.growth / 100
        rows.push([`Year ${y}`, money(arr), money(arr * v.multiple)])
      }
      return {
        metrics: [
          { label: `ARR (yr ${yrs})`, value: money(arr), highlight: true },
          { label: `Valuation (yr ${yrs})`, value: money(arr * v.multiple), highlight: true },
          { label: 'Multiple', value: `${v.multiple}x` },
        ],
        columns: ['Year', 'ARR', 'Valuation'],
        rows,
        note: `Valuation is ARR times a multiple — and the multiple itself rises with growth and retention. That double compounding is why a few points of growth swing enterprise value by millions. Educational only.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'self-publishing-simulator', name: 'Self-Publishing Backlist Simulator', category: 'Creator',
    tagline: 'Watch a book catalog compound into income.',
    description: 'Model publishing more titles each year, with a growing backlist earning royalties, to see author income build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'books', label: 'Starting titles', default: 5 },
      { key: 'newPerYear', label: 'New titles / year', default: 4 },
      { key: 'salesPerBook', label: 'Sales / book / mo', default: 80 },
      { key: 'royalty', label: 'Royalty per sale', default: 4, prefix: '$' },
    ],
    compute: v => {
      const rows: string[][] = []
      let books = v.books
      for (let y = 1; y <= 5; y++) {
        if (y > 1) books += v.newPerYear
        const monthly = books * v.salesPerBook * v.royalty
        rows.push([`Year ${y}`, books.toString(), money(monthly), money(monthly * 12)])
      }
      const monthlyFinal = books * v.salesPerBook * v.royalty
      return {
        metrics: [
          { label: 'Titles (yr 5)', value: books.toString(), highlight: true },
          { label: 'Monthly income (yr 5)', value: money(monthlyFinal), highlight: true },
          { label: 'Annualized', value: money(monthlyFinal * 12) },
        ],
        columns: ['Year', 'Titles', 'Monthly Income', 'Annual'],
        rows,
        note: `The backlist is the asset — every title you publish keeps earning while you write the next, so income compounds with catalog size. Prolific authors win less on any single book than on the library. Educational only.`,
      }
    },
  },

  {
    id: 'brewery-simulator', name: 'Brewery Profit Simulator', category: 'Manufacturing',
    tagline: 'Project a brewery’s profit as volume grows.',
    description: 'Model barrel volume against cost per barrel and fixed overhead to see monthly profit and margin build.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'barrels', label: 'Barrels / month', default: 200 },
      { key: 'revenue', label: 'Revenue per barrel', default: 250, prefix: '$' },
      { key: 'cogs', label: 'Cost per barrel', default: 90, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 30000, prefix: '$' },
      { key: 'growth', label: 'Volume growth / mo', default: 3, suffix: '%' },
    ],
    compute: v => {
      const rows: string[][] = []
      let barrels = v.barrels
      for (let m = 1; m <= 12; m++) {
        if (m > 1) barrels *= 1 + v.growth / 100
        const profit = barrels * (v.revenue - v.cogs) - v.fixed
        if (m % 2 === 0) rows.push([`Month ${m}`, Math.round(barrels).toString(), money(profit)])
      }
      return {
        metrics: [
          { label: 'Profit (mo 12)', value: money(barrels * (v.revenue - v.cogs) - v.fixed), highlight: true },
          { label: 'Annualized', value: money((barrels * (v.revenue - v.cogs) - v.fixed) * 12), highlight: true },
          { label: 'Barrels (mo 12)', value: Math.round(barrels).toString() },
        ],
        columns: ['Month', 'Barrels', 'Monthly Profit'],
        rows,
        note: `Taproom pints carry far higher margin per barrel than wholesale kegs — the sales mix drives profit as much as volume. Reaching the break-even barrel count is the whole early-stage game. Educational only.`,
      }
    },
  },
  {
    id: 'cannabis-dispensary-simulator', name: 'Cannabis Dispensary Simulator', category: 'Retail',
    tagline: 'Project profit after the heavy taxes.',
    description: 'Model transaction volume and basket size against margin, excise tax, and fixed costs to see a dispensary’s real profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'tx', label: 'Transactions / day', default: 300 },
      { key: 'basket', label: 'Average basket', default: 65, prefix: '$' },
      { key: 'margin', label: 'Gross margin', default: 50, suffix: '%' },
      { key: 'excise', label: 'Excise / sales tax', default: 15, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 60000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.tx * v.basket * 30
      const gross = revenue * (v.margin / 100)
      const excise = revenue * (v.excise / 100)
      const profit = gross - excise - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue', value: money(revenue) },
          { label: 'Tax burden', value: money(excise), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Gross profit', money(gross)],
          ['Excise/sales tax', money(excise)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Cannabis retail carries brutal tax treatment — heavy excise taxes plus federal rules (280E) that block normal deductions can leave slim net margins on healthy revenue. Compliance and tax planning are survival skills here. Educational only.`,
      }
    },
  },
  {
    id: 'pharmacy-simulator', name: 'Independent Pharmacy Simulator', category: 'Healthcare',
    tagline: 'Where a pharmacy actually makes its money.',
    description: 'Model prescription volume and front-end retail to see how thin Rx margins are carried by OTC sales.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'scripts', label: 'Scripts / day', default: 250 },
      { key: 'gpPerScript', label: 'Gross profit / script', default: 12, prefix: '$' },
      { key: 'otc', label: 'OTC sales / month', default: 40000, prefix: '$' },
      { key: 'otcMargin', label: 'OTC margin', default: 35, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 55000, prefix: '$' },
    ],
    compute: v => {
      const rxProfit = v.scripts * v.gpPerScript * 26
      const otcProfit = v.otc * (v.otcMargin / 100)
      const profit = rxProfit + otcProfit - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Rx gross profit', value: money(rxProfit) },
          { label: 'Front-end profit', value: money(otcProfit), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Rx gross profit', money(rxProfit)],
          ['OTC/front-end profit', money(otcProfit)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Reimbursement pressure and DIR fees keep squeezing prescription margins — which is why the profitable independents lean on the front-end (OTC, supplements, services). Script volume brings people in; retail keeps the lights on. Educational only.`,
      }
    },
  },
  {
    id: 'electrician-shop-simulator', name: 'Electrician Shop Simulator', category: 'Construction',
    tagline: 'Project an electrical contractor’s monthly profit.',
    description: 'Model job volume and ticket size against material and labor cost to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'jobs', label: 'Jobs / week', default: 25 },
      { key: 'ticket', label: 'Average ticket', default: 450, prefix: '$' },
      { key: 'material', label: 'Material %', default: 30, suffix: '%' },
      { key: 'labor', label: 'Labor %', default: 35, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 15000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.jobs * v.ticket * 4.33
      const profit = revenue * (1 - (v.material + v.labor) / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue', value: money(revenue) },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Material + labor', money(revenue * ((v.material + v.labor) / 100))],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Trade shops profit on the spread between billed rate and true labor+material cost — plus enough job volume to cover the truck, tools, and office. Service agreements and callbacks add recurring, higher-margin work. Educational only.`,
      }
    },
  },
  {
    id: 'roofing-company-simulator', name: 'Roofing Company Simulator', category: 'Construction',
    tagline: 'Project a roofing contractor’s profit.',
    description: 'Model job volume and average job value against material, labor, and overhead to see monthly profit and margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'jobs', label: 'Jobs / month', default: 12 },
      { key: 'avgJob', label: 'Average job value', default: 14000, prefix: '$' },
      { key: 'material', label: 'Material %', default: 35, suffix: '%' },
      { key: 'labor', label: 'Labor %', default: 30, suffix: '%' },
      { key: 'overhead', label: 'Monthly overhead', default: 25000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.jobs * v.avgJob
      const gross = revenue * (1 - (v.material + v.labor) / 100)
      const profit = gross - v.overhead
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Margin', value: pct(revenue > 0 ? profit / revenue : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Material + labor', money(revenue * ((v.material + v.labor) / 100))],
          ['Overhead', money(v.overhead)],
          ['Profit', money(profit)],
        ],
        note: `Roofing is high-ticket and demand-spiky (storms drive it). Accurate estimating and crew productivity protect the margin; underbidding a big job can wipe out a month. Insurance/storm work is where the volume swings. Educational only.`,
      }
    },
  },
  {
    id: 'pool-service-simulator', name: 'Pool Service Route Simulator', category: 'Home Services',
    tagline: 'Project a recurring pool-service route’s profit.',
    description: 'Model accounts and monthly fees against per-account cost and fixed overhead to see route profit and per-account margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'accounts', label: 'Accounts', default: 300 },
      { key: 'fee', label: 'Monthly fee', default: 150, prefix: '$' },
      { key: 'cost', label: 'Cost / account / mo', default: 55, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 12000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.accounts * v.fee
      const variable = v.accounts * v.cost
      const profit = revenue - variable - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / account', value: money(v.accounts > 0 ? profit / v.accounts : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Service cost', money(variable)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Recurring route businesses are prized for predictable revenue and easy resale value — buyers pay a multiple of the monthly recurring. Route density (accounts close together) cuts drive time and lifts profit per account. Educational only.`,
      }
    },
  },
  {
    id: 'moving-company-simulator', name: 'Moving Company Simulator', category: 'Logistics',
    tagline: 'Project a moving company’s monthly profit.',
    description: 'Model job volume and average revenue against labor and truck costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'jobs', label: 'Jobs / month', default: 60 },
      { key: 'revenue', label: 'Average job revenue', default: 1200, prefix: '$' },
      { key: 'labor', label: 'Labor %', default: 35, suffix: '%' },
      { key: 'truck', label: 'Truck + fuel %', default: 12, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 20000, prefix: '$' },
    ],
    compute: v => {
      const rev = v.jobs * v.revenue
      const profit = rev * (1 - (v.labor + v.truck) / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / job', value: money(v.jobs > 0 ? profit / v.jobs : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(rev)],
          ['Labor + truck', money(rev * ((v.labor + v.truck) / 100))],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Moving is seasonal and labor-heavy — summer carries the year. Long-distance jobs and packing/supply add-ons lift the average ticket and margin above local hourly moves. Educational only.`,
      }
    },
  },
  {
    id: 'equipment-rental-simulator', name: 'Equipment Rental Simulator', category: 'Small Business',
    tagline: 'Project return on a rental fleet.',
    description: 'Model utilization and daily rate against maintenance to see monthly profit and return on the fleet investment.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'units', label: 'Units', default: 20 },
      { key: 'rate', label: 'Daily rate', default: 120, prefix: '$' },
      { key: 'utilization', label: 'Utilization', default: 40, suffix: '%' },
      { key: 'maintenance', label: 'Maintenance / unit / mo', default: 150, prefix: '$' },
      { key: 'unitCost', label: 'Cost per unit', default: 8000, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 6000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.units * v.rate * (v.utilization / 100) * 30
      const maint = v.units * v.maintenance
      const profit = revenue - maint - v.fixed
      const fleetCost = v.units * v.unitCost
      const roi = fleetCost > 0 ? (profit * 12) / fleetCost : 0
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Annual ROI on fleet', value: pct(roi), highlight: true },
          { label: 'Revenue / unit', value: money(v.units > 0 ? revenue / v.units : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Maintenance', money(maint)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Utilization is the whole game — a unit sitting in the yard earns nothing but still depreciates. High-utilization, high-demand equipment pays back fast; the wrong mix ties up capital in idle iron. Educational only.`,
      }
    },
  },
  {
    id: 'escape-room-simulator', name: 'Escape Room Simulator', category: 'Entertainment',
    tagline: 'Project an escape-room venue’s profit.',
    description: 'Model rooms and session volume against per-session cost and fixed overhead to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'rooms', label: 'Rooms', default: 4 },
      { key: 'sessions', label: 'Sessions / room / day', default: 6 },
      { key: 'groupSize', label: 'Avg. group size', default: 4 },
      { key: 'price', label: 'Price per person', default: 32, prefix: '$' },
      { key: 'variable', label: 'Variable cost / session', default: 15, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 14000, prefix: '$' },
    ],
    compute: v => {
      const sessions = v.rooms * v.sessions * 26
      const revenue = sessions * v.groupSize * v.price
      const variable = sessions * v.variable
      const profit = revenue - variable - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue / room', value: money(v.rooms > 0 ? revenue / v.rooms : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Variable cost', money(variable)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Escape rooms are high-fixed-cost, low-variable — once built, each additional booking is nearly pure profit, but rooms go stale and need refreshing. Booking utilization (especially weekends) drives the whole model. Educational only.`,
      }
    },
  },
  {
    id: 'movie-theater-simulator', name: 'Movie Theater Simulator', category: 'Entertainment',
    tagline: 'Why theaters live on popcorn, not tickets.',
    description: 'Model attendance across screens with tickets (studio takes half) and concessions to see where the profit really comes from.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'screens', label: 'Screens', default: 8 },
      { key: 'seats', label: 'Seats / screen', default: 150 },
      { key: 'showings', label: 'Showings / day', default: 4 },
      { key: 'occupancy', label: 'Occupancy', default: 30, suffix: '%' },
      { key: 'ticket', label: 'Ticket price', default: 12, prefix: '$' },
      { key: 'concession', label: 'Concession / guest', default: 8, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 90000, prefix: '$' },
    ],
    compute: v => {
      const guests = v.screens * v.seats * v.showings * (v.occupancy / 100) * 30
      const ticketRev = guests * v.ticket
      const concessionRev = guests * v.concession
      const profit = ticketRev * 0.5 + concessionRev - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Concession revenue', value: money(concessionRev), highlight: true },
          { label: 'Guests / month', value: Math.round(guests).toLocaleString() },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Ticket revenue', money(ticketRev)],
          ['Studio share (~50%)', money(-(ticketRev * 0.5))],
          ['Concession revenue', money(concessionRev)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Studios take roughly half of ticket sales — sometimes more on opening weekends — so concessions, with their ~85% margin, are where theaters actually profit. Attendance drives concessions, which drives the whole P&L. Educational only.`,
      }
    },
  },
  {
    id: 'pet-boarding-simulator', name: 'Pet Boarding & Daycare Simulator', category: 'Pet',
    tagline: 'Project a boarding facility’s profit.',
    description: 'Model capacity and occupancy against per-pet cost and fixed overhead to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'capacity', label: 'Capacity (pets)', default: 40 },
      { key: 'occupancy', label: 'Occupancy', default: 65, suffix: '%' },
      { key: 'rate', label: 'Daily rate', default: 45, prefix: '$' },
      { key: 'cost', label: 'Cost / pet / day', default: 12, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 15000, prefix: '$' },
    ],
    compute: v => {
      const petDays = v.capacity * (v.occupancy / 100) * 30
      const revenue = petDays * v.rate
      const variable = petDays * v.cost
      const profit = revenue - variable - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue', value: money(revenue) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Care cost', money(variable)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Occupancy is everything — holidays and summer fill you up, slow weeks bleed. Add-ons (grooming, training, daycare) raise revenue per pet and smooth the seasonal swings. Educational only.`,
      }
    },
  },
  {
    id: 'recording-studio-simulator', name: 'Recording Studio Simulator', category: 'Creator',
    tagline: 'Project a studio’s monthly profit.',
    description: 'Model booked hours and rate against engineer cost and fixed overhead to see monthly profit and margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'hours', label: 'Booked hours / month', default: 200 },
      { key: 'rate', label: 'Hourly rate', default: 75, prefix: '$' },
      { key: 'engineer', label: 'Engineer cost / hour', default: 30, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 8000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.hours * v.rate
      const engineer = v.hours * v.engineer
      const profit = revenue - engineer - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Margin', value: pct(revenue > 0 ? profit / revenue : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Engineer cost', money(engineer)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Studios profit on booked-hour utilization against high fixed rent and gear. Packages, mixing/mastering, and content creation (podcasts, video) fill the off-hours and lift revenue per available hour. Educational only.`,
      }
    },
  },

  {
    id: 'mobile-home-park-simulator', name: 'Mobile Home Park Simulator', category: 'Real Estate',
    tagline: 'Project NOI and value for a lot-rent park.',
    description: 'Model pads, occupancy, and lot rent against a low expense ratio to see NOI and value at your cap rate.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'pads', label: 'Pads', default: 80 },
      { key: 'occupancy', label: 'Occupancy', default: 90, suffix: '%' },
      { key: 'rent', label: 'Lot rent / mo', default: 400, prefix: '$' },
      { key: 'expenseRatio', label: 'Expense ratio', default: 35, suffix: '%' },
      { key: 'capRate', label: 'Cap rate', default: 7, suffix: '%' },
    ],
    compute: v => {
      const monthlyRev = v.pads * (v.occupancy / 100) * v.rent
      const noi = monthlyRev * 12 * (1 - v.expenseRatio / 100)
      const value = noi / (v.capRate / 100)
      return {
        metrics: [
          { label: 'Monthly revenue', value: money(monthlyRev), highlight: true },
          { label: 'Annual NOI', value: money(noi), highlight: true },
          { label: 'Estimated value', value: money(value), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Monthly revenue', money(monthlyRev)],
          ['Annual NOI', money(noi)],
          ['Value', money(value)],
        ],
        note: `Tenants own the homes and the park owns the land — so turnover is low and the expense ratio is far below apartments. That stability, plus raising below-market lot rents, is the whole value-add thesis. Educational only.`,
      }
    },
  },
  {
    id: 'billboard-simulator', name: 'Billboard Portfolio Simulator', category: 'Real Estate',
    tagline: 'Project profit from outdoor advertising faces.',
    description: 'Model billboard faces, occupancy, and monthly rates against maintenance and ground lease to see profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'faces', label: 'Ad faces', default: 20 },
      { key: 'occupancy', label: 'Occupancy', default: 75, suffix: '%' },
      { key: 'rate', label: 'Monthly rate / face', default: 1200, prefix: '$' },
      { key: 'maintenance', label: 'Maintenance / face / mo', default: 100, prefix: '$' },
      { key: 'ground', label: 'Ground lease / face / mo', default: 200, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.faces * (v.occupancy / 100) * v.rate
      const cost = v.faces * (v.maintenance + v.ground)
      const profit = revenue - cost
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
          { label: 'Revenue / face', value: money(v.faces > 0 ? revenue / v.faces : 0) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Maintenance + ground lease', money(cost)],
          ['Profit', money(profit)],
        ],
        note: `Billboards throw off high-margin, low-touch cash flow — the scarce, permitted locations are a moat. Digital faces multiply revenue per structure by rotating several advertisers on one board. Educational only.`,
      }
    },
  },
  {
    id: 'marina-simulator', name: 'Marina Simulator', category: 'Real Estate',
    tagline: 'Project a marina’s profit from slips and fuel.',
    description: 'Model slip income plus fuel and F&B to see a marina’s monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'slips', label: 'Slips', default: 150 },
      { key: 'occupancy', label: 'Occupancy', default: 85, suffix: '%' },
      { key: 'rate', label: 'Slip rate / mo', default: 600, prefix: '$' },
      { key: 'expenseRatio', label: 'Slip expense ratio', default: 40, suffix: '%' },
      { key: 'fuelFb', label: 'Fuel + F&B / mo', default: 30000, prefix: '$' },
      { key: 'fbMargin', label: 'Fuel + F&B margin', default: 25, suffix: '%' },
    ],
    compute: v => {
      const slipRev = v.slips * (v.occupancy / 100) * v.rate
      const slipNOI = slipRev * (1 - v.expenseRatio / 100)
      const fbProfit = v.fuelFb * (v.fbMargin / 100)
      const profit = slipNOI + fbProfit
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: true },
          { label: 'Slip income', value: money(slipRev) },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Slip revenue', money(slipRev)],
          ['Slip NOI', money(slipNOI)],
          ['Fuel + F&B profit', money(fbProfit)],
          ['Total profit', money(profit)],
        ],
        note: `Slip rentals are the stable base; fuel, service, and dockside F&B add margin and stickiness. Waterfront is irreplaceable, which is why marinas trade at premium valuations. Educational only.`,
      }
    },
  },
  {
    id: 'car-dealership-simulator', name: 'Car Dealership Simulator', category: 'Retail',
    tagline: 'Where a dealership really makes money.',
    description: 'Model front-end gross, F&I, and service to see why dealerships profit more off financing and service than the car.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'units', label: 'Units sold / month', default: 120 },
      { key: 'frontGross', label: 'Front-end gross / unit', default: 2500, prefix: '$' },
      { key: 'fandi', label: 'F&I gross / unit', default: 1200, prefix: '$' },
      { key: 'service', label: 'Service revenue / mo', default: 200000, prefix: '$' },
      { key: 'serviceMargin', label: 'Service margin', default: 50, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 250000, prefix: '$' },
    ],
    compute: v => {
      const front = v.units * v.frontGross
      const fi = v.units * v.fandi
      const serviceGross = v.service * (v.serviceMargin / 100)
      const profit = front + fi + serviceGross - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'F&I + service gross', value: money(fi + serviceGross), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Source', 'Gross Profit'],
        rows: [
          ['Front-end (the car)', money(front)],
          ['F&I (financing)', money(fi)],
          ['Service', money(serviceGross)],
          ['Fixed', money(-v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `The car itself is often the thinnest margin — dealerships profit on financing (F&I) and the fixed-ops service department. That's why they push warranties and want you back for oil changes. Educational only.`,
      }
    },
  },
  {
    id: 'gas-station-simulator', name: 'Gas Station Simulator', category: 'Retail',
    tagline: 'The c-store is the business, not the fuel.',
    description: 'Model razor-thin fuel margins against the convenience store to see where a gas station actually profits.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'gallons', label: 'Gallons / month', default: 150000 },
      { key: 'fuelMargin', label: 'Margin / gallon', default: 0.25, prefix: '$' },
      { key: 'store', label: 'C-store sales / mo', default: 120000, prefix: '$' },
      { key: 'storeMargin', label: 'C-store margin', default: 30, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 25000, prefix: '$' },
    ],
    compute: v => {
      const fuelProfit = v.gallons * v.fuelMargin
      const storeProfit = v.store * (v.storeMargin / 100)
      const profit = fuelProfit + storeProfit - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'C-store profit', value: money(storeProfit), highlight: true },
          { label: 'Fuel profit', value: money(fuelProfit) },
        ],
        columns: ['Source', 'Profit'],
        rows: [
          ['Fuel', money(fuelProfit)],
          ['C-store', money(storeProfit)],
          ['Fixed', money(-v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Fuel is a razor-thin loss-leader that drives traffic; the convenience store's high-margin snacks, drinks, and tobacco are the real profit. Food service is the fastest-growing piece. Educational only.`,
      }
    },
  },
  {
    id: 'coffee-shop-simulator', name: 'Coffee Shop Simulator', category: 'Hospitality',
    tagline: 'Project a café’s monthly profit.',
    description: 'Model daily cups and ticket size against COGS, labor, and rent to see monthly profit and per-cup contribution.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cups', label: 'Cups / day', default: 400 },
      { key: 'ticket', label: 'Average ticket', default: 5.5, prefix: '$' },
      { key: 'cogs', label: 'COGS %', default: 25, suffix: '%' },
      { key: 'labor', label: 'Labor %', default: 30, suffix: '%' },
      { key: 'fixed', label: 'Monthly rent + fixed', default: 12000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.cups * v.ticket * 30
      const profit = revenue * (1 - (v.cogs + v.labor) / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue', value: money(revenue) },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['COGS + labor', money(revenue * ((v.cogs + v.labor) / 100))],
          ['Rent + fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Coffee has fantastic product margins but low ticket sizes — it lives on volume, throughput at peak, and add-ons (food, retail beans). Reaching enough daily cups to cover rent and labor is the whole battle. Educational only.`,
      }
    },
  },
  {
    id: 'wedding-venue-simulator', name: 'Wedding Venue Simulator', category: 'Hospitality',
    tagline: 'Project an events venue’s profit.',
    description: 'Model bookings and per-event revenue against variable and fixed costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'events', label: 'Events / month', default: 8 },
      { key: 'revenue', label: 'Revenue / event', default: 9000, prefix: '$' },
      { key: 'variable', label: 'Variable cost / event', default: 3000, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 25000, prefix: '$' },
    ],
    compute: v => {
      const rev = v.events * v.revenue
      const variable = v.events * v.variable
      const profit = rev - variable - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / event', value: money(v.events > 0 ? profit / v.events : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(rev)],
          ['Variable cost', money(variable)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Venues are capacity-limited by prime dates (Saturdays, peak season) — so premium pricing on the best dates and packages (catering, bar, rentals) drive the numbers more than raw event count. Educational only.`,
      }
    },
  },
  {
    id: 'golf-course-simulator', name: 'Golf Course Simulator', category: 'Recreation',
    tagline: 'Project a course’s profit from rounds and F&B.',
    description: 'Model rounds against green fees, cart, and food & beverage per round versus heavy maintenance overhead.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'rounds', label: 'Rounds / month', default: 4000 },
      { key: 'green', label: 'Green fee', default: 55, prefix: '$' },
      { key: 'cart', label: 'Cart fee', default: 18, prefix: '$' },
      { key: 'fb', label: 'F&B per round', default: 12, prefix: '$' },
      { key: 'opex', label: 'Monthly opex (maintenance heavy)', default: 180000, prefix: '$' },
    ],
    compute: v => {
      const perRound = v.green + v.cart + v.fb
      const revenue = v.rounds * perRound
      const profit = revenue - v.opex
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue / round', value: money(perRound), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Opex', money(v.opex)],
          ['Profit', money(profit)],
        ],
        note: `Course maintenance is a huge, weather-dependent fixed cost — so rounds played and F&B/pro-shop spend per round decide the year. Memberships and events smooth the seasonality. Educational only.`,
      }
    },
  },
  {
    id: 'datacenter-colocation-simulator', name: 'Data Center Colocation Simulator', category: 'Tech',
    tagline: 'Project a colo facility’s profit.',
    description: 'Model rack occupancy and pricing against power cost and fixed overhead to see monthly profit and revenue per rack.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'racks', label: 'Racks', default: 200 },
      { key: 'occupancy', label: 'Occupancy', default: 80, suffix: '%' },
      { key: 'price', label: 'Price / rack / mo', default: 1500, prefix: '$' },
      { key: 'power', label: 'Power cost / rack / mo', default: 400, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 200000, prefix: '$' },
    ],
    compute: v => {
      const occupied = v.racks * (v.occupancy / 100)
      const revenue = occupied * v.price
      const powerCost = occupied * v.power
      const profit = revenue - powerCost - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue', value: money(revenue) },
          { label: 'Revenue / rack', value: money(v.racks > 0 ? revenue / v.racks : 0), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Power cost', money(powerCost)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Colo is a real-estate-plus-power business — heavy upfront build cost, then high-margin recurring rack revenue once leased. Power efficiency (PUE) and occupancy are the two dials that set profitability. Educational only.`,
      }
    },
  },
  {
    id: 'api-billing-simulator', name: 'Usage-Based API Billing Simulator', category: 'SaaS',
    tagline: 'Project margin on a metered API product.',
    description: 'Model call volume and per-call pricing against infrastructure cost to see revenue, infra cost, and gross margin.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'customers', label: 'Customers', default: 500 },
      { key: 'calls', label: 'Calls / customer / mo', default: 100000 },
      { key: 'price', label: 'Price / 1k calls', default: 2, prefix: '$' },
      { key: 'infra', label: 'Infra cost / 1M calls', default: 300, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 40000, prefix: '$' },
    ],
    compute: v => {
      const totalCalls = v.customers * v.calls
      const revenue = (totalCalls / 1000) * v.price
      const infra = (totalCalls / 1000000) * v.infra
      const profit = revenue - infra - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Gross margin', value: pct(revenue > 0 ? (revenue - infra) / revenue : 0), highlight: true },
          { label: 'Revenue', value: money(revenue) },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Total calls', Math.round(totalCalls).toLocaleString()],
          ['Revenue', money(revenue)],
          ['Infra cost', money(infra)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Usage pricing aligns revenue with customer value and scales beautifully — but watch the spread between your price and infra cost per call. Heavy users can crush margin if pricing doesn't tier. Educational only.`,
      }
    },
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'vineyard-simulator', name: 'Vineyard & Winery Simulator', category: 'Manufacturing',
    tagline: 'Project a winery’s annual profit.',
    description: 'Model acres and yield against bottle price and cost to see annual profit and per-acre economics.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'acres', label: 'Planted acres', default: 20 },
      { key: 'bottles', label: 'Bottles / acre', default: 3000 },
      { key: 'price', label: 'Price per bottle', default: 25, prefix: '$' },
      { key: 'cost', label: 'Cost per bottle', default: 8, prefix: '$' },
      { key: 'fixed', label: 'Annual fixed', default: 150000, prefix: '$' },
    ],
    compute: v => {
      const bottles = v.acres * v.bottles
      const revenue = bottles * v.price
      const cogs = bottles * v.cost
      const profit = revenue - cogs - v.fixed
      return {
        metrics: [
          { label: 'Annual profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / acre', value: money(v.acres > 0 ? profit / v.acres : 0), highlight: true },
          { label: 'Bottles / year', value: Math.round(bottles).toLocaleString() },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue', money(revenue)],
          ['Cost of goods', money(cogs)],
          ['Fixed', money(v.fixed)],
          ['Profit', money(profit)],
        ],
        note: `Wineries take years before vines produce and capital sits idle — so patient money and a strong direct-to-consumer (tasting room, wine club) channel, which captures full retail margin, are what make the numbers work. Educational only.`,
      }
    },
  },
  {
    id: 'airline-route-simulator', name: 'Airline Route Simulator', category: 'Transportation',
    tagline: 'Why a few points of load factor decide profit.',
    description: 'Model seats, load factor, and fare against cost per seat to see route profit and the break-even load factor.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'seats', label: 'Seats', default: 180 },
      { key: 'load', label: 'Load factor', default: 82, suffix: '%' },
      { key: 'fare', label: 'Average fare', default: 220, prefix: '$' },
      { key: 'costPerSeat', label: 'Cost per available seat', default: 150, prefix: '$' },
      { key: 'flights', label: 'Flights / day', default: 4 },
    ],
    compute: v => {
      const paxPerFlight = v.seats * (v.load / 100)
      const revPerFlight = paxPerFlight * v.fare
      const costPerFlight = v.seats * v.costPerSeat
      const profitPerFlight = revPerFlight - costPerFlight
      const monthly = profitPerFlight * v.flights * 30
      const breakevenLoad = v.fare > 0 ? v.costPerSeat / v.fare : 0
      return {
        metrics: [
          { label: 'Profit / flight', value: money(profitPerFlight), highlight: profitPerFlight < 0 },
          { label: 'Monthly profit', value: money(monthly), highlight: true },
          { label: 'Break-even load', value: pct(breakevenLoad), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [
          ['Revenue / flight', money(revPerFlight)],
          ['Cost / flight', money(costPerFlight)],
          ['Profit / flight', money(profitPerFlight)],
        ],
        note: `Airlines fly on razor margins — you need about a ${pct(breakevenLoad)} load factor just to break even here, and the last few seats are almost pure profit. Fuel and fare swings turn profit to loss fast; ancillary fees are the cushion. Educational only.`,
      }
    },
  },

  {
    id: 'bakery-simulator', name: 'Bakery Profit Simulator', category: 'Hospitality',
    tagline: 'Project a bakery’s monthly profit.',
    description: 'Model daily item volume and price against COGS, labor, and fixed costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'items', label: 'Items sold / day', default: 500 },
      { key: 'price', label: 'Average item price', default: 4, prefix: '$' },
      { key: 'cogs', label: 'COGS %', default: 30, suffix: '%' },
      { key: 'labor', label: 'Labor %', default: 35, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 10000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.items * v.price * 30
      const profit = revenue * (1 - (v.cogs + v.labor) / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue', value: money(revenue) },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['COGS + labor', money(revenue * ((v.cogs + v.labor) / 100))], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Bakeries fight waste (unsold goods) and early-morning labor. Wholesale accounts and pre-orders smooth demand, while high-margin specialty items lift the average ticket. Educational only.`,
      }
    },
  },
  {
    id: 'ghost-kitchen-simulator', name: 'Ghost Kitchen Simulator', category: 'Hospitality',
    tagline: 'Delivery-only economics after the commissions.',
    description: 'Model delivery orders against food cost, app commission, and labor to see if a ghost kitchen actually profits.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'orders', label: 'Orders / day', default: 120 },
      { key: 'ticket', label: 'Average ticket', default: 22, prefix: '$' },
      { key: 'food', label: 'Food cost %', default: 30, suffix: '%' },
      { key: 'commission', label: 'App commission %', default: 25, suffix: '%' },
      { key: 'labor', label: 'Labor %', default: 20, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 8000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.orders * v.ticket * 30
      const profit = revenue * (1 - (v.food + v.commission + v.labor) / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Margin', value: pct(revenue > 0 ? profit / revenue : 0), highlight: true },
          { label: 'App commission', value: money(revenue * (v.commission / 100)) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Food + commission + labor', money(revenue * ((v.food + v.commission + v.labor) / 100))], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Delivery commissions (25%+) are the ghost-kitchen killer. The winning move is running several virtual brands from one kitchen to spread fixed cost, and driving first-party orders to skip the apps. Educational only.`,
      }
    },
  },
  {
    id: 'catering-company-simulator', name: 'Catering Company Simulator', category: 'Hospitality',
    tagline: 'Project a caterer’s monthly profit.',
    description: 'Model event volume and revenue against food, labor, and fixed costs to see monthly and per-event profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'events', label: 'Events / month', default: 20 },
      { key: 'revenue', label: 'Revenue / event', default: 3500, prefix: '$' },
      { key: 'food', label: 'Food %', default: 30, suffix: '%' },
      { key: 'labor', label: 'Labor %', default: 25, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 15000, prefix: '$' },
    ],
    compute: v => {
      const rev = v.events * v.revenue
      const profit = rev * (1 - (v.food + v.labor) / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / event', value: money(v.events > 0 ? profit / v.events : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(rev)], ['Food + labor', money(rev * ((v.food + v.labor) / 100))], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Catering profit hides in accurate quoting — underestimating labor and rentals on a big event erases the margin. Deposits and minimums protect cash flow around seasonal swings. Educational only.`,
      }
    },
  },
  {
    id: 'barbershop-simulator', name: 'Barbershop Simulator', category: 'Salon',
    tagline: 'Project a barbershop’s monthly profit.',
    description: 'Model chairs and cut volume against barber pay and fixed costs to see profit and revenue per chair.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'chairs', label: 'Chairs', default: 6 },
      { key: 'cuts', label: 'Cuts / chair / day', default: 10 },
      { key: 'price', label: 'Price per cut', default: 30, prefix: '$' },
      { key: 'barberPay', label: 'Barber pay %', default: 60, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 8000, prefix: '$' },
    ],
    compute: v => {
      const cuts = v.chairs * v.cuts * 26
      const revenue = cuts * v.price
      const profit = revenue * (1 - v.barberPay / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue / chair', value: money(v.chairs > 0 ? revenue / v.chairs : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Barber pay', money(revenue * (v.barberPay / 100))], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Chair-rental vs. commission changes the math entirely. Memberships, product retail, and add-ons (beard, hot towel) lift revenue per chair — the number that decides whether the shop scales. Educational only.`,
      }
    },
  },
  {
    id: 'nail-salon-simulator', name: 'Nail Salon Simulator', category: 'Salon',
    tagline: 'Project a nail salon’s monthly profit.',
    description: 'Model stations and service volume against tech pay, supplies, and fixed costs to see profit per station.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'stations', label: 'Stations', default: 8 },
      { key: 'services', label: 'Services / station / day', default: 8 },
      { key: 'price', label: 'Average service', default: 45, prefix: '$' },
      { key: 'techPay', label: 'Tech pay %', default: 55, suffix: '%' },
      { key: 'supplies', label: 'Supplies %', default: 8, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 10000, prefix: '$' },
    ],
    compute: v => {
      const services = v.stations * v.services * 26
      const revenue = services * v.price
      const profit = revenue * (1 - (v.techPay + v.supplies) / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue / station', value: money(v.stations > 0 ? revenue / v.stations : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Tech pay + supplies', money(revenue * ((v.techPay + v.supplies) / 100))], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Station utilization drives everything — an empty chair still pays rent. Upgrades (gel, designs, pedicures) and memberships raise the average ticket and fill slow hours. Educational only.`,
      }
    },
  },
  {
    id: 'martial-arts-dojo-simulator', name: 'Martial Arts Dojo Simulator', category: 'Fitness',
    tagline: 'Project a dojo’s recurring profit.',
    description: 'Model membership volume and fee against instructor and rent costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'members', label: 'Members', default: 200 },
      { key: 'fee', label: 'Monthly fee', default: 130, prefix: '$' },
      { key: 'instructor', label: 'Instructor cost / mo', default: 12000, prefix: '$' },
      { key: 'fixed', label: 'Rent + fixed / mo', default: 8000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.members * v.fee
      const profit = revenue - v.instructor - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue', value: money(revenue) },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Instructor', money(v.instructor)], ['Rent + fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Belt progression and community make martial-arts memberships famously sticky — retention is a superpower here. Testing fees, pro-shop gear, and kids' programs layer more revenue on the base. Educational only.`,
      }
    },
  },
  {
    id: 'crossfit-box-simulator', name: 'CrossFit Box Simulator', category: 'Fitness',
    tagline: 'Project a box’s recurring profit.',
    description: 'Model members and premium fees against coaching and rent to see monthly profit and per-member revenue.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'members', label: 'Members', default: 150 },
      { key: 'fee', label: 'Monthly fee', default: 165, prefix: '$' },
      { key: 'coach', label: 'Coaching cost / mo', default: 10000, prefix: '$' },
      { key: 'fixed', label: 'Rent + fixed / mo', default: 9000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.members * v.fee
      const profit = revenue - v.coach - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue / member', value: money(v.fee) },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Coaching', money(v.coach)], ['Rent + fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Boxes charge premium fees for coached, community classes — but are capped by class size and coach availability. Nutrition programs and personal training lift revenue per member above the class fee. Educational only.`,
      }
    },
  },
  {
    id: 'climbing-gym-simulator', name: 'Climbing Gym Simulator', category: 'Recreation',
    tagline: 'Project a climbing gym’s profit.',
    description: 'Model memberships plus day passes against fixed costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'members', label: 'Members', default: 800 },
      { key: 'fee', label: 'Monthly fee', default: 85, prefix: '$' },
      { key: 'dayPasses', label: 'Day passes / month', default: 1500 },
      { key: 'passPrice', label: 'Day pass price', default: 25, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 60000, prefix: '$' },
    ],
    compute: v => {
      const memberRev = v.members * v.fee
      const passRev = v.dayPasses * v.passPrice
      const profit = memberRev + passRev - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Member revenue', value: money(memberRev), highlight: true },
          { label: 'Day-pass revenue', value: money(passRev) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Membership revenue', money(memberRev)], ['Day passes', money(passRev)], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Climbing gyms carry big fixed costs (walls, space, staff) — memberships provide the stable base while day passes and gear/classes add upside. Route-setting quality drives retention. Educational only.`,
      }
    },
  },
  {
    id: 'bowling-alley-simulator', name: 'Bowling Alley Simulator', category: 'Recreation',
    tagline: 'Project an alley’s profit from lanes and F&B.',
    description: 'Model game volume across lanes plus food & beverage against fixed costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'lanes', label: 'Lanes', default: 24 },
      { key: 'games', label: 'Games / lane / day', default: 20 },
      { key: 'gamePrice', label: 'Price per game', default: 6, prefix: '$' },
      { key: 'fb', label: 'F&B per game', default: 4, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 70000, prefix: '$' },
    ],
    compute: v => {
      const gamesMonthly = v.lanes * v.games * 30
      const revenue = gamesMonthly * (v.gamePrice + v.fb)
      const profit = revenue - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue / lane', value: money(v.lanes > 0 ? revenue / v.lanes : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Modern alleys are entertainment centers — food, bar, and events (leagues, parties) often out-earn the bowling itself. Weekend and league utilization carry the heavy fixed cost. Educational only.`,
      }
    },
  },
  {
    id: 'trampoline-park-simulator', name: 'Trampoline Park Simulator', category: 'Recreation',
    tagline: 'Project a jump park’s monthly profit.',
    description: 'Model daily jumpers and ticket price against variable and fixed costs to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'jumpers', label: 'Jumpers / day', default: 300 },
      { key: 'ticket', label: 'Average ticket', default: 20, prefix: '$' },
      { key: 'variable', label: 'Variable cost %', default: 15, suffix: '%' },
      { key: 'fixed', label: 'Monthly fixed', default: 50000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.jumpers * v.ticket * 30
      const profit = revenue * (1 - v.variable / 100) - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue', value: money(revenue) },
          { label: 'Annualized', value: money(profit * 12), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Variable', money(revenue * (v.variable / 100))], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Low variable cost means high incremental margin — but big fixed cost and insurance demand strong attendance. Parties, memberships, and concessions are the profit multipliers on top of admission. Educational only.`,
      }
    },
  },
  {
    id: 'driving-school-simulator', name: 'Driving School Simulator', category: 'Education',
    tagline: 'Project a driving school’s profit.',
    description: 'Model student volume and package price against instructor cost and overhead to see monthly profit.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'students', label: 'Students / month', default: 120 },
      { key: 'package', label: 'Package price', default: 500, prefix: '$' },
      { key: 'instructorCost', label: 'Instructor cost / student', default: 200, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 12000, prefix: '$' },
    ],
    compute: v => {
      const revenue = v.students * v.package
      const instructor = v.students * v.instructorCost
      const profit = revenue - instructor - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Profit / student', value: money(v.students > 0 ? profit / v.students : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Revenue', money(revenue)], ['Instructor cost', money(instructor)], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Driving schools scale on instructor utilization and steady enrollment. Vehicle and insurance costs are the main fixed burden; corporate and fleet training smooth seasonal demand. Educational only.`,
      }
    },
  },
  {
    id: 'invoice-factoring-simulator', name: 'Invoice Factoring Cost Simulator', category: 'Finance',
    tagline: 'The true cost of selling your invoices.',
    description: 'Model an advance rate and factor fee to see cash received now — and the eye-opening effective APR.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'invoice', label: 'Invoice amount', default: 100000, prefix: '$' },
      { key: 'advance', label: 'Advance rate', default: 85, suffix: '%' },
      { key: 'fee', label: 'Factor fee / 30 days', default: 3, suffix: '%' },
      { key: 'days', label: 'Days outstanding', default: 45 },
    ],
    compute: v => {
      const advance = v.invoice * (v.advance / 100)
      const fee = v.invoice * (v.fee / 100) * (v.days / 30)
      const apr = v.days > 0 ? (v.fee / 100) * (365 / v.days) : 0
      return {
        metrics: [
          { label: 'Cash advanced now', value: money(advance), highlight: true },
          { label: 'Total fee', value: money(fee), highlight: true },
          { label: 'Effective APR', value: pct(apr), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Advance', money(advance)], ['Factor fee', money(fee)], ['Net received', money(v.invoice - fee)]],
        note: `Factoring solves cash-flow gaps fast — but annualized, a ${v.fee}% fee is roughly a ${pct(apr)} APR. Use it for genuine growth crunches, not as permanent financing; the cost compounds against thin margins. Educational only.`,
      }
    },
  },
  {
    id: 'merchant-cash-advance-simulator', name: 'Merchant Cash Advance Cost Simulator', category: 'Finance',
    tagline: 'What a factor rate really costs.',
    description: 'Model an advance and factor rate to reveal the total payback and the true (often shocking) effective APR.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'advance', label: 'Advance amount', default: 50000, prefix: '$' },
      { key: 'factor', label: 'Factor rate', default: 1.4 },
      { key: 'months', label: 'Repayment term (months)', default: 8 },
    ],
    compute: v => {
      const payback = v.advance * v.factor
      const cost = payback - v.advance
      const apr = v.months > 0 ? (v.factor - 1) * (12 / v.months) : 0
      return {
        metrics: [
          { label: 'Total payback', value: money(payback), highlight: true },
          { label: 'Cost of capital', value: money(cost), highlight: true },
          { label: 'Approx. APR', value: pct(apr), highlight: true },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Advance', money(v.advance)], ['Total payback', money(payback)], ['Cost', money(cost)], ['Monthly payment', money(payback / v.months)]],
        note: `MCAs hide their cost in a "factor rate" — a 1.4 over 8 months is roughly a ${pct(apr)} APR. They're among the most expensive money a business can take; exhaust every other option first. Educational only.`,
      }
    },
  },
  {
    id: 'sba-7a-loan-simulator', name: 'SBA 7(a) Loan Payment Simulator', category: 'Finance',
    tagline: 'Monthly payment and total interest on an SBA loan.',
    description: 'Model an SBA 7(a) loan to see the monthly payment and how much interest you pay over the term.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'loan', label: 'Loan amount', default: 350000, prefix: '$' },
      { key: 'rate', label: 'Interest rate', default: 11, suffix: '%' },
      { key: 'years', label: 'Term (years)', default: 10 },
    ],
    compute: v => {
      const r = v.rate / 1200, n = v.years * 12
      const pmt = r === 0 ? v.loan / n : (v.loan * r) / (1 - Math.pow(1 + r, -n))
      const total = pmt * n
      const rows: string[][] = []
      let bal = v.loan
      for (let y = 1; y <= v.years; y++) {
        let yi = 0
        for (let m = 0; m < 12; m++) { const i = bal * r; bal -= (pmt - i); yi += i }
        if (y % 2 === 0 || y === v.years) rows.push([`Year ${y}`, money(yi), money(Math.max(0, bal))])
      }
      return {
        metrics: [
          { label: 'Monthly payment', value: money(pmt), highlight: true },
          { label: 'Total interest', value: money(total - v.loan), highlight: true },
          { label: 'Total repaid', value: money(total) },
        ],
        columns: ['Year', 'Interest', 'Balance'],
        rows,
        note: `SBA loans open doors with low down payments and long terms — but the variable rate (tied to prime) means payments can rise. Model a rate bump before you commit; debt service is the number that must clear your cash flow. Educational only.`,
      }
    },
  },
  {
    id: 'business-loc-simulator', name: 'Business Line of Credit Simulator', category: 'Finance',
    tagline: 'Interest and payoff on a revolving credit line.',
    description: 'Model a drawn balance and monthly paydown to see interest cost and how long to clear the line.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'drawn', label: 'Amount drawn', default: 60000, prefix: '$' },
      { key: 'apr', label: 'APR', default: 12, suffix: '%' },
      { key: 'paydown', label: 'Monthly paydown', default: 5000, prefix: '$' },
    ],
    compute: v => {
      const r = v.apr / 1200
      let bal = v.drawn, months = 0, interest = 0
      if (v.paydown <= bal * r) return { metrics: [{ label: 'Payoff', value: 'Never', highlight: true }, { label: 'Note', value: 'Paydown ≤ interest' }], columns: ['Line', 'Value'], rows: [['Balance', money(bal)]], note: `Your paydown barely covers interest — the balance won't fall. Increase it above the monthly interest to make progress. Educational only.` }
      while (bal > 0 && months < 600) { const i = bal * r; bal -= (v.paydown - i); interest += i; months++ }
      return {
        metrics: [
          { label: 'Months to payoff', value: months.toString(), highlight: true },
          { label: 'Total interest', value: money(interest), highlight: true },
          { label: 'Current monthly interest', value: money(v.drawn * r) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Drawn', money(v.drawn)], ['Monthly interest (now)', money(v.drawn * r)], ['Total interest', money(interest)]],
        note: `A line of credit is flexible, cheap money for short-term needs — but only if you pay it down. Carrying a revolving balance long-term turns a cash-flow tool into an expensive habit. Educational only.`,
      }
    },
  },
  {
    id: 'equipment-financing-simulator', name: 'Equipment Financing Simulator', category: 'Finance',
    tagline: 'Payment and true cost on financed equipment.',
    description: 'Model an equipment loan to see the monthly payment, total interest, and all-in cost.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'cost', label: 'Equipment cost', default: 80000, prefix: '$' },
      { key: 'down', label: 'Down payment', default: 10, suffix: '%' },
      { key: 'rate', label: 'Interest rate', default: 8, suffix: '%' },
      { key: 'years', label: 'Term (years)', default: 5 },
    ],
    compute: v => {
      const loan = v.cost * (1 - v.down / 100)
      const r = v.rate / 1200, n = v.years * 12
      const pmt = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
      const total = pmt * n
      return {
        metrics: [
          { label: 'Monthly payment', value: money(pmt), highlight: true },
          { label: 'Total interest', value: money(total - loan), highlight: true },
          { label: 'All-in cost', value: money(total + v.cost * (v.down / 100)) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Financed amount', money(loan)], ['Monthly payment', money(pmt)], ['Total interest', money(total - loan)]],
        note: `Financing preserves cash and often qualifies for tax deductions (Section 179), but you pay interest and the gear depreciates. Match the term to the equipment's useful life — never finance a 3-year asset over 7. Educational only.`,
      }
    },
  },
  {
    id: 'pickleball-club-simulator', name: 'Pickleball Club Simulator', category: 'Recreation',
    tagline: 'Project a pickleball facility’s profit.',
    description: 'Model court rentals plus memberships against fixed costs to see monthly profit and revenue per court.',
    price: 'Toolkit Pro',
    inputs: [
      { key: 'courts', label: 'Courts', default: 8 },
      { key: 'hours', label: 'Booked hours / court / day', default: 8 },
      { key: 'rate', label: 'Court rate / hour', default: 40, prefix: '$' },
      { key: 'memberships', label: 'Membership revenue / mo', default: 20000, prefix: '$' },
      { key: 'fixed', label: 'Monthly fixed', default: 45000, prefix: '$' },
    ],
    compute: v => {
      const courtRev = v.courts * v.hours * v.rate * 30
      const revenue = courtRev + v.memberships
      const profit = revenue - v.fixed
      return {
        metrics: [
          { label: 'Monthly profit', value: money(profit), highlight: profit < 0 },
          { label: 'Revenue / court', value: money(v.courts > 0 ? revenue / v.courts : 0), highlight: true },
          { label: 'Annualized', value: money(profit * 12) },
        ],
        columns: ['Line', 'Amount'],
        rows: [['Court revenue', money(courtRev)], ['Memberships', money(v.memberships)], ['Fixed', money(v.fixed)], ['Profit', money(profit)]],
        note: `Pickleball is the fastest-growing sport, and indoor courts monetize through open play, memberships, leagues, lessons, and events. Court utilization at peak evening/weekend hours is what makes the fixed cost pencil. Educational only.`,
      }
    },
  },
]

export function getProToolById(id: string): ProTool | undefined {
  return PRO_TOOLS.find(t => t.id === id)
}

export const PRO_TOOL_CATEGORIES = Array.from(new Set(PRO_TOOLS.map(t => t.category)))
