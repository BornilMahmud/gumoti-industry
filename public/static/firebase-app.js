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

// ---------- Portal: load user's RFQs / inquiries ----------
async function loadPortalData(user) {
  const rfqList = document.getElementById('portal-rfq-list')
  if (!rfqList) return
  // Primary source: server D1 API
  try {
    const res = await fetch('/api/rfq?email=' + encodeURIComponent(user.email || ''))
    const data = await res.json()
    if (data.rfqs && data.rfqs.length) {
      rfqList.innerHTML = data.rfqs.map((r) => `
        <article class="bg-white border border-sand/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-navy text-sm">${r.rfq_id}</p>
            <p class="text-xs text-mutedgt mt-1">${escapeHtml(r.product || '')} · Qty: ${escapeHtml(String(r.quantity || '—'))} ${escapeHtml(r.unit || '')}</p>
            <p class="text-xs text-mutedgt">${new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <span class="inline-flex self-start sm:self-center text-[11px] tracking-widest uppercase px-3 py-1.5 ${statusColor(r.status)}">${r.status}</span>
        </article>`).join('')
      return
    }
  } catch (_) { /* fall through to Firestore */ }
  // Secondary: Firestore mirror
  try {
    const qs = await getDocs(query(collection(db, 'rfqs'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')))
    if (!qs.empty) {
      rfqList.innerHTML = ''
      qs.forEach((doc) => {
        const r = doc.data()
        rfqList.innerHTML += `<article class="bg-white border border-sand/40 p-5">
          <p class="font-semibold text-navy text-sm">${escapeHtml(r.refId || doc.id)}</p>
          <p class="text-xs text-mutedgt mt-1">${escapeHtml(r.product || '')} · Qty: ${escapeHtml(String(r.quantity || '—'))}</p>
        </article>`
      })
      return
    }
  } catch (_) {}
  rfqList.innerHTML = '<div class="border border-dashed border-sand/60 p-8 text-center text-sm text-mutedgt">No RFQs yet. <a href="/request-quote" class="text-navy underline underline-offset-4">Submit your first RFQ</a>.</div>'
}

function statusColor(s) {
  const m = { NEW: 'bg-sand/30 text-navy', 'UNDER REVIEW': 'bg-blue-100 text-blue-900', PRICING: 'bg-amber-100 text-amber-900', 'QUOTATION SENT': 'bg-emerald-100 text-emerald-900', APPROVED: 'bg-emerald-200 text-emerald-900', REJECTED: 'bg-red-100 text-red-900' }
  return m[s] || 'bg-sand/30 text-navy'
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }
