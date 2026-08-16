export interface Industry {
  name: string
  slug: string
  description: string
  searchVolume: 'high' | 'medium' | 'low'
  topRoles: string[]
}

export const INDUSTRIES: Industry[] = [
  { name: 'SaaS & Cloud Software', slug: 'saas', description: 'Software-as-a-service and cloud infrastructure businesses', searchVolume: 'high', topRoles: ['cto', 'cfo', 'cro', 'cmo'] },
  { name: 'Artificial Intelligence & Machine Learning', slug: 'artificial-intelligence', description: 'AI/ML companies developing models, platforms, and enterprise AI solutions', searchVolume: 'high', topRoles: ['cto', 'cro', 'cmo', 'ceo'] },
  { name: 'FinTech & Financial Services', slug: 'fintech', description: 'Financial technology, digital banking, payments, and lending platforms', searchVolume: 'high', topRoles: ['cfo', 'ciso', 'cro', 'coo'] },
  { name: 'Healthcare & Health Tech', slug: 'healthcare', description: 'Healthcare services, digital health, medical devices, and health IT', searchVolume: 'high', topRoles: ['coo', 'cfo', 'ciso', 'chro'] },
  { name: 'Private Equity-Backed Companies', slug: 'private-equity', description: 'PE portfolio companies under sponsor ownership and value creation', searchVolume: 'high', topRoles: ['cfo', 'coo', 'ceo', 'chro'] },
  { name: 'E-Commerce & Direct-to-Consumer', slug: 'ecommerce', description: 'Online retail, D2C brands, and marketplace businesses', searchVolume: 'high', topRoles: ['cmo', 'coo', 'cfo', 'cro'] },
  { name: 'Real Estate & PropTech', slug: 'real-estate', description: 'Commercial and residential real estate, REITs, and property technology', searchVolume: 'medium', topRoles: ['cfo', 'coo', 'cmo', 'chro'] },
  { name: 'Manufacturing & Industrial', slug: 'manufacturing', description: 'Traditional manufacturing, industrial, and supply chain businesses', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'chro', 'ciso'] },
  { name: 'Professional Services', slug: 'professional-services', description: 'Consulting, law firms, accounting, and other professional service firms', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'cmo', 'chro'] },
  { name: 'Media & Entertainment', slug: 'media-entertainment', description: 'Digital media, content, streaming, publishing, and entertainment companies', searchVolume: 'medium', topRoles: ['cmo', 'cfo', 'cto', 'coo'] },
  { name: 'Biotech & Life Sciences', slug: 'biotech', description: 'Pharmaceutical, biotech, and life sciences research and development', searchVolume: 'medium', topRoles: ['cfo', 'coo', 'cto', 'chro'] },
  { name: 'EdTech & Education', slug: 'edtech', description: 'Educational technology platforms and learning management systems', searchVolume: 'medium', topRoles: ['cmo', 'cto', 'cfo', 'coo'] },
  { name: 'Retail & Consumer Goods', slug: 'retail', description: 'Brick-and-mortar retail, consumer packaged goods, and omnichannel businesses', searchVolume: 'medium', topRoles: ['coo', 'cmo', 'cfo', 'chro'] },
  { name: 'Logistics & Supply Chain', slug: 'logistics', description: 'Third-party logistics, freight, warehousing, and supply chain technology', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'cto', 'chro'] },
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Cybersecurity software, managed security services, and threat intelligence', searchVolume: 'high', topRoles: ['ciso', 'cto', 'cro', 'cmo'] },
  { name: 'Clean Energy & Cleantech', slug: 'cleantech', description: 'Renewable energy, energy storage, sustainability technology, and climate tech', searchVolume: 'medium', topRoles: ['cfo', 'coo', 'cto', 'cmo'] },
  { name: 'Food & Beverage', slug: 'food-beverage', description: 'Food manufacturing, CPG brands, restaurants, and beverage companies', searchVolume: 'medium', topRoles: ['coo', 'cmo', 'cfo', 'chro'] },
  { name: 'InsurTech & Insurance', slug: 'insurtech', description: 'Insurance technology platforms, MGAs, and traditional insurance companies', searchVolume: 'medium', topRoles: ['cfo', 'coo', 'ciso', 'cro'] },
  { name: 'Legal Technology', slug: 'legaltech', description: 'Legal software, contract lifecycle management, and legal operations platforms', searchVolume: 'low', topRoles: ['cto', 'cro', 'cmo', 'coo'] },
  { name: 'HR Technology', slug: 'hrtech', description: 'Human resources software, talent management, and workforce analytics', searchVolume: 'low', topRoles: ['chro', 'cro', 'cto', 'cmo'] },
  { name: 'MarTech & Ad Tech', slug: 'martech', description: 'Marketing technology, advertising platforms, and data analytics', searchVolume: 'medium', topRoles: ['cmo', 'cto', 'cro', 'cfo'] },
  { name: 'Telecommunications', slug: 'telecom', description: 'Telecommunications carriers, wireless networks, and communications infrastructure', searchVolume: 'medium', topRoles: ['cto', 'coo', 'cfo', 'ciso'] },
  { name: 'Aerospace & Defense', slug: 'aerospace-defense', description: 'Aerospace manufacturing, defense contracting, and space technology', searchVolume: 'low', topRoles: ['coo', 'cfo', 'ciso', 'chro'] },
  { name: 'Agriculture & AgTech', slug: 'agtech', description: 'Agricultural technology, precision farming, and food supply chain', searchVolume: 'low', topRoles: ['coo', 'cfo', 'cto', 'cmo'] },
  { name: 'Construction & Architecture', slug: 'construction', description: 'General contractors, specialty contractors, and AEC technology', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'chro', 'cmo'] },
  { name: 'Nonprofit & Social Enterprise', slug: 'nonprofit', description: '501(c)(3) nonprofits, social enterprises, and mission-driven organizations', searchVolume: 'medium', topRoles: ['cfo', 'coo', 'chro', 'cmo'] },
  { name: 'Gaming & Esports', slug: 'gaming', description: 'Video game developers, publishers, esports organizations, and gaming platforms', searchVolume: 'medium', topRoles: ['cto', 'cfo', 'cmo', 'coo'] },
  { name: 'Travel & Hospitality', slug: 'travel-hospitality', description: 'Hotels, travel technology, short-term rentals, and hospitality groups', searchVolume: 'medium', topRoles: ['coo', 'cmo', 'cfo', 'chro'] },
  { name: 'Automotive & Mobility', slug: 'automotive', description: 'Automotive OEMs, dealerships, mobility platforms, and EV technology', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'cto', 'chro'] },
  { name: 'Government Contracting & GovTech', slug: 'govtech', description: 'Government technology platforms, federal contractors, and civic tech', searchVolume: 'low', topRoles: ['ciso', 'coo', 'cfo', 'cto'] },
  { name: 'Venture Capital-Backed Startups', slug: 'venture-capital', description: 'VC-backed startups from seed through Series C', searchVolume: 'high', topRoles: ['cfo', 'cto', 'cmo', 'coo'] },
  { name: 'Family-Owned Businesses', slug: 'family-business', description: 'Multi-generational family businesses navigating growth or succession', searchVolume: 'medium', topRoles: ['ceo', 'cfo', 'coo', 'chro'] },
  { name: 'Sports Technology & Fan Engagement', slug: 'sports-tech', description: 'Sports analytics, fan engagement platforms, and athlete performance technology', searchVolume: 'low', topRoles: ['cto', 'cmo', 'cro', 'coo'] },
  { name: 'Consumer Finance & Wealth Management', slug: 'wealth-management', description: 'Registered investment advisors, wealth platforms, and consumer finance apps', searchVolume: 'medium', topRoles: ['cfo', 'ciso', 'coo', 'cmo'] },
  { name: 'Retail Banking & Credit Unions', slug: 'banking', description: 'Community banks, credit unions, and digital banking challengers', searchVolume: 'medium', topRoles: ['cfo', 'ciso', 'coo', 'cto'] },
  { name: 'Data & Analytics', slug: 'data-analytics', description: 'Business intelligence platforms, data engineering, and analytics SaaS', searchVolume: 'high', topRoles: ['cto', 'cfo', 'cro', 'cmo'] },
  { name: 'DevOps & Infrastructure', slug: 'devops', description: 'Developer tools, CI/CD platforms, and cloud infrastructure companies', searchVolume: 'medium', topRoles: ['cto', 'cro', 'cmo', 'cfo'] },
  { name: 'Climate & Impact Investing', slug: 'impact-investing', description: 'ESG-focused funds, climate investors, and impact measurement platforms', searchVolume: 'low', topRoles: ['cfo', 'coo', 'cmo', 'chro'] },
  { name: 'Pharmaceutical & Drug Development', slug: 'pharma', description: 'Drug discovery, clinical-stage biotech, and specialty pharma companies', searchVolume: 'medium', topRoles: ['cfo', 'coo', 'chro', 'ciso'] },
  { name: 'Medical Devices & Diagnostics', slug: 'medical-devices', description: 'FDA-regulated medical device manufacturers and diagnostic companies', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'chro', 'ciso'] },
  { name: 'Digital Health & Telehealth', slug: 'digital-health', description: 'Telehealth platforms, remote patient monitoring, and digital therapeutics', searchVolume: 'high', topRoles: ['cto', 'cfo', 'coo', 'ciso'] },
  { name: 'Mortgage & Lending', slug: 'mortgage-lending', description: 'Mortgage origination platforms, alternative lenders, and BNPL companies', searchVolume: 'medium', topRoles: ['cfo', 'coo', 'ciso', 'cro'] },
  { name: 'Payments & Processing', slug: 'payments', description: 'Payment processing, merchant services, and embedded finance platforms', searchVolume: 'medium', topRoles: ['cto', 'cfo', 'cro', 'ciso'] },
  { name: 'Marketing Services & Agencies', slug: 'marketing-agencies', description: 'Digital marketing agencies, PR firms, and creative studios', searchVolume: 'low', topRoles: ['cmo', 'coo', 'cfo', 'chro'] },
  { name: 'Blockchain & Web3', slug: 'blockchain', description: 'Cryptocurrency, DeFi protocols, NFT platforms, and blockchain infrastructure', searchVolume: 'medium', topRoles: ['cto', 'cfo', 'coo', 'ciso'] },
  { name: 'Space & Satellite Technology', slug: 'space-tech', description: 'Commercial space launch, satellite communications, and space data analytics', searchVolume: 'low', topRoles: ['cto', 'coo', 'cfo', 'chro'] },
  { name: 'Robotics & Automation', slug: 'robotics', description: 'Industrial robotics, warehouse automation, and autonomous systems', searchVolume: 'low', topRoles: ['cto', 'coo', 'cfo', 'chro'] },
  { name: 'Staffing & Workforce Solutions', slug: 'staffing', description: 'Staffing agencies, recruitment platforms, and workforce management software', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'chro', 'cmo'] },
  { name: 'Accounting & Tax Technology', slug: 'accounting-tech', description: 'Accounting software, tax compliance platforms, and audit technology', searchVolume: 'medium', topRoles: ['cfo', 'cto', 'coo', 'cro'] },
  { name: 'Mental Health & Wellness', slug: 'mental-health', description: 'Mental health platforms, wellness apps, and behavioral health providers', searchVolume: 'medium', topRoles: ['coo', 'cmo', 'cfo', 'chro'] },
  { name: 'Pet Care & Veterinary', slug: 'pet-care', description: 'Veterinary practices, pet care platforms, and animal health companies', searchVolume: 'low', topRoles: ['coo', 'cfo', 'cmo', 'chro'] },
  { name: 'Architecture & Engineering', slug: 'architecture-engineering', description: 'Architecture firms, engineering consultancies, and AEC technology', searchVolume: 'low', topRoles: ['coo', 'cfo', 'chro', 'cmo'] },
  { name: 'Mining & Natural Resources', slug: 'mining', description: 'Mining operations, natural resource extraction, and commodities companies', searchVolume: 'low', topRoles: ['coo', 'cfo', 'chro', 'ciso'] },
  { name: 'Fashion & Apparel', slug: 'fashion', description: 'Fashion brands, luxury apparel, and sustainable clothing companies', searchVolume: 'low', topRoles: ['coo', 'cmo', 'cfo', 'chro'] },
  { name: 'Beauty & Personal Care', slug: 'beauty', description: 'Cosmetics, skincare, hair care, and personal care product companies', searchVolume: 'low', topRoles: ['cmo', 'coo', 'cfo', 'chro'] },
  { name: 'Publishing & Content Media', slug: 'publishing', description: 'Book publishers, digital content platforms, and newsletter businesses', searchVolume: 'low', topRoles: ['cmo', 'cto', 'coo', 'cfo'] },
  { name: 'Event Technology & Experiences', slug: 'events', description: 'Event management platforms, virtual events, and live experience companies', searchVolume: 'low', topRoles: ['coo', 'cmo', 'cto', 'cfo'] },
  { name: 'Security & Physical Safety', slug: 'physical-security', description: 'Physical security services, access control, and surveillance technology', searchVolume: 'low', topRoles: ['coo', 'ciso', 'cfo', 'chro'] },
  { name: 'Childcare & Early Education', slug: 'childcare', description: 'Childcare providers, early education platforms, and learning management systems', searchVolume: 'low', topRoles: ['coo', 'cfo', 'chro', 'cmo'] },
  { name: 'Fitness & Sports Performance', slug: 'fitness', description: 'Fitness studios, sports performance analytics, and wellness platforms', searchVolume: 'low', topRoles: ['coo', 'cmo', 'cfo', 'chro'] },
  { name: 'Ocean & Maritime', slug: 'maritime', description: 'Shipping, logistics, maritime technology, and offshore energy', searchVolume: 'low', topRoles: ['coo', 'cfo', 'chro', 'ciso'] },
  { name: 'Smart Home & IoT', slug: 'iot', description: 'IoT device manufacturers, smart home platforms, and connected hardware companies', searchVolume: 'medium', topRoles: ['cto', 'coo', 'ciso', 'cmo'] },
  { name: 'HR & Benefits Administration', slug: 'benefits-admin', description: 'Benefits administration platforms, PEO services, and HR outsourcing', searchVolume: 'low', topRoles: ['chro', 'cfo', 'coo', 'cto'] },
  { name: 'Commodity Trading & Brokerage', slug: 'trading', description: 'Commodity brokerages, trading platforms, and financial exchanges', searchVolume: 'low', topRoles: ['cfo', 'ciso', 'coo', 'cto'] },
  { name: 'Social Impact & Philanthropy', slug: 'social-impact', description: 'Foundations, philanthropic organizations, and ESG advisory firms', searchVolume: 'low', topRoles: ['cfo', 'coo', 'chro', 'cmo'] },
  { name: 'Infrastructure & Utilities', slug: 'utilities', description: 'Water, electric, gas utilities and infrastructure asset owners', searchVolume: 'low', topRoles: ['coo', 'cfo', 'ciso', 'chro'] },
  { name: 'Auction & Secondary Markets', slug: 'secondary-markets', description: 'Auction platforms, secondary market exchanges, and resale marketplaces', searchVolume: 'low', topRoles: ['coo', 'cfo', 'cto', 'cmo'] },
  { name: 'Cannabis & Hemp', slug: 'cannabis', description: 'Licensed cannabis operators, hemp companies, and cannabis technology platforms', searchVolume: 'low', topRoles: ['cfo', 'coo', 'ciso', 'chro'] },
  { name: 'Franchise Systems', slug: 'franchise', description: 'Franchise networks, multi-unit operators, and franchise technology', searchVolume: 'medium', topRoles: ['coo', 'cfo', 'chro', 'cmo'] },
  { name: 'Dental & Ophthalmology DSOs', slug: 'dental-dso', description: 'Dental service organizations, optometry networks, and specialty DSOs', searchVolume: 'low', topRoles: ['cfo', 'coo', 'chro', 'cmo'] },
  { name: 'Veterinary Groups & Consolidators', slug: 'vet-groups', description: 'Veterinary practice consolidators, multi-site clinic operators', searchVolume: 'low', topRoles: ['cfo', 'coo', 'chro', 'cmo'] },
  { name: 'Software & App Development Agencies', slug: 'software-agencies', description: 'Custom software development shops, mobile app agencies, and nearshore teams', searchVolume: 'low', topRoles: ['cto', 'coo', 'cmo', 'cfo'] },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}

export function getAllIndustrySlugs(): string[] {
  return INDUSTRIES.map(i => i.slug)
}

export function getHighVolumeIndustries(): Industry[] {
  return INDUSTRIES.filter(i => i.searchVolume === 'high')
}
