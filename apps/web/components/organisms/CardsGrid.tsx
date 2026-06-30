import type { CSSProperties, ReactElement } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CardsGridDTO, CardsGridItemDTO, MediaDTO } from '@repo/types'
import { sectionAnchorId } from '@/lib/sectionAnchor'

interface CardsGridProps {
  section: CardsGridDTO
}

const ZONE_BY_ACCENT: Record<CardsGridDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

// Author who narrates the audiobook — shown in the mini player mock. Decorative,
// not editor-facing copy, so it lives here rather than as a CMS field.
const AUDIOBOOK_AUTHOR = 'Costin Dămășaru'
const AUDIOBOOK_CHAPTER = 'Capitolul 1 — Introducere'

function ProductCover({ media, className }: { media: MediaDTO | null; className: string }) {
  if (!media?.url) return null
  return (
    <Image
      src={media.url}
      alt={media.alt ?? ''}
      width={media.width ?? 400}
      height={media.height ?? 600}
      className={className}
    />
  )
}

// ── Simple product/option cards (e.g. the book's 3 formats on /carte) ──────
// The original `products` design: an icon, a tag, a `price`, and a whole-card
// link. Kept separate from the magazin format-driven cards below (which carry
// `format`/`metaItems`); routed by data shape.
function productKind(tag: string | null): 'physical' | 'digital' | 'audio' {
  const t = (tag ?? '').toLowerCase()
  if (t.includes('audio') || t.includes('pregătire') || t.includes('pregatire') || t.includes('soon')) return 'audio'
  if (t.includes('pdf') || t.includes('instant') || t.includes('download') || t.includes('digital')) return 'digital'
  return 'physical'
}
function isComingSoon(tag: string | null): boolean {
  const t = (tag ?? '').toLowerCase()
  return t.includes('curând') || t.includes('curand') || t.includes('soon') || t.includes('pregătire') || t.includes('pregatire')
}
function ProductIcon({ kind }: { kind: 'physical' | 'digital' | 'audio' }) {
  const common = {
    className: 'optcard-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (kind === 'physical') {
    return (
      <svg {...common} aria-hidden>
        <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" />
      </svg>
    )
  }
  if (kind === 'digital') {
    return (
      <svg {...common} aria-hidden>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 18 15 15" />
      </svg>
    )
  }
  return (
    <svg {...common} aria-hidden>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

function ProductOptionCardBody({ item, idx }: { item: CardsGridItemDTO; idx: number }) {
  const kind = productKind(item.tag)
  const comingSoon = isComingSoon(item.tag)
  const featured = idx === 0 && !comingSoon
  // No purchase path yet → render as a non-clickable teaser.
  const disabled = comingSoon && !item.href
  const cardClass = `optcard${featured ? ' featured' : ''}${comingSoon && !featured ? ' coming-soon' : ''}${disabled ? ' disabled' : ''}`
  const tagClass = comingSoon
    ? 'optcard-tag tag-soon'
    : kind === 'physical'
      ? 'optcard-tag tag-bookzone'
      : kind === 'digital'
        ? 'optcard-tag tag-instant'
        : 'optcard-tag tag-soon'
  const inner = (
    <>
      {item.tag && (
        <span className={tagClass}>
          {comingSoon && <span className="pulse-dot" />}
          {item.tag}
        </span>
      )}
      <ProductIcon kind={kind} />
      <h3>{item.title}</h3>
      {item.text && <p>{item.text}</p>}
      {item.price && <div className="optcard-price">{item.price}</div>}
      {item.href && (
        <span className="optcard-cta">
          {comingSoon ? 'Înscrie-mă pe listă' : kind === 'digital' ? 'Cumpără PDF' : 'Cumpără pe Bookzone'}{' '}
          <span aria-hidden>→</span>
        </span>
      )}
    </>
  )
  if (!item.href) return <div className={cardClass}>{inner}</div>
  if (item.href.startsWith('http')) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={cardClass}>
        {inner}
      </a>
    )
  }
  if (item.href.startsWith('#')) {
    // Native <a> for same-page hash scrolling (Next <Link> is unreliable for it).
    return (
      <a href={item.href} className={cardClass}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={item.href} className={cardClass}>
      {inner}
    </Link>
  )
}

function ProductFormatCardBody({ item }: { item: CardsGridItemDTO }) {
  const format = item.format ?? 'hardcover'
  // Waitlist mode is derived: a price placeholder with no real price.
  const waitlist = !!item.priceText && !item.price
  const imageClass = format === 'hardcover' ? 'physical' : format
  const tagClass = `tag ${waitlist ? 'waitlist' : format === 'hardcover' ? 'physical' : 'digital'}`

  const ctaLabel = item.ctaLabel ?? (waitlist ? 'Anunță-mă' : 'Cumpără')
  const ctaInner = (
    <>
      {ctaLabel} <span aria-hidden>→</span>
    </>
  )
  const ctaClass = `product-btn ${waitlist ? 'btn-ghost' : 'btn-primary'}`
  let cta: ReactElement
  if (item.href) {
    if (item.href.startsWith('http')) {
      cta = (
        <a href={item.href} target="_blank" rel="noreferrer" className={ctaClass}>
          {ctaInner}
        </a>
      )
    } else if (item.href.startsWith('#')) {
      // In-page anchor (e.g. the waitlist CTAs point at #newsletter). Use a native
      // <a> so the browser handles same-page hash scrolling — Next's <Link> does
      // not reliably scroll to a hash on the current route in the App Router.
      cta = (
        <a href={item.href} className={ctaClass}>
          {ctaInner}
        </a>
      )
    } else {
      cta = (
        <Link href={item.href} className={ctaClass}>
          {ctaInner}
        </Link>
      )
    }
  } else {
    cta = (
      <button type="button" className={ctaClass}>
        {ctaInner}
      </button>
    )
  }

  return (
    <article className={`product-card ${imageClass}`}>
      <div className={`product-image ${imageClass}`}>
        {item.tag && <span className={tagClass}>{item.tag}</span>}
        {format === 'hardcover' && <ProductCover media={item.image} className="book-cover-img" />}
        {format === 'ebook' && (
          <div className="tablet-mockup">
            <ProductCover media={item.image} className="tablet-mockup-img" />
          </div>
        )}
        {format === 'audiobook' && (
          <div className="player-mockup">
            <div className="player-mockup-cover">
              <ProductCover media={item.image} className="player-mockup-cover-img" />
            </div>
            <div className="player-mockup-info">
              <div className="player-mockup-title">{AUDIOBOOK_CHAPTER}</div>
              <div className="player-mockup-author">{AUDIOBOOK_AUTHOR}</div>
              <div className="player-mockup-waveform" aria-hidden>
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="product-content">
        {item.eyebrow && <div className="product-eyebrow">{item.eyebrow}</div>}
        <h3 className="product-title">{item.title}</h3>
        {item.text && <p className="product-desc">{item.text}</p>}
        {item.metaItems && item.metaItems.length > 0 && (
          <ul className="product-meta-list">
            {item.metaItems.map((m, i) => (
              <li key={i}>
                {m.icon && <span className="product-meta-icon">{m.icon}</span>}
                {m.label}
              </li>
            ))}
          </ul>
        )}
        <div className="product-footer">
          {item.price ? (
            <div className="product-price">{item.price}</div>
          ) : item.priceText ? (
            <div className="product-price-text">{item.priceText}</div>
          ) : null}
          {cta}
          {item.fineprint && <p className="product-fineprint">{item.fineprint}</p>}
        </div>
      </div>
    </article>
  )
}

type PlatformKey = 'spotify' | 'apple' | 'youtube' | 'amazon' | 'rss'

const PLATFORM_ICONS: Record<PlatformKey, ReactElement> = {
  spotify: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.6 13.44 1.62.361.181.54.78.301 1.201zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.301.421-1.021.599-1.561.3z" />
    </svg>
  ),
  apple: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.6 5.4c1.7 0 3 1.3 3 3 0 1.7-1.3 3-3 3s-3-1.3-3-3c0-1.7 1.3-3 3-3zm-3 11c-2.2 0-4-1.8-4-4 0-1.5 4.5-2.4 4.5-2.4S9 11.6 9 12.5c0 1.7 1.3 3 3 3s3-1.3 3-3c0-.9-.5-2.5-.5-2.5s4.5.9 4.5 2.4c0 2.2-1.8 4-4 4-1.5 0-3-.7-3-1.5 0 .8-1.5 1.5-3 1.5z" />
    </svg>
  ),
  youtube: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  amazon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-.99.65-1.34.79-2.86 1.4-4.51 1.81-1.65.42-3.27.62-4.81.62-2.39 0-4.64-.42-6.76-1.25-2.11-.83-4.01-1.99-5.7-3.49-.097-.085-.146-.17-.146-.25 0-.057.024-.115.07-.18z" />
    </svg>
  ),
  rss: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 11a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 4a16 16 0 0 1 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="5" cy="19" r="2" />
    </svg>
  ),
}

