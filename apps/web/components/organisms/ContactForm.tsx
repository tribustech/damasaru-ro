'use client'

import { useState } from 'react'
import type { ContactFormDTO } from '@repo/types'
import { getAccent, accentRootClass, getZoneClass } from '@/lib/accent'

interface ContactFormProps {
  section: ContactFormDTO
}

interface FormState {
  name: string
  email: string
  phone: string
  organization: string
  subject: string
  eventType: string
  audienceSize: string
  budget: string
  dateEstimate: string
  message: string
  consent: boolean
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  subject: '',
  eventType: '',
  audienceSize: '',
  budget: '',
  dateEstimate: '',
  message: '',
  consent: false,
}

export function ContactForm({ section }: ContactFormProps) {
  const a = getAccent(section.accent)
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [form, setForm] = useState<FormState>(initialForm)

  const inputClasses = `mt-2 w-full px-5 py-3 rounded-2xl border ${a.border} bg-white text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-gold)]`
  const labelClasses = `text-xs uppercase tracking-[0.2em] font-semibold ${a.eyebrow}`

  const hasPhone = !!section.phoneLabel
  const hasOrg = !!section.organizationLabel
  const hasSubject = !!section.subjectLabel && section.subjectOptions.length > 0
  const hasEventType = !!section.eventTypeLabel && section.eventTypeOptions.length > 0
  const hasAudience = !!section.audienceSizeLabel && section.audienceSizeOptions.length > 0
  const hasBudget = !!section.budgetLabel && section.budgetOptions.length > 0
  const hasDate = !!section.dateEstimateLabel
  const hasOptionalSection = hasAudience || hasBudget || hasDate

  // If event-type options are configured, this section is the speaker-booking form
  // (Evenimente Z6) and submissions go into the Strapi SpeakerBookingEntry collection.
  // Otherwise it's a generic contact form (/contact).
  const isSpeakerBooking = hasEventType
  const endpoint = isSpeakerBooking ? '/api/speaker-booking' : '/api/contact'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const payload = isSpeakerBooking
        ? {
            email: form.email,
            name: form.name,
            phone: form.phone,
            organization: form.organization,
            eventType: form.eventType,
            audienceSize: form.audienceSize,
            budget: form.budget,
            dateEstimate: form.dateEstimate,
            message: form.message,
          }
        : form
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setState(res.ok ? 'ok' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <section className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)}`}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="text-center">
          {section.eyebrow && (
            <div className={`mb-4 text-[10px] font-sans font-semibold tracking-[1.5px] uppercase ${a.eyebrow}`}>
              {section.eyebrow}
            </div>
          )}
          {section.heading && (
            <h2 className={`font-serif font-medium text-3xl md:text-5xl leading-[1.1] tracking-[-1px] ${a.text}`}>
              {section.heading}
              {section.headingItalic && (
                <>
                  {' '}
                  <em className={a.italic}>{section.headingItalic}</em>
                </>
              )}
            </h2>
          )}
          {section.body && (
            <p className={`mt-6 text-lg max-w-2xl mx-auto text-pretty ${a.textMuted}`}>{section.body}</p>
          )}
        </div>

        {section.expectationNote && (
          <div
            className="mt-10 p-6 rounded-2xl"
            style={{
              background: 'rgba(45, 77, 67, 0.06)',
              border: '1px solid rgba(45, 77, 67, 0.18)',
            }}
          >
            <p className={`font-serif italic text-base md:text-lg leading-[1.7] ${a.textMuted}`}>
              {section.expectationNote}
            </p>
          </div>
        )}

        {state === 'ok' ? (
          <p className={`mt-12 text-center text-lg ${a.text}`}>{section.successMessage}</p>
        ) : (
          <form
            onSubmit={submit}
            className="mt-12 space-y-5 bg-white rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(20,32,46,0.12)]"
          >
            <div className={`grid gap-5 ${hasPhone || hasOrg ? 'md:grid-cols-2' : ''}`}>
              <label className="block">
                <span className={labelClasses}>{section.nameLabel}</span>
                <input
                  required
                  type="text"
                  placeholder={section.namePlaceholder ?? ''}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClasses}
                />
              </label>
              <label className="block">
                <span className={labelClasses}>{section.emailLabel}</span>
                <input
                  required
                  type="email"
                  placeholder={section.emailPlaceholder ?? ''}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClasses}
                />
              </label>
            </div>

            {(hasPhone || hasOrg) && (
              <div className={`grid gap-5 ${hasPhone && hasOrg ? 'md:grid-cols-2' : ''}`}>
                {hasPhone && (
                  <label className="block">
                    <span className={labelClasses}>{section.phoneLabel}</span>
                    <input
                      required
                      type="tel"
                      placeholder={section.phonePlaceholder ?? ''}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClasses}
                    />
                  </label>
                )}
                {hasOrg && (
                  <label className="block">
                    <span className={labelClasses}>
                      {section.organizationLabel}
                      {section.organizationOptional && (
                        <span className="ml-2 normal-case tracking-normal text-[var(--color-text-mid)] font-normal">
                          (opțional)
                        </span>
                      )}
                    </span>
                    <input
                      required={!section.organizationOptional}
                      type="text"
                      placeholder={section.organizationPlaceholder ?? ''}
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      className={inputClasses}
                    />
                  </label>
                )}
              </div>
            )}

            {hasSubject && (
              <label className="block">
                <span className={labelClasses}>{section.subjectLabel}</span>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={inputClasses}
                >
                  <option value="" disabled>
                    {section.subjectPlaceholder ?? 'Alege...'}
                  </option>
                  {section.subjectOptions.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {hasEventType && (
              <label className="block">
                <span className={labelClasses}>{section.eventTypeLabel}</span>
                <select
                  required
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className={inputClasses}
                >
                  <option value="" disabled>
                    {section.eventTypePlaceholder ?? 'Selectează...'}
                  </option>
                  {section.eventTypeOptions.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block">
              <span className={labelClasses}>{section.messageLabel}</span>
              <textarea
                required
                rows={6}
                placeholder={section.messagePlaceholder ?? ''}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClasses} resize-y`}
              />
            </label>

            {hasOptionalSection && (
              <>
                <div
                  className={`text-center text-[10px] uppercase tracking-[2px] font-semibold ${a.eyebrow} pt-4`}
                >
                  {section.optionalSectionLabel ?? 'Opțional — Detalii suplimentare'}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {hasDate && (
                    <label className="block">
                      <span className={labelClasses}>{section.dateEstimateLabel}</span>
                      <input
                        type="text"
                        placeholder={section.dateEstimatePlaceholder ?? ''}
                        value={form.dateEstimate}
                        onChange={(e) => setForm({ ...form, dateEstimate: e.target.value })}
                        className={inputClasses}
                      />
                    </label>
                  )}
                  {hasAudience && (
                    <label className="block">
                      <span className={labelClasses}>{section.audienceSizeLabel}</span>
                      <select
                        value={form.audienceSize}
                        onChange={(e) => setForm({ ...form, audienceSize: e.target.value })}
                        className={inputClasses}
                      >
                        <option value="">{section.audienceSizePlaceholder ?? 'Selectează...'}</option>
                        {section.audienceSizeOptions.map((opt) => (
                          <option key={opt.id} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                {hasBudget && (
                  <label className="block">
                    <span className={labelClasses}>{section.budgetLabel}</span>
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className={inputClasses}
                    >
                      <option value="">{section.budgetPlaceholder ?? 'Selectează...'}</option>
                      {section.budgetOptions.map((opt) => (
                        <option key={opt.id} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </>
            )}

            {section.consentText && (
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--color-paper-warm)]">
                <input
                  required
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm text-[var(--color-text-mid)] leading-[1.6]">
                  {section.consentText}
                </span>
              </label>
            )}

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={state === 'loading'}
                className="px-10 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-bright)] transition-colors disabled:opacity-60"
              >
                {state === 'loading' ? '...' : section.submitLabel}
              </button>
            </div>

            {state === 'error' && (
              <p className="text-sm text-red-400 text-center">A apărut o eroare. Încearcă din nou.</p>
            )}

            {section.fineprint && (
              <p className={`mt-6 text-center font-serif italic text-base ${a.textMuted}`}>
                {section.fineprint}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
