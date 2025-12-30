import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      }
    },
    assetsDir: 'assets',
    target: 'es2015'
  },
  server: {
    fs: {
      allow: ['..', 'node_modules']
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless'
    }
  }
})