function platformKey(item: CardsGridItemDTO): PlatformKey {
  const hay = `${item.tag ?? ''} ${item.title ?? ''}`.toLowerCase()
  if (hay.includes('apple')) return 'apple'
  if (hay.includes('youtube')) return 'youtube'
  if (hay.includes('amazon')) return 'amazon'
  if (hay.includes('rss')) return 'rss'
  return 'spotify'
}

function PlatformCardBody({ item }: { item: CardsGridItemDTO }) {
  const key = platformKey(item)
  const featured = (item.tag ?? '').toLowerCase().includes('featured')
  const className = `platform-card${featured ? ' featured' : ''}`
  const inner = (
    <>
      <div className={`platform-icon icon-${key}`}>{PLATFORM_ICONS[key]}</div>
      <div>
        <div className="platform-name">{item.title}</div>
        {item.text && <div className="platform-sub">{item.text}</div>}
      </div>
    </>
  )
  if (!item.href) return <div className={className}>{inner}</div>
  return item.href.startsWith('http') ? (
    <a href={item.href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  )
}

// ── Social channel cards (e.g. "Mă găsești și aici" on /contact) ───────────
// Navy section, brand icons keyed by the channel name; matches Contact_Mockup.html.
type ChannelKey = 'linkedin' | 'youtube' | 'instagram' | 'spotify' | 'facebook' | 'tiktok'

const CHANNEL_ICONS: Record<ChannelKey, ReactElement> = {
  linkedin: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  ),
  youtube: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  ),
  instagram: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  spotify: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.5-.5 10.3 1.2.3.2.4.5.2.9zm1.5-3.2c-.3.4-.7.5-1.1.3-2.8-1.7-7.1-2.2-10.4-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.8-1.2 8.5-.6 11.7 1.4.4.3.5.7.2 1.1zm.1-3.4c-3.4-2-9-2.2-12.2-1.2-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 3.7-1.1 9.9-.9 13.8 1.4.5.3.7.9.4 1.4-.3.4-.8.6-1.3.3z" />
    </svg>
  ),
  facebook: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.87v-8.4H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.47h-2.8v8.4C19.61 23.04 24 18.07 24 12.07z" />
    </svg>
  ),
  tiktok: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  ),
}

