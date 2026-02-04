'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, FilePlus, ArrowRight } from 'lucide-react'
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
  const [query, setQuery] = useState('')

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

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    )
  }, [posts, query])

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest animate-fade-up">Blog</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search strokeWidth={1.5} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/50" />
            <input
              type="search"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-botanical pl-10"
            />
          </div>
          <Link href="/blog/new" className="btn-secondary inline-flex items-center gap-2 h-12">
            <FilePlus strokeWidth={1.5} size={18} /> New Post
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <a href={`${API_URL}/api/blog/backup`} target="_blank" rel="noreferrer" className="nav-link">
          Export JSON
        </a>
        <label className="nav-link cursor-pointer">
          Import JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const text = await file.text()
                const data = JSON.parse(text)
                await fetch(`${API_URL}/api/blog/restore`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                })
                setPage(1)
              } catch {
                // ignore
              }
            }}
          />
        </label>
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
          {filteredPosts.length === 0 ? (
            <p className="text-forest/70">No posts found.</p>
          ) : (
            <>
              <div className="vine-divider" aria-hidden="true" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {filteredPosts.map((p, i) => (
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
        </>
      )}
    </section>
  )
}
