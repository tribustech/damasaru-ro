import type { Core } from '@strapi/strapi'
import { upsertList, uploadFile, docPath } from '../utils'

export async function seedPodcastEpisodes(strapi: Core.Strapi): Promise<void> {
  // Cover art used as a fallback when an episode doesn't have its own thumbnail
  const coverSolo = await uploadFile(
    strapi,
    docPath('3. Podcast', 'Grafica Socials/yt_thumb_solo_1280x720.png'),
    { alt: 'Ce’ai la Mansardă — episod solo' }
  )
  const coverGuest = await uploadFile(
    strapi,
    docPath('3. Podcast', 'Grafica Socials/yt_thumb_invitat_1280x720.png'),
    { alt: 'Ce’ai la Mansardă — episod cu invitat' }
  )

  const episodes = [
    {
      number: 1,
      title: 'Eu, creierul tău și această conversație',
      slug: 'ep-01-eu-creierul-tau-si-aceasta-conversatie',
      description:
        'Bine ai venit. Înainte să-ți spun cine sunt, vreau să-ți spun de ce ești tu aici. Episodul de pornire — manifestul podcast-ului «Ce’ai la Mansardă» și o invitație la o serie de conversații neformatate despre creier, performanță și viața conștientă.',
      duration: '42 min',
      season: 1,
      publishedAt2: '2026-04-08T08:00:00.000Z',
      audioUrl: 'https://open.spotify.com/episode/placeholder-ep-01',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder-ep-01',
      guests: [{ name: 'Costin Dămășaru', role: 'Solo · gazda podcast-ului' }],
      featured: false,
      coverImage: coverSolo,
    },
    {
      number: 2,
      title: 'Ce face AI-ul cu mintea ta',
      slug: 'ep-02-ce-face-ai-ul-cu-mintea-ta',
      description:
        'Cu Alexandra Cernian, profesor de AI la Politehnica București. Nu o discuție tehnică, ci o conversație umană despre ce face inteligența artificială cu atenția noastră, cu felul în care luăm decizii și cu creierul nostru pe termen lung.',
      duration: '1h 18min',
      season: 1,
      publishedAt2: '2026-04-22T08:00:00.000Z',
      audioUrl: 'https://open.spotify.com/episode/placeholder-ep-02',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder-ep-02',
      guests: [
        { name: 'Alexandra Cernian', role: 'Profesor AI · Politehnica București' },
      ],
      featured: false,
      coverImage: coverGuest,
    },
    {
      number: 3,
      title: 'Arta de a fi ascultat cu adevărat',
      slug: 'ep-03-arta-de-a-fi-ascultat-cu-adevarat',
      description:
        'Cum procesează creierul uman mesajele persuasive? Conversație informală despre o temă profundă cu Andy Szekely — unul dintre cei mai buni speakeri din România — despre comunicare, atenție și diferența dintre a vorbi și a fi auzit.',
      duration: '1h 04min',
      season: 1,
      publishedAt2: '2026-05-06T08:00:00.000Z',
      audioUrl: 'https://open.spotify.com/episode/placeholder-ep-03',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder-ep-03',
      guests: [{ name: 'Andy Szekely', role: 'Speaker · autor' }],
      featured: false,
    },
    {
      number: 4,
      title: 'Creierul care performează sub presiune',
      slug: 'ep-04-creierul-care-performeaza-sub-presiune',
      description:
        'Ce se întâmplă în creierul cuiva care lucrează sub presiune constantă? Și cum se antrenează rezistența reală — nu cea de pe Instagram. O discuție despre leadership cognitiv, neuroplasticitate și limitele performanței.',
      duration: '58 min',
      season: 1,
      publishedAt2: '2026-05-20T08:00:00.000Z',
      audioUrl: 'https://open.spotify.com/episode/placeholder-ep-04',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder-ep-04',
      guests: [{ name: 'Invitat', role: 'Anunț în curând' }],
      featured: false,
    },
    {
      number: 5,
      title: 'Credință, știință și liniște interioară',
      slug: 'ep-05-credinta-stiinta-si-liniste-interioara',
      description:
        'O conversație pe care puțini o au public: ce e comun între cele mai vechi practici spirituale și cele mai noi descoperiri din neuroștiință. Despre anxietate, atenție, rugăciune și ce înseamnă, biologic, să fii așezat în tine.',
      duration: '1h 12min',
      season: 1,
      publishedAt2: '2026-06-03T08:00:00.000Z',
      audioUrl: 'https://open.spotify.com/episode/placeholder-ep-05',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder-ep-05',
      guests: [{ name: 'Invitat', role: 'Anunț în curând' }],
      featured: false,
    },
    {
      number: 6,
      title: 'Unde mergem împreună de aici',
      slug: 'ep-06-unde-mergem-impreuna-de-aici',
      description:
        'Sfârșitul unui sezon și începutul unei comunități. Fondarea oficială a comunității Mintea Trează, o privire înapoi peste cele 5 conversații anterioare și o invitație directă pentru sezonul 2.',
      duration: '49 min',
      season: 1,
      publishedAt2: '2026-06-17T08:00:00.000Z',
      audioUrl: 'https://open.spotify.com/episode/placeholder-ep-06',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder-ep-06',
      guests: [{ name: 'Costin Dămășaru', role: 'Solo · gazda podcast-ului' }],
      featured: true,
    },
  ]

  await upsertList(strapi, 'api::podcast-episode.podcast-episode', episodes, 'slug')
}
