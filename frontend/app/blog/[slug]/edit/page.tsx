import { EditBlogPostClient } from './EditBlogPostClient'

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

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <EditBlogPostClient slug={slug} />
}
