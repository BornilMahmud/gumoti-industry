# Gumti Textiles Ltd. — Corporate Website & B2B Platform

## Project Overview
- **Name**: Gumti Textiles Ltd. digital platform (`gumti-textiles`)
- **Goal**: Premium international B2B website for a Bangladesh knit-composite textile & apparel manufacturer — communicating capabilities, products, quality/compliance, and converting buyers through a real RFQ workflow.
- **Design**: Deep Navy `#071A2B` / Warm Ivory `#F5F1E8` / Textile Sand `#C7B79C`, Fraunces (editorial serif) + Inter, sophisticated-industrial visual language. Design system informed by the **ui-ux-pro-max** skill (Trust & Authority + Conversion pattern, WCAG-aware).

## URLs
- **Sandbox Preview**: https://3000-iu86kic7n3dtuadbc2dso-ad490db5.sandbox.novita.ai
- **GitHub**: https://github.com/BornilMahmud/gumoti-industry
- **Production**: not yet deployed (Cloudflare Pages ready)

## Currently Completed Features
### Public website
- Cinematic homepage: hero, verified trust strip, about, interactive **Manufacturing Journey** accordion (6 stages), product showcase, **Fabric-to-Garment drag slider**, certification wall, global reach, factory section, CTA flow
- Pages: `/about` (timeline), `/capabilities` (6 stage sections + CMS-managed spec tables), `/quality` (interactive certification wall — BCI, SEDEX, OEKO-TEX, GOTS), `/sustainability` (verified-data metric registry), `/global-reach` (animated SVG world map), `/facilities` (factory + head office w/ Google Maps links), `/careers` + job detail + application form, `/news` + article pages, `/contact`, `/privacy`, `/terms`
- Professional 404 / 500 error pages; sticky mobile Request-Quote CTA; full responsive design; reduced-motion support; skip links; keyboard-accessible nav

### B2B systems (real, connected — no fake functionality)
- **RFQ system** (`/request-quote` → `POST /api/rfq`): validation (email/phone/qty), honeypot + rate limiting (10/10min/IP), D1 storage, tracking IDs (`RFQ-GT-2026-XXXX`)
- **Sample requests** (`/request-sample` → `POST /api/sample`)
- **Contact inquiries** (`POST /api/contact`), **Job applications** (`POST /api/apply`)
- **Product catalog**: instant filtering w/ URL query persistence (`/products?category=poloshirts&composition=cotton`), **compare up to 3 products** (`/products/compare`), product detail pages, **spec sheet download** (`/api/products/:slug/spec`)
- **Buyer Portal** (`/portal`): **Firebase Google Sign-In** (user-provided `gumoti-tex` project), RFQ tracking by account email, Firestore mirroring of submissions, Firebase Analytics
- SEO: meta/OG, Organization JSON-LD, `/sitemap.xml`, `/robots.txt`

## Functional Entry URIs
| Method | Path | Params |
|---|---|---|
| GET | `/` `/about` `/capabilities` `/quality` `/sustainability` `/global-reach` `/facilities` `/news` `/contact` `/portal` `/privacy` `/terms` | — |
| GET | `/products` | `category, composition, construction, certification, search` |
| GET | `/products/:slug`, `/products/compare?items=a,b,c` | — |
| GET | `/careers?department=…`, `/careers/:slug` | — |
| GET | `/request-quote?product=…`, `/request-sample?product=…` | — |
| GET | `/api/products` | same filters, returns `{count, html}` |
| GET | `/api/products/:slug/spec` | spec sheet download |
| POST | `/api/rfq` | company_name*, contact_person*, email*, product*, quantity*, phone, country, unit, composition, gsm, color, delivery_date, target_price, requirements |
| GET | `/api/rfq?email=` | list RFQs for buyer email |
| POST | `/api/contact` | name*, email*, inquiry_type*, message*, company, phone, country |
| POST | `/api/sample` | product*, email*, shipping_address*, color, gsm, quantity, country, purpose, comments |
| POST | `/api/apply` | position*, name*, email*, phone*, experience*, linkedin, education, cover_letter |

## Data Architecture
- **D1 (SQLite)** — source of truth: `rfqs`, `contact_inquiries`, `sample_requests`, `job_applications`, `rate_limits` (see `migrations/0001_initial_schema.sql`)
- **Firebase** (`gumoti-tex` project): Google Authentication (buyer login), Firestore mirror of submissions linked to `uid`, Analytics
- **Single source of truth** for company facts: `src/data/company.ts` (Spec §60) — established 1993, BGMEA 2443, EPB 3311, MD Mohd. Akhter, verified certifications only
- **Data accuracy policy**: unverified figures rendered as *"Information to be confirmed by Gumti Textiles Ltd."*; product specs labeled as CMS-managed templates; no invented statistics, buyers or certificate metadata

## User Guide
1. **Buyers**: Browse `/products`, filter/compare, open a product → *Request Quote* → receive an `RFQ-GT-…` tracking ID. Sign in with Google at `/portal` to see all RFQs tied to your email.
2. **Admins/Ops**: RFQs, inquiries, samples & applications are stored in D1 (query with `npx wrangler d1 execute webapp-production --local --command "SELECT * FROM rfqs"`), mirrored to Firestore under the `gumoti-tex` Firebase project.
3. **Content**: Update company facts in `src/data/company.ts`, products in `src/data/products.ts`, jobs/news in `src/pages/careers-news.tsx`.

## Firebase Setup Notes
- Web config lives in `public/static/firebase-app.js` (public identifiers by design)
- **Action required in Firebase Console**: enable **Google** provider under Authentication → Sign-in method, and add the deployed domain(s) to **Authorized domains** (the sandbox URL and future `*.pages.dev` domain) for Google Sign-In popups to work
- Recommended Firestore security rules: allow `create` on `rfqs/contact_inquiries/sample_requests/job_applications` for authenticated users; `read` only where `resource.data.uid == request.auth.uid`

## Features Not Yet Implemented
- Admin dashboard UI (data model is in place; D1 queries work)
- Quotation lifecycle transitions (statuses defined: NEW → UNDER REVIEW → PRICING → QUOTATION SENT → …)
- Email notifications (needs a transactional email provider API key)
- File upload for tech packs (needs R2 bucket binding)
- Multilingual (EN/BN) architecture, AI textile assistant

## Recommended Next Steps
1. Deploy to Cloudflare Pages (`npm run deploy:prod`) + create production D1 (`npx wrangler d1 create webapp-production`, update `database_id`)
2. Add deployed domain to Firebase Authorized domains; publish Firestore security rules
3. Build the admin dashboard (RFQ pipeline board) on top of the existing D1 schema
4. Integrate transactional email (e.g., Resend) for RFQ confirmations
5. Replace CC/public-domain placeholder imagery with official Gumti factory photography

## Deployment
- **Platform**: Cloudflare Pages (Hono + Vite), D1 local mode for dev
- **Status**: ✅ Active in sandbox (PM2 + `wrangler pages dev`)
- **Tech Stack**: Hono · TypeScript · TailwindCSS (CDN) · Cloudflare D1 · Firebase Auth/Firestore/Analytics
- **Local dev**: `npm run build && npm run db:migrate:local && pm2 start ecosystem.config.cjs`
- **Last Updated**: 2026-08-28
