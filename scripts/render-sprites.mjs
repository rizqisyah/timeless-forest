/*
 * Renders each entry of .figma-ref/sprites.json on its own, on a transparent background, so
 * the app can animate it over the plate. Writes .figma-tmp/sprites/<name>.png plus
 * .figma-tmp/sprites/boxes.json (design-px box and z-order of each).
 *
 * usage: node scripts/render-sprites.mjs <scale>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { openFrame, W, H } from './frame-page.mjs'

const scale = Number(process.argv[2] || '1.5')
const sprites = JSON.parse(readFileSync('.figma-ref/sprites.json', 'utf8'))
const dir = '.figma-tmp/sprites'
mkdirSync(dir, { recursive: true })

const { page, close } = await openFrame(scale)
await page.addStyleTag({
  content: `
    html, body { background: transparent !important; }
    #frame.solo * { visibility: hidden !important; }
    #frame.solo .solo-on, #frame.solo .solo-on * { visibility: visible !important; }
  `,
})

// Paint order = document order of the frame's layers; the app stacks sprites by it.
const order = await page.evaluate(() =>
  Object.fromEntries([...document.querySelectorAll('[data-node-id]')].map((el, i) => [el.dataset.nodeId, i])),
)

const boxes = {}
for (const s of sprites) {
  const box = await page.evaluate((ids) => {
    const frame = document.getElementById('frame')
    frame.classList.add('solo')
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const id of ids) {
      const el = document.querySelector(`[data-node-id="${id}"]`)
      if (!el) throw new Error(`no node ${id}`)
      el.classList.add('solo-on')
      const grow = (r) => {
        if (!r.width || !r.height) return
        x0 = Math.min(x0, r.left + scrollX)
        y0 = Math.min(y0, r.top + scrollY)
        x1 = Math.max(x1, r.right + scrollX)
        y1 = Math.max(y1, r.bottom + scrollY)
      }
      for (const n of [el, ...el.querySelectorAll('*')]) grow(n.getBoundingClientRect())
      // Display type often sits in a box shorter than its letters (Figma: "And" is 238px
      // type in a 120px box). The glyphs' own inline boxes reach past it; without them
      // the capture slices off ascenders and descenders.
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        if (!t.textContent.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(t)
        for (const r of range.getClientRects()) grow(r)
      }
    }
    return { x0, y0, x1, y1 }
  }, s.ids)

  // Room for shadows and blur, clipped to the frame; even coords so x1.5 lands on whole px.
  const pad = 16
  const even = (v) => 2 * Math.floor(v / 2)
  const x = Math.max(0, even(box.x0 - pad))
  const y = Math.max(0, even(box.y0 - pad))
  const w = 2 * Math.ceil((Math.min(W, box.x1 + pad) - x) / 2)
  const h = 2 * Math.ceil((Math.min(H, box.y1 + pad) - y) / 2)

  await page.screenshot({ path: `${dir}/${s.name}.png`, fullPage: true, omitBackground: true, clip: { x, y, width: w, height: h } })
  boxes[s.name] = { x, y, w, h, z: Math.min(...s.ids.map((id) => order[id])) }

  await page.evaluate(() => {
    document.getElementById('frame').classList.remove('solo')
    for (const el of document.querySelectorAll('.solo-on')) el.classList.remove('solo-on')
  })
  console.log(s.name, boxes[s.name])
}
writeFileSync(`${dir}/boxes.json`, JSON.stringify(boxes, null, 2))
// The live photo slots stack by the same paint order (src/data/photoSlots.ts reads this).
writeFileSync('src/data/z-order.json', JSON.stringify(order) + '\n')
await close()
