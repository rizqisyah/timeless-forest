<script setup lang="ts">
/*
 * One photo slot (src/data/photoSlots.ts): the dashboard's photo, cropped to the slot's
 * opening, or the design's own photo when there is none. Positioned in design px against
 * (originX, originY) — the band's top-left, or the frame sprite it rides in.
 */
import { computed } from 'vue'
import { maskAsset, photoAsset, type PhotoSlot } from '../../data/photoSlots'

const props = defineProps<{ spec: PhotoSlot; src: string | null; originX: number; originY: number }>()
defineEmits<{ open: [index: number] }>()

const fallback = computed(() => photoAsset(props.spec.name))

const style = computed(() => {
  const s = props.spec
  const mask = s.shape === 'mask' ? `url(${maskAsset(s.name)}) center / 100% 100% no-repeat` : undefined
  return {
    left: `calc(${s.x - props.originX} * var(--px))`,
    top: `calc(${s.y - props.originY} * var(--px))`,
    width: `calc(${s.w} * var(--px))`,
    height: `calc(${s.h} * var(--px))`,
    transform: s.transform,
    WebkitMask: mask,
    mask,
  }
})
</script>

<template>
  <component
    :is="spec.gallery !== undefined ? 'button' : 'div'"
    :type="spec.gallery !== undefined ? 'button' : undefined"
    class="photo"
    :class="[`photo--${spec.shape}`, { 'photo--inset': spec.inset, 'photo--open': spec.gallery !== undefined }]"
    :style="style"
    @click="spec.gallery !== undefined && $emit('open', spec.gallery)"
  >
    <img :src="src || fallback" alt="" class="photo__img" decoding="async" loading="lazy" />
    <span v-if="spec.gallery !== undefined" class="sr-only">Lihat foto {{ spec.gallery + 1 }}</span>
  </component>
</template>

<style scoped>
.photo {
  position: absolute;
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
  background: none;
}

.photo__img {
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
}

.photo--arch {
  border-radius: calc(865.625 * var(--px)) calc(865.625 * var(--px)) 0 0;
}

.photo--ellipse {
  border-radius: 50%;
}

/* Rectangle 83-85: an inner shadow over the photo. */
.photo--inset::after {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset calc(-7.993 * var(--px)) calc(4.567 * var(--px)) calc(7.536 * var(--px)) rgb(0 0 0 / 0.47);
  pointer-events: none;
}

.photo--open {
  cursor: zoom-in;
  pointer-events: auto;
}

.photo--open:focus-visible {
  outline: calc(3 * var(--px)) solid #fff;
  outline-offset: calc(3 * var(--px));
}
</style>
