import type { StrapiMedia, CtaButton } from '../shared'
import type { Article, Event, MediaItem, PodcastEpisode, Project, Product, Testimonial, PressMention } from '../index'

export type SectionAccent = 'navy' | 'paper' | 'paper-warm' | 'navy-deep'

export interface StatItem {
  id: number
  value: string
  label: string
  caption: string | null
}

export interface SectionStatsStrip {
  __component: 'sections.stats-strip'
  id: number
  eyebrow: string | null
  heading: string | null
  accent: SectionAccent
  items: StatItem[]
}

export interface SectionHero {
  __component: 'sections.hero'
  id: number
  eyebrow: string | null
  title: string
  titleItalic: string | null
  subtitle: string | null
  accent: SectionAccent
  media: StrapiMedia | null
  mediaPosition: 'right' | 'left' | 'below' | 'none'
  ctaButtons: CtaButton[]
  statsStrip: Omit<SectionStatsStrip, '__component'> | null
  projectsStripLabel: string | null
}

export interface SectionTextBlock {
  __component: 'sections.text-block'
  id: number
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  body: string | null
  accent: SectionAccent
  align: 'left' | 'center'
  cta: CtaButton | null
}

export interface CardItem {
  id: number
  title: string
  text: string
  iconName: string | null
  iconImage: StrapiMedia | null
  tag: string | null
  href: string | null
}

export interface SectionCardsGrid {
  __component: 'sections.cards-grid'
  id: number
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  lead: string | null
  accent: SectionAccent
  columns: '2' | '3' | '4'
  items: CardItem[]
}

export interface SectionTestimonials {
  __component: 'sections.testimonials'
  id: number
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  accent: SectionAccent
  filterBy: Record<string, unknown> | null
  limit: number
  items?: Testimonial[]
}

export interface SectionCtaBanner {
  __component: 'sections.cta-banner'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  subtext: string | null
  buttonLabel: string
  buttonHref: string
  accent: SectionAccent
}

export type FeaturedListRelation =
  | 'articles'
  | 'events'
  | 'podcast-episodes'
  | 'projects'
  | 'products'
  | 'testimonials'
  | 'press-mentions'

export interface SectionFeaturedList {
  __component: 'sections.featured-list'
  id: number
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  subheading: string | null
  accent: SectionAccent
  relation: FeaturedListRelation
  layout: 'grid' | 'row' | 'marquee' | 'feature' | 'featured-with-list' | 'featured-with-grid' | 'list-rows' | 'event-banner'
  limit: number
  filterBy: Record<string, unknown> | null
  seeAllHref: string | null
  seeAllLabel: string | null
  items?: Array<Article | Event | PodcastEpisode | Project | Product | Testimonial | PressMention | MediaItem>
}

export interface SectionQuoteLarge {
  __component: 'sections.quote-large'
  id: number
  eyebrow: string | null
  quote: string
  attribution: string | null
  accent: SectionAccent
}

export interface SectionImageTextSplit {
  __component: 'sections.image-text-split'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  body: string | null
  image: StrapiMedia | null
  imagePosition: 'left' | 'right'
  accent: SectionAccent
  cta: CtaButton | null
}

export interface SectionNewsletterForm {
  __component: 'sections.newsletter-form'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  subtext: string | null
  buttonLabel: string
  placeholder: string
  fineprint: string | null
  accent: SectionAccent
  formId: string
}

export interface FaqItem {
  id: number
  question: string
  answer: string
}

export interface SectionFaqAccordion {
  __component: 'sections.faq-accordion'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  intro: string | null
  accent: SectionAccent
  items: FaqItem[]
}

export interface LogoItem {
  id: number
  name: string
  logo: StrapiMedia
  url: string | null
}

export interface SectionLogoWall {
  __component: 'sections.logo-wall'
  id: number
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  accent: SectionAccent
  items: LogoItem[]
}

export interface DownloadItem {
  id: number
  label: string
  description: string | null
  file: StrapiMedia
  group: string | null
}

export interface SectionDownloadsList {
  __component: 'sections.downloads-list'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  intro: string | null
  accent: SectionAccent
  items: DownloadItem[]
}

