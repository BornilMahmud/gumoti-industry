import { html, raw } from 'hono/html'
import { products, categories, filterProducts, type Product } from '../data/products'

export function productCardHtml(p: Product): string {
  return `
  <article class="glass-card flex flex-col group overflow-hidden border border-white/[0.08] hover:border-[#00E599]/40 transition-all duration-300">
    <a href="/products/${p.slug}" class="block overflow-hidden aspect-[4/3] relative bg-[#09111A]">
      <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#060B10]/80 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono font-semibold text-[#00E599]">
        ${p.code}
      </span>
      <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[10px] font-bold text-[#00E599] uppercase tracking-wider">
        ${p.category}
      </span>
    </a>

    <div class="p-5 flex flex-col flex-1">
      <a href="/products/${p.slug}" class="text-base sm:text-lg font-bold font-display text-white group-hover:text-[#00E599] transition-colors line-clamp-1">
        ${p.name}
      </a>
      
      <p class="text-xs text-[#788A9C] mt-2 line-clamp-2 leading-relaxed">
        ${p.description}
      </p>

      <dl class="mt-4 grid grid-cols-2 gap-2 text-xs py-3 border-y border-white/[0.06] bg-white/[0.01] rounded-lg px-2">
        <div>
          <dt class="text-[10px] uppercase font-semibold text-[#788A9C]">Fabric</dt>
          <dd class="text-[#CBD5E1] font-medium truncate mt-0.5">${p.construction}</dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase font-semibold text-[#788A9C]">Weight</dt>
          <dd class="text-[#00E599] font-mono font-medium mt-0.5">${p.gsm} GSM</dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase font-semibold text-[#788A9C]">Composition</dt>
          <dd class="text-[#CBD5E1] font-medium truncate mt-0.5">${p.composition}</dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase font-semibold text-[#788A9C]">Finish</dt>
          <dd class="text-[#CBD5E1] font-medium truncate mt-0.5">${p.finish}</dd>
        </div>
      </dl>

      <div class="mt-3 flex flex-wrap gap-1.5">
        ${p.certifications.map((c) => `<span class="text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08]">${c}</span>`).join('')}
      </div>

      <div class="mt-auto pt-5 flex items-center justify-between gap-3">
        <a href="/products/${p.slug}" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E599] hover:underline">
          Specifications <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
        <div class="flex items-center gap-2">
          <button data-compare="${p.slug}" class="px-2.5 py-1 rounded-lg border border-white/[0.12] text-[10px] font-semibold text-[#CBD5E1] hover:border-[#00E599] hover:text-white transition-colors cursor-pointer">
            <span>Compare</span>
          </button>
          <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="px-3 py-1 rounded-lg bg-[#00E599] text-[#060B10] text-[11px] font-bold hover:bg-[#00D2FF] transition-colors">
            Quote
          </a>
        </div>
      </div>
    </div>
  </article>`
}

