import type {
  StrapiSingleResponse,
  StrapiListResponse,
  Article,
  Event,
  MediaItem,
  HomePage,
  AboutPage,
  BookPage,
  MediaPage,
} from '@repo/types'

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN ?? ''

async function fetchStrapi<T>(
  path: string,
  { locale, tags }: { locale: string; tags: string[] }
): Promise<T> {
  const url = new URL(`/api/${path}`, STRAPI_URL)
  url.searchParams.set('locale', locale)
  url.searchParams.set('populate', 'deep')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    next: { tags },
  })

  if (!res.ok) {
    throw new Error(`Strapi fetch failed [${res.status}]: ${path}`)
  }

  return res.json() as Promise<T>
}

export async function getHomePage(locale: string): Promise<HomePage> {
  const res = await fetchStrapi<StrapiSingleResponse<HomePage>>('home-page', {
    locale,
    tags: ['home-page'],
  })
  return res.data
}

export async function getAboutPage(locale: string): Promise<AboutPage> {
  const res = await fetchStrapi<StrapiSingleResponse<AboutPage>>('about-page', {
    locale,
    tags: ['about-page'],
  })
  return res.data
}

export async function getBookPage(locale: string): Promise<BookPage> {
  const res = await fetchStrapi<StrapiSingleResponse<BookPage>>('book-page', {
    locale,
    tags: ['book-page'],
  })
  return res.data
}

export async function getMediaPage(locale: string): Promise<MediaPage> {
  const res = await fetchStrapi<StrapiSingleResponse<MediaPage>>('media-page', {
    locale,
    tags: ['media-page'],
  })
  return res.data
}

export async function getArticles(locale: string): Promise<Article[]> {
  const res = await fetchStrapi<StrapiListResponse<Article>>('articles', {
    locale,
    tags: ['articles'],
  })
  return res.data
}

export async function getArticle(slug: string, locale: string): Promise<Article | null> {
  const res = await fetchStrapi<StrapiListResponse<Article>>(
    `articles?filters[slug][$eq]=${slug}`,
    { locale, tags: ['articles', `article:${slug}`] }
  )
  return res.data[0] ?? null
}

export async function getEvents(locale: string): Promise<Event[]> {
  const res = await fetchStrapi<StrapiListResponse<Event>>('events', {
    locale,
    tags: ['events'],
  })
  return res.data
}

export async function getEvent(slug: string, locale: string): Promise<Event | null> {
  const res = await fetchStrapi<StrapiListResponse<Event>>(
    `events?filters[slug][$eq]=${slug}`,
    { locale, tags: ['events', `event:${slug}`] }
  )
  return res.data[0] ?? null
}

export async function getMediaItems(locale: string): Promise<MediaItem[]> {
  const res = await fetchStrapi<StrapiListResponse<MediaItem>>('media-items', {
    locale,
    tags: ['media-items'],
  })
  return res.data
}
