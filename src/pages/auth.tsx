import { html } from 'hono/html'

const AuthVisual = (isRegister?: boolean) => html`
  <div class="hidden lg:flex flex-col justify-between p-10 bg-[var(--bg-card)] border-l border-[var(--border-subtle)] relative overflow-hidden">
    <div class="absolute -right-20 -top-20 w-80 h-80 bg-[#00E599]/10 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-[#00D2FF]/10 rounded-full blur-[90px] pointer-events-none"></div>

    <div class="relative z-10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E599] to-[#008F5D] flex items-center justify-center shadow-[0_0_16px_rgba(0,229,153,0.35)] p-1.5 shrink-0">
          <img src="/images/logo/textiles-logo.png" alt="Gumti Logo" class="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        <span class="text-[var(--text-primary)] font-bold text-base tracking-tight font-display">GUMTI <span class="text-[#00E599] font-normal">TEXTILES</span></span>
      </div>

      <div class="mt-12 space-y-3">
        <span class="kicker-pill">
          ${isRegister ? 'New Buyer Registration' : 'Buyer & Executive Portal'}
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)] leading-snug">
          Integrated Knitwear.<br/><span class="text-[#00E599]">Direct Factory Access.</span>
        </h2>
        <p class="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm">
          Access your commercial RFQs, lab dip approvals, and production timelines with real-time tracking from our Gazipur composite complex.
        </p>
      </div>
    </div>

    <!-- Factory Floor Preview Card -->
    <div class="relative z-10 mt-8 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <img src="/images/factory/stenter_clean_630x400.webp" alt="Gumti Plant" class="w-16 h-12 object-cover rounded-lg" />
        <div>
          <p class="text-xs font-bold text-[var(--text-primary)]">Chandra Plant, Gazipur</p>
          <p class="text-[10px] text-[#00E599] font-mono mt-0.5">● 50T Dyeing · 35k Sewing</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[var(--border-subtle)] text-[10px]">
        <div>
          <span class="text-[var(--text-muted)]">BGMEA Reg:</span>
          <span class="text-[var(--text-primary)] font-mono ml-1">2443</span>
        </div>
        <div>
          <span class="text-[var(--text-muted)]">EPB Reg:</span>
          <span class="text-[var(--text-primary)] font-mono ml-1">3311</span>
        </div>
      </div>
    </div>

    <div class="relative z-10 pt-4 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
      <span>Official Portal · Est. 1993</span>
      <span class="text-[#00E599] font-mono">SSL 256-Bit Encrypted</span>
    </div>
  </div>
`

export const LoginPage = () => html`
<script>
  if (localStorage.getItem('gt_auth_user') || (typeof window !== 'undefined' && window.gtUser)) {
    window.location.replace('/profile');
  }
</script>

<div class="min-h-[calc(100vh-74px)] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[var(--bg-canvas)] transition-colors">
  <div class="w-full max-w-4xl editorial-card grid lg:grid-cols-12 overflow-hidden shadow-2xl">
    
    <!-- Left Form Section -->
    <div class="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[var(--bg-surface)]">
      <div>
        <div class="flex items-center justify-between gap-4 mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-[#00E599]">Client Workspace</span>
          <a href="/register" class="text-xs text-[var(--text-muted)] hover:text-[#00E599] transition-colors">
            Need an account? <strong class="underline">Register</strong>
          </a>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)]">Sign In</h1>
        <p class="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
          Sign in with your verified company email address to access sourcing workflows.
        </p>

        <!-- Google One-Click Button -->
        <div class="mt-6">
          <button data-google-signin type="button" class="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-medium)] hover:border-[#00E599] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-3 transition-colors cursor-pointer">
            <i class="fa-brands fa-google text-sm text-[#00E599]"></i>
            <span>Continue with Google</span>
          </button>
        </div>

        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-[var(--border-subtle)]"></div>
          <span class="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Or with credentials</span>
          <div class="flex-1 h-px bg-[var(--border-subtle)]"></div>
        </div>

        <form data-auth-login class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="login-email">Business Email</label>
            <input id="login-email" name="email" type="email" required autocomplete="email" class="w-full rounded-xl p-2.5 text-xs" placeholder="buyer@brand.com" />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider" for="login-password">Password</label>
            </div>
            <div class="relative auth-input-wrap">
              <input id="login-password" name="password" type="password" required autocomplete="current-password" class="w-full rounded-xl p-2.5 pr-10 text-xs" placeholder="••••••••" />
              <button data-toggle-password type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 text-xs cursor-pointer" aria-label="Toggle password visibility">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
          </div>

          <div data-auth-status class="text-xs min-h-[18px]"></div>

          <button type="submit" class="pill-btn-emerald w-full py-3 text-xs mt-2 cursor-pointer">
            <span>Sign In to Portal</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </form>
      </div>

      <div class="pt-6 mt-6 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
        Official corporate manufacturer for European and North American retail brands.
      </div>
    </div>

    <!-- Right Visual Section -->
    <div class="lg:col-span-5 hidden lg:block">
      ${AuthVisual(false)}
    </div>

  </div>
</div>
`

