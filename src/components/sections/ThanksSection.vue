<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/11-thanks.webp'
import { useWedding } from '../../composables/useWedding'
import { useFitSize } from '../../composables/useFitSize'

const { coupleLines } = useWedding()
// "AHMAD &" / "SALSABILLA": each line must fit across the frame; long names shrink.
const fs = useFitSize(coupleLines, '--font-display', 108.324, 660, { upper: true, min: 38 })
</script>

<template>
  <SheetBand name="thanks" :plate="plate" :top="19691" :bottom="21852" label="Thank You">
    <h2 class="sr-only">Thank You</h2>
    <!-- 2249:269 -->
    <p v-reveal:emboss="500" class="thanks__couple" :style="{ '--fs': fs }">
      <span v-for="line in coupleLines" :key="line">{{ line }}</span>
    </p>
  </SheetBand>
</template>

<style scoped>
/* Figma top 21296; +1 px to match its baseline in Chromium. */
.thanks__couple {
  top: calc((21297 - var(--y0)) * var(--px));
  left: 50%;
  transform: translateX(-50%);
  width: calc(680 * var(--px));
  font-family: var(--font-display);
  font-size: calc(var(--fs) * var(--px));
  /* 90.107 / 108.324: the design's tight leading, kept as the size shrinks. */
  line-height: 0.8318;
  color: var(--footer-ink);
  text-align: center;
  text-transform: uppercase;
  text-shadow: calc(0.892 * var(--px)) 0 calc(0.892 * var(--px)) rgb(255 255 255 / 0.9);
}

.thanks__couple span {
  display: block;
}
</style>
