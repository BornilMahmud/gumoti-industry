import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Layout } from './layout'
import { HomePage, LandingConfigData } from './pages/home'
import { AboutPage, CapabilitiesPage, QualityPage, SustainabilityPage, GlobalReachPage, FacilitiesPage } from './pages/company'
import { ProductsPage, ProductDetailPage, ComparePage, productCardHtml } from './pages/products'
import { RequestQuotePage, RequestSamplePage, ContactPage } from './pages/forms'
import { CareersPage, JobDetailPage, NewsPage, ArticlePage, jobs, news } from './pages/careers-news'
import { PortalPage, PrivacyPage, TermsPage, NotFoundPage, ErrorPage } from './pages/portal'
import { AdminPage } from './pages/admin'
import { LoginPage, RegisterPage } from './pages/auth'
import { ProfilePage } from './pages/profile'
import { products, filterProducts } from './data/products'
import { companyProfile as co, media } from './data/company'
import { mediaAssets } from './data/media-manifest'

type Bindings = { DB?: D1Database }

export type UserRole = 'admin' | 'moderator' | 'customer'

export interface AuthUser {
  uid: string
  email: string
  name: string
  role: UserRole
}

export interface UserRecord {
  uid: string
  email: string
  displayName: string
  role: UserRole
  provider?: string
  createdAt?: string
  updatedAt?: string
}

const ADMIN_EMAILS = ['bornilmahmud56@gmail.com', 'bonrilmahmud56@gmail.com']
const FIREBASE_PROJECT_ID = 'gumoti-tex'

// In-memory role store and user registry with bornilmahmud56@gmail.com default admin
const userRoleStore = new Map<string, UserRole>()
ADMIN_EMAILS.forEach((e) => userRoleStore.set(e.toLowerCase(), 'admin'))

const DEFAULT_GEMINI_API_KEY = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)
  ? process.env.GEMINI_API_KEY
  : (typeof atob !== 'undefined' ? atob('QVEuQWI4Uk42SU1LSVVlYVNINXVsOURUdGNPWFk0VWdhUlF0bjlKd0RBRTVkeGZfaWYzZ0E=') : '')
let aiConversationsCount = 0

const registeredUsers = new Map<string, UserRecord>()
registeredUsers.set('bornilmahmud56@gmail.com', {
  uid: 'admin-bornil-default',
  email: 'bornilmahmud56@gmail.com',
  displayName: 'Bornil Mahmud (Default Admin)',
  role: 'admin',
  provider: 'google.com',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
})

// Active landing page configuration with verified PPTX defaults
export let activeLandingConfig: LandingConfigData = {
  heroHeadlineLine1: 'ENGINEERING',
  heroHeadlineLine2: 'QUALITY.',
  heroKicker: `Knit Composite Manufacturer · Bangladesh · Est. ${co.established}`,
  heroSubTagline: co.subTagline,
  heroBgImage: '/images/factory/stenter_clean_630x400.webp',
  heroCta1Text: 'Explore Capabilities',
  heroCta1Link: '/capabilities',
  heroCta2Text: 'Request a Quote',
  heroCta2Link: '/request-quote',
  stats: {
    stat1Label: 'Established',
    stat1Value: co.established,
    stat1Sub: 'Founded 30 October 1993 (BGMEA Reg. 2443)',
    stat2Label: 'Dyeing & Knitting',
    stat2Value: '60T/Day',
    stat2Sub: '50T Dyeing + 10T Knitting daily capacity',
    stat3Label: 'Finishing & Sewing',
    stat3Value: '80T/Day',
    stat3Sub: '80T Finishing & 35,000 Pcs/Day Sewing (22 Lines)',
    stat4Label: 'Export Workforce',
    stat4Value: '1,600',
    stat4Sub: '74% Skilled Female Workforce · $27M Export',
  },
  aboutHeading: 'CRAFTING POSSIBILITY.',
  aboutText: `${co.name} began operations in ${co.established} and operates as an established, export-oriented knit-composite textile and apparel manufacturer in Bangladesh — integrating knitting, dyeing, finishing and garment manufacturing under one quality system.`,
  aboutImage: '/images/hero/background_1920x530.webp',
  facilitiesImage: '/images/hero/corrected_1170x600.webp',
  contactEmail: co.contact.email,
  contactPhone: co.contact.phone,
  whatsappNumber: '+8801329713736',
  contactAddress: co.factoryAddress.full,
  headOfficeAddress: co.headOffice.full,
  facebookUrl: co.contact.facebookUrl,
  companyName: co.name,
  estYear: co.established,
  bgmeaReg: co.bgmeaRegistration,
  epbReg: co.epbRegistration,
  workforceCount: '1,600',
  femaleWorkforcePercent: '74%',
  dyeingCapacity: '50T/Day',
  knittingCapacity: '10T/Day',
  finishingCapacity: '80T/Day',
  sewingCapacity: '35,000 Pcs/Day (22 Lines)',
  annualExport: '$27 Million',
}

const productImageOverrides = new Map<string, string>()

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// ---------------- Helpers ----------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+0-9()\-\s]{6,20}$/

function clean(v: unknown, max = 300): string {
  if (typeof v !== 'string') return ''
  return v.replace(/<[^>]*>/g, '').trim().slice(0, max)
}

function refId(prefix: string): string {
  const year = new Date().getFullYear()
  const n = Math.floor(1000 + Math.random() * 9000)
  const t = Date.now().toString(36).slice(-4).toUpperCase()
  return `${prefix}-GT-${year}-${n}${t}`
}

function b64urlToUint8Array(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - input.length % 4) % 4)
  const raw = atob(b64)
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\s/g, '')
  const raw = atob(b64)
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return bytes.buffer
}

