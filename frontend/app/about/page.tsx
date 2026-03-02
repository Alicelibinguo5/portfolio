import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'About & Resume',
  description:
    'Libin Guo — data engineer at Apple. Resume, background, and projects.',
}

export default function About() {
  const resumeUrl = `${basePath}/resume.pdf`
  const techStack = ['Python', 'FastAPI', 'SQL', 'Apache Iceberg', 'LangGraph', 'LangChain', 'React', 'Next.js', 'pandas', 'Docker', 'Spark', 'DBT', 'Kubernetes', 'AWS', 'Airflow']

  return (
    <section className="space-y-12 md:space-y-16">
      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-start">
        <div className="space-y-6 animate-fade-up">
          <p className="eyebrow">Background</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest">About</h1>
          <div className="text-forest/80 space-y-4 text-lg max-w-2xl leading-relaxed">
            <p>
              I&apos;m a data engineer. I work at Apple, and before that I was at JPMorgan and a
              healthcare startup. I build data platforms and pipelines, and lately I&apos;ve been
              working with AI agents.
            </p>
            <p>
              I enjoy solving hard problems: making messy data reliable and usable, building
              systems that actually work in production, and applying new tools thoughtfully.
            </p>
            <p>
              Currently I&apos;m interested in full-time roles and consulting work on data platforms
              and AI/agent projects.
            </p>
          </div>
          <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
            Discuss a project
            <ArrowRight strokeWidth={1.5} size={18} />
          </Link>
        </div>

        <article className="card animate-fade-up [animation-delay:100ms]">
          <p className="eyebrow mb-4">Profile Snapshot</p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">Apple</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">Current</p>
            </div>
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">JPMorgan</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">Previous</p>
            </div>
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">Data</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">Platforms</p>
            </div>
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">AI</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">Agents</p>
            </div>
          </div>
        </article>
      </div>

      <div className="grid lg:grid-cols-[1fr,0.95fr] gap-8">
        <article className="card">
          <p className="eyebrow mb-4">Technical Range</p>
          <h2 className="font-display text-2xl font-semibold text-forest mb-4">Technologies</h2>
          <p className="text-forest/80 mb-5 text-lg">
            I work across the stack for data platforms, pipelines, and applications:
          </p>
          <ul className="flex flex-wrap gap-2 text-forest/80">
            {techStack.map((tech) => (
              <li key={tech}>
                <span className="px-3 py-1.5 rounded-full bg-soft-clay text-forest/80 text-sm">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <p className="eyebrow mb-4">Resume</p>
          <h2 className="font-display text-2xl font-semibold text-forest">Download Latest CV</h2>
          <p className="text-forest/80 mt-2 text-lg">
            Open a PDF copy of my latest resume.
          </p>
          <div className="mt-5">
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
        </article>
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
