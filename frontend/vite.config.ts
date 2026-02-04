import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// VITE_BASE_PATH set in CI to /<repo-name>/ for GitHub Pages. VITE_BASE=/ for local backend (make dev).
	base: process.env.VITE_BASE_PATH ?? process.env.VITE_BASE ?? (mode === 'production' ? '/portfolio/' : '/'),
}))


