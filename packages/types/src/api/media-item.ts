import type { StrapiBase, StrapiMedia } from '../shared'

export type MediaItemType = 'video' | 'press' | 'podcast'

export interface MediaItem extends StrapiBase {
  type: MediaItemType
  title: string
  source: string | null
  url: string | null
  date: string | null
  thumbnail: StrapiMedia | null
}
