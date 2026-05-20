import type {
  MediaDTO,
  ArticleDTO,
  EventDTO,
  PodcastEpisodeDTO,
  ProjectDTO,
  ProductDTO,
  TestimonialDTO,
  PressMentionDTO,
  MediaItemDTO,
} from '@repo/types'

function strapiBase(): string {
  return (strapi.config.get('server.url') as string) || 'http://localhost:1337'
}

function absolutize(url: string | null | undefined): string | null {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url
  return strapiBase().replace(/\/$/, '') + (url.startsWith('/') ? url : `/${url}`)
}

export function serializeMedia(raw: any): MediaDTO | null {
  if (!raw) return null
  const url = absolutize(raw.url)
  if (!url) return null
  const formats = raw.formats
    ? Object.fromEntries(
        Object.entries(raw.formats)
          .map(([key, fmt]: [string, any]) => {
            const formatUrl = absolutize(fmt.url)
            if (!formatUrl) return null
            return [key, { url: formatUrl, width: fmt.width, height: fmt.height }] as const
          })
          .filter((e): e is readonly [string, { url: string; width: number; height: number }] => e !== null),
      )
    : undefined
  return {
    url,
    alt: raw.alternativeText ?? '',
    width: raw.width ?? 0,
    height: raw.height ?? 0,
    formats,
  }
}

function ctaButton(raw: any) {
  if (!raw) return null
  return { label: raw.label, href: raw.href, variant: raw.variant ?? 'primary' }
}

function ctaButtons(raw: any[]): { label: string; href: string; variant: 'primary' | 'outline' }[] {
  return (raw ?? []).map((r) => ({ label: r.label, href: r.href, variant: r.variant ?? 'primary' }))
}

export function serializeArticle(raw: any): ArticleDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? null,
    date: raw.date,
    readTime: raw.readTime ?? null,
    cover: serializeMedia(raw.coverImage),
    author: null,
    tags: raw.category ? [raw.category] : [],
  }
}

export function serializeEvent(raw: any): EventDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle ?? null,
    date: raw.date,
    status: raw.status,
    city: raw.location ?? null,
    venue: raw.venue ?? null,
    cover: serializeMedia(raw.coverImage),
    excerpt: raw.description ?? null,
  }
}

export function serializePodcastEpisode(raw: any): PodcastEpisodeDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    number: raw.number,
    title: raw.title,
    description: raw.description ?? null,
    date: raw.publishedAt2 ?? raw.publishedAt ?? null,
    duration: raw.duration ?? null,
    cover: serializeMedia(raw.coverImage),
    audioUrl: raw.audioUrl ?? null,
    spotifyUrl: null,
    youtubeUrl: raw.videoUrl ?? null,
  }
}

export function serializeProject(raw: any): ProjectDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline ?? null,
    description: raw.description ?? null,
    cover: serializeMedia(raw.heroImage),
    url: raw.externalUrl ?? null,
    order: raw.order ?? 0,
  }
}

export function serializeProduct(raw: any): ProductDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    name: raw.title,
    price: raw.price ?? null,
    availability: raw.availability ?? null,
    format: raw.format ?? null,
    description: raw.description ?? null,
    cover: serializeMedia(raw.image),
    url: raw.buyUrl ?? null,
    order: raw.order ?? 0,
  }
}

export function serializeTestimonial(raw: any): TestimonialDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    quote: raw.quote,
    author: raw.author,
    role: raw.role ?? null,
    avatar: serializeMedia(raw.photo),
  }
}

export function serializePressMention(raw: any): PressMentionDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    outlet: raw.outlet,
    title: raw.title,
    date: raw.date,
    url: raw.url,
    type: raw.type ?? null,
    logo: serializeMedia(raw.logoImage),
  }
}

export function serializeMediaItem(raw: any): MediaItemDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
    kind: raw.type,
    date: raw.date ?? null,
    url: raw.url,
    thumbnail: serializeMedia(raw.thumbnail),
    description: raw.source ?? null,
  }
}

