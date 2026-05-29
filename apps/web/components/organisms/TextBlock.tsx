import Link from 'next/link'
import type { TextBlockDTO } from '@repo/types'
import { sectionAnchorId } from '@/lib/sectionAnchor'

interface TextBlockProps {
  section: TextBlockDTO
}

const ZONE_BY_ACCENT: Record<TextBlockDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

const DARK_ZONES = new Set(['navy', 'navy-deep'])

type Block = { kind: 'p' | 'quote'; text: string }

function bodyToBlocks(body: string): Block[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      p.startsWith('> ')
        ? { kind: 'quote' as const, text: p.replace(/^>\s?/gm, '').trim() }
        : { kind: 'p' as const, text: p }
    )
}

export function TextBlock({ section }: TextBlockProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-light'
  const isDark = DARK_ZONES.has(section.accent)
  const blocks = bodyToBlocks(section.body ?? '')
  const isCentered = section.align === 'center'

  return (
    <section className={zoneClass} id={sectionAnchorId(section.eyebrow)}>
      <div className="ds-container">
        <div className="body-grid-narrow" style={isCentered ? { textAlign: 'center' } : undefined}>
          {section.eyebrow && (
            <div className={`section-eyebrow${isCentered ? ' center' : ''}`}>{section.eyebrow}</div>
          )}
          {section.heading && (
            <h2 className={`section-title${isCentered ? ' center' : ''}`}>
              {section.heading}
              {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
            </h2>
          )}
          {blocks.length > 0 && (
            <div className="body-text" style={{ marginTop: '48px' }}>
              {blocks.map((b, i) =>
                b.kind === 'quote' ? (
                  <div key={i} className={`pull-quote${isDark ? ' dark' : ''}`}>
                    <p>{b.text}</p>
                  </div>
                ) : (
                  <p key={i}>{b.text}</p>
                )
              )}
            </div>
          )}
          {section.cta && (
            <div style={{ marginTop: '48px', textAlign: isCentered ? 'center' : undefined }}>
              <Link
                href={section.cta.href}
                className={`btn ${section.cta.variant === 'outline' ? (isDark ? 'btn-ghost-light' : 'btn-ghost') : 'btn-primary'}`}
              >
                {section.cta.label} <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
