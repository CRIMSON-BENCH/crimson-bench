// Priced "Complete the system" bundles — curated sets of toolkits sold together
// at a standing discount. Prices are COMPUTED from the live member products, so a
// bundle can never drift out of sync with the catalog.
import { getDigitalProductById, type DigitalProduct } from './digital-products'

export const BUNDLE_DISCOUNT = 0.2 // 20% off the sum of the parts

export interface BundleDef {
  id: string
  name: string
  who: string
  blurb: string
  /** Product ids included in the bundle (must exist in DIGITAL_PRODUCTS). */
  memberIds: string[]
  /** Non-priced perks shown as bonus lines (e.g. companion simulators, updates). */
  perks?: string[]
  /** Optional upsell line pointing at a matching company model. */
  addOn?: { label: string; href: string }
  featured?: boolean
}

export interface ResolvedBundle extends BundleDef {
  members: DigitalProduct[]
  listPrice: number
  bundlePrice: number
  savings: number
  discountPct: number
}

const DEFS: BundleDef[] = [
  {
    id: 'founder-system',
    name: 'The Founder System',
    who: 'Founders raising & scaling',
    blurb: 'Build the story, model the raise, and steer to the next round — the complete fundraising stack.',
    memberIds: ['seed-pitch-deck-template', 'cap-table-model', 'startup-financial-model-3-statement'],
    perks: [
      'Companion simulators unlocked free (fundraise & dilution)',
      'Free lifetime updates on every model',
    ],
    addOn: { label: 'Add the SaaS Company Operating Model', href: '/enterprise/saas-company-operating-model' },
    featured: true,
  },
  {
    id: 'cfo-system',
    name: 'The CFO System',
    who: 'Finance leaders running the numbers',
    blurb: 'The cash, budget, and unit-economics stack that keeps a company solvent and fundable.',
    memberIds: ['13-week-cash-flow-model', 'annual-operating-budget-model', 'unit-economics-calculator', 'runway-burn-tracker'],
    perks: [
      'Companion cash-flow & burn simulators unlocked free',
      'Free lifetime updates on every model',
    ],
    addOn: { label: 'Add any end-to-end company model', href: '/enterprise' },
    featured: true,
  },
  {
    id: 'operator-system',
    name: 'The Operator System',
    who: 'Operators running the machine',
    blurb: 'Plan headcount, track what matters, and scale without the founder in every decision.',
    memberIds: ['kpi-dashboard-template', 'org-design-headcount-model', 'sop-library-starter-kit'],
    perks: [
      'Companion KPI & headcount simulators unlocked free',
      'Free lifetime updates on every model',
    ],
    addOn: { label: 'Add your industry’s company model', href: '/enterprise' },
  },
]

/** Round a discounted price to a clean, psychology-friendly figure ending in 9. */
function cleanPrice(n: number): number {
  const r = Math.round(n)
  // nudge down to the nearest ...9 (e.g. 302 -> 299, 214 -> 209)
  const mod = ((r % 10) + 10) % 10
  return mod >= 9 ? r : Math.max(9, r - mod - 1)
}

export function resolveBundle(def: BundleDef): ResolvedBundle {
  const members = def.memberIds
    .map(getDigitalProductById)
    .filter((p): p is DigitalProduct => Boolean(p))
  const listPrice = members.reduce((s, p) => s + p.price, 0)
  const bundlePrice = cleanPrice(listPrice * (1 - BUNDLE_DISCOUNT))
  return {
    ...def,
    members,
    listPrice,
    bundlePrice,
    savings: listPrice - bundlePrice,
    discountPct: Math.round((1 - bundlePrice / listPrice) * 100),
  }
}

export function getBundles(): ResolvedBundle[] {
  return DEFS.map(resolveBundle).filter(b => b.members.length >= 2)
}

export function getBundleById(id: string): ResolvedBundle | undefined {
  return getBundles().find(b => b.id === id)
}

/** Cross-sell: the best bundle that contains this product (for "Complete the system"). */
export function bundleForProduct(productId: string): ResolvedBundle | undefined {
  const containing = getBundles().filter(b => b.memberIds.includes(productId))
  // prefer the one with the biggest absolute saving
  return containing.sort((a, b) => b.savings - a.savings)[0]
}
