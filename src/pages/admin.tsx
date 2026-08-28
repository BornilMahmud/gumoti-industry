import { html } from 'hono/html'

export const AdminPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-16 textile-texture">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3 hero-kicker"><span class="w-10 h-px bg-sand inline-block"></span>Gumti Control Center</p>
    <h1 class="font-serif text-5xl lg:text-[76px] leading-[.92] tracking-[-.055em]"><span class="hero-line"><span>Operations</span></span><br/><span class="hero-line"><span class="text-sand">Dashboard</span></span></h1>
    <p class="mt-6 max-w-xl text-white/60 leading-relaxed hero-copy">Live D1 workflows — RFQs, quotations, samples, orders, customers, verification, users &amp; roles, audit logs and AI analytics.</p>
  </div>
</section>

<section class="bg-ivory py-14 lg:py-20">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="admin-card p-6 lg:p-7 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 admin-anim-in">
      <div class="flex items-center gap-4">
        <span class="inline-flex w-12 h-12 items-center justify-center bg-navy text-sand text-lg"><i class="fa-solid fa-shield-halved"></i></span>
        <div>
          <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">RBAC-secured admin</p>
          <p class="text-sm text-navy mt-1">Signed in as: <span id="admin-user-email" class="font-semibold">Not signed in</span></p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button data-google-signin class="bg-navy text-white font-semibold px-4 py-2.5 text-xs tracking-wide hover:bg-ink transition-colors"><i class="fa-brands fa-google mr-2"></i>Google</button>
        <a href="/login" class="border border-navy/30 text-navy px-4 py-2.5 text-xs tracking-wide hover:border-navy transition-colors inline-flex items-center">Email Login</a>
        <button data-signout class="border border-navy/30 text-navy px-4 py-2.5 text-xs tracking-wide hover:border-navy transition-colors">Sign out</button>
        <button id="admin-refresh" class="bg-sand text-navy font-semibold px-5 py-2.5 text-xs tracking-wide hover:bg-white transition-colors"><i class="fa-solid fa-rotate mr-2"></i>Refresh</button>
      </div>
    </div>
    <div id="admin-data" class="space-y-6">
      <div class="admin-card p-10 text-center text-mutedgt admin-anim-in">
        <span class="inline-flex w-14 h-14 items-center justify-center bg-navy text-sand text-xl mb-4"><i class="fa-solid fa-lock"></i></span>
        <p class="font-serif text-2xl text-navy">Sign in to open the Control Center</p>
        <p class="text-sm mt-2">Your D1 role (Super Admin, Sales, Merchandising, Production, Quality, Content…) determines the modules and actions available.</p>
      </div>
    </div>
  </div>
</section>
`
