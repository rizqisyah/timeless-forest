import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

/*
 * Where the built site lives:
 *   - VPS (qinvi.id/TemaTimelessForest/<slug>): assets under /TemaTimelessForest/
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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    base: base(mode),
    server: {
      port: 5174,
      /*
       * The browser calls same-origin /api/... and Vite forwards it to qinvi-be.
       * VITE_API_PROXY_TARGET=http://localhost:3000 points it at a local backend.
       */
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'https://api.qinvi.id',
          changeOrigin: true,
        },
      },
    },
  }
})
