/*
 * Every fixed phrase the invitation shows, in the two languages the dashboard offers
 * (General Settings → "Bahasa Undangan": wedding.lang = 'indonesia' | 'english').
 *
 * Indonesian is the design's own copy, unchanged — including the English the design already
 * uses (Account Number, Show more, Will you be joining us?, Days / Hours / Minutes / Seconds).
 * Text the couple writes in the dashboard (names, parents, quote, event names, addresses) is
 * shown as written in either language.
 */

const id = {
  lang: 'id',
  // cover
  coverDear: 'kepada Yth.',
  guestFallback: 'Nama Tamu',
  openInvitation: 'Buka undangan',
  // hero / quote (used only when the dashboard leaves them empty)
  heroOpening: 'Undangan Pernikahan',
  greeting:
    "Assalamu'alaikum warahmatullahi wabarakatuh. Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian, untuk menghadiri acara pernikahan kami",
  countdown: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
  // section names for screen readers
  bandOpening: 'Pembuka',
  bandEvents: 'Acara Pernikahan',
  bandEvent: 'Acara',
  // events (the heading is the design's own art in Indonesian; see EventsSection)
  eventsHeading: (n: number): string => (n === 1 ? 'Acara' : 'Acara\nPernikahan'),
  akadTitle: 'Akad Nikah',
  resepsiTitle: 'Resepsi',
  linkMaps: 'LINK MAPS',
  // gift
  accountNumber: 'Account Number',
  accountName: 'Account Name',
  giftDelivery: 'PENGIRIMAN KADO',
  address: 'Alamat',
  recipient: 'Penerima',
  copyAccountSr: 'Salin nomor rekening',
  copyAddressSr: 'Salin alamat pengiriman kado',
  copiedAccount: 'Nomor rekening disalin',
  copiedAddress: 'Alamat disalin',
  copyFailed: 'Gagal menyalin',
  // wishes
  wishNameLabel: 'Nama',
  wishLabel: 'Ucapan',
  wishNamePlaceholder: 'Name',
  wishPlaceholder: 'Give your wish',
  send: 'Send',
  sending: 'Sending…',
  showMore: 'Show more',
  wishesEmptyTitle: 'Belum ada ucapan',
  wishesEmptyText: 'Jadilah yang pertama mengirimkan doa dan ucapan terbaik untuk kedua mempelai.',
  wishFillIn: 'Isi nama dan ucapan dulu',
  wishThanks: 'Terima kasih atas ucapannya',
  wishFailed: 'Gagal mengirim ucapan. Coba lagi.',
  // rsvp
  rsvpName: 'Nama',
  rsvpPhone: 'No Hp',
  rsvpAttendingLabel: 'Kehadiran',
  rsvpAttending: 'Will you be joining us?',
  rsvpYes: 'Ya, saya akan hadir',
  rsvpNo: 'Maaf, tidak bisa hadir',
  rsvpGuestsLabel: 'Jumlah tamu',
  rsvpGuests: 'Number of Guests:',
  rsvpGuestCount: (n: number) => `${n} orang`,
  rsvpSent: 'Terima kasih, konfirmasi diterima',
  rsvpFillIn: 'Isi nama dan konfirmasi kehadiran',
  rsvpThanksYes: 'Terima kasih, sampai jumpa!',
  rsvpThanksNo: 'Terima kasih atas konfirmasinya',
  rsvpFailed: 'Gagal mengirim konfirmasi. Coba lagi.',
  // video
  watchWithSound: 'Tonton dengan suara',
  openingVideo: 'Video pembuka',
  skip: 'Lewati',
  // music
  pauseMusic: 'Jeda musik',
  playMusic: 'Putar musik',
  // gallery
  photoGallery: 'Galeri foto',
  prevPhoto: 'Foto sebelumnya',
  nextPhoto: 'Foto berikutnya',
  close: 'Tutup',
  viewPhoto: 'Lihat foto',
  showPhoto: (n: number) => `Tampilkan foto ${n}`,
  photoOf: (n: number, total: number) => `Foto ${n} dari ${total}`,
}

export type Text = typeof id

const en: Text = {
  lang: 'en',
  coverDear: 'Dear',
  guestFallback: 'Honored Guest',
  openInvitation: 'Open the invitation',
  heroOpening: 'Wedding Invitation',
  greeting:
    "Assalamu'alaikum warahmatullahi wabarakatuh. With all due respect, we cordially invite you, together with your family and friends, to celebrate our wedding with us",
  countdown: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
  bandOpening: 'Opening',
  bandEvents: 'Wedding Events',
  bandEvent: 'Event',
  eventsHeading: (n: number) => (n === 1 ? 'Wedding\nEvent' : 'Wedding\nEvents'),
  akadTitle: 'Holy Matrimony',
  resepsiTitle: 'Wedding Reception',
  linkMaps: 'VIEW MAP',
  accountNumber: 'Account Number',
  accountName: 'Account Name',
  giftDelivery: 'GIFT DELIVERY',
  address: 'Address',
  recipient: 'Recipient',
  copyAccountSr: 'Copy account number',
  copyAddressSr: 'Copy the gift delivery address',
  copiedAccount: 'Account number copied',
  copiedAddress: 'Address copied',
  copyFailed: 'Could not copy',
  wishNameLabel: 'Name',
  wishLabel: 'Wish',
  wishNamePlaceholder: 'Name',
  wishPlaceholder: 'Give your wish',
  send: 'Send',
  sending: 'Sending…',
  showMore: 'Show more',
  wishesEmptyTitle: 'No wishes yet',
  wishesEmptyText: 'Be the first to send your prayers and best wishes to the bride and groom.',
  wishFillIn: 'Please write your name and your wish',
  wishThanks: 'Thank you for your wishes',
  wishFailed: 'Could not send your wish. Please try again.',
  rsvpName: 'Name',
  rsvpPhone: 'Phone Number',
  rsvpAttendingLabel: 'Attendance',
  rsvpAttending: 'Will you be joining us?',
  rsvpYes: 'Yes, I will attend',
  rsvpNo: "Sorry, I can't make it",
  rsvpGuestsLabel: 'Number of guests',
  rsvpGuests: 'Number of Guests:',
  rsvpGuestCount: (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`,
  rsvpSent: 'Thank you, your RSVP has been received',
  rsvpFillIn: 'Please write your name and choose your attendance',
  rsvpThanksYes: 'Thank you, see you there!',
  rsvpThanksNo: 'Thank you for letting us know',
  rsvpFailed: 'Could not send your RSVP. Please try again.',
  watchWithSound: 'Watch with sound',
  openingVideo: 'Opening video',
  skip: 'Skip',
  pauseMusic: 'Pause music',
  playMusic: 'Play music',
  photoGallery: 'Photo gallery',
  prevPhoto: 'Previous photo',
  nextPhoto: 'Next photo',
  close: 'Close',
  viewPhoto: 'View photo',
  showPhoto: (n: number) => `Show photo ${n}`,
  photoOf: (n: number, total: number) => `Photo ${n} of ${total}`,
}

export const TEXT = { id, en }
