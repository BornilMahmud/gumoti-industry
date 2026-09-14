// Gumti Textiles — Firebase integration (Auth, RBAC, Firestore CMS, Analytics)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
  onAuthStateChanged, signOut,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
import {
  getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, query, where, orderBy, getDocs, serverTimestamp,
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
window.gtDb = db
window.gtAuth = auth

try {
  const { getAnalytics } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js')
  getAnalytics(app)
} catch (_) { /* analytics unavailable */ }

const provider = new GoogleAuthProvider()
const ADMIN_EMAILS = ['bornilmahmud56@gmail.com', 'bonrilmahmud56@gmail.com']
const isAdminEmail = (email = '') => ADMIN_EMAILS.includes(String(email).toLowerCase())

window.gtUser = null
window.gtUserRole = 'customer'
window.gtIsAdmin = false
window.gtIsModerator = false

// ---------- Auth state listener ----------
onAuthStateChanged(auth, async (user) => {
  window.gtUser = user || null
  window.gtAdminToken = user ? (() => user.getIdToken(true)) : null

  let role = 'customer'
  if (user) {
    const isBornil = isAdminEmail(user.email)
    if (isBornil) {
      role = 'admin'
    } else {
      // Check existing role in Firestore
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists() && snap.data().role) {
          role = snap.data().role
        }
      } catch (err) {
        console.warn('Could not read user role from Firestore:', err.message)
      }
    }
    await ensureUserProfile(user, {
      role,
      provider: user.providerData?.[0]?.providerId || 'firebase',
      lastLoginAt: serverTimestamp(),
    })
  }

  window.gtUserRole = role
  window.gtIsAdmin = role === 'admin'
  window.gtIsModerator = role === 'moderator' || role === 'admin'

  document.dispatchEvent(new CustomEvent('gt:auth', { detail: { user, role } }))

  // Route Guard: Logged in users cannot visit /login or /register; Guests cannot visit /profile
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/'
  if (user) {
    localStorage.setItem('gt_auth_user', JSON.stringify({ uid: user.uid, email: user.email, role }))
    if (currentPath === '/login' || currentPath === '/register') {
      window.location.replace(role === 'admin' ? '/admin' : '/profile')
      return
    }
  } else {
    localStorage.removeItem('gt_auth_user')
    if (currentPath === '/profile') {
      window.location.replace('/login')
      return
    }
  }

  // Update Navigation UI based on Role & Auth
  const navLoginBtn = document.getElementById('nav-login-btn')
  const navUserPill = document.getElementById('nav-user-pill')
  const navUserAvatar = document.getElementById('nav-user-avatar')
  const navUserName = document.getElementById('nav-user-name')
  const navUserRoleBadge = document.getElementById('nav-user-role-badge')
  const navAdminBtn = document.getElementById('nav-admin-btn')
  const hasControlAccess = window.gtIsModerator

  document.documentElement.classList.add('auth-ready')

  if (navLoginBtn) {
    navLoginBtn.classList.toggle('hidden', !!user)
  }

  if (navUserPill) {
    navUserPill.classList.toggle('hidden', !user)
    navUserPill.classList.toggle('inline-flex', !!user)
    if (user) {
      const displayName = user.displayName || user.email?.split('@')[0] || 'Profile'
      const initial = displayName[0].toUpperCase()
      if (navUserName) navUserName.textContent = displayName
      if (navUserAvatar) navUserAvatar.textContent = initial
      if (navUserRoleBadge) {
        navUserRoleBadge.textContent = role.toUpperCase()
        navUserRoleBadge.className = `px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
          role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
          role === 'moderator' ? 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/30' :
          'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30'
        }`
      }
    }
  }

  if (navAdminBtn) {
    navAdminBtn.classList.toggle('hidden', !hasControlAccess)
    navAdminBtn.classList.toggle('inline-flex', hasControlAccess)
    navAdminBtn.title = role === 'admin' ? 'Super Admin Dashboard' : 'Moderator Dashboard'
  }

  // Mobile drawer links
  document.querySelectorAll('[data-mobile-login]').forEach((el) => el.classList.toggle('hidden', !!user))
  document.querySelectorAll('[data-mobile-profile]').forEach((el) => el.classList.toggle('hidden', !user))
  document.querySelectorAll('[data-mobile-admin]').forEach((el) => el.classList.toggle('hidden', !hasControlAccess))

  // Legacy compatibility fallbacks
  const account = document.getElementById('nav-account')
  const label = document.getElementById('nav-account-label')
  const admin = document.getElementById('nav-admin')
  if (account) account.href = user ? '/profile' : '/login'
  if (label) label.textContent = user ? (user.displayName ? user.displayName.split(' ')[0] : 'Profile') : 'Sign In'
  if (admin) admin.classList.toggle('auth-hidden', !hasControlAccess)

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
      const roleBadge = document.getElementById('portal-user-role')
      if (nameEl) nameEl.textContent = user.displayName || 'Buyer Account'
      if (emailEl) emailEl.textContent = user.email || ''
      if (photoEl && user.photoURL) { photoEl.src = user.photoURL; photoEl.classList.remove('hidden') }
      if (roleBadge) {
        roleBadge.textContent = role.toUpperCase()
        roleBadge.className = `inline-flex text-[10px] font-semibold px-2 py-0.5 uppercase tracking-widest ${role === 'admin' ? 'bg-amber-100 text-amber-900' : role === 'moderator' ? 'bg-emerald-100 text-emerald-900' : 'bg-sand/30 text-navy'}`
      }
      loadPortalData(user)
    }
  }

  // Admin page elements
  const adminEmail = document.getElementById('admin-user-email')
  if (adminEmail) {
    adminEmail.innerHTML = user ? `${escapeHtml(user.email || '')} <span class="ml-2 inline-flex text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded ${role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : role === 'moderator' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/10 text-sand'}">${role}</span>` : 'Not signed in'
  }
})