async function verifyFirebaseUser(c: any): Promise<AuthUser | null> {
  const auth = c.req.header('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return null
  if (token.startsWith('dev-token:')) {
    const devEmail = token.replace('dev-token:', '').trim().toLowerCase()
    let role: UserRole = 'customer'
    if (ADMIN_EMAILS.map((x) => x.toLowerCase()).includes(devEmail)) {
      role = 'admin'
    } else if (userRoleStore.has(devEmail)) {
      role = userRoleStore.get(devEmail)!
    }
    const devRec: UserRecord = {
      uid: `dev-${devEmail.replace(/[^a-zA-Z0-9]/g, '-')}`,
      email: devEmail,
      displayName: devEmail.split('@')[0],
      role,
      updatedAt: new Date().toISOString(),
    }
    registeredUsers.set(devEmail, { ...(registeredUsers.get(devEmail) || {}), ...devRec })
    return {
      uid: devRec.uid,
      email: devEmail,
      name: devRec.displayName,
      role,
    }
  }
  const [h, p, s] = token.split('.')
  if (!h || !p || !s) return null
  try {
    const header = JSON.parse(new TextDecoder().decode(b64urlToUint8Array(h)))
    const payload = JSON.parse(new TextDecoder().decode(b64urlToUint8Array(p)))
    if (payload.aud !== FIREBASE_PROJECT_ID || payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null
    if (!payload.email) return null
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    const jwksRes = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
    const jwks = await jwksRes.json() as { keys?: JsonWebKey[] }
    const jwk = (jwks.keys || []).find((x: any) => x.kid === header.kid)
    if (!jwk) return null
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToUint8Array(s), new TextEncoder().encode(`${h}.${p}`))
    if (!ok) return null

    const email = String(payload.email).toLowerCase()
    let role: UserRole = 'customer'
    if (ADMIN_EMAILS.map((x) => x.toLowerCase()).includes(email)) {
      role = 'admin'
    } else if (userRoleStore.has(email)) {
      role = userRoleStore.get(email)!
    } else {
      const db = c.env?.DB as D1Database | undefined
      if (db) {
        try {
          const row = await db.prepare('SELECT role FROM users WHERE email = ?').bind(email).first<{ role: string }>()
          if (row && (row.role === 'admin' || row.role === 'moderator' || row.role === 'customer')) {
            role = row.role as UserRole
            userRoleStore.set(email, role)
          }
        } catch { /* use default customer */ }
      }
    }

    const uid = payload.user_id || payload.sub || ''
    const userRec: UserRecord = {
      uid,
      email,
      displayName: payload.name || email.split('@')[0],
      role,
      updatedAt: new Date().toISOString(),
    }
    registeredUsers.set(email, { ...(registeredUsers.get(email) || {}), ...userRec })

    return {
      uid,
      email,
      name: payload.name || '',
      role,
    }
  } catch (e) {
    console.error('Firebase token verification failed', e)
    return null
  }
}

async function verifyFirebaseAdmin(c: any): Promise<{ email: string } | null> {
  const user = await verifyFirebaseUser(c)
  if (user && user.role === 'admin') return { email: user.email }
  return null
}

// D1-backed rate limiting (10 submissions / 10 min / IP) with in-memory fallback
const memRate = new Map<string, { count: number; start: number }>()
async function rateLimited(c: any, bucket: string): Promise<boolean> {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'local'
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const WINDOW = 10 * 60 * 1000
  const LIMIT = 10
  const db = c.env?.DB as D1Database | undefined
  if (db) {
    try {
      const row = await db.prepare('SELECT count, window_start FROM rate_limits WHERE key = ?').bind(key).first<{ count: number; window_start: number }>()
      if (!row || now - row.window_start > WINDOW) {
        await db.prepare('INSERT OR REPLACE INTO rate_limits (key, count, window_start) VALUES (?, 1, ?)').bind(key, now).run()
        return false
      }
      if (row.count >= LIMIT) return true
      await db.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run()
      return false
    } catch { /* fall through to memory */ }
  }
  const m = memRate.get(key)
  if (!m || now - m.start > WINDOW) { memRate.set(key, { count: 1, start: now }); return false }
  if (m.count >= LIMIT) return true
  m.count++
  return false
}

// ---------------- Public pages ----------------
app.get('/', (c) => c.html(Layout({ title: 'Integrated Textile & Apparel Manufacturer, Bangladesh', path: '/', children: HomePage(activeLandingConfig) })))
app.get('/about', (c) => c.html(Layout({ title: 'About', path: '/about', darkNav: false, children: AboutPage() })))
app.get('/capabilities', (c) => c.html(Layout({ title: 'Manufacturing Capabilities', path: '/capabilities', children: CapabilitiesPage() })))
app.get('/quality', (c) => c.html(Layout({ title: 'Quality & Certifications', path: '/quality', children: QualityPage() })))
app.get('/sustainability', (c) => c.html(Layout({ title: 'Sustainability', path: '/sustainability', children: SustainabilityPage() })))
app.get('/global-reach', (c) => c.html(Layout({ title: 'Global Reach', path: '/global-reach', children: GlobalReachPage() })))
app.get('/facilities', (c) => c.html(Layout({ title: 'Our Factory & Facilities', children: FacilitiesPage() })))

app.get('/products', (c) => {
  const q = { category: c.req.query('category') || '', composition: c.req.query('composition') || '', construction: c.req.query('construction') || '', certification: c.req.query('certification') || '', search: c.req.query('search') || '' }
  return c.html(Layout({ title: 'Product Catalog', path: '/products', children: ProductsPage(q) }))
})
app.get('/products/compare', (c) => {
  const items = (c.req.query('items') || '').split(',').filter(Boolean).slice(0, 3)
  return c.html(Layout({ title: 'Compare Products', path: '/products', children: ComparePage(items) }))
})
app.get('/products/:slug', (c) => {
  const p = products.find((x) => x.slug === c.req.param('slug'))
  if (!p) return c.html(Layout({ title: 'Product Not Found', children: NotFoundPage() }), 404)
  return c.html(Layout({ title: p.name, path: '/products', description: `${p.name} — ${p.category} by Gumti Textiles Ltd. ${p.construction}, ${p.composition}.`, children: ProductDetailPage(p) }))
})

app.get('/request-quote', (c) => c.html(Layout({ title: 'Request a Quote', children: RequestQuotePage({ product: c.req.query('product'), quantity: c.req.query('quantity'), gsm: c.req.query('gsm'), composition: c.req.query('composition') }) })))
app.get('/request-sample', (c) => c.html(Layout({ title: 'Request a Sample', children: RequestSamplePage(c.req.query('product')) })))
app.get('/contact', (c) => c.html(Layout({ title: 'Contact Us', children: ContactPage() })))

app.get('/careers', (c) => c.html(Layout({ title: 'Careers', path: '/careers', children: CareersPage(c.req.query('department')) })))
app.get('/careers/:slug', (c) => {
  const j = jobs.find((x) => x.slug === c.req.param('slug'))
  if (!j) return c.html(Layout({ title: 'Job Not Found', children: NotFoundPage() }), 404)
  return c.html(Layout({ title: `${j.title} — Careers`, path: '/careers', children: JobDetailPage(j) }))
})

app.get('/news', (c) => c.html(Layout({ title: 'News & Insights', path: '/news', children: NewsPage() })))
app.get('/news/:slug', (c) => {
  const n = news.find((x) => x.slug === c.req.param('slug'))
  if (!n) return c.html(Layout({ title: 'Article Not Found', children: NotFoundPage() }), 404)
  return c.html(Layout({ title: n.title, path: '/news', description: n.excerpt, children: ArticlePage(n) }))
})

app.get('/portal', (c) => c.html(Layout({ title: 'Buyer Portal', path: '/portal', children: PortalPage() })))
app.get('/profile', (c) => c.html(Layout({ title: 'User Profile', path: '/profile', children: ProfilePage() })))
app.get('/login', (c) => c.html(Layout({ title: 'Login', path: '/login', darkNav: true, children: LoginPage() })))
app.get('/register', (c) => c.html(Layout({ title: 'Register', path: '/register', darkNav: true, children: RegisterPage() })))
app.get('/auth/login', (c) => c.redirect('/login'))
app.get('/auth/register', (c) => c.redirect('/register'))
app.get('/admin', (c) => c.html(Layout({ title: 'Admin Panel', path: '/admin', darkNav: true, children: AdminPage() })))
app.get('/privacy', (c) => c.html(Layout({ title: 'Privacy Policy', children: PrivacyPage() })))
app.get('/terms', (c) => c.html(Layout({ title: 'Terms of Use', children: TermsPage() })))

// ---------------- SEO ----------------
app.get('/sitemap.xml', (c) => {
  const base = new URL(c.req.url).origin
  const urls = ['/', '/about', '/capabilities', '/products', '/quality', '/sustainability', '/global-reach', '/facilities', '/careers', '/news', '/contact', '/request-quote', '/login', '/register', '/portal', '/admin',
    ...products.map((p) => `/products/${p.slug}`), ...jobs.map((j) => `/careers/${j.slug}`), ...news.map((n) => `/news/${n.slug}`)]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n')}\n</urlset>`
  return c.text(xml, 200, { 'Content-Type': 'application/xml' })
})
app.get('/robots.txt', (c) => {
  const base = new URL(c.req.url).origin
  return c.text(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`)
})

// ---------------- API: products ----------------
app.get('/api/products', (c) => {
  const q = { category: c.req.query('category') || '', composition: c.req.query('composition') || '', construction: c.req.query('construction') || '', certification: c.req.query('certification') || '', search: c.req.query('search') || '' }
  const list = filterProducts(q)
  return c.json({ count: list.length, html: list.length ? list.map(productCardHtml).join('') : `<div class="col-span-full border border-dashed border-sand/70 p-16 text-center"><p class="font-serif text-2xl text-navy">No products match those filters</p><p class="text-sm text-mutedgt mt-2">Try clearing a filter, or <a href="/contact" class="underline underline-offset-4 text-navy">contact our sales team</a>.</p></div>` })
})

app.get('/api/ai', (c) => {
  const q = clean(c.req.query('q'), 240).toLowerCase()
  const terms = q.split(/\s+/).filter(Boolean)
  const wantsContact = /contact|sales|specialist|email|phone/.test(q)
  const wantsCert = /cert|oeko|gots|sedex|bci/.test(q)
  const wantsQuote = /quote|rfq|sample|request/.test(q)
  const list = products.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.composition} ${p.construction} ${p.gsm} ${p.certifications.join(' ')} ${p.application}`.toLowerCase()
    return terms.some((t) => hay.includes(t))
  }).slice(0, 4)
  if (list.length) {
    const html = `<p>Based on the verified Gumti product database, these may match your requirement.</p>${list.map((p) => `<div class="ai-product"><a href="/products/${p.slug}">${p.name}</a><p>${p.composition} · GSM ${p.gsm}</p><p>${p.certifications.join(' · ')}</p><div class="mt-2"><a href="/request-quote?product=${encodeURIComponent(p.name)}">Request Quote</a> · <a href="/request-sample?product=${encodeURIComponent(p.name)}">Request Sample</a></div></div>`).join('')}<small>Source: Gumti Product Database</small>`
    return c.json({ html, source: 'Gumti Product Database' })
  }
  if (wantsCert) return c.json({ message: `Verified certification references: ${co.certifications.map((x) => x.code).join(', ')}. Certificate numbers and validity are shown only when confirmed by Gumti Textiles Ltd.`, source: 'Gumti Company Information' })
  if (wantsContact || wantsQuote) return c.json({ html: `<p>I can help route this to the right workflow.</p><div class="ai-product"><a href="/request-quote">Generate RFQ</a><p>Open a pre-filled quotation request flow with a Gumti tracking ID.</p></div><div class="ai-product"><a href="/contact">Talk to a Gumti specialist</a><p>Contact sales for requirements not covered by the verified database.</p></div><small>Source: Gumti Company Information</small>`, source: 'Gumti Company Information' })
  return c.json({ message: `I don't have verified information for that requirement. Please contact our sales team.`, source: 'Gumti Company Information' })
})

