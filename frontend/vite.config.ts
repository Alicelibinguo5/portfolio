import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// Use VITE_BASE=/ for local backend (make dev). Omit for GitHub Pages (base /portfolio/).
	base: process.env.VITE_BASE ?? (mode === 'production' ? '/portfolio/' : '/'),
}))


