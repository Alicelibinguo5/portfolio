import { BlogPostClient } from './BlogPostClient'

export async function generateStaticParams() {
  // Statically-known blog slugs. Add new slugs here when creating posts.
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
