# Gumti Textiles Ltd. — Premium Corporate Website & B2B Platform

## Project Overview
- **Name**: Gumti Textiles Ltd. digital platform (`gumti-textiles`)
- **Goal**: Premium international B2B website for a Bangladesh knit-composite textile & apparel manufacturer — communicating verified capabilities, products, quality/compliance, and converting buyers through RFQ/sample/contact workflows.
- **Visual Direction**: Luxury fashion brand meets advanced industrial manufacturing. Deep Navy `#071A2B`, Midnight `#0B1117`, Warm Ivory `#F5F1E8`, Textile Sand `#C7B79C`, Fraunces + Inter typography, cinematic scroll and interaction system.

## URLs
- **Sandbox Preview**: https://3000-idbp683657jxjgetsoac1-b9b802c4.sandbox.novita.ai
- **GitHub**: https://github.com/BornilMahmud/gumoti-industry
- **Production**: not yet deployed (Cloudflare Pages ready)
- **Facebook**: https://www.facebook.com/gumtitextile

## Currently Completed Features
### Premium visual + motion upgrade
- New original Gumti Textiles SVG logo inspired by the provided reference style: roof/industrial skyline/thread/leaf motifs adapted to textiles (the reference image itself is not embedded as the header logo).
- New SVG favicon in the same Gumti-inspired visual language.
- Cinematic homepage hero with staged reveal timing, textile texture overlay, parallax-ready image depth, scroll indicator, magnetic CTAs and premium typography.
- Global motion tokens and easing system in `public/static/style.css` (`instant`, `fast`, `standard`, `cinematic`, `dramatic`; luxury/cinematic/expo easings).
- Normal native browser mouse/cursor restored across the website per latest request.
- Header auth visibility cleaned up: signed-in users no longer see Login/Register, and admin users see one controlled Admin link instead of duplicate `Admin Register Admin` navigation.
- Homepage hero contrast hardened with darker overlay and forced white/sand text so no black/low-contrast copy appears over factory imagery.
- Premium loader (~1 second), thin scroll progress bar, hide-on-scroll/reveal-on-up navigation, image mask reveals, blur-to-sharp text reveals, form focus animations and animated success states.
- Signature scroll-driven **Manufacturing Journey**: `FROM FIBER TO FINISHED GARMENT` with stage number/image/text/progress updates.
- Horizontal capabilities rail, editorial product cards, animated filter transitions, certification wall hover expansion, masked quality headline, dramatic final CTA and oversized footer wordmark.

### Public website
- Pages: `/`, `/about`, `/capabilities`, `/products`, `/products/:slug`, `/products/compare`, `/quality`, `/sustainability`, `/global-reach`, `/facilities`, `/careers`, `/careers/:slug`, `/news`, `/news/:slug`, `/contact`, `/portal`, `/login`, `/register`, `/admin`, `/privacy`, `/terms`.
- Animated Gumti-themed `/login` and `/register` pages inspired by the supplied split-card reference image, without directly using or embedding that image.
- Professional 404 / 500 error pages; sticky mobile Request-Quote CTA; full responsive design; reduced-motion support; skip links; keyboard-accessible navigation.

### B2B systems (real, connected — no fake functionality)
- **RFQ system** (`/request-quote` → `POST /api/rfq`): validation, honeypot, rate limiting, D1 storage, tracking IDs (`RFQ-GT-2026-XXXX`).
- **Sample requests** (`/request-sample` → `POST /api/sample`).
- **Contact inquiries** (`POST /api/contact`) and **Job applications** (`POST /api/apply`).
- **Product catalog**: instant filtering with URL query persistence, compare up to 3 products, product detail pages, spec sheet download (`/api/products/:slug/spec`).
- **Buyer Portal** (`/portal`): Firebase Auth (`gumoti-tex`) with Google Sign-In plus Email/Password login/register, RFQ tracking by account email, Firestore mirror writes, Firebase Analytics. Latest UI pass removes extra explanatory blocks for a cleaner professional workspace.
- SEO: meta/OG, Organization JSON-LD, `/sitemap.xml`, `/robots.txt`.

### GUMTI AI assistant
- Floating premium assistant button: **ASK GUMTI AI**.
- Quick actions: Find a Product, Find by GSM, Find by Material, Request Quote, Certification, Contact Sales.
- Retrieval is limited to verified product/company data from `src/data/products.ts` and `src/data/company.ts` via `GET /api/ai?q=`.
- Product recommendations render verified product data only and include `Source: Gumti Product Database`.
- Unknown or unverified requirements escalate with: “I don't have verified information for that requirement. Please contact our sales team.”
- No prices, MOQ, capacity, buyers, certificate numbers or export markets are fabricated.

