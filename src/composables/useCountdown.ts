import { computed, onMounted, onUnmounted, ref } from 'vue'

/** Days / hours / minutes / seconds until `target`, clamped at 0 once it has passed. */
export function useCountdown(target: string) {
  const end = new Date(target).getTime()
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => (now.value = Date.now()), 1000)
  })
  onUnmounted(() => clearInterval(timer))

  return computed(() => {
    const s = Math.max(0, Math.floor((end - now.value) / 1000))
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor(s / 3600) % 24,
      minutes: Math.floor(s / 60) % 60,
      seconds: s % 60,
    }
  })
}
