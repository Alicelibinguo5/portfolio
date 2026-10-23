import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Github, Mail, Newspaper, ArrowRight, FileText, MessageCircle, MapPin } from 'lucide-react'
import { CASE_STUDIES } from '@/lib/caseStudies'

const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/libinguo/'
const githubUrl = 'https://github.com/Alicelibinguo5'
const substackUrl = 'https://substack.com/@aliceguo/posts'
const email = 'libinguo89@gmail.com'
const resumeUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/resume.pdf`

export const metadata: Metadata = {
  title: { absolute: 'Libin Guo — Senior Data Engineer' },
  description:
    'Libin Guo — Senior Data Engineer. Petabyte-scale lakehouses and AI training-data pipelines with Spark, Ray, Iceberg, and Kubernetes. Previously Reka AI, Apple, JPMorgan Chase.',
}

const PATH = [
  { when: '2015', org: 'UT Dallas', role: 'M.S., Information Technology & Management', note: 'Where it started' },
  { when: '2016', org: 'Qlarant', role: 'Senior Data Analyst', note: 'Medicare fraud analytics' },
  { when: '2018', org: 'Healthmine', role: 'Data Engineer', note: 'Healthcare ETL pipelines and a Postgres analytics warehouse' },
  { when: '2020', org: 'JPMorgan Chase', role: 'Data Engineer', note: 'Real-time ingestion on AWS' },
  { when: '2021', org: 'Apple', role: 'Senior Software Engineer, Data Platform', note: 'Scaled the lakehouse platform · Modernized legacy pipelines: on‑prem to cloud, pandas to Spark' },
  { when: '2026', org: 'Reka AI', role: 'Member of Technical Staff, Data Platform', note: 'Video training data for world models' },
]

const STATS = [
  { value: '9+', label: 'years building data pipelines and platforms' },
  { value: '20 PB', label: 'Iceberg lakehouse at Apple' },
  { value: '2,000+', label: 'Spark jobs run daily' },
  { value: '$0.5M', label: 'saved per year through Spark tuning' },
]

const KEY_SKILLS = ['Spark', 'Python', 'Airflow', 'Kubernetes', 'AWS']

const FOCUS = [
  {
    title: 'Spark data pipelines & Iceberg lakehouses',
    body: 'Large-scale Spark pipelines on Apache Iceberg — tuned for speed and cost, and run reliably at thousands of jobs a day.',
  },
  {
    title: 'AI training-data pipelines',
    body: 'Ray-on-Kubernetes extraction and batch inference, data-quality gates, and WebDataset delivery for pretraining and fine-tuning.',
  },
  {
    title: 'AI agents for data platforms',
    body: 'MCP-based agents and LLM evaluation frameworks that automate platform work, like migration assessment.',
  },
]

const SOCIALS = [
  { href: linkedinUrl, label: 'LinkedIn', Icon: Linkedin },
  { href: githubUrl, label: 'GitHub', Icon: Github },
  { href: substackUrl, label: 'Substack', Icon: Newspaper },
  { href: `mailto:${email}`, label: 'Email', Icon: Mail },
]

export default function Home() {
  return (
    <div className="space-y-20 md:space-y-28 -mb-16 md:-mb-24 lg:-mb-32">
      {/* Hero + Path: the portrait stands directly on the Path band */}
      <div>
      <section className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 lg:gap-16 items-end">
        <div className="space-y-8 animate-fade-up self-center lg:pb-20">
          <p className="eyebrow">Libin Guo · Senior Data Engineer</p>
          <h1 className="font-display text-5xl sm:text-6xl xl:text-[4rem] font-semibold text-cobalt tracking-tight leading-[1.05] [text-wrap:balance]">
            I build the data platforms that power analytics and AI.
          </h1>
          <p className="text-lg md:text-xl text-cobalt/80 max-w-2xl leading-relaxed">
            I&apos;m a Senior Data Engineer with 9+ years building large-scale data pipelines and data
            platforms — most recently a 20 PB Iceberg lakehouse at <b className="text-cobalt">Apple</b> and
            video training-data pipelines for world models at <b className="text-cobalt">Reka AI</b>.
          </p>
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
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cobalt/75">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Open to work
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin strokeWidth={1.5} size={16} aria-hidden="true" />
              Austin, TX
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.16em] text-cobalt/55 mr-1">Follow</span>
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="p-2 rounded-full bg-panel/80 text-cobalt/80 hover:text-rust hover:bg-rust/10 transition-all duration-300"
              >
                <Icon strokeWidth={1.5} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-art">
          <Image
            src="/portrait-cutout.webp"
            alt="Libin Guo"
            width={760}
            height={879}
            priority
            className="hero-portrait"
          />
        </div>
      </section>

      {/* Path */}
      <section className="full-bleed path-band" aria-label="Career path">
        <div className="container-app">
          <div className="path-head">
            <b>Path</b>
            <span>From fraud analytics to petabyte-scale platforms to AI training data — each move closer to the data models learn from.</span>
          </div>
          <ol className="path-list">
            {PATH.map((step) => (
              <li key={step.org}>
                <span className="when">{step.when}</span>
                <b>{step.org}</b>
                <span className="role">{step.role}</span>
                <span className="note">{step.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      </div>

      {/* Proof */}
      <section className="space-y-10" aria-label="Numbers and skills">
        <div className="stat-row">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl md:text-5xl font-semibold text-cobalt">{s.value}</p>
              <p className="mt-2 text-sm text-cobalt/65 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="vine-divider" aria-hidden="true" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="text-xs uppercase tracking-[0.16em] text-cobalt/55">Key skills</span>
          <ul className="flex flex-wrap gap-2">
            {KEY_SKILLS.map((skill) => (
              <li key={skill} className="rounded-full bg-panel px-4 py-1.5 font-display text-lg text-cobalt">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Focus areas */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="eyebrow">What I Do</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-cobalt">Focus areas</h2>
        </div>
        <ol className="grid md:grid-cols-3 gap-8">
          {FOCUS.map((f, i) => (
            <li key={f.title} className="card">
              <p className="font-display text-sm text-rust">0{i + 1}</p>
              <h3 className="font-display text-xl font-semibold text-cobalt mt-2">{f.title}</h3>
              <p className="text-cobalt/75 mt-3 leading-relaxed">{f.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Selected work */}
      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow">Selected Work</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-cobalt">Case studies</h2>
          </div>
          <Link href="/projects" className="text-rust hover:text-rust-deep font-medium inline-flex items-center gap-1 transition-colors">
            All projects <ArrowRight strokeWidth={1.5} size={16} />
          </Link>
        </div>
        <ul className="divide-y divide-line/80 border-y border-line/80">
          {CASE_STUDIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/work/${c.slug}`} className="group grid md:grid-cols-[10rem,1fr,auto] gap-2 md:gap-8 py-6 items-baseline">
                <span className="text-sm text-cobalt/60">{c.company} · {c.period}</span>
                <span>
                  <span className="block font-display text-xl md:text-2xl font-semibold text-cobalt group-hover:text-rust-deep transition-colors">
                    {c.title}
                  </span>
                  <span className="block mt-1 text-cobalt/70 leading-relaxed">{c.tagline}</span>
                </span>
                <ArrowRight strokeWidth={1.5} size={20} className="hidden md:block text-rust group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing CTA */}
      <section className="full-bleed path-band text-center">
        <div className="container-app py-8 md:py-12 space-y-6">
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Hiring for a senior data role?</h2>
          <p className="text-paper/75 max-w-xl mx-auto text-lg">
            I&apos;d like to hear about the platform you&apos;re building and the data problems behind it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-paper text-cobalt text-sm font-medium tracking-widest uppercase hover:bg-sand transition-colors"
            >
              <MessageCircle strokeWidth={1.5} size={18} />
              Get in touch
            </Link>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full border border-paper/50 text-paper text-sm font-medium tracking-widest uppercase hover:bg-paper/10 transition-colors"
            >
              <FileText strokeWidth={1.5} size={18} />
              Resume PDF
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
