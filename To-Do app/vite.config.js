import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server : {
    proxy: {
      '/': 'https://to-do-app-backend-nu.vercel.app',
    },
  },
  plugins: [react()],
})
