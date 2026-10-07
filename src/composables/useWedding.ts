import { computed, ref } from 'vue'
import { getHome, resolveSlug, submitRsvp, submitUcapan, type RsvpBody } from '../lib/api'
import { bankTitle, formatEventDate, formatName, formatWishTime, mapsSearch, parentLine, parseEventStart } from '../lib/format'
import { DEFAULT_MUSIC, DEMO_GREETING, demoInvite, type Invite, type WeddingEvent, type Wish } from '../data/wedding'

/*
 * One getHome per page load, shared by every component (module-level state, as in
 * TemaEnvelopMaroon). The wedding is edited in qinvi admin-dashboard; this maps its raw
 * payload onto the Invite the sections render, and follows the dashboard's live preview.
 */

const slug = resolveSlug()
const guestCode = (() => {
  const q = new URLSearchParams(window.location.search)
  return (q.get('to') || q.get('guest') || q.get('c') || q.get('code') || '').trim()
})()

const state = ref<{ loading: boolean; error: string | null; data: any | null }>({
  loading: true,
  error: null,
  data: null,
})
/** Wishes posted in this session, newest first, on top of what getHome returned. */
const posted = ref<Wish[]>([])
let started = false
let inflight: Promise<void> | null = null

/** getHome into state. A refetch keeps the page as it is (no loading state) until it lands. */
function fetchHome(): Promise<void> {
  if (inflight) return inflight
  inflight = getHome(slug, guestCode)
    .then((data) => {
      state.value.data = data
      state.value.error = null
      if (data?.wedding?.title) document.title = `${data.wedding.title} - Undangan Pernikahan`
      if (data?.wedding) applyTheme(data.theme?.theme_config, parseJson(data.wedding.theme_override))
    })
    .catch((err: Error) => {
      console.error('Failed to load wedding data:', err)
      if (!state.value.data) state.value.error = err.message
    })
    .finally(() => {
      state.value.loading = false
      inflight = null
    })
  return inflight
}

function load() {
  if (started) return
  started = true
  fetchHome()
}

/*
 * Live preview in the admin dashboard's Mode Imajinasi (App.tsx posts { type, wedding,
 * theme, refetch }): `wedding`/`theme` carry the Tema tab's unsaved edits and show at
 * once; `refetch` reloads what the other tabs saved (pengantin, acara, rekening...).
 */
window.addEventListener('message', (event: MessageEvent) => {
  const msg = event.data
  if (msg?.type !== 'QINVI_PREVIEW_UPDATE') return
  if (msg.wedding || msg.theme) {
    const current = state.value.data || {}
    state.value.data = {
      ...current,
      ...(msg.wedding ? { wedding: { ...(current.wedding || {}), ...msg.wedding } } : {}),
      ...(msg.theme ? { theme: msg.theme } : {}),
    }
    const w = state.value.data.wedding
    if (w) applyTheme(state.value.data.theme?.theme_config, parseJson(w.theme_override))
  }
  if (msg.refetch || msg.payload?.refetch) fetchHome()
})

/** A dashboard guest code (AB123); anything else in ?to= is a name typed into the link. */
function isSystemGuestCode(val: string) {
  return /^[A-Za-z]{2,4}\d{2,6}$/.test(val)
}

function directName(val: string) {
  try {
    return decodeURIComponent(val.replace(/\+/g, ' ')).trim()
  } catch {
    return val.replace(/\+/g, ' ').trim()
  }
}

function parseJson(raw: unknown): any {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(String(raw))
  } catch {
    return {}
  }
}

function toEvent(a: any, lang: string | null): WeddingEvent {
  const { day, date } = formatEventDate(a.event_date, lang)
  // "Akad Nikah | Family Only": the heading, then the small label above the day.
  const [title, ...rest] = String(a.title || '').split('|')
  const note = rest.join('|').trim()
  return {
    title: title.trim(),
    note: note || undefined,
    day,
    date,
    time: (a.event_time || '').trim(),
    venue: (a.location_name || '').trim(),
    address: String(a.address || '')
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean),
    mapsUrl: a.maps_url || mapsSearch(a.location_name, a.address),
  }
}

function toWish(u: any): Wish {
  return { name: u.guest_name || u.name || '', time: formatWishTime(u.created_at), message: u.message || '' }
}

const wedding = computed(() => state.value.data?.wedding ?? null)
const live = computed(() => !!wedding.value)