export function serializeSection(raw: any): any {
  const base = { id: raw.id, __component: raw.__component }
  switch (raw.__component) {
    case 'sections.hero':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        title: raw.title,
        titleItalic: raw.titleItalic ?? null,
        subtitle: raw.subtitle ?? null,
        accent: raw.accent ?? 'navy',
        media: serializeMedia(raw.media),
        mediaPosition: raw.mediaPosition ?? 'right',
        ctaButtons: ctaButtons(raw.ctaButtons),
        statsStrip: raw.statsStrip
          ? { items: (raw.statsStrip.items ?? []).map((i: any) => ({ id: i.id, value: i.value, label: i.label, caption: i.caption ?? null })) }
          : null,
      }
    case 'sections.text-block':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        body: raw.body ?? '',
        accent: raw.accent ?? 'paper',
      }
    case 'sections.cards-grid':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          title: i.title,
          body: i.text ?? null,
          image: serializeMedia(i.iconImage),
          cta: i.href ? { label: i.tag ?? '', href: i.href, variant: 'primary' as const } : null,
        })),
      }
    case 'sections.testimonials':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        filterBy: raw.filterBy ?? null,
        limit: raw.limit ?? 6,
        items: [],
      }
    case 'sections.cta-banner':
      return {
        ...base,
        heading: raw.heading,
        subheading: raw.subtext ?? null,
        accent: raw.accent ?? 'paper',
        cta: raw.buttonLabel
          ? { label: raw.buttonLabel, href: raw.buttonHref ?? '#', variant: 'primary' as const }
          : null,
      }
    case 'sections.featured-list':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        subheading: raw.subheading ?? null,
        accent: raw.accent ?? 'paper',
        relation: raw.relation,
        layout: raw.layout ?? 'grid',
        limit: raw.limit ?? 3,
        filterBy: raw.filterBy ?? null,
        seeAllHref: raw.seeAllHref ?? null,
        seeAllLabel: raw.seeAllLabel ?? null,
        items: [],
      }
    case 'sections.stats-strip':
      return {
        ...base,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({ id: i.id, value: i.value, label: i.label, caption: i.caption ?? null })),
      }
    case 'sections.quote-large':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        // JSON schema uses "attribution" not "author"
        quote: raw.quote,
        author: raw.attribution ?? null,
        accent: raw.accent ?? 'paper',
      }
    case 'sections.image-text-split':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        body: raw.body ?? '',
        accent: raw.accent ?? 'paper',
        image: serializeMedia(raw.image),
        // JSON schema uses "imagePosition" not "imageSide"
        imageSide: raw.imagePosition ?? 'right',
        cta: ctaButton(raw.cta),
      }
    case 'sections.newsletter-form':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading,
        body: raw.subtext ?? null,
        accent: raw.accent ?? 'paper',
        source: raw.formId ?? 'site',
        submitLabel: raw.buttonLabel ?? 'Abonează-te',
      }
    case 'sections.faq-accordion':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({ id: i.id, question: i.question, answer: i.answer })),
      }
    case 'sections.logo-wall':
      return {
        ...base,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          name: i.name,
          logo: serializeMedia(i.logo),
          url: i.url ?? null,
        })),
      }
    case 'sections.downloads-list':
      return {
        ...base,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({ id: i.id, label: i.label, file: serializeMedia(i.file) })),
      }
    case 'sections.video-feature':
      return {
        ...base,
        heading: raw.heading ?? null,
        videoUrl: raw.videoUrl,
        caption: raw.body ?? null,
        accent: raw.accent ?? 'paper',
      }
    case 'sections.credentials-grid':
      return {
        ...base,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        groups: (raw.groups ?? []).map((g: any) => ({
          id: g.id,
          title: g.title,
          items: (Array.isArray(g.items) ? g.items : []).map((i: any) => ({
            id: i.id ?? 0,
            label: i.label ?? '',
            sub: i.sub ?? null,
          })),
        })),
      }
    case 'sections.event-feature':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        accent: raw.accent ?? 'paper',
        event: null,
        cta: ctaButton(raw.cta),
      }
    case 'sections.contact-form':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        // JSON schema uses "subtext" not "body"
        body: raw.subtext ?? null,
        accent: raw.accent ?? 'paper',
        submitLabel: raw.submitLabel ?? 'Trimite',
        successMessage: raw.successMessage ?? '',
      }
    default:
      strapi.log.warn(`[pages] unknown section component: ${raw.__component}`)
      return null
  }
}
