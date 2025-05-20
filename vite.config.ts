import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Expose to all network interfaces
    port: 3000, // Use a specific port
    strictPort: true, // Don't try other ports if 3000 is taken
  },
  plugins: [react()],
})