export interface SectionVideoFeature {
  __component: 'sections.video-feature'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  badge: string | null
  meta: string | null
  body: string | null
  videoUrl: string | null
  videoFile: StrapiMedia | null
  posterImage: StrapiMedia | null
  orientation: 'landscape' | 'portrait'
  posterBadgeLabel: string | null
  posterBadgeQuote: string | null
  posterBadgeImage: StrapiMedia | null
  ctaButton: CtaButton | null
  accent: SectionAccent
}

export interface CredentialGroup {
  id: number
  title: string
  items: string[]
}

export interface SectionCredentialsGrid {
  __component: 'sections.credentials-grid'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  lead: string | null
  accent: SectionAccent
  groups: CredentialGroup[]
}

export interface SectionEventFeature {
  __component: 'sections.event-feature'
  id: number
  eyebrow: string | null
  accent: SectionAccent
  event: Event | null
  cta: CtaButton | null
}

export interface FormOption {
  id: number
  label: string
  value: string
  routingEmail: string | null
}

export interface SectionContactForm {
  __component: 'sections.contact-form'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  subtext: string | null
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
  subjectOptions: FormOption[]
  eventTypeLabel: string | null
  eventTypePlaceholder: string | null
  eventTypeOptions: FormOption[]
  audienceSizeLabel: string | null
  audienceSizePlaceholder: string | null
  audienceSizeOptions: FormOption[]
  budgetLabel: string | null
  budgetPlaceholder: string | null
  budgetOptions: FormOption[]
  dateEstimateLabel: string | null
  dateEstimatePlaceholder: string | null
  optionalSectionLabel: string | null
  messageLabel: string
  messagePlaceholder: string | null
  consentText: string | null
  submitLabel: string
  successMessage: string
  fineprint: string | null
  accent: SectionAccent
}

export interface SectionProiecteHero {
  __component: 'sections.proiecte-hero'
  id: number
  eyebrow: string | null
  title: string
  titleItalic: string | null
  subtitle: string | null
  body: string | null
  accent: SectionAccent
  anchors: CtaButton[]
}

export interface AsocBox {
  statusText: string | null
  title: string | null
  titleItalic: string | null
  body: string | null
}

export interface SectionProjectFeature {
  __component: 'sections.project-feature'
  id: number
  anchorId: string | null
  eyebrow: string | null
  wordmark: string
  wordmarkItalic: string | null
  wordmarkLine2: string | null
  wordmarkLine3: string | null
  since: string | null
  tagline: string | null
  body: string | null
  layout: 'text-left' | 'text-right' | 'centered'
  accent: SectionAccent
  logo: StrapiMedia | null
  image: StrapiMedia | null
  imageCaption: string | null
  stats: StatItem[]
  ctas: CtaButton[]
  asocBox: AsocBox | null
}

export interface PressBrand {
  brandKey: string
  info: string | null
  title: string | null
  url: string | null
}

export interface PressSecondaryItem {
  label: string
  url: string | null
}

export interface SectionPressWall {
  __component: 'sections.press-wall'
  id: number
  eyebrow: string | null
  heading: string
  headingItalic: string | null
  subtitle: string | null
  accent: SectionAccent
  expandLabel: string | null
  collapseLabel: string | null
  secondaryLabel: string | null
  items: (PressBrand & { id: number })[]
  secondaryItems: (PressSecondaryItem & { id: number })[]
}

export type Section =
  | SectionHero
  | SectionTextBlock
  | SectionCardsGrid
  | SectionTestimonials
  | SectionCtaBanner
  | SectionFeaturedList
  | SectionStatsStrip
  | SectionQuoteLarge
  | SectionImageTextSplit
  | SectionNewsletterForm
  | SectionFaqAccordion
  | SectionLogoWall
  | SectionDownloadsList
  | SectionVideoFeature
  | SectionCredentialsGrid
  | SectionEventFeature
  | SectionContactForm
  | SectionProiecteHero
  | SectionProjectFeature
  | SectionPressWall
