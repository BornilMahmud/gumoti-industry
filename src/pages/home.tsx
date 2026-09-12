import { html, raw } from 'hono/html'
import { companyProfile as co, media, manufacturingStages } from '../data/company'
import { products } from '../data/products'

export interface LandingConfigData {
  heroHeadlineLine1?: string
  heroHeadlineLine2?: string
  heroKicker?: string
  heroSubTagline?: string
  heroBgImage?: string
  heroCta1Text?: string
  heroCta1Link?: string
  heroCta2Text?: string
  heroCta2Link?: string
  stats?: {
    stat1Label?: string
    stat1Value?: string
    stat1Sub?: string
    stat2Label?: string
    stat2Value?: string
    stat2Sub?: string
    stat3Label?: string
    stat3Value?: string
    stat3Sub?: string
    stat4Label?: string
    stat4Value?: string
    stat4Sub?: string
  }
  aboutHeading?: string
  aboutText?: string
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  facebookUrl?: string
}

export const HomePage = (cfg?: LandingConfigData) => {
  const heroL1 = cfg?.heroHeadlineLine1 || 'INTEGRATED KNITWEAR.'
  const heroL2 = cfg?.heroHeadlineLine2 || 'GLOBAL SCALE.'
  const heroKicker = cfg?.heroKicker || `● 30+ YEARS EXCELLENCE · EST. ${co.established} · 22 SEWING LINES`
  const heroCopy = cfg?.heroSubTagline || 'Premier knit-composite textile and apparel manufacturer in Bangladesh — integrating knitting, dyeing, finishing, and garment assembly under one certified quality system.'
  const heroBg = cfg?.heroBgImage || '/images/hero/background_1920x530.webp'
  const cta1Text = cfg?.heroCta1Text || 'Explore Capabilities'
  const cta1Link = cfg?.heroCta1Link || '/capabilities'
  const cta2Text = cfg?.heroCta2Text || 'Request a Quote'
  const cta2Link = cfg?.heroCta2Link || '/request-quote'

  const stat1L = cfg?.stats?.stat1Label || 'Dyeing Output'
  const stat1V = cfg?.stats?.stat1Value || '50T/Day'
  const stat1S = cfg?.stats?.stat1Sub || 'Sclavos Athena Greece & Thies Germany'

  const stat2L = cfg?.stats?.stat2Label || 'Knitting Output'
  const stat2V = cfg?.stats?.stat2Value || '10T/Day'
  const stat2S = cfg?.stats?.stat2Sub || 'Mayer & Cie & Terrot circular & flat'

  const stat3L = cfg?.stats?.stat3Label || 'Finishing & Sewing'
  const stat3V = cfg?.stats?.stat3Value || '80T / 35k'
  const stat3S = cfg?.stats?.stat3Sub || '80T Finishing & 35,000 Pcs/Day Sewing'

  const stat4L = cfg?.stats?.stat4Label || 'Workforce & Scale'
  const stat4V = cfg?.stats?.stat4Value || '1,600'
  const stat4S = cfg?.stats?.stat4Sub || '74% Female Empowerment · $27M Export'

  return html`
<!-- ================= HERO SECTION (Inspired by Reference 1 & 3) ================= -->
<section id="hero-section" class="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#060B10] py-16 lg:py-24">
  <!-- Subtle cyber glow backdrop -->
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#00E599]/10 via-[#00D2FF]/5 to-transparent rounded-full blur-[140px]"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-[#00E599]/5 rounded-full blur-[100px]"></div>
  </div>

  <div class="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-10 w-full">
    <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
      
      <!-- Left Hero Text Column -->
      <div class="lg:col-span-7 space-y-6 text-left">
        <div class="inline-block">
          <span id="cfg-hero-kicker" class="kicker-pill">
            <span class="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse"></span>
            KNIT COMPOSITE MANUFACTURING
          </span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-[76px] font-extrabold font-display leading-[1.04] tracking-tight text-white">
          <span id="cfg-hero-l1" class="block">${heroL1}</span>
          <span id="cfg-hero-l2" class="block text-gradient-emerald">${heroL2}</span>
        </h1>

        <p id="cfg-hero-copy" class="text-sm sm:text-base lg:text-lg text-[#CBD5E1] leading-relaxed max-w-xl font-normal">
          ${heroCopy}
        </p>

        <!-- CTAs -->
        <div class="pt-4 flex flex-wrap items-center gap-4">
          <a id="cfg-cta1" href="${cta1Link}" class="pill-btn-emerald">
            <span>${cta1Text}</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
          <a href="https://wa.me/8801329713736?text=Hello%20Gumti%20Textiles,%20I%20would%20like%20to%20inquire%20about%20knitwear%20manufacturing..." target="_blank" rel="noopener" class="pill-btn-outline border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/15 hover:border-[#25D366] inline-flex items-center gap-2">
            <i class="fa-brands fa-whatsapp text-base"></i>
            <span>WhatsApp</span>
          </a>
          <div class="flex items-center gap-2 pl-2 text-xs text-[#788A9C]">
            <i class="fa-solid fa-bolt text-[#00E599]"></i>
            <span>Quotes within 24h</span>
          </div>
        </div>

        <!-- Quick trust facts -->
        <div class="pt-6 grid grid-cols-3 gap-6 border-t border-white/[0.08] max-w-lg text-xs">
          <div>
            <p class="text-white font-bold text-base font-display">50T / Day</p>
            <p class="text-[#788A9C] text-[11px] mt-0.5">Dyeing Capacity</p>
          </div>
          <div>
            <p class="text-white font-bold text-base font-display">22 Lines</p>
            <p class="text-[#788A9C] text-[11px] mt-0.5">Garment Sewing</p>
          </div>
          <div>
            <p class="text-white font-bold text-base font-display">30+ Years</p>
            <p class="text-[#788A9C] text-[11px] mt-0.5">Since 1993</p>
          </div>
        </div>
      </div>

      <!-- Right Visual Card (Real Local Machinery & Composite Floor) -->
      <div class="lg:col-span-5 relative">
        <div class="glass-panel p-3.5 relative overflow-hidden shadow-2xl border border-white/[0.12] group">
          <div class="relative overflow-hidden rounded-xl aspect-[4/3] bg-[#0A131C]">
            <img id="cfg-hero-media" src="${heroBg}" alt="Gumti Manufacturing Plant" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#060B10] via-transparent to-transparent"></div>
            
            <!-- Floating Machinery Badge -->
            <div class="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#060B10]/80 backdrop-blur-md border border-white/[0.1] text-[11px] font-semibold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#00E599]"></span>
              Chandra Plant, Gazipur
            </div>

            <div class="absolute bottom-4 left-4 right-4">
              <p class="text-[10px] uppercase font-bold tracking-wider text-[#00E599]">Composite Floor</p>
              <p class="text-sm font-bold text-white mt-0.5">High-Pressure Dyeing & Automated Knitting</p>
            </div>
          </div>

          <!-- Quick Metrics Bar below card -->
          <div class="grid grid-cols-2 gap-3 mt-3 pt-1">
            <div class="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <p class="text-[10px] text-[#788A9C] uppercase font-semibold">Biological ETP</p>
              <p class="text-xs font-bold text-white mt-0.5">100% Zero Toxic Effluent</p>
            </div>
            <div class="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <p class="text-[10px] text-[#788A9C] uppercase font-semibold">Machinery Brands</p>
              <p class="text-xs font-bold text-white mt-0.5">Sclavos · Mayer & Cie · Ehwha</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================= LIVE FACTORY METRICS TICKER (Inspired by Reference 1 & 2) ================= -->
<section id="metrics-ticker" class="bg-[#081119] border-y border-white/[0.08] py-8">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- Metric 1 -->
      <div class="glass-card p-5">
        <div class="flex items-center justify-between">
          <span id="cfg-stat1-label" class="text-[11px] font-semibold uppercase tracking-wider text-[#788A9C]">${stat1L}</span>
          <span class="text-[10px] font-bold text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded-full border border-[#00E599]/20">Active</span>
        </div>
        <p id="cfg-stat1-value" class="text-3xl font-extrabold font-display text-white mt-2">${stat1V}</p>
        <p id="cfg-stat1-sub" class="text-xs text-[#788A9C] mt-1.5">${stat1S}</p>
        <div class="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#00E599]">
          <span><i class="fa-solid fa-arrow-trend-up mr-1"></i> Eco vessels</span>
          <span class="text-[#788A9C]">Low liquor ratio</span>
        </div>
      </div>

      <!-- Metric 2 -->
      <div class="glass-card p-5">
        <div class="flex items-center justify-between">
          <span id="cfg-stat2-label" class="text-[11px] font-semibold uppercase tracking-wider text-[#788A9C]">${stat2L}</span>
          <span class="text-[10px] font-bold text-[#00D2FF] bg-[#00D2FF]/10 px-2 py-0.5 rounded-full border border-[#00D2FF]/20">High-Speed</span>
        </div>
        <p id="cfg-stat2-value" class="text-3xl font-extrabold font-display text-white mt-2">${stat2V}</p>
        <p id="cfg-stat2-sub" class="text-xs text-[#788A9C] mt-1.5">${stat2S}</p>
        <div class="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#00D2FF]">
          <span><i class="fa-solid fa-arrows-rotate mr-1"></i> Circular & flat</span>
          <span class="text-[#788A9C]">Single jersey & pique</span>
        </div>
      </div>

      <!-- Metric 3 -->
      <div class="glass-card p-5">
        <div class="flex items-center justify-between">
          <span id="cfg-stat3-label" class="text-[11px] font-semibold uppercase tracking-wider text-[#788A9C]">${stat3L}</span>
          <span class="text-[10px] font-bold text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded-full border border-[#00E599]/20">Output</span>
        </div>
        <p id="cfg-stat3-value" class="text-3xl font-extrabold font-display text-white mt-2">${stat3V}</p>
        <p id="cfg-stat3-sub" class="text-xs text-[#788A9C] mt-1.5">${stat3S}</p>
        <div class="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#00E599]">
          <span><i class="fa-solid fa-industry mr-1"></i> 750+ Machines</span>
          <span class="text-[#788A9C]">Synchronized lines</span>
        </div>
      </div>

      <!-- Metric 4 -->
      <div class="glass-card p-5">
        <div class="flex items-center justify-between">
          <span id="cfg-stat4-label" class="text-[11px] font-semibold uppercase tracking-wider text-[#788A9C]">Export Volume</span>
          <span class="text-[10px] font-bold text-[#E5C378] bg-[#E5C378]/10 px-2 py-0.5 rounded-full border border-[#E5C378]/20">Global Reach</span>
        </div>
        <p id="cfg-stat4-value" class="text-3xl font-extrabold font-display text-white mt-2">$27M</p>
        <p id="cfg-stat4-sub" class="text-xs text-[#788A9C] mt-1.5">Annual export shipments across Europe & North America</p>
        <div class="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#E5C378]">
          <span><i class="fa-solid fa-award mr-1"></i> Certified Quality</span>
          <span class="text-[#788A9C]">1,600 Workforce</span>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================= INTERACTIVE APPAREL CAPACITY ESTIMATOR (Inspired by Reference 1 Calculator) ================= -->
<section id="capacity-estimator" class="bg-[#060B10] py-20 border-b border-white/[0.08]">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <span class="kicker-pill mb-3">Live Sourcing Tool</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">Apparel Production Estimator</h2>
      <p class="text-xs sm:text-sm text-[#788A9C] mt-2">Calculate real-time machine capacity, yarn requirements, and estimated turnaround based on our factory infrastructure.</p>
    </div>

    <div class="glass-panel p-6 sm:p-10 border border-white/[0.1]">
      <div class="grid md:grid-cols-12 gap-8 items-center">
        
        <!-- Left: Input Controls -->
        <div class="md:col-span-7 space-y-5">
          <div>
            <label class="field-label-dark">Select Garment Category</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button type="button" class="est-cat-btn active p-3 rounded-xl bg-[#00E599]/15 border border-[#00E599] text-xs font-bold text-white text-center" data-cat="polo" data-gsm="220" data-rate="2500">
                Polo Shirt<br/><span class="text-[10px] text-[#00E599] font-normal">220 GSM Pique</span>
              </button>
              <button type="button" class="est-cat-btn p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs font-medium text-[#CBD5E1] text-center hover:border-white/20" data-cat="tshirt" data-gsm="160" data-rate="4000">
                Crew T-Shirt<br/><span class="text-[10px] text-[#788A9C] font-normal">160 GSM Jersey</span>
              </button>
              <button type="button" class="est-cat-btn p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs font-medium text-[#CBD5E1] text-center hover:border-white/20" data-cat="hoodie" data-gsm="320" data-rate="1800">
                Fleece Hoodie<br/><span class="text-[10px] text-[#788A9C] font-normal">320 GSM Fleece</span>
              </button>
              <button type="button" class="est-cat-btn p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs font-medium text-[#CBD5E1] text-center hover:border-white/20" data-cat="active" data-gsm="180" data-rate="3200">
                Activewear<br/><span class="text-[10px] text-[#788A9C] font-normal">180 GSM Interlock</span>
              </button>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="field-label-dark mb-0">Target Order Volume</label>
              <span id="est-qty-display" class="text-sm font-bold text-[#00E599] font-mono">10,000 Pcs</span>
            </div>
            <input id="est-qty-slider" type="range" min="3000" max="50000" step="1000" value="10000" class="w-full accent-[#00E599] bg-[#0D1622] h-2 rounded-lg cursor-pointer" />
            <div class="flex justify-between text-[10px] text-[#788A9C] mt-1 font-mono">
              <span>3,000 (Min MOQ)</span>
              <span>25,000</span>
              <span>50,000+ Pcs</span>
            </div>
          </div>

          <div>
            <label class="field-label-dark">Fabric Blend</label>
            <select id="est-blend-select" class="field-dark cursor-pointer text-xs">
              <option value="100% Combed Cotton">100% Combed Ring-Spun Cotton</option>
              <option value="100% Organic Cotton (GOTS)">100% Organic Cotton (GOTS Compliant)</option>
              <option value="CVC (60% Cotton / 40% Polyester)">CVC (60% Cotton / 40% Polyester)</option>
              <option value="Cotton / Elastane (95/5)">Cotton / Spandex (95% Cotton / 5% Elastane)</option>
            </select>
          </div>
        </div>

        <!-- Right: Real-time Estimated Output Card -->
        <div class="md:col-span-5 bg-[#0C1622] rounded-2xl p-6 border border-[#00E599]/30 shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-white">Estimated Factory Allocation</span>
            <span class="px-2 py-0.5 rounded bg-[#00E599]/15 text-[#00E599] text-[10px] font-bold">Live Plan</span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span class="text-[#788A9C]">Fabric Weight Required:</span>
              <span id="est-weight" class="text-white font-mono font-semibold">2,200 KG</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span class="text-[#788A9C]">Knitting Floor Time:</span>
              <span id="est-knit-days" class="text-white font-mono font-semibold">~0.5 Days</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span class="text-[#788A9C]">Dyeing & Compacting:</span>
              <span id="est-dye-days" class="text-white font-mono font-semibold">~0.5 Days</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span class="text-[#788A9C]">Sewing Lines Allocated:</span>
              <span id="est-lines" class="text-[#00E599] font-mono font-semibold">3 Lines (3-4 Days)</span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-[#788A9C]">Target Production Turnaround:</span>
              <span id="est-total-time" class="text-[#00E599] font-bold">14 - 18 Days</span>
            </div>
          </div>

          <div class="pt-2">
            <button id="est-prefill-btn" type="button" class="pill-btn-emerald w-full py-3 text-xs">
              <i class="fa-solid fa-paper-plane text-xs mr-1"></i> Submit RFQ with these Specs
            </button>
            <p class="text-[10px] text-[#788A9C] text-center mt-2">Commercial pricing confirmed within 24h by merchandising.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<!-- ================= 4 CORE PILLAR CARDS (Inspired by Reference 3 "Why Blockchain?") ================= -->
<section id="why-gumti" class="bg-[#070D14] py-20 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="text-center max-w-2xl mx-auto mb-14">
      <span class="kicker-pill mb-3">Industrial Superiority</span>
      <h2 class="text-3xl sm:text-5xl font-extrabold font-display text-white">Why <span class="text-gradient-emerald">Gumti Textiles</span>?</h2>
      <p class="text-xs sm:text-sm text-[#788A9C] mt-2">World-class machinery, biological environmental compliance, and complete vertical composite integration from Bangladesh.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Card 1 -->
      <div class="glass-card p-6 space-y-4">
        <div class="w-12 h-12 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-xl">
          <i class="fa-solid fa-cubes-stacked"></i>
        </div>
        <h3 class="text-base font-bold text-white font-display">Vertical Integration</h3>
        <p class="text-xs text-[#788A9C] leading-relaxed">
          From circular knitting, open-width eco-dyeing, and stenter compacting to precision cutting and sewing across 22 lines under a unified quality assurance system.
        </p>
      </div>

      <!-- Card 2 -->
      <div class="glass-card p-6 space-y-4">
        <div class="w-12 h-12 rounded-xl bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF] text-xl">
          <i class="fa-solid fa-leaf"></i>
        </div>
        <h3 class="text-base font-bold text-white font-display">Biological ETP & Green Energy</h3>
        <p class="text-xs text-[#788A9C] leading-relaxed">
          100% biological Effluent Treatment Plant (ETP) ensuring clean water discharge, backed by our captive LPG station and 2 sustainable jute boilers.
        </p>
      </div>

      <!-- Card 3 -->
      <div class="glass-card p-6 space-y-4">
        <div class="w-12 h-12 rounded-xl bg-[#E5C378]/15 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] text-xl">
          <i class="fa-solid fa-microchip"></i>
        </div>
        <h3 class="text-base font-bold text-white font-display">European Precision Machinery</h3>
        <p class="text-xs text-[#788A9C] leading-relaxed">
          High-performance dyeing from Sclavos (Greece) and Thies (Germany), automated Mayer & Cie and Terrot knitting, and Korean Ehwha stenter lines.
        </p>
      </div>

      <!-- Card 4 -->
      <div class="glass-card p-6 space-y-4">
        <div class="w-12 h-12 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-xl">
          <i class="fa-solid fa-users"></i>
        </div>
        <h3 class="text-base font-bold text-white font-display">1,600 Ethical Workforce</h3>
        <p class="text-xs text-[#788A9C] leading-relaxed">
          74% skilled female personnel, full healthcare clinic, registered doctor and nurse, child nursery, certified fire alarms, and regular safety drills.
        </p>
      </div>

    </div>
  </div>
</section>

<!-- ================= VALUED INTERNATIONAL BUYER BRANDS ================= -->
<section id="buyer-partners" class="bg-[#060B10] py-12 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <p class="text-[11px] font-bold tracking-widest uppercase text-[#00E599]">Trusted Brand Partners</p>
        <p class="text-xs text-[#788A9C] mt-0.5">Manufacturing export apparel for international retail partners</p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
        ${raw(media.clients.map((c) => `
          <div class="h-12 px-5 py-2.5 rounded-xl bg-[#0B141E] border border-white/[0.08] flex items-center justify-center hover:border-[#00E599]/40 transition-colors">
            <img src="${c.logo}" alt="${c.name}" class="h-6 w-auto object-contain filter brightness-90 hover:brightness-100 transition-all" loading="lazy" />
          </div>`).join(''))}
      </div>
    </div>
  </div>
</section>

<!-- ================= CURATED APPAREL PROGRAM (Dark Cards) ================= -->
<section id="product-showcase" class="bg-[#070D14] py-20 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
      <div>
        <span class="kicker-pill mb-2">Export Catalog</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">Principal Apparel Categories</h2>
      </div>
      <a href="/products" class="pill-btn-outline text-xs">
        View Full Product Catalog <i class="fa-solid fa-arrow-right text-[10px]"></i>
      </a>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${raw([
        { cat: 'Classic Pique Polo', img: '/images/products/polo-classic.png', gsm: '220 GSM', blend: '100% Combed Cotton' },
        { cat: 'Crew Neck T-Shirt', img: '/images/products/crew-tshirt.png', gsm: '160 GSM', blend: 'Organic Ring-Spun Cotton' },
        { cat: 'Pullover Fleece Hoodie', img: '/images/products/hoodie-fleece.png', gsm: '320 GSM', blend: '3-End Brushed Fleece' },
        { cat: 'Performance Activewear', img: '/images/products/activewear-sport.png', gsm: '180 GSM', blend: 'Moisture-Wicking Interlock' },
      ].map((p, i) => `
        <div class="glass-card overflow-hidden group">
          <div class="aspect-[4/5] relative bg-[#09111A] flex items-center justify-center p-4">
            <img src="${p.img}" alt="${p.cat}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#060B10]/80 border border-white/[0.1] text-[10px] font-bold text-[#00E599] font-mono">
              ${p.gsm}
            </span>
          </div>
          <div class="p-5 space-y-3">
            <div>
              <h3 class="font-bold text-white text-base">${p.cat}</h3>
              <p class="text-xs text-[#788A9C] mt-0.5">${p.blend}</p>
            </div>
            <div class="pt-2 flex items-center justify-between border-t border-white/[0.06]">
              <a href="/request-sample?product=${encodeURIComponent(p.cat)}" class="text-xs font-semibold text-[#00E599] hover:underline inline-flex items-center gap-1.5">
                Request Swatch <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
              <span class="text-[10px] text-[#788A9C] font-mono">MOQ 3k</span>
            </div>
          </div>
        </div>`).join(''))}
    </div>
  </div>
</section>

<!-- ================= FABRIC TO APPAREL INTERACTIVE SLIDER ================= -->
<section id="fabric-experience" class="bg-[#060B10] py-20 border-b border-white/[0.08]">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
    <span class="kicker-pill mb-3">Composite Workflow</span>
    <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">Fabric-to-Garment Integration</h2>
    <p class="text-xs sm:text-sm text-[#788A9C] max-w-md mx-auto mt-2">Slide across to observe the transformation from raw knitted fabric roll to completed export apparel.</p>

    <div id="fabric-compare" class="relative mt-10 aspect-[16/9] max-h-[520px] w-full overflow-hidden rounded-2xl border border-white/[0.12] select-none shadow-2xl bg-[#09111A]">
      <img src="/images/hero/garment_realistic_1170x600.webp" alt="Finished garments line" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <img src="/images/factory/textiles_same_370x230.webp" alt="Knitted fabric inspection" class="cmp-top absolute inset-0 w-full h-full object-cover" style="clip-path: inset(0 50% 0 0)" loading="lazy" />
      <div class="cmp-bar absolute top-0 bottom-0 w-0.5 bg-[#00E599]" style="left:50%">
        <span class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-[#00E599] text-[#050B10] flex items-center justify-center rounded-full shadow-[0_0_16px_rgba(0,229,153,0.5)]">
          <i class="fa-solid fa-arrows-left-right text-xs"></i>
        </span>
      </div>
      <input type="range" min="0" max="100" value="50" class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" aria-label="Compare raw fabric and finished garment" />
    </div>
  </div>
</section>

<!-- ================= EXECUTIVE CTA BANNER (Inspired by Reference 1 Footer Card) ================= -->
<section id="cta-banner" class="bg-[#060B10] py-20">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10">
    <div class="relative overflow-hidden rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#00E599]/20 via-[#0B1F2C] to-[#0A1624] border border-[#00E599]/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
      <div class="space-y-3 text-center lg:text-left">
        <span class="px-3 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[11px] font-bold text-[#00E599] uppercase tracking-wider">
          Ready for Production
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">Start Your Apparel Production with Gumti</h2>
        <p class="text-xs sm:text-sm text-[#CBD5E1] max-w-xl">
          Get competitive FOB pricing, fabric swatches, and factory line allocations directly from our merchandising leadership.
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-4 flex-shrink-0">
        <a href="/request-quote" class="pill-btn-emerald px-8 py-3.5 text-sm">
          Request a Quote <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
        <a href="/contact" class="pill-btn-outline px-7 py-3.5 text-sm">
          Contact Merchandising
        </a>
      </div>
    </div>
  </div>
</section>
`
}
