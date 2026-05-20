import {
  PAGE_POPULATE,
  ARTICLE_POPULATE,
  EVENT_POPULATE,
  PODCAST_EPISODE_POPULATE,
  PROJECT_POPULATE,
  PRODUCT_POPULATE,
} from './populate'
import { serializeSection, serializeMedia } from './serialize'
import { resolveFeaturedList, resolveEventByDocumentId, resolveTestimonialsList } from './resolvers'

const SLUG_TO_UID: Record<string, string> = {
  home: 'api::home-page.home-page',
  despre: 'api::about-page.about-page',
  cartea: 'api::book-page.book-page',
  podcast: 'api::podcast-page.podcast-page',
  idei: 'api::idei-page.idei-page',
  proiecte: 'api::proiecte-page.proiecte-page',
  evenimente: 'api::events-page.events-page',
  magazin: 'api::magazin-page.magazin-page',
  media: 'api::media-page.media-page',
  contact: 'api::contact-page.contact-page',
}

export async function composeSinglePage(slug: string, locale: string) {
  const uid = SLUG_TO_UID[slug]
  if (!uid) return null

  const raw = await strapi.documents(uid as any).findFirst({
    locale,
    status: 'published',
    populate: PAGE_POPULATE,
  } as any)
  if (!raw) return null

  const sections: any[] = []
  for (const rawSection of (raw as any).sections ?? []) {
    const section = serializeSection(rawSection)
    if (!section) continue

    if (section.__component === 'sections.featured-list') {
      const { items } = await resolveFeaturedList(
        { relation: section.relation, limit: section.limit, filterBy: section.filterBy },
        locale,
      )
      section.items = items
    }

    if (section.__component === 'sections.event-feature' && rawSection.event?.documentId) {
      section.event = await resolveEventByDocumentId(rawSection.event.documentId, locale)
    }

    if (section.__component === 'sections.testimonials') {
      section.items = await resolveTestimonialsList({
        locale,
        limit: section.limit ?? 6,
        filterBy: section.filterBy ?? null,
      })
    }

    sections.push(section)
  }

  return {
    id: (raw as any).id,
    documentId: (raw as any).documentId,
    locale: (raw as any).locale,
    slug,
    seo: {
      title: (raw as any).seoTitle ?? null,
      description: (raw as any).seoDescription ?? null,
    },
    sections,
  }
}

const DETAIL_RESOLVERS: Record<string, (slug: string, locale: string) => Promise<any>> = {
  async idei(slug, locale) {
    const item = await strapi.documents('api::article.article').findFirst({
      locale,
      status: 'published',
      filters: { slug: { $eq: slug } },
      populate: ARTICLE_POPULATE,
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::article.article').findMany({
      locale,
      status: 'published',
      sort: ['date:desc'],
      limit: 3,
      filters: { slug: { $ne: slug } },
      populate: ARTICLE_POPULATE,
    } as any)
    return {
      id: (item as any).id,
      documentId: (item as any).documentId,
      slug: (item as any).slug,
      title: (item as any).title,
      excerpt: (item as any).excerpt ?? null,
      date: (item as any).date,
      readTime: (item as any).readTime ?? null,
      cover: serializeMedia((item as any).coverImage),
      author: null,
      tags: (item as any).category ? [(item as any).category] : [],
      body: (item as any).content ?? '',
      related: (related as any[]).map((r) => ({
        id: r.id,
        documentId: r.documentId,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt ?? null,
        date: r.date,
        readTime: r.readTime ?? null,
        cover: serializeMedia(r.coverImage),
        author: null,
        tags: r.category ? [r.category] : [],
      })),
    }
  },

  async podcast(slug, locale) {
    const item = await strapi.documents('api::podcast-episode.podcast-episode').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: PODCAST_EPISODE_POPULATE,
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::podcast-episode.podcast-episode').findMany({
      locale, status: 'published', sort: ['number:desc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: PODCAST_EPISODE_POPULATE,
    } as any)
    const it = item as any
    return {
      id: it.id, documentId: it.documentId, slug: it.slug, number: it.number,
      title: it.title, description: it.description ?? null,
      date: it.publishedAt2 ?? it.publishedAt ?? null,
      duration: it.duration ?? null, cover: serializeMedia(it.coverImage),
      audioUrl: it.audioUrl ?? null, spotifyUrl: null, youtubeUrl: it.videoUrl ?? null,
      showNotes: it.showNotes ?? null,
      related: (related as any[]).map((r) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, number: r.number,
        title: r.title, description: r.description ?? null,
        date: r.publishedAt2 ?? r.publishedAt ?? null,
        duration: r.duration ?? null, cover: serializeMedia(r.coverImage),
        audioUrl: r.audioUrl ?? null, spotifyUrl: null, youtubeUrl: r.videoUrl ?? null,
      })),
    }
  },

  async proiecte(slug, locale) {
    const item = await strapi.documents('api::project.project').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: PROJECT_POPULATE,
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::project.project').findMany({
      locale, status: 'published', sort: ['order:asc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: PROJECT_POPULATE,
    } as any)
    const it = item as any
    return {
      id: it.id, documentId: it.documentId, slug: it.slug, name: it.name,
      tagline: it.tagline ?? null, description: it.description ?? null,
      cover: serializeMedia(it.heroImage), url: it.externalUrl ?? null, order: it.order ?? 0,
      body: it.manifesto ?? null,
      related: (related as any[]).map((r) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, name: r.name,
        tagline: r.tagline ?? null, description: r.description ?? null,
        cover: serializeMedia(r.heroImage), url: r.externalUrl ?? null, order: r.order ?? 0,
      })),
    }
  },

  async evenimente(slug, locale) {
    const item = await strapi.documents('api::event.event').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: EVENT_POPULATE,
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::event.event').findMany({
      locale, status: 'published', sort: ['date:desc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: EVENT_POPULATE,
    } as any)
    const it = item as any
    return {
      id: it.id, documentId: it.documentId, slug: it.slug, title: it.title,
      subtitle: it.subtitle ?? null,
      date: it.date, status: it.status, city: it.location ?? null, venue: it.venue ?? null,
      cover: serializeMedia(it.coverImage), excerpt: it.description ?? null,
      body: it.longDescription ?? null,
      related: (related as any[]).map((r) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, title: r.title,
        subtitle: r.subtitle ?? null,
        date: r.date, status: r.status, city: r.location ?? null, venue: r.venue ?? null,
        cover: serializeMedia(r.coverImage), excerpt: r.description ?? null,
      })),
    }
  },

  async magazin(slug, locale) {
    const item = await strapi.documents('api::product.product').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: PRODUCT_POPULATE,
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::product.product').findMany({
      locale, status: 'published', sort: ['order:asc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: PRODUCT_POPULATE,
    } as any)
    const it = item as any
    return {
      id: it.id, documentId: it.documentId, slug: it.slug, name: it.title,
      price: it.price ?? null, availability: it.availability ?? null, format: it.format ?? null,
      description: it.description ?? null,
      cover: serializeMedia(it.image), url: it.buyUrl ?? null, order: it.order ?? 0,
      body: it.longDescription ?? null,
      related: (related as any[]).map((r) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, name: r.title,
        price: r.price ?? null, availability: r.availability ?? null, format: r.format ?? null,
        description: r.description ?? null,
        cover: serializeMedia(r.image), url: r.buyUrl ?? null, order: r.order ?? 0,
      })),
    }
  },
}

export async function composeDetailPage(type: string, slug: string, locale: string) {
  const resolver = DETAIL_RESOLVERS[type]
  if (!resolver) return null
  return resolver(slug, locale)
}
