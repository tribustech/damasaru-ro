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
      'sections.text-block': { populate: true },
      'sections.cards-grid': {
        populate: { items: { populate: { iconImage: true } } },
      },
      'sections.testimonials': {
        populate: true,
      },
      'sections.cta-banner': { populate: true },
      'sections.featured-list': { populate: true },
      'sections.stats-strip': { populate: { items: true } },
      'sections.quote-large': { populate: true },
      'sections.image-text-split': { populate: { image: true, cta: true } },
      'sections.newsletter-form': { populate: true },
      'sections.faq-accordion': { populate: { items: true } },
      'sections.logo-wall': { populate: { items: { populate: { logo: true } } } },
      'sections.downloads-list': { populate: { items: { populate: { file: true } } } },
      'sections.video-feature': { populate: true },
      'sections.credentials-grid': {
        populate: { groups: { populate: { items: true } } },
      },
      'sections.event-feature': { populate: { cta: true } },
      'sections.contact-form': { populate: true },
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
