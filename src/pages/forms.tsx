import { html, raw } from 'hono/html'
import { companyProfile as co } from '../data/company'
import { products } from '../data/products'

const productOptions = (selected?: string) =>
  products.map((p) => `<option value="${p.name}" ${selected === p.name ? 'selected' : ''}>${p.name} (${p.code})</option>`).join('') +
  `<option value="Custom development" ${selected === 'Custom development' ? 'selected' : ''}>Custom development / other</option>`

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Poland', 'Sweden', 'Denmark', 'Canada', 'Australia', 'Japan', 'UAE', 'Saudi Arabia', 'India', 'China', 'Other']
const countryOptions = COUNTRIES.map((c) => `<option value="${c}">${c}</option>`).join('')

// ============ REQUEST QUOTE (RFQ) ============
export const RequestQuotePage = (prefillProduct?: string) => html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Request for Quotation</p>
    <h1 class="font-serif text-4xl lg:text-[60px] leading-[1.02]">Tell Us What<br/>You Need to Make</h1>
    <p class="mt-6 max-w-xl text-white/60 text-sm leading-relaxed">Submit your product, quantity and specification. Your RFQ receives a tracking ID and our sales team follows up with next steps.</p>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    <div id="rfq-success" class="hidden bg-white border-l-4 border-emerald-600 p-10 text-center">
      <i class="fa-solid fa-circle-check text-emerald-600 text-4xl"></i>
      <h2 class="font-serif text-3xl text-navy mt-5">RFQ Submitted</h2>
      <p class="text-mutedgt text-sm mt-3">Your reference ID:</p>
      <p class="font-serif text-3xl text-navy mt-2 tracking-wide" data-ref-id>—</p>
      <p class="text-sm text-mutedgt mt-4 max-w-md mx-auto">Keep this ID for correspondence. Sign in with Google in the <a href="/portal" class="text-navy underline underline-offset-4">Buyer Portal</a> to track your RFQs.</p>
    </div>

    <form data-ajax="/api/rfq" data-success="rfq-success" class="bg-white border border-sand/40 p-8 lg:p-12 grid sm:grid-cols-2 gap-6" novalidate>
      <h2 class="sr-only">Request for quotation form</h2>
      <div>
        <label class="field-label" for="rfq-company">Company Name *</label>
        <input id="rfq-company" name="company_name" class="field" required maxlength="120" />
      </div>
      <div>
        <label class="field-label" for="rfq-person">Contact Person *</label>
        <input id="rfq-person" name="contact_person" class="field" required maxlength="120" />
      </div>
      <div>
        <label class="field-label" for="rfq-email">Business Email *</label>
        <input id="rfq-email" name="email" type="email" class="field" required maxlength="150" />
      </div>
      <div>
        <label class="field-label" for="rfq-phone">Phone</label>
        <input id="rfq-phone" name="phone" type="tel" class="field" pattern="[+0-9()\\-\\s]{6,20}" maxlength="20" />
      </div>
      <div>
        <label class="field-label" for="rfq-country">Country *</label>
        <select id="rfq-country" name="country" class="field" required><option value="">Select country</option>${raw(countryOptions)}</select>
      </div>
      <div>
        <label class="field-label" for="rfq-product">Product *</label>
        <select id="rfq-product" name="product" class="field" required><option value="">Select product</option>${raw(productOptions(prefillProduct))}</select>
      </div>
      <div>
        <label class="field-label" for="rfq-qty">Quantity *</label>
        <input id="rfq-qty" name="quantity" type="number" min="1" class="field" required />
      </div>
      <div>
        <label class="field-label" for="rfq-unit">Unit</label>
        <select id="rfq-unit" name="unit" class="field"><option>pcs</option><option>dozen</option><option>kg</option></select>
      </div>
      <div>
        <label class="field-label" for="rfq-composition">Composition</label>
        <input id="rfq-composition" name="composition" class="field" placeholder="e.g. 100% Cotton" maxlength="100" />
      </div>
      <div>
        <label class="field-label" for="rfq-gsm">GSM</label>
        <input id="rfq-gsm" name="gsm" class="field" placeholder="e.g. 180" maxlength="30" />
      </div>
      <div>
        <label class="field-label" for="rfq-color">Color</label>
        <input id="rfq-color" name="color" class="field" maxlength="80" />
      </div>
      <div>
        <label class="field-label" for="rfq-date">Required Delivery Date</label>
        <input id="rfq-date" name="delivery_date" type="date" class="field" />
      </div>
      <div>
        <label class="field-label" for="rfq-price">Target Price (optional)</label>
        <input id="rfq-price" name="target_price" class="field" placeholder="e.g. USD 2.40 / pc" maxlength="50" />
      </div>
      <div class="sm:col-span-2">
        <label class="field-label" for="rfq-req">Additional Requirements</label>
        <textarea id="rfq-req" name="requirements" rows="4" class="field" maxlength="2000" placeholder="Tech pack details, packaging, labeling, compliance requirements…"></textarea>
        <p class="text-[11px] text-mutedgt mt-2"><i class="fa-solid fa-paperclip mr-1"></i> Tech pack / file uploads can be emailed after submission — your RFQ ID links the correspondence.</p>
      </div>
      <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>
      <div class="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p class="text-xs text-mutedgt">By submitting you agree to our <a href="/privacy" class="underline underline-offset-2">privacy policy</a>.</p>
        <button type="submit" class="bg-navy text-white font-semibold px-10 py-4 text-sm tracking-wide hover:bg-ink transition-colors cursor-pointer">Submit RFQ <i class="fa-solid fa-arrow-right text-xs ml-2"></i></button>
      </div>
    </form>

    <div class="mt-10 grid sm:grid-cols-3 gap-px bg-sand/40 border border-sand/40 text-center">
      ${raw([['1', 'Submit RFQ', 'Receive a tracking ID instantly'], ['2', 'Review & Pricing', 'Our sales team reviews your specification'], ['3', 'Quotation', 'You receive a formal quotation to review']].map(([n, t, d]) => `
        <div class="bg-ivory p-7">
          <p class="font-serif text-3xl text-sand">${n}</p>
          <p class="font-semibold text-navy text-sm mt-2">${t}</p>
          <p class="text-xs text-mutedgt mt-1">${d}</p>
        </div>`).join(''))}
    </div>
  </div>
