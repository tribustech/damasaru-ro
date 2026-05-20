import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedIdeiPage(strapi: Core.Strapi): Promise<void> {
  const authorPortrait = await uploadFile(
    strapi,
    docPath('4. Idei', 'idei_assets_pack_v2', 'img', 'costin-portret-bw.jpg'),
    { alt: 'Costin Dămășaru — portret alb-negru' }
  )

  await upsertSingleType(strapi, 'api::idei-page.idei-page', {
    seoTitle: 'Idei · Costin Dămășaru | Despre mintea care completează creierul',
    seoDescription:
      'Texte de Costin Dămășaru, cercetător în neuroștiințe aplicate, despre cum lucrează mintea și creierul împreună. Școală, suferință mintală, performanță, viață publică — prin lentila Sistemului Creier-Minte.',
    sections: [
      // Zone 1 — Hero declarativ (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'IDEI',
        title: 'Despre mintea',
        titleItalic: 'care completează creierul.',
        subtitle:
          'Texte despre școală, suferință mintală, performanță, viață publică — toate prin lentila a 7 ani de lucru cu Sistemul Creier-Minte. Și a unei vieți care încă încearcă să-și dea seama.',
        accent: 'navy',
        mediaPosition: 'none',
        statsStrip: {
          eyebrow: null,
          heading: null,
          accent: 'navy',
          items: [
            { value: '18.000+', label: 'CREIERE ANALIZATE', caption: null },
            { value: '7 ani', label: 'PRACTICĂ qEEG', caption: null },
            { value: '1 carte', label: 'PUBLICATĂ LA BOOKZONE', caption: null },
          ],
        },
      },

      // Zone 2 — Articole (paper, featured-list grid)
      {
        __component: 'sections.featured-list',
        eyebrow: 'TEXTE',
        heading: 'Ce am scris',
        headingItalic: 'până acum.',
        subheading:
          'Eseuri scrise la persoana I, asumate — despre cum se vede lumea când o privești prin creier și prin minte în același timp. Cazuri din practică, comentarii pe educație, suferință mintală, AI, viață publică.',
        accent: 'paper',
        relation: 'articles',
        layout: 'grid',
        limit: 9,
        seeAllHref: '/idei',
        seeAllLabel: 'Toate articolele',
      },

      // Zone 3 — Despre autor (paper-warm, image-text-split)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'CINE SCRIE',
        heading: 'Persoana I',
        headingItalic: 'asumată.',
        body: '<p>Sunt Costin Dămășaru. Cercetător în Neuroștiințe Aplicate, fondator <strong>Veruvis</strong> (primul centru integrat de qEEG/Brain Mapping din România) și <strong>Nircura</strong> (prima companie locală specializată în tehnologie fotobiomodulară-PBM), autor al cărții <em>Creierul este superputerea ta</em> (Bookzone, 2024), gazda podcast-ului <em>Ce&apos;ai la mansardă</em>.</p><p>Doctor în Management (ASE București), doctorand în Fizică (Universitatea Politehnică București), licențiat în Psihologie. Am studiat și la MIT (Boston), la Universidad Isabel I (Spania) și la Bert Hellinger Institute (Olanda).</p><p>Lucrez cu Sistemul Creier-Minte — adică acolo unde impulsul electric devine sens.</p>',
        image: authorPortrait,
        imagePosition: 'left',
        accent: 'paper-warm',
        cta: {
          label: 'Mai multe despre Costin',
          href: '/despre',
          variant: 'outline',
        },
      },

      // Zone 4 — Newsletter (navy-deep)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Te anunț',
        headingItalic: 'când scriu următorul.',
        subtext:
          'Newsletter bilunar — articole noi, episoade de podcast, evenimente publice, anunțuri din Veruvis. Fără spam. Niciodată.',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        accent: 'navy-deep',
        formId: 'idei',
      },
    ],
  })
}
