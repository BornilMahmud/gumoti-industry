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
  aboutImage?: string
  facilitiesImage?: string
  contactEmail?: string
  contactPhone?: string
  whatsappNumber?: string
  contactAddress?: string
  headOfficeAddress?: string
  facebookUrl?: string
  companyName?: string
  estYear?: string
  bgmeaReg?: string
  epbReg?: string
  workforceCount?: string
  femaleWorkforcePercent?: string
  dyeingCapacity?: string
  knittingCapacity?: string
  finishingCapacity?: string
  sewingCapacity?: string
  annualExport?: string
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
<!-- ================= HERO SECTION (Luxury Industrial Editorial) ================= -->
<section id="hero-section" class="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[var(--bg-canvas)] py-16 lg:py-24 transition-colors">
  
  <!-- Three.js Parametric Fiber Canvas Backdrop -->
  <div class="hero-canvas-container">
    <canvas id="hero-three-canvas" class="w-full h-full"></canvas>
  </div>

  <!-- Subtle Ambient Glow -->
  <div class="absolute inset-0 pointer-events-none z-0">
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-br from-[#00E599]/10 via-[#00D2FF]/5 to-transparent rounded-full blur-[140px]"></div>
  </div>

  <div class="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-10 w-full">
    <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
      
      <!-- Left Hero Text Column -->
      <div class="lg:col-span-7 space-y-6 text-left">
        <div class="inline-block">
          <span id="cfg-hero-kicker" class="kicker-pill">
            KNIT COMPOSITE MANUFACTURING · EST. 1993
          </span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-[76px] font-extrabold font-display leading-[1.04] tracking-tight text-[var(--text-primary)]">
          <span id="cfg-hero-l1" class="block">${heroL1}</span>
          <span id="cfg-hero-l2" class="block text-[#00875A] dark:text-[#00E599]">${heroL2}</span>
        </h1>

        <p id="cfg-hero-copy" class="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl font-normal">
          ${heroCopy}
        </p>

        <!-- Key Manufacturing Metrics Strip -->
        <div class="grid grid-cols-3 gap-3 max-w-lg pt-2 pb-2">
          <div class="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
            <span class="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider block">Dyeing</span>
            <span class="text-lg font-bold font-display text-[#00875A] dark:text-[#00E599]">50T<span class="text-xs font-normal text-[var(--text-muted)]">/Day</span></span>
          </div>
          <div class="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
            <span class="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider block">Knitting</span>
            <span class="text-lg font-bold font-display text-[var(--text-primary)]">10T<span class="text-xs font-normal text-[var(--text-muted)]">/Day</span></span>
          </div>
          <div class="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
            <span class="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider block">Sewing</span>
            <span class="text-lg font-bold font-display text-[var(--text-primary)]">35,000<span class="text-xs font-normal text-[var(--text-muted)]"> Pcs</span></span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <a href="${cta2Link}" class="pill-btn-emerald">
            <span>${cta2Text}</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
          <a href="${cta1Link}" class="pill-btn-outline">
            <span>${cta1Text}</span>
          </a>
          <a href="https://wa.me/8801329713736" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:underline px-2 py-2">
            <i class="fa-brands fa-whatsapp text-base"></i>
            <span>Instant Sourcing Chat</span>
          </a>
        </div>
      </div>

      <!-- Right Column: Visual Composite & Real Factory Snapshot -->
      <div class="lg:col-span-5 relative">
        <div class="editorial-card relative overflow-hidden group">
          <div class="relative h-[380px] sm:h-[460px] overflow-hidden bg-[var(--bg-surface)]">
            <img id="cfg-hero-img" src="${heroBg}" alt="Gumti High-Performance Stenter Finishing" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#060B10]/90 via-[#060B10]/20 to-transparent"></div>
            
            <div class="absolute top-4 left-4">
              <span class="kicker-pill">
                Ehwha Multi-Chamber Stenters
              </span>
            </div>

            <div class="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--border-subtle)] space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-[var(--text-primary)]">Chandra Machinery Plant</span>
                <span class="text-[#00E599] font-mono font-semibold">Gazipur, BD</span>
              </div>
              <p class="text-[11px] text-[var(--text-muted)] leading-relaxed">
                80T/Day computerized finishing and compacting line running low-liquor, zero toxic effluent certified production.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================= CLIENT TRUST STRIP (Verified Sourcing Partners) ================= -->
<section class="py-10 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="shrink-0 text-center md:text-left">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] block">Global Sourcing Partners</span>
        <span class="text-xs font-semibold text-[var(--text-primary)]">Exporting to European & North American Apparel Brands</span>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 hover:opacity-100 transition-opacity">
        <div class="flex items-center gap-2">
          <img src="/images/clients/norma.webp" alt="Norma" class="h-7 object-contain filter grayscale contrast-125" />
          <span class="text-xs font-bold font-display tracking-wider text-[var(--text-secondary)]">NORMA</span>
        </div>
        <div class="flex items-center gap-2">
          <img src="/images/clients/smart_blanks.webp" alt="Smart Blanks" class="h-7 object-contain filter grayscale contrast-125" />
          <span class="text-xs font-bold font-display tracking-wider text-[var(--text-secondary)]">SMART BLANKS</span>
        </div>
        <div class="flex items-center gap-2">
          <img src="/images/clients/suncity.webp" alt="Suncity" class="h-7 object-contain filter grayscale contrast-125" />
          <span class="text-xs font-bold font-display tracking-wider text-[var(--text-secondary)]">SUNCITY</span>
        </div>
        <div class="flex items-center gap-2">
          <img src="/images/clients/txm.webp" alt="TXM" class="h-7 object-contain filter grayscale contrast-125" />
          <span class="text-xs font-bold font-display tracking-wider text-[var(--text-secondary)]">TXM</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= 6-STAGE MANUFACTURING JOURNEY ================= -->
<section class="py-20 lg:py-28 bg-[var(--bg-canvas)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    
    <div class="max-w-2xl mb-16">
      <span class="kicker-pill mb-3">Precision Manufacturing Pipeline</span>
      <h2 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
        From Fiber to <span class="text-[#00E599]">Finished Garment</span>
      </h2>
      <p class="mt-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
        Our fully integrated manufacturing complex integrates 6 synchronized production stages under one unified ISO-compliant quality management system.
      </p>
    </div>

    <!-- 6 Interactive Manufacturing Cards -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      
      <!-- Stage 1 -->
      <div class="editorial-card group">
        <div class="relative h-52 overflow-hidden bg-[var(--bg-surface)]">
          <img src="/images/factory/red_fabric_370x230.webp" alt="Yarn Procurement" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 bg-[#060B10]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#00E599] border border-white/10">STAGE 01</div>
        </div>
        <div class="p-6 space-y-2">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Yarn Procurement & Inspection</h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            100% combed & carded cotton, BCI certified, viscose, modal, CVC, and elastane blends verified for tensile strength and twist uniformity.
          </p>
          <div class="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Lab Sample Testing</span>
            <span class="text-[#00E599] font-mono font-bold">100% Verified</span>
          </div>
        </div>
      </div>

      <!-- Stage 2 -->
      <div class="editorial-card group">
        <div class="relative h-52 overflow-hidden bg-[var(--bg-surface)]">
          <img src="/images/factory/knitting_370x230.webp" alt="Circular & Flat Knitting" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 bg-[#060B10]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#00E599] border border-white/10">STAGE 02</div>
        </div>
        <div class="p-6 space-y-2">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Automated Knitting</h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            Mayer & Cie (Germany) and Terrot circular knitting machines producing Single Jersey, Pique, Interlock, Rib 1x1 & 2x2, and French Terry.
          </p>
          <div class="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Knitting Output</span>
            <span class="text-[#00E599] font-mono font-bold">10 Metric Tons/Day</span>
          </div>
        </div>
      </div>

      <!-- Stage 3 -->
      <div class="editorial-card group">
        <div class="relative h-52 overflow-hidden bg-[var(--bg-surface)]">
          <img src="/images/factory/lafer_630x400.webp" alt="Dyeing & Color Lab" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 bg-[#060B10]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#00E599] border border-white/10">STAGE 03</div>
        </div>
        <div class="p-6 space-y-2">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Eco-Dyeing & Color Lab</h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            High-pressure soft-flow vessels from Sclavos Athena (Greece) and Thies (Germany) with computerized color dispensing and spectrophotometer matching.
          </p>
          <div class="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Dyeing Output</span>
            <span class="text-[#00E599] font-mono font-bold">50 Metric Tons/Day</span>
          </div>
        </div>
      </div>

      <!-- Stage 4 -->
      <div class="editorial-card group">
        <div class="relative h-52 overflow-hidden bg-[var(--bg-surface)]">
          <img src="/images/factory/stenter_clean_630x400.webp" alt="Stentering & Compacting" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 bg-[#060B10]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#00E599] border border-white/10">STAGE 04</div>
        </div>
        <div class="p-6 space-y-2">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Stentering & Compacting</h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            Multi-chamber Ehwha Korean stenters with width control, moisture profiling, and Italian Lafer sueding machines for peach-touch finishes.
          </p>
          <div class="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Finishing Output</span>
            <span class="text-[#00E599] font-mono font-bold">80 Metric Tons/Day</span>
          </div>
        </div>
      </div>

      <!-- Stage 5 -->
      <div class="editorial-card group">
        <div class="relative h-52 overflow-hidden bg-[var(--bg-surface)]">
          <img src="/images/hero/garment_realistic_1170x600.webp" alt="Cutting & 22 Sewing Lines" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 bg-[#060B10]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#00E599] border border-white/10">STAGE 05</div>
        </div>
        <div class="p-6 space-y-2">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Cutting & 22 Sewing Lines</h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            Automated multi-ply cutting tables and 750+ computerized sewing machines organized into 22 dedicated lines for hoodies, polos, tees, and activewear.
          </p>
          <div class="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Garment Assembly</span>
            <span class="text-[#00E599] font-mono font-bold">35,000 Pcs/Day</span>
          </div>
        </div>
      </div>

      <!-- Stage 6 -->
      <div class="editorial-card group">
        <div class="relative h-52 overflow-hidden bg-[var(--bg-surface)]">
          <img src="/images/factory/firstaid_630x400.webp" alt="Quality Inspection & Compliance" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 bg-[#060B10]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#00E599] border border-white/10">STAGE 06</div>
        </div>
        <div class="p-6 space-y-2">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">4-Point QA & Compliance</h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            100% in-line inspection, metal & needle detection, biological ETP discharge compliance, and in-house medical welfare for our 1,600 workforce.
          </p>
          <div class="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Biological ETP</span>
            <span class="text-[#00E599] font-mono font-bold">100% Non-Toxic</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================= ANIMATED CAPACITY METRIC GRID ================= -->
<section class="py-16 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
      
      <div class="pt-4 lg:pt-0 lg:px-6 text-center lg:text-left space-y-1">
        <p class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Fabric Dyeing</p>
        <div class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">
          <span data-count="50">50</span><span class="text-xl font-medium text-[#00E599]">T/Day</span>
        </div>
        <p class="text-[11px] text-[var(--text-muted)]">Sclavos Athena & Thies vessels</p>
      </div>

      <div class="pt-4 lg:pt-0 lg:px-6 text-center lg:text-left space-y-1">
        <p class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Circular Knitting</p>
        <div class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">
          <span data-count="10">10</span><span class="text-xl font-medium text-[#00E599]">T/Day</span>
        </div>
        <p class="text-[11px] text-[var(--text-muted)]">Mayer & Cie & Terrot machinery</p>
      </div>

      <div class="pt-4 lg:pt-0 lg:px-6 text-center lg:text-left space-y-1">
        <p class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Stenter Finishing</p>
        <div class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">
          <span data-count="80">80</span><span class="text-xl font-medium text-[#00E599]">T/Day</span>
        </div>
        <p class="text-[11px] text-[var(--text-muted)]">Ehwha & Lafer multi-chamber lines</p>
      </div>

      <div class="pt-4 lg:pt-0 lg:px-6 text-center lg:text-left space-y-1">
        <p class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Garment Assembly</p>
        <div class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">
          <span data-count="35000">35000</span><span class="text-xl font-medium text-[#00E599]">Pcs</span>
        </div>
        <p class="text-[11px] text-[var(--text-muted)]">Across 22 synchronized lines</p>
      </div>

    </div>
  </div>
</section>

<!-- ================= FEATURED EXPORT PRODUCTS ================= -->
<section class="py-20 lg:py-28 bg-[var(--bg-canvas)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <span class="kicker-pill mb-3">Export Catalog Highlights</span>
        <h2 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
          Precision <span class="text-[#00E599]">Knitwear Programs</span>
        </h2>
        <p class="mt-2 text-xs sm:text-sm text-[var(--text-muted)]">
          Custom fabrications, tight GSM tolerances, and verified color fastness for international retail programs.
        </p>
      </div>

      <a href="/products" class="pill-btn-outline self-start md:self-auto text-xs">
        <span>View Full Catalog (${products.length})</span>
        <i class="fa-solid fa-arrow-right text-[10px]"></i>
      </a>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${products.slice(0, 4).map((p) => html`
        <div class="editorial-card flex flex-col justify-between group">
          <div>
            <div class="relative h-56 overflow-hidden bg-[var(--bg-surface)]">
              <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span class="absolute top-3 left-3 bg-[#060B10]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#00E599] border border-white/10">${p.code}</span>
            </div>
            <div class="p-5 space-y-2">
              <span class="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">${p.category}</span>
              <h3 class="text-base font-bold font-display text-[var(--text-primary)] group-hover:text-[#00E599] transition-colors">
                <a href="/products/${p.slug}">${p.name}</a>
              </h3>
              <p class="text-xs text-[var(--text-muted)] line-clamp-2">${p.composition} · ${p.gsm} GSM</p>
            </div>
          </div>
          <div class="p-5 pt-0 flex items-center justify-between border-t border-[var(--border-subtle)] mt-4">
            <span class="text-[11px] font-mono text-[var(--text-secondary)]">MOQ: ${p.moq}</span>
            <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="text-xs font-bold text-[#00E599] hover:underline">
              Quote ➔
            </a>
          </div>
        </div>
      `)}
    </div>

  </div>
</section>

<!-- ================= SUSTAINABILITY & RESPONSIBILITY ================= -->
<section class="py-20 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      
      <div class="lg:col-span-6 space-y-6">
        <span class="kicker-pill">Sustainable Manufacturing</span>
        <h2 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
          Biological ETP & <span class="text-[#00D2FF]">Green Energy</span>
        </h2>
        <p class="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Gumti Textiles operates a dedicated biological effluent treatment plant ensuring 100% compliant discharge. On-site clean energy infrastructure includes twin sustainable jute boilers and a dedicated LPG supply reducing environmental impact.
        </p>

        <div class="space-y-4 pt-2">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF] shrink-0">
              <i class="fa-solid fa-droplet"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-[var(--text-primary)]">Biological ETP & WTP</h4>
              <p class="text-xs text-[var(--text-muted)]">Clean, non-toxic water discharge conforming to Department of Environment regulations.</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] shrink-0">
              <i class="fa-solid fa-fire-burner"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-[var(--text-primary)]">Twin Jute Boilers & On-Site LPG</h4>
              <p class="text-xs text-[var(--text-muted)]">Renewable biomass fuel boilers supplemented by clean LPG distribution.</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-[#E5C378]/15 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] shrink-0">
              <i class="fa-solid fa-person-breastfeeding"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-[var(--text-primary)]">74% Female Empowerment & Welfare</h4>
              <p class="text-xs text-[var(--text-muted)]">In-house medical clinic, full-time nursing staff, dedicated childcare, and fire safety protocols.</p>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <a href="/sustainability" class="pill-btn-outline text-xs">
            <span>Read Sustainability Protocol</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </div>

      <div class="lg:col-span-6 grid grid-cols-2 gap-4">
        <div class="editorial-card overflow-hidden h-64">
          <img src="/images/gallery/fire_workshop_1.png" alt="Safety Workshop" class="w-full h-full object-cover" />
        </div>
        <div class="editorial-card overflow-hidden h-64">
          <img src="/images/gallery/w3.jpg" alt="Childcare & Clinic" class="w-full h-full object-cover" />
        </div>
        <div class="editorial-card overflow-hidden h-64 col-span-2">
          <img src="/images/factory/lafer_630x400.webp" alt="ETP Compliant Dyeing" class="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================= CONVERSION CTA ================= -->
<section class="py-20 lg:py-28 bg-[var(--bg-canvas)] relative overflow-hidden transition-colors">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10 text-center">
    <span class="kicker-pill mb-4">Immediate Procurement Booking</span>
    <h2 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[var(--text-primary)] tracking-tight max-w-3xl mx-auto">
      Book Dedicated Manufacturing Capacity for Your <span class="text-[#00E599]">Next Program</span>
    </h2>
    <p class="mt-4 text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
      Submit your technical specifications or request fabric swatches. Our merchandising team will deliver a structured quote within 24–48 hours.
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      <a href="/request-quote" class="pill-btn-emerald py-3.5 px-8 text-sm">
        <span>Request Production Quote</span>
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </a>
      <a href="/request-sample" class="pill-btn-outline py-3.5 px-8 text-sm">
        <span>Request Swatch Sample</span>
      </a>
      <a href="https://wa.me/8801329713736" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:underline px-4 py-3.5">
        <i class="fa-brands fa-whatsapp text-lg"></i>
        <span>Chat with Merchandiser</span>
      </a>
    </div>
  </div>
</section>
`
}
