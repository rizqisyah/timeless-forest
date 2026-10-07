import { computed, ref } from 'vue'
import { useWedding } from './useWedding'
import { photoAsset } from '../data/photoSlots'

/*
 * The gallery, shared app-wide:
 *  - the carousel in the gallery band: `current` is the photo in the big frame, and the three
 *    thumbnails show the ones after it. Swiping the frame (or the arrows) moves through every
 *    gallery photo; tapping a thumbnail brings it into the frame.
 *  - the full-screen viewer: `index` is the photo open in it (null = closed).
 *
 * The carousel runs on the dashboard's gallery once it has two photos or more. The design's
 * own four photos (shown when there are none) stay put, exactly as drawn.
 */
const index = ref<number | null>(null)
const current = ref(0)
/** Direction of the last carousel move, for the slide: 1 = next, -1 = previous. */
const dir = ref(1)

export function useGalleryViewer() {
  const { invite } = useWedding()

  const live = computed(() => invite.value.photos.gallery)
  /** Every gallery photo from the dashboard; the design's four when there are none. */
  const photos = computed(() =>
    live.value.length ? live.value : ['gallery-main', 'gallery-1', 'gallery-2', 'gallery-3'].map(photoAsset),
  )
  const carousel = computed(() => live.value.length > 1)

  const wrap = (i: number) => {
    const n = photos.value.length
    return ((i % n) + n) % n
  }

  /** The photo for gallery slot `slot` (0 = big frame, 1-3 = thumbnails); null = design's own. */
  function srcFor(slot: number): string | null {
    if (!live.value.length) return null
    return live.value[wrap((carousel.value ? current.value : 0) + slot)]
  }

  function step(d: number) {
    if (!carousel.value) return
    dir.value = d > 0 ? 1 : -1
    current.value = wrap(current.value + d)
  }

  return {
    index,
    photos,
    carousel,
    current,
    dir,
    srcFor,
    step,
    /** A tap on gallery slot `slot`: the frame opens full screen, a thumbnail moves into it. */
    tap(slot: number) {
      if (carousel.value && slot > 0) step(slot)
      else index.value = wrap((carousel.value ? current.value : 0) + slot)
    },
    open: (i: number) => (index.value = wrap(i)),
    close: () => (index.value = null),
    /** Move inside the full-screen viewer. */
    view: (d: number) => {
      if (index.value === null) return
      index.value = wrap(index.value + d)
    },
  }
}
