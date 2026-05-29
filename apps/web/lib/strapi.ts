import type {
  SingleTypePageDTO,
  ArticleDetailDTO,
  PodcastEpisodeDetailDTO,
  ProjectDetailDTO,
  EventDetailDTO,
  ProductDetailDTO,
} from '@repo/types'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

class NotFoundError extends Error {
  constructor(path: string) {
    super(`not-found: ${path}`)
    this.name = 'NotFoundError'
  }
}

async function fetchPage<T>(path: string, locale: string, tags: string[]): Promise<T> {
  const url = `${STRAPI_URL}/api/pages/${path}?locale=${encodeURIComponent(locale)}`
  const res = await fetch(url, {
    headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
    next: { tags },
  })
  if (res.status === 404) throw new NotFoundError(path)
  if (!res.ok) throw new Error(`pages fetch failed [${res.status}]: ${path}`)
  return res.json() as Promise<T>
}

export { NotFoundError }

// Press-mention collection list (for /media/arhiva — the full 82-appearance archive).
// Direct collection fetch (mirrors the waitlist-count REST pattern); the page DTO endpoints
// only ship the curated/filtered subsets, so the archive reads the raw collection instead.
export interface PressMentionListItem {
  id: number
  documentId: string
  title: string
  outlet: string
  url: string | null
  type: string | null
  brand: string | null
  date: string | null
  featured: boolean
}

export async function getPressMentions(locale: string): Promise<PressMentionListItem[]> {
  const qs = new URLSearchParams({
    locale,
    'pagination[pageSize]': '200',
    'sort[0]': 'date:desc',
    'fields[0]': 'title',
    'fields[1]': 'outlet',
    'fields[2]': 'url',
    'fields[3]': 'type',
    'fields[4]': 'brand',
    'fields[5]': 'date',
    'fields[6]': 'featured',
  })
  const res = await fetch(`${STRAPI_URL}/api/press-mentions?${qs}`, {
    headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
    next: { tags: ['press-mentions'] },
  })
  if (!res.ok) throw new Error(`press-mentions fetch failed [${res.status}]`)
  const json: unknown = await res.json()
  const data = (json as { data?: unknown })?.data
  const rows: Record<string, unknown>[] = Array.isArray(data) ? data : []
  return rows.map((row) => {
    // Strapi 5 flattens attributes onto the row; tolerate the older { attributes } shape too.
    const a = (row.attributes as Record<string, unknown>) ?? row
    const str = (v: unknown): string | null => (typeof v === 'string' ? v : null)
    return {
      id: Number(row.id),
      documentId: str(a.documentId) ?? str(row.documentId) ?? String(row.id),
      title: str(a.title) ?? '',
      outlet: str(a.outlet) ?? '',
      url: str(a.url),
      type: str(a.type),
      brand: str(a.brand),
      date: str(a.date),
      featured: Boolean(a.featured),
    }
  })
}

// Single-type pages
export const getHomePage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('home', locale, ['home-page'])
export const getAboutPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('despre', locale, ['about-page'])
export const getBookPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('cartea', locale, ['book-page'])
export const getPodcastPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('podcast', locale, ['podcast-page'])
export const getIdeiPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('idei', locale, ['idei-page'])
export const getProiectePage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('proiecte', locale, ['proiecte-page'])
export const getEventsPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('evenimente', locale, ['events-page'])
export const getMagazinPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('magazin', locale, ['magazin-page'])
export const getMediaPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('media', locale, ['media-page'])
export const getContactPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('contact', locale, ['contact-page'])

// Detail pages
export const getArticle = (slug: string, locale: string) =>
  fetchPage<ArticleDetailDTO>(`idei/${slug}`, locale, ['articles', `article:${slug}`])
export const getPodcastEpisode = (slug: string, locale: string) =>
  fetchPage<PodcastEpisodeDetailDTO>(`podcast/${slug}`, locale, [
    'podcast-episodes',
    `podcast-episode:${slug}`,
  ])
export const getProject = (slug: string, locale: string) =>
  fetchPage<ProjectDetailDTO>(`proiecte/${slug}`, locale, ['projects', `project:${slug}`])
export const getEvent = (slug: string, locale: string) =>
  fetchPage<EventDetailDTO>(`evenimente/${slug}`, locale, ['events', `event:${slug}`])
export const getProduct = (slug: string, locale: string) =>
  fetchPage<ProductDetailDTO>(`magazin/${slug}`, locale, ['products', `product:${slug}`])

// Newsletter submit (unchanged write surface)
export async function submitNewsletter(email: string, source: string): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/newsletter-subscriptions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: { email, source, consent: true } }),
  })
  if (!res.ok) throw new Error(`Newsletter subscribe failed [${res.status}]`)
}

export async function submitAudiobookWaitlist(email: string, note: string | null): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/audiobook-waitlist-entries`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: { email, note: note ?? null } }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Audiobook waitlist submit failed [${res.status}] ${body.slice(0, 200)}`)
  }
}

export async function getAudiobookWaitlistCount(): Promise<number> {
  const res = await fetch(
    `${STRAPI_URL}/api/audiobook-waitlist-entries?pagination[pageSize]=1&pagination[withCount]=true`,
    {
      headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
      next: { revalidate: 60, tags: ['audiobook-waitlist'] },
    }
  )
  if (!res.ok) return 0
  const json = await res.json()
  return json?.meta?.pagination?.total ?? 0
}

export async function submitEventWaitlist(
  email: string,
  source: string,
  name?: string | null,
): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/event-waitlist-entries`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: { email, source, name: name ?? null } }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Event waitlist submit failed [${res.status}] ${body.slice(0, 200)}`)
  }
}

export async function getEventWaitlistCount(source: string): Promise<number> {
  const qs = new URLSearchParams({
    'pagination[pageSize]': '1',
    'pagination[withCount]': 'true',
    'filters[source][$eq]': source,
  })
  const res = await fetch(`${STRAPI_URL}/api/event-waitlist-entries?${qs}`, {
    headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
    next: { revalidate: 60, tags: ['event-waitlist', `event-waitlist:${source}`] },
  })
  if (!res.ok) return 0
  const json = await res.json()
  return json?.meta?.pagination?.total ?? 0
}

export interface SpeakerBookingPayload {
  email: string
  name: string
  phone?: string | null
  organization?: string | null
  eventType?: string | null
  audienceSize?: string | null
  budget?: string | null
  dateEstimate?: string | null
  message: string
}

export async function submitSpeakerBooking(payload: SpeakerBookingPayload): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/speaker-booking-entries`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    body: JSON.stringify({
      data: {
        email: payload.email,
        name: payload.name,
        phone: payload.phone ?? null,
        organization: payload.organization ?? null,
        eventType: payload.eventType ?? null,
        audienceSize: payload.audienceSize ?? null,
        budget: payload.budget ?? null,
        dateEstimate: payload.dateEstimate ?? null,
        message: payload.message,
      },
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Speaker booking submit failed [${res.status}] ${body.slice(0, 200)}`)
  }
}
