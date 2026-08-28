// Gumti Textiles — Firebase integration (Auth: Google Sign-In, Firestore, Analytics)
// Firebase web config values are public identifiers by design; security is
// enforced through Firebase Auth + Firestore Security Rules.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
  onAuthStateChanged, signOut,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
import {
  getFirestore, collection, addDoc, doc, setDoc, query, where, orderBy, getDocs, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyAfktRJb8jC72Q3uwU-Cv1fxZdqmHUXluA',
  authDomain: 'gumoti-tex.firebaseapp.com',
  projectId: 'gumoti-tex',
  storageBucket: 'gumoti-tex.firebasestorage.app',
  messagingSenderId: '436678384341',
  appId: '1:436678384341:web:e2f9b1abd04945910ee05c',
  measurementId: 'G-BC094S3FP2',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Analytics is optional — it fails in restricted/iframe contexts, never block on it.
try {
  const { getAnalytics } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js')
  getAnalytics(app)
} catch (_) { /* analytics unavailable in this context */ }

const provider = new GoogleAuthProvider()
const ADMIN_EMAILS = ['bornilmahmud56@gmail.com', 'bonrilmahmud56@gmail.com']
const DEFAULT_ADMIN_EMAIL = ADMIN_EMAILS[0]
const isAdminEmail = (email = '') => ADMIN_EMAILS.includes(String(email).toLowerCase())

// ---------- Auth state ----------
onAuthStateChanged(auth, (user) => {
  window.gtUser = user || null
  window.gtAdminToken = user ? (() => user.getIdToken(true)) : null
  if (user) ensureUserProfile(user, { provider: user.providerData?.[0]?.providerId || 'firebase' })
  document.dispatchEvent(new CustomEvent('gt:auth', { detail: user }))

  const account = document.getElementById('nav-account')
  const label = document.getElementById('nav-account-label')
  const register = document.getElementById('nav-register')
  const admin = document.getElementById('nav-admin')
  const isAdmin = !!user && isAdminEmail(user.email)
  document.documentElement.classList.add('auth-ready')
  document.querySelectorAll('[data-mobile-login]').forEach((el) => el.classList.toggle('hidden', !!user))
  document.querySelectorAll('[data-mobile-register]').forEach((el) => el.classList.toggle('hidden', !!user))
  document.querySelectorAll('[data-mobile-portal]').forEach((el) => el.classList.toggle('hidden', !user))
  document.querySelectorAll('[data-mobile-admin]').forEach((el) => el.classList.toggle('hidden', !isAdmin))
  if (account) {
    account.href = user ? '/portal' : '/login'
    account.setAttribute('aria-label', user ? 'Buyer portal' : 'Login')
  }
  if (label) label.textContent = user ? 'Portal' : 'Login'
  if (register) register.classList.toggle('auth-hidden', !!user)
  if (admin) admin.classList.toggle('auth-hidden', !isAdmin)

  // Portal page elements
  const signedOut = document.getElementById('portal-signed-out')
  const signedIn = document.getElementById('portal-signed-in')
  if (signedOut && signedIn) {
    signedOut.classList.toggle('hidden', !!user)
    signedIn.classList.toggle('hidden', !user)
    if (user) {
      const nameEl = document.getElementById('portal-user-name')
      const emailEl = document.getElementById('portal-user-email')
      const photoEl = document.getElementById('portal-user-photo')
      if (nameEl) nameEl.textContent = user.displayName || 'Buyer Account'
      if (emailEl) emailEl.textContent = user.email || ''
      if (photoEl && user.photoURL) { photoEl.src = user.photoURL; photoEl.classList.remove('hidden') }
      loadPortalData(user)
    }
  }

  // Admin page elements
  const adminEmail = document.getElementById('admin-user-email')
  if (adminEmail) adminEmail.textContent = user ? (user.email || '') : 'Not signed in'
  if (user && window.gtLoadAdmin) window.gtLoadAdmin()
})

// ---------- Google Sign-In ----------
async function googleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider)
    if (result.user) await ensureUserProfile(result.user, { provider: 'google.com' })
    window.gtToast && window.gtToast('Signed in successfully.')
  } catch (err) {
    if (err && (err.code === 'auth/popup-blocked' || err.code === 'auth/operation-not-supported-in-this-environment')) {
      try { await signInWithRedirect(auth, provider); return } catch (e2) { err = e2 }
    }
    console.error('Sign-in error:', err)
    window.gtToast && window.gtToast('Sign-in failed: ' + (err.message || err.code || 'unknown error'), false)
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-google-signin]')) { e.preventDefault(); googleSignIn() }
  if (e.target.closest('[data-signout]')) { e.preventDefault(); signOut(auth).then(() => window.gtToast && window.gtToast('Signed out.')) }
  const toggle = e.target.closest('[data-toggle-password]')
  if (toggle) {
    e.preventDefault()
    const input = toggle.closest('.auth-input-wrap')?.querySelector('input')
    if (!input) return
    input.type = input.type === 'password' ? 'text' : 'password'
    const icon = toggle.querySelector('i')
    if (icon) icon.className = input.type === 'password' ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'
  }
})

