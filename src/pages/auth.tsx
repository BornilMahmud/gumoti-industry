import { html } from 'hono/html'

const AuthVisual = (isRegister?: boolean) => html`
  <div class="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#0C1724] to-[#060B10] border-l border-white/[0.08] relative overflow-hidden">
    <div class="absolute -right-20 -top-20 w-80 h-80 bg-[#00E599]/10 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-[#00D2FF]/10 rounded-full blur-[90px] pointer-events-none"></div>

    <div class="relative z-10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E599] to-[#008F5D] flex items-center justify-center shadow-[0_0_16px_rgba(0,229,153,0.35)] p-1.5 flex-shrink-0">
          <img src="/images/logo/textiles-logo.png" alt="Gumti Logo" class="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        <span class="text-white font-bold text-base tracking-tight font-display">GUMTI <span class="text-[#00E599] font-normal">TEXTILES</span></span>
      </div>

      <div class="mt-12 space-y-3">
        <span class="px-2.5 py-1 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[10px] font-bold text-[#00E599] uppercase tracking-wider">
          ${isRegister ? 'New Buyer Registration' : 'Buyer & Executive Portal'}
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-display text-white leading-snug">
          Integrated Knitwear.<br/><span class="text-gradient-emerald">Direct Factory Access.</span>
        </h2>
        <p class="text-xs text-[#788A9C] leading-relaxed max-w-sm">
          Access your commercial RFQs, lab dip approvals, and production timelines with real-time tracking from our Gazipur composite complex.
        </p>
      </div>
    </div>

    <!-- Factory Floor Preview Card -->
    <div class="relative z-10 mt-8 rounded-xl overflow-hidden border border-white/[0.1] bg-[#070D14]/80 p-4 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <img src="/images/factory/stenter_clean_630x400.webp" alt="Gumti Plant" class="w-16 h-12 object-cover rounded-lg" />
        <div>
          <p class="text-xs font-bold text-white">Chandra Plant, Gazipur</p>
          <p class="text-[10px] text-[#00E599] font-mono mt-0.5">● 50T Dyeing · 35k Sewing</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.06] text-[10px]">
        <div>
          <span class="text-[#788A9C]">BGMEA Reg:</span>
          <span class="text-white font-mono ml-1">2443</span>
        </div>
        <div>
          <span class="text-[#788A9C]">EPB Reg:</span>
          <span class="text-white font-mono ml-1">3311</span>
        </div>
      </div>
    </div>

    <div class="relative z-10 pt-4 text-[11px] text-[#788A9C] flex items-center justify-between">
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
<section class="min-h-screen bg-[#060B10] flex items-center justify-center py-28 px-5">
  <div class="max-w-4xl w-full glass-panel overflow-hidden border border-white/[0.1] rounded-3xl shadow-2xl grid lg:grid-cols-12">
    
    <!-- Form Side -->
    <div class="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
      <div>
        <span class="kicker-pill mb-3">Portal Authentication</span>
        <h1 class="text-3xl font-extrabold font-display text-white">Sign In</h1>
        <p class="text-xs text-[#788A9C] mt-2">Enter your verified credentials to access RFQs and production tracking.</p>

        <!-- Google One-Click Button -->
        <div class="mt-6">
          <button data-google-signin type="button" class="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-white/[0.25] text-xs font-bold text-white flex items-center justify-center gap-3 transition-colors cursor-pointer">
            <i class="fa-brands fa-google text-sm text-[#00E599]"></i>
            <span>Continue with Google</span>
          </button>
          <div class="relative my-6 text-center">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/[0.08]"></div></div>
            <span class="relative bg-[#0C1520] px-3 text-[10px] uppercase font-semibold text-[#788A9C] tracking-wider">or sign in with email</span>
          </div>
        </div>

        <form data-auth-login class="space-y-4" autocomplete="on">
          <div>
            <label class="field-label-dark">Business Email</label>
            <div class="relative">
              <i class="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
              <input name="email" type="email" class="field-dark pl-9 text-xs" placeholder="buyer@company.com" required autocomplete="email" />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="field-label-dark mb-0">Password</label>
              <a href="/contact" class="text-[11px] text-[#00E599] hover:underline">Forgot password?</a>
            </div>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
              <input name="password" type="password" class="field-dark pl-9 pr-10 text-xs" placeholder="••••••••" required autocomplete="current-password" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#788A9C] hover:text-white" data-toggle-password aria-label="Toggle password visibility">
                <i class="fa-regular fa-eye-slash"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="pill-btn-emerald w-full py-3 text-xs mt-2 cursor-pointer">
            <span>Authenticate & Access</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>

          <div class="text-xs pt-1" data-auth-status role="status"></div>
        </form>
      </div>

      <div class="pt-8 border-t border-white/[0.06] text-xs text-[#788A9C] flex items-center justify-between mt-6">
        <span>Don't have an account yet?</span>
        <a href="/register" class="text-[#00E599] font-bold hover:underline">Create Account</a>
      </div>
    </div>

    <!-- Visual Side -->
    <div class="lg:col-span-5 hidden lg:block">
      ${AuthVisual(false)}
    </div>

  </div>
</section>
`

