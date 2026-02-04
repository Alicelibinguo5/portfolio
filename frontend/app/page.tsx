import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Github, Mail, ArrowRight } from 'lucide-react'

const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/libinguo/'
const githubUrl = 'https://github.com/Alicelibinguo5'
const email = 'libinguo89@gmail.com'
export default function Home() {
  return (
    <section className="space-y-20 md:space-y-32">
      {/* Hero: typography protagonist, arch imagery */}
      <div className="grid md:grid-cols-[1fr,auto] md:gap-16 lg:gap-20 items-center gap-10">
        <div className="space-y-6 animate-fade-up">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-forest tracking-tight leading-[1.1]">
            Hi, I&apos;m <span className="italic">Libin</span>.
          </h1>
          <p className="text-lg md:text-xl text-forest/80 max-w-2xl leading-relaxed">
            I&apos;m a software engineer focused on data pipelines and platform engineering—turning complex data challenges into robust, production-ready systems. Currently at Apple; previously at JPMorgan and a healthcare startup.
          </p>
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

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <article className="card group animate-fade-up [animation-delay:150ms]">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Connect</h2>
          <div className="flex items-center gap-4">
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
            Email: <a href={`mailto:${email}`} className="text-sage hover:text-terracotta transition-colors">{email}</a>
          </p>
        </article>

        <article className="card group md:translate-y-12 animate-fade-up [animation-delay:250ms]">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Get in touch</h2>
          <p className="text-forest/80 mb-4">Use the Contact page to send a message.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sage hover:text-terracotta font-medium tracking-wide transition-colors duration-300 group-hover:gap-3"
          >
            Contact
            <ArrowRight strokeWidth={1.5} size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </article>
      </div>
    </section>
  )
}
