import type { Core } from '@strapi/strapi'
import { upsertSingleType, uploadFile, docPath } from '../utils'

export async function seedProiectePage(strapi: Core.Strapi): Promise<void> {
  const veruvisImage = await uploadFile(
    strapi,
    docPath('5. Proiecte', 'Veruvis.jpg'),
    { alt: 'Veruvis — interviu Pro TV în standul Veruvis' }
  )

  const veruvisKidsImage = await uploadFile(
    strapi,
    docPath('5. Proiecte', 'Veruvis Kids.jpg'),
    { alt: 'Veruvis Kids — eveniment de Ziua Copilului' }
  )

  const nircuraImage = await uploadFile(
    strapi,
    docPath('5. Proiecte', 'Nircura.png'),
    { alt: 'Nircura — cască de fotobiomodulare pentru acasă' }
  )

  await upsertSingleType(strapi, 'api::proiecte-page.proiecte-page', {
    seoTitle: 'Proiecte — Veruvis, Veruvis Kids, Nircura și Asociația | Costin Dămășaru',
    seoDescription:
      'Patru proiecte construite din lipsă reală: Veruvis (qEEG + Antrenamente Neuronale), Veruvis Kids (3–18 ani), Nircura (fotobiomodulare) și Asociația Română de Neurotehnologii Avansate.',
    sections: [
      // Zone 1 — Hero (navy) — manifesto paragraphs live inside the hero body
      {
        __component: 'sections.proiecte-hero',
        eyebrow: 'PROIECTE',
        title: 'Ce am construit.',
        titleItalic: 'Și ce construiesc acum.',
        subtitle:
          'Patru proiecte, un singur fir comun: să facem accesibil ce e cunoscut în neuroștiințele aplicate — în România, pe limba oamenilor reali, pentru viețile lor reale.',
        body:
          '„Nu construiesc proiecte pentru a avea proiecte. Le construiesc pentru că am simțit, fiecare în parte, o lipsă reală. Veruvis a apărut pentru că aveam nevoie de un centru integrat de qEEG/Brain Mapping și Antrenamente Neuronale în România — nu exista. Veruvis Kids, pentru că părinții care veneau la Veruvis cu copiii lor aveau nevoie de un program adaptat vârstei și neurodezvoltării — nu îl avea nimeni. Nircura, pentru că tehnologia de fotobiomodulare era ascunsă în spatele unor prețuri și formulări inaccesibile — am construit alternativa. Asociația, pentru că trebuie să existe în România un loc unde neurotehnologiile avansate să fie discutate public, cercetate independent și prezentate transparent — și nu există încă."\n\n„Pe lângă cele 4 entități, fac și alte lucruri: scriu, susțin conferințe, predau, particip la podcasturi, lucrez cu organizații pe leadership și performanță. Dar centrul gravitațional al activității mele profesionale e aici, în aceste 4 proiecte."',
        accent: 'navy',
        anchors: [
          { label: 'Veruvis', href: '#veruvis', variant: 'outline' },
          { label: 'Veruvis Kids', href: '#veruvis-kids', variant: 'outline' },
          { label: 'Nircura', href: '#nircura', variant: 'outline' },
          { label: 'Asociația', href: '#asociatia', variant: 'outline' },
        ],
      },

      // Zone 2 — VERUVIS (navy, text-left, photo right)
      {
        __component: 'sections.project-feature',
        anchorId: 'veruvis',
        eyebrow: 'PRACTICĂ',
        wordmark: 'Veruvis',
        since: 'din 2019',
        tagline:
          '„Primul centru integrat de qEEG, Brain Mapping și Antrenamente Neuronale din România. Pentru adulții care vor să-și înțeleagă propriul creier și să-l antreneze ca atare."',
        body:
          '„Veruvis a apărut în 2019 ca răspuns la o căutare personală — a mea. După cei 5 ani de criză (tinitus, anxietate, atacuri de panică, blocaj) am început să caut, în România, un loc care să combine sub același acoperiș Brain Mapping, qEEG, antrenamente neuronale BM-BCI, neurofeedback și o abordare profesional-integrată a Sistemului Creier-Minte. Nu exista. Așa că, după ce m-am vindecat singur, am decis să construiesc locul pe care eu aș fi vrut să-l găsesc. Au început să vină oameni. Mulți. Aparent, nu eram singurul."\n\n„La Veruvis lucrăm cu adulți care vin pentru motive foarte diferite: anxietate, atacuri de panică, tinitus, dificultăți de concentrare, burnout, suferință mintală cronică, performanță atletică sau de leadership, recuperare după traumatism cranian. Procesul e mereu același: pornim de la un Brain Map (qEEG) care arată exact ce se întâmplă în creierul tău. Apoi construim un plan de antrenament neuronal BM-BCI adaptat. Totul pentru a ajuta fiecare persoană în parte să-și înțeleagă această complexă relație creier-minte."\n\n„În cei 7 ani de la fondare, am analizat peste 18.000 de creiere, urmărind ceea ce numesc **Metoda Veruvis™** — o abordare proprie, dezvoltată și rafinată în practica zilnică. Avem locații în București și Cluj. Mentorul meu direct și partenerul nostru științific este Dr. Wesley Center, BCN Fellow, QEEG-DL, din SUA."',
        layout: 'text-left',
        accent: 'navy',
        image: veruvisImage,
        imageCaption: '„Interviu Pro TV în standul Veruvis."',
        stats: [
          { value: '2019', label: 'Anul fondării' },
          { value: '18.000+', label: 'Creiere analizate' },
          { value: '2 locații', label: 'București & Cluj' },
        ],
        ctas: [
          { label: 'Vizitează veruvis.ro', href: 'https://veruvis.ro', variant: 'primary', goldDeep: false },
          { label: 'Vezi Metoda Veruvis', href: 'https://veruvis.ro/metoda', variant: 'secondary', goldDeep: false },
        ],
      },

      // Zone 3 — VERUVIS KIDS (paper, text-right, photo left)
      {
        __component: 'sections.project-feature',
        anchorId: 'veruvis-kids',
        eyebrow: 'EDUCAȚIE & DEZVOLTARE COPII',
        wordmark: 'Veruvis',
        wordmarkItalic: 'Kids',
        since: 'pentru copii și adolescenți',
        tagline:
          '„Antrenamente neuronale BM-BCI dedicate exclusiv copiilor și adolescenților între 3 și 18 ani. Cu protocoale adaptate fiecărei etape de neurodezvoltare."',
        body:
          '„Veruvis Kids este un brand separat de Veruvis. Aceeași tehnologie — Brain Map qEEG, Antrenamente Neuronale BM-BCI. Dar metoda, protocoalele, mediul fizic și modul de comunicare sunt complet adaptate pentru copii și adolescenți. Lucrăm cu vârste între 3 și 18 ani."\n\n„Vin la noi părinți cu copii care au primit diferite etichete în sistemul medical sau educațional — ADHD, dificultăți specifice de învățare, anxietate, tulburări de procesare senzorială, dificultăți de gestionare emoțională, performanță școlară sub potențial. Sau părinți care vor să sprijine performanța școlară, sportivă sau cognitivă a copilului fără să aștepte să apară probleme. Procesul începe cu un Brain Map care arată cum funcționează rețelele neuronale ale copilului — fără să-l etichetăm. Apoi construim un plan, antrenăm și măsurăm rezultate."\n\n„Veruvis Kids are locații în București și Cluj. Comunicarea se realizează întotdeauna cu părinții, nu cu copilul direct — copilul vine să se «joace». Totul fără presiunea «trebuie să te repari». Detaliile complete despre programe, protocoale și abordare sunt pe site-ul dedicat veruviskids.ro."',
        layout: 'text-right',
        accent: 'paper',
        image: veruvisKidsImage,
        imageCaption: '„Eveniment Veruvis Kids — Ziua Copilului."',
        stats: [
          { value: '3–18 ani', label: 'Vârstele pe care le lucrăm' },
          { value: 'qEEG', label: 'Brain Map neurodezvoltare' },
          { value: '2 locații', label: 'București & Cluj' },
        ],
        ctas: [
          { label: 'Vizitează veruviskids.ro', href: 'https://veruviskids.ro', variant: 'primary', goldDeep: true },
          { label: 'Programează un Brain Map', href: 'https://veruviskids.ro/programare', variant: 'secondary', goldDeep: true },
        ],
      },

      // Zone 4 — NIRCURA (navy, text-left, photo right)
      {
        __component: 'sections.project-feature',
        anchorId: 'nircura',
        eyebrow: 'TEHNOLOGIE FOTOBIOMODULARĂ',
        wordmark: 'Nircura',
        tagline:
          '„Prima companie românească specializată în tehnologie de fotobiomodulare — pentru uz profesional și pentru acasă."',
        body:
          '„Nircura a apărut din aceeași observație care a stat la baza Veruvis: tehnologia exista, dar nu era accesibilă publicului român — nici ca preț, nici ca informație. Fotobiomodularea, sau «red light therapy» cum o știu mulți, e o tehnologie cu peste 50 de ani de cercetare științifică serioasă în spate. Are aplicații documentate în recuperare musculară, sănătate cutanată, modulare inflamatorie și mai recent, în terapii neuronale combinate cu antrenamentele neuronale BM-BCI. Dar pe piața românească nu existau decât echipamente importate, prost specificate, fără o documentație clară."\n\n„Am construit Nircura ca o companie de echipamente profesionale și home use, fabricate sau personalizate cu specificații pe care le verificăm științific noi. Folosim aceste echipamente în centrele Veruvis și Veruvis Kids ca parte a unor protocoale combinate cu antrenamentele neuronale. Le vindem și separat, atât businessurilor partenere (spa-uri profesionale, centre de wellness, săli de fitness, clinici de recuperare), cât și direct utilizatorilor finali, pentru acasă."\n\n„Nircura nu e un side-project. Este o companie tehnologică în creștere, dezvoltare și educare. Site-ul, catalogul de produse, informațiile științifice detaliate, blogul tehnic — totul este pe nircura.ro."',
        layout: 'text-left',
        accent: 'navy',
        image: nircuraImage,
        imageCaption: '„Cască Nircura — fotobiomodulare pentru acasă."',
        stats: [
          { value: 'PBM', label: 'Fotobiomodulare profesională' },
          { value: 'B2C + B2B', label: 'Home & profesionale' },
          { value: '50+ ani', label: 'Cercetare științifică' },
        ],
        ctas: [
          { label: 'Vezi catalogul Nircura', href: 'https://nircura.ro', variant: 'primary', goldDeep: false },
          { label: 'Pentru clinici și business', href: 'https://nircura.ro/b2b', variant: 'secondary', goldDeep: false },
        ],
      },

      // Zone 5 — ASOCIAȚIA (paper-warm, centered, no photo, asoc-box)
      {
        __component: 'sections.project-feature',
        anchorId: 'asociatia',
        eyebrow: 'ADVOCACY & CERCETARE PUBLICĂ',
        wordmark: 'Asociația Română de',
        wordmarkLine2: 'Neurotehnologii Avansate',
        wordmarkLine3: 'și Antrenamente Neuronale.',
        tagline:
          '„O organizație non-profit dedicată cercetării, educației publice și advocacy-ului pentru neurotehnologii avansate în România."',
        body:
          '„Asociația Română de Neurotehnologii Avansate și Antrenamente Neuronale este o organizație non-profit pe care am inițiat-o pentru că România are nevoie de o voce instituțională independentă pe acest domeniu. Industria neurotehnologică globală se mișcă rapid — Brain-Computer Interfaces, neuromodulare neinvazivă, AI aplicat în neuroștiință, terapii combinate. Decizii politice și de reglementare se iau în acest moment în Uniunea Europeană, în SUA, în Israel, în Japonia. România nu poate să stea pe margine."\n\n„Asociația face trei lucruri principale. Întâi, cercetare independentă pe teme aplicate — protocoale, eficacitate, siguranță, accesibilitate, condiții de utilizare. Al doilea, educație publică — articole, conferințe, ateliere deschise, materiale informaționale gratuite în limba română. Al treilea, advocacy — dialog cu autoritățile, propuneri legislative, parteneriate cu instituții academice, lobby pentru reglementare etică și pentru includerea neurotehnologiilor în programe de sănătate publică."',
        layout: 'centered',
        accent: 'paper-warm',
        asocBox: {
          statusText: 'Site în construcție',
          title: 'Construim un loc unde',
          titleItalic: 'vom documenta totul — public.',
          body:
            '„Asociația va avea curând propriul website unde vom face publice cercetările realizate, parteneriatele, lobby-ul pentru reglementare neuroștiințifică, programele educaționale și proiectele aflate în desfășurare. Vrem ca avansarea neurotehnologiilor în România să nu fie ascunsă în spatele paywall-urilor academice sau al rapoartelor inaccesibile — ci documentată deschis, în limba română, pentru oricine vrea să afle ce se construiește."',
        },
        ctas: [
          { label: 'Anunță-mă când lansez site-ul', href: '#newsletter', variant: 'primary', goldDeep: true },
          { label: 'Contactează asociația', href: 'mailto:contact@arna.ro', variant: 'secondary', goldDeep: true },
        ],
      },

      // Zone 6 — PRESS (paper, branded logo-wall)
      {
        __component: 'sections.press-wall',
        eyebrow: 'PRESS',
        heading: 'Despre noi',
        headingItalic: 's-a vorbit.',
        subtitle:
          '„Publicații print și digital care au scris despre proiectele noastre — Veruvis, Veruvis Kids și Nircura. O selecție din cele mai relevante."',
        accent: 'paper',
        expandLabel: 'Vezi toate aparițiile',
        collapseLabel: 'Restrânge lista',
        secondaryLabel: 'Și de asemenea —',
        items: [
          { brandKey: 'forbes', info: 'Romania · Kids', title: 'Forbes Romania + Forbes Kids România' },
          {
            brandKey: 'protv',
            info: 'iLikeIT',
            title: 'ProTV — iLikeIT',
            url: 'https://stirileprotv.ro/stiri/ilikeit/neurostiinta-tehnologia-sf-folosita-si-in-romania-pentru-vindecarea-unor-afectiuni-si-la-antrenamentul-mintii.html',
          },
          {
            brandKey: 'antena3',
            info: 'Income Summer',
            title: 'Antena 3 CNN — Income Summer Edition',
            url: 'https://www.antena3.ro/tag/costin-damasaru-367829.html',
          },
          {
            brandKey: 'hotnews',
            info: 'Interviu BM-BCI',
            title: 'HotNews',
            url: 'https://hotnews.ro/dr-psih-drd-costin-damasaru-fondatorul-veruvis-cum-ne-poate-ajuta-tehnologia-brain-mapping-brain-computer-interface-sa-ne-optimizam-creierul-17675',
          },
          {
            brandKey: 'adevarul',
            info: 'Adevărul Live',
            title: 'Adevărul Live',
            url: 'https://adevarul.ro/adevarul-live/cum-sa-ne-vindecam-de-toxicitatea-din-viata-2323386.html',
          },
          {
            brandKey: 'zf',
            info: 'ZF + ZF Live',
            title: 'Ziarul Financiar + ZF Live',
            url: 'https://www.zf.ro/business-hi-tech/costin-damasaru-fondator-veruvis-tehnologii-optimizarea-creierului-22115635',
          },
          {
            brandKey: 'capital',
            info: 'Gala Performeri',
            title: 'Capital + Gala Performeri Sănătate',
            url: 'https://www.capital.ro/tehnologia-brain-mapping-si-brain-computer-interface-un-ajutor-de-nadejde-in-combaterea-bolilor-mentale.html',
          },
          {
            brandKey: 'bm',
            info: 'Business pentru creier',
            title: 'BusinessMagazin',
            url: 'https://www.businessmagazin.ro/actualitate/afaceri/business-pentru-creier-21574115',
          },
        ],
        secondaryItems: [
          { label: 'Revista Cariere' },
          { label: 'Revista Biz' },
          { label: 'Evenimentul Zilei' },
          { label: 'Wall-Street.ro' },
          { label: 'Hacking Work' },
          { label: 'ING Antreprenori' },
          { label: 'Euronews Romania' },
          { label: 'TVR — Eu Pot' },
          { label: 'Observator' },
          { label: 'Metropola TV' },
          { label: 'Mr. Finance' },
          { label: 'ResearchGate' },
        ],
      },

      // Zone 7 — Newsletter (navy-deep) — disclaimer lives in fineprint, not subtext
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'RĂMÂI APROAPE',
        heading: 'Vrei să afli',
        headingItalic: 'ce construiesc în continuare?',
        subtext:
          'Newsletter bilunar — proiecte noi, articole, episoade de podcast, evenimente publice. Inclusiv lansarea site-ului asociației.',
        fineprint: 'Te poți dezabona oricând. Adresa ta nu va fi împărtășită cu nimeni.',
        buttonLabel: 'Abonează-mă',
        placeholder: 'adresa@ta.ro',
        accent: 'navy-deep',
        formId: 'proiecte',
      },
    ],
  })
}
