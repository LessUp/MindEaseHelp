import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Try to infer base path for GitHub Pages automatically.
// Priority: explicit VITE_BASE -> GH_PAGES_BASE -> GITHUB_REPOSITORY repo name -> '/'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const inferredBase = repoName ? `/${repoName}/` : '/'
const base = process.env.VITE_BASE || process.env.GH_PAGES_BASE || inferredBase

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return

          if (id.includes('react-dom') || id.includes('react')) return 'react'
          if (id.includes('framer-motion') || id.includes('/motion/')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'

          return 'vendor'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
