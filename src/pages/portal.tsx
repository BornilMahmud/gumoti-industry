import { html } from 'hono/html'
import { companyProfile as co } from '../data/company'

export const PortalPage = () => html`
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Buyer Workspace</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[56px] font-extrabold font-display leading-[1.06] text-white">
      Your Sourcing <span class="text-gradient-emerald">Dashboard</span>
    </h1>
    <p class="mt-3 max-w-xl text-[#788A9C] text-sm leading-relaxed">
      Monitor live RFQs, sample dispatch tracking, and communication with our Gazipur production desk.
    </p>
  </div>
</section>

<section class="bg-[#08111A] py-14 lg:py-20 min-h-[60vh]">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">

    <!-- Signed OUT state -->
    <div id="portal-signed-out" class="glass-panel p-10 sm:p-14 text-center max-w-xl mx-auto rounded-3xl border border-white/[0.1] shadow-2xl">
      <div class="w-16 h-16 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-2xl mx-auto mb-5">
        <i class="fa-regular fa-user"></i>
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold font-display text-white">Sign In to Continue</h2>
      <p class="text-xs sm:text-sm text-[#788A9C] mt-2 leading-relaxed">
        Access quotation histories, sample tracking IDs, and commercial documents linked to your account.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <a href="/login" class="pill-btn-emerald py-3 px-8 text-xs">
          <span>Sign In with Email</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
        <button data-google-signin class="py-3 px-6 rounded-full bg-white/[0.04] border border-white/[0.1] hover:border-white/[0.25] text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-colors cursor-pointer">
          <i class="fa-brands fa-google text-[#00E599]"></i>
          <span>Google Sign In</span>
        </button>
      </div>
    </div>

    <!-- Signed IN state -->
    <div id="portal-signed-in" class="hidden space-y-8">
      <div class="glass-card p-6 sm:p-8 border border-white/[0.08] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div class="flex items-center gap-4">
          <img id="portal-user-photo" src="" alt="" class="hidden w-14 h-14 rounded-2xl border-2 border-[#00E599] object-cover" referrerpolicy="no-referrer" />
          <div>
            <p id="portal-user-name" class="text-xl sm:text-2xl font-bold font-display text-white">—</p>
            <p id="portal-user-email" class="text-xs text-[#788A9C] font-mono mt-0.5">—</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a href="/request-quote" class="pill-btn-emerald py-2.5 px-6 text-xs">
            <i class="fa-solid fa-plus text-xs mr-1"></i> New RFQ
          </a>
          <button data-signout class="py-2.5 px-5 rounded-full border border-white/[0.12] text-xs font-semibold text-[#CBD5E1] hover:text-white hover:border-white/30 transition-colors cursor-pointer">
            Sign Out
          </button>
        </div>
      </div>

      <div class="glass-panel p-6 sm:p-8 border border-white/[0.08] rounded-2xl">
        <div class="flex items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
          <div>
            <h2 class="text-xl font-bold font-display text-white">Your RFQs & Sourcing Records</h2>
            <p class="text-xs text-[#788A9C] mt-1">Live status tracking directly from our factory merchandising ERP.</p>
          </div>
          <a href="/contact" class="text-xs font-bold text-[#00E599] hover:underline flex items-center gap-1.5">
            Contact Sourcing Desk <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        
        <div id="portal-rfq-list" class="space-y-3">
          <div class="glass-card p-8 text-center text-xs text-[#788A9C] border border-dashed border-white/[0.1]">
            <i class="fa-solid fa-circle-notch fa-spin mr-2 text-[#00E599]"></i> Synchronizing records from Gumti database…
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
`

