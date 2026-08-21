// "Mega-sims" — bespoke, end-to-end company operating models that link many
// simulations into one integrated model (revenue → margin → opex → EBITDA →
// cash → runway → valuation, plus unit economics). These are the demo of the
// Enterprise / bespoke tier: a custom model of a client's entire business.

const money = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const pct = (n: number) => `${(isFinite(n) ? n * 100 : 0).toFixed(0)}%`

export interface MegaInput { key: string; label: string; default: number; prefix?: string; suffix?: string }
export interface MegaModule { title: string; blurb: string; inputs: MegaInput[] }
export interface MegaMetric { label: string; value: string; highlight?: boolean; bad?: boolean }
export interface MegaSection { title: string; columns: string[]; rows: string[][] }
export interface MegaResult { summary: MegaMetric[]; sections: MegaSection[]; note: string }

export interface MegaSim {
  id: string
  name: string
  category: string
  /** One-time price for this integrated company model. */
  price: number
  tagline: string
  description: string
  modules: MegaModule[]
  compute: (v: Record<string, number>) => MegaResult
}

/** Standard price for a productized end-to-end company model. */
export const COMPANY_MODEL_PRICE = 250

const chk = (t: number, months: number) => t === 1 || t % 3 === 0 || t === months

export const MEGA_SIMS: MegaSim[] = [
  {
    id: 'saas-company-operating-model',
    name: 'SaaS Company — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'One linked model: growth → revenue → margin → burn → runway → valuation.',
    description:
      'A full operating model of a SaaS business. Growth and churn drive the customer base; the customer base drives MRR; MRR flows through gross margin and operating costs to EBITDA; EBITDA moves the cash balance and runway; and ending ARR sets an implied valuation. Change any driver and the entire company moves — the way a real bespoke Crimson Bench model works.',
    modules: [
      { title: 'Growth Engine', blurb: 'How the customer base builds and leaks.', inputs: [
        { key: 'startCustomers', label: 'Starting customers', default: 100 },
        { key: 'newPerMonth', label: 'New customers / month', default: 40 },
        { key: 'churn', label: 'Monthly churn', default: 2, suffix: '%' },
      ]},
      { title: 'Pricing & Margin', blurb: 'What each customer is worth.', inputs: [
        { key: 'arpu', label: 'ARPU / month', default: 200, prefix: '$' },
        { key: 'grossMargin', label: 'Gross margin', default: 80, suffix: '%' },
        { key: 'cac', label: 'CAC / new customer', default: 1200, prefix: '$' },
      ]},
      { title: 'Operating Costs', blurb: 'The fixed cost of running the company.', inputs: [
        { key: 'rnd', label: 'R&D / month', default: 40000, prefix: '$' },
        { key: 'gna', label: 'G&A / month', default: 30000, prefix: '$' },
      ]},
      { title: 'Capital & Horizon', blurb: 'Cash in the bank and the exit assumption.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1500000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
        { key: 'exitMultiple', label: 'Exit multiple (× ARR)', default: 8 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let customers = v.startCustomers
      let cash = v.startCash
      let lowestCash = cash
      let firstProfitMonth = 0
      const rows: string[][] = []
      let lastMRR = 0, lastEBITDA = 0
      for (let t = 1; t <= months; t++) {
        customers = customers * (1 - v.churn / 100) + v.newPerMonth
        const mrr = customers * v.arpu
        const grossProfit = mrr * (v.grossMargin / 100)
        const sm = v.newPerMonth * v.cac
        const opex = sm + v.rnd + v.gna
        const ebitda = grossProfit - opex
        cash += ebitda
        if (cash < lowestCash) lowestCash = cash
        if (firstProfitMonth === 0 && ebitda > 0) firstProfitMonth = t
        lastMRR = mrr; lastEBITDA = ebitda
        if (t === 1 || t % 3 === 0 || t === months) {
          rows.push([
            `Month ${t}`,
            Math.round(customers).toLocaleString('en-US'),
            money(mrr),
            money(grossProfit),
            money(ebitda),
            money(cash),
          ])
        }
      }
      const endingARR = lastMRR * 12
      const ltv = v.churn > 0 ? (v.arpu * (v.grossMargin / 100)) / (v.churn / 100) : 0
      const ltvCac = v.cac > 0 ? ltv / v.cac : 0
      const paybackMonths = v.arpu * (v.grossMargin / 100) > 0 ? v.cac / (v.arpu * (v.grossMargin / 100)) : 0
      const valuation = endingARR * v.exitMultiple
      const ebitdaMargin = lastMRR > 0 ? lastEBITDA / lastMRR : 0

      return {
        summary: [
          { label: 'Ending ARR', value: money(endingARR), highlight: true },
          { label: 'Ending customers', value: Math.round(customers).toLocaleString('en-US') },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'LTV : CAC', value: `${ltvCac.toFixed(1)}x`, highlight: true },
          { label: 'EBITDA margin (final)', value: pct(ebitdaMargin), bad: ebitdaMargin < 0 },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          {
            title: 'Company Trajectory',
            columns: ['Month', 'Customers', 'MRR', 'Gross Profit', 'EBITDA', 'Cash'],
            rows,
          },
          {
            title: 'Unit Economics',
            columns: ['Metric', 'Value'],
            rows: [
              ['ARPU / month', money(v.arpu)],
              ['Gross margin', pct(v.grossMargin / 100)],
              ['CAC', money(v.cac)],
              ['LTV (gross)', money(ltv)],
              ['LTV : CAC', `${ltvCac.toFixed(1)}x`],
              ['CAC payback', `${paybackMonths.toFixed(1)} mo`],
            ],
          },
        ],
        note:
          cash < 0
            ? `This plan runs out of cash before month ${months}: the lowest balance is ${money(lowestCash)}. Either slow hiring/spend, raise capital, or improve LTV:CAC (now ${ltvCac.toFixed(1)}x) before scaling acquisition. A bespoke model would layer in a fundraise, hiring waves, and price changes to find the survivable path.`
            : `The company reaches ${money(endingARR)} ARR and stays cash-solvent, ${firstProfitMonth ? `turning EBITDA-positive around month ${firstProfitMonth}` : 'though still pre-profit at the horizon'}. At a ${v.exitMultiple}× ARR multiple that implies a ${money(valuation)} enterprise value. A bespoke version would link in your real chart of accounts, hiring plan, and fundraising rounds.`,
      }
    },
  },

  {
    id: 'ecommerce-brand-operating-model',
    name: 'E-Commerce / DTC Brand — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Orders → contribution → ad spend → cash → margin → valuation, linked.',
    description:
      'A full operating model of a direct-to-consumer brand. Order growth drives revenue; revenue flows through COGS, shipping, and paid-acquisition spend to contribution and EBITDA; EBITDA moves the cash balance; and the revenue run-rate sets an implied valuation. The model that tells you whether scaling ad spend actually builds a business.',
    modules: [
      { title: 'Demand', blurb: 'How orders grow and what each is worth.', inputs: [
        { key: 'startOrders', label: 'Orders / month (start)', default: 2000 },
        { key: 'growth', label: 'Monthly order growth', default: 6, suffix: '%' },
        { key: 'aov', label: 'Average order value', default: 60, prefix: '$' },
      ]},
      { title: 'Contribution', blurb: 'What survives per order.', inputs: [
        { key: 'cogs', label: 'COGS', default: 35, suffix: '%' },
        { key: 'shipping', label: 'Shipping & fulfillment / order', default: 7, prefix: '$' },
        { key: 'cac', label: 'Marketing / order (CAC)', default: 18, prefix: '$' },
      ]},
      { title: 'Overhead & Horizon', blurb: 'Fixed cost and how long to run.', inputs: [
        { key: 'fixed', label: 'Fixed overhead / month', default: 40000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and the valuation multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 500000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× revenue)', default: 3 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, firstProfit = 0, lastRevenue = 0, lastEBITDA = 0, lastOrders = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const orders = v.startOrders * Math.pow(1 + v.growth / 100, t - 1)
        const revenue = orders * v.aov
        const grossProfit = revenue * (1 - v.cogs / 100) - orders * v.shipping
        const opex = orders * v.cac + v.fixed
        const ebitda = grossProfit - opex
        cash += ebitda
        if (cash < lowest) lowest = cash
        if (!firstProfit && ebitda > 0) firstProfit = t
        lastRevenue = revenue; lastEBITDA = ebitda; lastOrders = orders
        if (chk(t, months)) rows.push([`Month ${t}`, Math.round(orders).toLocaleString('en-US'), money(revenue), money(grossProfit), money(ebitda), money(cash)])
      }
      const annualRevenue = lastRevenue * 12
      const contributionPerOrder = v.aov * (1 - v.cogs / 100) - v.shipping - v.cac
      const valuation = annualRevenue * v.exitMultiple
      return {
        summary: [
          { label: 'Monthly revenue (end)', value: money(lastRevenue), highlight: true },
          { label: 'Annual run-rate', value: money(annualRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Contribution / order', value: money(contributionPerOrder), bad: contributionPerOrder < 0 },
          { label: 'EBITDA margin (end)', value: pct(lastRevenue > 0 ? lastEBITDA / lastRevenue : 0), bad: lastEBITDA < 0 },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Orders', 'Revenue', 'Gross Profit', 'EBITDA', 'Cash'], rows },
          { title: 'Per-Order Economics', columns: ['Metric', 'Value'], rows: [
            ['Average order value', money(v.aov)],
            ['COGS', pct(v.cogs / 100)],
            ['Shipping / order', money(v.shipping)],
            ['Marketing / order (CAC)', money(v.cac)],
            ['Contribution / order', money(contributionPerOrder)],
            ['Ending orders / month', Math.round(lastOrders).toLocaleString('en-US')],
          ]},
        ],
        note: contributionPerOrder <= 0
          ? `Each order loses money on a contribution basis (${money(contributionPerOrder)}) — no volume fixes that. Cut CAC, lift AOV (bundles, upsells), or improve COGS before scaling spend.`
          : cash < 0
            ? `Orders are profitable per unit (${money(contributionPerOrder)}) but the plan still runs the bank to ${money(lowest)} — overhead outruns contribution. Grow into the fixed cost or trim it.`
            : `The brand scales to ${money(annualRevenue)} run-rate and stays solvent${firstProfit ? `, turning EBITDA-positive around month ${firstProfit}` : ''}. At ${v.exitMultiple}× revenue that implies ${money(valuation)}. Retention and repeat purchase would lift this further — a bespoke model layers in cohort LTV.`,
      }
    },
  },

  {
    id: 'marketplace-operating-model',
    name: 'Two-Sided Marketplace — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'GMV → take rate → net revenue → cash → valuation, linked.',
    description:
      'A full operating model of a two-sided marketplace. GMV growth drives net revenue through your take rate; net revenue flows through payment costs and operating spend to EBITDA and cash; and net revenue sets an implied valuation. The model that shows whether the take rate can ever cover the cost of liquidity.',
    modules: [
      { title: 'Liquidity', blurb: 'The gross volume flowing through.', inputs: [
        { key: 'startGMV', label: 'GMV / month (start)', default: 500000, prefix: '$' },
        { key: 'growth', label: 'Monthly GMV growth', default: 8, suffix: '%' },
      ]},
      { title: 'Economics', blurb: 'What you keep from each transaction.', inputs: [
        { key: 'takeRate', label: 'Take rate', default: 15, suffix: '%' },
        { key: 'paymentCost', label: 'Payment + processing', default: 3, suffix: '%' },
      ]},
      { title: 'Operating & Horizon', blurb: 'Cost to run the platform.', inputs: [
        { key: 'opsFixed', label: 'Operating cost / month', default: 120000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and the valuation multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 3000000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× net revenue)', default: 6 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, firstProfit = 0, lastNet = 0, lastEBITDA = 0, lastGMV = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const gmv = v.startGMV * Math.pow(1 + v.growth / 100, t - 1)
        const netRevenue = gmv * (v.takeRate / 100)
        const grossProfit = netRevenue * (1 - v.paymentCost / 100)
        const ebitda = grossProfit - v.opsFixed
        cash += ebitda
        if (cash < lowest) lowest = cash
        if (!firstProfit && ebitda > 0) firstProfit = t
        lastNet = netRevenue; lastEBITDA = ebitda; lastGMV = gmv
        if (chk(t, months)) rows.push([`Month ${t}`, money(gmv), money(netRevenue), money(grossProfit), money(ebitda), money(cash)])
      }
      const annualNet = lastNet * 12
      const valuation = annualNet * v.exitMultiple
      return {
        summary: [
          { label: 'GMV / month (end)', value: money(lastGMV), highlight: true },
          { label: 'Net revenue run-rate', value: money(annualNet) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Take rate', value: pct(v.takeRate / 100) },
          { label: 'EBITDA margin (end)', value: pct(lastNet > 0 ? lastEBITDA / lastNet : 0), bad: lastEBITDA < 0 },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'GMV', 'Net Revenue', 'Gross Profit', 'EBITDA', 'Cash'], rows },
          { title: 'Marketplace Economics', columns: ['Metric', 'Value'], rows: [
            ['Take rate', pct(v.takeRate / 100)],
            ['Payment cost', pct(v.paymentCost / 100)],
            ['Ending GMV / month', money(lastGMV)],
            ['Ending net revenue / month', money(lastNet)],
            ['Annualized net revenue', money(annualNet)],
          ]},
        ],
        note: cash < 0
          ? `The platform burns to ${money(lowest)} before the take rate covers ops. Marketplaces win on scale — either liquidity has to grow faster, the take rate has to rise, or ops cost has to fall. A bespoke model adds incentives and both-sided CAC.`
          : `Liquidity compounds to ${money(lastGMV)} monthly GMV, net revenue reaches ${money(annualNet)} annualized${firstProfit ? `, and the platform turns EBITDA-positive around month ${firstProfit}` : ''}. At ${v.exitMultiple}× net revenue that implies ${money(valuation)}.`,
      }
    },
  },

  {
    id: 'manufacturing-operating-model',
    name: 'Manufacturing Company — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Units → revenue → factory margin → EBITDA → cash → valuation.',
    description:
      'A full operating model of a manufacturing business. Production volume drives revenue; revenue flows through material and labor cost and factory overhead to EBITDA; EBITDA moves cash; and annualized EBITDA sets an implied valuation. Built to show whether volume covers the heavy fixed cost of a plant.',
    modules: [
      { title: 'Production', blurb: 'Volume and price.', inputs: [
        { key: 'startUnits', label: 'Units / month (start)', default: 10000 },
        { key: 'growth', label: 'Monthly volume growth', default: 3, suffix: '%' },
        { key: 'price', label: 'Price per unit', default: 45, prefix: '$' },
      ]},
      { title: 'Cost', blurb: 'What each unit and the plant cost.', inputs: [
        { key: 'materialLabor', label: 'Material + labor', default: 60, suffix: '%' },
        { key: 'factoryFixed', label: 'Factory overhead / month', default: 150000, prefix: '$' },
      ]},
      { title: 'Capital & Horizon', blurb: 'Cash, time, and exit.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 2000000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 6 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, firstProfit = 0, lastRevenue = 0, lastEBITDA = 0, lastUnits = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const units = v.startUnits * Math.pow(1 + v.growth / 100, t - 1)
        const revenue = units * v.price
        const grossProfit = revenue * (1 - v.materialLabor / 100)
        const ebitda = grossProfit - v.factoryFixed
        cash += ebitda
        if (cash < lowest) lowest = cash
        if (!firstProfit && ebitda > 0) firstProfit = t
        lastRevenue = revenue; lastEBITDA = ebitda; lastUnits = units
        if (chk(t, months)) rows.push([`Month ${t}`, Math.round(units).toLocaleString('en-US'), money(revenue), money(grossProfit), money(ebitda), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Monthly revenue (end)', value: money(lastRevenue), highlight: true },
          { label: 'Gross margin', value: pct(1 - v.materialLabor / 100) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'EBITDA margin (end)', value: pct(lastRevenue > 0 ? lastEBITDA / lastRevenue : 0), bad: lastEBITDA < 0 },
          { label: 'Annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Units', 'Revenue', 'Gross Profit', 'EBITDA', 'Cash'], rows },
          { title: 'Unit Economics', columns: ['Metric', 'Value'], rows: [
            ['Price per unit', money(v.price)],
            ['Material + labor / unit', money(v.price * (v.materialLabor / 100))],
            ['Gross margin / unit', money(v.price * (1 - v.materialLabor / 100))],
            ['Ending units / month', Math.round(lastUnits).toLocaleString('en-US')],
          ]},
        ],
        note: cash < 0
          ? `Volume never covers the ${money(v.factoryFixed)}/mo plant overhead — cash bottoms at ${money(lowest)}. Manufacturing is an operating-leverage game: reach the break-even volume, raise price, or cut unit cost.`
          : `The plant scales to ${money(lastRevenue)}/mo revenue and ${money(annualEBITDA)} annual EBITDA${firstProfit ? `, covering overhead by month ${firstProfit}` : ''}. At ${v.exitMultiple}× EBITDA that implies ${money(valuation)}. A bespoke model adds capacity steps, working capital, and CapEx cycles.`,
      }
    },
  },

  {
    id: 'agency-operating-model',
    name: 'Professional Services / Agency — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Headcount → utilization → billings → EBITDA → cash → valuation.',
    description:
      'A full operating model of a services firm. Billable headcount and utilization drive revenue; staff cost and overhead flow to EBITDA; EBITDA moves cash; and annualized EBITDA sets an implied valuation. The model that proves whether adding people actually adds profit.',
    modules: [
      { title: 'Team', blurb: 'Billable capacity.', inputs: [
        { key: 'staff', label: 'Billable staff (start)', default: 20 },
        { key: 'staffGrowth', label: 'Net new staff / month', default: 0.5 },
        { key: 'hours', label: 'Billable hours / mo each', default: 130 },
      ]},
      { title: 'Rates & Cost', blurb: 'What they bill and cost.', inputs: [
        { key: 'rate', label: 'Billing rate / hour', default: 150, prefix: '$' },
        { key: 'utilization', label: 'Utilization', default: 75, suffix: '%' },
        { key: 'staffCost', label: 'Cost / staff / month', default: 9000, prefix: '$' },
      ]},
      { title: 'Overhead & Horizon', blurb: 'Fixed cost and time.', inputs: [
        { key: 'overhead', label: 'Overhead / month', default: 60000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 400000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 5 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, firstProfit = 0, lastRevenue = 0, lastEBITDA = 0, lastStaff = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const staff = v.staff + v.staffGrowth * (t - 1)
        const billableHours = staff * v.hours * (v.utilization / 100)
        const revenue = billableHours * v.rate
        const cost = staff * v.staffCost + v.overhead
        const ebitda = revenue - cost
        cash += ebitda
        if (cash < lowest) lowest = cash
        if (!firstProfit && ebitda > 0) firstProfit = t
        lastRevenue = revenue; lastEBITDA = ebitda; lastStaff = staff
        if (chk(t, months)) rows.push([`Month ${t}`, Math.round(staff).toLocaleString('en-US'), money(revenue), money(cost), money(ebitda), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      const revPerHead = lastStaff > 0 ? lastRevenue / lastStaff : 0
      return {
        summary: [
          { label: 'Monthly revenue (end)', value: money(lastRevenue), highlight: true },
          { label: 'Ending headcount', value: Math.round(lastStaff).toLocaleString('en-US') },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'EBITDA margin (end)', value: pct(lastRevenue > 0 ? lastEBITDA / lastRevenue : 0), bad: lastEBITDA < 0 },
          { label: 'Revenue / head', value: money(revPerHead) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Staff', 'Revenue', 'Total Cost', 'EBITDA', 'Cash'], rows },
          { title: 'Per-Head Economics', columns: ['Metric', 'Value'], rows: [
            ['Billing rate / hour', money(v.rate)],
            ['Utilization', pct(v.utilization / 100)],
            ['Revenue / head / month', money(revPerHead)],
            ['Cost / head / month', money(v.staffCost)],
            ['Gross margin / head', money(revPerHead - v.staffCost)],
          ]},
        ],
        note: lastEBITDA < 0
          ? `At ${pct(v.utilization / 100)} utilization the firm loses money — each head bills ${money(revPerHead)} against ${money(v.staffCost)} cost plus overhead. Lift utilization or rate, or the model never clears. Utilization is the whole game in services.`
          : `The firm scales to ${money(lastRevenue)}/mo on ${Math.round(lastStaff)} people${firstProfit ? `, profitable from month ${firstProfit}` : ''}, for ${money(annualEBITDA)} annual EBITDA. At ${v.exitMultiple}× that implies ${money(valuation)}. Realization (billed vs. collected) is the bespoke refinement.`,
      }
    },
  },
]

export function getMegaSimById(id: string): MegaSim | undefined {
  return MEGA_SIMS.find(s => s.id === id)
}