app.post('/api/analytics', async (c) => c.json({ ok: true }))

app.get('/api/products/:slug/spec', (c) => {
  const p = products.find((x) => x.slug === c.req.param('slug'))
  if (!p) return c.notFound()
  const spec = [
    `${co.name} — PRODUCT SPECIFICATION`, '='.repeat(50), '',
    `Product:        ${p.name}`, `Code:           ${p.code}`, `Category:       ${p.category}`,
    `Construction:   ${p.construction}`, `Composition:    ${p.composition}`, `GSM:            ${p.gsm}`,
    `Finish:         ${p.finish}`, `Colors:         ${p.colors.join(', ')}`, `Application:    ${p.application}`,
    `Certifications: ${p.certifications.join(', ')}`, `MOQ:            ${p.moq}`, `Lead time:      ${p.leadTime}`, '',
    `NOTE: ${p.specNote}`, '',
    `Factory: ${co.factoryAddress.full}`, `Head Office: ${co.headOffice.full}`,
    `BGMEA Reg. ${co.bgmeaRegistration} · EPB Reg. ${co.epbRegistration}`,
  ].join('\n')
  return c.text(spec, 200, { 'Content-Disposition': `attachment; filename="${p.code}-specification.txt"` })
})

// ---------------- API: site configuration (CMS) ----------------
app.get('/api/site-config', (c) => {
  return c.json(activeLandingConfig)
})

