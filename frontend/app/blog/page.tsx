'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FilePlus, ArrowRight } from 'lucide-react'
import { API_URL } from '@/lib/api'

type BlogListItem = {
  slug: string
  title: string
  summary: string
  created_at: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function fetchPosts() {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/api/blog/?page=${page}&page_size=${pageSize}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data: BlogListItem[] = await res.json()
        setPosts(data)
        const totalHeader = res.headers.get('X-Total-Count')
        setTotal(totalHeader ? parseInt(totalHeader, 10) : data.length)
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setError(e.message ?? 'Error')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
    return () => controller.abort()
  }, [page, pageSize])

  const isEmpty = !loading && posts.length === 0

  if (error) {
    return (
      <section className="space-y-8">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest">Blog</h1>
        <p className="text-terracotta">{error}</p>
      </section>
    )
  }

  return (
    <section className="space-y-12 md:space-y-20">
      <div className="animate-fade-up">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest">Blog</h1>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://substack.com/@aliceguo/posts"
              target="_blank"
              rel="noreferrer"
              aria-label="Substack posts"
              title="Substack"
              className="inline-flex items-center gap-2 rounded-full bg-soft-clay/80 text-forest/80 hover:text-sage hover:bg-sage/10 transition-all duration-300 px-4 py-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 4.5h18v2.8H3V4.5zM3 9.7h18v2.8H3V9.7zM3 14.9h18v4.6l-9 0-9-4.6z" />
              </svg>
              <span className="text-sm font-medium">Substack</span>
            </a>
            <a
              href="https://medium.com/@glbviolin/from-data-analyst-to-data-engineer-627c33cb4bfd"
              target="_blank"
              rel="noreferrer"
              aria-label="Medium post"
              title="Medium"
              className="inline-flex items-center gap-2 rounded-full bg-soft-clay/80 text-forest/80 hover:text-sage hover:bg-sage/10 transition-all duration-300 px-4 py-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.5 7.2a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v9.6a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V7.2zm3.2 8.1c1.7 0 3.1-1.7 3.1-3.8 0-2.1-1.4-3.8-3.1-3.8-1.7 0-3.1 1.7-3.1 3.8 0 2.1 1.4 3.8 3.1 3.8zm6.4 0c1.5 0 2.7-1.7 2.7-3.8 0-2.1-1.2-3.8-2.7-3.8s-2.7 1.7-2.7 3.8c0 2.1 1.2 3.8 2.7 3.8zm4.4-.4c.6 0 1.1-1.5 1.1-3.4 0-1.9-.5-3.4-1.1-3.4-.6 0-1.1 1.5-1.1 3.4 0 1.9.5 3.4 1.1 3.4z" />
              </svg>
              <span className="text-sm font-medium">Medium</span>
            </a>
          </div>
        </div>
        <p className="mt-4 text-lg text-forest/70 max-w-xl">
          Share your thoughts with the world. Write in Markdown, add images, and publish in one click.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/blog/new"
              className="btn-primary inline-flex items-center gap-2 h-14 px-10 text-base"
            >
              <FilePlus strokeWidth={1.5} size={22} />
              Write a new post
            </Link>
          </div>
          <p className="text-sm text-forest/50">Posts are public and visible to everyone.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 w-3/4 bg-soft-clay rounded" />
              <div className="mt-2 h-3 w-1/3 bg-soft-clay rounded" />
              <div className="mt-4 h-20 w-full bg-soft-clay rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {isEmpty ? (
            <div className="card-muted text-center py-16 px-8 max-w-xl mx-auto">
              <p className="text-forest/80 text-lg">No posts yet.</p>
              <p className="mt-2 text-forest/60 text-sm">Publish your first post and it will appear here.</p>
              <Link href="/blog/new" className="btn-primary inline-flex items-center gap-2 h-12 mt-8">
                <FilePlus strokeWidth={1.5} size={18} />
                Write your first post
              </Link>
            </div>
          ) : (
            <>
              <div className="vine-divider" aria-hidden="true" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {posts.map((p, i) => (
                <article
                  key={p.slug}
                  className={`card group ${i % 3 === 1 ? 'md:translate-y-12' : ''}`}
                >
                  <Link href={`/blog/${p.slug}`} className="block group/link" onMouseEnter={() => {
                    const ctrl = new AbortController()
                    fetch(`${API_URL}/api/blog/${p.slug}`, { signal: ctrl.signal }).catch(() => {})
                    setTimeout(() => ctrl.abort(), 6000)
                  }}>
                    <h2 className="font-display text-xl font-semibold text-forest group-hover:text-terracotta transition-colors duration-300">
                      {p.title}
                    </h2>
                    <p className="text-sm text-forest/60 mt-1">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-forest/80 mt-3 line-clamp-3">{p.summary}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-sage font-medium text-sm group-hover/link:gap-3 transition-all duration-500">
                      Read more <ArrowRight strokeWidth={1.5} size={16} className="transition-transform duration-500 group-hover/link:translate-x-1" />
                    </span>
                  </Link>
                </article>
              ))}
              </div>
            </>
          )}

          {!isEmpty && (
          <div className="flex items-center justify-between mt-16 text-sm text-forest/70">
            <p>Page {page} · {total} total</p>
            <div className="flex gap-4">
              <button
                className="nav-link h-12 min-w-[44px] px-4 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
              >
                Previous
              </button>
              <button
                className="nav-link h-12 min-w-[44px] px-4 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={loading || page * pageSize >= total}
              >
                Next
              </button>
            </div>
          </div>
          )}
        </>
      )}
    </section>
  )
}
