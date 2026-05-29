import type { MediaDTO } from './page'

export interface ArticleDTO {
  id: number
  documentId: string
  slug: string
  title: string
  excerpt: string | null
  date: string
  readTime: string | null
  cover: MediaDTO | null
  author: string | null
  tags: string[]
}

export interface EventDTO {
  id: number
  documentId: string
  slug: string
  title: string
  subtitle: string | null
  date: string
  status: 'viitor' | 'trecut'
  city: string | null
  venue: string | null
  cover: MediaDTO | null
  excerpt: string | null
}

export type PodcastEpisodeCategoryKind =
  | 'identity'
  | 'ai'
  | 'comm'
  | 'business'
  | 'spirit'
  | 'community'

export type PodcastEpisodeStatus = 'live' | 'upcoming'

export interface PodcastEpisodeGuestDTO {
  name: string
  role: string | null
}

export interface PodcastEpisodeDTO {
  id: number
  documentId: string
  slug: string
  number: number
  title: string
  description: string | null
  date: string | null
  duration: string | null
  cover: MediaDTO | null
  audioUrl: string | null
  spotifyUrl: string | null
  youtubeUrl: string | null
  category: string | null
  categoryKind: PodcastEpisodeCategoryKind | null
  status: PodcastEpisodeStatus
  guests: PodcastEpisodeGuestDTO[]
  featured: boolean
}

export interface ProjectDTO {
  id: number
  documentId: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  cover: MediaDTO | null
  url: string | null
  order: number
}

export interface ProductDTO {
  id: number
  documentId: string
  slug: string
  name: string
  price: string | null
  availability: string | null
  format: string | null
  description: string | null
  cover: MediaDTO | null
  url: string | null
  order: number
}

export interface TestimonialDTO {
  id: number
  documentId: string
  quote: string
  author: string
  role: string | null
  avatar: MediaDTO | null
}

export interface PressMentionDTO {
  id: number
  documentId: string
  outlet: string
  title: string
  date: string
  url: string
  type: string | null
  logo: MediaDTO | null
}

export interface MediaItemDTO {
  id: number
  documentId: string
  title: string
  kind: string
  date: string | null
  url: string
  thumbnail: MediaDTO | null
  description: string | null
}
