import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedAboutPage(strapi: Core.Strapi): Promise<void> {
  const heroPortrait = await uploadFile(
    strapi,
    docPath('1. Despre mine', '01. Costin_Damasaru_1.jpg'),
    { alt: 'Costin Dămășaru — portret' }
  )

  const cineSuntPortrait = await uploadFile(
    strapi,
    docPath('1. Despre mine', '02. Costin_Damasaru_2.jpg'),
    { alt: 'Costin Dămășaru — sesiune cu pacient' }
  )

  const contemplativePortrait = await uploadFile(
    strapi,
    docPath('1. Despre mine', '04. Costin_Damasaru_4.jpg'),
    { alt: 'Costin Dămășaru — portret contemplativ' }
  )

  const wesPortrait = await uploadFile(
    strapi,
    docPath('1. Despre mine', '05. Costin_Damasaru_Wes_Center_5.jpg'),
    { alt: 'Costin Dămășaru și Dr. Wesley Center' }
  )

  await upsertSingleType(strapi, 'api::about-page.about-page', {
    seoTitle: 'Despre Costin Dămășaru — neurocercetător, autor, fondator Veruvis',
    seoDescription:
      'Cercetător în neuroștiințe aplicate. Am analizat peste 18.000 de creiere și am scris cartea „Creierul este Superputerea ta". Despre cine sunt, de unde vin și ce cred.',
    sections: [
      // Z1 — Hero NAVY
      {
        __component: 'sections.hero',
        eyebrow: 'Despre Costin Dămășaru',
        title: 'Descifrez alfabetul Sistemului Creier-Minte',
        titleItalic: 'pentru că am avut nevoie de un manual și nu exista.',
        subtitle:
          '„Am avut nevoie de propriul meu naufragiu ca să înțeleg ce poate face sistemul creier-minte — și ce înseamnă să-l antrenezi cu adevărat. Am ieșit din asta cu un singur scop: să fac ușoară pentru alții o cale care, pentru mine, a fost un labirint."',
        accent: 'navy',
        mediaPosition: 'right',
        media: heroPortrait,
        statsStrip: {
          items: [
            { value: '18.000+', label: 'Creiere analizate', caption: null },
            { value: '15+ ani', label: 'De cercetare aplicată', caption: null },
          ],
        },
      },

      // Z2 — Cine sunt PAPER, sticky photo + caption + projects-row
      {
        __component: 'sections.image-text-split',
        eyebrow: 'Prezent',
        heading: 'Cine sunt',
        headingItalic: 'acum.',
        accent: 'paper',
        imagePosition: 'left',
        image: cineSuntPortrait,
        imageCaption:
          '„Cercetez relația creier-minte în viețile oamenilor care vin la mine — provocări și probleme reale."',
        body: `„Sunt cercetător în neuroștiințe aplicate. Adică nu studiez creierul în abstract — cercetez relația creier-minte în viețile oamenilor care vin la mine, provocări și probleme reale. Și apoi îi ajut să învețe singuri cum să gestioneze acest sistem."

„Am fondat Veruvis în 2019. Inițial Centru de Cercetare în Augmentarea Performanțelor Neuronale, care a devenit o Platformă de Inovare în Neurotehnologii Avansate — prima din România cu această abordare integrată. Am analizat acolo peste 18.000 de creiere."

„Din 2024, sunt și autor publicat. Cartea „Creierul este Superputerea ta" a ajuns să schimbe viețile multor oameni. Susțin conferințe de tip TEDx, am apariții în media, lucrez cu organizații pe leadership și performanță, creez propriile conferințe și merg să discut cu multipli experți din diferite domenii. Iar de aici încolo — podcast-ul, eseurile, evenimentele publice — îmi extind direct vocea, fără filtre."

„De ce fac toate astea? Pentru un motiv simplu: am avut, la rândul meu, nevoie disperată de cineva ca mine. N-am găsit. Așa că am construit."`,
        projectsRow: [
          { name: 'Veruvis', tag: 'Platformă', href: '/proiecte/veruvis' },
          { name: 'Veruvis Kids', tag: 'Copii & Adolescenți', href: '/proiecte/veruvis-kids' },
          { name: 'Nircura', tag: 'Fotobiomodulare', href: '/proiecte/nircura' },
          { name: 'Asociația', tag: 'Cercetare & Advocacy', href: '/proiecte/asociatie' },
        ],
      },

      // Z3 — De unde vine NAVY (with pull quote)
      {
        __component: 'sections.text-block',
        eyebrow: 'De unde vine',
        heading: 'Mi-am dat seama ce e mintea',
        headingItalic: 'după ce mi-am pierdut mințile.',
        accent: 'navy',
        body: `„La 32 de ani am ajuns într-un punct în care nu mai puteam. Cinci ani — tinitus, anxietate, un gen de blocaj din care medicii pe care i-am întâlnit n-aveau cum să mă scoată. Am ieșit singur — cu antrenamente neuronale, cu studiu, cu credință, cu voință. Restul îl găsești în carte."

> Pe drum am înțeles un lucru simplu: nu eram defect. Pur și simplu nimeni nu-mi explicase, pe limba pe care o vorbeam eu, cum funcționează creierul cu care încerc să mă vindec.

„Asta a devenit obsesia mea profesională: să le explic oamenilor — clar, direct, cu instrumente reale — cum funcționează sistemul creier-minte care-i guvernează. Și ce se poate face cu el, atunci când nu mai funcționează eficient."`,
      },

      // Z4 — Patru lucruri PAPER (convictions)
      {
        __component: 'sections.cards-grid',
        eyebrow: 'Convingeri',
        heading: 'Patru lucruri pe care le cred',
        headingItalic: 'și pe care nu le voi nuanța.',
        lead: '„Le-am verificat pe 18.000 de creiere. Sunt sursa aproape a tot ce fac. Nu sunt populare. Nu vor să fie."',
        accent: 'paper',
        columns: '2',
        variant: 'convictions',
        items: [
          {
            title: 'Suferința mintală nu e defect de caracter. E un semnal că trăiești într-o lume care te rănește.',
            text: '„Generația mea a fost crescută cu ideea că, dacă suferi mintal, e ceva în neregulă cu tine. Cu «voința» ta. Cu «slăbiciunea» ta. Asta e o minciună utilă — pentru cineva, nu pentru tine. Creierul tău nu e defect. Face exact ce ar trebui să facă, dat fiind ce ai trăit. Treaba mea nu e să-l «repar» — e să te ajut să-l înțelegi și să-l reantrenezi pentru viața pe care vrei s-o trăiești."',
          },
          {
            title: 'Performanța nu ține de motivație. Ține de cum îți funcționează creierul în clipa aia.',
            text: '„Toată industria de «motivație» și «mindset» tratează simptome. Dacă nu te poți concentra, nu e pentru că «nu vrei suficient». E pentru că rețelele tale neuronale nu sunt în starea în care tu să poți. qEEG-ul îți arată asta în 20 de minute. Iar mai important — îți arată ce se poate face."',
          },
          {
            title: 'Burnout-ul nu se rezolvă cu o vacanță. E o disfuncție neurologică măsurabilă.',
            text: '„«Mai ia o pauză.» «Învață să spui nu.» Bune sfaturi, niciunul suficient. Burnout-ul e o stare neurologică reală, vizibilă în spectrul qEEG, în care anumite rețele se blochează în pattern-uri de hipervigilență. Vacanța nu te scoate de acolo. Antrenamentul neuronal BM-BCI, da."',
          },
          {
            title: 'Școala, în general, nu e făcută să ilumineze masele. E făcută să livreze muncitori obedienți.',
            text: '„Aceasta deranjează cel mai mult — și o spun de pe poziția cuiva care vede zilnic, în centru, copii etichetați drept «deficitari» pentru că nu se potrivesc unui sistem profund nepotrivit lor. Multe din ceea ce numim «tulburări» sunt reacții raționale ale unor creiere sănătoase la un mediu nesănătos. E o discuție pe care vreau s-o port public în următorii ani — cu argumente cercetate, nu cu sloganuri. Și sunt pregătit să fiu nepopular în timp ce o port."',
          },
        ],
      },

      // Z5 — Cred în Dumnezeu NAVY (zone3-grid with contemplative photo)
      {
        __component: 'sections.image-text-split',
        eyebrow: 'Credință',
        heading: 'Cred în Dumnezeu.',
        headingItalic: 'Autentic, pe sufletul meu.',
        accent: 'navy',
        imagePosition: 'left',
        image: contemplativePortrait,
        body: `„Pentru mine, neuroștiința și ceea ce numim «spiritual» nu sunt în conflict. Sunt aceeași poveste, văzută de la altitudini diferite. Creierul e cel mai uluitor instrument din tot universul cunoscut. Faptul că-l poți măsura cu un qEEG nu-i scade din miracol."

„Mulți oameni vin la mine tocmai fiindcă spun asta deschis. Pentru că au căutat ani de zile pe cineva care nu îi obligă să aleagă între știință și credință. Le spun direct: nu trebuie să alegi. Sunt complementare."

„Dacă ești ateu sau agnostic — nicio problemă. Tehnologia funcționează la fel pe toți."`,
      },

      // Z6 — Formare PAPER-WARM (4 columns; "Mentor direct" has wes photo)
      {
        __component: 'sections.credentials-grid',
        eyebrow: 'Context formal',
        heading: 'Formare',
        headingItalic: 'verificabilă.',
        lead: '„Pentru cei care vor să verifice — uite contextul formal pe care stă tot."',
        accent: 'paper-warm',
        groups: [
          {
            title: 'Educație formală',
            items: [
              'Doctorat în Management — ASE București',
              'Doctorand în Fizică — Facultatea de Științe Aplicate, București (în desfășurare)',
              'Master Applied Neuroscience — Universidad Isabel I, Spania (în desfășurare)',
              'Executive Education: Neuroscience for Leadership — MIT, Boston',
              'MBA — Strategie de business',
              'Licență în Psihologie — clinică (în desfășurare)',
            ],
          },
          {
            title: 'Specializări',
            items: [
              'qEEG (Quantitative Electroencephalography)',
              'Brain Mapping',
              'BCIA Certificat',
              'Brain-Computer Interface',
              'Constelații familiale — Bert Hellinger Institute, Olanda (alături de Bert Hellinger)',
            ],
          },
          {
            title: 'Mentor direct',
            items: [],
            image: wesPortrait,
            imageCaption: 'Alături de Dr. Wesley Center — Brain & Behavior Associates, North Texas (BCN Fellow, QEEG-DL).',
          },
          {
            title: 'Publicații principale',
            items: [
              'Creierul este superputerea ta (2024) — Editura Bookzone',
              'Red and Infrared Light Therapy: Mechanisms and Applications (2026)',
              'Demonstration of Alpha-Band Entrainment via Low-Field Magnetic Stimulation: A Simulation-Driven Proof of Concept (2026)',
              'Multiple publicații în management & applied neuroscience',
            ],
          },
        ],
      },

      // Z7 — CTA close NAVY-DEEP (3 cards: Cartea / Podcast / Eveniment)
      {
        __component: 'sections.cards-grid',
        heading: 'Acum că știi cine sunt,',
        headingItalic: 'ce vrei să faci mai departe?',
        accent: 'navy-deep',
        columns: '3',
        variant: 'cta-cards',
        items: [
          {
            tag: 'Citește',
            title: 'Cartea — Creierul este superputerea ta',
            text: 'Ce am învățat trecând prin propriul iad și ajutând alți 18.000 de oameni să iasă din al lor.',
            href: '/carte',
          },
          {
            tag: 'Ascultă',
            title: 'Podcast-ul',
            text: 'Conversații lungi, fără script, despre creier, viață și ce nu se discută public.',
            href: '/podcast',
          },
          {
            tag: 'Vino',
            title: 'Întâlnire publică — Septembrie',
            text: 'Vii cu întrebările tale. Răspund pe loc. Fără PowerPoint, fără script, fără PR.',
            href: '/evenimente',
          },
        ],
      },
    ],
  })
}
