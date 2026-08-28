// Gumti Textiles — Admin API (RBAC-protected enterprise workflows)
import { Hono } from 'hono'
import { requireAuth, can, auditLog, type RbacUser } from './auth'
import { products } from './data/products'

type Bindings = { DB?: D1Database }
type Env = { Bindings: Bindings; Variables: { user: RbacUser } }

const RFQ_STATUSES = ['NEW', 'UNDER_REVIEW', 'ASSIGNED', 'NEED_MORE_INFORMATION', 'PRICING', 'QUOTATION_SENT', 'CUSTOMER_REVIEW', 'APPROVED', 'REJECTED', 'CONVERTED_TO_ORDER']
const SAMPLE_STATUSES = ['REQUESTED', 'REVIEWED', 'APPROVED', 'IN_PROGRESS', 'DISPATCHED', 'DELIVERED', 'COMPLETED']
const ORDER_STATUSES = ['CONFIRMED', 'MATERIAL_PLANNING', 'PRODUCTION', 'QUALITY', 'PACKING', 'SHIPMENT', 'DELIVERED']
const QUOTATION_STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']
const ROLES = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'MERCHANDISING', 'PRODUCTION_MANAGER', 'QUALITY_MANAGER', 'HR_MANAGER', 'CONTENT_MANAGER', 'VIEWER', 'BUYER']
const STAFF_ROLES = ROLES.filter((r) => r !== 'BUYER')

const clean = (v: unknown, max = 300) => typeof v === 'string' ? v.replace(/<[^>]*>/g, '').trim().slice(0, max) : ''
const refId = (prefix: string) => `${prefix}-GT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}${Date.now().toString(36).slice(-4).toUpperCase()}`

export const adminApi = new Hono<Env>()

// ---- Guard: every admin route requires a staff role ----
adminApi.use('*', async (c, next) => {
  const user = await requireAuth(c)
  if (!user) return c.json({ error: 'Authentication required. Sign in with an authorized Firebase account.' }, 401)
  if (!STAFF_ROLES.includes(user.role)) return c.json({ error: 'Admin access denied. Your account does not have a staff role.' }, 403)
  c.set('user', user)
  await next()
})

const db = (c: any): D1Database | null => c.env?.DB || null
const deny = (c: any) => c.json({ error: 'Permission denied for your role.' }, 403)
const noDb = (c: any) => c.json({ error: 'D1 database binding is not available.' }, 500)

