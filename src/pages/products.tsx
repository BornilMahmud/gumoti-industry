import { html, raw } from 'hono/html'
import { products, categories, filterProducts, type Product } from '../data/products'

export function productCardHtml(p: Product): string {
  return `
  <article class="product-card bg-white border border-sand/40 flex flex-col" data-cursor="EXPLORE">
    <a href="/products/${p.slug}" class="block overflow-hidden aspect-[3/4] relative" data-cursor="VIEW">
      <img src="${p.image}" alt="${p.name}" class="pc-img w-full h-full object-cover" loading="lazy" />
      <span class="absolute right-4 top-4 font-serif text-4xl text-white/55">${p.code.split('-').pop()}</span>
    </a>
    <div class="p-6 flex flex-col flex-1">
      <div class="flex items-center justify-between gap-3">
        <p class="text-[10px] tracking-widest2 uppercase text-mutedgt">${p.category}</p>
        <p class="text-[10px] tracking-widest uppercase text-sand">${p.code}</p>
      </div>
      <a href="/products/${p.slug}" class="font-serif text-3xl leading-tight text-navy mt-2 hover:text-sand transition-colors">${p.name}</a>
      <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-mutedgt">
        <div><dt class="uppercase tracking-widest text-[9px]">Construction</dt><dd class="text-ink/75 mt-0.5">${p.construction}</dd></div>
        <div><dt class="uppercase tracking-widest text-[9px]">Composition</dt><dd class="text-ink/75 mt-0.5">${p.composition}</dd></div>
        <div><dt class="uppercase tracking-widest text-[9px]">GSM</dt><dd class="text-ink/75 mt-0.5">${p.gsm}</dd></div>
        <div><dt class="uppercase tracking-widest text-[9px]">Finish</dt><dd class="text-ink/75 mt-0.5">${p.finish}</dd></div>
      </dl>
      <div class="mt-3 flex flex-wrap gap-1.5">
        ${p.certifications.map((c) => `<span class="text-[9px] tracking-widest uppercase bg-sand/25 text-navy px-2 py-1">${c}</span>`).join('')}
      </div>
      <div class="mt-auto pt-5 flex items-center justify-between gap-3">
        <a href="/products/${p.slug}" class="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-sand transition-colors">View Product <i class="explore-arrow fa-solid fa-arrow-right text-xs"></i></a>
        <button data-compare="${p.slug}" class="text-[11px] tracking-wide uppercase border border-sand/60 px-3 py-1.5 hover:border-navy transition-colors cursor-pointer"><span>Compare</span></button>
      </div>
    </div>
  </article>`
}

