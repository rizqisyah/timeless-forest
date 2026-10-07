<script setup lang="ts">
import designPhoto from '../../assets/cover/00_2268-45_photo.webp'
import monogram from '../../assets/cover/01_2268-57_monogram.webp'
import { computed } from 'vue'
import FireFlies from '../common/FireFlies.vue'
import { useFitSize } from '../../composables/useFitSize'

const props = withDefaults(defineProps<{ coupleNames?: string; guestName: string; photo?: string | null }>(), {
  coupleNames: 'Ahmad & Salsabilla',
  photo: null,
})
defineEmits<{ open: [] }>()

/* "Ahmad &" / "Salsabilla", the design's break; each line must fit the frame's width. */
const lines = computed(() => {
  const [a, ...b] = props.coupleNames.split('&')
  const second = b.join('&').trim()
  return second ? [`${a.trim()} &`, second] : [a.trim()].filter(Boolean)
})
/*
 * The frame covers the screen, so on tall phones its sides are cropped: a 20:9 phone shows
 * only ~505 of its 623 design px. Long names are fitted to what every phone keeps visible,
 * centred on the frame. Design sizes for the design's names; longer names shrink (and only
 * wrap past `min`).
 */
const SAFE = 480
const coupleFs = useFitSize(lines, '--font-cover-couple', 110.91, SAFE, { min: 52 })
const guestFs = useFitSize(() => props.guestName, '--font-cover-guest', 30, SAFE, { italic: true, min: 19 })
</script>

<template>
  <!-- Figma Frame 21 (2268:35, file "Desain Wesbite 25ribuaja"), 623 x 1128. Coords below are frame-local design px. -->
  <section class="cover">
    <div class="cover__frame">
      <!-- The dashboard's cover photo fills the frame; the design's keeps its stretched box. -->
      <img v-if="photo" :src="photo" alt="" class="cover__photo cover__photo--own" />
      <img v-else :src="designPhoto" alt="" width="576" height="885" class="cover__photo" />
      <FireFlies class="cover__flies" />

      <p class="cover__eyebrow">The Wedding Of</p>
      <h1 class="cover__couple" :style="{ '--fs': coupleFs }">
        <span v-for="line in lines" :key="line">{{ line }}</span>
      </h1>

      <button type="button" class="cover__monogram" @click="$emit('open')">
        <span class="sr-only">Buka undangan</span>
        <img :src="monogram" alt="" width="660" height="660" />
      </button>

      <p class="cover__dear">kepada Yth.</p>
      <p class="cover__guest" :style="{ '--fs': guestFs }">{{ guestName }}</p>
    </div>
  </section>
</template>

<style scoped>
.cover {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background-color: var(--cover-bg);
}

/*
 * One design pixel = 1cqw / 6.23. The frame *covers* the viewport (the photo is full-bleed),
 * so on screens narrower than 623:1128 the sides crop — the text column (x 116–508) stays
 * inside for any portrait phone.
 */
.cover__frame {
  container-type: inline-size;
  position: absolute;
  top: 50%;
  left: 50%;
  width: max(100%, calc(100dvh * 623 / 1128));
  aspect-ratio: 623 / 1128;
  transform: translate(-50%, -50%);
}

.cover__frame > * {
  --px: 0.16051cqw; /* 100cqw / 623 */
  --delay: 0ms;
  position: absolute;
  margin: 0;
  text-align: center;
  overflow-wrap: break-word;
  animation: rise calc(1600ms * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) * var(--motion)) backwards;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(calc(26 * var(--px)));
  }
}

@keyframes settle {
  from {
    opacity: 0;
    transform: scale(1.06);
  }
}

/*
 * In Figma the 820 x 1024 PNG (transparent margins) is *stretched* into a 1325 square at
 * (-315, -182) — x1.616 wide, x1.294 tall. The slice is its opaque 576 x 885 area, so it
 * lands at the box below and must keep that non-uniform stretch (the img default, fill).
 */
