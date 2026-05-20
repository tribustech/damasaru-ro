import type { StrapiBase, StrapiMedia } from '../shared'

export interface PodcastGuest {
  name: string
  role?: string
  link?: string
}

export interface PodcastEpisode extends StrapiBase {
  number: number
  title: string
  slug: string
  description: string | null
  showNotes: string | null
  audioUrl: string | null
  videoUrl: string | null
  duration: string | null
  season: number
  publishedAt2: string | null
  coverImage: StrapiMedia | null
  guests: PodcastGuest[] | null
  featured: boolean
}
