<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/09-rsvp.webp'
import { useToast } from '../../composables/useToast'
import { useWedding } from '../../composables/useWedding'

const { show } = useToast()
const { slug, guestCode, guest, guestName, sendRsvp } = useWedding()
const form = reactive({ name: '', phone: '', attending: '' as '' | 'hadir' | 'tidak_hadir', guests: '' })
const sending = ref(false)
const sent = ref(false)

/* A personal link's guest may bring up to `pax` people (dashboard); an open link, five. */
const maxGuests = computed(() => Math.max(1, Number(guest.value?.pax) || 5))

/* Per invitation and per guest link, as in TemaEnvelopMaroon. */
const receiptKey = `rsvp_${slug}_${guestCode || 'general'}`

onMounted(() => {
  try {
    sent.value = localStorage.getItem(receiptKey) === 'true'
  } catch {
    // Private browsing throws here; the form just stays open.
  }
})

watch(
  [guest, guestName],
  ([g, name]) => {
    if (g?.has_rsvp) sent.value = true
    if (!form.name && name && name !== 'Nama Tamu') form.name = name
  },
  { immediate: true },
)

async function send() {
  if (!form.name.trim() || !form.attending) {
    show('Isi nama dan konfirmasi kehadiran')
    return
  }
  sending.value = true
  try {
    await sendRsvp({
      guest_name: form.name.trim(),
      phone: form.phone.trim(),
      attendance_status: form.attending,
      guest_count: form.attending === 'hadir' ? Number(form.guests) || 1 : 0,
    })
    try {
      localStorage.setItem(receiptKey, 'true')
    } catch {
      // Losing the receipt only means the form reopens on reload.
    }
    sent.value = true
    show(form.attending === 'hadir' ? 'Terima kasih, sampai jumpa!' : 'Terima kasih atas konfirmasinya')
  } catch (err: any) {
    show(err?.message || 'Gagal mengirim konfirmasi. Coba lagi.')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <SheetBand name="rsvp" :plate="plate" :top="17330" :bottom="18000" label="Reservation">
    <h2 class="sr-only">Reservation</h2>

    <!-- Group 32 (2239:213) -->
    <form v-reveal:up="250" class="rsvp" @submit.prevent="send">
      <label class="sr-only" for="rsvp-name">Nama</label>
      <input id="rsvp-name" v-model="form.name" class="field" placeholder="Nama" autocomplete="name" />

      <label class="sr-only" for="rsvp-phone">No Hp</label>
      <input id="rsvp-phone" v-model="form.phone" class="field" type="tel" placeholder="No Hp" autocomplete="tel" />

      <label class="sr-only" for="rsvp-attending">Kehadiran</label>
      <select id="rsvp-attending" v-model="form.attending" class="field" :class="{ 'is-empty': !form.attending }">
        <option value="" disabled>Will you be joining us?</option>
        <option value="hadir">Ya, saya akan hadir</option>
        <option value="tidak_hadir">Maaf, tidak bisa hadir</option>
      </select>

      <label class="sr-only" for="rsvp-guests">Jumlah tamu</label>
      <select
        id="rsvp-guests"
        v-model="form.guests"
        class="field"
        :class="{ 'is-empty': !form.guests }"
        :disabled="form.attending === 'tidak_hadir'"
      >
        <option value="" disabled>Number of Guests:</option>
        <option v-for="n in maxGuests" :key="n" :value="String(n)">{{ n }} orang</option>
      </select>

      <button type="submit" class="rsvp__send" :disabled="sending || sent">
        {{ sent ? 'Terima kasih, konfirmasi diterima' : sending ? 'Sending…' : 'Send' }}
      </button>
    </form>
  </SheetBand>
</template>

<style scoped>
.rsvp {
  top: calc((17533.33 - var(--y0)) * var(--px));
  left: calc(35.67 * var(--px));
  width: calc(685.333 * var(--px));
  display: flex;
  flex-direction: column;
  gap: calc(9.333 * var(--px));
}

.field {
  width: 100%;
  height: calc(72 * var(--px));
  /* Top-aligned like Figma: 16 px padding, then the 30 px line box. */
  padding: calc(16 * var(--px)) calc(16 * var(--px)) calc(23.87 * var(--px));
  line-height: calc(30 * var(--px));
  border: calc(1.067 * var(--px)) solid var(--card);
  border-radius: calc(14.667 * var(--px));
  background: #fff;
  font-family: var(--font-form);
  font-size: calc(26.667 * var(--px));
  color: #1e3c72;
  appearance: none;
}

.field::placeholder,
.field.is-empty {
  color: rgb(30 60 114 / 0.5);
}

.field:focus-visible {
  outline: calc(2 * var(--px)) solid var(--card);
  outline-offset: calc(1 * var(--px));
}

/* The fields end at 17849.33 and the button starts at 17885.33: 36 px, less the flex gap. */
.rsvp__send {
  width: calc(688 * var(--px));
  height: calc(56 * var(--px));
  margin: calc(26.667 * var(--px)) 0 0 calc(-2.67 * var(--px));
  padding: 0;
  border: 0;
  border-radius: calc(132 * var(--px));
  background: var(--card);
  filter: drop-shadow(0 calc(5.333 * var(--px)) calc(2.667 * var(--px)) rgb(0 0 0 / 0.25));
  font-family: var(--font-form);
  font-size: calc(26.667 * var(--px));
  line-height: calc(40 * var(--px));
  color: #fff;
  cursor: pointer;
  transition: transform 200ms ease;
}

.rsvp__send:disabled {
  cursor: default;
}

.rsvp__send:active:not(:disabled) {
  transform: scale(0.98);
}

.rsvp__send:focus-visible {
  outline: calc(2 * var(--px)) solid var(--card);
  outline-offset: calc(3 * var(--px));
}
</style>
