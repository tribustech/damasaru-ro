import type { Core } from '@strapi/strapi'
import { upsertSingleType } from '../utils'

export async function seedContactPage(strapi: Core.Strapi): Promise<void> {
  await upsertSingleType(strapi, 'api::contact-page.contact-page', {
    seoTitle: 'Contact — Costin Dămășaru',
    seoDescription:
      'Scrie-i direct lui Costin Dămășaru — pentru presă, evenimente, colaborări sau feedback. Răspuns personal în 48 de ore.',
    sections: [
      // ZONA 1 — Hero (navy). Copy verbatim from Contact_Mockup.html.
      {
        __component: 'sections.hero',
        eyebrow: 'Contact',
        title: 'Hai să',
        titleItalic: 'vorbim.',
        subtitle:
          '„Indiferent dacă scrii pentru presă, vrei să mă inviți la un eveniment, sau vrei doar să-mi spui cum te-a impactat o idee — sunt aici și ascult."',
        accent: 'navy',
        mediaPosition: 'none',
      },

      // ZONA 2 — Formular (paper). Copy verbatim from Contact_Mockup.html.
      // TODO (schema gap): contact-form component needs subjectOptions[], organizationLabel,
      // consentText, fineprint + an email routing map to fully express the HTML mockup form
      // (subject select with 5 options, optional organization field, GDPR checkbox).
      // Tracked as punch-list item #5. Until then, only nameLabel/emailLabel/messageLabel render.
      {
        __component: 'sections.contact-form',
        eyebrow: 'Scrie-mi',
        heading: 'Spune-mi cu ce',
        headingItalic: 'te pot ajuta.',
        subtext:
          '„Citesc fiecare mesaj personal. Răspund în 48 de ore lucrătoare, în general mai repede dacă pot."',
        nameLabel: 'Numele tău',
        emailLabel: 'Email',
        messageLabel: 'Mesajul tău',
        submitLabel: 'Trimite mesajul',
        successMessage:
          'Am primit mesajul tău. Îți răspund personal în 48 de ore lucrătoare.',
        accent: 'paper',
      },

      // ZONA 3 — Mă găsești și aici (navy). 6 social channels, copy + hrefs verbatim from HTML.
      // TODO: Costin to confirm real URLs/handles before launch (per Contact_Copy.docx §5.1).
      {
        __component: 'sections.cards-grid',
        eyebrow: 'În rest',
        heading: 'Mă găsești',
        headingItalic: 'și aici.',
        lead: '„Sunt activ pe rețele și acolo conversația e mai relaxată — pe LinkedIn împărtășesc mai mult din zona profesională, pe Instagram și TikTok lucruri mai apropiate de viața de zi cu zi."',
        accent: 'navy',
        columns: '3',
        items: [
          {
            title: 'LinkedIn',
            text: '/in/costindamasaru',
            href: 'https://linkedin.com/in/costindamasaru',
          },
          {
            title: 'YouTube',
            text: '@costindamasaru',
            href: 'https://youtube.com/@costindamasaru',
          },
          {
            title: 'Instagram',
            text: '@costindamasaru',
            href: 'https://instagram.com/costindamasaru',
          },
          {
            title: 'Spotify',
            text: 'Podcast',
            href: 'https://open.spotify.com/show/costindamasaru',
          },
          {
            title: 'Facebook',
            text: '/costindamasaru',
            href: 'https://facebook.com/costindamasaru',
          },
          {
            title: 'TikTok',
            text: '@costindamasaru',
            href: 'https://tiktok.com/@costindamasaru',
          },
        ],
      },
    ],
  })
}
