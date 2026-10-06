<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/01-hero.webp'
import { wedding } from '../../data/wedding'
</script>

<template>
  <SheetBand name="hero" :plate="plate" :top="0" :bottom="1149" label="Pembuka" eager>
    <!-- Container 2226:131 -->
    <hgroup class="hero__title">
      <p v-reveal:up="900" class="hero__eyebrow">Undangan Pernikahan</p>
      <h1 v-reveal:emboss="1150" class="hero__couple">{{ wedding.groom.nickname }} &amp; {{ wedding.bride.nickname }}</h1>
    </hgroup>
  </SheetBand>
</template>

<style scoped>
.hero__title {
  top: calc((123 - var(--y0)) * var(--px));
  left: calc(160.07 * var(--px));
  width: calc(427.14 * var(--px));
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
  font-size: calc(63.49 * var(--px));
  font-weight: 400;
  line-height: calc(71.943 * var(--px));
  text-shadow: calc(0.712 * var(--px)) 0 calc(0.712 * var(--px)) rgb(255 255 255 / 0.9);
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