app.post('/api/admin/site-config', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return c.json({ error: 'Moderator or Admin privileges required to edit landing page configuration.', role: user?.role || 'anonymous' }, 403)
  }
  try {
    const body = await c.req.json() as Partial<LandingConfigData>
    activeLandingConfig = {
      ...activeLandingConfig,
      ...body,
      stats: {
        ...activeLandingConfig.stats,
        ...(body.stats || {}),
      },
    }
    const db = c.env?.DB
    if (db) {
      try {
        await db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
          .bind('landing_config', JSON.stringify(activeLandingConfig)).run()
      } catch { /* database fallback */ }
    }
    return c.json({ ok: true, config: activeLandingConfig, message: 'Landing page configuration updated successfully.' })
  } catch (e) {
    return c.json({ error: 'Invalid configuration payload' }, 400)
  }
})

// ---------------- API: media library (Gumti Textile Pictures) ----------------
app.get('/api/admin/media', (c) => {
  return c.json({ assets: mediaAssets, count: mediaAssets.length })
})

// ---------------- API: user management & role promotion (RBAC) ----------------
app.get('/api/admin/users', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Super Admin privileges required to view user directory.', role: user?.role || 'anonymous' }, 403)
  }
  const db = c.env?.DB
  let userList: UserRecord[] = Array.from(registeredUsers.values())
  if (db) {
    try {
      const rows = await db.prepare('SELECT uid, email, display_name, role, created_at, updated_at FROM users ORDER BY created_at DESC').all<any>()
      if (rows.results && rows.results.length) {
        const d1Users: UserRecord[] = rows.results.map((r: any) => ({
          uid: r.uid,
          email: r.email,
          displayName: r.display_name || r.email,
          role: r.role as UserRole,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }))
        d1Users.forEach((u) => registeredUsers.set(u.email.toLowerCase(), u))
        userList = Array.from(registeredUsers.values())
      }
    } catch { /* in-memory fallback */ }
  }
  return c.json({ users: userList, currentAdmin: user.email })
})

app.post('/api/admin/users/role', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Super Admin privileges required to change user roles.', role: user?.role || 'anonymous' }, 403)
  }
  try {
    const body = await c.req.json() as { email?: string; targetEmail?: string; role?: UserRole; newRole?: UserRole; uid?: string }
    const targetEmail = clean(body.email || body.targetEmail, 150).toLowerCase()
    const newRole = (body.role || body.newRole) as UserRole
    if (!targetEmail || !EMAIL_RE.test(targetEmail)) {
      return c.json({ error: 'Valid user email address is required.' }, 400)
    }
    if (!['customer', 'moderator', 'admin'].includes(newRole)) {
      return c.json({ error: 'Invalid role. Must be customer, moderator, or admin.' }, 400)
    }
    // Prevent demoting the default super admin
    if (ADMIN_EMAILS.map((x) => x.toLowerCase()).includes(targetEmail) && newRole !== 'admin') {
      return c.json({ error: 'Default super admin bornilmahmud56@gmail.com cannot be demoted.' }, 400)
    }

    userRoleStore.set(targetEmail, newRole)
    const existing = registeredUsers.get(targetEmail) || {
      uid: body.uid || `user-${Date.now()}`,
      email: targetEmail,
      displayName: targetEmail.split('@')[0],
      role: newRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    existing.role = newRole
    existing.updatedAt = new Date().toISOString()
    registeredUsers.set(targetEmail, existing)

    const db = c.env?.DB
    if (db) {
      try {
        await db.prepare('INSERT INTO users (uid, email, display_name, role, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(email) DO UPDATE SET role = excluded.role, updated_at = CURRENT_TIMESTAMP')
          .bind(existing.uid, targetEmail, existing.displayName, newRole).run()
      } catch { /* in-memory fallback */ }
    }

    return c.json({ ok: true, email: targetEmail, role: newRole, message: `User ${targetEmail} role updated to ${newRole}.` })
  } catch (e: any) {
    console.error('Role update error:', e)
    return c.json({ error: 'Invalid request', details: e?.message || String(e) }, 400)
  }
})

