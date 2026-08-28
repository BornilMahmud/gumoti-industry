import { html, raw } from 'hono/html'
import { companyProfile as co, media, manufacturingStages } from '../data/company'
import { products } from '../data/products'

export const HomePage = () => html`
<!-- ================= HERO ================= -->
<section id="hero-section" class="relative min-h-screen flex items-end bg-navy overflow-hidden">
  <div class="absolute inset-0">
    <img src="${media.hero}" alt="Garment production floor with rows of sewing stations" class="hero-media w-full h-full object-cover opacity-45" fetchpriority="high" />
    <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30"></div>
  </div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-10 pb-24 lg:pb-32 pt-40 w-full">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-6 flex items-center gap-3">
      <span class="inline-block w-10 h-px bg-sand"></span>
      Knit Composite Manufacturer · Bangladesh · Est. ${co.established}
    </p>
    <h1 class="hero-headline font-serif text-white leading-[0.98] text-[13vw] sm:text-6xl lg:text-[88px] xl:text-[104px]">
      <span class="overflow-hidden">ENGINEERING QUALITY.</span><br/>
      <span class="l2 text-sand">CRAFTING POSSIBILITY.</span>
    </h1>
    <p class="mt-8 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed">${co.subTagline}</p>
    <div class="mt-10 flex flex-wrap gap-4">
      <a href="/capabilities" class="inline-flex items-center gap-3 bg-sand text-navy font-semibold px-8 py-4 text-sm tracking-wide hover:bg-white transition-colors">
        Explore Our Capabilities <i class="fa-solid fa-arrow-right text-xs"></i>
      </a>
      <a href="/request-quote" class="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-sand hover:text-sand transition-colors">
        Request a Quote
      </a>
    </div>
  </div>
  <div class="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/40" aria-hidden="true">
    <span class="text-[10px] tracking-widest2 uppercase rotate-90 origin-center translate-y-[-14px]">Scroll</span>
    <span class="scroll-line block w-px h-14 bg-white/50 origin-top mt-6"></span>
  </div>
</section>

<!-- ================= TRUST STRIP (verified facts only) ================= -->
<section id="trust-strip" class="bg-ivory border-b border-sand/40">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-sand/40">
    ${raw([
      ['Established', co.established, 'Founded 30 October 1993 (BGMEA)'],
      ['Factory Type', 'Knit Composite', 'Knitting · Dyeing · Finishing · Garments'],
      ['BGMEA Reg.', co.bgmeaRegistration, 'EPB Registration ' + co.epbRegistration],
      ['Export Focus', 'International', 'Export-oriented apparel manufacturing'],
    ].map(([k, v, s]) => `
      <div class="py-10 lg:py-14 px-5 lg:px-10 reveal">
        <p class="text-[10px] tracking-widest2 uppercase text-mutedgt">${k}</p>
        <p class="font-serif text-3xl lg:text-5xl text-navy mt-3">${v}</p>
        <p class="text-xs text-mutedgt mt-2">${s}</p>
      </div>`).join(''))}
  </div>
</section>

<!-- ================= ABOUT / INTRO ================= -->
<section id="about-intro" class="bg-ivory py-24 lg:py-36">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12 items-start">
    <div class="lg:col-span-5 reveal">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>About Gumti</p>
      <h2 class="font-serif text-4xl lg:text-[52px] leading-[1.05] text-navy">Built on Experience.<br/>Driven by Manufacturing.</h2>
      <a href="/about" class="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors">Our Story <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
    <div class="lg:col-span-7 reveal">
      <p class="text-lg leading-relaxed text-ink/80 max-w-2xl">
        ${co.name} began operations in ${co.established} and operates as an established, export-oriented knit-composite
        textile and apparel manufacturer in Bangladesh — with integrated capabilities spanning knitting, dyeing,
        finishing and garment manufacturing under one quality system.
      </p>
      <div class="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-6">
        ${raw(co.capabilities.slice(0, 4).map((c, i) => `
          <div class="flex items-start gap-4 border-t border-sand/50 pt-5">
            <span class="font-serif text-sand text-lg">0${i + 1}</span>
            <p class="text-sm font-medium text-navy tracking-wide">${c}</p>
          </div>`).join(''))}
      </div>
    </div>
  </div>
</section>

<!-- ================= MANUFACTURING JOURNEY (Spec §64) ================= -->
<section id="manufacturing-journey" class="bg-navy text-white py-24 lg:py-36 overflow-hidden">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-4 flex items-center gap-3 reveal"><span class="w-8 h-px bg-sand inline-block"></span>Manufacturing Capabilities</p>
    <h2 class="font-serif text-4xl lg:text-[56px] leading-[1.02] max-w-3xl reveal">FROM FIBER TO<br/><span class="text-sand">FINISHED GARMENT</span></h2>
    <p class="mt-6 max-w-xl text-white/60 reveal">One integrated journey — every stage under a single quality system. Select a stage to explore its role in the process.</p>

    <div class="mt-16 space-y-0" id="capability-accordion">
      ${raw(manufacturingStages.map((s) => `
        <div class="cap-item border-t border-white/10 last:border-b" data-open="0">
          <button class="cap-toggle w-full flex items-center justify-between gap-6 py-6 lg:py-8 text-left group cursor-pointer" aria-expanded="false">
            <div class="flex items-baseline gap-5 lg:gap-10">
              <span class="font-serif text-sand/70 text-lg lg:text-2xl">${s.num}</span>
              <span class="font-serif text-2xl lg:text-4xl group-hover:text-sand transition-colors">${s.name.toUpperCase()}</span>
            </div>
            <span class="cap-chevron text-sand text-xl shrink-0" aria-hidden="true"><i class="fa-solid fa-plus"></i></span>
          </button>
          <div class="cap-panel">
            <div>
              <div class="grid lg:grid-cols-12 gap-8 pb-10">
                <div class="lg:col-span-5">
                  <img src="${(media as any)[s.image]}" alt="${s.name} process" class="w-full h-56 lg:h-72 object-cover" loading="lazy" />
                </div>
                <div class="lg:col-span-7">
                  <p class="text-sand text-sm tracking-wide uppercase">${s.tagline}</p>
                  <p class="mt-3 text-white/70 leading-relaxed max-w-2xl">${s.description}</p>
                  <div class="mt-6 flex flex-wrap gap-2">
                    ${s.checkpoints.map((c) => `<span class="text-[11px] tracking-wide uppercase border border-white/20 text-white/60 px-3 py-1.5">${c}</span>`).join('')}
                  </div>
                  <a href="/capabilities#${s.slug}" class="mt-6 inline-flex items-center gap-2 text-sm text-sand hover:text-white transition-colors">Stage details <i class="fa-solid fa-arrow-right text-xs"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>`).join(''))}
    </div>
  </div>
</section>

<!-- ================= PRODUCT SHOWCASE ================= -->
<section id="product-showcase" class="bg-ivory py-24 lg:py-36">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
      <div class="reveal">
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>Product Catalog</p>
        <h2 class="font-serif text-4xl lg:text-[52px] text-navy leading-[1.05]">Principal Export<br/>Categories</h2>
      </div>
      <a href="/products" class="reveal inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors self-start lg:self-auto">View Full Catalog <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${raw(['T-Shirts', 'Polo Shirts', 'Knit Jackets', 'Shorts'].map((cat) => {
        const p = products.find((x) => x.category === cat)!
        return `
        <a href="/products?category=${encodeURIComponent(cat.toLowerCase().replace(/[^a-z]/g, ''))}" class="product-card group bg-white border border-sand/40 reveal block">
          <div class="overflow-hidden aspect-[4/3]">
            <img src="${p.image}" alt="${cat}" class="pc-img w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="p-6">
            <p class="text-[10px] tracking-widest2 uppercase text-mutedgt">Publicly documented export product</p>
            <p class="font-serif text-2xl text-navy mt-2 group-hover:text-sand transition-colors">${cat}</p>
            <p class="mt-3 text-xs text-mutedgt inline-flex items-center gap-2">Explore category <i class="fa-solid fa-arrow-right"></i></p>
          </div>
        </a>`
      }).join(''))}
    </div>
  </div>
</section>

<!-- ================= FABRIC TO GARMENT EXPERIENCE (Spec §65) ================= -->
<section id="fabric-experience" class="bg-white py-24 lg:py-32 border-y border-sand/40">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 text-center">
    <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 reveal">The Fabric-to-Garment Experience</p>
    <h2 class="font-serif text-3xl lg:text-5xl text-navy reveal">One Integrated Transformation</h2>
    <p class="mt-4 text-mutedgt text-sm max-w-lg mx-auto reveal">Drag the slider — from knitted fabric on the left to finished garments on the right. Imagery is representative; official Gumti media can replace these slots.</p>
    <div id="fabric-compare" class="relative mt-12 aspect-[16/9] max-h-[520px] w-full overflow-hidden select-none reveal-img">
      <img src="${media.garments}" alt="Finished knit garments" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <img src="${media.fabricPile}" alt="Knitted fabric" class="cmp-top absolute inset-0 w-full h-full object-cover" style="clip-path: inset(0 50% 0 0)" loading="lazy" />
      <div class="cmp-bar absolute top-0 bottom-0 w-0.5 bg-sand" style="left:50%"><span class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-sand text-navy flex items-center justify-center rounded-full shadow-lg"><i class="fa-solid fa-arrows-left-right text-sm"></i></span></div>
      <input type="range" min="0" max="100" value="50" class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" aria-label="Compare fabric and finished garment" />
      <span class="absolute bottom-4 left-4 text-[10px] tracking-widest2 uppercase bg-navy/80 text-white px-3 py-1.5">Fabric</span>
      <span class="absolute bottom-4 right-4 text-[10px] tracking-widest2 uppercase bg-navy/80 text-white px-3 py-1.5">Garment</span>
    </div>
  </div>
</section>

<!-- ================= QUALITY & CERTIFICATIONS ================= -->
<section id="quality-certs" class="bg-ivory py-24 lg:py-36">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-5 reveal">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>Quality & Compliance</p>
      <h2 class="font-serif text-4xl lg:text-[48px] text-navy leading-[1.05]">QUALITY IS BUILT<br/>INTO THE PROCESS.</h2>
      <p class="mt-6 text-ink/70 leading-relaxed max-w-md">Standards and memberships publicly listed by BGMEA. Certificate numbers and validity are populated only when provided by Gumti management — never fabricated.</p>
      <a href="/quality" class="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors">Quality System <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
    <div class="lg:col-span-7 grid sm:grid-cols-2 gap-5">
      ${raw(co.certifications.map((c) => `
        <a href="/quality#certifications" class="cert-card bg-white border border-sand/40 p-7 reveal block">
          <p class="font-serif text-3xl text-navy">${c.code}</p>
          <p class="text-xs tracking-wide uppercase text-sand mt-1">${c.scope}</p>
          <p class="mt-4 text-sm text-mutedgt leading-relaxed">${c.description.slice(0, 110)}…</p>
          <p class="mt-4 text-[10px] tracking-widest2 uppercase text-emerald-700"><i class="fa-solid fa-circle-check mr-1"></i> Listed by BGMEA</p>
        </a>`).join(''))}
    </div>
  </div>
</section>

<!-- ================= GLOBAL REACH ================= -->
<section id="global-reach-home" class="bg-navy text-white py-24 lg:py-36 relative overflow-hidden">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10 text-center">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-4 reveal">Global Reach</p>
    <h2 class="font-serif text-4xl lg:text-[64px] leading-[1.02] reveal">MADE IN BANGLADESH.<br/><span class="text-sand">READY FOR THE WORLD.</span></h2>
    <p class="mt-6 max-w-xl mx-auto text-white/60 reveal">An EPB-registered exporter serving international markets. Export-market details are displayed only when verified by Gumti Textiles Ltd.</p>
    <a href="/global-reach" class="mt-10 inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-sand hover:text-sand transition-colors reveal">Explore Global Reach <i class="fa-solid fa-arrow-right text-xs"></i></a>
  </div>
</section>

<!-- ================= FACTORY EXPERIENCE ================= -->
<section id="factory-home" class="bg-ivory py-24 lg:py-36">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
    <div class="reveal-img overflow-hidden order-2 lg:order-1">
      <img src="${media.knitting}" alt="Industrial circular knitting machines" class="w-full aspect-[4/3] object-cover" loading="lazy" />
    </div>
    <div class="order-1 lg:order-2 reveal">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>Our Factory</p>
      <h2 class="font-serif text-4xl lg:text-[48px] text-navy leading-[1.05]">From Bangladesh<br/>to Global Markets</h2>
      <p class="mt-6 text-ink/70 leading-relaxed">The Gumti factory operates at Chandra, Shafipur, Kaliakoir, Gazipur — housing the integrated knit-composite workflow from fabric formation through packing and export.</p>
      <address class="mt-6 not-italic text-sm text-mutedgt leading-relaxed border-l-2 border-sand pl-5">
        ${co.factoryAddress.line1}<br/>${co.factoryAddress.line2}<br/>${co.factoryAddress.line3}
      </address>
      <a href="/facilities" class="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors">Visit Facilities <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
  </div>
</section>

<!-- ================= CTA ================= -->
<section id="cta-final" class="bg-sand py-20 lg:py-28">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 text-center">
    <h2 class="font-serif text-3xl lg:text-[52px] text-navy leading-[1.05] reveal">Start a Conversation<br/>With Our Team</h2>
    <p class="mt-5 text-navy/70 max-w-lg mx-auto reveal">Submit a request for quotation with your product, quantity and specification — our sales team will respond with next steps.</p>
    <div class="mt-10 flex flex-wrap justify-center gap-4 reveal">
      <a href="/request-quote" class="inline-flex items-center gap-3 bg-navy text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-ink transition-colors">Request a Quote <i class="fa-solid fa-arrow-right text-xs"></i></a>
      <a href="/contact" class="inline-flex items-center gap-3 border border-navy/40 text-navy px-8 py-4 text-sm tracking-wide hover:border-navy transition-colors">Contact Us</a>
    </div>
  </div>
</section>
`