// ============ OVERVIEW / DASHBOARD ============
adminApi.get('/overview', async (c) => {
  const d = db(c); if (!d) return noDb(c)
  const user = c.get('user')
  const count = async (sql: string) => { try { return (await d.prepare(sql).first<{ n: number }>())?.n || 0 } catch { return 0 } }
  const list = async (sql: string) => { try { return (await d.prepare(sql).all()).results || [] } catch { return [] } }
  const [rfqs, contact, samples, apps, quotations, orders, customers] = await Promise.all([
    list('SELECT rfq_id, company_name, contact_person, email, country, product, quantity, unit, status, created_at FROM rfqs ORDER BY created_at DESC LIMIT 100'),
    list('SELECT ref_id, name, company, email, inquiry_type, status, created_at FROM contact_inquiries ORDER BY created_at DESC LIMIT 50'),
    list('SELECT ref_id, product, email, quantity, country, status, created_at FROM sample_requests ORDER BY created_at DESC LIMIT 100'),
    list('SELECT ref_id, position, name, email, phone, status, created_at FROM job_applications ORDER BY created_at DESC LIMIT 50'),
    list('SELECT quotation_id, rfq_id, customer_email, company_name, currency, total, status, created_at FROM quotations ORDER BY created_at DESC LIMIT 100'),
    list('SELECT order_id, rfq_id, customer_email, company_name, product, quantity, status, created_at FROM orders ORDER BY created_at DESC LIMIT 100'),
    list('SELECT email, company, contact_person, country, status, created_at FROM customers ORDER BY created_at DESC LIMIT 100'),
  ])
  const stats = {
    rfqs: await count('SELECT COUNT(*) n FROM rfqs'),
    pending_rfqs: await count("SELECT COUNT(*) n FROM rfqs WHERE status IN ('NEW','UNDER_REVIEW','UNDER REVIEW','PRICING','ASSIGNED')"),
    quotations: await count('SELECT COUNT(*) n FROM quotations'),
    approved_quotations: await count("SELECT COUNT(*) n FROM quotations WHERE status = 'ACCEPTED'"),
    samples: await count('SELECT COUNT(*) n FROM sample_requests'),
    active_orders: await count("SELECT COUNT(*) n FROM orders WHERE status != 'DELIVERED'"),
    completed_orders: await count("SELECT COUNT(*) n FROM orders WHERE status = 'DELIVERED'"),
    customers: await count('SELECT COUNT(*) n FROM customers'),
    inquiries: await count('SELECT COUNT(*) n FROM contact_inquiries'),
    job_applications: await count('SELECT COUNT(*) n FROM job_applications'),
    products: products.length,
    product_categories: Array.from(new Set(products.map((p) => p.category))).length,
    ai_conversations: await count('SELECT COUNT(*) n FROM ai_conversations'),
    users: await count('SELECT COUNT(*) n FROM users'),
    verified_metrics: await count("SELECT COUNT(*) n FROM verified_metrics WHERE status = 'VERIFIED'"),
    pending_metrics: await count("SELECT COUNT(*) n FROM verified_metrics WHERE status != 'VERIFIED'"),
  }
  // RFQ funnel from real statuses
  const funnelRows = await list('SELECT status, COUNT(*) n FROM rfqs GROUP BY status')
  const recent = [
    ...rfqs.slice(0, 8).map((r: any) => ({ type: 'RFQ', ref: r.rfq_id, title: r.product, party: r.company_name, status: r.status, created_at: r.created_at })),
    ...contact.slice(0, 5).map((r: any) => ({ type: 'Inquiry', ref: r.ref_id, title: r.inquiry_type, party: r.company || r.name, status: r.status, created_at: r.created_at })),
    ...samples.slice(0, 5).map((r: any) => ({ type: 'Sample', ref: r.ref_id, title: r.product, party: r.email, status: r.status, created_at: r.created_at })),
    ...quotations.slice(0, 5).map((r: any) => ({ type: 'Quotation', ref: r.quotation_id, title: r.company_name || r.customer_email, party: r.customer_email, status: r.status, created_at: r.created_at })),
    ...orders.slice(0, 5).map((r: any) => ({ type: 'Order', ref: r.order_id, title: r.product, party: r.customer_email, status: r.status, created_at: r.created_at })),
    ...apps.slice(0, 4).map((r: any) => ({ type: 'Career', ref: r.ref_id, title: r.position, party: r.name, status: r.status, created_at: r.created_at })),
  ].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))).slice(0, 12)
  return c.json({
    admin: user.email, role: user.role, permissions: Array.from(user.permissions),
    stats, rfq_funnel: funnelRows, recent_activity: recent,
    rfqs, contact_inquiries: contact, sample_requests: samples, job_applications: apps,
    quotations, orders, customers,
    workflow: { rfq: RFQ_STATUSES, sample: SAMPLE_STATUSES, order: ORDER_STATUSES, quotation: QUOTATION_STATUSES, roles: ROLES },
  })
})

