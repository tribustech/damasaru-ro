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
import { isYoutubeUrl } from '../../../utils/youtube'

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
    sort: ['displayOrder:asc', 'date:desc'],
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

export async function resolvePressMentions(
  { locale: _locale, limit, filterBy }: ListOpts,
  opts?: { requireYoutube?: boolean },
) {
  // Fetch the whole filtered set first, then filter + sort + trim in JS. We can't
  // lean on the DB sort here: Strapi/Postgres orders NULL dates FIRST under
  // `date:desc`, so undated mentions crowd the top slots and push recent dated
  // ones past the `limit` cut (e.g. on the Media "Top Apariții" block, capped at
  // 8). Sorting in JS lets us put nulls LAST and only then slice to `limit`.
  const list = await strapi.documents('api::press-mention.press-mention').findMany({
    status: 'published',
    limit: 500,
    populate: PRESS_MENTION_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  let rows = list as any[]
  // The featured grid renders a YouTube thumbnail per card, so a mention without a
  // video url can't render there. Drop those BEFORE the limit cut so the cap
  // always yields that many *renderable* cards (otherwise a non-video featured
  // item silently shrinks the visible grid — see MediaFeatured.tsx).
  if (opts?.requireYoutube) rows = rows.filter((r) => isYoutubeUrl(r.url))
  const sorted = rows.slice().sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    if (!a.date && !b.date) return 0
    return a.date ? -1 : 1 // dated entries before undated ones (nulls last)
  })
  return sorted.slice(0, limit).map(serializePressMention)
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
