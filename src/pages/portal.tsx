import { html } from 'hono/html'
import { companyProfile as co } from '../data/company'

export const PortalPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Buyer Portal</p>
    <h1 class="font-serif text-4xl lg:text-[56px]">Your Sourcing Workspace</h1>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24 min-h-[50vh]">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">

    <!-- Signed OUT state -->
    <div id="portal-signed-out" class="bg-white border border-sand/40 p-10 lg:p-16 text-center max-w-xl mx-auto">
      <span class="inline-flex w-14 h-14 items-center justify-center bg-navy text-sand text-xl"><i class="fa-regular fa-user"></i></span>
      <h2 class="font-serif text-3xl text-navy mt-6">Sign in to Continue</h2>
      <p class="text-sm text-mutedgt mt-3 leading-relaxed">Access RFQs, samples and buyer records linked to your email.</p>
      <div class="mt-8 flex flex-col sm:flex-row justify-center gap-3">
      <a href="/login" class="inline-flex items-center justify-center bg-navy text-white font-semibold px-8 py-4 text-sm hover:bg-ink transition-colors">Email Login</a>
      <button data-google-signin class="inline-flex items-center justify-center gap-3 border border-navy/30 bg-white text-navy font-semibold px-8 py-4 text-sm hover:border-navy transition-colors cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.2 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
        Google
      </button>
      </div>
    </div>

    <!-- Signed IN state -->
    <div id="portal-signed-in" class="hidden">
      <div class="bg-white border border-sand/40 p-7 lg:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div class="flex items-center gap-4">
          <img id="portal-user-photo" src="" alt="" class="hidden w-14 h-14 rounded-full border-2 border-sand" referrerpolicy="no-referrer" />
          <div>
            <p id="portal-user-name" class="font-serif text-2xl text-navy">—</p>
            <p id="portal-user-email" class="text-sm text-mutedgt">—</p>
          </div>
        </div>
        <div class="flex gap-3">
          <a href="/request-quote" class="bg-navy text-white text-sm font-semibold px-6 py-3 hover:bg-ink transition-colors">New RFQ</a>
          <button data-signout class="border border-sand/70 text-navy text-sm px-6 py-3 hover:border-navy transition-colors cursor-pointer">Sign Out</button>
        </div>
      </div>

      <div class="mt-8">
        <div>
          <div class="flex items-center justify-between gap-4 mb-5">
            <h2 class="font-serif text-2xl text-navy">Your RFQs</h2>
            <a href="/contact" class="text-sm text-navy underline underline-offset-4">Contact Sales</a>
          </div>
          <div id="portal-rfq-list" class="space-y-4">
            <div class="border border-dashed border-sand/60 p-8 text-center text-sm text-mutedgt"><i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading RFQs…</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`

export const PrivacyPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-14">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10"><h1 class="font-serif text-4xl lg:text-[52px]">Privacy Policy</h1></div>
</section>
<section class="bg-ivory py-16">
  <div class="max-w-[760px] mx-auto px-5 lg:px-10 space-y-8 text-sm leading-relaxed text-ink/75">
    <p><strong class="text-navy">Scope.</strong> This policy describes how ${co.name} handles information submitted through this website, including RFQs, contact inquiries, sample requests and job applications.</p>
    <div><h2 class="font-serif text-2xl text-navy mb-2">Data We Collect</h2><p>Business contact details (name, company, email, phone, country) and the content of your inquiries. If you sign in with Google, we receive your name, email address and profile photo from Google via Firebase Authentication.</p></div>
    <div><h2 class="font-serif text-2xl text-navy mb-2">How We Use It</h2><p>To respond to inquiries, prepare quotations, process sample requests and evaluate job applications. We do not sell personal data.</p></div>
    <div><h2 class="font-serif text-2xl text-navy mb-2">Storage</h2><p>Submissions are stored in our application database and, where applicable, mirrored to Google Firebase (Firestore) linked to your signed-in account. Firebase Analytics may collect standard usage metrics.</p></div>
    <div id="cookies"><h2 class="font-serif text-2xl text-navy mb-2">Cookies</h2><p>Essential cookies and local storage support sign-in state and product comparison. Analytics identifiers are managed by Firebase Analytics.</p></div>
    <div><h2 class="font-serif text-2xl text-navy mb-2">Contact</h2><p>For privacy requests, contact us via the <a href="/contact" class="text-navy underline underline-offset-2">contact page</a>.</p></div>
    <p class="text-xs text-mutedgt">This template policy should be reviewed by Gumti Textiles Ltd. legal counsel before production use.</p>
  </div>
</section>`

export const TermsPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-14">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10"><h1 class="font-serif text-4xl lg:text-[52px]">Terms of Use</h1></div>
</section>
<section class="bg-ivory py-16">
  <div class="max-w-[760px] mx-auto px-5 lg:px-10 space-y-8 text-sm leading-relaxed text-ink/75">
    <div><h2 class="font-serif text-2xl text-navy mb-2">Website Content</h2><p>Company facts on this site derive from public registrations (BGMEA, EPB). Product specifications shown are CMS-managed templates; commercial terms are established only through formal quotations and contracts.</p></div>
    <div><h2 class="font-serif text-2xl text-navy mb-2">RFQs & Quotations</h2><p>Submitting an RFQ does not constitute an order. Quotations issued by ${co.name} are subject to their stated validity and conditions.</p></div>
    <div><h2 class="font-serif text-2xl text-navy mb-2">Intellectual Property</h2><p>Site content may not be reproduced without permission. Certain photography is used under Creative Commons/public-domain licenses as placeholders pending official company imagery.</p></div>
    <p class="text-xs text-mutedgt">This template should be reviewed by Gumti Textiles Ltd. legal counsel before production use.</p>
  </div>
</section>`

export const NotFoundPage = () => html`
<section class="bg-navy text-white min-h-screen flex items-center">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10 text-center py-40">
    <p class="font-serif text-sand text-8xl lg:text-9xl">404</p>
    <h1 class="font-serif text-3xl lg:text-5xl mt-4">Page Not Found</h1>
    <p class="mt-5 text-white/60 text-sm max-w-md mx-auto">The page you're looking for doesn't exist or has moved. Try one of these instead:</p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a href="/" class="bg-sand text-navy font-semibold px-7 py-3.5 text-sm hover:bg-white transition-colors">Homepage</a>
      <a href="/products" class="border border-white/30 px-7 py-3.5 text-sm hover:border-sand hover:text-sand transition-colors">Products</a>
      <a href="/contact" class="border border-white/30 px-7 py-3.5 text-sm hover:border-sand hover:text-sand transition-colors">Contact</a>
    </div>
  </div>
</section>`

export const ErrorPage = () => html`
<section class="bg-navy text-white min-h-screen flex items-center">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10 text-center py-40">
    <p class="font-serif text-sand text-8xl">500</p>
    <h1 class="font-serif text-3xl lg:text-5xl mt-4">Something Went Wrong</h1>
    <p class="mt-5 text-white/60 text-sm max-w-md mx-auto">An unexpected error occurred. Please try again, or contact us if the problem persists.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a href="/" class="bg-sand text-navy font-semibold px-7 py-3.5 text-sm hover:bg-white transition-colors">Homepage</a>
      <a href="/contact" class="border border-white/30 px-7 py-3.5 text-sm hover:border-sand hover:text-sand transition-colors">Contact Support</a>
    </div>
  </div>
</section>`
