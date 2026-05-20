import type { Core } from '@strapi/strapi'
import { upsertList } from '../utils'

export async function seedMediaItems(strapi: Core.Strapi): Promise<void> {
  const items = [
    {
      title: 'TEDx Constanța — Creierul, ultima frontieră',
      type: 'video',
      source: 'TEDx Constanța',
      url: 'https://www.youtube.com/watch?v=zsecrIL29ho',
      date: '2022-10-15',
    },
    {
      title: 'Reportaj Pro TV @GoTech World',
      type: 'video',
      source: 'Pro TV',
      url: 'https://www.youtube.com/watch?v=KZjbRKZY9GY',
      date: '2023-11-08',
    },
    {
      title: 'Aparență și esență cu Bogdan Vlădău',
      type: 'podcast',
      source: 'Bogdan Vlădău',
      url: 'https://www.youtube.com/watch?v=oVOzEq-Ifvw',
      date: '2022-06-20',
    },
    {
      title: 'Cafea cu visuri — Oana Andoni',
      type: 'podcast',
      source: 'Oana Andoni',
      url: 'https://www.youtube.com/watch?v=GDdAuBvCbS0',
      date: '2022-09-12',
    },
    {
      title: 'Business Magazin — Interviu antreprenor Veruvis',
      type: 'press',
      source: 'Ziarul Financiar / Business Magazin',
      url: 'https://www.zf.ro/eveniment/business-magazin-costin-damasaru-fondator-veruvis-centrul-de-22213489',
      date: '2022-04-05',
    },
    {
      title: 'Top 100 Performeri în Sănătate (premiat) — Gala Capital',
      type: 'press',
      source: 'EVZ + Gala Capital',
      url: 'https://evz.ro/gala-performerilor-in-medicina-costin-damasaru-veruvis-in-romania-se-poate-dezvolta-medicina-iar-noi-contribuim-la-asta.html',
      date: '2023-12-01',
    },
  ]

  await upsertList(strapi, 'api::media-item.media-item', items, 'title')
}