</section>
`

// ============ SAMPLE REQUEST ============
export const RequestSamplePage = (prefillProduct?: string) => html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Sample Request</p>
    <h1 class="font-serif text-4xl lg:text-[56px]">Request a Product Sample</h1>
  </div>
</section>
<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <div id="sample-success" class="hidden bg-white border-l-4 border-emerald-600 p-10 text-center">
      <i class="fa-solid fa-circle-check text-emerald-600 text-4xl"></i>
      <h2 class="font-serif text-3xl text-navy mt-5">Sample Request Received</h2>
      <p class="text-mutedgt text-sm mt-3">Reference ID:</p>
      <p class="font-serif text-3xl text-navy mt-2" data-ref-id>—</p>
      <p class="text-sm text-mutedgt mt-4">Workflow: Requested → Approved → Prepared → Shipped → Delivered.</p>
    </div>
    <form data-ajax="/api/sample" data-success="sample-success" class="bg-white border border-sand/40 p-8 lg:p-12 grid sm:grid-cols-2 gap-6" novalidate>
      <div>
        <label class="field-label" for="s-product">Product *</label>
        <select id="s-product" name="product" class="field" required><option value="">Select product</option>${raw(productOptions(prefillProduct))}</select>
      </div>
      <div><label class="field-label" for="s-color">Color</label><input id="s-color" name="color" class="field" maxlength="80" /></div>
      <div><label class="field-label" for="s-gsm">GSM</label><input id="s-gsm" name="gsm" class="field" maxlength="30" /></div>
      <div><label class="field-label" for="s-qty">Quantity</label><input id="s-qty" name="quantity" type="number" min="1" class="field" /></div>
      <div><label class="field-label" for="s-email">Business Email *</label><input id="s-email" name="email" type="email" class="field" required maxlength="150" /></div>
      <div>
        <label class="field-label" for="s-country">Country *</label>
        <select id="s-country" name="country" class="field" required><option value="">Select country</option>${raw(countryOptions)}</select>
      </div>
      <div class="sm:col-span-2"><label class="field-label" for="s-addr">Shipping Address *</label><textarea id="s-addr" name="shipping_address" rows="2" class="field" required maxlength="400"></textarea></div>
      <div><label class="field-label" for="s-purpose">Purpose</label>
        <select id="s-purpose" name="purpose" class="field"><option>Quality evaluation</option><option>Buyer approval</option><option>Fit assessment</option><option>Other</option></select>
      </div>
      <div class="sm:col-span-2"><label class="field-label" for="s-comments">Comments</label><textarea id="s-comments" name="comments" rows="3" class="field" maxlength="1000"></textarea></div>
      <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>
      <div class="sm:col-span-2 text-right">
        <button type="submit" class="bg-navy text-white font-semibold px-10 py-4 text-sm tracking-wide hover:bg-ink transition-colors cursor-pointer">Submit Sample Request</button>
      </div>
    </form>
  </div>
</section>
`