export const ProductsPage = (q: Record<string, string>) => {
  const list = filterProducts(q)
  return html`
<!-- Header -->
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Export Apparel Catalog</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[56px] font-extrabold font-display leading-[1.06] text-white">
      Knitwear Programs <span class="text-gradient-emerald">for Global Brands</span>
    </h1>
    <p class="mt-3 max-w-2xl text-[#788A9C] text-sm sm:text-base leading-relaxed">
      Engineered across 22 integrated sewing lines with 50T/day low-liquor dyeing and 10T/day circular knitting. Certified to international compliance standards.
    </p>
  </div>
</section>

<!-- Filter & Grid -->
<section class="bg-[#08111A] py-12 lg:py-16 min-h-[60vh]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    
    <!-- Filter Bar -->
    <form id="product-filters" class="glass-panel p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 border border-white/[0.08]" role="search" aria-label="Product filters">
      <div class="lg:col-span-2">
        <label class="field-label-dark" for="f-search">Search Catalog</label>
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
          <input id="f-search" name="search" type="search" class="field-dark pl-9" placeholder="Search polo, fleece, jersey, code..." value="${q.search || ''}" />
        </div>
      </div>
      <div>
        <label class="field-label-dark" for="f-category">Category</label>
        <select id="f-category" name="category" class="field-dark">
          <option value="">All Categories</option>
          ${raw(categories.map((c) => `<option value="${c.toLowerCase().replace(/[^a-z]/g, '')}" ${q.category === c.toLowerCase().replace(/[^a-z]/g, '') ? 'selected' : ''}>${c}</option>`).join(''))}
        </select>
      </div>
      <div>
        <label class="field-label-dark" for="f-composition">Composition</label>
        <select id="f-composition" name="composition" class="field-dark">
          <option value="">Any Composition</option>
          ${raw(['Cotton', 'Organic', 'Polyester', 'Elastane'].map((c) => `<option value="${c.toLowerCase()}" ${q.composition === c.toLowerCase() ? 'selected' : ''}>${c}</option>`).join(''))}
        </select>
      </div>
      <div>
        <label class="field-label-dark" for="f-cert">Certification</label>
        <select id="f-cert" name="certification" class="field-dark">
          <option value="">Any Standard</option>
          ${raw(['OEKO-TEX', 'GOTS', 'BCI'].map((c) => `<option value="${c.toLowerCase()}" ${q.certification === c.toLowerCase() ? 'selected' : ''}>${c}</option>`).join(''))}
        </select>
      </div>
    </form>

    <div class="mt-8 flex items-center justify-between">
      <p id="product-count" class="text-xs font-mono font-semibold uppercase tracking-wider text-[#00E599]">${list.length} Program${list.length === 1 ? '' : 's'} Available</p>
      <p class="text-[11px] uppercase tracking-wider text-[#788A9C] hidden sm:block">Select up to 3 programs to compare side-by-side</p>
    </div>

    <div id="product-grid" class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${raw(list.length ? list.map(productCardHtml).join('') : `
        <div class="col-span-full glass-panel p-16 text-center border border-dashed border-white/[0.15]">
          <i class="fa-solid fa-box-open text-4xl text-[#788A9C]"></i>
          <p class="mt-4 text-xl font-bold font-display text-white">No products match those criteria</p>
          <p class="text-xs text-[#788A9C] mt-2">Try clearing a filter, or submit a custom development request to our merchandising team.</p>
          <a href="/request-quote" class="mt-6 inline-block pill-btn-emerald text-xs">Custom Program Request</a>
        </div>`)}
    </div>
  </div>
</section>

<!-- Floating Compare Bar -->
<div id="compare-bar" class="hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0C1622]/95 backdrop-blur-xl text-white shadow-2xl px-6 py-3.5 rounded-full flex items-center gap-5 border border-[#00E599]/40">
  <p class="text-xs text-[#CBD5E1]"><span id="compare-count" class="font-bold text-[#00E599] font-mono">0</span> programs selected</p>
  <a id="compare-link" href="/products/compare" class="pill-btn-emerald py-1.5 px-4 text-xs">Compare Now</a>
  <button id="compare-clear" class="text-xs text-[#788A9C] hover:text-white cursor-pointer" aria-label="Clear comparison">Clear</button>
</div>
`
}

export const ProductDetailPage = (p: Product) => html`
<!-- Header & Breadcrumb -->
<section class="relative bg-[#060B10] pt-32 pb-10 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <nav class="text-xs tracking-wider uppercase text-[#788A9C] flex items-center gap-2" aria-label="Breadcrumb">
      <a href="/products" class="hover:text-[#00E599] transition-colors">Catalog</a>
      <span>/</span>
      <a href="/products?category=${p.category.toLowerCase().replace(/[^a-z]/g, '')}" class="hover:text-[#00E599] transition-colors">${p.category}</a>
      <span>/</span>
      <span class="text-[#00E599] font-medium">${p.name}</span>
    </nav>
  </div>
</section>

<!-- Product Detail Body -->
<section class="bg-[#08111A] py-14 lg:py-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
    
    <!-- Left Photo Column -->
    <div class="lg:col-span-6 space-y-4">
      <div class="glass-panel p-3 border border-white/[0.1] overflow-hidden rounded-2xl">
        <img src="${p.image}" alt="${p.name}" class="w-full aspect-[4/3] object-cover rounded-xl" />
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
          <p class="text-[10px] text-[#788A9C] uppercase font-semibold">Program Code</p>
          <p class="text-xs font-mono font-bold text-white mt-1">${p.code}</p>
        </div>
        <div class="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
          <p class="text-[10px] text-[#788A9C] uppercase font-semibold">Lead Capacity</p>
          <p class="text-xs font-bold text-[#00E599] mt-1">35k Pcs/Day</p>
        </div>
        <div class="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
          <p class="text-[10px] text-[#788A9C] uppercase font-semibold">Quality Test</p>
          <p class="text-xs font-bold text-[#00D2FF] mt-1">100% Inspected</p>
        </div>
      </div>
    </div>

    <!-- Right Specs Column -->
    <div class="lg:col-span-6 space-y-6">
      <div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-xs font-bold text-[#00E599] uppercase tracking-wider">${p.category}</span>
          <span class="text-xs font-mono text-[#788A9C]">${p.code}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3">${p.name}</h1>
        <p class="mt-4 text-sm text-[#CBD5E1] leading-relaxed">${p.description}</p>
      </div>

      <!-- Specs Table -->
      <div class="glass-panel overflow-hidden border border-white/[0.08] rounded-xl">
        <div class="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-white">Technical Specifications</span>
          <span class="text-[10px] text-[#00E599] font-mono">Verified Program</span>
        </div>
        <table class="w-full text-xs">
          <tbody class="divide-y divide-white/[0.04]">
            ${raw([
              ['Fabric Construction', p.construction],
              ['Fiber Composition', p.composition],
              ['Fabric Weight (GSM)', `${p.gsm} GSM`],
              ['Surface Finish', p.finish],
              ['Standard Colorways', p.colors.join(', ')],
              ['Intended Application', p.application],
              ['Certifications', p.certifications.join(' · ')],
              ['Order Minimum (MOQ)', p.moq],
              ['Production Lead Time', p.leadTime],
            ].map(([k, v]) => `
              <tr>
                <th scope="row" class="text-left py-3 px-5 text-[#788A9C] font-medium uppercase tracking-wider text-[10px] w-40 whitespace-nowrap bg-white/[0.01]">${k}</th>
                <td class="py-3 px-5 text-white font-medium">${v}</td>
              </tr>`).join(''))}
          </tbody>
        </table>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex flex-wrap gap-3">
        <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="pill-btn-emerald">
          <span>Request Program Quote</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
        <a href="/request-sample?product=${encodeURIComponent(p.name)}" class="pill-btn-outline">
          <span>Request Sample</span>
        </a>
        <a href="/api/products/${p.slug}/spec" class="px-5 py-3 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-bold text-[#CBD5E1] hover:text-white hover:border-white/20 transition-colors inline-flex items-center gap-2" download="${p.code}-spec.txt">
          <i class="fa-solid fa-download text-xs text-[#00E599]"></i>
          <span>Download Spec</span>
        </a>
      </div>
    </div>

  </div>

  <!-- Related Products -->
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 mt-20 pt-12 border-t border-white/[0.08]">
    <div class="flex items-center justify-between mb-8">
      <div>
        <span class="kicker-pill mb-2">Complementary Lines</span>
        <h2 class="text-2xl sm:text-3xl font-bold font-display text-white">Related Export Programs</h2>
      </div>
      <a href="/products" class="text-xs font-bold text-[#00E599] hover:underline flex items-center gap-1.5">
        View All <i class="fa-solid fa-arrow-right text-[10px]"></i>
      </a>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${raw(products.filter((x) => x.slug !== p.slug).slice(0, 3).map(productCardHtml).join(''))}
    </div>
  </div>
</section>
`

