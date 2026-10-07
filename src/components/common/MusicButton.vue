<script setup lang="ts">
/*
 * Floating vinyl music toggle, as in TemaPinkRoyalDream (qinvi.id/TemaPinkRoyalDream): 50 px
 * bottom-right on phones, 60 px bottom-left on wide desktops, spinning while the song plays.
 *
 * Mounted when the cover is opened — that tap is a user gesture, so play() is allowed. The
 * song pauses whenever the guest leaves the page (other tab, other app, screen locked) and
 * picks up again when they come back, unless they had paused it themselves.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import vinyl from '../../assets/music/vinyl.webp'
import { useWedding } from '../../composables/useWedding'

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
/** True only while the page itself paused the song; a guest's own pause is left alone. */
let pausedByLeaving = false
const { invite } = useWedding()

/* ---- intro skip + loop (native `loop` would replay the intro), as in TemaEnvelopMaroon ---- */

function seekTo(audio: HTMLAudioElement, t: number) {
  if (!(audio.duration > 0)) return
  try {
    audio.currentTime = Math.max(0, Math.min(t, audio.duration - 0.1))
  } catch {
    // Not seekable yet; `timeupdate` retries.
  }
}

function startOf(audio: HTMLAudioElement) {
  const start = invite.value.music.start
  return start > 0 && start < audio.duration ? start : 0
}

function onLoaded(e: Event) {
  const audio = e.target as HTMLAudioElement
  const start = startOf(audio)
  if (audio.currentTime < start) seekTo(audio, start)
}

function onTimeUpdate(e: Event) {
  const audio = e.target as HTMLAudioElement
  const start = startOf(audio)
  const end = invite.value.music.end
  if (audio.currentTime < start - 0.5 || (end > start && audio.currentTime >= end)) seekTo(audio, start)
}

function onEnded(e: Event) {
  const audio = e.target as HTMLAudioElement
  seekTo(audio, startOf(audio))
  audio.play().catch(() => {})
}

async function play() {
  try {
    await audioEl.value?.play()
  } catch {
    // Autoplay refused; the vinyl stays still and a tap starts it.
  }
}

function toggle() {
  if (!audioEl.value) return
  pausedByLeaving = false
  if (playing.value) audioEl.value.pause()
  else play()
}

/* ---- leaving the page ---- */

function leave() {
  if (!audioEl.value || audioEl.value.paused) return
  pausedByLeaving = true
  audioEl.value.pause()
}

function onVisibility() {
  if (document.hidden) leave()
  else if (pausedByLeaving) {
    pausedByLeaving = false
    play()
  }
}

onMounted(() => {
  play()
  document.addEventListener('visibilitychange', onVisibility)
  // iOS Safari can skip visibilitychange when the tab is backgrounded or closed.
  window.addEventListener('pagehide', leave)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('pagehide', leave)
  audioEl.value?.pause()
})
</script>

<template>
  <button
    type="button"
    class="floating-music"
    :aria-label="playing ? 'Jeda musik' : 'Putar musik'"
    :aria-pressed="playing ? 'true' : 'false'"
    @click="toggle"
  >
    <img :src="vinyl" alt="" class="vinyl-disc" :class="{ 'is-spinning': playing }" width="60" height="60" />
    <audio
      ref="audioEl"
      :src="invite.music.url"
      preload="auto"
      @loadedmetadata="onLoaded"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @play="playing = true"
      @pause="playing = false"
    />
  </button>
</template>

<style scoped>
.floating-music {
  position: fixed;
  right: 20px;
  bottom: calc(25px + env(safe-area-inset-bottom, 0px));
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  box-shadow: 0 4px 15px rgb(0 0 0 / 0.3);
  cursor: pointer;
  transition: transform 0.2s;
  animation: music-in calc(900ms * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) calc(1600ms * var(--motion)) backwards;
}

.floating-music:active {
  transform: scale(0.9);
}

.floating-music:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

@keyframes music-in {
  from {
    opacity: 0;
    scale: 0.6;
  }
}

.vinyl-disc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
}

/* Spins only while the song plays; pausing freezes it where it is. */
.vinyl-disc {
  animation: spin calc(3s * var(--motion)) linear infinite paused;
}

.vinyl-disc.is-spinning {
  animation-play-state: running;
}

@keyframes spin {
  to {
    rotate: 1turn;
  }
}

/* Wide desktop: over the photo panel's bottom-left corner, as in the reference. */
@media (min-width: 1025px) {
  .floating-music {
    right: auto;
    bottom: 40px;
    left: 40px;
    width: 60px;
    height: 60px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-music,
  .vinyl-disc {
    animation: none;
  }
}
</style>
