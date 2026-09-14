import { html, raw } from 'hono/html'
import { products, categories, filterProducts, type Product } from '../data/products'

export function productCardHtml(p: Product): string {
  return `
  <article class="editorial-card flex flex-col group overflow-hidden">
    <a href="/products/${p.slug}" class="block overflow-hidden aspect-[4/3] relative bg-[var(--bg-surface)]">
      <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#060B10]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-semibold text-[#00E599]">
        ${p.code}
      </span>
      <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[var(--bg-canvas)]/90 backdrop-blur-md border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
        ${p.category}
      </span>
    </a>

    <div class="p-5 flex flex-col flex-1">
      <a href="/products/${p.slug}" class="text-base font-bold font-display text-[var(--text-primary)] group-hover:text-[#00E599] transition-colors line-clamp-1">
        ${p.name}
      </a>
      
      <p class="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
        ${p.description}
      </p>

      <div class="mt-4 grid grid-cols-2 gap-2 text-xs py-3 border-y border-[var(--border-subtle)] bg-[var(--bg-input)]/50 rounded-xl px-3">
        <div>
          <span class="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Construction</span>
          <span class="text-[var(--text-primary)] font-medium truncate block mt-0.5">${p.construction}</span>
        </div>
        <div>
          <span class="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Weight</span>
          <span class="text-[#00E599] font-mono font-bold block mt-0.5">${p.gsm} GSM</span>
        </div>
        <div>
          <span class="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Yarn</span>
          <span class="text-[var(--text-secondary)] truncate block mt-0.5">${p.composition}</span>
        </div>
        <div>
          <span class="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Finish</span>
          <span class="text-[var(--text-secondary)] truncate block mt-0.5">${p.finish}</span>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-1">
        ${p.certifications.map((c) => `<span class="text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)]">${c}</span>`).join('')}
      </div>

      <div class="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] mt-4">
        <label class="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] cursor-pointer">
          <input type="checkbox" value="${p.slug}" class="product-compare-checkbox rounded text-[#00E599]" />
          <span>Compare</span>
        </label>
        
        <div class="flex items-center gap-2">
          <a href="/products/${p.slug}" class="text-xs font-semibold text-[var(--text-primary)] hover:text-[#00E599]">
            Datasheet
          </a>
          <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="pill-btn-emerald py-1 px-3 text-[11px]">
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
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Technical Textile Catalog</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.06] text-[var(--text-primary)]">
      Export Knitwear <span class="text-[#00E599]">Programs</span>
    </h1>
    <p class="mt-3 max-w-2xl text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
      Sourcing specifications engineered across 22 integrated sewing lines with 50T/day low-liquor dyeing and 10T/day circular knitting.
    </p>
  </div>
</section>

<!-- Filter & Grid -->
<section class="bg-[var(--bg-canvas)] py-12 lg:py-16 min-h-[65vh] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    
    <!-- Filter Bar -->
    <form id="product-filters" class="editorial-card p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8" role="search" aria-label="Product filters">
      <div class="lg:col-span-2">
        <label class="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" for="f-search">Search Sourcing DB</label>
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]"></i>
          <input id="f-search" name="search" type="search" class="w-full rounded-xl p-2.5 pl-9 text-xs" placeholder="Search polo, hoodie, jersey, GSM, code..." value="${q.search || ''}" />
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" for="f-category">Category</label>
        <select id="f-category" name="category" class="w-full rounded-xl p-2.5 text-xs">
          <option value="">All Categories</option>
          ${raw(categories.map((c) => `<option value="${c.toLowerCase().replace(/[^a-z]/g, '')}" ${q.category === c.toLowerCase().replace(/[^a-z]/g, '') ? 'selected' : ''}>${c}</option>`).join(''))}
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" for="f-comp">Composition</label>
        <select id="f-comp" name="composition" class="w-full rounded-xl p-2.5 text-xs">
          <option value="">All Blends</option>
          <option value="100% Cotton" ${q.composition === '100% Cotton' ? 'selected' : ''}>100% Cotton</option>
          <option value="Poly" ${q.composition === 'Poly' ? 'selected' : ''}>Cotton/Poly Blends</option>
          <option value="Elastane" ${q.composition === 'Elastane' ? 'selected' : ''}>Elastane / Spandex</option>
        </select>
      </div>
      <div class="flex items-end">
        <button type="submit" class="pill-btn-emerald w-full py-2.5 text-xs">
          <span>Apply Filters</span>
        </button>
      </div>
    </form>

    <!-- Product Grid -->
    <div id="product-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${raw(list.length ? list.map(productCardHtml).join('') : `
        <div class="col-span-full editorial-card p-16 text-center space-y-3">
          <i class="fa-solid fa-shirt text-3xl text-[var(--text-muted)]"></i>
          <h3 class="text-xl font-bold font-display text-[var(--text-primary)]">No products match those criteria</h3>
          <p class="text-xs text-[var(--text-muted)] max-w-sm mx-auto">Try clearing search filters or consult our sales team for custom knitwear development.</p>
          <a href="/contact" class="pill-btn-outline text-xs mt-3">Contact Merchandiser</a>
        </div>
      `)}
    </div>

    <!-- Floating Comparison Bar -->
    <aside id="compare-drawer" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden items-center gap-4 px-6 py-3 rounded-full bg-[var(--bg-surface)] border border-[#00E599]/40 shadow-2xl text-xs backdrop-blur-xl">
      <span class="text-[var(--text-primary)] font-bold"><span id="compare-count" class="text-[#00E599]">0</span> Products Selected</span>
      <a id="compare-link" href="/products/compare" class="pill-btn-emerald py-1.5 px-4 text-xs">Compare Specs</a>
      <button id="compare-clear" type="button" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] underline">Clear</button>
    </aside>

  </div>
</section>
`
}

