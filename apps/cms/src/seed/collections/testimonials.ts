import type { Core } from '@strapi/strapi'
import { upsertList } from '../utils'

export async function seedTestimonials(strapi: Core.Strapi): Promise<void> {
  const items = [
    {
      quote:
        'Cartea m-a prins de la primul capitol și nu mi-a dat drumul până la ultimul. După un an de blocaj și antidepresive care nu mai funcționau, am avut, în sfârșit, o explicație coerentă a ceea ce se întâmpla în creierul meu. Nu o promisiune de vindecare, ci o hartă. Cu tehnici simple, aplicate zilnic, am ajuns să dorm din nou și să mă recunosc. O recomand fiecărui om care a încercat de toate și nu mai are unde să caute.',
      author: 'Maria Ionescu',
      role: 'Psiholog clinician, București',
      source: 'book',
      rating: 5,
      featured: true,
    },
    {
      quote:
        'Sunt antreprenor, am două firme și un copil mic. Citisem zeci de cărți de productivitate și de „mindset", dar abia după Creierul este superputerea ta am înțeles că nu aveam o problemă de disciplină — aveam o problemă de neurofiziologie. Costin explică pe limba noastră ce înseamnă atenție, claritate, recuperare. De trei luni îmi structurez ziua complet diferit. Și rezultatele se văd.',
      author: 'Andrei Popescu',
      role: 'Antreprenor, fondator de startup',
      source: 'book',
      rating: 5,
      featured: true,
    },
    {
      quote:
        'Predau de douăzeci de ani și am citit multă literatură de neuroștiință — aproape toată tradusă greoi, aproape toată inaccesibilă pentru elevii mei. Cartea lui Costin este prima pe care le-o pot recomanda fără ezitare. E scrisă cu rigoare, dar și cu o căldură care lipsește de regulă în domeniu. O folosesc deja la opționalul de educație emoțională.',
      author: 'Cristina Vasilescu',
      role: 'Profesoară de biologie, liceu Iași',
      source: 'book',
      rating: 5,
      featured: false,
    },
    {
      quote:
        'Am trecut prin doi terapeuți și nimic nu se mișca. Cartea asta nu înlocuiește terapia — Costin spune asta clar de la început — dar mi-a dat exact contextul de care aveam nevoie ca să înțeleg ce mi se întâmplă. Capitolul despre vise și subconștient m-a marcat. Pentru prima dată am sentimentul că am o relație cu propriul meu creier, nu doar conflicte cu el.',
      author: 'Alexandru Mărgărit',
      role: 'Ofițer superior, Forțele Terestre',
      source: 'book',
      rating: 5,
      featured: false,
    },
    {
      quote:
        'O carte rară: serioasă fără să fie pedantă, vulnerabilă fără să fie melodramatică. Studiul de caz pe el însuși este un act de curaj editorial pe care îl rezerv să-l recomand pacienților care au nevoie să creadă că vindecarea există. Diferența față de literatura motivațională importată este uriașă — aici e neuroștiință reală, contextualizată pentru România.',
      author: 'Dr. Raluca Dumitrescu',
      role: 'Medic psihiatru, clinică privată',
      source: 'book',
      rating: 5,
      featured: false,
    },
    {
      quote:
        'Am cumpărat-o pentru fiul meu, am terminat-o eu primul. Acum am cumpărat încă două exemplare, pentru părinții mei. Costin reușește să spună lucruri pe care le simțisem dintotdeauna, dar pentru care nu aveam cuvinte. Capitolul 13 — poveștile de vindecare — l-am citit cu lacrimi în ochi. Mulțumesc că ai scris-o.',
      author: 'Elena Stoica',
      role: 'Manager HR, mamă a doi adolescenți',
      source: 'book',
      rating: 5,
      featured: false,
    },
  ]

  await upsertList(strapi, 'api::testimonial.testimonial', items, 'author')
}
