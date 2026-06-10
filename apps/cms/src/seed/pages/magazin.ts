import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedMagazinPage(strapi: Core.Strapi): Promise<void> {
  const heroVisual = await uploadFile(
    strapi,
    docPath('7. Magazin', 'KV_2560_1252_VERUVIRS_NE_DEPRESIA_DESKTOP_V2.jpg'),
    { alt: 'Costin Dămășaru ținând reprezentarea 3D a creierului' }
  )

  const bookCover = await uploadFile(
    strapi,
    docPath('7. Magazin', 'Creierul-este-superputerea-ta_Coperta-v02.jpg'),
    { alt: 'Creierul este superputerea ta — coperta cărții' }
  )

  const iasiStageImage = await uploadFile(
    strapi,
    docPath('7. Magazin', 'V-0148.jpg'),
    { alt: 'Costin Dămășaru pe scenă — atmosfera unei non-conferințe' }
  )

  await upsertSingleType(strapi, 'api::magazin-page.magazin-page', {
    seoTitle: 'Magazin Costin Dămășaru — cartea + evenimente',
    seoDescription:
      'Magazinul personal Costin Dămășaru — cartea „Creierul este superputerea ta" în 3 formate și biletele la evenimentele proprii. Acces direct la opera autorului.',
    sections: [
      // Zone 1 — Hero & Manifest (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'MAGAZIN',
        title: 'Ce pot să-ți',
        titleItalic: 'dau direct.',
        subtitle:
          '„Cartea pe care am scris-o. Întâlnirile pe care le organizez. Și multe alte lucruri pe care urmează să le împărtășesc."\n\nAici găsești rapid lucrurile pe care le construiesc pentru a fi accesibile tuturor. Cărți, întâlniri, materiale care ies din mâna mea ca autor și cercetător — totul într-un singur loc.\n\nLe pun aici din dorința de a oferi cât mai mult, sub cât mai multe forme. Pentru că dacă ce am de spus ajută măcar o persoană să se înțeleagă mai bine pe sine, înseamnă că mi-am făcut treaba.',
        accent: 'navy',
        media: heroVisual,
        mediaPosition: 'right',
        ctaButtons: [
          { label: 'Vezi cărțile', href: '#carti', variant: 'primary' },
          { label: 'Bilete evenimente', href: '#bilete', variant: 'outline' },
        ],
      },

      // Zone 2 — Cărți: 3 carduri (paper) — cards-grid `products` variant
      {
        __component: 'sections.cards-grid',
        eyebrow: 'CĂRȚI',
        heading: 'Cartea —',
        headingItalic: 'în trei formate.',
        lead:
          '„Aceeași carte. Trei feluri de a o avea. Fizic — pentru rafturi și subliniat cu pixul. E-book — pentru când vrei imediat. Audiobook — pentru când te plimbi."',
        accent: 'paper',
        columns: '3',
        variant: 'products',
        items: [
          {
            title: 'Creierul este superputerea ta',
            text: 'Cartea care explică, în limbaj accesibil, cum funcționează creierul tău și ce poți face concret ca să-l antrenezi. Bestseller Bookzone 2024. 89 lei',
            tag: 'Fizic · 224 pagini',
            iconImage: bookCover,
            href: 'https://bookzone.ro/p/creierul-este-superputerea-ta?utm_source=costindamasaru.ro&utm_medium=magazin&utm_campaign=carte_fizica',
          },
          {
            title: 'Creierul este superputerea ta',
            text: 'Aceeași carte, în format digital — PDF + EPUB, de citit pe orice device: laptop, tabletă, Kindle, telefon. Disponibil în curând.',
            tag: 'În curând',
            iconImage: bookCover,
          },
          {
            title: 'Creierul este superputerea ta',
            text: 'Cartea — citită de mine, capitol cu capitol. Pentru când vrei să o asculți la volan, la antrenament sau la plimbare. Lansare estimată — toamna 2026.',
            tag: 'În curând · listă de așteptare',
            iconImage: bookCover,
            href: '/carte#audiobook',
          },
        ],
      },

      // Zone 3 — Bilete evenimente: card mare Iași (paper-warm)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'BILETE EVENIMENTE',
        heading: 'Următoarea oprire —',
        headingItalic: 'Iași.',
        body:
          '„Prima non-conferință declarată sub brandul Costin Dămășaru. Detalii anunțate în iulie 2026, bilete deschise după."\n\nNon-conferință · Costin Dămășaru — **Iași — Septembrie 2026**\n\nPrima non-conferință declarată sub brandul meu. Vii cu întrebările tale, răspund pe loc — cu ce știu și ce nu știu. Fără PowerPoint, fără agendă bătută în cuie. Doar conversație directă cu sala.\n\n- 📍 Iași — locația exactă anunțată în iulie\n- 🗓 Septembrie 2026 — data exactă anunțată în iulie\n- 🎫 Bilete deschise când anunț locația\n- 👥 Capacitate limitată\n\n_Anunț prețul biletelor în iulie._\n\nLista de așteptare are acces prioritar la bilete când se deschid înscrierile.',
        image: iasiStageImage,
        imageCaption: 'Detalii anunțate în iulie 2026',
        imagePosition: 'left',
        accent: 'paper-warm',
        cta: {
          label: 'Anunță-mă când deschid biletele',
          href: '#iasi-waitlist',
          variant: 'outline',
        },
      },

      // Zone 4 — FAQ (paper)
      {
        __component: 'sections.faq-accordion',
        eyebrow: 'ÎNTREBĂRI FRECVENTE',
        heading: 'Ce mă întreabă',
        headingItalic: 'cititorii cel mai des.',
        accent: 'paper',
        items: [
          {
            question: 'Care e diferența între cartea fizică și e-book? Conținutul e identic?',
            answer:
              'Conținutul e identic — același text, aceleași 224 pagini, aceleași exemple. Diferența e doar de format și experiență. E-book-ul are link-uri active la referințe (în carte sunt note de subsol pe care nu poți să le accesezi), funcție de căutare, dimensiunea fontului ajustabilă. Cartea fizică e mai bună pentru subliniat, scris pe margine, dăruit cuiva.',
          },
          {
            question: 'Cum primesc e-book-ul după ce plătesc?',
            answer:
              'Imediat după ce plata e procesată, primești un email automat cu un link unic de download. Link-ul e valabil 7 zile și permite maxim 3 download-uri (suficient pentru a-l salva pe toate device-urile tale). Primești ambele formate — PDF (compatibil cu orice device) și EPUB (optim pentru Kindle, Apple Books, Kobo).',
          },
          {
            question: 'De ce nu vinzi cartea fizică direct, ci mă trimiți pe Bookzone?',
            answer:
              'Bookzone este distribuitorul oficial al cărții — au sistemul de logistică, plățile, livrarea către orice oraș din România în 1–3 zile. Dacă aș vinde cartea fizică direct de pe site-ul meu, aș dubla operațiunea (plicuri, plăți, retururi) fără să adaug valoare pentru tine. Pentru cartea fizică, Bookzone face mai bine treaba asta — eu mă concentrez pe produsele digitale unde pot oferi ceva în plus.',
          },
          {
            question: 'Ce înseamnă „listă de așteptare" pentru audiobook și bilete?',
            answer:
              'Înseamnă că primești un singur email în ziua în care lansez produsul respectiv — cu detalii, preț și acces prioritar la achiziție. Nu trimit alte emailuri între timp, nu îți vând altceva. Pentru biletele Iași, lista de așteptare are și acces prioritar față de public — cu 24–48 ore înainte de deschiderea înscrierilor.',
          },
          {
            question: 'Când deschizi biletele pentru Iași Septembrie 2026?',
            answer:
              'Detalii complete (locație exactă, dată, capacitate, preț) anunțate în iulie 2026. Biletele se deschid imediat după anunț — cei pe lista de așteptare primesc acces cu 24–48 ore înainte de public general.',
          },
          {
            question: 'Pot returna produsele? Pot primi factură pe firmă?',
            answer:
              'Pentru e-book: conform legislației române (OUG 34/2014, art. 16 lit. m), produsele digitale livrate prin download nu pot fi returnate după primul download. Pentru bilete evenimente: refund posibil până la 30 zile înainte de eveniment, conform termenilor de cumpărare. Pentru factură pe firmă: la checkout completezi datele firmei (CUI, adresă) în loc de datele personale. Factura ajunge automat pe email, emisă de Neuro Enhancement SRL — firma prin care funcționează magazinul.',
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
          '„Newsletter bilunar — articole noi din Idei, episoade de podcast, evenimente publice, și — important pentru tine — anunțuri pentru produse noi în magazin. Fără spam."',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        accent: 'navy-deep',
        formId: 'magazin',
      },
    ],
  })
}
