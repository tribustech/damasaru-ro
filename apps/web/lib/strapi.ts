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
