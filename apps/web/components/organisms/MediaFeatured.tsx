import Image from 'next/image'
import type { MediaFeaturedDTO, PressMentionDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { accentRootClass, getZoneClass } from '@/lib/accent'

interface MediaFeaturedProps {
  section: MediaFeaturedDTO
  locale: string
}

/** Type badge label + bg per press-mention type. Podcast = navy (#14202E) per mockup. */
const TYPE_BADGE: Record<string, { label: string; bg: string }> = {
  tv: { label: 'TV', bg: 'var(--color-forest)' },
  podcast: { label: 'PODCAST', bg: 'var(--color-navy)' },
  publicatie: { label: 'PUBLICAȚIE', bg: 'var(--color-gold-deep)' },
  radio: { label: 'RADIO', bg: 'var(--color-navy-soft)' },
  evenimente: { label: 'EVENIMENTE', bg: 'var(--color-forest-bright)' },
}

/** Extract a YouTube video id from watch?v= / youtu.be/ / shorts/ / embed/ urls. */
function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return v
      const m = u.pathname.match(/^\/(?:shorts|embed)\/([^/?]+)/)
      if (m) return m[1]
    }
    return null
  } catch {
    return null
  }
}

export default function MediaFeatured({ section, locale: _locale }: MediaFeaturedProps) {
  const zoneClass = getZoneClass(section.accent)

  // Only YouTube-backed mentions render in the featured grid; non-YouTube urls are excluded.
  const cards = (section.items ?? [])
    .map((item) => ({ item, id: youtubeId(item.url) }))
    .filter((c): c is { item: PressMentionDTO; id: string } => c.id !== null)

  if (cards.length === 0) return null

  return (
    <section className={`${zoneClass} ${accentRootClass(section.accent)} featured-section`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 max-w-3xl">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading ?? ''}
            headingItalic={section.headingItalic}
            lead={section.subheading}
            accent={section.accent}
          />
        </div>

        <div className="featured-grid">
          {cards.map(({ item, id }) => {
            const badge = (item.type && TYPE_BADGE[item.type]) || null
            const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card featured-card"
                data-tip={badge?.label}
              >
                <div className="card-thumb">
                  <Image
                    src={thumb}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    unoptimized
                  />
                  <div className="card-overlay" aria-hidden />
                  {badge && (
                    <span className="card-tip" style={{ background: badge.bg }}>
                      {badge.label}
                    </span>
                  )}
                </div>
                <div className="card-info">
                  <div className="card-name">{item.title}</div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      <style>{`
        .featured-section .featured-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .featured-section .card {
          width: 100%;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          border: 1px solid transparent;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .featured-section .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(20, 32, 46, 0.1);
          border-color: rgba(212, 175, 106, 0.12);
        }
        .featured-section .card-thumb {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-forest) 100%);
        }
        .featured-section .card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: relative;
          z-index: 1;
          color: transparent;
          filter: saturate(0.35) contrast(0.92) brightness(0.85);
          transition: filter 0.45s ease;
        }
        .featured-section .featured-card:hover .card-thumb img {
          filter: saturate(1.1) contrast(1) brightness(1);
        }
        .featured-section .card-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            160deg,
            rgba(20, 32, 46, 0.55) 0%,
            rgba(45, 77, 67, 0.42) 60%,
            rgba(20, 32, 46, 0.55) 100%
          );
          mix-blend-mode: multiply;
          transition: opacity 0.45s ease;
        }
        .featured-section .featured-card:hover .card-overlay {
          opacity: 0;
        }
        .featured-section .card-tip {
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
        .featured-section .card-info {
          padding: 14px 14px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .featured-section .card-name {
          font-family: var(--font-serif);
          font-size: 16px;
          font-weight: 500;
          color: var(--color-navy);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 1024px) {
          .featured-section .featured-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .featured-section .featured-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .featured-section .card,
          .featured-section .card-thumb img,
          .featured-section .card-overlay {
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}
