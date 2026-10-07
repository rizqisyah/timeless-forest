import { computed, onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter } from 'vue'

/** Days / hours / minutes / seconds until `target`, clamped at 0 once it has passed. */
export function useCountdown(target: MaybeRefOrGetter<string | Date | null>) {
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => (now.value = Date.now()), 1000)
  })
  onUnmounted(() => clearInterval(timer))

  return computed(() => {
    const t = toValue(target)
    const end = t ? new Date(t).getTime() : NaN
    const s = Number.isNaN(end) ? 0 : Math.max(0, Math.floor((end - now.value) / 1000))
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor(s / 3600) % 24,
      minutes: Math.floor(s / 60) % 60,
      seconds: s % 60,
    }
  })
}
