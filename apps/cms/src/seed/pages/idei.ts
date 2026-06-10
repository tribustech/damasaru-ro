import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedIdeiPage(strapi: Core.Strapi): Promise<void> {
  const authorPortrait = await uploadFile(
    strapi,
    docPath('4. Idei', 'idei_assets_pack_v2', 'img', 'costin-portret-bw.jpg'),
    { alt: 'Costin Dămășaru — portret alb-negru' }
  )

  // Hero visual: self-contained animated SVG ("impulsul electric devine sens" —
  // EEG waves flowing into sense particles). Navy background + IMPULS ELECTRIC / sens
  // labels are baked into the file, so the frontend just frames it. See the assets
  // README in Documentation/4. Idei/idei_assets_pack_v2.
  const heroVisual = await uploadFile(
    strapi,
    docPath('4. Idei', 'idei_assets_pack_v2', 'img', 'hero-impuls-sens.svg'),
    { alt: 'Impulsul electric devine sens — vizualizare animată a undelor EEG' }
  )

  await upsertSingleType(strapi, 'api::idei-page.idei-page', {
    seoTitle: 'Idei · Costin Dămășaru | Despre mintea care completează creierul',
    seoDescription:
      'Texte de Costin Dămășaru, cercetător în neuroștiințe aplicate, despre cum lucrează mintea și creierul împreună. Școală, suferință mintală, performanță, viață publică — prin lentila Sistemului Creier-Minte.',
    sections: [
      // Zone 1 — Hero declarativ (navy) — eyebrow + h1 split + subtitle italic + manifest body + stats strip 3
      {
        __component: 'sections.hero',
        eyebrow: 'IDEI',
        title: 'Despre mintea',
        titleItalic: 'care completează creierul.',
        subtitle:
          '„Texte despre școală, suferință mintală, performanță, viață publică — toate prin lentila a 7 ani de lucru cu Sistemul Creier-Minte. Și a unei vieți care încă încearcă să-și dea seama."',
        body:
          'Sunt cercetător în neuroștiințe aplicate. Văd creierul zilnic — pe qEEG, în Brain Map-uri, în pattern-uri. După 7 ani de practică și 18.000 de creiere analizate la Veruvis, ai crede că am ajuns la concluzia că totul e creier. Sau, dimpotrivă, că am dat-o pe spiritual și totul e doar minte.\n\nNiciuna dintre cele două. Creierul face — generează semnal, susține atenția, reglează emoția. Dar mintea aduce ce-i lipsește creierului: sensul, intenția, alegerea, narațiunea. Sunt doi parteneri într-un sistem. Niciunul nu e complet fără celălalt. Asta e teza care îmi organizează gândirea — și textele de aici.\n\nAici scriu despre școală, suferință mintală, performanță, viață publică, AI — despre orice mă frământă, dar întotdeauna prin această lentilă: cum lucrează mintea și creierul împreună, ce se întâmplă când unul îl trage înapoi pe celălalt, și ce putem face când vrem să-i punem să colaboreze. Persoana I, asumată — nu vreau să mă ascund în spatele științei.',
        accent: 'navy',
        media: heroVisual,
        mediaPosition: 'right',
        statsStrip: {
          accent: 'navy',
          items: [
            { value: '18.000+', label: 'CREIERE ANALIZATE', caption: null },
            { value: '7 ani', label: 'PRACTICĂ qEEG', caption: null },
            { value: '1 carte', label: 'PUBLICATĂ LA BOOKZONE', caption: null },
          ],
        },
      },

      // Zone 2 — Articole (paper) — featured mare + listă în grid 2 coloane
      {
        __component: 'sections.featured-list',
        eyebrow: 'TEXTE',
        heading: 'Ce am scris',
        headingItalic: 'până acum.',
        accent: 'paper',
        relation: 'articles',
        layout: 'featured-with-grid',
        limit: 9,
      },

      // Zone 3 — Despre autor (paper) — image-text-split cu portret B&W stânga + ghost CTA
      {
        __component: 'sections.image-text-split',
        eyebrow: 'CINE SCRIE',
        heading: 'Persoana I',
        headingItalic: 'asumată.',
        body:
          '„Sunt Costin Dămășaru. Cercetător în Neuroștiințe Aplicate, fondator Veruvis (primul centru integrat de qEEG/Brain Mapping din România) & Nircura (prima companie locală specializată în tehnologie fotobiomodulară-PBM), autor al cărții «Creierul este superputerea ta» (Bookzone, 2024), gazda podcast-ului «Ce\'ai la mansardă». Doctor în Management (ASE București), doctorand în Fizică (Universitatea Politehnică București), licențiat în Psihologie. Am studiat și la MIT (Boston), la Universidad Isabel I (Spania) și la Bert Hellinger Institute (Olanda). Lucrez cu Sistemul Creier-Minte — adică acolo unde impulsul electric devine sens."',
        image: authorPortrait,
        imagePosition: 'left',
        accent: 'paper',
        externalLinks: [
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/costindamasaru/', muted: false },
          { label: 'Google Scholar', href: 'https://scholar.google.com/', muted: false },
          { label: 'Wikipedia (în curând)', href: null, muted: true },
        ],
        cta: {
          label: 'Mai multe despre Costin',
          href: '/despre',
          variant: 'outline',
        },
      },

      // Zone 4 — Newsletter (navy-deep) — form inline rounded pill, tag source-idei-page
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Te anunț',
        headingItalic: 'când scriu următorul.',
        subtext:
          '„Newsletter bilunar — articole noi, episoade de podcast, evenimente publice, anunțuri din Veruvis. Fără spam. Niciodată."',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        fineprint: 'Te poți dezabona oricând. Adresa ta nu va fi împărtășită cu nimeni.',
        accent: 'navy-deep',
        formId: 'source-idei-page',
      },
    ],
  })
}
