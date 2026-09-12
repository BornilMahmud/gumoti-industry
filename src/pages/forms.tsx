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
  `<option value="Custom Knit Development" ${selected === 'Custom Knit Development' ? 'selected' : ''}>Custom Program / Fabric Development</option>`

const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Poland', 'Sweden', 'Denmark', 'Canada', 'Australia',
  'Japan', 'UAE', 'Saudi Arabia', 'Bangladesh', 'Other'
]
const countryOptions = COUNTRIES.map((c) => `<option value="${c}">${c}</option>`).join('')

// ============ REQUEST QUOTE (RFQ) ============
export const RequestQuotePage = (prefill?: QuotePrefill | string) => {
  const pData: QuotePrefill = typeof prefill === 'string' ? { product: prefill } : (prefill || {})

  return html`
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Commercial Inquiries</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[56px] font-extrabold font-display leading-[1.06] text-white">
      Request a <span class="text-gradient-emerald">Production Quote</span>
    </h1>
    <p class="mt-3 max-w-2xl text-[#788A9C] text-sm sm:text-base leading-relaxed">
      Submit your garment specification, target volume, and fabric construction. Our merchandising team issues formal commercial costings within 24 hours.
    </p>
  </div>
</section>

<section class="bg-[#08111A] py-14 lg:py-20 min-h-[70vh]">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    
    <!-- Success Banner -->
    <div id="rfq-success" class="hidden glass-panel p-10 sm:p-14 text-center border border-[#00E599]/40 rounded-2xl">
      <div class="w-16 h-16 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-3xl mx-auto mb-5">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold font-display text-white">RFQ Successfully Submitted</h2>
      <p class="text-[#788A9C] text-xs sm:text-sm mt-2">Your dedicated tracking reference:</p>
      <p class="text-2xl sm:text-3xl font-mono font-bold text-[#00E599] mt-2 tracking-wider" data-ref-id>—</p>
      <p class="text-xs text-[#CBD5E1] mt-4 max-w-md mx-auto leading-relaxed">
        Our merchandising desk is reviewing your requirements. You can track this RFQ inside the <a href="/portal" class="text-[#00E599] underline font-bold">Buyer Portal</a>.
      </p>
    </div>

    <!-- RFQ Form -->
    <form data-ajax="/api/rfq" data-success="rfq-success" class="glass-panel p-6 sm:p-10 border border-white/[0.08] rounded-2xl grid sm:grid-cols-2 gap-5" novalidate>
      <div class="sm:col-span-2 border-b border-white/[0.06] pb-3 flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-white">1. Company & Contact Information</span>
        <span class="text-[10px] text-[#00E599] font-mono">* Required fields</span>
      </div>

      <div>
        <label class="field-label-dark" for="rfq-company">Company / Brand Name *</label>
        <input id="rfq-company" name="company_name" class="field-dark" required maxlength="120" placeholder="e.g. Norma Apparel Ltd." />
      </div>

      <div>
        <label class="field-label-dark" for="rfq-person">Contact Person *</label>
        <input id="rfq-person" name="contact_person" class="field-dark" required maxlength="120" placeholder="e.g. Sourcing Manager" />
      </div>

      <div>
        <label class="field-label-dark" for="rfq-email">Business Email *</label>
        <input id="rfq-email" name="email" type="email" class="field-dark" required maxlength="150" placeholder="buyer@brand.com" />
      </div>

      <div>
        <label class="field-label-dark" for="rfq-phone">Direct Phone / WhatsApp</label>
        <input id="rfq-phone" name="phone" type="tel" class="field-dark" pattern="[+0-9()\\-\\s]{6,20}" maxlength="20" placeholder="+1 555 0192" />
      </div>

      <div class="sm:col-span-2">
        <label class="field-label-dark" for="rfq-country">Destination Country *</label>
        <select id="rfq-country" name="country" class="field-dark" required>
          <option value="">Select country</option>
          ${raw(countryOptions)}
        </select>
      </div>

      <div class="sm:col-span-2 border-b border-white/[0.06] pt-4 pb-3 flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-white">2. Garment Program Specifications</span>
        <span class="text-[10px] text-[#00D2FF] font-mono">22 Sewing Lines</span>
      </div>

      <div>
        <label class="field-label-dark" for="rfq-product">Product Category *</label>
        <select id="rfq-product" name="product" class="field-dark" required>
          <option value="">Select product category</option>
          ${raw(productOptions(pData.product))}
        </select>
      </div>

      <div>
        <label class="field-label-dark" for="rfq-qty">Order Volume *</label>
        <div class="flex gap-2">
          <input id="rfq-qty" name="quantity" type="number" min="1000" step="500" class="field-dark flex-1" required placeholder="10000" value="${pData.quantity || ''}" />
          <select id="rfq-unit" name="unit" class="field-dark w-24">
            <option>pcs</option>
            <option>dozen</option>
            <option>kg</option>
          </select>
        </div>
      </div>

      <div>
        <label class="field-label-dark" for="rfq-composition">Fiber Composition</label>
        <input id="rfq-composition" name="composition" class="field-dark" placeholder="e.g. 100% Combed Cotton or CVC 60/40" value="${pData.composition || ''}" maxlength="100" />
      </div>

      <div>
        <label class="field-label-dark" for="rfq-gsm">Fabric Weight (GSM)</label>
        <input id="rfq-gsm" name="gsm" class="field-dark" placeholder="e.g. 180 or 220" value="${pData.gsm || ''}" maxlength="30" />
      </div>

      <div>
        <label class="field-label-dark" for="rfq-color">Colorways</label>
        <input id="rfq-color" name="color" class="field-dark" placeholder="e.g. Black, White, Navy, Melange" maxlength="80" />
      </div>

      <div>
        <label class="field-label-dark" for="rfq-date">Target In-Store / Delivery Date</label>
        <input id="rfq-date" name="delivery_date" type="date" class="field-dark" />
      </div>

      <div class="sm:col-span-2">
        <label class="field-label-dark" for="rfq-price">Target Price (optional)</label>
        <input id="rfq-price" name="target_price" class="field-dark" placeholder="e.g. FOB Chittagong USD 3.20 / pc" maxlength="50" />
      </div>

      <div class="sm:col-span-2">
        <label class="field-label-dark" for="rfq-req">Technical Pack & Custom Specifications</label>
        <textarea id="rfq-req" name="requirements" rows="4" class="field-dark" maxlength="2000" placeholder="Specify size curves, wash types, labeling/packaging guidelines, or certification requirements (OEKO-TEX, GOTS, BCI)..."></textarea>
        <p class="text-[11px] text-[#788A9C] mt-2">
          <i class="fa-solid fa-paperclip mr-1 text-[#00E599]"></i> You can attach PDF tech packs directly in the Buyer Portal after submission, or email info@gumtitex.com quoting your RFQ ID.
        </p>
      </div>

      <!-- Honeypot -->
      <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>

      <div class="sm:col-span-2 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/[0.06]">
        <p class="text-xs text-[#788A9C]">Quotes are governed by standard BGMEA export guidelines.</p>
        <button type="submit" class="pill-btn-emerald py-3.5 px-8 text-xs cursor-pointer">
          <span>Submit RFQ to Merchandising</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>
    </form>

    <!-- 3-Step Process -->
    <div class="mt-12 grid sm:grid-cols-3 gap-4">
      <div class="glass-card p-5 text-center border border-white/[0.06]">
        <span class="w-8 h-8 rounded-full bg-[#00E599]/15 text-[#00E599] font-mono font-bold text-xs flex items-center justify-center mx-auto mb-2">01</span>
        <p class="text-xs font-bold text-white">RFQ Logged</p>
        <p class="text-[11px] text-[#788A9C] mt-1">Instant tracking ID generated for your commercial inquiry.</p>
      </div>
      <div class="glass-card p-5 text-center border border-white/[0.06]">
        <span class="w-8 h-8 rounded-full bg-[#00D2FF]/15 text-[#00D2FF] font-mono font-bold text-xs flex items-center justify-center mx-auto mb-2">02</span>
        <p class="text-xs font-bold text-white">Engineering Review</p>
        <p class="text-[11px] text-[#788A9C] mt-1">Merchandisers review yarn, dyeing recipe & sewing allocation.</p>
      </div>
      <div class="glass-card p-5 text-center border border-white/[0.06]">
        <span class="w-8 h-8 rounded-full bg-[#00E599]/15 text-[#00E599] font-mono font-bold text-xs flex items-center justify-center mx-auto mb-2">03</span>
        <p class="text-xs font-bold text-white">Formal FOB Quotation</p>
        <p class="text-[11px] text-[#788A9C] mt-1">Receive detailed price breakdown and critical path schedule.</p>
      </div>
    </div>

  </div>
</section>
`
}

