import { Download } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function About() {
  const resumeUrl = `${basePath}/resume.pdf`

  return (
    <section className="space-y-12 md:space-y-20">
      <div>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-forest animate-fade-up">Resume</h1>
        <p className="text-forest/80 mt-4 text-lg">Download or view my latest resume below.</p>
      </div>

      <div className="vine-divider" aria-hidden="true" />

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
