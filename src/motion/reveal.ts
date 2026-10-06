import type { Directive } from 'vue'

/*
 * `v-reveal:<kind>="<delay ms>"` — the element starts in the <kind> pose from motion.css and
 * eases into place the first time it scrolls into view.
 *
 * Nothing is observed until startReveals() runs: the sheet is mounted (and laid out) behind
 * the cover, so an observer started at mount would play the hero's entrance unseen.
 */
const pending = new Set<Element>()
let io: IntersectionObserver | null = null

function onIntersect(entries: IntersectionObserverEntry[]) {
  for (const e of entries) {
    if (!e.isIntersecting) continue
    e.target.classList.add('is-in')
    io?.unobserve(e.target)
  }
}

export function startReveals() {
  if (io) return
  // Fire a little before the element is fully up; the last band sits close to the page end.
  io = new IntersectionObserver(onIntersect, { rootMargin: '0px 0px -8% 0px' })
  for (const el of pending) io.observe(el)
  pending.clear()
}

export const vReveal: Directive<HTMLElement, number | undefined, string> = {
  mounted(el, binding) {
    el.classList.add('rv')
    el.dataset.rv = binding.arg || 'up'
    if (binding.value) el.style.setProperty('--d', `${binding.value}ms`)
    if (io) io.observe(el)
    else pending.add(el)
  },
  unmounted(el) {
    pending.delete(el)
    io?.unobserve(el)
  },
}
