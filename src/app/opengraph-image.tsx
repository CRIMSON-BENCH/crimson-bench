import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'The Crimson Bench — Ivy League operator-grade financial models'

export default function Image() {
  return ogImage('Model the whole business — not just one metric.', '500 simulators · 515 Excel toolkits · 20 end-to-end company models')
}
