'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bold, Italic, Code, Image } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { ImageInsertModal } from '../../ImageInsertModal'

type BlogPost = {
  slug: string
  title: string
  summary: string
  content: string
  created_at: string
}

export function EditBlogPostClient({ slug }: { slug: string }) {
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  function insertImageTag(tag: string) {
    const el = contentRef.current
    if (el) {
      const start = el.selectionStart ?? content.length
      const end = el.selectionEnd ?? content.length
      setContent(content.slice(0, start) + tag + content.slice(end))
      setTimeout(() => {
        el.focus()
        el.selectionStart = el.selectionEnd = start + tag.length
      }, 0)
    } else setContent((c) => c + tag)
  }

  function wrapSelection(before: string, after: string = before) {
    const el = contentRef.current
    if (!el) {
      setContent((c) => `${before}${c}${after}`)
      return
    }
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const selected = content.slice(start, end)
    const next = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(next)
    setTimeout(() => {
      el.focus()
      el.selectionStart = start + before.length
      el.selectionEnd = start + before.length + selected.length
    }, 0)
  }

  useEffect(() => {
    if (!slug) return
    const controller = new AbortController()
    async function fetchPost() {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}`, { signal: controller.signal })
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
      const res = await fetch(`${API_URL}/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, content })
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to save: ${res.status} - ${errorText}`)
      }
      router.push(`/blog/${slug}`)
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
        <Link href="/blog" className="nav-link inline-flex items-center gap-2">
          <ArrowLeft strokeWidth={1.5} size={16} /> Back to Blog
        </Link>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="space-y-6">
        <p>Post not found.</p>
        <Link href="/blog" className="nav-link inline-flex items-center gap-2">
          <ArrowLeft strokeWidth={1.5} size={16} /> Back to Blog
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-8 max-w-2xl">
      <Link href="/blog" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Blog
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-forest">Edit Post</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-soft-clay/50" role="toolbar" aria-label="Formatting">
          <button type="button" className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors" onClick={() => wrapSelection('**')} title="Bold">
            <Bold strokeWidth={1.5} size={18} />
          </button>
          <button type="button" className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors" onClick={() => wrapSelection('_')} title="Italic">
            <Italic strokeWidth={1.5} size={18} />
          </button>
          <button type="button" className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors" onClick={() => wrapSelection('`')} title="Code">
            <Code strokeWidth={1.5} size={18} />
          </button>
          <button type="button" className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors" onClick={() => wrapSelection('\n```\n', '\n```\n')} title="Code block">
            Code block
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors inline-flex items-center gap-1"
            onClick={() => setImageModalOpen(true)}
            title="Add image (link or upload)"
          >
            <Image strokeWidth={1.5} size={18} /> Add image
          </button>
        </div>
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
          <p className="text-forest/60 text-xs mb-2">Markdown: **bold** _italic_ `code` ```block```. Add images with the toolbar button (link or upload) or paste here.</p>
          <textarea
            ref={contentRef}
            id="content"
            className="input-botanical min-h-[200px] resize-y font-mono text-sm"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            required
            onPaste={async (e) => {
              const items = e.clipboardData?.items
              if (!items) return
              for (const item of items) {
                if (item.type.startsWith('image/')) {
                  e.preventDefault()
                  const file = item.getAsFile()
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    const dataUrl = String(reader.result)
                    const tag = `<img src="${dataUrl}" alt="pasted image" loading="lazy" style="max-width:100%;height:auto;" />`
                    const el = contentRef.current
                    if (el) {
                      const start = el.selectionStart ?? content.length
                      const end = el.selectionEnd ?? content.length
                      setContent(content.slice(0, start) + tag + content.slice(end))
                      setTimeout(() => { el.focus(); el.selectionStart = el.selectionEnd = start + tag.length }, 0)
                    } else setContent((c) => c + tag)
                  }
                  reader.readAsDataURL(file)
                  break
                }
              }
            }}
          />
        </div>
        {error && <p className="text-terracotta text-sm">{error}</p>}
        {imageModalOpen && (
          <ImageInsertModal
            onInsert={insertImageTag}
            onClose={() => setImageModalOpen(false)}
          />
        )}
        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href={`/blog/${slug}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
