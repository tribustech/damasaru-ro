import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedEventsPage(strapi: Core.Strapi): Promise<void> {
  // Hero photo: sha256 verified byte-identical to the base64 embedded in the HTML
  // mockup's <img src="data:..."> at line 896 of evenimente_mockup_final_4.html.
  const heroPhoto = await uploadFile(
    strapi,
    docPath('6. Evenimente', '1763196629029.jpeg'),
    { alt: 'Costin Dămășaru pe scenă la I Love Failure 2025' }
  )

  // Video poster (720×1280) — extracted byte-for-byte from the HTML mockup's
  // <video poster="data:image/jpeg;base64,..."> attribute, NOT a ffmpeg first-frame.
  const aftermoviePoster = await uploadFile(
    strapi,
    docPath('6. Evenimente', 'extracted', 'aftermovie-video-poster.jpg'),
    { alt: 'Costin Dămășaru — aftermovie poster, Hotel Marshal Garden' }
  )

  // Mini-card "Poster oficial" thumbnail (1080×1350) — extracted byte-for-byte
  // from the HTML mockup's .aftermovie-text background-image inline style.
  const posterOficialThumb = await uploadFile(
    strapi,
    docPath('6. Evenimente', 'extracted', 'aftermovie-mini-card-poster.jpg'),
    { alt: 'Poster oficial Creierul este superputerea ta — București, ianuarie 2026' }
  )

  // Self-hosted aftermovie — 1080×1920 portrait (9:16), ~190MB.
  // The HTML mockup embeds this exact MP4 as a base64 <source> in the <video> element.
  const aftermovieFile = await uploadFile(
    strapi,
    docPath('6. Evenimente', 'Aftermovie conf.mp4'),
    { alt: 'Aftermovie Creierul este superputerea ta — București, ianuarie 2026' }
  )

  await upsertSingleType(strapi, 'api::events-page.events-page', {
    seoTitle: 'Evenimente · Costin Dămășaru | Speaker Neuroștiință Aplicată',
    seoDescription:
      'Conferințe, podcasturi, lecturi internaționale. Costin Dămășaru — cercetător în neuroștiințe aplicate, speaker pe orice scenă, în orice podcast. Următorul eveniment propriu: Iași Septembrie 2026.',
    sections: [
      // ZONA 1 — Hero (navy). HTML mockup hero has NO CTA buttons — strip them.
      // Photo carries a 'I LOVE FAILURE · 2025' badge in the mockup; recording as a
      // hero-schema gap (mediaBadge field) — current schema can't express it.
      {
        __component: 'sections.hero',
        eyebrow: 'EVENIMENTE',
        title: 'Vino să mă auzi vorbind.',
        titleItalic: 'Sau invită-mă să vorbesc.',
        subtitle:
          '„Pe orice scenă, în orice podcast, vorbesc liber. Fără PowerPoint, fără script, fără PR. Acolo îmi vin cele mai bune idei. Acolo mă conectez cu omul din față."',
        accent: 'navy',
        mediaPosition: 'right',
        media: heroPhoto,
      },

      // ZONA 1.b — Manifest body (navy, 3 centered paragraphs).
      // In the HTML mockup these paragraphs sit inside the hero zone (.hero-body)
      // with NO heading — text-block here renders the same content; heading/eyebrow
      // are intentionally omitted. (Hero schema lacks a body field — gap recorded.)
      {
        __component: 'sections.text-block',
        body: `„Am ținut conferințe ani de zile, sub brandul Veruvis. Format clasic — agendă structurată, subiect anunțat, întrebări la final dacă mai rămânea timp. Dar de fiecare dată — fără excepție — a venit un moment în care am lăsat structura deoparte și am început să vorbesc liber cu sala. Să răspund la ce se simțea în aer, nu la ce era pe agendă. Acolo se întâmpla conversația reală. Acolo mă simțeam eu."

„Acesta e felul în care eu funcționez de fapt. Așa intru în podcasturi — fără întrebări dinainte. Așa intru pe orice scenă — fără slide-uri pe ecran. Acolo îmi vin cele mai bune idei. Acolo mă conectez cu omul din față. Mereu a fost așa. Acum o spun deschis."

„Începând cu Iași — Septembrie 2026 — evenimentele mele publice se numesc non-conferințe. Fără agendă bătută în cuie. Vii cu întrebările tale. Răspund pe loc, cu ce știu — și recunosc deschis ce nu știu. Acesta nu e un compromis. E felul în care eu sunt cel mai bun."`,
        accent: 'navy',
        align: 'center',
      },

      // ZONA 2 — Featured Event: Iași Septembrie 2026 (paper, event-banner layout)
      {
        __component: 'sections.featured-list',
        eyebrow: 'URMĂTORUL EVENIMENT — ÎN REGIM PROPRIU',
        heading: 'Iași — Septembrie 2026.',
        headingItalic: 'Prima non-conferință declarată.',
        subheading:
          '„Vii cu întrebările tale. Răspund pe loc — cu ce știu și cu ce nu știu. Fără PowerPoint, fără agendă bătută în cuie, fără PR. Doar conversație directă cu sala." Înscrie-te pentru notificare prin newsletter atunci când deschid biletele.',
        accent: 'paper',
        relation: 'events',
        layout: 'event-banner',
        limit: 1,
        filterBy: { slug: 'iasi-septembrie-2026' },
        seeAllHref: '#newsletter',
        seeAllLabel: 'Anunță-mă când lansez biletele',
      },

      // ZONA 3 — Confirmat, ca invitat: Constanța Mai 2026 (paper-warm)
      {
        __component: 'sections.featured-list',
        eyebrow: 'ȘI MAI URMEAZĂ',
        heading: 'Confirmat,',
        headingItalic: 'ca invitat.',
        subheading:
          '„Sunt invitat la conferința Anei Cășărică despre destin, alegere și ce ne face să trăim viața noastră versus viața pe care ne-am imaginat-o. A 4-a participare la conferințele ei, în Constanța." Pe scenă alături de Pr. Marius Moșteanu (Asist. Univ. Dr.) și Prof. Ani Cășărică (Psiholog · Psihoterapeut).',
        accent: 'paper-warm',
        relation: 'events',
        layout: 'event-banner',
        limit: 1,
        filterBy: { slug: 'constanta-mai-2026' },
        seeAllHref: 'https://anicasarica.ro',
        seeAllLabel: 'Detalii pe pagina organizatorului',
      },

      // ZONA 4 — Aftermovie: Ultimul eveniment sub brandul Veruvis (navy)
      // Copy verbatim from evenimente_mockup_final_4.html Z4 (aftermovie-* block).
      // Self-hosted portrait video (9:16, 1080×1920); poster-badge mini-card reuses
      // the stage photo until a dedicated "Poster oficial" magazine-cover crop is supplied.
      {
        __component: 'sections.video-feature',
        eyebrow: 'ULTIMUL EVENIMENT SUB BRANDUL VERUVIS',
        badge: 'Veruvis · Conferință națională',
        heading: 'Creierul este superputerea ta — București',
        meta: '📍 Hotel Marshal Garden · 🗓 31 ianuarie 2026 · 👥 Sală plină',
        body: `„Aceasta a fost a treia conferință națională Veruvis. Prima a fost Human 2.0: Neuroscience for Leaders, la Cluj, în februarie 2023 — împreună cu SPOR / Hacking Work. A doua a fost prima ediție «Creierul este superputerea ta» la Cluj, în mai 2025. Și apoi București, în ianuarie 2026 — sală plină."

„Dacă te uiți cu atenție la aftermovie, vezi ce s-a întâmplat acolo: cel mai viu moment a fost când am lăsat agenda deoparte și am început să vorbesc liber cu sala. Așa cum funcționez eu, de fapt — în orice podcast, pe orice scenă."

„De aceea, Iași va fi prima oară când totul este declarat upfront: vii cu întrebările tale, eu răspund liber. Vino să o trăiești."`,
        videoFile: aftermovieFile,
        posterImage: aftermoviePoster,
        orientation: 'portrait',
        posterBadgeLabel: 'Poster oficial',
        posterBadgeQuote: '„Descoperă știința din spatele schimbării durabile"',
        posterBadgeImage: posterOficialThumb,
        accent: 'navy',
      },

      // ZONA 5 — Arhivă: 12 Evenimente (paper, grid). Cards static; ordered via
      // event.displayOrder (resolver sorts asc). Subheading carries an inline link
      // to /media instead of a redundant trailing CTA.
      {
        __component: 'sections.featured-list',
        eyebrow: 'ARHIVĂ · 2022–2025',
        heading: 'Unde am mai vorbit',
        headingItalic: 'de-a lungul anilor.',
        subheading:
          '„Evenimentele unde am fost speaker pe scenă — conferințe Veruvis, TEDx, conferințe ca invitat. Aparițiile TV și podcasturile sunt pe pagina [Media](/media)."',
        accent: 'paper',
        relation: 'events',
        layout: 'grid',
        limit: 12,
        filterBy: { eventStatus: 'trecut', featured: false },
      },

      // ZONA 6 (copy doc) — Guest Lectures Internaționale (paper-warm).
      // Cards are wordmark + flag only; per-university descriptions removed per
      // user feedback (the eyebrow + heading already say everything).
      {
        __component: 'sections.cards-grid',
        eyebrow: 'GUEST LECTURES · UNIVERSITĂȚI INTERNAȚIONALE',
        heading: 'Lecturi ca invitat',
        headingItalic: 'la universități internaționale.',
        accent: 'paper-warm',
        columns: '3',
        variant: 'default',
        items: [
          { title: 'Vives University', tag: '🇧🇪 Bruges · Belgia' },
          { title: 'University of Kassel', tag: '🇩🇪 Kassel · Germania' },
          { title: 'Sheffield City College', tag: '🇬🇧 Sheffield · UK' },
        ],
      },

      // ZONA 6 — Speaker Booking Form (paper-warm). Copy verbatim from HTML mockup.
      // 6 required fields + 3 optional + expectation-box + fineprint.
      {
        __component: 'sections.contact-form',
        eyebrow: 'INVITAȚIE LA EVENIMENTUL TĂU',
        heading: 'Vrei să mă inviți',
        headingItalic: 'la evenimentul tău?',
        subtext:
          '„Conferințe, workshop-uri, paneluri, talk-show-uri, dezbateri private. Pentru companii, asociații, universități, organizații. Răspund la fiecare cerere personal — nu există agenți, nu există agenții. Mă scrii, îmi spui ce ai în plan, ne aliniem."',
        expectationNote:
          '„Câteva lucruri să știi înainte: nu lucrez cu slide-uri și nu prezint după agendă bătută în cuie. Vorbesc liber, în funcție de ce e în sală — așa intru pe orice scenă și în orice podcast. Dacă ai nevoie de un speaker care livrează o prezentare structurată cu deck-uri, nu sunt persoana ta. Dacă vrei o conversație vie cu publicul tău, vorbim."',
        nameLabel: 'Numele tău',
        emailLabel: 'Email',
        phoneLabel: 'Telefon',
        organizationLabel: 'Companie / Organizație',
        organizationOptional: false,
        eventTypeLabel: 'Tip eveniment',
        eventTypePlaceholder: 'Selectează tipul evenimentului...',
        eventTypeOptions: [
          { label: 'Conferință B2B / corporate', value: 'conferinta-b2b' },
          { label: 'Workshop intern / training', value: 'workshop' },
          { label: 'Conferință publică / summit', value: 'conferinta-publica' },
          { label: 'Panel / dezbatere', value: 'panel' },
          { label: 'Talk show TV / podcast în direct', value: 'talk-show' },
          { label: 'Universitate / mediu academic', value: 'universitate' },
          { label: 'Eveniment privat (lansare, gală, etc.)', value: 'eveniment-privat' },
          { label: 'Altceva', value: 'altceva' },
        ],
        messageLabel: 'Mesaj',
        messagePlaceholder:
          'Spune-mi ce ai în plan. Cu cât ești mai specific despre evenimentul tău (audiență, scop, context), cu atât pot răspunde mai bine.',
        optionalSectionLabel: 'Opțional — Detalii suplimentare',
        dateEstimateLabel: 'Dată estimativă',
        dateEstimatePlaceholder: 'ex: noiembrie 2026 sau Q1 2027',
        audienceSizeLabel: 'Audiență estimată',
        audienceSizePlaceholder: 'Selectează...',
        audienceSizeOptions: [
          { label: 'Sub 50 persoane', value: 'sub-50' },
          { label: '50 - 200 persoane', value: '50-200' },
          { label: '200 - 1.000 persoane', value: '200-1000' },
          { label: 'Peste 1.000 persoane', value: 'peste-1000' },
        ],
        budgetLabel: 'Buget orientativ',
        budgetPlaceholder: 'Selectează...',
        budgetOptions: [
          { label: 'Sub 5.000 EUR', value: 'sub-5k' },
          { label: '5.000 - 15.000 EUR', value: '5k-15k' },
          { label: '15.000 - 30.000 EUR', value: '15k-30k' },
          { label: 'Peste 30.000 EUR', value: 'peste-30k' },
          { label: 'Necunoscut momentan', value: 'necunoscut' },
        ],
        submitLabel: 'Trimite invitația →',
        successMessage: 'Mulțumesc — îți răspund personal în maxim 7 zile lucrătoare.',
        fineprint: '„Răspund la fiecare cerere în maxim 7 zile lucrătoare."',
        accent: 'paper-warm',
      },

      // ZONA 7 — Newsletter (navy-deep). Copy verbatim from HTML mockup.
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'RĂMÂI APROAPE',
        heading: 'Anunță-mă',
        headingItalic: 'când deschid biletele.',
        subtext:
          '„Newsletter bilunar — evenimente noi, deschidere bilete, anunțuri non-conferințe, articole, episoade podcast. Fără spam. Niciodată."',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        fineprint: '„Te poți dezabona oricând. Adresa ta nu va fi împărtășită cu nimeni."',
        accent: 'navy-deep',
        formId: 'evenimente',
      },
    ],
  })
}
