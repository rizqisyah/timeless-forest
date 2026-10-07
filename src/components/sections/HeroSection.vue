<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/01-hero.webp'
import { useWedding } from '../../composables/useWedding'
import { computed } from 'vue'
import { useFitSize } from '../../composables/useFitSize'

const { coupleNames, coupleLines } = useWedding()

/*
 * One line across the frame, as drawn; long names shrink to fit it. Past the point where
 * one line would get too small to read, it breaks at "&" onto two lines instead, kept
 * small enough to clear the wax seal below (y 280).
 */
const oneLine = useFitSize(coupleNames, '--font-hero-couple', 63.49, 680)
const twoLines = useFitSize(coupleLines, '--font-hero-couple', 40, 680, { min: 26 })
const split = computed(() => oneLine.value < 30 && coupleLines.value.length > 1)
const coupleFs = computed(() => (split.value ? twoLines.value : oneLine.value))
</script>

<template>
  <SheetBand name="hero" :plate="plate" :top="0" :bottom="1149" label="Pembuka" eager>
    <!-- Container 2226:131 -->
    <hgroup class="hero__title">
      <p v-reveal:up="900" class="hero__eyebrow">Undangan Pernikahan</p>
      <h1 v-reveal:emboss="1150" class="hero__couple" :class="{ 'is-split': split }" :style="{ '--fs': coupleFs }">
        <template v-if="split"><span v-for="line in coupleLines" :key="line">{{ line }}</span></template>
        <template v-else>{{ coupleNames }}</template>
      </h1>
    </hgroup>
  </SheetBand>
</template>

<style scoped>
/* Figma's container is 427.14 wide at x 160.07 (centre 373.6); widened about it for long names. */
.hero__title {
  top: calc((123 - var(--y0)) * var(--px));
  left: calc(16.6 * var(--px));
  width: calc(714 * var(--px));
  padding: calc(12.6 * var(--px));
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--hero-ink);
  white-space: nowrap;
  text-align: center;
}

.hero__eyebrow {
  font-family: var(--font-hero-eyebrow);
  font-size: calc(40.76 * var(--px));
  line-height: normal;
}

.hero__couple {
  font-family: var(--font-hero-couple);
  font-size: calc(var(--fs) * var(--px));
  font-weight: 400;
  /* The design's 71.943 px line box, kept as the size shrinks so the layout below stays put. */
  line-height: calc(71.943 * var(--px));
  text-shadow: calc(0.712 * var(--px)) 0 calc(0.712 * var(--px)) rgb(255 255 255 / 0.9);
}

.hero__couple.is-split {
  line-height: 1.12;
}

.hero__couple.is-split span {
  display: block;
}
</style>

<style>
/* The landscape behind the arch settles in slowly once the invitation opens. */
.sheet.is-visible .band--hero .band__plate {
  animation: hero-settle calc(9s * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: 50% 30%;
}

@keyframes hero-settle {
  from {
    transform: scale(1.12);
    filter: blur(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sheet.is-visible .band--hero .band__plate {
    animation: none;
  }
}
</style>