// ============ RFQ WORKFLOW ============
adminApi.get('/rfqs/:id', async (c) => {
  const user = c.get('user'); if (!can(user, 'rfq.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const rfq = await d.prepare('SELECT * FROM rfqs WHERE rfq_id = ?').bind(id).first()
  if (!rfq) return c.json({ error: 'RFQ not found' }, 404)
  const events = (await d.prepare('SELECT old_status, new_status, note, actor_email, created_at FROM rfq_status_events WHERE rfq_id = ? ORDER BY created_at DESC').bind(id).all()).results || []
  const quotes = (await d.prepare('SELECT quotation_id, status, total, currency, created_at FROM quotations WHERE rfq_id = ? ORDER BY created_at DESC').bind(id).all()).results || []
  return c.json({ rfq, events, quotations: quotes })
})

adminApi.patch('/rfqs/:id/status', async (c) => {
  const user = c.get('user'); if (!can(user, 'rfq.update')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))
  const status = clean(body.status, 40).toUpperCase().replace(/\s+/g, '_')
  const note = clean(body.note, 500)
  if (!RFQ_STATUSES.includes(status)) return c.json({ error: `Invalid status. Allowed: ${RFQ_STATUSES.join(', ')}` }, 400)
  const row = await d.prepare('SELECT status FROM rfqs WHERE rfq_id = ?').bind(id).first<{ status: string }>()
  if (!row) return c.json({ error: 'RFQ not found' }, 404)
  await d.prepare('UPDATE rfqs SET status = ? WHERE rfq_id = ?').bind(status, id).run()
  await d.prepare('INSERT INTO rfq_status_events (rfq_id, old_status, new_status, note, actor_email) VALUES (?,?,?,?,?)').bind(id, row.status, status, note, user.email).run()
  await auditLog(d, user.email, 'rfq.status_change', 'rfq', id, { status: row.status }, { status, note })
  return c.json({ ok: true, rfq_id: id, old_status: row.status, new_status: status })
})

// ============ SAMPLE WORKFLOW ============
adminApi.patch('/samples/:id/status', async (c) => {
  const user = c.get('user'); if (!can(user, 'rfq.update') && !can(user, 'production.update')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))
  const status = clean(body.status, 40).toUpperCase().replace(/\s+/g, '_')
  if (!SAMPLE_STATUSES.includes(status)) return c.json({ error: `Invalid status. Allowed: ${SAMPLE_STATUSES.join(', ')}` }, 400)
  const row = await d.prepare('SELECT status FROM sample_requests WHERE ref_id = ?').bind(id).first<{ status: string }>()
  if (!row) return c.json({ error: 'Sample request not found' }, 404)
  await d.prepare('UPDATE sample_requests SET status = ? WHERE ref_id = ?').bind(status, id).run()
  await d.prepare('INSERT INTO sample_status_events (ref_id, old_status, new_status, note, actor_email) VALUES (?,?,?,?,?)').bind(id, row.status, status, clean(body.note, 500), user.email).run()
  await auditLog(d, user.email, 'sample.status_change', 'sample', id, { status: row.status }, { status })
  return c.json({ ok: true, ref_id: id, new_status: status })
})

// ============ QUOTATIONS ============
adminApi.post('/quotations', async (c) => {
  const user = c.get('user'); if (!can(user, 'quotation.create')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const body = await c.req.json().catch(() => ({}))
  const customer_email = clean(body.customer_email, 150).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer_email)) return c.json({ error: 'A valid customer email is required.' }, 400)
  const items = Array.isArray(body.items) ? body.items.slice(0, 20) : []
  if (!items.length) return c.json({ error: 'At least one line item is required.' }, 400)
  const id = refId('QTN')
  let total = 0
  const parsed = items.map((it: any) => {
    const qty = Math.max(0, Number(it.quantity) || 0)
    const price = Math.max(0, Number(it.unit_price) || 0)
    const amount = Math.round(qty * price * 100) / 100
    total += amount
    return { description: clean(it.description, 300), quantity: qty, unit: clean(it.unit, 20) || 'pcs', unit_price: price, amount }
  }).filter((it: any) => it.description)
  if (!parsed.length) return c.json({ error: 'Line items need a description.' }, 400)
  await d.prepare('INSERT INTO quotations (quotation_id, rfq_id, customer_email, company_name, currency, validity, notes, status, total, created_by) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .bind(id, clean(body.rfq_id, 40) || null, customer_email, clean(body.company_name, 150), clean(body.currency, 8) || 'USD', clean(body.validity, 60), clean(body.notes, 1000), 'DRAFT', total, user.email).run()
  for (const it of parsed) {
    await d.prepare('INSERT INTO quotation_items (quotation_id, description, quantity, unit, unit_price, amount) VALUES (?,?,?,?,?,?)')
      .bind(id, it.description, it.quantity, it.unit, it.unit_price, it.amount).run()
  }
  if (body.rfq_id) {
    try {
      await d.prepare("UPDATE rfqs SET status = 'PRICING' WHERE rfq_id = ? AND status IN ('NEW','UNDER_REVIEW','ASSIGNED')").bind(clean(body.rfq_id, 40)).run()
    } catch {}
  }
  await auditLog(d, user.email, 'quotation.create', 'quotation', id, null, { customer_email, total })
  return c.json({ ok: true, quotation_id: id, total })
})

