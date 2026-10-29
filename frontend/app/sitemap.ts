import type { MetadataRoute } from 'next'
import { CASE_STUDIES } from '@/lib/caseStudies'

export const dynamic = 'force-static'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://libinguo.com'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

function url(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${basePath}${normalized}`.replace(/\/+/g, '/')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url(''), lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: url('/about'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/contact'), lastModified: new Date(), changeFrequency: 'yearly', priority: 0.9 },
    { url: url('/projects'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...CASE_STUDIES.map((c) => ({ url: url(`/work/${c.slug}`), lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: url('/projects/doj-legal-researcher-agent'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/projects/ads-compaign-metric'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/projects/landing-page-ab-test'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  return staticRoutes
}
