/*
 * Every piece of copy Frame 20 (2226:73) shows as live text, with the design's sample values.
 * When this theme is wired to the API (see ../TemaEnvelopMaroon/src/composables/useWedding.ts),
 * this object is the shape to fill.
 */

export interface Person {
  nickname: string
  fullName: string
  /** "Anak pertama dari Bapak … dan Ibu …" */
  parents: string
}

export interface WeddingEvent {
  /** Only akad shows this label in the design. */
  note?: string
  /** Display strings as designed; not derived from `start`. */
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

export interface Wish {
  name: string
  time: string
  message: string
}

function mapsSearch(...parts: string[]) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(', '))}`
}

const VENUE = 'Hotel Cilembu Citayem SCBD Mulyana Jakarta Pusat'
const ADDRESS = ['Jl Raya Cakung Cilincing Gud Inkopal, Dki Jakarta, Jakarta, 14140', '0-21-440-0956']

export const wedding = {
  /*
   * Background music, started when the cover is opened. `start` skips the intro and `end`
   * cuts the song short (seconds; 0 = off), like music_start / music_end in the API.
   * The file lives in public/music/; swap it or point `url` anywhere.
   */
  music: {
    url: `${import.meta.env.BASE_URL}music/sewindu.mp3`,
    start: 0,
    end: 0,
  },

  groom: {
    nickname: 'Ahmad',
    fullName: 'M. Ahmad Sarto Budiyanto Alim , ST',
    parents: 'Anak pertama dari Bapak Ahmad Zikri Ramadhan, S.H., M.Kn. dan Ibu dr. Nabila Khairunnisa, Sp.JP.',
  } satisfies Person,
  bride: {
    nickname: 'Salsabilla',
    fullName: 'Nur Winda Muthia Salsabilla, S.Pd',
    parents: 'Anak pertama dari Bapak Muhammad Farhan Alamsyah, S.E., M.M. dan Ibu dr. Aisyah Nur Zahra, Sp.OG.',
  } satisfies Person,

  /** Countdown target. The design's sample date has passed, so it reads 0 0 0 0 as drawn. */
  countdownTo: '2021-04-22T07:00:00+07:00',

  quote: {
    source: 'QS Ar-Rum 21',
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang"',
  },
  greeting:
    "Assalamu'alaikum warahmatullahi wabarakatuh. Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian, untuk menghadiri acara pernikahan kami",

  akad: {
    note: 'Family Only',
    day: 'SELASA',
    date: '22 APRIL 2021',
    time: '07.00-09.00 WIB',
    venue: VENUE,
    address: ADDRESS,
    mapsUrl: mapsSearch(VENUE, ADDRESS[0]),
  } satisfies WeddingEvent,
  resepsi: {
    day: 'SELASA',
    date: '22 APRIL 2021',
    time: '07.00-09.00 WIB',
    venue: VENUE,
    address: ADDRESS,
    mapsUrl: mapsSearch(VENUE, ADDRESS[0]),
  } satisfies WeddingEvent,

  accounts: [
    { bank: 'BANK BCA (014)', number: '7771565429', holder: 'Waraney Lasut Soleman Roeroe' },
    { bank: 'BANK BCA (014)', number: '7955201175', holder: 'Monika Kristi Maria Manurung' },
  ] satisfies BankAccount[],
  giftAddress: {
    address:
      'Jl Raya Cakung Cilincing Gud Inkopal, Dki Jakarta, Jakarta, 141400-21-440-0956 Dki Jakarta, Jakarta, 141400-21-440-0956Dki Jakarta, Jakarta, 141400-21-440-0956',
    recipient: 'Monika Kristi Maria Manurung',
  },

  wishes: [
    {
      name: '@25ribuaja',
      time: '09 June 2025, 09:00',
      message: 'Wishing you a lifetime filled with endless love, gentle laughter, and countless beautiful moments together. Happy Wedding!',
    },
    {
      name: 'Satrio & Istri',
      time: '09 June 2025, 09:00',
      message: 'Wishing you a lifetime filled with endless love, gentle laughter, and countless beautiful moments together. Happy Wedding!',
    },
    {
      name: 'Satrio & Istri',
      time: '09 June 2025, 09:00',
      message: 'Wishing you a lifetime filled with endless love, gentle laughter, and countless beautiful moments together. Happy Wedding!',
    },
  ] satisfies Wish[],
}
