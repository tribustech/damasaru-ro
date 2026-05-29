import Image from 'next/image'
import type { MediaHeroDTO } from '@repo/types'

interface MediaHeroProps {
  section: MediaHeroDTO
  locale: string
}

/**
 * Z1 navy media hero — pixel-faithful build of the mockup `.hero` zone.
 * Server component: static data straight from the section fields, no fetch.
 * Mockup CSS is translated verbatim to the project's color/font CSS custom
 * properties and namespaced with `mh-` so it never collides with the global
 * `.hero`/`zone-hero` styles in globals.css.
 */
export default function MediaHero({ section }: MediaHeroProps) {
  const paragraphs = (section.body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const badge = section.badgeLabel?.trim() || 'În interviu'

  return (
    <section className="mh-hero">
      <style>{MEDIA_HERO_CSS}</style>
      <div className="ds-container mh-hero-inner">
        <div className="mh-hero-left">
          {section.eyebrow && <div className="mh-eyebrow">{section.eyebrow}</div>}
          <h1 className="mh-h1">
            {section.title}
            {section.titleItalic && <em>{section.titleItalic}</em>}
          </h1>
          {section.subtitle && <p className="mh-hero-sub">{section.subtitle}</p>}
          {paragraphs.length > 0 && (
            <div className="mh-hero-manifest">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>
        <div className="mh-hero-right">
          {section.media && (
            <Image
              className="mh-hero-portrait"
              src={section.media.url}
              alt={section.media.alt || section.title}
              width={section.media.width || 800}
              height={section.media.height || 1120}
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          )}
          <div className="mh-hero-badge">
            <span aria-hidden="true">●</span> {badge}
          </div>
        </div>
      </div>
    </section>
  )
}

const MEDIA_HERO_CSS = `
.mh-hero {
  background: var(--color-navy);
  padding: 100px 0 80px;
  position: relative;
  overflow: hidden;
}
.mh-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 30%, rgba(212,175,106,0.08), transparent 50%),
    radial-gradient(ellipse at 20% 70%, rgba(90,153,153,0.06), transparent 50%);
  pointer-events: none;
}
.mh-hero-inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 60px;
  align-items: center;
}
.mh-hero-left { max-width: 640px; }
.mh-hero-right {
  position: relative;
  height: 560px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-navy-deep);
}
.mh-hero-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: contrast(1.05) saturate(1.05);
}
.mh-hero-right::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(20,32,46,0) 60%, rgba(20,32,46,0.45) 100%),
    linear-gradient(90deg, rgba(20,32,46,0) 70%, rgba(20,32,46,0.25) 100%);
  pointer-events: none;
}
.mh-hero-badge {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: rgba(20,32,46,0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212,175,106,0.25);
  color: var(--color-gold);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  z-index: 3;
}
.mh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 28px;
}
.mh-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: var(--color-gold);
}
.mh-h1 {
  font-family: var(--font-serif);
  font-size: 80px;
  font-weight: 500;
  line-height: 1;
  color: #fff;
  letter-spacing: -2px;
  margin-bottom: 36px;
}
.mh-h1 em {
  display: block;
  color: var(--color-gold);
  font-style: italic;
  font-weight: 500;
}
.mh-hero-sub {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 22px;
  color: var(--color-text-light);
  line-height: 1.45;
  margin-bottom: 28px;
}
.mh-hero-manifest p {
  color: var(--color-text-light);
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 14px;
  opacity: 0.85;
}
@media (max-width: 1024px) {
  .mh-hero-inner { grid-template-columns: 1fr; gap: 40px; }
  .mh-hero-right { height: 400px; order: 2; }
  .mh-hero-left { order: 1; }
  .mh-h1 { font-size: 56px; }
}
@media (max-width: 640px) {
  .mh-h1 { font-size: 42px; }
}
`
