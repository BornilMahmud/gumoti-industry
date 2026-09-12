import { html, raw } from 'hono/html'
import { companyProfile as co, media, manufacturingStages } from '../data/company'

const PageHero = (kicker: string, title: string, sub?: string) => `
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">${kicker}</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[60px] font-extrabold font-display leading-[1.05] text-white">
      ${title}
    </h1>
    ${sub ? `<p class="mt-4 max-w-2xl text-[#788A9C] text-sm sm:text-base leading-relaxed">${sub}</p>` : ''}
  </div>
</section>`

// ============ ABOUT PAGE ============
export const AboutPage = () => html`
${raw(PageHero('Over 30 Years of Excellence', 'Built on Experience.<br/><span class="text-gradient-emerald">Driven by Manufacturing.</span>', `${co.name} is an established knit-composite textile and apparel manufacturer in Bangladesh — integrating circular knitting, eco-dyeing, stenter finishing, and 22 garment assembly lines.`))}

<section class="bg-[#08111A] py-16 lg:py-24">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
    
    <!-- Left Factory Image -->
    <div class="lg:col-span-6">
      <div class="glass-panel p-3 border border-white/[0.1] rounded-2xl relative overflow-hidden group">
        <img src="${media.sewing2}" alt="Gumti Sewing Floor" class="w-full aspect-[4/3] object-cover rounded-xl group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div class="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#060B10]/85 backdrop-blur-md border border-white/[0.1] flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase text-[#00E599] tracking-wider">Garment Assembly</p>
            <p class="text-xs font-bold text-white mt-0.5">22 Lines · 35,000 Pcs/Day</p>
          </div>
          <span class="text-[10px] font-mono px-2.5 py-1 rounded bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-bold">Active</span>
        </div>
      </div>
    </div>

    <!-- Right Story & Registrations -->
    <div class="lg:col-span-6 space-y-6">
      <span class="kicker-pill">Corporate Profile</span>
      <h2 class="text-2xl sm:text-4xl font-bold font-display text-white">
        From Bangladesh to Global Retailers
      </h2>
      <p class="text-sm text-[#CBD5E1] leading-relaxed">
        Founded on ${co.establishedFull}, ${co.name} operates as a fully integrated knit-composite manufacturing complex. We take raw combed cotton yarn and execute knitting, state-of-the-art chemical and reactive dyeing, stenter compacting, and export garment production under one roof.
      </p>
      <p class="text-sm text-[#788A9C] leading-relaxed">
        Officially registered with the Bangladesh Garment Manufacturers and Exporters Association (BGMEA Reg. ${co.bgmeaRegistration}) and the Export Promotion Bureau (EPB Reg. ${co.epbRegistration}), Gumti Textiles serves premier fashion brands across Europe and North America with ~$27M annual export turnover.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p class="text-[10px] uppercase font-semibold text-[#788A9C]">Managing Director</p>
          <p class="text-xs font-bold text-white mt-1">${co.managingDirector}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p class="text-[10px] uppercase font-semibold text-[#788A9C]">Operation Model</p>
          <p class="text-xs font-bold text-[#00E599] mt-1">${co.factoryType}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p class="text-[10px] uppercase font-semibold text-[#788A9C]">BGMEA Reg.</p>
          <p class="text-xs font-mono font-bold text-white mt-1">${co.bgmeaRegistration}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p class="text-[10px] uppercase font-semibold text-[#788A9C]">Workforce</p>
          <p class="text-xs font-bold text-[#00D2FF] mt-1">1,600 (74% ♀)</p>
        </div>
      </div>
    </div>

  </div>
</section>

<!-- Timeline Journey -->
<section class="bg-[#060B10] py-16 lg:py-24 border-y border-white/[0.08]">
  <div class="max-w-[1000px] mx-auto px-5 lg:px-10">
    <div class="text-center mb-14">
      <span class="kicker-pill mb-3">Milestones</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">Three Decades of Growth</h2>
      <p class="text-xs sm:text-sm text-[#788A9C] mt-2">Continuous reinvestment into European machinery, clean energy, and social empowerment.</p>
    </div>

    <div class="relative border-l border-[#00E599]/30 ml-4 sm:ml-8 space-y-10">
      ${raw(co.timeline.map((t) => `
        <div class="relative pl-8 sm:pl-10 group">
          <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#060B10] border-2 border-[#00E599] group-hover:bg-[#00E599] transition-colors"></div>
          <span class="text-xs font-mono font-bold text-[#00E599] bg-[#00E599]/10 px-2.5 py-0.5 rounded border border-[#00E599]/20">${t.year}</span>
          <h3 class="text-lg font-bold font-display text-white mt-2">${t.title}</h3>
          <p class="text-xs sm:text-sm text-[#788A9C] mt-1.5 leading-relaxed max-w-xl">${t.text}</p>
        </div>`).join(''))}
    </div>
  </div>
</section>

<!-- Leadership Grid -->
<section class="bg-[#08111A] py-16 lg:py-24">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <span class="kicker-pill mb-3">Executive Team</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">Experienced Leadership</h2>
      <p class="text-xs sm:text-sm text-[#788A9C] mt-2">Seasoned textile engineers and garment professionals leading operations at Gumti.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${raw(co.leadership.map((lead) => `
        <div class="glass-card p-6 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-lg bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-base mb-4 font-bold">
              ${lead.name.split(' ').map((n) => n[0]).filter((c) => /[A-Za-z]/.test(c)).slice(0, 2).join('')}
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#00E599]">${lead.role}</p>
            <h3 class="text-base font-bold text-white font-display mt-1">${lead.name}</h3>
          </div>
          ${lead.email || lead.phone ? `
            <div class="mt-4 pt-3 border-t border-white/[0.06] text-xs text-[#788A9C] space-y-1">
              ${lead.email ? `<p class="truncate"><i class="fa-regular fa-envelope mr-1.5 text-[#00E599]"></i>${lead.email}</p>` : ''}
              ${lead.phone ? `<p><i class="fa-solid fa-phone mr-1.5 text-[#00D2FF]"></i>${lead.phone}</p>` : ''}
            </div>` : ''}
        </div>`).join(''))}
    </div>
  </div>
</section>

<!-- CTA Bar -->
<section class="bg-[#060B10] py-16 border-t border-white/[0.08]">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10 text-center">
    <h2 class="text-2xl sm:text-4xl font-bold font-display text-white">Partner with an Established Industry Leader</h2>
    <p class="text-xs sm:text-sm text-[#788A9C] mt-3">Discuss your technical requirements with our merchandising and production team.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a href="/request-quote" class="pill-btn-emerald">Request a Program Quote</a>
      <a href="/capabilities" class="pill-btn-outline">Explore Factory Capabilities</a>
    </div>
  </div>
</section>
`

