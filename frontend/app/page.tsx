import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Github, Mail, Download, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react'

const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/libinguo/'
const githubUrl = 'https://github.com/Alicelibinguo5'
const email = 'libinguo89@gmail.com'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Libin Guo — Senior Data Engineer. Spark, dbt, Snowflake, data lake, Airflow, and AI data agents. Apple, JPMorgan, healthcare. Open to senior roles and consulting.',
}

export default function Home() {
  return (
    <section className="space-y-16 md:space-y-20">
      <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-12 lg:gap-16 items-center">
        <div className="space-y-8 animate-fade-up">
          <p className="eyebrow">Senior Data Engineer · Spark · dbt · Snowflake · Airflow</p>
          <div className="space-y-5">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-forest tracking-tight leading-[1.05]">
              Scalable data platforms and AI agents that drive decisions at scale.
            </h1>
            <p className="text-lg md:text-xl text-forest/80 max-w-2xl leading-relaxed">
              I build production-grade data lakes, Snowflake lakehouses, dbt transformation layers,
              and Airflow-orchestrated pipelines — with AI data agents on top to automate analysis
              and surface insights automatically.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Start a project
              <ArrowRight strokeWidth={1.5} size={18} />
            </Link>
            <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">
              View case studies
              <ExternalLink strokeWidth={1.5} size={18} />
            </Link>
          </div>
          <p className="text-sm text-forest/65">
            Previously at Apple, JPMorgan, and healthcare startups.
          </p>
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
                  Senior Data Engineer — Spark, dbt, Snowflake, data lake, Airflow, and AI data
                  agent systems. 10+ years across tech, finance, and healthcare.
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
                <p className="font-display text-2xl text-forest">10+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-forest/60">Years</p>
              </div>
              <div>
                <p className="font-display text-2xl text-forest">3</p>
                <p className="text-xs uppercase tracking-[0.16em] text-forest/60">Industries</p>
              </div>
              <div>
                <p className="font-display text-2xl text-forest">End-to-end</p>
                <p className="text-xs uppercase tracking-[0.16em] text-forest/60">Delivery</p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="impact-strip animate-fade-up [animation-delay:120ms]">
        <div>
          <p className="impact-label">Core Stack</p>
          <p className="impact-value">Spark · dbt · Snowflake · Airflow</p>
        </div>
        <div>
          <p className="impact-label">Platform</p>
          <p className="impact-value">Data Lake / Lakehouse</p>
        </div>
        <div>
          <p className="impact-label">AI Layer</p>
          <p className="impact-value">
            <a
              href="https://moriartyai.co/"
              target="_blank"
              rel="noreferrer"
              className="text-sage hover:text-terracotta transition-colors"
            >
              Data Agents (Moriarty AI)
            </a>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10">
        <article className="card animate-fade-up [animation-delay:150ms]">
          <p className="eyebrow mb-4">How I Help</p>
          <h2 className="font-display text-3xl font-semibold text-forest mb-6">Services</h2>
          <ul className="space-y-4 text-forest/80 text-lg leading-relaxed">
            <li>
              Design and build scalable data lakes and Snowflake lakehouses with dbt transformation
              layers and Spark-powered processing.
            </li>
            <li>
              Orchestrate end-to-end pipelines with Airflow — from ingestion to mart — with SLA
              monitoring and alerting built in.
            </li>
            <li>
              Deploy AI data agents that automate analysis, surface anomalies, and deliver
              decision-ready insights without manual intervention.
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
            <h2 className="font-display text-xl font-semibold text-forest mb-4">Discuss a project</h2>
            <p className="text-forest/80 mb-4">
              Have a data platform, pipeline, or AI/agent project? Let&apos;s scope it.
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
