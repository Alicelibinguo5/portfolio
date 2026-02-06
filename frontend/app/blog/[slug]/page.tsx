import { BlogPostClient } from './BlogPostClient'

// Generate static params for known posts at build time
// New posts will be rendered on-demand (ISR)
export async function generateStaticParams() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  try {
    const res = await fetch(`${API_URL}/api/blog/?page_size=50`, {
      signal: AbortSignal.timeout(10_000),
    })
    if (res.ok) {
      const posts: { slug: string }[] = await res.json()
      if (posts.length > 0) {
        return posts.map((post) => ({ slug: post.slug }))
      }
    }
  } catch {
    // Fallback to hardcoded list if API fetch fails
  }

  // Fallback hardcoded slugs for build-time resilience
  const staticSlugs = [
    'hello-world',
    'real-time-ads-metrics-pipeline',
  ]

  return staticSlugs.map((slug) => ({ slug }))
}

// Enable ISR: pages are statically generated but can be revalidated
// New/unknown slugs will be rendered on-demand (not 404)
export const dynamic = 'force-dynamic'
// Alternatively, use ISR with revalidation:
// export const revalidate = 3600 // Revalidate every hour

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogPostClient slugParams={params} />
}
