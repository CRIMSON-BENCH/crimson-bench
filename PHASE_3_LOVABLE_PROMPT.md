# Phase 3 — Lovable Build Prompt
# The Crimson Bench: Stripe, Auth, and Product Delivery

---

## Project Overview

This is Phase 3 of The Crimson Bench (crimsonbench.com) — a fractional executive placement firm with 25,000+ Ivy League C-suite executives and 150,000+ global consultants (including scientists, engineers, and ex-military). Founded 2002, New York City.

The Phase 2 static SEO site (Next.js, GitHub: CRIMSON-BENCH/crimson-bench) generates 13,000+ pages targeting fractional executive keywords. Phase 3 is the dynamic application layer: Stripe payments, user authentication, and product/service delivery.

---

## Core Requirements

### Authentication
- Email/password + Google OAuth signup and login
- User roles: `client`, `admin`, `executive` (internal bench members)
- Email verification on signup
- Protected dashboard routes

### Stripe Integration (78 Products)

Wire all 78 products below to Stripe. Use:
- `stripe.checkout.sessions.create()` for one-time payments and fixed-scope engagements
- `stripe.subscriptions.create()` for monthly and annual products
- `stripe.billingPortal.sessions.create()` for managing subscriptions

**Stripe Price IDs**: Create each product in the Stripe dashboard. Use `metadata.productId` to store the product ID (matches the `id` field below) so webhooks can route correctly.

**Webhook events to handle**:
- `checkout.session.completed` → create Order record, send confirmation email, notify admin
- `customer.subscription.created` → create Subscription record
- `customer.subscription.deleted` → update Subscription status to `cancelled`
- `invoice.payment_failed` → send dunning email

---

## All 78 Products (Stripe Configuration)

### Monthly Subscriptions (stripeMode: subscription)
| # | ID | Name | Price |
|---|-----|------|-------|
| 4 | advisory-retainer | Advisory Retainer | $4,000/mo |
| 5 | scale-up-fractional | Scale-Up Fractional | $7,500/mo |
| 6 | growth-fractional | Growth Fractional | $12,500/mo |
| 7 | embedded-executive | Embedded Executive | $22,500/mo |
| 16 | board-seat-retainer | Board Seat Retainer | $2,500/mo |
| 17 | fractional-c-suite-package | Fractional C-Suite Package | $18,500/mo |
| 34 | crisis-management-retainer | Crisis Management Retainer | $8,000/mo |
| 36 | talent-access-subscription | PE/VC Talent Access Subscription | $3,500/mo |
| 72 | executive-linkedin-ghostwriting | Executive LinkedIn Ghostwriting | $2,000/mo |
| 73 | thought-leadership-program | Thought Leadership Program | $3,000/mo |

### Annual Subscriptions (stripeMode: subscription)
| # | ID | Name | Price |
|---|-----|------|-------|
| 20 | annual-prepay | Annual Prepay — 2 Months Free | Tier × 10 |
| 37 | executive-network-membership | Executive Network Membership | $1,200/yr |
| 66 | scientific-advisory-panel | Scientific Advisory Panel | $8,000-$25,000/yr |

### One-Time Payments (stripeMode: payment)
| # | ID | Name | Price |
|---|-----|------|-------|
| 1 | industry-audit-report | Industry Audit Report | $500 |
| 2 | executive-diagnostic | Executive Diagnostic | $1,500 |
| 3 | diagnostic-bundle | Diagnostic Bundle 3× | $3,750 |
| 15 | executive-career-consulting | Executive Career Consulting | $2,500 |
| 35 | executive-coaching | Executive Coaching (90 min) | $1,200 |
| 40 | fractional-executive-certification | Fractional Executive Certification | $2,500 |
| 41 | executive-masterclass | Executive Masterclass Series | $1,500 |
| 42 | market-compensation-report | C-Suite Compensation Report | $1,000 |
| 43 | executive-playbook-bundle | Executive Playbook Bundle | $350 |
| 44 | board-readiness-assessment | Board Readiness Assessment | $3,500 |
| 46 | annual-summit-pass | Annual Executive Summit Pass | $3,000 |

