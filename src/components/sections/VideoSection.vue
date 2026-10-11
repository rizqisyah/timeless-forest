<script setup lang="ts">
/*
 * Rectangle 86 (2233:95) is the design's video still under the "VIDEO PREWED" title. With the
 * prewedding video from the dashboard (Theme Override, Kata-kata: words.video_prewed) the
 * still becomes that video, playing muted and looping behind the title like a moving
 * photograph, and only while the band is on screen. "Tonton dengan suara" swaps in the full
 * player with sound and pauses the music. General Settings' "Background Video" is a different
 * field: it opens the invitation (OpeningVideo.vue).
 *
 *   MP4 / any file  <video> — muted loop in the background, native controls with sound
 *   YouTube         embed — muted, looped, chrome-less background; normal player with sound
 *   Google Drive    Drive's own player (it cannot autoplay muted), under the title
 *
 * Without a video the band is just the artwork, or left out for a real wedding (hasVideo).
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/05-video.webp'
import { useWedding } from '../../composables/useWedding'
import { zOf } from '../../data/photoSlots'
import { holdMusic, releaseMusic } from '../../composables/useMusicHold'

const { invite, text } = useWedding()

const source = computed(() => {
  const url = invite.value.prewedVideo
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  if (yt) return { kind: 'youtube' as const, id: yt[1] }
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (drive) return { kind: 'drive' as const, src: `https://drive.google.com/file/d/${drive[1]}/preview` }
  return { kind: 'file' as const, src: url }
})

const box = ref<HTMLElement | null>(null)
const player = ref<HTMLVideoElement | null>(null)
/** The band has come on screen at least once (the YouTube embed loads only then). */
const seen = ref(false)
/** On screen now: the background video only runs while it can be seen. */
const visible = ref(false)
/** The guest asked for sound: full player, above the title. */
const withSound = ref(false)
const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ytSrc = computed(() => {
  if (source.value?.kind !== 'youtube') return ''
  const id = source.value.id
  return withSound.value
    ? `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&rel=0&playsinline=1`
    : `https://www.youtube.com/embed/${id}?autoplay=${still ? 0 : 1}&mute=1&loop=1&playlist=${id}&controls=0&rel=0&playsinline=1&modestbranding=1&disablekb=1&iv_load_policy=3`
})

function sync() {
  const v = player.value
  if (!v || withSound.value) return
  if (visible.value && !still) v.play().catch(() => {})
  else v.pause()
}

let io: IntersectionObserver | null = null
onMounted(() => {
  io = new IntersectionObserver(
    ([e]) => {
      visible.value = e.isIntersecting
      if (e.isIntersecting) seen.value = true
      sync()
    },
    { threshold: 0.2 },
  )
  if (box.value) io.observe(box.value)
})
// The box only exists once getHome has returned a video, usually after mount: watch for it.
watch(box, (el, old) => {
  if (old) io?.unobserve(old)
  if (el) io?.observe(el)
})
onBeforeUnmount(() => io?.disconnect())

async function playWithSound() {
  // The song pauses while the video has the sound, and comes back when it stops (useMusicHold).
  holdMusic()
  withSound.value = true
  await nextTick()
  const v = player.value
  if (v) {
    v.muted = false
    v.controls = true
    v.loop = false
    v.play().catch(() => {})
  }
}

/* With sound, the music follows the video: held while it plays aloud, back when it stops. */
function onSoundChange() {
  const v = player.value
  if (!v || !withSound.value) return
  if (!v.paused && !v.muted && v.volume > 0) holdMusic()
  else releaseMusic()
}

/* Finished with sound: back to the silent looping background, and the music resumes. */
function onEnded() {
  const v = player.value
  if (!v || !withSound.value) return
  withSound.value = false
  v.muted = true
  v.controls = false
  v.loop = true
  releaseMusic()
  sync()
}
</script>

<template>
  <SheetBand name="video" :plate="plate" :top="9134" :bottom="9554" label="Video Prewed">
    <h2 class="sr-only">Video Prewed</h2>

    <!-- In the still's place: under the "VIDEO PREWED" title, over it once playing with sound. -->
    <div
      v-if="source"
      ref="box"
      class="video"
      :class="{ 'is-sound': withSound }"
      :style="{ '--z': withSound ? zOf('2233:96') + 1 : zOf('2233:95') }"
    >
      <video
        v-if="source.kind === 'file'"
        ref="player"
        class="video__media"
        :src="source.src"
        muted
        loop
        playsinline
        preload="metadata"
        @loadeddata="sync"
        @play="onSoundChange"
        @pause="onSoundChange"
        @volumechange="onSoundChange"
        @ended="onEnded"
      ></video>
      <iframe
        v-else-if="source.kind === 'youtube' && (seen || withSound)"
        :key="ytSrc"
        :src="ytSrc"
        class="video__media video__media--yt"
        title="Video prewedding"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>
      <iframe
        v-else-if="source.kind === 'drive'"
        :src="source.src"
        class="video__media"
        title="Video prewedding"
        allow="autoplay; fullscreen"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>

    <button
      v-if="source && source.kind !== 'drive' && !withSound"
      type="button"
      class="video__sound"
      @click="playWithSound"
    >
      {{ text.watchWithSound }}
    </button>
  </SheetBand>
</template>

<style scoped>
.sheet-band > .video {
  z-index: var(--z);
}

/* Rectangle 86: x -1, y 9134, 747 x 420.188 (16:9, so a video fills it without cropping). */
.video {
  top: calc((9134 - var(--y0)) * var(--px));
  left: calc(-1 * var(--px));
  width: calc(747 * var(--px));
  height: calc(420.188 * var(--px));
  overflow: hidden;
}

/* Transparent until the first frame arrives, so the design's still shows meanwhile. */
.video__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: cover;
  background: transparent;
}

.video.is-sound .video__media {
  background: #000;
}

/* A background: the guest cannot reach YouTube's own controls until asking for sound. */
.video:not(.is-sound) .video__media--yt {
  pointer-events: none;
}

/* Top right, clear of the title along the bottom-left. */
.video__sound {
  top: calc((9134 + 24 - var(--y0)) * var(--px));
  right: calc(24 * var(--px));
  padding: calc(10 * var(--px)) calc(22 * var(--px));
  border: calc(1.5 * var(--px)) solid rgb(217 217 201 / 0.7);
  border-radius: calc(100 * var(--px));
  background: rgb(59 69 50 / 0.6);
  backdrop-filter: blur(4px);
  color: var(--hero-ink);
  font-family: var(--font-form);
  font-size: calc(24 * var(--px));
  line-height: 1.2;
  cursor: pointer;
  transition: background 200ms ease;
}

.video__sound:hover {
  background: rgb(59 69 50 / 0.8);
}

.video__sound:focus-visible {
  outline: calc(3 * var(--px)) solid #fff;
  outline-offset: calc(3 * var(--px));
}
</style>
