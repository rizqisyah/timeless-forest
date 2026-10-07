/*
 * The photos in Frame 20, lifted out of the artwork so the dashboard's photos can replace
 * them. Boxes are Frame 20 design px from the Figma reference (.figma-ref/frame20-context.tsx);
 * the design's own photo for each is src/assets/photos/<name>.webp (scripts/build-plates.py).
 *
 * A slot with `frame` rides inside that sprite's wrapper, so photo and frame enter (and
 * move) as one piece — under the frame, or over it with `above` (the mirrors, as in Figma).
 * A slot without one stands alone, stacked by Figma's paint order and revealed on its own.
 */
import zOrder from './z-order.json'
import type { Invite } from './wedding'
import type { RevealKind } from './spriteMotion'

export interface PhotoSlot {
  name: string
  /** Figma node the slot replaces. */
  node: string
  band: string
  x: number
  y: number
  w: number
  h: number
  /** mask: cut by the layer's own alpha (src/assets/photos/mask-<name>.png). */
  shape: 'rect' | 'arch' | 'ellipse' | 'mask'
  /** CSS transform about the box centre, as drawn. */
  transform?: string
  /** The gallery thumbnails' inner shadow. */
  inset?: boolean
  frame?: string
  above?: boolean
  reveal?: { in: RevealKind; delay?: number }
  /** Index into the gallery: a click opens the viewer there. */
  gallery?: number
  pick: (p: Invite['photos']) => string | null
}

const fromGallery = (i: number) => (p: Invite['photos']) =>
  p.gallery.length ? p.gallery[i % p.gallery.length] : null

export const photoSlots: PhotoSlot[] = [
  {
    name: 'hero', node: '2232:22', band: 'hero',
    x: 103, y: 341, w: 534, h: 764, shape: 'arch',
    reveal: { in: 'unveil', delay: 700 },
    pick: (p) => p.hero,
  },
  {
    name: 'groom', node: '2228:51', band: 'couple', frame: 'couple-frame-groom',
    x: 74.42, y: 4357.54, w: 600.709, h: 613.825, shape: 'mask',
    pick: (p) => p.groom,
  },
  {
    name: 'bride', node: '2233:58', band: 'couple', frame: 'couple-frame-bride',
    x: 75.42, y: 6061.54, w: 600.709, h: 613.825, shape: 'mask',
    pick: (p) => p.bride,
  },
  {
    name: 'gallery-main', node: '2233:87', band: 'gallery', frame: 'gallery-frame',
    x: 182.84, y: 7830.26, w: 384.922, h: 621.35, shape: 'mask', gallery: 0,
    pick: fromGallery(0),
  },
  ...[64, 270.67, 477.33].map((x, i) => ({
    name: `gallery-${i + 1}`, node: `2233:${90 + i}`, band: 'gallery',
    x, y: 8587, w: 206.667, h: 191.823, shape: 'rect' as const, inset: true, gallery: i + 1,
    reveal: { in: 'up' as const, delay: i * 180 },
    pick: fromGallery(i + 1),
  })),
  {
    // Ellipse 40: 151.827 x 222 turned -4deg inside its 166.946 x 232.052 box at (206, 18791.66).
    name: 'mirror-left', node: '2246:251', band: 'closing', frame: 'closing-mirrors', above: true,
    x: 213.56, y: 18796.69, w: 151.827, h: 222, shape: 'ellipse', transform: 'rotate(-4deg)',
    pick: (p) => p.couple,
  },
  {
    // Ellipse 41: flipped and turned, so the right mirror shows the left one's reflection.
    // Tailwind's `rotate` / `scale` properties apply rotate first, then the flip.
    name: 'mirror-right', node: '2246:252', band: 'closing', frame: 'closing-mirrors', above: true,
    x: 431.31, y: 18802.35, w: 156.284, h: 218.634, shape: 'ellipse',
    transform: 'rotate(-178.81deg) scaleY(-1)',
    pick: (p) => p.couple,
  },
  {
    name: 'thanks', node: '2247:259', band: 'thanks', frame: 'thanks-frame',
    x: 194, y: 20337.5, w: 358, h: 511.095, shape: 'mask',
    pick: (p) => p.couple,
  },
]

export const zOf = (node: string) => (zOrder as Record<string, number>)[node] ?? 0

const files = import.meta.glob<string>('../assets/photos/*', { eager: true, import: 'default' })
export const photoAsset = (name: string) => files[`../assets/photos/${name}.webp`]
export const maskAsset = (name: string) => files[`../assets/photos/mask-${name}.png`]
