'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FilePlus, ArrowRight, Download } from 'lucide-react'
import { API_URL } from '@/lib/api'

type BlogListItem = {
  slug: string
  title: string
  summary: string
  created_at: string
}

type ImportStatus = 'idle' | 'importing' | 'success' | 'error'

export default function Blog() {
  const [posts, setPosts] = useState<BlogListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [importUrl, setImportUrl] = useState('')
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle')
  const [importError, setImportError] = useState<string | null>(null)
  const [importedSlug, setImportedSlug] = useState<string | null>(null)

  async function refetchPosts() {
    try {
      const res = await fetch(`${API_URL}/api/blog/?page=1&page_size=${pageSize}`)
      if (res.ok) {
        const data: BlogListItem[] = await res.json()
        setPosts(data)
        const totalHeader = res.headers.get('X-Total-Count')
        if (totalHeader) setTotal(parseInt(totalHeader, 10))
        setPage(1)
      }
    } catch {
      // ignore
    }
  }

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

  async function handleImport() {
    const url = importUrl.trim()
    if (!url) return
    setImportStatus('importing')
    setImportError(null)
    setImportedSlug(null)
    try {
      const res = await fetch(`${API_URL}/api/blog/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setImportError(data.detail || `Import failed: ${res.status}`)
        setImportStatus('error')
        return
      }
      setImportedSlug(data.slug ?? null)
      setImportUrl('')
      setImportStatus('success')
      await refetchPosts()
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import failed')
      setImportStatus('error')
    }
  }

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
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest">Blog</h1>
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
            <span className="text-forest/50">or</span>
            <span className="text-sm text-forest/50 sm:mr-2">Import from Medium or Substack:</span>
            <input
              type="url"
              placeholder="Paste article URL..."
              value={importUrl}
              onChange={(e) => { setImportUrl(e.target.value); setImportStatus('idle'); setImportError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleImport()}
              className="input-botanical h-14 min-w-[220px] max-w-md flex-1"
              aria-label="Article URL to import"
              disabled={importStatus === 'importing'}
            />
            <button
              type="button"
              onClick={handleImport}
              disabled={importStatus === 'importing' || !importUrl.trim()}
              className="btn-secondary shrink-0 inline-flex items-center gap-2 h-14 px-6 disabled:opacity-50"
            >
              {importStatus === 'importing' ? (
                'Importing…'
              ) : (
                <>
                  <Download strokeWidth={1.5} size={20} />
                  Import
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-forest/50">Posts are public and visible to everyone.</p>
          {importStatus === 'success' && importedSlug && (
            <p className="text-sage text-sm">
              Imported successfully.{' '}
              <Link href={`/blog/${importedSlug}`} className="font-medium underline hover:text-terracotta">View post</Link>
              {' or '}
              <Link href={`/blog/${importedSlug}/edit`} className="font-medium underline hover:text-terracotta">Edit</Link>
            </p>
          )}
          {importStatus === 'error' && importError && (
            <p className="text-terracotta text-sm">{importError}</p>
          )}
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