// ============ SAMPLE REQUEST ============
export const RequestSamplePage = (prefillProduct?: string) => html`
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Sample Development</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white">Request Garment Samples</h1>
    <p class="mt-3 max-w-xl text-[#788A9C] text-sm leading-relaxed">
      Evaluate our fabric hand feel, stitch density, and lab dip accuracy. Dispatched via DHL/FedEx worldwide.
    </p>
  </div>
</section>

<section class="bg-[#08111A] py-14 lg:py-20 min-h-[60vh]">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <div id="sample-success" class="hidden glass-panel p-10 sm:p-14 text-center border border-[#00E599]/40 rounded-2xl">
      <div class="w-16 h-16 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-3xl mx-auto mb-5">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2 class="text-2xl font-bold font-display text-white">Sample Request Received</h2>
      <p class="text-xs text-[#788A9C] mt-2">Tracking reference ID:</p>
      <p class="text-2xl font-mono font-bold text-[#00E599] mt-1" data-ref-id>—</p>
      <p class="text-xs text-[#CBD5E1] mt-4">Sample desk timeline: Pattern → Lab Dip → Cutting & Sewing → Courier Dispatch.</p>
    </div>

    <form data-ajax="/api/sample" data-success="sample-success" class="glass-panel p-6 sm:p-10 border border-white/[0.08] rounded-2xl grid sm:grid-cols-2 gap-5" novalidate>
      <div>
        <label class="field-label-dark" for="s-product">Garment Program *</label>
        <select id="s-product" name="product" class="field-dark" required>
          <option value="">Select program</option>
          ${raw(productOptions(prefillProduct))}
        </select>
      </div>

      <div>
        <label class="field-label-dark" for="s-color">Color / Lab Dip Requirement</label>
        <input id="s-color" name="color" class="field-dark" placeholder="e.g. Pantone 19-4052 TCX or White" maxlength="80" />
      </div>

      <div>
        <label class="field-label-dark" for="s-gsm">Fabric Weight (GSM)</label>
        <input id="s-gsm" name="gsm" class="field-dark" placeholder="e.g. 180 GSM" maxlength="30" />
      </div>

      <div>
        <label class="field-label-dark" for="s-qty">Number of Samples</label>
        <input id="s-qty" name="quantity" type="number" min="1" max="10" class="field-dark" placeholder="2" />
      </div>

      <div>
        <label class="field-label-dark" for="s-email">Business Email *</label>
        <input id="s-email" name="email" type="email" class="field-dark" required maxlength="150" placeholder="sourcing@brand.com" />
      </div>

      <div>
        <label class="field-label-dark" for="s-country">Country *</label>
        <select id="s-country" name="country" class="field-dark" required>
          <option value="">Select country</option>
          ${raw(countryOptions)}
        </select>
      </div>

      <div class="sm:col-span-2">
        <label class="field-label-dark" for="s-addr">Courier Shipping Address *</label>
        <textarea id="s-addr" name="shipping_address" rows="3" class="field-dark" required maxlength="400" placeholder="Company, street address, postal code, recipient phone..."></textarea>
      </div>

      <div class="sm:col-span-2">
        <label class="field-label-dark" for="s-purpose">Sample Evaluation Goal</label>
        <select id="s-purpose" name="purpose" class="field-dark">
          <option>Fit & Pattern Assessment</option>
          <option>Fabric Hand Feel & Quality Approval</option>
          <option>Color Lab Dip Matching</option>
          <option>Pre-Production Bulk Signoff</option>
        </select>
      </div>

      <div class="sm:col-span-2">
        <label class="field-label-dark" for="s-comments">Special Instructions</label>
        <textarea id="s-comments" name="comments" rows="2" class="field-dark" maxlength="1000" placeholder="Mention specific collar details, rib structure, or wash tests..."></textarea>
      </div>

      <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>

      <div class="sm:col-span-2 pt-2 text-right">
        <button type="submit" class="pill-btn-emerald py-3 px-8 text-xs cursor-pointer">
          <span>Submit Sample Request</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>
    </form>
  </div>
</section>
`

