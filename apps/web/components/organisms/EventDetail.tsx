import type { Event } from '@repo/types'
import Image from 'next/image'
import { Calendar, MapPin, Users, Ticket } from 'lucide-react'
import { Eyebrow } from '../atoms/Eyebrow'
import { Button } from '../atoms/Button'

interface EventDetailProps {
  event: Event
  registerLabel: string
}

export function EventDetail({ event, registerLabel }: EventDetailProps) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {event.date && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <Calendar size={18} style={{ color: '#B8866F' }} />
              <span>{event.date}{event.time ? ` · ${event.time}` : ''}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <MapPin size={18} style={{ color: '#B8866F' }} />
              <span>{event.venue ? `${event.venue}, ` : ''}{event.location}</span>
            </div>
          )}
          {event.price && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <Ticket size={18} style={{ color: '#B8866F' }} />
              <span>{event.price}</span>
            </div>
          )}
          {event.spots && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <Users size={18} style={{ color: '#B8866F' }} />
              <span>{event.spots}</span>
            </div>
          )}
        </div>

        {event.status === 'viitor' && (
          <Button href="#register" variant="primary">
            {registerLabel}
          </Button>
        )}
      </div>

      {event.coverImage && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-12">
          <Image
            src={event.coverImage.url}
            alt={event.coverImage.alternativeText ?? event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {event.description && (
        <p className="text-lg leading-relaxed" style={{ color: '#6B5F54' }}>
          {event.description}
        </p>
      )}
    </article>
  )
}
