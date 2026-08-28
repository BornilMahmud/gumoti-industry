// Gumti Textiles — premium motion, AI, forms, portal behaviors
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Loader: maximum ~1 second, skipped for reduced motion.
  const loader = $('#gt-loader');
  if (loader) {
    const done = () => loader.classList.add('done');
    if (reduced || sessionStorage.getItem('gt_loaded')) done();
    else { sessionStorage.setItem('gt_loaded', '1'); window.addEventListener('load', () => setTimeout(done, 950)); setTimeout(done, 1300); }
  }

  // Header: solid state + hide on scroll down, reveal up.
  const header = $('#site-header');
  const alwaysDark = header && header.dataset.darkNav === '1';
  let lastY = window.scrollY;
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (header) {
        if (alwaysDark || y > 32) header.classList.add('nav-solid'); else header.classList.remove('nav-solid');
        if (y > 160 && y > lastY + 8) header.classList.add('nav-hidden');
        else if (y < lastY - 8 || y < 100) header.classList.remove('nav-hidden');
      }
      const progress = $('#scroll-progress');
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      updateJourney();
      lastY = y; ticking = false;
    });
  }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu.
  const menu = $('#mobile-menu'), btnOpen = $('#mobile-menu-btn'), btnClose = $('#mobile-menu-close');
  function setMenu(open) { if (!menu) return; menu.classList.toggle('hidden', !open); menu.classList.toggle('flex', open); document.body.style.overflow = open ? 'hidden' : ''; btnOpen && btnOpen.setAttribute('aria-expanded', String(open)); if (open && btnClose) btnClose.focus(); }
  btnOpen && btnOpen.addEventListener('click', () => setMenu(true));
  btnClose && btnClose.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); closeAI(); } });

  // Native cursor: requested normal browser mouse; no custom cursor is initialized.

  // Magnetic buttons, subtle 5–10px.
  if (!reduced && !touch) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // Scroll reveal.
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    $$('.reveal, .reveal-img, .word-mask').forEach((el) => io.observe(el));
  } else $$('.reveal, .reveal-img, .word-mask').forEach((el) => el.classList.add('in'));

  // Number counters.
  if (!reduced && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return; cio.unobserve(en.target);
      const el = en.target, target = parseInt(el.dataset.count, 10) || 0, t0 = performance.now(), dur = 1300;
      (function tick(t) { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toString(); if (p < 1) requestAnimationFrame(tick); })(t0);
    }), { threshold: 0.5 });
    $$('[data-count]').forEach((el) => cio.observe(el));
  }

  // Signature journey: scroll-driven stage changes.
  const journey = $('#journey-signature');
  function updateJourney() {
    if (!journey || reduced) return;
    const rect = journey.getBoundingClientRect();
    const total = Math.max(1, rect.height - innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    const stages = $$('.journey-stage-data', journey);
    const active = Math.min(stages.length - 1, Math.floor(progress * stages.length));
    $$('.journey-bg img', journey).forEach((img, i) => img.classList.toggle('active', i === active));
    $$('.journey-dots button', journey).forEach((b, i) => b.classList.toggle('active', i === active));
    const data = stages[active];
    if (data) {
      $('#journey-no') && ($('#journey-no').textContent = data.dataset.num || '01');
      $('#journey-title') && ($('#journey-title').textContent = data.dataset.name || 'KNITTING');
      $('#journey-tag') && ($('#journey-tag').textContent = data.dataset.tag || 'Precision begins at the fabric stage.');
      $('#journey-desc') && ($('#journey-desc').textContent = data.dataset.desc || '');
      $('#journey-progress span') && ($('#journey-progress span').style.width = ((active + 1) / stages.length) * 100 + '%');
    }
  }
  updateJourney(); window.addEventListener('resize', updateJourney, { passive: true });

  // Accordion fallback for older capability panels.
  $$('.cap-item').forEach((item) => {
    const btn = $('.cap-toggle', item);
    btn && btn.addEventListener('click', () => {
      const open = item.dataset.open === '1';
      $$('.cap-item').forEach((i) => { i.dataset.open = '0'; $('.cap-toggle', i)?.setAttribute('aria-expanded', 'false'); });
      item.dataset.open = open ? '0' : '1'; btn.setAttribute('aria-expanded', String(!open));
    });
  });

  // Fabric-to-garment slider.
  const cmp = $('#fabric-compare');
  if (cmp) {
    const range = $('input[type=range]', cmp), topImg = $('.cmp-top', cmp), bar = $('.cmp-bar', cmp);
    range && range.addEventListener('input', () => { const v = range.value; if (topImg) topImg.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)'; if (bar) bar.style.left = v + '%'; });
  }

  // Toast.
  window.gtToast = function (msg, ok) {
    const t = $('#toast'); if (!t) return; t.textContent = msg; t.style.borderColor = ok === false ? '#DC2626' : '#C7B79C'; t.classList.remove('hidden'); t.classList.add('toast-in'); clearTimeout(window.__toastT); window.__toastT = setTimeout(() => t.classList.add('hidden'), 5000);
  };

  // Product filters with fade/scale transition.
  const filterForm = $('#product-filters');
  if (filterForm) {
    const grid = $('#product-grid'), count = $('#product-count'); let deb;
    async function applyFilters(push) {
      const fd = new FormData(filterForm), params = new URLSearchParams();
      for (const [k, v] of fd.entries()) if (v) params.set(k, v);
      const qs = params.toString(); if (push) history.replaceState(null, '', qs ? '/products?' + qs : '/products');
      document.body.classList.add('filtering');
      try { const res = await fetch('/api/products?' + qs); const data = await res.json(); setTimeout(() => { if (grid) grid.innerHTML = data.html; if (count) count.textContent = data.count + ' product' + (data.count === 1 ? '' : 's'); document.body.classList.remove('filtering'); }, 180); }
      catch (_) { document.body.classList.remove('filtering'); }
    }
    filterForm.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => applyFilters(true), 220); });
    filterForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(true); });
  }

  // Product comparison.
  const CMP_KEY = 'gt_compare';
  function getCompare() { try { return JSON.parse(localStorage.getItem(CMP_KEY) || '[]'); } catch { return []; } }
  function setCompare(list) { localStorage.setItem(CMP_KEY, JSON.stringify(list.slice(0, 3))); updateCompareBar(); }
  function updateCompareBar() {
    const bar = $('#compare-bar'); if (!bar) return; const list = getCompare(); bar.classList.toggle('hidden', list.length === 0); $('#compare-count') && ($('#compare-count').textContent = list.length); $('#compare-link') && ($('#compare-link').href = '/products/compare?items=' + list.join(','));
    $$('[data-compare]').forEach((b) => { const on = list.includes(b.dataset.compare); b.classList.toggle('bg-navy', on); b.classList.toggle('text-white', on); const s = $('span', b); if (s) s.textContent = on ? 'In Compare' : 'Compare'; });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-compare]'); if (!b) return; e.preventDefault(); let list = getCompare(); const slug = b.dataset.compare; if (list.includes(slug)) list = list.filter((s) => s !== slug); else if (list.length >= 3) { window.gtToast('You can compare up to 3 products.', false); return; } else list.push(slug); setCompare(list);
  });
  $('#compare-clear')?.addEventListener('click', () => setCompare([])); updateCompareBar();

  // Generic AJAX forms: loading state + success check animation.
  $$('form[data-ajax]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); const btn = form.querySelector('[type=submit]'); const orig = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.dataset.loading = '1'; btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Submitting…'; }
      const payload = {}; new FormData(form).forEach((v, k) => { payload[k] = v; });
      if (window.gtUser) { payload._uid = window.gtUser.uid; payload._userEmail = window.gtUser.email; }
      try {
        const res = await fetch(form.dataset.ajax, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json(); if (!res.ok || data.error) throw new Error(data.error || 'Submission failed');
        const ok = document.getElementById(form.dataset.success || '');
        if (ok) { form.classList.add('hidden'); ok.classList.remove('hidden'); const icon = ok.querySelector('i'); if (icon) icon.classList.add('success-check'); const idEl = ok.querySelector('[data-ref-id]'); if (idEl && data.id) idEl.textContent = data.id; ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); }
        else { window.gtToast(data.message || 'Submitted successfully.'); form.reset(); }
        if (window.gtFirestoreSave && data.collection) window.gtFirestoreSave(data.collection, Object.assign({}, payload, { refId: data.id || null }));
      } catch (err) { window.gtToast(err.message || 'Something went wrong. Please try again.', false); }
      finally { if (btn) { btn.disabled = false; btn.innerHTML = orig; delete btn.dataset.loading; } }
    });
  });

  // GUMTI AI: verified retrieval only via server product/company endpoint.
  const ai = $('#gumti-ai'), aiPanel = $('#ai-panel'), aiToggle = $('#ai-toggle'), aiClose = $('#ai-close'), aiForm = $('#ai-form'), aiInput = $('#ai-input'), aiMessages = $('#ai-messages');
  function openAI() { if (!aiPanel || !aiToggle) return; aiPanel.hidden = false; aiToggle.setAttribute('aria-expanded', 'true'); setTimeout(() => aiInput && aiInput.focus(), 50); try { navigator.sendBeacon && navigator.sendBeacon('/api/analytics', JSON.stringify({ event: 'ai_open' })); } catch (_) {} }
  function closeAI() { if (!aiPanel || !aiToggle) return; aiPanel.hidden = true; aiToggle.setAttribute('aria-expanded', 'false'); }
  window.closeAI = closeAI;
  aiToggle && aiToggle.addEventListener('click', () => aiPanel.hidden ? openAI() : closeAI());
  aiClose && aiClose.addEventListener('click', closeAI);
  function aiMsg(text, who, html, source) {
    if (!aiMessages) return;
    const m = document.createElement('article'); m.className = 'ai-msg ' + (who || 'bot');
    m.innerHTML = html || `<p>${esc(text)}</p>${source ? `<small>Source: ${esc(source)}</small>` : ''}`;
    aiMessages.appendChild(m); aiMessages.scrollTop = aiMessages.scrollHeight;
  }
  async function askAI(q) {
    aiMsg(q, 'user');
    const typing = document.createElement('article'); typing.className = 'ai-msg bot'; typing.innerHTML = '<p>Checking verified Gumti data<span class="dots">...</span></p>'; aiMessages.appendChild(typing); aiMessages.scrollTop = aiMessages.scrollHeight;
    try {
      const res = await fetch('/api/ai?q=' + encodeURIComponent(q)); const data = await res.json(); typing.remove();
      if (data.html) aiMsg('', 'bot', data.html, data.source);
      else aiMsg(data.message || "I don't have verified information for that requirement. Please contact our sales team.", 'bot', '', data.source || 'Gumti Company Information');
    } catch (_) { typing.remove(); aiMsg("I don't have verified information for that requirement. Please contact our sales team.", 'bot', '', 'Gumti Company Information'); }
  }
  aiForm && aiForm.addEventListener('submit', (e) => { e.preventDefault(); const q = aiInput.value.trim(); if (!q) return; aiInput.value = ''; askAI(q); });
  $$('.ai-quick [data-ai-q]').forEach((b) => b.addEventListener('click', () => { openAI(); askAI(b.dataset.aiQ); }));

  // Admin page loader (Firebase token supplied by firebase-app.js helper).
  const adminModules = [
    { group: 'Business', id: 'admin-business', items: [
      ['Customers / CRM', 'Registered buyer profiles, RFQ history and communication timeline.', false],
      ['RFQ Management', 'Live RFQ intake from D1 with status tracking and sales review.', true],
      ['Quotation Management', 'Create quotation PDFs from RFQs and send to customers.', false],
      ['Sample Management', 'Sample requests, approval stages and shipment progress.', true],
      ['Order Management', 'Confirmed orders, delivery milestones and customer portal progress.', false],
    ]},
    { group: 'Products', id: 'admin-products', items: [
      ['Product Management', 'Verified catalog, specs, publish status and product media.', true],
      ['Category Management', 'Catalog categories, ordering, SEO and visibility.', true],
      ['Certification Management', 'Certificate records, status, expiry and public display control.', false],
    ]},
    { group: 'Manufacturing', id: 'admin-manufacturing', items: [
      ['Production Management', 'Knitting, dyeing, finishing, garment, quality and packing stages.', false],
      ['Quality Management', 'Inspection results, test reports and quality documents.', false],
      ['Factory Management', 'Facilities, machinery, factory media and capability information.', false],
      ['Sustainability Management', 'Verified sustainability metrics and source references.', false],
      ['Global Market Management', 'Interactive market map and country visibility controls.', false],
    ]},
    { group: 'Content & CMS', id: 'admin-content', items: [
      ['News Management', 'Company news, announcements, scheduling and SEO.', true],
      ['Career Management', 'Job posts and application intake.', true],
      ['Media Library', 'Factory, product, certificate, video and document assets.', false],
      ['Website CMS', 'Homepage, about, capabilities, quality and contact content editing.', false],
    ]},
    { group: 'AI & Analytics', id: 'admin-intelligence', items: [
      ['AI Assistant Management', 'Knowledge sources, FAQs, escalation and AI analytics.', false],
      ['Search Management', 'Keywords, synonyms, featured products and ranking.', false],
      ['Analytics', 'Traffic, product views, RFQ conversion and AI performance.', false],
      ['Notifications', 'New RFQ, sample, quotation, application and certificate alerts.', false],
    ]},
    { group: 'Governance', id: 'admin-governance', items: [
      ['Users & Permissions', 'Super admin, sales, production, quality, HR and content roles.', false],
      ['Audit Logs', 'Who changed what, previous value, new value and timestamp.', false],
      ['Global Settings', 'Company info, social links, SEO, AI and security controls.', false],
      ['Verification Center', 'Draft, internal review, verification, approval and publishing workflow.', false],
    ]},
  ];
  window.gtLoadAdmin = async function () {
    const root = $('#admin-data'); if (!root) return;
    if (!window.gtUser) { root.innerHTML = '<div class="admin-card p-8 text-center text-mutedgt">Please sign in with an authorized admin email.</div>'; return; }
    if (!window.gtAdminToken) { root.innerHTML = '<div class="admin-card p-8 text-center text-mutedgt">Firebase is still loading. Try again in a moment.</div>'; return; }
    root.innerHTML = '<div class="admin-card p-8 text-center text-mutedgt">Loading Gumti admin dashboard…</div>';
    try {
      const token = await window.gtAdminToken();
      const res = await fetch('/api/admin/overview', { headers: { Authorization: 'Bearer ' + token } });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Admin access denied');
      root.innerHTML = renderAdminDashboard(data);
    } catch (err) { root.innerHTML = `<div class="admin-card p-8"><h2 class="font-serif text-2xl text-navy">Admin access unavailable</h2><p class="mt-3 text-sm text-mutedgt">${esc(err.message)}</p><p class="mt-3 text-xs text-mutedgt">Authorized admin emails are bornilmahmud56@gmail.com and bonrilmahmud56@gmail.com. Sign in with one of these Firebase accounts, then refresh.</p></div>`; }
  };
  function renderAdminDashboard(data) {
    const s = data.stats || {};
    return `
      <section id="admin-dashboard" class="space-y-8">
        <div class="admin-card p-7 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Dashboard</p>
            <h2 class="font-serif text-4xl lg:text-5xl text-navy mt-2">Good ${adminDayPart()}, Admin</h2>
            <p class="mt-3 text-sm text-mutedgt">This dashboard currently shows live D1 records plus planned enterprise modules without fabricated numbers.</p>
          </div>
          <div class="admin-quick">
            <a href="/request-quote">New RFQ</a>
            <button type="button" disabled title="Requires product CMS database">+ Add Product</button>
            <button type="button" disabled title="Requires quotation database">+ Create Quotation</button>
            <button type="button" disabled title="Requires CMS database">+ Add News</button>
          </div>
        </div>
        <div class="admin-kpi-grid">
          ${kpi('Total RFQs', s.rfqs)}${kpi('Pending RFQs', s.pending_rfqs)}${kpi('Quotations', s.quotations, 'Planned')}${kpi('Samples', s.samples)}
          ${kpi('Orders', (s.active_orders || 0) + (s.completed_orders || 0), 'Planned')}${kpi('Customers', s.customers, 'Planned CRM')}${kpi('Inquiries', s.inquiries)}${kpi('Jobs', s.job_applications)}
          ${kpi('Products', s.products, 'Verified DB')}${kpi('Categories', s.product_categories, 'Verified DB')}${kpi('AI Conversations', s.ai_conversations, 'Planned')}${kpi('Visitors', s.website_visitors, 'Planned')}
        </div>
        <div class="grid lg:grid-cols-2 gap-6">
          <section class="admin-card p-6">
            <div class="flex items-center justify-between gap-4 mb-6"><h3 class="admin-section-title">RFQ / Sales Analytics</h3><span class="admin-pill">Live + planned</span></div>
            ${adminChart([['RFQ', s.rfqs], ['Pending', s.pending_rfqs], ['Samples', s.samples], ['Inquiries', s.inquiries], ['Jobs', s.job_applications]])}
            <p class="mt-10 text-xs text-mutedgt">Chart uses only available D1 counts. Quotation, order and visitor analytics will activate when their databases are added.</p>
          </section>
          <section class="admin-card p-6">
            <div class="flex items-center justify-between gap-4 mb-3"><h3 class="admin-section-title">Recent Activity</h3><span class="admin-pill">Latest</span></div>
            ${recentActivity(data.recent_activity || [])}
          </section>
        </div>
        ${adminModules.map(moduleSection).join('')}
        <section class="space-y-6">
          <h3 class="admin-section-title">Live Records</h3>
          ${['rfqs','contact_inquiries','sample_requests','job_applications'].map((k) => adminTable(k, data[k] || [])).join('')}
        </section>
      </section>`;
  }
  function kpi(label, value, note) {
    return `<article class="admin-kpi"><strong>${esc(value ?? 0)}</strong><span>${esc(label)}</span>${note ? `<p class="mt-3 text-[11px] text-mutedgt">${esc(note)}</p>` : ''}</article>`;
  }
  function adminChart(items) {
    const max = Math.max(1, ...items.map((x) => Number(x[1]) || 0));
    return `<div class="admin-chart">${items.map(([label, value]) => `<span style="height:${Math.max(4, ((Number(value) || 0) / max) * 100)}%" data-label="${esc(label)}" title="${esc(label)}: ${esc(value || 0)}"></span>`).join('')}</div>`;
  }
  function recentActivity(rows) {
    if (!rows.length) return '<p class="text-sm text-mutedgt mt-5">No recent activity yet.</p>';
    return `<div class="admin-activity">${rows.map((r) => `<article><span class="type">${esc(r.type)}</span><div><p class="ref">${esc(r.ref || '—')}</p><p class="meta">${esc(r.title || '')}${r.party ? ' · ' + esc(r.party) : ''}${r.country ? ' · ' + esc(r.country) : ''}</p></div><span class="admin-pill">${esc(r.status || 'NEW')}</span></article>`).join('')}</div>`;
  }
  function moduleSection(section) {
    return `<section id="${section.id}" class="space-y-5 scroll-mt-28"><div class="flex items-center justify-between"><h3 class="admin-section-title">${esc(section.group)}</h3><span class="admin-pill">${section.items.length} modules</span></div><div class="admin-module-grid">${section.items.map((it) => adminModule(it)).join('')}</div></section>`;
  }
  function adminModule(item) {
    const [title, desc, live] = item;
    return `<article class="admin-module" data-live="${live}"><h3>${esc(title)}</h3><p>${esc(desc)}</p><small>${live ? 'Available now / partial' : 'Planned workflow'}</small></article>`;
  }
  function adminTable(title, rows) {
    const label = title.replace(/_/g, ' ');
    if (!rows.length) return `<section class="admin-card p-6 mb-6"><h2 class="font-serif text-2xl text-navy capitalize">${label}</h2><p class="text-sm text-mutedgt mt-2">No records yet.</p></section>`;
    const keys = Object.keys(rows[0]).slice(0, 8);
    return `<section class="admin-card p-0 mb-8 overflow-hidden"><div class="p-6 flex items-center justify-between"><h2 class="font-serif text-2xl text-navy capitalize">${label}</h2><span class="admin-pill">${rows.length} latest</span></div><div class="table-wrap"><table class="admin-table"><thead><tr>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${keys.map(k=>`<td>${esc(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  }
  function adminDayPart() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }
  document.addEventListener('gt:auth', () => { if ($('#admin-data')) window.gtLoadAdmin(); });
  $('#admin-refresh')?.addEventListener('click', () => window.gtLoadAdmin());
})();