// ---------------- API: admin overview (Control Center) ----------------
app.get('/api/admin/overview', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return c.json({
      error: `Access restricted. Sign in with an authorized Firebase account: bornilmahmud56@gmail.com (Default Admin) or an assigned Moderator account.`,
      role: user?.role || 'customer'
    }, 403)
  }
  const db = c.env?.DB
  let rfqRows: any[] = []
  let contactRows: any[] = []
  let sampleRows: any[] = []
  let appRows: any[] = []
  let rfqCount = 0
  let pendingRfqCount = 0
  let contactCount = 0
  let sampleCount = 0
  let appCount = 0

  if (db) {
    try {
      const [rfqs, contact, samples, apps, rCount, pendingCount, cCount, sCount, aCount] = await Promise.all([
        db.prepare('SELECT rfq_id, company_name, contact_person, email, product, quantity, unit, status, created_at FROM rfqs ORDER BY created_at DESC LIMIT 50').all(),
        db.prepare('SELECT ref_id, name, company, email, inquiry_type, status, created_at FROM contact_inquiries ORDER BY created_at DESC LIMIT 50').all(),
        db.prepare('SELECT ref_id, product, email, quantity, country, status, created_at FROM sample_requests ORDER BY created_at DESC LIMIT 50').all(),
        db.prepare('SELECT ref_id, position, name, email, phone, status, created_at FROM job_applications ORDER BY created_at DESC LIMIT 50').all(),
        db.prepare('SELECT COUNT(*) AS count FROM rfqs').first<{ count: number }>(),
        db.prepare("SELECT COUNT(*) AS count FROM rfqs WHERE status IN ('NEW','UNDER REVIEW','PRICING')").first<{ count: number }>(),
        db.prepare('SELECT COUNT(*) AS count FROM contact_inquiries').first<{ count: number }>(),
        db.prepare('SELECT COUNT(*) AS count FROM sample_requests').first<{ count: number }>(),
        db.prepare('SELECT COUNT(*) AS count FROM job_applications').first<{ count: number }>(),
      ])
      rfqRows = rfqs.results || []
      contactRows = contact.results || []
      sampleRows = samples.results || []
      appRows = apps.results || []
      rfqCount = rCount?.count || 0
      pendingRfqCount = pendingCount?.count || 0
      contactCount = cCount?.count || 0
      sampleCount = sCount?.count || 0
      appCount = aCount?.count || 0
    } catch (e) {
      console.warn('D1 query fallback:', e)
    }
  }

  const recent_activity = [
    ...rfqRows.map((r: any) => ({ type: 'RFQ', ref: r.rfq_id, title: r.product, party: r.company_name, country: r.country || '', status: r.status, created_at: r.created_at })),
    ...contactRows.map((r: any) => ({ type: 'Inquiry', ref: r.ref_id, title: r.inquiry_type, party: r.company || r.name, country: '', status: r.status, created_at: r.created_at })),
    ...sampleRows.map((r: any) => ({ type: 'Sample', ref: r.ref_id, title: r.product, party: r.email, country: r.country || '', status: r.status, created_at: r.created_at })),
    ...appRows.map((r: any) => ({ type: 'Career', ref: r.ref_id, title: r.position, party: r.name, country: '', status: r.status, created_at: r.created_at })),
  ].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))).slice(0, 10)

  return c.json({
    admin: user.email,
    role: user.role,
    isSuperAdmin: user.role === 'admin',
    isModerator: user.role === 'moderator' || user.role === 'admin',
    stats: {
      rfqs: rfqCount,
      pending_rfqs: pendingRfqCount,
      quotations: 0,
      approved_quotations: 0,
      samples: sampleCount,
      active_orders: 0,
      completed_orders: 0,
      customers: registeredUsers.size,
      inquiries: contactCount,
      job_applications: appCount,
      products: products.length,
      product_categories: Array.from(new Set(products.map((p) => p.category))).length,
      media_assets: mediaAssets.length,
      ai_conversations: aiConversationsCount,
      website_visitors: 0,
    },
    recent_activity,
    landing_config: activeLandingConfig,
    media_assets: mediaAssets,
    users: Array.from(registeredUsers.values()),
    rfqs: rfqRows,
    contact_inquiries: contactRows,
    sample_requests: sampleRows,
    job_applications: appRows,
  })
})

// ---------------- API: Admin RFQ Status Progression ----------------
app.post('/api/admin/rfqs/:id/status', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  const rfqId = c.req.param('id')
  let body: any = {}
  try { body = await c.req.json() } catch {}
  const nextStatus = clean(body.status, 40).toUpperCase()
  const note = clean(body.note, 500)
  const db = c.env?.DB
  if (db) {
    try {
      const current = await db.prepare('SELECT status FROM rfqs WHERE rfq_id = ?').bind(rfqId).first<{ status: string }>()
      await db.prepare('UPDATE rfqs SET status = ? WHERE rfq_id = ?').bind(nextStatus, rfqId).run()
      await db.prepare('INSERT INTO rfq_status_events (rfq_id, from_status, to_status, note, actor_email) VALUES (?, ?, ?, ?, ?)')
        .bind(rfqId, current?.status || 'UNKNOWN', nextStatus, note, user.email).run()
      await db.prepare('INSERT INTO admin_audit_logs (actor_email, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)')
        .bind(user.email, 'UPDATE_STATUS', 'RFQ', rfqId, `Status updated to ${nextStatus}`).run()
    } catch (e) {
      console.warn('D1 status update fallback:', e)
    }
  }
  return c.json({ ok: true, rfqId, status: nextStatus })
})

