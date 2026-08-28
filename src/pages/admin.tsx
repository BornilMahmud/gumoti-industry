import { html } from 'hono/html'

export const AdminPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-16 textile-texture">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Admin Panel</p>
    <h1 class="font-serif text-5xl lg:text-[76px] leading-[.92] tracking-[-.055em]">OPERATIONS<br/>CONTROL ROOM</h1>
    <p class="mt-6 max-w-xl text-white/60 text-sm leading-relaxed">Secure Google login for authorized Gumti administrators. Review RFQs, inquiries, sample requests and job applications from the D1 database.</p>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <div class="grid lg:grid-cols-12 gap-8 items-start">
      <aside class="lg:col-span-4 admin-card p-8">
        <p class="text-[11px] tracking-widest2 uppercase text-mutedgt">Login mechanism</p>
        <h2 class="font-serif text-3xl text-navy mt-3">Google Admin Sign-In</h2>
        <p class="text-sm text-mutedgt leading-relaxed mt-4">Only Google accounts listed in the server-side <code>ADMIN_EMAILS</code> allowlist can load admin data. Default allowlist includes <strong>info@gumtitextiles.com</strong>; edit it before production if your admin Google email is different.</p>
        <div class="mt-7 flex flex-wrap gap-3">
          <button data-google-signin class="magnetic bg-navy text-white font-semibold px-6 py-3 text-sm tracking-wide hover:bg-ink"><i class="fa-brands fa-google mr-2"></i>Sign in with Google</button>
          <button data-signout class="border border-navy/30 text-navy px-6 py-3 text-sm tracking-wide hover:border-navy">Sign out</button>
        </div>
        <button id="admin-refresh" class="mt-4 w-full bg-sand text-navy font-semibold px-6 py-3 text-sm tracking-wide hover:bg-white">Load / Refresh Admin Data</button>
        <div class="mt-8 border-t border-sand/40 pt-6 text-xs text-mutedgt leading-relaxed">
          <p class="font-semibold text-navy">How to log in:</p>
          <ol class="list-decimal ml-4 mt-2 space-y-1">
            <li>Open <code>/admin</code>.</li>
            <li>Click <strong>Sign in with Google</strong>.</li>
            <li>Use a Google account listed in <code>ADMIN_EMAILS</code>.</li>
            <li>Click <strong>Load / Refresh Admin Data</strong>.</li>
          </ol>
        </div>
      </aside>
      <div class="lg:col-span-8">
        <div id="admin-data" class="space-y-6">
          <div class="admin-card p-8 text-center text-mutedgt">Sign in and click refresh to load records.</div>
        </div>
      </div>
    </div>
  </div>
</section>
`