export const PrivacyPage = () => html`
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Legal & Privacy</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white">Privacy Policy</h1>
  </div>
</section>

<section class="bg-[#08111A] py-14 lg:py-20 min-h-[50vh]">
  <div class="max-w-[760px] mx-auto px-5 lg:px-10 glass-panel p-8 sm:p-12 rounded-2xl border border-white/[0.08] space-y-6 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
    <p><strong class="text-white">Scope.</strong> This policy describes how ${co.name} handles commercial information submitted through this website, including RFQs, inquiries, sample requests and job applications.</p>
    <div>
      <h2 class="text-lg font-bold font-display text-white mb-2">Data Protection</h2>
      <p class="text-[#788A9C]">Commercial contact details (company name, email, telephone, destination country) and tech packs are retained exclusively for quotations, sampling, and manufacturing fulfillment. We never sell or distribute corporate partner data.</p>
    </div>
    <div>
      <h2 class="text-lg font-bold font-display text-white mb-2">Secure Cloud Infrastructure</h2>
      <p class="text-[#788A9C]">Account records and authenticated submissions are stored under industry-standard SSL 256-bit encryption with Google Cloud Firebase Authentication and Firestore security rules.</p>
    </div>
    <div>
      <h2 class="text-lg font-bold font-display text-white mb-2">Direct Contact</h2>
      <p class="text-[#788A9C]">For privacy requests or corporate documentation, please contact our legal desk via <a href="mailto:info@gumtitex.com" class="text-[#00E599] underline">info@gumtitex.com</a>.</p>
    </div>
  </div>
</section>`

export const TermsPage = () => html`
<section class="relative bg-[#060B10] pt-32 pb-14 border-b border-white/[0.08]">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-4">Commercial Terms</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white">Terms of Business</h1>
  </div>
</section>

<section class="bg-[#08111A] py-14 lg:py-20 min-h-[50vh]">
  <div class="max-w-[760px] mx-auto px-5 lg:px-10 glass-panel p-8 sm:p-12 rounded-2xl border border-white/[0.08] space-y-6 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
    <div>
      <h2 class="text-lg font-bold font-display text-white mb-2">Commercial RFQs</h2>
      <p class="text-[#788A9C]">Submitting an RFQ initiates merchandising review and cost estimation. Final commercial terms, incoterms (FOB Chittagong, CIF, etc.), payment terms (L/C at sight, TT), and production delivery windows are confirmed upon formal Proforma Invoice signoff.</p>
    </div>
    <div>
      <h2 class="text-lg font-bold font-display text-white mb-2">Intellectual Property</h2>
      <p class="text-[#788A9C]">Buyer tech packs, size curves, and proprietary artwork submitted to Gumti Textiles Ltd. remain the exclusive intellectual property of the buyer and are treated under strict non-disclosure manufacturing protocols.</p>
    </div>
  </div>
</section>`

export const NotFoundPage = () => html`
<section class="bg-[#060B10] min-h-screen flex items-center justify-center py-20 px-5">
  <div class="max-w-[600px] w-full glass-panel p-10 sm:p-14 text-center rounded-3xl border border-white/[0.1] shadow-2xl">
    <span class="text-7xl sm:text-8xl font-black font-display text-gradient-emerald">404</span>
    <h1 class="text-2xl sm:text-3xl font-extrabold font-display text-white mt-4">Page Not Located</h1>
    <p class="mt-3 text-xs sm:text-sm text-[#788A9C] leading-relaxed">The requested URL cannot be found on Gumti Textiles. You can navigate back using the links below:</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="/" class="pill-btn-emerald py-2.5 px-6 text-xs">Homepage</a>
      <a href="/products" class="pill-btn-outline py-2.5 px-6 text-xs">Product Catalog</a>
      <a href="/contact" class="pill-btn-outline py-2.5 px-6 text-xs">Contact Us</a>
    </div>
  </div>
</section>`

export const ErrorPage = () => html`
<section class="bg-[#060B10] min-h-screen flex items-center justify-center py-20 px-5">
  <div class="max-w-[600px] w-full glass-panel p-10 sm:p-14 text-center rounded-3xl border border-white/[0.1] shadow-2xl">
    <span class="text-7xl sm:text-8xl font-black font-display text-amber-400">500</span>
    <h1 class="text-2xl sm:text-3xl font-extrabold font-display text-white mt-4">System Exception</h1>
    <p class="mt-3 text-xs sm:text-sm text-[#788A9C] leading-relaxed">An unexpected error occurred while processing your request. Please reload or contact our technical support.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="/" class="pill-btn-emerald py-2.5 px-6 text-xs">Return Home</a>
      <a href="/contact" class="pill-btn-outline py-2.5 px-6 text-xs">Contact Support</a>
    </div>
  </div>
</section>`
