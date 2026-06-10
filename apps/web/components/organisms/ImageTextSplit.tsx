import Image from 'next/image'
import Link from 'next/link'
import type { ImageTextSplitDTO } from '@repo/types'

interface ImageTextSplitProps {
  section: ImageTextSplitDTO
}

const ZONE_BY_ACCENT: Record<ImageTextSplitDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'quote'; text: string }

function bodyToBlocks(body: string): Block[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      p.startsWith('> ')
        ? ({ kind: 'quote', text: p.slice(2).trim() } as Block)
        : ({ kind: 'p', text: p } as Block)
    )
}

function ctaClass(variant: string | undefined): string {
  return `btn ${variant === 'outline' || variant === 'secondary' ? 'btn-ghost' : 'btn-primary'}`
}

function ExternalLinks({ links }: { links: ImageTextSplitDTO['externalLinks'] }) {
  if (!links || links.length === 0) return null
  return (
    <div className="author-links">
      {links.map((l) =>
        l.muted || !l.href ? (
          <span key={l.id} className="author-link muted">
            {l.label}
          </span>
        ) : (
          <a key={l.id} href={l.href} target="_blank" rel="noreferrer" className="author-link">
            {l.label} <span aria-hidden>↗</span>
          </a>
        )
      )}
    </div>
  )
}

export function ImageTextSplit({ section }: ImageTextSplitProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-light'
  const reverse = section.imageSide === 'right'
  const blocks = bodyToBlocks(section.body ?? '')
  const hasProjects = section.projectsRow && section.projectsRow.length > 0

  if (!section.image) {
    return (
      <section className={zoneClass}>
        <div className="ds-container">
          <div className="zone2-grid no-image">
            <div>
              {section.eyebrow && <div className="section-eyebrow">{section.eyebrow}</div>}
              {section.heading && (
                <h2 className="section-title">
                  {section.heading}
                  {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
                </h2>
              )}
            </div>
            <div className="zone2-text-lead">
              {blocks.map((b, i) =>
                b.kind === 'quote' ? (
                  <div key={i} className="pull-quote-light">
                    <p>{b.text}</p>
                  </div>
                ) : (
                  <p key={i}>{b.text}</p>
                )
              )}
              <ExternalLinks links={section.externalLinks} />
              {section.cta && (
                <div style={{ marginTop: '32px' }}>
                  <Link href={section.cta.href} className={ctaClass(section.cta.variant)}>
                    {section.cta.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const paragraphs = blocks.filter((b) => b.kind === 'p').map((b) => b.text)
  // When every paragraph is a quotation (e.g. the Credință section), they are
  // equal-status quotes — suppress the lead-paragraph emphasis so they render
  // uniformly instead of the first one looking heavier than the rest.
  const allQuotesBody = paragraphs.length > 1 && paragraphs.every((p) => p.startsWith('„'))
  const splitIdx = hasProjects && paragraphs.length >= 3 ? 2 : paragraphs.length
  const beforeProjects = paragraphs.slice(0, splitIdx)
  const afterProjects = paragraphs.slice(splitIdx)
  const isAboutMini = /despre\s+(autor|gazd[aă]|host)|about\s+(author|host)/i.test(section.eyebrow ?? '')

  if (isAboutMini) {
    return (
      <section className={zoneClass}>
        <div className="ds-container">
          <div className="about-mini-grid">
            <div className="about-mini-photo">
              <Image
                src={section.image.url}
                alt={section.image.alt || section.heading || ''}
                width={section.image.width || 900}
                height={section.image.height || 1200}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="about-mini-body">
              {section.eyebrow && <div className="section-eyebrow">{section.eyebrow}</div>}
              {section.heading && (
                <h2 className="section-title">
                  {section.heading}
                  {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
                </h2>
              )}
              {paragraphs.map((p, i) => (
                <p key={i}>{`„${p}"`}</p>
              ))}
              {section.cta && (
                <Link href={section.cta.href} className="btn btn-ghost">
                  {section.cta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={zoneClass}>
      <div className="ds-container">
        <div className={`zone2-grid${reverse ? ' reverse' : ''}`} style={reverse ? { gridTemplateColumns: '1fr 1fr' } : undefined}>
          <div className="zone2-photo-block" style={reverse ? { order: 2 } : undefined}>
            <div className="zone2-photo">
              <Image
                src={section.image.url}
                alt={section.image.alt || section.heading || ''}
                width={section.image.width || 900}
                height={section.image.height || 1200}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {section.imageCaption && <p className="zone2-caption">{section.imageCaption}</p>}
          </div>
          <div className="zone2-text">
            {section.eyebrow && <div className="section-eyebrow">{section.eyebrow}</div>}
            {section.heading && (
              <h2 className="section-title">
                {section.heading}
                {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
              </h2>
            )}
            <div className={allQuotesBody ? 'quotes-body' : undefined}>
              {beforeProjects.map((p, i) => (
                <p key={`b${i}`}>{p}</p>
              ))}
              {hasProjects && (
                <div className="projects-row">
                  {section.projectsRow.map((proj) =>
                    proj.href ? (
                      <Link key={proj.id} href={proj.href} className="project-mini">
                        <div className="project-mini-name">{proj.name}</div>
                        {proj.tag && <div className="project-mini-tag">{proj.tag}</div>}
                      </Link>
                    ) : (
                      <div key={proj.id} className="project-mini">
                        <div className="project-mini-name">{proj.name}</div>
                        {proj.tag && <div className="project-mini-tag">{proj.tag}</div>}
                      </div>
                    )
                  )}
                </div>
              )}
              {afterProjects.map((p, i) => (
                <p key={`a${i}`}>{p}</p>
              ))}
            </div>
            <ExternalLinks links={section.externalLinks} />
            {section.cta && (
              <div style={{ marginTop: '32px' }}>
                <Link href={section.cta.href} className={ctaClass(section.cta.variant)}>
                  {section.cta.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
