<script setup lang="ts">
/*
 * The gallery band. Its photos are photo slots (the big frame and the three thumbnails, see
 * photoSlots.ts); with two or more dashboard photos they become a carousel — swipe the frame,
 * tap a thumbnail, or use these arrows (not in the design, set on the white card beside the
 * frame so a mouse can move through the photos too).
 */
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/04-gallery.webp'
import { useGalleryViewer } from '../../composables/useGalleryViewer'

const { carousel, current, photos, step } = useGalleryViewer()
</script>

<template>
  <SheetBand name="gallery" :plate="plate" :top="7335" :bottom="9134" label="Gallery">
    <h2 class="sr-only">Gallery</h2>
    <template v-if="carousel">
      <button type="button" class="gallery__arrow gallery__arrow--prev" @click="step(-1)">
        <span aria-hidden="true">‹</span>
        <span class="sr-only">Foto sebelumnya</span>
      </button>
      <button type="button" class="gallery__arrow gallery__arrow--next" @click="step(1)">
        <span aria-hidden="true">›</span>
        <span class="sr-only">Foto berikutnya</span>
      </button>
      <p class="sr-only" aria-live="polite">Foto {{ current + 1 }} dari {{ photos.length }}</p>
    </template>
  </SheetBand>
</template>

<style scoped>
/* Centred on the big frame's middle (y 8141) in the card's margins either side of it. */
.gallery__arrow {
  top: calc((8141 - 32 - var(--y0)) * var(--px));
  display: grid;
  place-items: center;
  width: calc(64 * var(--px));
  height: calc(64 * var(--px));
  padding: 0 0 calc(6 * var(--px));
  border: calc(1.5 * var(--px)) solid rgb(59 69 50 / 0.3);
  border-radius: 50%;
  background: rgb(255 255 255 / 0.6);
  box-shadow: 0 calc(3 * var(--px)) calc(10 * var(--px)) rgb(0 0 0 / 0.12);
  color: var(--card);
  font-family: var(--font-display);
  font-size: calc(54 * var(--px));
  line-height: 1;
  cursor: pointer;
  transition:
    background 200ms ease,
    scale 200ms ease;
}

.gallery__arrow:hover {
  background: rgb(255 255 255 / 0.85);
}

.gallery__arrow:active {
  scale: 0.92;
}

.gallery__arrow:focus-visible {
  outline: calc(3 * var(--px)) solid var(--card);
  outline-offset: calc(3 * var(--px));
}

.gallery__arrow--prev {
  left: calc((105 - 32) * var(--px));
}

.gallery__arrow--next {
  left: calc((648 - 32) * var(--px));
}
</style>
