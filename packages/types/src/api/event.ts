import type { StrapiBase, StrapiMedia } from '../shared'

export type EventStatus = 'viitor' | 'trecut'

export interface Event extends StrapiBase {
  title: string
  subtitle: string | null
  slug: string
  description: string | null
  longDescription: string | null
  date: string | null
  endDate: string | null
  time: string | null
  location: string | null
  venue: string | null
  address: string | null
  price: string | null
  spots: string | null
  ticketsUrl: string | null
  organizer: string | null
  status: EventStatus
  featured: boolean
  coverImage: StrapiMedia | null
  aftermovieUrl: string | null
  jsonLd: Record<string, unknown> | null
}
