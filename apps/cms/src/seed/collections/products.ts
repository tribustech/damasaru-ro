import type { Core } from '@strapi/strapi'
import { upsertList, uploadFile, docPath } from '../utils'

export async function seedProducts(strapi: Core.Strapi): Promise<void> {
  const bookCover = await uploadFile(
    strapi,
    docPath('7. Magazin', 'Creierul-este-superputerea-ta_Coperta-v02.jpg'),
    { alt: 'Coperta cărții „Creierul este superputerea ta"' }
  )

  const iasiVisual = await uploadFile(
    strapi,
    docPath('7. Magazin', 'V-0148.jpg'),
    { alt: 'Costin Dămășaru pe scenă — non-conferința de la Iași' }
  )

  await upsertList(
    strapi,
    'api::product.product',
    [
      {
        title: 'Creierul este superputerea ta — carte tipărită',
        slug: 'creierul-superputere-print',
        format: 'hardcover',
        price: '89 lei',
        currency: 'RON',
        image: bookCover,
        buyUrl:
          'https://bookzone.ro/?utm_source=costindamasaru.ro&utm_medium=magazin&utm_campaign=carte_fizica',
        description:
          'Cartea care explică, în limbaj accesibil, cum funcționează creierul tău și ce poți face concret ca să-l antrenezi. Bestseller Bookzone 2024.',
        longDescription:
          '224 de pagini despre cum funcționează creierul tău și ce poți face concret ca să-l antrenezi — fără jargon, fără promisiuni miraculoase, doar știință tradusă în viața de zi cu zi.\n\nE varianta pe care o ai pe raft, o subliniezi cu pixul, o dăruiești cuiva la care ții. Pentru cititorii care vor cartea în mână și hârtia care reține notițe.\n\nLivrare prin Bookzone, distribuitorul oficial — 1-3 zile lucrătoare în orice oraș din România.',
        availability: 'available',
        featured: true,
        order: 1,
      },
      {
        title: 'Creierul este superputerea ta — e-book',
        slug: 'creierul-superputere-ebook',
        format: 'ebook',
        price: '39 lei',
        currency: 'RON',
        image: bookCover,
        buyUrl: 'https://costindamasaru.ro/magazin/ebook',
        description:
          'Aceeași carte, în format digital. Download instant după plată, în PDF + EPUB. Citește pe orice device — laptop, tabletă, Kindle, telefon.',
        longDescription:
          'Conținutul e identic cu varianta tipărită — același text, aceleași 224 de pagini, aceleași exemple. Diferența e doar de format și experiență.\n\nPrimești ambele formate: PDF (compatibil cu orice device) și EPUB (optim pentru Kindle, Apple Books, Kobo). Link-urile către referințe sunt active, dimensiunea fontului e ajustabilă, funcția de căutare găsește orice idee în câteva secunde.\n\nDupă plată primești pe email un link unic de download, valabil 7 zile, cu maxim 3 descărcări. Plata e procesată securizat prin Stripe.',
        availability: 'available',
        featured: true,
        order: 2,
      },
      {
        title: 'Creierul este superputerea ta — audiobook',
        slug: 'creierul-superputere-audiobook',
        format: 'audiobook',
        price: '49 lei',
        currency: 'RON',
        image: bookCover,
        buyUrl: 'https://costindamasaru.ro/magazin/audiobook-waitlist',
        description:
          'Cartea — citită de mine, capitol cu capitol. Pentru când vrei să o asculți la volan, la antrenament sau la plimbare. Lansare estimată — toamna 2026.',
        longDescription:
          'Înregistrat personal de Costin Dămășaru, capitol cu capitol. Aproximativ 8 ore de ascultare, livrat ca fișiere MP3 plus acces la streaming.\n\nE varianta pentru oamenii care citesc cu urechile — la volan, la sport, în timp ce gătesc sau se plimbă. Aceleași idei din carte, în timpul mort din zi.\n\nLansare estimată toamna 2026. Lasă-ți emailul pe lista de așteptare și primești un singur mesaj — în ziua în care apare. Fără spam între timp.',
        availability: 'waitlist',
        featured: false,
        order: 3,
      },
      {
        title: 'Iași — Non-conferința Costin Dămășaru, Septembrie 2026',
        slug: 'iasi-non-conferinta-sep-2026',
        format: 'event',
        price: '350 lei',
        currency: 'RON',
        image: iasiVisual,
        buyUrl: 'https://costindamasaru.ro/magazin/iasi-2026-waitlist',
        description:
          'Prima non-conferință declarată sub brandul meu. Vii cu întrebările tale, răspund pe loc — cu ce știu și ce nu știu. Fără PowerPoint, fără agendă bătută în cuie.',
        longDescription:
          'Septembrie 2026, Iași. O singură seară, capacitate limitată, doar conversație directă cu sala.\n\nFără slide-uri, fără temă prestabilită. Vii cu întrebările tale despre creier, viață, muncă, relații — eu răspund cu ce știu din cercetare și recunosc clar ce nu știu. E formatul în care am cele mai interesante schimburi de idei și sper că la fel va fi și pentru tine.\n\nDetalii complete (locație exactă, dată, preț final) anunțate în iulie 2026. Cei pe lista de așteptare primesc acces prioritar la bilete, cu 24-48 de ore înainte de deschiderea publică.',
        availability: 'upcoming',
        featured: true,
        order: 4,
      },
      {
        title: 'Curs online — Fundamentele creierului tău',
        slug: 'curs-fundamentele',
        format: 'course',
        price: null,
        currency: 'RON',
        image: null,
        buyUrl: 'https://costindamasaru.ro/magazin/curs-fundamentele-waitlist',
        description:
          'Un curs online structurat în jurul ideilor de bază din carte — cum funcționează creierul, cum se antrenează, cum se odihnește. În lucru, lansare anunțată separat.',
        longDescription:
          'Cursul pe care îl construiesc pornind de la întrebările pe care mi le puneți cel mai des după carte. Module video scurte, materiale descărcabile, exerciții pe care le faci în propriul ritm.\n\nNu e o repetare a cărții — e versiunea aplicată, cu exemple, cu pași concreți, cu spațiu pentru întrebări. Pentru cititorii care vor să meargă mai departe de citit și să transforme ideile în obiceiuri.\n\nLista de așteptare are preț preferențial față de public și acces prioritar la sesiunea pilot. Lansare anunțată când programul e gata — nu înainte.',
        availability: 'upcoming',
        featured: false,
        order: 5,
      },
      {
        title: 'Bundle — Cartea + Cursul Fundamentele',
        slug: 'bundle-carte-curs',
        format: 'bundle',
        price: '420 lei',
        currency: 'RON',
        image: bookCover,
        buyUrl: 'https://costindamasaru.ro/magazin/bundle-waitlist',
        description:
          'Cartea (e-book) împreună cu accesul la cursul Fundamentele, la un preț mai mic decât suma celor două luate separat. Disponibil odată cu lansarea cursului.',
        longDescription:
          'Pachetul gândit pentru cititorii care vor și partea narativă (cartea), și partea aplicată (cursul). Primești e-book-ul imediat după plată, iar accesul la curs se activează automat la lansarea publică.\n\nPrețul de bundle e mai mic decât suma celor două produse cumpărate separat și include acces pe viață la materialele cursului, inclusiv actualizările viitoare.\n\nDisponibil din momentul în care cursul Fundamentele intră live. Înscrie-te pe lista de așteptare ca să fii primul anunțat — și să prinzi early-bird-ul.',
        availability: 'upcoming',
        featured: false,
        order: 6,
      },
    ],
    'slug'
  )
}
