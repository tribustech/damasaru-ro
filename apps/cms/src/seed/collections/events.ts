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

  // TODO: replace with real aftermovie URL once published to YouTube/Vimeo.
  // Local source: Documentation/Pagini/6. Evenimente/Aftermovie conf.mp4 (~200MB).
  // HTML mockup ships the <video> element with poster only, no src — placeholder by design.
  const aftermovieYoutubeUrl = ''

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
        eventStatus: 'viitor',
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
        eventStatus: 'viitor',
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
        eventStatus: 'viitor',
        featured: false,
        coverImage: eventScene2,
      },

      // === 4. PAST — București ianuarie 2026 (ultimul Veruvis, featured aftermovie) ===
      // featured: true so the Z5 archive grid can filter it out (it owns Z4 aftermovie zone).
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
        eventStatus: 'trecut',
        featured: true,
        coverImage: veruvisStagePhoto,
        aftermovieUrl: aftermovieYoutubeUrl,
      },

      // === 5. PAST — Cluj mai 2025 ===
      {
        title: 'Creierul este superputerea ta — Cluj',
        subtitle: 'Prima ediție · conferință națională Veruvis',
        slug: 'cluj-mai-2025',
        displayOrder: 1,
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
        eventStatus: 'trecut',
        featured: false,
        coverImage: eventScene1,
      },

      // === 6. PAST — TEDx Constanța 2024 ===
      {
        title: 'Inovații menite să schimbe lumea — TEDxConstanța',
        subtitle: 'Invitat · prezentare TEDx',
        slug: 'tedx-constanta-2024',
        displayOrder: 3,
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
        eventStatus: 'trecut',
        featured: false,
        coverImage: eventScene2,
      },

      // === 7. PAST — Forbes CEE Forum 2023 ===
      {
        title: 'Forbes CEE Forum 2023 — București',
        subtitle: 'Invitat · panel inteligență umană vs. AI',
        slug: 'forbes-cee-forum-2023',
        displayOrder: 6,
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
        eventStatus: 'trecut',
        featured: false,
        coverImage: veruvisStagePhoto,
      },

      // === 8. PAST — TEDxQuestfield 2025 ===
      {
        title: 'Brain training beyond perceived limits',
        subtitle: 'Invitat · prezentare TEDx',
        slug: 'tedxquestfield-2025',
        displayOrder: 2,
        description:
          'Prezentare TEDx la Questfield International College Youth — despre antrenamentul creierului dincolo de limitele percepute și ce înseamnă pentru elevii care încep acum.',
        longDescription: `Speaker invitat la TEDxQuestfield International College Youth, ediția 2025. Subiect: brain training beyond perceived limits — cum funcționează plasticitatea cerebrală la vârsta de formare, ce înseamnă antrenament neuronal real (nu mitologie pop), și ce poate face un adolescent care înțelege cum funcționează propriul lui creier.

O conversație cu o sală tânără despre limite reale vs. limite percepute.`,
        date: '2025-06-14',
        time: '18:00',
        location: 'București',
        venue: 'TEDxQuestfield Intl College Youth',
        price: 'Eveniment public',
        spots: '',
        ticketsUrl: '',
        organizer: 'TEDxQuestfield',
        eventStatus: 'trecut',
        featured: false,
        coverImage: eventScene1,
      },

      // === 9. PAST — Conferința Tați care iubesc, Octombrie 2024 ===
      {
        title: 'Echilibru mental și obiectivele potrivite',
        subtitle: 'Invitat · Conferința Tați care iubesc',
        slug: 'tati-care-iubesc-2024',
        displayOrder: 4,
        description:
          'Invitat la conferința „Tați care iubesc" — despre echilibru mental și cum alegi obiectivele potrivite când ești simultan tată, partener și profesionist.',
        longDescription: `Speaker invitat la conferința „Tați care iubesc", ediția din octombrie 2024. Subiect: echilibru mental și obiectivele potrivite — ce se întâmplă în creier când încerci să fii prezent în trei roluri simultan (tată, partener, profesionist) și cum alegi unde investești atenția conștient.

O conversație directă cu un public de tați, despre cum decizi ce contează în fiecare săptămână concretă.`,
        date: '2024-10-12',
        time: '18:00',
        location: 'București',
        venue: 'Conferința Tați care iubesc',
        price: 'Eveniment public',
        spots: '',
        ticketsUrl: '',
        organizer: 'Tați care iubesc',
        eventStatus: 'trecut',
        featured: false,
        coverImage: eventScene2,
      },

      // === 10. PAST — GoTech World ===
      {
        title: 'GoTech World — București',
        subtitle: 'Invitat · cea mai mare conferință tech din Europa de Est',
        slug: 'gotech-world',
        displayOrder: 5,
        description:
          'Speaker la GoTech World — cea mai mare conferință tech din Europa de Est. Despre neuroștiință aplicată într-o lume dominată de tehnologie.',
        longDescription: `Speaker invitat la GoTech World, București. Cea mai mare conferință tech din Europa de Est, cu zeci de mii de participanți și sute de speakeri internaționali.

Subiect: cum se intersectează neuroștiința aplicată cu produsele tech pe care le construim — atenție, learning loops, dopamină, design pentru creier sănătos. O conversație cu un public tehnic despre ce înseamnă produs „pentru oameni" la nivel fiziologic.`,
        date: '2024-11-06',
        time: '11:00',
        location: 'București',
        venue: 'GoTech World',
        price: 'Eveniment privat',
        spots: '',
        ticketsUrl: '',
        organizer: 'GoTech World',
        eventStatus: 'trecut',
        featured: false,
        coverImage: veruvisStagePhoto,
      },

      // === 11. PAST — I Love Failure 2025 ===
      {
        title: 'I Love Failure — Moment Costin Dămășaru',
        subtitle: 'Invitat · conferință despre eșec ca date',
        slug: 'i-love-failure-2025',
        displayOrder: 7,
        description:
          'Speaker la I Love Failure 2025 — conferința publică despre eșec ca informație, nu ca verdict. Moment personal: ce am învățat din lucrurile care au mers prost.',
        longDescription: `Speaker invitat la I Love Failure, ediția 2025, București. Conferința publică românească dedicată subiectului eșecului — nu ca verdict moral, ci ca date pe care creierul învață să le proceseze.

Moment personal: trei lucruri care au mers prost în Veruvis și ce am învățat din fiecare. O conversație directă cu sala despre cum reaccesezi o decizie greșită fără să te blochezi în vinovăție.`,
        date: '2025-05-02',
        time: '18:00',
        location: 'București',
        venue: 'I Love Failure',
        price: 'Eveniment public',
        spots: '',
        ticketsUrl: '',
        organizer: 'I Love Failure',
        eventStatus: 'trecut',
        featured: false,
        coverImage: stagePhotoIlf,
      },

      // === 12. PAST — Human 2.0: Neuroscience for Leaders, Cluj 2023 ===
      {
        title: 'Human 2.0: Neuroscience for Leaders — Cluj',
        subtitle: 'Veruvis · Prima conferință națională · cu SPOR / Hacking Work',
        slug: 'human-2-0-cluj-2023',
        displayOrder: 8,
        description:
          'Prima conferință națională Veruvis, în parteneriat cu SPOR / Hacking Work. The Office Cluj-Napoca, februarie 2023.',
        longDescription: `Prima conferință națională sub brandul Veruvis. The Office Cluj-Napoca, februarie 2023, împreună cu SPOR / Hacking Work. O zi întreagă despre cum aplici neuroștiință în leadership — atenție, decizii, oboseală cognitivă, recuperare.

Aceasta a fost deschiderea seriei naționale Veruvis care s-a încheiat cu „Creierul este superputerea ta" la București, în ianuarie 2026.`,
        date: '2023-02-22',
        time: '10:00',
        location: 'Cluj-Napoca',
        venue: 'The Office Cluj-Napoca',
        price: 'Sold out',
        spots: '0 locuri rămase',
        ticketsUrl: '',
        organizer: 'Veruvis · SPOR / Hacking Work',
        eventStatus: 'trecut',
        featured: false,
        coverImage: veruvisStagePhoto,
      },

      // === 13. PAST — Conferințele Ani Cășărică, Constanța (3 ediții anterioare) ===
      {
        title: 'Conferințele Ani Cășărică · Constanța',
        subtitle: 'Invitat · 3 ediții anterioare (2022–2024)',
        slug: 'ani-casarica-constanta-anterioare',
        displayOrder: 9,
        description:
          'Speaker invitat la 3 ediții consecutive ale conferințelor Ani Cășărică din Constanța, între 2022 și 2024. A 4-a participare urmează în mai 2026.',
        longDescription: `Speaker invitat la 3 ediții consecutive ale conferințelor organizate de Ani Cășărică în Constanța — Academia Sinelui / Arhitectura Sinelui. Fiecare ediție a explorat o temă diferită (identitate, decizii, schimbare interioară), cu un public fidel care vine an de an.

A 4-a participare urmează — Constanța, mai 2026, „Întoarce-te la tine: între destin și alegere".`,
        date: '2024-05-25',
        time: '18:00',
        location: 'Constanța',
        venue: 'Conferințele Ani Cășărică',
        price: 'Eveniment public',
        spots: '',
        ticketsUrl: '',
        organizer: 'Ani Cășărică · Academia Sinelui',
        eventStatus: 'trecut',
        featured: false,
        coverImage: eventScene1,
      },

      // === 14. PAST — Sports Business Academy ===
      {
        title: 'Neuroștiință aplicată în sport',
        subtitle: 'Invitat · Workshop · Sports Business Academy',
        slug: 'sports-business-academy',
        displayOrder: 10,
        description:
          'Workshop invitat la Sports Business Academy — despre cum funcționează creierul sub presiune competițională și ce poate face un sportiv pregătit neurologic.',
        longDescription: `Workshop invitat la Sports Business Academy. Subiect: neuroștiință aplicată în sport — ce se întâmplă în creierul unui sportiv sub presiune, cum se antrenează rezistența cognitivă, ce înseamnă recuperare neuronală reală (nu doar fizică).

O sesiune practică pentru sportivi, antrenori și manageri de performanță.`,
        date: '2024-09-18',
        time: '10:00',
        location: 'București',
        venue: 'Sports Business Academy',
        price: 'Eveniment privat',
        spots: '',
        ticketsUrl: '',
        organizer: 'Sports Business Academy',
        eventStatus: 'trecut',
        featured: false,
        coverImage: eventScene2,
      },
    ],
    'slug'
  )
}