adminApi.get('/quotations/:id', async (c) => {
  const user = c.get('user'); if (!can(user, 'quotation.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const q = await d.prepare('SELECT * FROM quotations WHERE quotation_id = ?').bind(id).first()
  if (!q) return c.json({ error: 'Quotation not found' }, 404)
  const items = (await d.prepare('SELECT description, quantity, unit, unit_price, amount FROM quotation_items WHERE quotation_id = ?').bind(id).all()).results || []
  return c.json({ quotation: q, items })
})

adminApi.patch('/quotations/:id/status', async (c) => {
  const user = c.get('user')
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))
  const status = clean(body.status, 20).toUpperCase()
  if (!QUOTATION_STATUSES.includes(status)) return c.json({ error: `Invalid status. Allowed: ${QUOTATION_STATUSES.join(', ')}` }, 400)
  const perm = status === 'SENT' ? 'quotation.send' : 'quotation.update'
  if (!can(user, perm)) return deny(c)
  const row = await d.prepare('SELECT status, rfq_id FROM quotations WHERE quotation_id = ?').bind(id).first<{ status: string; rfq_id: string }>()
  if (!row) return c.json({ error: 'Quotation not found' }, 404)
  await d.prepare("UPDATE quotations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE quotation_id = ?").bind(status, id).run()
  if (status === 'SENT' && row.rfq_id) await d.prepare("UPDATE rfqs SET status = 'QUOTATION_SENT' WHERE rfq_id = ?").bind(row.rfq_id).run()
  await auditLog(d, user.email, 'quotation.status_change', 'quotation', id, { status: row.status }, { status })
  return c.json({ ok: true, quotation_id: id, new_status: status })
})

