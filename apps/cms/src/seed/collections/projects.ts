import type { Core } from '@strapi/strapi'
import { upsertList, uploadFile, docPath } from '../utils'

export async function seedProjects(strapi: Core.Strapi): Promise<void> {
  const veruvisImage = await uploadFile(
    strapi,
    docPath('5. Proiecte', 'Veruvis.jpg'),
    { alt: 'Veruvis — Platformă de Inovare în Neurotehnologii Avansate' }
  )

  const veruvisKidsImage = await uploadFile(
    strapi,
    docPath('5. Proiecte', 'Veruvis Kids.jpg'),
    { alt: 'Veruvis Kids — Antrenamente Neuronale pentru copii și adolescenți' }
  )

  const nircuraImage = await uploadFile(
    strapi,
    docPath('5. Proiecte', 'Nircura.png'),
    { alt: 'Nircura — Tehnologie de fotobiomodulare profesională și home use' }
  )

  await upsertList(
    strapi,
    'api::project.project',
    [
      {
        name: 'Veruvis',
        slug: 'veruvis',
        tagline:
          'Primul centru integrat de qEEG, Brain Mapping și Antrenamente Neuronale din România.',
        description:
          'Pentru adulții care vor să-și înțeleagă propriul creier și să-l antreneze ca atare. Fondat în 2019, cu peste 18.000 de creiere analizate și locații în București și Cluj. O practică integrată — Brain Map qEEG, Antrenamente Neuronale BM-BCI, neurofeedback și abordare profesional-integrată a Sistemului Creier-Minte.',
        manifesto:
          '„Veruvis a apărut în 2019 ca răspuns la o căutare personală — a mea. După cei 5 ani de criză (tinitus, anxietate, atacuri de panică, blocaj) am început să caut, în România, un loc care să combine sub același acoperiș Brain Mapping, qEEG, antrenamente neuronale BM-BCI, neurofeedback și o abordare profesional-integrată a Sistemului Creier-Minte. Nu exista. Așa că, după ce m-am vindecat singur, am decis să construiesc locul pe care eu aș fi vrut să-l găsesc. Au început să vină oameni. Mulți. Aparent, nu eram singurul."\n\n„La Veruvis lucrăm cu adulți care vin pentru motive foarte diferite: anxietate, atacuri de panică, tinitus, dificultăți de concentrare, burnout, suferință mintală cronică, performanță atletică sau de leadership, recuperare după traumatism cranian. Procesul e mereu același: pornim de la un Brain Map (qEEG) care arată exact ce se întâmplă în creierul tău. Apoi construim un plan de antrenament neuronal BM-BCI adaptat. Totul pentru a ajuta fiecare persoană în parte să-și înțeleagă această complexă relație creier-minte."\n\n„În cei 7 ani de la fondare, am analizat peste 18.000 de creiere, urmărind ceea ce numesc **Metoda Veruvis™** — o abordare proprie, dezvoltată și rafinată în practica zilnică. Avem locații în București și Cluj. Mentorul meu direct și partenerul nostru științific este Dr. Wesley Center, BCN Fellow, QEEG-DL, din SUA."',
        heroImage: veruvisImage,
        externalUrl: 'https://veruvis.ro',
        projectStatus: 'live',
        accent: 'navy',
        order: 1,
      },
      {
        name: 'Veruvis Kids',
        slug: 'veruvis-kids',
        tagline:
          'Antrenamente neuronale BM-BCI dedicate exclusiv copiilor și adolescenților între 3 și 18 ani.',
        description:
          'Brand separat de Veruvis, cu aceeași tehnologie — Brain Map qEEG, Antrenamente Neuronale BM-BCI — dar cu metoda, protocoalele, mediul fizic și modul de comunicare complet adaptate pentru copii și adolescenți. Locații în București și Cluj.',
        manifesto:
          '„Veruvis Kids este un brand separat de Veruvis. Aceeași tehnologie — Brain Map qEEG, Antrenamente Neuronale BM-BCI. Dar metoda, protocoalele, mediul fizic și modul de comunicare sunt complet adaptate pentru copii și adolescenți. Lucrăm cu vârste între 3 și 18 ani."\n\n„Vin la noi părinți cu copii care au primit diferite etichete în sistemul medical sau educațional — ADHD, dificultăți specifice de învățare, anxietate, tulburări de procesare senzorială, dificultăți de gestionare emoțională, performanță școlară sub potențial. Sau părinți care vor să sprijine performanța școlară, sportivă sau cognitivă a copilului fără să aștepte să apară probleme. Procesul începe cu un Brain Map care arată cum funcționează rețelele neuronale ale copilului — fără să-l etichetăm. Apoi construim un plan, antrenăm și măsurăm rezultate."\n\n„Veruvis Kids are locații în București și Cluj. Comunicarea se realizează întotdeauna cu părinții, nu cu copilul direct — copilul vine să se «joace». Totul fără presiunea «trebuie să te repari». Detaliile complete despre programe, protocoale și abordare sunt pe site-ul dedicat veruviskids.ro."',
        heroImage: veruvisKidsImage,
        externalUrl: 'https://veruviskids.ro',
        projectStatus: 'live',
        accent: 'paper',
        order: 2,
      },
      {
        name: 'Nircura',
        slug: 'nircura',
        tagline:
          'Prima companie românească specializată în tehnologie de fotobiomodulare — pentru uz profesional și pentru acasă.',
        description:
          'O companie de echipamente profesionale și home use de fotobiomodulare („red light therapy"), fabricate sau personalizate cu specificații verificate științific. Folosite în centrele Veruvis și Veruvis Kids ca parte a unor protocoale combinate cu antrenamentele neuronale BM-BCI, și vândute partenerilor B2B și utilizatorilor finali.',
        manifesto:
          '„Nircura a apărut din aceeași observație care a stat la baza Veruvis: tehnologia exista, dar nu era accesibilă publicului român — nici ca preț, nici ca informație. Fotobiomodularea, sau «red light therapy» cum o știu mulți, e o tehnologie cu peste 50 de ani de cercetare științifică serioasă în spate. Are aplicații documentate în recuperare musculară, sănătate cutanată, modulare inflamatorie și mai recent, în terapii neuronale combinate cu antrenamentele neuronale BM-BCI. Dar pe piața românească nu existau decât echipamente importate, prost specificate, fără o documentație clară."\n\n„Am construit Nircura ca o companie de echipamente profesionale și home use, fabricate sau personalizate cu specificații pe care le verificăm științific noi. Folosim aceste echipamente în centrele Veruvis și Veruvis Kids ca parte a unor protocoale combinate cu antrenamentele neuronale. Le vindem și separat, atât businessurilor partenere (spa-uri profesionale, centre de wellness, săli de fitness, clinici de recuperare), cât și direct utilizatorilor finali, pentru acasă."\n\n„Nircura nu e un side-project. Este o companie tehnologică în creștere, dezvoltare și educare. Site-ul, catalogul de produse, informațiile științifice detaliate, blogul tehnic — totul este pe nircura.ro."',
        heroImage: nircuraImage,
        externalUrl: 'https://nircura.com',
        projectStatus: 'live',
        accent: 'navy',
        order: 3,
      },
      {
        name: 'Asociația Română de Neurotehnologii Avansate',
        slug: 'asociatia-rntaa',
        tagline:
          'Organizație non-profit dedicată cercetării, educației publice și advocacy-ului pentru neurotehnologii avansate în România.',
        description:
          'Asociația Română de Neurotehnologii Avansate și Antrenamente Neuronale este o organizație non-profit inițiată pentru ca România să aibă o voce instituțională independentă în domeniul neurotehnologiilor. Face cercetare aplicată, educație publică deschisă și advocacy pentru reglementare etică.',
        manifesto:
          '„Asociația Română de Neurotehnologii Avansate și Antrenamente Neuronale este o organizație non-profit pe care am inițiat-o pentru că România are nevoie de o voce instituțională independentă pe acest domeniu. Industria neurotehnologică globală se mișcă rapid — Brain-Computer Interfaces, neuromodulare neinvazivă, AI aplicat în neuroștiință, terapii combinate. Decizii politice și de reglementare se iau în acest moment în Uniunea Europeană, în SUA, în Israel, în Japonia. România nu poate să stea pe margine."\n\n„Asociația face trei lucruri principale. Întâi, cercetare independentă pe teme aplicate — protocoale, eficacitate, siguranță, accesibilitate, condiții de utilizare. Al doilea, educație publică — articole, conferințe, ateliere deschise, materiale informaționale gratuite în limba română. Al treilea, advocacy — dialog cu autoritățile, propuneri legislative, parteneriate cu instituții academice, lobby pentru reglementare etică și pentru includerea neurotehnologiilor în programe de sănătate publică."\n\n„Asociația va avea curând propriul website unde vom face publice cercetările realizate, parteneriatele, lobby-ul pentru reglementare neuroștiințifică, programele educaționale și proiectele aflate în desfășurare. Vrem ca avansarea neurotehnologiilor în România să nu fie ascunsă în spatele paywall-urilor academice sau al rapoartelor inaccesibile — ci documentată deschis, în limba română, pentru oricine vrea să afle ce se construiește."',
        heroImage: null,
        externalUrl: null,
        projectStatus: 'upcoming',
        accent: 'paper-warm',
        order: 4,
      },
    ],
    'slug'
  )
}
