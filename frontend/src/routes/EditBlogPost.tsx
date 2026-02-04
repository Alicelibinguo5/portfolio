import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type BlogPost = {
  slug: string
  title: string
  summary: string
  content: string
  created_at: string
}

export default function EditBlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    const controller = new AbortController()
    async function fetchPost() {
      try {
        const base = (import.meta.env.VITE_API_URL as string | undefined) || ''
        const res = await fetch(`${base}/api/blog/${slug}`, { signal: controller.signal })
        if (!res.ok) {
          if (res.status === 404) setError('Post not found. The post may have been deleted.')
          else setError(`Failed to load post: ${res.status} ${res.statusText}`)
          return
        }
        const data: BlogPost = await res.json()
        setPost(data)
        setTitle(data.title)
        setSummary(data.summary)
        setContent(data.content)
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setError(e.message ?? 'Error loading post')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
    return () => controller.abort()
  }, [slug])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!slug) return
    setSaving(true)
    setError(null)
    try {
      const base = (import.meta.env.VITE_API_URL as string | undefined) || ''
      const res = await fetch(`${base}/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, content })
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to save: ${res.status} - ${errorText}`)
      }
      navigate(`/blog/${slug}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error saving post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-8 w-32 bg-soft-clay rounded animate-pulse" />
        <div className="h-64 w-full bg-soft-clay rounded animate-pulse" />
      </section>
    )
  }

  if (error && !post) {
    return (
      <section className="space-y-6">
        <p className="text-terracotta">{error}</p>
        <Link to="/blog" className="nav-link inline-flex items-center gap-2">
          <ArrowLeft strokeWidth={1.5} size={16} /> Back to Blog
        </Link>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="space-y-6">
        <p>Post not found.</p>
        <Link to="/blog" className="nav-link inline-flex items-center gap-2">
          <ArrowLeft strokeWidth={1.5} size={16} /> Back to Blog
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-8 max-w-2xl">
      <Link to="/blog" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Blog
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-forest">Edit Post</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-forest mb-2">Title</label>
          <input
            id="title"
            className="input-botanical"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-forest mb-2">Summary</label>
          <textarea
            id="summary"
            className="input-botanical min-h-[80px] resize-y"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-forest mb-2">Content</label>
          <textarea
            id="content"
            className="input-botanical min-h-[200px] resize-y font-mono text-sm"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            required
          />
        </div>
        {error && <p className="text-terracotta text-sm">{error}</p>}
        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to={`/blog/${slug}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
