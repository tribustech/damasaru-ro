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
  body: string | null
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
  align: 'left' | 'center'
  cta: CtaButtonDTO | null
}

export type CardsGridVariant = 'default' | 'convictions' | 'cta-cards' | 'chapters' | 'products' | 'platforms'

export interface CardsGridMetaItemDTO {
  icon: string | null
  label: string
}

export interface CardsGridItemDTO {
  id: number
  title: string
  text: string | null
  image: MediaDTO | null
  tag: string | null
  href: string | null
  /** products variant only — drives the per-format image treatment + tag color */
  format?: 'hardcover' | 'ebook' | 'audiobook' | null
  eyebrow?: string | null
  price?: string | null
  /** waitlist placeholder shown instead of `price`; presence (with no `price`) = waitlist mode */
  priceText?: string | null
  fineprint?: string | null
  ctaLabel?: string | null
  metaItems?: CardsGridMetaItemDTO[]
}

export interface CardsGridDTO extends SectionBase {
  __component: 'sections.cards-grid'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  lead: string | null
  accent: AccentDTO
  columns: '2' | '3' | '4'
  variant: CardsGridVariant
  items: CardsGridItemDTO[]
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
  eyebrow: string | null
  heading: string
  headingItalic: string | null
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

export interface ProjectMiniDTO {
  id: number | string
  name: string
  tag: string | null
  href: string | null
}

export interface ExternalLinkDTO {
  id: number | string
  label: string
  href: string
  muted: boolean
}

export interface ImageTextSplitDTO extends SectionBase {
  __component: 'sections.image-text-split'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  body: string
  accent: AccentDTO
  image: MediaDTO | null
  imageCaption: string | null
  imageSide: 'left' | 'right'
  cta: CtaButtonDTO | null
  projectsRow: ProjectMiniDTO[]
  externalLinks: ExternalLinkDTO[]
}

export interface NewsletterFormDTO extends SectionBase {
  __component: 'sections.newsletter-form'
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  body: string | null
  accent: AccentDTO
  source: string
  submitLabel: string
  placeholder: string
  fineprint: string | null
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
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  badge: string | null
  meta: string | null
  body: string | null
  videoUrl: string | null
  videoFile: MediaDTO | null
  posterImage: MediaDTO | null
  orientation: 'landscape' | 'portrait'
  posterBadgeLabel: string | null
  posterBadgeQuote: string | null
  posterBadgeImage: MediaDTO | null
  ctaButton: CtaButtonDTO | null
  accent: AccentDTO
}

export interface CredentialsGridDTO extends SectionBase {
  __component: 'sections.credentials-grid'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  lead: string | null
  accent: AccentDTO
  groups: {
    id: number
    title: string
    items: { id: number; label: string; sub: string | null }[]
    image: MediaDTO | null
    imageCaption: string | null
  }[]
}

export interface EventFeatureDTO extends SectionBase {
  __component: 'sections.event-feature'
  eyebrow: string | null
  accent: AccentDTO
  event: EventDTO | null
  cta: CtaButtonDTO | null
}

export interface FormOptionDTO {
  id: number
  label: string
  value: string
  routingEmail: string | null
}

export interface ContactFormDTO extends SectionBase {
  __component: 'sections.contact-form'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  body: string | null
  expectationNote: string | null
  nameLabel: string
  namePlaceholder: string | null
  emailLabel: string
  emailPlaceholder: string | null
  phoneLabel: string | null
  phonePlaceholder: string | null
  organizationLabel: string | null
  organizationPlaceholder: string | null
  organizationOptional: boolean
  subjectLabel: string | null
  subjectPlaceholder: string | null
  subjectOptions: FormOptionDTO[]
  eventTypeLabel: string | null
  eventTypePlaceholder: string | null
  eventTypeOptions: FormOptionDTO[]
  audienceSizeLabel: string | null
  audienceSizePlaceholder: string | null
  audienceSizeOptions: FormOptionDTO[]
  budgetLabel: string | null
  budgetPlaceholder: string | null
  budgetOptions: FormOptionDTO[]
  dateEstimateLabel: string | null
  dateEstimatePlaceholder: string | null
  optionalSectionLabel: string | null
  messageLabel: string
  messagePlaceholder: string | null
  consentText: string | null
  submitLabel: string
  successMessage: string
  fineprint: string | null
  accent: AccentDTO
}

export interface ProiecteHeroDTO extends SectionBase {
  __component: 'sections.proiecte-hero'
  eyebrow: string | null
  title: string
  titleItalic: string | null
  subtitle: string | null
  body: string | null
  accent: AccentDTO
  anchors: CtaButtonDTO[]
}

export interface AsocBoxDTO {
  statusText: string | null
  title: string | null
  titleItalic: string | null
  body: string | null
}

export interface ProjectFeatureDTO extends SectionBase {
  __component: 'sections.project-feature'
  anchorId: string | null
  eyebrow: string | null
  wordmark: string
  wordmarkItalic: string | null
  wordmarkLine2: string | null
  wordmarkLine3: string | null
  since: string | null
  tagline: string | null
  body: string
  layout: 'text-left' | 'text-right' | 'centered'
  accent: AccentDTO
  logo: MediaDTO | null
  image: MediaDTO | null
  imageCaption: string | null
  stats: { id: number; value: string; label: string }[]
  ctas: CtaButtonDTO[]
  asocBox: AsocBoxDTO | null
}

export interface PressWallDTO extends SectionBase {
  __component: 'sections.press-wall'
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  subtitle: string | null
  accent: AccentDTO
  expandLabel: string | null
  collapseLabel: string | null
  secondaryLabel: string | null
  items: { id: number; brandKey: string; info: string | null; title: string | null; url: string | null }[]
  secondaryItems: { id: number; label: string; url: string | null }[]
}

export interface MediaHeroDTO extends SectionBase {
  __component: 'sections.media-hero'
  eyebrow: string | null
  title: string
  titleItalic: string | null
  subtitle: string | null
  body: string | null
  badgeLabel: string | null
  media: MediaDTO | null
  accent: AccentDTO
}

export interface MediaStatStripDTO extends SectionBase {
  __component: 'sections.media-stat-strip'
  accent: AccentDTO
  items: { id: number; value: string; label: string; caption: string | null }[]
}

export interface MediaLogoWallDTO extends SectionBase {
  __component: 'sections.media-logo-wall'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  lead: string | null
  accent: AccentDTO
  items: {
    id: number
    svgKey: string
    outletName: string
    count: string | null
    description: string | null
    href: string | null
  }[]
}

export interface MediaFeaturedDTO extends SectionBase {
  __component: 'sections.media-featured'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  subheading: string | null
  accent: AccentDTO
  relation: 'press-mentions'
  filterBy: Record<string, unknown> | null
  limit: number
  items: PressMentionDTO[]
}

export interface MediaMagazinesDTO extends SectionBase {
  __component: 'sections.media-magazines'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  subheading: string | null
  accent: AccentDTO
  relation: 'press-mentions'
  filterBy: Record<string, unknown> | null
  limit: number
  items: PressMentionDTO[]
}

export interface MediaMarqueeDTO extends SectionBase {
  __component: 'sections.media-marquee'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  subheading: string | null
  accent: AccentDTO
  relation: 'press-mentions'
  filterBy: Record<string, unknown> | null
  limit: number
  items: PressMentionDTO[]
}

export interface MediaPressKitDTO extends SectionBase {
  __component: 'sections.media-press-kit'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  intro: string | null
  accent: AccentDTO
  items: {
    id: number
    iconKey: 'document' | 'camera' | 'mail'
    title: string
    description: string | null
    file:
      | (MediaDTO & {
          documentId: string
          name: string | null
          ext: string | null
          size: number | null
        })
      | null
  }[]
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
  | ProiecteHeroDTO
  | ProjectFeatureDTO
  | PressWallDTO
  | MediaHeroDTO
  | MediaStatStripDTO
  | MediaLogoWallDTO
  | MediaFeaturedDTO
  | MediaMagazinesDTO
  | MediaMarqueeDTO
  | MediaPressKitDTO
