# Gumti Textiles Ltd. — Premium Corporate Website & B2B Platform

## Project Overview
- **Name**: Gumti Textiles Ltd. digital platform (`gumti-textiles`)
- **Goal**: Premium international B2B website for a Bangladesh knit-composite textile & apparel manufacturer — communicating verified capabilities, products, quality/compliance, and converting buyers through RFQ/sample/contact workflows.
- **Visual Direction**: Luxury fashion brand meets advanced industrial manufacturing. Deep Navy `#071A2B`, Midnight `#0B1117`, Warm Ivory `#F5F1E8`, Textile Sand `#C7B79C`, Fraunces + Inter typography, cinematic scroll and interaction system.

## URLs
- **Sandbox Preview**: https://3000-itgaur1qw6hqpqrimeclm-ad490db5.sandbox.novita.ai
- **GitHub**: https://github.com/BornilMahmud/gumoti-industry
- **Production**: not yet deployed (Cloudflare Pages ready)
- **Facebook**: https://www.facebook.com/gumtitextile

## Currently Completed Features
### Premium visual + motion upgrade
- New original Gumti Textiles SVG logo inspired by the provided reference style: roof/industrial skyline/thread/leaf motifs adapted to textiles (the reference image itself is not embedded as the header logo).
- New SVG favicon in the same Gumti-inspired visual language.
- Cinematic homepage hero with staged reveal timing, textile texture overlay, parallax-ready image depth, scroll indicator, magnetic CTAs and premium typography.
- Global motion tokens and easing system in `public/static/style.css` (`instant`, `fast`, `standard`, `cinematic`, `dramatic`; luxury/cinematic/expo easings).
- Desktop-only custom cursor with contextual labels (`VIEW`, `EXPLORE`, `QUOTE`, `ASK`) and reduced-motion/touch-device opt-out.
- Premium loader (~1 second), thin scroll progress bar, hide-on-scroll/reveal-on-up navigation, image mask reveals, blur-to-sharp text reveals, form focus animations and animated success states.
- Signature scroll-driven **Manufacturing Journey**: `FROM FIBER TO FINISHED GARMENT` with stage number/image/text/progress updates.
- Horizontal capabilities rail, editorial product cards, animated filter transitions, certification wall hover expansion, masked quality headline, dramatic final CTA and oversized footer wordmark.

### Public website
- Pages: `/`, `/about`, `/capabilities`, `/products`, `/products/:slug`, `/products/compare`, `/quality`, `/sustainability`, `/global-reach`, `/facilities`, `/careers`, `/careers/:slug`, `/news`, `/news/:slug`, `/contact`, `/portal`, `/admin`, `/privacy`, `/terms`.
- Professional 404 / 500 error pages; sticky mobile Request-Quote CTA; full responsive design; reduced-motion support; skip links; keyboard-accessible navigation.

### B2B systems (real, connected — no fake functionality)
- **RFQ system** (`/request-quote` → `POST /api/rfq`): validation, honeypot, rate limiting, D1 storage, tracking IDs (`RFQ-GT-2026-XXXX`).
- **Sample requests** (`/request-sample` → `POST /api/sample`).
- **Contact inquiries** (`POST /api/contact`) and **Job applications** (`POST /api/apply`).
- **Product catalog**: instant filtering with URL query persistence, compare up to 3 products, product detail pages, spec sheet download (`/api/products/:slug/spec`).
- **Buyer Portal** (`/portal`): Firebase Google Sign-In (`gumoti-tex`), RFQ tracking by account email, Firestore mirror writes, Firebase Analytics.
- SEO: meta/OG, Organization JSON-LD, `/sitemap.xml`, `/robots.txt`.

### GUMTI AI assistant
- Floating premium assistant button: **ASK GUMTI AI**.
- Quick actions: Find a Product, Find by GSM, Find by Material, Request Quote, Certification, Contact Sales.
- Retrieval is limited to verified product/company data from `src/data/products.ts` and `src/data/company.ts` via `GET /api/ai?q=`.
- Product recommendations render verified product data only and include `Source: Gumti Product Database`.
- Unknown or unverified requirements escalate with: “I don't have verified information for that requirement. Please contact our sales team.”
- No prices, MOQ, capacity, buyers, certificate numbers or export markets are fabricated.

### Admin panel
- `/admin` built with Firebase Google Sign-In UI and D1-backed admin overview API.
- Admin API endpoint: `GET /api/admin/overview`.
- Authorization: Firebase ID token is verified server-side against the `gumoti-tex` project and checked against `ADMIN_EMAILS` in `src/index.tsx`.
- Current default allowlist: `info@gumtitextiles.com`.