// ============ CAPABILITIES PAGE ============
export const CapabilitiesPage = () => html`
${raw(PageHero('Factory Infrastructure', 'Six Integrated Stages.<br/><span class="text-gradient-emerald">One Certified Quality System.</span>', 'Our Gazipur knit composite plant synchronizes circular knitting, low-liquor dyeing, stenter finishing, and computerized sewing lines.'))}

<!-- 6 Stages -->
<section class="bg-[#08111A] py-14 lg:py-20 space-y-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 space-y-16">
    ${raw(manufacturingStages.map((s, i) => `
      <div id="${s.slug}" class="glass-panel p-6 sm:p-10 border border-white/[0.08] rounded-2xl">
        <div class="grid lg:grid-cols-12 gap-10 items-center">
          
          <!-- Image -->
          <div class="lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}">
            <div class="aspect-[4/3] rounded-xl overflow-hidden bg-[#0A131C] border border-white/[0.1] relative group">
              <img src="${(media as any)[s.image] || media.knitting}" alt="${s.name} stage" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#060B10]/80 backdrop-blur-md border border-white/[0.1] text-xs font-mono font-bold text-[#00E599]">
                STAGE ${s.num}
              </span>
            </div>
          </div>

          <!-- Specs & Content -->
          <div class="lg:col-span-6 ${i % 2 === 1 ? 'lg:order-1' : ''} space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-[#00E599]">${s.tagline}</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-display text-white">${s.name} Department</h2>
            <p class="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">${s.description}</p>
            
            <div class="pt-2">
              <p class="text-[10px] uppercase font-bold tracking-wider text-[#788A9C] mb-2">Quality & Process Controls</p>
              <div class="flex flex-wrap gap-1.5">
                ${s.checkpoints.map((c) => `<span class="px-2.5 py-1 rounded bg-[#00E599]/10 border border-[#00E599]/20 text-[11px] font-medium text-[#00E599]">${c}</span>`).join('')}
              </div>
            </div>

            <div class="pt-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <table class="w-full text-xs">
                <tbody class="divide-y divide-white/[0.04]">
                  ${s.specs.map((sp) => `
                    <tr>
                      <th scope="row" class="text-left py-2.5 px-4 text-[#788A9C] font-semibold text-[10px] uppercase tracking-wider w-40 whitespace-nowrap">${sp.label}</th>
                      <td class="py-2.5 px-4 text-white font-medium">${sp.value}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>

            <div class="pt-2">
              <a href="/request-quote" class="inline-flex items-center gap-2 text-xs font-bold text-[#00E599] hover:underline">
                Book Capacity for this Program <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          </div>

        </div>
      </div>`).join(''))}
  </div>
