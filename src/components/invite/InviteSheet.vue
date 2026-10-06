<script setup lang="ts">
import SheetBand from './SheetBand.vue'
import HeroSection from '../sections/HeroSection.vue'
import QuoteSection from '../sections/QuoteSection.vue'
import CoupleSection from '../sections/CoupleSection.vue'
import EventsSection from '../sections/EventsSection.vue'
import GiftSection from '../sections/GiftSection.vue'
import WishesSection from '../sections/WishesSection.vue'
import RsvpSection from '../sections/RsvpSection.vue'
import ThanksSection from '../sections/ThanksSection.vue'

import galleryPlate from '../../assets/sheet/04-gallery.webp'
import videoPlate from '../../assets/sheet/05-video.webp'
import closingPlate from '../../assets/sheet/10-closing.webp'
</script>

<template>
  <!-- Figma Frame 20 (2226:73), 747 x 21852. Each band is one slice of it, top to bottom. -->
  <div class="sheet">
    <HeroSection />
    <QuoteSection />
    <CoupleSection />
    <SheetBand name="gallery" :plate="galleryPlate" :top="7335" :bottom="9134" label="Gallery">
      <h2 class="sr-only">Gallery</h2>
    </SheetBand>
    <SheetBand name="video" :plate="videoPlate" :top="9134" :bottom="9554" label="Video Prewed">
      <h2 class="sr-only">Video Prewed</h2>
    </SheetBand>
    <EventsSection />
    <GiftSection />
    <WishesSection />
    <RsvpSection />
    <SheetBand name="closing" :plate="closingPlate" :top="18000" :bottom="19691" label="True love never fades">
      <p class="sr-only">True love never fades. Together is our favorite place to be.</p>
    </SheetBand>
    <ThanksSection />
  </div>
</template>

<style scoped>
/* One design px = 100cqw / 747, the same scheme as the cover's 623-wide frame. */
.sheet {
  container-type: inline-size;
  --px: 0.133869cqw;
  width: 100%;
  background: var(--sheet-bg);
  /* Sprites overhang their band and drift while animating; nothing may widen the page. */
  overflow-x: clip;
}
</style>
