import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedPodcastPage(strapi: Core.Strapi): Promise<void> {
  const coverArt = await uploadFile(
    strapi,
    docPath('3. Podcast', 'Grafica Socials/cover_A_3000x3000.png'),
    { alt: 'Ce’ai la Mansardă — cover art podcast' }
  )
  const hostPhoto = await uploadFile(
    strapi,
    docPath('3. Podcast', 'Foto Costin Damasaru.jpg'),
    { alt: 'Costin Dămășaru — gazda podcast-ului' }
  )

  await upsertSingleType(strapi, 'api::podcast-page.podcast-page', {
    seoTitle: 'Ce’ai la Mansardă — Podcast cu Costin Dămășaru',
    seoDescription:
      'Conversații neformatate despre creier, performanță și viața conștientă. Cu Costin Dămășaru — neurocercetător și fondator Veruvis.',
    sections: [
      // Zone 1 — Hero (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'PODCAST · SEZON 1',
        title: 'Ce’ai la Mansardă.',
        titleItalic: 'Conversații neformatate.',
        subtitle:
          'Conversații reale despre creier, performanță și viața conștientă. Cu Costin Dămășaru.',
        accent: 'navy',
        mediaPosition: 'right',
        media: coverArt,
        ctaButtons: [
          {
            label: 'Ascultă pe Spotify',
            href: 'https://open.spotify.com/show/placeholder-ceai-la-mansarda',
            variant: 'primary',
          },
          { label: 'Vezi episoadele', href: '#episoade', variant: 'outline' },
        ],
        statsStrip: {
          items: [
            { value: 'Sezonul 1', label: '6 EPISOADE', caption: null },
            { value: 'Bilunar', label: 'EPISOD NOU LA 2 SĂPTĂMÂNI', caption: null },
            { value: '30–60 min', label: 'DURATĂ MEDIE', caption: null },
          ],
        },
      },

      // Zone 2 — De ce acest podcast (paper, image-text-split)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'DE CE ACEST PODCAST',
        heading: 'Conversații pe care',
        headingItalic: 'nimeni nu le are.',
        accent: 'paper',
        imagePosition: 'right',
        image: coverArt,
        body:
          'Am ascultat sute de podcast-uri. Cele mai multe vând certitudini. Eu nu am certitudini de vândut. Am întrebări — și oameni interesanți cu care să le discut.\n\n«Ce’ai la Mansardă» e formula pe care o spui cuiva apropiat. Nu «cum te simți astăzi». Nu «ce mai faci». Ci: ce se întâmplă acum, în capul tău, real. Asta e ce caut în fiecare conversație.\n\nAm invitat oameni din lumi diferite — neuroștiință aplicată, AI, comunicare, business, credință, relații. Toți au un lucru în comun: au făcut munca de înțelegere a propriei minți. Au ce povesti.',
      },

      // Zone 3 — Sezonul 1 (paper, featured-list grid limit 6)
      {
        __component: 'sections.featured-list',
        eyebrow: 'SEZONUL 1 · 6 EPISOADE',
        heading: '6 conversații.',
        headingItalic: 'Un singur fir.',
        subheading:
          'De la momentul fondator la fondarea comunității. Pe drum: AI, comunicare, performanță sub presiune, credință și știință. Un sezon construit ca un arc narativ.',
        accent: 'paper',
        relation: 'podcast-episodes',
        layout: 'grid',
        limit: 6,
        seeAllHref: '/podcast#episoade',
        seeAllLabel: 'Vezi toate episoadele',
      },

      // Zone 4 — Platforme disponibile (paper-warm, cards-grid 4 cols)
      {
        __component: 'sections.cards-grid',
        eyebrow: 'DISPONIBIL PE TOATE PLATFORMELE',
        heading: 'Ascultă unde',
        headingItalic: 'îți place ție.',
        lead:
          'Spotify, Apple Podcasts, YouTube — sau în mașină pe drumul spre birou. Eu îmi fac partea, tu alegi ritmul.',
        accent: 'paper-warm',
        columns: '4',
        items: [
          {
            title: 'Spotify',
            text: 'Cea mai populară platformă pentru podcast-uri.',
            tag: 'FEATURED',
            href: 'https://open.spotify.com/show/placeholder-ceai-la-mansarda',
          },
          {
            title: 'Apple Podcasts',
            text: 'Pentru ecosistemul Apple.',
            href: 'https://podcasts.apple.com/ro/podcast/placeholder-ceai-la-mansarda',
          },
          {
            title: 'YouTube',
            text: 'Pentru cine preferă cu video.',
            href: 'https://www.youtube.com/@costindamasaru',
          },
          {
            title: 'Amazon Music',
            text: 'Cu abonament Prime.',
            href: 'https://music.amazon.com/podcasts/placeholder-ceai-la-mansarda',
          },
        ],
      },

      // Zone 5 — Subscribe CTA (navy)
      {
        __component: 'sections.cta-banner',
        eyebrow: '● COMUNITATE · #MINTEATREAZĂ',
        heading: 'Vrei să nu',
        headingItalic: 'ratezi nimic?',
        subtext:
          'La fiecare episod nou, trimit un email scurt — un insight nou, o întrebare de reflecție, episodul abia lansat. Nu e newsletter. E o scrisoare. Citești în 3 minute, te schimbi pentru o săptămână.',
        buttonLabel: 'Abonează-te în Spotify',
        buttonHref: 'https://open.spotify.com/show/placeholder-ceai-la-mansarda',
        accent: 'navy',
      },

      // Zone 6 — Despre gazdă (paper, image-text-split)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'DESPRE GAZDĂ',
        heading: 'Cine pune',
        headingItalic: 'întrebările.',
        accent: 'paper',
        imagePosition: 'left',
        image: hostPhoto,
        body:
          'Sunt Costin Dămășaru. Cercetător în neuroștiințe aplicate, fondator Veruvis & Nircura, autor al cărții «Creierul este superputerea ta». 7 ani de practică pe qEEG și Antrenamente Neuronale. Mii de creiere reale, cu probleme reale. Acesta e contextul din care pun întrebări.',
        cta: {
          label: 'Mai multe despre Costin',
          href: '/despre',
          variant: 'outline',
        },
      },

      // Zone 7 — Cel mai recent episod (paper-warm, featured-list layout=feature)
      {
        __component: 'sections.featured-list',
        eyebrow: 'EPISODUL CEL MAI RECENT',
        heading: 'Începe',
        headingItalic: 'de aici.',
        subheading:
          'Cel mai nou episod din «Ce’ai la Mansardă» — pus în prim-plan pentru când vrei să dai play imediat.',
        accent: 'paper-warm',
        relation: 'podcast-episodes',
        layout: 'feature',
        limit: 1,
        filterBy: { featured: true },
        seeAllHref: '/podcast#episoade',
        seeAllLabel: 'Toate episoadele',
      },

      // Zone 8 — Newsletter principal (navy-deep)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER PRINCIPAL',
        heading: 'Nu rata',
        headingItalic: 'ce scriu mai departe.',
        subtext:
          'Newsletter bilunar. Un eseu nou, episoade de podcast, evenimente publice, anunțuri din Veruvis. Fără spam. Niciodată.',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        accent: 'navy-deep',
        formId: 'podcast',
      },
    ],
  })
}
