import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedMediaPage(strapi: Core.Strapi): Promise<void> {
  // Z1 hero portrait — Costin in PRO TV interview at the GoTech World stand.
  const heroPortrait = await uploadFile(
    strapi,
    docPath('8. Media', 'V-0301.jpg'),
    { alt: 'Costin Dămășaru — interviu cu microfon PRO TV la stand' }
  )

  // Z6 press kit — download files (Foto presă ZIP, bio PDF) are attached per-card
  // via the CMS media library, not the seed, so reseeds never clobber edited
  // content. Cards seed with no file; the bio card stays a mailto fallback until
  // a PDF is uploaded.

  await upsertSingleType(strapi, 'api::media-page.media-page', {
    seoTitle: 'Media — Costin Dămășaru | TV, Podcast, Reviste',
    seoDescription:
      'Toate aparițiile publice ale lui Costin Dămășaru — 82 de interviuri TV, podcasturi, articole și emisiuni. Cele mai notabile conversații + reviste.',
    sections: [
      // ── Z1 — Hero & Manifest (NAVY) ──────────────────────────────────────
      {
        __component: 'sections.media-hero',
        eyebrow: 'MEDIA',
        title: 'Toate aparițiile',
        titleItalic: 'într-un singur loc.',
        subtitle:
          '„82 de apariții publice — la televiziuni, în podcasturi, în reviste — adunate aici, ca să găsești ușor ce te interesează."',
        body:
          '„De-a lungul anilor am fost invitat în multe locuri — TV, radio, podcasturi, reviste. De multe ori discuțiile au fost despre Veruvis sau Veruvis Kids, alteori despre experiențele mele personale. Aici găsești tot, fără să mai cauți pe internet."',
        badgeLabel: 'ÎN INTERVIU',
        accent: 'navy',
        media: heroPortrait,
      },

      // ── Z2 — Stat strip (PAPER) — 82 · 40+ · 3 ──────────────────────────
      {
        __component: 'sections.media-stat-strip',
        accent: 'paper',
        items: [
          { value: '82', label: 'APARIȚII DOCUMENTATE' },
          { value: '40+', label: 'CANALE MEDIA DIFERITE' },
          { value: '3', label: 'COSTIN · VERUVIS · VERUVIS KIDS' },
        ],
      },

      // ── Z3 — Logo Wall featured (PAPER) — 8 wordmark-uri SVG monocrome ───
      {
        __component: 'sections.media-logo-wall',
        eyebrow: 'FEATURED',
        heading: 'Publicații',
        headingItalic: 'de referință.',
        lead:
          '„Cele mai prestigioase locuri unde s-a vorbit despre proiectele mele sau cu mine direct."',
        accent: 'paper',
        items: [
          {
            svgKey: 'protv',
            outletName: 'PRO TV',
            count: '3 apariții',
            description: 'Reportaj GoTech World + Vorbește Lumea.',
            href: '/media/arhiva',
          },
          {
            svgKey: 'forbes',
            outletName: 'Forbes România',
            count: '2 prezențe',
            description: 'CEE Forum 2023 + 24 pentru 2024.',
            href: '/media/arhiva',
          },
          {
            svgKey: 'hotnews',
            outletName: 'HotNews.ro',
            count: '1 interviu',
            description: 'Interviu detaliat Brain Mapping & BCI.',
            href: '/media/arhiva',
          },
          {
            svgKey: 'zf',
            outletName: 'Ziarul Financiar',
            count: '3 articole',
            description: 'Business Magazin · ZF Live · Business Hi-Tech.',
            href: '/media/arhiva',
          },
          {
            svgKey: 'adevarul',
            outletName: 'Adevărul Live',
            count: '1 interviu',
            description: 'Interviu despre toxicitatea din viața noastră.',
            href: '/media/arhiva',
          },
          {
            svgKey: 'capital',
            outletName: 'Capital + EVZ',
            count: 'Premiat 2023',
            description: 'Gala Top Performeri în Sănătate 2023.',
            href: '/media/arhiva',
          },
          {
            svgKey: 'tvr',
            outletName: 'TVR',
            count: '5 emisiuni',
            description: 'Eu Pot · Punctul Critic · Un doctor pentru dumneavoastră.',
            href: '/media/arhiva',
          },
          {
            svgKey: 'wallstreet',
            outletName: 'Wall-Street.ro',
            count: 'Mențiuni multiple',
            description: 'Tag autor dedicat — antreprenoriat & inovație.',
            href: '/media/arhiva',
          },
        ],
      },

      // ── Z4 — Cele mai notabile conversații (PAPER-WARM) — 8 featured ─────
      {
        __component: 'sections.media-featured',
        eyebrow: 'TOP APARIȚII',
        heading: 'Cele mai notabile',
        headingItalic: 'conversații.',
        subheading:
          '„Conversațiile mari — Măruță, Mihai Morar, podcasturi și televiziuni cu cea mai mare audiență."',
        accent: 'paper-warm',
        relation: 'press-mentions',
        limit: 8,
        filterBy: { featured: true },
      },

      // ── Z4a — Filozofia mea (NAVY interlude) ────────────────────────────
      {
        __component: 'sections.quote-large',
        eyebrow: 'FILOZOFIA MEA',
        quote:
          '„Atunci când vei înțelege propria relație creier–minte, te vei opri din a te lupta cu tine."',
        attribution: 'COSTIN DĂMĂȘARU',
        accent: 'navy',
      },

      // ── Z4b — Pe prima pagină (PAPER) — 5 reviste ───────────────────────
      {
        __component: 'sections.media-magazines',
        eyebrow: 'PRINT · REVISTE',
        heading: 'Pe prima',
        headingItalic: 'pagină.',
        subheading:
          '„Interviuri ample, editoriale dedicate — în publicațiile de business și lifestyle din România."',
        accent: 'paper',
        relation: 'press-mentions',
        limit: 5,
        filterBy: { isMagazine: true },
      },

      // ── Z5 — Carousel Marquee (PAPER) — restul aparițiilor ──────────────
      {
        __component: 'sections.media-marquee',
        eyebrow: 'ARHIVA',
        heading: 'Restul aparițiilor —',
        headingItalic: '58 colaborări.',
        subheading:
          '„Trece mouse-ul peste un card ca să-l oprești. Click pe el ca să-l deschizi."',
        accent: 'paper',
        relation: 'press-mentions',
        limit: 60,
        filterBy: { featured: false, isMagazine: false },
      },

      // ── Z5b — Arhiva completă CTA (NAVY mega-banner) ────────────────────
      {
        __component: 'sections.cta-banner',
        eyebrow: 'ARHIVA COMPLETĂ',
        heading: 'Vrei să vezi toate cele 82 de apariții',
        headingItalic: 'ordonate cu filtre?',
        subtext:
          '„Toate aparițiile sortabile pe Tip (TV, Podcast, Publicație, Radio, Evenimente) și pe Brand (Costin, Veruvis, Veruvis Kids). Cu căutare în titluri."',
        buttonLabel: 'Deschide arhiva completă →',
        buttonHref: '/media/arhiva',
        accent: 'navy',
      },

      // ── Z6 — Press Kit „La îndemână" (PAPER) ────────────────────────────
      {
        __component: 'sections.media-press-kit',
        eyebrow: 'PRESS KIT',
        heading: 'La',
        headingItalic: 'îndemână.',
        intro:
          '„Foto, bio și contact direct, pregătite pentru orice material despre mine." Pentru bio (scurt 50 cuv. · mediu 150 cuv. · extins 400 cuv.) în PDF sau pentru contact presă, scrie pe contact@damasaru.ro — răspund în maxim 24 ore în zilele lucrătoare.',
        accent: 'paper',
        items: [
          {
            iconKey: 'document',
            title: 'Bio Costin (3 versiuni)',
            description:
              '„Scurt (50 cuvinte), mediu (150 cuvinte) și extins (400 cuvinte), pregătite pentru introduceri, articole standard și profile de interviu. Disponibile la cerere pe contact@damasaru.ro."',
          },
          {
            iconKey: 'camera',
            title: 'Foto presă (high-res)',
            description:
              '„Portrete high-res RGB, 300 DPI, cu caption și credit fotograf — descarcă-le mai jos și folosește-le pentru orice material despre mine."',
          },
          {
            iconKey: 'mail',
            title: 'Contact presă direct',
            description:
              '„Scrie pe contact@damasaru.ro pentru interviuri, comentarii de specialitate sau materiale. Răspund în maxim 24 de ore în zilele lucrătoare."',
          },
        ],
      },

      // ── Z7 — Newsletter (NAVY-DEEP) ─────────────────────────────────────
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Vrei să afli',
        headingItalic: 'când apare ceva nou?',
        subtext:
          '„Newsletter bilunar — articole noi din Idei, episoade de podcast, apariții publice noi și — important pentru tine — anunțuri pentru produse noi în magazin. Fără spam."',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        accent: 'navy-deep',
        formId: 'media',
      },
    ],
  })
}
