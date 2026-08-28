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
      <aside class="lg:col-span-4 admin-card p-8">
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Secure access</p>
        <h2 class="font-serif text-3xl text-navy mt-3">Admin Sign-In</h2>
        <p class="text-sm text-mutedgt leading-relaxed mt-4">Authorized admin emails: <strong>bornilmahmud56@gmail.com</strong> and <strong>bonrilmahmud56@gmail.com</strong>.</p>
        <p class="mt-3 text-xs text-mutedgt">Signed in as: <span id="admin-user-email">Not signed in</span></p>
        <div class="mt-7 flex flex-wrap gap-3">
          <button data-google-signin class="magnetic bg-navy text-white font-semibold px-6 py-3 text-sm tracking-wide hover:bg-ink"><i class="fa-brands fa-google mr-2"></i>Sign in with Google</button>
          <a href="/login" class="border border-navy/30 text-navy px-6 py-3 text-sm tracking-wide hover:border-navy">Email Login</a>
          <button data-signout class="border border-navy/30 text-navy px-6 py-3 text-sm tracking-wide hover:border-navy">Sign out</button>
        </div>
        <button id="admin-refresh" class="mt-4 w-full bg-sand text-navy font-semibold px-6 py-3 text-sm tracking-wide hover:bg-white">Load / Refresh Admin Data</button>
        <div class="mt-8 border-t border-sand/40 pt-6 text-xs text-mutedgt leading-relaxed">
          <p>Admin records load automatically after a valid Firebase login. Use refresh only if the page was already open.</p>
        </div>
      </aside>
      <div class="lg:col-span-8">
        <div id="admin-data" class="space-y-6">
          <div class="admin-card p-8 text-center text-mutedgt">Sign in to load admin records.</div>
        </div>
      </div>
    </div>
  </div>
</section>
`
