import type { EventDetailDTO } from '@repo/types'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { Eyebrow } from '../atoms/Eyebrow'

interface EventDetailProps {
  event: EventDetailDTO
  locale: string
}

export function EventDetail({ event }: EventDetailProps) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Eyebrow label={event.status === 'viitor' ? 'Eveniment viitor' : 'Eveniment trecut'} />
        <h1
          className="text-5xl font-serif font-light leading-tight mb-6"
          style={{ color: '#2D241E' }}
        >
          {event.title}
        </h1>
        {event.subtitle && (
          <p className="text-xl mb-6" style={{ color: '#6B5F54' }}>
            {event.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {event.date && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <Calendar size={18} style={{ color: '#B8866F' }} />
              <span>{event.date}</span>
            </div>
          )}
          {event.city && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <MapPin size={18} style={{ color: '#B8866F' }} />
              <span>{event.venue ? `${event.venue}, ` : ''}{event.city}</span>
            </div>
          )}
        </div>
      </div>

      {event.cover && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-12">
          <Image
            src={event.cover.url}
            alt={event.cover.alt ?? event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {event.excerpt && (
        <p className="text-lg leading-relaxed" style={{ color: '#6B5F54' }}>
          {event.excerpt}
        </p>
      )}

      {event.body && (
        <div
          className="prose prose-lg max-w-none mt-8"
          style={{ color: '#2D241E' }}
          dangerouslySetInnerHTML={{ __html: event.body }}
        />
      )}
    </article>
  )
}