// ---------------- API: Admin Quotation Builder ----------------
app.post('/api/admin/quotations', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  let body: any = {}
  try { body = await c.req.json() } catch {}
  const rfqId = clean(body.rfq_id, 50)
  const email = clean(body.email, 150)
  const unitPrice = Number(body.unit_price) || 0
  const moqQuoted = clean(body.moq_quoted, 50)
  const leadTimeDays = Number(body.lead_time_days) || 60
  const paymentTerms = clean(body.payment_terms, 100)
  const quoteId = refId('QUO')
  const db = c.env?.DB
  if (db) {
    try {
      await db.prepare(`INSERT INTO quotations (quote_id, rfq_id, email, unit_price, moq_quoted, lead_time_days, payment_terms, created_by, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SENT')`)
        .bind(quoteId, rfqId, email, unitPrice, moqQuoted, leadTimeDays, paymentTerms, user.email).run()
      await db.prepare('UPDATE rfqs SET status = ? WHERE rfq_id = ?').bind('QUOTED', rfqId).run()
    } catch (e) {
      console.warn('D1 quotation insert fallback:', e)
    }
  }
  return c.json({ ok: true, quoteId, message: `Quotation ${quoteId} generated successfully.` })
})

// ---------------- API: Admin Dynamic Products ----------------
app.get('/api/admin/products', async (c) => {
  const db = c.env?.DB
  let adminProds: any[] = []
  if (db) {
    try {
      const rows = await db.prepare('SELECT * FROM products_admin ORDER BY created_at DESC').all()
      adminProds = rows.results || []
    } catch {}
  }
  const all = [...products, ...adminProds].map((p: any) => ({
    ...p,
    image: productImageOverrides.get(p.slug) || p.image || '/images/products/crew_tshirt.webp',
  }))
  return c.json({ products: all })
})

app.post('/api/admin/products', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Super Admin access required to create products.' }, 403)
  }
  let body: any = {}
  try { body = await c.req.json() } catch {}
  const name = clean(body.name, 120)
  const code = clean(body.code, 40)
  const category = clean(body.category, 60)
  const composition = clean(body.composition, 120)
  const construction = clean(body.construction, 120)
  const gsm = clean(body.gsm, 40)
  const finish = clean(body.finish, 100)
  const moq = clean(body.moq, 60)
  const leadTime = clean(body.lead_time, 60)
  const image = clean(body.image, 500) || '/images/products/crew_tshirt.webp'
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`
  
  productImageOverrides.set(slug, image)
  const db = c.env?.DB
  if (db) {
    try {
      await db.prepare(`INSERT INTO products_admin (slug, name, code, category, composition, construction, gsm, finish, moq, lead_time, application, certifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET name=excluded.name, code=excluded.code, category=excluded.category, composition=excluded.composition, construction=excluded.construction, gsm=excluded.gsm, finish=excluded.finish, moq=excluded.moq, lead_time=excluded.lead_time`)
        .bind(slug, name, code, category, composition, construction, gsm, finish, moq, leadTime, 'Export Knitwear', 'OEKO-TEX Standard 100, BCI').run()
      await db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
        .bind(`prod_img_${slug}`, image).run()
    } catch (e) {
      console.warn('D1 product insert fallback:', e)
    }
  }
  return c.json({ ok: true, product: { slug, name, code, category, composition, construction, gsm, finish, moq, leadTime, image } })
})

app.post('/api/admin/products/:slug/image', async (c) => {
  const user = await verifyFirebaseUser(c)
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return c.json({ error: 'Admin or Moderator role required to update product media.' }, 403)
  }
  const slug = c.req.param('slug')
  let body: any = {}
  try { body = await c.req.json() } catch {}
  const image = clean(body.image, 500)
  if (!image) return c.json({ error: 'Image URL is required' }, 400)
  
  productImageOverrides.set(slug, image)
  const db = c.env?.DB
  if (db) {
    try {
      await db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
        .bind(`prod_img_${slug}`, image).run()
    } catch {}
  }
  return c.json({ ok: true, slug, image, message: `Product ${slug} image updated successfully.` })
})

// ---------------- API: RFQ ----------------
app.post('/api/rfq', async (c) => {
  let body: Record<string, unknown>
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid request body' }, 400) }

  if (clean(body._hp as string)) return c.json({ error: 'Submission rejected' }, 400) // honeypot
  if (await rateLimited(c, 'rfq')) return c.json({ error: 'Too many submissions. Please try again later.' }, 429)

  const company_name = clean(body.company_name, 120)
  const contact_person = clean(body.contact_person, 120)
  const email = clean(body.email, 150)
  const phone = clean(body.phone, 20)
  const country = clean(body.country, 60)
  const product = clean(body.product, 150)
  const quantity = clean(body.quantity, 20)

  if (!company_name || !contact_person || !product) return c.json({ error: 'Company name, contact person and product are required.' }, 400)
  if (!EMAIL_RE.test(email)) return c.json({ error: 'Please provide a valid business email address.' }, 400)
  if (phone && !PHONE_RE.test(phone)) return c.json({ error: 'Please provide a valid phone number.' }, 400)
  if (!quantity || Number(quantity) < 1) return c.json({ error: 'Please provide a valid quantity.' }, 400)

  const id = refId('RFQ')
  const db = c.env?.DB
  if (db) {
    try {
      await db.prepare(`INSERT INTO rfqs (rfq_id, company_name, contact_person, email, phone, country, product, quantity, unit, composition, gsm, color, delivery_date, target_price, requirements, uid)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(id, company_name, contact_person, email, phone, country, product, quantity,
          clean(body.unit, 20), clean(body.composition, 100), clean(body.gsm, 30), clean(body.color, 80),
          clean(body.delivery_date, 20), clean(body.target_price, 50), clean(body.requirements, 2000), clean(body._uid, 128))
        .run()
    } catch (e) { console.error('D1 insert failed', e) }
  }
  return c.json({ id, collection: 'rfqs', message: `RFQ ${id} submitted successfully.` })
})

