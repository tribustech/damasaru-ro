import {
  ARTICLE_POPULATE,
  EVENT_POPULATE,
  PODCAST_EPISODE_POPULATE,
  PROJECT_POPULATE,
  PRODUCT_POPULATE,
  TESTIMONIAL_POPULATE,
  PRESS_MENTION_POPULATE,
} from './populate'
import {
  serializeArticle,
  serializeEvent,
  serializePodcastEpisode,
  serializeProject,
  serializeProduct,
  serializeTestimonial,
  serializePressMention,
} from './serialize'

interface ListOpts {
  locale: string
  limit: number
  filterBy: Record<string, unknown> | null
}

function whereFromFilterBy(filterBy: Record<string, unknown> | null) {
  if (!filterBy) return undefined
  const filters: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(filterBy)) {
    if (value === null || value === undefined) continue
    filters[key] = { $eq: value }
  }
  return Object.keys(filters).length ? filters : undefined
}

export async function resolveArticles({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::article.article').findMany({
    locale,
    status: 'published',
    sort: ['date:desc'],
    limit,
    populate: ARTICLE_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeArticle)
}

export async function resolveEvents({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::event.event').findMany({
    locale,
    status: 'published',
    sort: ['date:desc'],
    limit,
    populate: EVENT_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeEvent)
}

export async function resolvePodcastEpisodes({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::podcast-episode.podcast-episode').findMany({
    locale,
    status: 'published',
    sort: ['number:desc'],
    limit,
    populate: PODCAST_EPISODE_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializePodcastEpisode)
}

export async function resolveProjects({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::project.project').findMany({
    locale,
    status: 'published',
    sort: ['order:asc'],
    limit,
    populate: PROJECT_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeProject)
}

export async function resolveProducts({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::product.product').findMany({
    locale,
    status: 'published',
    sort: ['order:asc'],
    limit,
    populate: PRODUCT_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeProduct)
}

export async function resolveTestimonialsList({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::testimonial.testimonial').findMany({
    locale,
    status: 'published',
    limit,
    populate: TESTIMONIAL_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeTestimonial)
}

export async function resolvePressMentions({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::press-mention.press-mention').findMany({
    sort: ['date:desc'],
    limit,
    populate: PRESS_MENTION_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializePressMention)
}

export async function resolveFeaturedList(
  section: { relation: string; limit?: number; filterBy?: Record<string, unknown> | null },
  locale: string,
) {
  const opts = { locale, limit: section.limit ?? 3, filterBy: section.filterBy ?? null }
  switch (section.relation) {
    case 'articles':
      return { items: await resolveArticles(opts) }
    case 'events':
      return { items: await resolveEvents(opts) }
    case 'podcast-episodes':
      return { items: await resolvePodcastEpisodes(opts) }
    case 'projects':
      return { items: await resolveProjects(opts) }
    case 'products':
      return { items: await resolveProducts(opts) }
    case 'testimonials':
      return { items: await resolveTestimonialsList(opts) }
    case 'press-mentions':
      return { items: await resolvePressMentions(opts) }
    default:
      return { items: [] }
  }
}

export async function resolveEventByDocumentId(documentId: string, locale: string) {
  if (!documentId) return null
  const event = await strapi.documents('api::event.event').findOne({
    documentId,
    locale,
    status: 'published',
    populate: EVENT_POPULATE,
  } as any)
  return event ? serializeEvent(event) : null
}
