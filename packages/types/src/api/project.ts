import type { StrapiBase, StrapiMedia } from '../shared'
import type { SectionAccent } from '../components/sections'

export type ProjectStatus = 'live' | 'upcoming' | 'archived'

export interface Project extends StrapiBase {
  name: string
  slug: string
  tagline: string | null
  description: string | null
  manifesto: string | null
  heroImage: StrapiMedia | null
  galleryImages: StrapiMedia[] | null
  externalUrl: string | null
  status: ProjectStatus
  accent: SectionAccent
  order: number
}