export const RegisterPage = () => html`
<script>
  if (localStorage.getItem('gt_auth_user') || (typeof window !== 'undefined' && window.gtUser)) {
    window.location.replace('/profile');
  }
</script>
<section class="min-h-screen bg-[#060B10] flex items-center justify-center py-28 px-5">
  <div class="max-w-4xl w-full glass-panel overflow-hidden border border-white/[0.1] rounded-3xl shadow-2xl grid lg:grid-cols-12">
    
    <!-- Form Side -->
    <div class="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
      <div>
        <span class="kicker-pill mb-3">Portal Registration</span>
        <h1 class="text-3xl font-extrabold font-display text-white">Create Account</h1>
        <p class="text-xs text-[#788A9C] mt-2">Register to request bulk production quotes and order samples.</p>

        <!-- Google One-Click Button -->
        <div class="mt-6">
          <button data-google-signin type="button" class="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-white/[0.25] text-xs font-bold text-white flex items-center justify-center gap-3 transition-colors cursor-pointer">
            <i class="fa-brands fa-google text-sm text-[#00E599]"></i>
            <span>Register with Google</span>
          </button>
          <div class="relative my-6 text-center">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/[0.08]"></div></div>
            <span class="relative bg-[#0C1520] px-3 text-[10px] uppercase font-semibold text-[#788A9C] tracking-wider">or register with email</span>
          </div>
        </div>

        <form data-auth-register class="space-y-3.5" autocomplete="on">
          <div>
            <label class="field-label-dark">Full Name *</label>
            <div class="relative">
              <i class="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
              <input name="name" type="text" class="field-dark pl-9 text-xs" placeholder="Full Name" required autocomplete="name" />
            </div>
          </div>

          <div>
            <label class="field-label-dark">Company / Organization</label>
            <div class="relative">
              <i class="fa-regular fa-building absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
              <input name="company" type="text" class="field-dark pl-9 text-xs" placeholder="Brand / Buying House" autocomplete="organization" />
            </div>
          </div>

          <div>
            <label class="field-label-dark">Business Email *</label>
            <div class="relative">
              <i class="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
              <input name="email" type="email" class="field-dark pl-9 text-xs" placeholder="buyer@company.com" required autocomplete="email" />
            </div>
          </div>

          <div>
            <label class="field-label-dark">Password (min 6 chars) *</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#788A9C]"></i>
              <input name="password" type="password" minlength="6" class="field-dark pl-9 pr-10 text-xs" placeholder="••••••••" required autocomplete="new-password" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#788A9C] hover:text-white" data-toggle-password aria-label="Toggle password visibility">
                <i class="fa-regular fa-eye-slash"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="pill-btn-emerald w-full py-3 text-xs mt-2 cursor-pointer">
            <span>Create Verified Profile</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>

          <div class="text-xs pt-1" data-auth-status role="status"></div>
        </form>
      </div>

      <div class="pt-8 border-t border-white/[0.06] text-xs text-[#788A9C] flex items-center justify-between mt-6">
        <span>Already registered?</span>
        <a href="/login" class="text-[#00E599] font-bold hover:underline">Log in</a>
      </div>
    </div>

    <!-- Visual Side -->
    <div class="lg:col-span-5 hidden lg:block">
      ${AuthVisual(true)}
    </div>

  </div>
</section>
`
