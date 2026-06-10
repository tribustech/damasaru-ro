import Image from 'next/image'
import type { HeroDTO } from '@repo/types'
import { HeroCtaLink } from '@/components/molecules/HeroCtaLink'

interface HeroSectionProps {
  section: HeroDTO
  locale: string
}

const ZONE_BY_ACCENT: Record<HeroDTO['accent'], string> = {
  navy: 'zone-hero',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

type PodcastPlatformIcon = { key: 'apple' | 'amazon'; title: string; href: string }

const PODCAST_PLATFORM_ICONS: PodcastPlatformIcon[] = [
  { key: 'apple', title: 'Apple Podcasts', href: 'https://podcasts.apple.com/' },
  { key: 'amazon', title: 'Amazon Music', href: 'https://music.amazon.com/' },
]

function PodcastPlatformIconSvg({ which }: { which: PodcastPlatformIcon['key'] }) {
  if (which === 'apple') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 5c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 13c-2.5 0-4.7-1.3-6-3.2 0-2 4-3.1 6-3.1s6 1.1 6 3.1c-1.3 1.9-3.5 3.2-6 3.2z" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  )
}

export function HeroSection({ section, locale: _locale }: HeroSectionProps) {
  const hasMedia = !!section.media && section.mediaPosition !== 'none'
  const reverse = section.mediaPosition === 'left'
  const statsItems = section.statsStrip?.items ?? []
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-hero'
  const altLower = (section.media?.alt ?? '').toLowerCase()
  const eyebrowLower = (section.eyebrow ?? '').toLowerCase()
  const isPodcast = /podcast/.test(eyebrowLower) || /podcast|cover[- ]?art|mansard/.test(altLower)
  const isBookCover =
    !isPodcast && !!section.media?.alt && /copert(a|ei|ă)|book[- ]?cover/i.test(section.media.alt)
  // Conceptual hero graphic (e.g. Idei's animated "impuls electric → sens" SVG):
  // a self-contained vector carrying its own background, labels and CSS keyframe
  // animations. Framed in a bordered box rather than the photo crop, and served
  // unoptimized so the embedded animations run untouched.
  const isConceptVisual =
    !isPodcast &&
    !isBookCover &&
    !!section.media &&
    (/\.svg(\?|$)/i.test(section.media.url) || /impuls|sens|eeg/.test(altLower))
  const statsLooksLikeStrip = statsItems.length === 3
  const heroLayoutOpen = !!(section.ctaButtons?.length || section.subtitle || statsItems.length)

  return (
    <section className={zoneClass}>
      <div className="ds-container">
        <div className={hasMedia ? `hero-grid${reverse ? ' reverse' : ''}` : 'body-grid-narrow'}>
          <div>
            {section.eyebrow && <span className="hero-eyebrow">{section.eyebrow}</span>}
            <h1 className="hero-h1">
              {section.title}
              {section.titleItalic && <span className="italic">{section.titleItalic}</span>}
            </h1>
            {section.subtitle && <p className="hero-lead">{section.subtitle}</p>}
            {section.body && (
              <div className="hero-body">
                {section.body
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            )}
            {section.ctaButtons?.length > 0 && (
              <div className="hero-ctas">
                {section.ctaButtons.map((btn) => (
                  <HeroCtaLink
                    key={btn.href}
                    href={btn.href}
                    label={btn.label}
                    className={`btn ${btn.variant === 'outline' ? 'btn-ghost-light' : 'btn-primary'}`}
                  />
                ))}
              </div>
            )}
            {isPodcast && (
              <div className="hero-platforms-mini">
                <span className="hero-platforms-mini-label">Și pe</span>
                {PODCAST_PLATFORM_ICONS.map((p) => (
                  <a
                    key={p.key}
                    href={p.href}
                    title={p.title}
                    aria-label={p.title}
                    className="platform-icon-mini"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <PodcastPlatformIconSvg which={p.key} />
                  </a>
                ))}
              </div>
            )}
            {!statsLooksLikeStrip && statsItems.length > 0 && (
              <div className="hero-stats">
                {statsItems.map((stat) => (
                  <div key={stat.id} className="stat-card">
                    <div className="num">{stat.value}</div>
                    <div className="label">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {hasMedia && section.media && isConceptVisual && (
            <div className="hero-visual-wrap">
              <div className="hero-visual">
                <Image
                  src={section.media.url}
                  alt={section.media.alt || section.title}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 1024px) 100vw, 460px"
                />
              </div>
            </div>
          )}
          {hasMedia && section.media && !isConceptVisual && (
            <div
              className={`hero-photo-wrap${isBookCover ? ' book' : ''}${isPodcast ? ' cover-art' : ''}`}
            >
              {isBookCover && <div className="book-glow" aria-hidden />}
              <div
                className={`hero-photo${isBookCover ? ' book-cover' : ''}${isPodcast ? ' cover-art-real' : ''}`}
              >
                <Image
                  src={section.media.url}
                  alt={section.media.alt || section.title}
                  width={section.media.width || 1200}
                  height={section.media.height || 1500}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={isBookCover || isPodcast ? '' : 'object-cover'}
                />
              </div>
            </div>
          )}
        </div>
        {statsLooksLikeStrip && heroLayoutOpen && (
          <div className="hero-stats strip">
            {statsItems.map((stat) => (
              <div key={stat.id} className="stat-card">
                <div className="num">{stat.value}</div>
                <div className="label">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
