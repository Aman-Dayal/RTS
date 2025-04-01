import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host:'0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/', // Backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
