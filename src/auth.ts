// Gumti Textiles — Firebase token verification + D1-backed RBAC
// Firebase = identity. D1 = authoritative business roles & permissions.

export const FIREBASE_PROJECT_ID = 'gumoti-tex'
export const SUPER_ADMIN_EMAILS = ['bornilmahmud56@gmail.com', 'bonrilmahmud56@gmail.com']

export interface AuthUser {
  email: string
  uid: string
  name?: string
}

export interface RbacUser extends AuthUser {
  role: string
  permissions: Set<string>
}

function b64urlToUint8Array(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - input.length % 4) % 4)
  const raw = atob(b64)
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

let jwksCache: { keys: any[]; at: number } | null = null

/** Verify a Firebase ID token signature + claims. Returns the identity or null. */
export async function verifyFirebaseToken(c: any): Promise<AuthUser | null> {
  const auth = c.req.header('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return null
  const [h, p, s] = token.split('.')
  if (!h || !p || !s) return null
  try {
    const header = JSON.parse(new TextDecoder().decode(b64urlToUint8Array(h)))
    const payload = JSON.parse(new TextDecoder().decode(b64urlToUint8Array(p)))
    if (payload.aud !== FIREBASE_PROJECT_ID || payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null
    if (!payload.email || !payload.sub) return null
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    if (!jwksCache || Date.now() - jwksCache.at > 30 * 60 * 1000) {
      const jwksRes = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
      const jwks = await jwksRes.json() as { keys?: any[] }
      jwksCache = { keys: jwks.keys || [], at: Date.now() }
    }
    const jwk = jwksCache.keys.find((x: any) => x.kid === header.kid)
    if (!jwk) { jwksCache = null; return null }
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToUint8Array(s), new TextEncoder().encode(`${h}.${p}`))
    if (!ok) return null
    return { email: String(payload.email).toLowerCase(), uid: String(payload.sub), name: payload.name || '' }
  } catch (e) {
    console.error('Token verification failed', e)
    return null
  }
}

/** Resolve the authoritative D1 role + permission set for an identity. */
export async function resolveRbac(db: D1Database | undefined, identity: AuthUser): Promise<RbacUser> {
  let role = 'BUYER'
  const permissions = new Set<string>()
  if (SUPER_ADMIN_EMAILS.includes(identity.email)) role = 'SUPER_ADMIN'
  if (db) {
    try {
      const row = await db.prepare('SELECT role, status FROM users WHERE email = ?').bind(identity.email).first<{ role: string; status: string }>()
      if (row && row.status === 'ACTIVE') role = row.role
      else if (row && row.status !== 'ACTIVE') role = 'DISABLED'
      else if (!SUPER_ADMIN_EMAILS.includes(identity.email)) {
        // Auto-provision unknown signed-in users as BUYER
        await db.prepare('INSERT OR IGNORE INTO users (uid, email, display_name, role, status) VALUES (?,?,?,?,?)')
          .bind(identity.uid, identity.email, identity.name || '', 'BUYER', 'ACTIVE').run()
      }
      if (role !== 'DISABLED') {
        const { results } = await db.prepare('SELECT permission_code FROM role_permissions WHERE role_code = ?').bind(role).all<{ permission_code: string }>()
        for (const r of results || []) permissions.add(r.permission_code)
      }
    } catch (e) { console.error('RBAC resolve failed', e) }
  }
  // Safety net: super admins always keep full access even before migration runs.
  if (role === 'SUPER_ADMIN' && permissions.size === 0) permissions.add('*')
  return { ...identity, role, permissions }
}

export function can(user: RbacUser, permission: string): boolean {
  return user.permissions.has('*') || user.permissions.has(permission)
}

/** Combined auth guard for API handlers. Returns user or throws a Response-ish object. */
export async function requireAuth(c: any): Promise<RbacUser | null> {
  const identity = await verifyFirebaseToken(c)
  if (!identity) return null
  return resolveRbac(c.env?.DB, identity)
}

export async function auditLog(db: D1Database | undefined, actor: string, action: string, entity: string, entityId: string, oldValue?: unknown, newValue?: unknown) {
  if (!db) return
  try {
    await db.prepare('INSERT INTO audit_logs (actor_email, action, entity, entity_id, old_value, new_value) VALUES (?,?,?,?,?,?)')
      .bind(actor, action, entity, entityId, oldValue == null ? null : JSON.stringify(oldValue).slice(0, 2000), newValue == null ? null : JSON.stringify(newValue).slice(0, 2000)).run()
  } catch (e) { console.error('Audit log failed', e) }
}
