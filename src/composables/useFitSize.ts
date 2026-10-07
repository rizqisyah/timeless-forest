import { onMounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

let ctx: CanvasRenderingContext2D | null = null

export interface FitOptions {
  /** Measure upper-cased, for text rendered with text-transform: uppercase. */
  upper?: boolean
  italic?: boolean
  /** Never shrink below this (design px); past it the text may wrap instead. */
  min?: number
  /**
   * For text left to wrap: the number of lines it may take at `width`. Word breaks waste
   * some of each line, so the estimate keeps a margin.
   */
  lines?: number
}

/**
 * The largest font size, up to `max`, at which `text` fits `width` — both in design px, so
 * the result scales with the sheet like everything else. An array is a set of lines that
 * must each fit (the size the longest one allows). Measured on a canvas in the font `cssVar`
 * resolves to, once that font has loaded, so a fallback face never sets the size.
 *
 * Names in the design are a fixed length; a couple's real names are not. Short ones keep the
 * design's size exactly, long ones shrink until they fit.
 */
export function useFitSize(
  text: MaybeRefOrGetter<string | string[]>,
  cssVar: string,
  max: number,
  width: number,
  opts: FitOptions = {},
) {
  const size = ref(max)

  async function fit() {
    const raw = toValue(text)
    const lines = (Array.isArray(raw) ? raw : [raw])
      .map((t) => (opts.upper ? t.toUpperCase() : t).trim())
      .filter(Boolean)
    if (!lines.length) return
    const family = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || 'serif'
    const font = `${opts.italic ? 'italic ' : ''}100px ${family}`
    try {
      await document.fonts.load(font, lines.join(' '))
    } catch {
      // An unloadable family measures in the fallback; still better than overflowing.
    }
    ctx ??= document.createElement('canvas').getContext('2d')
    if (!ctx) return
    ctx.font = font
    const widest = Math.max(...lines.map((l) => ctx!.measureText(l).width))
    const room = opts.lines ? width * opts.lines * 0.86 : width
    const fitted = widest > 0 ? (100 * room) / widest : max
    size.value = Math.max(opts.min ?? 0, Math.min(max, fitted))
  }

  onMounted(fit)
  watch(() => toValue(text), fit, { deep: true })
  // Theme Override can swap the font after load.
  document.fonts.addEventListener?.('loadingdone', fit)
  return size
}
