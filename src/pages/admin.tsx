import { html } from 'hono/html'

export const AdminPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-16 textile-texture">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Admin</p>
    <h1 class="font-serif text-5xl lg:text-[76px] leading-[.92] tracking-[-.055em]">Operations Dashboard</h1>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid lg:grid-cols-12 gap-8 items-start">
      <aside class="lg:col-span-3 admin-card p-7 lg:sticky lg:top-24">
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Gumti Admin</p>
        <h2 class="font-serif text-3xl text-navy mt-3">Control Center</h2>
        <p class="mt-3 text-xs text-mutedgt">Signed in as: <span id="admin-user-email">Not signed in</span></p>
        <div class="mt-6 flex flex-wrap gap-2">
          <button data-google-signin class="bg-navy text-white font-semibold px-4 py-2.5 text-xs tracking-wide hover:bg-ink"><i class="fa-brands fa-google mr-2"></i>Google</button>
          <a href="/login" class="border border-navy/30 text-navy px-4 py-2.5 text-xs tracking-wide hover:border-navy">Email</a>
          <button data-signout class="border border-navy/30 text-navy px-4 py-2.5 text-xs tracking-wide hover:border-navy">Sign out</button>
        </div>
        <button id="admin-refresh" class="mt-4 w-full bg-sand text-navy font-semibold px-5 py-3 text-xs tracking-wide hover:bg-white">Refresh Data</button>
        <nav class="admin-side-nav mt-8" aria-label="Admin modules">
          <a href="#admin-dashboard">Dashboard</a>
          <a href="#admin-business">Business</a>
          <a href="#admin-products">Products</a>
          <a href="#admin-manufacturing">Manufacturing</a>
          <a href="#admin-content">Content & CMS</a>
          <a href="#admin-intelligence">AI & Analytics</a>
          <a href="#admin-governance">Users, Verification & Settings</a>
        </nav>
        <p class="mt-8 border-t border-sand/40 pt-5 text-xs text-mutedgt leading-relaxed">Live modules use the D1 database. Planned modules are shown clearly as inactive until their database workflow is added.</p>
      </aside>
      <div class="lg:col-span-9">
        <div id="admin-data" class="space-y-6">
          <div class="admin-card p-8 text-center text-mutedgt">Sign in to load admin records.</div>
        </div>
      </div>
    </div>
  </div>
</section>
`