## Functional Entry URIs
| Method | Path | Params |
|---|---|---|
| GET | `/` `/about` `/capabilities` `/quality` `/sustainability` `/global-reach` `/facilities` `/news` `/contact` `/portal` `/admin` `/privacy` `/terms` | — |
| GET | `/products` | `category, composition, construction, certification, search` |
| GET | `/products/:slug`, `/products/compare?items=a,b,c` | — |
| GET | `/careers?department=…`, `/careers/:slug` | — |
| GET | `/request-quote?product=…`, `/request-sample?product=…` | — |
| GET | `/api/products` | same filters, returns `{count, html}` |
| GET | `/api/products/:slug/spec` | spec sheet download |
| GET | `/api/ai?q=` | verified AI assistant response/product recommendations |
| GET | `/api/admin/overview` | requires Firebase ID token for an allowlisted admin email |
| POST | `/api/rfq` | company_name*, contact_person*, email*, product*, quantity*, phone, country, unit, composition, gsm, color, delivery_date, target_price, requirements |
| GET | `/api/rfq?email=` | list RFQs for buyer email |
| POST | `/api/contact` | name*, email*, inquiry_type*, message*, company, phone, country |
| POST | `/api/sample` | product*, email*, shipping_address*, color, gsm, quantity, country, purpose, comments |
| POST | `/api/apply` | position*, name*, email*, phone*, experience*, linkedin, education, cover_letter |

## Admin Login Guide
1. In Firebase Console for project `gumoti-tex`, enable **Authentication → Sign-in method → Google**.
2. Add the sandbox/deployed domain to **Authentication → Settings → Authorized domains**.
3. In `src/index.tsx`, edit `ADMIN_EMAILS` so it contains the Google email(s) that should be allowed to manage the site, for example:
   ```ts
   const ADMIN_EMAILS = ['your-google-admin-email@gmail.com']
   ```
4. Rebuild/redeploy the site after editing the allowlist.
5. Open `/admin`.
6. Click **Sign in with Google**.
7. Choose the allowlisted Google account.
8. Click **Load / Refresh Admin Data** to view RFQs, contact inquiries, sample requests and job applications.

If the email is not allowlisted, the admin API returns `403 Admin access denied`.

## Firestore Rules
Copy-paste ready rules are committed in `firestore.rules`. These rules allow signed-in users to create mirror records and read only their own records; all other access is denied.

## Data Architecture
- **D1 (SQLite)** — operational source of truth: `rfqs`, `contact_inquiries`, `sample_requests`, `job_applications`, `rate_limits`.
- **Firebase** (`gumoti-tex` project): Google Authentication, Firestore mirror of submissions linked to `uid`, Analytics.
- **Single source of truth** for company facts: `src/data/company.ts`.
- **Product database**: `src/data/products.ts`.
- **Data accuracy policy**: unverified figures render as *“Information to be confirmed by Gumti Textiles Ltd.”*; product specs are CMS-managed templates; no invented statistics, buyers or certificate metadata.

## User Guide
1. **Buyers**: Browse `/products`, filter/compare, open a product → **Request Quote** → receive an `RFQ-GT-…` tracking ID. Sign in with Google at `/portal` to see RFQs tied to your email.
2. **Visitors**: Use **ASK GUMTI AI** for verified product search, GSM/material guidance, certification summaries and RFQ handoff.
3. **Admins/Ops**: Log in at `/admin` with an allowlisted Google account to view D1 records.
4. **Content editors/developers**: Update company facts in `src/data/company.ts`, products in `src/data/products.ts`, jobs/news in `src/pages/careers-news.tsx`.

## Features Not Yet Implemented
- Admin status update controls and quotation pipeline actions beyond read-only overview.
- Email notifications (requires transactional email provider API key).
- File uploads for tech packs (requires R2 bucket binding).
- Admin controls for AI system instructions/knowledge settings/analytics dashboards.
- Multilingual EN/BN content system.

## Recommended Next Steps
1. Replace CC/public-domain placeholder imagery with official Gumti factory/product photography.
2. Add the production domain to Firebase Authorized Domains.
3. Update `ADMIN_EMAILS` to the real Gumti admin Google accounts.
4. Deploy Firestore rules from `firestore.rules` in Firebase Console.
5. Add email notifications and tech-pack uploads when API keys/R2 are available.

## Deployment
- **Platform**: Cloudflare Pages (Hono + Vite), D1 local mode for development.
- **Status**: Active in sandbox (PM2 + `wrangler pages dev`).
- **Tech Stack**: Hono · TypeScript · TailwindCSS (CDN) · Cloudflare D1 · Firebase Auth/Firestore/Analytics.
- **Local dev**: `npm run build && npm run db:migrate:local && pm2 start ecosystem.config.cjs`.
- **Last Updated**: 2026-08-28.
