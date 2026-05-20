import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedMediaPage(strapi: Core.Strapi): Promise<void> {
  const heroPortrait = await uploadFile(
    strapi,
    docPath('8. Media', 'V-0301.jpg'),
    { alt: 'Costin Dămășaru — interviu cu microfon PRO TV' }
  )

  const featuredStoryImage = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_1.jpg'),
    { alt: 'Costin Dămășaru — portret presă' }
  )

  // Press kit downloads — we reuse the 4 press portraits as downloadable JPGs.
  // PDFs for bio (scurt/extins) don't exist yet — skip those items rather than
  // upload placeholders.
  const portret1Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_1.jpg'),
    { alt: 'Costin Dămășaru — portret 1' }
  )
  const portret2Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_2.jpg'),
    { alt: 'Costin Dămășaru — portret 2' }
  )
  const portret3Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_3.jpg'),
    { alt: 'Costin Dămășaru — portret 3' }
  )
  const portret4Id = await uploadFile(
    strapi,
    docPath('8. Media', 'Kit_Foto_Presa', 'Costin_Damasaru_Portret_4.jpg'),
    { alt: 'Costin Dămășaru — portret 4' }
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
    seoTitle: 'Media — Costin Dămășaru | TV, Podcast, Publicații, Radio',
    seoDescription:
      'Toate aparițiile publice ale lui Costin Dămășaru — interviuri TV, podcasturi, articole și emisiuni. Cu filtre pe brand și tip.',
    sections: [
      // Zone 1 — Hero (navy) with main portrait
      {
        __component: 'sections.hero',
        eyebrow: 'MEDIA',
        title: 'Toate aparițiile',
        titleItalic: 'într-un singur loc.',
        subtitle:
          '82 de apariții publice — la televiziuni, în podcasturi, în reviste — adunate aici, ca să găsești ușor ce te interesează.',
        accent: 'navy',
        mediaPosition: 'right',
        media: heroPortrait,
      },

      // Zone 2 — Stats strip (paper)
      {
        __component: 'sections.stats-strip',
        accent: 'paper',
        items: [
          { value: '50+', label: 'APARIȚII MEDIA', caption: null },
          { value: '10+', label: 'PODCASTURI', caption: null },
          { value: '3', label: 'TV-URI NAȚIONALE', caption: null },
        ],
      },

      // Zone 3 — Outlet wall (paper-warm) — cards-grid because logo-wall requires images we don't have
      {
        __component: 'sections.cards-grid',
        eyebrow: 'PUBLICAȚII ȘI POSTURI',
        heading: 'Unde am vorbit',
        headingItalic: 'în ultimii ani.',
        lead: 'O selecție din publicațiile și posturile care au găzduit conversații despre creier, performanță și sens.',
        accent: 'paper-warm',
        columns: '4',
        items: [
          { title: 'Pro TV', text: 'Reportaj GoTech World · Vorbește Lumea — apariții TV repetate pe subiecte de neuroștiință aplicată.' },
          { title: 'Digi24', text: 'Intervenții pe subiecte de sănătate mintală, performanță și educație.' },
          { title: 'TVR', text: 'Eu Pot · Punctul Critic · Un doctor pentru dumneavoastră — emisiuni publice de profunzime.' },
          { title: 'Forbes România', text: 'CEE Forum 2023 · proiectul editorial „24 pentru 2024" — viitorul creierului uman optimizat.' },
          { title: 'Adevărul', text: 'Interviu Adevărul Live despre toxicitatea din viața noastră și cum o demontăm.' },
          { title: 'HotNews', text: 'Interviu detaliat despre Brain Mapping-BCI și tehnologiile de optimizare a creierului.' },
          { title: 'Ziarul Financiar', text: 'Business Magazin · ZF Live · Business Hi-Tech — interviuri antreprenoriale.' },
          { title: 'Republica', text: 'Eseuri și opinii despre educație, sănătate mintală și transformarea socială.' },
        ],
      },

      // Zone 4 — Featured story image-text-split (paper)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'POVESTEA DIN SPATELE APARIȚIILOR',
        heading: 'De ce vorbesc public',
        headingItalic: 'despre creier și viață.',
        accent: 'paper',
        imagePosition: 'right',
        image: featuredStoryImage,
        body: `De-a lungul anilor am fost invitat în multe locuri — TV, radio, podcasturi, reviste. De multe ori discuțiile au fost despre Veruvis sau Veruvis Kids, alteori despre experiențele mele personale. Aici găsești tot, fără să mai cauți pe internet.

Nu am început să apar public ca să fac PR. Am început fiindcă mulți oameni vin la mine cu aceleași întrebări — despre anxietate, despre burnout, despre cum funcționează creierul lor — și e mai eficient să răspund o dată, în public, decât de o sută de ori în privat.

Fiecare apariție de aici e o conversație reală: cu jurnaliști, cu antreprenori, cu părinți, cu cercetători. Le păstrez pe toate fiindcă, împreună, formează o hartă mai bună a ceea ce fac decât orice CV.`,
      },

      // Zone 5 — Press manifest text block (paper-warm)
      {
        __component: 'sections.text-block',
        eyebrow: 'FILOZOFIA MEA',
        heading: 'Atunci când vei înțelege propria relație creier–minte,',
        headingItalic: 'te vei opri din a te lupta cu tine.',
        accent: 'paper-warm',
        align: 'center',
        body: `Asta e ideea în jurul căreia se construiește, în diverse forme, fiecare interviu de mai jos.

Nu am vorbit niciodată despre creier în abstract. Am vorbit despre creierul tău, al meu, al copilului tău, al colegului care nu mai poate. Despre cum poate fi măsurat, înțeles și reantrenat. Despre faptul că suferința mintală nu e defect de caracter și că performanța nu ține de motivație.

Dacă ești jurnalist, producător sau organizator de conferințe — folosește presa de mai jos ca punct de plecare. Ceea ce caut, de fiecare dată, este o conversație onestă. Nu un slogan.`,
      },

      // Zone 6 — Magazine featured-list (paper)
      {
        __component: 'sections.featured-list',
        eyebrow: 'PE PRIMA PAGINĂ',
        heading: 'Reviste care au scris',
        headingItalic: 'cover story.',
        subheading:
          'Prezență confirmată în print — de la business mainstream la lifestyle și leadership.',
        accent: 'paper',
        relation: 'press-mentions',
        layout: 'grid',
        limit: 6,
        filterBy: { type: 'magazine' },
        seeAllHref: '/media/arhiva',
        seeAllLabel: 'Vezi arhiva completă',
      },

      // Zone 7 — All mentions marquee (navy)
      {
        __component: 'sections.featured-list',
        eyebrow: 'COLABORĂRI MEDIA',
        heading: 'Conversații recente',
        headingItalic: 'pe scurt.',
        subheading:
          'Cele mai notabile apariții TV, podcast și radio din ultimul an, în defilare continuă.',
        accent: 'navy',
        relation: 'press-mentions',
        layout: 'marquee',
        limit: 12,
      },

      // Zone 8 — Archive CTA (paper-warm)
      {
        __component: 'sections.cta-banner',
        eyebrow: 'PENTRU JURNALIȘTI',
        heading: 'Vrei să mă inviți',
        headingItalic: 'într-un interviu?',
        subtext:
          'Scrie-mi direct — răspund în 24-48 ore pe weekday. Pentru pregătire, descarcă bio-ul și foto-press din kit-ul de mai jos.',
        buttonLabel: 'Contactează-mă',
        buttonHref: '/contact',
        accent: 'paper-warm',
      },

      // Zone 9 — Press kit downloads (paper)
      {
        __component: 'sections.downloads-list',
        eyebrow: 'PRESS KIT',
        heading: 'La îndemână —',
        headingItalic: 'tot ce ai nevoie.',
        intro:
          'Materiale pregătite pentru presă, podcasturi și conferințe. Pentru bio scurt și extins în PDF, scrie pe contact@damasaru.ro — le trimit personal.',
        accent: 'paper',
        items: downloadItems,
      },

      // Zone 10 — Newsletter (navy-deep)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Rămâi aproape',
        headingItalic: 'de conversațiile importante.',
        subtext:
          'Newsletter săptămânal — o apariție recentă, un eseu nou, un eveniment care merită. Fără spam. Vreodată.',
        buttonLabel: 'Abonează-te',
        placeholder: 'Adresa ta de email',
        accent: 'navy-deep',
        formId: 'media',
      },
    ],
  })
}