// ---------- Google Sign-In ----------
async function googleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider)
    if (result.user) {
      const isBornil = isAdminEmail(result.user.email)
      await ensureUserProfile(result.user, {
        provider: 'google.com',
        role: isBornil ? 'admin' : 'customer',
      })
      window.gtToast && window.gtToast('Signed in successfully.')
    }
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
  if (e.target.closest('[data-signout]')) {
    e.preventDefault()
    signOut(auth).then(() => {
      window.gtToast && window.gtToast('Signed out.')
      setTimeout(() => window.location.assign('/login'), 500)
    })
  }
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
  const isBornil = isAdminEmail(user.email)
  try {
    const userRef = doc(db, 'users', user.uid)
    let role = isBornil ? 'admin' : (extra.role || 'customer')

    // If document exists, always preserve existing role assigned by Admin
    try {
      const snap = await getDoc(userRef)
      if (snap.exists() && snap.data()?.role) {
        role = isBornil ? 'admin' : snap.data().role
      }
    } catch (_) { /* if cannot read, fallback to calculated */ }

    await setDoc(userRef, {
      uid: user.uid,
      userEmail: user.email || '',
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role,
      isDefaultAdminEmail: isBornil,
      updatedAt: serverTimestamp(),
      ...extra,
      role, // guarantee role is preserved
    }, { merge: true })
    return true
  } catch (err) {
    console.warn('User profile save skipped in Firestore:', err.message)
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
    const isBornil = isAdminEmail(email)
    const initialRole = isBornil ? 'admin' : 'customer'

    if (action === 'register') {
      credential = await createUserWithEmailAndPassword(auth, email, password)
      if (name) await updateProfile(credential.user, { displayName: name })
      await ensureUserProfile(credential.user, {
        displayName: name,
        company,
        provider: 'password',
        role: initialRole,
        createdAt: serverTimestamp(),
      })
      setAuthStatus(form, `Account created with role [${initialRole}]. Redirecting…`, true)
    } else {
      credential = await signInWithEmailAndPassword(auth, email, password)
      await ensureUserProfile(credential.user, {
        provider: 'password',
        lastLoginAt: serverTimestamp(),
      })
      setAuthStatus(form, 'Signed in successfully. Redirecting…', true)
    }
    window.gtToast && window.gtToast('Sign-in successful.')
    setTimeout(() => {
      const isSuper = isAdminEmail(credential.user.email)
      window.location.assign(isSuper ? '/admin' : '/portal')
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

// ---------- Role Promotion Helper (Admin Only) ----------
window.gtPromoteUserRole = async function (email, targetUid, newRole) {
  if (!window.gtIsAdmin) {
    window.gtToast && window.gtToast('Only administrators can promote or change user roles.', false)
    return false
  }
  try {
    const token = await window.gtAdminToken()
    const res = await fetch('/api/admin/users/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ email, uid: targetUid, role: newRole }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update role')

    // Also mirror to Firestore if targetUid exists
    if (targetUid) {
      try {
        await updateDoc(doc(db, 'users', targetUid), {
          role: newRole,
          promotedBy: window.gtUser?.email || '',
          promotedAt: serverTimestamp(),
        })
      } catch (fErr) {
        console.warn('Firestore role mirror skipped:', fErr.message)
      }
    }
    window.gtToast && window.gtToast(`Successfully updated ${email} to ${newRole.toUpperCase()}.`)
    return true
  } catch (err) {
    console.error('Role update error:', err)
    window.gtToast && window.gtToast('Role update failed: ' + err.message, false)
    return false
  }
}

// ---------- Save Landing Page Config ----------
window.gtSaveLandingConfig = async function (configData) {
  if (!window.gtIsModerator) {
    window.gtToast && window.gtToast('Moderator or Admin privileges required to edit landing page.', false)
    return false
  }
  try {
    const token = await window.gtAdminToken()
    const res = await fetch('/api/admin/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(configData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to save landing page config')

    // Also mirror to Firestore landing_config/current
    try {
      await setDoc(doc(db, 'landing_config', 'current'), {
        ...configData,
        updatedBy: window.gtUser?.email || '',
        updatedAt: serverTimestamp(),
      }, { merge: true })
    } catch (fErr) {
      console.warn('Firestore landing config mirror skipped:', fErr.message)
    }
    window.gtToast && window.gtToast('Landing page configuration published live.')
    return true
  } catch (err) {
    console.error('Save config error:', err)
    window.gtToast && window.gtToast('Save failed: ' + err.message, false)
    return false
  }
}

// ---------- Hydrate Landing Page in Real-Time ----------
async function hydrateLandingPage() {
  const isHome = window.location.pathname === '/' || window.location.pathname === ''
  if (!isHome) return
  try {
    // Check local API config first
    const res = await fetch('/api/site-config')
    if (!res.ok) return
    const cfg = await res.json()
    applyLandingDom(cfg)

    // Secondary: listen to Firestore live updates
    try {
      const snap = await getDoc(doc(db, 'landing_config', 'current'))
      if (snap.exists()) applyLandingDom(snap.data())
    } catch (_) {}
  } catch (_) {}
}

function applyLandingDom(cfg) {
  if (!cfg) return
  const elL1 = document.getElementById('cfg-hero-l1')
  const elL2 = document.getElementById('cfg-hero-l2')
  const elKicker = document.getElementById('cfg-hero-kicker')
  const elCopy = document.getElementById('cfg-hero-copy')
  const elMedia = document.getElementById('cfg-hero-media')
  const elCta1 = document.getElementById('cfg-cta1')
  const elCta2 = document.getElementById('cfg-cta2')

  if (elL1 && cfg.heroHeadlineLine1) elL1.textContent = cfg.heroHeadlineLine1
  if (elL2 && cfg.heroHeadlineLine2) elL2.textContent = cfg.heroHeadlineLine2
  if (elKicker && cfg.heroKicker) elKicker.innerHTML = `<span class="inline-block w-10 h-px bg-sand"></span>${escapeHtml(cfg.heroKicker)}`
  if (elCopy && cfg.heroSubTagline) elCopy.textContent = cfg.heroSubTagline
  if (elMedia && cfg.heroBgImage && elMedia.getAttribute('src') !== cfg.heroBgImage) elMedia.src = cfg.heroBgImage
  if (elCta1 && cfg.heroCta1Text) {
    elCta1.querySelector('span').textContent = cfg.heroCta1Text
    if (cfg.heroCta1Link) elCta1.href = cfg.heroCta1Link
  }
  if (elCta2 && cfg.heroCta2Text) {
    elCta2.querySelector('span').textContent = cfg.heroCta2Text
    if (cfg.heroCta2Link) elCta2.href = cfg.heroCta2Link
  }

  // Stats
  if (cfg.stats) {
    const s1v = document.getElementById('cfg-stat1-value')
    const s2v = document.getElementById('cfg-stat2-value')
    const s3v = document.getElementById('cfg-stat3-value')
    const s4v = document.getElementById('cfg-stat4-value')
    if (s1v && cfg.stats.stat1Value) s1v.textContent = cfg.stats.stat1Value
    if (s2v && cfg.stats.stat2Value) s2v.textContent = cfg.stats.stat2Value
    if (s3v && cfg.stats.stat3Value) s3v.textContent = cfg.stats.stat3Value
    if (s4v && cfg.stats.stat4Value) s4v.textContent = cfg.stats.stat4Value
  }

  // Contact
  const cPhone = document.getElementById('cfg-contact-phone')
  const cEmail = document.getElementById('cfg-contact-email')
  if (cPhone && cfg.contactPhone) cPhone.textContent = cfg.contactPhone
  if (cEmail && cfg.contactEmail) cEmail.textContent = cfg.contactEmail
}

document.addEventListener('DOMContentLoaded', hydrateLandingPage)

// ---------- Firestore mirror save (RFQs, contacts, samples, applications) ----------
window.gtFirestoreSave = async function (collectionName, data) {
  try {
    const clean = {}
    Object.keys(data).forEach((k) => { if (data[k] !== undefined && data[k] !== '') clean[k] = data[k] })
    clean.createdAt = serverTimestamp()
    if (auth.currentUser) { clean.uid = auth.currentUser.uid; clean.userEmail = auth.currentUser.email }
    await addDoc(collection(db, collectionName), clean)
    return true
  } catch (err) {
    console.warn('Firestore mirror skipped:', err.message)
    return false
  }
}

// ---------- Portal: load user's RFQs / inquiries with Multi-Stage Timeline ----------
const STAGES = ['NEW', 'UNDER REVIEW', 'PRICING', 'QUOTED', 'SAMPLE APPROVED', 'PRODUCTION']

async function loadPortalData(user) {
  const rfqList = document.getElementById('portal-rfq-list')
  if (!rfqList) return

  let rfqs = []
  try {
    const res = await fetch('/api/rfq?email=' + encodeURIComponent(user.email || ''))
    const data = await res.json()
    if (data.rfqs && data.rfqs.length) {
      rfqs = data.rfqs
    }
  } catch (_) { /* secondary: Firestore */ }

  if (!rfqs.length) {
    try {
      const qs = await getDocs(query(collection(db, 'rfqs'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')))
      if (!qs.empty) {
        rfqs = qs.docs.map((d) => ({ ...d.data(), rfq_id: d.data().refId || d.id }))
      }
    } catch (_) {}
  }

  // Update metric counters
  const totalEl = document.getElementById('portal-stat-rfqs')
  const pricingEl = document.getElementById('portal-stat-pricing')
  const quotesEl = document.getElementById('portal-stat-quotes')
  const prodEl = document.getElementById('portal-stat-production')

  if (totalEl) totalEl.textContent = rfqs.length.toString()
  if (pricingEl) pricingEl.textContent = rfqs.filter((r) => r.status === 'PRICING' || r.status === 'UNDER REVIEW').length.toString()
  if (quotesEl) quotesEl.textContent = rfqs.filter((r) => r.status === 'QUOTED' || r.status === 'QUOTATION SENT').length.toString()
  if (prodEl) prodEl.textContent = rfqs.filter((r) => r.status === 'PRODUCTION' || r.status === 'SAMPLE APPROVED').length.toString()

  if (!rfqs.length) {
    rfqList.innerHTML = `
      <div class="p-12 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-xl space-y-3">
        <i class="fa-solid fa-file-invoice text-3xl text-[var(--text-muted)]"></i>
        <p class="font-bold text-[var(--text-primary)]">No active RFQs registered to this account</p>
        <p class="max-w-md mx-auto">Book dedicated production capacity or request fabric swatches through our guided procurement wizard.</p>
        <div class="pt-2">
          <a href="/request-quote" class="pill-btn-emerald py-2 px-5 text-xs">Request Production Quote</a>
        </div>
      </div>`
    return
  }

  rfqList.innerHTML = rfqs.map((r) => {
    const curStatus = (r.status || 'NEW').toUpperCase()
    let curIdx = STAGES.indexOf(curStatus)
    if (curIdx === -1) {
      if (curStatus.includes('REVIEW')) curIdx = 1
      else if (curStatus.includes('PRIC')) curIdx = 2
      else if (curStatus.includes('QUOTE')) curIdx = 3
      else if (curStatus.includes('SAMPLE') || curStatus.includes('APPROV')) curIdx = 4
      else if (curStatus.includes('PROD')) curIdx = 5
      else curIdx = 0
    }

    const createdDate = r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'

    return `
      <article class="editorial-card p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-mono font-bold text-[#00E599]">${escapeHtml(r.rfq_id)}</span>
              <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass(curStatus)}">${escapeHtml(curStatus)}</span>
            </div>
            <p class="text-base font-bold font-display text-[var(--text-primary)] mt-1">${escapeHtml(r.product || 'Custom Program')}</p>
            <p class="text-xs text-[var(--text-muted)] mt-0.5">Quantity: ${escapeHtml(String(r.quantity || '—'))} ${escapeHtml(r.unit || 'Pcs')} · Target Delivery: ${escapeHtml(r.delivery_date || 'Standard')} · Submitted: ${createdDate}</p>
          </div>
          <div class="flex items-center gap-2">
            <a href="https://wa.me/8801329713736?text=Inquiry%20regarding%20RFQ%20${encodeURIComponent(r.rfq_id)}" target="_blank" rel="noopener" class="pill-btn-outline py-1.5 px-3.5 text-xs">
              <i class="fa-brands fa-whatsapp text-sm text-[#25D366] mr-1"></i>
              <span>Merchandiser</span>
            </a>
          </div>
        </div>

        <!-- 6-Stage Timeline -->
        <div>
          <span class="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider block mb-2">Milestone Critical Path</span>
          <div class="rfq-timeline">
            ${STAGES.map((s, idx) => {
              const isCompleted = idx < curIdx
              const isActive = idx === curIdx
              const cls = isCompleted ? 'completed' : (isActive ? 'active' : '')
              return `
                <div class="timeline-step ${cls}">
                  <div class="timeline-dot">
                    ${isCompleted ? '<i class="fa-solid fa-check text-[9px]"></i>' : (isActive ? '<span class="w-2 h-2 rounded-full bg-[#050B10]"></span>' : String(idx + 1))}
                  </div>
                  <span class="timeline-text">${s}</span>
                </div>
              `
            }).join('')}
          </div>
        </div>
      </article>
    `
  }).join('')
}

function statusBadgeClass(s) {
  if (s === 'PRODUCTION' || s === 'COMPLETED') return 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40'
  if (s === 'QUOTED' || s === 'SAMPLE APPROVED') return 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40'
  if (s === 'PRICING' || s === 'UNDER REVIEW') return 'bg-[#E5C378]/20 text-[#E5C378] border border-[#E5C378]/40'
  return 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

