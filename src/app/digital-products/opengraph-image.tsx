import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = '515 formula-driven Excel toolkits from The Crimson Bench'

export default function Image() {
  return ogImage('515 Excel toolkits, built by operators.', 'Formula-driven models. Instant download. Excel & Google Sheets.')
}