async function ensureUserProfile(user, extra = {}) {
  if (!user) return false
  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      userEmail: user.email || '',
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      isDefaultAdminEmail: isAdminEmail(user.email),
      updatedAt: serverTimestamp(),
      ...extra,
    }, { merge: true })
    return true
  } catch (err) {
    console.warn('User profile save skipped:', err.message)
    return false
  }
}

function setAuthStatus(form, msg, ok) {
  const el = form.querySelector('[data-auth-status]')
  if (!el) return
  el.textContent = msg
  el.classList.toggle('ok', ok === true)
  el.classList.toggle('bad', ok === false)
}

async function authSubmit(form, action) {
  const btn = form.querySelector('[type="submit"]')
  const original = btn ? btn.textContent : ''
  if (btn) { btn.disabled = true; btn.textContent = action === 'register' ? 'Creating account…' : 'Signing in…' }
  setAuthStatus(form, '', true)
  const fd = new FormData(form)
  const email = String(fd.get('email') || '').trim()
  const password = String(fd.get('password') || '')
  const name = String(fd.get('name') || '').trim()
  const company = String(fd.get('company') || '').trim()
  try {
    let credential
    if (action === 'register') {
      credential = await createUserWithEmailAndPassword(auth, email, password)
      if (name) await updateProfile(credential.user, { displayName: name })
      await ensureUserProfile(credential.user, { displayName: name, company, provider: 'password', role: 'buyer', createdAt: serverTimestamp() })
      setAuthStatus(form, 'Account created and saved to Firestore users/{uid}. Redirecting…', true)
    } else {
      credential = await signInWithEmailAndPassword(auth, email, password)
      await ensureUserProfile(credential.user, { provider: 'password', lastLoginAt: serverTimestamp() })
      setAuthStatus(form, 'Signed in successfully. Redirecting…', true)
    }
    window.gtToast && window.gtToast('Firebase sign-in successful.')
    setTimeout(() => {
      const isAdmin = isAdminEmail(credential.user.email)
      window.location.assign(isAdmin ? '/admin' : '/portal')
    }, 700)
  } catch (err) {
    console.error('Auth form error:', err)
    setAuthStatus(form, firebaseFriendlyError(err), false)
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = original }
  }
}

document.querySelectorAll('form[data-auth-login]').forEach((form) => form.addEventListener('submit', (e) => { e.preventDefault(); authSubmit(form, 'login') }))
document.querySelectorAll('form[data-auth-register]').forEach((form) => form.addEventListener('submit', (e) => { e.preventDefault(); authSubmit(form, 'register') }))

function firebaseFriendlyError(err) {
  const code = err?.code || ''
  if (code.includes('email-already-in-use')) return 'This email is already registered. Please log in instead.'
  if (code.includes('invalid-credential') || code.includes('wrong-password')) return 'Invalid email or password.'
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.'
  if (code.includes('operation-not-allowed')) return 'Enable Email/Password provider in Firebase Console → Authentication → Sign-in method.'
  return err?.message || 'Firebase authentication failed.'
}

// ---------- Firestore save (RFQs, contacts, samples, applications) ----------
window.gtFirestoreSave = async function (collectionName, data) {
  try {
    const clean = {}
    Object.keys(data).forEach((k) => { if (data[k] !== undefined && data[k] !== '') clean[k] = data[k] })
    clean.createdAt = serverTimestamp()
    if (auth.currentUser) { clean.uid = auth.currentUser.uid; clean.userEmail = auth.currentUser.email }
    await addDoc(collection(db, collectionName), clean)
    return true
  } catch (err) {
    // Firestore rules may restrict writes — server-side D1 storage is the source of truth.
    console.warn('Firestore mirror skipped:', err.message)
    return false
  }
}

// ---------- Buyer Portal: secured, token-verified workspace ----------
let portalData = null
let portalTab = 'rfqs'

