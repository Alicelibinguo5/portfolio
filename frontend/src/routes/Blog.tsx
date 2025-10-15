import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

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
	const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'

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
			} catch (e: any) {
				if (e.name !== 'AbortError') setError(e.message ?? 'Error')
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
			p.title.toLowerCase().includes(q) ||
			p.summary.toLowerCase().includes(q)
		)
	}, [posts, query])

	if (error) return <div className="text-red-600">{error}</div>
	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<h1 className="text-2xl font-semibold">Blog</h1>
				<div className="flex items-center gap-3">
					<input
						type="search"
						placeholder="Search posts..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
					/>
					<Link className="nav-link" to="/blog/new">New Post</Link>
				</div>
			</div>

			<div className="flex items-center gap-3 text-sm">
				<a className="nav-link" href={`${base}/api/blog/backup`} target="_blank" rel="noreferrer">Export JSON</a>
				<label className="nav-link cursor-pointer">
					Import JSON
					<input type="file" accept="application/json" className="hidden" onChange={async (e) => {
						const file = e.target.files?.[0]
						if (!file) return
						try {
							const text = await file.text()
							const data = JSON.parse(text)
							await fetch(`${base}/api/blog/restore`, {
								method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
							})
							// hard refresh first page
							setPage(1)
						} catch (err) {
							console.error(err)
						}
					}} />
				</label>
			</div>

			{/* List */}
			{loading ? (
				<div className="grid md:grid-cols-2 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="card animate-pulse">
							<div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
							<div className="mt-2 h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
							<div className="mt-4 h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
						</div>
					))}
				</div>
			) : (
				<>
					{filteredPosts.length === 0 ? (
						<p className="text-sm text-zinc-600 dark:text-zinc-400">No posts found.</p>
					) : (
						<div className="grid md:grid-cols-2 gap-4">
							{filteredPosts.map((p) => (
								<article key={p.slug} className="card">
									<h2 className="font-semibold text-lg">
										<Link
											className="nav-link"
											to={`/blog/${p.slug}`}
											onMouseEnter={() => {
												// Prefetch post detail in the background
												const controller = new AbortController()
												fetch(`${base}/api/blog/${p.slug}`, { signal: controller.signal }).catch(() => {})
												setTimeout(() => controller.abort(), 6000)
											}}
										>
											{p.title}
										</Link>
									</h2>
									<p className="text-xs text-zinc-500">{new Date(p.created_at).toLocaleDateString()}</p>
									<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{p.summary}</p>
								</article>
							))}
						</div>
					)}

					{/* Pagination */}
					<div className="flex items-center justify-between mt-4 text-sm">
						<p className="text-zinc-500">Page {page} · {total} total</p>
						<div className="flex gap-2">
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


