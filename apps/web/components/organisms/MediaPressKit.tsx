import type { ReactNode } from 'react'
import type { MediaPressKitDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { accentRootClass, getZoneClass } from '@/lib/accent'

interface MediaPressKitProps {
  section: MediaPressKitDTO
  locale: string
}

type IconKey = MediaPressKitDTO['items'][number]['iconKey']

/** Feather-style icons (28×28, stroke=currentColor so the card-hover Forest recolor follows). */
const ICONS: Record<IconKey, ReactNode> = {
  document: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="14" y2="17" />
    </svg>
  ),
  camera: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  mail: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
}

const PRESS_EMAIL = 'contact@damasaru.ro'
const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'

function fileUrl(url: string): string {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

/** Default Romanian CTA labels per icon, used when no card-level label is supplied. */
const DEFAULT_LABEL: Record<IconKey, string> = {
  document: 'Descarcă PDF',
  camera: 'Descarcă ZIP',
  mail: 'Trimite mesaj',
}

export default function MediaPressKit({ section }: MediaPressKitProps) {
  const files = section.files ?? []

  return (
    <section
      className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)} bg-[var(--color-paper-warm)] py-[100px]`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow={section.eyebrow}
          heading={section.heading ?? ''}
          headingItalic={section.headingItalic}
          lead={section.intro}
          accent={section.accent}
          align="center"
        />

        <div className="mt-[60px] grid grid-cols-1 lg:grid-cols-3 gap-8">
          {section.items.map((item, idx) => {
            const isMail = item.iconKey === 'mail'
            // Non-mail cards surface an uploaded file (1st → document, 2nd → camera, by order).
            const file = isMail
              ? null
              : (files[section.items.filter((i, j) => i.iconKey !== 'mail' && j < idx).length] ??
                files[0] ??
                null)
            const href = isMail ? `mailto:${PRESS_EMAIL}` : file ? fileUrl(file.url) : '#'
            const label = DEFAULT_LABEL[item.iconKey]
            const arrow = isMail ? '→' : '↓'

            return (
              <div
                key={item.id}
                className="group bg-white border border-[var(--color-line)] rounded-[10px] px-8 py-10 transition-all duration-300 hover:border-[var(--color-gold)] hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-[rgba(212,175,106,0.12)] text-[var(--color-gold-deep)] transition-colors duration-300 group-hover:bg-[rgba(45,77,67,0.12)] group-hover:text-[var(--color-forest)]">
                  {ICONS[item.iconKey]}
                </div>
                <h3 className="font-serif text-[26px] font-medium text-[var(--color-navy)] mb-3 leading-tight">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-[var(--color-text-mid)] leading-relaxed mb-6">
                    {isMail
                      ? renderWithEmail(item.description)
                      : item.description}
                  </p>
                )}
                <a
                  href={href}
                  {...(!isMail
                    ? { target: '_blank', rel: 'noreferrer', download: '' }
                    : {})}
                  className="inline-flex items-center gap-2 bg-[var(--color-navy)] text-[var(--color-gold)] px-6 py-3 rounded-full text-[13px] font-semibold transition-colors duration-200 hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)]"
                >
                  {label} <span>{arrow}</span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Bold the press email wherever it appears in the contact-card body. */
function renderWithEmail(text: string): ReactNode {
  const parts = text.split(PRESS_EMAIL)
  if (parts.length === 1) return text
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <strong key={i} className="text-[var(--color-navy)]">
            {PRESS_EMAIL}
          </strong>,
          part,
        ],
  )
}