export const ProductsPage = (q: Record<string, string>) => {
  const list = filterProducts(q)
  return html`
<section class="relative bg-navy text-white pt-40 pb-16 lg:pb-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Product Catalog</p>
    <h1 class="font-serif text-4xl sm:text-5xl lg:text-[64px] leading-[1.02]">Knitwear Programs<br/>for Global Buyers</h1>
    <p class="mt-6 max-w-xl text-white/60 text-sm leading-relaxed">Categories reflect publicly documented Gumti export products. Technical specifications shown are CMS-managed templates — final values are confirmed per order.</p>
  </div>
</section>

<section class="bg-ivory py-14 lg:py-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <form id="product-filters" class="bg-white border border-sand/40 p-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4" role="search" aria-label="Product filters">
      <div class="lg:col-span-2">
        <label class="field-label" for="f-search">Search</label>
        <input id="f-search" name="search" type="search" class="field" placeholder="Product, code, fabric…" value="${q.search || ''}" />
      </div>
      <div>
        <label class="field-label" for="f-category">Category</label>
        <select id="f-category" name="category" class="field">
          <option value="">All categories</option>
          ${raw(categories.map((c) => `<option value="${c.toLowerCase().replace(/[^a-z]/g, '')}" ${q.category === c.toLowerCase().replace(/[^a-z]/g, '') ? 'selected' : ''}>${c}</option>`).join(''))}
        </select>
      </div>
      <div>
        <label class="field-label" for="f-composition">Composition</label>
        <select id="f-composition" name="composition" class="field">
          <option value="">Any</option>
          ${raw(['Cotton', 'Organic', 'Polyester', 'Elastane'].map((c) => `<option value="${c.toLowerCase()}" ${q.composition === c.toLowerCase() ? 'selected' : ''}>${c}</option>`).join(''))}
        </select>
      </div>
      <div>
        <label class="field-label" for="f-cert">Certification</label>
        <select id="f-cert" name="certification" class="field">
          <option value="">Any</option>
          ${raw(['OEKO-TEX', 'GOTS', 'BCI'].map((c) => `<option value="${c.toLowerCase()}" ${q.certification === c.toLowerCase() ? 'selected' : ''}>${c}</option>`).join(''))}
        </select>
      </div>
    </form>

    <div class="mt-8 flex items-center justify-between">
      <p id="product-count" class="text-sm text-mutedgt">${list.length} product${list.length === 1 ? '' : 's'}</p>
      <p class="text-[10px] tracking-widest uppercase text-mutedgt hidden sm:block">Select up to 3 to compare</p>
    </div>
    <div id="product-grid" class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${raw(list.length ? list.map(productCardHtml).join('') : `
        <div class="col-span-full border border-dashed border-sand/70 p-16 text-center">
          <i class="fa-regular fa-face-frown text-3xl text-sand"></i>
          <p class="mt-4 font-serif text-2xl text-navy">No products match those filters</p>
          <p class="text-sm text-mutedgt mt-2">Try clearing a filter, or <a href="/contact" class="underline underline-offset-4 text-navy">contact our sales team</a> with your specification.</p>
        </div>`)}
    </div>
  </div>
</section>

<div id="compare-bar" class="hidden fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy text-white shadow-2xl px-6 py-3.5 flex items-center gap-5 border border-white/10">
  <p class="text-sm"><span id="compare-count" class="font-semibold text-sand">0</span> selected</p>
  <a id="compare-link" href="/products/compare" class="bg-sand text-navy text-sm font-semibold px-5 py-2 hover:bg-white transition-colors">Compare</a>
  <button id="compare-clear" class="text-white/50 hover:text-white text-sm cursor-pointer" aria-label="Clear comparison">Clear</button>
</div>
`
}

export const ProductDetailPage = (p: Product) => html`
<section class="relative bg-navy text-white pt-40 pb-14">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <nav class="text-[11px] tracking-widest uppercase text-white/50" aria-label="Breadcrumb">
      <a href="/products" class="hover:text-sand">Products</a> <span class="mx-2">/</span>
      <a href="/products?category=${p.category.toLowerCase().replace(/[^a-z]/g, '')}" class="hover:text-sand">${p.category}</a> <span class="mx-2">/</span>
      <span class="text-sand">${p.name}</span>
    </nav>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-6">
      <div class="reveal-img overflow-hidden bg-white border border-sand/40">
        <img src="${p.image}" alt="${p.name}" class="w-full aspect-[4/3] object-cover" />
      </div>
      <p class="text-[10px] tracking-widest uppercase text-mutedgt mt-3">Representative imagery — official product photography replaceable via CMS</p>
    </div>
    <div class="lg:col-span-6">
      <div class="flex items-center gap-4">
        <span class="text-[10px] tracking-widest2 uppercase bg-sand/30 text-navy px-3 py-1.5">${p.category}</span>
        <span class="text-[11px] tracking-widest uppercase text-mutedgt">${p.code}</span>
      </div>
      <h1 class="font-serif text-4xl lg:text-5xl text-navy mt-4">${p.name}</h1>
      <p class="mt-5 text-ink/75 leading-relaxed">${p.description}</p>
      <p class="mt-3 text-xs text-mutedgt italic">${p.specNote}</p>

      <div class="table-wrap mt-8">
        <table class="w-full text-sm border-t border-sand/50">
          <caption class="sr-only">Technical specification</caption>
          <tbody>
            ${raw([
              ['Construction', p.construction], ['Composition', p.composition], ['GSM', p.gsm],
              ['Finish', p.finish], ['Available Colors', p.colors.join(', ')], ['Application', p.application],
              ['Certifications', p.certifications.join(' · ')], ['MOQ', p.moq], ['Lead Time', p.leadTime],
              ['Availability', p.availability],
            ].map(([k, v]) => `<tr class="border-b border-sand/40"><th scope="row" class="text-left py-3 pr-6 text-[11px] tracking-widest uppercase text-mutedgt font-medium whitespace-nowrap align-top">${k}</th><td class="py-3 text-ink/80">${v}</td></tr>`).join(''))}
          </tbody>
        </table>
      </div>

      <div class="mt-9 flex flex-wrap gap-3">
        <a href="/request-quote?product=${encodeURIComponent(p.name)}" class="inline-flex items-center gap-2 bg-navy text-white font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-ink transition-colors">Request Quote</a>
        <a href="/request-sample?product=${encodeURIComponent(p.name)}" class="inline-flex items-center gap-2 border border-navy/40 text-navy px-7 py-3.5 text-sm tracking-wide hover:border-navy transition-colors">Request Sample</a>
        <a href="/api/products/${p.slug}/spec" class="inline-flex items-center gap-2 border border-sand text-navy px-7 py-3.5 text-sm tracking-wide hover:bg-sand/20 transition-colors" download="${p.code}-specification.txt"><i class="fa-solid fa-download text-xs"></i> Download Specification</a>
      </div>
    </div>
  </div>

  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 mt-20">
    <h2 class="font-serif text-3xl text-navy">Related Products</h2>
    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${raw(products.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 3).map(productCardHtml).join('') || products.filter((x) => x.slug !== p.slug).slice(0, 3).map(productCardHtml).join(''))}
    </div>
  </div>
</section>
`

