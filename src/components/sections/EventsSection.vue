<script setup lang="ts">
import { computed } from 'vue'
import SheetBand from '../invite/SheetBand.vue'
import EventBlock from './EventBlock.vue'
import plate from '../../assets/sheet/06-events.webp'
import { useWedding } from '../../composables/useWedding'

const { invite } = useWedding()

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
</script>

<template>
  <template v-if="!single">
    <SheetBand name="events" :plate="plate" :top="9554" :bottom="13878" label="Acara Pernikahan">
      <h2 class="sr-only">Acara Pernikahan</h2>
      <EventBlock
        v-if="invite.akad"
        :event="invite.akad"
        fallback-title="Akad Nikah"
        :y="10901"
        :title-y="10416"
        :title-size="101.77"
        :maps-y="11461"
      />
      <EventBlock
        v-if="invite.resepsi"
        :event="invite.resepsi"
        fallback-title="Resepsi"
        :y="12352"
        :title-y="11869"
        :title-size="125.767"
        :maps-y="12901"
      />
    </SheetBand>
  </template>

  <template v-else>
    <SheetBand name="events" :plate="plate" :top="9554" :bottom="CUT_FROM" :plate-bottom="13878" label="Acara Pernikahan">
      <h2 class="sr-only">Acara Pernikahan</h2>
    </SheetBand>
    <SheetBand name="events" :plate="plate" :top="CUT_TO" :bottom="13878" :plate-top="9554" label="Acara">
      <EventBlock
        :event="invite.akad!"
        fallback-title="Akad Nikah"
        :y="12352"
        :title-y="11869"
        :title-size="125.767"
        :maps-y="12901"
      />
    </SheetBand>
  </template>
</template>
