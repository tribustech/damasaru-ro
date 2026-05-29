import Image from 'next/image'
import { Fragment } from 'react'
import type { ProjectFeatureDTO } from '@repo/types'

interface ProjectFeatureProps {
  section: ProjectFeatureDTO
}

const ZONE_BY_ACCENT: Record<ProjectFeatureDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

// Convert inline **bold** markdown to <strong> within a paragraph.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/)
    if (m) return <strong key={i}>{m[1]}</strong>
    return <Fragment key={i}>{part}</Fragment>
  })
}

export function ProjectFeature({ section }: ProjectFeatureProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-dark'
  const isCentered = section.layout === 'centered'
  const paragraphs = (section.body ?? '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  const renderText = () => (
    <>
      {section.eyebrow && (
        <div className="project-eyebrow" style={isCentered ? { justifyContent: 'center' } : undefined}>
          {section.eyebrow}
        </div>
      )}
      <div className={`project-wordmark${isCentered ? ' smaller' : ''}`}>
        {section.wordmark}
        {section.wordmarkItalic && (
          <>
            {' '}
            <span className="italic">{section.wordmarkItalic}</span>
          </>
        )}
        {section.wordmarkLine2 && <span className="italic">{section.wordmarkLine2}</span>}
        {section.wordmarkLine3 && <span className="italic">{section.wordmarkLine3}</span>}
      </div>
      {section.since && <div className="project-since">{section.since}</div>}
      {section.tagline && <p className="project-tagline">{section.tagline}</p>}
      {paragraphs.length > 0 && (
        <div className="project-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{renderInline(p)}</p>
          ))}
        </div>
      )}
      {section.stats.length > 0 && (
        <div className="project-stats">
          {section.stats.map((s) => (
            <div className="stat" key={s.id}>
              <div className="num">{s.value}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {section.asocBox && (
        <div className="asoc-box">
          {section.asocBox.statusText && (
            <div className="asoc-status">
              <span className="dot" />
              {section.asocBox.statusText}
            </div>
          )}
          {section.asocBox.title && (
            <h3>
              {section.asocBox.title}
              {section.asocBox.titleItalic && (
                <>
                  {' '}
                  <span className="italic">{section.asocBox.titleItalic}</span>
                </>
              )}
            </h3>
          )}
          {section.asocBox.body && <p>{section.asocBox.body}</p>}
        </div>
      )}
      {section.ctas.length > 0 && (
        <div className="project-ctas">
          {section.ctas.map((c) => {
            const base = c.variant === 'secondary' ? 'btn-secondary' : 'btn btn-primary'
            const gd = c.goldDeep ? ' gold-deep' : ''
            const ext = /^https?:/.test(c.href)
            return (
              <a
                key={c.href}
                href={c.href}
                className={`${base}${gd}`}
                {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
              >
                {c.label} →
              </a>
            )
          })}
        </div>
      )}
    </>
  )

  const renderPhoto = () =>
    section.image ? (
      <div className="photo-slot-wrap">
        <div className="real-photo">
          <Image
            src={section.image.url}
            alt={section.image.alt || section.wordmark}
            width={section.image.width || 1000}
            height={section.image.height || 1250}
            sizes="(max-width: 968px) 100vw, 50vw"
          />
        </div>
        {section.imageCaption && <p className="photo-caption">{section.imageCaption}</p>}
      </div>
    ) : null

  if (isCentered) {
    return (
      <section id={section.anchorId ?? undefined} className={`${zoneClass} project-section`}>
        <div className="ds-container">
          <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>{renderText()}</div>
        </div>
      </section>
    )
  }

  return (
    <section id={section.anchorId ?? undefined} className={`${zoneClass} project-section`}>
      <div className="ds-container">
        <div className={`project-grid ${section.layout}`}>
          {section.layout === 'text-right' ? (
            <>
              {renderPhoto()}
              <div>{renderText()}</div>
            </>
          ) : (
            <>
              <div>{renderText()}</div>
              {renderPhoto()}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
