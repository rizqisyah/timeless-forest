import { computed, ref } from 'vue'
import { useWedding } from './useWedding'
import { photoAsset } from '../data/photoSlots'

/* The full-screen photo viewer: which photo is open (null = closed), shared app-wide. */
const index = ref<number | null>(null)

export function useGalleryViewer() {
  const { invite } = useWedding()

  /** Every gallery photo from the dashboard; the design's four when there are none. */
  const photos = computed(() => {
    const g = invite.value.photos.gallery
    return g.length ? g : ['gallery-main', 'gallery-1', 'gallery-2', 'gallery-3'].map(photoAsset)
  })

  return {
    index,
    photos,
    open: (i: number) => (index.value = Math.min(i, photos.value.length - 1)),
    close: () => (index.value = null),
    step: (d: number) => {
      if (index.value === null) return
      const n = photos.value.length
      index.value = (index.value + d + n) % n
    },
  }
}
