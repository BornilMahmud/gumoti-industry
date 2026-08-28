import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Layout } from './layout'
import { HomePage } from './pages/home'
import { AboutPage, CapabilitiesPage, QualityPage, SustainabilityPage, GlobalReachPage, FacilitiesPage } from './pages/company'
import { ProductsPage, ProductDetailPage, ComparePage, productCardHtml } from './pages/products'
import { RequestQuotePage, RequestSamplePage, ContactPage } from './pages/forms'
import { CareersPage, JobDetailPage, NewsPage, ArticlePage, jobs, news } from './pages/careers-news'
import { PortalPage, PrivacyPage, TermsPage, NotFoundPage, ErrorPage } from './pages/portal'
import { AdminPage } from './pages/admin'
import { products, filterProducts } from './data/products'
import { companyProfile as co } from './data/company'

type Bindings = { DB?: D1Database }

const ADMIN_EMAILS = ['info@gumtitextiles.com']
const FIREBASE_PROJECT_ID = 'gumoti-tex'

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

async function verifyFirebaseAdmin(c: any): Promise<{ email: string } | null> {
  const auth = c.req.header('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return null
  const [h, p, s] = token.split('.')
  if (!h || !p || !s) return null
  try {
    const header = JSON.parse(new TextDecoder().decode(b64urlToUint8Array(h)))
    const payload = JSON.parse(new TextDecoder().decode(b64urlToUint8Array(p)))
    if (payload.aud !== FIREBASE_PROJECT_ID || payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null
    if (!payload.email || !ADMIN_EMAILS.map((x) => x.toLowerCase()).includes(String(payload.email).toLowerCase())) return null
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    const jwksRes = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
    const jwks = await jwksRes.json() as { keys?: JsonWebKey[] }
    const jwk = (jwks.keys || []).find((x: any) => x.kid === header.kid)
    if (!jwk) return null
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToUint8Array(s), new TextEncoder().encode(`${h}.${p}`))
    return ok ? { email: payload.email } : null
  } catch (e) {
    console.error('Admin token verification failed', e)
    return null
  }
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
app.get('/', (c) => c.html(Layout({ title: 'Integrated Textile & Apparel Manufacturer, Bangladesh', path: '/', children: HomePage() })))
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

app.get('/request-quote', (c) => c.html(Layout({ title: 'Request a Quote', children: RequestQuotePage(c.req.query('product')) })))
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

app.get('/portal', (c) => c.html(Layout({ title: 'Buyer Portal', children: PortalPage() })))
app.get('/admin', (c) => c.html(Layout({ title: 'Admin Panel', path: '/admin', children: AdminPage() })))
app.get('/privacy', (c) => c.html(Layout({ title: 'Privacy Policy', children: PrivacyPage() })))
app.get('/terms', (c) => c.html(Layout({ title: 'Terms of Use', children: TermsPage() })))

// ---------------- SEO ----------------
app.get('/sitemap.xml', (c) => {
  const base = new URL(c.req.url).origin
  const urls = ['/', '/about', '/capabilities', '/products', '/quality', '/sustainability', '/global-reach', '/facilities', '/careers', '/news', '/contact', '/request-quote',
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

// ---------------- API: admin ----------------
app.get('/api/admin/overview', async (c) => {
  const admin = await verifyFirebaseAdmin(c)
  if (!admin) return c.json({ error: `Admin access denied. Sign in with a Google account listed in ADMIN_EMAILS: ${ADMIN_EMAILS.join(', ')}` }, 403)
  const db = c.env?.DB
  if (!db) return c.json({ error: 'D1 database binding is not available.' }, 500)
  try {
    const [rfqs, contact, samples, apps] = await Promise.all([
      db.prepare('SELECT rfq_id, company_name, contact_person, email, product, quantity, unit, status, created_at FROM rfqs ORDER BY created_at DESC LIMIT 50').all(),
      db.prepare('SELECT ref_id, name, company, email, inquiry_type, status, created_at FROM contact_inquiries ORDER BY created_at DESC LIMIT 50').all(),
      db.prepare('SELECT ref_id, product, email, quantity, country, status, created_at FROM sample_requests ORDER BY created_at DESC LIMIT 50').all(),
      db.prepare('SELECT ref_id, position, name, email, phone, status, created_at FROM job_applications ORDER BY created_at DESC LIMIT 50').all(),
    ])
    return c.json({ admin: admin.email, rfqs: rfqs.results || [], contact_inquiries: contact.results || [], sample_requests: samples.results || [], job_applications: apps.results || [] })
  } catch (e) {
    console.error('Admin overview failed', e)
    return c.json({ error: 'Unable to load admin records.' }, 500)
  }
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

// ---------------- Errors ----------------
app.notFound((c) => c.html(Layout({ title: 'Page Not Found', children: NotFoundPage() }), 404))
app.onError((err, c) => {
  console.error('App error:', err)
  return c.html(Layout({ title: 'Server Error', children: ErrorPage() }), 500)
})

export default app
