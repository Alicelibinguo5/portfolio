import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'About & Resume',
  description:
    'Libin Guo — Senior Data Engineer. Previously Reka AI, Apple, and JPMorgan Chase. Resume, experience, and background.',
}

export default function About() {
  const resumeUrl = `${basePath}/resume.pdf`
  const techStack = ['Python', 'SQL', 'Spark (PySpark)', 'Ray', 'Apache Iceberg', 'Kubernetes', 'Airflow', 'dbt', 'Snowflake', 'AWS', 'Terraform', 'WebDataset / Energon', 'MCP', 'LangGraph', 'FastAPI']
  const experience = [
    {
      company: 'Reka AI',
      role: 'Member of Technical Staff, Data Platform',
      dates: 'May 2026 – Oct 2026',
      summary: 'Ray-on-Kubernetes and PySpark pipelines preparing video training data for world models, with data-quality gates and WebDataset delivery for pretraining, SFT, and distillation.',
    },
    {
      company: 'Apple',
      role: 'Senior Software Engineer, Data Platform',
      dates: 'Dec 2021 – Jan 2026',
      summary: 'Scaled the platform orchestrating 2,000+ Spark jobs over a 20 PB Iceberg lakehouse; saved $0.5M/year through Spark tuning; built an MCP-based AI agent for lakehouse migration assessment.',
    },
    {
      company: 'JPMorgan Chase',
      role: 'Data Engineer',
      dates: 'Oct 2020 – Nov 2021',
      summary: 'Real-time ingestion into the data lake with Kafka/Kinesis, AWS Glue, Lambda, and Step Functions, managed in Terraform.',
    },
    {
      company: 'Healthmine',
      role: 'Data Engineer',
      dates: 'Sep 2018 – Oct 2020',
      summary: 'Multi-tenant claims ETL on AWS, a Postgres warehouse with Airflow and Spark on EMR, and migration of Talend jobs to Airflow.',
    },
    {
      company: 'Qlarant',
      role: 'Senior Data Analyst',
      dates: 'Mar 2016 – Aug 2018',
      summary: 'Statistical analysis to detect Medicare fraud with SQL, SAS, and Tableau.',
    },
  ]

  return (
    <section className="space-y-12 md:space-y-16">
      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-start">
        <div className="space-y-6 animate-fade-up">
          <p className="eyebrow">Background</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest">About</h1>
          <div className="text-forest/80 space-y-4 text-lg max-w-2xl leading-relaxed">
            <p>
              I&apos;m a senior data engineer who builds the infrastructure underneath analytics and
              AI. Most recently I was at Reka AI, building Ray-on-Kubernetes pipelines that turn raw
              video into training data for world models. Before that I spent four years on
              Apple&apos;s data platform, scaling a 20 PB Iceberg lakehouse that runs 2,000+ Spark
              jobs.
            </p>
            <p>
              I started as a data analyst detecting Medicare fraud with SQL, then moved into data
              engineering at a healthcare startup and JPMorgan Chase. That path left me with a habit I
              still rely on: make messy data reliable before anyone builds on top of it.
            </p>
            <p>
              I&apos;m looking for Senior or Staff Data Engineer roles, especially on data platform
              and AI data infrastructure teams.
            </p>
          </div>
          <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
            Get in touch
            <ArrowRight strokeWidth={1.5} size={18} />
          </Link>
        </div>

        <article className="card animate-fade-up [animation-delay:100ms]">
          <p className="eyebrow mb-4">Profile Snapshot</p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">Reka AI</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">Most recent</p>
            </div>
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">Apple</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">4 years</p>
            </div>
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">20 PB</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">Lakehouse</p>
            </div>
            <div className="rounded-2xl bg-soft-clay/60 p-4">
              <p className="font-display text-2xl text-forest">9+</p>
              <p className="text-xs tracking-[0.16em] uppercase text-forest/60 mt-1">Years in data</p>
            </div>
          </div>
        </article>
      </div>

      <article className="card">
        <p className="eyebrow mb-4">Experience</p>
        <h2 className="font-display text-2xl font-semibold text-forest mb-6">Where I&apos;ve worked</h2>
        <ol className="space-y-6 border-l border-stone/70 pl-6">
          {experience.map((job) => (
            <li key={job.company} className="relative">
              <span className="absolute -left-[1.85rem] top-2 h-3 w-3 rounded-full bg-sage" aria-hidden="true" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-xl font-semibold text-forest">{job.company}</h3>
                <p className="text-sm text-forest/60">{job.dates}</p>
              </div>
              <p className="text-forest/75 font-medium">{job.role}</p>
              <p className="mt-1 text-forest/70 leading-relaxed">{job.summary}</p>
            </li>
          ))}
        </ol>
      </article>

      <div className="grid lg:grid-cols-[1fr,0.95fr] gap-8">
        <article className="card">
          <p className="eyebrow mb-4">Technical Range</p>
          <h2 className="font-display text-2xl font-semibold text-forest mb-4">Technologies</h2>
          <p className="text-forest/80 mb-5 text-lg">
            The tools I use most for data platforms and AI data infrastructure:
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

      <div className="hidden md:block rounded-3xl overflow-hidden border border-stone/50 shadow-botanical" style={{ height: '80vh' }}>
        <iframe
          src={resumeUrl}
          title="Resume"
          className="w-full h-full bg-white"
        />
      </div>
    </section>
  )
}
