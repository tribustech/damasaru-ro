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
  return { label: raw.label, href: raw.href, variant: raw.variant ?? 'primary', goldDeep: !!raw.goldDeep }
}

function ctaButtons(
  raw: any[],
): { label: string; href: string; variant: 'primary' | 'outline' | 'secondary'; goldDeep: boolean }[] {
  return (raw ?? []).map((r) => ({
    label: r.label,
    href: r.href,
    variant: r.variant ?? 'primary',
    goldDeep: !!r.goldDeep,
  }))
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
  const rawGuests = Array.isArray(raw.guests) ? raw.guests : []
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
    category: raw.category ?? null,
    categoryKind: raw.categoryKind ?? null,
    status: raw.status === 'live' ? 'live' : 'upcoming',
    guests: rawGuests.map((g: any) => ({ name: g.name ?? '', role: g.role ?? null })),
    featured: !!raw.featured,
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
    brand: raw.brand ?? null,
    isMagazine: !!raw.isMagazine,
    featured: !!raw.featured,
    excerpt: raw.excerpt ?? null,
    logo: serializeMedia(raw.logoImage),
    cover: serializeMedia(raw.coverImage),
  } as PressMentionDTO
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
        body: raw.body ?? null,
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
        align: raw.align ?? 'left',
        cta: ctaButton(raw.cta),
      }
    case 'sections.cards-grid':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        lead: raw.lead ?? null,
        accent: raw.accent ?? 'paper',
        columns: raw.columns ?? '3',
        variant: raw.variant ?? 'default',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          title: i.title,
          text: i.text ?? null,
          image: serializeMedia(i.iconImage),
          tag: i.tag ?? null,
          href: i.href ?? null,
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
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading,
        headingItalic: raw.headingItalic ?? null,
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
        headingItalic: raw.headingItalic ?? null,
        body: raw.body ?? '',
        accent: raw.accent ?? 'paper',
        image: serializeMedia(raw.image),
        imageCaption: raw.imageCaption ?? null,
        // JSON schema uses "imagePosition" not "imageSide"
        imageSide: raw.imagePosition ?? 'right',
        cta: ctaButton(raw.cta),
        projectsRow: (raw.projectsRow ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          tag: p.tag ?? null,
          href: p.href ?? null,
        })),
        externalLinks: (raw.externalLinks ?? []).map((l: any) => ({
          id: l.id,
          label: l.label,
          href: l.href,
          muted: !!l.muted,
        })),
      }
    case 'sections.newsletter-form':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading,
        headingItalic: raw.headingItalic ?? null,
        body: raw.subtext ?? null,
        accent: raw.accent ?? 'paper',
        source: raw.formId ?? 'site',
        submitLabel: raw.buttonLabel ?? 'Abonează-te',
        placeholder: raw.placeholder ?? 'adresa@email.ro',
        fineprint: raw.fineprint ?? null,
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
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        badge: raw.badge ?? null,
        meta: raw.meta ?? null,
        body: raw.body ?? null,
        videoUrl: raw.videoUrl ?? null,
        videoFile: serializeMedia(raw.videoFile),
        posterImage: serializeMedia(raw.posterImage),
        orientation: raw.orientation ?? 'landscape',
        posterBadgeLabel: raw.posterBadgeLabel ?? null,
        posterBadgeQuote: raw.posterBadgeQuote ?? null,
        posterBadgeImage: serializeMedia(raw.posterBadgeImage),
        ctaButton: ctaButton(raw.ctaButton),
        accent: raw.accent ?? 'navy',
      }
    case 'sections.credentials-grid':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        lead: raw.lead ?? null,
        accent: raw.accent ?? 'paper',
        groups: (raw.groups ?? []).map((g: any) => ({
          id: g.id,
          title: g.title,
          items: (Array.isArray(g.items) ? g.items : []).map((i: any, idx: number) => {
            if (typeof i === 'string') {
              const parts = i.split(' — ')
              if (parts.length > 1) {
                return { id: idx, label: parts[0], sub: parts.slice(1).join(' — ') }
              }
              return { id: idx, label: i, sub: null }
            }
            return { id: i.id ?? idx, label: i.label ?? '', sub: i.sub ?? null }
          }),
          image: serializeMedia(g.image),
          imageCaption: g.imageCaption ?? null,
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
    case 'sections.contact-form': {
      const formOptions = (arr: any[] | null | undefined) =>
        (arr ?? []).map((o: any) => ({
          id: o.id,
          label: o.label,
          value: o.value,
          routingEmail: o.routingEmail ?? null,
        }))
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        body: raw.subtext ?? null,
        expectationNote: raw.expectationNote ?? null,
        nameLabel: raw.nameLabel ?? 'Nume',
        namePlaceholder: raw.namePlaceholder ?? null,
        emailLabel: raw.emailLabel ?? 'Email',
        emailPlaceholder: raw.emailPlaceholder ?? null,
        phoneLabel: raw.phoneLabel ?? null,
        phonePlaceholder: raw.phonePlaceholder ?? null,
        organizationLabel: raw.organizationLabel ?? null,
        organizationPlaceholder: raw.organizationPlaceholder ?? null,
        organizationOptional: raw.organizationOptional ?? false,
        subjectLabel: raw.subjectLabel ?? null,
        subjectPlaceholder: raw.subjectPlaceholder ?? null,
        subjectOptions: formOptions(raw.subjectOptions),
        eventTypeLabel: raw.eventTypeLabel ?? null,
        eventTypePlaceholder: raw.eventTypePlaceholder ?? null,
        eventTypeOptions: formOptions(raw.eventTypeOptions),
        audienceSizeLabel: raw.audienceSizeLabel ?? null,
        audienceSizePlaceholder: raw.audienceSizePlaceholder ?? null,
        audienceSizeOptions: formOptions(raw.audienceSizeOptions),
        budgetLabel: raw.budgetLabel ?? null,
        budgetPlaceholder: raw.budgetPlaceholder ?? null,
        budgetOptions: formOptions(raw.budgetOptions),
        dateEstimateLabel: raw.dateEstimateLabel ?? null,
        dateEstimatePlaceholder: raw.dateEstimatePlaceholder ?? null,
        optionalSectionLabel: raw.optionalSectionLabel ?? null,
        messageLabel: raw.messageLabel ?? 'Mesaj',
        messagePlaceholder: raw.messagePlaceholder ?? null,
        consentText: raw.consentText ?? null,
        submitLabel: raw.submitLabel ?? 'Trimite',
        successMessage: raw.successMessage ?? '',
        fineprint: raw.fineprint ?? null,
        accent: raw.accent ?? 'paper',
      }
    }
    case 'sections.proiecte-hero':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        title: raw.title,
        titleItalic: raw.titleItalic ?? null,
        subtitle: raw.subtitle ?? null,
        body: raw.body ?? null,
        accent: raw.accent ?? 'navy',
        anchors: ctaButtons(raw.anchors),
      }
    case 'sections.project-feature':
      return {
        ...base,
        anchorId: raw.anchorId ?? null,
        eyebrow: raw.eyebrow ?? null,
        wordmark: raw.wordmark,
        wordmarkItalic: raw.wordmarkItalic ?? null,
        wordmarkLine2: raw.wordmarkLine2 ?? null,
        wordmarkLine3: raw.wordmarkLine3 ?? null,
        since: raw.since ?? null,
        tagline: raw.tagline ?? null,
        body: raw.body ?? '',
        layout: raw.layout ?? 'text-left',
        accent: raw.accent ?? 'navy',
        logo: serializeMedia(raw.logo),
        image: serializeMedia(raw.image),
        imageCaption: raw.imageCaption ?? null,
        stats: (raw.stats ?? []).map((s: any) => ({ id: s.id, value: s.value, label: s.label })),
        ctas: ctaButtons(raw.ctas),
        asocBox: raw.asocBox
          ? {
              statusText: raw.asocBox.statusText ?? null,
              title: raw.asocBox.title ?? null,
              titleItalic: raw.asocBox.titleItalic ?? null,
              body: raw.asocBox.body ?? null,
            }
          : null,
      }
    case 'sections.press-wall':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading,
        headingItalic: raw.headingItalic ?? null,
        subtitle: raw.subtitle ?? null,
        accent: raw.accent ?? 'paper',
        expandLabel: raw.expandLabel ?? null,
        collapseLabel: raw.collapseLabel ?? null,
        secondaryLabel: raw.secondaryLabel ?? null,
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          brandKey: i.brandKey,
          info: i.info ?? null,
          title: i.title ?? null,
          url: i.url ?? null,
        })),
        secondaryItems: (raw.secondaryItems ?? []).map((s: any) => ({
          id: s.id,
          label: s.label,
          url: s.url ?? null,
        })),
      }
    case 'sections.media-hero':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        title: raw.title,
        titleItalic: raw.titleItalic ?? null,
        subtitle: raw.subtitle ?? null,
        body: raw.body ?? null,
        badgeLabel: raw.badgeLabel ?? null,
        media: serializeMedia(raw.media),
        accent: raw.accent ?? 'navy',
      }
    case 'sections.media-stat-strip':
      return {
        ...base,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({ id: i.id, value: i.value, label: i.label, caption: i.caption ?? null })),
      }
    case 'sections.media-logo-wall':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        lead: raw.lead ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          svgKey: i.svgKey,
          outletName: i.outletName,
          count: i.count ?? null,
          description: i.description ?? null,
          href: i.href ?? null,
        })),
      }
    case 'sections.media-featured':
    case 'sections.media-magazines':
    case 'sections.media-marquee':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        subheading: raw.subheading ?? null,
        accent: raw.accent ?? (raw.__component === 'sections.media-featured' ? 'paper-warm' : 'paper'),
        relation: raw.relation ?? 'press-mentions',
        limit: raw.limit ?? (raw.__component === 'sections.media-featured' ? 8 : raw.__component === 'sections.media-magazines' ? 5 : 60),
        filterBy: raw.filterBy ?? null,
        items: [],
      }
    case 'sections.media-press-kit':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        intro: raw.intro ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          iconKey: i.iconKey ?? 'document',
          title: i.title,
          description: i.description ?? null,
        })),
        files: (Array.isArray(raw.files) ? raw.files : raw.files ? [raw.files] : [])
          .map((f: any) => {
            const media = serializeMedia(f)
            if (!media) return null
            return { ...media, name: f.name ?? null, ext: f.ext ?? null, size: f.size ?? null }
          })
          .filter((f: any) => f !== null),
      }
    default:
      strapi.log.warn(`[pages] unknown section component: ${raw.__component}`)
      return null
  }
}
