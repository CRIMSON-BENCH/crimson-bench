import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Bespoke enterprise models — a live simulation of your entire company'

export default function Image() {
  return ogImage('A live simulation of your entire company.', '20 end-to-end company models · $250 · or bespoke, built for you.')
}
