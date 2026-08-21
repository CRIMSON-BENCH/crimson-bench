// The Operator's Kit — a free bonus pack that ships with EVERY toolkit purchase.
// Pure value-stacking: it costs nothing to include and makes the $69–199 price feel
// like a steal. Advertised on product pages, pricing, and the digital-products listing.

export interface BonusItem {
  title: string
  desc: string
}

export const OPERATOR_KIT: {
  name: string
  blurb: string
  items: BonusItem[]
} = {
  name: "The Operator's Kit",
  blurb:
    'Every toolkit ships with a free bonus pack — the extras that turn a spreadsheet into a board-ready deliverable.',
  items: [
    {
      title: "Operator's Cheat Sheet",
      desc: 'One page: every key formula, metric, and benchmark in the toolkit, ready to reference.',
    },
    {
      title: 'Investor-Grade Chart Pack',
      desc: 'Pre-styled chart templates so your outputs look board-ready in a click.',
    },
    {
      title: 'The Assumptions Checklist',
      desc: 'The questions to pressure-test before you trust any model’s output.',
    },
    {
      title: 'Quick-Start Guide',
      desc: 'Open it, plug in your numbers, and get an answer in under 10 minutes.',
    },
    {
      title: 'Excel + Google Sheets versions',
      desc: 'Every file works in both — nothing new to buy or install.',
    },
  ],
}
