import type { StrapiBase, StrapiMedia } from '../shared'

export interface Article extends StrapiBase {
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  date: string | null
  category: string | null
  readTime: string | null
  featured: boolean
  coverImage: StrapiMedia | null
}
