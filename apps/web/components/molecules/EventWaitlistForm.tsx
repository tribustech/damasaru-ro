'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface EventWaitlistFormProps {
  source: string
  submitLabel?: string
  emailPlaceholder?: string
  successMessage?: string
}

export function EventWaitlistForm({
  source,
  submitLabel = 'Anunță-mă →',
  emailPlaceholder = 'adresa@ta.ro',
  successMessage = 'Te-am adăugat pe listă.',
}: EventWaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/event-waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source, name: name || null }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        setName('')
        return
      }
      const body = await res.json().catch(() => ({}))
      setError(typeof body?.error === 'string' ? body.error : 'A apărut o eroare')
      setStatus('error')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Network error')
    }
  }

  const isSuccess = status === 'success'

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-[var(--color-navy-soft)] border border-[var(--color-navy-line)] rounded-lg p-8 space-y-4"
      aria-label="Listă de așteptare eveniment"
    >
      <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[var(--color-gold)] mb-1">
        Listă de așteptare
      </div>
      {/* Inputs stay mounted so the card height never reflows; on success we
          dim + lock them and overlay the confirmation in place of the button. */}
      <fieldset
        disabled={status === 'submitting' || isSuccess}
        className={`space-y-4 transition-opacity duration-200 ${isSuccess ? 'opacity-50' : ''}`}
      >
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--color-text-light)]">
            Nume <span className="opacity-60 normal-case tracking-normal">(opțional)</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Numele tău"
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[var(--color-navy)] border border-[var(--color-navy-line)] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-gold)]"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--color-text-light)]">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={emailPlaceholder}
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[var(--color-navy)] border border-[var(--color-navy-line)] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-gold)]"
          />
        </label>
      </fieldset>
      {status === 'error' && error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      {isSuccess ? (
        <div
          role="status"
          aria-live="polite"
          className="w-full rounded-full bg-[var(--color-forest)] text-[var(--color-paper-warm)] text-sm font-semibold px-6 py-3 text-center"
        >
          ✓ {successMessage}
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-6 py-3 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] text-sm font-semibold hover:bg-[var(--color-gold-bright)] transition-colors disabled:opacity-60"
        >
          {status === 'submitting' ? 'Se trimite…' : submitLabel}
        </button>
      )}
    </form>
  )
}
