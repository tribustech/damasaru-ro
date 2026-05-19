import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import type { Event } from '@repo/types'
import { Button } from '../atoms/Button'

interface EventCardProps {
  event: Event
  locale: string
  registerLabel: string
}

export function EventCard({ event, locale, registerLabel }: EventCardProps) {
  const href = `/${locale}/evenimente/${event.slug}`
  const imageUrl = event.coverImage?.url ?? null

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(45,36,30,0.08)] hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={event.coverImage?.alternativeText ?? event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-serif font-light mb-3 leading-snug" style={{ color: '#2D241E' }}>
          {event.title}
        </h3>
        <div className="space-y-2 mb-4">
          {event.date && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5F54' }}>
              <Calendar size={14} style={{ color: '#B8866F' }} />
              {event.date}{event.time ? ` · ${event.time}` : ''}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5F54' }}>
              <MapPin size={14} style={{ color: '#B8866F' }} />
              {event.location}
            </div>
          )}
        </div>
        {event.price && (
          <p className="text-lg font-medium mb-4" style={{ color: '#2D241E' }}>
            {event.price}
          </p>
        )}
        <Button href={href} variant="primary" size="sm" className="mt-auto">
          {registerLabel}
        </Button>
      </div>
    </article>
  )
}
