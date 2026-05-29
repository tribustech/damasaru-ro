'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'duplicate'

interface WaitlistCardProps {
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  paragraphs: string[]
  submitLabel: string
  initialCount: number
}

export function WaitlistCard({
  eyebrow,
  heading,
  headingItalic,
  paragraphs,
  submitLabel,
  initialCount,
}: WaitlistCardProps) {
  const [count, setCount] = useState(initialCount)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setErrorMessage(null)
    try {
      const res = await fetch('/api/audiobook-waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, note }),
      })
      if (res.ok) {
        setStatus('success')
        setCount((c) => c + 1)
        setEmail('')
        setNote('')
        return
      }
      const body = await res.json().catch(() => ({}))
      if (res.status === 409 || body?.error === 'already-subscribed') {
        setStatus('duplicate')
        return
      }
      setStatus('error')
      setErrorMessage(typeof body?.error === 'string' ? body.error : 'A apărut o eroare')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Network error')
    }
  }

  return (
    <div className="waitlist-card">
      <div className="waitlist-grid">
        <div>
          {eyebrow && (
            <div className="waitlist-tag">
              <span className="pulse-dot" />
              {eyebrow}
            </div>
          )}
          <svg
            className="waitlist-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <h2>
            {heading}
            {headingItalic && <span className="italic">{headingItalic}</span>}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="waitlist-counter">
            <div className="counter-num">{count}</div>
            <div className="counter-text">
              Înscrieri pe lista de așteptare
              <small>Live · Actualizat zilnic</small>
            </div>
          </div>
        </div>
        <div>
          {status === 'success' || status === 'duplicate' ? (
            <div className="waitlist-form-stub" role="status">
              <div className="waitlist-success">
                <div className="waitlist-success-title">
                  {status === 'success' ? 'Te-am adăugat pe listă.' : 'Ești deja pe listă.'}
                </div>
                <p>
                  {status === 'success'
                    ? 'Te anunț în prima zi în care audiobook-ul e gata. Și primești 50% reducere la lansare.'
                    : 'Adresa ta de email e deja înscrisă. Te anunț când audiobook-ul e gata.'}
                </p>
              </div>
            </div>
          ) : (
            <form className="waitlist-form-stub" onSubmit={handleSubmit} aria-label="Audiobook waitlist">
              <div>
                <label htmlFor="audiobook-email">Adresa de email *</label>
                <input
                  id="audiobook-email"
                  type="email"
                  placeholder="adresa@ta.ro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'submitting'}
                />
              </div>
              <div>
                <label htmlFor="audiobook-note">Ce te-ar face să-l asculți în loc să citești?</label>
                <textarea
                  id="audiobook-note"
                  placeholder="Drumul la birou, înainte de somn, în timp ce alergi…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={status === 'submitting'}
                />
                <p className="field-hint">Opțional — dar îmi ajută să-l fac mai bine pentru tine.</p>
              </div>
              {status === 'error' && errorMessage && (
                <p className="waitlist-error" role="alert">
                  {errorMessage}
                </p>
              )}
              <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Se trimite…' : submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
