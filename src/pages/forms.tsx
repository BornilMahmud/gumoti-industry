import { html, raw } from 'hono/html'
import { companyProfile as co } from '../data/company'
import { products } from '../data/products'

export interface QuotePrefill {
  product?: string
  quantity?: string
  gsm?: string
  composition?: string
}

const productOptions = (selected?: string) =>
  products.map((p) => `<option value="${p.name}" ${selected === p.name ? 'selected' : ''}>${p.name} (${p.code})</option>`).join('') +
  `<option value="Custom Knit Program" ${selected === 'Custom Knit Program' ? 'selected' : ''}>Custom Program / Fabric Development</option>`

const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Poland', 'Sweden', 'Denmark', 'Canada', 'Australia',
  'Japan', 'UAE', 'Saudi Arabia', 'Bangladesh', 'Other'
]
const countryOptions = COUNTRIES.map((c) => `<option value="${c}">${c}</option>`).join('')

// ============ REQUEST QUOTE (6-STEP B2B PROCUREMENT WIZARD) ============
export const RequestQuotePage = (prefill?: QuotePrefill | string) => {
  const pData: QuotePrefill = typeof prefill === 'string' ? { product: prefill } : (prefill || {})

  return html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Procurement & Capacity Booking</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.06] text-[var(--text-primary)]">
      Request a <span class="text-[#00E599]">Production Quote</span>
    </h1>
    <p class="mt-3 max-w-2xl text-[var(--text-muted)] text-xs sm:text-sm sm:leading-relaxed">
      Submit your technical knitwear program. Our merchandising desk analyzes yarn parameters, knitting yield, and sewing critical paths to issue formal commercial costings within 24 hours.
    </p>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[70vh] transition-colors">
  <div class="max-w-[1000px] mx-auto px-5 lg:px-10">
    
    <!-- Success Banner -->
    <div id="rfq-success-container" class="hidden editorial-card p-10 sm:p-14 text-center border-[#00E599]/40">
      <div class="w-16 h-16 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-3xl mx-auto mb-5">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)]">RFQ Successfully Registered</h2>
      <p class="text-[var(--text-muted)] text-xs sm:text-sm mt-2">Official Gumti Tracking Reference:</p>
      <p id="rfq-tracking-ref" class="text-2xl sm:text-3xl font-mono font-bold text-[#00E599] mt-2 tracking-wider">RFQ-GT-2026-XXXX</p>
      <p class="text-xs text-[var(--text-secondary)] mt-4 max-w-md mx-auto leading-relaxed">
        Our merchandising team is calculating yarn yields and machine line schedules. Track this quotation inside the <a href="/portal" class="text-[#00E599] underline font-bold">Buyer Portal</a>.
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <a href="/portal" class="pill-btn-emerald text-xs">Go to Buyer Portal</a>
        <a href="/products" class="pill-btn-outline text-xs">Browse Products</a>
      </div>
    </div>

    <!-- 6-Step Procurement Wizard Form -->
    <form id="rfq-wizard-form" class="editorial-card p-6 sm:p-10" novalidate>
      <input type="text" name="_hp" style="display:none" tabindex="-1" autocomplete="off" />

      <!-- Wizard Progress Navigation Header -->
      <div class="wizard-progress-bar">
        <div class="wizard-progress-track">
          <div id="wizard-progress-fill" class="wizard-progress-fill" style="width: 0%;"></div>
        </div>

        <div class="wizard-step-node active" data-step="1">
          <div class="wizard-step-circle">01</div>
          <span class="wizard-step-label hidden sm:block">Product</span>
        </div>
        <div class="wizard-step-node" data-step="2">
          <div class="wizard-step-circle">02</div>
          <span class="wizard-step-label hidden sm:block">Specs</span>
        </div>
        <div class="wizard-step-node" data-step="3">
          <div class="wizard-step-circle">03</div>
          <span class="wizard-step-label hidden sm:block">Quantity</span>
        </div>
        <div class="wizard-step-node" data-step="4">
          <div class="wizard-step-circle">04</div>
          <span class="wizard-step-label hidden sm:block">Delivery</span>
        </div>
        <div class="wizard-step-node" data-step="5">
          <div class="wizard-step-circle">05</div>
          <span class="wizard-step-label hidden sm:block">Contact</span>
        </div>
        <div class="wizard-step-node" data-step="6">
          <div class="wizard-step-circle">06</div>
          <span class="wizard-step-label hidden sm:block">Review</span>
        </div>
      </div>

      <!-- Step 1: Product Selection -->
      <div class="rfq-wizard-step space-y-6" data-step="1">
        <div class="border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Step 1: Product & Program Selection</h3>
          <p class="text-xs text-[var(--text-muted)]">Select from our verified catalog or specify a custom development program.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-product">Product Program *</label>
          <select id="rfq-product" name="product" class="w-full rounded-xl p-3 text-xs" required>
            <option value="">Select a product program</option>
            ${raw(productOptions(pData.product))}
          </select>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 pt-2">
          <div class="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs space-y-1">
            <span class="font-bold text-[var(--text-primary)] block">Standard Knitwear</span>
            <span class="text-[var(--text-muted)] block">T-Shirts, Polos, Hoodies, Activewear, Tank Tops</span>
          </div>
          <div class="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs space-y-1">
            <span class="font-bold text-[var(--text-primary)] block">Custom Development</span>
            <span class="text-[var(--text-muted)] block">Custom rib structures, drop-needle, slub, modal blends</span>
          </div>
        </div>
      </div>

      <!-- Step 2: Technical Requirements -->
      <div class="rfq-wizard-step hidden space-y-6" data-step="2">
        <div class="border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Step 2: Technical Specifications</h3>
          <p class="text-xs text-[var(--text-muted)]">Yarn composition, fabric weight, and finishing parameters.</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-composition">Yarn Composition *</label>
            <input id="rfq-composition" name="composition" class="w-full rounded-xl p-3 text-xs" value="${pData.composition || '100% Combed Cotton'}" placeholder="e.g. 100% Combed Cotton, CVC 60/40" />
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-gsm">Fabric Weight (GSM) *</label>
            <input id="rfq-gsm" name="gsm" class="w-full rounded-xl p-3 text-xs" value="${pData.gsm || '180'}" placeholder="e.g. 180, 220, 320" />
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-color">Colorways / Pantone</label>
            <input id="rfq-color" name="color" class="w-full rounded-xl p-3 text-xs" placeholder="e.g. 3 Colors (Navy, White, Forest)" />
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-finish">Fabric Finish</label>
            <input id="rfq-finish" name="finish" class="w-full rounded-xl p-3 text-xs" placeholder="e.g. Bio-wash, Silicon soft, Peach finish" />
          </div>
        </div>
      </div>

      <!-- Step 3: Quantity & Sizing -->
      <div class="rfq-wizard-step hidden space-y-6" data-step="3">
        <div class="border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Step 3: Target Quantity & Volume</h3>
          <p class="text-xs text-[var(--text-muted)]">Factory production volume across our 22 synchronized sewing lines.</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-quantity">Target Volume *</label>
            <input id="rfq-quantity" name="quantity" type="number" min="500" class="w-full rounded-xl p-3 text-xs" value="${pData.quantity || '3000'}" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-unit">Unit of Measure</label>
            <select id="rfq-unit" name="unit" class="w-full rounded-xl p-3 text-xs">
              <option value="Pieces">Pieces (Pcs)</option>
              <option value="Dozens">Dozens (Dzn)</option>
              <option value="Kilograms">Kilograms (Kg - Fabric)</option>
            </select>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
          <span class="text-[var(--text-muted)]">Standard Factory MOQ</span>
          <span class="text-[var(--text-primary)] font-bold">1,000 Pcs per style / 300 Pcs per color</span>
        </div>
      </div>

      <!-- Step 4: Delivery & Pricing -->
      <div class="rfq-wizard-step hidden space-y-6" data-step="4">
        <div class="border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Step 4: Delivery Schedule & Target Cost</h3>
          <p class="text-xs text-[var(--text-muted)]">Production turnaround and port dispatch specifications.</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-delivery">Target Delivery Window</label>
            <select id="rfq-delivery" name="delivery_date" class="w-full rounded-xl p-3 text-xs">
              <option value="Standard 60-75 Days">Standard (60–75 Days from Lab Dip Approval)</option>
              <option value="Fast Track 45-60 Days">Fast Track (45–60 Days)</option>
              <option value="Forward Booking 90+ Days">Forward Capacity Booking (90+ Days)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-price">Target Price (USD / Unit)</label>
            <input id="rfq-price" name="target_price" class="w-full rounded-xl p-3 text-xs" placeholder="e.g. $4.50 FOB Chittagong" />
          </div>
        </div>
      </div>

      <!-- Step 5: Buyer Details -->
      <div class="rfq-wizard-step hidden space-y-6" data-step="5">
        <div class="border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Step 5: Buyer & Company Coordinates</h3>
          <p class="text-xs text-[var(--text-muted)]">All formal commercial quotations are linked to your verified business email.</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-company">Company / Brand Name *</label>
            <input id="rfq-company" name="company_name" class="w-full rounded-xl p-3 text-xs" required placeholder="e.g. Norma Apparel Ltd." />
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-contact">Contact Person *</label>
            <input id="rfq-contact" name="contact_person" class="w-full rounded-xl p-3 text-xs" required placeholder="e.g. Sourcing Manager" />
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-email">Business Email *</label>
            <input id="rfq-email" name="email" type="email" class="w-full rounded-xl p-3 text-xs" required placeholder="buyer@brand.com" />
          </div>
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-phone">Direct WhatsApp / Phone</label>
            <input id="rfq-phone" name="phone" type="tel" class="w-full rounded-xl p-3 text-xs" placeholder="+1 555 0192" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-country">Destination Country *</label>
            <select id="rfq-country" name="country" class="w-full rounded-xl p-3 text-xs" required>
              <option value="">Select country</option>
              ${raw(countryOptions)}
            </select>
          </div>
        </div>
      </div>

      <!-- Step 6: Review & Confirmation -->
      <div class="rfq-wizard-step hidden space-y-6" data-step="6">
        <div class="border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-lg font-bold font-display text-[var(--text-primary)]">Step 6: Summary Review & Notes</h3>
          <p class="text-xs text-[var(--text-muted)]">Please review your technical program before transmitting to merchandising.</p>
        </div>

        <div class="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-3 text-xs">
          <div class="flex justify-between border-b border-[var(--border-subtle)] pb-2">
            <span class="text-[var(--text-muted)]">Program:</span>
            <span id="sum-product" class="font-bold text-[var(--text-primary)]">—</span>
          </div>
          <div class="flex justify-between border-b border-[var(--border-subtle)] pb-2">
            <span class="text-[var(--text-muted)]">Fabrication:</span>
            <span id="sum-specs" class="font-bold text-[var(--text-primary)]">—</span>
          </div>
          <div class="flex justify-between border-b border-[var(--border-subtle)] pb-2">
            <span class="text-[var(--text-muted)]">Volume:</span>
            <span id="sum-qty" class="font-bold text-[#00E599]">—</span>
          </div>
          <div class="flex justify-between border-b border-[var(--border-subtle)] pb-2">
            <span class="text-[var(--text-muted)]">Turnaround:</span>
            <span id="sum-delivery" class="font-bold text-[var(--text-primary)]">—</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Buyer:</span>
            <span id="sum-buyer" class="font-bold text-[var(--text-primary)]">—</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2" for="rfq-requirements">Packaging, Labelling, or Tech Pack Notes</label>
          <textarea id="rfq-requirements" name="requirements" rows="3" class="w-full rounded-xl p-3 text-xs" placeholder="Include special neck labels, polybag specs, carton markings, or target testing parameters..."></textarea>
        </div>
      </div>

      <!-- Wizard Controls -->
      <div class="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <button id="wizard-prev-btn" type="button" class="pill-btn-outline py-2.5 px-6 text-xs invisible">
          <i class="fa-solid fa-arrow-left mr-1.5 text-[10px]"></i> Previous
        </button>
        <button id="wizard-next-btn" type="button" class="pill-btn-emerald py-2.5 px-6 text-xs">
          Next Step <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
        </button>
        <button id="wizard-submit-btn" type="submit" class="pill-btn-emerald py-2.5 px-7 text-xs hidden">
          <span>Submit Official RFQ</span>
          <i class="fa-solid fa-check ml-1.5 text-xs"></i>
        </button>
      </div>

    </form>
  </div>
