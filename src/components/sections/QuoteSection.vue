<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/02-quote.webp'
import { wedding } from '../../data/wedding'
import { useCountdown } from '../../composables/useCountdown'

const left = useCountdown(wedding.countdownTo)

/* Group 30 (2228:14): a 2 x 2 grid of 171 px cells, laid out as Figma's flex columns. */
const cells = [
  { key: 'days', label: 'Days', x: 218, y: 1559.21, delay: 500 },
  { key: 'hours', label: 'Hours', x: 357.41, y: 1559.21, delay: 650 },
  { key: 'minutes', label: 'Minutes', x: 218, y: 1715.83, delay: 800 },
  { key: 'seconds', label: 'Seconds', x: 357.41, y: 1715.83, delay: 950 },
] as const
</script>

<template>
  <SheetBand name="quote" :plate="plate" :top="1149" :bottom="3810" label="Save the Date">
    <h2 class="sr-only">Save the Date</h2>

    <div
      v-for="c in cells"
      :key="c.key"
      v-reveal:zoom="c.delay"
      class="cell"
      :style="{ '--x': c.x, '--y': c.y }"
    >
      <p class="cell__digit">
        <Transition name="tick" mode="out-in">
          <span :key="left[c.key]">{{ left[c.key] }}</span>
        </Transition>
      </p>
      <p class="cell__label">{{ c.label }}</p>
    </div>

    <p v-reveal:up class="quote__source">{{ wedding.quote.source }}</p>
    <p v-reveal:up="250" class="quote__text">{{ wedding.quote.text }}</p>
    <p v-reveal:up class="quote__greeting">{{ wedding.greeting }}</p>
  </SheetBand>
</template>

<style scoped>
.cell {
  top: calc((var(--y) - var(--y0)) * var(--px));
  left: calc(var(--x) * var(--px));
  width: calc(171.233 * var(--px));
  height: calc(123.609 * var(--px));
  padding: calc(9.43 * var(--px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(9.43 * var(--px));
  font-family: var(--font-countdown);
  color: #fff;
  text-align: center;
  white-space: nowrap;
}

.cell__digit {
  font-size: calc(56.581 * var(--px));
  font-style: italic;
  line-height: normal;
  font-variant-numeric: tabular-nums;
}

.cell__digit span {
  display: inline-block;
}

.cell__label {
  font-size: calc(23.575 * var(--px));
  line-height: normal;
}

.tick-enter-active,
.tick-leave-active {
  transition:
    opacity calc(260ms * var(--motion)) ease,
    translate calc(260ms * var(--motion)) ease;
}

.tick-enter-from {
  opacity: 0;
  translate: 0 calc(-14 * var(--px));
}

.tick-leave-to {
  opacity: 0;
  translate: 0 calc(14 * var(--px));
}

/* +2 px on each Figma top: Roben's line box sits 2 px higher in Chromium than in Figma. */
.quote__source,
.quote__text,
.quote__greeting {
  font-family: var(--font-quote);
  color: var(--quote-ink);
}

.quote__source {
  top: calc((2220 - var(--y0)) * var(--px));
  left: calc(31 * var(--px));
  width: calc(384 * var(--px));
  font-size: calc(34.605 * var(--px));
  line-height: normal;
  text-align: right;
}

.quote__text {
  top: calc((2305 - var(--y0)) * var(--px));
  left: calc(88 * var(--px));
  width: calc(570 * var(--px));
  font-size: calc(34.605 * var(--px));
  line-height: normal;
  text-align: justify;
}

.quote__greeting {
  top: calc((3010 - var(--y0)) * var(--px));
  left: calc(80 * var(--px));
  width: calc(587.03 * var(--px));
  font-size: calc(35.481 * var(--px));
  line-height: 1.795;
  text-align: justify;
  color: var(--greeting-ink);
}
</style>
