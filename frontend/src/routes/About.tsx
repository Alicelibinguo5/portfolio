import resumePdf from '../resume.pdf?url'
import { Download } from 'lucide-react'

export default function About() {
  return (
    <section className="space-y-12 md:space-y-16">
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest">Resume</h1>
        <p className="text-forest/80 mt-4 text-lg">Download or view my latest resume below.</p>
      </div>

      <div className="flex gap-4">
        <a
          href={resumePdf}
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
          src={resumePdf}
          title="Resume"
          className="w-full h-full bg-white"
        />
      </div>
    </section>
  )
}