### Admin panel
- `/admin` now renders a premium **Gumti Admin Control Center** instead of only raw tables.
- Admin API endpoint: `GET /api/admin/overview`.
- Authorization: Firebase ID token is verified server-side against the `gumoti-tex` project and checked against `ADMIN_EMAILS` in `src/index.tsx`.
- Current admin allowlist: `bornilmahmud56@gmail.com` and `bonrilmahmud56@gmail.com` (covers the email visible in the portal screenshot and the earlier requested spelling).
- Dashboard includes live D1 counts for RFQs, pending RFQs, contact inquiries, sample requests and job applications; verified product/category counts from the product database; recent activity from live records; and live record tables.
- Enterprise admin modules are visible in the correct industry structure: Business, Products, Manufacturing, Content/CMS, AI/Analytics and Governance. Modules that still need their own database/workflow are clearly marked as planned, avoiding fake numbers or fake functionality.
- Admin link is auth-aware: it appears for allowlisted signed-in admin users and is hidden from signed-out/non-admin visitors to prevent duplicated or confusing header labels. Email/password users can sign in at `/login`; Google users can sign in from `/admin`.

## Functional Entry URIs
| Method | Path | Params |
|---|---|---|
| GET | `/` `/about` `/capabilities` `/quality` `/sustainability` `/global-reach` `/facilities` `/news` `/contact` `/portal` `/login` `/register` `/admin` `/privacy` `/terms` | — |
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
1. In Firebase Console for project `gumoti-tex`, enable **Authentication → Sign-in method → Google** and **Email/Password**.
2. Add the sandbox/deployed domain to **Authentication → Settings → Authorized domains**.
3. Default admin is already set in `src/index.tsx`:
   ```ts
   const ADMIN_EMAILS = ['bornilmahmud56@gmail.com', 'bonrilmahmud56@gmail.com']
   ```
4. Open `/login` or `/admin` and sign in with `bornilmahmud56@gmail.com` (the email shown in the latest portal screenshot) or `bonrilmahmud56@gmail.com` (the earlier requested spelling).
5. Open `/admin`.
6. Click **Load / Refresh Admin Data** to view RFQs, contact inquiries, sample requests and job applications.

If the email is not allowlisted, the admin API returns `403 Admin access denied`.

## Firestore Rules
Copy-paste ready rules are committed in `firestore.rules`. These rules allow:
- signed-in users to create/read their own `users/{uid}` profile from `/register`, `/login`, or Google sign-in;
- signed-in users to create/read their own mirror documents in `rfqs`, `contact_inquiries`, `sample_requests`, and `job_applications`;
- everything else is denied by default.

Important: `firestore.rules` does **not** store data by itself. It only controls who may read/write Firestore. The website code in `public/static/firebase-app.js` performs the actual Firebase Auth and Firestore writes.

## What database saves the website data?
- **Cloudflare D1 is the primary operational database.** RFQ/contact/sample/job form submissions are first saved by the Hono backend into D1 so Gumti operations/admin can reliably view them in `/admin`.
- **Firestore is also initialized and used.** When a visitor is signed in with Firebase, the frontend mirrors their submissions into Firestore collections and saves user profiles at `users/{uid}`. This gives the buyer a Firebase-linked account record.
- **Admin reads currently come from D1**, protected by a verified Firebase ID token and the `ADMIN_EMAILS` server allowlist.

## Data Architecture
- **D1 (SQLite)** — operational source of truth: `rfqs`, `contact_inquiries`, `sample_requests`, `job_applications`, `rate_limits`.
- **Firebase** (`gumoti-tex` project): Google Authentication, Email/Password Authentication, Firestore user profiles + signed-in submission mirror, Analytics.
- **Single source of truth** for company facts: `src/data/company.ts`.
- **Product database**: `src/data/products.ts`.
- **Data accuracy policy**: unverified figures render as *“Information to be confirmed by Gumti Textiles Ltd.”*; product specs are CMS-managed templates; no invented statistics, buyers or certificate metadata.

## User Guide
1. **Buyers**: Browse `/products`, filter/compare, open a product → **Request Quote** → receive an `RFQ-GT-…` tracking ID. Sign in at `/login`, `/register`, or with Google to see RFQs tied to your email in `/portal`.
2. **Visitors**: Use **ASK GUMTI AI** for verified product search, GSM/material guidance, certification summaries and RFQ handoff.
3. **Admins/Ops**: Log in as `bornilmahmud56@gmail.com` or `bonrilmahmud56@gmail.com` at `/login` or `/admin` to view D1 records.
4. **Content editors/developers**: Update company facts in `src/data/company.ts`, products in `src/data/products.ts`, jobs/news in `src/pages/careers-news.tsx`.

## Enterprise Platform Upgrade (latest release)
### Enterprise RBAC (Firebase identity + D1 authority)
- 11 roles: `SUPER_ADMIN, ADMIN, SALES_MANAGER, SALES_EXECUTIVE, MERCHANDISING, PRODUCTION_MANAGER, QUALITY_MANAGER, HR_MANAGER, CONTENT_MANAGER, VIEWER, BUYER`.
- 38 granular permissions seeded in D1 (`roles`, `permissions`, `role_permissions`, `users`).
- Every protected API: Firebase ID token → signature verification → D1 user → role → permission → allow/deny. Frontend roles are never trusted.
- Super Admins can assign roles / disable users from the admin Users tab (self-lockout prevented).

