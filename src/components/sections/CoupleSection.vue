<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/03-couple.webp'
import { wedding } from '../../data/wedding'
</script>

<template>
  <SheetBand name="couple" :plate="plate" :top="3810" :bottom="7335" label="Bride & Groom">
    <h2 class="sr-only">Bride &amp; Groom</h2>

    <!-- Group 71 (2233:48) -->
    <h3 v-reveal:up class="couple__name couple__name--groom">{{ wedding.groom.fullName }}</h3>
    <p v-reveal:up="250" class="couple__parents couple__parents--groom">{{ wedding.groom.parents }}</p>

    <!-- Group 95 (2233:60) -->
    <h3 v-reveal:up class="couple__name couple__name--bride">{{ wedding.bride.fullName }}</h3>
    <p v-reveal:up="250" class="couple__parents couple__parents--bride">{{ wedding.bride.parents }}</p>
  </SheetBand>
</template>

<style scoped>
.couple__name {
  font-family: var(--font-display);
  font-size: calc(76.698 * var(--px));
  font-weight: 400;
  line-height: calc(101.931 * var(--px));
  color: var(--emboss);
  text-align: center;
  text-shadow:
    calc(1.204 * var(--px)) calc(1 * var(--px)) calc(3.011 * var(--px)) rgb(0 0 0 / 0.69),
    calc(-1 * var(--px)) 0 calc(0.6 * var(--px)) rgb(255 255 255 / 0.9),
    0 0 calc(4 * var(--px)) rgb(255 255 255 / 0.33);
}

.couple__parents {
  font-family: var(--font-body);
  font-size: calc(30.638 * var(--px));
  line-height: calc(38.298 * var(--px));
  text-align: center;
}

.couple__name--groom {
  top: calc((5050 - var(--y0)) * var(--px));
  left: calc(31 * var(--px));
  width: calc(685 * var(--px));
}

.couple__parents--groom {
  top: calc((5269 - var(--y0)) * var(--px));
  left: calc(120 * var(--px));
  width: calc(508 * var(--px));
  color: #444;
}

.couple__name--bride {
  top: calc((6773 - var(--y0)) * var(--px));
  left: calc(47 * var(--px));
  width: calc(658.723 * var(--px));
}

.couple__parents--bride {
  top: calc((7013 - var(--y0)) * var(--px));
  left: calc(47 * var(--px));
  width: calc(658.723 * var(--px));
  color: #3f3f3f;
}
</style>
