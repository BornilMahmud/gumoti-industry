import { html } from 'hono/html'
import { companyProfile as co } from '../data/company'

export const PortalPage = () => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">B2B Sourcing Hub</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.06] text-[var(--text-primary)]">
      Buyer Procurement <span class="text-[#00E599]">Workspace</span>
    </h1>
    <p class="mt-3 max-w-xl text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
      Monitor quotation timelines, sample tracking IDs, and critical path production milestones directly from our Gazipur operations desk.
    </p>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[65vh] transition-colors">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10">

    <!-- Signed OUT State -->
    <div id="portal-signed-out" class="editorial-card p-10 sm:p-14 text-center max-w-lg mx-auto shadow-2xl">
      <div class="w-16 h-16 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-2xl mx-auto mb-5">
        <i class="fa-regular fa-user"></i>
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)]">Authentication Required</h2>
      <p class="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
        Sign in to view commercial records, active quotation timelines, and production milestones linked to your registered email.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <a href="/login" class="pill-btn-emerald py-3 px-8 text-xs">
          <span>Sign In with Email</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
        <button data-google-signin class="py-3 px-6 rounded-full bg-[var(--bg-input)] border border-[var(--border-medium)] hover:border-[#00E599] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer">
          <i class="fa-brands fa-google text-[#00E599]"></i>
          <span>Google Sign In</span>
        </button>
      </div>
    </div>

    <!-- Signed IN State -->
    <div id="portal-signed-in" class="hidden space-y-8">
      
      <!-- Buyer Header Card -->
      <div class="editorial-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E599] to-[#008F5D] p-0.5 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
            <span id="portal-avatar-letter">U</span>
            <img id="portal-user-photo" src="" alt="" class="hidden w-full h-full rounded-2xl object-cover" referrerpolicy="no-referrer" />
          </div>
          <div>
            <div class="flex items-center gap-2.5">
              <p id="portal-user-name" class="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">—</p>
              <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 uppercase">VERIFIED BUYER</span>
            </div>
            <p id="portal-user-email" class="text-xs text-[var(--text-muted)] font-mono mt-0.5">—</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a href="/request-quote" class="pill-btn-emerald py-2.5 px-6 text-xs">
            <i class="fa-solid fa-plus text-xs mr-1"></i> New RFQ
          </a>
          <button data-signout class="py-2.5 px-5 rounded-full border border-[var(--border-medium)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-highlight)] transition-colors cursor-pointer">
            Sign Out
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="editorial-card p-5 space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Active RFQs</span>
          <p id="portal-stat-rfqs" class="text-2xl font-bold font-display text-[var(--text-primary)]">—</p>
        </div>
        <div class="editorial-card p-5 space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Under Pricing</span>
          <p id="portal-stat-pricing" class="text-2xl font-bold font-display text-[#00D2FF]">—</p>
        </div>
        <div class="editorial-card p-5 space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Formal Quotations</span>
          <p id="portal-stat-quotes" class="text-2xl font-bold font-display text-[#00E599]">—</p>
        </div>
        <div class="editorial-card p-5 space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">In Production</span>
          <p id="portal-stat-production" class="text-2xl font-bold font-display text-[#E5C378]">—</p>
        </div>
      </div>

      <!-- Live RFQ Timeline List -->
      <div class="editorial-card p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Commercial RFQ Timeline</h2>
            <p class="text-xs text-[var(--text-muted)] mt-1">Live critical path progression tracked directly from factory merchandising ERP.</p>
          </div>
          <a href="/contact" class="text-xs font-bold text-[#00E599] hover:underline flex items-center gap-1.5">
            Contact Sourcing Desk <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        
        <div id="portal-rfq-list" class="space-y-4">
          <div class="p-8 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-xl">
            <i class="fa-solid fa-circle-notch fa-spin mr-2 text-[#00E599]"></i> Synchronizing records from Gumti database…
          </div>
        </div>
      </div>

    </div>

  </div>
