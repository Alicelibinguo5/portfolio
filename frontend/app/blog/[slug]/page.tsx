import { BlogPostClient } from './BlogPostClient'

export async function generateStaticParams() {
  // Fetch all published blog posts from the API at build time.
  // This ensures dynamically imported posts (e.g., from Substack) are included in static export.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  try {
    const res = await fetch(`${API_URL}/api/blog/?page_size=1000`, {
      // Abort after 10 seconds to avoid hanging builds
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

// Disable static generation for metadata since we rely on client-side data fetching
export const dynamic = 'force-static'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogPostClient slugParams={params} />
}
