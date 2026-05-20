import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedMagazinPage(strapi: Core.Strapi): Promise<void> {
  const heroVisual = await uploadFile(
    strapi,
    docPath('7. Magazin', 'KV_2560_1252_VERUVIRS_NE_DEPRESIA_DESKTOP_V2.jpg'),
    { alt: 'Costin Dămășaru ținând reprezentarea 3D a creierului' }
  )

  await upsertSingleType(strapi, 'api::magazin-page.magazin-page', {
    seoTitle: 'Magazin Costin Dămășaru — cartea și evenimentele',
    seoDescription:
      'Magazinul personal Costin Dămășaru — cartea „Creierul este superputerea ta" în 3 formate și biletele la evenimentele proprii. Acces direct la opera autorului.',
    sections: [
      // Zone 1 — Hero (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'MAGAZIN',
        title: 'Ce pot să-ți',
        titleItalic: 'dau direct.',
        subtitle:
          'Cartea pe care am scris-o. Întâlnirile pe care le organizez. Și multe alte lucruri pe care urmează să le împărtășesc.\n\nAici găsești rapid lucrurile pe care le construiesc pentru a fi accesibile tuturor — cărți, întâlniri, materiale care ies din mâna mea ca autor și cercetător, totul într-un singur loc. Le pun aici din dorința de a oferi cât mai mult, sub cât mai multe forme. Pentru că dacă ce am de spus ajută măcar o persoană să se înțeleagă mai bine pe sine, înseamnă că mi-am făcut treaba.',
        accent: 'navy',
        media: heroVisual,
        mediaPosition: 'right',
        ctaButtons: [
          { label: 'Vezi cărțile', href: '#carti', variant: 'primary' },
          { label: 'Evenimente apropiate', href: '#evenimente', variant: 'outline' },
        ],
      },

      // Zone 2 — Cărți: catalog (paper)
      {
        __component: 'sections.featured-list',
        eyebrow: 'CĂRȚI',
        heading: 'Cartea —',
        headingItalic: 'în trei formate.',
        subheading:
          'Aceeași carte. Trei feluri de a o avea. Fizic — pentru rafturi și subliniat cu pixul. E-book — pentru când vrei imediat. Audiobook — pentru când te plimbi.',
        accent: 'paper',
        relation: 'products',
        layout: 'grid',
        limit: 3,
        filterBy: null,
        seeAllHref: '/magazin',
        seeAllLabel: null,
      },

      // Zone 3 — Evenimente apropiate (paper-warm)
      {
        __component: 'sections.featured-list',
        eyebrow: 'BILETE EVENIMENTE',
        heading: 'Evenimente',
        headingItalic: 'apropiate.',
        subheading:
          'Prima non-conferință declarată sub brandul Costin Dămășaru. Detalii anunțate în iulie 2026, bilete deschise după.',
        accent: 'paper-warm',
        relation: 'products',
        layout: 'grid',
        limit: 3,
        filterBy: null,
        seeAllHref: '/evenimente',
        seeAllLabel: 'Toate evenimentele',
      },

      // Zone 4 — FAQ (paper)
      {
        __component: 'sections.faq-accordion',
        eyebrow: 'ÎNTREBĂRI FRECVENTE',
        heading: 'Ce mă întreabă',
        headingItalic: 'cititorii cel mai des.',
        intro:
          'Răspunsuri scurte la întrebările care apar de fiecare dată când cineva cumpără ceva de aici. Dacă nu găsești ce cauți, scrie-mi pe pagina de contact.',
        accent: 'paper',
        items: [
          {
            question: 'Care e diferența între cartea fizică și e-book? Conținutul e identic?',
            answer:
              'Conținutul e identic — același text, aceleași 224 de pagini, aceleași exemple. Diferența e doar de format și experiență. E-book-ul are link-uri active la referințe, funcție de căutare, dimensiunea fontului ajustabilă. Cartea fizică e mai bună pentru subliniat, scris pe margine, dăruit cuiva.',
          },
          {
            question: 'Cum primesc e-book-ul după ce plătesc?',
            answer:
              'Imediat după ce plata e procesată, primești un email automat cu un link unic de download. Link-ul e valabil 7 zile și permite maxim 3 download-uri. Primești ambele formate — PDF (compatibil cu orice device) și EPUB (optim pentru Kindle, Apple Books, Kobo).',
          },
          {
            question: 'De ce nu vinzi cartea fizică direct, ci mă trimiți pe Bookzone?',
            answer:
              'Bookzone este distribuitorul oficial al cărții — au sistemul de logistică, plățile, livrarea către orice oraș din România în 1-3 zile. Dacă aș vinde cartea fizică direct de pe site-ul meu, aș dubla operațiunea fără să adaug valoare pentru tine. Pentru cartea fizică, Bookzone face mai bine treaba asta — eu mă concentrez pe produsele digitale, unde pot oferi ceva în plus.',
          },
          {
            question: 'Ce înseamnă lista de așteptare pentru audiobook, curs și bilete?',
            answer:
              'Înseamnă că primești un singur email în ziua în care lansez produsul respectiv — cu detalii, preț și acces prioritar la achiziție. Nu trimit alte emailuri între timp, nu îți vând altceva. Pentru curs și bilete Iași, lista de așteptare are și preț preferențial față de public — un mic mulțumesc pentru încrederea acordată în avans.',
          },
          {
            question: 'Când deschizi biletele pentru Iași Septembrie 2026?',
            answer:
              'Detalii complete (locație exactă, dată, capacitate, preț) anunțate în iulie 2026. Biletele se deschid imediat după anunț — cei pe lista de așteptare primesc acces cu 24-48 de ore înainte de publicul general.',
          },
          {
            question: 'Pot returna produsele? Pot primi factură pe firmă?',
            answer:
              'Pentru e-book: conform legislației române (OUG 34/2014, art. 16 lit. m), produsele digitale livrate prin download nu pot fi returnate după prima descărcare. Pentru bilete evenimente: refund posibil până la 30 de zile înainte de eveniment, conform termenilor de cumpărare. Pentru factură pe firmă: la checkout completezi datele firmei (CUI, adresă) în loc de datele personale. Factura ajunge automat pe email, emisă de Veruvis Evolution SRL — firma prin care funcționează magazinul.',
          },
        ],
      },

      // Zone 5 — Newsletter (navy-deep)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Anunță-mă',
        headingItalic: 'când lansez ceva nou.',
        subtext:
          'Newsletter bilunar — articole noi din Idei, episoade de podcast, evenimente publice și — important pentru tine — anunțuri pentru produse noi în magazin. Fără spam.',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        accent: 'navy-deep',
        formId: 'magazin',
      },
    ],
  })
}
