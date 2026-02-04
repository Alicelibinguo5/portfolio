import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Search, FilePlus, ArrowRight } from 'lucide-react'

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
  const base = (import.meta.env.VITE_API_URL as string | undefined) || ''

  useEffect(() => {
    const controller = new AbortController()
    async function fetchPosts() {
      try {
        setLoading(true)
        const res = await fetch(`${base}/api/blog/?page=${page}&page_size=${pageSize}`, { signal: controller.signal })
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
  }, [base, page, pageSize])

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    )
  }, [posts, query])

  if (error) {
    return (
      <section className="space-y-6">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest">Blog</h1>
        <p className="text-terracotta">{error}</p>
      </section>
    )
  }

  return (
    <section className="space-y-12 md:space-y-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest">Blog</h1>
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
          <Link to="/blog/new" className="btn-secondary inline-flex items-center gap-2 h-12">
            <FilePlus strokeWidth={1.5} size={18} /> New Post
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <a href={`${base}/api/blog/backup`} target="_blank" rel="noreferrer" className="nav-link">
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
                await fetch(`${base}/api/blog/restore`, {
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filteredPosts.map((p, i) => (
                <article
                  key={p.slug}
                  className={`card group ${i % 3 === 1 ? 'md:translate-y-12' : ''}`}
                >
                  <Link to={`/blog/${p.slug}`} className="block" onMouseEnter={() => {
                    const ctrl = new AbortController()
                    fetch(`${base}/api/blog/${p.slug}`, { signal: ctrl.signal }).catch(() => {})
                    setTimeout(() => ctrl.abort(), 6000)
                  }}>
                    <h2 className="font-display text-xl font-semibold text-forest group-hover:text-terracotta transition-colors duration-300">
                      {p.title}
                    </h2>
                    <p className="text-sm text-forest/60 mt-1">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-forest/80 mt-3 line-clamp-3">{p.summary}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-sage font-medium text-sm group-hover:gap-2 transition-all">
                      Read more <ArrowRight strokeWidth={1.5} size={16} />
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-12 text-sm text-forest/70">
            <p>Page {page} · {total} total</p>
            <div className="flex gap-3">
              <button
                className="nav-link disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
              >
                Previous
              </button>
              <button
                className="nav-link disabled:opacity-50"
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
