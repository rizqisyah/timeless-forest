<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import EventBlock from './EventBlock.vue'
import plate from '../../assets/sheet/06-events.webp'
import { wedding } from '../../data/wedding'
</script>

<template>
  <SheetBand name="events" :plate="plate" :top="9554" :bottom="13878" label="Acara Pernikahan">
    <h2 class="sr-only">Acara Pernikahan</h2>
    <EventBlock :event="wedding.akad" title="Akad Nikah" :y="10901" :maps-y="11461" />
    <EventBlock :event="wedding.resepsi" title="Resepsi" :y="12352" :maps-y="12901" />
  </SheetBand>
</template>
