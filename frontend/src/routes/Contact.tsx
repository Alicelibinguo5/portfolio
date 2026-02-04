import { useState } from 'react'
import { Linkedin, Github, Mail, Send } from 'lucide-react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      const base = (import.meta.env.VITE_API_URL as string | undefined) || ''
      const res = await fetch(`${base}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      setStatus('success')
      setName(''); setEmail(''); setSubject(''); setMessage('')
    } catch (e: unknown) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Error')
    }
  }

  return (
    <section className="space-y-12 md:space-y-16 max-w-xl">
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest">Contact</h1>
        <p className="text-forest/80 mt-4 text-lg">Get in touch via the form below or reach out directly.</p>
      </div>

      <article className="card-muted flex flex-wrap items-center gap-4">
        <a
          href="https://www.linkedin.com/in/libinguo/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="p-3 rounded-full bg-white/80 text-forest/80 hover:text-sage transition-colors duration-300"
        >
          <Linkedin strokeWidth={1.5} size={22} />
        </a>
        <a
          href="https://github.com/Alicelibinguo5"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="p-3 rounded-full bg-white/80 text-forest/80 hover:text-sage transition-colors duration-300"
        >
          <Github strokeWidth={1.5} size={22} />
        </a>
        <a
          href="mailto:libinguo89@gmail.com"
          aria-label="Email"
          className="text-forest/80 hover:text-sage font-medium transition-colors"
        >
          libinguo89@gmail.com
        </a>
      </article>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-forest mb-2">Name</label>
          <input
            id="name"
            className="input-botanical-underline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-forest mb-2">Email</label>
          <input
            id="email"
            type="email"
            className="input-botanical-underline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-forest mb-2">Subject</label>
          <input
            id="subject"
            className="input-botanical-underline"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-forest mb-2">Message</label>
          <textarea
            id="message"
            className="input-botanical-underline min-h-[120px] resize-y"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary inline-flex items-center gap-2"
        >
          {status === 'submitting' ? 'Sending…' : (
            <>
              <Send strokeWidth={1.5} size={18} />
              Send
            </>
          )}
        </button>
        {status === 'success' && (
          <p className="text-sage font-medium">Message sent!</p>
        )}
        {status === 'error' && (
          <p className="text-terracotta">{error ?? 'Something went wrong'}</p>
        )}
      </form>
    </section>
  )
}
