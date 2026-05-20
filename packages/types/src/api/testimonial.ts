import type { StrapiBase, StrapiMedia } from '../shared'

export type TestimonialSource = 'book' | 'event' | 'podcast' | 'workshop' | 'general'

export interface Testimonial extends StrapiBase {
  quote: string
  author: string
  role: string | null
  photo: StrapiMedia | null
  source: TestimonialSource
  rating: number | null
  featured: boolean
}
