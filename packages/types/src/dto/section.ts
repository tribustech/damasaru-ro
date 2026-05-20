import type {
  MediaDTO,
  CtaButtonDTO,
  AccentDTO,
} from './page'
import type {
  ArticleDTO,
  EventDTO,
  PodcastEpisodeDTO,
  ProjectDTO,
  ProductDTO,
  TestimonialDTO,
  PressMentionDTO,
} from './entity'

interface SectionBase {
  id: number
}

export interface HeroDTO extends SectionBase {
  __component: 'sections.hero'
  eyebrow: string | null
  title: string
  titleItalic: string | null
  subtitle: string | null
  accent: AccentDTO
  media: MediaDTO | null
  mediaPosition: 'right' | 'left' | 'below' | 'none'
  ctaButtons: CtaButtonDTO[]
  statsStrip: StatsStripInline | null
}

interface StatsStripInline {
  items: { id: number; value: string; label: string; caption: string | null }[]
}

export interface TextBlockDTO extends SectionBase {
  __component: 'sections.text-block'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  body: string
  accent: AccentDTO
}

export interface CardsGridDTO extends SectionBase {
  __component: 'sections.cards-grid'
  eyebrow: string | null
  heading: string | null
  accent: AccentDTO
  items: {
    id: number
    title: string
    body: string | null
    image: MediaDTO | null
    cta: CtaButtonDTO | null
  }[]
}

export interface TestimonialsDTO extends SectionBase {
  __component: 'sections.testimonials'
  eyebrow: string | null
  heading: string | null
  accent: AccentDTO
  filterBy: Record<string, unknown> | null
  limit: number
  items: TestimonialDTO[]
}

export interface CtaBannerDTO extends SectionBase {
  __component: 'sections.cta-banner'
  heading: string
  subheading: string | null
  accent: AccentDTO
  cta: CtaButtonDTO | null
}

type FeaturedListItems =
  | { relation: 'articles'; items: ArticleDTO[] }
  | { relation: 'events'; items: EventDTO[] }
  | { relation: 'podcast-episodes'; items: PodcastEpisodeDTO[] }
  | { relation: 'projects'; items: ProjectDTO[] }
  | { relation: 'products'; items: ProductDTO[] }
  | { relation: 'testimonials'; items: TestimonialDTO[] }
  | { relation: 'press-mentions'; items: PressMentionDTO[] }

export type FeaturedListDTO = SectionBase & {
  __component: 'sections.featured-list'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  subheading: string | null
  accent: AccentDTO
  layout: 'grid' | 'row' | 'marquee' | 'feature' | 'featured-with-list' | 'featured-with-grid' | 'list-rows' | 'event-banner'
  limit: number
  filterBy: Record<string, unknown> | null
  seeAllHref: string | null
  seeAllLabel: string | null
} & FeaturedListItems

export interface StatsStripDTO extends SectionBase {
  __component: 'sections.stats-strip'
  accent: AccentDTO
  items: { id: number; value: string; label: string; caption: string | null }[]
}

export interface QuoteLargeDTO extends SectionBase {
  __component: 'sections.quote-large'
  quote: string
  author: string | null
  accent: AccentDTO
}

export interface ImageTextSplitDTO extends SectionBase {
  __component: 'sections.image-text-split'
  eyebrow: string | null
  heading: string | null
  body: string
  accent: AccentDTO
  image: MediaDTO | null
  imageSide: 'left' | 'right'
  cta: CtaButtonDTO | null
}

export interface NewsletterFormDTO extends SectionBase {
  __component: 'sections.newsletter-form'
  eyebrow: string | null
  heading: string
  body: string | null
  accent: AccentDTO
  source: string
  submitLabel: string
}

export interface FaqAccordionDTO extends SectionBase {
  __component: 'sections.faq-accordion'
  eyebrow: string | null
  heading: string | null
  accent: AccentDTO
  items: { id: number; question: string; answer: string }[]
}

export interface LogoWallDTO extends SectionBase {
  __component: 'sections.logo-wall'
  heading: string | null
  accent: AccentDTO
  items: { id: number; name: string; logo: MediaDTO | null; url: string | null }[]
}

export interface DownloadsListDTO extends SectionBase {
  __component: 'sections.downloads-list'
  heading: string | null
  accent: AccentDTO
  items: { id: number; label: string; file: MediaDTO | null }[]
}

export interface VideoFeatureDTO extends SectionBase {
  __component: 'sections.video-feature'
  heading: string | null
  videoUrl: string
  caption: string | null
  accent: AccentDTO
}

export interface CredentialsGridDTO extends SectionBase {
  __component: 'sections.credentials-grid'
  heading: string | null
  accent: AccentDTO
  groups: { id: number; title: string; items: { id: number; label: string; sub: string | null }[] }[]
}

export interface EventFeatureDTO extends SectionBase {
  __component: 'sections.event-feature'
  eyebrow: string | null
  accent: AccentDTO
  event: EventDTO | null
  cta: CtaButtonDTO | null
}

export interface ContactFormDTO extends SectionBase {
  __component: 'sections.contact-form'
  heading: string | null
  body: string | null
  accent: AccentDTO
  submitLabel: string
  successMessage: string
}

export type SectionDTO =
  | HeroDTO
  | TextBlockDTO
  | CardsGridDTO
  | TestimonialsDTO
  | CtaBannerDTO
  | FeaturedListDTO
  | StatsStripDTO
  | QuoteLargeDTO
  | ImageTextSplitDTO
  | NewsletterFormDTO
  | FaqAccordionDTO
  | LogoWallDTO
  | DownloadsListDTO
  | VideoFeatureDTO
  | CredentialsGridDTO
  | EventFeatureDTO
  | ContactFormDTO
