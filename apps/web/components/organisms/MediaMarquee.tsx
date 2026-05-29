'use client'

import Image from 'next/image'
import type { MediaMarqueeDTO, PressMentionDTO } from '@repo/types'
import { accentRootClass, getZoneClass } from '@/lib/accent'

interface MediaMarqueeProps {
  section: MediaMarqueeDTO
  locale: string
}

/**
 * Maps the press-mention `type` enum (tv/podcast/publicatie/radio/evenimente)
 * to the display badge label + tip background colour seen in the mockup.
 * `data-tip` carries the *display* label so the per-type glyph CSS
 * (◰ Publicație / ◉ Radio / ✦ Evenimente / ▶ default) resolves correctly.
 */
const TYPE_META: Record<
  string,
  { label: string; tipBg: string }
> = {
  // Tip background colours per the marquee mockup: teal #5A9999 (Evenimente/Radio),
  // navy #14202E (Podcast), gold-deep (Publicație), forest (TV).
  tv: { label: 'TV', tipBg: 'var(--color-forest)' },
  podcast: { label: 'Podcast', tipBg: 'var(--color-navy)' },
  publicatie: { label: 'Publicație', tipBg: 'var(--color-gold-deep)' },
  radio: { label: 'Radio', tipBg: '#5A9999' },
  evenimente: { label: 'Evenimente', tipBg: '#5A9999' },
}

const FALLBACK_META = { label: 'Media', tipBg: 'var(--color-navy)' }

/** Pull the YouTube video id from a watch / youtu.be / shorts / embed URL. */
function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    if (host.endsWith('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const parts = u.pathname.split('/').filter(Boolean)
      const idx = parts.findIndex((p) => p === 'shorts' || p === 'embed')
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    }
  } catch {
    return null
  }
  return null
}

function meta(item: PressMentionDTO) {
  return (item.type && TYPE_META[item.type]) || FALLBACK_META
}

