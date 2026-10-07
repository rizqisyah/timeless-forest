<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/03-couple.webp'
import { useWedding } from '../../composables/useWedding'
import { useFitSize } from '../../composables/useFitSize'

const { invite } = useWedding()

/*
 * The design sets each full name on (at most) two lines under its frame. A longer name
 * shrinks to keep to two; the parents' line follows it in the flow, so it is pushed down
 * rather than overlapped if a name still runs long.
 */
const groomFs = useFitSize(() => invite.value.groom.fullName, '--font-couple-name', 76.698, 685, { lines: 2, min: 44 })
const brideFs = useFitSize(() => invite.value.bride.fullName, '--font-couple-name', 76.698, 658.723, { lines: 2, min: 44 })
</script>

<template>
  <SheetBand name="couple" :plate="plate" :top="3810" :bottom="7335" label="Bride & Groom">
    <h2 class="sr-only">Bride &amp; Groom</h2>

    <!-- Group 71 (2233:48) -->
    <div class="person person--groom">
      <h3 v-reveal:up class="person__name" :style="{ '--fs': groomFs }">{{ invite.groom.fullName }}</h3>
      <p v-reveal:up="250" class="person__parents">{{ invite.groom.parents }}</p>
    </div>

    <!-- Group 95 (2233:60) -->
    <div class="person person--bride">
      <h3 v-reveal:up class="person__name" :style="{ '--fs': brideFs }">{{ invite.bride.fullName }}</h3>
      <p v-reveal:up="250" class="person__parents">{{ invite.bride.parents }}</p>
    </div>
  </SheetBand>
</template>

<style scoped>
.person__name {
  font-family: var(--font-couple-name);
  font-size: calc(var(--fs) * var(--px));
  font-weight: 400;
  /* 101.931 / 76.698: the design's leading, kept as the size shrinks. */
  line-height: 1.329;
  color: var(--emboss);
  text-align: center;
  text-shadow:
    calc(1.204 * var(--px)) calc(1 * var(--px)) calc(3.011 * var(--px)) rgb(0 0 0 / 0.69),
    calc(-1 * var(--px)) 0 calc(0.6 * var(--px)) rgb(255 255 255 / 0.9),
    0 0 calc(4 * var(--px)) rgb(255 255 255 / 0.33);
}

.person__parents {
  margin-inline: auto;
  font-family: var(--font-body);
  font-size: calc(30.638 * var(--px));
  line-height: calc(38.298 * var(--px));
  text-align: center;
}

/* Name at (31, 5050) 685 wide; parents 508 wide at y 5269 — 15.14 below a two-line name. */
.person--groom {
  top: calc((5050 - var(--y0)) * var(--px));
  left: calc(31 * var(--px));
  width: calc(685 * var(--px));
}

.person--groom .person__parents {
  width: calc(508 * var(--px));
  margin-top: calc(15.138 * var(--px));
  color: var(--parents-ink, #444);
}

/* Name at (47, 6773) 658.72 wide; parents same box at y 7013 — 36.14 below. */
.person--bride {
  top: calc((6773 - var(--y0)) * var(--px));
  left: calc(47 * var(--px));
  width: calc(658.723 * var(--px));
}

.person--bride .person__parents {
  width: 100%;
  margin-top: calc(36.138 * var(--px));
  color: var(--parents-ink, #3f3f3f);
}
</style>
