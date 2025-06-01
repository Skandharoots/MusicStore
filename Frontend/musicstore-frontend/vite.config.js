import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: false,
    strictPort: true,
    origin: "http://0.0.0.0:80",
    port: 3000,
    hmr: {
      port: 3000,
      clientPort: 443
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  }
})
