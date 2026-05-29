import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedMediaPage(strapi: Core.Strapi): Promise<void> {
  const heroPortrait = await uploadFile(
    strapi,
    docPath('8. Media', 'V-0301.jpg'),
    { alt: 'Costin Dămășaru — interviu cu microfon PRO TV la stand' }
  )

  // Press kit downloads — Kit_Bio is empty (no PDFs yet), so we surface the 4
  // press portraits as the downloadable assets. Bio PDFs are flagged in the
  // intro copy with a fallback to contact@damasaru.ro.
  const portret1Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_1.jpg'),
    { alt: 'Costin Dămășaru — portret presă 1' }
  )
  const portret2Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_2.jpg'),
    { alt: 'Costin Dămășaru — portret presă 2' }
  )
  const portret3Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_3.jpg'),
    { alt: 'Costin Dămășaru — portret presă 3' }
  )
  const portret4Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_4.jpg'),
    { alt: 'Costin Dămășaru — portret presă 4' }
  )

  const downloadItems = [
    {
      id: portret1Id,
      label: 'Foto portret 1 (JPG)',
      description: 'Portret presă high-res — orientare verticală, fundal neutru.',
      group: 'Foto presă',
    },
    {
      id: portret2Id,
      label: 'Foto portret 2 (JPG)',
      description: 'Portret presă high-res — alternativ, expresie deschisă.',
      group: 'Foto presă',
    },
    {
      id: portret3Id,
      label: 'Foto portret 3 (JPG)',
      description: 'Portret presă high-res — context editorial.',
      group: 'Foto presă',
    },
    {
      id: portret4Id,
      label: 'Foto portret 4 (JPG)',
      description: 'Portret presă high-res — variantă conferință.',
      group: 'Foto presă',
    },
  ]
    .filter((d): d is typeof d & { id: number } => d.id !== null)
    .map(({ id, label, description, group }) => ({
      label,
      description,
      group,
      file: id,
    }))

  await upsertSingleType(strapi, 'api::media-page.media-page', {
    seoTitle: 'Media — Costin Dămășaru | TV, Podcast, Reviste',
    seoDescription:
      'Toate aparițiile publice ale lui Costin Dămășaru — 83 de interviuri TV, podcasturi, articole și emisiuni. Cele mai notabile conversații + reviste.',
    sections: [
      // ZONE 1 — Hero (navy) with PRO TV interview portrait
      {
        __component: 'sections.hero',
        eyebrow: 'MEDIA',
        title: 'Toate aparițiile',
        titleItalic: 'într-un singur loc.',
        subtitle:
          '„83 de apariții publice — la televiziuni, în podcasturi, în reviste — adunate aici, ca să găsești ușor ce te interesează."',
        accent: 'navy',
        mediaPosition: 'right',
        media: heroPortrait,
      },

      // ZONE 2 — Stat strip (paper) — values + labels per mockup
      {
        __component: 'sections.stats-strip',
        accent: 'paper',
        items: [
          { value: '83', label: 'APARIȚII DOCUMENTATE', caption: null },
          { value: '40+', label: 'CANALE MEDIA DIFERITE', caption: null },
          { value: '3', label: 'COSTIN · VERUVIS · VERUVIS KIDS', caption: null },
        ],
      },

      // ZONE 3 — Logo wall „Publicații de referință" (paper).
      // No SVG/logo assets exist for the 8 outlets, so we use cards-grid
      // (default variant) with outlet name + count + scurtă descriere — same
      // information density as the mockup logo cells.
      {
        __component: 'sections.cards-grid',
        eyebrow: 'FEATURED',
        heading: 'Publicații',
        headingItalic: 'de referință.',
        lead:
          '„Cele mai prestigioase locuri unde s-a vorbit despre proiectele mele sau cu mine direct."',
        accent: 'paper',
        columns: '4',
        variant: 'default',
        items: [
          {
            title: 'Forbes România',
            text: 'CEE Forum 2023 · 24 pentru 2024 — proiectul editorial despre creierul uman optimizat.',
            tag: '2 prezențe',
          },
          {
            title: 'PRO TV',
            text: 'GoTech World · Vorbește Lumea — apariții TV repetate pe subiecte de neuroștiință aplicată.',
            tag: '3 apariții',
          },
          {
            title: 'HotNews',
            text: 'Interviu detaliat despre Brain Mapping & BCI și tehnologiile de optimizare a creierului.',
            tag: '1 interviu',
          },
          {
            title: 'Ziarul Financiar',
            text: 'Business Magazin · ZF Live · Business Hi-Tech — interviuri antreprenoriale.',
            tag: '3 articole',
          },
          {
            title: 'Adevărul',
            text: 'Adevărul Live · interviu TV despre toxicitatea din viața noastră.',
            tag: '2 prezențe',
          },
          {
            title: 'Capital + EVZ',
            text: 'Gala Top Performeri în Sănătate 2023 — Veruvis premiat pentru contribuția la dezvoltarea medicinei.',
            tag: 'Premiat 2023',
          },
          {
            title: 'TVR',
            text: 'Eu Pot · Punctul Critic · Un doctor pentru dumneavoastră · TVRi — emisiuni publice de profunzime.',
            tag: '5 emisiuni',
          },
          {
            title: 'Wall-Street.ro',
            text: 'Mențiuni multiple pe verticala antreprenoriat și inovație — tag autor dedicat.',
            tag: 'Mențiuni multiple',
          },
        ],
      },

      // ZONE 4 — Cele mai notabile conversații (paper-warm) — top 8 cu thumbnail YouTube
      {
        __component: 'sections.featured-list',
        eyebrow: 'TOP APARIȚII',
        heading: 'Cele mai notabile',
        headingItalic: 'conversații.',
        subheading:
          '„Conversațiile mari — Măruță, Mihai Morar, podcasturi și televiziuni cu cea mai mare audiență."',
        accent: 'paper-warm',
        relation: 'press-mentions',
        layout: 'grid',
        limit: 8,
        filterBy: { featured: true },
      },

      // ZONE 4a — Filozofia mea (navy interlude) — quote autentic Costin
      {
        __component: 'sections.quote-large',
        eyebrow: 'FILOZOFIA MEA',
        quote:
          '„Atunci când vei înțelege propria relație creier–minte, te vei opri din a te lupta cu tine."',
        attribution: 'COSTIN DĂMĂȘARU',
        accent: 'navy',
      },

      // ZONE 4b — Pe prima pagină (paper) — 5 reviste cover story
      {
        __component: 'sections.featured-list',
        eyebrow: 'PRINT · REVISTE',
        heading: 'Pe prima',
        headingItalic: 'pagină.',
        subheading:
          '„Interviuri ample, editoriale dedicate — în publicațiile de business și lifestyle din România."',
        accent: 'paper',
        relation: 'press-mentions',
        layout: 'grid',
        limit: 6,
        filterBy: { type: 'magazine' },
      },

      // ZONE 5 — Restul aparițiilor (paper) — carousel marquee
      {
        __component: 'sections.featured-list',
        eyebrow: 'ARHIVA',
        heading: 'Restul aparițiilor —',
        headingItalic: '58 colaborări.',
        subheading:
          '„Trece mouse-ul peste un card ca să-l oprești. Click pe el ca să-l deschizi."',
        accent: 'paper',
        relation: 'press-mentions',
        layout: 'marquee',
        limit: 24,
      },

      // ZONE 5b — Arhiva completă CTA (navy mega-banner)
      {
        __component: 'sections.cta-banner',
        eyebrow: 'ARHIVA COMPLETĂ',
        heading: 'Vrei să vezi toate cele 83 de apariții',
        headingItalic: 'ordonate cu filtre?',
        subtext:
          '„Toate aparițiile sortabile pe Tip (TV, Podcast, Publicație, Radio, Evenimente) și pe Brand (Costin, Veruvis, Veruvis Kids). Cu căutare în titluri."',
        buttonLabel: 'Deschide arhiva completă →',
        buttonHref: '/media/arhiva',
        accent: 'navy',
      },

      // ZONE 6 — Press Kit „La îndemână" (paper)
      {
        __component: 'sections.downloads-list',
        eyebrow: 'PRESS KIT',
        heading: 'La',
        headingItalic: 'îndemână.',
        intro:
          '„Foto, bio și contact direct, pregătite pentru orice material despre mine." Pentru bio (scurt 50 cuv. · mediu 150 cuv. · extins 400 cuv.) în PDF sau pentru contact presă, scrie pe contact@damasaru.ro — răspund în maxim 24 ore în zilele lucrătoare.',
        accent: 'paper',
        items: downloadItems,
      },

      // ZONE 7 — Newsletter (navy-deep)
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