</section>
`
}

// ============ REQUEST SAMPLE ============
export const RequestSamplePage = (productPrefill?: string) => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Fabric Swatches & Prototype Dispatches</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.06] text-[var(--text-primary)]">
      Request a <span class="text-[#00E599]">Fabric Sample</span>
    </h1>
    <p class="mt-3 max-w-2xl text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
      Order certified fabric hanger swatches, lab dips, or prototype garments dispatched via DHL/FedEx internationally.
    </p>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[70vh] transition-colors">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    
    <div id="sample-success" class="hidden editorial-card p-10 text-center border-[#00E599]/40 mb-6">
      <div class="w-14 h-14 rounded-2xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center text-2xl mx-auto mb-4">
        <i class="fa-solid fa-box-check"></i>
      </div>
      <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Sample Dispatch Booked</h2>
      <p class="text-xs text-[var(--text-muted)] mt-1">Reference: <span class="text-[#00E599] font-mono font-bold" data-ref-id>—</span></p>
      <p class="text-xs text-[var(--text-secondary)] mt-3">Our sampling room will package and dispatch your requested swatches within 3 business days.</p>
    </div>

    <form data-ajax="/api/sample" data-success="sample-success" class="editorial-card p-6 sm:p-10 grid sm:grid-cols-2 gap-5" novalidate>
      <input type="text" name="_hp" style="display:none" tabindex="-1" autocomplete="off" />

      <div class="sm:col-span-2">
        <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Target Product / Fabric *</label>
        <select name="product" class="w-full rounded-xl p-3 text-xs" required>
          <option value="">Select fabric swatch</option>
          ${raw(productOptions(productPrefill))}
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Color Specification</label>
        <input name="color" class="w-full rounded-xl p-3 text-xs" placeholder="e.g. Raw Greige, Optic White, Jet Black" />
      </div>

      <div>
        <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Weight (GSM)</label>
        <input name="gsm" class="w-full rounded-xl p-3 text-xs" placeholder="e.g. 180 GSM" />
      </div>

      <div class="sm:col-span-2">
        <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Courier Delivery Address *</label>
        <textarea name="shipping_address" rows="3" class="w-full rounded-xl p-3 text-xs" required placeholder="Full company name, attention person, street, postal code, phone..."></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Destination Country *</label>
        <select name="country" class="w-full rounded-xl p-3 text-xs" required>
          <option value="">Select country</option>
          ${raw(countryOptions)}
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Business Email *</label>
        <input name="email" type="email" class="w-full rounded-xl p-3 text-xs" required placeholder="sourcing@brand.com" />
      </div>

      <div class="sm:col-span-2 pt-4">
        <button type="submit" class="pill-btn-emerald py-3 px-8 text-xs w-full sm:w-auto">
          <span>Submit Sample Requisition</span>
          <i class="fa-solid fa-arrow-right text-[10px] ml-1"></i>
        </button>
      </div>
    </form>
  </div>
</section>
`

