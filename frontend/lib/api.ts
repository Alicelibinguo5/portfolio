// For static export, we need to resolve API_URL at runtime since env vars
// are baked in at build time. Fall back to Railway URL for production.
export const API_URL = (() => {
  // Build-time env var (may be empty for static export)
  const buildTimeUrl = process.env.NEXT_PUBLIC_API_URL || ''

  if (buildTimeUrl) {
    return buildTimeUrl
  }

  // Runtime fallback for production static sites
  // You can customize this per environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname

    // Production Vercel deployment
    if (hostname === 'libinguo.vercel.app' || hostname.endsWith('.vercel.app')) {
      return 'https://portfolio-production-ac21.up.railway.app'
    }

    // Local development
    if (hostname === 'localhost') {
      return 'http://localhost:8000'
    }
  }

  return ''
})()
