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
      'sections.text-block': {},
      'sections.cards-grid': {
        populate: { items: { populate: { iconImage: true } } },
      },
      'sections.testimonials': {},
      'sections.cta-banner': {},
      'sections.featured-list': {},
      'sections.stats-strip': { populate: { items: true } },
      'sections.quote-large': {},
      'sections.image-text-split': { populate: { image: true, cta: true } },
      'sections.newsletter-form': {},
      'sections.faq-accordion': { populate: { items: true } },
      'sections.logo-wall': { populate: { items: { populate: { logo: true } } } },
      'sections.downloads-list': { populate: { items: { populate: { file: true } } } },
      'sections.video-feature': {},
      'sections.credentials-grid': {
        populate: { groups: true },
      },
      'sections.event-feature': { populate: { cta: true, event: { populate: { coverImage: true } } } },
      'sections.contact-form': {},
    },
  },
}

export const ARTICLE_POPULATE = { coverImage: true }
export const EVENT_POPULATE = { coverImage: true }
export const PODCAST_EPISODE_POPULATE = { coverImage: true }
export const PROJECT_POPULATE = { heroImage: true }
export const PRODUCT_POPULATE = { image: true }
export const TESTIMONIAL_POPULATE = { photo: true }
export const PRESS_MENTION_POPULATE = { logoImage: true }
export const MEDIA_ITEM_POPULATE = { thumbnail: true }
