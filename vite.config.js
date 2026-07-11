import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Allow connections from other devices on the same WiFi
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      '/public': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      ignored: ['**/backend/**']
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'axios',
      'jspdf',
      'jspdf-autotable',
    ],
  },
  esbuild: {
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable']
  },
})
