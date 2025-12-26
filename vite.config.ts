import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 82, progressive: true },
      webp: { quality: 85 },
      avif: { quality: 75 },
    }),
  ],
  base: '/Digital_Economy_Karmine_Web_App/', // ⚠️ CRITIQUE: NE JAMAIS MODIFIER - Pour GitHub Pages

  // Build optimization for code splitting and performance
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          // lucide-react icons are now imported individually for tree-shaking
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
      },
    },
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
