<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/11-thanks.webp'
import { wedding } from '../../data/wedding'
</script>

<template>
  <SheetBand name="thanks" :plate="plate" :top="19691" :bottom="21852" label="Thank You">
    <h2 class="sr-only">Thank You</h2>
    <!-- 2249:269 -->
    <p v-reveal:emboss="500" class="thanks__couple">
      <span>{{ wedding.groom.nickname }} &amp;</span>
      <span>{{ wedding.bride.nickname }}</span>
    </p>
  </SheetBand>
</template>

<style scoped>
/* Figma top 21296; +1 px to match its baseline in Chromium. */
.thanks__couple {
  top: calc((21297 - var(--y0)) * var(--px));
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-size: calc(108.324 * var(--px));
  line-height: calc(90.107 * var(--px));
  color: var(--footer-ink);
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  text-shadow: calc(0.892 * var(--px)) 0 calc(0.892 * var(--px)) rgb(255 255 255 / 0.9);
}

.thanks__couple span {
  display: block;
}
</style>
