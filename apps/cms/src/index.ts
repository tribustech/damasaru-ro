import type { Core } from '@strapi/strapi'

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedIfEmpty(strapi)
  },
}

async function seedIfEmpty(strapi: Core.Strapi) {
  const count = await strapi.db.query('api::article.article').count()
  console.log(`[seed] articles in DB: ${count}`)
  if (count > 0) {
    console.log('[seed] skipping — data already exists')
    return
  }

  console.log('[seed] seeding data...')
  await seedArticles(strapi)
  await seedEvents(strapi)
  await seedMediaItems(strapi)
  await seedHomePage(strapi)
  await seedAboutPage(strapi)
  await seedBookPage(strapi)
  await seedMediaPage(strapi)
  console.log('[seed] done')
}

// ─── Articles ────────────────────────────────────────────────────────────────

async function seedArticles(strapi: Core.Strapi) {
  const articles = [
    {
      title: 'Cum să transformi anxietatea în creativitate',
      slug: 'anxietate-si-creativitate',
      excerpt: 'O perspectivă practică asupra relației dintre emoțiile dificile și procesul creator.',
      content: 'Anxietatea nu este un inamic al creativității — ci, adesea, combustibilul ei. În această perspectivă, explorăm cum poți folosi stările de neliniște ca punct de plecare pentru scriere și creație.',
      category: 'Creație',
      date: '2024-03-15',
      readTime: '5 min',
    },
    {
      title: 'Jurnalul ca instrument de cunoaștere de sine',
      slug: 'jurnal-cunoastere-de-sine',
      excerpt: 'De ce scrierea zilnică poate fi una dintre cele mai puternice practici personale.',
      content: 'Jurnalul nu este un simplu depozit de amintiri — este un spațiu de dialog cu sinele. Prin scriere regulată, ne putem observa tiparele de gândire și simțire cu o claritate surprinzătoare.',
      category: 'Practici',
      date: '2024-04-02',
      readTime: '7 min',
    },
    {
      title: 'Cititul lent: o practică de prezență',
      slug: 'cititul-lent-practica-prezenta',
      excerpt: 'Cum să redescoperim plăcerea lecturii atente, departe de zgomotul informațional.',
      content: 'Cititul lent înseamnă să dai unei cărți atenția pe care o merită. Nu este vorba de viteză, ci de absorbție — de a lăsa un text să te schimbe cu adevărat.',
      category: 'Lectură',
      date: '2024-05-10',
      readTime: '4 min',
    },
  ]

  for (const data of articles) {
    await strapi.documents('api::article.article').create({ data, locale: 'ro', status: 'published' })
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

async function seedEvents(strapi: Core.Strapi) {
  const events = [
    {
      title: 'Atelier de scriere creativă – Vocea ta pe hârtie',
      slug: 'atelier-scriere-creativa-vocea-ta',
      description: 'Un atelier practic pentru cei care vor să-și descopere vocea în scriere.',
      location: 'București',
      venue: 'Librăria Humanitas Cișmigiu',
      spots: '20 locuri disponibile',
      date: '2025-06-14',
      time: '10:00',
      price: '150 RON',
      status: 'viitor' as const,
    },
    {
      title: 'Lansare de carte – Dincolo de pagină',
      slug: 'lansare-carte-dincolo-de-pagina',
      description: 'Lansarea noului volum și o sesiune de întrebări și răspunsuri cu autoarea.',
      location: 'Cluj-Napoca',
      venue: 'Librăria Cărtureşti Verona',
      spots: 'Intrare liberă',
      date: '2025-07-05',
      time: '18:00',
      price: 'Gratuit',
      status: 'viitor' as const,
    },
    {
      title: 'Cerc de lectură – Toamna cărților',
      slug: 'cerc-de-lectura-toamna-cartilor',
      description: 'Întâlnire de grup în jurul unei lecturi comune și a impactului ei personal.',
      location: 'Online',
      venue: 'Zoom',
      spots: '15 locuri disponibile',
      date: '2024-10-20',
      time: '19:00',
      price: 'Gratuit',
      status: 'trecut' as const,
    },
  ]

  for (const data of events) {
    await strapi.documents('api::event.event').create({ data, locale: 'ro', status: 'published' })
  }
}

// ─── Media Items ─────────────────────────────────────────────────────────────

async function seedMediaItems(strapi: Core.Strapi) {
  const items = [
    {
      type: 'press' as const,
      title: 'Interviu la Digi24 – Despre scriere și autenticitate',
      source: 'Digi24',
      url: 'https://digi24.ro',
      date: '2024-02-10',
    },
    {
      type: 'podcast' as const,
      title: 'Podcast Mindset – Cum scrii când nu ai chef',
      source: 'Mindset Podcast',
      url: 'https://open.spotify.com',
      date: '2024-03-22',
    },
    {
      type: 'video' as const,
      title: 'TEDx Cluj – Curajul de a fi vulnerabil pe pagină',
      source: 'TEDx Cluj',
      url: 'https://youtube.com',
      date: '2024-01-15',
    },
  ]

  for (const data of items) {
    await strapi.documents('api::media-item.media-item').create({ data, locale: 'ro', status: 'published' })
  }
}

// ─── Home Page ────────────────────────────────────────────────────────────────

async function seedHomePage(strapi: Core.Strapi) {
  await strapi.documents('api::home-page.home-page').create({
    data: {
      sections: [
        {
          __component: 'sections.hero',
          title: 'Scrie. Simte. Devino.',
          subtitle: 'Un spațiu pentru cei care cred că cuvintele pot schimba ceva.',
          ctaButtons: [{ label: 'Descoperă', href: '/ro/despre', variant: 'primary' }],
        },
        {
          __component: 'sections.text-block',
          heading: 'Despre acest spațiu',
          body: 'Bun venit! Sunt o scriitoare și facilitatoare de ateliere creative. Acest loc este dedicat explorării prin scriere, lectură și dialog.',
        },
        {
          __component: 'sections.cta-banner',
          heading: 'Rezervă-ți locul la următorul atelier',
          buttonLabel: 'Vezi evenimentele',
          buttonHref: '/ro/evenimente',
        },
      ],
    },
    locale: 'ro',
    status: 'published',
  })
}

// ─── About Page ───────────────────────────────────────────────────────────────

async function seedAboutPage(strapi: Core.Strapi) {
  await strapi.documents('api::about-page.about-page').create({
    data: {
      sections: [
        {
          __component: 'sections.hero',
          title: 'Despre mine',
          subtitle: 'Scriitoare, facilitatoare, exploratoare a cuvintelor.',
        },
        {
          __component: 'sections.text-block',
          heading: 'Povestea mea',
          body: 'Cred că fiecare om are o poveste care merită spusă. Prin atelierele și scrierile mele, invit oamenii să-și găsească curajul de a o exprima.',
        },
      ],
    },
    locale: 'ro',
    status: 'published',
  })
}

// ─── Book Page ────────────────────────────────────────────────────────────────

async function seedBookPage(strapi: Core.Strapi) {
  await strapi.documents('api::book-page.book-page').create({
    data: {
      sections: [
        {
          __component: 'sections.hero',
          title: 'Cartea',
          subtitle: 'O călătorie prin cuvinte despre vulnerabilitate și curaj.',
        },
        {
          __component: 'sections.text-block',
          heading: 'Despre carte',
          body: 'Disponibilă în librăriile partenere și online. O carte despre ce înseamnă să scrii adevărul, chiar și atunci când îți este frică.',
        },
        {
          __component: 'sections.cta-banner',
          heading: 'Comandă acum',
          buttonLabel: 'Cumpără',
          buttonHref: 'https://carturesti.ro',
        },
      ],
    },
    locale: 'ro',
    status: 'published',
  })
}

// ─── Media Page ───────────────────────────────────────────────────────────────

async function seedMediaPage(strapi: Core.Strapi) {
  await strapi.documents('api::media-page.media-page').create({
    data: {
      sections: [
        {
          __component: 'sections.hero',
          title: 'Media',
          subtitle: 'Interviuri, podcasturi și apariții video.',
        },
      ],
    },
    locale: 'ro',
    status: 'published',
  })
}
