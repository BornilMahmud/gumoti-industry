import { html, raw } from 'hono/html'
import { companyProfile as co, media, manufacturingStages } from '../data/company'
import { products } from '../data/products'

export const HomePage = () => html`
<!-- ================= CINEMATIC HERO ================= -->
<section id="hero-section" class="cinematic-hero relative min-h-screen flex items-end bg-midnight overflow-hidden textile-texture">
  <div class="absolute inset-0" data-parallax="0.18">
    <img src="${media.hero}" alt="Garment production floor with rows of sewing stations" class="hero-media w-full h-full object-cover opacity-55" fetchpriority="high" />
    <div class="hero-overlay absolute inset-0 bg-gradient-to-t from-[#0B1117] via-navy/72 to-navy/30"></div>
  </div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-10 pb-24 lg:pb-32 pt-40 w-full">
    <p class="hero-kicker text-[11px] tracking-widest2 uppercase text-sand mb-7 flex items-center gap-3"><span class="inline-block w-10 h-px bg-sand"></span>Knit Composite Manufacturer · Bangladesh · Est. ${co.established}</p>
    <h1 class="hero-headline font-serif text-white leading-[0.88] text-[16vw] sm:text-7xl lg:text-[104px] xl:text-[132px] tracking-[-0.055em]">
      <span class="hero-line"><span>ENGINEERING</span></span><br/>
      <span class="hero-line text-sand"><span>QUALITY.</span></span>
    </h1>
    <p class="hero-copy mt-8 max-w-2xl text-white/72 text-base lg:text-xl leading-relaxed">${co.subTagline}</p>
    <div class="hero-actions mt-10 flex flex-wrap gap-4">
      <a href="/capabilities" class="luxury-btn magnetic inline-flex items-center gap-3 bg-sand text-navy font-semibold px-8 py-4 text-sm tracking-wide hover:bg-white" data-cursor="EXPLORE"><span>Explore Capabilities</span> <i class="fa-solid fa-arrow-right text-xs"></i></a>
      <a href="/request-quote" class="luxury-btn magnetic inline-flex items-center gap-3 border border-white/35 text-white px-8 py-4 text-sm tracking-wide hover:border-sand hover:text-sand" data-cursor="QUOTE"><span>Request a Quote</span></a>
    </div>
  </div>
  <div class="hero-scroll absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/40" aria-hidden="true">
    <span class="text-[10px] tracking-widest2 uppercase rotate-90 origin-center translate-y-[-14px]">Scroll</span>
    <span class="scroll-line block w-px h-14 bg-white/50 origin-top mt-6"></span>
  </div>
</section>

<!-- ================= VERIFIED TRUST STRIP ================= -->
<section id="trust-strip" class="bg-ivory border-b border-sand/40 ivory-texture textile-texture">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-sand/40">
    ${raw([
      ['Established', co.established, 'Founded 30 October 1993 (BGMEA)'],
      ['Factory Type', 'Knit Composite', 'Knitting · Dyeing · Finishing · Garments'],
      ['BGMEA Reg.', co.bgmeaRegistration, 'EPB Registration ' + co.epbRegistration],
      ['Export Focus', 'International', 'Export-oriented apparel manufacturing'],
    ].map(([k, v, s]) => `
      <div class="py-10 lg:py-14 px-5 lg:px-10 reveal">
        <p class="text-[10px] tracking-widest2 uppercase text-mutedgt">${k}</p>
        <p class="font-serif text-3xl lg:text-6xl text-navy mt-3 big-num">${v}</p>
        <p class="text-xs text-mutedgt mt-2">${s}</p>
      </div>`).join(''))}
  </div>
</section>

<!-- ================= EDITORIAL INTRO ================= -->
<section id="about-intro" class="bg-ivory py-24 lg:py-36">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12 items-start">
    <div class="lg:col-span-5 reveal">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>About Gumti</p>
      <h2 class="font-serif text-5xl lg:text-[70px] leading-[0.95] text-navy tracking-[-0.045em]"><span class="word-mask"><span>CRAFTING</span></span><br/><span class="word-mask"><span>POSSIBILITY.</span></span></h2>
      <a href="/about" class="magnetic mt-10 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand">Our Story <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
    <div class="lg:col-span-7 reveal">
      <p class="text-xl lg:text-2xl leading-relaxed text-ink/78 max-w-3xl">
        ${co.name} began operations in ${co.established} and operates as an established, export-oriented knit-composite textile and apparel manufacturer in Bangladesh — integrating knitting, dyeing, finishing and garment manufacturing under one quality system.
      </p>
      <div class="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-6">
        ${raw(co.capabilities.slice(0, 4).map((c, i) => `
          <div class="flex items-start gap-4 border-t border-sand/50 pt-5 reveal" style="transition-delay:${i * 80}ms">
            <span class="font-serif text-sand text-2xl">0${i + 1}</span>
            <p class="text-sm font-medium text-navy tracking-wide">${c}</p>
          </div>`).join(''))}
      </div>
    </div>
  </div>
</section>

<!-- ================= SIGNATURE MANUFACTURING JOURNEY ================= -->
<section id="journey-signature" class="journey-pin textile-texture">
  <div class="journey-sticky">
    <div class="journey-bg" aria-hidden="true">
      ${raw(manufacturingStages.map((s, i) => `<img src="${(media as any)[s.image]}" alt="" class="${i === 0 ? 'active' : ''}" loading="lazy" />`).join(''))}
    </div>
    <div class="journey-copy max-w-[1440px] mx-auto px-5 lg:px-10">
      <p class="text-[11px] tracking-widest2 uppercase text-sand mb-6 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Manufacturing Journey</p>
      <p id="journey-no" class="journey-no">01</p>
      <h2 class="journey-title" id="journey-title">KNITTING</h2>
      <p id="journey-tag" class="journey-tag mt-5">Precision begins at the fabric stage.</p>
      <p id="journey-desc" class="journey-desc mt-5">${manufacturingStages[0].description}</p>
      <div id="journey-progress" class="journey-progress mt-9"><span style="width:${100 / manufacturingStages.length}%"></span></div>
      <div class="journey-dots mt-7" aria-hidden="true">${raw(manufacturingStages.map((s, i) => `<button class="${i === 0 ? 'active' : ''}" tabindex="-1"></button>`).join(''))}</div>
      <a href="/capabilities" class="magnetic mt-10 inline-flex items-center gap-3 border border-white/25 text-white px-7 py-3.5 text-sm tracking-wide hover:border-sand hover:text-sand">Explore Every Stage <i class="fa-solid fa-arrow-right text-xs"></i></a>
      <div class="sr-only">
        ${raw(manufacturingStages.map((s) => `<span class="journey-stage-data" data-num="${s.num}" data-name="${s.name.toUpperCase()}" data-tag="${s.tagline}" data-desc="${s.description}"></span>`).join(''))}
      </div>
    </div>
  </div>
</section>

<!-- ================= HORIZONTAL CAPABILITIES ================= -->
<section id="capability-horizontal" class="bg-navy text-white py-24 lg:py-32 textile-texture">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
      <div class="reveal"><p class="text-[11px] tracking-widest2 uppercase text-sand mb-4">Our Capabilities</p><h2 class="font-serif text-4xl lg:text-[64px] leading-[.96] tracking-[-.045em]">TECHNICAL SCALE,<br/>EDITORIAL PRECISION.</h2></div>
      <p class="text-white/58 max-w-md reveal">A responsive horizontal rail on mobile and desktop — designed as a premium technical capability walkthrough.</p>
    </div>
    <div class="capability-rail reveal-img" aria-label="Capability cards">
      ${raw(manufacturingStages.map((s) => `
        <article class="capability-card">
          <p class="font-serif text-5xl text-sand/55">${s.num}</p>
          <h3 class="font-serif text-3xl mt-10 text-white">${s.name}</h3>
          <p class="text-sand text-sm uppercase tracking-widest mt-2">${s.tagline}</p>
          <p class="text-white/62 text-sm leading-relaxed mt-5">${s.description}</p>
          <a href="/capabilities#${s.slug}" class="mt-7 inline-flex items-center gap-2 text-sm text-sand hover:text-white">Stage details <i class="fa-solid fa-arrow-right text-xs"></i></a>
        </article>`).join(''))}
    </div>
  </div>
</section>

<!-- ================= EDITORIAL PRODUCT SHOWCASE ================= -->
<section id="product-showcase" class="bg-ivory py-24 lg:py-36 ivory-texture textile-texture">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
      <div class="reveal"><p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>Product Catalog</p><h2 class="font-serif text-5xl lg:text-[72px] text-navy leading-[.94] tracking-[-.05em]">PRINCIPAL<br/>EXPORT CATEGORIES</h2></div>
      <a href="/products" class="magnetic reveal inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand self-start lg:self-auto" data-cursor="EXPLORE">View Full Catalog <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${raw(['T-Shirts', 'Polo Shirts', 'Knit Jackets', 'Shorts'].map((cat, i) => {
        const p = products.find((x) => x.category === cat)!
        return `<a href="/products?category=${encodeURIComponent(cat.toLowerCase().replace(/[^a-z]/g, ''))}" class="product-card group bg-white border border-sand/40 reveal block" data-cursor="EXPLORE" style="transition-delay:${i * 80}ms">
          <div class="overflow-hidden aspect-[3/4] relative"><img src="${p.image}" alt="${cat}" class="pc-img w-full h-full object-cover" loading="lazy" /><span class="absolute right-4 top-4 font-serif text-4xl text-white/60">0${i + 1}</span></div>
          <div class="p-6"><p class="text-[10px] tracking-widest2 uppercase text-mutedgt">Publicly documented export product</p><p class="font-serif text-3xl text-navy mt-2 group-hover:text-sand">${cat}</p><p class="mt-5 text-xs text-mutedgt inline-flex items-center gap-2">Explore category <i class="explore-arrow fa-solid fa-arrow-right"></i></p></div>
        </a>`
      }).join(''))}
    </div>
  </div>
</section>

<!-- ================= FABRIC TO GARMENT ================= -->
<section id="fabric-experience" class="bg-white py-24 lg:py-32 border-y border-sand/40">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 text-center">
    <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 reveal">The Fabric-to-Garment Experience</p>
    <h2 class="font-serif text-4xl lg:text-6xl text-navy reveal">One Integrated Transformation</h2>
    <p class="mt-4 text-mutedgt text-sm max-w-lg mx-auto reveal">Drag the slider — from knitted fabric on the left to finished garments on the right. Imagery is representative; official Gumti media can replace these slots.</p>
    <div id="fabric-compare" class="relative mt-12 aspect-[16/9] max-h-[520px] w-full overflow-hidden select-none reveal-img" data-cursor="VIEW">
      <img src="${media.garments}" alt="Finished knit garments" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <img src="${media.fabricPile}" alt="Knitted fabric" class="cmp-top absolute inset-0 w-full h-full object-cover" style="clip-path: inset(0 50% 0 0)" loading="lazy" />
      <div class="cmp-bar absolute top-0 bottom-0 w-0.5 bg-sand" style="left:50%"><span class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-sand text-navy flex items-center justify-center rounded-full shadow-lg"><i class="fa-solid fa-arrows-left-right text-sm"></i></span></div>
      <input type="range" min="0" max="100" value="50" class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" aria-label="Compare fabric and finished garment" />
    </div>
  </div>
</section>

<!-- ================= QUALITY & CERTIFICATIONS ================= -->
<section id="quality-certs" class="bg-ivory py-24 lg:py-36">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-5 reveal">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>Quality & Compliance</p>
      <h2 class="font-serif text-5xl lg:text-[68px] text-navy leading-[.95] tracking-[-.05em]"><span class="word-mask"><span>QUALITY IS</span></span><br/><span class="word-mask"><span>NOT A CLAIM.</span></span><br/><span class="text-sand word-mask"><span>IT'S A PROCESS.</span></span></h2>
      <p class="mt-6 text-ink/70 leading-relaxed max-w-md">Standards and memberships publicly listed by BGMEA. Certificate numbers and validity are populated only when provided by Gumti management — never fabricated.</p>
      <a href="/quality" class="magnetic mt-8 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand">Quality System <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
    <div class="lg:col-span-7 grid sm:grid-cols-2 gap-5">
      ${raw(co.certifications.map((c) => `
        <a href="/quality#certifications" class="cert-card bg-white border border-sand/40 p-7 reveal block" data-cursor="VIEW">
          <p class="font-serif text-4xl text-navy">${c.code}</p><p class="text-xs tracking-wide uppercase text-sand mt-1">${c.scope}</p><p class="mt-4 text-sm text-mutedgt leading-relaxed">${c.description.slice(0, 110)}…</p><div class="cert-extra"><p class="mt-4 text-xs text-mutedgt">${c.note}</p></div><p class="mt-4 text-[10px] tracking-widest2 uppercase text-emerald-700"><i class="fa-solid fa-circle-check mr-1"></i> Listed by BGMEA</p>
        </a>`).join(''))}
    </div>
  </div>
</section>

<!-- ================= GLOBAL REACH ================= -->
<section id="global-reach-home" class="bg-navy text-white py-24 lg:py-36 relative overflow-hidden textile-texture">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10 text-center">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-4 reveal">Global Reach</p>
    <h2 class="font-serif text-5xl lg:text-[86px] leading-[.9] tracking-[-.055em] reveal">MADE IN BANGLADESH.<br/><span class="text-sand">READY FOR THE WORLD.</span></h2>
    <p class="mt-6 max-w-xl mx-auto text-white/60 reveal">An EPB-registered exporter serving international markets. Export-market details are displayed only when verified by Gumti Textiles Ltd.</p>
    <a href="/global-reach" class="magnetic mt-10 inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-sand hover:text-sand reveal">Explore Global Reach <i class="fa-solid fa-arrow-right text-xs"></i></a>
  </div>
</section>

<!-- ================= FACTORY EXPERIENCE ================= -->
<section id="factory-home" class="bg-ivory py-24 lg:py-36">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-6 items-end">
    <div class="lg:col-span-7 reveal-img overflow-hidden"><img src="${media.knitting}" alt="Industrial circular knitting machines" class="w-full aspect-[4/3] object-cover" loading="lazy" /></div>
    <div class="lg:col-span-5 reveal bg-white border border-sand/40 p-8 lg:p-12 lg:-ml-20 mb-8 relative z-10">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>Our Factory</p>
      <h2 class="font-serif text-4xl lg:text-[54px] text-navy leading-[.98] tracking-[-.04em]">From Bangladesh<br/>to Global Markets</h2>
      <p class="mt-6 text-ink/70 leading-relaxed">The Gumti factory operates at Chandra, Shafipur, Kaliakoir, Gazipur — housing the integrated knit-composite workflow from fabric formation through packing and export.</p>
      <address class="mt-6 not-italic text-sm text-mutedgt leading-relaxed border-l-2 border-sand pl-5">${co.factoryAddress.line1}<br/>${co.factoryAddress.line2}<br/>${co.factoryAddress.line3}</address>
      <a href="/facilities" class="magnetic mt-8 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand">Visit Facilities <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
  </div>
</section>

<!-- ================= DRAMATIC CTA ================= -->
<section id="cta-final" class="bg-midnight text-white py-24 lg:py-36 textile-texture">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
    <h2 class="font-serif text-6xl lg:text-[112px] text-white leading-[.86] tracking-[-.06em] reveal">LET'S BUILD<br/><span class="text-sand">WHAT'S NEXT.</span></h2>
    <p class="mt-7 text-white/65 max-w-xl mx-auto reveal">Have a product requirement, sourcing inquiry or partnership opportunity? Share your specification and receive a Gumti tracking ID.</p>
    <div class="mt-11 flex flex-wrap justify-center gap-4 reveal">
      <a href="/request-quote" class="luxury-btn magnetic inline-flex items-center gap-3 bg-sand text-navy font-semibold px-8 py-4 text-sm tracking-wide hover:bg-white"><span>Request a Quote</span><i class="fa-solid fa-arrow-right text-xs"></i></a>
      <a href="/contact" class="magnetic inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-sand hover:text-sand">Contact Gumti</a>
    </div>
  </div>
</section>
`
