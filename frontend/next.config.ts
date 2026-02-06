import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Use 'standalone' for server-side rendering (required for dynamic blog routes)
  // Remove 'output: export' to enable SSR/ISR for blog routes
  // output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  // Disable webpack build worker to avoid jest-worker module resolution errors on Vercel
  webpack: (config) => config,
}

export default nextConfig
