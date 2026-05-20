import Image from 'next/image'
import Link from 'next/link'
import type { EventFeatureDTO } from '@repo/types'
import { Eyebrow } from '../atoms/Eyebrow'
import { Button } from '../atoms/Button'
import { getAccent, accentRootClass } from '@/lib/accent'

interface EventFeatureProps {
  section: EventFeatureDTO
  locale: string
}

export function EventFeature({ section, locale }: EventFeatureProps) {
  const a = getAccent(section.accent)
  const event = section.event
  if (!event) return null
  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-24`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {section.eyebrow && <Eyebrow label={section.eyebrow} accent={section.accent} align="center" />}
        <div className={`mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl overflow-hidden border ${a.border}`}>
          {event.cover && (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={event.cover.url.startsWith('http') ? event.cover.url : `${process.env.STRAPI_URL ?? 'http://localhost:1337'}${event.cover.url}`}
                alt={event.cover.alt ?? event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-8 lg:p-12">
            <h2 className={`text-3xl lg:text-4xl font-serif font-medium leading-tight ${a.text}`}>
              {event.title}
            </h2>
            {event.subtitle && (
              <p className={`mt-2 text-lg ${a.italic}`}>{event.subtitle}</p>
            )}
            <dl className={`mt-6 space-y-2 text-sm ${a.textMuted}`}>
              {event.date && (
                <div>
                  <dt className="inline font-semibold">Data: </dt>
                  <dd className="inline">{event.date}</dd>
                </div>
              )}
              {event.city && (
                <div>
                  <dt className="inline font-semibold">Loc: </dt>
                  <dd className="inline">{event.city}{event.venue ? ` · ${event.venue}` : ''}</dd>
                </div>
              )}
            </dl>
            {event.excerpt && (
              <p className={`mt-6 text-base leading-relaxed ${a.textMuted}`}>{event.excerpt}</p>
            )}
            <div className="mt-8 flex gap-3">
              {section.cta && (
                <Button href={section.cta.href} variant={a.isDark ? 'ghost-light' : section.cta.variant}>
                  {section.cta.label}
                </Button>
              )}
              <Link
                href={`/${locale}/evenimente/${event.slug}`}
                className={`inline-flex items-center px-6 py-3 rounded-full border ${a.border} ${a.text} hover:border-[var(--color-gold)] transition-colors`}
              >
                Detalii →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
