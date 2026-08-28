import { html, raw } from 'hono/html'
import { companyProfile as co, media, manufacturingStages } from '../data/company'

const PageHero = (label: string, title: string, sub?: string) => `
<section class="relative bg-navy text-white pt-40 pb-20 lg:pb-28">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>${label}</p>
    <h1 class="font-serif text-4xl sm:text-5xl lg:text-[68px] leading-[1.02]">${title}</h1>
    ${sub ? `<p class="mt-6 max-w-xl text-white/60 leading-relaxed">${sub}</p>` : ''}
  </div>
</section>`

// ============ ABOUT ============
export const AboutPage = () => html`
${raw(PageHero('About Gumti', 'Built on Experience.<br/>Driven by Manufacturing.', `${co.name} is an established Bangladesh-based textile and apparel manufacturing company with integrated capabilities spanning knitting, dyeing, finishing and garment manufacturing.`))}

<section class="bg-ivory py-20 lg:py-28">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
    <div class="reveal-img overflow-hidden">
      <img src="${media.sewing2}" alt="Garment production line" class="w-full aspect-[4/3] object-cover" loading="lazy" />
    </div>
    <div class="reveal">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3"><span class="w-8 h-px bg-sand inline-block"></span>Company Story</p>
      <h2 class="font-serif text-3xl lg:text-5xl text-navy leading-[1.05]">From Bangladesh to Global Markets</h2>
      <p class="mt-6 text-ink/75 leading-relaxed">Established on ${co.establishedFull}, ${co.name} operates as a knit-composite manufacturer — combining knitting, dyeing, finishing and export-oriented garment manufacturing within one integrated operation.</p>
      <p class="mt-4 text-ink/75 leading-relaxed">The company is registered with BGMEA (Reg. ${co.bgmeaRegistration}) and the Export Promotion Bureau (Reg. ${co.epbRegistration}), with publicly documented export products including T-shirts, polo shirts, knit jackets and shorts.</p>
      <dl class="mt-8 grid grid-cols-2 gap-6 text-sm">
        <div class="border-t border-sand/50 pt-4"><dt class="text-[10px] tracking-widest2 uppercase text-mutedgt">Managing Director</dt><dd class="mt-1 font-medium text-navy">${co.managingDirector}</dd></div>
        <div class="border-t border-sand/50 pt-4"><dt class="text-[10px] tracking-widest2 uppercase text-mutedgt">Factory Type</dt><dd class="mt-1 font-medium text-navy">${co.factoryType}</dd></div>
        <div class="border-t border-sand/50 pt-4"><dt class="text-[10px] tracking-widest2 uppercase text-mutedgt">BGMEA Reg.</dt><dd class="mt-1 font-medium text-navy">${co.bgmeaRegistration}</dd></div>
        <div class="border-t border-sand/50 pt-4"><dt class="text-[10px] tracking-widest2 uppercase text-mutedgt">EPB Reg.</dt><dd class="mt-1 font-medium text-navy">${co.epbRegistration}</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="bg-white py-20 lg:py-28 border-y border-sand/40" id="timeline-section">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <h2 class="font-serif text-3xl lg:text-5xl text-navy text-center reveal">Our Journey</h2>
    <p class="text-center text-xs text-mutedgt mt-3 reveal">Timeline content is CMS-editable; milestone years beyond 1993 to be confirmed by Gumti Textiles Ltd.</p>
    <ol class="mt-14 border-l border-sand/60 ml-2 space-y-12">
      ${raw(co.timeline.map((t) => `
        <li class="relative pl-10 timeline-dot reveal">
          <p class="font-serif text-2xl text-sand">${t.year}</p>
          <p class="font-semibold text-navy mt-1">${t.title}</p>
          <p class="text-sm text-mutedgt mt-2 max-w-lg leading-relaxed">${t.text}</p>
        </li>`).join(''))}
    </ol>
  </div>
</section>

<section class="bg-navy text-white py-20 lg:py-28">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 text-center">
    <h2 class="font-serif text-3xl lg:text-5xl reveal">Work With an Established Manufacturer</h2>
    <div class="mt-10 flex flex-wrap justify-center gap-4 reveal">
      <a href="/request-quote" class="bg-sand text-navy font-semibold px-8 py-4 text-sm tracking-wide hover:bg-white transition-colors">Request a Quote</a>
      <a href="/capabilities" class="border border-white/30 px-8 py-4 text-sm tracking-wide hover:border-sand hover:text-sand transition-colors">Explore Capabilities</a>
    </div>
  </div>
</section>
`

