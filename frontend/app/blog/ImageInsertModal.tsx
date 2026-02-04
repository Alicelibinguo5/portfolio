'use client'

import { useEffect, useRef, useState } from 'react'
import { Image, Link2, Upload, X } from 'lucide-react'

type ImageInsertModalProps = {
  onInsert: (htmlTag: string) => void
  onClose: () => void
}

export function ImageInsertModal({ onInsert, onClose }: ImageInsertModalProps) {
  const [tab, setTab] = useState<'url' | 'upload'>('url')
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function insertTag(src: string, altText: string = '') {
    const tag = `<img src="${src}" alt="${altText.replace(/"/g, '&quot;')}" loading="lazy" style="max-width:100%;height:auto;" />`
    onInsert(tag)
    onClose()
  }

  function handleInsertFromUrl(e: React.FormEvent) {
    e.preventDefault()
    const u = url.trim()
    if (!u) {
      setUrlError('Please enter an image URL.')
      return
    }
    setUrlError(null)
    insertTag(u, alt.trim())
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      insertTag(String(reader.result), file.name.replace(/\.[^.]+$/, ''))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/20 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div
        className="bg-alabaster rounded-2xl shadow-botanical border border-stone/50 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone/50">
          <h2 id="image-modal-title" className="font-display text-lg font-semibold text-forest flex items-center gap-2">
            <Image strokeWidth={1.5} size={22} />
            Add image
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-forest/60 hover:text-forest hover:bg-soft-clay/50 transition-colors"
            aria-label="Close"
          >
            <X strokeWidth={1.5} size={20} />
          </button>
        </div>

        <div className="flex border-b border-stone/50">
          <button
            type="button"
            onClick={() => { setTab('url'); setUrlError(null) }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${tab === 'url' ? 'text-sage border-b-2 border-sage bg-sage/5' : 'text-forest/70 hover:text-forest'}`}
          >
            <Link2 strokeWidth={1.5} size={18} />
            From link
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${tab === 'upload' ? 'text-sage border-b-2 border-sage bg-sage/5' : 'text-forest/70 hover:text-forest'}`}
          >
            <Upload strokeWidth={1.5} size={18} />
            Upload
          </button>
        </div>

        <div className="p-4">
          {tab === 'url' ? (
            <form onSubmit={handleInsertFromUrl} className="space-y-4">
              <div>
                <label htmlFor="image-url" className="block text-sm font-medium text-forest mb-1">
                  Image URL
                </label>
                <input
                  id="image-url"
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setUrlError(null) }}
                  placeholder="https://example.com/photo.jpg"
                  className="input-botanical"
                  autoFocus
                />
                {urlError && <p className="mt-1 text-sm text-terracotta">{urlError}</p>}
              </div>
              <div>
                <label htmlFor="image-alt" className="block text-sm font-medium text-forest mb-1">
                  Alt text <span className="text-forest/50 font-normal">(optional, for accessibility)</span>
                </label>
                <input
                  id="image-alt"
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="input-botanical"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Insert image
                </button>
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-forest/70">
                Choose an image from your device. It will be embedded in your post.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 rounded-xl border-2 border-dashed border-sage/50 bg-sage/5 text-sage font-medium hover:bg-sage/10 hover:border-sage/70 transition-colors flex flex-col items-center gap-2"
              >
                <Upload strokeWidth={1.5} size={32} />
                Choose image
              </button>
              <button type="button" onClick={onClose} className="w-full btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
