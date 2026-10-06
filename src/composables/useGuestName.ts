/** Guest name from `?to=` (or `?guest=`), the same params the other themes read. */
export function useGuestName(fallback = 'Nama Tamu'): string {
  if (typeof window === 'undefined') return fallback
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('to') || params.get('guest') || ''
  let name: string
  try {
    name = decodeURIComponent(raw.replace(/\+/g, ' ')).trim()
  } catch {
    name = raw.replace(/\+/g, ' ').trim()
  }
  return name || fallback
}