// ============ CAPABILITIES ============
export const CapabilitiesPage = () => html`
${raw(PageHero('Manufacturing Capabilities', 'FROM FIBER TO<br/><span class="text-sand">FINISHED GARMENT</span>', 'Six integrated stages under one quality system. Operational figures are CMS-managed and displayed only when confirmed by Gumti Textiles Ltd.'))}

${raw(manufacturingStages.map((s, i) => `
<section id="${s.slug}" class="${i % 2 === 0 ? 'bg-ivory' : 'bg-white border-y border-sand/40'} py-20 lg:py-28 journey-stage">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
    <div class="lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''} reveal-img overflow-hidden">
      <img src="${(media as any)[s.image]}" alt="${s.name} stage" class="w-full aspect-[4/3] object-cover" loading="lazy" />
    </div>
    <div class="lg:col-span-6 ${i % 2 === 1 ? 'lg:order-1' : ''} reveal">
      <p class="font-serif text-sand text-5xl lg:text-7xl">${s.num}</p>
      <h2 class="font-serif text-3xl lg:text-5xl text-navy mt-2">${s.name}</h2>
      <p class="text-sand text-sm tracking-wide uppercase mt-2">${s.tagline}</p>
      <p class="mt-5 text-ink/75 leading-relaxed max-w-xl">${s.description}</p>
      <div class="mt-7">
        <p class="text-[10px] tracking-widest2 uppercase text-mutedgt mb-3">Quality checkpoints</p>
        <div class="flex flex-wrap gap-2">${s.checkpoints.map((c) => `<span class="text-[11px] tracking-wide uppercase border border-sand/60 text-navy/70 px-3 py-1.5">${c}</span>`).join('')}</div>
      </div>
      <div class="mt-7 table-wrap">
        <table class="w-full text-sm border-t border-sand/50">
          <caption class="sr-only">${s.name} specifications (CMS-managed)</caption>
          <tbody>
            ${s.specs.map((sp) => `<tr class="border-b border-sand/40"><th scope="row" class="text-left py-3 pr-4 text-[11px] tracking-widest uppercase text-mutedgt font-medium whitespace-nowrap align-top">${sp.label}</th><td class="py-3 text-ink/75">${sp.value}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <a href="/request-quote" class="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors">Discuss Your Requirement <i class="fa-solid fa-arrow-right text-xs"></i></a>
    </div>
  </div>
</section>`).join(''))}

<section class="bg-navy text-white py-20 lg:py-24">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 text-center">
    <h2 class="font-serif text-3xl lg:text-5xl reveal">Have a Production Requirement?</h2>
    <a href="/request-quote" class="mt-8 inline-block bg-sand text-navy font-semibold px-8 py-4 text-sm tracking-wide hover:bg-white transition-colors reveal">Request a Quote</a>
  </div>
</section>
`

// ============ QUALITY ============
export const QualityPage = () => html`
${raw(PageHero('Quality & Compliance', 'QUALITY IS BUILT<br/>INTO THE PROCESS.', 'Quality is enforced at every stage of the integrated workflow — not inspected in at the end.'))}