function MarqueeCard({ item }: { item: PressMentionDTO }) {
  const m = meta(item)
  const ytId = youtubeId(item.url)
  const thumb = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : item.logo?.url ?? null

  return (
    <a
      href={item.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="mm-card"
      data-tip={m.label}
      title={item.title}
    >
      <div className="mm-card-thumb">
        {thumb && (
          <Image
            src={thumb}
            alt=""
            width={480}
            height={360}
            loading="lazy"
            sizes="240px"
            unoptimized
          />
        )}
        <span className="mm-card-tip" style={{ background: m.tipBg }}>
          {m.label}
        </span>
      </div>
      <div className="mm-card-info">
        <div className="mm-card-name">{item.title}</div>
      </div>
    </a>
  )
}

function MarqueeRow({
  items,
  reverse,
}: {
  items: PressMentionDTO[]
  reverse?: boolean
}) {
  if (items.length === 0) return null
  // Duplicate the list so the translateX(-50%) loop wraps seamlessly.
  return (
    <div className={`mm-row${reverse ? ' reverse' : ''}`} aria-hidden={false}>
      {items.map((item) => (
        <MarqueeCard key={`a-${item.id}`} item={item} />
      ))}
      {items.map((item) => (
        <MarqueeCard key={`b-${item.id}`} item={item} />
      ))}
    </div>
  )
}

export default function MediaMarquee({ section }: MediaMarqueeProps) {
  const zoneClass = getZoneClass(section.accent)
  const items = section.items ?? []

  // Split into two rows (top + reverse) as in the mockup.
  const mid = Math.ceil(items.length / 2)
  const topRow = items.slice(0, mid)
  const bottomRow = items.slice(mid)

  return (
    <section className={`mm-section ${zoneClass} ${accentRootClass(section.accent)}`}>
      {(section.eyebrow || section.heading || section.subheading) && (
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mm-subhead">
            {section.eyebrow && <div className="mm-eyebrow">{section.eyebrow}</div>}
            {section.heading && (
              <h2 className="mm-heading">
                {section.heading}
                {section.headingItalic && <em>{section.headingItalic}</em>}
              </h2>
            )}
            {section.subheading && <p className="mm-sub">{section.subheading}</p>}
          </div>
        </div>
      )}

      <div className="mm-container">
        <MarqueeRow items={topRow.length ? topRow : items} />
        <MarqueeRow items={bottomRow.length ? bottomRow : items} reverse />
      </div>

      <style>{`
        .mm-section {
          background: var(--color-paper);
          overflow: hidden;
        }
        .mm-subhead {
          text-align: center;
          margin-bottom: 70px;
        }
        .mm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: var(--color-gold-deep);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          justify-content: center;
        }
        .mm-eyebrow::before,
        .mm-eyebrow::after {
          content: '';
          width: 32px;
          height: 1px;
          background: var(--color-gold);
        }
        .mm-heading {
          font-family: var(--font-serif);
          font-size: 60px;
          font-weight: 500;
          color: var(--color-navy);
          line-height: 1.1;
          margin: 24px 0 18px;
          letter-spacing: -1px;
        }
        .mm-heading em {
          display: block;
          color: var(--color-gold-deep);
          font-style: italic;
        }
        .mm-sub {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--color-text-mid);
          font-size: 20px;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .mm-container {
          position: relative;
          overflow: hidden;
        }
        .mm-container::before,
        .mm-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }
        .mm-container::before {
          left: 0;
          background: linear-gradient(90deg, var(--color-paper) 0%, transparent 100%);
        }
        .mm-container::after {
          right: 0;
          background: linear-gradient(270deg, var(--color-paper) 0%, transparent 100%);
        }

        .mm-row {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: mm-marquee-left 90s linear infinite;
          margin-bottom: 16px;
        }
        .mm-row.reverse {
          animation: mm-marquee-right 90s linear infinite;
        }
        .mm-row:hover {
          animation-play-state: paused;
        }

        @keyframes mm-marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes mm-marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* ── compact card (universal .card + .compact) ── */
        .mm-card {
          flex-shrink: 0;
          width: 240px;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          border: 1px solid transparent;
        }
        .mm-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(20, 32, 46, 0.1);
          border-color: rgba(212, 175, 106, 0.12);
        }

        .mm-card-thumb {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-forest) 100%);
        }
        .mm-card-thumb::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(212, 175, 106, 0.15), transparent 60%);
          z-index: 0;
        }
        .mm-card-thumb::after {
          content: '▶';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border: 1.5px solid rgba(212, 175, 106, 0.45);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(212, 175, 106, 0.7);
          font-size: 14px;
          padding-left: 3px;
          z-index: 1;
          transition: all 0.3s;
        }
        .mm-card[data-tip='Publicație'] .mm-card-thumb::after {
          content: '◰';
          padding: 0;
          font-size: 20px;
        }
        .mm-card[data-tip='Radio'] .mm-card-thumb::after {
          content: '◉';
          padding: 0;
          font-size: 18px;
        }
        .mm-card[data-tip='Evenimente'] .mm-card-thumb::after {
          content: '✦';
          padding: 0;
          font-size: 20px;
        }
        .mm-card:hover .mm-card-thumb::after {
          border-color: var(--color-gold);
          color: var(--color-gold);
          background: rgba(20, 32, 46, 0.5);
        }
        .mm-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: relative;
          z-index: 2;
          color: transparent;
        }

        .mm-card-tip {
          position: absolute;
          top: 10px;
          left: 10px;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 100px;
          z-index: 3;
        }
        .mm-card[data-tip='Podcast'] .mm-card-tip {
          color: var(--color-gold);
        }

        .mm-card-info {
          padding: 14px 14px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .mm-card-name {
          font-family: var(--font-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-navy);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 968px) {
          .mm-heading {
            font-size: 42px;
          }
        }

        /* Honor reduced motion: stop the scroll, let users see static rows. */
        @media (prefers-reduced-motion: reduce) {
          .mm-row,
          .mm-row.reverse {
            animation: none;
            transform: none;
            flex-wrap: wrap;
            justify-content: center;
          }
          .mm-card {
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}