const invite = computed<Invite>(() => {
  const data = state.value.data
  const w = wedding.value
  if (!w) return { ...demoInvite, wishes: [...posted.value, ...demoInvite.wishes] }

  const content = data.content ?? data
  const override = parseJson(w.theme_override)
  const lang: string | null = w.lang ?? null

  const people: any[] = content.pengantin ?? []
  const groomFirst = override.order_groom_first ?? w.order_groom_first
  const isGroomFirst = groomFirst !== false && groomFirst !== 'false' && groomFirst !== 0
  const byType = (...types: string[]) => people.find((p) => types.includes(String(p.type || '').toLowerCase()))
  const rawGroom = byType('groom', 'pria') ?? people[isGroomFirst ? 0 : 1]
  const rawBride = byType('bride', 'wanita') ?? people[isGroomFirst ? 1 : 0]
  const person = (p: any) => ({
    nickname: (p?.nickname || '').trim() || formatName(p?.name).split(' ')[0] || '',
    fullName: formatName(p?.name),
    parents: parentLine(p),
  })

  const acara = [...(content.acara ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  // The quote lives in words.quote_* (admin form), quote.* (seeds) or a flat quote_*; the
  // first one that is SET wins, even empty — so a verse the couple cleared stays cleared.
  const quoteField = (wordKey: string, quoteKey: string) => {
    for (const v of [override.words?.[wordKey], override.quote?.[quoteKey], override[wordKey]]) {
      if (typeof v === 'string') return v.trim()
    }
    return ''
  }

  const rekening: any[] = content.rekening ?? content.gift ?? []
  const isKado = (r: any) => String(r.bank_name || '').trim().toLowerCase() === 'kado'
  const kado = rekening.find(isKado)

  const gallery: string[] = [...(content.gallery ?? [])]
    .sort((a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
    .map((g: any) => (typeof g === 'string' ? g : g?.image_url || g?.url || g?.src || ''))
    .filter(Boolean)
  // Same precedence as TemaEnvelopMaroon's invitePhoto / spousePhoto.
  const hero =
    str(override.images?.foto_mempelai_setelah_buka) || str(w.image_spouse) ||
    str(override.backgrounds?.cover) || str(w.image_cover) || gallery[0] || null
  const couple = str(w.image_spouse) || hero

  const opening = override.words?.opening_message
  const countdown =
    override.countdown_date || override.words?.countdown_date || w.countdown_date ||
    parseEventStart(acara[0]?.event_date, acara[0]?.event_time)

  return {
    groom: person(rawGroom),
    bride: person(rawBride),
    groomFirst: isGroomFirst,
    countdownTo: countdown || null,
    quote: { source: quoteField('quote_verse', 'verse'), text: quoteField('quote_text', 'text') },
    greeting: typeof opening === 'string' && opening.trim() ? opening.trim() : DEMO_GREETING,
    akad: acara[0] ? toEvent(acara[0], lang) : null,
    resepsi: acara[1] ? toEvent(acara[1], lang) : null,
    accounts: rekening
      .filter((r) => !isKado(r) && (r.account_number || r.account_name))
      .map((r) => ({ bank: bankTitle(r.bank_name), number: String(r.account_number || '').trim(), holder: r.account_name || '' })),
    giftAddress: kado ? { address: String(kado.account_number || '').trim(), recipient: kado.account_name || '' } : null,
    wishes: [...posted.value, ...(content.ucapan ?? content.wishes ?? []).map(toWish)].filter((x) => x.name || x.message),
    music: {
      url: w.music_url || DEFAULT_MUSIC,
      start: Number(w.music_start) || 0,
      end: Number(w.music_end) || 0,
    },
    photos: {
      cover: str(override.backgrounds?.cover) || str(w.image_cover) || hero,
      hero,
      // No portrait of one partner: the couple photo; with none at all, the design's.
      groom: str(rawGroom?.photo_url) || couple,
      bride: str(rawBride?.photo_url) || couple,
      couple,
      gallery,
    },
    video: str(w.video_url) || str(override.words?.video_prewed) || str(override.video_prewed) || '',
  }
})

/*
 * Theme Override (admin-dashboard) for the live text: the theme's seeded theme_config, then
 * the wedding's own override on top, onto the CSS variables in tokens.css. The artwork is
 * pre-rendered, so only text, cards, buttons and fields can change.
 */
const COLOR_VARS: Record<string, string[]> = {
  primary: ['--card'],
  secondary: ['--event-date'],
  accent: ['--emboss'],
  bg_body: ['--sheet-bg'],
  text_body: ['--parents-ink'],
  event_opening_color: ['--quote-ink', '--greeting-ink'],
  event_title_color: ['--event-title-ink'],
  event_detail_color: ['--event-ink'],
}
const FONT_VARS: Record<string, string[]> = {
  headline: ['--font-hero-couple'],
  spouse_nickname: ['--font-hero-couple'],
  spouse_fullname: ['--font-couple-name'],
  parents: ['--font-body'],
  body: ['--font-body'],
  script: ['--font-quote'],
  event_opening: ['--font-quote'],
  event_title: ['--font-event-title'],
  event_detail: ['--font-event-detail'],
  form_label: ['--font-form'],
}

// The live preview re-applies on every edit: vars set last time but not now are removed
// (back to tokens.css), and each uploaded font / Google Fonts sheet is loaded once.
let appliedVars = new Set<string>()
const loadedFaces = new Set<string>()

function applyTheme(themeConfig: any, override: any) {
  const root = document.documentElement.style
  const colors = { ...(themeConfig?.colors || {}), ...(override?.colors || {}) }
  const fonts = { ...(themeConfig?.fonts || {}), ...(override?.fonts || {}) }
  const next = new Map<string, string>()
  for (const [key, vars] of Object.entries(COLOR_VARS)) {
    if (str(colors[key])) for (const v of vars) next.set(v, colors[key])
  }
  for (const [key, vars] of Object.entries(FONT_VARS)) {
    if (str(fonts[key])) for (const v of vars) next.set(v, fonts[key])
  }
  for (const v of appliedVars) if (!next.has(v)) root.removeProperty(v)
  for (const [v, value] of next) root.setProperty(v, value)
  appliedVars = new Set(next.keys())
  // Fonts uploaded in the dashboard's font library.
  for (const f of Object.values<any>(override?.fonts_custom || {})) {
    if (!f?.url || !f?.family) continue
    const id = `${f.family}|${f.url}`
    if (loadedFaces.has(id)) continue
    loadedFaces.add(id)
    new FontFace(f.family, `url(${JSON.stringify(f.url)})`, { display: 'swap' })
      .load()
      .then((face) => document.fonts.add(face))
      .catch(() => {})
  }
  const googleFonts = str(override?.google_fonts_url)
  if (googleFonts) {
    let link = document.getElementById('ov-google-fonts') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = 'ov-google-fonts'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    if (link.getAttribute('href') !== googleFonts) link.href = googleFonts
  }
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

const guestName = computed(() => {
  const g = state.value.data?.guest
  if (g?.guest_name || g?.name) return String(g.guest_name || g.name)
  if (!guestCode || isSystemGuestCode(guestCode)) return 'Nama Tamu'
  return directName(guestCode) || 'Nama Tamu'
})

/** The two partners in the wedding's order (order_groom_first): first leads everywhere. */
const pair = computed(() => {
  const { groom, bride, groomFirst } = invite.value
  return groomFirst ? [groom, bride] : [bride, groom]
})

/*
 * "Ahmad & Salsabilla" on the cover, hero, desktop panel and closing: the invitation's title
 * as set in the dashboard, so what the couple typed is what guests see; the nicknames only
 * when the title is blank. Blank until loaded so the cover never flashes the demo names.
 */
const coupleNames = computed(() => {
  if (state.value.loading) return ''
  const title = str(wedding.value?.title)
  return title || pair.value.map((p) => p.nickname).filter(Boolean).join(' & ')
})

/** The same names split at "&" for the two-line layouts: ["Ahmad &", "Salsabilla"]. */
const coupleLines = computed(() => {
  const [first, ...rest] = coupleNames.value.split('&')
  const second = rest.join('&').trim()
  return second ? [`${first.trim()} &`, second] : [first.trim()]
})

async function sendWish(body: { guest_name: string; message: string }) {
  await submitUcapan(slug, body)
  posted.value = [{ name: body.guest_name, time: formatWishTime(new Date()), message: body.message }, ...posted.value]
}

function sendRsvp(body: RsvpBody) {
  return submitRsvp(slug, body)
}

export function useWedding() {
  load()
  return {
    slug,
    guestCode,
    loading: computed(() => state.value.loading),
    /** True once a real wedding came back; false means the design demo is showing. */
    live,
    guest: computed(() => state.value.data?.guest ?? null),
    invite,
    pair,
    guestName,
    coupleNames,
    coupleLines,
    sendWish,
    sendRsvp,
  }
}