<section class="bg-ivory py-20 lg:py-28">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid md:grid-cols-3 gap-px bg-sand/40 border border-sand/40">
      ${raw([
        ['Raw Material', 'Incoming yarn and trims are verified against buyer specifications before entering production.', 'fa-box-open'],
        ['Fabric Production', 'Construction, GSM and greige quality are controlled at the knitting stage.', 'fa-layer-group'],
        ['Dyeing', 'Lab dips, shade continuity and fastness performance are managed through the laboratory workflow.', 'fa-droplet'],
        ['Finishing', 'Shrinkage, width and hand feel are verified against tolerance standards.', 'fa-wand-magic-sparkles'],
        ['Garment Production', 'In-line inspection and measurement audits run throughout cutting and sewing.', 'fa-shirt'],
        ['Final Inspection', 'AQL-based final inspection and pre-shipment verification before packing and export.', 'fa-clipboard-check'],
      ].map(([t, d, icon], i) => `
        <article class="bg-ivory p-8 lg:p-10 reveal">
          <div class="flex items-center gap-4">
            <span class="w-11 h-11 flex items-center justify-center bg-navy text-sand"><i class="fa-solid ${icon}"></i></span>
            <span class="font-serif text-sand text-xl">0${i + 1}</span>
          </div>
          <h2 class="font-serif text-2xl text-navy mt-5">${t}</h2>
          <p class="mt-3 text-sm text-mutedgt leading-relaxed">${d}</p>
        </article>`).join(''))}
    </div>
  </div>
</section>

<section id="certifications" class="bg-navy text-white py-20 lg:py-28">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-4 flex items-center gap-3 reveal"><span class="w-8 h-px bg-sand inline-block"></span>Certifications & Standards</p>
    <h2 class="font-serif text-3xl lg:text-5xl reveal">Publicly Listed by BGMEA</h2>
    <p class="mt-4 text-white/60 max-w-xl text-sm reveal">Certificate numbers, validity dates and scope documents are displayed only when provided by Gumti Textiles Ltd. management. No certificate metadata is fabricated.</p>
    <div class="mt-12 grid sm:grid-cols-2 gap-5">
      ${raw(co.certifications.map((c) => `
        <details class="cert-card bg-navylight border border-white/10 p-7 group reveal">
          <summary class="cursor-pointer list-none flex items-start justify-between gap-4">
            <div>
              <p class="font-serif text-3xl">${c.code}</p>
              <p class="text-xs tracking-wide uppercase text-sand mt-1">${c.scope}</p>
            </div>
            <i class="fa-solid fa-chevron-down text-sand mt-2 transition-transform group-open:rotate-180" aria-hidden="true"></i>
          </summary>
          <div class="mt-5 text-sm text-white/70 leading-relaxed">
            <p class="font-medium text-white">${c.name}</p>
            <p class="mt-2">${c.description}</p>
            <dl class="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div><dt class="text-white/40 uppercase tracking-widest text-[10px]">Certificate No.</dt><dd class="mt-1">${c.certificateNumber || 'To be confirmed by Gumti Textiles Ltd.'}</dd></div>
              <div><dt class="text-white/40 uppercase tracking-widest text-[10px]">Valid Until</dt><dd class="mt-1">${c.validUntil || 'To be confirmed by Gumti Textiles Ltd.'}</dd></div>
            </dl>
            <p class="mt-4 text-[11px] text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i> Listed in BGMEA public records</p>
          </div>
        </details>`).join(''))}
    </div>
  </div>
</section>
`

// ============ SUSTAINABILITY ============
export interface VerifiedMetricRow { category: string; label: string; value?: string | null; unit?: string | null; year?: string | null; source?: string | null; status?: string }
export interface ExportMarketRow { country: string; region?: string | null; products?: string | null; description?: string | null }

export const SustainabilityPage = (verifiedMetrics: VerifiedMetricRow[] = []) => html`
${raw(PageHero('Sustainability', 'Responsible<br/>Manufacturing', 'Environmental and social performance data is CMS-managed with verification status. Only verified metrics are published — no figures are invented.'))}