export const ComparePage = (slugs: string[]) => {
  const items = slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as Product[]
  const rows: [string, (p: Product) => string][] = [
    ['Category', (p) => p.category], ['Construction', (p) => p.construction],
    ['Composition', (p) => p.composition], ['GSM', (p) => p.gsm], ['Finish', (p) => p.finish],
    ['Certifications', (p) => p.certifications.join(', ')], ['Application', (p) => p.application],
    ['MOQ', (p) => p.moq], ['Lead Time', (p) => p.leadTime], ['Availability', (p) => p.availability],
  ]
  return html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Product Comparison</p>
    <h1 class="font-serif text-4xl lg:text-[56px]">Compare Products</h1>
  </div>
</section>
<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    ${items.length === 0 ? raw(`
      <div class="border border-dashed border-sand/70 p-16 text-center">
        <p class="font-serif text-2xl text-navy">No products selected</p>
        <p class="text-sm text-mutedgt mt-2">Select up to 3 products from the catalog to compare.</p>
        <a href="/products" class="mt-6 inline-block bg-navy text-white px-7 py-3.5 text-sm font-semibold">Browse Catalog</a>
      </div>`) : raw(`
      <div class="table-wrap">
        <table class="w-full text-sm bg-white border border-sand/40 min-w-[720px]">
          <caption class="sr-only">Side-by-side product comparison</caption>
          <thead>
            <tr class="border-b border-sand/40">
              <th class="p-5 text-left text-[11px] tracking-widest uppercase text-mutedgt w-44 align-bottom">Attribute</th>
              ${items.map((p) => `
                <th class="p-5 text-left align-bottom">
                  <img src="${p.image}" alt="${p.name}" class="w-full aspect-[4/3] object-cover mb-4" loading="lazy" />
                  <a href="/products/${p.slug}" class="font-serif text-xl text-navy hover:text-sand">${p.name}</a>
                  <p class="text-[10px] tracking-widest uppercase text-mutedgt mt-1 font-normal">${p.code}</p>
                </th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-sand/30">
            ${rows.map(([label, fn]) => `
              <tr>
                <th scope="row" class="p-5 text-left text-[11px] tracking-widest uppercase text-mutedgt font-medium align-top">${label}</th>
                ${items.map((p) => `<td class="p-5 text-ink/80 align-top">${fn(p)}</td>`).join('')}
              </tr>`).join('')}
            <tr>
              <td class="p-5"></td>
              ${items.map((p) => `<td class="p-5"><a href="/request-quote?product=${encodeURIComponent(p.name)}" class="inline-block bg-navy text-white text-xs font-semibold px-5 py-3 hover:bg-ink transition-colors">Request Quote</a></td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>`)}
  </div>
</section>`
}
