import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // DEV ONLY — proxies /api/* to the local FastAPI backend during `npm run dev`.
    // This block has zero effect in production builds (Netlify / Vercel).
    // Production API URL is controlled by the VITE_API_URL env var (see src/utils/api.js).
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})