<section class="bg-ivory py-20 lg:py-28">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    ${raw([
      ['Water', 'fa-droplet', 'Water use and treatment practices in dyeing and finishing. Quantified water metrics pending verification.'],
      ['Energy', 'fa-bolt', 'Energy management across the integrated facility. Energy statistics pending verification by Gumti management.'],
      ['Waste', 'fa-recycle', 'Fabric and process waste handling practices. Waste-stream data pending verification.'],
      ['Materials', 'fa-seedling', 'BCI cotton sourcing and GOTS-route organic programs, per publicly listed memberships.'],
      ['People', 'fa-people-group', 'Workplace standards supported by SEDEX membership for ethical trade data exchange.'],
      ['Compliance', 'fa-scale-balanced', 'Social and product-safety compliance aligned with SEDEX and OEKO-TEX frameworks.'],
      ['Supply Chain', 'fa-link', 'Responsible sourcing supported through BCI and GOTS-route material programs.'],
      ['Environment', 'fa-leaf', 'Environmental management practices across operations. Statistics published only when verified.'],
    ].map(([t, icon, d]) => `
      <article class="bg-white border border-sand/40 p-7 reveal">
        <span class="w-11 h-11 flex items-center justify-center bg-navy text-sand"><i class="fa-solid ${icon}"></i></span>
        <h2 class="font-serif text-2xl text-navy mt-5">${t}</h2>
        <p class="mt-3 text-sm text-mutedgt leading-relaxed">${d}</p>
      </article>`).join(''))}
  </div>
</section>

<section class="bg-white border-y border-sand/40 py-20 lg:py-28">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    <h2 class="font-serif text-3xl lg:text-5xl text-navy text-center reveal">Sustainability Data Model</h2>
    <p class="text-center text-sm text-mutedgt mt-4 max-w-xl mx-auto reveal">Metrics follow a verified-data policy: each metric carries a value, unit, year, source and verification status. Unverified metrics are never published.</p>
    <div class="table-wrap mt-12 reveal">
      <table class="w-full text-sm border border-sand/50">
        <caption class="sr-only">Sustainability metrics registry</caption>
        <thead class="bg-navy text-white text-left">
          <tr>${['Metric', 'Value', 'Unit', 'Year', 'Source', 'Verification'].map((h) => `<th scope="col" class="px-5 py-3.5 text-[11px] tracking-widest uppercase font-medium">${h}</th>`).join('')}</tr>
        </thead>
        <tbody class="divide-y divide-sand/40 bg-ivory">
          ${raw(verifiedMetrics.filter((m) => m.category === 'sustainability' && m.value).map((m) => `
          <tr class="reveal">
            <td class="px-5 py-4 text-navy font-medium">${m.label}</td>
            <td class="px-5 py-4 text-ink/75">${m.value}</td>
            <td class="px-5 py-4 text-mutedgt">${m.unit || '—'}</td>
            <td class="px-5 py-4 text-mutedgt">${m.year || '—'}</td>
            <td class="px-5 py-4 text-mutedgt">${m.source || '—'}</td>
            <td class="px-5 py-4"><span class="text-[10px] tracking-widest uppercase bg-emerald-100 text-emerald-900 px-2.5 py-1">Verified</span></td>
          </tr>`).join(''))}
          ${raw(['Water consumption per kg fabric', 'Renewable energy share', 'Recycled material share', 'Wastewater treatment coverage']
            .filter((label) => !verifiedMetrics.some((m) => m.label === label && m.value))
            .map((m) => `
            <tr>
              <td class="px-5 py-4 text-navy font-medium">${m}</td>
              <td class="px-5 py-4 text-mutedgt italic" colspan="4">Information to be confirmed by Gumti Textiles Ltd.</td>
              <td class="px-5 py-4"><span class="text-[10px] tracking-widest uppercase bg-amber-100 text-amber-900 px-2.5 py-1">Pending verification</span></td>
            </tr>`).join(''))}
          ${raw(verifiedMetrics.some((m) => m.label === 'Certified memberships') ? '' : `
          <tr>
            <td class="px-5 py-4 text-navy font-medium">Certified memberships</td>
            <td class="px-5 py-4 text-ink/75">BCI · SEDEX · OEKO-TEX · GOTS</td>
            <td class="px-5 py-4 text-mutedgt">—</td>
            <td class="px-5 py-4 text-mutedgt">Current</td>
            <td class="px-5 py-4 text-mutedgt">BGMEA public listing</td>
            <td class="px-5 py-4"><span class="text-[10px] tracking-widest uppercase bg-emerald-100 text-emerald-900 px-2.5 py-1">Verified</span></td>
          </tr>`)}
        </tbody>
      </table>
    </div>
  </div>
