<script setup lang="ts">
/*
 * Rectangle 86 (2233:95) is the design's video still. With a prewedding video from the
 * dashboard (wedding.video_url, or words.video_prewed) it gets a play button and plays in
 * place; without one the band is just the artwork. A YouTube link brings its own thumbnail.
 */
import { computed, ref } from 'vue'
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/05-video.webp'
import { useWedding } from '../../composables/useWedding'
import { zOf } from '../../data/photoSlots'

const { invite } = useWedding()
const playing = ref(false)

const source = computed(() => {
  const url = invite.value.video
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  if (yt) {
    return {
      kind: 'frame' as const,
      src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0&playsinline=1`,
      poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
    }
  }
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (drive) return { kind: 'frame' as const, src: `https://drive.google.com/file/d/${drive[1]}/preview`, poster: '' }
  return { kind: 'file' as const, src: url, poster: '' }
})

function play() {
  // The background song and the video should not play over each other.
  document.querySelector<HTMLAudioElement>('.floating-music audio')?.pause()
  playing.value = true
}
</script>

<template>
  <SheetBand name="video" :plate="plate" :top="9134" :bottom="9554" label="Video Prewed">
    <h2 class="sr-only">Video Prewed</h2>

    <!-- Under the "VIDEO PREWED" title while waiting; over it once playing. -->
    <div
      v-if="source"
      class="video"
      :style="{ '--z': playing ? zOf('2233:96') + 1 : zOf('2233:95') }"
    >
      <template v-if="!playing">
        <img v-if="source.poster" :src="source.poster" alt="" class="video__poster" loading="lazy" />
        <button type="button" class="video__play" @click="play">
          <span class="video__triangle" aria-hidden="true"></span>
          <span class="sr-only">Putar video prewedding</span>
        </button>
      </template>
      <iframe
        v-else-if="source.kind === 'frame'"
        :src="source.src"
        class="video__media"
        title="Video prewedding"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>
      <video v-else :src="source.src" class="video__media" controls autoplay playsinline></video>
    </div>
  </SheetBand>
</template>

<style scoped>
.sheet-band > .video {
  z-index: var(--z);
}

/* Rectangle 86: x -1, y 9134, 747 x 420.188. */
.video {
  top: calc((9134 - var(--y0)) * var(--px));
  left: calc(-1 * var(--px));
  width: calc(747 * var(--px));
  height: calc(420.188 * var(--px));
  overflow: hidden;
  background: transparent;
}

.video__poster,
.video__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: cover;
  background: #000;
}

.video__play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: calc(110 * var(--px));
  height: calc(110 * var(--px));
  padding: 0;
  border: calc(2 * var(--px)) solid rgb(217 217 201 / 0.8);
  border-radius: 50%;
  background: rgb(59 69 50 / 0.55);
  backdrop-filter: blur(4px);
  translate: -50% -50%;
  cursor: pointer;
  animation: video-pulse calc(2.6s * var(--motion)) ease-in-out infinite;
  transition: scale 200ms ease;
}

.video__play:hover {
  scale: 1.06;
}

.video__play:focus-visible {
  outline: calc(3 * var(--px)) solid #fff;
  outline-offset: calc(4 * var(--px));
}

/* A plain triangle, not an icon file: the design has no play glyph of its own. */
.video__triangle {
  width: 0;
  height: 0;
  margin-left: calc(8 * var(--px));
  border-top: calc(20 * var(--px)) solid transparent;
  border-bottom: calc(20 * var(--px)) solid transparent;
  border-left: calc(32 * var(--px)) solid var(--hero-ink);
}

@keyframes video-pulse {
  50% {
    box-shadow: 0 0 0 calc(14 * var(--px)) rgb(217 217 201 / 0.12);
  }
}

@media (prefers-reduced-motion: reduce) {
  .video__play {
    animation: none;
  }
}
</style>
