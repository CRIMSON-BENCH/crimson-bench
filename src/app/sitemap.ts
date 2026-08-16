import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import { getAllRoleSlugs } from '@/lib/roles'
import { getAllStateSlugs } from '@/lib/states'
import { getAllCitySlugs, getCitiesByState } from '@/lib/cities'
import { getAllIndustrySlugs } from '@/lib/industries'
import { getAllCompanyTypeSlugs } from '@/lib/company-types'
import { getAllCompetitorSlugs } from '@/lib/competitors'
import { PRODUCTS } from '@/lib/pricing'

const BASE = 'https://www.crimsonbench.com'

function url(path: string, priority: number = 0.5, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency, priority }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const roles = getAllRoleSlugs()
  const states = getAllStateSlugs()
  const industries = getAllIndustrySlugs()
  const companyTypes = getAllCompanyTypeSlugs()
  const competitors = getAllCompetitorSlugs()

  const entries: MetadataRoute.Sitemap = []

  // Core pages
  entries.push(
    url('/', 1.0, 'weekly'),
    url('/bench', 0.9, 'weekly'),
    url('/pricing', 0.9, 'weekly'),
    url('/compare', 0.8, 'weekly'),
    url('/about', 0.7, 'monthly'),
    url('/contact', 0.9, 'weekly'),
    url('/guides/how-to-hire', 0.8, 'monthly'),
    url('/blog', 0.8, 'weekly'),
    url('/glossary', 0.7, 'monthly'),
    url('/templates', 0.7, 'monthly'),
    url('/legal/disclaimer', 0.3, 'yearly'),
    url('/legal/privacy', 0.3, 'yearly'),
    url('/legal/terms', 0.3, 'yearly'),
  )

  // Role pages
  for (const role of roles) {
    entries.push(
      url(`/bench/${role}`, 0.9, 'weekly'),
      url(`/fractional/${role}`, 0.8, 'weekly'),
      url(`/guides/how-to-hire/${role}`, 0.8, 'monthly'),
    )
  }

  // Product pages
  for (const p of PRODUCTS) {
    entries.push(url(`/services/${p.id}`, 0.8, 'monthly'))
  }

  // Competitor pages
  for (const comp of competitors) {
    entries.push(url(`/compare/${comp}`, 0.8, 'monthly'))
  }

  // State pages — role × state = 400
  for (const role of roles) {
    for (const state of states) {
      entries.push(url(`/fractional/${role}/${state}`, 0.7, 'monthly'))
      entries.push(url(`/cost/${role}/${state}`, 0.7, 'monthly'))
      entries.push(url(`/resources/${state}`, 0.6, 'monthly'))
    }
  }

  // City pages — role × state × cities
  for (const role of roles) {
    for (const state of states) {
      const cities = getCitiesByState(state)
      for (const city of cities) {
        entries.push(url(`/fractional/${role}/${state}/${city.slug}`, 0.6, 'monthly'))
      }
    }
  }

  // Industry pages — role × industry = 600
  for (const role of roles) {
    for (const ind of industries) {
      entries.push(url(`/fractional/${role}/industries/${ind}`, 0.6, 'monthly'))
    }
  }

  // Company type pages — role × type = 240
  for (const role of roles) {
    for (const type of companyTypes) {
      entries.push(url(`/fractional/${role}/for/${type}`, 0.6, 'monthly'))
    }
  }

  return entries
}
