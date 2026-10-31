'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Star, GitFork, Globe, ArrowRight } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { CASE_STUDIES } from '@/lib/caseStudies'

type FeaturedApp = {
  title: string
  intro: string
  liveUrl: string
  tags: string[]
}

const FEATURED_APPS: FeaturedApp[] = [
  {
    title: 'Dinner Match Lab',
    intro: 'Recipe recommendations tailored to what you have and what you like. Discover meals that match your ingredients and dietary preferences.',
    liveUrl: 'https://www.dinnermatchlab.com/',
    tags: ['Recipes', 'Recommendations', 'Web App'],
  },
  {
    title: 'Moriarty AI: Fraudster Interview Trainer',
    intro: 'AI-powered simulation platform for developing fraud examination and investigative interview skills. Practice with realistic fraudster personas and receive structured feedback.',
    liveUrl: 'https://moriartyai.co/',
    tags: ['AI', 'Interview Training', 'Fraud Examination'],
  },
]

type GithubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description?: string | null
  language?: string | null
  stargazers_count?: number
  forks_count?: number
  topics?: string[]
}

export default function Projects() {
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function fetchRepos() {
      try {
        const url = `${API_URL}/api/github/repos?username=Alicelibinguo5&per_page=12`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data: GithubRepo[] = await res.json()
        setRepos(data)
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setError(e.message ?? 'Error')
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
    return () => controller.abort()
  }, [])

  const FEATURED_FULL_NAME = 'Alicelibinguo5/doj-legal-researcher-agent'
  const FEATURED_GOAL = 'Build a multi-agent system to analyze DOJ press releases and categorize fraud and money-laundering cases.'
  const SECOND_FULL_NAME = 'Alicelibinguo5/ads-compaign-metric'
  const SECOND_GOAL = 'Real-time streaming pipeline for ad campaign metrics using Kafka, Flink, and Iceberg with Superset dashboards.'
  const THIRD_FULL_NAME = 'Alicelibinguo/Analyzing-Website-Landing-Page-A-B-Test-Results-'
  const THIRD_REPO_NAME = 'Analyzing-Website-Landing-Page-A-B-Test-Results-'
  const THIRD_GOAL = 'A/B testing analysis to assess if a new landing page increases conversion, using pandas, matplotlib, and regression.'

  let displayRepos: GithubRepo[] = repos.filter(r => (r.stargazers_count ?? 0) > 0)
  const featuredIndex = displayRepos.findIndex(r => r.full_name === FEATURED_FULL_NAME)
  if (featuredIndex >= 0) {
    const [featured] = displayRepos.splice(featuredIndex, 1)
    displayRepos = [featured, ...displayRepos]
  } else {
    displayRepos = [{
      id: -1,
      name: 'doj-legal-researcher-agent',
      full_name: FEATURED_FULL_NAME,
      html_url: 'https://github.com/Alicelibinguo5/doj-legal-researcher-agent',
      description: FEATURED_GOAL,
      language: 'Python',
      stargazers_count: undefined,
      forks_count: undefined,
      topics: ['multi-agent', 'FastAPI', 'LangGraph']
    }, ...displayRepos]
  }

  const secondIndex = displayRepos.findIndex(r => r.full_name === SECOND_FULL_NAME)
  if (secondIndex >= 0) {
    const [second] = displayRepos.splice(secondIndex, 1)
    displayRepos.splice(Math.min(1, displayRepos.length), 0, second)
  } else {
    displayRepos.splice(Math.min(1, displayRepos.length), 0, {
      id: -2,
      name: 'ads-compaign-metric',
      full_name: SECOND_FULL_NAME,
      html_url: 'https://github.com/Alicelibinguo5/ads-compaign-metric',
      description: SECOND_GOAL,
      language: 'Python',
      stargazers_count: undefined,
      forks_count: undefined,
      topics: ['Kafka', 'Flink', 'Iceberg', 'Superset']
    })
  }

  const thirdIndex = displayRepos.findIndex(r => r.full_name === THIRD_FULL_NAME || r.name === THIRD_REPO_NAME)
  if (thirdIndex >= 0) {
    const [third] = displayRepos.splice(thirdIndex, 1)
    displayRepos.splice(Math.min(2, displayRepos.length), 0, third)
  } else {
    displayRepos.splice(Math.min(2, displayRepos.length), 0, {
      id: -3,
      name: THIRD_REPO_NAME,
      full_name: THIRD_FULL_NAME,
      html_url: 'https://github.com/Alicelibinguo/Analyzing-Website-Landing-Page-A-B-Test-Results-',
      description: THIRD_GOAL,
      language: 'Python',
      stargazers_count: undefined,
      forks_count: undefined,
      topics: ['pandas', 'matplotlib', 'statsmodels', 'sklearn']
    })
  }

  const seenNames = new Set<string>()
  displayRepos = displayRepos.filter(r => {
    if (seenNames.has(r.name)) return false
    seenNames.add(r.name)
    return true
  })
  displayRepos = displayRepos.slice(0, 8)

  return (
    <section className="space-y-14 md:space-y-16">
      <div className="animate-fade-up space-y-4">
        <p className="eyebrow">Selected Work</p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-cobalt">Projects</h1>
        <p className="text-lg text-cobalt/70 max-w-2xl">
          Projects from production data platforms at Reka AI and Apple, plus live apps and
          open-source work I build on the side.
        </p>
      </div>

      <div className="impact-strip animate-fade-up [animation-delay:100ms]">
        <div>
          <p className="impact-label">Work Type</p>
          <p className="impact-value">Production Platforms + Side Projects</p>
        </div>
        <div>
          <p className="impact-label">Primary Stack</p>
          <p className="impact-value">Spark · Ray · Iceberg · Kubernetes</p>
        </div>
        <div>
          <p className="impact-label">Want the details?</p>
          <p className="impact-value">
            <Link href="/contact" className="text-rust hover:text-rust-deep transition-colors">
              Let&apos;s talk
            </Link>
          </p>
        </div>
      </div>

      <div>
        <div className="mb-6 space-y-2">
          <p className="eyebrow">Production Work</p>
          <h2 className="font-display text-3xl font-semibold text-cobalt">Production projects</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((c) => (
            <Link key={c.slug} href={`/work/${c.slug}`} className="card group flex flex-col">
              <p className="text-sm text-cobalt/60">{c.company} · {c.period}</p>
              <h3 className="font-display text-xl font-semibold text-cobalt mt-2 group-hover:text-rust-deep transition-colors duration-300">
                {c.title}
              </h3>
              <p className="text-cobalt/75 mt-3 leading-relaxed flex-1">{c.tagline}</p>
              <div className="mt-5 pt-4 border-t border-line/70 flex items-center justify-between gap-3">
                <span className="font-display text-lg text-cobalt">{c.metrics[0].value}</span>
                <span className="text-rust font-medium text-sm inline-flex items-center gap-1">
                  Read project <ArrowRight strokeWidth={1.5} size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6 space-y-2">
          <p className="eyebrow">Side Projects</p>
          <h2 className="font-display text-3xl font-semibold text-cobalt">Featured apps</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {FEATURED_APPS.map((app, i) => (
            <article
              key={app.liveUrl}
              className={`card group overflow-hidden ${i % 2 === 1 ? 'md:translate-y-8' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-cobalt">
                  <a
                    href={app.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-rust-deep transition-colors duration-300 inline-flex items-center gap-2"
                  >
                    {app.title}
                    <ExternalLink strokeWidth={1.5} size={16} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                </h3>
                <span className="shrink-0 p-1.5 rounded-lg bg-rust/10 text-rust" aria-hidden>
                  <Globe strokeWidth={1.5} size={18} />
                </span>
              </div>
              <p className="text-cobalt/80 mt-3 leading-relaxed">
                {app.intro}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-panel text-cobalt/70 text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <a
                  href={app.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-primary text-sm h-10 px-6 inline-flex items-center gap-2"
                >
                  Visit site
                  <ExternalLink strokeWidth={1.5} size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6 space-y-2">
          <p className="eyebrow">Open Source</p>
          <h2 className="font-display text-3xl font-semibold text-cobalt">More on GitHub</h2>
        </div>
        <div className="vine-divider" aria-hidden="true" />
        {error && (
          <p className="mt-6 text-sm text-cobalt/60">Live GitHub stats are unavailable right now; showing highlights.</p>
        )}
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 mt-10">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 w-2/3 bg-panel rounded" />
              <div className="mt-3 h-4 w-full bg-panel rounded" />
              <div className="mt-4 h-16 w-full bg-panel rounded" />
            </div>
          ))}
          {!loading && displayRepos.map((r, i) => {
            const isFeatured = r.full_name === FEATURED_FULL_NAME
            const baseTags = (r.topics?.length ? r.topics : (r.language ? [r.language] : []))
            const tags = isFeatured ? [...new Set([...baseTags, 'multi-agent', 'FastAPI'])] : baseTags
            const stagger = i % 2 === 1 ? 'md:translate-y-8' : ''

            return (
              <article key={r.id} className={`card group ${stagger}`}>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-xl font-semibold text-cobalt">
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Open ${r.name} on GitHub`}
                      className="hover:text-rust-deep transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      {r.name}
                      <ExternalLink strokeWidth={1.5} size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </h3>
                  {isFeatured && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-rust/20 text-cobalt font-medium tracking-wide">Featured</span>
                  )}
                </div>
                <p className="text-cobalt/80 mt-2 leading-relaxed">
                  {isFeatured ? FEATURED_GOAL : r.full_name === SECOND_FULL_NAME ? SECOND_GOAL : r.full_name === THIRD_FULL_NAME ? THIRD_GOAL : r.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-cobalt/60">
                  {r.language && <span>{r.language}</span>}
                  {typeof r.stargazers_count === 'number' && (
                    <span className="inline-flex items-center gap-1"><Star strokeWidth={1.5} size={14} /> {r.stargazers_count}</span>
                  )}
                  {typeof r.forks_count === 'number' && (
                    <span className="inline-flex items-center gap-1"><GitFork strokeWidth={1.5} size={14} /> {r.forks_count}</span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <a href={r.html_url} target="_blank" rel="noreferrer" className="btn-secondary text-sm h-10 px-6">
                    GitHub
                  </a>
                  {isFeatured && (
                    <Link href="/projects/doj-legal-researcher-agent" className="text-rust hover:text-rust-deep font-medium text-sm transition-colors">
                      Read project →
                    </Link>
                  )}
                  {r.full_name === SECOND_FULL_NAME && (
                    <Link href="/projects/ads-compaign-metric" className="text-rust hover:text-rust-deep font-medium text-sm transition-colors">
                      Read project →
                    </Link>
                  )}
                  {(r.full_name === THIRD_FULL_NAME || r.name === THIRD_REPO_NAME) && (
                    <Link href="/projects/landing-page-ab-test" className="text-rust hover:text-rust-deep font-medium text-sm transition-colors">
                      Read project →
                    </Link>
                  )}
                </div>
                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.slice(0, 6).map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-panel text-cobalt/70 text-xs">{t}</span>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
