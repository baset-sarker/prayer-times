import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {} // This is often needed, especially in TypeScript projects
  },
  build: {
    minify: 'esbuild' // or 'terser' if needed
  }
})