// ============ CONTACT ============
export const ContactPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Contact</p>
    <h1 class="font-serif text-4xl lg:text-[60px] leading-[1.02]">Start a Conversation</h1>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-5 space-y-8">
      ${raw([
        ['Sales Inquiry', 'For quotations, pricing and product development, submit an RFQ for the fastest routing.', '/request-quote', 'Request a Quote'],
        ['Careers', 'For open positions and applications, visit the careers portal.', '/careers', 'View Careers'],
      ].map(([t, d, href, cta]) => `
        <article class="bg-white border border-sand/40 p-7 reveal">
          <h2 class="font-serif text-2xl text-navy">${t}</h2>
          <p class="text-sm text-mutedgt mt-2 leading-relaxed">${d}</p>
          <a href="${href}" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy border-b border-sand pb-0.5 hover:text-sand transition-colors">${cta} <i class="fa-solid fa-arrow-right text-xs"></i></a>
        </article>`).join(''))}
      <article class="bg-white border border-sand/40 p-7 reveal">
        <h2 class="font-serif text-2xl text-navy">Head Office</h2>
        <address class="not-italic text-sm text-mutedgt mt-2 leading-relaxed">${co.headOffice.line1}<br/>${co.headOffice.line2}, ${co.headOffice.line3}</address>
        <a href="${co.headOffice.mapUrl}" target="_blank" rel="noopener" class="mt-3 inline-flex items-center gap-2 text-sm text-navy hover:text-sand"><i class="fa-solid fa-map-location-dot"></i> Google Maps</a>
      </article>
      <article class="bg-white border border-sand/40 p-7 reveal">
        <h2 class="font-serif text-2xl text-navy">Factory</h2>
        <address class="not-italic text-sm text-mutedgt mt-2 leading-relaxed">${co.factoryAddress.line1}<br/>${co.factoryAddress.line2}, ${co.factoryAddress.line3}</address>
        <a href="${co.factoryAddress.mapUrl}" target="_blank" rel="noopener" class="mt-3 inline-flex items-center gap-2 text-sm text-navy hover:text-sand"><i class="fa-solid fa-map-location-dot"></i> Google Maps</a>
      </article>
    </div>

    <div class="lg:col-span-7">
      <div id="contact-success" class="hidden bg-white border-l-4 border-emerald-600 p-10 text-center">
        <i class="fa-solid fa-circle-check text-emerald-600 text-4xl"></i>
        <h2 class="font-serif text-3xl text-navy mt-5">Message Received</h2>
        <p class="text-mutedgt text-sm mt-3">Reference ID:</p>
        <p class="font-serif text-3xl text-navy mt-2" data-ref-id>—</p>
        <p class="text-sm text-mutedgt mt-4">Our team will respond to your inquiry by email.</p>
      </div>
      <form data-ajax="/api/contact" data-success="contact-success" class="bg-white border border-sand/40 p-8 lg:p-12 grid sm:grid-cols-2 gap-6" novalidate>
        <div><label class="field-label" for="c-name">Name *</label><input id="c-name" name="name" class="field" required maxlength="120" /></div>
        <div><label class="field-label" for="c-company">Company</label><input id="c-company" name="company" class="field" maxlength="120" /></div>
        <div><label class="field-label" for="c-email">Email *</label><input id="c-email" name="email" type="email" class="field" required maxlength="150" /></div>
        <div><label class="field-label" for="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" class="field" pattern="[+0-9()\\-\\s]{6,20}" maxlength="20" /></div>
        <div>
          <label class="field-label" for="c-country">Country</label>
          <select id="c-country" name="country" class="field"><option value="">Select country</option>${raw(countryOptions)}</select>
        </div>
        <div>
          <label class="field-label" for="c-type">Inquiry Type *</label>
          <select id="c-type" name="inquiry_type" class="field" required>
            <option value="">Select type</option><option>Sales Inquiry</option><option>Request Quote</option><option>General Contact</option><option>Career</option><option>Factory / Compliance Visit</option><option>Partnership</option>
          </select>
        </div>
        <div class="sm:col-span-2"><label class="field-label" for="c-msg">Message *</label><textarea id="c-msg" name="message" rows="5" class="field" required maxlength="3000"></textarea></div>
        <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>
        <div class="sm:col-span-2 text-right">
          <button type="submit" class="bg-navy text-white font-semibold px-10 py-4 text-sm tracking-wide hover:bg-ink transition-colors cursor-pointer">Send Message <i class="fa-solid fa-paper-plane text-xs ml-2"></i></button>
        </div>
      </form>
    </div>
  </div>
</section>
`