adminApi.get('/quotations/:id/document', async (c) => {
  const user = c.get('user'); if (!can(user, 'quotation.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const q: any = await d.prepare('SELECT * FROM quotations WHERE quotation_id = ?').bind(id).first()
  if (!q) return c.notFound()
  const items = (await d.prepare('SELECT description, quantity, unit, unit_price, amount FROM quotation_items WHERE quotation_id = ?').bind(id).all()).results || []
  const lines = [
    'GUMTI TEXTILES LTD. — QUOTATION', '='.repeat(56), '',
    `Quotation:   ${q.quotation_id}`, `RFQ Ref:     ${q.rfq_id || '—'}`, `Customer:    ${q.company_name || q.customer_email}`,
    `Email:       ${q.customer_email}`, `Currency:    ${q.currency}`, `Validity:    ${q.validity || 'Per quotation terms'}`, `Status:      ${q.status}`, `Date:        ${q.created_at}`, '',
    'LINE ITEMS', '-'.repeat(56),
    ...items.map((it: any, i: number) => `${i + 1}. ${it.description}\n   Qty: ${it.quantity} ${it.unit} × ${it.unit_price} = ${it.amount} ${q.currency}`),
    '-'.repeat(56), `TOTAL: ${q.total} ${q.currency}`, '',
    q.notes ? `Notes: ${q.notes}\n` : '',
    'This quotation is issued by Gumti Textiles Ltd. and is subject to its stated validity and conditions.',
    'Head Office: House #150, Road #1, Baridhara DOHS, Dhaka-1206',
    'Factory: Plot #1163, opposite Ansar Academy, Chandra, Shafipur, Kaliakoir, Gazipur',
  ].join('\n')
  return c.text(lines, 200, { 'Content-Disposition': `attachment; filename="${q.quotation_id}.txt"` })
})

// ============ ORDERS ============
adminApi.post('/orders', async (c) => {
  const user = c.get('user'); if (!can(user, 'orders.create') && !can(user, 'rfq.convert')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const body = await c.req.json().catch(() => ({}))
  const rfqId = clean(body.rfq_id, 40)
  let customer_email = clean(body.customer_email, 150).toLowerCase()
  let product = clean(body.product, 150)
  let quantity = clean(body.quantity, 40)
  let company = clean(body.company_name, 150)
  if (rfqId) {
    const rfq: any = await d.prepare('SELECT * FROM rfqs WHERE rfq_id = ?').bind(rfqId).first()
    if (!rfq) return c.json({ error: 'RFQ not found' }, 404)
    customer_email = customer_email || String(rfq.email || '').toLowerCase()
    product = product || rfq.product; quantity = quantity || rfq.quantity; company = company || rfq.company_name
  }
  if (!customer_email || !product) return c.json({ error: 'Customer email and product are required.' }, 400)
  const id = refId('ORD')
  await d.prepare('INSERT INTO orders (order_id, rfq_id, quotation_id, customer_email, company_name, product, quantity, status, created_by) VALUES (?,?,?,?,?,?,?,?,?)')
    .bind(id, rfqId || null, clean(body.quotation_id, 40) || null, customer_email, company, product, quantity, 'CONFIRMED', user.email).run()
  await d.prepare('INSERT INTO order_status_events (order_id, old_status, new_status, note, actor_email) VALUES (?,?,?,?,?)').bind(id, null, 'CONFIRMED', 'Order created', user.email).run()
  if (rfqId) {
    await d.prepare("UPDATE rfqs SET status = 'CONVERTED_TO_ORDER' WHERE rfq_id = ?").bind(rfqId).run()
    await d.prepare('INSERT INTO rfq_status_events (rfq_id, old_status, new_status, note, actor_email) VALUES (?,?,?,?,?)').bind(rfqId, null, 'CONVERTED_TO_ORDER', `Converted to ${id}`, user.email).run()
  }
  // CRM: upsert customer
  await d.prepare('INSERT INTO customers (email, company, contact_person) VALUES (?,?,?) ON CONFLICT(email) DO UPDATE SET company = COALESCE(excluded.company, company), updated_at = CURRENT_TIMESTAMP')
    .bind(customer_email, company || null, null).run()
  await auditLog(d, user.email, 'order.create', 'order', id, null, { customer_email, product, rfq_id: rfqId })
  return c.json({ ok: true, order_id: id })
})

adminApi.patch('/orders/:id/status', async (c) => {
  const user = c.get('user'); if (!can(user, 'orders.update') && !can(user, 'production.update')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))
  const status = clean(body.status, 40).toUpperCase().replace(/\s+/g, '_')
  if (!ORDER_STATUSES.includes(status)) return c.json({ error: `Invalid status. Allowed: ${ORDER_STATUSES.join(', ')}` }, 400)
  const row = await d.prepare('SELECT status FROM orders WHERE order_id = ?').bind(id).first<{ status: string }>()
  if (!row) return c.json({ error: 'Order not found' }, 404)
  await d.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?').bind(status, id).run()
  await d.prepare('INSERT INTO order_status_events (order_id, old_status, new_status, note, actor_email) VALUES (?,?,?,?,?)').bind(id, row.status, status, clean(body.note, 500), user.email).run()
  await auditLog(d, user.email, 'order.status_change', 'order', id, { status: row.status }, { status })
  return c.json({ ok: true, order_id: id, new_status: status })
})

adminApi.get('/orders/:id', async (c) => {
  const user = c.get('user'); if (!can(user, 'orders.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = c.req.param('id')
  const order = await d.prepare('SELECT * FROM orders WHERE order_id = ?').bind(id).first()
  if (!order) return c.json({ error: 'Order not found' }, 404)
  const events = (await d.prepare('SELECT old_status, new_status, note, actor_email, created_at FROM order_status_events WHERE order_id = ? ORDER BY created_at DESC').bind(id).all()).results || []
  return c.json({ order, events })
})

// ============ CUSTOMERS / CRM ============
adminApi.get('/customers/:email', async (c) => {
  const user = c.get('user'); if (!can(user, 'customers.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const email = decodeURIComponent(c.req.param('email')).toLowerCase()
  const customer = await d.prepare('SELECT * FROM customers WHERE email = ?').bind(email).first()
  const [rfqs, quotes, samples, orders] = await Promise.all([
    d.prepare('SELECT rfq_id, product, quantity, status, created_at FROM rfqs WHERE email = ? ORDER BY created_at DESC LIMIT 25').bind(email).all(),
    d.prepare('SELECT quotation_id, total, currency, status, created_at FROM quotations WHERE customer_email = ? ORDER BY created_at DESC LIMIT 25').bind(email).all(),
    d.prepare('SELECT ref_id, product, status, created_at FROM sample_requests WHERE email = ? ORDER BY created_at DESC LIMIT 25').bind(email).all(),
    d.prepare('SELECT order_id, product, quantity, status, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 25').bind(email).all(),
  ])
  return c.json({ customer: customer || { email }, rfqs: rfqs.results || [], quotations: quotes.results || [], samples: samples.results || [], orders: orders.results || [] })
})

adminApi.post('/customers', async (c) => {
  const user = c.get('user'); if (!can(user, 'customers.create')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const body = await c.req.json().catch(() => ({}))
  const email = clean(body.email, 150).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return c.json({ error: 'A valid email is required.' }, 400)
  await d.prepare(`INSERT INTO customers (email, company, contact_person, country, phone, notes) VALUES (?,?,?,?,?,?)
    ON CONFLICT(email) DO UPDATE SET company=excluded.company, contact_person=excluded.contact_person, country=excluded.country, phone=excluded.phone, notes=excluded.notes, updated_at=CURRENT_TIMESTAMP`)
    .bind(email, clean(body.company, 150), clean(body.contact_person, 120), clean(body.country, 60), clean(body.phone, 20), clean(body.notes, 1000)).run()
  await auditLog(d, user.email, 'customer.upsert', 'customer', email, null, { company: clean(body.company, 150) })
  return c.json({ ok: true, email })
})

// ============ VERIFIED METRICS (Verification Center) ============
adminApi.get('/metrics', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const rows = (await d.prepare('SELECT * FROM verified_metrics ORDER BY category, id').all()).results || []
  return c.json({ metrics: rows })
})

adminApi.post('/metrics', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.create')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const body = await c.req.json().catch(() => ({}))
  const label = clean(body.label, 150)
  if (!label) return c.json({ error: 'Metric label is required.' }, 400)
  const status = ['VERIFIED', 'PENDING_VERIFICATION', 'NEEDS_REVIEW'].includes(clean(body.status, 30)) ? clean(body.status, 30) : 'PENDING_VERIFICATION'
  const published = status === 'VERIFIED' && (body.published === true || body.published === 1) ? 1 : 0
  const r = await d.prepare('INSERT INTO verified_metrics (category, label, value, unit, year, source, status, published) VALUES (?,?,?,?,?,?,?,?)')
    .bind(clean(body.category, 40) || 'sustainability', label, clean(body.value, 200) || null, clean(body.unit, 40) || null, clean(body.year, 20) || null, clean(body.source, 200) || null, status, published).run()
  await auditLog(d, user.email, 'metric.create', 'verified_metric', String(r.meta?.last_row_id || ''), null, { label, status })
  return c.json({ ok: true })
})

adminApi.patch('/metrics/:id', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.publish') && !can(user, 'cms.update')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = Number(c.req.param('id'))
  const body = await c.req.json().catch(() => ({}))
  const row: any = await d.prepare('SELECT * FROM verified_metrics WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: 'Metric not found' }, 404)
  const status = ['VERIFIED', 'PENDING_VERIFICATION', 'NEEDS_REVIEW', 'EXPIRED'].includes(clean(body.status, 30)) ? clean(body.status, 30) : row.status
  if (status === 'VERIFIED' && !can(user, 'cms.publish')) return deny(c)
  const published = status === 'VERIFIED' ? (body.published != null ? (body.published ? 1 : 0) : row.published) : 0
  await d.prepare('UPDATE verified_metrics SET label=?, value=?, unit=?, year=?, source=?, status=?, published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(clean(body.label, 150) || row.label, body.value !== undefined ? clean(body.value, 200) : row.value, body.unit !== undefined ? clean(body.unit, 40) : row.unit,
      body.year !== undefined ? clean(body.year, 20) : row.year, body.source !== undefined ? clean(body.source, 200) : row.source, status, published, id).run()
  await auditLog(d, user.email, 'metric.update', 'verified_metric', String(id), { status: row.status, published: row.published }, { status, published })
  return c.json({ ok: true })
})

adminApi.delete('/metrics/:id', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.publish')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = Number(c.req.param('id'))
  await d.prepare('DELETE FROM verified_metrics WHERE id = ?').bind(id).run()
  await auditLog(d, user.email, 'metric.delete', 'verified_metric', String(id))
  return c.json({ ok: true })
})

// ============ EXPORT MARKETS ============
adminApi.get('/markets', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const rows = (await d.prepare('SELECT * FROM export_markets ORDER BY region, country').all()).results || []
  return c.json({ markets: rows })
})

adminApi.post('/markets', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.create')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const body = await c.req.json().catch(() => ({}))
  const country = clean(body.country, 80)
  if (!country) return c.json({ error: 'Country is required.' }, 400)
  const status = clean(body.status, 30) === 'VERIFIED' ? 'VERIFIED' : 'PENDING_VERIFICATION'
  if (status === 'VERIFIED' && !can(user, 'cms.publish')) return deny(c)
  await d.prepare('INSERT INTO export_markets (country, region, products, description, status, published) VALUES (?,?,?,?,?,?)')
    .bind(country, clean(body.region, 60), clean(body.products, 200), clean(body.description, 500), status, status === 'VERIFIED' && body.published ? 1 : 0).run()
  await auditLog(d, user.email, 'market.create', 'export_market', country, null, { status })
  return c.json({ ok: true })
})

adminApi.patch('/markets/:id', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.publish')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const id = Number(c.req.param('id'))
  const body = await c.req.json().catch(() => ({}))
  const row: any = await d.prepare('SELECT * FROM export_markets WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: 'Market not found' }, 404)
  const status = ['VERIFIED', 'PENDING_VERIFICATION'].includes(clean(body.status, 30)) ? clean(body.status, 30) : row.status
  const published = status === 'VERIFIED' ? (body.published != null ? (body.published ? 1 : 0) : row.published) : 0
  await d.prepare('UPDATE export_markets SET status = ?, published = ? WHERE id = ?').bind(status, published, id).run()
  await auditLog(d, user.email, 'market.update', 'export_market', String(id), { status: row.status }, { status, published })
  return c.json({ ok: true })
})

adminApi.delete('/markets/:id', async (c) => {
  const user = c.get('user'); if (!can(user, 'cms.publish')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  await d.prepare('DELETE FROM export_markets WHERE id = ?').bind(Number(c.req.param('id'))).run()
  await auditLog(d, c.get('user').email, 'market.delete', 'export_market', c.req.param('id'))
  return c.json({ ok: true })
})

// ============ USERS & ROLES ============
adminApi.get('/users', async (c) => {
  const user = c.get('user'); if (!can(user, 'users.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const rows = (await d.prepare('SELECT email, display_name, company, role, status, created_at FROM users ORDER BY created_at DESC LIMIT 200').all()).results || []
  return c.json({ users: rows, roles: ROLES })
})

adminApi.patch('/users/:email', async (c) => {
  const user = c.get('user'); if (!can(user, 'users.assign_role')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const email = decodeURIComponent(c.req.param('email')).toLowerCase()
  const body = await c.req.json().catch(() => ({}))
  const role = clean(body.role, 30).toUpperCase()
  const status = ['ACTIVE', 'DISABLED'].includes(clean(body.status, 20).toUpperCase()) ? clean(body.status, 20).toUpperCase() : null
  const row: any = await d.prepare('SELECT role, status FROM users WHERE email = ?').bind(email).first()
  if (role && !ROLES.includes(role)) return c.json({ error: `Invalid role. Allowed: ${ROLES.join(', ')}` }, 400)
  if (email === user.email && (role && role !== user.role || status === 'DISABLED')) return c.json({ error: 'You cannot change or disable your own account.' }, 400)
  if (!row) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return c.json({ error: 'Invalid email.' }, 400)
    await d.prepare('INSERT INTO users (email, role, status) VALUES (?,?,?)').bind(email, role || 'VIEWER', status || 'ACTIVE').run()
  } else {
    await d.prepare('UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE email = ?').bind(role || null, status, email).run()
  }
  await auditLog(d, user.email, 'user.role_change', 'user', email, row ? { role: row.role, status: row.status } : null, { role: role || row?.role, status: status || row?.status })
  return c.json({ ok: true, email, role: role || row?.role })
})

// ============ AUDIT LOGS ============
adminApi.get('/audit', async (c) => {
  const user = c.get('user'); if (!can(user, 'audit_logs.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const rows = (await d.prepare('SELECT actor_email, action, entity, entity_id, old_value, new_value, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 100').all()).results || []
  return c.json({ audit: rows })
})

// ============ AI ANALYTICS ============
adminApi.get('/ai-analytics', async (c) => {
  const user = c.get('user'); if (!can(user, 'analytics.read')) return deny(c)
  const d = db(c); if (!d) return noDb(c)
  const total = (await d.prepare('SELECT COUNT(*) n FROM ai_conversations').first<{ n: number }>())?.n || 0
  const matched = (await d.prepare('SELECT COUNT(*) n FROM ai_conversations WHERE matched = 1').first<{ n: number }>())?.n || 0
  const recent = (await d.prepare('SELECT query, matched, created_at FROM ai_conversations ORDER BY created_at DESC LIMIT 40').all()).results || []
  return c.json({ total, matched, unmatched: total - matched, recent })
})
