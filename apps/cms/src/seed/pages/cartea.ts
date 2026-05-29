import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedBookPage(strapi: Core.Strapi): Promise<void> {
  const bookCover = await uploadFile(
    strapi,
    docPath('2. Cartea', 'Creierul-este-superputerea-ta_Coperta-v02.jpg'),
    { alt: 'Creierul este superputerea ta — coperta cărții de Costin Dămășaru' }
  )

  const authorPhoto = await uploadFile(
    strapi,
    docPath('2. Cartea', '01_Foto_Costin_Damasaru.jpg'),
    { alt: 'Costin Dămășaru, autorul cărții' }
  )

  await upsertSingleType(strapi, 'api::book-page.book-page', {
    seoTitle: 'Creierul este superputerea ta — Costin Dămășaru',
    seoDescription:
      'Manualul practic pentru cei care vor să-și înțeleagă creierul — și să facă ceva cu el. 13 capitole, 3 formate, publicat de Editura Bookzone.',
    sections: [
      // Zone 1 — Hero (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'O CARTE DE COSTIN DĂMĂȘARU',
        title: 'Creierul',
        titleItalic: 'este superputerea ta.',
        subtitle:
          'Manualul practic pentru cei care vor să-și înțeleagă creierul — și să facă ceva cu el.',
        accent: 'navy',
        mediaPosition: 'right',
        media: bookCover,
        ctaButtons: [
          { label: 'Vezi opțiunile', href: '#cum-o-citesti', variant: 'primary' },
          { label: 'Citește primul capitol', href: '#preview-gratuit', variant: 'outline' },
        ],
        statsStrip: {
          items: [
            { value: 'Editura Bookzone', label: 'PUBLICAT 2024', caption: null },
            { value: '13 capitole', label: '7 ANI DE PRACTICĂ', caption: null },
            { value: '3 formate', label: 'CARTE · PDF · AUDIO', caption: null },
          ],
        },
      },

      // Zone 2 — De ce am scris-o (paper, image-text-split no-image variant + pull-quote)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'DE CE AM SCRIS-O',
        heading: 'Cartea pe care',
        headingItalic: 'am avut nevoie eu însumi.',
        body:
          '„Cartea asta e idealul de manual de care mi-aș fi dorit să am parte când am trecut prin iadul meu personal. Ce mi-aș fi dorit să primesc de la toți terapeuții cu care am colaborat de-a lungul drumului spre vindecare."\n\n„În centru văd zilnic același tipar: oameni inteligenți, capabili, care au încercat de toate — coaching, terapie, podcast-uri motivaționale, suplimente — și totuși se simt blocați. Nu pentru că le lipsește voința. Pentru că nimeni nu le-a explicat, pe limba pe care o vorbesc ei, cum funcționează unealta cu care încearcă să se schimbe."\n\n„Cartea asta e ce le explic oamenilor în primele întâlniri, condensat și organizat — astfel încât să poți face singur primii pași. Nu e o carte de motivație. Nu e o carte de meditație. E un manual de utilizare pentru creier."\n\n> Dacă ai un instrument scump și nu știi cum se folosește, nu e instrumentul de vină. Iar creierul e cel mai scump instrument pe care îl ai.',
        image: null,
        imagePosition: 'right',
        accent: 'paper',
      },

      // Zone 3 — Ce găsești înăuntru (paper, cards-grid chapters variant — 13 capitole)
      {
        __component: 'sections.cards-grid',
        eyebrow: 'CE GĂSEȘTI ÎNĂUNTRU',
        heading: '13 capitole.',
        headingItalic: 'O singură călătorie.',
        lead:
          '„Cartea urmărește două drumuri în paralel: drumul meu personal — de la naufragiu la vindecare — și drumul evoluției, prin poveștile oamenilor reali care au trecut prin centru."',
        accent: 'paper',
        columns: '2',
        variant: 'chapters',
        items: [
          {
            title: 'Traumele transgeneraționale',
            text: 'Cum se transmit traumele de la o generație la alta. Cazul Danei — o mamă, doi copii, o moștenire pe care nu o cerea nimeni.',
            tag: '01',
          },
          {
            title: 'Cum funcționează antrenamentele neuronale',
            text: 'Ce e qEEG-ul, ce e Brain Mapping-ul, ce sunt antrenamentele neuronale — explicat fără jargonul din domeniu.',
            tag: '02',
          },
          {
            title: 'Explorând puterea minții noastre',
            text: 'Tot ce poate face creierul tău și nu știai că poate. Plus — câteva lucruri pe care credeai că le poate, dar nu.',
            tag: '03',
          },
          {
            title: 'Studiu de caz pe mine însumi',
            text: 'Tinitusul, depresia, atacurile de panică. Cinci ani de iad. Și cum am ieșit, pas cu pas.',
            tag: '04',
          },
          {
            title: '«Stăpâne, ai mai văzut un dezastru atât de frumos?»',
            text: 'Copilăria, comunitatea aromânilor, Constanța, rușinea, anii din corporație. De unde vine cine sunt acum.',
            tag: '05',
          },
          {
            title: 'Specialiștii suferinței umane',
            text: 'Cine te poate ajuta cu adevărat, cine îți face mai mult rău decât bine, și cum să distingi între ei.',
            tag: '06',
          },
          {
            title: 'Visele și subconștientul',
            text: 'Ce se întâmplă în creier noaptea. Ce poți face cu visele tale dimineața.',
            tag: '07',
          },
          {
            title: 'În căutarea punctelor cardinale',
            text: 'Cum îți recâștigi orientarea într-o viață care te-a lăsat dezorientat.',
            tag: '08',
          },
          {
            title: 'O prezență divină',
            text: 'Despre Dumnezeu — pe limba neuroștiinței. Și despre neuroștiință — fără să exclud transcendența.',
            tag: '09',
          },
          {
            title: 'Călătorii spre mine însumi',
            text: 'Tehnici concrete de auto-explorare. Ce funcționează și ce nu, după mii de cazuri în centru.',
            tag: '10',
          },
          {
            title: 'Ce m-a învățat vindecătoarea din Australia',
            text: 'Călătoria neașteptată care mi-a schimbat înțelegerea vindecării.',
            tag: '11',
          },
          {
            title: 'O revelație: m-am născut să fac asta',
            text: 'Bert Hellinger Institute, Olanda. Momentul în care am înțeles ce am de făcut cu viața mea.',
            tag: '12',
          },
          {
            title: 'Povești ale vindecării',
            text: 'Antonia, George, Ionela, Andrei, Cornelia. Cinci povești reale ale unor oameni care au reconstruit ce părea imposibil de reconstruit. Pentru cei care au nevoie să creadă că se poate.',
            tag: '13',
          },
        ],
      },

      // Zone 4 — Cum o citești (paper-warm, products variant: 3 product cards)
      {
        __component: 'sections.cards-grid',
        eyebrow: 'CUM O CITEȘTI',
        heading: 'Trei feluri.',
        headingItalic: 'Tu alegi.',
        lead:
          '„Carte fizică, PDF instant pe ecran, sau audiobook în vocea mea. Tu alegi cum o vrei."',
        accent: 'paper-warm',
        columns: '3',
        variant: 'products',
        items: [
          {
            title: 'Cartea fizică',
            text: 'Cea pe care o ții în mână, cu copertă, cu file pe care faci notițe, cu colțuri îndoite. 256 de pagini. Editura Bookzone. 57,9 lei',
            tag: 'Editura Bookzone',
            href: 'https://bookzone.ro/carte/creierul-este-superputerea-ta-bkz',
          },
          {
            title: 'PDF — citește pe ecran',
            text: 'Aceeași carte, în format digital. Descarcă imediat după plată, citește-o pe telefon, tabletă, laptop. Fără DRM. E a ta. 50 lei',
            tag: 'Instant · Download',
            href: '#produse',
          },
          {
            title: 'Audiobook — vocea mea',
            text: 'Citit de mine, cap-coadă. Pentru că anumite lucruri trebuie spuse cum trebuie. Înscrie-te și te anunț când e gata.',
            tag: 'În pregătire',
            href: '#audiobook-waitlist',
          },
        ],
      },

      // Zone 5 — Audiobook waitlist (navy, cta-banner waitlist variant)
      {
        __component: 'sections.cta-banner',
        eyebrow: 'PRE-LAUNCH · AUDIOBOOK',
        heading: 'Vrei cartea',
        headingItalic: 'în vocea mea?',
        subtext:
          '„Înregistrez eu, integral. Pentru că anumite lucruri trebuie spuse cum trebuie — nu citite mecanic de cineva care nu a fost acolo."\n\n„Am nevoie să știu cât de mare e cererea înainte să intru în studio. Dacă ești pe lista de așteptare, te anunț în prima zi în care e gata. Și primești audiobook-ul la 50% reducere la lansare."',
        buttonLabel: 'Înscrie-mă pe listă',
        buttonHref: '#audiobook',
        accent: 'navy',
      },

      // Zone 6 — Preview gratuit (paper, text-block centered)
      {
        __component: 'sections.text-block',
        eyebrow: 'PREVIEW GRATUIT',
        heading: 'Citește primul capitol',
        headingItalic: 'înainte să decizi.',
        body:
          'Nu vreau să-mi dai bani pe încredere oarbă. Citește primul capitol — gratuit, fără să-mi dai email-ul, fără nimic. Dacă te prinde, cumperi. Dacă nu, ai învățat ceva oricum.',
        accent: 'paper',
        align: 'center',
        cta: { label: 'Descarcă primul capitol (PDF)', href: '#', variant: 'primary' },
      },

      // Zone 7 — Testimoniale (paper-warm, marquee horizontal scrollable)
      {
        __component: 'sections.featured-list',
        eyebrow: 'CE SPUN CITITORII',
        heading: 'Ce ne-a făcut',
        headingItalic: 'să continuăm.',
        accent: 'paper-warm',
        relation: 'testimonials',
        layout: 'marquee',
        limit: 6,
        filterBy: { source: 'book' },
      },

      // Zone 8 — Despre autor (paper, image-text-split)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'DESPRE AUTOR',
        heading: 'Cine a scris-o',
        headingItalic: 'și de ce contează.',
        body:
          'Sunt Costin Dămășaru. Neurocercetător aplicat, fondator Veruvis, autorul primei cărți de neuroștiință aplicată din România scrisă pentru publicul larg. Am studiat la MIT, am două doctorate (Management — finalizat, Fizică — în lucru) și peste 7 ani de practică pe qEEG și antrenamente neuronale. Cartea asta e ceea ce am învățat din mii de creiere reale, din vieți reale.',
        image: authorPhoto,
        imagePosition: 'left',
        accent: 'paper',
        cta: { label: 'Mai multe despre Costin', href: '/despre', variant: 'outline' },
      },

      // Zone 9 — Newsletter (navy-deep)
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Nu rata',
        headingItalic: 'ce scriu mai departe.',
        subtext:
          'Newsletter bilunar. Un eseu nou, episoade de podcast, evenimente publice. Și prima informare când iese audiobook-ul. Fără spam. Niciodată.',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        accent: 'navy-deep',
        formId: 'cartea',
      },
    ],
  })
}
