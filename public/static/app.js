// Gumti Textiles — global UI behaviors
(function () {
  'use strict';

  // ---------- Sticky header ----------
  const header = document.getElementById('site-header');
  const alwaysDark = header && header.dataset.darkNav === '1';
  function onScroll() {
    if (!header) return;
    if (alwaysDark || window.scrollY > 40) header.classList.add('nav-solid');
    else header.classList.remove('nav-solid');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Mobile menu ----------
  const menu = document.getElementById('mobile-menu');
  const btnOpen = document.getElementById('mobile-menu-btn');
  const btnClose = document.getElementById('mobile-menu-close');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('flex', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (btnOpen) btnOpen.setAttribute('aria-expanded', String(open));
    if (open && btnClose) btnClose.focus();
  }
  btnOpen && btnOpen.addEventListener('click', () => setMenu(true));
  btnClose && btnClose.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---------- Scroll reveal ----------
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal, .reveal-img').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-img').forEach((el) => el.classList.add('in'));
  }

  // ---------- Number counters ----------
  if (!reduced && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        const el = en.target, target = parseInt(el.dataset.count, 10) || 0;
        const t0 = performance.now(), dur = 1200;
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toString();
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));
  }

  // ---------- Capability accordion ----------
  document.querySelectorAll('.cap-item').forEach((item) => {
    const btn = item.querySelector('.cap-toggle');
    btn && btn.addEventListener('click', () => {
      const open = item.dataset.open === '1';
      document.querySelectorAll('.cap-item').forEach((i) => { i.dataset.open = '0'; i.querySelector('.cap-toggle')?.setAttribute('aria-expanded', 'false'); });
      item.dataset.open = open ? '0' : '1';
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  // ---------- Journey scroll stages ----------
  const stages = document.querySelectorAll('.journey-stage');
  if (stages.length && 'IntersectionObserver' in window) {
    const jio = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle('active', en.isIntersecting));
    }, { threshold: 0.55 });
    stages.forEach((s) => jio.observe(s));
  }

  // ---------- Fabric-to-garment slider (Spec §65) ----------
  const cmp = document.getElementById('fabric-compare');
  if (cmp) {
    const range = cmp.querySelector('input[type=range]');
    const topImg = cmp.querySelector('.cmp-top');
    const bar = cmp.querySelector('.cmp-bar');
    range && range.addEventListener('input', () => {
      const v = range.value;
      if (topImg) topImg.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      if (bar) bar.style.left = v + '%';
    });
  }

  // ---------- Toast ----------
  window.gtToast = function (msg, ok) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.borderColor = ok === false ? '#DC2626' : '#C7B79C';
    t.classList.remove('hidden');
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => t.classList.add('hidden'), 5000);
  };

  // ---------- Product filters (instant, URL-preserving; Spec §18) ----------
  const filterForm = document.getElementById('product-filters');
  if (filterForm) {
    const grid = document.getElementById('product-grid');
    const count = document.getElementById('product-count');
    let deb;
    async function applyFilters(push) {
      const fd = new FormData(filterForm);
      const params = new URLSearchParams();
      for (const [k, v] of fd.entries()) if (v) params.set(k, v);
      const qs = params.toString();
      if (push) history.replaceState(null, '', qs ? '/products?' + qs : '/products');
      try {
        const res = await fetch('/api/products?' + qs);
        const data = await res.json();
        if (grid) grid.innerHTML = data.html;
        if (count) count.textContent = data.count + ' product' + (data.count === 1 ? '' : 's');
      } catch (e) { /* keep current */ }
    }
    filterForm.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => applyFilters(true), 200); });
    filterForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(true); });
  }

  // ---------- Product comparison (Spec §19) ----------
  const CMP_KEY = 'gt_compare';
  function getCompare() { try { return JSON.parse(localStorage.getItem(CMP_KEY) || '[]'); } catch { return []; } }
  function setCompare(list) { localStorage.setItem(CMP_KEY, JSON.stringify(list.slice(0, 3))); updateCompareBar(); }
  function updateCompareBar() {
    const bar = document.getElementById('compare-bar');
    if (!bar) return;
    const list = getCompare();
    bar.classList.toggle('hidden', list.length === 0);
    const n = document.getElementById('compare-count');
    if (n) n.textContent = list.length;
    const link = document.getElementById('compare-link');
    if (link) link.href = '/products/compare?items=' + list.join(',');
    document.querySelectorAll('[data-compare]').forEach((b) => {
      const on = list.includes(b.dataset.compare);
      b.classList.toggle('bg-navy', on); b.classList.toggle('text-white', on);
      b.querySelector('span') && (b.querySelector('span').textContent = on ? 'In Compare' : 'Compare');
    });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-compare]');
    if (!b) return;
    e.preventDefault();
    let list = getCompare();
    const slug = b.dataset.compare;
    if (list.includes(slug)) list = list.filter((s) => s !== slug);
    else if (list.length >= 3) { window.gtToast('You can compare up to 3 products.', false); return; }
    else list.push(slug);
    setCompare(list);
  });
  const clearCmp = document.getElementById('compare-clear');
  clearCmp && clearCmp.addEventListener('click', () => setCompare([]));
  updateCompareBar();

  // ---------- Generic AJAX forms (RFQ / contact / sample / application) ----------
  document.querySelectorAll('form[data-ajax]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const orig = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Submitting…'; }
      const payload = {};
      new FormData(form).forEach((v, k) => { payload[k] = v; });
      // attach firebase user if signed in
      if (window.gtUser) { payload._uid = window.gtUser.uid; payload._userEmail = window.gtUser.email; }
      try {
        const res = await fetch(form.dataset.ajax, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Submission failed');
        const ok = document.getElementById(form.dataset.success || '');
        if (ok) {
          form.classList.add('hidden');
          ok.classList.remove('hidden');
          const idEl = ok.querySelector('[data-ref-id]');
          if (idEl && data.id) idEl.textContent = data.id;
          ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.gtToast(data.message || 'Submitted successfully.');
          form.reset();
        }
        // Mirror to Firestore for the client-side record (best effort)
        if (window.gtFirestoreSave && data.collection) window.gtFirestoreSave(data.collection, Object.assign({}, payload, { refId: data.id || null }));
      } catch (err) {
        window.gtToast(err.message || 'Something went wrong. Please try again.', false);
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = orig; }
      }
    });
  });
})();
