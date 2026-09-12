import { html } from 'hono/html'

export const AdminPage = () => html`
<div class="dash-layout relative">
  <!-- Mobile Sidebar Backdrop -->
  <div id="admin-sidebar-backdrop" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 hidden lg:hidden transition-opacity"></div>
  
  <!-- ================= LEFT EXECUTIVE SIDEBAR (Reference 2: DWISON) ================= -->
  <aside id="admin-sidebar" class="dash-sidebar">
    <div class="flex items-center justify-between pb-3 mb-4 lg:hidden border-b border-white/[0.08]">
      <span class="text-xs font-bold text-white uppercase tracking-wider">Control Navigation</span>
      <button id="admin-sidebar-close" type="button" class="text-white hover:text-[#00E599] p-1.5 cursor-pointer" aria-label="Close sidebar">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
    </div>

    <!-- User Profile Pill -->
    <div class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E599] to-[#008F5D] text-[#050B10] font-bold flex items-center justify-center text-xs shrink-0">
        <i class="fa-solid fa-user-shield text-sm"></i>
      </div>
      <div class="overflow-hidden flex-1">
        <div id="admin-user-email" class="text-xs font-bold text-white truncate">Checking access…</div>
        <span class="text-[10px] text-[#00E599] font-mono font-medium">Verified Admin</span>
      </div>
    </div>

    <!-- Quick Search -->
    <div class="relative mb-6">
      <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
      <input id="admin-search-input" type="text" placeholder="Search operations…" class="w-full bg-[#08111A] border border-white/[0.08] rounded-xl pl-9 pr-12 py-2 text-xs text-white placeholder-[#4B5A6A] outline-none focus:border-[#00E599]" />
      <span class="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-[#788A9C] font-mono">⌘K</span>
    </div>

    <!-- Navigation Sections -->
    <div class="space-y-6 flex-1 overflow-y-auto">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[#4B5A6A] px-3 mb-2">Dashboards</p>
        <nav class="space-y-1">
          <button type="button" class="dash-nav-item active w-full text-left cursor-pointer" data-tab="overview">
            <i class="fa-solid fa-table-cells-large text-xs"></i> Overview
          </button>
          <button type="button" class="dash-nav-item w-full text-left cursor-pointer" data-tab="cms">
            <i class="fa-solid fa-pen-to-square text-xs"></i> Landing Page CMS
          </button>
          <button type="button" class="dash-nav-item w-full text-left cursor-pointer" data-tab="media">
            <i class="fa-regular fa-images text-xs"></i> Media Library (29)
          </button>
          <button type="button" class="dash-nav-item w-full text-left cursor-pointer" data-tab="users">
            <i class="fa-solid fa-users-gear text-xs"></i> User Directory & RBAC
          </button>
          <button type="button" class="dash-nav-item w-full text-left cursor-pointer" data-tab="rfqs">
            <i class="fa-solid fa-file-invoice-dollar text-xs"></i> RFQs & Intake
          </button>
        </nav>
      </div>

      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[#4B5A6A] px-3 mb-2">Factory Governance</p>
        <nav class="space-y-1">
          <a href="/" target="_blank" class="dash-nav-item">
            <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> View Public Site
          </a>
          <button id="admin-refresh" type="button" class="dash-nav-item w-full text-left cursor-pointer">
            <i class="fa-solid fa-rotate text-xs"></i> Refresh Database
          </button>
        </nav>
      </div>
    </div>

    <!-- Sign In / Out Footer -->
    <div class="pt-4 border-t border-white/[0.08] flex items-center justify-between">
      <button data-google-signin class="text-xs font-semibold text-[#00E599] hover:underline inline-flex items-center gap-1.5 cursor-pointer">
        <i class="fa-brands fa-google"></i> Google Login
      </button>
      <button data-signout class="text-xs text-[#788A9C] hover:text-white cursor-pointer">
        Sign out
      </button>
    </div>
  </aside>

  <!-- ================= MAIN DASHBOARD CANVAS ================= -->
  <main class="flex-1 bg-[#060B10] p-4 sm:p-6 lg:p-10 overflow-y-auto min-w-0">
    <!-- Top Header Bar (Reference 2) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-white/[0.08]">
      <div class="flex items-center gap-3">
        <button id="admin-sidebar-toggle" type="button" class="lg:hidden p-2 rounded-xl bg-[#0D1622] border border-white/[0.08] text-white hover:border-[#00E599]/40 text-sm shrink-0" aria-label="Open control navigation">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div>
          <div class="flex items-center gap-2 text-xs text-[#788A9C]">
            <span>Dashboards</span>
            <span>/</span>
            <span id="admin-breadcrumb-tab" class="text-white font-medium">Overview</span>
          </div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-white mt-1">Executive Control Center</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-full bg-[#00E599]/10 border border-[#00E599]/30 text-xs font-bold text-[#00E599]">
          ● System Healthy
        </span>
        <button id="admin-refresh-top" type="button" class="p-2.5 rounded-xl bg-[#0D1622] border border-white/[0.08] text-white hover:border-[#00E599]/40 text-xs transition-colors cursor-pointer" title="Refresh Live Data">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>
    </div>

    <!-- Responsive Quick Tab Strip (Mobile & Laptop) -->
    <div class="lg:hidden flex items-center gap-2 overflow-x-auto py-3 border-b border-white/[0.08] scrollbar-none">
      <button type="button" class="dash-nav-pill active whitespace-nowrap cursor-pointer" data-tab="overview"><i class="fa-solid fa-table-cells-large mr-1.5 text-xs"></i>Overview</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer" data-tab="cms"><i class="fa-solid fa-pen-to-square mr-1.5 text-xs"></i>CMS</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer" data-tab="media"><i class="fa-regular fa-images mr-1.5 text-xs"></i>Media</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer" data-tab="users"><i class="fa-solid fa-users-gear mr-1.5 text-xs"></i>Users</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer" data-tab="rfqs"><i class="fa-solid fa-file-invoice-dollar mr-1.5 text-xs"></i>RFQs</button>
    </div>

    <!-- Dynamic Container: Authenticated Dashboard or Auth Prompt -->
    <div id="admin-data" class="mt-6 sm:mt-8">
      <div id="admin-initial-state" class="dash-kpi-card p-12 text-center text-[#788A9C] border border-white/[0.1] max-w-lg mx-auto">
        <i class="fa-solid fa-shield-halved text-4xl text-[#00E599] mb-4 block"></i>
        <h2 class="text-xl font-bold text-white">Authentication Required</h2>
        <p class="mt-2 text-xs text-[#788A9C] leading-relaxed">
          Sign in with an authorized administrator account (<code class="text-[#00E599] font-mono">bornilmahmud56@gmail.com</code>) to unlock the live control center.
        </p>
        <div class="mt-6 flex justify-center gap-3">
          <button data-google-signin class="pill-btn-emerald py-2.5 px-5 text-xs">
            <i class="fa-brands fa-google mr-1.5"></i> Sign in with Google
          </button>
          <a href="/login" class="pill-btn-outline py-2.5 px-5 text-xs">Email Login</a>
        </div>
      </div>
    </div>

  </main>
</div>
`
