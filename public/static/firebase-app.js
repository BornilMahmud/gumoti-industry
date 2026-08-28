// Gumti Textiles — Firebase integration (Auth: Google Sign-In, Firestore, Analytics)
// Firebase web config values are public identifiers by design; security is
// enforced through Firebase Auth + Firestore Security Rules.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  onAuthStateChanged, signOut,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
import {
  getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp,
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

// ---------- Auth state ----------
onAuthStateChanged(auth, (user) => {
  window.gtUser = user || null
  document.dispatchEvent(new CustomEvent('gt:auth', { detail: user }))

  const label = document.getElementById('nav-account-label')
  if (label) label.textContent = user ? (user.displayName ? user.displayName.split(' ')[0] : 'Portal') : 'Sign In'

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
})

// ---------- Google Sign-In ----------
async function googleSignIn() {
  try {
    await signInWithPopup(auth, provider)
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
})

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