### Fixed-Scope / Custom (stripeMode: payment, variable price → use Stripe Payment Links or quote flow)
These require a quote step before Stripe checkout. Build a quote request form that emails admin and creates a Quote record in your database. Admin confirms price → sends Stripe Payment Link to client.

| # | ID | Name | Price Range |
|---|-----|------|-------------|
| 8 | transformation-mandate | Transformation Mandate (6-mo) | $40,000 |
| 9 | turnaround-mandate | Turnaround Mandate | $55,000 |
| 10 | ma-advisory | M&A Advisory | $65,000 |
| 11 | board-search-placement | Board Search & Placement | $35,000 |
| 12 | executive-team-assessment | Executive Team Assessment | $12,000 |
| 13 | post-acquisition-integration | Post-Acquisition Integration | $28,000 |
| 19 | corporate-leadership-workshop | Corporate Leadership Workshop | $3,000–$8,000 |
| 23 | permanent-executive-search | Permanent Executive Search | $35,000–$75,000 |
| 24 | board-director-placement | Board Director Placement | $25,000–$55,000 |
| 25 | advisor-placement | Advisor Placement & Structuring | $8,000–$18,000 |
| 26 | management-due-diligence | Management Due Diligence Report | $8,000–$25,000 |
| 27 | acquisition-readiness-assessment | Acquisition Readiness Assessment | $15,000–$35,000 |
| 28 | portfolio-company-health-audit | Portfolio Company Health Audit | $10,000–$30,000 |
| 29 | technology-stack-audit | Technology Stack Audit | $5,000–$12,000 |
| 30 | go-to-market-playbook | Go-to-Market Playbook | $8,000–$20,000 |
| 31 | revenue-operations-audit | Revenue Operations Audit | $5,000–$15,000 |
| 32 | people-strategy-assessment | People Strategy Assessment | $6,000–$16,000 |
| 33 | capital-structure-advisory | Capital Structure Advisory | $15,000–$45,000 |
| 38 | succession-planning-program | Succession Planning Program | $15,000–$40,000 |
| 39 | 100-day-onboarding-program | 100-Day Executive Onboarding | $12,000 |
| 48 | deep-research-report | Deep Research Report | $3,500–$15,000 |
| 49 | scientific-literature-synthesis | Scientific Literature Synthesis | $2,500–$8,000 |
| 50 | commissioned-whitepaper | Commissioned Whitepaper | $5,000–$20,000 |
| 51 | competitive-intelligence-report | Competitive Intelligence Report | $3,000–$12,000 |
| 52 | technology-landscape-analysis | Technology Landscape Analysis | $5,000–$18,000 |
| 53 | patent-ip-landscape | Patent & IP Landscape Analysis | $4,000–$14,000 |
| 54 | market-sizing-study | Market Sizing Study | $4,000–$12,000 |
| 55 | regulatory-intelligence-report | Regulatory Intelligence Report | $3,500–$10,000 |
| 56 | consumer-survey-research | Consumer Survey & Research | $5,000–$15,000 |
| 57 | economic-impact-analysis | Economic Impact Analysis | $8,000–$25,000 |
| 58 | custom-dataset | Custom Dataset Compilation | $5,000–$20,000 |
| 59 | financial-model-build | Financial Model Build | $3,500–$12,000 |
| 60 | business-scenario-simulation | Business Scenario Simulation | $5,000–$18,000 |
| 61 | demand-forecasting-model | Demand Forecasting Model | $6,000–$15,000 |
| 62 | operations-research-optimization | Operations Research & Optimization | $8,000–$25,000 |
| 63 | supply-chain-intelligence | Supply Chain Intelligence Report | $6,000–$18,000 |
| 64 | monte-carlo-risk-simulation | Monte Carlo Risk Simulation | $5,000–$15,000 |
| 65 | deep-tech-due-diligence | Deep Tech Due Diligence | $10,000–$35,000 |
| 67 | rd-strategy-advisory | R&D Strategy & Lab Design | $10,000–$30,000 |
| 68 | ai-ml-strategy | AI & Machine Learning Strategy | $10,000–$30,000 |
| 69 | climate-sustainability-assessment | Climate & Sustainability Assessment | $8,000–$25,000 |
| 71 | social-media-strategy | Social Media Strategy & Audit | $3,500–$10,000 |
| 74 | corporate-podcast-strategy | Corporate Podcast Strategy & Launch | $5,000–$15,000 |
| 75 | brand-positioning | Brand Positioning & Messaging | $6,000–$18,000 |
| 76 | crisis-communications-strategy | Crisis Communications Strategy | $5,000–$20,000 |
| 77 | influencer-creator-strategy | Influencer & Creator Strategy | $3,500–$10,000 |
| 78 | content-strategy | Content Strategy & Editorial Calendar | $4,000–$12,000 |

