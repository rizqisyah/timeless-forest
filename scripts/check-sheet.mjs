/*
 * Opens the built app (vite preview on :5185) at 747 px wide -- 1 design px = 1 css px --
 * taps through the cover and captures the whole sheet for diffing against Figma's render.
 * usage: node scripts/check-sheet.mjs <out.png>
 */
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const { chromium } = await import(
  pathToFileURL(resolve('../TemaEnvelopMaroon/node_modules/playwright/index.mjs')).href
)
const out = process.argv[2]
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 747, height: 1128 }, reducedMotion: 'reduce' })
await page.goto('http://localhost:5185/TemaTimelessForest/')
await page.click('.cover__monogram')
await page.waitForTimeout(600)
// Entrances fire on scroll; walk the page once so everything is in its final pose.
await page.addStyleTag({ content: '.floating-music { display: none !important; }' })
const end = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < end; y += 400) {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(60)
}
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(1500)
const hidden = await page.evaluate(() => document.querySelectorAll('.rv:not(.is-in)').length)
console.log('unrevealed', hidden)
await page.evaluate(async () => {
  for (const img of document.querySelectorAll('img')) img.loading = 'eager'
  await document.fonts.ready
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})))
})
await page.waitForTimeout(500)
const top = await page.evaluate(() => document.querySelector('.sheet').getBoundingClientRect().top + scrollY)
const H = 21852
const parts = []
for (let y = 0; y < H; y += 3000) {
  const p = `${out}.part${String(parts.length).padStart(2, '0')}.png`
  await page.screenshot({ path: p, fullPage: true, clip: { x: 0, y: top + y, width: 747, height: Math.min(3000, H - y) } })
  parts.push(p)
}
await browser.close()