async function loadPortalData(user) {
  const list = document.getElementById('portal-rfq-list')
  if (!list) return
  try {
    const token = await user.getIdToken()
    const res = await fetch('/api/portal/me', { headers: { Authorization: 'Bearer ' + token } })
    portalData = await res.json()
    if (!res.ok) throw new Error(portalData.error || 'Unable to load your workspace')
    renderPortalStats()
    renderPortalTab()
    bindPortalTabs()
  } catch (err) {
    list.innerHTML = `<div class="border border-dashed border-sand/60 p-8 text-center text-sm text-mutedgt">${escapeHtml(err.message || 'Unable to load your records right now.')}</div>`
  }
}

function renderPortalStats() {
  const box = document.getElementById('portal-stats')
  if (!box || !portalData) return
  const items = [
    ['RFQs', (portalData.rfqs || []).length, 'fa-file-signature'],
    ['Quotations', (portalData.quotations || []).length, 'fa-file-invoice-dollar'],
    ['Samples', (portalData.samples || []).length, 'fa-box-open'],
    ['Orders', (portalData.orders || []).length, 'fa-truck-fast'],
  ]
  box.innerHTML = items.map(([l, v, i], idx) => `
    <article class="portal-stat portal-anim-in" style="animation-delay:${idx * 70}ms">
      <i class="fa-solid ${i}"></i><strong>${v}</strong><span>${l}</span>
    </article>`).join('')
}

function bindPortalTabs() {
  document.querySelectorAll('[data-portal-tab]').forEach((b) => {
    if (b.dataset.bound) return
    b.dataset.bound = '1'
    b.addEventListener('click', () => {
      portalTab = b.dataset.portalTab
      document.querySelectorAll('[data-portal-tab]').forEach((x) => x.classList.toggle('active', x === b))
      renderPortalTab()
    })
  })
  document.getElementById('portal-rfq-list')?.addEventListener('click', portalQuoteDecision)
}

const PORTAL_STAGES = {
  rfq: ['NEW', 'UNDER_REVIEW', 'ASSIGNED', 'PRICING', 'QUOTATION_SENT', 'CUSTOMER_REVIEW', 'APPROVED'],
  sample: ['REQUESTED', 'REVIEWED', 'APPROVED', 'IN_PROGRESS', 'DISPATCHED', 'DELIVERED', 'COMPLETED'],
  order: ['CONFIRMED', 'MATERIAL_PLANNING', 'PRODUCTION', 'QUALITY', 'PACKING', 'SHIPMENT', 'DELIVERED'],
}

function portalTimeline(stages, current) {
  const cur = String(current || '').toUpperCase().replace(/\s+/g, '_')
  let idx = stages.indexOf(cur)
  if (cur === 'REJECTED') idx = -2
  if (cur === 'CONVERTED_TO_ORDER') idx = stages.length - 1
  return `<div class="portal-track" aria-hidden="true">${stages.map((s, i) => `
    <div class="portal-track-step ${i <= idx ? 'done' : ''} ${i === idx ? 'now' : ''}"><span></span><em>${s.replace(/_/g, ' ')}</em></div>`).join('')}</div>
  ${cur === 'REJECTED' ? '<p class="text-xs text-red-700 mt-2">This request was closed. Contact sales for details.</p>' : ''}`
}

function portalStatusPill(s) {
  const t = String(s || '').toUpperCase().replace(/\s+/g, '_')
  const good = ['APPROVED', 'ACCEPTED', 'DELIVERED', 'COMPLETED', 'CONVERTED_TO_ORDER']
  const bad = ['REJECTED', 'EXPIRED']
  const cls = good.includes(t) ? 'bg-emerald-100 text-emerald-900' : bad.includes(t) ? 'bg-red-100 text-red-900' : 'bg-sand/30 text-navy'
  return `<span class="inline-flex self-start text-[11px] tracking-widest uppercase px-3 py-1.5 ${cls}">${escapeHtml(t.replace(/_/g, ' '))}</span>`
}

