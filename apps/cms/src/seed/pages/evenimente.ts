import type { Core } from '@strapi/strapi'
import { upsertSingleType } from '../utils'

export async function seedEventsPage(strapi: Core.Strapi): Promise<void> {
  await upsertSingleType(strapi, 'api::events-page.events-page', {
    seoTitle: 'Evenimente · Costin Dămășaru — Speaker Neuroștiință Aplicată',
    seoDescription:
      'Conferințe, podcasturi, lecturi internaționale. Pe orice scenă, în orice podcast, vorbesc liber. Următoarea non-conferință: Iași Septembrie 2026.',
    sections: [
      // Zone 1 — Hero & Manifest (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'EVENIMENTE',
        title: 'Vino să mă auzi vorbind.',
        titleItalic: 'Sau invită-mă să vorbesc.',
        subtitle:
          'Pe orice scenă, în orice podcast, vorbesc liber. Fără PowerPoint, fără script, fără PR. Acolo îmi vin cele mai bune idei. Acolo mă conectez cu omul din față.',
        accent: 'navy',
        mediaPosition: 'none',
        ctaButtons: [
          { label: 'Vezi evenimentele viitoare', href: '#viitoare', variant: 'primary' },
          { label: 'Invită-mă să vorbesc', href: '/contact', variant: 'outline' },
        ],
      },

      // Zone 2 — Featured upcoming: Iași Sep 2026 (paper, feature layout)
      {
        __component: 'sections.featured-list',
        eyebrow: 'URMĂTORUL EVENIMENT — ÎN REGIM PROPRIU',
        heading: 'Iași — Septembrie 2026.',
        headingItalic: 'Prima non-conferință declarată.',
        subheading:
          'Vii cu întrebările tale. Răspund pe loc, cu ce știu — și cu ce nu știu. Fără PowerPoint, fără agendă bătută în cuie, fără PR.',
        accent: 'paper',
        relation: 'events',
        layout: 'feature',
        limit: 1,
        filterBy: { slug: 'iasi-septembrie-2026' },
        seeAllHref: '/contact',
        seeAllLabel: 'Anunță-mă când se deschid biletele',
      },

      // Zone 3 — Și mai urmează (paper-warm, grid, viitoare)
      {
        __component: 'sections.featured-list',
        eyebrow: 'ȘI MAI URMEAZĂ',
        heading: 'Alte scene,',
        headingItalic: 'în lunile următoare.',
        subheading:
          'Constanța, București și alte invitații confirmate. Le actualizez aici pe măsură ce se anunță.',
        accent: 'paper-warm',
        relation: 'events',
        layout: 'grid',
        limit: 3,
        filterBy: { status: 'viitor' },
        seeAllHref: '#arhiva',
        seeAllLabel: 'Vezi și arhiva',
      },

      // Zone 4 — Aftermovie (navy, video-feature)
      {
        __component: 'sections.video-feature',
        eyebrow: 'ULTIMUL EVENIMENT SUB BRANDUL VERUVIS',
        heading: 'Creierul este superputerea ta',
        headingItalic: '— București, ianuarie 2026.',
        body: `A treia conferință națională Veruvis. Sală plină la Hotel Marshal Garden. Dacă te uiți cu atenție la aftermovie, vezi ce s-a întâmplat acolo: cel mai viu moment a fost când am lăsat agenda deoparte și am început să vorbesc liber cu sala.

De aceea Iași, în septembrie, va fi prima oară când totul este declarat upfront: vii cu întrebările tale, eu răspund liber. Vino să o trăiești.`,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        accent: 'navy',
      },

      // Zone 5 — Arhivă (paper, grid, trecute)
      {
        __component: 'sections.featured-list',
        eyebrow: 'ARHIVĂ · 2022–2026',
        heading: 'Scenele de până acum.',
        headingItalic: 'Conferințe Veruvis, TEDx, Forbes, universități.',
        subheading:
          'Speaker la conferințe naționale proprii, TEDx, Forbes CEE Forum, GoTech World și guest lecturer la universități internaționale. O dovadă, eveniment cu eveniment, a felului în care funcționez pe scenă.',
        accent: 'paper',
        relation: 'events',
        layout: 'grid',
        limit: 6,
        filterBy: { status: 'trecut' },
        seeAllHref: '/evenimente#arhiva',
        seeAllLabel: 'Vezi toate evenimentele',
      },

      // Zone 6 — Invitație CTA (paper-warm)
      {
        __component: 'sections.cta-banner',
        eyebrow: 'INVITĂ-MĂ SĂ VORBESC',
        heading: 'Conferințe, podcasturi, sesiuni private.',
        headingItalic: 'Pe orice scenă, în orice podcast.',
        subtext:
          'Eveniment corporate, conferință publică, podcast, workshop. Subiecte: neuroștiință aplicată, performanță neuronală, Brain Mapping, schimbarea durabilă, educația copiilor, leadership. Răspund personal la fiecare invitație în maxim 5 zile lucrătoare.',
        buttonLabel: 'Cere o ofertă de speaker',
        buttonHref: '/contact',
        accent: 'paper-warm',
      },

      // Zone 7 — Newsletter (navy-deep)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Anunță-mă',
        headingItalic: 'când deschid biletele.',
        subtext:
          'Fără spam. Doar anunțuri despre evenimente noi — în primul rând Iași Septembrie 2026 — și articole noi din spațiul Idei.',
        buttonLabel: 'Înscrie-mă',
        placeholder: 'email@exemplu.ro',
        accent: 'navy-deep',
        formId: 'evenimente',
      },
    ],
  })
}
