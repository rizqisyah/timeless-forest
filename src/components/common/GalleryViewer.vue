<script setup lang="ts">
/*
 * Not in Frame 20: tapping a gallery photo opens the whole gallery full screen. Swipe or the
 * arrow keys to move, Esc / the backdrop / × to close. Recoloured with the sheet's palette.
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useGalleryViewer } from '../../composables/useGalleryViewer'

const { index, photos, close, view: step } = useGalleryViewer()
const closeBtn = ref<HTMLButtonElement | null>(null)
let returnFocus: Element | null = null
let startX: number | null = null

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

watch(index, async (i, prev) => {
  if (i !== null && prev === null) {
    returnFocus = document.activeElement
    document.addEventListener('keydown', onKey)
    await nextTick()
    closeBtn.value?.focus()
  } else if (i === null && prev !== null) {
    document.removeEventListener('keydown', onKey)
    ;(returnFocus as HTMLElement | null)?.focus?.()
  }
})

onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

function onDown(e: PointerEvent) {
  startX = e.clientX
}

function onUp(e: PointerEvent) {
  if (startX === null) return
  const dx = e.clientX - startX
  startX = null
  if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
}
</script>

<template>
  <Transition name="viewer">
    <div
      v-if="index !== null"
      class="viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto"
      @click.self="close"
      @pointerdown="onDown"
      @pointerup="onUp"
    >
      <Transition name="viewer-img" mode="out-in">
        <img :key="index" :src="photos[index]" alt="" class="viewer__img" draggable="false" />
      </Transition>

      <button ref="closeBtn" type="button" class="viewer__btn viewer__close" aria-label="Tutup" @click="close">×</button>
      <template v-if="photos.length > 1">
        <button type="button" class="viewer__btn viewer__prev" aria-label="Foto sebelumnya" @click="step(-1)">‹</button>
        <button type="button" class="viewer__btn viewer__next" aria-label="Foto berikutnya" @click="step(1)">›</button>
        <p class="viewer__count">{{ index + 1 }} / {{ photos.length }}</p>
      </template>
    </div>
  </Transition>
</template>

<style scoped>
.viewer {
  position: fixed;
  inset: 0;
  /* Above the music button (99): a full-screen view covers everything. */
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 16px;
  background: rgb(20 24 14 / 0.92);
  backdrop-filter: blur(6px);
  touch-action: pan-y;
}

.viewer__img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 6px;
  box-shadow: 0 12px 40px rgb(0 0 0 / 0.5);
  object-fit: contain;
  user-select: none;
}

.viewer__btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgb(217 217 201 / 0.35);
  border-radius: 50%;
  background: rgb(59 69 50 / 0.75);
  color: var(--hero-ink);
  font-family: var(--font-display);
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
}

.viewer__btn:focus-visible {
  outline: 2px solid var(--hero-ink);
  outline-offset: 2px;
}

.viewer__close {
  top: 14px;
  right: 14px;
}

.viewer__prev {
  left: 12px;
}

.viewer__next {
  right: 12px;
}

.viewer__count {
  position: absolute;
  bottom: 18px;
  font-family: var(--font-form);
  font-size: 15px;
  letter-spacing: 0.1em;
  color: rgb(217 217 201 / 0.8);
}

.viewer-enter-active,
.viewer-leave-active {
  transition: opacity calc(350ms * var(--motion)) ease;
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

.viewer-img-enter-active,
.viewer-img-leave-active {
  transition:
    opacity calc(260ms * var(--motion)) ease,
    scale calc(260ms * var(--motion)) ease;
}

.viewer-img-enter-from,
.viewer-img-leave-to {
  opacity: 0;
  scale: 0.97;
}
</style>
