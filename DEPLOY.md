# Deploying The Crimson Bench

The public site is this Next.js repo (`CRIMSON-BENCH/crimson-bench`). Lovable/Supabase is the
backend (login, account, Stripe, AI). Deploy the site to Vercel and point the domain at it.

## 1. Import the RIGHT repo on Vercel
- New Project → Import Git Repository → **`CRIMSON-BENCH/crimson-bench`** (NOT PolySimOS).
- Framework preset: **Next.js** (auto-detected).
- Root Directory: **`./`** (repo root).
- Build command / output: leave defaults. `next.config` uses `output: 'export'`, so Vercel serves
  the static `out/` automatically. No overrides needed.

## 2. Environment variables (optional — add now or later)
In the Vercel project → Settings → Environment Variables (see `.env.example`):
- `NEXT_PUBLIC_AI_ENDPOINT` = Lovable `ai-analysis` function URL (from Lovable Prompt 4).
- `NEXT_PUBLIC_CHECKOUT_ENDPOINT` = Lovable `create-checkout` function URL (from Lovable Prompt 2).

Without these, the site still deploys fine: AI shows a "coming soon" note and Buy buttons fall back
to `/contact`. Set them once Lovable gives you the URLs, then redeploy.

## 3. Domain
- In Vercel → Settings → Domains, add `crimsonbench.com` and `www.crimsonbench.com`.
- Update your domain's DNS to Vercel (Vercel shows the exact records). This moves the apex/www
  off the old Lovable app.
- Put the Lovable app on a subdomain — e.g. `app.crimsonbench.com` — for login / account / checkout.

## 4. After deploy — tell Claude
Once it's live and you have the Lovable function URLs, share them and Claude will:
- confirm the AI + checkout endpoints resolve,
- wire the entitlement bridge (Supabase session → `cb_pro` so gated simulators unlock),
- spot-check the purchase + download flows.

## Notes
- The paid deliverable files (`crimson-bench-deliverables/`) are NOT in this repo. They live in the
  private Supabase Storage bucket and are served via signed URLs (Lovable Prompt 3).
- Everything here is static (`output: 'export'`), so any static host works; Vercel is simplest.
