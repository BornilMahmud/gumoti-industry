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

  // Interactive Apparel Capacity Estimator (Reference 1 inspired)
  const estSection = $('#capacity-estimator');
  if (estSection) {
    const slider = $('#est-qty-slider', estSection);
    const display = $('#est-qty-display', estSection);
    const blendSelect = $('#est-blend-select', estSection);
    const catBtns = $$('.est-cat-btn', estSection);
    const weightEl = $('#est-weight', estSection);
    const knitDaysEl = $('#est-knit-days', estSection);
    const dyeDaysEl = $('#est-dye-days', estSection);
    const linesEl = $('#est-lines', estSection);
    const totalTimeEl = $('#est-total-time', estSection);
    const prefillBtn = $('#est-prefill-btn', estSection);

    let activeCat = 'Polo Shirt';
    let activeGsm = 220;

    function calculateCapacity() {
      const qty = parseInt(slider ? slider.value : '10000', 10) || 10000;
      if (display) display.textContent = Number(qty).toLocaleString() + ' Pcs';

      // Weight calculation with 15% allowance for cutting loss and seams
      const avgPieceWeightKg = (activeGsm * 1.25) / 1000;
      const totalWeightKg = Math.round(qty * avgPieceWeightKg * 1.15);

      // Daily capacities: 10T (10,000kg) Knitting, 50T (50,000kg) Dyeing
      const knitDays = Math.max(0.5, totalWeightKg / 10000).toFixed(1);
      const dyeDays = Math.max(0.5, totalWeightKg / 50000).toFixed(1);

      // Lines allocation (from 22 available lines at 1,600 pcs/day average per line)
      let lines = 2;
      let sewingDays = 3;
      let totalLead = '12 - 16 Days';

      if (qty <= 5000) {
        lines = 2;
        sewingDays = 2;
        totalLead = '10 - 14 Days';
      } else if (qty <= 12000) {
        lines = 3;
        sewingDays = 3;
        totalLead = '14 - 18 Days';
      } else if (qty <= 25000) {
        lines = 4;
        sewingDays = 4;
        totalLead = '18 - 24 Days';
      } else if (qty <= 40000) {
        lines = 6;
        sewingDays = 5;
        totalLead = '22 - 28 Days';
      } else {
        lines = 8;
        sewingDays = 6;
        totalLead = '25 - 32 Days';
      }

      if (weightEl) weightEl.textContent = Number(totalWeightKg).toLocaleString() + ' KG';
      if (knitDaysEl) knitDaysEl.textContent = '~' + knitDays + ' Days';
      if (dyeDaysEl) dyeDaysEl.textContent = '~' + dyeDays + ' Days';
      if (linesEl) linesEl.textContent = lines + ' Lines (' + sewingDays + ' Days)';
      if (totalTimeEl) totalTimeEl.textContent = totalLead;
    }

    catBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        catBtns.forEach((b) => {
          b.classList.remove('active', 'bg-[#00E599]/15', 'border-[#00E599]');
          b.classList.add('bg-white/[0.02]', 'border-white/[0.08]');
          const span = b.querySelector('span');
          if (span) { span.classList.remove('text-[#00E599]'); span.classList.add('text-[#788A9C]'); }
        });
        btn.classList.add('active', 'bg-[#00E599]/15', 'border-[#00E599]');
        btn.classList.remove('bg-white/[0.02]', 'border-white/[0.08]');
        const activeSpan = btn.querySelector('span');
        if (activeSpan) { activeSpan.classList.remove('text-[#788A9C]'); activeSpan.classList.add('text-[#00E599]'); }

        const cat = btn.dataset.cat || 'polo';
        activeGsm = parseInt(btn.dataset.gsm, 10) || 220;
        if (cat === 'polo') activeCat = 'Classic Piqué Polo Shirt';
        else if (cat === 'tshirt') activeCat = 'Classic Crew Neck T-Shirt';
        else if (cat === 'hoodie') activeCat = 'Brushed Fleece Knit Jacket & Hoodie';
        else if (cat === 'active') activeCat = 'Interlock Track Jacket';

        calculateCapacity();
      });
    });

    slider && slider.addEventListener('input', calculateCapacity);
    blendSelect && blendSelect.addEventListener('change', calculateCapacity);

    prefillBtn && prefillBtn.addEventListener('click', () => {
      const qty = slider ? slider.value : '10000';
      const blend = blendSelect ? blendSelect.value : '100% Combed Cotton';
      const url = `/request-quote?product=${encodeURIComponent(activeCat)}&quantity=${encodeURIComponent(qty)}&gsm=${encodeURIComponent(activeGsm)}&composition=${encodeURIComponent(blend)}`;
      window.location.href = url;
    });

    calculateCapacity();
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
  // ---------------- DWISON EXECUTIVE CONTROL CENTER ----------------
  window._gtAdminLoading = false;

  function closeAdminSidebar() {
    $('#admin-sidebar')?.classList.remove('open');
    $('#admin-sidebar-backdrop')?.classList.add('hidden');
  }

  function openAdminSidebar() {
    $('#admin-sidebar')?.classList.add('open');
    $('#admin-sidebar-backdrop')?.classList.remove('hidden');
  }

  function switchAdminTab(tabId) {
    if (!tabId) tabId = 'overview';
    sessionStorage.setItem('gt_admin_active_tab', tabId);

    // Update left sidebar buttons
    $$('.dash-nav-item[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update mobile tab pills
    $$('.dash-nav-pill[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Toggle tab contents
    const sections = $$('.dash-tab-content');
    sections.forEach((sec) => {
      const isTarget = sec.id === `admin-${tabId}-section`;
      sec.classList.toggle('tab-hidden', !isTarget);
      if (isTarget) {
        const name = sec.dataset.tabName || (tabId.charAt(0).toUpperCase() + tabId.slice(1));
        const breadcrumb = $('#admin-breadcrumb-tab');
        if (breadcrumb) breadcrumb.textContent = name;
      }
    });

    closeAdminSidebar();
  }

  window.gtLoadAdmin = async function (force = false) {
    const root = $('#admin-data');
    if (!root) return;
    if (window._gtAdminLoading && !force) return;
    window._gtAdminLoading = true;

    // Spin refresh icons
    $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.add('fa-spin'));

    const authCache = localStorage.getItem('gt_auth_user');
    if (!window.gtUser && !authCache) {
      root.innerHTML = `
        <div class="dash-kpi-card p-12 text-center text-[#788A9C] border border-white/[0.1] max-w-lg mx-auto">
          <i class="fa-solid fa-shield-halved text-4xl text-[#00E599] mb-4 block"></i>
          <h2 class="text-xl font-bold text-white">Authentication Required</h2>
          <p class="mt-2 text-xs text-[#788A9C] leading-relaxed">
            Sign in with an authorized administrator account (<code class="text-[#00E599] font-mono">bornilmahmud56@gmail.com</code>) to unlock the live control center.
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button data-google-signin class="pill-btn-emerald py-2.5 px-5 text-xs">
              <i class="fa-brands fa-google mr-1.5"></i> Sign in with Google
            </button>
            <a href="/login" class="pill-btn-outline py-2.5 px-5 text-xs">Email Login</a>
          </div>
        </div>`;
      $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.remove('fa-spin'));
      window._gtAdminLoading = false;
      return;
    }

    // If dashboard is not rendered yet, try instant cache or sleek skeleton
    const isAlreadyRendered = !!$('#admin-overview-section');
    if (!isAlreadyRendered) {
      const cached = sessionStorage.getItem('gt_admin_cache');
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          root.innerHTML = renderAdminDashboard(cachedData);
          bindAdminEvents(cachedData);
          switchAdminTab(sessionStorage.getItem('gt_admin_active_tab') || 'overview');
        } catch (_) {}
      } else {
        root.innerHTML = `
          <div class="space-y-6 animate-pulse">
            <div class="h-32 bg-white/[0.03] border border-white/[0.06] rounded-2xl"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="h-28 bg-white/[0.03] border border-white/[0.06] rounded-2xl"></div>
              <div class="h-28 bg-white/[0.03] border border-white/[0.06] rounded-2xl"></div>
              <div class="h-28 bg-white/[0.03] border border-white/[0.06] rounded-2xl"></div>
              <div class="h-28 bg-white/[0.03] border border-white/[0.06] rounded-2xl"></div>
            </div>
          </div>`;
      }
    }

    if (!window.gtAdminToken) {
      $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.remove('fa-spin'));
      window._gtAdminLoading = false;
      return;
    }

    try {
      const token = await window.gtAdminToken();
      const res = await fetch('/api/admin/overview', { headers: { Authorization: 'Bearer ' + token } });
      const data = await res.json();
      if (!res.ok) {
        if (data.role === 'customer') {
          root.innerHTML = `
            <div class="dash-kpi-card p-10 text-center border border-amber-500/30 max-w-lg mx-auto">
              <span class="inline-flex p-4 rounded-full bg-amber-500/15 text-amber-300 text-3xl mb-4"><i class="fa-solid fa-user-lock"></i></span>
              <h2 class="text-2xl font-bold font-display text-white">Customer Account Detected</h2>
              <p class="mt-3 text-xs text-[#788A9C] leading-relaxed">
                You are currently signed in with standard <span class="bg-white/[0.08] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Customer</span> privileges.
              </p>
              <p class="mt-2 text-xs text-[#788A9C] leading-relaxed">
                The Control Center is reserved for authorized Moderators and Super Administrators (<code class="text-[#00E599] font-mono">bornilmahmud56@gmail.com</code>).
              </p>
              <div class="mt-6 flex justify-center gap-3">
                <a href="/profile" class="pill-btn-emerald py-2.5 px-5 text-xs">My Profile</a>
                <a href="/request-quote" class="pill-btn-outline py-2.5 px-5 text-xs">Submit RFQ</a>
              </div>
            </div>`;
          $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.remove('fa-spin'));
          window._gtAdminLoading = false;
          return;
        }
        throw new Error(data.error || 'Access denied');
      }

      // Merge Firestore users
      if (window.gtDb && window.gtUser) {
        try {
          const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
          const snap = await getDocs(collection(window.gtDb, 'users'));
          const firestoreUsers = [];
          snap.forEach((d) => {
            const u = d.data();
            firestoreUsers.push({
              uid: d.id,
              email: u.email || u.userEmail || '',
              displayName: u.displayName || '',
              role: u.role || 'customer',
              createdAt: u.createdAt?.toDate ? u.createdAt.toDate().toISOString() : (u.createdAt || ''),
              photoURL: u.photoURL || '',
            });
          });
          const userMap = new Map();
          (data.users || []).forEach((u) => { if (u.email) userMap.set(u.email.toLowerCase(), u); });
          firestoreUsers.forEach((u) => {
            if (u.email) {
              const existing = userMap.get(u.email.toLowerCase()) || {};
              userMap.set(u.email.toLowerCase(), { ...existing, ...u });
            }
          });
          data.users = Array.from(userMap.values());
        } catch (fErr) {
          console.warn('Firestore user query in Admin:', fErr);
        }
      }

      // Save fresh data to cache
      sessionStorage.setItem('gt_admin_cache', JSON.stringify(data));

      // Re-render and bind
      root.innerHTML = renderAdminDashboard(data);
      bindAdminEvents(data);

      // Restore active tab
      const currentTab = sessionStorage.getItem('gt_admin_active_tab') || 'overview';
      switchAdminTab(currentTab);

      // Update sidebar email
      const adminEmailEl = $('#admin-user-email');
      if (adminEmailEl && window.gtUser) {
        adminEmailEl.textContent = window.gtUser.email || 'Administrator';
      }
    } catch (err) {
      root.innerHTML = `
        <div class="dash-kpi-card p-8 border border-red-500/30 max-w-lg mx-auto text-center">
          <h2 class="text-xl font-bold font-display text-white">Access Restricted</h2>
          <p class="mt-2 text-xs text-[#788A9C]">${esc(err.message)}</p>
          <p class="mt-3 text-[11px] text-[#788A9C]">Authorized administrator: <code class="text-[#00E599] font-mono">bornilmahmud56@gmail.com</code>.</p>
        </div>`;
    } finally {
      $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.remove('fa-spin'));
      window._gtAdminLoading = false;
    }
  };

  function renderAdminDashboard(data) {
    const s = data.stats || {};
    const cfg = data.landing_config || {};
    const role = data.role || 'customer';
    const isSuper = data.isSuperAdmin || false;
    const assets = data.media_assets || [];
    const users = data.users || [];

    return `
      <div id="admin-dashboard-container" class="space-y-8">

        <!-- ================= TAB 1: OVERVIEW ================= -->
        <div id="admin-overview-section" class="dash-tab-content space-y-8" data-tab-name="Overview">
          
          <!-- Welcome Banner -->
          <div class="dash-kpi-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div class="flex items-center gap-2.5">
                <span class="text-[10px] tracking-widest uppercase font-bold text-[#00E599]">Enterprise Operations</span>
                <span class="inline-flex text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${isSuper ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40'}">
                  ${isSuper ? 'Super Administrator' : 'Moderator'}
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-white mt-1">Welcome back, ${esc(data.admin ? data.admin.split('@')[0] : 'Administrator')}</h2>
              <p class="text-xs text-[#788A9C] mt-1">Real-time control over verified factory capacities, landing page media, customer access, and live intake.</p>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <a href="/" target="_blank" class="pill-btn-outline text-xs py-2 px-4">
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> View Public Site
              </a>
              <button type="button" class="pill-btn-emerald text-xs py-2 px-4 cursor-pointer" onclick="window.gtSwitchAdminTab && window.gtSwitchAdminTab('cms')">
                <i class="fa-solid fa-pen-to-square text-[10px]"></i> Edit Landing Page
              </button>
            </div>
          </div>

          <!-- 4 Top KPI Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            <div class="dash-kpi-card">
              <div class="flex items-center justify-between text-xs text-[#788A9C]">
                <span>Annual Export Volume</span>
                <span class="text-[#00E599] font-bold flex items-center gap-1 text-[11px]"><i class="fa-solid fa-arrow-trend-up"></i> +15% YoY</span>
              </div>
              <p class="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2">$27,000,000</p>
              <p class="text-[11px] text-[#788A9C] mt-1">Global Retail Shipments</p>
              <div class="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-[#4B5A6A]">
                SIBL & SEBL primary banking
              </div>
            </div>

            <div class="dash-kpi-card">
              <div class="flex items-center justify-between text-xs text-[#788A9C]">
                <span>Daily Sewing Capacity</span>
                <span class="text-[#00E599] font-bold flex items-center gap-1 text-[11px]"><i class="fa-solid fa-industry"></i> 22 Lines</span>
              </div>
              <p class="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2">35,000 Pcs</p>
              <p class="text-[11px] text-[#788A9C] mt-1">750+ Computerized Machines</p>
              <div class="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-[#4B5A6A]">
                Polo, T-Shirt, Fleece, Activewear
              </div>
            </div>

            <div class="dash-kpi-card">
              <div class="flex items-center justify-between text-xs text-[#788A9C]">
                <span>Dyeing & Knitting</span>
                <span class="text-[#00D2FF] font-bold flex items-center gap-1 text-[11px]"><i class="fa-solid fa-droplet"></i> Active</span>
              </div>
              <p class="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2">60T / Day</p>
              <p class="text-[11px] text-[#788A9C] mt-1">50T Dyeing + 10T Knitting</p>
              <div class="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-[#4B5A6A]">
                Sclavos, Thies, Mayer & Cie
              </div>
            </div>

            <div class="dash-kpi-card">
              <div class="flex items-center justify-between text-xs text-[#788A9C]">
                <span>Workforce & Registered</span>
                <span class="text-[#E5C378] font-bold flex items-center gap-1 text-[11px]"><i class="fa-solid fa-users"></i> Staff</span>
              </div>
              <p class="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2">1,600</p>
              <p class="text-[11px] text-[#788A9C] mt-1">74% Female Empowerment</p>
              <div class="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-[#4B5A6A]">
                ${users.length} registered accounts
              </div>
            </div>

          </div>

          <!-- Middle Row: Capacity Breakdown Donut & Monthly Performance -->
          <div class="grid lg:grid-cols-12 gap-6">
            
            <!-- Capacity Distribution Donut Panel -->
            <div class="lg:col-span-6 dash-kpi-card space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-white uppercase tracking-wider">Capacity Distribution</h3>
                  <p class="text-xs text-[#788A9C] mt-0.5">Composite throughput across departments</p>
                </div>
                <span class="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-[#CBD5E1]">Daily Specs</span>
              </div>

              <div class="grid sm:grid-cols-2 gap-6 items-center pt-2">
                <div class="relative flex items-center justify-center">
                  <svg class="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#111E2D" stroke-width="12" fill="transparent" />
                    <circle cx="50" cy="50" r="40" stroke="#00E599" stroke-width="12" fill="transparent" stroke-dasharray="125 251" stroke-linecap="round" />
                    <circle cx="50" cy="50" r="40" stroke="#00D2FF" stroke-width="12" fill="transparent" stroke-dasharray="60 251" stroke-dashoffset="-125" stroke-linecap="round" />
                    <circle cx="50" cy="50" r="40" stroke="#E5C378" stroke-width="12" fill="transparent" stroke-dasharray="40 251" stroke-dashoffset="-185" stroke-linecap="round" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span class="text-lg font-bold text-white font-mono">100%</span>
                    <span class="text-[9px] text-[#788A9C] uppercase">Integrated</span>
                  </div>
                </div>

                <div class="space-y-2.5 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-2 text-[#CBD5E1]"><span class="w-2.5 h-2.5 rounded-full bg-[#00E599]"></span> Dyeing Unit</span>
                    <strong class="text-white font-mono">50T / Day</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-2 text-[#CBD5E1]"><span class="w-2.5 h-2.5 rounded-full bg-[#00D2FF]"></span> Finishing Stenter</span>
                    <strong class="text-white font-mono">80T / Day</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-2 text-[#CBD5E1]"><span class="w-2.5 h-2.5 rounded-full bg-[#E5C378]"></span> Knitting Floor</span>
                    <strong class="text-white font-mono">10T / Day</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-2 text-[#CBD5E1]"><span class="w-2.5 h-2.5 rounded-full bg-white/40"></span> Garment Sewing</span>
                    <strong class="text-white font-mono">35,000 Pcs</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monthly Production Output Graph -->
            <div class="lg:col-span-6 dash-kpi-card space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-white uppercase tracking-wider">Production Output Trend</h3>
                  <p class="text-xs text-[#788A9C] mt-0.5">Average monthly volume ($2.25M / mo)</p>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-[#00E599]/15 text-[#00E599] text-xs font-bold font-mono">On Target</span>
              </div>

              <div class="pt-3">
                <div class="h-32 flex items-end justify-between gap-3 px-2 border-b border-white/[0.08]">
                  <div class="flex-1 bg-gradient-to-t from-[#00E599]/10 to-[#00E599]/40 rounded-t h-[65%] relative group hover:to-[#00E599]"></div>
                  <div class="flex-1 bg-gradient-to-t from-[#00E599]/10 to-[#00E599]/40 rounded-t h-[75%] relative group hover:to-[#00E599]"></div>
                  <div class="flex-1 bg-gradient-to-t from-[#00E599]/10 to-[#00E599]/40 rounded-t h-[80%] relative group hover:to-[#00E599]"></div>
                  <div class="flex-1 bg-gradient-to-t from-[#00E599]/10 to-[#00E599]/40 rounded-t h-[70%] relative group hover:to-[#00E599]"></div>
                  <div class="flex-1 bg-gradient-to-t from-[#00E599]/10 to-[#00E599]/40 rounded-t h-[88%] relative group hover:to-[#00E599]"></div>
                  <div class="flex-1 bg-gradient-to-t from-[#00E599]/20 to-[#00E599] rounded-t h-[95%] relative group"></div>
                </div>
                <div class="flex justify-between text-[10px] text-[#788A9C] pt-2 font-mono">
                  <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span><span>Q1 (2026)</span><span>Current Q</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- ================= TAB 2: CMS CUSTOMIZER ================= -->
        <div id="admin-cms-section" class="dash-tab-content dash-kpi-card p-4 sm:p-6 space-y-6 tab-hidden" data-tab-name="Landing Page CMS">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#00E599]">Live CMS Manager</span>
              <h3 class="text-xl font-bold font-display text-white mt-0.5">Landing Page Customizer</h3>
              <p class="text-xs text-[#788A9C] mt-0.5">Customize headlines, CTA buttons, background photos, and factory trust strip statistics.</p>
            </div>
            <div class="flex items-center gap-2">
              <button id="cms-save-btn" type="button" class="pill-btn-emerald py-2 px-4 text-xs cursor-pointer">
                <i class="fa-solid fa-floppy-disk mr-1"></i> Save & Publish
              </button>
              <button id="cms-reset-btn" type="button" class="pill-btn-outline py-2 px-3 text-xs cursor-pointer">
                Reset
              </button>
            </div>
          </div>

          <form id="landing-cms-form" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-5">
              <div>
                <label class="field-label-dark">Headline Line 1</label>
                <input type="text" name="heroHeadlineLine1" value="${esc(cfg.heroHeadlineLine1 || 'INTEGRATED KNITWEAR.')}" class="field-dark font-bold text-white" />
              </div>
              <div>
                <label class="field-label-dark">Headline Line 2 (Luminous Accent)</label>
                <input type="text" name="heroHeadlineLine2" value="${esc(cfg.heroHeadlineLine2 || 'GLOBAL SCALE.')}" class="field-dark font-bold text-[#00E599]" />
              </div>
              <div>
                <label class="field-label-dark">Hero Kicker Badge</label>
                <input type="text" name="heroKicker" value="${esc(cfg.heroKicker || '● 30+ YEARS EXCELLENCE · EST. 1993 · 22 SEWING LINES')}" class="field-dark" />
              </div>
              <div>
                <label class="field-label-dark">Hero Sub-Tagline</label>
                <input type="text" name="heroSubTagline" value="${esc(cfg.heroSubTagline || 'Premier knit-composite textile and apparel manufacturer in Bangladesh — integrating knitting, dyeing, finishing, and garment assembly.')}" class="field-dark" />
              </div>
            </div>

            <!-- Background Image URL -->
            <div>
              <label class="field-label-dark">Hero Banner Image URL (Select from Media Library)</label>
              <div class="flex gap-4 items-center">
                <input id="cms-hero-bg-input" type="text" name="heroBgImage" value="${esc(cfg.heroBgImage || '/images/hero/background_1920x530.webp')}" class="field-dark font-mono text-xs flex-1" />
                <div class="w-16 h-10 rounded-lg overflow-hidden border border-white/[0.1] flex-shrink-0 bg-[#070D14]">
                  <img id="cms-hero-bg-preview" src="${esc(cfg.heroBgImage || '/images/hero/background_1920x530.webp')}" class="w-full h-full object-cover" alt="Preview" />
                </div>
              </div>
            </div>

            <!-- Trust Strip Values -->
            <div>
              <label class="field-label-dark mb-2">Trust Strip Statistics</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-1.5">
                  <label class="text-[10px] text-[#788A9C] uppercase">Stat 1 (Dyeing)</label>
                  <input type="text" name="stat1Value" value="${esc(cfg.stats?.stat1Value || '50T/Day')}" class="field-dark py-1 px-2 text-xs font-bold" />
                  <input type="text" name="stat1Label" value="${esc(cfg.stats?.stat1Label || 'Dyeing Output')}" class="field-dark py-1 px-2 text-[11px]" />
                </div>
                <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-1.5">
                  <label class="text-[10px] text-[#788A9C] uppercase">Stat 2 (Knitting)</label>
                  <input type="text" name="stat2Value" value="${esc(cfg.stats?.stat2Value || '10T/Day')}" class="field-dark py-1 px-2 text-xs font-bold" />
                  <input type="text" name="stat2Label" value="${esc(cfg.stats?.stat2Label || 'Knitting Output')}" class="field-dark py-1 px-2 text-[11px]" />
                </div>
                <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-1.5">
                  <label class="text-[10px] text-[#788A9C] uppercase">Stat 3 (Sewing)</label>
                  <input type="text" name="stat3Value" value="${esc(cfg.stats?.stat3Value || '80T / 35k')}" class="field-dark py-1 px-2 text-xs font-bold" />
                  <input type="text" name="stat3Label" value="${esc(cfg.stats?.stat3Label || 'Finishing & Sewing')}" class="field-dark py-1 px-2 text-[11px]" />
                </div>
                <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-1.5">
                  <label class="text-[10px] text-[#788A9C] uppercase">Stat 4 (Workforce)</label>
                  <input type="text" name="stat4Value" value="${esc(cfg.stats?.stat4Value || '1,600')}" class="field-dark py-1 px-2 text-xs font-bold" />
                  <input type="text" name="stat4Label" value="${esc(cfg.stats?.stat4Label || 'Workforce & Scale')}" class="field-dark py-1 px-2 text-[11px]" />
                </div>
              </div>
            </div>

            <!-- Corporate Coordinates -->
            <div class="grid md:grid-cols-2 gap-5 pt-2">
              <div>
                <label class="field-label-dark">Factory Email</label>
                <input type="email" name="contactEmail" value="${esc(cfg.contactEmail || 'info@gumtitex.com')}" class="field-dark font-mono text-xs" />
              </div>
              <div>
                <label class="field-label-dark">Factory Phone</label>
                <input type="text" name="contactPhone" value="${esc(cfg.contactPhone || '+8801716776393')}" class="field-dark font-mono text-xs" />
              </div>
            </div>
          </form>
        </div>

        <!-- ================= TAB 3: MEDIA LIBRARY ================= -->
        <div id="admin-media-section" class="dash-tab-content dash-kpi-card p-4 sm:p-6 space-y-5 tab-hidden" data-tab-name="Media Library (29)">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#00E599]">Local Asset Repository</span>
              <h3 class="text-xl font-bold font-display text-white mt-0.5">Media Library (${assets.length} Curated Assets)</h3>
              <p class="text-xs text-[#788A9C] mt-0.5">Click "Set as Hero" to assign any picture as your active homepage background.</p>
            </div>
            <div class="flex flex-wrap gap-1.5" id="media-filter-btns">
              <button class="media-filter-btn px-2.5 py-1 bg-[#00E599] text-[#050B10] font-bold rounded-lg text-[11px] cursor-pointer" data-filter="all">All</button>
              <button class="media-filter-btn px-2.5 py-1 bg-white/[0.05] text-[#CBD5E1] rounded-lg text-[11px] cursor-pointer" data-filter="Hero">Hero</button>
              <button class="media-filter-btn px-2.5 py-1 bg-white/[0.05] text-[#CBD5E1] rounded-lg text-[11px] cursor-pointer" data-filter="Machinery">Machinery</button>
              <button class="media-filter-btn px-2.5 py-1 bg-white/[0.05] text-[#CBD5E1] rounded-lg text-[11px] cursor-pointer" data-filter="Products">Products</button>
              <button class="media-filter-btn px-2.5 py-1 bg-white/[0.05] text-[#CBD5E1] rounded-lg text-[11px] cursor-pointer" data-filter="Partners">Partners</button>
              <button class="media-filter-btn px-2.5 py-1 bg-white/[0.05] text-[#CBD5E1] rounded-lg text-[11px] cursor-pointer" data-filter="Operations">Operations</button>
              <button class="media-filter-btn px-2.5 py-1 bg-white/[0.05] text-[#CBD5E1] rounded-lg text-[11px] cursor-pointer" data-filter="Safety">Safety</button>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" id="media-grid">
            ${assets.map((a) => `
              <div class="media-card rounded-xl overflow-hidden bg-[#070D14] border border-white/[0.08] group hover:border-[#00E599]/40 transition-colors" data-category="${esc(a.category)}" data-title="${esc(a.title)}">
                <div class="aspect-[4/3] bg-[#0A121A] overflow-hidden relative">
                  <img src="${esc(a.url)}" alt="${esc(a.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <span class="absolute top-2 left-2 text-[9px] uppercase font-bold bg-[#060B10]/80 text-[#00E599] px-2 py-0.5 rounded border border-[#00E599]/20">${esc(a.category)}</span>
                </div>
                <div class="p-3 space-y-2">
                  <p class="font-bold text-white text-xs truncate" title="${esc(a.title)}">${esc(a.title)}</p>
                  <div class="flex items-center justify-between text-[10px] pt-1.5 border-t border-white/[0.06]">
                    <button type="button" class="btn-copy-media text-[#788A9C] hover:text-white cursor-pointer" data-url="${esc(a.url)}"><i class="fa-regular fa-copy mr-1"></i>Copy</button>
                    <button type="button" class="btn-set-hero text-[#00E599] font-bold hover:underline cursor-pointer" data-url="${esc(a.url)}"><i class="fa-solid fa-check mr-1"></i>Set Hero</button>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <!-- ================= TAB 4: USERS & RBAC ================= -->
        <div id="admin-users-section" class="dash-tab-content dash-kpi-card p-4 sm:p-6 space-y-5 tab-hidden" data-tab-name="User Directory & RBAC">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#00E599]">Access Governance</span>
              <h3 class="text-xl font-bold font-display text-white mt-0.5">User Directory & Role Management</h3>
              <p class="text-xs text-[#788A9C] mt-0.5">Super Admin: <code class="text-[#00E599] font-mono">bornilmahmud56@gmail.com</code>. Promote verified accounts to Moderator or Admin.</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-white/[0.05] text-xs text-[#CBD5E1] border border-white/[0.08]">
              ${users.length} registered accounts
            </span>
          </div>

          <div class="dark-table-wrap">
            <table class="dark-table" id="admin-users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Registered</th>
                  ${isSuper ? '<th class="text-right">Manage Role Privileges</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${users.map((u) => {
                  const isBornilSuper = (u.email || '').toLowerCase() === 'bornilmahmud56@gmail.com' || (u.email || '').toLowerCase() === 'bonrilmahmud56@gmail.com';
                  return `
                  <tr class="user-row" data-search="${esc((u.displayName || '') + ' ' + (u.email || '') + ' ' + (u.role || ''))}">
                    <td>
                      <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E599] to-[#008F5D] text-[#050B10] font-bold flex items-center justify-center text-xs uppercase flex-shrink-0">
                          ${(u.displayName || u.email || 'U')[0]}
                        </span>
                        <span class="font-semibold text-white">${esc(u.displayName || 'Buyer Account')}</span>
                      </div>
                    </td>
                    <td class="font-mono text-[#CBD5E1] text-xs">${esc(u.email || '')}</td>
                    <td>
                      <span class="inline-flex text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : u.role === 'moderator' ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30' : 'bg-white/[0.06] text-[#CBD5E1] border border-white/[0.1]'}">
                        ${isBornilSuper ? 'Super Admin' : (u.role || 'customer')}
                      </span>
                    </td>
                    <td class="text-[#788A9C] text-xs">${u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : 'Active'}</td>
                    ${isSuper ? `
                      <td class="text-right">
                        ${isBornilSuper ? '<span class="text-[11px] text-[#788A9C] italic">Default Super Admin</span>' : `
                          <div class="flex items-center justify-end gap-1.5">
                            ${u.role !== 'moderator' ? `<button type="button" class="btn-change-role px-2.5 py-1 bg-[#00E599]/20 hover:bg-[#00E599] text-[#00E599] hover:text-[#050B10] border border-[#00E599]/40 rounded-lg text-[10px] font-bold cursor-pointer transition-colors" data-email="${esc(u.email)}" data-uid="${esc(u.uid)}" data-role="moderator">Make Moderator</button>` : ''}
                            ${u.role !== 'admin' ? `<button type="button" class="btn-change-role px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 rounded-lg text-[10px] font-bold cursor-pointer transition-colors" data-email="${esc(u.email)}" data-uid="${esc(u.uid)}" data-role="admin">Make Admin</button>` : ''}
                            ${u.role !== 'customer' ? `<button type="button" class="btn-change-role px-2.5 py-1 bg-white/[0.06] hover:bg-white/20 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors" data-email="${esc(u.email)}" data-uid="${esc(u.uid)}" data-role="customer">Set Customer</button>` : ''}
                          </div>`}
                      </td>` : ''}
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ================= TAB 5: RFQS & INTAKE ================= -->
        <div id="admin-rfqs-section" class="dash-tab-content space-y-6 tab-hidden" data-tab-name="RFQs & Intake">
          <div class="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#00E599]">Commercial Pipeline</span>
              <h3 class="text-xl font-bold font-display text-white mt-0.5">Live Intake & RFQ Records</h3>
            </div>
            <span class="px-2.5 py-0.5 rounded bg-[#00E599]/15 text-[#00E599] text-xs font-mono">D1 & Firestore Synced</span>
          </div>
          ${['rfqs','contact_inquiries','sample_requests','job_applications'].map((k) => adminTable(k, data[k] || [])).join('')}
        </div>

      </div>`;
  }

  function bindAdminEvents(data) {
    window.gtSwitchAdminTab = switchAdminTab;

    // Sidebar & Mobile Tab Navigation
    $$('.dash-nav-item[data-tab]').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        switchAdminTab(btn.dataset.tab);
      };
    });

    $$('.dash-nav-pill[data-tab]').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        switchAdminTab(btn.dataset.tab);
      };
    });

    // Mobile Sidebar Drawer Controls
    $('#admin-sidebar-toggle')?.addEventListener('click', openAdminSidebar);
    $('#admin-sidebar-close')?.addEventListener('click', closeAdminSidebar);
    $('#admin-sidebar-backdrop')?.addEventListener('click', closeAdminSidebar);

    // Refresh Buttons
    $('#admin-refresh-top')?.addEventListener('click', () => window.gtLoadAdmin(true));
    $('#admin-refresh')?.addEventListener('click', () => window.gtLoadAdmin(true));

    // Live Quick Search
    $('#admin-search-input')?.addEventListener('input', (e) => {
      const q = (e.target.value || '').trim().toLowerCase();
      // Filter user rows
      $$('.user-row').forEach((row) => {
        const text = (row.dataset.search || '').toLowerCase();
        row.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
      // Filter media cards
      $$('.media-card').forEach((card) => {
        const title = (card.dataset.title || '').toLowerCase();
        const cat = (card.dataset.category || '').toLowerCase();
        card.style.display = (!q || title.includes(q) || cat.includes(q)) ? '' : 'none';
      });
    });

    // Copy Media URL
    $$('.btn-copy-media').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.url;
        if (url && navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            window.gtToast && window.gtToast(`Copied URL: ${url}`);
          });
        }
      });
    });

    // Set Hero from Media
    $$('.btn-set-hero').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.url;
        const input = $('#cms-hero-bg-input');
        const preview = $('#cms-hero-bg-preview');
        if (input && url) {
          input.value = url;
          if (preview) preview.src = url;
          window.gtToast && window.gtToast('Selected as Hero Banner. Click "Save & Publish" to activate.');
          switchAdminTab('cms');
        }
      });
    });

    // Media Category Filters
    $$('.media-filter-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        $$('.media-filter-btn').forEach((b) => {
          b.className = 'media-filter-btn px-2.5 py-1 bg-white/[0.05] text-[#CBD5E1] rounded-lg text-[11px] cursor-pointer';
        });
        e.currentTarget.className = 'media-filter-btn px-2.5 py-1 bg-[#00E599] text-[#050B10] font-bold rounded-lg text-[11px] cursor-pointer';

        $$('.media-card').forEach((card) => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Role Promotion Buttons
    $$('.btn-change-role').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const email = e.currentTarget.dataset.email;
        const uid = e.currentTarget.dataset.uid;
        const newRole = e.currentTarget.dataset.role;
        if (!email || !newRole) return;
        if (confirm(`Are you sure you want to change ${email} role to ${newRole.toUpperCase()}?`)) {
          btn.disabled = true;
          const ok = await window.gtPromoteUserRole(email, uid, newRole);
          btn.disabled = false;
          if (ok) window.gtLoadAdmin(true);
        }
      });
    });

    // CMS Save Form
    $('#cms-save-btn')?.addEventListener('click', async () => {
      const form = $('#landing-cms-form');
      if (!form) return;
      const fd = new FormData(form);
      const configData = {
        heroHeadlineLine1: fd.get('heroHeadlineLine1') || 'INTEGRATED KNITWEAR.',
        heroHeadlineLine2: fd.get('heroHeadlineLine2') || 'GLOBAL SCALE.',
        heroKicker: fd.get('heroKicker') || '',
        heroSubTagline: fd.get('heroSubTagline') || '',
        heroBgImage: fd.get('heroBgImage') || '/images/hero/background_1920x530.webp',
        heroCta1Text: fd.get('heroCta1Text') || 'Explore Capabilities',
        heroCta1Link: fd.get('heroCta1Link') || '/capabilities',
        heroCta2Text: fd.get('heroCta2Text') || 'Request a Quote',
        heroCta2Link: fd.get('heroCta2Link') || '/request-quote',
        stats: {
          stat1Label: fd.get('stat1Label') || 'Dyeing Output',
          stat1Value: fd.get('stat1Value') || '50T/Day',
          stat2Label: fd.get('stat2Label') || 'Knitting Output',
          stat2Value: fd.get('stat2Value') || '10T/Day',
          stat3Label: fd.get('stat3Label') || 'Finishing & Sewing',
          stat3Value: fd.get('stat3Value') || '80T / 35k',
          stat4Label: fd.get('stat4Label') || 'Workforce & Scale',
          stat4Value: fd.get('stat4Value') || '1,600',
        },
        contactEmail: fd.get('contactEmail') || 'info@gumtitex.com',
        contactPhone: fd.get('contactPhone') || '+8801716776393',
        contactAddress: fd.get('contactAddress') || '',
        facebookUrl: fd.get('facebookUrl') || 'https://www.facebook.com/gumtitextile',
      };

      const btn = $('#cms-save-btn');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Saving…'; }
      const ok = await window.gtSaveLandingConfig(configData);
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-floppy-disk text-xs mr-1"></i> Save & Publish'; }
      if (ok) {
        const preview = $('#cms-hero-bg-preview');
        if (preview) preview.src = configData.heroBgImage;
      }
    });

    // Reset Defaults
    $('#cms-reset-btn')?.addEventListener('click', () => {
      if (confirm('Reset landing page fields back to verified factory defaults?')) {
        const form = $('#landing-cms-form');
        if (!form) return;
        form.elements['heroHeadlineLine1'].value = 'INTEGRATED KNITWEAR.';
        form.elements['heroHeadlineLine2'].value = 'GLOBAL SCALE.';
        form.elements['heroKicker'].value = '● 30+ YEARS EXCELLENCE · EST. 1993 · 22 SEWING LINES';
        form.elements['heroSubTagline'].value = 'Premier knit-composite textile and apparel manufacturer in Bangladesh — integrating knitting, dyeing, finishing, and garment assembly.';
        form.elements['heroBgImage'].value = '/images/hero/background_1920x530.webp';
        form.elements['heroCta1Text'].value = 'Explore Capabilities';
        form.elements['heroCta1Link'].value = '/capabilities';
        form.elements['heroCta2Text'].value = 'Request a Quote';
        form.elements['heroCta2Link'].value = '/request-quote';
        form.elements['stat1Label'].value = 'Dyeing Output';
        form.elements['stat1Value'].value = '50T/Day';
        form.elements['stat2Label'].value = 'Knitting Output';
        form.elements['stat2Value'].value = '10T/Day';
        form.elements['stat3Label'].value = 'Finishing & Sewing';
        form.elements['stat3Value'].value = '80T / 35k';
        form.elements['stat4Label'].value = 'Workforce & Scale';
        form.elements['stat4Value'].value = '1,600';
        form.elements['contactEmail'].value = 'info@gumtitex.com';
        form.elements['contactPhone'].value = '+8801716776393';
        window.gtToast && window.gtToast('Fields reset to factory defaults. Click "Save & Publish" to push live.');
      }
    });
  }

  function adminTable(title, rows) {
    const label = title.replace(/_/g, ' ');
    if (!rows.length) {
      return `
        <div class="dash-kpi-card p-6 mb-6">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white capitalize">${label}</h3>
            <span class="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#788A9C] text-xs font-mono">0 records</span>
          </div>
          <p class="text-xs text-[#788A9C] mt-3">No active records recorded in the live intake database.</p>
        </div>`;
    }
    const keys = Object.keys(rows[0]).slice(0, 8);
    return `
      <div class="dash-kpi-card p-0 mb-6 overflow-hidden">
        <div class="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08]">
          <h3 class="text-base font-bold text-white capitalize">${label}</h3>
          <span class="px-2.5 py-0.5 rounded-full bg-[#00E599]/15 text-[#00E599] text-xs font-mono font-bold">${rows.length} records</span>
        </div>
        <div class="dark-table-wrap border-0 rounded-none">
          <table class="dark-table text-xs">
            <thead><tr>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r=>`<tr>${keys.map(k=>`<td class="truncate max-w-[200px]" title="${esc(r[k])}">${esc(r[k])}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  }

  // Instant pre-render check on initial page load
  if ($('#admin-data')) {
    const cached = sessionStorage.getItem('gt_admin_cache');
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        $('#admin-data').innerHTML = renderAdminDashboard(cachedData);
        bindAdminEvents(cachedData);
        switchAdminTab(sessionStorage.getItem('gt_admin_active_tab') || 'overview');
      } catch (_) {}
    }
  }

  // ---------------- GUMTI AI CHATBOT (Gemini Powered) ----------------
  (function initGumtiAi() {
    const aiContainer = $('#gumti-ai');
    if (!aiContainer) return;

    const toggleBtn = $('#ai-toggle');
    const panel = $('#ai-panel');
    const closeBtn = $('#ai-close');
    const messagesEl = $('#ai-messages');
    const form = $('#ai-form');
    const input = $('#ai-input');
    const quickButtons = $$('.ai-quick button');

    const chatHistory = [];

    function formatMarkdown(text) {
      if (!text) return '';
      let escaped = esc(text);

      // Markdown links: [text](url)
      escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-navy font-semibold underline underline-offset-2 hover:text-sand transition-colors">$1</a>');

      // Bold: **text**
      escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-navy">$1</strong>');

      // Italic: *text*
      escaped = escaped.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

      // Headings: ### Header
      escaped = escaped.replace(/^### (.*$)/gim, '<h4 class="font-serif font-bold text-navy text-sm mt-3 mb-1">$1</h4>');
      escaped = escaped.replace(/^## (.*$)/gim, '<h3 class="font-serif font-bold text-navy text-base mt-3 mb-1.5">$1</h3>');

      // Lists: * item or - item
      escaped = escaped.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-xs leading-relaxed">$1</li>');
      escaped = escaped.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-xs leading-relaxed">$1</li>');

      // Linebreaks
      escaped = escaped.replace(/\n\n/g, '<div class="h-2"></div>');
      escaped = escaped.replace(/\n/g, '<br/>');

      return escaped;
    }

    function scrollBottom() {
      if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }

    function openPanel() {
      if (!panel) return;
      panel.removeAttribute('hidden');
      toggleBtn?.setAttribute('aria-expanded', 'true');
      scrollBottom();
      setTimeout(() => input?.focus(), 150);
    }

    function closePanel() {
      if (!panel) return;
      panel.setAttribute('hidden', '');
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }

    toggleBtn?.addEventListener('click', () => {
      if (panel?.hasAttribute('hidden')) {
        openPanel();
      } else {
        closePanel();
      }
    });

    closeBtn?.addEventListener('click', closePanel);

    async function sendAiMessage(userText) {
      const text = (userText || '').trim();
      if (!text) return;

      // Append user bubble
      const userBubble = document.createElement('article');
      userBubble.className = 'ai-msg user';
      userBubble.innerHTML = `<p>${esc(text)}</p>`;
      messagesEl?.appendChild(userBubble);
      scrollBottom();

      // Typing indicator
      const typingBubble = document.createElement('article');
      typingBubble.className = 'ai-msg bot ai-typing';
      typingBubble.id = 'ai-typing-indicator';
      typingBubble.innerHTML = `
        <div class="flex items-center gap-1.5 py-1">
          <span class="w-1.5 h-1.5 rounded-full bg-sand animate-pulse"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-sand animate-pulse" style="animation-delay:0.2s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-sand animate-pulse" style="animation-delay:0.4s"></span>
          <span class="text-[11px] text-mutedgt ml-1.5">Gumti AI is thinking…</span>
        </div>`;
      messagesEl?.appendChild(typingBubble);
      scrollBottom();

      const submitBtn = form?.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (input) input.disabled = true;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: chatHistory.slice(-6) }),
        });
        const data = await res.json();
        typingBubble.remove();

        const reply = data.reply || "Thank you for contacting Gumti Textiles. Please reach our merchandising team at info@gumtitex.com or submit an RFQ at /request-quote.";

        chatHistory.push({ role: 'user', text });
        chatHistory.push({ role: 'model', text: reply });

        const botBubble = document.createElement('article');
        botBubble.className = 'ai-msg bot';
        botBubble.innerHTML = `
          <div>${formatMarkdown(reply)}</div>
          <small>Verified Assistant · Powered by Gemini</small>`;
        messagesEl?.appendChild(botBubble);
        scrollBottom();
      } catch (err) {
        typingBubble.remove();
        const errBubble = document.createElement('article');
        errBubble.className = 'ai-msg bot';
        errBubble.innerHTML = `
          <p>We apologize, but the AI service is currently reconnecting. You can explore our <a href="/capabilities" class="text-navy font-semibold underline">Factory Capabilities</a> or email our sales team directly at <strong class="text-navy">info@gumtitex.com</strong>.</p>
          <small>Connection Notice</small>`;
        messagesEl?.appendChild(errBubble);
        scrollBottom();
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (input) {
          input.disabled = false;
          input.value = '';
          input.focus();
        }
      }
    }

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input?.value || '';
      sendAiMessage(query);
    });

    quickButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const q = e.currentTarget.dataset.aiQ || e.currentTarget.textContent;
        if (q) {
          if (panel?.hasAttribute('hidden')) openPanel();
          sendAiMessage(q);
        }
      });
    });
  })();

  document.addEventListener('gt:auth', () => { if ($('#admin-data')) window.gtLoadAdmin(); });
  $('#admin-refresh')?.addEventListener('click', () => window.gtLoadAdmin());
})();

