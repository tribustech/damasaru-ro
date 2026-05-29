import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedPodcastPage(strapi: Core.Strapi): Promise<void> {
  const coverArt = await uploadFile(
    strapi,
    docPath('3. Podcast', 'Grafica Socials/cover_A_3000x3000.png'),
    { alt: 'Ce’ai la Mansardă — cover art podcast' }
  )
  // Same B&W portrait used on /carte (Despre autor) — consistency across personal pages
  const hostPhoto = await uploadFile(
    strapi,
    docPath('2. Cartea', '01_Foto_Costin_Damasaru.jpg'),
    { alt: 'Costin Dămășaru — gazda podcast-ului' }
  )

  await upsertSingleType(strapi, 'api::podcast-page.podcast-page', {
    seoTitle: 'Ce’ai la Mansardă — Podcast cu Costin Dămășaru',
    seoDescription:
      'Conversații reale despre creier, performanță și viața conștientă. Cu Costin Dămășaru — neurocercetător aplicat și fondator Veruvis.',
    sections: [
      // Zone 1 — Hero (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'PODCAST · SEZON 1',
        title: 'Ce’ai la',
        titleItalic: 'mansardă.',
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
          {
            label: 'Vezi pe YouTube',
            href: 'https://www.youtube.com/@costindamasaru',
            variant: 'outline',
          },
        ],
        statsStrip: {
          items: [
            { value: 'Sezonul 1', label: '6 EPISOADE', caption: null },
            { value: 'Bilunar', label: 'EPISOD NOU LA 2 SĂPTĂMÂNI', caption: null },
            { value: '30–60 min', label: 'DURATĂ MEDIE', caption: null },
          ],
        },
      },

      // Zone 2 — De ce acest podcast (paper, image-text-split no-image + pull-quote)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'DE CE ACEST PODCAST',
        heading: 'Conversații pe care',
        headingItalic: 'nimeni nu le are.',
        accent: 'paper',
        imagePosition: 'right',
        image: null,
        body:
          '„Am ascultat sute de podcast-uri. Cele mai multe vând certitudini. Eu nu am certitudini de vândut. Am întrebări — și oameni interesanți cu care să le discut."\n\n„«Ce’ai la Mansardă» e formula pe care o spui cuiva apropiat. Nu «cum te simți astăzi». Nu «ce mai faci». Ci: ce se întâmplă acum, în capul tău, real. Asta e ce caut în fiecare conversație."\n\n„Am invitat oameni din lumi diferite — neuroștiință aplicată, AI, comunicare, business, credință, relații. Toți au un lucru în comun: au făcut munca de înțelegere a propriei minți. Au ce povesti."\n\n> Nu e un podcast despre creier. E o invitație spre o viață mai conștientă.',
      },

      // Zone 3 — Sezonul 1 (paper, featured-list grid limit 6)
      {
        __component: 'sections.featured-list',
        eyebrow: 'SEZONUL 1 · 6 EPISOADE',
        heading: '6 conversații.',
        headingItalic: 'Un singur fir.',
        subheading:
          '„De la momentul fondator la fondarea comunității. Pe drum: AI, comunicare, performanță sub presiune, credință și știință. Un sezon construit ca un arc narativ."',
        accent: 'paper',
        relation: 'podcast-episodes',
        layout: 'grid',
        limit: 6,
      },

      // Zone 4 — Platforme disponibile (paper-warm, cards-grid platforms variant)
      {
        __component: 'sections.cards-grid',
        eyebrow: 'DISPONIBIL PE TOATE PLATFORMELE',
        heading: 'Ascultă unde',
        headingItalic: 'îți place ție.',
        lead:
          '„Spotify, Apple Podcasts, YouTube — sau în mașină pe drumul spre birou. Eu îmi fac partea, tu alegi ritmul."',
        accent: 'paper-warm',
        columns: '4',
        variant: 'platforms',
        items: [
          {
            title: 'Spotify',
            text: 'Cea mai populară platformă',
            tag: 'FEATURED',
            href: 'https://open.spotify.com/show/placeholder-ceai-la-mansarda',
          },
          {
            title: 'Apple Podcasts',
            text: 'Pentru ecosistemul Apple',
            href: 'https://podcasts.apple.com/ro/podcast/placeholder-ceai-la-mansarda',
          },
          {
            title: 'YouTube',
            text: 'Pentru cine preferă cu video',
            href: 'https://www.youtube.com/@costindamasaru',
          },
          {
            title: 'Amazon Music',
            text: 'Cu abonament Prime',
            href: 'https://music.amazon.com/podcasts/placeholder-ceai-la-mansarda',
          },
        ],
      },

      // Zone 5 — Mintea Trează community card (navy)
      {
        __component: 'sections.cta-banner',
        eyebrow: 'COMUNITATE · #MINTEATREAZĂ',
        heading: 'Mintea',
        headingItalic: 'Trează.',
        subtext:
          '„Oameni care vor să-și înțeleagă propriul creier și să trăiască mai conștient."\n\n„Podcastul e începutul. Comunitatea e ce urmează."\n\n„La fiecare episod nou, trimit un email scurt — un insight nou, o întrebare de reflecție, episodul abia lansat. Nu e newsletter. E o scrisoare. Citești în 3 minute, te schimbi pentru o săptămână."\n\n- Un email la fiecare episod nou (bilunar) — ne corespondăm\n- Acces prioritar la episoade noi (cu 48h înainte de publicare)\n- Resurse exclusive — primul ghid practic, în lucru\n- Invitații la sesiuni live (Q&A, în pregătire pentru Sezon 2)',
        buttonLabel: 'Fac parte din Mintea Trează',
        buttonHref: '/api/newsletter/mintea-treaza',
        accent: 'navy',
      },

      // Zone 6 — Despre gazdă (paper, image-text-split about-mini)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'DESPRE GAZDĂ',
        heading: 'Cine pune',
        headingItalic: 'întrebările.',
        accent: 'paper',
        imagePosition: 'left',
        image: hostPhoto,
        body:
          '„Sunt Costin Dămășaru. Neurocercetător aplicat, fondator Veruvis, autor al cărții «Creierul este superputerea ta». 7 ani de practică pe qEEG și antrenamente neuronale. Mii de creiere reale, în vieți reale. Acesta e contextul din care pun întrebări."',
        cta: {
          label: 'Mai multe despre Costin',
          href: '/despre',
          variant: 'outline',
        },
      },

      // Zone 7 — Cel mai recent episod (paper-warm, featured-list feature)
      {
        __component: 'sections.featured-list',
        eyebrow: 'EPISODUL CEL MAI RECENT',
        heading: 'Începe',
        headingItalic: 'de aici.',
        accent: 'paper-warm',
        relation: 'podcast-episodes',
        layout: 'feature',
        limit: 1,
        filterBy: { featured: true },
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
