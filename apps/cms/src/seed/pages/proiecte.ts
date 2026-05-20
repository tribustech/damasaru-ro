import type { Core } from '@strapi/strapi'
import { upsertSingleType } from '../utils'

export async function seedProiectePage(strapi: Core.Strapi): Promise<void> {
  await upsertSingleType(strapi, 'api::proiecte-page.proiecte-page', {
    seoTitle: 'Proiecte — Veruvis, Veruvis Kids, Nircura și Asociația | Costin Dămășaru',
    seoDescription:
      'Patru proiecte construite din lipsă reală: Veruvis (qEEG + Antrenamente Neuronale), Veruvis Kids (3–18 ani), Nircura (fotobiomodulare) și Asociația Română de Neurotehnologii Avansate.',
    sections: [
      // Zone 1 — Hero (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'PROIECTE',
        title: 'Ce am construit.',
        titleItalic: 'Și ce construiesc acum.',
        subtitle:
          'Patru proiecte, un singur fir comun: să facem accesibil ce e cunoscut în neuroștiințele aplicate — în România, pe limba oamenilor reali, pentru viețile lor reale.',
        accent: 'navy',
        mediaPosition: 'none',
        ctaButtons: [
          { label: 'Veruvis', href: '#veruvis', variant: 'outline' },
          { label: 'Veruvis Kids', href: '#veruvis-kids', variant: 'outline' },
          { label: 'Nircura', href: '#nircura', variant: 'outline' },
          { label: 'Asociația', href: '#asociatia', variant: 'outline' },
        ],
      },

      // Zone 2 — Featured list of projects (paper, feature layout — long-form rows)
      {
        __component: 'sections.featured-list',
        eyebrow: 'CELE 4 PROIECTE',
        heading: 'Construite, fiecare,',
        headingItalic: 'dintr-o lipsă reală.',
        subheading:
          '„Nu construiesc proiecte pentru a avea proiecte. Le construiesc pentru că am simțit, fiecare în parte, o lipsă reală." Mai jos, pe rând — Veruvis, Veruvis Kids, Nircura și Asociația.',
        accent: 'paper',
        relation: 'projects',
        layout: 'feature',
        limit: 4,
        seeAllHref: null,
        seeAllLabel: null,
      },

      // Zone 3 — Press / media coverage (paper-warm, cards-grid fallback since logo-wall requires images)
      {
        __component: 'sections.cards-grid',
        eyebrow: 'PRESS',
        heading: 'Despre noi',
        headingItalic: 's-a vorbit.',
        lead: 'Publicații print și digital care au scris despre proiectele noastre — Veruvis, Veruvis Kids și Nircura. O selecție din cele mai relevante.',
        accent: 'paper-warm',
        columns: '4',
        items: [
          {
            tag: 'BUSINESS',
            title: 'Forbes',
            text: 'Forbes Romania — Costin Dămășaru speaker la Forbes Romania. Forbes Kids România — Veruvis Kids partener la „Părinte, încotro? Back to School" (sept 2023).',
          },
          {
            tag: 'TV',
            title: 'ProTV',
            text: 'iLikeIT — „Neuroștiința, tehnologia S.F. folosită și în România pentru vindecarea unor afecțiuni". Reportaj despre tratament autism la copii prin metoda Veruvis.',
            href: 'https://stirileprotv.ro/stiri/ilikeit/neurostiinta-tehnologia-sf-folosita-si-in-romania-pentru-vindecarea-unor-afectiuni-si-la-antrenamentul-mintii.html',
          },
          {
            tag: 'TV',
            title: 'Antena 3 CNN',
            text: 'Income Summer Edition — discuție cu Adrian Maniuțiu despre inteligența artificială, neuroștiință, oportunități și amenințări, etică și umanitate.',
            href: 'https://www.antena3.ro/tag/costin-damasaru-367829.html',
          },
          {
            tag: 'DIGITAL',
            title: 'HotNews',
            text: '„Cum ne poate ajuta tehnologia Brain Mapping–Brain Computer Interface să ne optimizăm creierul" — interviu extins despre BM-BCI și Metoda Veruvis.',
            href: 'https://hotnews.ro/dr-psih-drd-costin-damasaru-fondatorul-veruvis-cum-ne-poate-ajuta-tehnologia-brain-mapping-brain-computer-interface-sa-ne-optimizam-creierul-17675',
          },
          {
            tag: 'DIGITAL',
            title: 'Adevărul',
            text: 'Adevărul Live — „Cum să ne vindecăm de toxicitatea din viața noastră, cu Costin Dămășaru, CEO Veruvis". Interviu video.',
            href: 'https://adevarul.ro/adevarul-live/cum-sa-ne-vindecam-de-toxicitatea-din-viata-2323386.html',
          },
          {
            tag: 'BUSINESS',
            title: 'Ziarul Financiar',
            text: '„Tehnologii pentru optimizarea creierului" — Veruvis lucrează la sistem integrat ce va putea fi francizat, plus ZF Live despre optimizarea creierului unui manager.',
            href: 'https://www.zf.ro/business-hi-tech/costin-damasaru-fondator-veruvis-tehnologii-optimizarea-creierului-22115635',
          },
          {
            tag: 'BUSINESS',
            title: 'Capital',
            text: '„Tehnologia Brain Mapping și BCI, un ajutor de nădejde în combaterea bolilor mentale". Premiat la Top 100 Performeri din Sănătate, Gala Capital 2023.',
            href: 'https://www.capital.ro/tehnologia-brain-mapping-si-brain-computer-interface-un-ajutor-de-nadejde-in-combaterea-bolilor-mentale.html',
          },
          {
            tag: 'BUSINESS',
            title: 'BusinessMagazin',
            text: '„Business pentru creier" — cum a ajuns un român să creeze un centru cu tehnologii și proceduri de neuroterapie. Plus interviu antreprenor cu cifre 2022.',
            href: 'https://www.businessmagazin.ro/actualitate/afaceri/business-pentru-creier-21574115',
          },
        ],
      },

      // Zone 4 — Newsletter (navy-deep)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'RĂMÂI APROAPE',
        heading: 'Vrei să afli',
        headingItalic: 'ce construiesc în continuare?',
        subtext:
          'Newsletter bilunar — proiecte noi, articole, episoade de podcast, evenimente publice. Inclusiv lansarea site-ului asociației. Te poți dezabona oricând. Adresa ta nu va fi împărtășită cu nimeni.',
        buttonLabel: 'Abonează-mă',
        placeholder: 'Adresa ta de email',
        accent: 'navy-deep',
        formId: 'proiecte',
      },
    ],
  })
}
