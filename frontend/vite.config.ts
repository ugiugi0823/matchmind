// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // IPv4 명시
        changeOrigin: true,
        // rewrite는 현재 필요 없음
      },
    },
  },
});
