/*
 * How each sprite (src/data/sprites.json, cut by scripts/build-plates.py) enters and moves.
 * `in` is a reveal kind from src/style/motion.css, `delay` is in ms at --motion 1, `loop` an
 * ambient animation that starts once the entrance has finished.
 *
 * Hero delays start late on purpose: the sheet itself is still rising out of the cover.
 */
export type RevealKind =
  | 'up' | 'down' | 'left' | 'right' | 'fade' | 'emboss' | 'zoom' | 'settle'
  | 'unveil' | 'draw' | 'spread' | 'bloom' | 'bloom-r' | 'seal'
export type LoopKind = 'float' | 'sway' | 'sway-r' | 'breathe' | 'drift' | 'glide' | 'glide-r' | 'bob'

export interface SpriteMotion {
  in: RevealKind
  delay?: number
  loop?: LoopKind
}

export const spriteMotion: Record<string, SpriteMotion> = {
  'hero-arch': { in: 'unveil', delay: 700 },
  'hero-orn-left': { in: 'draw', delay: 1500 },
  'hero-orn-right': { in: 'draw', delay: 1500 },
  'hero-lace': { in: 'up', delay: 1100, loop: 'drift' },
  'hero-lace-edge': { in: 'up', delay: 1300 },
  'hero-seal': { in: 'seal', delay: 2300, loop: 'breathe' },

  'quote-title': { in: 'emboss' },
  'quote-oval': { in: 'zoom', delay: 250 },
  'quote-peony-left': { in: 'bloom', loop: 'sway' },
  'quote-peony-right': { in: 'bloom-r', delay: 250, loop: 'sway-r' },
  'quote-lace-scrap': { in: 'zoom', delay: 450, loop: 'float' },

  'couple-title': { in: 'emboss' },
  'couple-frame-groom': { in: 'settle', delay: 150 },
  'couple-and': { in: 'emboss' },
  'couple-frame-bride': { in: 'settle', delay: 150 },

  'gallery-title': { in: 'emboss' },
  'gallery-frame': { in: 'settle', delay: 150 },
  'gallery-photo-1': { in: 'up', delay: 0 },
  'gallery-photo-2': { in: 'up', delay: 180 },
  'gallery-photo-3': { in: 'up', delay: 360 },
  'gallery-caption': { in: 'fade', delay: 200 },

  'video-title': { in: 'left' },

  'events-title': { in: 'emboss' },
  'events-ornament': { in: 'spread', delay: 300 },
  'events-akad-title': { in: 'emboss' },
  'events-akad-frame': { in: 'settle', delay: 150 },
  'events-akad-pin': { in: 'down', delay: 900, loop: 'bob' },
  'events-resepsi-title': { in: 'emboss' },
  'events-resepsi-frame': { in: 'settle', delay: 150 },
  'events-resepsi-pin': { in: 'down', delay: 900, loop: 'bob' },
  'events-swan-left': { in: 'left', delay: 200, loop: 'glide' },
  'events-swan-right': { in: 'right', delay: 400, loop: 'glide-r' },

  'gift-title': { in: 'emboss' },

  'wishes-ornament': { in: 'draw' },
  'wishes-title': { in: 'emboss', delay: 200 },

  'rsvp-title': { in: 'emboss' },

  'closing-title': { in: 'emboss' },
  'closing-mirrors': { in: 'settle', delay: 200, loop: 'float' },
  'closing-seal': { in: 'seal', delay: 300, loop: 'breathe' },

  'thanks-title': { in: 'emboss' },
  'thanks-frame': { in: 'zoom', delay: 200 },
  'thanks-credit': { in: 'fade', delay: 300 },
}
