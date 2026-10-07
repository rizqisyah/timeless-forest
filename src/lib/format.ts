/*
 * Turning getHome's raw fields into the strings Frame 20 prints. Date handling follows
 * TemaEnvelopMaroon's lib/format.ts (same API, same pitfalls).
 */

/** `wedding.lang` ('indonesia' | 'english') to a locale; missing means Indonesian. */
export function dateLocale(lang?: string | null): string {
  const l = (lang || '').trim().toLowerCase()
  return l === 'english' || l === 'en' || l.startsWith('en-') ? 'en-GB' : 'id-ID'
}

/** A bare 'YYYY-MM-DD' as a LOCAL date — new Date() would read it as UTC midnight. */
function parseDate(raw: string): Date | null {
  const p = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const d = p ? new Date(Number(p[1]), Number(p[2]) - 1, Number(p[3])) : new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

/** "SELASA" / "22 APRIL 2021" — the frame prints both in capitals. */
export function formatEventDate(raw?: string | null, lang?: string | null) {
  const d = raw ? parseDate(raw) : null
  if (!d) return { day: '', date: raw?.toUpperCase() ?? '' }
  const locale = dateLocale(lang)
  return {
    day: d.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase(),
    date: d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
  }
}

/** The countdown target: `event_date` at the start of `event_time`, in the guest's zone. */
export function parseEventStart(date?: string | null, time?: string | null): Date | null {
  if (!date) return null
  const d = parseDate(date)
  if (!d) return null
  const t = (time ?? '').trim().match(/^(\d{1,2})[.:](\d{2})/)
  if (t) d.setHours(Number(t[1]), Number(t[2]), 0, 0)
  return d
}

/**
 * "Anak pertama dari Bapak … dan Ibu …". getHome ships `child_of`, `father_name` and
 * `mother_name` separately, any of them blank; `child_of` is often the whole sentence.
 */
export function parentLine(p?: { child_of?: string | null; father_name?: string | null; mother_name?: string | null } | null) {
  if (!p) return ''
  const prefix = (p.child_of || '').trim()
  const names = [p.father_name, p.mother_name]
    .map((s) => (s || '').trim().replace(/^&\s*|\s*&$/g, ''))
    .filter(Boolean)
  const parents = names.join(' dan ')
  if (prefix && names.length && names.every((n) => prefix.includes(n))) return prefix
  return [prefix, parents].filter(Boolean).join(' ').trim()
}

/** ALL-CAPS input to Title Case; mixed case (degrees, particles) is left as typed. */
export function formatName(name?: string | null): string {
  const s = (name || '').trim()
  const letters = s.replace(/[^a-zA-Z]/g, '')
  if (letters && letters === letters.toUpperCase()) {
    return s.toLowerCase().replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase())
  }
  return s
}

/** "09 June 2025, 09:00" — the wish list's timestamp, as drawn. */
export function formatWishTime(value?: string | Date | null): string {
  if (!value) return ''
  // "2026-07-28 10:00:00" (no T) parses in Chromium but is NaN in WebKit.
  const at =
    value instanceof Date
      ? value
      : new Date(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value) ? value.replace(' ', 'T') : value)
  if (Number.isNaN(at.getTime())) return ''
  const date = at.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const time = at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date}, ${time}`
}

/** "BCA" -> "BANK BCA"; the card title is set in capitals. */
export function bankTitle(bank?: string | null): string {
  const b = (bank || '').trim().toUpperCase()
  return !b || b.startsWith('BANK') ? b : `BANK ${b}`
}

export function mapsSearch(...parts: (string | null | undefined)[]) {
  const q = parts.filter(Boolean).join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}
