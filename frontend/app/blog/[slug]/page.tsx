import type { Metadata } from 'next'
import { BlogPostClient } from './BlogPostClient'

type BlogPostMeta = { title: string; summary: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || ''
    const res = await fetch(`${base}/api/blog/${slug}`)
    if (!res.ok) return { title: 'Blog Post' }
    const post: BlogPostMeta = await res.json()
    return {
      title: post.title,
      description: post.summary,
    }
  } catch {
    return { title: 'Blog Post' }
  }
}

export async function generateStaticParams() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || ''
    const res = await fetch(`${base}/api/blog/?page=1&page_size=100`)
    if (!res.ok) return [{ slug: '_' }]
    const posts: { slug: string }[] = await res.json()
    if (posts.length === 0) return [{ slug: '_' }]
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return [{ slug: '_' }]
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostClient slug={slug} />
}
