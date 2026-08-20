// Interactive mini-tools — the Crimson Bench "operator's toolkit".
// One engine (ToolRunner) + these configs. Isomorphic: imported by server pages
// (for lists/metadata/static params) and by the client ToolRunner (for compute).

export type OutFormat = 'money' | 'number' | 'percent' | 'x' | 'months' | 'years'

export interface ToolInput {
  key: string
  label: string
  default: number
  prefix?: string
  suffix?: string
  step?: number
  min?: number
  help?: string
}

export interface ToolOutput {
  key: string
  label: string
  format: OutFormat
  highlight?: boolean
}

export interface Tool {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  inputs: ToolInput[]
  outputs: ToolOutput[]
  compute: (v: Record<string, number>) => Record<string, number>
  /** The operator's one-line read on the result. */
  insight: (v: Record<string, number>, o: Record<string, number>) => string
  /** Optional digital-product id this tool upsells to. */
  sells?: string
}

const safe = (n: number) => (isFinite(n) ? n : 0)

export const TOOLS: Tool[] = [
  {
    id: 'unit-economics',
    name: 'Unit Economics Calculator',
    category: 'Finance',
    tagline: 'Find out if every sale actually makes you money.',
    description:
      'Enter your price, costs, and acquisition spend. This tool returns your gross margin, CAC, LTV, LTV:CAC ratio, and CAC payback — the five numbers investors and operators judge a business on.',
    inputs: [
      { key: 'price', label: 'Average sale price / ARPU', default: 100, prefix: '$' },
      { key: 'cogs', label: 'Variable cost per unit', default: 30, prefix: '$' },
      { key: 'spend', label: 'Monthly sales & marketing spend', default: 10000, prefix: '$' },
      { key: 'customers', label: 'New customers per month', default: 100 },
      { key: 'lifetime', label: 'Avg. customer lifetime (months)', default: 24 },
    ],
    outputs: [
      { key: 'gm', label: 'Gross margin / unit', format: 'money' },
      { key: 'gmp', label: 'Gross margin %', format: 'percent' },
      { key: 'cac', label: 'CAC', format: 'money' },
      { key: 'ltv', label: 'LTV', format: 'money', highlight: true },
      { key: 'ratio', label: 'LTV : CAC', format: 'x', highlight: true },
      { key: 'payback', label: 'CAC payback', format: 'months', highlight: true },
    ],
    compute: v => {
      const gm = v.price - v.cogs
      const cac = safe(v.spend / v.customers)
      const ltv = gm * v.lifetime
      return {
        gm,
        gmp: safe(gm / v.price),
        cac,
        ltv,
        ratio: safe(ltv / cac),
        payback: safe(cac / gm),
      }
    },
    insight: (_v, o) =>
      o.ratio >= 3 && o.payback <= 12
        ? `Healthy. An LTV:CAC of ${o.ratio.toFixed(1)}x with ${o.payback.toFixed(0)}-month payback is fundable — you can afford to spend more to grow.`
        : o.ratio < 1
        ? `Underwater. You spend more to acquire a customer than they're worth. Fix pricing, margin, or retention before scaling spend.`
        : `Tighten it. Aim for LTV:CAC ≥ 3.0x and payback ≤ 12 months before you pour fuel on acquisition.`,
    sells: 'unit-economics-calculator',
  },
  {
    id: 'runway-calculator',
    name: 'Startup Runway Calculator',
    category: 'Finance',
    tagline: 'Know exactly how many months of cash you have left.',
    description:
      'Enter your cash, monthly revenue, and monthly expenses. This tool returns your net burn and the number of months of runway remaining at your current rate.',
    inputs: [
      { key: 'cash', label: 'Cash in the bank', default: 500000, prefix: '$' },
      { key: 'revenue', label: 'Monthly revenue', default: 20000, prefix: '$' },
      { key: 'expenses', label: 'Monthly expenses', default: 60000, prefix: '$' },
    ],
    outputs: [
      { key: 'burn', label: 'Net monthly burn', format: 'money' },
      { key: 'runway', label: 'Runway remaining', format: 'months', highlight: true },
      { key: 'zeroIn', label: 'Cash-out in', format: 'years' },
    ],
    compute: v => {
      const burn = v.expenses - v.revenue
      const runway = burn > 0 ? v.cash / burn : Infinity
      return { burn, runway: isFinite(runway) ? runway : 999, zeroIn: isFinite(runway) ? runway / 12 : 99 }
    },
    insight: (_v, o) =>
      o.burn <= 0
        ? `You're cash-flow positive — no burn. Every month adds to the bank. Focus shifts from survival to growth.`
        : o.runway < 6
        ? `Danger zone: ${o.runway.toFixed(1)} months left. Start raising or cutting now — options vanish under 6 months.`
        : `${o.runway.toFixed(1)} months of runway. Raise with 9–12 months left, not 3 — leverage disappears when you're desperate.`,
    sells: 'runway-burn-tracker',
  },
  {
    id: 'break-even-calculator',
    name: 'Break-Even Calculator',
    category: 'Finance',
    tagline: 'How many sales until you stop losing money.',
    description:
      'Enter your fixed costs, price, and variable cost per unit. This tool returns the number of units — and the revenue — you need to break even.',
    inputs: [
      { key: 'fixed', label: 'Monthly fixed costs', default: 40000, prefix: '$' },
      { key: 'price', label: 'Price per unit', default: 100, prefix: '$' },
      { key: 'varcost', label: 'Variable cost per unit', default: 40, prefix: '$' },
    ],
    outputs: [
      { key: 'margin', label: 'Contribution margin / unit', format: 'money' },
      { key: 'units', label: 'Break-even units / month', format: 'number', highlight: true },
      { key: 'revenue', label: 'Break-even revenue / month', format: 'money', highlight: true },
    ],
    compute: v => {
      const margin = v.price - v.varcost
      const units = margin > 0 ? Math.ceil(v.fixed / margin) : 0
      return { margin, units, revenue: units * v.price }
    },
    insight: (_v, o) =>
      o.margin <= 0
        ? `Every unit loses money — your price is below variable cost. No volume fixes this; raise price or cut cost.`
        : `You need ${o.units.toLocaleString()} units/month to break even. Below that you burn; above it, every unit drops $${o.margin.toFixed(0)} to the bottom line.`,
    sells: 'unit-economics-calculator',
  },
  {
    id: 'saas-valuation',
    name: 'SaaS Valuation Estimator',
    category: 'Fundraising',
    tagline: 'A quick, defensible revenue-multiple valuation.',
    description:
      'Enter your ARR and growth rate for a rule-of-thumb valuation range based on the revenue multiples investors apply at each growth tier. A directional estimate, not an appraisal.',
    inputs: [
      { key: 'arr', label: 'Annual recurring revenue (ARR)', default: 1000000, prefix: '$' },
      { key: 'growth', label: 'Year-over-year growth', default: 100, suffix: '%' },
      { key: 'margin', label: 'Gross margin', default: 80, suffix: '%' },
    ],
    outputs: [
      { key: 'multiple', label: 'Implied revenue multiple', format: 'x', highlight: true },
      { key: 'low', label: 'Valuation — conservative', format: 'money' },
      { key: 'mid', label: 'Valuation — midpoint', format: 'money', highlight: true },
      { key: 'high', label: 'Valuation — optimistic', format: 'money' },
    ],
    compute: v => {
      // Rough growth-based multiple, adjusted for gross margin.
      let base = v.growth >= 100 ? 12 : v.growth >= 50 ? 8 : v.growth >= 25 ? 5 : 3
      base *= 0.6 + (v.margin / 100) * 0.5 // margin adjustment
      const mid = v.arr * base
      return { multiple: base, low: mid * 0.7, mid, high: mid * 1.4 }
    },
    insight: (v, o) =>
      `At ${v.growth}% growth, the market pays roughly ${o.multiple.toFixed(1)}x ARR — about $${(o.mid / 1e6).toFixed(1)}M. Growth moves this number more than any pitch; a doubling of growth roughly doubles the multiple.`,
    sells: 'cap-table-model',
  },
  {
    id: 'pricing-margin-calculator',
    name: 'Pricing & Margin Calculator',
    category: 'Revenue',
    tagline: 'Set a price that hits the margin you actually want.',
    description:
      'Enter your cost and target margin to get the price you should charge — or enter a price to see the margin it earns. The lever most founders leave on the table.',
    inputs: [
      { key: 'cost', label: 'Cost per unit', default: 40, prefix: '$' },
      { key: 'targetMargin', label: 'Target gross margin', default: 70, suffix: '%' },
    ],
    outputs: [
      { key: 'price', label: 'Price to charge', format: 'money', highlight: true },
      { key: 'markup', label: 'Markup on cost', format: 'percent' },
      { key: 'profit', label: 'Profit per unit', format: 'money' },
    ],
    compute: v => {
      const m = Math.min(v.targetMargin, 99) / 100
      const price = v.cost / (1 - m)
      return { price, markup: safe((price - v.cost) / v.cost), profit: price - v.cost }
    },
    insight: (v, o) =>
      `To earn a ${v.targetMargin}% margin at a $${v.cost} cost, charge $${o.price.toFixed(2)}. Raising price 10% with costs flat adds far more profit than selling 10% more units.`,
    sells: 'pricing-strategy-toolkit',
  },
  {
    id: 'roi-calculator',
    name: 'ROI & Payback Calculator',
    category: 'Finance',
    tagline: 'Should you make this investment? Get the number.',
    description:
      'Enter the cost of an investment and the return it generates. This tool returns your ROI, net gain, and how long until it pays for itself.',
    inputs: [
      { key: 'cost', label: 'Investment / cost', default: 10000, prefix: '$' },
      { key: 'return', label: 'Total return generated', default: 25000, prefix: '$' },
      { key: 'months', label: 'Over how many months', default: 12 },
    ],
    outputs: [
      { key: 'net', label: 'Net gain', format: 'money' },
      { key: 'roi', label: 'ROI', format: 'percent', highlight: true },
      { key: 'monthly', label: 'Monthly return', format: 'money' },
      { key: 'payback', label: 'Payback period', format: 'months', highlight: true },
    ],
    compute: v => {
      const net = v.return - v.cost
      const monthly = safe(v.return / v.months)
      return { net, roi: safe(net / v.cost), monthly, payback: safe(v.cost / monthly) }
    },
    insight: (_v, o) =>
      o.roi <= 0
        ? `This loses money as modeled — the return doesn't cover the cost. Change the terms or walk away.`
        : `A ${(o.roi * 100).toFixed(0)}% ROI, paying itself back in ${o.payback.toFixed(1)} months. Compare against your next-best use of the same cash before committing.`,
    sells: 'annual-operating-budget-model',
  },

  {
    id: 'gross-margin-calculator', name: 'Gross Margin Calculator', category: 'Finance',
    tagline: 'The single number that decides if a business can scale.',
    description: 'Enter revenue and cost of goods sold to get your gross profit and gross margin — the ceiling on everything else your business can afford.',
    inputs: [{ key: 'revenue', label: 'Revenue', default: 1000000, prefix: '$' }, { key: 'cogs', label: 'Cost of goods sold', default: 300000, prefix: '$' }],
    outputs: [{ key: 'gp', label: 'Gross profit', format: 'money' }, { key: 'margin', label: 'Gross margin', format: 'percent', highlight: true }],
    compute: v => { const gp = v.revenue - v.cogs; return { gp, margin: safe(gp / v.revenue) } },
    insight: (_v, o) => o.margin >= 0.7 ? `A ${(o.margin * 100).toFixed(0)}% margin is software-grade — you can fund growth from your own economics.` : o.margin <= 0.2 ? `At ${(o.margin * 100).toFixed(0)}% there's almost no room for overhead. Raise price or cut COGS before scaling.` : `${(o.margin * 100).toFixed(0)}% is workable, but every point you add drops straight to operating leverage.`,
    sells: 'unit-economics-calculator',
  },
  {
    id: 'ebitda-calculator', name: 'EBITDA Calculator', category: 'Finance',
    tagline: 'The profit number buyers and lenders actually use.',
    description: 'Add net income, interest, taxes, and depreciation/amortization to get EBITDA and your EBITDA margin — the standard proxy for operating profitability.',
    inputs: [{ key: 'revenue', label: 'Revenue', default: 1000000, prefix: '$' }, { key: 'ni', label: 'Net income', default: 150000, prefix: '$' }, { key: 'interest', label: 'Interest', default: 20000, prefix: '$' }, { key: 'taxes', label: 'Taxes', default: 50000, prefix: '$' }, { key: 'da', label: 'Depreciation & amortization', default: 30000, prefix: '$' }],
    outputs: [{ key: 'ebitda', label: 'EBITDA', format: 'money', highlight: true }, { key: 'margin', label: 'EBITDA margin', format: 'percent' }],
    compute: v => { const e = v.ni + v.interest + v.taxes + v.da; return { ebitda: e, margin: safe(e / v.revenue) } },
    insight: (_v, o) => `EBITDA of ${o.ebitda.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} (${(o.margin * 100).toFixed(0)}% margin). Most buyers value a business as a multiple of this number — grow it and the whole company is worth more.`,
    sells: 'annual-operating-budget-model',
  },
  {
    id: 'cagr-calculator', name: 'CAGR Calculator', category: 'Finance',
    tagline: 'Your true compound growth rate, cutting through the noise.',
    description: 'Enter a starting value, ending value, and number of years to get the compound annual growth rate — the honest, smoothed rate of growth.',
    inputs: [{ key: 'start', label: 'Starting value', default: 100000, prefix: '$' }, { key: 'end', label: 'Ending value', default: 250000, prefix: '$' }, { key: 'years', label: 'Number of years', default: 5 }],
    outputs: [{ key: 'cagr', label: 'CAGR', format: 'percent', highlight: true }, { key: 'total', label: 'Total growth', format: 'percent' }],
    compute: v => ({ cagr: v.start > 0 && v.years > 0 ? Math.pow(v.end / v.start, 1 / v.years) - 1 : 0, total: safe(v.end / v.start - 1) }),
    insight: (_v, o) => `A ${(o.cagr * 100).toFixed(1)}% compound annual growth rate. CAGR strips out the lucky and unlucky years — it's the number to compare across companies and time.`,
    sells: 'startup-financial-model-3-statement',
  },
  {
    id: 'rule-of-72', name: 'Rule of 72 Calculator', category: 'Finance',
    tagline: 'How long until your money doubles.',
    description: 'Enter an annual rate of return to see how many years it takes to double your money — the mental-math shortcut every operator knows.',
    inputs: [{ key: 'rate', label: 'Annual return', default: 8, suffix: '%' }],
    outputs: [{ key: 'years', label: 'Years to double', format: 'number', highlight: true }],
    compute: v => ({ years: safe(72 / v.rate) }),
    insight: (_v, o) => `At this rate, your money doubles roughly every ${o.years.toFixed(1)} years. Doubling time is the clearest way to feel the power — and the cost — of a compounding rate.`,
  },
  {
    id: 'cash-conversion-cycle', name: 'Cash Conversion Cycle', category: 'Finance',
    tagline: 'How many days your cash is trapped in the business.',
    description: 'Enter your inventory, receivable, and payable days to get your cash conversion cycle — how long a dollar is tied up before it comes back as cash.',
    inputs: [{ key: 'dio', label: 'Days inventory outstanding', default: 45 }, { key: 'dso', label: 'Days sales outstanding', default: 40 }, { key: 'dpo', label: 'Days payables outstanding', default: 30 }],
    outputs: [{ key: 'ccc', label: 'Cash conversion cycle (days)', format: 'number', highlight: true }],
    compute: v => ({ ccc: v.dio + v.dso - v.dpo }),
    insight: (_v, o) => o.ccc <= 0 ? `Negative cycle — your suppliers fund your growth. Rare and powerful; protect it.` : `${o.ccc.toFixed(0)} days of cash tied up per cycle. Shortening this frees cash without raising a dollar — collect faster, pay slower, hold less stock.`,
    sells: '13-week-cash-flow-model',
  },
  {
    id: 'working-capital-calculator', name: 'Working Capital Calculator', category: 'Finance',
    tagline: 'Can you cover the next 12 months of obligations?',
    description: 'Enter current assets and current liabilities to get your working capital and current ratio — a fast read on short-term financial health.',
    inputs: [{ key: 'ca', label: 'Current assets', default: 500000, prefix: '$' }, { key: 'cl', label: 'Current liabilities', default: 300000, prefix: '$' }],
    outputs: [{ key: 'wc', label: 'Working capital', format: 'money', highlight: true }, { key: 'ratio', label: 'Current ratio', format: 'x' }],
    compute: v => ({ wc: v.ca - v.cl, ratio: safe(v.ca / v.cl) }),
    insight: (_v, o) => o.ratio < 1 ? `A current ratio under 1.0 means short-term bills exceed short-term assets — a liquidity warning.` : `A ${o.ratio.toFixed(1)}x current ratio. Comfortable is 1.5–3.0; far above that can mean idle cash that should be working.`,
    sells: '13-week-cash-flow-model',
  },
  {
    id: 'burn-multiple', name: 'Burn Multiple Calculator', category: 'Finance',
    tagline: 'How efficiently you turn cash into growth.',
    description: 'Enter net burn and net new ARR to get your burn multiple — dollars burned per dollar of new recurring revenue. The efficiency metric investors watch.',
    inputs: [{ key: 'burn', label: 'Net burn (period)', default: 200000, prefix: '$' }, { key: 'arr', label: 'Net new ARR (period)', default: 100000, prefix: '$' }],
    outputs: [{ key: 'multiple', label: 'Burn multiple', format: 'x', highlight: true }],
    compute: v => ({ multiple: safe(v.burn / v.arr) }),
    insight: (_v, o) => o.multiple <= 1 ? `Under 1x is excellent — you're building revenue faster than you're burning. Investors love this.` : o.multiple > 2 ? `Above 2x is inefficient growth. Tighten spend or improve conversion before raising more.` : `${o.multiple.toFixed(1)}x is acceptable. Aim under 1.5x to keep the next raise easy.`,
    sells: 'runway-burn-tracker',
  },
  {
    id: 'net-profit-margin', name: 'Net Profit Margin Calculator', category: 'Finance',
    tagline: 'What actually reaches the bottom line.',
    description: 'Enter revenue and net profit to get your net margin — the share of every dollar of sales you actually keep.',
    inputs: [{ key: 'revenue', label: 'Revenue', default: 1000000, prefix: '$' }, { key: 'profit', label: 'Net profit', default: 120000, prefix: '$' }],
    outputs: [{ key: 'margin', label: 'Net profit margin', format: 'percent', highlight: true }],
    compute: v => ({ margin: safe(v.profit / v.revenue) }),
    insight: (_v, o) => o.margin < 0 ? `You're operating at a loss. Not always wrong when growing — but know why, and know your runway.` : `You keep ${(o.margin * 100).toFixed(1)}¢ of every revenue dollar. Compare to your industry; the gap is your opportunity.`,
    sells: 'unit-economics-calculator',
  },
  {
    id: 'markup-vs-margin', name: 'Markup vs. Margin Calculator', category: 'Finance',
    tagline: 'Stop confusing the two — it costs real money.',
    description: 'Enter cost and price to see both the markup on cost and the true gross margin. Mixing them up is one of the most expensive small-business mistakes.',
    inputs: [{ key: 'cost', label: 'Cost', default: 40, prefix: '$' }, { key: 'price', label: 'Price', default: 100, prefix: '$' }],
    outputs: [{ key: 'profit', label: 'Profit per unit', format: 'money' }, { key: 'markup', label: 'Markup on cost', format: 'percent' }, { key: 'margin', label: 'Gross margin', format: 'percent', highlight: true }],
    compute: v => ({ profit: v.price - v.cost, markup: safe((v.price - v.cost) / v.cost), margin: safe((v.price - v.cost) / v.price) }),
    insight: (_v, o) => `A ${(o.markup * 100).toFixed(0)}% markup is only a ${(o.margin * 100).toFixed(0)}% margin — they're never equal. Price off margin, not markup, or you'll quietly under-earn.`,
    sells: 'pricing-strategy-toolkit',
  },
  {
    id: 'loan-payment-calculator', name: 'Loan Payment Calculator', category: 'Finance',
    tagline: 'The real monthly cost of any loan.',
    description: 'Enter principal, rate, and term to get your monthly payment and the total interest you’ll pay over the life of the loan.',
    inputs: [{ key: 'principal', label: 'Loan amount', default: 250000, prefix: '$' }, { key: 'rate', label: 'Annual interest rate', default: 7, suffix: '%' }, { key: 'years', label: 'Term (years)', default: 15 }],
    outputs: [{ key: 'monthly', label: 'Monthly payment', format: 'money', highlight: true }, { key: 'interest', label: 'Total interest', format: 'money' }, { key: 'total', label: 'Total repaid', format: 'money' }],
    compute: v => { const r = v.rate / 1200, n = v.years * 12; const m = r === 0 ? safe(v.principal / n) : v.principal * r / (1 - Math.pow(1 + r, -n)); const total = m * n; return { monthly: m, interest: total - v.principal, total } },
    insight: (_v, o) => `That's ${o.interest.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} in total interest — often a huge share of what you repay. Shortening the term or the rate cuts it fast.`,
    sells: 'annual-operating-budget-model',
  },
  {
    id: 'equity-dilution-calculator', name: 'Equity Dilution Calculator', category: 'Fundraising',
    tagline: 'See exactly how much of your company a round costs.',
    description: 'Enter your pre-money valuation and raise amount to see the post-money valuation, the investor’s ownership, and what founders retain.',
    inputs: [{ key: 'pre', label: 'Pre-money valuation', default: 8000000, prefix: '$' }, { key: 'raise', label: 'Amount raising', default: 2000000, prefix: '$' }],
    outputs: [{ key: 'post', label: 'Post-money valuation', format: 'money' }, { key: 'investor', label: 'Investor ownership', format: 'percent', highlight: true }, { key: 'retained', label: 'Founders retain', format: 'percent' }],
    compute: v => { const post = v.pre + v.raise; const inv = safe(v.raise / post); return { post, investor: inv, retained: 1 - inv } },
    insight: (_v, o) => `This round gives up ${(o.investor * 100).toFixed(1)}% of the company. Raising more at the same valuation costs more ownership — a higher pre-money is worth more than a bigger check.`,
    sells: 'cap-table-model',
  },
  {
    id: 'pre-post-money-calculator', name: 'Pre / Post-Money Calculator', category: 'Fundraising',
    tagline: 'Back into the valuation from the terms on the table.',
    description: 'Enter the investment and the ownership sold to derive the implied post-money and pre-money valuation — useful for sanity-checking a term sheet.',
    inputs: [{ key: 'investment', label: 'Investment amount', default: 2000000, prefix: '$' }, { key: 'ownership', label: 'Ownership sold', default: 20, suffix: '%' }],
    outputs: [{ key: 'post', label: 'Post-money valuation', format: 'money', highlight: true }, { key: 'pre', label: 'Pre-money valuation', format: 'money' }],
    compute: v => { const post = safe(v.investment / (v.ownership / 100)); return { post, pre: post - v.investment } },
    insight: (_v, o) => `A ${o.post.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} post-money is implied. If that feels high or low for your traction, the ownership ask — not the check size — is the lever to negotiate.`,
    sells: 'cap-table-model',
  },
  {
    id: 'runway-after-raise', name: 'Runway-After-Raise Calculator', category: 'Fundraising',
    tagline: 'How many months a raise actually buys you.',
    description: 'Enter current cash, the amount raised, and monthly burn to see your total runway after the round closes.',
    inputs: [{ key: 'cash', label: 'Current cash', default: 300000, prefix: '$' }, { key: 'raise', label: 'Amount raised', default: 2000000, prefix: '$' }, { key: 'burn', label: 'Monthly net burn', default: 180000, prefix: '$' }],
    outputs: [{ key: 'total', label: 'Total cash after raise', format: 'money' }, { key: 'runway', label: 'Runway', format: 'months', highlight: true }],
    compute: v => ({ total: v.cash + v.raise, runway: safe((v.cash + v.raise) / v.burn) }),
    insight: (_v, o) => `${o.runway.toFixed(0)} months of runway. Raise enough for 18–24 months and clear milestones — a round that only buys 9 months forces you back out fundraising almost immediately.`,
    sells: 'runway-burn-tracker',
  },
  {
    id: 'equity-value-calculator', name: 'Equity Value Calculator', category: 'Fundraising',
    tagline: 'What your shares (or an offer’s equity) are really worth.',
    description: 'Enter your share count, total shares outstanding, and company valuation to see your ownership percentage and its dollar value.',
    inputs: [{ key: 'shares', label: 'Your shares', default: 50000 }, { key: 'total', label: 'Total shares outstanding', default: 10000000 }, { key: 'valuation', label: 'Company valuation', default: 50000000, prefix: '$' }],
    outputs: [{ key: 'ownership', label: 'Your ownership', format: 'percent' }, { key: 'value', label: 'Equity value', format: 'money', highlight: true }],
    compute: v => { const own = safe(v.shares / v.total); return { ownership: own, value: own * v.valuation } },
    insight: (_v, o) => `Your stake is worth ${o.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} at this valuation — on paper. Remember dilution and liquidation preferences can change what you actually take home.`,
    sells: 'cap-table-model',
  },
  {
    id: 'net-revenue-retention', name: 'Net Revenue Retention Calculator', category: 'Revenue',
    tagline: 'The metric that predicts durable growth.',
    description: 'Enter starting MRR, expansion, and churned revenue to get NRR — how much revenue you keep and grow from existing customers alone.',
    inputs: [{ key: 'start', label: 'Starting MRR', default: 100000, prefix: '$' }, { key: 'expansion', label: 'Expansion MRR', default: 15000, prefix: '$' }, { key: 'churned', label: 'Churned MRR', default: 8000, prefix: '$' }],
    outputs: [{ key: 'nrr', label: 'Net revenue retention', format: 'percent', highlight: true }],
    compute: v => ({ nrr: safe((v.start + v.expansion - v.churned) / v.start) }),
    insight: (_v, o) => o.nrr >= 1 ? `Above 100% — your existing base grows even if you add zero new customers. That's the holy grail of SaaS.` : `Under 100% means you leak revenue and must run just to stand still. Fix expansion and churn before pouring into acquisition.`,
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'rule-of-40', name: 'Rule of 40 Calculator', category: 'Revenue',
    tagline: 'Are you balancing growth and profit like investors want?',
    description: 'Add your growth rate and profit margin. If the sum is 40 or more, you’re balancing growth and profitability at the level investors reward.',
    inputs: [{ key: 'growth', label: 'YoY growth rate', default: 60, suffix: '%' }, { key: 'margin', label: 'Profit margin', default: -10, suffix: '%' }],
    outputs: [{ key: 'score', label: 'Rule of 40 score', format: 'number', highlight: true }],
    compute: v => ({ score: v.growth + v.margin }),
    insight: (_v, o) => o.score >= 40 ? `${o.score.toFixed(0)} — you pass. High growth can justify low margin, and vice versa; you're in the fundable zone.` : `${o.score.toFixed(0)} — below 40. Either grow faster or improve margin; investors use this line as a quick filter.`,
    sells: 'saas-metrics-dashboard',
  },
  {
    id: 'cac-calculator', name: 'CAC Calculator', category: 'Revenue',
    tagline: 'What it truly costs to win one customer.',
    description: 'Divide your sales and marketing spend by new customers to get customer acquisition cost — the number every growth decision hinges on.',
    inputs: [{ key: 'spend', label: 'Sales & marketing spend', default: 50000, prefix: '$' }, { key: 'customers', label: 'New customers acquired', default: 200 }],
    outputs: [{ key: 'cac', label: 'CAC', format: 'money', highlight: true }],
    compute: v => ({ cac: safe(v.spend / v.customers) }),
    insight: (_v, o) => `It costs ${o.cac.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} to acquire a customer. This only means something next to LTV — aim for a customer worth at least 3x this.`,
    sells: 'unit-economics-calculator',
  },
  {
    id: 'ltv-calculator', name: 'LTV Calculator', category: 'Revenue',
    tagline: 'What a customer is worth over their whole lifetime.',
    description: 'Enter ARPU, gross margin, and monthly churn to estimate customer lifetime value — the ceiling on what you can profitably spend to acquire one.',
    inputs: [{ key: 'arpu', label: 'Monthly revenue per user', default: 100, prefix: '$' }, { key: 'margin', label: 'Gross margin', default: 80, suffix: '%' }, { key: 'churn', label: 'Monthly churn', default: 4, suffix: '%' }],
    outputs: [{ key: 'lifetime', label: 'Avg. lifetime', format: 'months' }, { key: 'ltv', label: 'LTV', format: 'money', highlight: true }],
    compute: v => { const life = safe(1 / (v.churn / 100)); return { lifetime: life, ltv: v.arpu * (v.margin / 100) * life } },
    insight: (_v, o) => `Each customer is worth about ${o.ltv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}. Lowering churn extends lifetime — it's the highest-leverage number in the formula.`,
    sells: 'unit-economics-calculator',
  },
  {
    id: 'churn-lifetime-calculator', name: 'Churn-to-Lifetime Calculator', category: 'Revenue',
    tagline: 'Turn a churn rate into how long customers actually stay.',
    description: 'Enter monthly churn to see average customer lifetime and one-year retention — churn is abstract, months and percentages are not.',
    inputs: [{ key: 'churn', label: 'Monthly churn rate', default: 5, suffix: '%' }],
    outputs: [{ key: 'lifetime', label: 'Avg. customer lifetime', format: 'months', highlight: true }, { key: 'retention', label: '12-month retention', format: 'percent' }],
    compute: v => ({ lifetime: safe(1 / (v.churn / 100)), retention: Math.pow(1 - v.churn / 100, 12) }),
    insight: (_v, o) => `A customer stays ${o.lifetime.toFixed(0)} months on average, and only ${(o.retention * 100).toFixed(0)}% survive the first year. Small churn improvements compound enormously over time.`,
    sells: 'churn-reduction-playbook',
  },
  {
    id: 'discount-impact-calculator', name: 'Discount Impact Calculator', category: 'Revenue',
    tagline: 'How many more sales a discount really requires.',
    description: 'Enter your gross margin and a proposed discount to see how much extra volume you’d need just to hold the same total profit. The answer surprises most people.',
    inputs: [{ key: 'margin', label: 'Current gross margin', default: 50, suffix: '%' }, { key: 'discount', label: 'Proposed discount', default: 10, suffix: '%' }],
    outputs: [{ key: 'extra', label: 'Extra volume needed', format: 'percent', highlight: true }],
    compute: v => { const m = v.margin / 100, d = v.discount / 100; return { extra: m > d ? d / (m - d) : 5 } },
    insight: (v, o) => v.discount / 100 >= v.margin / 100 ? `This discount exceeds your margin — no volume can save it. You'd lose money on every extra sale.` : `A ${v.discount}% discount needs ${(o.extra * 100).toFixed(0)}% more unit volume just to break even on profit. Discounts are far more expensive than they look.`,
    sells: 'pricing-strategy-toolkit',
  },
  {
    id: 'sales-commission-calculator', name: 'Sales Commission Calculator', category: 'Revenue',
    tagline: 'Model rep earnings — and your commission cost.',
    description: 'Enter deal size, commission rate, and deals per month to see per-deal, monthly, and annual commission.',
    inputs: [{ key: 'deal', label: 'Average deal size', default: 20000, prefix: '$' }, { key: 'rate', label: 'Commission rate', default: 8, suffix: '%' }, { key: 'deals', label: 'Deals per month', default: 4 }],
    outputs: [{ key: 'perDeal', label: 'Commission per deal', format: 'money' }, { key: 'monthly', label: 'Monthly commission', format: 'money', highlight: true }, { key: 'annual', label: 'Annual commission', format: 'money' }],
    compute: v => { const pd = v.deal * v.rate / 100; const m = pd * v.deals; return { perDeal: pd, monthly: m, annual: m * 12 } },
    insight: (_v, o) => `That's ${o.annual.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/yr in commission per rep at this pace. Commission should motivate the behavior you want — tie it to margin, not just top-line, where you can.`,
    sells: 'sales-comp-plan-builder',
  },
  {
    id: 'roas-calculator', name: 'ROAS Calculator', category: 'Marketing',
    tagline: 'Is your ad spend actually making money?',
    description: 'Enter ad spend and the revenue it produced to get return on ad spend and net profit from the campaign.',
    inputs: [{ key: 'spend', label: 'Ad spend', default: 10000, prefix: '$' }, { key: 'revenue', label: 'Revenue generated', default: 40000, prefix: '$' }],
    outputs: [{ key: 'roas', label: 'ROAS', format: 'x', highlight: true }, { key: 'profit', label: 'Net (rev − spend)', format: 'money' }],
    compute: v => ({ roas: safe(v.revenue / v.spend), profit: v.revenue - v.spend }),
    insight: (_v, o) => o.roas < 1 ? `Under 1x — you're spending more than the ads return. Pause and fix targeting or creative before scaling.` : `${o.roas.toFixed(1)}x return. Remember ROAS ignores product costs — check it against your margin before calling it profitable.`,
    sells: 'marketing-metrics-dashboard',
  },
  {
    id: 'conversion-funnel-calculator', name: 'Conversion Funnel Calculator', category: 'Marketing',
    tagline: 'Turn traffic and a conversion rate into revenue.',
    description: 'Enter visitors, conversion rate, and average order value to project customers and revenue from a funnel.',
    inputs: [{ key: 'visitors', label: 'Monthly visitors', default: 10000 }, { key: 'cvr', label: 'Conversion rate', default: 2, suffix: '%' }, { key: 'aov', label: 'Average order value', default: 80, prefix: '$' }],
    outputs: [{ key: 'customers', label: 'Customers / month', format: 'number' }, { key: 'revenue', label: 'Revenue / month', format: 'money', highlight: true }],
    compute: v => { const c = v.visitors * v.cvr / 100; return { customers: c, revenue: c * v.aov } },
    insight: (_v, o) => `${o.customers.toFixed(0)} customers and ${o.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/mo. Doubling conversion rate is usually cheaper than doubling traffic — optimize the funnel before buying more clicks.`,
    sells: 'gtm-metrics-dashboard',
  },
  {
    id: 'email-roi-calculator', name: 'Email Marketing ROI Calculator', category: 'Marketing',
    tagline: 'What your list is actually worth per send.',
    description: 'Enter list size, click rate, purchase rate, and order value to project revenue from an email campaign.',
    inputs: [{ key: 'recipients', label: 'Recipients', default: 20000 }, { key: 'click', label: 'Click rate', default: 3, suffix: '%' }, { key: 'purchase', label: 'Purchase rate (of clicks)', default: 10, suffix: '%' }, { key: 'aov', label: 'Average order value', default: 60, prefix: '$' }],
    outputs: [{ key: 'buyers', label: 'Buyers', format: 'number' }, { key: 'revenue', label: 'Campaign revenue', format: 'money', highlight: true }],
    compute: v => { const b = v.recipients * (v.click / 100) * (v.purchase / 100); return { buyers: b, revenue: b * v.aov } },
    insight: (_v, o) => `About ${o.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} per send. Email is often the highest-ROI channel you own — growing the list compounds every future campaign.`,
    sells: 'email-marketing-kit',
  },
  {
    id: 'ad-cost-calculator', name: 'CPM / CPC / CPA Calculator', category: 'Marketing',
    tagline: 'Break any ad campaign down to what each result costs.',
    description: 'Enter budget, impressions, click-through, and conversion rate to get cost per thousand impressions, per click, and per acquisition.',
    inputs: [{ key: 'budget', label: 'Campaign budget', default: 5000, prefix: '$' }, { key: 'impressions', label: 'Impressions', default: 500000 }, { key: 'ctr', label: 'Click-through rate', default: 1.5, suffix: '%' }, { key: 'cvr', label: 'Conversion rate', default: 5, suffix: '%' }],
    outputs: [{ key: 'cpm', label: 'CPM', format: 'money' }, { key: 'cpc', label: 'CPC', format: 'money' }, { key: 'cpa', label: 'CPA', format: 'money', highlight: true }],
    compute: v => { const clicks = v.impressions * v.ctr / 100; const conv = clicks * v.cvr / 100; return { cpm: safe(v.budget / v.impressions * 1000), cpc: safe(v.budget / clicks), cpa: safe(v.budget / conv) } },
    insight: (_v, o) => `Each customer costs ${o.cpa.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} through this campaign. CPA is the only one of the three that touches your P&L — compare it to your margin, not your gut.`,
    sells: 'marketing-metrics-dashboard',
  },
  {
    id: 'cost-of-hire-calculator', name: 'Fully-Loaded Cost of Hire', category: 'People',
    tagline: 'What an employee really costs — not just salary.',
    description: 'Add benefits and overhead to a base salary to get the fully-loaded annual and monthly cost of a hire — the number to budget against.',
    inputs: [{ key: 'base', label: 'Base salary', default: 120000, prefix: '$' }, { key: 'benefits', label: 'Benefits & taxes', default: 25, suffix: '%' }, { key: 'overhead', label: 'Overhead (tools, space)', default: 15, suffix: '%' }],
    outputs: [{ key: 'loaded', label: 'Fully-loaded annual', format: 'money', highlight: true }, { key: 'monthly', label: 'Monthly cost', format: 'money' }],
    compute: v => { const loaded = v.base * (1 + v.benefits / 100 + v.overhead / 100); return { loaded, monthly: loaded / 12 } },
    insight: (_v, o) => `A hire really costs ${o.loaded.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/yr — well above the salary line. Budget the loaded number, and this is exactly why a fractional executive can pay off.`,
    sells: 'hiring-plan-budget-model',
  },
  {
    id: 'cost-of-turnover-calculator', name: 'Cost of Turnover Calculator', category: 'People',
    tagline: 'The hidden price of losing an employee.',
    description: 'Enter a salary and a replacement-cost percentage to estimate what turnover in that role actually costs you.',
    inputs: [{ key: 'salary', label: 'Annual salary', default: 90000, prefix: '$' }, { key: 'pct', label: 'Replacement cost', default: 50, suffix: '%' }],
    outputs: [{ key: 'cost', label: 'Cost per departure', format: 'money', highlight: true }],
    compute: v => ({ cost: v.salary * v.pct / 100 }),
    insight: (_v, o) => `Losing this role costs roughly ${o.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} in recruiting, ramp, and lost output. Retention spending is often cheaper than the turnover it prevents.`,
    sells: 'recognition-retention-kit',
  },
  {
    id: 'utilization-calculator', name: 'Utilization Rate Calculator', category: 'People',
    tagline: 'Is your team’s billable time where it should be?',
    description: 'Enter billable hours and available hours to get utilization — the core efficiency metric for any services or agency business.',
    inputs: [{ key: 'billable', label: 'Billable hours / week', default: 28 }, { key: 'available', label: 'Available hours / week', default: 40 }],
    outputs: [{ key: 'utilization', label: 'Utilization', format: 'percent', highlight: true }, { key: 'idle', label: 'Non-billable hours', format: 'number' }],
    compute: v => ({ utilization: safe(v.billable / v.available), idle: v.available - v.billable }),
    insight: (_v, o) => `${(o.utilization * 100).toFixed(0)}% utilization. Most healthy services firms target 70–85% — higher risks burnout, lower leaks margin.`,
    sells: 'capacity-planning-model',
  },
  {
    id: 'compound-interest-calculator', name: 'Compound Interest Calculator', category: 'Money',
    tagline: 'Watch small, steady money become a large number.',
    description: 'Enter a starting amount, monthly contribution, rate, and horizon to see the future value — and how much of it is pure compounding.',
    inputs: [{ key: 'principal', label: 'Starting amount', default: 10000, prefix: '$' }, { key: 'monthly', label: 'Monthly contribution', default: 500, prefix: '$' }, { key: 'rate', label: 'Annual return', default: 7, suffix: '%' }, { key: 'years', label: 'Years', default: 20 }],
    outputs: [{ key: 'fv', label: 'Future value', format: 'money', highlight: true }, { key: 'contributed', label: 'Total contributed', format: 'money' }, { key: 'interest', label: 'Growth from compounding', format: 'money' }],
    compute: v => { const r = v.rate / 1200, n = v.years * 12; const fvp = v.principal * Math.pow(1 + r, n); const fvc = r > 0 ? v.monthly * ((Math.pow(1 + r, n) - 1) / r) : v.monthly * n; const fv = fvp + fvc; const contributed = v.principal + v.monthly * n; return { fv, contributed, interest: fv - contributed } },
    insight: (_v, o) => `You'd contribute ${o.contributed.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} and end near ${o.fv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} — the rest is compounding doing the work. Time in the market beats timing it.`,
  },
  {
    id: 'emergency-fund-calculator', name: 'Emergency Fund Calculator', category: 'Money',
    tagline: 'How much cushion you actually need.',
    description: 'Enter monthly expenses, target months of coverage, and current savings to see your emergency-fund target and remaining gap.',
    inputs: [{ key: 'expenses', label: 'Monthly expenses', default: 4000, prefix: '$' }, { key: 'months', label: 'Months of coverage', default: 6 }, { key: 'savings', label: 'Current savings', default: 5000, prefix: '$' }],
    outputs: [{ key: 'target', label: 'Fund target', format: 'money', highlight: true }, { key: 'gap', label: 'Still to save', format: 'money' }],
    compute: v => { const target = v.expenses * v.months; return { target, gap: Math.max(0, target - v.savings) } },
    insight: (_v, o) => o.gap <= 0 ? `You're fully funded — nicely done. This is the foundation that lets you take smart risks everywhere else.` : `You need ${o.gap.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} more. Automate a fixed weekly transfer and it fills faster than you'd expect.`,
  },
  {
    id: 'debt-payoff-calculator', name: 'Debt Payoff Calculator', category: 'Money',
    tagline: 'How long, and how much interest, at your current payment.',
    description: 'Enter a balance, APR, and monthly payment to see months to payoff and total interest — and why paying a little more matters so much.',
    inputs: [{ key: 'balance', label: 'Balance', default: 15000, prefix: '$' }, { key: 'apr', label: 'APR', default: 22, suffix: '%' }, { key: 'payment', label: 'Monthly payment', default: 400, prefix: '$' }],
    outputs: [{ key: 'months', label: 'Months to payoff', format: 'months', highlight: true }, { key: 'interest', label: 'Total interest paid', format: 'money' }],
    compute: v => { const r = v.apr / 1200; if (v.payment <= v.balance * r) return { months: 999, interest: v.balance * 2 }; const m = -Math.log(1 - (v.balance * r) / v.payment) / Math.log(1 + r); return { months: m, interest: v.payment * m - v.balance } },
    insight: (_v, o) => o.months >= 999 ? `Your payment barely covers the interest — the balance will never fall. Increase the payment above the monthly interest to make real progress.` : `Paid off in ${o.months.toFixed(0)} months with ${o.interest.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} of interest. Adding even a little to the payment cuts both dramatically.`,
  },
  {
    id: 'fire-number-calculator', name: 'FIRE Number Calculator', category: 'Money',
    tagline: 'The nest egg that buys your freedom.',
    description: 'Enter your annual expenses and a safe withdrawal rate to see the portfolio size at which work becomes optional.',
    inputs: [{ key: 'expenses', label: 'Annual expenses', default: 60000, prefix: '$' }, { key: 'wr', label: 'Safe withdrawal rate', default: 4, suffix: '%' }],
    outputs: [{ key: 'fire', label: 'FIRE number', format: 'money', highlight: true }, { key: 'multiple', label: 'Multiple of expenses', format: 'x' }],
    compute: v => ({ fire: safe(v.expenses / (v.wr / 100)), multiple: safe(1 / (v.wr / 100)) }),
    insight: (_v, o) => `At this spending, freedom costs about ${o.fire.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} invested — roughly ${o.multiple.toFixed(0)}x your annual expenses. Cutting expenses lowers the target twice: less to cover, less to save.`,
  },
  {
    id: 'effective-hourly-calculator', name: 'Effective Hourly Rate Calculator', category: 'Money',
    tagline: 'What your salary really pays per hour.',
    description: 'Enter your salary and the hours you actually work to see your true hourly and daily rate — often a wake-up call.',
    inputs: [{ key: 'salary', label: 'Annual salary', default: 100000, prefix: '$' }, { key: 'hours', label: 'Hours worked / week', default: 45 }],
    outputs: [{ key: 'hourly', label: 'Effective hourly rate', format: 'money', highlight: true }, { key: 'daily', label: 'Per 8-hour day', format: 'money' }],
    compute: v => { const h = safe(v.salary / (v.hours * 52)); return { hourly: h, daily: h * 8 } },
    insight: (_v, o) => `You earn about ${o.hourly.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/hour for the hours you actually work. Cutting low-value hours raises this number without a raise.`,
  },
  {
    id: 'freelance-rate-calculator', name: 'Freelance Rate Calculator', category: 'Money',
    tagline: 'The hourly rate you must charge to hit your goal.',
    description: 'Enter your target income, billable hours, weeks worked, and overhead to get the rate you should actually charge — most freelancers price far too low.',
    inputs: [{ key: 'target', label: 'Target annual income', default: 120000, prefix: '$' }, { key: 'billable', label: 'Billable hours / week', default: 25 }, { key: 'weeks', label: 'Weeks worked / year', default: 46 }, { key: 'overhead', label: 'Overhead & buffer', default: 25, suffix: '%' }],
    outputs: [{ key: 'base', label: 'Break-even rate', format: 'money' }, { key: 'rate', label: 'Rate to charge', format: 'money', highlight: true }],
    compute: v => { const base = safe(v.target / (v.billable * v.weeks)); return { base, rate: base * (1 + v.overhead / 100) } },
    insight: (_v, o) => `Charge about ${o.rate.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/hour. Only a fraction of your week is billable, so your rate must cover the unbilled hours too — that's why it feels high but isn't.`,
  },
]

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(t => t.id === id)
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter(t => t.category === category)
}

export const TOOL_CATEGORIES = Array.from(new Set(TOOLS.map(t => t.category)))
