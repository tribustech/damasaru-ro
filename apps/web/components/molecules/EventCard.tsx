import Image from 'next/image'
import Link from 'next/link'
import type { EventDTO, SectionAccent } from '@repo/types'
import { Button } from '../atoms/Button'
import { getAccent } from '@/lib/accent'

interface EventCardProps {
  event: EventDTO
  locale: string
  registerLabel?: string
  accent?: SectionAccent | null
  /** When false, render as a static archive card — no links, no CTA. */
  interactive?: boolean
}

export function EventCard({
  event,
  locale,
  registerLabel = 'Detalii',
  accent,
  interactive = true,
}: EventCardProps) {
  const a = getAccent(accent)
  const href = `/${locale}/evenimente/${event.slug}`
  const imageUrl = event.cover?.url ?? null

  const cover = imageUrl ? (
    <div className="relative aspect-[16/9] overflow-hidden">
      <Image
        src={imageUrl}
        alt={event.cover?.alt ?? event.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover${interactive ? ' group-hover:scale-105 transition-transform duration-500' : ''}`}
      />
      {event.date && (
        <span className="absolute top-4 left-4 inline-block px-3 py-1.5 text-xs bg-white/95 rounded-full text-[var(--color-navy)]">
          {event.date}
        </span>
      )}
    </div>
  ) : null

  return (
    <article
      className={`${interactive ? 'group ' : ''}flex flex-col rounded-3xl overflow-hidden border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'}`}
    >
      {cover && (interactive ? <Link href={href}>{cover}</Link> : cover)}
      <div className="flex flex-col flex-1 p-6">
        {interactive ? (
          <Link href={href}>
            <h3 className={`text-xl font-serif font-medium mb-2 leading-snug ${a.text}`}>{event.title}</h3>
          </Link>
        ) : (
          <h3 className={`text-xl font-serif font-medium mb-2 leading-snug ${a.text}`}>{event.title}</h3>
        )}
        {event.subtitle && <p className={`text-sm ${a.italic} mb-3`}>{event.subtitle}</p>}
        {event.city && (
          <p className={`text-sm mb-3 ${a.textMuted}`}>{event.city}{event.venue ? ` · ${event.venue}` : ''}</p>
        )}
        {event.excerpt && (
          <p className={`text-sm mb-4 flex-1 leading-relaxed ${a.textMuted}`}>{event.excerpt}</p>
        )}
        {interactive && (
          <Button href={href} variant="primary" size="sm" className="mt-auto self-start">
            {registerLabel}
          </Button>
        )}
      </div>
    </article>
  )
}
