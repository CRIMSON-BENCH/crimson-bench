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

  {
    id: 'restaurant-group-operating-model',
    name: 'Multi-Unit Restaurant Group — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Per-unit P&L → new-unit rollout → build cost → cash → valuation.',
    description:
      'A full operating model of a multi-unit restaurant group. Each unit throws off restaurant-level EBITDA; new units open on a rollout schedule and consume build capital; corporate overhead sits on top; and group EBITDA sets an implied valuation. The model that shows whether expansion builds value or just burns it.',
    modules: [
      { title: 'Footprint', blurb: 'Units open and how fast you build.', inputs: [
        { key: 'startUnits', label: 'Units open (start)', default: 5 },
        { key: 'newPerYear', label: 'New units / year', default: 4 },
        { key: 'revPerUnit', label: 'Revenue / unit / month', default: 120000, prefix: '$' },
      ]},
      { title: 'Unit Economics', blurb: 'What a single restaurant keeps.', inputs: [
        { key: 'primeCost', label: 'Prime cost (food + labor)', default: 60, suffix: '%' },
        { key: 'unitOpex', label: 'Unit occupancy + other', default: 22, suffix: '%' },
      ]},
      { title: 'Corporate & Build', blurb: 'Overhead, build cost, horizon.', inputs: [
        { key: 'corporate', label: 'Corporate overhead / month', default: 60000, prefix: '$' },
        { key: 'buildCost', label: 'Build cost / new unit', default: 400000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1500000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 5 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 60)
      let cash = v.startCash, lowest = cash, lastRevenue = 0, lastEBITDA = 0, lastUnits = 0
      const perMonthNew = v.newPerYear / 12
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const units = v.startUnits + perMonthNew * (t - 1)
        const revenue = units * v.revPerUnit
        const unitEBITDA = revenue * (1 - (v.primeCost + v.unitOpex) / 100)
        const ebitda = unitEBITDA - v.corporate
        const capex = perMonthNew * v.buildCost
        cash += ebitda - capex
        if (cash < lowest) lowest = cash
        lastRevenue = revenue; lastEBITDA = ebitda; lastUnits = units
        if (chk(t, months)) rows.push([`Month ${t}`, units.toFixed(1), money(revenue), money(unitEBITDA), money(ebitda), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Units (end)', value: lastUnits.toFixed(1), highlight: true },
          { label: 'Revenue / month (end)', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Unit-level margin', value: pct(1 - (v.primeCost + v.unitOpex) / 100) },
          { label: 'Group annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Units', 'Revenue', 'Unit EBITDA', 'Group EBITDA', 'Cash'], rows },
          { title: 'Unit Economics', columns: ['Metric', 'Value'], rows: [
            ['Revenue / unit / month', money(v.revPerUnit)],
            ['Prime cost', pct(v.primeCost / 100)],
            ['Occupancy + other', pct(v.unitOpex / 100)],
            ['Restaurant-level margin', pct(1 - (v.primeCost + v.unitOpex) / 100)],
            ['Build cost / new unit', money(v.buildCost)],
          ]},
        ],
        note: cash < 0
          ? `Expansion outruns cash — the build schedule (${money(v.buildCost)}/unit) drains the bank to ${money(lowest)} faster than unit EBITDA refills it. Slow the rollout or raise development capital. Restaurants die on over-fast expansion, not bad food.`
          : `The group scales to ${lastUnits.toFixed(0)} units and ${money(annualEBITDA)} annual EBITDA while staying solvent. At ${v.exitMultiple}× that implies ${money(valuation)}. Self-funding growth from unit cash flow is the disciplined path — a bespoke model sequences the build to protect the balance sheet.`,
      }
    },
  },

  {
    id: 'clinic-group-operating-model',
    name: 'Healthcare Clinic Group — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Visit volume → clinic margin → de-novo rollout → cash → valuation.',
    description:
      'A full operating model of a multi-site healthcare clinic group. Visit volume and reimbursement drive revenue; variable and per-clinic fixed costs set clinic margin; new clinics open on a schedule and consume build capital; and group EBITDA sets an implied valuation.',
    modules: [
      { title: 'Capacity', blurb: 'Sites and throughput.', inputs: [
        { key: 'startClinics', label: 'Clinics open (start)', default: 3 },
        { key: 'visitsPerDay', label: 'Visits / clinic / day', default: 40 },
        { key: 'revPerVisit', label: 'Revenue / visit', default: 160, prefix: '$' },
      ]},
      { title: 'Economics', blurb: 'Cost to run a clinic.', inputs: [
        { key: 'variableCost', label: 'Variable cost', default: 45, suffix: '%' },
        { key: 'clinicFixed', label: 'Fixed / clinic / month', default: 45000, prefix: '$' },
      ]},
      { title: 'Growth & Build', blurb: 'Rollout and overhead.', inputs: [
        { key: 'newPerYear', label: 'New clinics / year', default: 2 },
        { key: 'corporate', label: 'Corporate / month', default: 40000, prefix: '$' },
        { key: 'buildCost', label: 'Build cost / clinic', default: 300000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1500000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 6 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 60)
      let cash = v.startCash, lowest = cash, lastRevenue = 0, lastEBITDA = 0, lastClinics = 0
      const perMonthNew = v.newPerYear / 12
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const clinics = v.startClinics + perMonthNew * (t - 1)
        const revenue = clinics * v.visitsPerDay * v.revPerVisit * 22
        const grossProfit = revenue * (1 - v.variableCost / 100)
        const fixed = clinics * v.clinicFixed + v.corporate
        const ebitda = grossProfit - fixed
        const capex = perMonthNew * v.buildCost
        cash += ebitda - capex
        if (cash < lowest) lowest = cash
        lastRevenue = revenue; lastEBITDA = ebitda; lastClinics = clinics
        if (chk(t, months)) rows.push([`Month ${t}`, clinics.toFixed(1), money(revenue), money(grossProfit), money(ebitda), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Clinics (end)', value: lastClinics.toFixed(1), highlight: true },
          { label: 'Revenue / month (end)', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'EBITDA margin (end)', value: pct(lastRevenue > 0 ? lastEBITDA / lastRevenue : 0), bad: lastEBITDA < 0 },
          { label: 'Group annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Clinics', 'Revenue', 'Gross Profit', 'EBITDA', 'Cash'], rows },
          { title: 'Per-Clinic Economics', columns: ['Metric', 'Value'], rows: [
            ['Visits / clinic / day', String(v.visitsPerDay)],
            ['Revenue / visit', money(v.revPerVisit)],
            ['Revenue / clinic / month', money(v.visitsPerDay * v.revPerVisit * 22)],
            ['Variable cost', pct(v.variableCost / 100)],
            ['Fixed / clinic / month', money(v.clinicFixed)],
          ]},
        ],
        note: cash < 0
          ? `De-novo builds outrun clinic cash flow — the bank bottoms at ${money(lowest)}. Slow the rollout, ramp new clinics faster, or fund the build. Healthcare rollups win on payer mix and provider productivity, not just site count.`
          : `The group reaches ${lastClinics.toFixed(0)} clinics and ${money(annualEBITDA)} annual EBITDA. At ${v.exitMultiple}× that implies ${money(valuation)}. Healthcare services command strong multiples when the model is de-risked — a bespoke version layers in payer mix and ramp curves.`,
      }
    },
  },

  {
    id: 'real-estate-portfolio-operating-model',
    name: 'Real Estate Portfolio — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Rent → NOI → debt service → cash flow → value at cap rate.',
    description:
      'A full operating model of a rental real-estate portfolio. Occupied rent drives NOI through an expense ratio; debt service turns NOI into levered cash flow; acquisitions consume equity; and annualized NOI sets portfolio value at your cap rate.',
    modules: [
      { title: 'Portfolio', blurb: 'Units, rent, occupancy.', inputs: [
        { key: 'startUnits', label: 'Units (start)', default: 100 },
        { key: 'rent', label: 'Monthly rent / unit', default: 1800, prefix: '$' },
        { key: 'occupancy', label: 'Occupancy', default: 93, suffix: '%' },
      ]},
      { title: 'Economics', blurb: 'Operating cost and debt.', inputs: [
        { key: 'opexRatio', label: 'Operating expense ratio', default: 40, suffix: '%' },
        { key: 'mortgage', label: 'Debt service / unit / month', default: 900, prefix: '$' },
      ]},
      { title: 'Growth & Horizon', blurb: 'Acquisitions and time.', inputs: [
        { key: 'newPerYear', label: 'Units acquired / year', default: 24 },
        { key: 'downPerUnit', label: 'Equity / acquired unit', default: 55000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Value', blurb: 'Cash and cap rate.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 2000000, prefix: '$' },
        { key: 'capRate', label: 'Cap rate', default: 6, suffix: '%' },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 60)
      let cash = v.startCash, lowest = cash, lastNOI = 0, lastCF = 0, lastUnits = 0
      const perMonthNew = v.newPerYear / 12
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const units = v.startUnits + perMonthNew * (t - 1)
        const grossRent = units * v.rent * (v.occupancy / 100)
        const noi = grossRent * (1 - v.opexRatio / 100)
        const debtService = units * v.mortgage
        const cashFlow = noi - debtService
        const capex = perMonthNew * v.downPerUnit
        cash += cashFlow - capex
        if (cash < lowest) lowest = cash
        lastNOI = noi; lastCF = cashFlow; lastUnits = units
        if (chk(t, months)) rows.push([`Month ${t}`, units.toFixed(1), money(grossRent), money(noi), money(cashFlow), money(cash)])
      }
      const annualNOI = lastNOI * 12
      const value = v.capRate > 0 ? annualNOI / (v.capRate / 100) : 0
      return {
        summary: [
          { label: 'Units (end)', value: lastUnits.toFixed(0), highlight: true },
          { label: 'Monthly NOI (end)', value: money(lastNOI), highlight: true },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Levered cash flow / mo', value: money(lastCF), bad: lastCF < 0 },
          { label: 'Annual NOI', value: money(annualNOI) },
          { label: 'Portfolio value at cap', value: money(value), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Units', 'Gross Rent', 'NOI', 'Cash Flow', 'Cash'], rows },
          { title: 'Per-Unit Economics', columns: ['Metric', 'Value'], rows: [
            ['Rent / unit / month', money(v.rent)],
            ['Occupancy', pct(v.occupancy / 100)],
            ['Operating expense ratio', pct(v.opexRatio / 100)],
            ['NOI / unit / month', money(v.rent * (v.occupancy / 100) * (1 - v.opexRatio / 100))],
            ['Debt service / unit', money(v.mortgage)],
          ]},
        ],
        note: cash < 0
          ? `Acquisitions consume equity (${money(v.downPerUnit)}/unit) faster than cash flow rebuilds it — the account bottoms at ${money(lowest)}. Slow acquisitions or raise a fund. Real estate compounds on patience and leverage discipline.`
          : `The portfolio grows to ${lastUnits.toFixed(0)} units, ${money(annualNOI)} annual NOI, and ${money(value)} of value at a ${pct(v.capRate / 100)} cap. Cash flow is ${money(lastCF)}/mo after debt. Rent growth and cap-rate compression drive total return — a bespoke model adds refinances and dispositions.`,
      }
    },
  },

  {
    id: 'retail-chain-operating-model',
    name: 'Retail Chain — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Store sales → contribution → new stores → cash → valuation.',
    description:
      'A full operating model of a multi-store retail chain. Per-store sales and gross margin drive store contribution; new stores open on a rollout and consume build capital; corporate overhead sits on top; and chain EBITDA sets an implied valuation.',
    modules: [
      { title: 'Footprint', blurb: 'Stores and sales.', inputs: [
        { key: 'startStores', label: 'Stores open (start)', default: 10 },
        { key: 'newPerYear', label: 'New stores / year', default: 6 },
        { key: 'salesPerStore', label: 'Sales / store / month', default: 90000, prefix: '$' },
      ]},
      { title: 'Economics', blurb: 'Store-level margin.', inputs: [
        { key: 'grossMargin', label: 'Gross margin', default: 45, suffix: '%' },
        { key: 'storeOpex', label: 'Store opex (% of sales)', default: 30, suffix: '%' },
      ]},
      { title: 'Corporate & Build', blurb: 'Overhead, build, horizon.', inputs: [
        { key: 'corporate', label: 'Corporate / month', default: 80000, prefix: '$' },
        { key: 'buildCost', label: 'Build cost / store', default: 250000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1500000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 6 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 60)
      let cash = v.startCash, lowest = cash, lastRevenue = 0, lastEBITDA = 0, lastStores = 0
      const perMonthNew = v.newPerYear / 12
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const stores = v.startStores + perMonthNew * (t - 1)
        const revenue = stores * v.salesPerStore
        const contribution = revenue * ((v.grossMargin - v.storeOpex) / 100)
        const ebitda = contribution - v.corporate
        const capex = perMonthNew * v.buildCost
        cash += ebitda - capex
        if (cash < lowest) lowest = cash
        lastRevenue = revenue; lastEBITDA = ebitda; lastStores = stores
        if (chk(t, months)) rows.push([`Month ${t}`, stores.toFixed(1), money(revenue), money(contribution), money(ebitda), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Stores (end)', value: lastStores.toFixed(1), highlight: true },
          { label: 'Revenue / month (end)', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Store contribution margin', value: pct((v.grossMargin - v.storeOpex) / 100) },
          { label: 'Chain annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Stores', 'Revenue', 'Contribution', 'EBITDA', 'Cash'], rows },
          { title: 'Per-Store Economics', columns: ['Metric', 'Value'], rows: [
            ['Sales / store / month', money(v.salesPerStore)],
            ['Gross margin', pct(v.grossMargin / 100)],
            ['Store opex', pct(v.storeOpex / 100)],
            ['Store contribution margin', pct((v.grossMargin - v.storeOpex) / 100)],
            ['Build cost / store', money(v.buildCost)],
          ]},
        ],
        note: cash < 0
          ? `New-store capex (${money(v.buildCost)} each) outpaces contribution — cash bottoms at ${money(lowest)}. Retail expansion is a cash-flow tightrope; slow the rollout or lift store productivity first.`
          : `The chain scales to ${lastStores.toFixed(0)} stores and ${money(annualEBITDA)} annual EBITDA. At ${v.exitMultiple}× that implies ${money(valuation)}. Same-store sales growth and unit-level discipline beat pure store count — the bespoke model separates the two.`,
      }
    },
  },

  {
    id: 'fintech-lending-operating-model',
    name: 'Fintech / Lending Book — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Originations → book → net interest margin → cash → valuation.',
    description:
      'A full operating model of a lending business. Originations build the loan book against runoff; the book earns interest net of funding cost and credit losses; net interest income covers ops to produce EBITDA; and net interest run-rate sets an implied valuation. Note: the book is assumed debt-funded; equity cash reflects operating profit.',
    modules: [
      { title: 'The Book', blurb: 'Balances and flow.', inputs: [
        { key: 'startBook', label: 'Starting loan book', default: 5000000, prefix: '$' },
        { key: 'originations', label: 'Originations / month', default: 1500000, prefix: '$' },
        { key: 'avgLife', label: 'Avg loan life (months)', default: 12 },
      ]},
      { title: 'Spread', blurb: 'What the book earns.', inputs: [
        { key: 'apr', label: 'Portfolio APR', default: 24, suffix: '%' },
        { key: 'fundingCost', label: 'Funding cost (APR)', default: 8, suffix: '%' },
        { key: 'chargeOff', label: 'Annual charge-off rate', default: 4, suffix: '%' },
      ]},
      { title: 'Costs & Horizon', blurb: 'Ops and time.', inputs: [
        { key: 'opsFixed', label: 'Operating cost / month', default: 150000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Equity cash (start)', default: 3000000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× net interest)', default: 3 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let book = v.startBook, cash = v.startCash, lowest = cash, lastNII = 0, lastBook = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const runoff = v.avgLife > 0 ? book / v.avgLife : 0
        book = book + v.originations - runoff
        const interestIncome = book * (v.apr / 1200)
        const fundingCostAmt = book * (v.fundingCost / 1200)
        const creditLoss = book * (v.chargeOff / 1200)
        const nii = interestIncome - fundingCostAmt - creditLoss
        const ebitda = nii - v.opsFixed
        cash += ebitda
        if (cash < lowest) lowest = cash
        lastNII = nii; lastBook = book
        if (chk(t, months)) rows.push([`Month ${t}`, money(book), money(interestIncome), money(nii), money(ebitda), money(cash)])
      }
      const annualNII = lastNII * 12
      const valuation = annualNII * v.exitMultiple
      const nim = lastBook > 0 ? (lastNII * 12) / lastBook : 0
      return {
        summary: [
          { label: 'Loan book (end)', value: money(lastBook), highlight: true },
          { label: 'Net interest / month (end)', value: money(lastNII) },
          { label: 'Equity cash (end)', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Net interest margin', value: pct(nim) },
          { label: 'Annual net interest', value: money(annualNII) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Loan Book', 'Interest Income', 'Net Interest', 'EBITDA', 'Equity Cash'], rows },
          { title: 'Spread Economics', columns: ['Metric', 'Value'], rows: [
            ['Portfolio APR', pct(v.apr / 100)],
            ['Funding cost', pct(v.fundingCost / 100)],
            ['Annual charge-off', pct(v.chargeOff / 100)],
            ['Gross spread', pct((v.apr - v.fundingCost - v.chargeOff) / 100)],
            ['Ending net interest margin', pct(nim)],
          ]},
        ],
        note: lastNII - v.opsFixed < 0
          ? `Net interest doesn't yet cover ops — the spread on ${money(lastBook)} of book earns ${money(lastNII)}/mo against ${money(v.opsFixed)} cost. Scale the book, widen the spread, or cut charge-offs. Credit quality is the whole game in lending.`
          : `The book scales to ${money(lastBook)} at a ${pct(nim)} net interest margin, throwing off ${money(annualNII)} annually. At ${v.exitMultiple}× net interest that implies ${money(valuation)}. This model assumes debt-funded balances — a bespoke version adds a full funding stack, cohorts, and loss curves.`,
      }
    },
  },

  {
    id: 'subscription-box-operating-model',
    name: 'Subscription Box — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Acquisition → churn → active subs → contribution → cash → valuation.',
    description:
      'A full operating model of a subscription-box business. New subscribers build the base against churn; the active base drives MRR; COGS, shipping, and acquisition cost set contribution and EBITDA; and revenue run-rate sets an implied valuation. The model that exposes whether churn eats the acquisition spend.',
    modules: [
      { title: 'Growth', blurb: 'Acquisition and churn.', inputs: [
        { key: 'startSubs', label: 'Subscribers (start)', default: 5000 },
        { key: 'newPerMonth', label: 'New subs / month', default: 1500 },
        { key: 'churn', label: 'Monthly churn', default: 8, suffix: '%' },
      ]},
      { title: 'Economics', blurb: 'Box economics.', inputs: [
        { key: 'price', label: 'Price / box / month', default: 35, prefix: '$' },
        { key: 'cogsShip', label: 'COGS + shipping', default: 55, suffix: '%' },
        { key: 'cac', label: 'CAC / new sub', default: 25, prefix: '$' },
      ]},
      { title: 'Costs & Horizon', blurb: 'Fixed cost and time.', inputs: [
        { key: 'fixed', label: 'Fixed / month', default: 60000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 800000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× revenue)', default: 2.5 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let subs = v.startSubs, cash = v.startCash, lowest = cash, firstProfit = 0, lastRevenue = 0, lastEBITDA = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        subs = subs * (1 - v.churn / 100) + v.newPerMonth
        const revenue = subs * v.price
        const grossProfit = revenue * (1 - v.cogsShip / 100)
        const ebitda = grossProfit - v.newPerMonth * v.cac - v.fixed
        cash += ebitda
        if (cash < lowest) lowest = cash
        if (!firstProfit && ebitda > 0) firstProfit = t
        lastRevenue = revenue; lastEBITDA = ebitda
        if (chk(t, months)) rows.push([`Month ${t}`, Math.round(subs).toLocaleString('en-US'), money(revenue), money(grossProfit), money(ebitda), money(cash)])
      }
      const annualRevenue = lastRevenue * 12
      const valuation = annualRevenue * v.exitMultiple
      const contributionPerBox = v.price * (1 - v.cogsShip / 100)
      return {
        summary: [
          { label: 'Subscribers (end)', value: Math.round(subs).toLocaleString('en-US'), highlight: true },
          { label: 'MRR (end)', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Contribution / box', value: money(contributionPerBox) },
          { label: 'EBITDA margin (end)', value: pct(lastRevenue > 0 ? lastEBITDA / lastRevenue : 0), bad: lastEBITDA < 0 },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Subscribers', 'MRR', 'Gross Profit', 'EBITDA', 'Cash'], rows },
          { title: 'Box Economics', columns: ['Metric', 'Value'], rows: [
            ['Price / box', money(v.price)],
            ['COGS + shipping', pct(v.cogsShip / 100)],
            ['Contribution / box', money(contributionPerBox)],
            ['CAC / new sub', money(v.cac)],
            ['Monthly churn', pct(v.churn / 100)],
          ]},
        ],
        note: cash < 0
          ? `Churn of ${pct(v.churn / 100)} eats the acquisition spend — you buy subscribers faster than they pay back, and cash bottoms at ${money(lowest)}. Cut churn (longer prepaid plans, better boxes) before scaling CAC. Retention is the whole business.`
          : `The base grows to ${Math.round(subs).toLocaleString('en-US')} subscribers and ${money(annualRevenue)} run-rate${firstProfit ? `, EBITDA-positive from month ${firstProfit}` : ''}. At ${v.exitMultiple}× revenue that implies ${money(valuation)}. Cohort payback is the bespoke refinement.`,
      }
    },
  },

  {
    id: 'franchise-system-operating-model',
    name: 'Franchise System — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'System sales → royalties + fees → franchisor EBITDA → valuation.',
    description:
      'A full operating model of a franchisor. Franchised units generate system-wide sales; royalties and marketing fees plus one-time franchise fees are the franchisor’s income; a light cost base produces high-margin EBITDA; and that EBITDA sets a premium implied valuation. The asset-light model investors pay up for.',
    modules: [
      { title: 'The System', blurb: 'Units and their sales.', inputs: [
        { key: 'startUnits', label: 'Franchised units (start)', default: 20 },
        { key: 'newPerYear', label: 'New units / year', default: 15 },
        { key: 'revPerUnit', label: 'System sales / unit / month', default: 60000, prefix: '$' },
      ]},
      { title: 'Franchisor Take', blurb: 'What corporate collects.', inputs: [
        { key: 'royaltyRate', label: 'Royalty rate', default: 6, suffix: '%' },
        { key: 'marketingFee', label: 'Marketing fee', default: 2, suffix: '%' },
        { key: 'franchiseFee', label: 'One-time fee / new unit', default: 40000, prefix: '$' },
      ]},
      { title: 'Cost & Horizon', blurb: 'Overhead and time.', inputs: [
        { key: 'costRatio', label: 'Franchisor cost (% of income)', default: 40, suffix: '%' },
        { key: 'corporate', label: 'Corporate / month', default: 50000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1000000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 8 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 60)
      let cash = v.startCash, lowest = cash, lastIncome = 0, lastEBITDA = 0, lastUnits = 0
      const perMonthNew = v.newPerYear / 12
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const units = v.startUnits + perMonthNew * (t - 1)
        const systemSales = units * v.revPerUnit
        const royaltyIncome = systemSales * ((v.royaltyRate + v.marketingFee) / 100)
        const feeIncome = perMonthNew * v.franchiseFee
        const income = royaltyIncome + feeIncome
        const ebitda = income - income * (v.costRatio / 100) - v.corporate
        cash += ebitda
        if (cash < lowest) lowest = cash
        lastIncome = income; lastEBITDA = ebitda; lastUnits = units
        if (chk(t, months)) rows.push([`Month ${t}`, units.toFixed(1), money(systemSales), money(income), money(ebitda), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Units (end)', value: lastUnits.toFixed(0), highlight: true },
          { label: 'Franchisor income / mo', value: money(lastIncome) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'EBITDA margin (end)', value: pct(lastIncome > 0 ? lastEBITDA / lastIncome : 0), bad: lastEBITDA < 0 },
          { label: 'Annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Units', 'System Sales', 'Franchisor Income', 'EBITDA', 'Cash'], rows },
          { title: 'Franchisor Economics', columns: ['Metric', 'Value'], rows: [
            ['Royalty + marketing take', pct((v.royaltyRate + v.marketingFee) / 100)],
            ['System sales / unit / month', money(v.revPerUnit)],
            ['One-time fee / new unit', money(v.franchiseFee)],
            ['Franchisor cost ratio', pct(v.costRatio / 100)],
            ['Ending unit count', lastUnits.toFixed(0)],
          ]},
        ],
        note: `Franchising is asset-light and high-margin: corporate collects ${pct((v.royaltyRate + v.marketingFee) / 100)} of ${money(lastUnits * v.revPerUnit)}/mo in system sales without operating the units. At ${lastUnits.toFixed(0)} units it earns ${money(annualEBITDA)} annual EBITDA, and at ${v.exitMultiple}× that implies ${money(valuation)} — the premium multiple reflects recurring, capital-light royalties. Unit-level franchisee health is the bespoke layer.`,
      }
    },
  },

  {
    id: 'construction-operating-model',
    name: 'Construction / Contractor — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Billings → gross profit → G&A → EBITDA → cash → valuation.',
    description:
      'A full operating model of a construction or contracting business. Monthly billings grow with backlog; direct costs and G&A set EBITDA; retention held back on each job is a working-capital drag on cash; and EBITDA sets an implied valuation. Built to show how thin construction margins survive the cash-flow whipsaw.',
    modules: [
      { title: 'Volume', blurb: 'Billings and growth.', inputs: [
        { key: 'billings', label: 'Billings / month (start)', default: 800000, prefix: '$' },
        { key: 'growth', label: 'Monthly billings growth', default: 4, suffix: '%' },
      ]},
      { title: 'Margin', blurb: 'Job cost and overhead.', inputs: [
        { key: 'directCost', label: 'Direct cost (materials, subs, labor)', default: 78, suffix: '%' },
        { key: 'gAndA', label: 'G&A (% of billings)', default: 8, suffix: '%' },
      ]},
      { title: 'Working Capital & Horizon', blurb: 'Retention drag and time.', inputs: [
        { key: 'retention', label: 'Retention held back', default: 5, suffix: '%' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1000000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 4 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, lastBillings = 0, lastEBITDA = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const billings = v.billings * Math.pow(1 + v.growth / 100, t - 1)
        const grossProfit = billings * (1 - v.directCost / 100)
        const ebitda = grossProfit - billings * (v.gAndA / 100)
        const retentionDrag = billings * (v.retention / 100)
        cash += ebitda - retentionDrag
        if (cash < lowest) lowest = cash
        lastBillings = billings; lastEBITDA = ebitda
        if (chk(t, months)) rows.push([`Month ${t}`, money(billings), money(grossProfit), money(ebitda), money(retentionDrag), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Billings / month (end)', value: money(lastBillings), highlight: true },
          { label: 'Gross margin', value: pct(1 - v.directCost / 100) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'EBITDA margin', value: pct(lastBillings > 0 ? lastEBITDA / lastBillings : 0), bad: lastEBITDA < 0 },
          { label: 'Annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Billings', 'Gross Profit', 'EBITDA', 'Retention Held', 'Cash'], rows },
          { title: 'Margin Economics', columns: ['Metric', 'Value'], rows: [
            ['Direct cost', pct(v.directCost / 100)],
            ['Gross margin', pct(1 - v.directCost / 100)],
            ['G&A', pct(v.gAndA / 100)],
            ['EBITDA margin', pct(1 - v.directCost / 100 - v.gAndA / 100)],
            ['Retention held / month', money(lastBillings * (v.retention / 100))],
          ]},
        ],
        note: cash < 0
          ? `Growth plus ${pct(v.retention / 100)} retention drains working capital faster than thin margins refill it — cash bottoms at ${money(lowest)}. Construction dies on cash flow, not profit. Fund the growth or tighten billing/retention terms.`
          : `The business grows to ${money(lastBillings)}/mo billings at a ${pct(1 - v.directCost / 100 - v.gAndA / 100)} EBITDA margin, ${money(annualEBITDA)} annually. At ${v.exitMultiple}× that implies ${money(valuation)}. Managing WIP and retention is the whole cash game — the bespoke model schedules draws against costs.`,
      }
    },
  },

  {
    id: 'logistics-fleet-operating-model',
    name: 'Logistics / Fleet — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Miles → revenue → cost-per-mile → fleet growth → cash → valuation.',
    description:
      'A full operating model of a trucking/logistics fleet. Trucks drive miles, miles drive revenue at your rate; cost-per-mile and fixed per-truck cost set EBITDA; new trucks consume capital; and EBITDA sets an implied valuation. The model that proves whether adding trucks adds profit or just debt.',
    modules: [
      { title: 'Fleet', blurb: 'Trucks and utilization.', inputs: [
        { key: 'startTrucks', label: 'Trucks (start)', default: 20 },
        { key: 'milesPerTruck', label: 'Miles / truck / month', default: 10000 },
        { key: 'ratePerMile', label: 'Revenue / mile', default: 2.4, prefix: '$' },
      ]},
      { title: 'Cost', blurb: 'Per-mile and per-truck cost.', inputs: [
        { key: 'costPerMile', label: 'Variable cost / mile', default: 1.7, prefix: '$' },
        { key: 'fixedPerTruck', label: 'Fixed / truck / month', default: 2500, prefix: '$' },
      ]},
      { title: 'Growth & Horizon', blurb: 'Fleet expansion.', inputs: [
        { key: 'newPerYear', label: 'Trucks added / year', default: 6 },
        { key: 'truckCost', label: 'Cost / new truck', default: 150000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1500000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 4 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 60)
      let cash = v.startCash, lowest = cash, lastRevenue = 0, lastEBITDA = 0, lastTrucks = 0
      const perMonthNew = v.newPerYear / 12
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const trucks = v.startTrucks + perMonthNew * (t - 1)
        const miles = trucks * v.milesPerTruck
        const revenue = miles * v.ratePerMile
        const ebitda = revenue - miles * v.costPerMile - trucks * v.fixedPerTruck
        const capex = perMonthNew * v.truckCost
        cash += ebitda - capex
        if (cash < lowest) lowest = cash
        lastRevenue = revenue; lastEBITDA = ebitda; lastTrucks = trucks
        if (chk(t, months)) rows.push([`Month ${t}`, trucks.toFixed(1), money(revenue), money(ebitda), money(capex), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Trucks (end)', value: lastTrucks.toFixed(1), highlight: true },
          { label: 'Revenue / month (end)', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Net / mile', value: money(v.ratePerMile - v.costPerMile) },
          { label: 'Annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Trucks', 'Revenue', 'EBITDA', 'CapEx', 'Cash'], rows },
          { title: 'Per-Mile Economics', columns: ['Metric', 'Value'], rows: [
            ['Revenue / mile', money(v.ratePerMile)],
            ['Variable cost / mile', money(v.costPerMile)],
            ['Net / mile', money(v.ratePerMile - v.costPerMile)],
            ['Miles / truck / month', v.milesPerTruck.toLocaleString('en-US')],
            ['Fixed / truck / month', money(v.fixedPerTruck)],
          ]},
        ],
        note: cash < 0
          ? `Truck capex (${money(v.truckCost)} each) outruns the ${money(v.ratePerMile - v.costPerMile)}/mile net margin — cash bottoms at ${money(lowest)}. Finance the trucks or slow expansion. Fleets live and die on utilization and deadhead, not truck count.`
          : `The fleet scales to ${lastTrucks.toFixed(0)} trucks and ${money(annualEBITDA)} annual EBITDA. At ${v.exitMultiple}× that implies ${money(valuation)}. Rate-per-mile, utilization, and fuel are the swing factors — a bespoke model adds financing and lane mix.`,
      }
    },
  },

  {
    id: 'hotel-operating-model',
    name: 'Hotel / Hospitality — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Occupancy × ADR → RevPAR → NOI → debt service → value at cap.',
    description:
      'A full operating model of a hotel. Occupancy and ADR set RevPAR and room revenue; variable and fixed costs produce NOI; debt service turns NOI into levered cash flow; and annualized NOI sets value at your cap rate. The model that shows how a few points of occupancy move the whole asset.',
    modules: [
      { title: 'Property', blurb: 'Rooms, rate, occupancy.', inputs: [
        { key: 'rooms', label: 'Rooms', default: 120 },
        { key: 'adr', label: 'Average daily rate (ADR)', default: 180, prefix: '$' },
        { key: 'occupancy', label: 'Occupancy', default: 70, suffix: '%' },
      ]},
      { title: 'Economics', blurb: 'Cost structure.', inputs: [
        { key: 'variableCost', label: 'Variable cost (housekeeping, OTA)', default: 30, suffix: '%' },
        { key: 'fixedMonthly', label: 'Fixed cost / month', default: 250000, prefix: '$' },
      ]},
      { title: 'Financing & Horizon', blurb: 'Debt and time.', inputs: [
        { key: 'debtService', label: 'Debt service / month', default: 120000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Value', blurb: 'Cash and cap rate.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1000000, prefix: '$' },
        { key: 'capRate', label: 'Cap rate', default: 8, suffix: '%' },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, lastNOI = 0, lastRevenue = 0, lastCF = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const roomsSold = v.rooms * (v.occupancy / 100) * 30
        const revenue = roomsSold * v.adr
        const gop = revenue * (1 - v.variableCost / 100)
        const noi = gop - v.fixedMonthly
        const cashFlow = noi - v.debtService
        cash += cashFlow
        if (cash < lowest) lowest = cash
        lastNOI = noi; lastRevenue = revenue; lastCF = cashFlow
        if (chk(t, months)) rows.push([`Month ${t}`, money(revenue), money(gop), money(noi), money(cashFlow), money(cash)])
      }
      const revpar = v.adr * (v.occupancy / 100)
      const annualNOI = lastNOI * 12
      const value = v.capRate > 0 ? annualNOI / (v.capRate / 100) : 0
      return {
        summary: [
          { label: 'RevPAR', value: money(revpar), highlight: true },
          { label: 'Revenue / month', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Cash flow / mo (after debt)', value: money(lastCF), bad: lastCF < 0 },
          { label: 'Annual NOI', value: money(annualNOI) },
          { label: 'Value at cap', value: money(value), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Revenue', 'Gross Op. Profit', 'NOI', 'Cash Flow', 'Cash'], rows },
          { title: 'Revenue Economics', columns: ['Metric', 'Value'], rows: [
            ['ADR', money(v.adr)],
            ['Occupancy', pct(v.occupancy / 100)],
            ['RevPAR', money(revpar)],
            ['Rooms', String(v.rooms)],
            ['Variable cost', pct(v.variableCost / 100)],
          ]},
        ],
        note: lastCF < 0
          ? `At ${pct(v.occupancy / 100)} occupancy, NOI (${money(lastNOI)}/mo) doesn't cover debt service — cash bleeds to ${money(lowest)}. Hotels are operating-leverage assets: a few points of occupancy or ADR swing the whole model. Lift RevPAR or restructure the debt.`
          : `RevPAR of ${money(revpar)} produces ${money(annualNOI)} annual NOI and ${money(lastCF)}/mo after debt. At a ${pct(v.capRate / 100)} cap that values the asset at ${money(value)}. Seasonality, F&B, and other revenue are the bespoke additions.`,
      }
    },
  },

  {
    id: 'creator-business-operating-model',
    name: 'Media / Creator Business — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Reach → ad + sponsor + product revenue → team cost → valuation.',
    description:
      'A full operating model of a creator business. Audience reach compounds; ad, sponsorship, and product revenue scale with it; a lean team is the cost; and revenue run-rate sets an implied valuation. The model that shows why diversified creators are worth multiples of ad-only ones.',
    modules: [
      { title: 'Reach', blurb: 'Views and growth.', inputs: [
        { key: 'startViews', label: 'Monthly views (start)', default: 3000000 },
        { key: 'growth', label: 'Monthly views growth', default: 6, suffix: '%' },
      ]},
      { title: 'Monetization', blurb: 'The revenue stack.', inputs: [
        { key: 'rpm', label: 'Ad RPM (per 1,000 views)', default: 6, prefix: '$' },
        { key: 'sponsor', label: 'Sponsor revenue / month', default: 15000, prefix: '$' },
        { key: 'product', label: 'Product revenue / month', default: 20000, prefix: '$' },
      ]},
      { title: 'Costs & Horizon', blurb: 'Team and time.', inputs: [
        { key: 'teamCost', label: 'Team + production / month', default: 25000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 200000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× revenue)', default: 3 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, firstProfit = 0, lastRevenue = 0, lastAd = 0, lastViews = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const factor = Math.pow(1 + v.growth / 100, t - 1)
        const views = v.startViews * factor
        const adRevenue = (views / 1000) * v.rpm
        const revenue = adRevenue + v.sponsor * factor + v.product * factor
        const ebitda = revenue - v.teamCost
        cash += ebitda
        if (cash < lowest) lowest = cash
        if (!firstProfit && ebitda > 0) firstProfit = t
        lastRevenue = revenue; lastAd = adRevenue; lastViews = views
        if (chk(t, months)) rows.push([`Month ${t}`, Math.round(views).toLocaleString('en-US'), money(adRevenue), money(revenue), money(ebitda), money(cash)])
      }
      const annualRevenue = lastRevenue * 12
      const valuation = annualRevenue * v.exitMultiple
      return {
        summary: [
          { label: 'Monthly views (end)', value: Math.round(lastViews).toLocaleString('en-US'), highlight: true },
          { label: 'Total revenue / mo', value: money(lastRevenue), highlight: true },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Ad vs. total', value: pct(lastRevenue > 0 ? lastAd / lastRevenue : 0) },
          { label: 'Annual revenue', value: money(annualRevenue) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Views', 'Ad Revenue', 'Total Revenue', 'EBITDA', 'Cash'], rows },
          { title: 'Revenue Mix', columns: ['Stream', 'Monthly (end)'], rows: [
            ['Ad revenue', money(lastAd)],
            ['Sponsorships', money(lastRevenue - lastAd - v.product * Math.pow(1 + v.growth / 100, months - 1))],
            ['Products', money(v.product * Math.pow(1 + v.growth / 100, months - 1))],
            ['Total', money(lastRevenue)],
          ]},
        ],
        note: `Ad revenue is only ${pct(lastRevenue > 0 ? lastAd / lastRevenue : 0)} of the total — sponsorships and products carry the business, which is exactly why diversified creators command higher multiples than ad-only channels. At ${money(annualRevenue)} run-rate and ${v.exitMultiple}× that implies ${money(valuation)}${firstProfit ? `; profitable from month ${firstProfit}` : ''}. A bespoke model adds a membership tier and back-catalog decay.`,
      }
    },
  },

  {
    id: 'biotech-operating-model',
    name: 'Biotech / R&D-Stage — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Program burn → milestone inflow → runway → cash at data.',
    description:
      'A full operating model of a pre-revenue biotech. Each program burns cash monthly; overhead sits on top; a milestone payment injects capital mid-plan; and the model tracks runway to the value-inflection readout. Cash, not revenue, is the whole game here.',
    modules: [
      { title: 'Programs', blurb: 'Pipeline burn.', inputs: [
        { key: 'programs', label: 'Active programs', default: 3 },
        { key: 'burnPerProgram', label: 'Burn / program / month', default: 200000, prefix: '$' },
        { key: 'gAndA', label: 'G&A / month', default: 150000, prefix: '$' },
      ]},
      { title: 'Milestone', blurb: 'A capital inflow event.', inputs: [
        { key: 'milestoneMonth', label: 'Milestone month', default: 18 },
        { key: 'milestonePayment', label: 'Milestone payment', default: 10000000, prefix: '$' },
      ]},
      { title: 'Horizon', blurb: 'How long to model.', inputs: [
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Value', blurb: 'Cash and implied value.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 30000000, prefix: '$' },
        { key: 'postValue', label: 'Implied value at data', default: 200000000, prefix: '$' },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 72)
      let cash = v.startCash, runOut = 0, cashAtMilestone = 0
      const monthlyBurn = v.programs * v.burnPerProgram + v.gAndA
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const inflow = t === Math.round(v.milestoneMonth) ? v.milestonePayment : 0
        cash += inflow - monthlyBurn
        if (t === Math.round(v.milestoneMonth)) cashAtMilestone = cash
        if (!runOut && cash < 0) runOut = t
        if (chk(t, months)) rows.push([`Month ${t}`, money(monthlyBurn), inflow ? money(inflow) : '—', money(cash)])
      }
      const runwayMonths = monthlyBurn > 0 ? v.startCash / monthlyBurn : 0
      return {
        summary: [
          { label: 'Monthly burn', value: money(monthlyBurn), highlight: true },
          { label: 'Runway (pre-milestone)', value: `${runwayMonths.toFixed(0)} mo` },
          { label: 'Cash at horizon', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Cash at milestone', value: money(cashAtMilestone), bad: cashAtMilestone < 0 },
          { label: 'Runs out?', value: runOut ? `Month ${runOut}` : 'No', bad: !!runOut },
          { label: 'Implied value at data', value: money(v.postValue), highlight: true },
        ],
        sections: [
          { title: 'Cash Runway', columns: ['Month', 'Monthly Burn', 'Inflow', 'Cash'], rows },
          { title: 'Burn Economics', columns: ['Metric', 'Value'], rows: [
            ['Active programs', String(v.programs)],
            ['Burn / program / month', money(v.burnPerProgram)],
            ['G&A / month', money(v.gAndA)],
            ['Total monthly burn', money(monthlyBurn)],
            ['Milestone payment', money(v.milestonePayment)],
          ]},
        ],
        note: runOut
          ? `The company runs out of cash at month ${runOut} — before or around the data readout. Biotech is a race between burn and milestones: cut a program, raise a round, or pull the milestone forward. Reaching the value-inflection readout with cash in hand is everything.`
          : `At ${money(monthlyBurn)}/mo burn, the ${money(v.startCash)} plus the ${money(v.milestonePayment)} milestone carries the pipeline through the horizon with ${money(cash)} to spare. Reaching the readout funded supports the ${money(v.postValue)} implied value. A bespoke model adds probability-weighted milestones and dilution.`,
      }
    },
  },

  {
    id: 'hardware-operating-model',
    name: 'Consumer Hardware — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Units → thin unit margin → tooling → cash → valuation.',
    description:
      'A full operating model of a consumer hardware business. Unit sales drive revenue; BOM, fulfillment, and acquisition cost set a thin unit margin; upfront tooling is a capital hit; and revenue run-rate sets an implied valuation. The model that shows how hardware survives on razor-thin margins and volume.',
    modules: [
      { title: 'Demand', blurb: 'Units and price.', inputs: [
        { key: 'startUnits', label: 'Units / month (start)', default: 5000 },
        { key: 'growth', label: 'Monthly unit growth', default: 5, suffix: '%' },
        { key: 'price', label: 'Price per unit', default: 199, prefix: '$' },
      ]},
      { title: 'Unit Cost', blurb: 'What each unit costs.', inputs: [
        { key: 'bom', label: 'BOM / unit', default: 90, prefix: '$' },
        { key: 'fulfillment', label: 'Fulfillment / unit', default: 15, prefix: '$' },
        { key: 'cac', label: 'CAC / unit', default: 25, prefix: '$' },
      ]},
      { title: 'Fixed & Horizon', blurb: 'Overhead, tooling, time.', inputs: [
        { key: 'fixed', label: 'Fixed / month', default: 120000, prefix: '$' },
        { key: 'tooling', label: 'Upfront tooling (month 1)', default: 500000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 3000000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× revenue)', default: 2 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, firstProfit = 0, lastRevenue = 0, lastEBITDA = 0, lastUnits = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const units = v.startUnits * Math.pow(1 + v.growth / 100, t - 1)
        const revenue = units * v.price
        const grossProfit = revenue - units * (v.bom + v.fulfillment)
        const ebitda = grossProfit - units * v.cac - v.fixed
        const tooling = t === 1 ? v.tooling : 0
        cash += ebitda - tooling
        if (cash < lowest) lowest = cash
        if (!firstProfit && ebitda > 0) firstProfit = t
        lastRevenue = revenue; lastEBITDA = ebitda; lastUnits = units
        if (chk(t, months)) rows.push([`Month ${t}`, Math.round(units).toLocaleString('en-US'), money(revenue), money(grossProfit), money(ebitda), money(cash)])
      }
      const annualRevenue = lastRevenue * 12
      const valuation = annualRevenue * v.exitMultiple
      const unitMargin = v.price - v.bom - v.fulfillment - v.cac
      return {
        summary: [
          { label: 'Units / month (end)', value: Math.round(lastUnits).toLocaleString('en-US'), highlight: true },
          { label: 'Revenue / month (end)', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Contribution / unit', value: money(unitMargin), bad: unitMargin < 0 },
          { label: 'EBITDA margin (end)', value: pct(lastRevenue > 0 ? lastEBITDA / lastRevenue : 0), bad: lastEBITDA < 0 },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Units', 'Revenue', 'Gross Profit', 'EBITDA', 'Cash'], rows },
          { title: 'Per-Unit Economics', columns: ['Metric', 'Value'], rows: [
            ['Price', money(v.price)],
            ['BOM + fulfillment', money(v.bom + v.fulfillment)],
            ['CAC / unit', money(v.cac)],
            ['Contribution / unit', money(unitMargin)],
            ['Gross margin %', pct(v.price > 0 ? (v.price - v.bom - v.fulfillment) / v.price : 0)],
          ]},
        ],
        note: unitMargin < 0
          ? `Each unit loses ${money(-unitMargin)} after BOM, fulfillment, and CAC — volume can't fix negative unit economics. Cut BOM (scale, redesign), lift price, or lower CAC. Hardware is unforgiving: the unit has to work first.`
          : cash < 0
            ? `Units are profitable (${money(unitMargin)} each) but tooling and inventory drain cash to ${money(lowest)} before volume covers fixed cost. Hardware ties up cash in inventory and molds — fund the working capital or grow into it.`
            : `The product scales to ${money(annualRevenue)} run-rate on ${money(unitMargin)}/unit contribution${firstProfit ? `, EBITDA-positive from month ${firstProfit}` : ''}. At ${v.exitMultiple}× revenue that implies ${money(valuation)}. Inventory and working-capital cycles are the bespoke layer.`,
      }
    },
  },

  {
    id: 'fitness-chain-operating-model',
    name: 'Fitness / Membership Chain — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Members × dues → club margin → new clubs → cash → valuation.',
    description:
      'A full operating model of a fitness or membership chain. Members and monthly dues drive per-club revenue; variable and fixed club costs set club margin; new clubs open on a rollout and consume build capital; and chain EBITDA sets an implied valuation.',
    modules: [
      { title: 'Footprint', blurb: 'Clubs and members.', inputs: [
        { key: 'startClubs', label: 'Clubs open (start)', default: 5 },
        { key: 'newPerYear', label: 'New clubs / year', default: 4 },
        { key: 'membersPerClub', label: 'Members / club', default: 800 },
      ]},
      { title: 'Economics', blurb: 'Dues and cost.', inputs: [
        { key: 'dues', label: 'Monthly dues / member', default: 45, prefix: '$' },
        { key: 'variableCost', label: 'Variable cost', default: 35, suffix: '%' },
        { key: 'clubFixed', label: 'Fixed / club / month', default: 35000, prefix: '$' },
      ]},
      { title: 'Corporate & Build', blurb: 'Overhead, build, horizon.', inputs: [
        { key: 'corporate', label: 'Corporate / month', default: 40000, prefix: '$' },
        { key: 'buildCost', label: 'Build cost / club', default: 350000, prefix: '$' },
        { key: 'months', label: 'Months to simulate', default: 36 },
      ]},
      { title: 'Capital & Exit', blurb: 'Cash and multiple.', inputs: [
        { key: 'startCash', label: 'Starting cash', default: 1500000, prefix: '$' },
        { key: 'exitMultiple', label: 'Exit multiple (× EBITDA)', default: 6 },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 36, 1), 60)
      let cash = v.startCash, lowest = cash, lastRevenue = 0, lastEBITDA = 0, lastClubs = 0
      const perMonthNew = v.newPerYear / 12
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const clubs = v.startClubs + perMonthNew * (t - 1)
        const revenue = clubs * v.membersPerClub * v.dues
        const grossProfit = revenue * (1 - v.variableCost / 100)
        const ebitda = grossProfit - clubs * v.clubFixed - v.corporate
        const capex = perMonthNew * v.buildCost
        cash += ebitda - capex
        if (cash < lowest) lowest = cash
        lastRevenue = revenue; lastEBITDA = ebitda; lastClubs = clubs
        if (chk(t, months)) rows.push([`Month ${t}`, clubs.toFixed(1), money(revenue), money(grossProfit), money(ebitda), money(cash)])
      }
      const annualEBITDA = lastEBITDA * 12
      const valuation = annualEBITDA * v.exitMultiple
      return {
        summary: [
          { label: 'Clubs (end)', value: lastClubs.toFixed(1), highlight: true },
          { label: 'Revenue / month (end)', value: money(lastRevenue) },
          { label: 'Ending cash', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'EBITDA margin (end)', value: pct(lastRevenue > 0 ? lastEBITDA / lastRevenue : 0), bad: lastEBITDA < 0 },
          { label: 'Chain annual EBITDA', value: money(annualEBITDA) },
          { label: 'Implied valuation', value: money(valuation), highlight: true },
        ],
        sections: [
          { title: 'Company Trajectory', columns: ['Month', 'Clubs', 'Revenue', 'Gross Profit', 'EBITDA', 'Cash'], rows },
          { title: 'Per-Club Economics', columns: ['Metric', 'Value'], rows: [
            ['Members / club', String(v.membersPerClub)],
            ['Monthly dues', money(v.dues)],
            ['Revenue / club / month', money(v.membersPerClub * v.dues)],
            ['Variable cost', pct(v.variableCost / 100)],
            ['Fixed / club / month', money(v.clubFixed)],
          ]},
        ],
        note: cash < 0
          ? `Club build cost (${money(v.buildCost)} each) outruns membership cash flow — the account bottoms at ${money(lowest)}. Fitness expansion is a pre-sale-and-ramp game; slow the rollout or pre-sell memberships to fund builds.`
          : `The chain scales to ${lastClubs.toFixed(0)} clubs and ${money(annualEBITDA)} annual EBITDA. At ${v.exitMultiple}× that implies ${money(valuation)}. Member retention and per-club ramp drive it — a bespoke model adds churn curves and pre-sale ramps.`,
      }
    },
  },

  {
    id: 'nonprofit-operating-model',
    name: 'Nonprofit / Social Enterprise — End-to-End Operating Model',
    category: 'Integrated Company Model',
    price: COMPANY_MODEL_PRICE,
    tagline: 'Grants + earned revenue → program cost → surplus → reserves.',
    description:
      'A full operating model of a nonprofit or social enterprise. Grants and growing earned revenue fund programs; program cost and admin set the surplus or deficit; and the model tracks operating reserves in months of expenses — the real measure of a nonprofit’s health.',
    modules: [
      { title: 'Revenue', blurb: 'Funding mix.', inputs: [
        { key: 'grants', label: 'Grants / month', default: 80000, prefix: '$' },
        { key: 'earned', label: 'Earned revenue / month', default: 60000, prefix: '$' },
        { key: 'earnedGrowth', label: 'Earned revenue growth', default: 5, suffix: '%' },
      ]},
      { title: 'Cost', blurb: 'Programs and admin.', inputs: [
        { key: 'programRatio', label: 'Program cost (% of revenue)', default: 75, suffix: '%' },
        { key: 'admin', label: 'Admin / month', default: 25000, prefix: '$' },
      ]},
      { title: 'Horizon', blurb: 'How long to model.', inputs: [
        { key: 'months', label: 'Months to simulate', default: 24 },
      ]},
      { title: 'Reserves', blurb: 'Starting reserves.', inputs: [
        { key: 'startCash', label: 'Starting reserves', default: 300000, prefix: '$' },
      ]},
    ],
    compute: v => {
      const months = Math.min(Math.max(Math.round(v.months) || 24, 1), 60)
      let cash = v.startCash, lowest = cash, lastRevenue = 0, lastSurplus = 0, lastExpenses = 0, lastEarned = 0
      const rows: string[][] = []
      for (let t = 1; t <= months; t++) {
        const earned = v.earned * Math.pow(1 + v.earnedGrowth / 100, t - 1)
        const revenue = v.grants + earned
        const programCost = revenue * (v.programRatio / 100)
        const expenses = programCost + v.admin
        const surplus = revenue - expenses
        cash += surplus
        if (cash < lowest) lowest = cash
        lastRevenue = revenue; lastSurplus = surplus; lastExpenses = expenses; lastEarned = earned
        if (chk(t, months)) rows.push([`Month ${t}`, money(revenue), money(programCost), money(surplus), money(cash)])
      }
      const reserveMonths = lastExpenses > 0 ? cash / lastExpenses : 0
      const earnedMix = lastRevenue > 0 ? lastEarned / lastRevenue : 0
      return {
        summary: [
          { label: 'Total revenue / mo (end)', value: money(lastRevenue), highlight: true },
          { label: 'Monthly surplus', value: money(lastSurplus), bad: lastSurplus < 0 },
          { label: 'Ending reserves', value: money(cash), highlight: true, bad: cash < 0 },
          { label: 'Reserve months', value: `${reserveMonths.toFixed(1)} mo`, highlight: true, bad: reserveMonths < 3 },
          { label: 'Earned : total mix', value: pct(earnedMix) },
          { label: 'Program cost ratio', value: pct(v.programRatio / 100) },
        ],
        sections: [
          { title: 'Financial Trajectory', columns: ['Month', 'Revenue', 'Program Cost', 'Surplus', 'Reserves'], rows },
          { title: 'Sustainability', columns: ['Metric', 'Value'], rows: [
            ['Grants / month', money(v.grants)],
            ['Earned revenue / month (end)', money(lastEarned)],
            ['Program cost ratio', pct(v.programRatio / 100)],
            ['Admin / month', money(v.admin)],
            ['Reserve months', `${reserveMonths.toFixed(1)} mo`],
          ]},
        ],
        note: lastSurplus < 0
          ? `The organization runs a monthly deficit and reserves fall to ${money(lowest)} — reserves are the runway. Diversify funding (grow earned revenue past the ${pct(earnedMix)} it is now), or reduce program cost. A grant-dependent nonprofit is one lost grant from crisis.`
          : `The organization runs a surplus and builds ${reserveMonths.toFixed(1)} months of operating reserves — ${reserveMonths >= 6 ? 'a healthy cushion' : 'below the 6-month best-practice target'}. Earned revenue is ${pct(earnedMix)} of the mix; growing it reduces grant dependence. A bespoke model adds restricted-fund tracking and multi-year grants.`,
      }
    },
  },
]

export function getMegaSimById(id: string): MegaSim | undefined {
  return MEGA_SIMS.find(s => s.id === id)
}
