<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { message } = useToast()
</script>

<template>
  <div class="toast" role="status" aria-live="polite">
    <Transition name="toast">
      <p v-if="message" class="toast__text">{{ message }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
  pointer-events: none;
}

.toast__text {
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--card);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.25);
  font-family: var(--font-form);
  font-size: 16px;
  color: #fff;
  white-space: nowrap;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 250ms ease, transform 250ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
