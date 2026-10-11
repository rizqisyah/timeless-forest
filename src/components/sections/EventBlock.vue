<script setup lang="ts">
import { computed } from 'vue'
import type { WeddingEvent } from '../../data/wedding'
import { useFitSize } from '../../composables/useFitSize'
import { useWedding } from '../../composables/useWedding'

/*
 * One event: its heading above the oval frame and the text inside it. `y` is where the day
 * name sits in Frame 20; everything else keeps the design's offsets from it (akad: 10901,
 * resepsi: 12352) except the heading and LINK MAPS, which the design places a little
 * differently in the two frames. The location pin is art.
 */
const props = defineProps<{
  event: WeddingEvent
  /** Used when the acara has no name. */
  fallbackTitle: string
  y: number
  /** 2234:168 at 10416 / 101.77 px; 2333:34 at 11869 / 125.767 px. */
  titleY: number
  titleSize: number
  mapsY: number
}>()

const { text } = useWedding()
const title = computed(() => props.event.title || props.fallbackTitle)
// Shrinks a long name ("Pemberkatan Nikah") to one line across the frame's width.
const titleFs = useFitSize(title, '--font-event-title', props.titleSize, 690, { upper: true })

/*
 * Day, date and time stay on one line each, as drawn. Real values run longer than the
 * design's ("25 SEPTEMBER 2026" against "22 APRIL 2021") and used to wrap into the line
 * below; they now shrink to fit the oval's opening at their height (512 / 570 / 630 px
 * measured, less the frame's moulding).
 */
const dayFs = useFitSize(() => props.event.day, '--font-event-detail', 59.134, 420)
const dateFs = useFitSize(() => props.event.date, '--font-event-detail', 55.13, 460)
const timeFs = useFitSize(() => props.event.time, '--font-event-detail', 43.13, 500)
</script>

<template>
  <div class="event" :style="{ '--ey': y, '--ty': titleY - y, '--my': mapsY - y }">
    <h3 v-reveal:emboss class="event__title" :style="{ '--fs': titleFs }">{{ title }}</h3>
    <p v-if="event.note" v-reveal:up="300" class="event__note">{{ event.note }}</p>
    <p v-if="event.day" v-reveal:up="450" class="event__day" :style="{ '--fs': dayFs }">{{ event.day }}</p>
    <p v-reveal:up="600" class="event__date" :style="{ '--fs': dateFs }">{{ event.date }}</p>
    <p v-if="event.time" v-reveal:up="750" class="event__time" :style="{ '--fs': timeFs }">{{ event.time }}</p>
    <!-- One column from the venue down: a longer venue or address pushes the rest down. -->
    <div class="event__body">
      <p v-reveal:up="950" class="event__venue">{{ event.venue }}</p>
      <p v-reveal:up="1100" class="event__address">
        <span v-for="line in event.address" :key="line">{{ line }}</span>
      </p>
      <a v-reveal:up="1250" class="event__maps" :href="event.mapsUrl" target="_blank" rel="noopener">{{ text.linkMaps }}</a>
    </div>
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
  font-family: var(--font-event-detail);
  color: var(--event-ink);
  text-align: center;
  text-shadow: var(--shadow);
}

/* The embossed heading: Instrument Serif in the paper's own grey, as AKAD NIKAH / RESEPSI. */
.event__title {
  top: calc(var(--ty) * var(--px));
  font-family: var(--font-event-title);
  font-size: calc(var(--fs) * var(--px));
  font-weight: 400;
  line-height: calc(156 * var(--px));
  color: var(--event-title-ink);
  text-transform: uppercase;
  white-space: nowrap;
  --shadow:
    calc(1.206 * var(--px)) calc(2.411 * var(--px)) calc(3.014 * var(--px)) rgb(0 0 0 / 0.47),
    calc(-1.206 * var(--px)) 0 calc(4.823 * var(--px)) rgb(255 255 255 / 0.9);
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

/* One line each, centred on the frame; the line boxes stay the design's 49.189 px. */
.event__day,
.event__date,
.event__time {
  width: max-content;
  font-size: calc(var(--fs) * var(--px));
  line-height: calc(49.189 * var(--px));
  white-space: nowrap;
}

.event__day,
.event__date {
  color: var(--event-date);
}

.event__day {
  top: 0;
}

.event__date {
  top: calc(72.88 * var(--px));
}

.event__time {
  top: calc(165 * var(--px));
}

/*
 * Venue at +286, address at +369 and LINK MAPS at +560 (akad) / +549 (resepsi), as drawn,
 * for the design's two-line venue and three-line address; anything longer moves the lines
 * after it down rather than across them.
 */
.event__body {
  top: calc(286 * var(--px));
  width: calc(365.867 * var(--px));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event__venue {
  width: calc(350 * var(--px));
  min-height: calc(74 * var(--px));
  font-size: calc(30.13 * var(--px));
  line-height: calc(37 * var(--px));
}

.event__address {
  width: calc(343 * var(--px));
  min-height: calc(90 * var(--px));
  margin-top: calc(9 * var(--px));
  font-size: calc(22.13 * var(--px));
  line-height: calc(30 * var(--px));
}

.event__address span {
  display: block;
}

.event__maps {
  width: calc(365.867 * var(--px));
  margin-top: calc((var(--my) - 369 - 90) * var(--px));
  font-size: calc(32.61 * var(--px));
  line-height: calc(32 * var(--px));
  /* A link inside the column takes the browser's link blue unless told otherwise. */
  color: var(--event-ink);
  text-decoration: underline;
  text-underline-position: from-font;
  --shadow:
    calc(0.518 * var(--px)) calc(1.036 * var(--px)) calc(1.295 * var(--px)) rgb(0 0 0 / 0.47),
    calc(-0.518 * var(--px)) 0 calc(2.072 * var(--px)) rgb(255 255 255 / 0.9);
  text-shadow: var(--shadow);
}

.event__maps:focus-visible {
  outline: calc(2 * var(--px)) solid #fff;
  outline-offset: calc(4 * var(--px));
}
</style>
