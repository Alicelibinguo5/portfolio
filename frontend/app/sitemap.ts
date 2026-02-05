import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://libinguo.com'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

function url(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${basePath}${normalized}`.replace(/\/+/g, '/')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url(''), lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: url('/about'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/contact'), lastModified: new Date(), changeFrequency: 'yearly', priority: 0.9 },
    { url: url('/projects'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/blog'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/projects/doj-legal-researcher-agent'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/projects/ads-compaign-metric'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/projects/landing-page-ab-test'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    const res = await fetch(`${apiBase}/api/blog/?page=1&page_size=200`)
    if (!res.ok) return staticRoutes
    const posts: { slug: string }[] = await res.json()
    const blogUrls: MetadataRoute.Sitemap = (posts || []).map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
    return [...staticRoutes, ...blogUrls]
  } catch {
    return staticRoutes
  }
}