export const ComparePage = (slugs: string[]) => {
  const items = slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as Product[]
  const rows: [string, (p: Product) => string][] = [
    ['Category', (p) => p.category],
    ['Construction', (p) => p.construction],
    ['Composition', (p) => p.composition],
    ['GSM', (p) => `${p.gsm} GSM`],
    ['Finish', (p) => p.finish],
    ['Certifications', (p) => p.certifications.join(', ')],
    ['Application', (p) => p.application],
    ['MOQ', (p) => p.moq],
    ['Lead Time', (p) => p.leadTime],
  ]
  return html`
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Technical Evaluation</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white">Program Comparison</h1>
    <p class="mt-3 text-[#788A9C] text-sm">Compare technical fabrications, yarn blends, and certifications side-by-side.</p>
  </div>
</section>

<section class="bg-[#08111A] py-14 lg:py-20 min-h-[60vh]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    ${items.length === 0 ? raw(`
      <div class="glass-panel border border-dashed border-white/[0.15] p-16 text-center max-w-xl mx-auto rounded-2xl">
        <i class="fa-solid fa-scale-balanced text-4xl text-[#788A9C]"></i>
        <p class="text-xl font-bold font-display text-white mt-4">No programs selected</p>
        <p class="text-xs text-[#788A9C] mt-2">Select up to 3 programs from our export catalog to evaluate specs side by side.</p>
        <a href="/products" class="mt-6 inline-block pill-btn-emerald text-xs">Browse Export Catalog</a>
      </div>`) : raw(`
      <div class="glass-panel overflow-x-auto border border-white/[0.08] rounded-2xl shadow-2xl">
        <table class="w-full text-xs min-w-[700px]">
          <caption class="sr-only">Side-by-side product comparison</caption>
          <thead>
            <tr class="border-b border-white/[0.08] bg-white/[0.02]">
              <th class="p-6 text-left text-[11px] uppercase tracking-wider text-[#788A9C] font-semibold w-48 align-bottom">Specification</th>
              ${items.map((p) => `
                <th class="p-6 text-left align-bottom">
                  <div class="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#0A131C] border border-white/[0.06]">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <a href="/products/${p.slug}" class="text-base font-bold text-white hover:text-[#00E599] transition-colors">${p.name}</a>
                  <p class="text-[10px] font-mono text-[#00E599] mt-1 font-medium">${p.code}</p>
                </th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-white/[0.04]">
            ${rows.map(([label, fn]) => `
              <tr class="hover:bg-white/[0.01]">
                <th scope="row" class="p-5 text-left text-[10px] uppercase tracking-wider text-[#788A9C] font-semibold bg-white/[0.01] align-top">${label}</th>
                ${items.map((p) => `<td class="p-5 text-[#CBD5E1] align-top font-medium">${fn(p)}</td>`).join('')}
              </tr>`).join('')}
            <tr>
              <td class="p-6"></td>
              ${items.map((p) => `
                <td class="p-6">
                  <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="pill-btn-emerald py-2 px-5 text-xs w-full text-center">
                    Request Quote
                  </a>
                </td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>`)}
  </div>
</section>`
}
