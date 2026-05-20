import type { StrapiBase, StrapiMedia } from '../shared'

export type PressMentionType = 'article' | 'interview' | 'magazine' | 'tv' | 'radio' | 'podcast'

export interface PressMention extends StrapiBase {
  title: string
  outlet: string
  url: string | null
  date: string | null
  logoImage: StrapiMedia | null
  coverImage: StrapiMedia | null
  type: PressMentionType
  excerpt: string | null
  featured: boolean
}
