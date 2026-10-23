'use client'

import { useState } from 'react'
import { Linkedin, Github, Send } from 'lucide-react'
import { API_URL } from '@/lib/api'

const INTENT_OPTIONS = [
  { value: '', label: "I'm reaching out about…" },
  { value: 'job', label: 'Job opportunity' },
  { value: 'consulting', label: 'Consulting / contract work' },
  { value: 'speaking', label: 'Speaking / events' },
  { value: 'other', label: 'Other' },
]

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [intent, setIntent] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, intent: intent || undefined }),
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      setStatus('success')
      setName(''); setEmail(''); setSubject(''); setIntent(''); setMessage('')
    } catch (e: unknown) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Error')
    }
  }

  return (
    <section className="space-y-12 md:space-y-16">
      <div className="grid lg:grid-cols-[0.9fr,1.1fr] gap-10">
        <div className="space-y-8 animate-fade-up">
          <div className="space-y-4">
            <p className="eyebrow">Let&apos;s Build</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-cobalt">Contact</h1>
            <p className="text-cobalt/80 text-lg max-w-md">
              Reach out for full-time roles, consulting, or collaboration on data and AI systems.
            </p>
          </div>

          <article className="card-muted space-y-4">
            <p className="text-sm uppercase tracking-[0.16em] text-cobalt/60">Direct Links</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://www.linkedin.com/in/libinguo/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-3 rounded-full bg-white/80 text-cobalt/80 hover:text-rust transition-colors duration-300"
              >
                <Linkedin strokeWidth={1.5} size={22} />
              </a>
              <a
                href="https://github.com/Alicelibinguo5"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-3 rounded-full bg-white/80 text-cobalt/80 hover:text-rust transition-colors duration-300"
              >
                <Github strokeWidth={1.5} size={22} />
              </a>
              <a
                href="mailto:libinguo89@gmail.com"
                aria-label="Email"
                className="text-cobalt/80 hover:text-rust font-medium transition-colors"
              >
                libinguo89@gmail.com
              </a>
            </div>
          </article>

          <div className="impact-strip">
            <div>
              <p className="impact-label">Response</p>
              <p className="impact-value">Typically within 24-48h</p>
            </div>
            <div>
              <p className="impact-label">Best Fit</p>
              <p className="impact-value">Data + AI builds</p>
            </div>
            <div>
              <p className="impact-label">Location</p>
              <p className="impact-value">US-based, remote-friendly</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card space-y-6 animate-fade-up [animation-delay:120ms]">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-cobalt mb-2">Name</label>
            <input
              id="name"
              className="input-botanical-underline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cobalt mb-2">Email</label>
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
            <label htmlFor="intent" className="block text-sm font-medium text-cobalt mb-2">Reaching out about</label>
            <select
              id="intent"
              className="input-botanical-underline w-full bg-transparent"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
            >
              {INTENT_OPTIONS.map((opt) => (
                <option key={opt.value || 'placeholder'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-cobalt mb-2">Subject</label>
            <input
              id="subject"
              className="input-botanical-underline"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-cobalt mb-2">Message</label>
            <textarea
              id="message"
              className="input-botanical-underline min-h-[140px] resize-y"
              rows={6}
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
            <p className="text-rust font-medium">Message sent!</p>
          )}
          {status === 'error' && (
            <p className="text-rust-deep">{error ?? 'Something went wrong'}</p>
          )}
        </form>
      </div>
    </section>
  )
}