</section>
`

// ============ QUALITY & ETP PAGE ============
export const QualityPage = () => html`
${raw(PageHero('Quality Assurance & Compliance', 'Engineered Quality.<br/><span class="text-gradient-emerald">Zero Toxic Impact.</span>', 'Our quality system operates at every manufacturing threshold — from incoming combed yarn testing to AQL final audits and biological effluent treatment.'))}

<!-- Quality Steps Grid -->
<section class="bg-[#08111A] py-14 lg:py-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <span class="kicker-pill mb-3">Inspection Thresholds</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">6-Point Quality System</h2>
      <p class="text-xs sm:text-sm text-[#788A9C] mt-2">Continuous digital monitoring and physical lab verification at every single transformation.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${raw([
        ['01', 'Raw Material & Yarn', 'Incoming yarn strength, twist count, and lot continuity are tested before circular knitting allocation.', 'fa-box-open'],
        ['02', 'Knitting & Greige Fabric', 'Full-feeder Lycra control, weight consistency, and four-point greige inspection tables.', 'fa-layer-group'],
        ['03', 'Spectrophotometer Color Lab', 'X-Rite 850 spectrophotometer computerized recipe matching with 60 lab dips per day capacity.', 'fa-droplet'],
        ['04', 'Finishing & Compacting', 'Bruckner & Ehwha stenters ensure dimensional stability, torque control, and minimal shrinkage.', 'fa-wand-magic-sparkles'],
        ['05', 'In-Line Sewing Quality', 'Dedicated roving QCs monitor needle holes, stitch density (SPI), and tension across 22 lines.', 'fa-shirt'],
        ['06', 'AQL Pre-Shipment Audit', 'Final AQL 1.5/2.5 pre-shipment inspection with metal detection before export packing.', 'fa-clipboard-check'],
      ].map(([num, t, d, icon]) => `
        <div class="glass-card p-6 border border-white/[0.08] space-y-3">
          <div class="flex items-center justify-between">
            <span class="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-base"><i class="fa-solid ${icon}"></i></span>
            <span class="text-xs font-mono font-bold text-[#788A9C]">${num}</span>
          </div>
          <h3 class="text-base font-bold font-display text-white mt-2">${t}</h3>
          <p class="text-xs text-[#788A9C] leading-relaxed">${d}</p>
        </div>`).join(''))}
    </div>
  </div>
</section>

<!-- Certifications -->
<section id="certifications" class="bg-[#060B10] py-16 lg:py-24 border-y border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <span class="kicker-pill mb-3">Global Accreditations</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold font-display text-white">Compliance & Membership</h2>
      <p class="text-xs sm:text-sm text-[#788A9C] mt-2">Verified memberships ensuring ethical trade, responsible cotton sourcing, and non-toxic materials.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${raw(co.certifications.map((c) => `
        <div class="glass-card p-6 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xl font-extrabold font-display text-white">${c.code}</span>
              <span class="px-2 py-0.5 rounded-full bg-[#00E599]/15 text-[#00E599] text-[10px] font-bold border border-[#00E599]/30">Verified</span>
            </div>
            <p class="text-xs font-bold text-[#CBD5E1]">${c.name}</p>
            <p class="text-xs text-[#788A9C] mt-2 leading-relaxed">${c.description}</p>
          </div>
          <div class="mt-5 pt-3 border-t border-white/[0.06] text-[11px] text-[#00E599]">
            <i class="fa-solid fa-circle-check mr-1.5"></i> ${c.scope}
          </div>
        </div>`).join(''))}
    </div>
  </div>
</section>
`

// ============ SUSTAINABILITY PAGE ============
export const SustainabilityPage = () => html`
${raw(PageHero('Responsible Manufacturing', 'Clean Water. Clean Power.<br/><span class="text-gradient-emerald">Zero Toxic Effluent.</span>', 'Gumti Textiles operates a dedicated biological Effluent Treatment Plant (ETP), captive LPG energy station, and dual jute boilers to minimize ecological footprint.'))}

