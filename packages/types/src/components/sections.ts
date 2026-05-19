import type { StrapiMedia, CtaButton } from '../shared'

export interface SectionHero {
  __component: 'sections.hero'
  id: number
  title: string
  subtitle: string | null
  ctaButtons: CtaButton[]
}

export interface SectionTextBlock {
  __component: 'sections.text-block'
  id: number
  eyebrow: string | null
  heading: string
  body: string | null
}

export interface CardItem {
  id: number
  title: string
  text: string
  iconName: string | null
}

export interface SectionCardsGrid {
  __component: 'sections.cards-grid'
  id: number
  heading: string | null
  items: CardItem[]
}

export interface TestimonialItem {
  id: number
  quote: string
  author: string
  role: string | null
  photo: StrapiMedia | null
}

export interface SectionTestimonials {
  __component: 'sections.testimonials'
  id: number
  items: TestimonialItem[]
}

export interface SectionCtaBanner {
  __component: 'sections.cta-banner'
  id: number
  heading: string
  subtext: string | null
  buttonLabel: string
  buttonHref: string
}

export interface SectionFeaturedList {
  __component: 'sections.featured-list'
  id: number
  heading: string | null
  relation: 'articles' | 'events'
}

export type Section =
  | SectionHero
  | SectionTextBlock
  | SectionCardsGrid
  | SectionTestimonials
  | SectionCtaBanner
  | SectionFeaturedList
