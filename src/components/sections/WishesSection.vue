<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/08-wishes.webp'
import { useWedding } from '../../composables/useWedding'
import { useToast } from '../../composables/useToast'

const PAGE = 3
const { show } = useToast()
const { invite, guestName, sendWish } = useWedding()

/* getHome's ucapan list, plus anything posted this session on top. */
const wishes = computed(() => invite.value.wishes)
const shown = ref(PAGE)
const visible = computed(() => wishes.value.slice(0, shown.value))

const name = ref('')
const message = ref('')
const sending = ref(false)

// A personal link (?to=) already knows who is writing.
watch(
  guestName,
  (g) => {
    if (g && g !== 'Nama Tamu' && !name.value) name.value = g
  },
  { immediate: true },
)

async function send() {
  if (!name.value.trim() || !message.value.trim()) {
    show('Isi nama dan ucapan dulu')
    return
  }
  sending.value = true
  try {
    await sendWish({ guest_name: name.value.trim(), message: message.value.trim() })
    shown.value = Math.max(shown.value, PAGE)
    message.value = ''
    show('Terima kasih atas ucapannya')
  } catch (err: any) {
    show(err?.message || 'Gagal mengirim ucapan. Coba lagi.')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <SheetBand name="wishes" :plate="plate" :top="15560" :bottom="17330" label="Wedding Wishes">
    <h2 class="sr-only">Wedding Wishes</h2>

    <!-- Group 71 (2239:191) -->
    <form v-reveal:up="300" class="wish__form" @submit.prevent="send">
      <label class="sr-only" for="wish-name">Nama</label>
      <input id="wish-name" v-model="name" class="field field--name" placeholder="Name" autocomplete="name" />
      <label class="sr-only" for="wish-message">Ucapan</label>
      <textarea id="wish-message" v-model="message" class="field field--message" placeholder="Give your wish"></textarea>
      <button type="submit" class="pill pill--send" :disabled="sending">{{ sending ? 'Sending…' : 'Send' }}</button>
    </form>

    <ul class="wish__list" aria-live="polite">
      <li v-for="(w, i) in visible" :key="w.name + w.time + i" v-reveal:up="(i % 3) * 150" class="wish">
        <p class="wish__name">{{ w.name }}</p>
        <p class="wish__time">{{ w.time }}</p>
        <p class="wish__message">{{ w.message }}</p>
      </li>
    </ul>

    <!-- Always drawn, as in the design; inert once every wish is listed. -->
    <button v-reveal:up="200" type="button" class="pill pill--more" :disabled="shown >= wishes.length" @click="shown += PAGE">
      Show more
    </button>
  </SheetBand>
</template>

<style scoped>
.wish__form {
  top: calc((16074.35 - var(--y0)) * var(--px));
  left: calc(33.34 * var(--px));
  width: calc(688.21 * var(--px));
}

.wish__form > * {
  position: absolute;
  left: 0;
  width: 100%;
}

.field {
  padding: calc(16.067 * var(--px));
  border: calc(1.071 * var(--px)) solid var(--card);
  border-radius: calc(14.728 * var(--px));
  background: #fff;
  font-family: var(--font-form);
  font-size: calc(26.779 * var(--px));
  color: #000;
  resize: none;
}

.field::placeholder {
  color: rgb(0 0 0 / 0.5);
}

.field:focus-visible {
  outline: calc(2 * var(--px)) solid var(--card);
  outline-offset: calc(1 * var(--px));
}

/* Inputs centre their line; Figma top-aligns it in the 16 px padding (30 px line box). */
.field--name {
  top: 0;
  height: calc(74.98 * var(--px));
  padding-bottom: calc(26.77 * var(--px));
  line-height: calc(30 * var(--px));
}

.field--message {
  top: calc(93.72 * var(--px));
  height: calc(120.504 * var(--px));
  line-height: calc(40.168 * var(--px));
}

.pill {
  height: calc(56.235 * var(--px));
  padding: 0;
  border: 0;
  border-radius: calc(132.554 * var(--px));
  background: var(--card);
  filter: drop-shadow(0 calc(5.356 * var(--px)) calc(2.678 * var(--px)) rgb(0 0 0 / 0.25));
  font-family: var(--font-form);
  font-size: calc(26.779 * var(--px));
  line-height: calc(40.168 * var(--px));
  color: #fff;
  cursor: pointer;
  transition: transform 200ms ease;
}

.pill:disabled {
  cursor: default;
}

.pill:active:not(:disabled) {
  transform: scale(0.98);
}

.pill:focus-visible {
  outline: calc(2 * var(--px)) solid var(--card);
  outline-offset: calc(3 * var(--px));
}

.pill--send {
  top: calc(249.04 * var(--px));
}

/* The three sample wishes fill 16415 -> 17112; more scroll inside the same box. */
.wish__list {
  top: calc((16415.78 - var(--y0)) * var(--px));
  left: calc(88.23 * var(--px));
  width: calc(600 * var(--px));
  height: calc(697 * var(--px));
  padding: 0;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}

.wish + .wish {
  margin-top: calc(36.2 * var(--px));
}

.wish__name {
  font-family: var(--font-wish-name);
  font-size: calc(26.779 * var(--px));
  font-weight: 800;
  line-height: calc(40.168 * var(--px));
}

.wish__time {
  font-family: var(--font-form);
  font-size: calc(24.101 * var(--px));
  line-height: calc(36.151 * var(--px));
}

.wish__message {
  width: calc(571.723 * var(--px));
  font-family: var(--font-form);
  font-size: calc(26.779 * var(--px));
  line-height: calc(40.168 * var(--px));
  overflow-wrap: break-word;
}

.pill--more {
  top: calc((17130.77 - var(--y0)) * var(--px));
  left: calc(31.99 * var(--px));
  width: calc(688.21 * var(--px));
}
</style>
