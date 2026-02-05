import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://libinguo.com'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

function fullUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${basePath}${normalized}`.replace(/\/+/g, '/')
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: fullUrl('/sitemap.xml'),
  }
}
