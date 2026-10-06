/*
 * Renders Frame 20 to a tall PNG with some layers hidden -- the layers the Vue sections draw
 * live (.figma-ref/live-nodes.json) and the ones lifted out as animated sprites
 * (.figma-ref/sprites.json). Writes <out.png>.partNN.png; stitch.py joins them.
 *
 * usage: node scripts/render-plate.mjs <out.png> <scale> [ids.json ...]
 */
import { openFrame, readIds, W, H } from './frame-page.mjs'

const [out, scale = '1', ...idFiles] = process.argv.slice(2)
const hide = readIds(...idFiles)
const CHUNK = 3000

const { page, close } = await openFrame(scale)
await page.evaluate((ids) => {
  for (const id of ids) {
    const el = document.querySelector(`[data-node-id="${id}"]`)
    if (!el) throw new Error(`no node ${id}`)
    el.classList.add('plate-hide')
    // `contents` groups have no box of their own; hide their children instead.
    for (const c of el.querySelectorAll('*')) c.classList.add('plate-hide')
  }
}, hide)

// Chromium can't capture 21852px in one go.
let n = 0
for (let y = 0; y < H; y += CHUNK) {
  const p = `${out}.part${String(n++).padStart(2, '0')}.png`
  await page.screenshot({ path: p, fullPage: true, clip: { x: 0, y, width: W, height: Math.min(CHUNK, H - y) } })
}
await close()
