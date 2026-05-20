import type { Core } from '@strapi/strapi'
import { upsertList } from '../utils'

export async function seedPressMentions(strapi: Core.Strapi): Promise<void> {
  const items = [
    // === MAGAZINE (print + editorial) ===
    {
      title: 'Cover story: Drumul către performanță prin tehnologie',
      outlet: 'Revista CARIERE',
      url: 'https://revistacariere.ro/inspiratie/costin-damasaru-drumul',
      date: '2023-11-01',
      type: 'magazine',
      excerpt:
        'Ediția print nr. 286 — articolul de deschidere despre cum tehnologia BM-BCI redefinește antrenamentul cognitiv în România.',
      featured: true,
    },
    {
      title: 'Interviu: Metoda inovatoare de antrenament neuronal',
      outlet: 'Revista Biz',
      url: 'https://revistabiz.ro/costin-damasaru-veruvis',
      date: '2023-06-15',
      type: 'magazine',
      excerpt:
        'Interviu antreprenor despre cum Veruvis a devenit prima platformă din România de inovare în neurotehnologii avansate.',
      featured: false,
    },
    {
      title: '24 pentru 2024 — Viitorul nu e al inteligenței artificiale, ci al creierului uman optimizat',
      outlet: 'Forbes România',
      url: 'https://www.forbes.ro/24-pentru-2024-costin-damasaru-fondator-veruvis-viitorul-nu-este-al-inteligentei-artificiale-ci-al-creierului-uman-optimizat-377242',
      date: '2024-01-20',
      type: 'magazine',
      excerpt:
        'Proiect editorial Forbes — selecția celor 24 de oameni care vor defini 2024 în România. Costin reprezintă verticala neuroștiință aplicată.',
      featured: true,
    },
    {
      title: 'Interviu video featuring — relația creier-minte',
      outlet: 'Psychologies',
      url: 'https://www.youtube.com/watch?v=fakcgSwBevY',
      date: '2024-04-10',
      type: 'magazine',
      excerpt:
        'Interviu featuring în ediția aprilie — o discuție amplă despre cum relația creier-minte schimbă modul în care abordăm sănătatea mintală.',
      featured: false,
    },
    {
      title: 'Editorial: Resurse umane și leadership prin lentila neuroștiinței',
      outlet: 'HR Manager',
      url: 'https://www.youtube.com/@REVISTA.CARIERE',
      date: '2023-09-05',
      type: 'magazine',
      excerpt:
        'Editura Cariere — perspectivă editorială pe leadership și performanță cognitivă pentru directorii HR.',
      featured: false,
    },
    {
      title: 'Forbes CEE Forum 2023 — Conceptul de AI se poate numi mai bine inteligență non-umană',
      outlet: 'Forbes România',
      url: 'https://www.forbes.ro/forbes-cee-forum-2023-costin-damasaru-fondator-ceo-veruvis-357168',
      date: '2023-10-12',
      type: 'magazine',
      excerpt:
        'Intervenție pe scena Forbes CEE Forum — argument pentru o redefinire mai onestă a ceea ce numim astăzi „inteligență artificială".',
      featured: false,
    },

    // === TV ===
    {
      title: 'Vorbește Lumea — invitat principal',
      outlet: 'Pro TV',
      url: 'https://www.youtube.com/watch?v=Jr37W7oaBoc',
      date: '2024-03-18',
      type: 'tv',
      excerpt:
        'Emisiune de dimineață Pro TV — conversație despre cum funcționează creierul în viața de zi cu zi și ce putem face pentru el.',
      featured: true,
    },
    {
      title: 'Eu Pot — interviu de profunzime',
      outlet: 'TVR',
      url: 'https://www.youtube.com/watch?v=x6pEY7HWSNU',
      date: '2023-05-22',
      type: 'tv',
      excerpt:
        'Format public TVR — o oră despre cum se construiește, măsurabil, ieșirea din burnout și anxietate.',
      featured: false,
    },

    // === PODCAST ===
    {
      title: 'Fain & Simplu — episodul Costin Dămășaru',
      outlet: 'Mihai Morar',
      url: 'https://www.youtube.com/watch?v=GBUST4tXG6k',
      date: '2024-02-14',
      type: 'podcast',
      excerpt:
        'Conversație lungă despre creier, copilărie, recuperare și ce înseamnă cu adevărat „să te cunoști pe tine".',
      featured: false,
    },
    {
      title: 'Mind Architect — neurotehnologii și performanță',
      outlet: 'Paul Olteanu',
      url: 'https://www.youtube.com/watch?v=3oqoQzbkxvM',
      date: '2023-08-30',
      type: 'podcast',
      excerpt:
        'Discuție tehnică despre Brain Mapping, BCI și ce înseamnă să-ți măsori activitatea cerebrală în timp real.',
      featured: false,
    },
    {
      title: 'Acasă la Măruță — viața din spatele cercetării',
      outlet: 'Pro TV / Măruță',
      url: 'https://www.youtube.com/watch?v=aZip-MfPhNw',
      date: '2024-05-08',
      type: 'podcast',
      excerpt:
        'Conversație personală despre drumul de la criză personală la fondarea Veruvis — și despre ce-l ține în priză.',
      featured: false,
    },

    // === ARTICLE ===
    {
      title: 'Cum ne ajută Brain Mapping–BCI să ne optimizăm creierul',
      outlet: 'HotNews',
      url: 'https://hotnews.ro/dr-psih-drd-costin-damasaru-fondatorul-veruvis-cum-ne-poate-ajuta-tehnologia-brain-mapping-brain-computer-interface-sa-ne-optimizam-creierul-17675',
      date: '2024-01-08',
      type: 'article',
      excerpt:
        'Articol-interviu HotNews — explicarea accesibilă a tehnologiei Brain Mapping–BCI și a aplicațiilor sale în România.',
      featured: false,
    },

    // === INTERVIEW (longform written) ===
    {
      title: 'Cum să ne vindecăm de toxicitatea din viața noastră',
      outlet: 'Adevărul Live',
      url: 'https://adevarul.ro/adevarul-live/cum-sa-ne-vindecam-de-toxicitatea-din-viata-2323386.html',
      date: '2023-12-04',
      type: 'interview',
      excerpt:
        'Interviu live Adevărul — relațiile toxice, mediile toxice și cum reacționează un creier care a învățat să supraviețuiască în ele.',
      featured: false,
    },

    // === RADIO ===
    {
      title: 'Guerilla — neuroștiință în direct',
      outlet: 'Radio Guerrilla',
      url: 'https://www.youtube.com/watch?v=5zxHlih6428',
      date: '2023-04-19',
      type: 'radio',
      excerpt:
        'Intervenție radio despre cum se duce cercetarea în neurotehnologii la oameni — fără jargon, fără promisiuni false.',
      featured: false,
    },
  ]

  await upsertList(strapi, 'api::press-mention.press-mention', items, 'url')
}
