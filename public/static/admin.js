// Gumti Textiles — Admin Control Center (RBAC, live D1 workflows, animated UI)
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmtDate = (d) => { try { return new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return String(d || ''); } };
  const toast = (m, ok) => window.gtToast ? window.gtToast(m, ok) : alert(m);

  let DATA = null; // last /overview payload
  let PERMS = new Set();
  const canDo = (p) => PERMS.has('*') || PERMS.has(p);

  async function api(path, opts = {}) {
    if (!window.gtAdminToken) throw new Error('Firebase is still loading. Try again in a moment.');
    const token = await window.gtAdminToken();
    const res = await fetch('/api/admin' + path, Object.assign({}, opts, {
      headers: Object.assign({ Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, opts.headers || {}),
    }));
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || ('Request failed (' + res.status + ')'));
    return data;
  }

  // ---------- Load & render ----------
  window.gtLoadAdmin = async function () {
    const root = $('#admin-data'); if (!root) return;
    if (!window.gtUser) { root.innerHTML = card('Sign in required', 'Please sign in with an authorized Gumti staff account to open the Control Center.'); return; }
    root.innerHTML = '<div class="admin-card p-10 text-center text-mutedgt admin-loading"><span class="admin-spinner"></span><p class="mt-4 text-sm">Loading Gumti Control Center…</p></div>';
    try {
      DATA = await api('/overview');
      PERMS = new Set(DATA.permissions || []);
      render(root);
    } catch (err) {
      root.innerHTML = card('Admin access unavailable', esc(err.message) + '<br/><br/>Sign in with a Gumti staff account, then refresh. Roles and permissions are managed in the Users module by a Super Admin.');
    }
  };
  function card(title, body) { return `<div class="admin-card p-8 admin-anim-in"><h2 class="font-serif text-2xl text-navy">${title}</h2><p class="mt-3 text-sm text-mutedgt leading-relaxed">${body}</p></div>`; }

  const TABS = [
    ['dashboard', 'Dashboard', 'fa-gauge-high'],
    ['rfqs', 'RFQs', 'fa-file-signature'],
    ['quotations', 'Quotations', 'fa-file-invoice-dollar'],
    ['samples', 'Samples', 'fa-box-open'],
    ['orders', 'Orders', 'fa-truck-fast'],
    ['customers', 'Customers', 'fa-building-user'],
    ['verification', 'Verification Center', 'fa-clipboard-check'],
    ['markets', 'Export Markets', 'fa-earth-asia'],
    ['users', 'Users & Roles', 'fa-user-shield'],
    ['audit', 'Audit Logs', 'fa-scroll'],
    ['ai', 'AI Analytics', 'fa-robot'],
  ];
  let activeTab = sessionStorage.getItem('gt_admin_tab') || 'dashboard';

  function render(root) {
    root.innerHTML = `
      <div class="admin-tabbar admin-anim-in" role="tablist">
        ${TABS.map(([id, label, icon]) => `<button role="tab" data-tab="${id}" class="admin-tab ${id === activeTab ? 'active' : ''}" aria-selected="${id === activeTab}"><i class="fa-solid ${icon}"></i><span>${label}</span></button>`).join('')}
      </div>
      <div id="admin-tab-content" class="mt-6"></div>
      <div id="admin-drawer" class="admin-drawer" hidden><div class="admin-drawer-panel"><button class="admin-drawer-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><div id="admin-drawer-body"></div></div></div>`;
    $$('.admin-tab', root).forEach((b) => b.addEventListener('click', () => { activeTab = b.dataset.tab; sessionStorage.setItem('gt_admin_tab', activeTab); render(root); }));
    $('#admin-drawer .admin-drawer-close', root).addEventListener('click', closeDrawer);
    $('#admin-drawer', root).addEventListener('click', (e) => { if (e.target.id === 'admin-drawer') closeDrawer(); });
    renderTab($('#admin-tab-content', root));
    animateIn(root);
  }

  function animateIn(root) {
    if (reduced) return;
    $$('.admin-anim-item', root).forEach((el, i) => { el.style.animationDelay = Math.min(i * 55, 600) + 'ms'; });
    $$('[data-count-to]', root).forEach((el) => {
      const target = Number(el.dataset.countTo) || 0; const t0 = performance.now(), dur = 1100;
      (function tick(t) { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
    setTimeout(() => $$('.admin-bar span', root).forEach((el) => { el.style.height = el.dataset.h; }), 120);
  }

  function openDrawer(html) {
    const d = $('#admin-drawer'); if (!d) return;
    $('#admin-drawer-body').innerHTML = html;
    d.hidden = false; requestAnimationFrame(() => d.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    const d = $('#admin-drawer'); if (!d) return;
    d.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(() => { d.hidden = true; }, 320);
  }

  function statusPill(s) {
    const t = String(s || 'NEW').toUpperCase();
    const map = { NEW: 'new', UNDER_REVIEW: 'progress', ASSIGNED: 'progress', NEED_MORE_INFORMATION: 'warn', PRICING: 'warn', QUOTATION_SENT: 'info', CUSTOMER_REVIEW: 'info', APPROVED: 'ok', ACCEPTED: 'ok', VERIFIED: 'ok', DELIVERED: 'ok', COMPLETED: 'ok', REJECTED: 'bad', DISABLED: 'bad', EXPIRED: 'bad', CONVERTED_TO_ORDER: 'ok', SENT: 'info', DRAFT: 'new', REQUESTED: 'new', REVIEWED: 'progress', IN_PROGRESS: 'progress', DISPATCHED: 'info', CONFIRMED: 'new', MATERIAL_PLANNING: 'progress', PRODUCTION: 'progress', QUALITY: 'warn', PACKING: 'info', SHIPMENT: 'info', ACTIVE: 'ok', PENDING_VERIFICATION: 'warn', NEEDS_REVIEW: 'warn', RECEIVED: 'new' };
    return `<span class="admin-status admin-status--${map[t] || 'new'}">${esc(t.replace(/_/g, ' '))}</span>`;
  }

  function table(headers, rows) {
    if (!rows.length) return '<div class="admin-card p-8 text-center text-sm text-mutedgt admin-anim-item admin-anim-in">No records yet.</div>';
    return `<div class="admin-card p-0 overflow-hidden admin-anim-item admin-anim-in"><div class="table-wrap"><table class="admin-table"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div></div>`;
  }
  function statusSelect(current, options, attrs) {
    return `<select class="admin-select" ${attrs}>${options.map((o) => `<option value="${o}" ${o === String(current || '').toUpperCase().replace(/\s+/g, '_') ? 'selected' : ''}>${o.replace(/_/g, ' ')}</option>`).join('')}</select>`;
  }

  // ---------- Tabs ----------
  function renderTab(el) {
    const fns = { dashboard: tabDashboard, rfqs: tabRfqs, quotations: tabQuotations, samples: tabSamples, orders: tabOrders, customers: tabCustomers, verification: tabVerification, markets: tabMarkets, users: tabUsers, audit: tabAudit, ai: tabAi };
    (fns[activeTab] || tabDashboard)(el);
  }

  // ===== DASHBOARD =====
  function tabDashboard(el) {
    const s = DATA.stats || {};
    const funnel = DATA.rfq_funnel || [];
    const maxF = Math.max(1, ...funnel.map((f) => f.n));
    const kpis = [
      ['Total RFQs', s.rfqs], ['Pending RFQs', s.pending_rfqs], ['Quotations', s.quotations], ['Accepted Quotes', s.approved_quotations],
      ['Samples', s.samples], ['Active Orders', s.active_orders], ['Completed Orders', s.completed_orders], ['Customers', s.customers],
      ['Inquiries', s.inquiries], ['Job Applications', s.job_applications], ['AI Conversations', s.ai_conversations], ['Platform Users', s.users],
    ];
    const h = new Date().getHours(); const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
    el.innerHTML = `
      <div class="admin-card p-7 admin-anim-item admin-anim-in flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Dashboard · Live D1 data</p>
          <h2 class="font-serif text-4xl lg:text-5xl text-navy mt-2">Good ${part}, ${esc((DATA.role || '').replace(/_/g, ' ').toLowerCase())}</h2>
          <p class="mt-3 text-sm text-mutedgt">Signed in as ${esc(DATA.admin)} · Role: <strong class="text-navy">${esc(DATA.role)}</strong>. Every number below comes from the live database — nothing is fabricated.</p>
        </div>
        <div class="admin-quick">
          ${canDo('quotation.create') ? '<button data-act="new-quotation">+ Create Quotation</button>' : ''}
          ${canDo('orders.create') ? '<button data-act="new-order">+ New Order</button>' : ''}
          ${canDo('customers.create') ? '<button data-act="new-customer">+ Add Customer</button>' : ''}
        </div>
      </div>
      <div class="admin-kpi-grid mt-6">${kpis.map(([l, v]) => `<article class="admin-kpi admin-anim-item admin-anim-in"><strong data-count-to="${Number(v) || 0}">0</strong><span>${l}</span></article>`).join('')}</div>
      <div class="grid lg:grid-cols-2 gap-6 mt-6">
        <section class="admin-card p-6 admin-anim-item admin-anim-in">
          <div class="flex items-center justify-between gap-4 mb-6"><h3 class="admin-section-title">RFQ Funnel (live statuses)</h3><span class="admin-pill">D1</span></div>
          ${funnel.length ? `<div class="admin-chart">${funnel.map((f) => `<span class="admin-bar"><span data-h="${Math.max(6, (f.n / maxF) * 100)}%" style="height:0" title="${esc(f.status)}: ${f.n}"></span><em>${esc(String(f.status || '').replace(/_/g, ' ').slice(0, 12))}</em></span>`).join('')}</div>` : '<p class="text-sm text-mutedgt">No RFQs yet — the funnel activates with the first submission.</p>'}
        </section>
        <section class="admin-card p-6 admin-anim-item admin-anim-in">
          <div class="flex items-center justify-between gap-4 mb-3"><h3 class="admin-section-title">Recent Activity</h3><span class="admin-pill">Latest</span></div>
          ${(DATA.recent_activity || []).length ? `<div class="admin-activity">${DATA.recent_activity.map((r) => `<article class="admin-anim-item admin-anim-in"><span class="type">${esc(r.type)}</span><div><p class="ref">${esc(r.ref || '—')}</p><p class="meta">${esc(r.title || '')}${r.party ? ' · ' + esc(r.party) : ''}</p></div>${statusPill(r.status)}</article>`).join('')}</div>` : '<p class="text-sm text-mutedgt mt-4">No activity yet.</p>'}
        </section>
      </div>
      <div class="grid md:grid-cols-2 gap-6 mt-6">
        <section class="admin-card p-6 admin-anim-item admin-anim-in">
          <h3 class="admin-section-title mb-4">Verification Health</h3>
          <div class="flex items-center gap-8">
            <div><strong class="font-serif text-5xl text-emerald-700" data-count-to="${s.verified_metrics || 0}">0</strong><p class="text-[11px] tracking-widest2 uppercase text-mutedgt mt-2">Verified metrics</p></div>
            <div><strong class="font-serif text-5xl text-amber-600" data-count-to="${s.pending_metrics || 0}">0</strong><p class="text-[11px] tracking-widest2 uppercase text-mutedgt mt-2">Pending verification</p></div>
          </div>
          <p class="mt-4 text-xs text-mutedgt">Only VERIFIED + published metrics ever appear on the public website.</p>
        </section>
        <section class="admin-card p-6 admin-anim-item admin-anim-in">
          <h3 class="admin-section-title mb-4">Verified Product Database</h3>
          <div class="flex items-center gap-8">
            <div><strong class="font-serif text-5xl text-navy" data-count-to="${s.products || 0}">0</strong><p class="text-[11px] tracking-widest2 uppercase text-mutedgt mt-2">Products</p></div>
            <div><strong class="font-serif text-5xl text-navy" data-count-to="${s.product_categories || 0}">0</strong><p class="text-[11px] tracking-widest2 uppercase text-mutedgt mt-2">Categories</p></div>
          </div>
          <p class="mt-4 text-xs text-mutedgt">Catalog is code/CMS-managed with specification templates — technical values are confirmed per order.</p>
        </section>
      </div>`;
    el.addEventListener('click', dashActions);
    animateIn(el);
  }
  function dashActions(e) {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'new-quotation') quotationForm();
    if (b.dataset.act === 'new-order') orderForm();
    if (b.dataset.act === 'new-customer') customerForm();
  }

  // ===== RFQs =====
  function tabRfqs(el) {
    const rows = (DATA.rfqs || []).map((r) => `
      <tr class="admin-row admin-anim-item admin-anim-in">
        <td><button class="admin-link" data-open-rfq="${esc(r.rfq_id)}">${esc(r.rfq_id)}</button></td>
        <td>${esc(r.company_name)}<br/><small class="text-mutedgt">${esc(r.contact_person)} · ${esc(r.email)}</small></td>
        <td>${esc(r.product)}<br/><small class="text-mutedgt">Qty ${esc(r.quantity || '—')} ${esc(r.unit || '')}</small></td>
        <td>${esc(r.country || '—')}</td>
        <td>${canDo('rfq.update') ? statusSelect(r.status, DATA.workflow.rfq, `data-rfq-status="${esc(r.rfq_id)}"`) : statusPill(r.status)}</td>
        <td><small>${fmtDate(r.created_at)}</small></td>
        <td class="whitespace-nowrap">
          ${canDo('quotation.create') ? `<button class="admin-mini-btn" data-quote-rfq="${esc(r.rfq_id)}" title="Create quotation"><i class="fa-solid fa-file-invoice-dollar"></i></button>` : ''}
          ${canDo('rfq.convert') || canDo('orders.create') ? `<button class="admin-mini-btn" data-convert-rfq="${esc(r.rfq_id)}" title="Convert to order"><i class="fa-solid fa-truck-fast"></i></button>` : ''}
        </td>
      </tr>`);
    el.innerHTML = sectionHead('RFQ Management', 'Full workflow: NEW → UNDER REVIEW → ASSIGNED → PRICING → QUOTATION SENT → CUSTOMER REVIEW → APPROVED / REJECTED → CONVERTED TO ORDER. Every change writes an rfq_status_event and audit log.')
      + table(['RFQ', 'Customer', 'Requirement', 'Country', 'Status', 'Received', 'Actions'], rows);
    el.addEventListener('change', async (e) => {
      const sel = e.target.closest('[data-rfq-status]'); if (!sel) return;
      try { const r = await api('/rfqs/' + encodeURIComponent(sel.dataset.rfqStatus) + '/status', { method: 'PATCH', body: JSON.stringify({ status: sel.value }) }); toast('RFQ ' + r.rfq_id + ' → ' + r.new_status.replace(/_/g, ' ')); pulse(sel); refreshData(); }
      catch (err) { toast(err.message, false); }
    });
    el.addEventListener('click', async (e) => {
      const open = e.target.closest('[data-open-rfq]');
      if (open) { await showRfqDetail(open.dataset.openRfq); return; }
      const q = e.target.closest('[data-quote-rfq]');
      if (q) { const rfq = (DATA.rfqs || []).find((x) => x.rfq_id === q.dataset.quoteRfq); quotationForm(rfq); return; }
      const cv = e.target.closest('[data-convert-rfq]');
      if (cv) {
        if (!confirm('Convert ' + cv.dataset.convertRfq + ' into a confirmed order?')) return;
        try { const r = await api('/orders', { method: 'POST', body: JSON.stringify({ rfq_id: cv.dataset.convertRfq }) }); toast('Order ' + r.order_id + ' created.'); await window.gtLoadAdmin(); }
        catch (err) { toast(err.message, false); }
      }
    });
    animateIn(el);
  }

  async function showRfqDetail(id) {
    openDrawer('<div class="p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div>');
    try {
      const d = await api('/rfqs/' + encodeURIComponent(id));
      const r = d.rfq;
      openDrawer(`
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">RFQ Detail</p>
        <h2 class="font-serif text-3xl text-navy mt-1">${esc(r.rfq_id)}</h2>
        <div class="mt-2">${statusPill(r.status)}</div>
        <dl class="admin-dl mt-6">
          ${[['Company', r.company_name], ['Contact', r.contact_person], ['Email', r.email], ['Phone', r.phone], ['Country', r.country], ['Product', r.product], ['Quantity', (r.quantity || '') + ' ' + (r.unit || '')], ['Composition', r.composition], ['GSM', r.gsm], ['Color', r.color], ['Delivery', r.delivery_date], ['Target price', r.target_price]].filter((x) => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        ${r.requirements ? `<div class="mt-5 border-l-2 border-sand pl-4 text-sm text-ink/75">${esc(r.requirements)}</div>` : ''}
        ${d.quotations.length ? `<h3 class="admin-section-title mt-8 mb-3">Quotations</h3>${d.quotations.map((q) => `<div class="admin-event admin-anim-in"><strong>${esc(q.quotation_id)}</strong> · ${esc(q.total)} ${esc(q.currency)} ${statusPill(q.status)}</div>`).join('')}` : ''}
        <h3 class="admin-section-title mt-8 mb-3">Status Timeline</h3>
        <div class="admin-timeline">${d.events.length ? d.events.map((ev) => `<div class="admin-timeline-item admin-anim-item admin-anim-in"><span class="admin-timeline-dot"></span><div><p class="text-sm text-navy font-semibold">${esc((ev.new_status || '').replace(/_/g, ' '))}</p>${ev.note ? `<p class="text-xs text-ink/70 mt-1">${esc(ev.note)}</p>` : ''}<p class="text-[11px] text-mutedgt mt-1">${esc(ev.actor_email || '')} · ${fmtDate(ev.created_at)}</p></div></div>`).join('') : '<p class="text-sm text-mutedgt">No status changes recorded yet.</p>'}</div>`);
      animateIn($('#admin-drawer-body'));
    } catch (err) { openDrawer(card('Unable to load RFQ', esc(err.message))); }
  }

  // ===== QUOTATIONS =====
  function tabQuotations(el) {
    const rows = (DATA.quotations || []).map((q) => `
      <tr class="admin-row admin-anim-item admin-anim-in">
        <td><button class="admin-link" data-open-quote="${esc(q.quotation_id)}">${esc(q.quotation_id)}</button></td>
        <td>${esc(q.company_name || '—')}<br/><small class="text-mutedgt">${esc(q.customer_email)}</small></td>
        <td>${esc(q.rfq_id || '—')}</td>
        <td class="big-num">${esc(q.total)} ${esc(q.currency)}</td>
        <td>${statusPill(q.status)}</td>
        <td><small>${fmtDate(q.created_at)}</small></td>
        <td class="whitespace-nowrap">
          ${q.status === 'DRAFT' && canDo('quotation.send') ? `<button class="admin-mini-btn" data-send-quote="${esc(q.quotation_id)}" title="Send to customer"><i class="fa-solid fa-paper-plane"></i></button>` : ''}
          <a class="admin-mini-btn" href="#" data-doc-quote="${esc(q.quotation_id)}" title="Download document"><i class="fa-solid fa-download"></i></a>
        </td>
      </tr>`);
    el.innerHTML = sectionHead('Quotation Management', 'Create quotations from RFQs with line items, send them to buyers, and track acceptance. Buyers see sent quotations in their portal and can accept or reject.',
      canDo('quotation.create') ? '<button class="admin-primary-btn" data-new-quote><i class="fa-solid fa-plus mr-2"></i>Create Quotation</button>' : '')
      + table(['Quotation', 'Customer', 'RFQ', 'Total', 'Status', 'Created', 'Actions'], rows);
    el.addEventListener('click', async (e) => {
      if (e.target.closest('[data-new-quote]')) { quotationForm(); return; }
      const open = e.target.closest('[data-open-quote]');
      if (open) { await showQuotationDetail(open.dataset.openQuote); return; }
      const send = e.target.closest('[data-send-quote]');
      if (send) {
        try { await api('/quotations/' + encodeURIComponent(send.dataset.sendQuote) + '/status', { method: 'PATCH', body: JSON.stringify({ status: 'SENT' }) }); toast('Quotation sent — visible in the buyer portal now.'); await window.gtLoadAdmin(); }
        catch (err) { toast(err.message, false); }
        return;
      }
      const doc = e.target.closest('[data-doc-quote]');
      if (doc) {
        e.preventDefault();
        try {
          const token = await window.gtAdminToken();
          const res = await fetch('/api/admin/quotations/' + encodeURIComponent(doc.dataset.docQuote) + '/document', { headers: { Authorization: 'Bearer ' + token } });
          if (!res.ok) throw new Error('Download failed');
          const blob = await res.blob(); const a = document.createElement('a');
          a.href = URL.createObjectURL(blob); a.download = doc.dataset.docQuote + '.txt'; a.click(); URL.revokeObjectURL(a.href);
        } catch (err) { toast(err.message, false); }
      }
    });
    animateIn(el);
  }

  async function showQuotationDetail(id) {
    openDrawer('<div class="p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div>');
    try {
      const d = await api('/quotations/' + encodeURIComponent(id));
      const q = d.quotation;
      openDrawer(`
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Quotation</p>
        <h2 class="font-serif text-3xl text-navy mt-1">${esc(q.quotation_id)}</h2>
        <div class="mt-2">${statusPill(q.status)}</div>
        <dl class="admin-dl mt-6">
          ${[['Customer', q.company_name || q.customer_email], ['Email', q.customer_email], ['RFQ', q.rfq_id], ['Currency', q.currency], ['Validity', q.validity], ['Created by', q.created_by]].filter((x) => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <h3 class="admin-section-title mt-7 mb-3">Line Items</h3>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead>
        <tbody>${d.items.map((it) => `<tr><td>${esc(it.description)}</td><td>${esc(it.quantity)} ${esc(it.unit)}</td><td>${esc(it.unit_price)}</td><td class="big-num">${esc(it.amount)}</td></tr>`).join('')}</tbody></table></div>
        <p class="mt-4 text-right font-serif text-2xl text-navy">Total: ${esc(q.total)} ${esc(q.currency)}</p>
        ${q.notes ? `<div class="mt-4 border-l-2 border-sand pl-4 text-sm text-ink/75">${esc(q.notes)}</div>` : ''}`);
      animateIn($('#admin-drawer-body'));
    } catch (err) { openDrawer(card('Unable to load quotation', esc(err.message))); }
  }

  function quotationForm(rfq) {
    openDrawer(`
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">New Quotation</p>
      <h2 class="font-serif text-3xl text-navy mt-1">Create Quotation${rfq ? ' · ' + esc(rfq.rfq_id) : ''}</h2>
      <form id="quote-form" class="mt-6 space-y-4">
        <input type="hidden" name="rfq_id" value="${esc(rfq ? rfq.rfq_id : '')}" />
        <div class="grid sm:grid-cols-2 gap-4">
          <label class="block"><span class="field-label">Customer email *</span><input class="field" name="customer_email" required value="${esc(rfq ? rfq.email : '')}" /></label>
          <label class="block"><span class="field-label">Company</span><input class="field" name="company_name" value="${esc(rfq ? rfq.company_name : '')}" /></label>
          <label class="block"><span class="field-label">Currency</span><input class="field" name="currency" value="USD" /></label>
          <label class="block"><span class="field-label">Validity</span><input class="field" name="validity" placeholder="e.g. 30 days" /></label>
        </div>
        <div id="quote-items" class="space-y-3">
          <p class="field-label">Line items *</p>
          ${quoteItemRow(rfq ? (rfq.product + (rfq.quantity ? '' : '')) : '', rfq ? rfq.quantity : '')}
        </div>
        <button type="button" id="quote-add-item" class="admin-mini-btn"><i class="fa-solid fa-plus mr-1"></i> Add line item</button>
        <label class="block"><span class="field-label">Notes</span><textarea class="field" name="notes" rows="2"></textarea></label>
        <button type="submit" class="admin-primary-btn w-full">Save Quotation (Draft)</button>
      </form>`);
    $('#quote-add-item').addEventListener('click', () => { $('#quote-items').insertAdjacentHTML('beforeend', quoteItemRow()); });
    $('#quote-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const items = $$('.quote-item', f).map((row) => ({
        description: row.querySelector('[data-q-desc]').value,
        quantity: row.querySelector('[data-q-qty]').value,
        unit: row.querySelector('[data-q-unit]').value,
        unit_price: row.querySelector('[data-q-price]').value,
      })).filter((it) => it.description.trim());
      try {
        const r = await api('/quotations', { method: 'POST', body: JSON.stringify({
          rfq_id: f.rfq_id.value, customer_email: f.customer_email.value, company_name: f.company_name.value,
          currency: f.currency.value, validity: f.validity.value, notes: f.notes.value, items,
        }) });
        toast('Quotation ' + r.quotation_id + ' saved (total ' + r.total + ').');
        closeDrawer(); activeTab = 'quotations'; sessionStorage.setItem('gt_admin_tab', 'quotations'); await window.gtLoadAdmin();
      } catch (err) { toast(err.message, false); }
    });
  }
  function quoteItemRow(desc, qty) {
    return `<div class="quote-item grid grid-cols-12 gap-2 admin-anim-in">
      <input class="field col-span-5" data-q-desc placeholder="Description" value="${esc(desc || '')}" />
      <input class="field col-span-2" data-q-qty placeholder="Qty" value="${esc(qty || '')}" />
      <input class="field col-span-2" data-q-unit placeholder="Unit" value="pcs" />
      <input class="field col-span-3" data-q-price placeholder="Unit price" />
    </div>`;
  }

  // ===== SAMPLES =====
  function tabSamples(el) {
    const rows = (DATA.sample_requests || []).map((r) => `
      <tr class="admin-row admin-anim-item admin-anim-in">
        <td>${esc(r.ref_id)}</td>
        <td>${esc(r.product)}</td>
        <td>${esc(r.email)}</td>
        <td>${esc(r.country || '—')}</td>
        <td>${canDo('rfq.update') || canDo('production.update') ? statusSelect(r.status, DATA.workflow.sample, `data-sample-status="${esc(r.ref_id)}"`) : statusPill(r.status)}</td>
        <td><small>${fmtDate(r.created_at)}</small></td>
      </tr>`);
    el.innerHTML = sectionHead('Sample Management', 'Workflow: REQUESTED → REVIEWED → APPROVED → IN PROGRESS → DISPATCHED → DELIVERED → COMPLETED. Buyers see live sample status in their portal.')
      + table(['Reference', 'Product', 'Buyer', 'Country', 'Status', 'Requested'], rows);
    el.addEventListener('change', async (e) => {
      const sel = e.target.closest('[data-sample-status]'); if (!sel) return;
      try { const r = await api('/samples/' + encodeURIComponent(sel.dataset.sampleStatus) + '/status', { method: 'PATCH', body: JSON.stringify({ status: sel.value }) }); toast('Sample ' + r.ref_id + ' → ' + r.new_status.replace(/_/g, ' ')); pulse(sel); refreshData(); }
      catch (err) { toast(err.message, false); }
    });
    animateIn(el);
  }

  // ===== ORDERS =====
  function tabOrders(el) {
    const rows = (DATA.orders || []).map((r) => `
      <tr class="admin-row admin-anim-item admin-anim-in">
        <td><button class="admin-link" data-open-order="${esc(r.order_id)}">${esc(r.order_id)}</button></td>
        <td>${esc(r.company_name || '—')}<br/><small class="text-mutedgt">${esc(r.customer_email)}</small></td>
        <td>${esc(r.product || '—')}<br/><small class="text-mutedgt">Qty ${esc(r.quantity || '—')}</small></td>
        <td>${esc(r.rfq_id || '—')}</td>
        <td>${canDo('orders.update') || canDo('production.update') ? statusSelect(r.status, DATA.workflow.order, `data-order-status="${esc(r.order_id)}"`) : statusPill(r.status)}</td>
        <td><small>${fmtDate(r.created_at)}</small></td>
      </tr>`);
    el.innerHTML = sectionHead('Order Management', 'Production pipeline: CONFIRMED → MATERIAL PLANNING → PRODUCTION → QUALITY → PACKING → SHIPMENT → DELIVERED. Every change is logged and visible in the buyer portal timeline.',
      canDo('orders.create') ? '<button class="admin-primary-btn" data-new-order><i class="fa-solid fa-plus mr-2"></i>New Order</button>' : '')
      + table(['Order', 'Customer', 'Product', 'RFQ', 'Status', 'Created'], rows);
    el.addEventListener('change', async (e) => {
      const sel = e.target.closest('[data-order-status]'); if (!sel) return;
      try { const r = await api('/orders/' + encodeURIComponent(sel.dataset.orderStatus) + '/status', { method: 'PATCH', body: JSON.stringify({ status: sel.value }) }); toast('Order ' + r.order_id + ' → ' + r.new_status.replace(/_/g, ' ')); pulse(sel); refreshData(); }
      catch (err) { toast(err.message, false); }
    });
    el.addEventListener('click', async (e) => {
      if (e.target.closest('[data-new-order]')) { orderForm(); return; }
      const open = e.target.closest('[data-open-order]');
      if (open) { await showOrderDetail(open.dataset.openOrder); }
    });
    animateIn(el);
  }

  async function showOrderDetail(id) {
    openDrawer('<div class="p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div>');
    try {
      const d = await api('/orders/' + encodeURIComponent(id));
      const o = d.order;
      const stages = DATA.workflow.order;
      const idx = stages.indexOf(o.status);
      openDrawer(`
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Order Detail</p>
        <h2 class="font-serif text-3xl text-navy mt-1">${esc(o.order_id)}</h2>
        <div class="mt-2">${statusPill(o.status)}</div>
        <div class="admin-stage-track mt-6">${stages.map((s, i) => `<div class="admin-stage ${i <= idx ? 'done' : ''}"><span></span><em>${s.replace(/_/g, ' ')}</em></div>`).join('')}</div>
        <dl class="admin-dl mt-6">
          ${[['Customer', o.company_name || o.customer_email], ['Email', o.customer_email], ['Product', o.product], ['Quantity', o.quantity], ['RFQ', o.rfq_id], ['Quotation', o.quotation_id], ['Created by', o.created_by]].filter((x) => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <h3 class="admin-section-title mt-8 mb-3">Production Timeline</h3>
        <div class="admin-timeline">${d.events.map((ev) => `<div class="admin-timeline-item admin-anim-item admin-anim-in"><span class="admin-timeline-dot"></span><div><p class="text-sm text-navy font-semibold">${esc((ev.new_status || '').replace(/_/g, ' '))}</p>${ev.note ? `<p class="text-xs text-ink/70 mt-1">${esc(ev.note)}</p>` : ''}<p class="text-[11px] text-mutedgt mt-1">${esc(ev.actor_email || '')} · ${fmtDate(ev.created_at)}</p></div></div>`).join('')}</div>`);
      animateIn($('#admin-drawer-body'));
    } catch (err) { openDrawer(card('Unable to load order', esc(err.message))); }
  }

  function orderForm() {
    openDrawer(`
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">New Order</p>
      <h2 class="font-serif text-3xl text-navy mt-1">Create Order</h2>
      <p class="mt-2 text-xs text-mutedgt">Provide an RFQ ID to convert it, or enter details manually.</p>
      <form id="order-form" class="mt-6 space-y-4">
        <label class="block"><span class="field-label">RFQ ID (optional)</span><input class="field" name="rfq_id" placeholder="RFQ-GT-…" /></label>
        <label class="block"><span class="field-label">Customer email</span><input class="field" name="customer_email" /></label>
        <label class="block"><span class="field-label">Company</span><input class="field" name="company_name" /></label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block"><span class="field-label">Product</span><input class="field" name="product" /></label>
          <label class="block"><span class="field-label">Quantity</span><input class="field" name="quantity" /></label>
        </div>
        <button type="submit" class="admin-primary-btn w-full">Create Order</button>
      </form>`);
    $('#order-form').addEventListener('submit', async (e) => {
      e.preventDefault(); const f = e.target;
      try {
        const r = await api('/orders', { method: 'POST', body: JSON.stringify({ rfq_id: f.rfq_id.value, customer_email: f.customer_email.value, company_name: f.company_name.value, product: f.product.value, quantity: f.quantity.value }) });
        toast('Order ' + r.order_id + ' created.'); closeDrawer(); activeTab = 'orders'; sessionStorage.setItem('gt_admin_tab', 'orders'); await window.gtLoadAdmin();
      } catch (err) { toast(err.message, false); }
    });
  }

  // ===== CUSTOMERS =====
  function tabCustomers(el) {
    const rows = (DATA.customers || []).map((r) => `
      <tr class="admin-row admin-anim-item admin-anim-in">
        <td><button class="admin-link" data-open-customer="${esc(r.email)}">${esc(r.email)}</button></td>
        <td>${esc(r.company || '—')}</td>
        <td>${esc(r.contact_person || '—')}</td>
        <td>${esc(r.country || '—')}</td>
        <td>${statusPill(r.status)}</td>
        <td><small>${fmtDate(r.created_at)}</small></td>
      </tr>`);
    el.innerHTML = sectionHead('Customer CRM', 'Buyer companies with their full history: RFQs, quotations, samples and orders. Buyer data is isolated per company — buyers never see each other\u2019s records.',
      canDo('customers.create') ? '<button class="admin-primary-btn" data-new-customer><i class="fa-solid fa-plus mr-2"></i>Add Customer</button>' : '')
      + table(['Email', 'Company', 'Contact', 'Country', 'Status', 'Since'], rows);
    el.addEventListener('click', async (e) => {
      if (e.target.closest('[data-new-customer]')) { customerForm(); return; }
      const open = e.target.closest('[data-open-customer]');
      if (open) { await showCustomerDetail(open.dataset.openCustomer); }
    });
    animateIn(el);
  }

  async function showCustomerDetail(email) {
    openDrawer('<div class="p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div>');
    try {
      const d = await api('/customers/' + encodeURIComponent(email));
      const cst = d.customer;
      const block = (title, rows, fmt) => rows.length ? `<h3 class="admin-section-title mt-7 mb-3">${title}</h3>${rows.map(fmt).join('')}` : '';
      openDrawer(`
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Customer Profile</p>
        <h2 class="font-serif text-3xl text-navy mt-1">${esc(cst.company || cst.email)}</h2>
        <dl class="admin-dl mt-6">
          ${[['Email', cst.email], ['Contact', cst.contact_person], ['Country', cst.country], ['Phone', cst.phone]].filter((x) => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        ${cst.notes ? `<div class="mt-4 border-l-2 border-sand pl-4 text-sm text-ink/75">${esc(cst.notes)}</div>` : ''}
        ${block('RFQs', d.rfqs, (r) => `<div class="admin-event admin-anim-in"><strong>${esc(r.rfq_id)}</strong> · ${esc(r.product)} ${statusPill(r.status)}</div>`)}
        ${block('Quotations', d.quotations, (r) => `<div class="admin-event admin-anim-in"><strong>${esc(r.quotation_id)}</strong> · ${esc(r.total)} ${esc(r.currency)} ${statusPill(r.status)}</div>`)}
        ${block('Samples', d.samples, (r) => `<div class="admin-event admin-anim-in"><strong>${esc(r.ref_id)}</strong> · ${esc(r.product)} ${statusPill(r.status)}</div>`)}
        ${block('Orders', d.orders, (r) => `<div class="admin-event admin-anim-in"><strong>${esc(r.order_id)}</strong> · ${esc(r.product)} ${statusPill(r.status)}</div>`)}`);
      animateIn($('#admin-drawer-body'));
    } catch (err) { openDrawer(card('Unable to load customer', esc(err.message))); }
  }

  function customerForm() {
    openDrawer(`
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">CRM</p>
      <h2 class="font-serif text-3xl text-navy mt-1">Add / Update Customer</h2>
      <form id="customer-form" class="mt-6 space-y-4">
        <label class="block"><span class="field-label">Email *</span><input class="field" name="email" required /></label>
        <label class="block"><span class="field-label">Company</span><input class="field" name="company" /></label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block"><span class="field-label">Contact person</span><input class="field" name="contact_person" /></label>
          <label class="block"><span class="field-label">Country</span><input class="field" name="country" /></label>
        </div>
        <label class="block"><span class="field-label">Phone</span><input class="field" name="phone" /></label>
        <label class="block"><span class="field-label">Notes</span><textarea class="field" name="notes" rows="2"></textarea></label>
        <button type="submit" class="admin-primary-btn w-full">Save Customer</button>
      </form>`);
    $('#customer-form').addEventListener('submit', async (e) => {
      e.preventDefault(); const f = e.target;
      try {
        await api('/customers', { method: 'POST', body: JSON.stringify({ email: f.email.value, company: f.company.value, contact_person: f.contact_person.value, country: f.country.value, phone: f.phone.value, notes: f.notes.value }) });
        toast('Customer saved.'); closeDrawer(); activeTab = 'customers'; sessionStorage.setItem('gt_admin_tab', 'customers'); await window.gtLoadAdmin();
      } catch (err) { toast(err.message, false); }
    });
  }

  // ===== VERIFICATION CENTER =====
  async function tabVerification(el) {
    el.innerHTML = sectionHead('Verification Center', 'Company facts, capability figures and sustainability metrics live here. Only VERIFIED + published entries ever appear on the public website. Conflicting public figures stay marked as requiring management verification — the platform never chooses a convenient number.',
      canDo('cms.create') ? '<button class="admin-primary-btn" data-new-metric><i class="fa-solid fa-plus mr-2"></i>Add Metric</button>' : '')
      + '<div id="metric-list" class="mt-2"><div class="admin-card p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div></div>';
    el.addEventListener('click', metricActions);
    try {
      const d = await api('/metrics');
      const groups = {};
      (d.metrics || []).forEach((m) => { (groups[m.category] = groups[m.category] || []).push(m); });
      $('#metric-list', el).innerHTML = Object.keys(groups).sort().map((cat) => `
        <h3 class="admin-section-title mt-6 mb-3 capitalize">${esc(cat)} metrics</h3>
        ${table(['Metric', 'Value', 'Year', 'Source', 'Verification', 'Public', 'Actions'], groups[cat].map((m) => `
          <tr class="admin-row admin-anim-item admin-anim-in">
            <td class="font-semibold text-navy">${esc(m.label)}</td>
            <td>${m.value ? esc(m.value) + (m.unit ? ' ' + esc(m.unit) : '') : '<em class="text-mutedgt">Requires management verification</em>'}</td>
            <td>${esc(m.year || '—')}</td>
            <td>${esc(m.source || '—')}</td>
            <td>${canDo('cms.publish') ? statusSelect(m.status, ['VERIFIED', 'PENDING_VERIFICATION', 'NEEDS_REVIEW', 'EXPIRED'], `data-metric-status="${m.id}"`) : statusPill(m.status)}</td>
            <td>${m.status === 'VERIFIED' && canDo('cms.publish') ? `<button class="admin-toggle ${m.published ? 'on' : ''}" data-metric-publish="${m.id}" data-on="${m.published ? 1 : 0}" title="Toggle public visibility"><span></span></button>` : (m.published ? statusPill('VERIFIED') : '<small class="text-mutedgt">Hidden</small>')}</td>
            <td>${canDo('cms.publish') ? `<button class="admin-mini-btn" data-metric-delete="${m.id}" title="Delete"><i class="fa-solid fa-trash-can"></i></button>` : ''}</td>
          </tr>`))}`).join('') || '<div class="admin-card p-8 text-center text-sm text-mutedgt">No metrics yet.</div>';
      el.addEventListener('change', async (e) => {
        const sel = e.target.closest('[data-metric-status]'); if (!sel) return;
        try { await api('/metrics/' + sel.dataset.metricStatus, { method: 'PATCH', body: JSON.stringify({ status: sel.value }) }); toast('Metric verification updated.'); pulse(sel); tabVerification(el); }
        catch (err) { toast(err.message, false); }
      });
      animateIn(el);
    } catch (err) { $('#metric-list', el).innerHTML = card('Unable to load metrics', esc(err.message)); }
  }
  async function metricActions(e) {
    if (e.target.closest('[data-new-metric]')) {
      openDrawer(`
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Verification Center</p>
        <h2 class="font-serif text-3xl text-navy mt-1">Add Verified Metric</h2>
        <p class="mt-2 text-xs text-mutedgt">Only add values confirmed by Gumti Textiles Ltd. management or public registrations. Unconfirmed values should stay PENDING VERIFICATION.</p>
        <form id="metric-form" class="mt-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="block"><span class="field-label">Category</span><select class="field" name="category"><option value="sustainability">Sustainability</option><option value="capability">Capability</option><option value="company">Company</option></select></label>
            <label class="block"><span class="field-label">Year</span><input class="field" name="year" /></label>
          </div>
          <label class="block"><span class="field-label">Metric label *</span><input class="field" name="label" required /></label>
          <div class="grid grid-cols-2 gap-4">
            <label class="block"><span class="field-label">Value</span><input class="field" name="value" /></label>
            <label class="block"><span class="field-label">Unit</span><input class="field" name="unit" /></label>
          </div>
          <label class="block"><span class="field-label">Source *</span><input class="field" name="source" placeholder="e.g. BGMEA public listing / management confirmation" /></label>
          <label class="block"><span class="field-label">Verification status</span><select class="field" name="status"><option value="PENDING_VERIFICATION">Pending verification</option><option value="NEEDS_REVIEW">Needs review</option><option value="VERIFIED">Verified</option></select></label>
          <button type="submit" class="admin-primary-btn w-full">Save Metric</button>
        </form>`);
      $('#metric-form').addEventListener('submit', async (ev) => {
        ev.preventDefault(); const f = ev.target;
        try {
          await api('/metrics', { method: 'POST', body: JSON.stringify({ category: f.category.value, label: f.label.value, value: f.value.value, unit: f.unit.value, year: f.year.value, source: f.source.value, status: f.status.value }) });
          toast('Metric saved.'); closeDrawer(); await window.gtLoadAdmin();
        } catch (err) { toast(err.message, false); }
      });
      return;
    }
    const pub = e.target.closest('[data-metric-publish]');
    if (pub) {
      const on = pub.dataset.on === '1';
      try { await api('/metrics/' + pub.dataset.metricPublish, { method: 'PATCH', body: JSON.stringify({ published: !on }) }); pub.classList.toggle('on', !on); pub.dataset.on = on ? '0' : '1'; toast(!on ? 'Metric is now public.' : 'Metric hidden from public site.'); }
      catch (err) { toast(err.message, false); }
      return;
    }
    const del = e.target.closest('[data-metric-delete]');
    if (del) {
      if (!confirm('Delete this metric?')) return;
      try { await api('/metrics/' + del.dataset.metricDelete, { method: 'DELETE' }); toast('Metric deleted.'); del.closest('tr').classList.add('admin-row-out'); setTimeout(() => window.gtLoadAdmin(), 350); }
      catch (err) { toast(err.message, false); }
    }
  }

  // ===== EXPORT MARKETS =====
  async function tabMarkets(el) {
    el.innerHTML = sectionHead('Export Markets', 'The public Global Reach page only shows VERIFIED + published markets. Until markets are verified, the site displays "Serving international markets from Bangladesh" — no countries are invented.',
      canDo('cms.create') ? '<button class="admin-primary-btn" data-new-market><i class="fa-solid fa-plus mr-2"></i>Add Market</button>' : '')
      + '<div id="market-list" class="mt-2"><div class="admin-card p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div></div>';
    el.addEventListener('click', marketActions);
    try {
      const d = await api('/markets');
      $('#market-list', el).innerHTML = (d.markets || []).length ? table(['Country', 'Region', 'Products', 'Verification', 'Public', 'Actions'], d.markets.map((m) => `
        <tr class="admin-row admin-anim-item admin-anim-in">
          <td class="font-semibold text-navy">${esc(m.country)}</td>
          <td>${esc(m.region || '—')}</td>
          <td>${esc(m.products || '—')}</td>
          <td>${canDo('cms.publish') ? statusSelect(m.status, ['VERIFIED', 'PENDING_VERIFICATION'], `data-market-status="${m.id}"`) : statusPill(m.status)}</td>
          <td>${m.status === 'VERIFIED' && canDo('cms.publish') ? `<button class="admin-toggle ${m.published ? 'on' : ''}" data-market-publish="${m.id}" data-on="${m.published ? 1 : 0}"><span></span></button>` : '<small class="text-mutedgt">Hidden</small>'}</td>
          <td>${canDo('cms.publish') ? `<button class="admin-mini-btn" data-market-delete="${m.id}"><i class="fa-solid fa-trash-can"></i></button>` : ''}</td>
        </tr>`)) : '<div class="admin-card p-8 text-center text-sm text-mutedgt admin-anim-in">No export markets recorded yet. The public site shows "Serving international markets from Bangladesh."</div>';
      el.addEventListener('change', async (e) => {
        const sel = e.target.closest('[data-market-status]'); if (!sel) return;
        try { await api('/markets/' + sel.dataset.marketStatus, { method: 'PATCH', body: JSON.stringify({ status: sel.value }) }); toast('Market verification updated.'); pulse(sel); tabMarkets(el); }
        catch (err) { toast(err.message, false); }
      });
      animateIn(el);
    } catch (err) { $('#market-list', el).innerHTML = card('Unable to load markets', esc(err.message)); }
  }
  async function marketActions(e) {
    if (e.target.closest('[data-new-market]')) {
      openDrawer(`
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Global Reach</p>
        <h2 class="font-serif text-3xl text-navy mt-1">Add Export Market</h2>
        <p class="mt-2 text-xs text-mutedgt">Only add markets confirmed by Gumti Textiles Ltd. management.</p>
        <form id="market-form" class="mt-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="block"><span class="field-label">Country *</span><input class="field" name="country" required /></label>
            <label class="block"><span class="field-label">Region</span><input class="field" name="region" placeholder="Europe / North America / Asia…" /></label>
          </div>
          <label class="block"><span class="field-label">Products</span><input class="field" name="products" placeholder="e.g. Polo shirts, T-shirts" /></label>
          <label class="block"><span class="field-label">Description</span><textarea class="field" name="description" rows="2"></textarea></label>
          <label class="block"><span class="field-label">Verification</span><select class="field" name="status"><option value="PENDING_VERIFICATION">Pending verification</option><option value="VERIFIED">Verified by management</option></select></label>
          <button type="submit" class="admin-primary-btn w-full">Save Market</button>
        </form>`);
      $('#market-form').addEventListener('submit', async (ev) => {
        ev.preventDefault(); const f = ev.target;
        try {
          await api('/markets', { method: 'POST', body: JSON.stringify({ country: f.country.value, region: f.region.value, products: f.products.value, description: f.description.value, status: f.status.value }) });
          toast('Market saved.'); closeDrawer(); await window.gtLoadAdmin();
        } catch (err) { toast(err.message, false); }
      });
      return;
    }
    const pub = e.target.closest('[data-market-publish]');
    if (pub) {
      const on = pub.dataset.on === '1';
      try { await api('/markets/' + pub.dataset.marketPublish, { method: 'PATCH', body: JSON.stringify({ published: !on }) }); pub.classList.toggle('on', !on); pub.dataset.on = on ? '0' : '1'; toast(!on ? 'Market visible on public site.' : 'Market hidden.'); }
      catch (err) { toast(err.message, false); }
      return;
    }
    const del = e.target.closest('[data-market-delete]');
    if (del) {
      if (!confirm('Delete this market?')) return;
      try { await api('/markets/' + del.dataset.marketDelete, { method: 'DELETE' }); toast('Market deleted.'); del.closest('tr').classList.add('admin-row-out'); setTimeout(() => window.gtLoadAdmin(), 350); }
      catch (err) { toast(err.message, false); }
    }
  }

  // ===== USERS & ROLES =====
  async function tabUsers(el) {
    el.innerHTML = sectionHead('Users & Roles', 'Enterprise RBAC: Firebase provides identity, D1 holds the authoritative role and permission set. Roles: SUPER ADMIN, ADMIN, SALES MANAGER, SALES EXECUTIVE, MERCHANDISING, PRODUCTION MANAGER, QUALITY MANAGER, HR MANAGER, CONTENT MANAGER, VIEWER, BUYER.',
      canDo('users.assign_role') ? '<button class="admin-primary-btn" data-new-user><i class="fa-solid fa-plus mr-2"></i>Add User</button>' : '')
      + '<div id="user-list" class="mt-2"><div class="admin-card p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div></div>';
    try {
      const d = await api('/users');
      $('#user-list', el).innerHTML = table(['Email', 'Name', 'Role', 'Status', 'Joined'], (d.users || []).map((u) => `
        <tr class="admin-row admin-anim-item admin-anim-in">
          <td class="font-semibold text-navy">${esc(u.email)}</td>
          <td>${esc(u.display_name || '—')}${u.company ? `<br/><small class="text-mutedgt">${esc(u.company)}</small>` : ''}</td>
          <td>${canDo('users.assign_role') ? statusSelect(u.role, d.roles, `data-user-role="${esc(u.email)}"`) : statusPill(u.role)}</td>
          <td>${canDo('users.assign_role') ? statusSelect(u.status, ['ACTIVE', 'DISABLED'], `data-user-status="${esc(u.email)}"`) : statusPill(u.status)}</td>
          <td><small>${fmtDate(u.created_at)}</small></td>
        </tr>`));
      el.addEventListener('change', async (e) => {
        const role = e.target.closest('[data-user-role]');
        const status = e.target.closest('[data-user-status]');
        const t = role || status; if (!t) return;
        const body = role ? { role: t.value } : { status: t.value };
        try { await api('/users/' + encodeURIComponent(t.dataset.userRole || t.dataset.userStatus), { method: 'PATCH', body: JSON.stringify(body) }); toast('User updated.'); pulse(t); }
        catch (err) { toast(err.message, false); tabUsers(el); }
      });
      el.addEventListener('click', (e) => {
        if (!e.target.closest('[data-new-user]')) return;
        openDrawer(`
          <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">RBAC</p>
          <h2 class="font-serif text-3xl text-navy mt-1">Add Staff User</h2>
          <p class="mt-2 text-xs text-mutedgt">The user signs in with this email via Firebase (Google or Email/Password); the assigned D1 role controls what they can do.</p>
          <form id="user-form" class="mt-6 space-y-4">
            <label class="block"><span class="field-label">Email *</span><input class="field" name="email" required /></label>
            <label class="block"><span class="field-label">Role</span><select class="field" name="role">${d.roles.map((r) => `<option value="${r}">${r.replace(/_/g, ' ')}</option>`).join('')}</select></label>
            <button type="submit" class="admin-primary-btn w-full">Save User</button>
          </form>`);
        $('#user-form').addEventListener('submit', async (ev) => {
          ev.preventDefault(); const f = ev.target;
          try { await api('/users/' + encodeURIComponent(f.email.value), { method: 'PATCH', body: JSON.stringify({ role: f.role.value, status: 'ACTIVE' }) }); toast('User saved.'); closeDrawer(); tabUsers(el); }
          catch (err) { toast(err.message, false); }
        });
      });
      animateIn(el);
    } catch (err) { $('#user-list', el).innerHTML = card('Unable to load users', esc(err.message)); }
  }

  // ===== AUDIT LOGS =====
  async function tabAudit(el) {
    el.innerHTML = sectionHead('Audit Logs', 'Every role change, status update, quotation, order, metric and market change is recorded with actor, old value, new value and timestamp.')
      + '<div id="audit-list" class="mt-2"><div class="admin-card p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div></div>';
    try {
      const d = await api('/audit');
      $('#audit-list', el).innerHTML = (d.audit || []).length ? table(['When', 'Actor', 'Action', 'Entity', 'Old → New'], d.audit.map((a) => `
        <tr class="admin-row admin-anim-item admin-anim-in">
          <td><small>${fmtDate(a.created_at)}</small></td>
          <td>${esc(a.actor_email)}</td>
          <td><span class="admin-pill">${esc(a.action)}</span></td>
          <td>${esc(a.entity)} <small class="text-mutedgt">${esc(a.entity_id || '')}</small></td>
          <td><small class="text-mutedgt">${esc(a.old_value || '—')}</small><br/><small class="text-navy">${esc(a.new_value || '—')}</small></td>
        </tr>`)) : '<div class="admin-card p-8 text-center text-sm text-mutedgt admin-anim-in">No audit entries yet — they appear as soon as workflows are used.</div>';
      animateIn(el);
    } catch (err) { $('#audit-list', el).innerHTML = card('Unable to load audit logs', esc(err.message)); }
  }

  // ===== AI ANALYTICS =====
  async function tabAi(el) {
    el.innerHTML = sectionHead('AI Analytics', 'GUMTI AI conversation analytics. Only the question text and whether it matched verified data are stored — no personal information.')
      + '<div id="ai-list" class="mt-2"><div class="admin-card p-8 text-center text-mutedgt"><span class="admin-spinner"></span></div></div>';
    try {
      const d = await api('/ai-analytics');
      $('#ai-list', el).innerHTML = `
        <div class="admin-kpi-grid">
          <article class="admin-kpi admin-anim-item admin-anim-in"><strong data-count-to="${d.total}">0</strong><span>Total conversations</span></article>
          <article class="admin-kpi admin-anim-item admin-anim-in"><strong data-count-to="${d.matched}">0</strong><span>Matched verified data</span></article>
          <article class="admin-kpi admin-anim-item admin-anim-in"><strong data-count-to="${d.unmatched}">0</strong><span>Escalated to sales</span></article>
          <article class="admin-kpi admin-anim-item admin-anim-in"><strong>${d.total ? Math.round((d.matched / d.total) * 100) : 0}%</strong><span>Match rate</span></article>
        </div>
        ${(d.recent || []).length ? '<h3 class="admin-section-title mt-8 mb-3">Recent queries</h3>' + table(['Query', 'Result', 'When'], d.recent.map((r) => `
          <tr class="admin-row admin-anim-item admin-anim-in"><td>${esc(r.query)}</td><td>${r.matched ? statusPill('VERIFIED') : statusPill('NEEDS_REVIEW')}</td><td><small>${fmtDate(r.created_at)}</small></td></tr>`)) : ''}`;
      animateIn(el);
    } catch (err) { $('#ai-list', el).innerHTML = card('Unable to load AI analytics', esc(err.message)); }
  }

  // ---------- shared helpers ----------
  function sectionHead(title, desc, action) {
    return `<div class="admin-card p-7 admin-anim-item admin-anim-in flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
      <div><h2 class="font-serif text-3xl lg:text-4xl text-navy">${title}</h2><p class="mt-3 text-sm text-mutedgt max-w-2xl leading-relaxed">${desc}</p></div>
      ${action ? `<div>${action}</div>` : ''}
    </div>`;
  }
  function pulse(el) {
    const row = el.closest('tr') || el;
    row.classList.remove('admin-row-pulse'); void row.offsetWidth; row.classList.add('admin-row-pulse');
  }
  async function refreshData() {
    try { DATA = await api('/overview'); PERMS = new Set(DATA.permissions || []); } catch (_) {}
  }

  document.addEventListener('gt:auth', () => { if ($('#admin-data')) window.gtLoadAdmin(); });
  document.addEventListener('click', (e) => { if (e.target.closest('#admin-refresh')) window.gtLoadAdmin(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
})();