### Custom / Custom Pricing (require sales conversation)
| # | ID | Name | Notes |
|---|-----|------|-------|
| 18 | pe-corporate-package | PE / Family Office Corporate Package | $30K+/mo |
| 21 | ma-due-diligence-assessment | M&A Due Diligence Executive Assessment | Custom |
| 45 | speaker-bureau | Speaker Bureau | Commission-based |
| 47 | white-label-partner-license | White Label Partner License | Custom |
| 70 | biotech-pharma-advisory | Biotech & Pharma Development Advisory | Custom |

### Affiliate / Rev-Share (no Stripe checkout — handled offline)
| # | ID | Name | Notes |
|---|-----|------|-------|
| 22 | referral-partner-program | Referral Partner Program | 10% rev share |

---

## Dashboard Pages to Build

### Client Dashboard (/dashboard)
- Order history (completed purchases)
- Active subscriptions with billing portal link
- Pending quotes (awaiting admin pricing)
- Service delivery: uploaded deliverables (PDFs, files) per order
- Schedule a call (Calendly embed or similar)

### Admin Dashboard (/admin)
- All orders (pending, active, delivered)
- Quote management (set price → send Stripe Payment Link)
- File delivery (upload deliverable → client notified by email)
- Revenue dashboard (MRR, ARR, total revenue)
- Client list with engagement history

---

## Contact / Intake Form (/contact)

The primary lead capture. Fields:
- Full name, email, company, company size (dropdown: <$5M / $5M–$25M / $25M–$100M / $100M+)
- Executive role needed (8 roles multi-select)
- Urgency (dropdown: ASAP / 1–4 weeks / 1–3 months / Exploring)
- Brief description (textarea)
- How did you hear about us?

On submit: save to database, send confirmation email to user, send lead notification to hello@crimsonbench.com.

---

## Email Templates (Transactional)

1. **Order Confirmation** — "Your [Product Name] is confirmed. An executive will contact you within 48 hours."
2. **Quote Request Received** — "We've received your inquiry and will send a custom quote within 24 hours."
3. **Custom Quote Ready** — "Your quote is ready. Click to review and pay."
4. **Subscription Renewal** — "Your [Product] renews on [date] for $[amount]."
5. **Subscription Cancellation** — "Your subscription has been cancelled. Access continues through [date]."
6. **Deliverable Ready** — "Your [Product] deliverable is ready. Log in to download."
7. **Welcome Email** — For new signups.

---

## Tech Stack Constraints

- Must integrate with the existing Next.js 15 static site at github.com/CRIMSON-BENCH/crimson-bench
- Lovable build should be a separate app (different domain: app.crimsonbench.com) OR can be integrated as /dashboard routes if Lovable supports Next.js
- Supabase for database and auth (preferred)
- Stripe for all payments
- Resend or Postmark for transactional email

---

## Brand

- Primary accent: #B01C24 (crimson)
- Dark slate backgrounds: slate-950 / slate-900
- Font-serif headings, font-mono labels
- No marketplace markup language — everything is flat-rate and direct
- Voice: confident, institutional, precise

---

## Priority Order

1. Auth (signup, login, email verify)
2. Contact / intake form with database save + email
3. Stripe checkout for top 10 products (one-time payments first)
4. Client dashboard (orders + subscriptions)
5. Stripe subscriptions (monthly products)
6. Quote flow (fixed-scope products)
7. Admin dashboard
8. File delivery system
9. All 78 products wired

---

*Generated by The Crimson Bench build system. Last updated: 2026-08-15*
