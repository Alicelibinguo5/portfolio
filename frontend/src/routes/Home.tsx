import { Link } from 'react-router-dom'

export default function Home() {
	return (
		<section className="space-y-6">
			<h1 className="text-3xl font-bold tracking-tight">Hi, I’m Libin.</h1>
			<p className="text-zinc-600 dark:text-zinc-300 max-w-2xl">
				I’m a software engineer focused on data pipelines and platform engineering—turning complex data challenges into robust, production-ready systems. Currently at Apple; previously at JPMorgan and a healthcare startup.
			</p>
			{(() => {
				const linkedinUrl = (import.meta.env.VITE_LINKEDIN_URL as string | undefined) || 'https://www.linkedin.com/in/libinguo/'
				const githubUrl = 'https://github.com/Alicelibinguo5'
				const email = 'libinguo89@gmail.com'
				return (
					<div className="grid md:grid-cols-2 gap-6">
						<div className="card">
							<h2 className="font-semibold mb-2">Connect</h2>
							<div className="flex items-center gap-4">
								{linkedinUrl && (
									<a className="nav-link" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
										<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0H12v2.2h.06c.62-1.17 2.14-2.4 4.41-2.4 4.72 0 5.59 3.11 5.59 7.14V24h-5v-7.28c0-1.74-.03-3.97-2.42-3.97-2.42 0-2.79 1.89-2.79 3.84V24h-5V8z"/></svg>
									</a>
								)}
								<a className="nav-link" href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
									<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.84 3.14 8.94 7.49 10.39.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.69-1.3-3.69-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.44-.28-5.01-1.22-5.01-5.42 0-1.2.43-2.17 1.13-2.94-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.12A10.6 10.6 0 0 1 12 6.8c.94 0 1.89.13 2.78.37 2.12-1.42 3.05-1.12 3.05-1.12.6 1.53.22 2.66.11 2.94.7.77 1.13 1.74 1.13 2.94 0 4.21-2.58 5.13-5.04 5.4.39.34.73 1 .73 2.02 0 1.46-.01 2.63-.01 2.99 0 .29.2.63.76.52A10.52 10.52 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z"/></svg>
								</a>
								<a className="nav-link" href={`mailto:${email}`} aria-label="Email" title="Email">
									<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 4h20v16H2V4zm2 2v.01L12 13l8-6.99V6H4zm16 12V8l-8 7-8-7v10h16z"/></svg>
								</a>
							</div>
							<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Email: <a className="nav-link" href={`mailto:${email}`}>{email}</a></p>
						</div>
						<div className="card">
							<h2 className="font-semibold mb-2">Get in touch</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Use the Contact page to send a message.</p>
							<div className="mt-2">
								<Link className="nav-link" to="/contact">Contact</Link>
							</div>
						</div>
					</div>
				)
			})()}
		</section>
	)
}