.cover__photo {
  top: calc(-2.14 * var(--px));
  left: calc(-117.86 * var(--px));
  width: calc(930.73 * var(--px));
  max-width: none;
  height: calc(1145.14 * var(--px));
  animation: settle calc(2600ms * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.cover__photo--own {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Both title layers share one embossed shadow, scaled with their font size. */
.cover__frame > .cover__flies {
  inset: 0;
  animation: none;
}

.cover__eyebrow {
  --delay: 300ms;
  /* Figma top 183; +1 px to match Hotte Brush's baseline in Chromium. */
  top: calc(184 * var(--px));
  left: calc(118 * var(--px));
  width: calc(388 * var(--px));
  font-family: var(--font-cover-eyebrow);
  font-size: calc(48.735 * var(--px));
  line-height: calc(45.699 * var(--px));
  color: var(--cover-title);
  text-shadow:
    calc(0.62 * var(--px)) calc(1.241 * var(--px)) 0 rgb(0 0 0 / 0.47),
    calc(-0.62 * var(--px)) 0 calc(1.494 * var(--px)) rgb(255 255 255 / 0.9);
}

.cover__couple {
  --delay: 520ms;
  /* Figma's box is 392 wide at x 116 (centre 312); widened to the 480 every phone shows. */
  top: calc(264 * var(--px));
  left: calc(72 * var(--px));
  width: calc(480 * var(--px));
  font-family: var(--font-cover-couple);
  font-size: calc(var(--fs) * var(--px));
  font-weight: 400;
  /* 104 / 110.91: the design's leading, kept as the size shrinks. */
  line-height: 0.9377;
  color: var(--cover-title);
  text-shadow:
    calc(1.412 * var(--px)) calc(2.824 * var(--px)) 0 rgb(0 0 0 / 0.47),
    calc(-1.412 * var(--px)) 0 calc(3.4 * var(--px)) rgb(255 255 255 / 0.9);
}

.cover__couple span {
  display: block;
}

.cover__monogram {
  --delay: 820ms;
  top: calc(497 * var(--px));
  left: calc(202 * var(--px));
  width: calc(220 * var(--px));
  height: calc(220 * var(--px));
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  /* After it lands, the monogram glows softly: the screen's only tap cue. */
  animation:
    rise calc(1600ms * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) * var(--motion)) backwards,
    beckon calc(2800ms * var(--motion)) ease-in-out calc(2600ms * var(--motion)) infinite;
}

@keyframes beckon {
  50% {
    filter: drop-shadow(0 0 calc(10 * var(--px)) rgb(255 246 214 / 0.85));
    scale: 1.035;
  }
}

.cover__monogram img {
  width: 100%;
  height: 100%;
}

.cover__monogram:hover,
.cover__monogram:focus-visible {
  transform: scale(1.04);
}

.cover__monogram:active {
  transform: scale(0.98);
}

.cover__monogram:focus-visible {
  outline: calc(2 * var(--px)) solid var(--cover-guest);
  outline-offset: calc(-20 * var(--px));
  border-radius: calc(8 * var(--px));
}

.cover__dear {
  --delay: 1100ms;
  top: calc(804 * var(--px));
  left: calc(125 * var(--px));
  width: calc(373 * var(--px));
  font-family: var(--font-cover-guest);
  font-size: calc(24 * var(--px));
  font-style: italic;
  line-height: calc(62 * var(--px));
  color: var(--cover-guest);
}

.cover__guest {
  --delay: 1280ms;
  /* Figma's box is 373 wide at x 125 (centre 311.5); widened to the visible 480. */
  top: calc(844 * var(--px));
  left: calc(71.5 * var(--px));
  width: calc(480 * var(--px));
  font-family: var(--font-cover-guest);
  font-size: calc(var(--fs) * var(--px));
  font-style: italic;
  line-height: calc(62 * var(--px));
  color: var(--cover-guest);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .cover__frame > * {
    animation: none;
  }

  .cover__monogram {
    transition: none;
  }

  .cover__monogram:hover,
  .cover__monogram:focus-visible,
  .cover__monogram:active {
    transform: none;
  }
}
</style>
