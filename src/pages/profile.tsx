import { html, raw } from 'hono/html'
import { companyProfile as co } from '../data/company'

export const ProfilePage = () => html`
<section class="relative bg-[#060B10] pt-32 pb-12 border-b border-white/[0.08]">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">User Profile</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display leading-[1.06] text-white">
      Account <span class="text-gradient-emerald">Profile</span>
    </h1>
    <p class="mt-2 text-xs sm:text-sm text-[#788A9C] leading-relaxed">
      Manage your access credentials, quotation history, and direct correspondence with Gumti Textiles.
    </p>
  </div>
</section>

<section class="bg-[#08111A] py-12 lg:py-20 min-h-[65vh]">
  <div class="max-w-[1200px] mx-auto px-5 lg:px-10">
    
    <!-- User Profile Header Card -->
    <div class="glass-panel p-6 sm:p-10 rounded-3xl border border-white/[0.08] shadow-2xl mb-8 relative overflow-hidden">
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-[#00E599]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div class="flex items-center gap-5">
          <div id="prof-avatar-container" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#00E599] to-[#008F5D] p-0.5 shadow-[0_0_20px_rgba(0,229,153,0.3)] shrink-0 overflow-hidden flex items-center justify-center text-white text-2xl font-bold font-display">
            <span id="prof-avatar-text">U</span>
            <img id="prof-avatar-img" src="" alt="Profile" class="w-full h-full object-cover rounded-2xl hidden" referrerpolicy="no-referrer" />
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h2 id="prof-name" class="text-xl sm:text-3xl font-bold font-display text-white">Loading Profile…</h2>
              <span id="prof-role-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30">CUSTOMER</span>
            </div>
            <p id="prof-email" class="text-xs sm:text-sm text-[#788A9C] font-mono mt-1">checking authentication…</p>
            <p id="prof-uid" class="text-[10px] text-[#788A9C]/70 font-mono mt-0.5">UID: —</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button id="prof-signout-btn" data-signout type="button" class="px-5 py-2.5 rounded-full border border-white/[0.12] text-xs font-semibold text-[#CBD5E1] hover:text-white hover:border-white/30 transition-colors cursor-pointer">
            <i class="fa-solid fa-arrow-right-from-bracket mr-1.5 text-xs"></i> Sign Out
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Navigation Hub -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Admin Hub (Only visible to admin/moderator) -->
      <div id="prof-admin-card" class="glass-card p-6 border border-[#00E599]/30 rounded-2xl flex flex-col justify-between hidden">
        <div>
          <div class="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-lg mb-4">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <span class="text-[10px] uppercase font-bold text-[#00E599] tracking-wider">Elevated Permissions</span>
          <h3 class="text-lg font-bold font-display text-white mt-1">Admin Control Center</h3>
          <p class="text-xs text-[#788A9C] mt-2 leading-relaxed">
            Access the DWISON SaaS executive dashboard, promote user roles, manage live CMS headlines, and inspect incoming RFQ pipelines.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-white/[0.06]">
          <a href="/admin" class="pill-btn-emerald py-2 px-5 text-xs w-full text-center">
            <span>Launch Admin Dashboard</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </div>

      <!-- Sourcing Records / RFQ Portal -->
      <div class="glass-card p-6 border border-white/[0.08] rounded-2xl flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF] text-lg mb-4">
            <i class="fa-solid fa-file-invoice"></i>
          </div>
          <span class="text-[10px] uppercase font-bold text-[#00D2FF] tracking-wider">Commercial Records</span>
          <h3 class="text-lg font-bold font-display text-white mt-1">My RFQs & Quotations</h3>
          <p class="text-xs text-[#788A9C] mt-2 leading-relaxed">
            Track active quotations, tech pack reviews, and critical path schedules linked to your registered email address.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-white/[0.06]">
          <a href="/portal" class="pill-btn-outline py-2 px-5 text-xs w-full text-center hover:border-[#00D2FF] hover:text-white">
            <span>View Sourcing Workspace</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </div>

      <!-- Submit New RFQ -->
      <div class="glass-card p-6 border border-white/[0.08] rounded-2xl flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white text-lg mb-4">
            <i class="fa-solid fa-shirt"></i>
          </div>
          <span class="text-[10px] uppercase font-bold text-white tracking-wider">New Production</span>
          <h3 class="text-lg font-bold font-display text-white mt-1">Book Factory Capacity</h3>
          <p class="text-xs text-[#788A9C] mt-2 leading-relaxed">
            Submit a new knitwear program with custom yarn composition, GSM, target quantities, and delivery milestones.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-white/[0.06]">
          <a href="/request-quote" class="pill-btn-emerald py-2 px-5 text-xs w-full text-center">
            <span>Submit New RFQ</span>
            <i class="fa-solid fa-plus text-[10px]"></i>
          </a>
        </div>
      </div>

      <!-- WhatsApp Live Assistance Card -->
      <div class="glass-card p-6 border border-[#25D366]/30 rounded-2xl flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] text-xl mb-4">
            <i class="fa-brands fa-whatsapp"></i>
          </div>
          <span class="text-[10px] uppercase font-bold text-[#25D366] tracking-wider">Direct WhatsApp Line</span>
          <h3 class="text-lg font-bold font-display text-white mt-1">Priority Merchandising Support</h3>
          <p class="text-xs text-[#788A9C] mt-2 leading-relaxed">
            Direct instant messaging line to our merchandising and order management desk for urgent sample approvals and production questions.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-white/[0.06]">
          <a href="https://wa.me/8801329713736?text=Hello%20Gumti%20Textiles,%20I%20am%20logged%20into%20my%20profile%20and%20would%20like%20to%20inquire%20about..." target="_blank" rel="noopener" class="py-2 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold w-full text-center inline-flex items-center justify-center gap-2 transition-colors">
            <i class="fa-brands fa-whatsapp text-sm"></i>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

    </div>

  </div>
</section>

<script>
  // Profile page auto-population and auth check
  document.addEventListener('gt:auth', (e) => {
    const detail = e.detail || {};
    const user = detail.user;
    const role = detail.role || 'customer';

    if (!user) {
      window.location.replace('/login');
      return;
    }

    const nameEl = document.getElementById('prof-name');
    const emailEl = document.getElementById('prof-email');
    const uidEl = document.getElementById('prof-uid');
    const roleBadge = document.getElementById('prof-role-badge');
    const avatarText = document.getElementById('prof-avatar-text');
    const avatarImg = document.getElementById('prof-avatar-img');
    const adminCard = document.getElementById('prof-admin-card');

    if (nameEl) nameEl.textContent = user.displayName || user.email?.split('@')[0] || 'Member';
    if (emailEl) emailEl.textContent = user.email || '';
    if (uidEl) uidEl.textContent = 'User ID: ' + (user.uid || '—');

    if (roleBadge) {
      if (role === 'admin') {
        roleBadge.textContent = 'SUPER ADMIN';
        roleBadge.className = 'px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40';
      } else if (role === 'moderator') {
        roleBadge.textContent = 'MODERATOR';
        roleBadge.className = 'px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40';
      } else {
        roleBadge.textContent = 'VERIFIED BUYER';
        roleBadge.className = 'px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/[0.08] text-[#CBD5E1] border border-white/[0.15]';
      }
    }

    if (avatarImg && user.photoURL) {
      avatarImg.src = user.photoURL;
      avatarImg.classList.remove('hidden');
      if (avatarText) avatarText.classList.add('hidden');
    } else if (avatarText) {
      const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
      avatarText.textContent = initial;
    }

    if (adminCard && (role === 'admin' || role === 'moderator')) {
      adminCard.classList.remove('hidden');
    }
  });

  // Fallback initial check
  if (typeof window.gtUser !== 'undefined') {
    if (!window.gtUser) {
      setTimeout(() => {
        if (!window.gtUser) window.location.replace('/login');
      }, 800);
    }
  }
</script>
`