</section>
`

// ============ GLOBAL REACH ============
export const GlobalReachPage = (markets: ExportMarketRow[] = []) => html`
${raw(PageHero('Global Reach', 'MADE IN BANGLADESH.<br/><span class="text-sand">READY FOR THE WORLD.</span>', 'Export-oriented manufacturing registered with the Export Promotion Bureau (Reg. ' + co.epbRegistration + '). Market-level details are published only when verified.'))}

<section class="bg-ivory py-20 lg:py-28">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 reveal">
        <svg viewBox="0 0 1000 480" class="w-full h-auto" role="img" aria-label="Stylized world map highlighting Bangladesh as the manufacturing origin">
          <rect width="1000" height="480" fill="#071A2B"/>
          <g fill="#0E2A42">
            <ellipse cx="200" cy="160" rx="130" ry="85"/><ellipse cx="260" cy="330" rx="80" ry="100"/>
            <ellipse cx="500" cy="140" rx="90" ry="60"/><ellipse cx="520" cy="300" rx="70" ry="90"/>
            <ellipse cx="700" cy="200" rx="140" ry="100"/><ellipse cx="840" cy="360" rx="60" ry="40"/>
          </g>
          <circle cx="712" cy="215" r="8" fill="#C7B79C"><animate attributeName="r" values="8;13;8" dur="2.5s" repeatCount="indefinite"/></circle>
          <circle cx="712" cy="215" r="20" fill="none" stroke="#C7B79C" stroke-width="1" opacity="0.5"><animate attributeName="r" values="14;30" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite"/></circle>
          <text x="712" y="255" fill="#C7B79C" font-size="15" text-anchor="middle" font-family="Georgia,serif">Bangladesh</text>
          <g stroke="#C7B79C" stroke-width="1" fill="none" opacity="0.45" stroke-dasharray="4 5">
            <path d="M712 215 Q 500 60 230 140"/><path d="M712 215 Q 620 100 505 135"/>
            <path d="M712 215 Q 640 300 520 300"/><path d="M712 215 Q 800 300 840 350"/>
            <path d="M712 215 Q 480 320 280 330"/>
          </g>
        </svg>
      </div>
      <div class="lg:col-span-5 reveal">
        <h2 class="font-serif text-3xl lg:text-4xl text-navy">Export-Oriented Since Establishment</h2>
        <p class="mt-5 text-ink/75 leading-relaxed">Gumti Textiles manufactures knitwear for international, export-oriented markets. EPB records classify the company as a Knit & Woven exporter across multiple knitted and apparel product categories.</p>
        <div class="mt-8 space-y-4">
          ${raw([
            ['EPB Registration', co.epbRegistration + ' — Export Promotion Bureau, Bangladesh'],
            ['BGMEA Membership', 'Reg. ' + co.bgmeaRegistration + ' — Bangladesh Garment Manufacturers & Exporters Association'],
            ['Export Markets', markets.length ? 'Verified markets managed through the Gumti admin verification workflow.' : 'Serving international markets from Bangladesh. Country-level data is published only when verified by Gumti Textiles Ltd.'],
          ].map(([k, v]) => `
            <div class="border-l-2 border-sand pl-5 py-1">
              <p class="text-[10px] tracking-widest2 uppercase text-mutedgt">${k}</p>
              <p class="text-sm text-navy mt-1">${v}</p>
            </div>`).join(''))}
        </div>
        <a href="/request-quote" class="mt-9 inline-flex items-center gap-3 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors">Source From Bangladesh <i class="fa-solid fa-arrow-right text-xs"></i></a>
      </div>
    </div>

    ${raw(markets.length ? `
    <div class="mt-16">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-4 flex items-center gap-3 reveal"><span class="w-8 h-px bg-sand inline-block"></span>Verified Export Markets</p>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${markets.map((m) => `
        <article class="bg-white border border-sand/40 p-7 reveal">
          <p class="font-serif text-2xl text-navy">${m.country}</p>
          ${m.region ? `<p class="text-xs tracking-widest uppercase text-sand mt-1">${m.region}</p>` : ''}
          ${m.products ? `<p class="text-sm text-mutedgt mt-3">${m.products}</p>` : ''}
          ${m.description ? `<p class="text-sm text-ink/70 mt-2 leading-relaxed">${m.description}</p>` : ''}
          <p class="mt-4 text-[11px] text-emerald-700"><i class="fa-solid fa-circle-check mr-1"></i> Verified by Gumti Textiles Ltd.</p>
        </article>`).join('')}
      </div>
    </div>` : '')}
  </div>