</section>
`

export const PrivacyPage = () => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Legal & Governance</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">Privacy Policy</h1>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[50vh] transition-colors">
  <div class="max-w-[800px] mx-auto px-5 lg:px-10 editorial-card p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
    <p><strong class="text-[var(--text-primary)]">Scope.</strong> This policy describes how ${co.name} handles commercial information submitted through this website, including RFQs, inquiries, sample requests, and job applications.</p>
    <div>
      <h2 class="text-base font-bold font-display text-[var(--text-primary)] mb-2">Commercial Data Confidentiality</h2>
      <p class="text-[var(--text-muted)]">Commercial contact details, garment sketches, tech packs, and pricing discussions are held in strict commercial confidence. We never sell, exchange, or distribute partner information to third parties.</p>
    </div>
    <div>
      <h2 class="text-base font-bold font-display text-[var(--text-primary)] mb-2">Cloud Security & Encryption</h2>
      <p class="text-[var(--text-muted)]">All user profiles and authenticated submission records are secured under SSL 256-bit encryption with Google Cloud Firebase Authentication and Cloudflare D1 edge database verification.</p>
    </div>
    <div>
      <h2 class="text-base font-bold font-display text-[var(--text-primary)] mb-2">Contact & Inquiries</h2>
      <p class="text-[var(--text-muted)]">For data management or corporate documentation requests, please reach our compliance desk at <a href="mailto:${co.contact.email}" class="text-[#00E599] font-mono underline">${co.contact.email}</a>.</p>
    </div>
  </div>
</section>`

export const TermsPage = () => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Commercial Terms</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">Terms of Business</h1>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[50vh] transition-colors">
  <div class="max-w-[800px] mx-auto px-5 lg:px-10 editorial-card p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
    <div>
      <h2 class="text-base font-bold font-display text-[var(--text-primary)] mb-2">Quotations & Validity</h2>
      <p class="text-[var(--text-muted)]">Commercial costings issued via our RFQ system are based on prevailing raw cotton and yarn market indices and remain valid for 15 calendar days from the date of issuance unless explicitly stated otherwise.</p>
    </div>
    <div>
      <h2 class="text-base font-bold font-display text-[var(--text-primary)] mb-2">Tolerances & Quality Specifications</h2>
      <p class="text-[var(--text-muted)]">Knitted fabric GSM tolerances are maintained within ±5% of agreed specifications. Color matching conforms to spectrophotometer tolerances under D65 lighting standards.</p>
    </div>
    <div>
      <h2 class="text-base font-bold font-display text-[var(--text-primary)] mb-2">Governing Jurisdiction</h2>
      <p class="text-[var(--text-muted)]">Contracts and export sales are executed in accordance with international trade laws (Incoterms 2020) and the jurisdiction of the courts of Bangladesh under BGMEA arbitration rules.</p>
    </div>
  </div>
</section>`

export const NotFoundPage = () => html`
<section class="min-h-[70vh] flex items-center justify-center bg-[var(--bg-canvas)] px-5 py-20 transition-colors">
  <div class="editorial-card p-12 text-center max-w-md mx-auto space-y-4">
    <span class="text-5xl font-extrabold font-display text-[#00E599]">404</span>
    <h1 class="text-xl font-bold font-display text-[var(--text-primary)]">Page Not Found</h1>
    <p class="text-xs text-[var(--text-muted)] leading-relaxed">The requested specification or corporate document could not be located.</p>
    <div class="pt-3">
      <a href="/" class="pill-btn-emerald text-xs">Return to Homepage</a>
    </div>
  </div>
</section>`

export const ErrorPage = () => html`
<section class="min-h-[70vh] flex items-center justify-center bg-[var(--bg-canvas)] px-5 py-20 transition-colors">
  <div class="editorial-card p-12 text-center max-w-md mx-auto space-y-4">
    <span class="text-5xl font-extrabold font-display text-rose-500">500</span>
    <h1 class="text-xl font-bold font-display text-[var(--text-primary)]">System Error</h1>
    <p class="text-xs text-[var(--text-muted)] leading-relaxed">Our edge servers encountered an unexpected condition. Please try again shortly.</p>
    <div class="pt-3">
      <a href="/" class="pill-btn-outline text-xs">Return to Homepage</a>
    </div>
  </div>
</section>`
