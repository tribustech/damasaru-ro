import type { ProiecteHeroDTO } from '@repo/types'

interface ProiecteHeroProps {
  section: ProiecteHeroDTO
}

const ZONE_BY_ACCENT: Record<ProiecteHeroDTO['accent'], string> = {
  navy: 'zone-hero',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

export function ProiecteHero({ section }: ProiecteHeroProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-hero'
  const paragraphs = (section.body ?? '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className={zoneClass}>
      <div className="ds-container">
        <div className="hero-inner">
          {section.eyebrow && <div className="section-eyebrow center">{section.eyebrow}</div>}
          <h1 className="hero-h1">
            {section.title}
            {section.titleItalic && <span className="italic">{section.titleItalic}</span>}
          </h1>
          {section.subtitle && <p className="hero-subtitle">{section.subtitle}</p>}
          {paragraphs.length > 0 && (
            <div className="hero-body">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {section.anchors.length > 0 && (
            <div className="anchor-chips">
              {section.anchors.map((a) => (
                <a key={a.href} href={a.href} className="anchor-chip">
                  {a.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
