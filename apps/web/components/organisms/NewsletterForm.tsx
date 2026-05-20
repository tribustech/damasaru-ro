'use client'

import { useState } from 'react'
import type { NewsletterFormDTO } from '@repo/types'
import { Eyebrow } from '../atoms/Eyebrow'
import { getAccent, accentRootClass } from '@/lib/accent'

interface NewsletterFormProps {
  section: NewsletterFormDTO
}

export function NewsletterForm({ section }: NewsletterFormProps) {
  const a = getAccent(section.accent ?? 'navy-deep')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source: section.source }),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={`${a.background} ${accentRootClass(section.accent ?? 'navy-deep')} py-24`}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        {section.eyebrow && (
          <Eyebrow label={section.eyebrow} accent={section.accent} align="center" />
        )}
        <h2 className={`text-4xl lg:text-5xl font-serif font-medium mb-6 leading-tight ${a.text}`}>
          {section.heading}
        </h2>
        {section.body && <p className={`text-lg mb-10 ${a.textMuted}`}>{section.body}</p>}
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="adresa@email.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`flex-1 px-6 py-4 rounded-full focus:outline-none border ${a.border} ${a.isDark ? 'bg-white/5 text-white placeholder:text-white/40' : 'bg-white text-[var(--color-navy)]'}`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-bright)] transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? '...' : section.submitLabel}
          </button>
        </form>
        {status === 'ok' && (
          <p className={`mt-4 text-sm ${a.textMuted}`}>Mulțumim! Te-am adăugat la newsletter.</p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-sm text-red-400">A apărut o eroare. Încearcă din nou.</p>
        )}
      </div>
    </section>
  )
}
