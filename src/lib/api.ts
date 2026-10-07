/*
 * qinvi-be public invitation API — the same three calls TemaEnvelopMaroon makes.
 * VITE_API_BASE_URL is set at build time (deploy.yml: https://api.qinvi.id/api); in dev and on
 * Vercel it stays '/api', which vite.config.ts / vercel.json proxy to the real backend.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/** The demo wedding seeded by qinvi-be's seed-wedding-timeless-forest.ts. */
const DEFAULT_SLUG = import.meta.env.VITE_DEFAULT_SLUG || 'tema-timeless-forest'

/**
 * Invitation links are `{FRONTEND_URL}/{theme_code}/{slug}` (admin-dashboard), so the slug is
 * the last path segment. The theme's own folder (/TemaTimelessForest/ on the VPS) is not a
 * slug: a bare link to the theme gets the demo wedding instead of a 404.
 */
export function resolveSlug(): string {
  const base = import.meta.env.BASE_URL.split('/').filter(Boolean)
  const segments = window.location.pathname
    .split('/')
    .filter(Boolean)
    .filter((s, i) => !(i < base.length && s === base[i]))
  return segments.length ? decodeURIComponent(segments[segments.length - 1]) : DEFAULT_SLUG
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
  } catch (networkError: any) {
    throw new Error(`Network error: ${networkError.message}`)
  }

  let payload: any = null
  try {
    payload = await res.json()
  } catch {
    // Non-JSON response
  }

  if (!res.ok || (payload && payload.success === false)) {
    throw new Error((payload && payload.message) || `Request failed (${res.status})`)
  }
  return payload
}

export async function getHome(slug: string, to = ''): Promise<any> {
  const query = to ? `?to=${encodeURIComponent(to)}` : ''
  const payload = await request(`/v1/service/menu/getHome/${encodeURIComponent(slug)}${query}`)
  return payload?.data ?? null
}

export interface RsvpBody {
  guest_name: string
  phone: string
  attendance_status: 'hadir' | 'tidak_hadir'
  guest_count: number
}

export function submitRsvp(slug: string, body: RsvpBody): Promise<any> {
  return request(`/v1/service/menu/hadir2/${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function submitUcapan(slug: string, body: { guest_name: string; message: string }): Promise<any> {
  return request(`/v1/service/menu/ucapan/${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