<section class="bg-[#08111A] py-14 lg:py-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      ${raw([
        ['Biological ETP', 'fa-water', 'On-site effluent treatment plant biologically treats 100% of dyehouse discharge before safe release into the environment.'],
        ['Captive LPG Station', 'fa-fire-flame-curved', 'Independent clean-burning LPG fueling station ensures continuous, low-emission power across all production bays.'],
        ['Twin-Jute Boilers', 'fa-leaf', 'Sustainable biomass steam generation utilizing natural jute fibers, lowering dependence on fossil fuels.'],
        ['Low Liquor Ratio Dyeing', 'fa-droplet', 'Sclavos Athena soft-flow vessels reduce water consumption by up to 40% compared to conventional beck dyeing.'],
        ['Worker Welfare & Clinic', 'fa-heart-pulse', 'Full-time doctor and nurse on staff with free medicines and regular health screening for all 1,600 employees.'],
        ['Childcare & Nursery', 'fa-baby', 'Safe on-site daycare center supporting our 74% female workforce with trained attendants.'],
        ['Fire & Life Safety', 'fa-shield-halved', 'Addressable alarm systems, certified fire hydrants, automatic dampers, and bi-monthly evacuation training.'],
        ['Organic & BCI Cotton', 'fa-seedling', 'Traceable sourcing routes for GOTS organic cotton and Better Cotton Initiative (BCI) bulk programs.'],
      ].map(([t, icon, d]) => `
        <div class="glass-card p-6 border border-white/[0.08] space-y-3">
          <span class="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-base"><i class="fa-solid ${icon}"></i></span>
          <h3 class="text-base font-bold font-display text-white mt-2">${t}</h3>
          <p class="text-xs text-[#788A9C] leading-relaxed">${d}</p>
        </div>`).join(''))}
    </div>
  </div>
</section>
`

// ============ GLOBAL REACH PAGE ============
export const GlobalReachPage = () => html`
${raw(PageHero('International Markets', 'Made in Bangladesh.<br/><span class="text-gradient-emerald">Delivered Globally.</span>', 'Operating under EPB Registration ' + co.epbRegistration + ' and BGMEA Membership ' + co.bgmeaRegistration + ', Gumti exports over $27M in premium apparel annually.'))}

<section class="bg-[#08111A] py-14 lg:py-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
    
    <!-- Stylized Cyber World Map -->
    <div class="lg:col-span-7">
      <div class="glass-panel p-6 border border-white/[0.08] rounded-2xl relative overflow-hidden">
        <svg viewBox="0 0 1000 480" class="w-full h-auto" role="img" aria-label="Global export network from Bangladesh">
          <rect width="1000" height="480" fill="#070E16" rx="12"/>
          <g fill="#101D2B">
            <ellipse cx="200" cy="160" rx="130" ry="85"/>
            <ellipse cx="260" cy="330" rx="80" ry="100"/>
            <ellipse cx="500" cy="140" rx="90" ry="60"/>
            <ellipse cx="520" cy="300" rx="70" ry="90"/>
            <ellipse cx="700" cy="200" rx="140" ry="100"/>
            <ellipse cx="840" cy="360" rx="60" ry="40"/>
          </g>
          <!-- Bangladesh Origin Pin -->
          <circle cx="712" cy="215" r="8" fill="#00E599"><animate attributeName="r" values="8;13;8" dur="2s" repeatCount="indefinite"/></circle>
          <circle cx="712" cy="215" r="22" fill="none" stroke="#00E599" stroke-width="1.5" opacity="0.6"><animate attributeName="r" values="12;36" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite"/></circle>
          <text x="712" y="250" fill="#00E599" font-size="14" font-weight="bold" text-anchor="middle" font-family="system-ui">BANGLADESH HUB</text>
          
          <!-- Route Arcs -->
          <g stroke="#00E599" stroke-width="1.5" fill="none" opacity="0.6" stroke-dasharray="6 6">
            <path d="M712 215 Q 500 60 230 140"/>
            <path d="M712 215 Q 620 100 505 135"/>
            <path d="M712 215 Q 640 300 520 300"/>
            <path d="M712 215 Q 800 300 840 350"/>
            <path d="M712 215 Q 480 320 280 330"/>
          </g>
        </svg>
      </div>
    </div>

    <!-- Export Facts -->
    <div class="lg:col-span-5 space-y-6">
      <span class="kicker-pill">Direct Export Routes</span>
      <h2 class="text-2xl sm:text-3xl font-extrabold font-display text-white">Full Container Logistics & Sea Freight</h2>
      <p class="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
        Strategically located in Gazipur with direct transit access to Chittagong Seaport and Hazrat Shahjalal International Airport (DAC) for air expedited programs.
      </p>

      <div class="space-y-3 pt-2">
        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <span class="text-xs text-[#788A9C]">Export Promotion Bureau</span>
          <span class="text-xs font-mono font-bold text-white">Reg. ${co.epbRegistration}</span>
        </div>
        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <span class="text-xs text-[#788A9C]">Annual Turnover</span>
          <span class="text-xs font-bold text-[#00E599]">~$27 Million USD</span>
        </div>
        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <span class="text-xs text-[#788A9C]">Key Partner Brands</span>
          <span class="text-xs font-bold text-white">Norma · Smart Blanks · Suncity · TXM</span>
        </div>
      </div>

      <div class="pt-2">
        <a href="/request-quote" class="pill-btn-emerald">
          <span>Inquire for Your Region</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
      </div>
    </div>

  </div>
