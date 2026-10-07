<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import EventBlock from './EventBlock.vue'
import plate from '../../assets/sheet/06-events.webp'
import { useWedding } from '../../composables/useWedding'

const { invite } = useWedding()
</script>

<template>
  <SheetBand name="events" :plate="plate" :top="9554" :bottom="13878" label="Acara Pernikahan">
    <h2 class="sr-only">Acara Pernikahan</h2>
    <!-- acara[0] and acara[1] from the dashboard; a missing event leaves its frame empty. -->
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
