/*
 * The invitation's view model — every piece of live copy Frame 20 (2226:73) and Frame 21 show —
 * and the design's own sample values as `demoInvite`.
 *
 * useWedding() fills an Invite from qinvi-be's getHome. The demo only renders when no wedding
 * could be loaded (local dev without the API, a slug that does not exist).
 */

export interface Person {
  nickname: string
  fullName: string
  /** "Anak pertama dari Bapak … dan Ibu …" */
  parents: string
}

export interface WeddingEvent {
  /** The frame's heading ("AKAD NIKAH"): the acara name before any `|`. */
  title: string
  /** The small italic label above the day ("Family Only"): the acara name after `|`. */
  note?: string
  day: string
  date: string
  time: string
  venue: string
  address: string[]
  mapsUrl: string
}

export interface BankAccount {
  bank: string
  number: string
  holder: string
}

export interface GiftAddress {
  address: string
  recipient: string
}

export interface Wish {
  name: string
  time: string
  message: string
}

/** "Pengaturan Zoom & Posisi Foto Mempelai": crop focus (x, y in %) and zoom about it. */
export interface PhotoFocus {
  scale: number
  x: number
  y: number
}

export interface Invite {
  groom: Person
  bride: Person
  /** wedding.order_groom_first: which partner leads in names and the couple section. */
  groomFirst: boolean
  countdownTo: string | Date | null
  quote: { source: string; text: string }
  greeting: string
  akad: WeddingEvent | null
  resepsi: WeddingEvent | null
  accounts: BankAccount[]
  /** A rekening row whose bank is `kado`: the postal address for physical gifts. */
  giftAddress: GiftAddress | null
  wishes: Wish[]
  /** `start` skips the intro, `end` cuts the song short (seconds; 0 = off). */
  music: { url: string; start: number; end: number }
  /**
   * Dashboard photos. null = none uploaded, and the slot shows the design's own photo
   * (src/assets/photos). See src/data/photoSlots.ts for which slot takes which.
   */
  photos: {
    /** Cover Image: the cover page's photo. */
    cover: string | null
    /** Left Cover BG (Desktop): the photo panel beside the invitation. */
    left: string | null
    /** Foto Mempelai Setelah Buka: the hero arch and the thank-you frame ("Hero & Footer"). */
    hero: string | null
    /** Each partner's photo (Pengantin tab) and its zoom / focus point. */
    groom: string | null
    bride: string | null
    groomFocus: PhotoFocus | null
    brideFocus: PhotoFocus | null
    /** Spouse Image, the prewedding photo: the closing mirrors. */
    couple: string | null
    gallery: string[]
  }
  /** Prewedding video: a YouTube link or a direct video file. '' = none. */
  video: string
}

/** Which sections a wedding can leave out by having nothing to put in them. */
export function hasGallery(i: Invite, live: boolean) {
  return !live || i.photos.gallery.length > 0
}
export function hasGift(i: Invite, live: boolean) {
  return !live || i.accounts.length > 0 || !!i.giftAddress
}
export function hasVideo(i: Invite, live: boolean) {
  return !live || !!i.video
}

/** Used when a wedding has no music_url of its own. */
export const DEFAULT_MUSIC = `${import.meta.env.BASE_URL}music/sewindu.mp3`

const VENUE = 'Hotel Cilembu Citayem SCBD Mulyana Jakarta Pusat'
const ADDRESS = ['Jl Raya Cakung Cilincing Gud Inkopal, Dki Jakarta, Jakarta, 14140', '0-21-440-0956']
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${VENUE}, ${ADDRESS[0]}`)}`

export const DEMO_GREETING =
  "Assalamu'alaikum warahmatullahi wabarakatuh. Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian, untuk menghadiri acara pernikahan kami"

const SAMPLE_WISH: Wish = {
  name: 'Satrio & Istri',
  time: '09 June 2025, 09:00',
  message: 'Wishing you a lifetime filled with endless love, gentle laughter, and countless beautiful moments together. Happy Wedding!',
}

export const demoInvite: Invite = {
  groom: {
    nickname: 'Ahmad',
    fullName: 'M. Ahmad Sarto Budiyanto Alim , ST',
    parents: 'Anak pertama dari Bapak Ahmad Zikri Ramadhan, S.H., M.Kn. dan Ibu dr. Nabila Khairunnisa, Sp.JP.',
  },
  bride: {
    nickname: 'Salsabilla',
    fullName: 'Nur Winda Muthia Salsabilla, S.Pd',
    parents: 'Anak pertama dari Bapak Muhammad Farhan Alamsyah, S.E., M.M. dan Ibu dr. Aisyah Nur Zahra, Sp.OG.',
  },
  groomFirst: true,
  // The design's sample date has passed, so the countdown reads 0 0 0 0 as drawn.
  countdownTo: '2021-04-22T07:00:00+07:00',
  quote: {
    source: 'QS Ar-Rum 21',
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang"',
  },
  greeting: DEMO_GREETING,
  akad: { title: 'AKAD NIKAH', note: 'Family Only', day: 'SELASA', date: '22 APRIL 2021', time: '07.00-09.00 WIB', venue: VENUE, address: ADDRESS, mapsUrl: MAPS },
  resepsi: { title: 'RESEPSI', day: 'SELASA', date: '22 APRIL 2021', time: '07.00-09.00 WIB', venue: VENUE, address: ADDRESS, mapsUrl: MAPS },
  accounts: [
    { bank: 'BANK BCA (014)', number: '7771565429', holder: 'Waraney Lasut Soleman Roeroe' },
    { bank: 'BANK BCA (014)', number: '7955201175', holder: 'Monika Kristi Maria Manurung' },
  ],
  giftAddress: {
    address:
      'Jl Raya Cakung Cilincing Gud Inkopal, Dki Jakarta, Jakarta, 141400-21-440-0956 Dki Jakarta, Jakarta, 141400-21-440-0956Dki Jakarta, Jakarta, 141400-21-440-0956',
    recipient: 'Monika Kristi Maria Manurung',
  },
  wishes: [{ ...SAMPLE_WISH, name: '@25ribuaja' }, SAMPLE_WISH, SAMPLE_WISH],
  music: { url: DEFAULT_MUSIC, start: 0, end: 0 },
  photos: {
    cover: null,
    left: null,
    hero: null,
    groom: null,
    bride: null,
    groomFocus: null,
    brideFocus: null,
    couple: null,
    gallery: [],
  },
  video: '',
}
