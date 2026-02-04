import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { marked } from 'marked'
import Prism from 'prismjs'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import 'prismjs/themes/prism.css'

type BlogPost = {
  slug: string
  title: string
  summary: string
  content: string
  created_at: string
  tags?: string[]
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [html, setHtml] = useState<string>('')

  const readingTime = useMemo(() => {
    if (!post?.content) return null
    const words = post.content.trim().split(/\s+/).length
    const minutes = Math.max(1, Math.round(words / 200))
    return `${minutes} min read`
  }, [post])

  useEffect(() => {
    async function renderMarkdown() {
      if (!post?.content) {
        setHtml('')
        return
      }
      const htmlOut = await marked.parse(post.content)
      const htmlString = typeof htmlOut === 'string' ? htmlOut : ''
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlString
      const codeBlocks = tempDiv.querySelectorAll('pre code')
      codeBlocks.forEach((block) => {
        const codeElement = block as HTMLElement
        const languageClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'))
        if (languageClass) {
          const language = languageClass.replace('language-', '')
          if (Prism.languages[language]) {
            try {
              const code = codeElement.textContent || ''
              const highlighted = Prism.highlight(code, Prism.languages[language], language)
              codeElement.innerHTML = highlighted
            } catch {
              // Keep original content
            }
          }
        }
      })
      setHtml(tempDiv.innerHTML)
    }
    renderMarkdown()
  }, [post])

  useEffect(() => {
    if (deleting) return
    if (!slug) return
    const controller = new AbortController()
    async function fetchPost() {
      try {
        const base = (import.meta.env.VITE_API_URL as string | undefined) || ''
        const res = await fetch(`${base}/api/blog/${slug}`, { signal: controller.signal })
        if (!res.ok) {
          navigate('/blog', { replace: true })
          return
        }
        const data: BlogPost = await res.json()
        setPost(data)
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setError(e.message ?? 'Error')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
    return () => controller.abort()
  }, [slug, deleting, navigate])

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="h-8 w-48 bg-soft-clay rounded animate-pulse" />
        <div className="h-64 w-full bg-soft-clay rounded animate-pulse" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6">
        <p className="text-terracotta">{error}</p>
        <Link to="/blog" className="nav-link inline-flex items-center gap-2">← Back to Blog</Link>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="space-y-6">
        <p className="text-forest/80">Post not found.</p>
        <Link to="/blog" className="nav-link inline-flex items-center gap-2">← Back to Blog</Link>
      </section>
    )
  }

  return (
    <article className="space-y-8 md:space-y-12 max-w-3xl">
      <Link to="/blog" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Blog
      </Link>

      <header>
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-forest/60">
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString()}
          </time>
          {readingTime && <span>· {readingTime}</span>}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map(t => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-soft-clay text-forest/70 text-xs">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose-botanical" dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="flex items-center gap-6 pt-8 border-t border-stone/50">
        <Link
          to={`/blog/${post.slug}/edit`}
          className="inline-flex items-center gap-2 text-sage hover:text-terracotta font-medium transition-colors"
        >
          <Edit strokeWidth={1.5} size={18} />
          Edit
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-terracotta hover:underline font-medium"
          onClick={async () => {
            if (!confirm('Delete this post? This cannot be undone.')) return
            setDeleting(true)
            const base = (import.meta.env.VITE_API_URL as string | undefined) || ''
            await fetch(`${base}/api/blog/${post.slug}`, { method: 'DELETE' })
            navigate('/blog', { replace: true })
          }}
        >
          <Trash2 strokeWidth={1.5} size={18} />
          Delete
        </button>
      </footer>
    </article>
  )
}
