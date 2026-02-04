'use client'

import { FormEvent, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bold, Italic, Code, Image } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { ImageInsertModal } from '../ImageInsertModal'

export default function NewBlogPost() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  function insertImageTag(tag: string) {
    const el = contentRef.current
    if (el) {
      const start = el.selectionStart ?? content.length
      const end = el.selectionEnd ?? content.length
      const next = content.slice(0, start) + tag + content.slice(end)
      setContent(next)
      setTimeout(() => {
        el.focus()
        el.selectionStart = el.selectionEnd = start + tag.length
      }, 0)
    } else {
      setContent((c) => c + tag)
    }
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/blog/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, content }),
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      router.push(`/blog/${data.slug}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-8 max-w-2xl">
      <Link href="/blog" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Blog
      </Link>

      <div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-forest">New Post</h1>
        <p className="mt-2 text-forest/70 text-sm">
          Your post will be public and visible to everyone who visits your blog. You can edit or delete it later.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-soft-clay/50" role="toolbar" aria-label="Formatting">
          <button
            type="button"
            className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors"
            onClick={() => wrapSelection('**')}
            title="Bold"
          >
            <Bold strokeWidth={1.5} size={18} />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors"
            onClick={() => wrapSelection('_')}
            title="Italic"
          >
            <Italic strokeWidth={1.5} size={18} />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors"
            onClick={() => wrapSelection('`')}
            title="Code"
          >
            <Code strokeWidth={1.5} size={18} />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-forest/70 hover:text-sage hover:bg-sage/10 transition-colors"
            onClick={() => wrapSelection('\n```\n', '\n```\n')}
            title="Code block"
          >
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
            placeholder="Give your post a clear, catchy title"
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
            placeholder="A short description shown in the blog list (1–2 sentences)"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-forest mb-2">Content</label>
          <p className="text-forest/60 text-xs mb-2">
            Markdown: **bold** _italic_ `code` ```block```. Add images with the toolbar button (link or upload) or paste here.
          </p>
          <textarea
            ref={contentRef}
            id="content"
            className="input-botanical min-h-[200px] resize-y font-mono text-sm"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your post here. Use the toolbar above for bold, italic, code, and images."
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
                      const next = content.slice(0, start) + tag + content.slice(end)
                      setContent(next)
                      setTimeout(() => {
                        el.focus()
                        el.selectionStart = el.selectionEnd = start + tag.length
                      }, 0)
                    } else {
                      setContent((c) => c + tag)
                    }
                  }
                  reader.readAsDataURL(file)
                  break
                }
              }
            }}
          />
        </div>

        {error && <p className="text-terracotta text-sm">{error}</p>}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button type="submit" disabled={submitting} className="btn-primary h-12 px-10">
            {submitting ? 'Publishing…' : 'Publish to blog'}
          </button>
          <span className="text-sm text-forest/50">Visible to everyone immediately.</span>
        </div>
      </form>

      {imageModalOpen && (
        <ImageInsertModal
          onInsert={insertImageTag}
          onClose={() => setImageModalOpen(false)}
        />
      )}
    </section>
  )
}
