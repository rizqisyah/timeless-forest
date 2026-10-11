<script setup lang="ts">
import { computed } from 'vue'
import SheetBand from '../invite/SheetBand.vue'
import EventBlock from './EventBlock.vue'
import plate from '../../assets/sheet/06-events.webp'
import { useWedding } from '../../composables/useWedding'

const { invite, text } = useWedding()

/*
 * Two events fill both frames (acara[0] as akad, acara[1] as resepsi), as drawn.
 *
 * One event: the first block (its heading, oval frame and the moulding under it) is cut out
 * of the band and the event takes the second frame, which keeps the lake painting and the
 * swans that follow it. Both cut lines run through plain paper — below the flourish at
 * 10360 and above the RESEPSI heading at 11869 — so the join does not show.
 */
const CUT_FROM = 10370
const CUT_TO = 11830
const single = computed(() => !!invite.value.akad && !invite.value.resepsi)

/*
 * ACARA PERNIKAHAN is the design's own embossed art (sprite events-title). An English
 * invitation leaves it out and sets its heading live in the same type and place.
 */
const english = computed(() => text.value.lang === 'en')
const without = computed(() => (english.value ? ['events-title'] : []))
</script>

<template>
  <template v-if="!single">
    <SheetBand name="events" :plate="plate" :top="9554" :bottom="13878" :without="without" :label="text.bandEvents">
      <h2 v-if="english" v-reveal:emboss class="events__heading">{{ text.eventsHeading(single ? 1 : 2) }}</h2>
      <h2 v-else class="sr-only">{{ text.bandEvents }}</h2>
      <EventBlock
        v-if="invite.akad"
        :event="invite.akad"
        :fallback-title="text.akadTitle"
        :y="10901"
        :title-y="10416"
        :title-size="101.77"
        :maps-y="11461"
      />
      <EventBlock
        v-if="invite.resepsi"
        :event="invite.resepsi"
        :fallback-title="text.resepsiTitle"
        :y="12352"
        :title-y="11869"
        :title-size="125.767"
        :maps-y="12901"
      />
    </SheetBand>
  </template>

  <template v-else>
    <SheetBand name="events" :plate="plate" :top="9554" :bottom="CUT_FROM" :plate-bottom="13878" :without="without" :label="text.bandEvents">
      <h2 v-if="english" v-reveal:emboss class="events__heading">{{ text.eventsHeading(single ? 1 : 2) }}</h2>
      <h2 v-else class="sr-only">{{ text.bandEvents }}</h2>
    </SheetBand>
    <SheetBand name="events" :plate="plate" :top="CUT_TO" :bottom="13878" :plate-top="9554" :label="text.bandEvent">
      <EventBlock
        :event="invite.akad!"
        :fallback-title="text.akadTitle"
        :y="12352"
        :title-y="11869"
        :title-size="125.767"
        :maps-y="12901"
      />
    </SheetBand>
  </template>
</template>

<style scoped>
/*
 * Text 2233:101: Instrument Serif in the paper's grey, two centred lines, embossed — the
 * design's own font and --emboss grey, which a theme override's accent recolours like the
 * event titles under it.
 */
.events__heading {
  top: calc((9816 - var(--y0)) * var(--px));
  left: calc(47 * var(--px));
  width: calc(651 * var(--px));
  margin: 0;
  font-family: var(--font-display);
  font-size: calc(136.981 * var(--px));
  font-weight: 400;
  line-height: calc(113.945 * var(--px));
  color: var(--emboss);
  text-align: center;
  text-transform: uppercase;
  white-space: pre-line;
  text-shadow:
    calc(1.125 * var(--px)) calc(2.25 * var(--px)) calc(2.812 * var(--px)) rgb(0 0 0 / 0.47),
    calc(-1.125 * var(--px)) 0 calc(4.5 * var(--px)) rgb(255 255 255 / 0.9);
}
</style>
