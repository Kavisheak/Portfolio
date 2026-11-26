import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {}, // Disable PostCSS config resolution to prevent loading E:\postcss.config.js
  },
})
