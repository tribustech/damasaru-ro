import type { Core } from '@strapi/strapi'
import { seedTestimonials } from './collections/testimonials'
import { seedArticles } from './collections/articles'
import { seedEvents } from './collections/events'
import { seedPodcastEpisodes } from './collections/podcast-episodes'
import { seedProjects } from './collections/projects'
import { seedProducts } from './collections/products'
import { seedPressMentions } from './collections/press-mentions'
import { seedMediaItems } from './collections/media-items'
import { seedHomePage } from './pages/home'
import { seedAboutPage } from './pages/despre'
import { seedBookPage } from './pages/cartea'
import { seedPodcastPage } from './pages/podcast'
import { seedIdeiPage } from './pages/idei'
import { seedProiectePage } from './pages/proiecte'
import { seedEventsPage } from './pages/evenimente'
import { seedMagazinPage } from './pages/magazin'
import { seedMediaPage } from './pages/media'
import { seedContactPage } from './pages/contact'

export async function seedAll(strapi: Core.Strapi): Promise<void> {
  strapi.log.info('[seed] starting bootstrap seed')

  // Collections first (pages may reference them)
  const collectionSeeds = [
    ['testimonials', seedTestimonials],
    ['articles', seedArticles],
    ['events', seedEvents],
    ['podcast-episodes', seedPodcastEpisodes],
    ['projects', seedProjects],
    ['products', seedProducts],
    ['press-mentions', seedPressMentions],
    ['media-items', seedMediaItems],
  ] as const

  for (const [name, fn] of collectionSeeds) {
    try {
      await fn(strapi)
      strapi.log.info(`[seed] ✓ ${name}`)
    } catch (err) {
      strapi.log.error(`[seed] ✗ ${name}: ${(err as Error).message}`)
    }
  }

  // Pages — order matches build order
  const pageSeeds = [
    ['home-page', seedHomePage],
    ['about-page', seedAboutPage],
    ['book-page', seedBookPage],
    ['podcast-page', seedPodcastPage],
    ['idei-page', seedIdeiPage],
    ['proiecte-page', seedProiectePage],
    ['events-page', seedEventsPage],
    ['magazin-page', seedMagazinPage],
    ['media-page', seedMediaPage],
    ['contact-page', seedContactPage],
  ] as const

  for (const [name, fn] of pageSeeds) {
    try {
      await fn(strapi)
      strapi.log.info(`[seed] ✓ ${name}`)
    } catch (err) {
      strapi.log.error(`[seed] ✗ ${name}: ${(err as Error).message}`)
    }
  }

  strapi.log.info('[seed] done')
}