</section>
`

// ============ FACILITIES PAGE ============
export const FacilitiesPage = () => html`
${raw(PageHero('Factory Locations', 'Manufacturing Complex.<br/><span class="text-gradient-emerald">Strategic Logistics.</span>', 'Our knit composite facility in Chandra, Gazipur and corporate head office in Dhaka.'))}

<section class="bg-[#08111A] py-14 lg:py-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-8">
    
    <!-- Gazipur Facility -->
    <div class="glass-card p-6 sm:p-8 border border-white/[0.08] space-y-5">
      <div class="aspect-[16/9] rounded-xl overflow-hidden bg-[#0A131C] border border-white/[0.06]">
        <img src="${media.knitting2}" alt="Gazipur Plant" class="w-full h-full object-cover" loading="lazy" />
      </div>
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-[#00E599]">Main Production Facility</span>
        <h2 class="text-2xl font-bold font-display text-white mt-1">Chandra Factory, Gazipur</h2>
        <address class="not-italic text-xs sm:text-sm text-[#788A9C] mt-2 leading-relaxed">
          ${co.factoryAddress.line1}<br/>${co.factoryAddress.line2}<br/>${co.factoryAddress.line3}
        </address>
        <p class="text-xs text-[#CBD5E1] mt-3 leading-relaxed">
          Houses our 50T/day dyeing floor, 10T/day circular knitting hall, 80T/day stenter finishing, and 22 modern garment assembly lines.
        </p>
      </div>
      <a href="${co.factoryAddress.mapUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs font-bold text-[#00E599] hover:underline">
        <i class="fa-solid fa-map-location-dot"></i> View on Google Maps
      </a>
    </div>

    <!-- Dhaka Office -->
    <div class="glass-card p-6 sm:p-8 border border-white/[0.08] space-y-5">
      <div class="aspect-[16/9] rounded-xl overflow-hidden bg-[#0A131C] border border-white/[0.06] flex items-center justify-center p-8">
        <div class="text-center">
          <div class="w-14 h-14 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-2xl mx-auto mb-3">
            <i class="fa-regular fa-building"></i>
          </div>
          <p class="text-xs font-bold text-white">Baridhara DOHS Commercial Suite</p>
          <p class="text-[11px] text-[#788A9C] mt-1">Corporate, Sourcing & International Accounts</p>
        </div>
      </div>
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-[#00D2FF]">Corporate Headquarters</span>
        <h2 class="text-2xl font-bold font-display text-white mt-1">Dhaka Head Office</h2>
        <address class="not-italic text-xs sm:text-sm text-[#788A9C] mt-2 leading-relaxed">
          ${co.headOffice.line1}<br/>${co.headOffice.line2}<br/>${co.headOffice.line3}
        </address>
        <p class="text-xs text-[#CBD5E1] mt-3 leading-relaxed">
          Handles buyer merchandising, lab dip approvals, shipping documentation, and commercial correspondence.
        </p>
      </div>
      <a href="${co.headOffice.mapUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs font-bold text-[#00D2FF] hover:underline">
        <i class="fa-solid fa-map-location-dot"></i> View on Google Maps
      </a>
    </div>

  </div>
</section>
`
