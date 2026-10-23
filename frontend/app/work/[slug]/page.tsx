import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CASE_STUDIES, getCaseStudy } from '@/lib/caseStudies'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const study = getCaseStudy((await params).slug)
  if (!study) return {}
  return {
    title: study.title,
    description: `${study.tagline} Case study by Libin Guo (${study.company}).`,
  }
}

export default async function CaseStudyPage({ params }: Params) {
  const study = getCaseStudy((await params).slug)
  if (!study) notFound()

  const others = CASE_STUDIES.filter((c) => c.slug !== study.slug)

  return (
    <section className="space-y-12 md:space-y-16">
      <Link href="/projects" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Projects
      </Link>

      <div className="space-y-5 animate-fade-up">
        <p className="eyebrow">
          {study.company} · {study.period}
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-cobalt leading-[1.1]">
          {study.title}
        </h1>
        <p className="text-lg md:text-xl text-cobalt/80 max-w-3xl leading-relaxed">{study.tagline}</p>
        <p className="text-sm text-cobalt/60">{study.role}</p>
      </div>

      <div className="impact-strip animate-fade-up [animation-delay:100ms]">
        {study.metrics.map((m) => (
          <div key={m.label}>
            <p className="impact-label">{m.label}</p>
            <p className="impact-value">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-8">
        <div className="space-y-8">
          <article className="card">
            <p className="eyebrow mb-3">Problem</p>
            <p className="text-cobalt/80 text-lg leading-relaxed">{study.problem}</p>
          </article>
          <article className="card">
            <p className="eyebrow mb-3">Approach</p>
            <ul className="space-y-3 text-cobalt/80 text-lg leading-relaxed list-disc pl-5">
              {study.approach.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="space-y-8">
          <article className="card">
            <p className="eyebrow mb-3">Results</p>
            <ul className="space-y-3 text-cobalt/80 text-lg leading-relaxed list-disc pl-5">
              {study.results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <p className="eyebrow mb-3">Stack</p>
            <ul className="flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <li key={tech}>
                  <span className="px-3 py-1.5 rounded-full bg-panel text-cobalt/80 text-sm">{tech}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      {others.length > 0 && (
        <div className="space-y-4">
          <p className="eyebrow">More case studies</p>
          <div className="grid md:grid-cols-2 gap-6">
            {others.map((c) => (
              <Link key={c.slug} href={`/work/${c.slug}`} className="card group block">
                <p className="text-sm text-cobalt/60">{c.company}</p>
                <h2 className="font-display text-xl font-semibold text-cobalt mt-1 group-hover:text-rust-deep transition-colors inline-flex items-center gap-2">
                  {c.title}
                  <ArrowRight strokeWidth={1.5} size={16} />
                </h2>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