### Fully functional Admin Control Center (`/admin` + `/static/admin.js`)
Animated tabbed workspace with detail drawer, count-up KPIs, staggered row reveals, live bar chart, status pills and toggles:
- **Dashboard** — live D1 KPIs, real RFQ funnel by status, recent activity, verification health.
- **RFQs** — full workflow (`NEW → UNDER_REVIEW → ASSIGNED → NEED_MORE_INFORMATION → PRICING → QUOTATION_SENT → CUSTOMER_REVIEW → APPROVED/REJECTED → CONVERTED_TO_ORDER`), status change dropdowns, RFQ detail drawer with animated status timeline (`rfq_status_events`), one-click quotation creation and order conversion.
- **Quotations** — create with multi-line items (auto totals), draft → send → buyer accepts/rejects, document download, RFQ status sync.
- **Samples** — workflow `REQUESTED → REVIEWED → APPROVED → IN_PROGRESS → DISPATCHED → DELIVERED → COMPLETED` with `sample_status_events`.
- **Orders** — pipeline `CONFIRMED → MATERIAL_PLANNING → PRODUCTION → QUALITY → PACKING → SHIPMENT → DELIVERED`, animated stage track and production timeline (`order_status_events`), CRM auto-upsert.
- **Customers (CRM)** — profiles with full RFQ / quotation / sample / order history per company.
- **Verification Center** — verified metrics registry (value, unit, year, source, status: `VERIFIED / PENDING_VERIFICATION / NEEDS_REVIEW / EXPIRED`), publish toggle; only VERIFIED+published values reach the public site.
- **Export Markets** — country/region/products with verification + publish control. Until verified, the site shows “Serving international markets from Bangladesh.”
- **Users & Roles**, **Audit Logs** (actor, action, old→new values, timestamp), **AI Analytics** (query text + matched flag only, no personal data).

### Upgraded Buyer Portal (`/portal`)
- Token-verified `/api/portal/me` — buyers only ever see records tied to their own signed-in email (buyer isolation; the old `?email=` query is closed).
- Animated stats, tabs for RFQs / Quotations / Samples / Orders, and per-record animated status progress timelines.
- Buyers can Accept/Reject sent quotations (`POST /api/portal/quotations/:id/decision`), which also updates the linked RFQ.

### Public site data connections
- `/sustainability` and `/global-reach` now render VERIFIED+published D1 rows (`verified_metrics`, `export_markets`); pending values remain clearly marked.
- `GET /api/public/verified` exposes only verified public data.
- GUMTI AI: added Explore Capabilities + Request Sample quick actions, capability answers, View Product buttons and conversation analytics logging.

### New admin API surface (`/api/admin/*`, all RBAC-guarded)
`GET /overview` · `GET/PATCH /rfqs/:id(/status)` · `PATCH /samples/:id/status` · `POST/GET/PATCH /quotations…` + `/document` · `POST/GET/PATCH /orders…` · `GET/POST /customers…` · `GET/POST/PATCH/DELETE /metrics…` · `GET/POST/PATCH/DELETE /markets…` · `GET/PATCH /users…` · `GET /audit` · `GET /ai-analytics`

## Features Not Yet Implemented
- Writable admin workflows for product CRUD, categories, quotations, customers/CRM, orders, production stages, quality inspections, certifications, sustainability metrics, media library, CMS editing, AI controls, search tuning, notifications, users/roles, audit logs, global settings and verification workflow.
- Admin status update controls and quotation pipeline actions beyond read-only overview.
- Email notifications (requires transactional email provider API key).
- File uploads for tech packs/media/certificates (requires R2 bucket binding).
- Multilingual EN/BN content system.

## Master Next-Step Prompt
- A deployment-focused master prompt has been created at `GUMTI_MASTER_PROJECT_NEXT_PROMPT.txt`.
- It documents what has been completed, what remains for a complete industry-level master project, deployment QA, security requirements and the next recommended implementation milestone.

## Recommended Next Steps
1. Replace CC/public-domain placeholder imagery with official Gumti factory/product photography.
2. Add the production domain to Firebase Authorized Domains.
3. Keep `ADMIN_EMAILS` updated with the real Gumti admin Firebase emails.
4. Deploy Firestore rules from `firestore.rules` in Firebase Console and enable Email/Password auth if using `/register`.
5. Add email notifications and tech-pack uploads when API keys/R2 are available.

## Deployment
- **Platform**: Cloudflare Pages (Hono + Vite), D1 local mode for development.
- **Status**: Active in sandbox (PM2 + `wrangler pages dev`).
- **Tech Stack**: Hono · TypeScript · TailwindCSS (CDN) · Cloudflare D1 · Firebase Auth/Firestore/Analytics.
- **Local dev**: `npm run build && npm run db:migrate:local && pm2 start ecosystem.config.cjs`.
- **Last Updated**: 2026-08-28.
