import type { MetadataRoute } from 'next'
import { getSitemapEntries, type SitemapEntriesDTO } from '../lib/strapi'
import { SITE_URL } from '../lib/site'

// Refresh at least daily even if no CMS webhook fires; publishes bust it via tags.
export const revalidate = 86400

const LOCALES = ['ro', 'en'] as const

// CMS single-type slug -> web route segment. Must mirror app/[locale]/*/page.tsx.
const PAGE_PATHS: Record<string, string> = {
  home: '',
  despre: '/despre',
  cartea: '/carte',
  podcast: '/podcast',
  idei: '/idei',
  proiecte: '/proiecte',
  evenimente: '/evenimente',
  magazin: '/magazin',
  media: '/media',
  contact: '/contact',
}

const lastModified = (d: string | null) => (d ? new Date(d) : undefined)

function entriesFor(locale: string, data: SitemapEntriesDTO): MetadataRoute.Sitemap {
  const base = `${SITE_URL}/${locale}`
  const out: MetadataRoute.Sitemap = []

  for (const p of data.pages) {
    const path = PAGE_PATHS[p.slug]
    if (path === undefined) continue
    out.push({
      url: `${base}${path}`,
      lastModified: lastModified(p.updatedAt),
      changeFrequency: p.slug === 'home' ? 'weekly' : 'monthly',
      priority: p.slug === 'home' ? 1 : 0.8,
    })
    // The press archive is a static sub-route of /media.
    if (p.slug === 'media') out.push({ url: `${base}/media/arhiva`, changeFrequency: 'monthly', priority: 0.5 })
  }
  for (const a of data.articles) {
    out.push({ url: `${base}/idei/${a.slug}`, lastModified: lastModified(a.updatedAt), changeFrequency: 'yearly', priority: 0.6 })
  }
  for (const e of data.events) {
    out.push({ url: `${base}/evenimente/${e.slug}`, lastModified: lastModified(e.updatedAt), changeFrequency: 'monthly', priority: 0.6 })
  }
  return out
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        return entriesFor(locale, await getSitemapEntries(locale))
      } catch {
        // CMS unreachable (or endpoint not deployed yet): fall back to the RO top-level
        // pages so the sitemap never 500s. Locales without content contribute nothing.
        if (locale !== 'ro') return []
        return Object.values(PAGE_PATHS).map((path) => ({ url: `${SITE_URL}/ro${path}` }))
      }
    }),
  )
  return perLocale.flat()
}
