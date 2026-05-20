import type { Core } from '@strapi/strapi'
import { upsertSingleType } from '../utils'

export async function seedContactPage(strapi: Core.Strapi): Promise<void> {
  await upsertSingleType(strapi, 'api::contact-page.contact-page', {
    seoTitle: 'Contact — Costin Dămășaru',
    seoDescription:
      'Scrie-mi un mesaj, propune o conversație sau cere un material de presă. Răspund personal, cât pot de repede.',
    sections: [
      // Zone 1 — Hero (navy)
      {
        __component: 'sections.hero',
        eyebrow: 'CONTACT',
        title: 'Hai să',
        titleItalic: 'vorbim.',
        subtitle:
          'Fie că ai o întrebare, o propunere de colaborare sau vrei să mă inviți pe scenă, lasă-mi un mesaj. Citesc tot ce primesc și răspund personal.',
        accent: 'navy',
        mediaPosition: 'none',
      },

      // Zone 2 — Canale de contact (paper, cards grid)
      {
        __component: 'sections.cards-grid',
        eyebrow: 'CANALE',
        heading: 'Trei moduri',
        headingItalic: 'să ajungi la mine.',
        lead: 'Pentru fiecare tip de cerere, există un drum mai scurt. Alege-l pe cel potrivit și ajungem mai repede unde trebuie.',
        accent: 'paper',
        columns: '3',
        items: [
          {
            title: 'Scrie-mi un email',
            text: 'Pentru întrebări personale, propuneri editoriale sau orice nu se încadrează în categoriile de mai jos. Răspund în câteva zile.',
            tag: 'EMAIL',
            href: 'mailto:contact@damasaru.ro',
          },
          {
            title: 'Invitație pe scenă',
            text: 'Conferințe, workshop-uri, evenimente corporate sau interviuri publice. Trimite-mi detaliile prin formularul de mai jos.',
            tag: 'SPEAKING',
            href: '#contact',
          },
          {
            title: 'Materiale de presă',
            text: 'Fotografii, bio, fragmente din carte și informații pentru jurnaliști. Toate, pregătite și gata de descărcat.',
            tag: 'PRESĂ',
            href: '/media',
          },
        ],
      },

      // Zone 3 — Formularul de contact (paper)
      {
        __component: 'sections.contact-form',
        eyebrow: 'FORMULAR',
        heading: 'Lasă-mi',
        headingItalic: 'un mesaj.',
        subtext:
          'Spune-mi pe scurt despre ce e vorba. Dacă e o invitație sau o propunere concretă, adaugă datele esențiale — dată, loc, public, context.',
        nameLabel: 'Nume',
        emailLabel: 'Email',
        messageLabel: 'Mesaj',
        submitLabel: 'Trimite mesajul',
        successMessage: 'Mulțumesc — îți răspund cât pot de repede.',
        accent: 'paper',
      },

      // Zone 4 — Newsletter (navy-deep) — identical pattern to Home
      {
        __component: 'sections.newsletter-form',
        eyebrow: 'NEWSLETTER',
        heading: 'Ce vezi tu nu e doar un creier.',
        headingItalic: 'E o viață.',
        subtext:
          'Newsletter săptămânal — un eseu scurt, un episod nou de podcast, un eveniment care merită. Fără spam. Vreodată.',
        buttonLabel: 'Abonează-te',
        placeholder: 'Adresa ta de email',
        accent: 'navy-deep',
        formId: 'contact',
      },
    ],
  })
}