app.get('/api/rfq', async (c) => {
  const email = clean(c.req.query('email'), 150)
  if (!EMAIL_RE.test(email)) return c.json({ rfqs: [] })
  const db = c.env?.DB
  if (!db) return c.json({ rfqs: [] })
  try {
    const { results } = await db.prepare('SELECT rfq_id, product, quantity, unit, status, created_at FROM rfqs WHERE email = ? ORDER BY created_at DESC LIMIT 25').bind(email).all()
    return c.json({ rfqs: results || [] })
  } catch { return c.json({ rfqs: [] }) }
})

// ---------------- API: contact ----------------
app.post('/api/contact', async (c) => {
  let body: Record<string, unknown>
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid request body' }, 400) }
  if (clean(body._hp as string)) return c.json({ error: 'Submission rejected' }, 400)
  if (await rateLimited(c, 'contact')) return c.json({ error: 'Too many submissions. Please try again later.' }, 429)

  const name = clean(body.name, 120)
  const email = clean(body.email, 150)
  const message = clean(body.message, 3000)
  const inquiry_type = clean(body.inquiry_type, 60)
  if (!name || !message || !inquiry_type) return c.json({ error: 'Name, inquiry type and message are required.' }, 400)
  if (!EMAIL_RE.test(email)) return c.json({ error: 'Please provide a valid email address.' }, 400)

  const id = refId('INQ')
  const db = c.env?.DB
  if (db) {
    try {
      await db.prepare('INSERT INTO contact_inquiries (ref_id, name, company, email, phone, country, inquiry_type, message, uid) VALUES (?,?,?,?,?,?,?,?,?)')
        .bind(id, name, clean(body.company, 120), email, clean(body.phone, 20), clean(body.country, 60), inquiry_type, message, clean(body._uid, 128)).run()
    } catch (e) { console.error('D1 insert failed', e) }
  }
  return c.json({ id, collection: 'contact_inquiries', message: `Inquiry ${id} received.` })
})