function channelKey(item: CardsGridItemDTO): ChannelKey | null {
  const hay = `${item.title ?? ''}`.toLowerCase()
  const keys: ChannelKey[] = ['linkedin', 'youtube', 'instagram', 'spotify', 'facebook', 'tiktok']
  return keys.find((k) => hay.includes(k)) ?? null
}

function ChannelCardBody({ item }: { item: CardsGridItemDTO }) {
  const key = channelKey(item)
  const inner = (
    <>
      {key && <div className="channel-card-icon">{CHANNEL_ICONS[key]}</div>}
      <div className="channel-card-name">{item.title}</div>
      {item.text && <div className="channel-card-handle">{item.text}</div>}
    </>
  )
  if (!item.href) return <div className="channel-card">{inner}</div>
  return item.href.startsWith('http') ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="channel-card">
      {inner}
    </a>
  ) : (
    <Link href={item.href} className="channel-card">
      {inner}
    </Link>
  )
}

export function CardsGrid({ section }: CardsGridProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-light'
  const variant = section.variant ?? 'default'
  const centerHeader = variant === 'products' || variant === 'platforms' || variant === 'channels'
  const fullWidth =
    variant === 'chapters' || variant === 'products' || variant === 'platforms' || variant === 'channels'
  const headerWrapClass = fullWidth ? '' : 'body-grid-narrow'

  return (
    <section className={zoneClass} id={sectionAnchorId(section.eyebrow)}>
      <div className="ds-container">
        <div className={headerWrapClass} style={centerHeader ? { textAlign: 'center' } : undefined}>
          {section.eyebrow && (
            <div className={`section-eyebrow${centerHeader ? ' center' : ''}`}>{section.eyebrow}</div>
          )}
          {section.heading && (
            <h2 className={`section-title${centerHeader ? ' center' : ''}`}>
              {section.heading}
              {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
            </h2>
          )}
          {section.lead && (
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '22px',
                color: 'var(--color-text-mid)',
                marginTop: '32px',
                lineHeight: 1.5,
                textAlign: centerHeader ? 'center' : undefined,
              }}
            >
              {section.lead}
            </p>
          )}
        </div>

        {variant === 'platforms' && (
            <div className="platforms-grid">
              {section.items.map((item) => (
                <PlatformCardBody key={item.id} item={item} />
              ))}
            </div>
          )}

          {variant === 'channels' && (
            <div className="channels-grid">
              {section.items.map((item) => (
                <ChannelCardBody key={item.id} item={item} />
              ))}
            </div>
          )}

          {variant === 'chapters' && (
            <div className="chapters-list">
              {section.items.map((item, i) => (
                <div
                  key={item.id}
                  className={`chapter${i === section.items.length - 1 && section.items.length % 2 === 1 ? ' full' : ''}`}
                >
                  <div className="chapter-num">{item.tag ?? String(i + 1).padStart(2, '0')}</div>
                  <div className="chapter-content">
                    <h3>{item.title}</h3>
                    {item.text && <p>{item.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {variant === 'products' &&
            (section.items.some((it) => !!it.format) ? (
              <div className="products-grid">
                {section.items.map((item) => (
                  <ProductFormatCardBody key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="optcards-grid">
                {section.items.map((item, i) => (
                  <ProductOptionCardBody key={item.id} item={item} idx={i} />
                ))}
              </div>
            ))}

          {variant === 'convictions' && (
            <div className="convictions-grid">
              {section.items.map((item, i) => (
                <div key={item.id} className="conviction">
                  <div className="conviction-num">Convingerea {ROMAN[i] ?? i + 1}</div>
                  <div className="conviction-quote">{item.title}</div>
                  {item.text && <p className="conviction-body">{item.text}</p>}
                </div>
              ))}
            </div>
          )}

          {variant === 'cta-cards' && (
            <div className="cta-grid">
              {section.items.map((item) => {
                const body = (
                  <>
                    {item.tag && <span className="cta-tag">{item.tag}</span>}
                    <div className="cta-title">{item.title}</div>
                    {item.text && <p className="cta-desc">{item.text}</p>}
                    {item.href && (
                      <span className="cta-link">
                        Vezi <span aria-hidden>→</span>
                      </span>
                    )}
                  </>
                )
                return item.href ? (
                  <Link key={item.id} href={item.href} className="cta-card">
                    {body}
                  </Link>
                ) : (
                  <div key={item.id} className="cta-card">
                    {body}
                  </div>
                )
              })}
            </div>
          )}

          {variant === 'default' && (
            <div
              className="cta-grid"
              style={
                { '--cta-cols': section.columns ?? '3' } as CSSProperties
              }
            >
              {section.items.map((item) => {
                const body = (
                  <>
                    {item.tag && <span className="cta-tag">{item.tag}</span>}
                    <div className="cta-title" style={{ color: 'inherit' }}>
                      {item.title}
                    </div>
                    {item.text && <p className="cta-desc">{item.text}</p>}
                  </>
                )
                return item.href ? (
                  <Link key={item.id} href={item.href} className="cta-card">
                    {body}
                  </Link>
                ) : (
                  <div key={item.id} className="cta-card">
                    {body}
                  </div>
                )
              })}
            </div>
          )}
      </div>
    </section>
  )
}
