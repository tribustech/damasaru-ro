import type { StrapiBase, StrapiMedia } from '../shared'

export type EventStatus = 'viitor' | 'trecut'

export interface Event extends StrapiBase {
  title: string
  slug: string
  description: string | null
  date: string | null
  time: string | null
  location: string | null
  venue: string | null
  price: string | null
  spots: string | null
  status: EventStatus
  coverImage: StrapiMedia | null
}
