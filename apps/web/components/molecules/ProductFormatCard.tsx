import type { ReactElement } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CardsGridMetaItemDTO, MediaDTO } from '@repo/types'

// Author + chapter shown in the audiobook now-playing mock. Decorative, not
// editor-facing copy, so they live here rather than as CMS fields.
const AUDIOBOOK_AUTHOR = 'Costin Dămășaru'
const AUDIOBOOK_CHAPTER = 'Capitolul 1 — Introducere'

/** Image treatment per product format; unknown formats fall back to the cover. */
export type ProductCardFormat = 'hardcover' | 'ebook' | 'audiobook' | 'event'

export interface ProductFormatCardProps {
  format: ProductCardFormat
  image: MediaDTO | null
  /** Status pill text overlaid on the image (null hides it). */
  tag?: string | null
  /** Pill colour treatment. */
  tagTone?: 'physical' | 'digital' | 'waitlist'
  eyebrow?: string | null
  title: string
  text?: string | null
  metaItems?: CardsGridMetaItemDTO[]
  price?: string | null
  /** Placeholder shown instead of `price` (waitlist mode). */
  priceText?: string | null
  fineprint?: string | null
  ctaLabel: string
  /** Filled (`primary`) vs outlined (`ghost`) CTA. */
  ctaVariant?: 'primary' | 'ghost'
  href?: string | null
}

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

/**
 * The rich "magazin" product card — shared by the Magazin page (`CardsGrid`,
 * variant `products`) and the homepage shop zone (`FeaturedList`, relation
 * `products`) so the two surfaces never drift. Visual classes are the semantic
 * `.product-*` rules in `globals.css`.
 */
export function ProductFormatCard({
  format,
  image,
  tag,
  tagTone = 'physical',
  eyebrow,
  title,
  text,
  metaItems = [],
  price,
  priceText,
  fineprint,
  ctaLabel,
  ctaVariant = 'primary',
  href,
}: ProductFormatCardProps) {
  const imageClass = format === 'hardcover' ? 'physical' : format
  const ctaClass = `product-btn ${ctaVariant === 'ghost' ? 'btn-ghost' : 'btn-primary'}`
  const ctaInner = (
    <>
      {ctaLabel} <span aria-hidden>→</span>
    </>
  )

  let cta: ReactElement
  if (href) {
    if (href.startsWith('http')) {
      cta = (
        <a href={href} target="_blank" rel="noreferrer" className={ctaClass}>
          {ctaInner}
        </a>
      )
    } else if (href.startsWith('#')) {
      // In-page anchor (e.g. waitlist CTAs point at #newsletter). Use a native
      // <a> so the browser handles same-page hash scrolling — Next's <Link>
      // does not reliably scroll to a hash on the current route.
      cta = (
        <a href={href} className={ctaClass}>
          {ctaInner}
        </a>
      )
    } else {
      cta = (
        <Link href={href} className={ctaClass}>
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
        {tag && <span className={`tag ${tagTone}`}>{tag}</span>}
        {format === 'hardcover' && <ProductCover media={image} className="book-cover-img" />}
        {format === 'ebook' && (
          <div className="tablet-mockup">
            <ProductCover media={image} className="tablet-mockup-img" />
          </div>
        )}
        {format === 'audiobook' && (
          <div className="player-mockup">
            <div className="player-mockup-cover">
              <ProductCover media={image} className="player-mockup-cover-img" />
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
        {format === 'event' && <ProductCover media={image} className="event-cover-img" />}
      </div>

      <div className="product-content">
        {eyebrow && <div className="product-eyebrow">{eyebrow}</div>}
        <h3 className="product-title">{title}</h3>
        {text && <p className="product-desc">{text}</p>}
        {metaItems.length > 0 && (
          <ul className="product-meta-list">
            {metaItems.map((m, i) => (
              <li key={i}>
                {m.icon && <span className="product-meta-icon">{m.icon}</span>}
                {m.label}
              </li>
            ))}
          </ul>
        )}
        <div className="product-footer">
          {price ? (
            <div className="product-price">{price}</div>
          ) : priceText ? (
            <div className="product-price-text">{priceText}</div>
          ) : null}
          {cta}
          {fineprint && <p className="product-fineprint">{fineprint}</p>}
        </div>
      </div>
    </article>
  )
}
