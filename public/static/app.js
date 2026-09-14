// Gumti Textiles Ltd. — Luxury Industrial Platform Core Logic
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ================= 1. THEME SWITCHER MANAGER =================
  const themeBtn = $('#theme-toggle');
  const themeIcon = $('#theme-icon');

  function updateThemeUI(theme) {
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-sun text-xs text-amber-500';
      } else {
        themeIcon.className = 'fa-solid fa-moon text-xs text-[#00E599]';
      }
    }
  }

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gt_theme', 'light');
      updateThemeUI('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('gt_theme', 'dark');
      updateThemeUI('dark');
    }
    document.dispatchEvent(new CustomEvent('gt:theme-change', { detail: { theme } }));
  }

  const initialTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
  updateThemeUI(initialTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      setTheme(next);
    });
  }

  // ================= 2. LUXURY BRAND INTRO (1.2s) =================
  const introOverlay = $('#gt-intro-overlay');
  const skipBtn = $('#intro-skip-btn');

  function dismissIntro() {
    if (!introOverlay) return;
    introOverlay.classList.add('intro-hidden');
    sessionStorage.setItem('gt_intro_seen', '1');
    setTimeout(() => {
      if (introOverlay.parentNode) introOverlay.remove();
    }, 600);
  }

  if (introOverlay) {
    if (reduced || sessionStorage.getItem('gt_intro_seen')) {
      dismissIntro();
    } else {
      setTimeout(dismissIntro, 1350);
      if (skipBtn) skipBtn.addEventListener('click', dismissIntro);
      introOverlay.addEventListener('click', (e) => {
        if (e.target !== skipBtn) dismissIntro();
      });
    }
  }

  // ================= 3. THREE.JS HERO CANVAS =================
  const heroCanvas = $('#hero-three-canvas');
  let threeAnimId = null;
  let threeMesh = null;
  let threeMaterial = null;

  if (heroCanvas && window.THREE && !reduced && !isMobile) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 100);
      camera.position.z = 7;

      const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
      renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Parametric Woven Textile Geometry (Torus Knot resembling looped fiber structure)
      const geometry = new THREE.TorusKnotGeometry(2.2, 0.48, 128, 20, 2, 3);
      
      const isDark = !document.documentElement.classList.contains('light');
      threeMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x00E599 : 0x059669,
        wireframe: true,
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: isDark ? 0.35 : 0.22,
      });

      threeMesh = new THREE.Mesh(geometry, threeMaterial);
      scene.add(threeMesh);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x00D2FF, 1.2);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);

      // Mouse Parallax
      let targetX = 0;
      let targetY = 0;
      window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      }, { passive: true });

      // Theme Sync
      document.addEventListener('gt:theme-change', (e) => {
        if (!threeMaterial) return;
        const dark = e.detail.theme === 'dark';
        threeMaterial.color.setHex(dark ? 0x00E599 : 0x059669);
        threeMaterial.opacity = dark ? 0.35 : 0.22;
      });

      let isVisible = true;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { isVisible = en.isIntersecting; });
      }, { threshold: 0.05 });
      io.observe(heroCanvas);

      function animate() {
        threeAnimId = requestAnimationFrame(animate);
        if (!isVisible) return;
        threeMesh.rotation.x += 0.0015;
        threeMesh.rotation.y += 0.0022;
        threeMesh.position.x += (targetX - threeMesh.position.x) * 0.05;
        threeMesh.position.y += (-targetY - threeMesh.position.y) * 0.05;
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', () => {
        if (!heroCanvas) return;
        const w = heroCanvas.clientWidth;
        const h = heroCanvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, { passive: true });
    } catch (e) {
      console.warn('Three.js canvas fallback:', e);
    }
  }

  // ================= 4. FIXED HEADER SCROLL DYNAMICS =================
  const header = $('#site-header');
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (header) {
        if (y > 24) header.classList.add('nav-solid');
        else header.classList.remove('nav-solid');

        if (y > 180 && y > lastY + 8) header.classList.add('nav-hidden');
        else if (y < lastY - 8 || y < 100) header.classList.remove('nav-hidden');
      }
      lastY = y;
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ================= 5. MOBILE MENU DRAWER =================
  const mobileMenu = $('#mobile-menu');
  const btnOpenMenu = $('#mobile-menu-btn');
  const btnCloseMenu = $('#mobile-menu-close');

  function setMobileMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    mobileMenu.classList.toggle('flex', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (btnOpenMenu) btnOpenMenu.setAttribute('aria-expanded', String(open));
    if (open && btnCloseMenu) btnCloseMenu.focus();
  }

  if (btnOpenMenu) btnOpenMenu.addEventListener('click', () => setMobileMenu(true));
  if (btnCloseMenu) btnCloseMenu.addEventListener('click', () => setMobileMenu(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setMobileMenu(false);
      closeAI();
    }
  });

  // ================= 6. TOAST NOTIFICATIONS =================
  window.showToast = function (msg, type = 'success') {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `fixed bottom-24 md:bottom-8 right-4 z-[80] max-w-sm px-5 py-4 rounded-xl shadow-2xl border text-xs flex items-center gap-3 transition-all duration-300 ${
      type === 'error' ? 'bg-rose-950/90 text-rose-200 border-rose-500/40' : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[#00E599]/50'
    }`;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  };

  // ================= 7. MULTI-STEP RFQ PROCUREMENT WIZARD =================
  const rfqForm = $('#rfq-wizard-form');
  if (rfqForm) {
    let currentStep = 1;
    const totalSteps = 6;

    const stepSections = $$('.rfq-wizard-step', rfqForm);
    const stepNodes = $$('.wizard-step-node', rfqForm);
    const fillTrack = $('#wizard-progress-fill');
    const prevBtn = $('#wizard-prev-btn');
    const nextBtn = $('#wizard-next-btn');
    const submitBtn = $('#wizard-submit-btn');

    function updateWizardUI() {
      stepSections.forEach((s) => {
        const stepNum = parseInt(s.dataset.step, 10);
        s.classList.toggle('hidden', stepNum !== currentStep);
      });

      stepNodes.forEach((node) => {
        const stepNum = parseInt(node.dataset.step, 10);
        node.classList.toggle('active', stepNum === currentStep);
        node.classList.toggle('completed', stepNum < currentStep);
      });

      if (fillTrack) {
        const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        fillTrack.style.width = `${percent}%`;
      }

      if (prevBtn) prevBtn.classList.toggle('invisible', currentStep === 1);
      if (nextBtn) nextBtn.classList.toggle('hidden', currentStep === totalSteps);
      if (submitBtn) submitBtn.classList.toggle('hidden', currentStep !== totalSteps);

      // Populate summary on step 6
      if (currentStep === totalSteps) {
        const sumProduct = $('#sum-product');
        const sumSpecs = $('#sum-specs');
        const sumQty = $('#sum-qty');
        const sumDelivery = $('#sum-delivery');
        const sumBuyer = $('#sum-buyer');

        const product = $('#rfq-product')?.value || 'Custom Program';
        const comp = $('#rfq-composition')?.value || '100% Combed Cotton';
        const gsm = $('#rfq-gsm')?.value || '180';
        const qty = $('#rfq-quantity')?.value || '0';
        const unit = $('#rfq-unit')?.value || 'Pieces';
        const date = $('#rfq-delivery')?.value || 'Standard (60-75 days)';
        const company = $('#rfq-company')?.value || '—';
        const contact = $('#rfq-contact')?.value || '—';
        const email = $('#rfq-email')?.value || '—';

        if (sumProduct) sumProduct.textContent = product;
        if (sumSpecs) sumSpecs.textContent = `${comp} · ${gsm} GSM`;
        if (sumQty) sumQty.textContent = `${qty} ${unit}`;
        if (sumDelivery) sumDelivery.textContent = date;
        if (sumBuyer) sumBuyer.textContent = `${contact} (${company}) — ${email}`;
      }
    }

    function validateStep(step) {
      if (step === 1) {
        const product = $('#rfq-product')?.value.trim();
        if (!product) {
          window.showToast('Please specify a product or program name.', 'error');
          return false;
        }
      }
      if (step === 3) {
        const qty = $('#rfq-quantity')?.value.trim();
        if (!qty || Number(qty) < 1) {
          window.showToast('Please enter a valid target quantity.', 'error');
          return false;
        }
      }
      if (step === 5) {
        const comp = $('#rfq-company')?.value.trim();
        const contact = $('#rfq-contact')?.value.trim();
        const email = $('#rfq-email')?.value.trim();
        if (!comp || !contact) {
          window.showToast('Company name and contact person are required.', 'error');
          return false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          window.showToast('Please provide a valid business email address.', 'error');
          return false;
        }
      }
      return true;
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < totalSteps) {
          currentStep++;
          updateWizardUI();
          window.scrollTo({ top: rfqForm.offsetTop - 100, behavior: 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateWizardUI();
        }
      });
    }

    stepNodes.forEach((node) => {
      node.addEventListener('click', () => {
        const stepNum = parseInt(node.dataset.step, 10);
        if (stepNum < currentStep) {
          currentStep = stepNum;
          updateWizardUI();
        } else if (stepNum === currentStep + 1 && validateStep(currentStep)) {
          currentStep = stepNum;
          updateWizardUI();
        }
      });
    });

    rfqForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep(5)) return;

      const fd = new FormData(rfqForm);
      const data = Object.fromEntries(fd.entries());
      if (data._hp) return; // Honeypot

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting RFQ…`;

      try {
        const res = await fetch('/api/rfq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Submission failed');

        const successBox = $('#rfq-success-container');
        const trackingRef = $('#rfq-tracking-ref');
        if (trackingRef) trackingRef.textContent = result.id;
        if (rfqForm) rfqForm.classList.add('hidden');
        if (successBox) successBox.classList.remove('hidden');

        window.showToast(`Quotation Request ${result.id} submitted successfully!`);
      } catch (err) {
        window.showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Official RFQ</span> <i class="fa-solid fa-check text-xs ml-1"></i>`;
      }
    });

    updateWizardUI();
  }

  // ================= 8. GUMTI AI ASSISTANT PANEL =================
  const aiToggle = $('#ai-toggle');
  const aiPanel = $('#ai-panel');
  const aiClose = $('#ai-close');
  const aiForm = $('#ai-form');
  const aiInput = $('#ai-input');
  const aiMessages = $('#ai-messages');

  function openAI() {
    if (!aiPanel) return;
    aiPanel.removeAttribute('hidden');
    if (aiToggle) aiToggle.setAttribute('aria-expanded', 'true');
    if (aiInput) aiInput.focus();
  }

  function closeAI() {
    if (!aiPanel) return;
    aiPanel.setAttribute('hidden', '');
    if (aiToggle) aiToggle.setAttribute('aria-expanded', 'false');
  }

  if (aiToggle) aiToggle.addEventListener('click', () => {
    if (aiPanel && aiPanel.hasAttribute('hidden')) openAI();
    else closeAI();
  });
  if (aiClose) aiClose.addEventListener('click', closeAI);

  // Quick Prompt Buttons
  $$('.ai-prompt-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.aiQ;
      if (q && aiInput) {
        aiInput.value = q;
        if (aiForm) aiForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  const chatHistory = [];
  if (aiForm) {
    aiForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = (aiInput?.value || '').trim();
      if (!text) return;
      if (aiInput) aiInput.value = '';

      // Append user msg
      const userMsg = document.createElement('article');
      userMsg.className = 'ai-msg user';
      userMsg.innerHTML = `<p>${esc(text)}</p>`;
      aiMessages?.appendChild(userMsg);
      if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;

      // Loading bubble
      const botMsg = document.createElement('article');
      botMsg.className = 'ai-msg bot';
      botMsg.innerHTML = `<p class="flex items-center gap-2"><i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Reviewing factory database…</span></p>`;
      aiMessages?.appendChild(botMsg);
      if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: chatHistory.slice(-4) }),
        });
        const data = await res.json();
        const reply = data.reply || "Thank you for connecting with Gumti Textiles. Please contact our sales team at info@gumtitex.com.";

        botMsg.innerHTML = `<p>${reply.replace(/\n/g, '<br/>')}</p><small class="text-[10px] text-[#788A9C] block mt-1.5">Official Factory AI · Powered by Gemini</small>`;
        chatHistory.push({ role: 'user', text }, { role: 'model', text: reply });
      } catch (err) {
        botMsg.innerHTML = `<p>We specialize in knit composite manufacturing (50T/day dyeing, 10T/day knitting, 80T/day finishing, 35k pcs/day sewing). Please submit an RFQ or email info@gumtitex.com.</p>`;
      }
      if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;
    });
  }

  // ================= 9. ANIMATED NUMBER COUNTERS =================
  if (!reduced && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        const el = en.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const t0 = performance.now();
        const dur = 1400;
        function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    $$('[data-count]').forEach((el) => cio.observe(el));
  }

  // ================= 11. ADMIN OPERATIONS CONSOLE ENGINE =================
  const KANBAN_STAGES = ['NEW', 'UNDER REVIEW', 'PRICING', 'QUOTED', 'SAMPLE APPROVED', 'PRODUCTION'];

  function closeAdminSidebar() {
    const sidebar = $('#admin-sidebar');
    const backdrop = $('#admin-sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.add('hidden');
  }

  function openAdminSidebar() {
    const sidebar = $('#admin-sidebar');
    const backdrop = $('#admin-sidebar-backdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.remove('hidden');
  }

  $('#admin-sidebar-toggle')?.addEventListener('click', openAdminSidebar);
  $('#admin-sidebar-close')?.addEventListener('click', closeAdminSidebar);
  $('#admin-sidebar-backdrop')?.addEventListener('click', closeAdminSidebar);

  function switchAdminTab(tabId) {
    if (!tabId) tabId = 'overview';
    sessionStorage.setItem('gt_admin_active_tab', tabId);

    $$('.dash-nav-item[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
      btn.classList.toggle('bg-[var(--bg-input)]', btn.dataset.tab === tabId);
    });

    $$('.dash-nav-pill[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
      btn.classList.toggle('bg-[#00E599]', btn.dataset.tab === tabId);
      btn.classList.toggle('text-[#050B10]', btn.dataset.tab === tabId);
    });

    const sections = $$('.dash-tab-content');
    sections.forEach((sec) => {
      const isTarget = sec.id === `admin-${tabId}-section`;
      sec.classList.toggle('hidden', !isTarget);
      if (isTarget) {
        const name = sec.dataset.tabName || (tabId.charAt(0).toUpperCase() + tabId.slice(1));
        const breadcrumb = $('#admin-breadcrumb-tab');
        if (breadcrumb) breadcrumb.textContent = name;
      }
    });

    closeAdminSidebar();
  }
  window.switchAdminTab = switchAdminTab;

  window.gtLoadAdmin = async function (force = false) {
    const root = $('#admin-data');
    if (!root) return;

    $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.add('fa-spin'));

    const authCache = localStorage.getItem('gt_auth_user');
    if (!window.gtUser && !authCache) {
      root.innerHTML = `
        <div class="editorial-card p-12 text-center max-w-lg mx-auto space-y-4">
          <i class="fa-solid fa-shield-halved text-4xl text-[#00E599] mb-2 block"></i>
          <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Authentication Required</h2>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            Sign in with an authorized administrator account (<code class="text-[#00E599] font-mono">bornilmahmud56@gmail.com</code>) to unlock operations.
          </p>
          <div class="pt-3 flex justify-center gap-3">
            <button data-google-signin class="pill-btn-emerald py-2.5 px-5 text-xs">
              <i class="fa-brands fa-google mr-1.5"></i> Google Sign In
            </button>
            <a href="/login" class="pill-btn-outline py-2.5 px-5 text-xs">Email Login</a>
          </div>
        </div>`;
      $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.remove('fa-spin'));
      return;
    }

    try {
      const token = window.gtAdminToken ? await window.gtAdminToken() : 'dev-token:bornilmahmud56@gmail.com';
      const [res, prodRes] = await Promise.all([
        fetch('/api/admin/overview', { headers: { Authorization: 'Bearer ' + token } }),
        fetch('/api/admin/products', { headers: { Authorization: 'Bearer ' + token } })
      ]);
      const data = await res.json();
      try {
        const prodData = await prodRes.json();
        data.products = prodData.products || [];
      } catch {
        data.products = [];
      }
      if (!res.ok) throw new Error(data.error || 'Access denied');

      root.innerHTML = renderAdminDashboard(data);
      bindAdminEvents(data);

      const activeTab = sessionStorage.getItem('gt_admin_active_tab') || 'overview';
      switchAdminTab(activeTab);
    } catch (err) {
      root.innerHTML = `
        <div class="editorial-card p-10 text-center border-amber-500/30 max-w-lg mx-auto space-y-3">
          <i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500"></i>
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Operations Access Restricted</h3>
          <p class="text-xs text-[var(--text-muted)]">${esc(err.message)}</p>
          <div class="pt-2">
            <a href="/profile" class="pill-btn-emerald py-2 px-5 text-xs">Return to Profile</a>
          </div>
        </div>`;
    } finally {
      $$('#admin-refresh i, #admin-refresh-top i').forEach((i) => i.classList.remove('fa-spin'));
    }
  };

  function renderAdminDashboard(data) {
    const stats = data.stats || {};
    const rfqs = data.rfqs || [];
    const recent = data.recent_activity || [];
    const mediaList = data.media_assets || [];
    const prodsList = data.products || [];
    const users = data.users || [];
    const cfg = data.landing_config || {};

    return `
      <!-- 1. OVERVIEW & DASHBOARD TAB -->
      <div id="admin-overview-section" class="dash-tab-content space-y-8" data-tab-name="Overview">
        <!-- Executive Status Header -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-[#00E599]/10 via-[var(--bg-card)] to-[#008F5D]/10 border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E599] via-[#008F5D] to-[#046A44] border border-[#00E599]/30 flex items-center justify-center text-white shrink-0 shadow-md">
              <i class="fa-solid fa-industry text-xl"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-extrabold uppercase tracking-wider text-[var(--text-primary)] font-display">GUMTI TEXTILES OPERATIONS CONTROL</span>
                <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30">Live Cloudflare D1</span>
              </div>
              <p class="text-xs text-[var(--text-muted)] mt-0.5">Est. 1993 · Gazipur Composite Plant · Motijheel Head Office · BGMEA Reg. 2443 · EPB Reg. 3311</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 shrink-0">
            <a href="/" target="_blank" class="pill-btn-outline py-2 px-4 text-xs">
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> View Public Site
            </a>
            <button type="button" class="pill-btn-emerald py-2 px-4 text-xs" onclick="window.switchAdminTab('rfqs')">
              <i class="fa-solid fa-file-invoice-dollar text-[10px]"></i> Sourcing Pipeline
            </button>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="editorial-card p-5 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Active RFQs</span>
            <p class="text-2xl font-bold font-display text-[var(--text-primary)]">${stats.rfqs || 0}</p>
            <span class="text-[10px] text-[#00E599] font-mono">D1 Operational Record</span>
          </div>
          <div class="editorial-card p-5 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Pending Reviews</span>
            <p class="text-2xl font-bold font-display text-amber-500">${stats.pending_rfqs || 0}</p>
            <span class="text-[10px] text-[var(--text-muted)]">Requires Costing</span>
          </div>
          <div class="editorial-card p-5 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Sample Requests</span>
            <p class="text-2xl font-bold font-display text-[#00D2FF]">${stats.samples || 0}</p>
            <span class="text-[10px] text-[var(--text-muted)]">Swatch Shipments</span>
          </div>
          <div class="editorial-card p-5 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Inquiries & Jobs</span>
            <p class="text-2xl font-bold font-display text-[var(--text-primary)]">${(stats.inquiries || 0) + (stats.job_applications || 0)}</p>
            <span class="text-[10px] text-[var(--text-muted)]">Commercial Intake</span>
          </div>
        </div>

        <!-- Direct Operations & Management Hub (4 Key Short-cuts) -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Direct Management & Updates Hub</h3>
            <span class="text-[11px] text-[#00E599] font-mono">1-Click Fast Configuration</span>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div class="editorial-card p-4 space-y-2 cursor-pointer hover:border-[#00E599] transition-all" onclick="window.switchAdminTab('contact')">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center text-sm"><i class="fa-solid fa-address-book"></i></div>
                <span class="text-[10px] font-bold text-[#00E599] uppercase tracking-wider">Update ➔</span>
              </div>
              <h4 class="font-bold text-xs text-[var(--text-primary)]">Contact Coordinates</h4>
              <p class="text-[11px] text-[var(--text-muted)]">Email, Phone, WhatsApp, Gazipur Plant & Dhaka Head Office.</p>
            </div>

            <div class="editorial-card p-4 space-y-2 cursor-pointer hover:border-purple-500 transition-all" onclick="window.switchAdminTab('cms')">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center text-sm"><i class="fa-solid fa-image"></i></div>
                <span class="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Update ➔</span>
              </div>
              <h4 class="font-bold text-xs text-[var(--text-primary)]">Landing Page Images</h4>
              <p class="text-[11px] text-[var(--text-muted)]">Hero background, About section image & facilities photo.</p>
            </div>

            <div class="editorial-card p-4 space-y-2 cursor-pointer hover:border-[#E5C378] transition-all" onclick="window.switchAdminTab('products')">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-xl bg-[#E5C378]/15 text-[#E5C378] flex items-center justify-center text-sm"><i class="fa-solid fa-shirt"></i></div>
                <span class="text-[10px] font-bold text-[#E5C378] uppercase tracking-wider">Update ➔</span>
              </div>
              <h4 class="font-bold text-xs text-[var(--text-primary)]">Product Catalog & Images</h4>
              <p class="text-[11px] text-[var(--text-muted)]">Update photos for ${prodsList.length} active knitwear programs or add new.</p>
            </div>

            <div class="editorial-card p-4 space-y-2 cursor-pointer hover:border-purple-400 transition-all" onclick="window.switchAdminTab('company')">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center text-sm"><i class="fa-solid fa-building"></i></div>
                <span class="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Update ➔</span>
              </div>
              <h4 class="font-bold text-xs text-[var(--text-primary)]">Basic Company Info</h4>
              <p class="text-[11px] text-[var(--text-muted)]">Est. 1993, BGMEA 2443, 1,600 Workforce, and daily capacities.</p>
            </div>

          </div>
        </div>

        <!-- Live Snapshot Panel -->
        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Active Contact Snapshot -->
          <div class="editorial-card p-5 space-y-3">
            <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Active Public Coordinates</h4>
              <button type="button" class="text-[10px] text-[#00E599] font-bold hover:underline" onclick="window.switchAdminTab('contact')">Edit Coordinates</button>
            </div>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-[10px] text-[var(--text-muted)] block">Sales Email</span>
                <span class="font-bold text-[var(--text-primary)] truncate block">${esc(cfg.contactEmail || 'info@gumtitex.com')}</span>
              </div>
              <div>
                <span class="text-[10px] text-[var(--text-muted)] block">Direct Phone</span>
                <span class="font-bold text-[var(--text-primary)] block">${esc(cfg.contactPhone || '+880 2 9204481')}</span>
              </div>
              <div>
                <span class="text-[10px] text-[var(--text-muted)] block">Official WhatsApp</span>
                <span class="font-bold text-[#25D366] block">${esc(cfg.whatsappNumber || '+880 1329 713736')}</span>
              </div>
              <div>
                <span class="text-[10px] text-[var(--text-muted)] block">Founded Year</span>
                <span class="font-bold text-[var(--text-primary)] block">1993 (BGMEA 2443)</span>
              </div>
              <div class="col-span-2">
                <span class="text-[10px] text-[var(--text-muted)] block">Gazipur Manufacturing Plant</span>
                <span class="text-[11px] text-[var(--text-primary)] leading-tight block">${esc(cfg.contactAddress || 'Mouchak, Kaliakair, Gazipur, Bangladesh')}</span>
              </div>
            </div>
          </div>

          <!-- Active Media Snapshot -->
          <div class="editorial-card p-5 space-y-3">
            <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Active Visual Media</h4>
              <button type="button" class="text-[10px] text-[#00E599] font-bold hover:underline" onclick="window.switchAdminTab('cms')">Change Photos</button>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1 text-center">
                <div class="aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-input)]">
                  <img src="${cfg.heroBgImage || '/images/factory/stenter_clean_630x400.webp'}" alt="Hero" class="w-full h-full object-cover" />
                </div>
                <span class="text-[10px] text-[var(--text-muted)] block">Hero Image</span>
              </div>
              <div class="space-y-1 text-center">
                <div class="aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-input)]">
                  <img src="${cfg.aboutImage || '/images/hero/background_1920x530.webp'}" alt="About" class="w-full h-full object-cover" />
                </div>
                <span class="text-[10px] text-[var(--text-muted)] block">About Image</span>
              </div>
              <div class="space-y-1 text-center">
                <div class="aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-input)]">
                  <img src="${cfg.facilitiesImage || '/images/hero/corrected_1170x600.webp'}" alt="Facilities" class="w-full h-full object-cover" />
                </div>
                <span class="text-[10px] text-[var(--text-muted)] block">Facilities Image</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="editorial-card p-6">
          <h3 class="text-base font-bold font-display text-[var(--text-primary)] mb-4 border-b border-[var(--border-subtle)] pb-3">Recent Operational Activity</h3>
          <div class="divide-y divide-[var(--border-subtle)] text-xs">
            ${recent.map((a) => `
              <div class="py-3 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[var(--bg-input)] text-[#00E599] border border-[var(--border-subtle)]">${esc(a.type)}</span>
                  <div>
                    <span class="font-bold text-[var(--text-primary)]">${esc(a.ref)}</span>
                    <span class="text-[var(--text-muted)] ml-2">${esc(a.party || '')} · ${esc(a.title || '')}</span>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#00E599]/15 text-[#00E599]">${esc(a.status || 'NEW')}</span>
              </div>
            `).join('') || '<p class="text-xs text-[var(--text-muted)] py-4">No recent records logged.</p>'}
          </div>
        </div>
      </div>

      <!-- 2. COMPANY BASIC INFO TAB -->
      <div id="admin-company-section" class="dash-tab-content hidden space-y-6" data-tab-name="Company Basic Info">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Company Basic Information</h2>
            <p class="text-xs text-[var(--text-muted)]">Configure official corporate identity, credentials, registration numbers, and plant capacity.</p>
          </div>
          <span class="text-xs font-mono text-[#00E599] font-bold">Cloudflare D1 Backed</span>
        </div>

        <form id="admin-company-form" class="editorial-card p-6 space-y-5 text-xs">
          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Company Legal Name</label>
              <input name="companyName" class="w-full rounded-xl p-2.5 text-xs font-bold" value="${esc(cfg.companyName || 'Gumti Textiles Ltd.')}" required />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Founded / Established Year</label>
              <input name="estYear" class="w-full rounded-xl p-2.5 text-xs font-mono" value="${esc(cfg.estYear || '1993')}" required />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Sub-Tagline / Mission</label>
              <input name="heroSubTagline" class="w-full rounded-xl p-2.5 text-xs" value="${esc(cfg.heroSubTagline || 'Integrated Knit & Apparel Manufacturing · Bangladesh')}" />
            </div>
          </div>

          <div class="grid sm:grid-cols-4 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">BGMEA Registration</label>
              <input name="bgmeaReg" class="w-full rounded-xl p-2.5 text-xs font-mono" value="${esc(cfg.bgmeaReg || '2443')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">EPB Registration</label>
              <input name="epbReg" class="w-full rounded-xl p-2.5 text-xs font-mono" value="${esc(cfg.epbReg || '3311')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Total Workforce</label>
              <input name="workforceCount" class="w-full rounded-xl p-2.5 text-xs" value="${esc(cfg.workforceCount || '1,600')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Female Workforce %</label>
              <input name="femaleWorkforcePercent" class="w-full rounded-xl p-2.5 text-xs" value="${esc(cfg.femaleWorkforcePercent || '74%')}" />
            </div>
          </div>

          <div class="grid sm:grid-cols-4 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Dyeing Daily Capacity</label>
              <input name="dyeingCapacity" class="w-full rounded-xl p-2.5 text-xs font-bold text-[#00E599]" value="${esc(cfg.dyeingCapacity || '50T/Day')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Knitting Daily Capacity</label>
              <input name="knittingCapacity" class="w-full rounded-xl p-2.5 text-xs font-bold" value="${esc(cfg.knittingCapacity || '10T/Day')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Finishing Daily Capacity</label>
              <input name="finishingCapacity" class="w-full rounded-xl p-2.5 text-xs font-bold text-[#00E599]" value="${esc(cfg.finishingCapacity || '80T/Day')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Sewing Capacity (22 Lines)</label>
              <input name="sewingCapacity" class="w-full rounded-xl p-2.5 text-xs font-bold" value="${esc(cfg.sewingCapacity || '35,000 Pcs/Day')}" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">About Section Heading</label>
            <input name="aboutHeading" class="w-full rounded-xl p-2.5 text-xs font-bold" value="${esc(cfg.aboutHeading || 'CRAFTING POSSIBILITY.')}" />
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">About Narrative Text (Public Profile)</label>
            <textarea name="aboutText" rows="3" class="w-full rounded-xl p-2.5 text-xs leading-relaxed">${esc(cfg.aboutText || 'Gumti Textiles Ltd. began operations in 1993 and operates as an established, export-oriented knit-composite textile and apparel manufacturer in Bangladesh — integrating knitting, dyeing, finishing and garment manufacturing under one quality system.')}</textarea>
          </div>

          <div class="pt-2">
            <button type="submit" class="pill-btn-emerald py-2.5 px-6 text-xs">
              <i class="fa-solid fa-floppy-disk mr-1.5"></i>
              <span>Save Basic Information</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 3. CONTACT COORDINATES TAB -->
      <div id="admin-contact-section" class="dash-tab-content hidden space-y-6" data-tab-name="Contact Coordinates">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Contact Coordinates & Addresses</h2>
            <p class="text-xs text-[var(--text-muted)]">Manage direct sales channels, telephone lines, WhatsApp number, and physical plant locations.</p>
          </div>
          <span class="text-xs font-mono text-[#00E599] font-bold">Publicly Synced</span>
        </div>

        <form id="admin-contact-form" class="editorial-card p-6 space-y-5 text-xs">
          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Sales & Inquiry Email *</label>
              <input name="contactEmail" type="email" class="w-full rounded-xl p-2.5 text-xs font-bold" value="${esc(cfg.contactEmail || 'info@gumtitex.com')}" required />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Factory Telephone *</label>
              <input name="contactPhone" class="w-full rounded-xl p-2.5 text-xs font-mono" value="${esc(cfg.contactPhone || '+880 2 9204481')}" required />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Direct Official WhatsApp *</label>
              <input name="whatsappNumber" class="w-full rounded-xl p-2.5 text-xs font-mono text-[#25D366]" value="${esc(cfg.whatsappNumber || '+880 1329 713736')}" required />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Factory Plant Address (Gazipur) *</label>
              <textarea name="contactAddress" rows="2" class="w-full rounded-xl p-2.5 text-xs leading-relaxed" required>${esc(cfg.contactAddress || 'Mouchak, Kaliakair, Gazipur, Bangladesh')}</textarea>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Corporate Head Office Address (Dhaka) *</label>
              <textarea name="headOfficeAddress" rows="2" class="w-full rounded-xl p-2.5 text-xs leading-relaxed" required>${esc(cfg.headOfficeAddress || 'Jiban Bima Bhaban (3rd Floor), 10 Dilkusha C/A, Motijheel, Dhaka-1000, Bangladesh')}</textarea>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Official Facebook Page URL</label>
              <input name="facebookUrl" class="w-full rounded-xl p-2.5 text-xs" value="${esc(cfg.facebookUrl || 'https://www.facebook.com/gumtitextile')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Google Maps Coordinates / Embed</label>
              <input name="mapsUrl" class="w-full rounded-xl p-2.5 text-xs" value="Kaliakair, Gazipur (Chandra Industrial Zone)" readonly />
            </div>
          </div>

          <div class="pt-2">
            <button type="submit" class="pill-btn-emerald py-2.5 px-6 text-xs">
              <i class="fa-solid fa-floppy-disk mr-1.5"></i>
              <span>Save Contact Coordinates</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 4. LANDING PAGE & IMAGES TAB -->
      <div id="admin-cms-section" class="dash-tab-content hidden space-y-6" data-tab-name="Landing Page & Images">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Landing Page Images & Headlines</h2>
            <p class="text-xs text-[var(--text-muted)]">Select real photography from the 29 factory assets or input custom URLs.</p>
          </div>
          <span class="text-xs font-mono text-[#00E599] font-bold">Industrial Identity</span>
        </div>

        <form id="admin-cms-form" class="editorial-card p-6 space-y-6 text-xs">
          
          <!-- Image 1: Hero Showcase Image -->
          <div class="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">1. Hero Showcase Photography</span>
              <span class="text-[10px] text-[var(--text-muted)]">Main visual on homepage</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 items-center">
              <div class="w-32 h-20 rounded-lg overflow-hidden border border-[var(--border-medium)] bg-[var(--bg-surface)] shrink-0">
                <img id="preview-hero-bg" src="${cfg.heroBgImage || '/images/factory/stenter_clean_630x400.webp'}" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 w-full">
                <input id="input-hero-bg" name="heroBgImage" class="w-full rounded-xl p-2.5 text-xs font-mono" value="${esc(cfg.heroBgImage || '/images/factory/stenter_clean_630x400.webp')}" placeholder="/images/factory/..." />
                <span class="text-[10px] text-[var(--text-muted)] mt-1 block">Click any asset below to select instantly:</span>
              </div>
            </div>
            <!-- Quick Asset Chooser Strip -->
            <div class="flex gap-2 overflow-x-auto py-2 scrollbar-none">
              ${mediaList.slice(0, 10).map((m) => `
                <div class="hero-asset-thumb w-14 h-10 rounded-md overflow-hidden shrink-0 border border-[var(--border-subtle)] hover:border-[#00E599] cursor-pointer" data-url="${m.path || m.url}" title="${esc(m.name || m.title)}">
                  <img src="${m.path || m.url}" class="w-full h-full object-cover" />
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Image 2: About Section Image -->
          <div class="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">2. About Section Showcase Image</span>
              <span class="text-[10px] text-[var(--text-muted)]">Legacy narrative visual</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 items-center">
              <div class="w-32 h-20 rounded-lg overflow-hidden border border-[var(--border-medium)] bg-[var(--bg-surface)] shrink-0">
                <img id="preview-about-img" src="${cfg.aboutImage || '/images/hero/background_1920x530.webp'}" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 w-full">
                <input id="input-about-img" name="aboutImage" class="w-full rounded-xl p-2.5 text-xs font-mono" value="${esc(cfg.aboutImage || '/images/hero/background_1920x530.webp')}" placeholder="/images/..." />
                <span class="text-[10px] text-[var(--text-muted)] mt-1 block">Click any asset below to select:</span>
              </div>
            </div>
            <div class="flex gap-2 overflow-x-auto py-2 scrollbar-none">
              ${mediaList.slice(10, 20).map((m) => `
                <div class="about-asset-thumb w-14 h-10 rounded-md overflow-hidden shrink-0 border border-[var(--border-subtle)] hover:border-[#00E599] cursor-pointer" data-url="${m.path || m.url}" title="${esc(m.name || m.title)}">
                  <img src="${m.path || m.url}" class="w-full h-full object-cover" />
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Image 3: Facilities Showcase Image -->
          <div class="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">3. Factory Facilities Image</span>
              <span class="text-[10px] text-[var(--text-muted)]">Plant architecture visual</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 items-center">
              <div class="w-32 h-20 rounded-lg overflow-hidden border border-[var(--border-medium)] bg-[var(--bg-surface)] shrink-0">
                <img id="preview-fac-img" src="${cfg.facilitiesImage || '/images/hero/corrected_1170x600.webp'}" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 w-full">
                <input id="input-fac-img" name="facilitiesImage" class="w-full rounded-xl p-2.5 text-xs font-mono" value="${esc(cfg.facilitiesImage || '/images/hero/corrected_1170x600.webp')}" placeholder="/images/..." />
              </div>
            </div>
          </div>

          <!-- Hero Headlines -->
          <div class="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Hero Line 1</label>
              <input name="heroHeadlineLine1" class="w-full rounded-xl p-2.5 text-xs font-bold" value="${esc(cfg.heroHeadlineLine1 || 'ENGINEERING')}" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Hero Line 2 (Accent)</label>
              <input name="heroHeadlineLine2" class="w-full rounded-xl p-2.5 text-xs font-bold text-[#00E599]" value="${esc(cfg.heroHeadlineLine2 || 'QUALITY.')}" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Hero Kicker Pill</label>
            <input name="heroKicker" class="w-full rounded-xl p-2.5 text-xs" value="${esc(cfg.heroKicker || 'KNIT COMPOSITE MANUFACTURING · EST. 1993')}" />
          </div>

          <div class="pt-2 flex items-center gap-3">
            <button type="submit" class="pill-btn-emerald py-2.5 px-6 text-xs">
              <i class="fa-solid fa-cloud-arrow-up mr-1.5"></i>
              <span>Publish Images & Headlines</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 5. PRODUCT CATALOG & IMAGES TAB -->
      <div id="admin-products-section" class="dash-tab-content hidden space-y-6" data-tab-name="Product Management">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Product Catalog & Product Images</h2>
            <p class="text-xs text-[var(--text-muted)]">Update photography for active knitwear styles or add new export lines with custom pictures.</p>
          </div>
          <span class="text-xs font-mono text-[#E5C378] font-bold">Total Programs: ${prodsList.length}</span>
        </div>

        <!-- Active Products Grid with Instant Image Picker -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Active Export Products (${prodsList.length})</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${prodsList.map((p) => `
              <div class="editorial-card p-3 space-y-2 flex flex-col justify-between" id="prod-card-${esc(p.slug)}">
                <div>
                  <div class="aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg-input)] relative border border-[var(--border-subtle)]">
                    <img id="prod-img-${esc(p.slug)}" src="${p.image || '/images/products/crew_tshirt.webp'}" alt="${esc(p.name)}" class="w-full h-full object-cover" />
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#060B10]/80 text-[#00E599]">${esc(p.code || 'GT')}</span>
                  </div>
                  <div class="pt-2">
                    <p class="font-bold text-xs text-[var(--text-primary)] truncate">${esc(p.name)}</p>
                    <p class="text-[10px] text-[var(--text-muted)]">${esc(p.category)} · ${esc(p.gsm || '180')} GSM</p>
                  </div>
                </div>

                <div class="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                  <button type="button" class="change-prod-img-toggle text-[11px] font-bold text-[#00E599] hover:underline flex items-center gap-1" data-slug="${esc(p.slug)}">
                    <i class="fa-regular fa-image text-xs"></i> Change Photo
                  </button>
                  <!-- Inline photo chooser container -->
                  <div id="prod-chooser-${esc(p.slug)}" class="hidden p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1.5">
                    <input id="input-img-${esc(p.slug)}" type="text" class="w-full rounded p-1 text-[10px] font-mono" value="${esc(p.image || '')}" placeholder="Image URL" />
                    <div class="flex gap-1 overflow-x-auto py-1 scrollbar-none">
                      ${mediaList.slice(0, 8).map((m) => `
                        <div class="mini-asset-pick w-7 h-5 rounded overflow-hidden shrink-0 border cursor-pointer" data-slug="${esc(p.slug)}" data-url="${m.path || m.url}">
                          <img src="${m.path || m.url}" class="w-full h-full object-cover" />
                        </div>
                      `).join('')}
                    </div>
                    <button type="button" class="apply-prod-img-btn pill-btn-emerald py-1 px-3 text-[10px] w-full text-center" data-slug="${esc(p.slug)}">
                      Apply Photo
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Add New Product Form Card -->
        <div class="editorial-card p-6">
          <h3 class="text-base font-bold font-display text-[var(--text-primary)] mb-4 border-b border-[var(--border-subtle)] pb-2">Add New Fabric or Style to Catalog</h3>
          <form id="admin-add-product-form" class="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Product Name *</label>
              <input name="name" class="w-full rounded-xl p-2.5 text-xs font-bold" required placeholder="e.g. Organic Loopback Terry Hoodie" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Product Code *</label>
              <input name="code" class="w-full rounded-xl p-2.5 text-xs font-mono" required placeholder="e.g. GT-HD-005" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Category *</label>
              <select name="category" class="w-full rounded-xl p-2.5 text-xs" required>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Polo Shirts">Polo Shirts</option>
                <option value="Knit Jackets">Knit Jackets</option>
                <option value="Shorts">Shorts</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Composition *</label>
              <input name="composition" class="w-full rounded-xl p-2.5 text-xs" required value="100% Organic Combed Cotton" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Construction *</label>
              <input name="construction" class="w-full rounded-xl p-2.5 text-xs" required value="French Terry 3-End Fleece" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Weight (GSM) *</label>
              <input name="gsm" class="w-full rounded-xl p-2.5 text-xs" required value="320" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Finish</label>
              <input name="finish" class="w-full rounded-xl p-2.5 text-xs" value="Carbon Peach Soft / Bio-Wash" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">MOQ</label>
              <input name="moq" class="w-full rounded-xl p-2.5 text-xs" value="1,000 Pcs" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Lead Time</label>
              <input name="lead_time" class="w-full rounded-xl p-2.5 text-xs" value="60–75 Days" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Product Image URL (Select from library below or enter path)</label>
              <div class="flex gap-3 items-center">
                <input id="input-newprod-img" name="image" class="w-full rounded-xl p-2.5 text-xs font-mono" value="/images/products/fleece_jacket.webp" />
                <div class="w-12 h-10 rounded-lg overflow-hidden border border-[var(--border-subtle)] shrink-0">
                  <img id="preview-newprod-img" src="/images/products/fleece_jacket.webp" class="w-full h-full object-cover" />
                </div>
              </div>
              <div class="flex gap-2 overflow-x-auto py-2 scrollbar-none mt-1">
                ${mediaList.slice(0, 12).map((m) => `
                  <div class="newprod-asset-thumb w-12 h-9 rounded overflow-hidden shrink-0 border border-[var(--border-subtle)] hover:border-[#00E599] cursor-pointer" data-url="${m.path || m.url}">
                    <img src="${m.path || m.url}" class="w-full h-full object-cover" />
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="sm:col-span-3 pt-2">
              <button type="submit" class="pill-btn-emerald py-2.5 px-6 text-xs">
                <span>Save to D1 Catalog</span>
                <i class="fa-solid fa-plus text-xs ml-1"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 6. RFQ PIPELINE KANBAN TAB -->
      <div id="admin-rfqs-section" class="dash-tab-content hidden space-y-6" data-tab-name="RFQ Pipeline">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Commercial RFQ Pipeline</h2>
            <p class="text-xs text-[var(--text-muted)]">Manage order intake and critical path status progression.</p>
          </div>
          <span class="text-xs font-mono text-[#00E599] font-bold">Total: ${rfqs.length}</span>
        </div>

        <div class="kanban-board">
          ${KANBAN_STAGES.map((st) => {
            const colRfqs = rfqs.filter((r) => (r.status || 'NEW').toUpperCase() === st);
            return `
              <div class="kanban-col">
                <div class="kanban-col-header">
                  <span class="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">${st}</span>
                  <span class="w-5 h-5 rounded-full bg-[var(--bg-input)] flex items-center justify-center text-[10px] font-bold text-[#00E599]">${colRfqs.length}</span>
                </div>
                <div class="space-y-3 flex-1 overflow-y-auto">
                  ${colRfqs.map((r) => `
                    <div class="kanban-card space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="font-mono text-xs font-bold text-[#00E599]">${esc(r.rfq_id)}</span>
                        <span class="text-[10px] text-[var(--text-muted)]">${r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB') : ''}</span>
                      </div>
                      <p class="font-bold text-xs text-[var(--text-primary)]">${esc(r.product || 'Custom Program')}</p>
                      <p class="text-[11px] text-[var(--text-muted)]">${esc(r.company_name)} · Qty: ${esc(String(r.quantity || ''))} ${esc(r.unit || '')}</p>
                      
                      <div class="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                        <select class="admin-rfq-status-select rounded-lg p-1 text-[10px] bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border-subtle)]" data-rfq-id="${esc(r.rfq_id)}">
                          ${KANBAN_STAGES.map((s) => `<option value="${s}" ${s === st ? 'selected' : ''}>Move: ${s}</option>`).join('')}
                        </select>
                        <button type="button" class="admin-open-quote-btn text-[10px] text-[#00D2FF] hover:underline font-bold" data-rfq-id="${esc(r.rfq_id)}" data-email="${esc(r.email)}">
                          Quote
                        </button>
                      </div>
                    </div>
                  `).join('') || '<div class="p-6 text-center text-[11px] text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-xl">No RFQs</div>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 7. QUOTATION BUILDER TAB -->
      <div id="admin-quotations-section" class="dash-tab-content hidden space-y-6" data-tab-name="Quotation Builder">
        <div>
          <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Commercial Quotation Builder</h2>
          <p class="text-xs text-[var(--text-muted)]">Generate formal costings and automatically link them to submitted RFQs.</p>
        </div>

        <div class="editorial-card p-6">
          <form id="admin-quote-form" class="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Target RFQ ID *</label>
              <input id="q-rfq-id" name="rfq_id" class="w-full rounded-xl p-2.5 text-xs font-mono" required placeholder="RFQ-GT-2026-XXXX" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Buyer Business Email *</label>
              <input id="q-email" name="email" type="email" class="w-full rounded-xl p-2.5 text-xs" required placeholder="buyer@brand.com" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Unit Price (USD) *</label>
              <input name="unit_price" type="number" step="0.01" class="w-full rounded-xl p-2.5 text-xs font-bold" required placeholder="4.50" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Quoted MOQ</label>
              <input name="moq_quoted" class="w-full rounded-xl p-2.5 text-xs" placeholder="e.g. 3,000 Pcs" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Lead Time (Days)</label>
              <input name="lead_time_days" type="number" class="w-full rounded-xl p-2.5 text-xs" value="65" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Payment Terms</label>
              <input name="payment_terms" class="w-full rounded-xl p-2.5 text-xs" value="LC at Sight / TT 30% Advance" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Commercial Notes & Inclusions</label>
              <textarea name="notes" rows="3" class="w-full rounded-xl p-2.5 text-xs" placeholder="FOB Chittagong port, standard single polybag packaging included..."></textarea>
            </div>
            <div class="sm:col-span-2 pt-2">
              <button type="submit" class="pill-btn-emerald py-3 px-8 text-xs">
                <span>Issue & Transmit Quotation</span>
                <i class="fa-solid fa-paper-plane text-xs ml-1.5"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 8. MEDIA LIBRARY TAB -->
      <div id="admin-media-section" class="dash-tab-content hidden space-y-6" data-tab-name="Media Library">
        <div>
          <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Factory Media Library (${mediaList.length} Assets)</h2>
          <p class="text-xs text-[var(--text-muted)]">Authentic factory photography extracted from Gumti corporate archives.</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          ${mediaList.map((m) => `
            <div class="editorial-card p-2 space-y-2">
              <div class="aspect-[4/3] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
                <img src="${m.path || m.url}" alt="${esc(m.name || m.title)}" class="w-full h-full object-cover" loading="lazy" />
              </div>
              <div class="px-1 text-[11px] space-y-1">
                <p class="font-bold text-[var(--text-primary)] truncate">${esc(m.name || m.title)}</p>
                <div class="flex items-center justify-between text-[10px]">
                  <span class="text-[var(--text-muted)] font-mono">${m.category}</span>
                  <button type="button" class="copy-url-btn text-[#00E599] hover:underline" data-url="${m.path || m.url}">Copy URL</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 9. USER DIRECTORY & RBAC TAB -->
      <div id="admin-users-section" class="dash-tab-content hidden space-y-6" data-tab-name="User Directory">
        <div>
          <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">User Directory & RBAC</h2>
          <p class="text-xs text-[var(--text-muted)]">Assign administrative privileges or view registered buyer profiles.</p>
        </div>

        <div class="editorial-card overflow-hidden">
          <table class="spec-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Date</th>
                <th>Role Action</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((u) => `
                <tr>
                  <td>
                    <div class="font-bold text-[var(--text-primary)]">${esc(u.displayName || u.email)}</div>
                    <div class="text-[11px] text-[var(--text-muted)] font-mono">${esc(u.email)}</div>
                  </td>
                  <td>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${u.role === 'admin' ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30' : (u.role === 'moderator' ? 'bg-[#00D2FF]/20 text-[#00D2FF]' : 'bg-[var(--bg-input)] text-[var(--text-secondary)]')}">
                      ${esc(u.role)}
                    </span>
                  </td>
                  <td class="text-xs text-[var(--text-muted)]">${u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                  <td>
                    <select class="admin-role-select rounded-lg p-1 text-[11px] bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border-subtle)]" data-email="${esc(u.email)}" data-uid="${esc(u.uid || '')}">
                      <option value="customer" ${u.role === 'customer' ? 'selected' : ''}>Customer</option>
                      <option value="moderator" ${u.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                      <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function bindAdminEvents(data) {
    // Tab buttons
    $$('.dash-nav-item[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
    });
    $$('.dash-nav-pill[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
    });

    // Refresh buttons
    $('#admin-refresh')?.addEventListener('click', () => window.gtLoadAdmin(true));
    $('#admin-refresh-top')?.addEventListener('click', () => window.gtLoadAdmin(true));

    // Asset pickers for CMS
    $$('.hero-asset-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const url = thumb.dataset.url;
        const inp = $('#input-hero-bg');
        const prev = $('#preview-hero-bg');
        if (inp) inp.value = url;
        if (prev) prev.src = url;
        window.showToast('Selected hero image: ' + url);
      });
    });

    $$('.about-asset-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const url = thumb.dataset.url;
        const inp = $('#input-about-img');
        const prev = $('#preview-about-img');
        if (inp) inp.value = url;
        if (prev) prev.src = url;
        window.showToast('Selected about image: ' + url);
      });
    });

    // New product asset picker
    $$('.newprod-asset-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const url = thumb.dataset.url;
        const inp = $('#input-newprod-img');
        const prev = $('#preview-newprod-img');
        if (inp) inp.value = url;
        if (prev) prev.src = url;
      });
    });

    // Toggle inline product image chooser
    $$('.change-prod-img-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.dataset.slug;
        const chooser = $(`#prod-chooser-${slug}`);
        if (chooser) chooser.classList.toggle('hidden');
      });
    });

    // Mini asset click in product card
    $$('.mini-asset-pick').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const slug = thumb.dataset.slug;
        const url = thumb.dataset.url;
        const inp = $(`#input-img-${slug}`);
        if (inp) inp.value = url;
        const img = $(`#prod-img-${slug}`);
        if (img) img.src = url;
      });
    });

    // Apply product image update button
    $$('.apply-prod-img-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const slug = btn.dataset.slug;
        const inp = $(`#input-img-${slug}`);
        const image = inp ? inp.value.trim() : '';
        if (!image) {
          window.showToast('Please enter or select an image URL', 'error');
          return;
        }
        try {
          const token = window.gtAdminToken ? await window.gtAdminToken() : '';
          const res = await fetch(`/api/admin/products/${encodeURIComponent(slug)}/image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
            body: JSON.stringify({ image }),
          });
          const r = await res.json();
          if (!res.ok) throw new Error(r.error || 'Failed to update image');
          const img = $(`#prod-img-${slug}`);
          if (img) img.src = image;
          $(`#prod-chooser-${slug}`)?.classList.add('hidden');
          window.showToast(`Updated image for ${slug}!`);
        } catch (err) {
          window.showToast(err.message, 'error');
        }
      });
    });

    // Copy URL button in media library
    $$('.copy-url-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        navigator.clipboard.writeText(url).then(() => {
          window.showToast('Copied URL to clipboard: ' + url);
        });
      });
    });

    // Kanban status update select
    $$('.admin-rfq-status-select').forEach((sel) => {
      sel.addEventListener('change', async () => {
        const rfqId = sel.dataset.rfqId;
        const newStatus = sel.value;
        try {
          const token = window.gtAdminToken ? await window.gtAdminToken() : '';
          const res = await fetch(`/api/admin/rfqs/${encodeURIComponent(rfqId)}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
            body: JSON.stringify({ status: newStatus }),
          });
          const r = await res.json();
          if (!res.ok) throw new Error(r.error || 'Status update failed');
          window.showToast(`RFQ ${rfqId} updated to ${newStatus}`);
          window.gtLoadAdmin(true);
        } catch (err) {
          window.showToast(err.message, 'error');
        }
      });
    });

    // Open quote button on Kanban card
    $$('.admin-open-quote-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rfqId = btn.dataset.rfqId;
        const email = btn.dataset.email;
        const qRfq = $('#q-rfq-id');
        const qEmail = $('#q-email');
        if (qRfq) qRfq.value = rfqId;
        if (qEmail) qEmail.value = email;
        switchAdminTab('quotations');
      });
    });

    // Company Basic Info Form
    $('#admin-company-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      try {
        const token = window.gtAdminToken ? await window.gtAdminToken() : '';
        const res = await fetch('/api/admin/site-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(payload),
        });
        const r = await res.json();
        if (!res.ok) throw new Error(r.error || 'Failed to update company information');
        window.showToast('Company basic information saved to production!');
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });

    // Contact Coordinates Form
    $('#admin-contact-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      try {
        const token = window.gtAdminToken ? await window.gtAdminToken() : '';
        const res = await fetch('/api/admin/site-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(payload),
        });
        const r = await res.json();
        if (!res.ok) throw new Error(r.error || 'Failed to update contact coordinates');
        window.showToast('Contact coordinates and addresses saved live!');
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });

    // CMS Landing Images Form
    $('#admin-cms-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      try {
        const token = window.gtAdminToken ? await window.gtAdminToken() : '';
        const res = await fetch('/api/admin/site-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(payload),
        });
        const r = await res.json();
        if (!res.ok) throw new Error(r.error || 'Failed to update landing page images');
        window.showToast('Landing page images & headlines published!');
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });

    // Add Product Form
    $('#admin-add-product-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      try {
        const token = window.gtAdminToken ? await window.gtAdminToken() : '';
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(payload),
        });
        const r = await res.json();
        if (!res.ok) throw new Error(r.error || 'Failed to save product');
        window.showToast(`Product ${r.product.name} (${r.product.code}) saved with custom photo!`);
        window.gtLoadAdmin(true);
        form.reset();
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });

    // Quotation Builder Form
    $('#admin-quote-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      try {
        const token = window.gtAdminToken ? await window.gtAdminToken() : '';
        const res = await fetch('/api/admin/quotations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(payload),
        });
        const r = await res.json();
        if (!res.ok) throw new Error(r.error || 'Failed to issue quotation');
        window.showToast(r.message || 'Quotation created!');
        form.reset();
        window.gtLoadAdmin(true);
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });

    // RBAC Role Select
    $$('.admin-role-select').forEach((sel) => {
      sel.addEventListener('change', async () => {
        const email = sel.dataset.email;
        const uid = sel.dataset.uid;
        const newRole = sel.value;
        if (window.gtPromoteUserRole) {
          await window.gtPromoteUserRole(email, uid, newRole);
        }
      });
    });
  }

  // Load Admin on Admin page
  if (window.location.pathname.startsWith('/admin')) {
    document.addEventListener('DOMContentLoaded', () => window.gtLoadAdmin());
    document.addEventListener('gt:auth', () => window.gtLoadAdmin());
  }

})();

