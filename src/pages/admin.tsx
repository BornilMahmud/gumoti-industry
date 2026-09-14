import { html } from 'hono/html'

export const AdminPage = () => html`
<div class="dash-layout relative min-h-screen bg-[var(--bg-canvas)] text-[var(--text-secondary)] transition-colors flex flex-col lg:flex-row w-full">
  <!-- Mobile Sidebar Backdrop -->
  <div id="admin-sidebar-backdrop" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 hidden lg:hidden transition-opacity"></div>
  
  <!-- ================= LEFT EXECUTIVE OPERATIONS SIDEBAR ================= -->
  <aside id="admin-sidebar" class="dash-sidebar w-full lg:w-72 lg:shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-5 flex flex-col justify-between lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto z-30">
    <div>
      <div class="flex items-center justify-between pb-3 mb-4 lg:hidden border-b border-[var(--border-subtle)]">
        <span class="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Operations Control</span>
        <button id="admin-sidebar-close" type="button" class="text-[var(--text-muted)] hover:text-[#00E599] p-1.5 cursor-pointer" aria-label="Close sidebar">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- User Profile Pill -->
      <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] mb-6">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E599] to-[#008F5D] text-[#050B10] font-bold flex items-center justify-center text-xs shrink-0">
          <i class="fa-solid fa-user-shield text-sm"></i>
        </div>
        <div class="overflow-hidden flex-1">
          <div id="admin-user-email" class="text-xs font-bold text-[var(--text-primary)] truncate">Checking credentials…</div>
          <span class="text-[10px] text-[#00E599] font-mono font-medium">Operations Console</span>
        </div>
      </div>

      <!-- Quick Search -->
      <div class="relative mb-6">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]"></i>
        <input id="admin-search-input" type="text" placeholder="Search operations…" class="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[#00E599]" />
      </div>

      <!-- Navigation Tabs -->
      <div class="space-y-6">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">Operations Modules</p>
          <nav class="space-y-1">
            <button type="button" class="dash-nav-item active w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="overview">
              <i class="fa-solid fa-table-cells-large text-xs text-[#00E599] w-4"></i> Overview & Dashboard
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="company">
              <i class="fa-solid fa-building text-xs text-emerald-500 w-4"></i> Company Basic Info
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="contact">
              <i class="fa-solid fa-address-book text-xs text-[#00E599] w-4"></i> Contact Coordinates
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="cms">
              <i class="fa-solid fa-image text-xs text-purple-400 w-4"></i> Landing Page & Images
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="products">
              <i class="fa-solid fa-shirt text-xs text-[#E5C378] w-4"></i> Product Catalog & Images
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="rfqs">
              <i class="fa-solid fa-file-invoice-dollar text-xs text-[#00D2FF] w-4"></i> RFQ Pipeline
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="quotations">
              <i class="fa-solid fa-calculator text-xs text-emerald-400 w-4"></i> Quotation Builder
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="media">
              <i class="fa-regular fa-images text-xs text-sky-400 w-4"></i> Media Library (29)
            </button>
            <button type="button" class="dash-nav-item w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]" data-tab="users">
              <i class="fa-solid fa-users-gear text-xs text-amber-400 w-4"></i> User Directory & RBAC
            </button>
          </nav>
        </div>

        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">Governance</p>
          <nav class="space-y-1">
            <a href="/" target="_blank" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]">
              <i class="fa-solid fa-arrow-up-right-from-square text-xs w-4"></i> View Public Site
            </a>
            <button id="admin-refresh" type="button" class="w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]">
              <i class="fa-solid fa-rotate text-xs w-4"></i> Refresh D1 Database
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Sign In / Out Footer -->
    <div class="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
      <button data-google-signin class="text-xs font-semibold text-[#00E599] hover:underline inline-flex items-center gap-1.5 cursor-pointer">
        <i class="fa-brands fa-google"></i> Google Login
      </button>
      <button data-signout class="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
        Sign out
      </button>
    </div>
  </aside>

  <!-- ================= MAIN DASHBOARD CANVAS ================= -->
  <main class="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto min-w-0">
    <!-- Top Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[var(--border-subtle)]">
      <div class="flex items-center gap-3">
        <button id="admin-sidebar-toggle" type="button" class="lg:hidden p-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm shrink-0" aria-label="Open navigation">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div>
          <div class="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>Operations Console</span>
            <span>/</span>
            <span id="admin-breadcrumb-tab" class="text-[var(--text-primary)] font-medium">Overview</span>
          </div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-[var(--text-primary)] mt-1">Industrial Operations Console</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-full bg-[#00E599]/10 border border-[#00E599]/30 text-xs font-bold text-[#00E599]">
          ● System Healthy
        </span>
        <button id="admin-refresh-top" type="button" class="p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#00E599] text-xs transition-colors cursor-pointer" title="Refresh Live Data">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>
    </div>

    <!-- Responsive Tab Strip (Mobile) -->
    <div class="lg:hidden flex items-center gap-2 overflow-x-auto py-3 border-b border-[var(--border-subtle)] scrollbar-none">
      <button type="button" class="dash-nav-pill active whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-primary)]" data-tab="overview">Overview</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="company">Basic Info</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="contact">Contact Info</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="cms">Landing Images</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="products">Products</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="rfqs">RFQs</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="quotations">Quotes</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="media">Media</button>
      <button type="button" class="dash-nav-pill whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full text-xs bg-[var(--bg-input)] text-[var(--text-secondary)]" data-tab="users">Users</button>
    </div>

    <!-- Dynamic Container: Authenticated Dashboard or Auth Prompt -->
    <div id="admin-data" class="mt-6 sm:mt-8">
      <div id="admin-initial-state" class="editorial-card p-12 text-center max-w-lg mx-auto">
        <i class="fa-solid fa-shield-halved text-4xl text-[#00E599] mb-4 block"></i>
        <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Authentication Required</h2>
        <p class="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
          Sign in with an authorized administrator account (<code class="text-[#00E599] font-mono">bornilmahmud56@gmail.com</code>) to unlock the operations control center.
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
