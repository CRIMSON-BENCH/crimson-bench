import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Toolkit Pro — 500 executive simulators from The Crimson Bench'

export default function Image() {
  return ogImage('500 simulators. Model the whole trajectory.', 'Projections, scenarios, and valuations — Toolkit Pro.')
}
