'use client'

import { useState } from 'react'
import type { EventDTO } from '@repo/types'
import { EventCard } from '../molecules/EventCard'
import { Tag } from '../atoms/Tag'

interface EventsListProps {
  events: EventDTO[]
  locale: string
  registerLabel: string
  allLabel: string
  upcomingLabel: string
  pastLabel: string
  noEventsLabel: string
}

export function EventsList({
  events,
  locale,
  registerLabel,
  allLabel,
  upcomingLabel,
  pastLabel,
  noEventsLabel,
}: EventsListProps) {
  const [filter, setFilter] = useState(upcomingLabel)

  const filters = [upcomingLabel, pastLabel, allLabel]

  const filtered =
    filter === allLabel
      ? events
      : filter === upcomingLabel
        ? events.filter((e) => e.status === 'viitor')
        : events.filter((e) => e.status === 'trecut')

  return (
    <div>
      <div className="flex gap-3 mb-10">
        {filters.map((f) => (
          <Tag key={f} label={f} active={f === filter} onClick={() => setFilter(f)} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: '#6B5F54' }}>{noEventsLabel}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} registerLabel={registerLabel} />
          ))}
        </div>
      )}
    </div>
  )
}
