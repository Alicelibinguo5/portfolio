import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { BlogPost } from './blogData'

export default function BlogPost() {
	const { slug } = useParams()
	const navigate = useNavigate()
	const [post, setPost] = useState<BlogPost | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [deleting, setDeleting] = useState(false)
\tconst [html, setHtml] = useState<string>('')

	const readingTime = useMemo(() => {
		if (!post?.content) return null
		const words = post.content.trim().split(/\s+/).length
		const minutes = Math.max(1, Math.round(words / 200))
		return `${minutes} min read`
	}, [post])

	useEffect(() => {
		async function ensurePrismCss() {
			const href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css'
			const already = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(l => (l as HTMLLinkElement).href.includes('prism.min.css'))
			if (!already) {
				const link = document.createElement('link')
				link.rel = 'stylesheet'
				link.href = href
				document.head.appendChild(link)
			}
		}

		async function renderMarkdown() {
			if (!post?.content) {
				setHtml('')
				return
			}
			await ensurePrismCss()
			// Dynamically import marked and prism from CDN to avoid bundling
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const markedMod: any = await import('https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const PrismMod: any = await import('https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js')
			const marked = markedMod.marked ?? markedMod
			const Prism = PrismMod.default ?? PrismMod
			// Try to highlight code blocks if language is present
			marked.setOptions({
				highlight(code: string, lang: string) {
					try {
						const grammar = (Prism.languages as Record<string, unknown>)[lang] || Prism.languages.markup
						return Prism.highlight(code, grammar, lang)
					} catch {
						return code
					}
				},
				langPrefix: 'language-'
			})
			const htmlOut = marked.parse(post.content)
			setHtml(typeof htmlOut === 'string' ? htmlOut : '')
		}
		renderMarkdown()
	}, [post])

	useEffect(() => {
		if (deleting) return
		if (!slug) return
		const controller = new AbortController()
		async function fetchPost() {
			try {
				const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
				const res = await fetch(`${base}/api/blog/${slug}`, { signal: controller.signal })
				if (!res.ok) {
					// If deleted concurrently, just navigate back to list
					navigate('/blog', { replace: true })
					return
				}
				const data: BlogPost = await res.json()
				setPost(data)
			} catch (e: any) {
				if (e.name !== 'AbortError') setError(e.message ?? 'Error')
			} finally {
				setLoading(false)
			}
		}
		fetchPost()
		return () => controller.abort()
	}, [slug, deleting, navigate])

	if (loading) return <div>Loading…</div>
	if (error) return <div className="text-red-600">{error}</div>
	if (!post) return <div>Post not found.</div>

	return (
		<article className="space-y-4">
			<h1 className="text-2xl font-semibold">{post.title}</h1>
			<div className="flex items-center gap-3 text-xs text-zinc-500">
				<p>{new Date(post.created_at).toLocaleDateString()}</p>
				{readingTime && <span>· {readingTime}</span>}
			</div>
			{post.tags && post.tags.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-1">
					{post.tags.map(t => (
						<span key={t} className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">{t}</span>
					))}
				</div>
			)}
			<div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
			<div className="mt-4 flex items-center gap-4">
				<Link className="nav-link" to={`/blog/${post.slug}/edit`}>Edit</Link>
				<button
					className="text-sm text-red-600 hover:underline"
					onClick={async () => {
						if (!confirm('Delete this post? This cannot be undone.')) return
						setDeleting(true)
						const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
						await fetch(`${base}/api/blog/${post.slug}`, { method: 'DELETE' })
						navigate('/blog', { replace: true })
					}}
				>
					Delete
				</button>
			</div>
		</article>
	)
}