// ============ CONTACT PAGE ============
export const ContactPage = () => html`
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Direct Communication</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[56px] font-extrabold font-display leading-[1.06] text-white">
      Connect with <span class="text-gradient-emerald">Gumti Textiles</span>
    </h1>
    <p class="mt-3 max-w-xl text-[#788A9C] text-sm leading-relaxed">
      Reach our Dhaka corporate office or Chandra Gazipur manufacturing complex directly.
    </p>
  </div>
</section>

<section class="bg-[#08111A] py-14 lg:py-20 min-h-[60vh]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
    
    <!-- Left Info Cards -->
    <div class="lg:col-span-5 space-y-6">
      
      <!-- Gazipur Factory Card -->
      <div class="glass-card p-6 border border-white/[0.08] space-y-3">
        <div class="flex items-center gap-3">
          <span class="w-9 h-9 rounded-lg bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-base"><i class="fa-solid fa-industry"></i></span>
          <div>
            <span class="text-[10px] uppercase font-bold text-[#00E599]">Manufacturing Complex</span>
            <h3 class="text-base font-bold text-white">Chandra Plant, Gazipur</h3>
          </div>
        </div>
        <p class="text-xs text-[#788A9C] leading-relaxed">
          ${co.factoryAddress.full}
        </p>
        <div class="pt-1 flex items-center justify-between text-xs">
          <a href="${co.factoryAddress.mapUrl}" target="_blank" rel="noopener" class="text-[#00E599] font-bold hover:underline flex items-center gap-1.5">
            <i class="fa-solid fa-map-location-dot"></i> Google Maps
          </a>
          <span class="text-[#788A9C]">Dyeing · Knitting · Sewing</span>
        </div>
      </div>

      <!-- Dhaka Office Card -->
      <div class="glass-card p-6 border border-white/[0.08] space-y-3">
        <div class="flex items-center gap-3">
          <span class="w-9 h-9 rounded-lg bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF] text-base"><i class="fa-regular fa-building"></i></span>
          <div>
            <span class="text-[10px] uppercase font-bold text-[#00D2FF]">Corporate Accounts</span>
            <h3 class="text-base font-bold text-white">Dhaka Head Office</h3>
          </div>
        </div>
        <p class="text-xs text-[#788A9C] leading-relaxed">
          ${co.headOffice.full}
        </p>
        <div class="pt-1 flex items-center justify-between text-xs">
          <a href="${co.headOffice.mapUrl}" target="_blank" rel="noopener" class="text-[#00D2FF] font-bold hover:underline flex items-center gap-1.5">
            <i class="fa-solid fa-map-location-dot"></i> Google Maps
          </a>
          <span class="text-[#788A9C]">Merchandising · Sourcing</span>
        </div>
      </div>

      <!-- Direct WhatsApp Channel Card -->
      <div class="glass-card p-6 border border-[#25D366]/40 bg-[#25D366]/5 space-y-3 rounded-2xl">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] text-xl"><i class="fa-brands fa-whatsapp"></i></span>
          <div>
            <span class="text-[10px] uppercase font-bold text-[#25D366] tracking-wider">Instant Response</span>
            <h3 class="text-base font-bold text-white">WhatsApp Direct</h3>
          </div>
        </div>
        <p class="text-xs text-[#CBD5E1]">Direct chat with our factory merchandising desk for sampling and production orders:</p>
        <a href="https://wa.me/8801329713736?text=Hello%20Gumti%20Textiles,%20I%20would%20like%20to%20inquire%20about%20knitwear%20manufacturing..." target="_blank" rel="noopener" class="py-2.5 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold w-full inline-flex items-center justify-center gap-2 transition-colors">
          <i class="fa-brands fa-whatsapp text-base"></i>
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      <!-- Direct Contact Channels -->
      <div class="glass-card p-6 border border-white/[0.08] space-y-3">
        <span class="text-[10px] uppercase font-bold text-white">Direct Communication Channels</span>
        <div class="space-y-2 text-xs">
          <p class="flex items-center gap-3 text-[#CBD5E1]">
            <i class="fa-brands fa-whatsapp text-[#25D366] w-4"></i>
            <a href="https://wa.me/8801329713736" target="_blank" rel="noopener" class="hover:underline text-white font-medium">WhatsApp Priority Desk</a>
          </p>
          <p class="flex items-center gap-3 text-[#CBD5E1]">
            <i class="fa-regular fa-envelope text-[#00E599] w-4"></i>
            <a href="mailto:${co.contact.email}" class="hover:underline font-mono">${co.contact.email}</a>
          </p>
          <p class="flex items-center gap-3 text-[#CBD5E1]">
            <i class="fa-solid fa-phone text-[#00D2FF] w-4"></i>
            <a href="tel:+8801329713736" class="hover:underline font-mono">+880 1329-713736</a>
          </p>
          <p class="flex items-center gap-3 text-[#CBD5E1]">
            <i class="fa-brands fa-facebook text-[#38BDF8] w-4"></i>
            <a href="${co.contact.facebookUrl}" target="_blank" rel="noopener" class="hover:underline">facebook.com/gumtitextile</a>
          </p>
        </div>
      </div>

    </div>

    <!-- Right Form Column -->
    <div class="lg:col-span-7">
      <div id="contact-success" class="hidden glass-panel p-10 text-center border border-[#00E599]/40 rounded-2xl">
        <div class="w-14 h-14 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-2xl mx-auto mb-4">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 class="text-2xl font-bold font-display text-white">Message Transmitted</h2>
        <p class="text-xs text-[#788A9C] mt-1">Inquiry reference:</p>
        <p class="text-xl font-mono font-bold text-[#00E599] mt-1" data-ref-id>—</p>
        <p class="text-xs text-[#CBD5E1] mt-3">Our account executive will reply within 24 business hours.</p>
      </div>

      <form data-ajax="/api/contact" data-success="contact-success" class="glass-panel p-6 sm:p-10 border border-white/[0.08] rounded-2xl grid sm:grid-cols-2 gap-5" novalidate>
        <div>
          <label class="field-label-dark" for="c-name">Full Name *</label>
          <input id="c-name" name="name" class="field-dark" required maxlength="120" placeholder="John Doe" />
        </div>

        <div>
          <label class="field-label-dark" for="c-company">Company Name</label>
          <input id="c-company" name="company" class="field-dark" maxlength="120" placeholder="Brand or Buying House" />
        </div>

        <div>
          <label class="field-label-dark" for="c-email">Business Email *</label>
          <input id="c-email" name="email" type="email" class="field-dark" required maxlength="150" placeholder="john@brand.com" />
        </div>

        <div>
          <label class="field-label-dark" for="c-phone">Phone Number</label>
          <input id="c-phone" name="phone" type="tel" class="field-dark" pattern="[+0-9()\\-\\s]{6,20}" maxlength="20" placeholder="+1 555 0192" />
        </div>

        <div>
          <label class="field-label-dark" for="c-country">Country</label>
          <select id="c-country" name="country" class="field-dark">
            <option value="">Select country</option>
            ${raw(countryOptions)}
          </select>
        </div>

        <div>
          <label class="field-label-dark" for="c-type">Inquiry Classification *</label>
          <select id="c-type" name="inquiry_type" class="field-dark" required>
            <option value="">Select subject</option>
            <option>Commercial Sourcing & RFQ</option>
            <option>Garment Sample Request</option>
            <option>Factory Compliance & Audit</option>
            <option>General Corporate Inquiry</option>
            <option>Supplier / Machinery Partnership</option>
          </select>
        </div>

        <div class="sm:col-span-2">
          <label class="field-label-dark" for="c-msg">Message *</label>
          <textarea id="c-msg" name="message" rows="5" class="field-dark" required maxlength="3000" placeholder="How can our manufacturing and engineering team assist you?"></textarea>
        </div>

        <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>

        <div class="sm:col-span-2 pt-2 text-right">
          <button type="submit" class="pill-btn-emerald py-3 px-8 text-xs cursor-pointer">
            <span>Send Direct Message</span>
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </form>
    </div>

  </div>
</section>
`
