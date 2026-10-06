/*
 * Shared by render-plate.mjs and render-sprites.mjs: serves the project root over http
 * (CSS masks refuse cross-origin and file:// images) and opens .figma-tmp/frame20.html,
 * the static rebuild of Frame 20 written by tsx-to-html.py, with fonts and images settled.
 */
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'
import { resolve, extname } from 'node:path'

// Playwright lives in the sibling theme; it is not a dependency of this one.
const { chromium } = await import(
  pathToFileURL(resolve('../TemaEnvelopMaroon/node_modules/playwright/index.mjs')).href
)

export const W = 747
export const H = 21852

const types = { '.html': 'text/html', '.png': 'image/png', '.svg': 'image/svg+xml', '.otf': 'font/otf', '.ttf': 'font/ttf' }

export async function openFrame(scale) {
  const server = createServer((req, res) => {
    try {
      const body = readFileSync(resolve('.' + decodeURIComponent(new URL(req.url, 'http://x').pathname)))
      res.writeHead(200, { 'content-type': types[extname(req.url)] || 'application/octet-stream' }).end(body)
    } catch {
      res.writeHead(404).end()
    }
  }).listen(0)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: W, height: 1200 }, deviceScaleFactor: Number(scale) })
  await page.goto(`http://localhost:${server.address().port}/.figma-tmp/frame20.html`, {
    waitUntil: 'networkidle',
    timeout: 180000,
  })
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})))
  })
  await page.waitForTimeout(800)
  return {
    page,
    async close() {
      await browser.close()
      server.close()
    },
  }
}

export function readIds(...files) {
  const ids = []
  for (const f of files) {
    const data = JSON.parse(readFileSync(f, 'utf8'))
    for (const item of data) ids.push(...(typeof item === 'string' ? [item] : item.ids))
  }
  return ids
}
