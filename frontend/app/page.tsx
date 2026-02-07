import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Github, Mail, Download, MessageCircle } from 'lucide-react'

const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/libinguo/'
const githubUrl = 'https://github.com/Alicelibinguo5'
const email = 'libinguo89@gmail.com'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Libin Guo — full-stack data engineer. Data platforms, pipelines, and AI/agent-driven systems. Apple, JPMorgan, healthcare. Open to roles and consulting.',
}

export default function Home() {
  return (
    <section className="space-y-20 md:space-y-32">
      {/* Hero: typography protagonist, arch imagery */}
      <div className="grid md:grid-cols-[1fr,auto] md:gap-16 lg:gap-20 items-center gap-10">
        <div className="space-y-6 animate-fade-up">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-forest tracking-tight leading-[1.1]">
            Hi, I&apos;m <span className="italic">Libin</span>.
          </h1>
          <div className="text-lg md:text-xl text-forest/80 max-w-2xl leading-relaxed space-y-4">
            <p>
              I&apos;m a senior full-stack data engineer focused on building ETL &amp; ELT pipelines, a unified lakehouse, and in-house data agents (datalake, Snowflake-to-lakehouse migration agent). At Apple and previously at JPMorgan and a healthcare startup, I&apos;ve designed scalable infrastructure that supports analytics, operational systems, and intelligent decision-making.
            </p>
          </div>
        </div>
        <div className="flex justify-center md:justify-end animate-fade-up [animation-delay:100ms]">
          {/* Arch imagery: rounded-t-full creates organic arch shape */}
          <Image
            src="/me.png"
            alt="Libin Guo"
            width={280}
            height={280}
            className="w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-t-[min(120px,50%)] rounded-b-[40px] object-cover object-top shadow-botanical-xl transition-all duration-700 ease-out hover:scale-[1.03] hover:shadow-botanical-lg"
          />
        </div>
      </div>

      <div className="vine-divider" aria-hidden="true" />

      <div className="animate-fade-up [animation-delay:100ms]">
        <h2 className="font-display text-2xl font-semibold text-forest mb-6">My service</h2>
        <ul className="grid sm:grid-cols-2 gap-4 text-forest/80 text-lg max-w-3xl">
          <li className="flex gap-3">
            <span className="text-sage shrink-0">—</span>
            <span>
              Build in-house AI agents that automate workflows from weeks to minutes (see Moriarty
              AI app).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-sage shrink-0">—</span>
            <span>
              Launch data service products: unified lakehouse, ETL/ELT pipelines, and decision
              dashboards.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-sage shrink-0">—</span>
            <span>
              Help small teams ship trustworthy AI agents with guardrails.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-sage shrink-0">—</span>
          </li>
        </ul>
      </div>

      <div className="vine-divider" aria-hidden="true" />

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <article className="card group animate-fade-up [animation-delay:150ms]">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">For recruiters</h2>
          <p className="text-forest/80 mb-4">Download my resume or connect on LinkedIn.</p>
          <Link
            href="/about"
            className="btn-primary inline-flex items-center gap-2 text-sm h-10 px-6"
          >
            <Download strokeWidth={1.5} size={18} />
            Download resume
          </Link>
          <div className="mt-4 flex items-center gap-4">
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="p-2 rounded-full bg-soft-clay/80 text-forest/80 hover:text-sage hover:bg-sage/10 transition-all duration-300"
              >
                <Linkedin strokeWidth={1.5} size={22} />
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
              <Github strokeWidth={1.5} size={22} />
            </a>
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              title="Email"
              className="p-2 rounded-full bg-soft-clay/80 text-forest/80 hover:text-sage hover:bg-sage/10 transition-all duration-300"
            >
              <Mail strokeWidth={1.5} size={22} />
            </a>
          </div>
          <p className="mt-4 text-sm text-forest/70">
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-sage hover:text-terracotta transition-colors">LinkedIn</a>
            {' · '}
            <a href={`mailto:${email}`} className="text-sage hover:text-terracotta transition-colors">{email}</a>
          </p>
        </article>

        <article className="card group md:translate-y-12 animate-fade-up [animation-delay:250ms]">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Discuss a project</h2>
          <p className="text-forest/80 mb-4">Have a data platform, pipeline, or AI/agent project? Get in touch.</p>
          <Link
            href="/contact"
            className="btn-primary inline-flex items-center gap-2 text-sm h-10 px-6"
          >
            <MessageCircle strokeWidth={1.5} size={18} />
            Get in touch
          </Link>
        </article>
      </div>
    </section>
  )
}
