import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Try to infer base path for GitHub Pages automatically.
// Priority: explicit VITE_BASE -> GH_PAGES_BASE -> GITHUB_REPOSITORY repo name -> '/'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const inferredBase = repoName ? `/${repoName}/` : '/'
const base = process.env.VITE_BASE || process.env.GH_PAGES_BASE || inferredBase

export default defineConfig({
  base,
  plugins: [react()],
})
