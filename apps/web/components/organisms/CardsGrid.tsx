import type { ReactElement } from 'react'
import Link from 'next/link'
import type { CardsGridDTO, CardsGridItemDTO } from '@repo/types'
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

const PRICE_RE = /([\d.,]+\s*lei)\s*$/i

function extractPrice(text: string | null): { text: string; price: string | null } {
  if (!text) return { text: '', price: null }
  const m = text.match(PRICE_RE)
  if (!m) return { text, price: null }
  return { text: text.slice(0, m.index).replace(/[\s.·•—-]+$/, '').trim(), price: m[1] }
}

function productKind(tag: string | null): 'physical' | 'digital' | 'audio' {
  const t = (tag ?? '').toLowerCase()
  if (t.includes('audio') || t.includes('pregătire') || t.includes('pregatire') || t.includes('soon')) return 'audio'
  if (t.includes('pdf') || t.includes('instant') || t.includes('download') || t.includes('digital')) return 'digital'
  return 'physical'
}

function isComingSoon(tag: string | null): boolean {
  const t = (tag ?? '').toLowerCase()
  return t.includes('curând') || t.includes('curand') || t.includes('soon')
}

function ProductIcon({ kind }: { kind: 'physical' | 'digital' | 'audio' }) {
  const common = {
    className: 'product-icon',
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

function ProductCardBody({ item, idx }: { item: CardsGridItemDTO; idx: number }) {
  const kind = productKind(item.tag)
  const { text, price } = extractPrice(item.text ?? '')
  const comingSoon = isComingSoon(item.tag)
  const featured = idx === 0 && !comingSoon
  // No purchase path yet → render as a grayed-out, non-clickable teaser.
  const disabled = comingSoon && !item.href
  const cardClass = `product-card${featured ? ' featured' : ''}${comingSoon && !featured ? ' coming-soon' : ''}${disabled ? ' disabled' : ''}`
  const tagClass = comingSoon
    ? 'product-tag tag-soon'
    : kind === 'physical'
      ? 'product-tag tag-bookzone'
      : kind === 'digital'
        ? 'product-tag tag-instant'
        : 'product-tag tag-soon'
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
      {text && <p>{text}</p>}
      {!comingSoon && price && <div className="product-price">{price}</div>}
      {item.href && (
        <span className="product-cta">
          {comingSoon ? 'Înscrie-mă pe listă' : kind === 'digital' ? 'Cumpără PDF' : 'Cumpără pe Bookzone'}{' '}
          <span aria-hidden>→</span>
        </span>
      )}
    </>
  )
  if (item.href) {
    const isExternal = item.href.startsWith('http')
    return isExternal ? (
      <a href={item.href} target="_blank" rel="noreferrer" className={cardClass}>
        {inner}
      </a>
    ) : (
      <Link href={item.href} className={cardClass}>
        {inner}
      </Link>
    )
  }
  return <div className={cardClass}>{inner}</div>
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

export function CardsGrid({ section }: CardsGridProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-light'
  const variant = section.variant ?? 'default'
  const centerHeader = variant === 'products' || variant === 'platforms'
  const fullWidth = variant === 'chapters' || variant === 'products' || variant === 'platforms'
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

          {variant === 'products' && (
            <div className="products-grid">
              {section.items.map((item, i) => (
                <ProductCardBody key={item.id} item={item} idx={i} />
              ))}
            </div>
          )}

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
              style={{
                gridTemplateColumns: `repeat(${section.columns ?? '3'}, 1fr)`,
              }}
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