// ============ PRODUCT DETAIL (TECHNICAL TEXTILE DATASHEET) ============
export const ProductDetailPage = (p: Product) => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
      <a href="/products" class="hover:text-[var(--text-primary)]">Catalog</a>
      <span>/</span>
      <span>${p.category}</span>
      <span>/</span>
      <span class="text-[var(--text-primary)] font-medium">${p.name}</span>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <span class="kicker-pill mb-2">${p.code} · ${p.category}</span>
        <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
          ${p.name}
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <a href="/api/products/${p.slug}/spec" class="pill-btn-outline text-xs">
          <i class="fa-solid fa-download mr-1.5 text-[10px]"></i>
          <span>Download Spec Sheet</span>
        </a>
        <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="pill-btn-emerald text-xs">
          <span>Request Quote</span>
          <i class="fa-solid fa-arrow-right text-[10px] ml-1"></i>
        </a>
      </div>
    </div>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-12 lg:py-20 transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid lg:grid-cols-12 gap-12">
      
      <!-- Visual Column -->
      <div class="lg:col-span-6 space-y-6">
        <div class="editorial-card overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-full h-[450px] object-cover" />
        </div>
        <div class="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Program Description</span>
          <p class="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">${p.description}</p>
          <p class="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">${p.specNote}</p>
        </div>
      </div>

      <!-- Technical Parameters Column -->
      <div class="lg:col-span-6 space-y-6">
        <div class="editorial-card overflow-hidden">
          <div class="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h3 class="text-base font-bold font-display text-[var(--text-primary)]">Technical Specification Parameters</h3>
            <span class="text-xs font-mono text-[#00E599] font-bold">ISO-Compliant</span>
          </div>

          <table class="spec-table">
            <tbody>
              <tr>
                <td class="w-1/3 font-bold text-[var(--text-muted)]">Fabrication Code</td>
                <td class="font-mono font-bold text-[#00E599]">${p.code}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Construction</td>
                <td class="font-medium text-[var(--text-primary)]">${p.construction}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Yarn Composition</td>
                <td>${p.composition}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Target GSM</td>
                <td class="font-mono font-bold">${p.gsm} GSM (±5% Tolerance)</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Finish Type</td>
                <td>${p.finish}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Color Range</td>
                <td>${p.colors.join(', ')}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">End-Use Application</td>
                <td>${p.application}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Minimum Order (MOQ)</td>
                <td>${p.moq}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Standard Lead Time</td>
                <td>${p.leadTime}</td>
              </tr>
              <tr>
                <td class="font-bold text-[var(--text-muted)]">Certifications</td>
                <td>
                  <div class="flex flex-wrap gap-1.5">
                    ${p.certifications.map((c) => `<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-input)] text-[#00E599] border border-[var(--border-subtle)]">${c}</span>`).join('')}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <a href="/request-sample?product=${encodeURIComponent(p.name)}" class="pill-btn-outline py-3 text-xs text-center">
            <span>Request Swatch Sample</span>
          </a>
          <a href="/request-quote?product=${encodeURIComponent(p.name)}&gsm=${p.gsm}&composition=${encodeURIComponent(p.composition)}" class="pill-btn-emerald py-3 text-xs text-center">
            <span>Book Capacity for ${p.code}</span>
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
`

// ============ PRODUCT COMPARE ============
export const ComparePage = (items: string[]) => {
  const selected = products.filter((p) => items.includes(p.slug))
  return html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Specification Comparison</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">
      Compare <span class="text-[#00E599]">Knitwear Specs</span>
    </h1>
    <p class="mt-2 text-xs sm:text-sm text-[var(--text-muted)]">Side-by-side technical evaluation for sourcing managers.</p>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-12 lg:py-20 min-h-[60vh] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 overflow-x-auto">
    ${selected.length === 0 ? html`
      <div class="editorial-card p-16 text-center space-y-4 max-w-lg mx-auto">
        <i class="fa-solid fa-scale-balanced text-3xl text-[var(--text-muted)]"></i>
        <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">No products selected for comparison</h3>
        <p class="text-xs text-[var(--text-muted)]">Check the "Compare" box on any product in our catalog to evaluate specifications side-by-side.</p>
        <a href="/products" class="pill-btn-emerald text-xs mt-2">Browse Catalog</a>
      </div>
    ` : html`
      <div class="editorial-card overflow-hidden">
        <table class="spec-table">
          <thead>
            <tr>
              <th class="w-1/4">Specification</th>
              ${selected.map((p) => html`
                <th class="w-1/3">
                  <div class="space-y-1">
                    <span class="text-base font-bold text-[var(--text-primary)] block">${p.name}</span>
                    <span class="text-[10px] font-mono text-[#00E599]">${p.code}</span>
                  </div>
                </th>
              `)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Category</td>
              ${selected.map((p) => html`<td class="font-semibold">${p.category}</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Weight (GSM)</td>
              ${selected.map((p) => html`<td class="font-mono font-bold text-[#00E599]">${p.gsm} GSM</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Construction</td>
              ${selected.map((p) => html`<td>${p.construction}</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Composition</td>
              ${selected.map((p) => html`<td>${p.composition}</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Finish</td>
              ${selected.map((p) => html`<td>${p.finish}</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Standard MOQ</td>
              ${selected.map((p) => html`<td>${p.moq}</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Production Lead Time</td>
              ${selected.map((p) => html`<td>${p.leadTime}</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Certifications</td>
              ${selected.map((p) => html`<td>${p.certifications.join(' · ')}</td>`)}
            </tr>
            <tr>
              <td class="font-bold text-[var(--text-muted)]">Commercial Action</td>
              ${selected.map((p) => html`
                <td>
                  <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="pill-btn-emerald py-1.5 px-4 text-xs">
                    Quote
                  </a>
                </td>
              `)}
            </tr>
          </tbody>
        </table>
      </div>
    `}
  </div>
</section>
`
}

