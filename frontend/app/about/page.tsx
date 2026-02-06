import type { Metadata } from 'next'
import { Download } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'About & Resume',
  description:
    'Libin Guo — data engineer at Apple. Resume, background, and projects.',
}

export default function About() {
  const resumeUrl = `${basePath}/resume.pdf`

  return (
    <section className="space-y-12 md:space-y-20">
      <div>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest animate-fade-up">About</h1>
        <div className="text-forest/80 mt-6 space-y-4 text-lg max-w-2xl leading-relaxed">
          <p>
            I&apos;m a data engineer. I work at Apple, and before that I was at JPMorgan and a healthcare startup. I build data platforms and pipelines, and lately I&apos;ve been working with AI agents.
          </p>
          <p>
            I enjoy solving hard problems—making messy data reliable and usable, building systems that actually work in production, and figuring out how to apply new tools thoughtfully.
          </p>
          <p>
            Currently I&apos;m interested in full-time roles and also consulting work on data platforms and AI/agent projects.
          </p>
        </div>
      </div>

      <div className="vine-divider" aria-hidden="true" />

      <div>
        <h2 className="font-display text-2xl font-semibold text-forest mb-4">Technologies</h2>
        <p className="text-forest/80 mb-4 text-lg">I work with a range of tools for data platforms, pipelines, and applications:</p>
        <ul className="flex flex-wrap gap-2 text-forest/80">
          {['Python', 'FastAPI', 'SQL', 'Apache Iceberg', 'LangGraph', 'LangChain', 'React', 'Next.js', 'pandas', 'Docker', 'Spark', 'DBT', 'Kubernetes', 'AWS', 'Airflow'].map((tech) => (
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
