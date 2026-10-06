import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  // Production build serves static files under /TemaTimelessForest/ asset subpath on VPS
  base: mode === 'production' ? '/TemaTimelessForest/' : '/',
  server: {
    port: 5175,
  },
}))
