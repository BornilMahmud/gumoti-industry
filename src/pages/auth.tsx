import { html } from 'hono/html'

const AuthVisual = () => html`
  <aside class="auth-visual" aria-hidden="true">
    <div class="auth-orbit auth-orbit-one"></div>
    <div class="auth-orbit auth-orbit-two"></div>
    <div class="auth-fabric-card">
      <span class="auth-kicker">Gumti Buyer Portal</span>
      <h2>Secure access for RFQs, samples and sourcing workflows.</h2>
      <p>Inspired by natural texture and editorial calm, redesigned in Gumti's navy, sand and textile-green system.</p>
    </div>
    <div class="auth-book">
      <div class="auth-page auth-page-left"></div>
      <div class="auth-page auth-page-right"></div>
    </div>
    <span class="auth-leaf leaf-a"></span>
    <span class="auth-leaf leaf-b"></span>
    <span class="auth-leaf leaf-c"></span>
    <span class="auth-leaf leaf-d"></span>
    <span class="auth-thread"></span>
  </aside>
`

export const LoginPage = () => html`
<section class="auth-shell textile-texture">
  <div class="auth-card reveal">
    <div class="auth-panel">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-3">Buyer / Admin Access</p>
      <h1 class="auth-title">Log in</h1>
      <p class="auth-copy">Secure Firebase access for buyers and authorized admins.</p>
      <form data-auth-login class="auth-form" autocomplete="on">
        <label class="auth-input-wrap">
          <i class="fa-regular fa-envelope"></i>
          <input name="email" type="email" placeholder="Email address" required autocomplete="email" />
        </label>
        <label class="auth-input-wrap">
          <i class="fa-solid fa-lock"></i>
          <input name="password" type="password" placeholder="Password" required autocomplete="current-password" />
          <button type="button" class="auth-eye" data-toggle-password aria-label="Show password"><i class="fa-regular fa-eye-slash"></i></button>
        </label>
        <div class="auth-row">
          <label class="auth-check"><input type="checkbox" checked /> <span>remember me</span></label>
          <a href="/contact">Forgot Password?</a>
        </div>
        <button type="submit" class="auth-submit magnetic">Log in</button>
        <div class="auth-status" data-auth-status role="status"></div>
      </form>
      <div class="auth-social">
        <span>Log in with</span>
        <button data-google-signin aria-label="Continue with Google"><i class="fa-brands fa-google"></i></button>
      </div>
      <p class="auth-switch">Don't have an account? <a href="/register">Register Now</a></p>
      <p class="auth-footnote">After login, visit <a href="/portal">Buyer Portal</a> or <a href="/admin">Admin Panel</a>.</p>
    </div>
    ${AuthVisual()}
  </div>
</section>
`

export const RegisterPage = () => html`
<section class="auth-shell textile-texture">
  <div class="auth-card reveal auth-card-register">
    <div class="auth-panel">
      <p class="text-[11px] tracking-widest2 uppercase text-mutedgt mb-3">Create Firebase Account</p>
      <h1 class="auth-title">Register</h1>
      <p class="auth-copy">Create a secure buyer profile for RFQs, samples and sourcing activity.</p>
      <form data-auth-register class="auth-form" autocomplete="on">
        <label class="auth-input-wrap">
          <i class="fa-regular fa-user"></i>
          <input name="name" type="text" placeholder="Full name" required autocomplete="name" />
        </label>
        <label class="auth-input-wrap">
          <i class="fa-regular fa-building"></i>
          <input name="company" type="text" placeholder="Company name (optional)" autocomplete="organization" />
        </label>
        <label class="auth-input-wrap">
          <i class="fa-regular fa-envelope"></i>
          <input name="email" type="email" placeholder="Email address" required autocomplete="email" />
        </label>
        <label class="auth-input-wrap">
          <i class="fa-solid fa-lock"></i>
          <input name="password" type="password" placeholder="Password (minimum 6 characters)" minlength="6" required autocomplete="new-password" />
          <button type="button" class="auth-eye" data-toggle-password aria-label="Show password"><i class="fa-regular fa-eye-slash"></i></button>
        </label>
        <button type="submit" class="auth-submit magnetic">Create account</button>
        <div class="auth-status" data-auth-status role="status"></div>
      </form>
      <div class="auth-social">
        <span>Register with</span>
        <button data-google-signin aria-label="Continue with Google"><i class="fa-brands fa-google"></i></button>
      </div>
      <p class="auth-switch">Already have an account? <a href="/login">Log in</a></p>
      <p class="auth-footnote">Already registered with Google? Use the Google button on the login page.</p>
    </div>
    ${AuthVisual()}
  </div>
</section>
`
