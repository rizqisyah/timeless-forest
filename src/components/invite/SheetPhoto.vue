<script setup lang="ts">
/*
 * One photo slot (src/data/photoSlots.ts): the dashboard's photo, cropped to the slot's
 * opening, or the design's own photo when there is none. Positioned in design px against
 * (originX, originY) — the band's top-left, or the frame sprite it rides in.
 *
 * Gallery slots are buttons; with `swipe` they also follow a horizontal drag and report a
 * swipe, and a new photo slides in from the side it was swiped towards (`dir`).
 */
import { computed, ref } from 'vue'
import { maskAsset, photoAsset, type PhotoSlot } from '../../data/photoSlots'

const props = defineProps<{
  spec: PhotoSlot
  src: string | null
  originX: number
  originY: number
  swipe?: boolean
  /** 1 = the next photo comes in from the right, -1 = from the left. */
  dir?: number
}>()
const emit = defineEmits<{ open: [slot: number]; swipe: [step: number] }>()

const fallback = computed(() => photoAsset(props.spec.name))
const isGallery = computed(() => props.spec.gallery !== undefined)

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
    '--dir': props.dir ?? 1,
    '--drag': `${drag.value}px`,
  }
})

/* ---- swipe: a horizontal drag of 40px or more, not a scroll and not a tap ---- */
const drag = ref(0)
let start: { x: number; y: number; id: number } | null = null
let swiped = false

function onDown(e: PointerEvent) {
  if (!props.swipe) return
  start = { x: e.clientX, y: e.clientY, id: e.pointerId }
  swiped = false
}

function onMove(e: PointerEvent) {
  if (!start || e.pointerId !== start.id) return
  const dx = e.clientX - start.x
  // Only once the gesture is clearly sideways, so a vertical scroll never drags the photo.
  if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - start.y)) drag.value = dx * 0.5
}

function onUp(e: PointerEvent) {
  if (!start || e.pointerId !== start.id) return
  const dx = e.clientX - start.x
  const dy = e.clientY - start.y
  start = null
  drag.value = 0
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    swiped = true
    emit('swipe', dx < 0 ? 1 : -1)
  }
}

function onCancel() {
  start = null
  drag.value = 0
}

function onClick() {
  // The click that ends a swipe is not a tap.
  if (swiped) {
    swiped = false
    return
  }
  if (isGallery.value) emit('open', props.spec.gallery!)
}
</script>

<template>
  <component
    :is="isGallery ? 'button' : 'div'"
    :type="isGallery ? 'button' : undefined"
    class="photo"
    :class="[
      `photo--${spec.shape}`,
      { 'photo--inset': spec.inset, 'photo--open': isGallery, 'photo--swipe': swipe, 'is-dragging': drag !== 0 },
    ]"
    :style="style"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onCancel"
    @click="onClick"
  >
    <Transition name="swap">
      <img :key="src || fallback" :src="src || fallback" alt="" class="photo__img" decoding="async" loading="lazy" draggable="false" />
    </Transition>
    <span v-if="isGallery" class="sr-only">
      {{ spec.gallery === 0 ? 'Lihat foto' : `Tampilkan foto ${spec.gallery! + 1}` }}
    </span>
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
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  translate: var(--drag) 0;
  transition: translate calc(320ms * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  -webkit-user-drag: none;
}

.photo.is-dragging .photo__img {
  transition: none;
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
  cursor: pointer;
  pointer-events: auto;
}

/* Vertical scrolling stays with the page; sideways movement is ours to read as a swipe. */
.photo--swipe {
  touch-action: pan-y;
  cursor: grab;
}

.photo--swipe.is-dragging {
  cursor: grabbing;
}

.photo--open:focus-visible {
  outline: calc(3 * var(--px)) solid #fff;
  outline-offset: calc(3 * var(--px));
}

/* A new photo slides in from the side it was swiped towards while the old one leaves. */
.swap-enter-active,
.swap-leave-active {
  transition:
    opacity calc(520ms * var(--motion)) ease,
    translate calc(620ms * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1);
}

.swap-enter-from {
  opacity: 0;
  translate: calc(var(--dir) * 35%) 0;
}

.swap-leave-to {
  opacity: 0;
  translate: calc(var(--dir) * -35%) 0;
}

@media (prefers-reduced-motion: reduce) {
  .swap-enter-active,
  .swap-leave-active {
    transition: opacity 0.2s linear;
  }

  .swap-enter-from,
  .swap-leave-to {
    translate: none;
  }
}
</style>
