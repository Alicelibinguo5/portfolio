import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Github, Mail, Download, MessageCircle, ArrowRight, FileText } from 'lucide-react'

const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/libinguo/'
const githubUrl = 'https://github.com/Alicelibinguo5'
const email = 'libinguo89@gmail.com'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Libin Guo — Senior Data Engineer. Petabyte-scale lakehouses and AI training-data pipelines with Spark, Ray, Iceberg, and Kubernetes. Previously Reka AI, Apple, JPMorgan Chase.',
}

export default function Home() {
  return (
    <section className="space-y-16 md:space-y-20">
      <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-12 lg:gap-16 items-center">
        <div className="space-y-8 animate-fade-up">
          <p className="eyebrow">Senior Data Engineer · Lakehouse · AI Training Data</p>
          <div className="space-y-5">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-forest tracking-tight leading-[1.05]">
              Data infrastructure for petabyte lakehouses and AI training.
            </h1>
            <p className="text-lg md:text-xl text-forest/80 max-w-2xl leading-relaxed">
              I build the pipelines and platforms that turn raw data into something teams and models
              can trust — a 20 PB Iceberg lakehouse at Apple, and video training-data pipelines for
              world models at Reka AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/about" className="btn-primary inline-flex items-center gap-2">
              View resume
              <FileText strokeWidth={1.5} size={18} />
            </Link>
            <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">
              Read case studies
              <ArrowRight strokeWidth={1.5} size={18} />
            </Link>
          </div>
          <div className="space-y-2 text-sm text-forest/65">
            <p>
              Previously at <span className="font-semibold text-forest/80">Reka AI</span> ·{' '}
              <span className="font-semibold text-forest/80">Apple</span> ·{' '}
              <span className="font-semibold text-forest/80">JPMorgan Chase</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
              Open to Senior / Staff Data Engineer roles · Austin, TX
            </p>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:100ms]">
          <div className="hero-orb" aria-hidden="true" />
          <article className="card relative">
            <div className="flex items-start gap-5">
              <Image
                src="/me.png"
                alt="Libin Guo"
                width={160}
                height={160}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover object-top shadow-botanical"
              />
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold text-forest">Libin Guo</h2>
                <p className="text-forest/75 text-sm sm:text-base">
                  Senior Data Engineer — Spark, Ray, Iceberg, and Kubernetes. 9+ years building
                  data platforms across AI, big tech, finance, and healthcare.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                      className="p-2 rounded-full bg-soft-clay/80 text-forest/80 hover:text-sage hover:bg-sage/10 transition-all duration-300"
                    >
                      <Linkedin strokeWidth={1.5} size={18} />
                    </a>
                  )}
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                    className="p-2 rounded-full bg-soft-clay/80 text-forest/80 hover:text-sage hover:bg-sage/10 transition-all duration-300"
                  >
                    <Github strokeWidth={1.5} size={18} />
                  </a>
                  <a
                    href={`mailto:${email}`}
                    aria-label="Email"
                    title="Email"
                    className="p-2 rounded-full bg-soft-clay/80 text-forest/80 hover:text-sage hover:bg-sage/10 transition-all duration-300"
                  >
                    <Mail strokeWidth={1.5} size={18} />
                  </a>
                </div>
                <p className="text-xs text-forest/70">
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sage hover:text-terracotta transition-colors"
                  >
                    LinkedIn
                  </a>
                  {' · '}
                  <a href={`mailto:${email}`} className="text-sage hover:text-terracotta transition-colors">
                    {email}
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-stone/70 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-2xl text-forest">20 PB</p>
                <p className="text-xs uppercase tracking-[0.16em] text-forest/60">Lakehouse</p>
              </div>
              <div>
                <p className="font-display text-2xl text-forest">2,000+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-forest/60">Spark jobs</p>
              </div>
              <div>
                <p className="font-display text-2xl text-forest">$0.5M</p>
                <p className="text-xs uppercase tracking-[0.16em] text-forest/60">Saved / year</p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="impact-strip animate-fade-up [animation-delay:120ms]">
        <div>
          <p className="impact-label">Compute</p>
          <p className="impact-value">Spark · Ray · Kubernetes</p>
        </div>
        <div>
          <p className="impact-label">Storage &amp; Orchestration</p>
          <p className="impact-value">Iceberg · Snowflake · Airflow · dbt</p>
        </div>
        <div>
          <p className="impact-label">AI Data</p>
          <p className="impact-value">WebDataset · Data QA · LLM Evals</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10">
        <article className="card animate-fade-up [animation-delay:150ms]">
          <p className="eyebrow mb-4">What I Do</p>
          <h2 className="font-display text-3xl font-semibold text-forest mb-6">Focus areas</h2>
          <ul className="space-y-5 text-forest/80 text-lg leading-relaxed">
            <li>
              <span className="font-semibold text-forest">Petabyte-scale lakehouses.</span> Iceberg
              tables, Spark tuning, and orchestration APIs that run thousands of jobs reliably and
              cost-efficiently.
            </li>
            <li>
              <span className="font-semibold text-forest">AI training-data pipelines.</span>{' '}
              Ray-on-Kubernetes extraction and batch inference, data-quality gates, and WebDataset
              delivery for pretraining and fine-tuning.
            </li>
            <li>
              <span className="font-semibold text-forest">AI agents for data platforms.</span>{' '}
              MCP-based agents and LLM evaluation frameworks that automate platform work, like
              migration assessment.
            </li>
          </ul>
        </article>

        <div className="grid gap-8">
          <article className="card group animate-fade-up [animation-delay:200ms]">
            <h2 className="font-display text-xl font-semibold text-forest mb-4">For recruiters</h2>
            <p className="text-forest/80 mb-4">Download my resume and review my background.</p>
            <Link
              href="/about"
              className="btn-primary inline-flex items-center gap-2 text-sm h-10 px-6"
            >
              <Download strokeWidth={1.5} size={18} />
              Download resume
            </Link>
          </article>

          <article className="card group animate-fade-up [animation-delay:250ms]">
            <h2 className="font-display text-xl font-semibold text-forest mb-4">Get in touch</h2>
            <p className="text-forest/80 mb-4">
              Hiring for a senior data role, or working on a data platform problem? I&apos;d like
              to hear about it.
            </p>
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 text-sm h-10 px-6"
            >
              <MessageCircle strokeWidth={1.5} size={18} />
              Get in touch
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