export const RegisterPage = () => html`
<script>
  if (localStorage.getItem('gt_auth_user') || (typeof window !== 'undefined' && window.gtUser)) {
    window.location.replace('/profile');
  }
</script>

<div class="min-h-[calc(100vh-74px)] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[var(--bg-canvas)] transition-colors">
  <div class="w-full max-w-4xl editorial-card grid lg:grid-cols-12 overflow-hidden shadow-2xl">
    
    <!-- Left Form Section -->
    <div class="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[var(--bg-surface)]">
      <div>
        <div class="flex items-center justify-between gap-4 mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-[#00E599]">Buyer Onboarding</span>
          <a href="/login" class="text-xs text-[var(--text-muted)] hover:text-[#00E599] transition-colors">
            Have an account? <strong class="underline">Sign In</strong>
          </a>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)]">Create Buyer Account</h1>
        <p class="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
          Direct factory access for fashion buyers, sourcing managers, and merchandising teams.
        </p>

        <!-- Google One-Click Button -->
        <div class="mt-6">
          <button data-google-signin type="button" class="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-medium)] hover:border-[#00E599] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-3 transition-colors cursor-pointer">
            <i class="fa-brands fa-google text-sm text-[#00E599]"></i>
            <span>Register with Google</span>
          </button>
        </div>

        <div class="my-5 flex items-center gap-3">
          <div class="flex-1 h-px bg-[var(--border-subtle)]"></div>
          <span class="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Or with company email</span>
          <div class="flex-1 h-px bg-[var(--border-subtle)]"></div>
        </div>

        <form data-auth-register class="space-y-3.5">
          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1" for="reg-name">Your Full Name</label>
              <input id="reg-name" name="name" required autocomplete="name" class="w-full rounded-xl p-2.5 text-xs" placeholder="e.g. Sarah Jenkins" />
            </div>
            <div>
              <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1" for="reg-company">Brand / Company</label>
              <input id="reg-company" name="company" required class="w-full rounded-xl p-2.5 text-xs" placeholder="e.g. Norma Apparel" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1" for="reg-email">Work Email Address</label>
            <input id="reg-email" name="email" type="email" required autocomplete="email" class="w-full rounded-xl p-2.5 text-xs" placeholder="sarah@norma.com" />
          </div>

          <div>
            <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1" for="reg-password">Create Password</label>
            <div class="relative auth-input-wrap">
              <input id="reg-password" name="password" type="password" minlength="6" required autocomplete="new-password" class="w-full rounded-xl p-2.5 pr-10 text-xs" placeholder="Min 6 characters" />
              <button data-toggle-password type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 text-xs cursor-pointer" aria-label="Toggle password visibility">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
          </div>

          <div data-auth-status class="text-xs min-h-[18px]"></div>

          <button type="submit" class="pill-btn-emerald w-full py-3 text-xs mt-2 cursor-pointer">
            <span>Create Sourcing Account</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </form>
      </div>

      <div class="pt-4 mt-4 border-t border-[var(--border-subtle)] text-center text-[11px] text-[var(--text-muted)]">
        By registering you agree to Gumti Textiles <a href="/terms" class="underline">Terms</a> and <a href="/privacy" class="underline">Privacy Policy</a>.
      </div>
    </div>

    <!-- Right Visual Section -->
    <div class="lg:col-span-5 hidden lg:block">
      ${AuthVisual(true)}
    </div>

  </div>
</div>
`
