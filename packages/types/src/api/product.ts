import type { StrapiBase, StrapiMedia } from '../shared'

export type ProductFormat = 'hardcover' | 'ebook' | 'audiobook' | 'event' | 'course' | 'bundle'
export type ProductAvailability = 'available' | 'waitlist' | 'sold_out' | 'upcoming'

export interface Product extends StrapiBase {
  title: string
  slug: string
  format: ProductFormat
  price: string | null
  currency: string
  image: StrapiMedia | null
  buyUrl: string | null
  description: string | null
  longDescription: string | null
  availability: ProductAvailability
  featured: boolean
  order: number
}