</section>
`

// ============ FACILITIES ============
export const FacilitiesPage = () => html`
${raw(PageHero('Facilities', 'OUR FACTORY', 'The integrated knit-composite facility at Kaliakoir, Gazipur — and the corporate head office in Dhaka.'))}

<section class="bg-ivory py-20 lg:py-28">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-8">
    <article class="bg-white border border-sand/40 reveal">
      <img src="${media.knitting2}" alt="Knitting machinery hall" class="w-full aspect-[16/9] object-cover" loading="lazy" />
      <div class="p-8 lg:p-10">
        <p class="text-[10px] tracking-widest2 uppercase text-sand">Manufacturing Facility</p>
        <h2 class="font-serif text-3xl text-navy mt-2">Gazipur Factory</h2>
        <address class="not-italic mt-4 text-sm text-mutedgt leading-relaxed">${co.factoryAddress.line1}<br/>${co.factoryAddress.line2}<br/>${co.factoryAddress.line3}</address>
        <p class="mt-4 text-sm text-ink/70 leading-relaxed">Houses the integrated workflow: knitting, dyeing, finishing, garment manufacturing, quality control and packing for export. Facility area and capacity data to be confirmed by Gumti Textiles Ltd.</p>
        <a href="${co.factoryAddress.mapUrl}" target="_blank" rel="noopener" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors"><i class="fa-solid fa-map-location-dot"></i> Open in Google Maps</a>
      </div>
    </article>
    <article class="bg-white border border-sand/40 reveal">
      <div class="w-full aspect-[16/9] bg-navy flex items-center justify-center">
        <div class="text-center">
          <i class="fa-regular fa-building text-sand text-5xl"></i>
          <p class="text-white/50 text-xs mt-4 tracking-widest2 uppercase">Official imagery slot — CMS managed</p>
        </div>
      </div>
      <div class="p-8 lg:p-10">
        <p class="text-[10px] tracking-widest2 uppercase text-sand">Corporate</p>
        <h2 class="font-serif text-3xl text-navy mt-2">Head Office, Dhaka</h2>
        <address class="not-italic mt-4 text-sm text-mutedgt leading-relaxed">${co.headOffice.line1}<br/>${co.headOffice.line2}<br/>${co.headOffice.line3}</address>
        <p class="mt-4 text-sm text-ink/70 leading-relaxed">Corporate, merchandising and buyer communication functions operate from the Baridhara DOHS head office.</p>
        <a href="${co.headOffice.mapUrl}" target="_blank" rel="noopener" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy border-b border-sand pb-1 hover:text-sand transition-colors"><i class="fa-solid fa-map-location-dot"></i> Open in Google Maps</a>
      </div>
    </article>
  </div>

  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 mt-8 grid sm:grid-cols-3 gap-6">
    ${raw([[media.dyeing, 'Dyeing facility'], [media.sewing3, 'Sewing floor'], [media.quality, 'Quality inspection']].map(([src, alt]) => `
      <figure class="reveal-img overflow-hidden">
        <img src="${src}" alt="${alt} (representative imagery)" class="w-full aspect-[4/3] object-cover" loading="lazy" />
        <figcaption class="text-[10px] tracking-widest uppercase text-mutedgt mt-2">${alt} — representative image, replaceable via CMS</figcaption>
      </figure>`).join(''))}
  </div>
</section>
`
