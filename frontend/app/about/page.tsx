import type { Metadata } from 'next'
import { Download } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'About & Resume',
  description:
    'Libin Guo — full-stack data engineer. Resume, background, and how I build data platforms, pipelines, and AI/agent systems. Apple, JPMorgan, healthcare.',
}

export default function About() {
  const resumeUrl = `${basePath}/resume.pdf`

  return (
    <section className="space-y-12 md:space-y-20">
      <div>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest animate-fade-up">About</h1>
        <div className="text-forest/80 mt-6 space-y-4 text-lg max-w-2xl leading-relaxed">
          <p>
            I&apos;m a full-stack data engineer focused on building production-grade data platforms, pipelines, and AI/agent-driven systems. I work at Apple and have previously designed scalable data infrastructure at JPMorgan and a healthcare startup.
          </p>
          <p>
            I help teams and organizations turn messy data into reliable, queryable systems—whether that&apos;s real-time streaming pipelines, analytics foundations, or AI/agent tooling that supports better decisions.
          </p>
          <p>
            I prefer pragmatic, iterative delivery: start with a working baseline, measure, then evolve. I&apos;m open to full-time roles and to consulting or contract work on data platform and AI/agent projects.
          </p>
        </div>
      </div>

      <div className="vine-divider" aria-hidden="true" />

      <div>
        <h2 className="font-display text-2xl font-semibold text-forest mb-4">Technologies</h2>
        <p className="text-forest/80 mb-4 text-lg">I work with a range of tools for data platforms, pipelines, and applications:</p>
        <ul className="flex flex-wrap gap-2 text-forest/80">
          {['Python', 'FastAPI', 'SQL', 'Kafka', 'Apache Flink', 'Apache Iceberg', 'LangGraph', 'LangChain', 'React', 'Next.js', 'pandas', 'matplotlib', 'Superset', 'Docker'].map((tech) => (
            <li key={tech}>
              <span className="px-3 py-1.5 rounded-full bg-soft-clay text-forest/80 text-sm">{tech}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="vine-divider" aria-hidden="true" />

      <div>
        <h2 className="font-display text-2xl font-semibold text-forest">Resume</h2>
        <p className="text-forest/80 mt-2 text-lg">Download or view my latest resume below.</p>
      </div>

      <div className="flex gap-4">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Download strokeWidth={1.5} size={18} />
          Download PDF
        </a>
      </div>

      <div className="rounded-3xl overflow-hidden border border-stone/50 shadow-botanical" style={{ height: '80vh' }}>
        <iframe
          src={resumeUrl}
          title="Resume"
          className="w-full h-full bg-white"
        />
      </div>
    </section>
  )
}
