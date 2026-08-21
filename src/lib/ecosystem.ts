// The wider ecosystem — the founder's other SaaS products, cross-promoted to
// Crimson Bench buyers. Buyers get a standing discount (coupon set up inside each
// app by the owner). URLS + TAGLINES ARE DRAFTS pending owner confirmation.

export interface EcoApp {
  name: string
  url: string
  tagline: string
  desc: string
  /** What Crimson Bench audience / product this pairs with (for placement + copy). */
  pairs: string
  /** Cross-promo code Crimson Bench buyers use (owner configures it in each app). */
  coupon: string
}

/** Outbound: Crimson Bench customers get this % off the partner apps (code set up in each app). */
export const ECO_DISCOUNT_PCT = 20
export const ECO_COUPON = 'CRIMSON20'

/** Reciprocal / inbound: customers of the partner apps get this % off Crimson Bench. */
export const RECIPROCAL_PCT = 15
export const RECIPROCAL_COUPON = 'CRIMSON15'

export const ECOSYSTEM: EcoApp[] = [
  {
    name: 'PitchReadyAI',
    url: 'https://pitchreadyai.com',
    tagline: 'Get your pitch investor-ready with AI.',
    desc: 'AI that sharpens your deck, narrative, and answers before you walk into the room.',
    pairs: 'Pairs with the Seed Pitch Deck & fundraising toolkits.',
    coupon: ECO_COUPON,
  },
  {
    name: 'RFPScript',
    url: 'https://rfpscript.com',
    tagline: 'Win more RFPs with AI-drafted responses.',
    desc: 'Turn a blank RFP into a polished, on-message response in a fraction of the time.',
    pairs: 'Pairs with the sales & go-to-market toolkits.',
    coupon: ECO_COUPON,
  },
  {
    name: 'PolySimOS',
    url: 'https://polysimos.com',
    tagline: 'An operating system for business simulations.',
    desc: 'Build, run, and share interactive simulations of any business scenario.',
    pairs: 'Pairs with the 500 Crimson Bench simulators.',
    coupon: ECO_COUPON,
  },
  {
    name: '3DBuildBot',
    url: 'https://3dbuildbot.com',
    tagline: 'AI-assisted 3D building, automated.',
    desc: 'Go from spec to 3D build faster with an AI copilot doing the heavy lifting.',
    pairs: 'Pairs with the Construction company operating model.',
    coupon: ECO_COUPON,
  },
  {
    name: 'AIDisputeEngine',
    url: 'https://aidisputeengine.com',
    tagline: 'Resolve disputes with AI-built cases.',
    desc: 'Draft airtight dispute letters and case files with AI, in minutes.',
    pairs: 'Pairs with the finance & operations toolkits.',
    coupon: ECO_COUPON,
  },
]
