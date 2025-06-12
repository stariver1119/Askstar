import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/Askstar/',
  server: {
    host: true, // Expose to all network interfaces
    port: 3000, // Use a specific port
    strictPort: true, // Don't try other ports if 3000 is taken
  },
  plugins: [react()],
  resolve: {
    alias: {
      // Explicitly point to the package's entry point
      'circular-natal-horoscope-js': path.resolve(__dirname, 'node_modules/circular-natal-horoscope-js/dist/index.js')
    }
  },
  optimizeDeps: {
    include: ['circular-natal-horoscope-js']
  }
})
