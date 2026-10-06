import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/*
 * Where the built site lives:
 *   - VPS (qinvi.id/TemaTimelessForest/): assets under /TemaTimelessForest/
 *   - Vercel (timeless-forest.vercel.app): served from the domain root, so '/'.
 *     Vercel sets VERCEL=1 during its builds; with the VPS path there, every asset 404s
 *     and the page renders white.
 * VITE_BASE overrides both, e.g. VITE_BASE=/ npm run build.
 */
function base(mode: string) {
  if (process.env.VITE_BASE) return process.env.VITE_BASE
  if (process.env.VERCEL) return '/'
  return mode === 'production' ? '/TemaTimelessForest/' : '/'
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: base(mode),
  server: {
    port: 5175,
  },
}))