function fmtD(d) { try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' } }

function renderPortalTab() {
  const list = document.getElementById('portal-rfq-list')
  const title = document.getElementById('portal-section-title')
  if (!list || !portalData) return
  const empty = (msg, link) => `<div class="border border-dashed border-sand/60 p-8 text-center text-sm text-mutedgt portal-anim-in">${msg}${link || ''}</div>`
  if (portalTab === 'rfqs') {
    if (title) title.textContent = 'Your RFQs'
    const rows = portalData.rfqs || []
    list.innerHTML = rows.length ? rows.map((r, i) => `
      <article class="bg-white border border-sand/40 p-6 portal-anim-in" style="animation-delay:${Math.min(i * 60, 400)}ms">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-navy text-sm">${escapeHtml(r.rfq_id)}</p>
            <p class="text-xs text-mutedgt mt-1">${escapeHtml(r.product || '')} · Qty: ${escapeHtml(String(r.quantity || '—'))} ${escapeHtml(r.unit || '')} · ${fmtD(r.created_at)}</p>
          </div>
          ${portalStatusPill(r.status)}
        </div>
        ${portalTimeline(PORTAL_STAGES.rfq, r.status)}
      </article>`).join('') : empty('No RFQs yet. ', '<a href="/request-quote" class="text-navy underline underline-offset-4">Submit your first RFQ</a>.')
  } else if (portalTab === 'quotations') {
    if (title) title.textContent = 'Your Quotations'
    const rows = portalData.quotations || []
    list.innerHTML = rows.length ? rows.map((q, i) => `
      <article class="bg-white border border-sand/40 p-6 portal-anim-in" style="animation-delay:${Math.min(i * 60, 400)}ms">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-navy text-sm">${escapeHtml(q.quotation_id)}</p>
            <p class="text-xs text-mutedgt mt-1">${q.rfq_id ? 'RFQ ' + escapeHtml(q.rfq_id) + ' · ' : ''}Total: <strong class="text-navy">${escapeHtml(String(q.total))} ${escapeHtml(q.currency || 'USD')}</strong>${q.validity ? ' · Validity: ' + escapeHtml(q.validity) : ''} · ${fmtD(q.created_at)}</p>
          </div>
          ${portalStatusPill(q.status)}
        </div>
        ${q.status === 'SENT' ? `
        <div class="mt-4 flex gap-3">
          <button data-quote-decision="ACCEPTED" data-quote-id="${escapeHtml(q.quotation_id)}" class="bg-navy text-white text-xs font-semibold px-5 py-2.5 hover:bg-ink transition-colors">Accept Quotation</button>
          <button data-quote-decision="REJECTED" data-quote-id="${escapeHtml(q.quotation_id)}" class="border border-navy/30 text-navy text-xs px-5 py-2.5 hover:border-navy transition-colors">Reject</button>
        </div>` : ''}
      </article>`).join('') : empty('No quotations yet. Quotations appear here when Gumti sales sends pricing for your RFQ.')
  } else if (portalTab === 'samples') {
    if (title) title.textContent = 'Your Sample Requests'
    const rows = portalData.samples || []
    list.innerHTML = rows.length ? rows.map((r, i) => `
      <article class="bg-white border border-sand/40 p-6 portal-anim-in" style="animation-delay:${Math.min(i * 60, 400)}ms">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-navy text-sm">${escapeHtml(r.ref_id)}</p>
            <p class="text-xs text-mutedgt mt-1">${escapeHtml(r.product || '')} · ${fmtD(r.created_at)}</p>
          </div>
          ${portalStatusPill(r.status)}
        </div>
        ${portalTimeline(PORTAL_STAGES.sample, r.status)}
      </article>`).join('') : empty('No sample requests yet. ', '<a href="/request-sample" class="text-navy underline underline-offset-4">Request a sample</a>.')
  } else {
    if (title) title.textContent = 'Your Orders'
    const rows = portalData.orders || []
    list.innerHTML = rows.length ? rows.map((r, i) => `
      <article class="bg-white border border-sand/40 p-6 portal-anim-in" style="animation-delay:${Math.min(i * 60, 400)}ms">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-navy text-sm">${escapeHtml(r.order_id)}</p>
            <p class="text-xs text-mutedgt mt-1">${escapeHtml(r.product || '')} · Qty: ${escapeHtml(String(r.quantity || '—'))} · ${fmtD(r.created_at)}</p>
          </div>
          ${portalStatusPill(r.status)}
        </div>
        ${portalTimeline(PORTAL_STAGES.order, r.status)}
      </article>`).join('') : empty('No confirmed orders yet. Orders appear here once your quotation is approved and confirmed.')
  }
}

async function portalQuoteDecision(e) {
  const btn = e.target.closest('[data-quote-decision]')
  if (!btn || !auth.currentUser) return
  const decision = btn.dataset.quoteDecision
  const id = btn.dataset.quoteId
  if (!confirm((decision === 'ACCEPTED' ? 'Accept' : 'Reject') + ' quotation ' + id + '?')) return
  btn.disabled = true
  try {
    const token = await auth.currentUser.getIdToken()
    const res = await fetch('/api/portal/quotations/' + encodeURIComponent(id) + '/decision', {
      method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Unable to update quotation')
    window.gtToast && window.gtToast('Quotation ' + id + ' ' + decision.toLowerCase() + '.')
    loadPortalData(auth.currentUser)
  } catch (err) {
    window.gtToast && window.gtToast(err.message, false)
    btn.disabled = false
  }
}

function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }
