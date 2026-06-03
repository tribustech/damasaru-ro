export const PAGE_POPULATE = {
  sections: {
    on: {
      'sections.hero': {
        populate: {
          media: true,
          ctaButtons: true,
          statsStrip: { populate: { items: true } },
        },
      },
      'sections.text-block': { populate: { cta: true } },
      'sections.cards-grid': {
        populate: { items: { populate: { iconImage: true } } },
      },
      'sections.testimonials': {},
      'sections.cta-banner': {},
      'sections.featured-list': {},
      'sections.stats-strip': { populate: { items: true } },
      'sections.quote-large': {},
      'sections.image-text-split': { populate: { image: true, cta: true, projectsRow: true, externalLinks: true } },
      'sections.newsletter-form': {},
      'sections.faq-accordion': { populate: { items: true } },
      'sections.logo-wall': { populate: { items: { populate: { logo: true } } } },
      'sections.downloads-list': { populate: { items: { populate: { file: true } } } },
      'sections.video-feature': {
        populate: {
          videoFile: true,
          posterImage: true,
          posterBadgeImage: true,
          ctaButton: true,
        },
      },
      'sections.credentials-grid': {
        populate: { groups: { populate: { image: true } } },
      },
      'sections.event-feature': { populate: { cta: true, event: { populate: { coverImage: true } } } },
      'sections.contact-form': {
        populate: {
          subjectOptions: true,
          eventTypeOptions: true,
          audienceSizeOptions: true,
          budgetOptions: true,
        },
      },
      'sections.proiecte-hero': { populate: { anchors: true } },
      'sections.project-feature': {
        populate: {
          image: true,
          stats: true,
          ctas: true,
          asocBox: true,
        },
      },
      'sections.press-wall': { populate: { items: true, secondaryItems: true } },
      'sections.media-hero': { populate: { media: true } },
      'sections.media-stat-strip': { populate: { items: true } },
      'sections.media-logo-wall': { populate: { items: true } },
      'sections.media-featured': {},
      'sections.media-magazines': {},
      'sections.media-marquee': {},
      'sections.media-press-kit': { populate: { items: true, files: true } },
    },
  },
}

export const ARTICLE_POPULATE = { coverImage: true }
export const EVENT_POPULATE = { coverImage: true }
export const PODCAST_EPISODE_POPULATE = { coverImage: true }
export const PROJECT_POPULATE = { heroImage: true }
export const PRODUCT_POPULATE = { image: true }
export const TESTIMONIAL_POPULATE = { photo: true }
export const PRESS_MENTION_POPULATE = { logoImage: true, coverImage: true }
export const MEDIA_ITEM_POPULATE = { thumbnail: true }