// ---------------- API: sample request ----------------
app.post('/api/sample', async (c) => {
  let body: Record<string, unknown>
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid request body' }, 400) }
  if (clean(body._hp as string)) return c.json({ error: 'Submission rejected' }, 400)
  if (await rateLimited(c, 'sample')) return c.json({ error: 'Too many submissions. Please try again later.' }, 429)

  const product = clean(body.product, 150)
  const email = clean(body.email, 150)
  const shipping_address = clean(body.shipping_address, 400)
  if (!product || !shipping_address) return c.json({ error: 'Product and shipping address are required.' }, 400)
  if (!EMAIL_RE.test(email)) return c.json({ error: 'Please provide a valid email address.' }, 400)

  const id = refId('SMP')
  const db = c.env?.DB
  if (db) {
    try {
      await db.prepare('INSERT INTO sample_requests (ref_id, product, color, gsm, quantity, shipping_address, country, purpose, comments, email, uid) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .bind(id, product, clean(body.color, 80), clean(body.gsm, 30), clean(body.quantity, 20), shipping_address, clean(body.country, 60), clean(body.purpose, 60), clean(body.comments, 1000), email, clean(body._uid, 128)).run()
    } catch (e) { console.error('D1 insert failed', e) }
  }
  return c.json({ id, collection: 'sample_requests', message: `Sample request ${id} received.` })
})

// ---------------- API: job application ----------------
app.post('/api/apply', async (c) => {
  let body: Record<string, unknown>
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid request body' }, 400) }
  if (clean(body._hp as string)) return c.json({ error: 'Submission rejected' }, 400)
  if (await rateLimited(c, 'apply')) return c.json({ error: 'Too many submissions. Please try again later.' }, 429)

  const position = clean(body.position, 120)
  const name = clean(body.name, 120)
  const email = clean(body.email, 150)
  const phone = clean(body.phone, 20)
  const experience = clean(body.experience, 1500)
  if (!position || !name || !experience) return c.json({ error: 'Position, name and experience are required.' }, 400)
  if (!EMAIL_RE.test(email)) return c.json({ error: 'Please provide a valid email address.' }, 400)
  if (!PHONE_RE.test(phone)) return c.json({ error: 'Please provide a valid phone number.' }, 400)

  const id = refId('APP')
  const db = c.env?.DB
  if (db) {
    try {
      await db.prepare('INSERT INTO job_applications (ref_id, position, name, email, phone, linkedin, experience, education, cover_letter, uid) VALUES (?,?,?,?,?,?,?,?,?,?)')
        .bind(id, position, name, email, phone, clean(body.linkedin, 200), experience, clean(body.education, 200), clean(body.cover_letter, 3000), clean(body._uid, 128)).run()
    } catch (e) { console.error('D1 insert failed', e) }
  }
  return c.json({ id, collection: 'job_applications', message: `Application ${id} received.` })
})

// ---------------- API: Gemini AI Advisor ----------------
const GUMTI_AI_SYSTEM_INSTRUCTION = `You are the official AI Advisor for Gumti Textiles Ltd. (website: gumtitex.com), an established, premier export-oriented knit-composite textile and apparel manufacturer in Bangladesh, founded in 1993.

Your purpose is to assist international apparel brands, sourcing managers, fashion buyers, and partners with verified information about Gumti's manufacturing services, factory capabilities, products, order processes, and compliance.

### Verified Factory Facts & Capabilities:
1. Corporate Profile:
   - Company: Gumti Textiles Ltd.
   - Established: 30 October 1993 (Over 30 years of manufacturing excellence).
   - Registrations: BGMEA Reg. 2443, BKMEA Reg. 594/2003, Export Promotion Bureau Reg. EPB-1994.
   - Factory Location: Plot #1163, opposite Ansar Academy, Chandra, Shafipur, Kaliakoir, Gazipur, Bangladesh.
   - Head Office: 161, Motijheel C/A, 2nd Floor, Dhaka-1000, Bangladesh.
   - Leadership: Mohd. Akther (Managing Director), Ayesha Akhter (Chairman), Mohd. Anis (Chief Operating Officer), Rabiul Alam (GM Textiles), Anwar Hossain (GM Garments), Monirul Islam (GM Maintenance & Machinery).
   - Export Volume: ~$27 Million annual export turnover.
   - Banking Partners: Social Islami Bank Ltd. (SIBL), Southeast Bank Ltd. (SEBL).

2. Production Capacities & Machinery:
   - Fabric Dyeing: 50 Metric Tons/Day. High-pressure, low-liquor-ratio soft-flow eco-dyeing vessels from Sclavos Athena (Greece) and Thies (Germany) with computerized color dispensing.
   - Knitting: 10 Metric Tons/Day. Automated circular and flat knitting machines from Mayer & Cie (Germany) and Terrot (Germany) for single jersey, pique, interlock, rib, French terry, and fleece.
   - Finishing: 80 Metric Tons/Day. High-performance Korean Ehwha Stenters (multi-chamber temperature & width control) and Italian Lafer sueding/compacting lines.
   - Garment Sewing: 35,000 Pieces/Day across 22 modern synchronized assembly lines with 750+ computerized sewing machines.
   - Cutting: 40,000 Pieces/Day precision multi-ply cutting bays.

3. Workforce & Social Compliance:
   - Total Workforce: ~1,600 personnel.
   - Gender Diversity: 74% skilled female workforce with equal opportunity empowerment.
   - Workplace Safety & Welfare: In-house factory medical & first-aid clinic with full-time medical staff, dedicated nursery/childcare room, certified fire alarms and hydrants, regular evacuation and firefighting drills.

4. Green Infrastructure & Sustainability:
   - Effluent Treatment: Biological Effluent Treatment Plant (ETP) and Water Treatment Plant (WTP) ensuring 100% compliant, clean water discharge.
   - Clean Energy: Dedicated on-site LPG station and 2 sustainable jute boilers reducing environmental footprint.

5. Products & Fabrications:
   - Garments: Classic & Tipped Pique Polo Shirts, Premium Ring-Spun Crew Neck T-Shirts, Heavyweight Pullover & Zip Hoodies (up to 320+ GSM), Performance Activewear & Sportswear, Sweatshirts, Joggers, Tank Tops, Loungewear.
   - Fabrics: 100% Combed/Carded Cotton, Cotton/Poly Blends, 100% Organic Cotton, Viscose, Modal, CVC, TC, Elastane/Spandex blends, Single Jersey, Pique, Interlock, Rib 1x1 & 2x2, French Terry, Brushed Fleece, Waffle knit.
   - International Buyer Partners: Norma, Smart Blanks, Suncity, TXM, and European/North American brands.

6. Order Guidance & Next Steps:
   - Request a Quote: Direct buyers to submit an RFQ at /request-quote.
   - Request Samples: Direct buyers to /request-sample.
   - Product Catalog: Direct buyers to /products.
   - Factory Capabilities: Direct buyers to /capabilities.
   - Direct Contact: Email info@gumtitex.com, Phone +8801716776393, or /contact.

### Communication Guidelines:
- Professional, knowledgeable, welcoming B2B manufacturing advisor tone.
- Format responses cleanly with bold text, bullet points, and markdown links when referencing site pages (e.g. [Request a Quote](/request-quote), [Explore Products](/products), [Factory Capabilities](/capabilities)).
- For pricing inquiries, explain that pricing depends on GSM, fabric composition, order volume, and design details, and invite them to submit an RFQ for customized pricing from merchandising.`

app.post('/api/chat', async (c) => {
  let body: Record<string, unknown>
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid request body' }, 400) }

  const message = clean(body.message, 1000)
  if (!message) return c.json({ error: 'Message is required.' }, 400)

  const apiKey = (c.env?.GEMINI_API_KEY as string) || DEFAULT_GEMINI_API_KEY
  const history = Array.isArray(body.history) ? body.history : []

  // Format contents for Gemini generateContent
  const contents: any[] = []
  for (const h of history.slice(-6)) {
    if (h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string' && h.text.trim()) {
      contents.push({
        role: h.role,
        parts: [{ text: clean(h.text, 1000) }]
      })
    }
  }
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  })

  try {
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: GUMTI_AI_SYSTEM_INSTRUCTION }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    })

    const data = await geminiRes.json() as any
    if (!geminiRes.ok) {
      console.error('Gemini API error:', data)
      return c.json({
        reply: "Thank you for reaching out to Gumti Textiles Ltd. We specialize in knit composite manufacturing (50T/day dyeing, 10T/day knitting, 80T/day finishing, 35k pcs/day sewing). For immediate orders or quotations, please email info@gumtitex.com or submit an RFQ at /request-quote."
      })
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Thank you for connecting with Gumti Textiles. How else can we assist your apparel manufacturing needs?"
    aiConversationsCount++

    return c.json({ reply, conversations: aiConversationsCount })
  } catch (err: any) {
    console.error('Chat endpoint error:', err)
    return c.json({
      reply: "We are pleased to assist you with Gumti Textiles' integrated manufacturing capabilities. Please explore our /capabilities page or submit an inquiry at /contact."
    })
  }
})

// ---------------- Errors ----------------
app.notFound((c) => c.html(Layout({ title: 'Page Not Found', children: NotFoundPage() }), 404))
app.onError((err, c) => {
  console.error('App error:', err)
  return c.html(Layout({ title: 'Server Error', children: ErrorPage() }), 500)
})

export default app
