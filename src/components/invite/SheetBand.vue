<script setup lang="ts">
/*
 * One horizontal band of Frame 20. The plate is the band's artwork rendered from Figma with the
 * live layers and the sprites hidden (scripts/render-plate.mjs -> build-plates.py); the sprites
 * are those lifted-out layers, stacked in Figma's paint order and animated; the slot draws
 * the live layers on top.
 *
 * Children position themselves in Frame 20's own coordinates:
 *   top: calc((5050 - var(--y0)) * var(--px));
 * so every number can be checked against the Figma inspector unchanged.
 */
import { computed } from 'vue'
import sprites from '../../data/sprites.json'
import { spriteMotion } from '../../data/spriteMotion'

const props = defineProps<{
  /** Band key — matches BANDS in scripts/build-plates.py and the nav targets. */
  name: string
  plate: string
  /** Band top / bottom in Frame 20 design px. */
  top: number
  bottom: number
  label: string
  eager?: boolean
}>()

const files = import.meta.glob<string>('../../assets/sprites/*.webp', { eager: true, import: 'default' })

const layers = computed(() =>
  sprites
    .filter((s) => s.band === props.name)
    .map((s) => ({
      ...s,
      src: files[`../../assets/sprites/${s.name}.webp`],
      motion: spriteMotion[s.name] ?? { in: 'fade' as const },
    })),
)
</script>

<template>
  <section
    class="band sheet-band"
    :class="`band--${name}`"
    :aria-label="label"
    :style="{ '--y0': top, '--h': bottom - top }"
  >
    <img
      :src="plate"
      alt=""
      class="band__plate"
      width="1121"
      :height="Math.round((bottom - top) * 1.5)"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
    />
    <div
      v-for="s in layers"
      :key="s.name"
      v-reveal:[s.motion.in]="s.motion.delay"
      class="sprite"
      :style="{
        left: `calc(${s.x} * var(--px))`,
        top: `calc((${s.y} - var(--y0)) * var(--px))`,
        width: `calc(${s.w} * var(--px))`,
        height: `calc(${s.h} * var(--px))`,
        '--z': s.z,
      }"
    >
      <img
        :src="s.src"
        alt=""
        class="sprite__img"
        :class="s.motion.loop && ['amb', `amb--${s.motion.loop}`]"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
      />
    </div>
    <slot />
  </section>
</template>

<style scoped>
/* Not clipped: a sprite may overhang into the next band, as in Figma. */
.band {
  position: relative;
  height: calc(var(--h) * var(--px));
}

.band__plate {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  pointer-events: none;
  user-select: none;
}

.sprite__img {
  width: 100%;
  height: 100%;
  max-width: none;
  pointer-events: none;
  user-select: none;
}
</style>

<style>
/*
 * Unscoped: the live layers come from the sections' own scopes. Each is placed in design px
 * and sits above every sprite; sprites stack among themselves by Figma's paint order.
 */
.sheet-band > :not(img) {
  position: absolute;
  z-index: 1000;
  margin: 0;
}

.sheet-band > .sprite {
  z-index: var(--z);
  pointer-events: none;
}
</style>
