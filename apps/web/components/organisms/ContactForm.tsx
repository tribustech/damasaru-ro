'use client'

import { useState } from 'react'
import type { ContactFormDTO } from '@repo/types'
import { getAccent, accentRootClass } from '@/lib/accent'

interface ContactFormProps {
  section: ContactFormDTO
}

export function ContactForm({ section }: ContactFormProps) {
  const a = getAccent(section.accent)
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      setState(res.ok ? 'ok' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-24`}>
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        {section.heading && (
          <h2 className={`text-4xl lg:text-5xl font-serif font-medium leading-tight text-center ${a.text}`}>
            {section.heading}
          </h2>
        )}
        {section.body && (
          <p className={`mt-4 text-lg text-center ${a.textMuted}`}>{section.body}</p>
        )}
        {state === 'ok' ? (
          <p className={`mt-12 text-center text-lg ${a.text}`}>{section.successMessage}</p>
        ) : (
          <form onSubmit={submit} className="mt-12 space-y-4">
            <label className="block">
              <span className={`text-xs uppercase tracking-[0.2em] font-semibold ${a.eyebrow}`}>Nume</span>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`mt-2 w-full px-5 py-3 rounded-2xl border ${a.border} bg-white text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-gold)]`}
              />
            </label>
            <label className="block">
              <span className={`text-xs uppercase tracking-[0.2em] font-semibold ${a.eyebrow}`}>Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`mt-2 w-full px-5 py-3 rounded-2xl border ${a.border} bg-white text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-gold)]`}
              />
            </label>
            <label className="block">
              <span className={`text-xs uppercase tracking-[0.2em] font-semibold ${a.eyebrow}`}>Mesaj</span>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`mt-2 w-full px-5 py-3 rounded-2xl border ${a.border} bg-white text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-gold)] resize-y`}
              />
            </label>
            <button
              type="submit"
              disabled={state === 'loading'}
              className="w-full px-8 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-bright)] transition-colors disabled:opacity-60"
            >
              {state === 'loading' ? '...' : section.submitLabel}
            </button>
            {state === 'error' && (
              <p className="text-sm text-red-400 text-center">A apărut o eroare. Încearcă din nou.</p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
