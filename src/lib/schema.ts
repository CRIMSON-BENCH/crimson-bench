export function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Crimson Bench',
    url: 'https://www.crimsonbench.com',
    logo: 'https://www.crimsonbench.com/logo.png',
    foundingDate: '2002',
    foundingLocation: 'New York City, NY, USA',
    description:
      'Founded in New York City. 25,000+ Ivy League-educated executives and 150,000+ total global consultants — including scientists, engineers, and ex-military. C-suite deployed within 48 hours.',
    sameAs: [
      'https://www.linkedin.com/company/crimson-bench',
      'https://twitter.com/crimsonbench',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://www.crimsonbench.com/contact',
      availableLanguage: 'English',
    },
    areaServed: 'Worldwide',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 25000, maxValue: 150000 },
    slogan: '25,000+ Ivy League executives. 150,000+ global consultants. Deployed in 48 hours.',
  }
}

export function webAppSchema(name: string, description: string, price: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'The Crimson Bench' },
    },
  }
}

export function productSchema(name: string, description: string, price: number | string, priceSuffix?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: 'The Crimson Bench' },
    offers: {
      '@type': 'Offer',
      price: typeof price === 'number' ? price : price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      priceSpecification: priceSuffix
        ? { '@type': 'UnitPriceSpecification', price: String(price), priceCurrency: 'USD', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: priceSuffix.replace('/', '') } }
        : undefined,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'The Crimson Bench' },
      url: 'https://www.crimsonbench.com/pricing',
    },
  }
}

export function articleSchema(opts: {
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  category: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    articleSection: opts.category,
    publisher: {
      '@type': 'Organization',
      name: 'The Crimson Bench',
      url: 'https://www.crimsonbench.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.crimsonbench.com/blog/${opts.category}/${opts.slug}`,
    },
  }
}

export function howToSchema(name: string, description: string, steps: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function definedTermSchema(name: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description,
    url: `https://www.crimsonbench.com/glossary/${slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Crimson Bench Executive Glossary',
      url: 'https://www.crimsonbench.com/glossary',
    },
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function localBusinessSchema(opts: {
  role: string
  city: string
  state: string
  stateAbbr: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `The Crimson Bench — Fractional ${opts.role} in ${opts.city}, ${opts.stateAbbr}`,
    description: `Ivy League-educated fractional ${opts.role} deployed to companies in ${opts.city}, ${opts.state} within 48 hours. The Crimson Bench — founded in New York City, 150,000+ global consultants.`,
    url: `https://www.crimsonbench.com/fractional/${opts.role.toLowerCase()}/${opts.state.toLowerCase().replace(/\s+/g, '-')}/${opts.city.toLowerCase().replace(/\s+/g, '-')}`,
    areaServed: {
      '@type': 'City',
      name: opts.city,
      containedInPlace: { '@type': 'State', name: opts.state },
    },
    priceRange: '$$$',
    founder: { '@type': 'Organization', name: 'The Crimson Bench', foundingDate: '2002', foundingLocation: 'New York City, NY' },
  }
}
