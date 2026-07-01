import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedHomePage(strapi: Core.Strapi): Promise<void> {
  const heroPortrait = await uploadFile(
    strapi,
    docPath('1. Despre mine', '01. Costin_Damasaru_1.jpg'),
    { alt: 'Costin Dămășaru' }
  )

  await upsertSingleType(strapi, 'api::home-page.home-page', {
    seoTitle: 'Costin Dămășaru — Claritate în minte. Putere în viață.',
    seoDescription:
      'Neurocercetător, autor bestseller și facilitator. Conversații, eseuri, proiecte și evenimente despre creier, viață și sens.',
    sections: [
      // Zone 1 — Hero (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'AUTOR BESTSELLER · NEUROCERCETĂTOR',
        title: 'Claritate în minte.',
        titleItalic: 'Putere în viață.',
        subtitle:
          'Ajut oamenii să-și înțeleagă creierul și să-și reconstruiască viața prin știință, claritate și experiență reală — peste 15 ani de cercetare aplicată în neurofeedback și performanță cognitivă.',
        accent: 'navy',
        mediaPosition: 'right',
        media: heroPortrait,
        ctaButtons: [
          { label: 'Descoperă cartea', href: '/carte', variant: 'primary' },
          { label: 'Ascultă podcast-ul', href: '/podcast', variant: 'outline' },
        ],
        statsStrip: {
          items: [
            { value: '15+', label: 'ANI DE CERCETARE', caption: null },
            { value: '10.000+', label: 'CREIERE ANALIZATE', caption: null },
            { value: '4', label: 'PROIECTE ACTIVE', caption: null },
          ],
        },
        projectsStripLabel: 'PROIECTE',
      },

      // Zone 2 — Podcast feature (paper)
      {
        __component: 'sections.featured-list',
        eyebrow: 'PODCAST',
        heading: 'Conversații despre',
        headingItalic: 'creier, viață și sens.',
        subheading:
          'Săptămânal, dialoguri cu cercetători, terapeuți și oameni care au reconstruit ceva esențial.',
        accent: 'paper',
        relation: 'podcast-episodes',
        layout: 'featured-with-list',
        // Wide enough to cover the catalog so the big card can feature the latest
        // episode that actually has a link even when newer ones are still
        // link-less; the rest fill the side list. See PodcastFeaturedWithList.
        limit: 24,
        seeAllHref: '/podcast',
        seeAllLabel: 'Toate episoadele',
      },

      // Zone 3 — Idei feature (navy)
      {
        __component: 'sections.featured-list',
        eyebrow: 'IDEI',
        heading: 'Eseuri despre',
        headingItalic: 'sănătatea mentală a unei societăți.',
        subheading:
          'Texte lungi, gândite, despre cum funcționează creierul, cum funcționează România și unde se intersectează cele două.',
        accent: 'navy',
        relation: 'articles',
        layout: 'featured-with-grid',
        limit: 4,
        seeAllHref: '/idei',
        seeAllLabel: 'Toate articolele',
      },

      // Zone 4 — Proiecte feature (paper)
      {
        __component: 'sections.featured-list',
        eyebrow: 'PROIECTE',
        heading: 'Patru inițiative',
        headingItalic: 'care duc cercetarea în lumea reală.',
        accent: 'paper',
        relation: 'projects',
        layout: 'list-rows',
        limit: 4,
        seeAllHref: '/proiecte',
        seeAllLabel: 'Toate proiectele',
      },

      // Zone 5 — Evenimente feature (paper-warm)
      {
        __component: 'sections.featured-list',
        eyebrow: 'EVENIMENT APROPIAT',
        heading: 'Pe scenă,',
        headingItalic: 'săptămâna viitoare.',
        accent: 'paper-warm',
        relation: 'events',
        layout: 'event-banner',
        limit: 1,
        filterBy: { eventStatus: 'viitor' },
        seeAllHref: '/evenimente',
        seeAllLabel: 'Toate evenimentele',
      },

      // Zone 6 — Magazin feature (paper)
      {
        __component: 'sections.featured-list',
        eyebrow: 'MAGAZIN',
        heading: 'Cărți, cursuri și instrumente',
        headingItalic: 'de transformare.',
        subheading:
          'De la cartea bestseller la programe digitale și agenți AI care duc cercetarea în viața de zi cu zi.',
        accent: 'paper',
        relation: 'products',
        layout: 'grid',
        limit: 3,
        filterBy: { featured: true },
        seeAllHref: '/magazin',
        seeAllLabel: 'Vezi tot magazinul',
      },

      // Zone 7 — Closing CTA + newsletter (navy)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Ce vezi tu nu e doar un creier.',
        headingItalic: 'E o viață.',
        subtext:
          'Newsletter săptămânal — un eseu scurt, un episod nou de podcast, un eveniment care merită. Fără spam. Vreodată.',
        buttonLabel: 'Abonează-te',
        placeholder: 'Adresa ta de email',
        accent: 'navy-deep',
        formId: 'home',
      },
    ],
  })
}
