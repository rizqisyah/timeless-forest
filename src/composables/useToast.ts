import { ref } from 'vue'

/* One app-wide message line; AppToast renders it. */
const message = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

export function useToast() {
  function show(text: string) {
    message.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (message.value = ''), 2400)
  }
  return { message, show }
}
