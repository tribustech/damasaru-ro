'use client'

import { useState } from 'react'
import type { NewsletterFormDTO } from '@repo/types'

interface NewsletterFormProps {
  section: NewsletterFormDTO
}

const ZONE_BY_ACCENT: Record<NewsletterFormDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

export function NewsletterForm({ section }: NewsletterFormProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-dark-deep'
  const isDark = section.accent === 'navy' || section.accent === 'navy-deep'
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
    <section className={zoneClass}>
      <div className="ds-container">
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {section.eyebrow && <div className="section-eyebrow center">{section.eyebrow}</div>}
          <h2 className="section-title center">
            {section.heading}
            {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
          </h2>
          {section.body && (
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: isDark ? 'var(--color-text-light)' : 'var(--color-text-mid)',
                marginTop: '32px',
                marginBottom: '40px',
              }}
            >
              {section.body}
            </p>
          )}
          <form
            onSubmit={submit}
            className="newsletter-form"
            style={{
              background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(20,32,46,.04)',
              border: `1px solid ${isDark ? 'var(--color-navy-line)' : 'var(--color-line)'}`,
            }}
          >
            <input
              type="email"
              required
              placeholder={section.placeholder ?? 'adresa@email.ro'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ color: isDark ? 'var(--color-white)' : 'var(--color-navy)' }}
            />
            <button type="submit" disabled={status === 'loading'} className="btn btn-primary">
              {status === 'loading' ? '...' : section.submitLabel}
            </button>
          </form>
          {status === 'ok' && (
            <p
              style={{
                marginTop: '16px',
                fontSize: '13px',
                color: isDark ? 'var(--color-text-light)' : 'var(--color-text-mid)',
              }}
            >
              Mulțumim! Te-am adăugat la newsletter.
            </p>
          )}
          {status === 'error' && (
            <p style={{ marginTop: '16px', fontSize: '13px', color: '#ff6b6b' }}>
              A apărut o eroare. Încearcă din nou.
            </p>
          )}
          {section.fineprint && (
            <p
              style={{
                marginTop: '24px',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: '15px',
                color: isDark ? 'var(--color-text-light)' : 'var(--color-text-mid)',
                opacity: 0.85,
              }}
            >
              {section.fineprint}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
