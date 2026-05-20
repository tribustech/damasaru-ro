import type { Core } from '@strapi/strapi'
import { upsertList, uploadFile, docPath } from '../utils'

export async function seedEvents(strapi: Core.Strapi): Promise<void> {
  // Photo assets shared across multiple events
  const stagePhotoIlf = await uploadFile(
    strapi,
    docPath('6. Evenimente', 'WhatsApp-Image-2026-05-02-at-11.39.14.jpeg'),
    { alt: 'Costin Dămășaru pe scenă' }
  )

  const veruvisStagePhoto = await uploadFile(
    strapi,
    docPath('6. Evenimente', '292699189_546161950622519_3903776854173790932_n.jpg'),
    { alt: 'Costin Dămășaru — eveniment Veruvis' }
  )

  const eventScene1 = await uploadFile(
    strapi,
    docPath('6. Evenimente', '1763196629029.jpeg'),
    { alt: 'Eveniment Costin Dămășaru — scenă' }
  )

  const eventScene2 = await uploadFile(
    strapi,
    docPath('6. Evenimente', '1769775229334.jpeg'),
    { alt: 'Eveniment Costin Dămășaru — public' }
  )

  // Aftermovie placeholder — actual MP4 is 200MB and too large to embed
  const aftermovieYoutubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

  await upsertList(
    strapi,
    'api::event.event',
    [
      // === 1. FEATURED UPCOMING — Iași Septembrie 2026 ===
      {
        title: 'Iași — Septembrie 2026',
        subtitle: 'Prima non-conferință declarată sub brandul Costin Dămășaru',
        slug: 'iasi-septembrie-2026',
        description:
          'Vii cu întrebările tale. Răspund pe loc, cu ce știu — și cu ce nu știu. Fără PowerPoint, fără agendă bătută în cuie, fără PR. Doar conversație directă cu sala.',
        longDescription: `Începând cu Iași, evenimentele mele publice se numesc non-conferințe. Fără agendă bătută în cuie. Vii cu întrebările tale. Răspund pe loc, cu ce știu — și recunosc deschis ce nu știu.

Aceasta nu e o conferință în format clasic. E felul în care eu sunt cel mai bun: o conversație directă cu sala, fără slide-uri, fără script, fără PR. Locația exactă și deschiderea biletelor — anunțate în iulie. Pentru notificare, abonează-te la newsletter.`,
        date: '2026-09-15',
        time: 'Anunțată în iulie',
        location: 'Iași',
        venue: 'Locația exactă — anunțată în iulie 2026',
        price: 'Bilete disponibile la deschiderea înscrierilor',
        spots: 'Detalii anunțate în iulie',
        ticketsUrl: '/contact',
        organizer: 'Costin Dămășaru',
        status: 'viitor',
        featured: true,
        coverImage: stagePhotoIlf,
      },

      // === 2. UPCOMING — Constanța Mai 2026 (invitat) ===
      {
        title: 'Întoarce-te la tine: între destin și alegere',
        subtitle: 'Invitat la conferința Ani Cășărică · a 4-a ediție',
        slug: 'constanta-mai-2026',
        description:
          'Sunt invitat la conferința Anei Cășărică despre destin, alegere și ce ne face să trăim viața noastră versus viața pe care ne-am imaginat-o. A 4-a participare la conferințele ei, în Constanța.',
        longDescription: `Pe scenă alături de Pr. Marius Moșteanu (Asist. Univ. Dr.) și Prof. Ani Cășărică (Psiholog · Psihoterapeut). O seară despre destin, alegere și diferența dintre viața pe care o trăim și viața pe care ne-am imaginat-o.

Organizatori: Academia Sinelui, Arhitectura Sinelui by Ani Cășărică, FocusPress, Centrul Cultural Județean Constanța Teodor T. Burada, Asociația Sofya Tomitana.`,
        date: '2026-05-25',
        time: '18:00',
        location: 'Constanța',
        venue: 'Centrul „Jean Constantin"',
        price: 'Bilete pe Nobody\'s Banda',
        spots: 'Locuri limitate',
        ticketsUrl: 'https://nobodysbanda.ro',
        organizer: 'Ani Cășărică · Academia Sinelui',
        status: 'viitor',
        featured: false,
        coverImage: eventScene1,
      },

      // === 3. UPCOMING — București Q4 2026 ===
      {
        title: 'Creierul în lumea reală — București',
        subtitle: 'Întâlnire publică, format non-conferință',
        slug: 'bucuresti-noiembrie-2026',
        description:
          'A doua oprire din turneul de non-conferințe sub brandul Costin Dămășaru. Conversație directă cu sala, fără PowerPoint, fără agendă rigidă.',
        longDescription: `După Iași, Bucureștiul. Același format: vii cu întrebările tale, răspund pe loc. Despre creier, viață, performanță și ce înseamnă să trăiești cu un sistem creier-minte pe care îl înțelegi.

Locația exactă, data finală și deschiderea biletelor — anunțate după ce se închide Iași.`,
        date: '2026-11-20',
        time: 'TBA',
        location: 'București',
        venue: 'TBA',
        price: 'TBA',
        spots: 'Detalii în curând',
        ticketsUrl: '/contact',
        organizer: 'Costin Dămășaru',
        status: 'viitor',
        featured: false,
        coverImage: eventScene2,
      },

      // === 4. PAST — București ianuarie 2026 (ultimul Veruvis) ===
      {
        title: 'Creierul este superputerea ta — București',
        subtitle: 'Ultima conferință națională sub brandul Veruvis',
        slug: 'bucuresti-ianuarie-2026',
        description:
          'A treia conferință națională Veruvis, sală plină la Hotel Marshal Garden. A treia ediție „Creierul este superputerea ta" — și ultima în formatul clasic.',
        longDescription: `Aceasta a fost a treia conferință națională Veruvis. Prima a fost Human 2.0: Neuroscience for Leaders, la Cluj, în februarie 2023 — împreună cu SPOR / Hacking Work. A doua a fost prima ediție „Creierul este superputerea ta" la Cluj, în mai 2025. Și apoi București, în ianuarie 2026 — sală plină.

Dacă te uiți cu atenție la aftermovie, vezi ce s-a întâmplat acolo: cel mai viu moment a fost când am lăsat agenda deoparte și am început să vorbesc liber cu sala. Așa cum funcționez eu, de fapt — în orice podcast, pe orice scenă. De aceea, Iași va fi prima oară când totul e declarat upfront.`,
        date: '2026-01-31',
        time: '18:00',
        location: 'București',
        venue: 'Hotel Marshal Garden',
        price: 'Sală plină',
        spots: '0 locuri rămase',
        ticketsUrl: '',
        organizer: 'Veruvis',
        status: 'trecut',
        featured: false,
        coverImage: veruvisStagePhoto,
        aftermovieUrl: aftermovieYoutubeUrl,
      },

      // === 5. PAST — Cluj mai 2025 ===
      {
        title: 'Creierul este superputerea ta — Cluj',
        subtitle: 'Prima ediție · conferință națională Veruvis',
        slug: 'cluj-mai-2025',
        description:
          'Prima ediție „Creierul este superputerea ta" — conferință națională sub brandul Veruvis. Locuri vândute.',
        longDescription: `Prima ediție „Creierul este superputerea ta" la The Office Cluj-Napoca. Locuri vândute, sală plină. O zi întreagă despre cum funcționează sistemul creier-minte și ce înseamnă, concret, să-l antrenezi.

A doua conferință națională sub brandul Veruvis, după Human 2.0 (2023). Aceasta a deschis seria națională care s-a încheiat cu București, ianuarie 2026.`,
        date: '2025-05-10',
        time: '10:00',
        location: 'Cluj-Napoca',
        venue: 'The Office Cluj-Napoca',
        price: 'Sold out',
        spots: '0 locuri rămase',
        ticketsUrl: '',
        organizer: 'Veruvis',
        status: 'trecut',
        featured: false,
        coverImage: eventScene1,
      },

      // === 6. PAST — TEDx Constanța 2024 ===
      {
        title: 'Inovații menite să schimbe lumea — TEDxConstanța',
        subtitle: 'Invitat · prezentare TEDx',
        slug: 'tedx-constanta-2024',
        description:
          'Prezentare TEDx despre potențialul creierului uman, Brain Mapping și Brain-Computer Interface — și ce se schimbă în următorii zece ani.',
        longDescription: `Speaker invitat la TEDxConstanța, ediția 2024. Subiect: cum harta funcțională a creierului (Brain Mapping) și interfețele creier-calculator schimbă, concret, modul în care abordăm performanța, sănătatea mintală și educația.

Prezentare scurtă, format TEDx clasic, conversație care a continuat după aceea pe scenă și off-stage.`,
        date: '2024-10-12',
        time: '19:00',
        location: 'Constanța',
        venue: 'TEDxConstanța',
        price: 'Eveniment public',
        spots: '',
        ticketsUrl: '',
        organizer: 'TEDxConstanța',
        status: 'trecut',
        featured: false,
        coverImage: eventScene2,
      },

      // === 7. PAST — Forbes CEE Forum 2023 ===
      {
        title: 'Forbes CEE Forum 2023 — București',
        subtitle: 'Invitat · panel inteligență umană vs. AI',
        slug: 'forbes-cee-forum-2023',
        description:
          'Speaker la Forbes CEE Forum — singurul eveniment anual regional Forbes organizat în România. Subiect: inteligența non-umană vs. inteligența artificială.',
        longDescription: `Speaker la Forbes CEE Forum 2023, București. Forumul regional Forbes pentru Europa Centrală și de Est, cu invitați din toată regiunea. Subiectul: ce înseamnă inteligența umană non-clasică (intuiție, corp, creier-minte ca sistem) în raport cu inteligența artificială pe care o construim acum.

O conversație despre granița dintre ce e biologic, ce e instrumentat și ce înseamnă, mai departe, performanța cognitivă într-o lume cu AI accesibilă tuturor.`,
        date: '2023-09-20',
        time: '14:00',
        location: 'București',
        venue: 'Forbes CEE Forum',
        price: 'Eveniment privat',
        spots: '',
        ticketsUrl: 'https://forbes.ro/forbes-cee-forum-2023-costin-damasaru',
        organizer: 'Forbes România',
        status: 'trecut',
        featured: false,
        coverImage: veruvisStagePhoto,
      },
    ],
    'slug'
  )
}
