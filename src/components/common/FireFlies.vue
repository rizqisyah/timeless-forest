<script setup lang="ts">
/*
 * Not in the Figma frames: a few slow, warm motes of light drifting over the forest
 * photography (cover, desktop panel). Positions and timings are seeded once per mount.
 */
const props = withDefaults(defineProps<{ count?: number }>(), { count: 18 })

const flies = Array.from({ length: props.count }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${20 + Math.random() * 75}%`,
  size: `${2 + Math.random() * 3}px`,
  dur: `${9 + Math.random() * 10}s`,
  delay: `${-Math.random() * 18}s`,
  dx: `${(Math.random() - 0.5) * 80}px`,
  dy: `${-40 - Math.random() * 90}px`,
}))
</script>

<template>
  <div class="flies" aria-hidden="true">
    <span
      v-for="(f, i) in flies"
      :key="i"
      class="fly"
      :style="{
        left: f.left,
        top: f.top,
        '--size': f.size,
        '--dur': f.dur,
        '--delay': f.delay,
        '--dx': f.dx,
        '--dy': f.dy,
      }"
    ></span>
  </div>
</template>

<style scoped>
.flies {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.fly {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: #fff6d6;
  box-shadow:
    0 0 6px 2px rgb(255 240 190 / 0.7),
    0 0 14px 4px rgb(255 230 160 / 0.25);
  opacity: 0;
  animation: fly calc(var(--dur) * var(--motion)) ease-in-out calc(var(--delay) * var(--motion)) infinite;
}

@keyframes fly {
  0% {
    opacity: 0;
    translate: 0 0;
  }
  20% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.35;
  }
  70% {
    opacity: 0.85;
  }
  100% {
    opacity: 0;
    translate: var(--dx) var(--dy);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fly {
    animation: none;
    opacity: 0.5;
  }
}
</style>
