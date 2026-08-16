import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: 'https://www.crimsonbench.com/sitemap.xml',
    host: 'https://www.crimsonbench.com',
  }
}
