<script setup lang="ts">
import SheetBand from './SheetBand.vue'
import OpeningVideo from '../sections/OpeningVideo.vue'
import HeroSection from '../sections/HeroSection.vue'
import QuoteSection from '../sections/QuoteSection.vue'
import CoupleSection from '../sections/CoupleSection.vue'
import GallerySection from '../sections/GallerySection.vue'
import VideoSection from '../sections/VideoSection.vue'
import EventsSection from '../sections/EventsSection.vue'
import GiftSection from '../sections/GiftSection.vue'
import WishesSection from '../sections/WishesSection.vue'
import RsvpSection from '../sections/RsvpSection.vue'
import ThanksSection from '../sections/ThanksSection.vue'
import { useWedding } from '../../composables/useWedding'
import { hasEvents, hasGallery, hasGift, hasVideo } from '../../data/wedding'

import closingPlate from '../../assets/sheet/10-closing.webp'

/** The cover has been opened: the opening video starts then, not at page load. */
defineProps<{ open: boolean }>()

const { invite, live } = useWedding()
</script>

<template>
  <!--
    Figma Frame 20 (2226:73), 747 x 21852. Each band is one slice of it, top to bottom.
    Gallery, video and gift are left out when the wedding has nothing for them.
  -->
  <div class="sheet">
    <!-- General Settings' Background Video, right after the cover (only when there is one). -->
    <OpeningVideo :active="open" />
    <HeroSection />
    <QuoteSection />
    <CoupleSection />
    <GallerySection v-if="hasGallery(invite, live)" />
    <VideoSection v-if="hasVideo(invite, live)" />
    <EventsSection v-if="hasEvents(invite, live)" />
    <GiftSection v-if="hasGift(invite, live)" />
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
  /*
   * The sheet's own stacking (sprites by Figma paint order, live text at 1000) stays inside
   * it, so nothing in the invitation can rise above the overlays drawn over it: the gallery
   * viewer, the music button, the toast.
   */
  isolation: isolate;
}
</style>
