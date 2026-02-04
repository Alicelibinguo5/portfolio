import { Link } from 'react-router-dom'
import { Linkedin, Github, Mail, ArrowRight } from 'lucide-react'

export default function Home() {
  const linkedinUrl = (import.meta.env.VITE_LINKEDIN_URL as string | undefined) || 'https://www.linkedin.com/in/libinguo/'
  const githubUrl = 'https://github.com/Alicelibinguo5'
  const email = 'libinguo89@gmail.com'

  const profilePhotoUrl = `${import.meta.env.BASE_URL}me.png`

  return (
    <section className="space-y-16 md:space-y-24">
      {/* Hero */}
      <div className="grid md:grid-cols-[1fr,auto] md:gap-12 lg:gap-16 items-center gap-8">
        <div className="space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-forest tracking-tight">
            Hi, I'm <span className="italic">Libin</span>.
          </h1>
          <p className="text-lg md:text-xl text-forest/80 max-w-2xl leading-relaxed">
            I'm a software engineer focused on data pipelines and platform engineering—turning complex data challenges into robust, production-ready systems. Currently at Apple; previously at JPMorgan and a healthcare startup.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            src={profilePhotoUrl}
            alt="Libin Guo"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-[40px] object-cover shadow-botanical-lg transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Connect & Get in touch cards - staggered grid */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <article
          className="card group"
          style={{ transform: 'translateY(0)' }}
        >
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

        <article
          className="card group md:translate-y-12"
        >
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Get in touch</h2>
          <p className="text-forest/80 mb-4">Use the Contact page to send a message.</p>
          <Link
            to="/contact"
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