// ============ CONTACT US ============
export const ContactPage = () => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Direct Corporate Communications</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.06] text-[var(--text-primary)]">
      Contact <span class="text-[#00E599]">Gumti Textiles</span>
    </h1>
    <p class="mt-3 max-w-2xl text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
      Connect with our commercial executive team in Dhaka or visit our integrated manufacturing complex in Chandra, Gazipur.
    </p>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[70vh] transition-colors">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10">
    <div class="grid lg:grid-cols-12 gap-10">
      
      <!-- Contact Form -->
      <div class="lg:col-span-7">
        <div id="contact-success" class="hidden editorial-card p-10 text-center border-[#00E599]/40 mb-6">
          <div class="w-14 h-14 rounded-2xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center text-2xl mx-auto mb-4">
            <i class="fa-solid fa-envelope-circle-check"></i>
          </div>
          <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Message Received</h2>
          <p class="text-xs text-[var(--text-muted)] mt-1">Tracking ID: <span class="text-[#00E599] font-mono font-bold" data-ref-id>—</span></p>
          <p class="text-xs text-[var(--text-secondary)] mt-3">Our corporate desk will reply within one business day.</p>
        </div>

        <form data-ajax="/api/contact" data-success="contact-success" class="editorial-card p-6 sm:p-10 space-y-4" novalidate>
          <input type="text" name="_hp" style="display:none" tabindex="-1" autocomplete="off" />

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">Full Name *</label>
              <input name="name" class="w-full rounded-xl p-3 text-xs" required placeholder="John Doe" />
            </div>
            <div>
              <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">Business Email *</label>
              <input name="email" type="email" class="w-full rounded-xl p-3 text-xs" required placeholder="john@company.com" />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">Company Name</label>
              <input name="company" class="w-full rounded-xl p-3 text-xs" placeholder="Brand or Retailer" />
            </div>
            <div>
              <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">Inquiry Type *</label>
              <select name="inquiry_type" class="w-full rounded-xl p-3 text-xs" required>
                <option value="Production Sourcing">Bulk Production Sourcing</option>
                <option value="Fabric Development">Fabric Knitting & Dyeing</option>
                <option value="Compliance & Audit">Compliance & ETP Audit</option>
                <option value="General Inquiry">General Commercial Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">Message *</label>
            <textarea name="message" rows="4" class="w-full rounded-xl p-3 text-xs" required placeholder="Outline your requirements, target order volume, or partnership inquiries..."></textarea>
          </div>

          <div class="pt-2">
            <button type="submit" class="pill-btn-emerald py-3 px-8 text-xs">
              <span>Send Official Inquiry</span>
              <i class="fa-solid fa-paper-plane text-[10px] ml-1.5"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- Coordinates Column -->
      <div class="lg:col-span-5 space-y-6">
        
        <div class="editorial-card p-6 space-y-3">
          <div class="flex items-center gap-3 text-[#00E599]">
            <i class="fa-solid fa-industry text-lg"></i>
            <h3 class="text-base font-bold font-display text-[var(--text-primary)]">Chandra Manufacturing Plant</h3>
          </div>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">${co.factoryAddress.full}</p>
          <div class="pt-2 border-t border-[var(--border-subtle)] text-[11px] space-y-1">
            <p><strong class="text-[var(--text-primary)]">Coordinates:</strong> Plot #1163, opposite Ansar Academy, Chandra, Shafipur, Kaliakoir, Gazipur</p>
            <p><strong class="text-[var(--text-primary)]">Capacity:</strong> 50T Dyeing · 10T Knitting · 80T Finishing · 35k Pcs Sewing</p>
          </div>
        </div>

        <div class="editorial-card p-6 space-y-3">
          <div class="flex items-center gap-3 text-[#00D2FF]">
            <i class="fa-solid fa-building text-lg"></i>
            <h3 class="text-base font-bold font-display text-[var(--text-primary)]">Commercial Head Office</h3>
          </div>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">${co.headOffice.full}</p>
          <div class="pt-2 border-t border-[var(--border-subtle)] text-[11px] space-y-1">
            <p><strong class="text-[var(--text-primary)]">Corporate Registrations:</strong> BGMEA Reg. ${co.bgmeaRegistration} · BKMEA ${co.bkmeaRegistration}</p>
            <p><strong class="text-[var(--text-primary)]">Direct Desk:</strong> <a href="mailto:${co.contact.email}" class="text-[#00E599] font-mono">${co.contact.email}</a></p>
          </div>
        </div>

        <div class="editorial-card p-6 bg-[#25D366]/10 border-[#25D366]/30 flex items-center justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#25D366] block">WhatsApp Sourcing Desk</span>
            <span class="text-xs font-bold text-[var(--text-primary)]">+880 1329-713736</span>
          </div>
          <a href="https://wa.me/8801329713736" target="_blank" rel="noopener" class="pill-btn-emerald bg-[#25D366] py-2 px-4 text-xs">
            <span>Chat</span>
          </a>
        </div>

      </div>

    </div>
  </div>
</section>
`
