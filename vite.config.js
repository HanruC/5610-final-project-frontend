import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: 'https://five610-final-project-backend.onrender.com',
        changeOrigin: true,
      },
      "/images": {
        target: 'https://five610-final-project-backend.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
