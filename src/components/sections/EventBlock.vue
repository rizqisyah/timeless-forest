<script setup lang="ts">
import type { WeddingEvent } from '../../data/wedding'

/*
 * The text inside one oval frame. `y` is where the day name sits in Frame 20; everything else
 * keeps the design's offsets from it (akad: 10901, resepsi: 12352) except LINK MAPS, which the
 * design places 11 px differently in the two frames. The location pin is art.
 */
defineProps<{ event: WeddingEvent; title: string; y: number; mapsY: number }>()
</script>

<template>
  <div class="event" :style="{ '--ey': y, '--my': mapsY - y }">
    <h3 class="sr-only">{{ title }}</h3>
    <p v-if="event.note" v-reveal:up="300" class="event__note">{{ event.note }}</p>
    <p v-reveal:up="450" class="event__day">{{ event.day }}</p>
    <p v-reveal:up="600" class="event__date">{{ event.date }}</p>
    <p v-reveal:up="750" class="event__time">{{ event.time }}</p>
    <p v-reveal:up="950" class="event__venue">{{ event.venue }}</p>
    <p v-reveal:up="1100" class="event__address">
      <span v-for="line in event.address" :key="line">{{ line }}</span>
    </p>
    <a v-reveal:up="1250" class="event__maps" :href="event.mapsUrl" target="_blank" rel="noopener">LINK MAPS</a>
  </div>
</template>

<style scoped>
/* A zero-size anchor at the frame's left edge; children use Frame 20 x and offsets from --ey. */
.event {
  top: calc((var(--ey) - var(--y0)) * var(--px));
  left: 0;
  width: 100%;
}

.event > * {
  --shadow:
    calc(0.486 * var(--px)) calc(0.971 * var(--px)) calc(1.214 * var(--px)) rgb(0 0 0 / 0.47),
    calc(-0.486 * var(--px)) 0 calc(1.942 * var(--px)) rgb(255 255 255 / 0.9);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-family: var(--font-display);
  color: #fff;
  text-align: center;
  text-shadow: var(--shadow);
}

.event__note {
  top: calc(-77 * var(--px));
  width: calc(260 * var(--px));
  font-family: var(--font-event-note);
  font-size: calc(36.87 * var(--px));
  font-style: italic;
  line-height: calc(41.811 * var(--px));
  color: #3a3a3a;
  text-shadow: none;
}

.event__day,
.event__date {
  width: calc(281.033 * var(--px));
  line-height: calc(49.189 * var(--px));
  color: var(--event-date);
}

.event__day {
  top: 0;
  font-size: calc(59.134 * var(--px));
}

.event__date {
  top: calc(72.88 * var(--px));
  font-size: calc(55.13 * var(--px));
}

.event__time {
  top: calc(165 * var(--px));
  width: calc(354 * var(--px));
  font-size: calc(43.13 * var(--px));
  line-height: calc(49.189 * var(--px));
}

.event__venue {
  top: calc(286 * var(--px));
  width: calc(350 * var(--px));
  font-size: calc(30.13 * var(--px));
  line-height: calc(37 * var(--px));
}

.event__address {
  top: calc(369 * var(--px));
  width: calc(343 * var(--px));
  font-size: calc(22.13 * var(--px));
  line-height: calc(30 * var(--px));
}

.event__address span {
  display: block;
}

.event__maps {
  top: calc(var(--my) * var(--px));
  width: calc(365.867 * var(--px));
  font-size: calc(32.61 * var(--px));
  line-height: calc(32 * var(--px));
  text-decoration: underline;
  text-underline-position: from-font;
  --shadow:
    calc(0.518 * var(--px)) calc(1.036 * var(--px)) calc(1.295 * var(--px)) rgb(0 0 0 / 0.47),
    calc(-0.518 * var(--px)) 0 calc(2.072 * var(--px)) rgb(255 255 255 / 0.9);
}

.event__maps:focus-visible {
  outline: calc(2 * var(--px)) solid #fff;
  outline-offset: calc(4 * var(--px));
}
</style>
