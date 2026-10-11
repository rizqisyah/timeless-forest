<script setup lang="ts">
/*
 * General Settings → "Background Video" (wedding.video_url): a full-height opening shot that
 * fills the invitation column right after the cover, as in TemaEnvelopMaroon. Not in Frame 20,
 * which is why it sits above the sheet's first band rather than inside one.
 *
 *   - A background, not a film to watch: it plays muted and without controls, while the
 *     invitation's music plays over it (MusicButton starts the song on the same tap).
 *   - It starts when the invitation is opened (`active`), not at page load: the sheet is laid
 *     out behind the cover all along, so an autoplay attribute would run it unseen.
 *   - It plays once, then scrolls on to the hero; "Lewati" does the same at any time.
 *
 * A YouTube link plays muted and chrome-less in YouTube's player. Google Drive cannot autoplay,
 * so its own player shows (and holds the music if the guest plays it).
 */
import { computed, nextTick, ref, watch } from 'vue'
import { useWedding } from '../../composables/useWedding'

const props = defineProps<{ active: boolean }>()
const { invite } = useWedding()

const source = computed(() => {
  const url = invite.value.backgroundVideo
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  if (yt) {
    const id = yt[1]
    return {
      kind: 'youtube' as const,
      src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&rel=0&playsinline=1&modestbranding=1&disablekb=1&iv_load_policy=3`,
    }
  }
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (drive) return { kind: 'drive' as const, src: `https://drive.google.com/file/d/${drive[1]}/preview` }
  return { kind: 'file' as const, src: url }
})

const player = ref<HTMLVideoElement | null>(null)
const section = ref<HTMLElement | null>(null)

watch(
  () => props.active,
  async (on) => {
    if (!on) return
    await nextTick()
    player.value?.play().catch(() => {
      // Refused (rare when muted): the poster stays, and "Lewati" moves on.
    })
  },
)

/** On to the invitation itself: the hero band right after this section. */
function next() {
  player.value?.pause()
  const hero = section.value?.nextElementSibling
  if (!hero) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  hero.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
</script>

<template>
  <section v-if="source" ref="section" class="opening" aria-label="Video pembuka">
    <video
      v-if="source.kind === 'file'"
      ref="player"
      class="opening__media"
      :src="source.src"
      :poster="invite.photos.cover || undefined"
      muted
      playsinline
      preload="auto"
      disablepictureinpicture
      @ended="next"
    ></video>
    <iframe
      v-else-if="active"
      :src="source.src"
      class="opening__media"
      :class="{ 'is-background': source.kind === 'youtube' }"
      title="Video pembuka"
      allow="autoplay; encrypted-media; fullscreen"
      allowfullscreen
    ></iframe>

    <button type="button" class="opening__skip" @click="next">Lewati</button>
  </section>
</template>

<style scoped>
/*
 * The column's full height: svh, not vh, so the mobile toolbar never crops the bottom. The
 * dark surround letterboxes a portrait clip on desktop.
 */
.opening {
  position: relative;
  height: 100vh;
  height: 100svh;
  background: #141810;
}

.opening__media {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: cover;
}

/* A background: nothing in it to press. */
video.opening__media,
.opening__media.is-background {
  pointer-events: none;
}

.opening__skip {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 7px 16px;
  border: 1px solid rgb(217 217 201 / 0.6);
  border-radius: 999px;
  background: rgb(20 24 16 / 0.55);
  backdrop-filter: blur(4px);
  color: var(--hero-ink);
  font-family: var(--font-form);
  font-size: 15px;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.opening__skip:hover {
  background: rgb(20 24 16 / 0.75);
}

.opening__skip:focus-visible {
  outline: 2px solid var(--hero-ink);
  outline-offset: 2px;
}
</style>
