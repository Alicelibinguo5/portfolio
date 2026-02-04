import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export default function ProjectDojLegalResearcherAgent() {
  return (
    <section className="space-y-12 md:space-y-20">
      <Link href="/projects" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Projects
      </Link>

      <div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-forest">
          <a
            href="https://github.com/Alicelibinguo5/doj-legal-researcher-agent"
            target="_blank"
            rel="noreferrer"
            className="hover:text-terracotta transition-colors inline-flex items-center gap-2"
          >
            doj-legal-researcher-agent
            <ExternalLink strokeWidth={1.5} size={20} />
          </a>
        </h1>
        <p className="text-forest/80 mt-4 max-w-2xl text-lg">
          Build a multi-agent system to analyze DOJ press releases and categorize fraud and money-laundering cases.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <article className="card">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Overview</h2>
          <p className="text-forest/80 leading-relaxed">
            Multi-agent architecture with Research, Evaluation, Legal, and Meta agents coordinated via LangGraph. Backend in FastAPI; monitoring via Langfuse; React dashboard for status and metrics.
          </p>
        </article>
        <article className="card md:translate-y-12">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Links</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/Alicelibinguo5/doj-legal-researcher-agent"
                target="_blank"
                rel="noreferrer"
                className="nav-link inline-flex items-center gap-2"
              >
                GitHub Repository
                <ExternalLink strokeWidth={1.5} size={16} />
              </a>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
