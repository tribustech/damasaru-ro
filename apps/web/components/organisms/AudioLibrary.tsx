import Image from 'next/image'
import type { AudioLibraryDTO } from '@repo/types'
import { getZoneClass } from '../../lib/accent'

interface AudioLibraryProps {
  section: AudioLibraryDTO
}

/**
 * Homepage promo for the audiobook platform (platforma.damasaru.ro).
 * Based on the client-supplied `BibliotecaSection.tsx` (2026-11-10), with copy,
 * stats, CTAs and collection covers moved to the CMS so the monthly figures
 * (volumes, hours, price) can be updated without a deploy.
 * Links are outbound (UTM-tagged in the CMS) and intentionally open in the same tab.
 */
export function AudioLibrary({ section }: AudioLibraryProps) {
  const isLight = section.accent === 'paper' || section.accent === 'paper-warm'
  const titleId = `${section.anchorId ?? `audio-library-${section.id}`}-titlu`

  const titleCls = isLight ? 'text-[var(--color-navy)]' : 'text-white'
  const bodyCls = isLight ? 'text-[var(--color-text-mid)]' : 'text-[var(--color-text-light)]'

  return (
    <section
      className={getZoneClass(section.accent)}
      id={section.anchorId ?? undefined}
      aria-labelledby={titleId}
    >
      <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="max-w-xl">
            {section.eyebrow && (
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px w-12 bg-[var(--color-gold)]" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
                  {section.eyebrow}
                </span>
              </div>
            )}

            <h2
              id={titleId}
              className={`text-balance font-serif text-4xl font-medium leading-[1.1] lg:text-5xl ${titleCls}`}
            >
              {section.title}
              {section.titleItalic && (
                <>
                  {' '}
                  <span className="block italic text-[var(--color-gold)]">{section.titleItalic}</span>
                </>
              )}
            </h2>

            {section.body && (
              <p className={`mt-6 text-pretty text-lg leading-relaxed lg:text-xl ${bodyCls}`}>{section.body}</p>
            )}

            {section.stats.length > 0 && (
              <dl
                className="mt-10 grid border-y border-[var(--color-navy-line)] py-6"
                style={{ gridTemplateColumns: `repeat(${section.stats.length}, minmax(0, 1fr))` }}
              >
                {section.stats.map((s, i) => (
                  <div
                    key={s.id}
                    className={`flex flex-col-reverse justify-end ${i > 0 ? 'border-l border-[var(--color-navy-line)] pl-5' : 'pr-5'}`}
                  >
                    <dt className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      {s.label}
                    </dt>
                    <dd className="font-serif text-4xl font-medium leading-none text-[var(--color-gold)] [font-variant-numeric:lining-nums]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {section.note && (
              <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-soft)]">{section.note}</p>
            )}

            {section.ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {section.ctas.map((c) =>
                  c.variant === 'primary' ? (
                    <a key={c.href} href={c.href} className="btn btn-primary">
                      {c.label} <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <a key={c.href} href={c.href} className={`btn-secondary${c.goldDeep ? ' gold-deep' : ''}`}>
                      {c.label}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>

          {section.collections.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 sm:gap-6" aria-label="Colecțiile bibliotecii">
              {section.collections.map((c) => (
                <li key={c.id}>
                  <a
                    href={c.href}
                    className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--color-navy-line)] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] transition duration-500 group-hover:-translate-y-1 group-hover:border-[var(--color-gold)]/50">
                      {c.image && (
                        <Image
                          src={c.image.url}
                          alt={c.image.alt || `Colecția ${c.name}`}
                          fill
                          sizes="(min-width: 1024px) 340px, 50vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="mt-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                      <span className={`font-serif text-lg sm:text-xl ${titleCls}`}>{c.name}</span>
                      {c.meta && (
                        <span className="shrink-0 text-xs text-[var(--color-text-soft)] transition group-hover:text-[var(--color-gold)]">
                          {c.meta} <span aria-hidden="true">→</span>
                        </span>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
