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
]

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(t => t.id === id)
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter(t => t.category === category)
}

export const TOOL_CATEGORIES = Array.from(new Set(TOOLS.map(t => t.category)))
