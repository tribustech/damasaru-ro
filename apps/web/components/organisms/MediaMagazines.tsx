import Image from 'next/image'
import type { MediaMagazinesDTO, PressMentionDTO } from '@repo/types'
import { getZoneClass, accentRootClass, getAccent } from '@/lib/accent'

interface MediaMagazinesProps {
  section: MediaMagazinesDTO
  locale: string
}

/**
 * Z4b — "Pe prima pagină." Print/magazine appearances on a Z4b paper field.
 * Server component. Renders a 5-col grid of CSS-rendered magazine "covers"
 * (forest masthead bar + Cormorant outlet name + gold rule) per the mockup
 * .magazines-section. If a press-mention has a real coverImage it is shown
 * instead of the styled gradient cover.
 */
export default function MediaMagazines({ section }: MediaMagazinesProps) {
  const a = getAccent(section.accent)
  const items = (section.items ?? []) as PressMentionDTO[]
  if (items.length === 0) return null

  return (
    <section
      className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)} magazines-section`}
      style={{
        background: 'var(--color-paper)',
        padding: '90px 0 100px',
        borderTop: '1px solid var(--color-line)',
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="section-subhead mb-12 max-w-3xl">
          {section.eyebrow && (
            <div
              className={`text-xs uppercase tracking-[0.25em] font-semibold mb-4 ${a.eyebrow}`}
            >
              {section.eyebrow}
            </div>
          )}
          {section.heading && (
            <h2
              className="font-serif font-medium leading-[1.05] tracking-[-1px] text-[var(--color-navy)]"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)' }}
            >
              {section.heading}
              {section.headingItalic && (
                <>
                  {' '}
                  <em className={a.italic}>{section.headingItalic}</em>
                </>
              )}
            </h2>
          )}
          {section.subheading && (
            <p className="font-serif italic text-[19px] leading-[1.55] text-[var(--color-text-mid)] mt-5">
              {section.subheading}
            </p>
          )}
        </div>

        <div className="magazines-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {items.map((item) => (
            <MagazineCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MagazineCard({ item }: { item: PressMentionDTO }) {
  const cover = item.cover ?? null
  const isForbes = /forbes/i.test(item.outlet)
  const dateLabel = formatYear(item.date)
  const meta = [dateLabel, item.title].filter(Boolean).join(' · ')

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="magazine-card group flex flex-col no-underline text-inherit cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
    >
      <div
        className="magazine-cover relative flex flex-col items-center justify-center overflow-hidden text-center transition-all duration-300 group-hover:[border-color:var(--color-gold)]"
        style={{
          aspectRatio: '0.72 / 1',
          background: cover
            ? undefined
            : 'linear-gradient(170deg,#fff 0%,#F5F2EC 100%)',
          border: '1px solid var(--color-line)',
          borderRadius: '4px',
          padding: '24px 16px',
          boxShadow:
            '0 4px 12px rgba(20,32,46,0.08),-2px 0 0 rgba(0,0,0,0.05) inset',
        }}
      >
        {/* Forest masthead bar — mockup .magazine-cover::before */}
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-2 z-[2]"
          style={{ background: 'var(--color-forest)' }}
        />

        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || item.outlet}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        ) : (
          <>
            <div
              className="magazine-name-display font-serif font-semibold text-[var(--color-navy)] leading-[0.95]"
              style={
                isForbes
                  ? {
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 700,
                      fontSize: '36px',
                      letterSpacing: '-1px',
                      marginBottom: '8px',
                    }
                  : {
                      fontSize: '36px',
                      letterSpacing: '-1px',
                      marginBottom: '8px',
                    }
              }
            >
              {item.outlet}
            </div>
            {item.excerpt && (
              <div className="magazine-tagline font-serif italic text-[12px] text-[var(--color-text-mid)]">
                {item.excerpt}
              </div>
            )}
          </>
        )}

        {/* Gold rule (40% width) — mockup .magazine-cover::after */}
        <span
          aria-hidden
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/5 h-px z-[2]"
          style={{ background: 'var(--color-gold)' }}
        />
      </div>

      <div className="magazine-info pt-4 px-1">
        <div className="magazine-title font-serif font-medium text-[17px] text-[var(--color-navy)] mb-1">
          {item.title}
        </div>
        {meta && (
          <div className="magazine-meta text-[11px] tracking-[0.3px] text-[var(--color-text-mid)]">
            {item.outlet}
            {dateLabel ? ` · ${dateLabel}` : ''}
          </div>
        )}
      </div>
    </a>
  )
}

function formatYear(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return String(d.getFullYear())
}
