import type { Core } from '@strapi/strapi'

/**
 * On-demand revalidation: tells the Next.js web app to drop cached pages when an
 * editor changes content. The web app tags each fetch in `apps/web/lib/strapi.ts`;
 * the maps below MUST stay in sync with those tags or revalidation silently no-ops.
 *
 * Single-type page tag === the content type's singularName (e.g. `home-page`).
 * Collection detail pages are tagged `[<plural>, '<singular>:<slug>']`.
 * A `featured-list` section (api/pages/services/resolvers.ts) can embed ANY
 * collection on ANY single-type page, so every collection change also busts all
 * page tags — there is no static way to know which pages feature a given item.
 */

// All single-type page tags. The 10 composed pages the site renders.
const PAGE_TAGS = [
  'home-page',
  'about-page',
  'book-page',
  'podcast-page',
  'idei-page',
  'proiecte-page',
  'events-page',
  'magazin-page',
  'media-page',
  'contact-page',
] as const

// Single type UID -> its own page tag (the only surface it appears on).
const SINGLE_TYPE_TAG: Record<string, string> = {
  'api::home-page.home-page': 'home-page',
  'api::about-page.about-page': 'about-page',
  'api::book-page.book-page': 'book-page',
  'api::podcast-page.podcast-page': 'podcast-page',
  'api::idei-page.idei-page': 'idei-page',
  'api::proiecte-page.proiecte-page': 'proiecte-page',
  'api::events-page.events-page': 'events-page',
  'api::magazin-page.magazin-page': 'magazin-page',
  'api::media-page.media-page': 'media-page',
  'api::contact-page.contact-page': 'contact-page',
}

// Collections with public detail pages -> the listing tag + the per-item prefix.
const DETAIL_COLLECTION: Record<string, { list: string; item: string }> = {
  'api::article.article': { list: 'articles', item: 'article' },
  'api::event.event': { list: 'events', item: 'event' },
  'api::podcast-episode.podcast-episode': {
    list: 'podcast-episodes',
    item: 'podcast-episode',
  },
  'api::project.project': { list: 'projects', item: 'project' },
  'api::product.product': { list: 'products', item: 'product' },
}

// Collections that only ever appear embedded (via featured-list), no detail page.
const EMBED_ONLY_COLLECTION = new Set([
  'api::media-item.media-item',
  'api::testimonial.testimonial',
  'api::press-mention.press-mention',
])

/** Returns the exact cache tags to bust for a change, or null if the model is
 *  not rendered on the public site (e.g. waitlist/lead submissions). */
function tagsForChange(uid: string, entry: { slug?: unknown } | undefined): string[] | null {
  const pageTag = SINGLE_TYPE_TAG[uid]
  if (pageTag) return [pageTag]

  const detail = DETAIL_COLLECTION[uid]
  if (detail) {
    const tags = [detail.list, ...PAGE_TAGS]
    if (typeof entry?.slug === 'string' && entry.slug) {
      tags.push(`${detail.item}:${entry.slug}`)
    }
    return tags
  }

  if (EMBED_ONLY_COLLECTION.has(uid)) return [...PAGE_TAGS]

  return null
}

// Revalidation stays off until the seed finishes — otherwise the bootstrap seed
// (hundreds of writes) would fire a POST storm at the web app on every boot.
let ready = false
export function enableRevalidation() {
  ready = true
}

const WATCHED_ACTIONS = new Set(['afterCreate', 'afterUpdate', 'afterDelete'])

async function postRevalidate(
  strapi: Core.Strapi,
  webUrl: string,
  secret: string,
  tags: string[],
) {
  try {
    const res = await fetch(`${webUrl.replace(/\/$/, '')}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) {
      strapi.log.warn(`[revalidate] web responded ${res.status}`)
    }
  } catch (err) {
    strapi.log.warn(`[revalidate] failed: ${(err as Error).message}`)
  }
}

// One save fans out into several db writes (the entry + its components/relations),
// each firing a lifecycle event. Coalesce a burst into a single POST so we don't
// hammer the web app with identical requests.
const FLUSH_DELAY_MS = 500
const pendingTags = new Set<string>()
let flushTimer: ReturnType<typeof setTimeout> | null = null

function scheduleFlush(strapi: Core.Strapi, webUrl: string, secret: string) {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    const tags = [...pendingTags]
    pendingTags.clear()
    if (tags.length) void postRevalidate(strapi, webUrl, secret, tags)
  }, FLUSH_DELAY_MS)
}

export function registerRevalidation(strapi: Core.Strapi) {
  strapi.db.lifecycles.subscribe((event) => {
    if (!ready) return
    if (!WATCHED_ACTIONS.has(event.action)) return

    const secret = process.env.REVALIDATE_SECRET
    const webUrl = process.env.WEB_URL
    if (!secret || !webUrl) return

    const entry = (event as { result?: { slug?: unknown } }).result
    const tags = tagsForChange(event.model.uid, entry)
    if (!tags || tags.length === 0) return

    // Buffer + debounce, then fire-and-forget: never block (or fail) the
    // editor's write on web latency.
    for (const tag of tags) pendingTags.add(tag)
    scheduleFlush(strapi, webUrl, secret)
  })
}
