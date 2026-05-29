# damasaru.ro — Canonical Site Specification

> **Source:** `../Documentation/Structura Site.xlsx` (client-supplied, 5 sheets). That `.xlsx` is the binary you cannot read with text tools — **this Markdown is its digest**. If the two disagree, the `.xlsx` wins; update this file to match.
>
> **Companion docs:**
> - `../Documentation/Look And Feel Homepage.html` — visual reference for the homepage zones below.
> - `../Documentation/Pagini/<n>. <name>/` — per-page copy (`.docx`), mockups, photography. Plain-text `.docx` lives under `/tmp/damasaru-copy/`.
> - `damasaru-ro/CLAUDE.md` — engineering conventions (CMS layering, dynamic-zone rules, dev workflow).

---

## 1. Strategic objective

Build Costin Dămășaru's public authority as Romania's expert on mental health, with a foundation that could support an eventual public / political pivot. The site is **independent** of Veruvis and the other ventures — those appear as **Proiecte**, not protagonists. The shop is structured for future expansion: books, digital programs, AI agents, meditations, courses.

### Conversion priorities (ordered)

| # | Desired action | How the site delivers it |
| - | --- | --- |
| 1 | Sign up for public events | Prominent event banner on home + dedicated section + Eventbrite embed |
| 2 | Discover projects (Veruvis etc.) | `Proiecte` section with quick access + external links |
| 3 | Invite as speaker / podcast guest | `Contact` page with differentiated forms |
| 4 | Buy book / shop products | Shopify Headless `Magazin` + hero CTA |
| 5 | Subscribe to podcast / newsletter | ConvertKit form in footer + closing homepage CTA |
| 6 | Press contact for interviews | Downloadable press kit + dedicated `Contact` form |

---

## 2. Main menu (9 items + CTA)

The menu has **9 nav items + 1 separated CTA**. `Acasă` is the brand mark and does **not** appear as a nav item.

| # | Item | URL | Primary content |
| -- | --- | --- | --- |
| 0 | Acasă (brand mark, not in nav) | `/` | Hero + featured podcast episode + nearest event + projects + shop preview |
| 1 | Despre mine | `/despre` | Narrative bio + credentials + Modelul Dămășaru + vision |
| 2 | Cartea | `/cartea` | The bestseller: synopsis, preview chapters, buy |
| 3 | Podcast | `/podcast` | Episodes + guests + transcripts (SEO) |
| 4 | Idei | `/idei` | Essays + opinion + scientific publications |
| 5 | Proiecte | `/proiecte` | Hub: Veruvis, Veruvis Kids, Nircura, Asociația |
| 6 | Evenimente | `/evenimente` | Upcoming + past + speaker bookings |
| 7 | Magazin | `/magazin` | Shopify Headless: books, programs, AI agents, meditations |
| 8 | Media | `/media` | TV, written press, press kit, press contact |
| 9 | **Contact (CTA)** | `/contact` | **Separated, emphasized button** — differentiated forms |

> **Note on URL drift:** the xlsx specifies `/cartea`. The current repo routes it at `/carte` (see `damasaru-ro/CLAUDE.md`). Both forms appear in the codebase — confirm with the client before changing live routes; this spec uses the xlsx form (`/cartea`) as canonical intent.

---

## 3. Sitemap with build priority

Priorities: **P0 = MUST ship**, **P1 = next**, **P2 = later**, **P0 — legal = required for launch (GDPR/ANPC)**.

### Top-level pages (P0 unless noted)
- `/` — Homepage
- `/despre` — About narrative
- `/cartea` — Product page (P0)
- `/podcast` — Hub listing (P0)
  - `/podcast/[slug]` — Episode detail (P0)
- `/idei` — Editorial hub (P0)
  - `/idei/[slug]` — Article (P0)
  - `/idei/eseuri` — Filter view (P1)
  - `/idei/opinie` — Filter view (P1)
  - `/idei/cercetare` — Filter view (P2)
- `/proiecte` — Hub cards (P0)
  - `/proiecte/veruvis` — Project → external (P0)
  - `/proiecte/veruvis-kids` — Project → external (P0)
  - `/proiecte/nircura` — Project → external (P0)
  - `/proiecte/asociatie` — Asociația Română Neurotehnologii Avansate (P1)
- `/evenimente` — Hub listing (P0)
  - `/evenimente/[slug]` — Detail + Eventbrite (P0)
  - `/evenimente/arhiva` — Past events (P1)
  - `/evenimente/speaker` — Costin as invited speaker booking (P1)
- `/magazin` — Shop hub (Shopify) (P0)
  - `/magazin/carti` — Books listing (P0)
  - `/magazin/programe` — Digital programs (P1)
  - `/magazin/agenti` — AI agents (P1)
  - `/magazin/meditatii` — Audio meditations (P2)
  - `/magazin/[slug]` — Product detail (P0)
  - `/magazin/cos` — Cart (P0)
  - `/magazin/checkout` — Shopify hosted (P0)
  - `/magazin/confirmare` — Thank-you page (P0)
  - `/magazin/cont` — Customer account (P1)
- `/media` — Press hub (P1)
  - `/media/tv` — Video gallery (P1)
  - `/media/presa` — Article list (P1)
  - `/media/press-kit` — Download page (P1)
- `/contact` — Multi-form page (P0)

### Global / utility
- Newsletter signup (ConvertKit, inline footer component) — P0
- `/404` — Error page (P1)

### Legal (all P0 — legal)
- `/privacy` — Privacy policy
- `/terms` — Terms & conditions
- `/cookies` — Cookies policy + banner
- `/termeni-magazin` — Shop terms (GDPR + ANPC)
- `/retur` — Return policy

---

## 4. Homepage — chromatic zones

The homepage breathes through controlled alternation. Light backgrounds carry long reading; **navy is the accent**, not the wallpaper — that is why it stays memorable.

**Chromatic rhythm:** `Navy → Paper → Navy → Paper → Paper-warm → Paper → Navy → Footer Navy-deep`

| Zone | Background | Section | Strategic role | Content / components | CTAs | Dev notes |
| --- | --- | --- | --- | --- | --- | --- |
| **Z1** | `--navy #14202E` | Navbar + Hero + Proiecte strip | Strong opening, massive authority. Hero and projects strip live on the **same navy background** — no visual separator. | Sticky navbar with navy blur · Hero: gold eyebrow + Cormorant H1 + lead + 2 CTAs + photo with 2 stat cards · Proiecte strip: subtle `border-top` + label + 4 serif links | Primary gold: `Descoperă cartea` · Ghost: `Ascultă podcast-ul` · Project links (gold on hover) | All on the same navy. **No border between hero and strip.** Staggered fade-in 100 ms on load. |
| **Z2** | `--paper #F5F2EC` | Podcast | Relaxed browsing — episodes read easily on the lighter background. A big navy card sits **inside** the zone to create internal contrast without flipping the zone background. | H2 with italic gold deep + lead · Grid `1.4fr / 1fr`: featured podcast card (navy) + list of 3 episodes (white line cards) | `Ascultă acum` with gold play-circle · `Toate episoadele →` · Links to Spotify / YouTube | The navy card is **a card, not a zone**. Soft navy `box-shadow` to lift it. Pulse-dot on `Episod nou` tag. |
| **Z3** | `--navy #14202E` | Idei (gravitas) | The second dramatic moment. The featured article reads like a late-night essay — intellectual gravitas. **This is where the public figure is built.** | Featured article in `1.3fr / 1fr` grid (text + featured image) · 3 secondary articles in 3 columns separated by `navy-line` borders | `Citește eseul` (gold primary) · `Toate articolele →` (gold text-link) · `Filtrează pe categorii` (ghost-light) | Single navy section on this scroll. Featured = newest essay/opinion in the CMS. List = next 3 articles. |
| **Z4** | `--paper #F5F2EC` | Proiecte | Tech content reads on light background. **4 projects as rows** for maximum clarity. | H2 + list of 4 project rows: italic gold number + large serif name + description + `Vezi` CTA | Per row: `Vezi →` (uppercase small, gold on hover) | On hover: `padding-left` animates 16 px. Slugs link to `/proiecte/[slug]`. |
| **Z5** | `--paper-warm #EBE6DC` | Eveniment | **Conversion priority #1.** Warmer background = greater importance. The big navy card becomes a precious object on a warm table. | H2 nearest-event · Large navy card: gold pulse-dot status + H3 with italic gold + meta (date, location, duration) + side navy-soft card with seats remaining | **PRIMARY gold:** `Rezervă-ți locul →` · Text-link: `Toate evenimentele` | Auto-pull the nearest active event from CMS. Click → `/evenimente/[slug]` → Eventbrite embed. Strong `box-shadow` on the card. |
| **Z6** | `--paper #F5F2EC` | Magazin + Presă | Shop window on light background. Press strip lives as a sub-section in the **same zone** to avoid another background flip. | **Magazin:** H2 with 2 italics + 3 product cards (book bestseller, upcoming program, upcoming AI agent) · Separator + **Press:** centered eyebrow + 7 media logos | Per card: `Cumpără →` / `Listă așteptare →` · `Vezi tot magazinul` (ghost) · `Toate aparițiile media →` (text-link) | Cards pull from Shopify Headless (featured filter). Gold `Bestseller` tag / forest `În curând`. Press logos are real SVGs — grayscale with hover full-color. |
| **Z7** | `--navy #14202E` | CTA Newsletter (closing) | Third dramatic moment = curtain call. Closes the site with impact and captures email for the long-term relationship. | Centered card (max 760 px) with gold radial-gradient · H2 with italic gold + light subcopy + inline form (email input + gold `Abonează-te` button) | Form: `Abonează-te` (gold on navy) | ConvertKit API. **Double opt-in mandatory (GDPR).** Auto-tag: `homepage_cta`. Custom navy confirmation page. |
| **FT** | `--navy-deep #0E1822` | Footer | Visual foundation. Darker than navy to mark the closing. | Serif brand (`Dămășaru` gold italic) + tagline · 3 columns with gold uppercase H4: `Navigare / Activitate / Urmărește` · Bottom: copyright + `Made in România` | All links (gold on hover) · Social links in col 3 | `Schema.org Organization` markup. Newsletter form does **not** repeat (already on Z7). `navy-line` border-top for the bottom strip. |

> **Repo reality check (2026-05-20):** `damasaru-ro` already has the four accent values (`navy / paper / paper-warm / navy-deep`) wired through `apps/web/lib/accent.ts`, and `apps/web/components/organisms/DynamicZone.tsx` lists every section component. The chromatic rhythm above is the **content/order** the home `home-page` single type must produce via its `sections` dynamic zone.

---

## 5. Inner pages — section blueprint

For every page: section list (in order), proposed H1, primary CTAs, and the `schema.org` types to emit.

### `/despre` — DESPRE
- **H1:** *Costin Dămășaru — neurocercetător, autor, fondator*
- **Sections:** Hero with portrait + tagline → Narrative bio (who I am, journey) → Credentials (MIT, doctorate, psychology) → **Modelul Dămășaru** (own framework) → Vision & mission → Career timeline → CTA: contact / podcast
- **CTAs:** `Citește cartea` · `Invită-l ca speaker` · `Ascultă podcast`
- **Schema:** `Person`, `ProfessionalService`

### `/cartea` — CARTEA
- **H1:** *[Titlul cărții] — descrierea cărții într-o frază*
- **Sections:** Hero with cover + title + subtitle → About the book (200–300-word synopsis) → Chapters (accordion list) → Free preview (first chapter PDF) → Press & reader reviews → Audiobook (if any) → Buy links (internal Shopify + Cărturești, Libris, Amazon)
- **CTAs:** `Cumpără din Magazin` · `Descarcă preview` · `Audiobook`
- **Schema:** `Book`, `Review`, `AggregateRating`

### `/podcast` — PODCAST (hub)
- **H1:** *Podcast Costin Dămășaru — conversații despre creier, viață și sens*
- **Sections:** Hero with trailer / latest featured episode → Episode list (paginated, 10/page) → Filter by theme/guest → Newsletter CTA (notifications) → Platform links (Spotify, Apple, YouTube) → About the podcast (1 paragraph)
- **CTAs:** `Abonează-te` · `Ascultă pe Spotify` · `Toate platformele`
- **Schema:** `PodcastSeries`, `PodcastEpisode`

### `/podcast/[slug]` — PODCAST (episode)
- **H1:** *Ep. [N]: [Titlu episod] — cu [Nume invitat]*
- **Sections:** Header (title, guest, duration, date) → Player embed (Spotify + YouTube) → About this episode (300–500 words) → About the guest (bio + links) → Mentioned resources → **Full transcript (massive SEO)** → 3 similar episodes → Newsletter CTA
- **CTAs:** `Ascultă pe Spotify` · `YouTube` · `Newsletter`
- **Schema:** `PodcastEpisode`, `Person` (guest)

### `/idei` — IDEI (hub)
- **H1:** *Idei — eseuri și articole despre sănătatea mentală*
- **Sections:** Editorial hero with latest featured essay → Filters: `Eseuri / Opinie / Cercetare` → Article grid (12/page, paginated) → Sidebar: most-read → Mid-page newsletter signup
- **CTAs:** `Abonează-te la newsletter` · `Toate articolele`
- **Schema:** `Blog`, `CollectionPage`

### `/idei/[slug]` — IDEI (article)
- **H1:** *[Titlu articol] — [subtitlu opțional]*
- **Sections:** Header (title, category, date, read time) → Featured image → Highlighted lead paragraph → Body (markdown render) → Pull quotes (italic serif gold) → Author box (Costin) → Similar articles → Newsletter CTA · **No comments** (confirmed decision)
- **CTAs:** `Newsletter signup` · `Citește mai multe` · social share
- **Schema:** `Article`, `NewsArticle`, `OpinionNewsArticle`

### `/proiecte` — PROIECTE (hub)
- **H1:** *Proiecte — ecosistemul de neurotehnologii*
- **Sections:** Hero "Patru inițiative care duc cercetarea în lumea reală" → 4 project cards (richer visuals than on homepage) → Per card: photo, name, tagline, description, CTA
- **CTAs:** `Vezi proiectul →` (per card)
- **Schema:** `ItemList`, `Organization`

### `/proiecte/[slug]` — PROIECTE (detail)
- **H1:** *[Nume proiect] — [tagline]*
- **Sections:** Hero with logo + tagline → Problem solved → Solution & methodology → Results / impact (numbers) → Key team → External link to official brand site → Gallery / video (optional)
- **CTAs:** `Vizitează site-ul oficial →` · `Programează o sesiune`
- **Schema:** `Organization`, `Service`

### `/evenimente` — EVENIMENTE (hub)
- **H1:** *Evenimente — întâlniri publice cu Costin Dămășaru*
- **Sections:** Hero with featured upcoming event → Tabs: `Viitoare / Trecute` → Event card list → Per card: date, title, location, status → CTA `Invită-l ca speaker`
- **CTAs:** `Rezervă-ți locul` · `Vezi detalii` · `Invită-l ca speaker`
- **Schema:** `EventSeries`, `Event`

### `/evenimente/[slug]` — EVENIMENTE (detail)
- **H1:** *[Numele evenimentului] — [data] [orașul]*
- **Sections:** Hero (date, title, location) → About the event → Detailed agenda → Speakers (if more guests) → Participation benefits → Seats remaining + countdown → **Eventbrite embed** → Location map → FAQ → Similar past events
- **CTAs:** **PRIMARY** `Rezervă-ți locul` (Eventbrite) · `Add to calendar`
- **Schema:** `Event`, `Place`, `Offer`

### `/magazin` — MAGAZIN (hub)
- **H1:** *Magazin — Costin Dămășaru*
- **Sections:** Hero "Cărți, cursuri și instrumente de transformare" → Visual categories (`Cărți / Programe / Agenți AI / Meditații`) → 3–6 featured products → New arrivals → Bundles (when present) → Shop newsletter signup
- **CTAs:** `Vezi categoria` · `Cumpără` · `Abonează-te magazin`
- **Schema:** `OnlineStore`, `ItemList`

### `/magazin/[slug]` — MAGAZIN (product)
- **H1:** *[Nume produs] — [tip] de Costin Dămășaru*
- **Sections:** Product image gallery (carousel) → Title + tagline → Price + variants (physical/ebook/audiobook) → Long description → Chapters / modules / preview → Buyer reviews → Similar products → Add to cart / Buy now
- **CTAs:** `Adaugă în coș` · `Cumpără acum` (Shopify checkout)
- **Schema:** `Product`, `Offer`, `Review`, `AggregateRating`

### `/media` — MEDIA
- **H1:** *Media & presă — Costin Dămășaru*
- **Sections:** Hero "Apariții publice" → Tabs: `TV / Presă / Podcast invitat` → TV: YouTube embed grid → Press: external article list → Press kit (download CTA) → Press contact form
- **CTAs:** `Descarcă press kit` · `Solicită interviu`
- **Schema:** `Person`, `MediaObject`

### `/contact` — CONTACT
- **H1:** *Contact — colaborări, presă, evenimente*
- **Sections:** Simple intro header → Form with `Motivul contactării` dropdown: `Invitație ca speaker` / `Apariție în media / interviu` / `Colaborare profesională` / `Întrebare generală` → **Conditional fields per reason** → Direct contact details → Social media
- **CTAs:** `Trimite mesaj` (with validation)
- **Schema:** `ContactPage`, `ContactPoint`

---

## 6. Design tokens

### Palette — FOREST

| Token | Hex | Purpose |
| --- | --- | --- |
| `--navy` | `#14202E` | Background hero, dark sections — massive authority |
| `--navy-deep` | `#0E1822` | Footer, extreme accents — deeper than navy |
| `--navy-soft` | `#1F2D40` | Cards on navy bg (podcast feature, stat cards) |
| `--navy-line` | `#2D3F55` | Subtle borders on dark bg |
| `--gold` | `#D4AF6A` | Primary accent, CTAs — champagne gold, luxury |
| `--gold-bright` | `#E2BF7E` | Hover state on gold CTAs |
| `--gold-deep` | `#B8924D` | Gold text on light bg (paper) for legibility |
| `--forest` | `#2D4D43` | Status / accents (`Live`, `În curând`, success, pulse) |
| `--forest-bright` | `#3D6B5C` | Hover on forest accents |
| `--white` | `#FFFFFE` | Near-pure white — primary text on dark |
| `--paper` | `#F5F2EC` | Light section background — calm cream |
| `--paper-warm` | `#EBE6DC` | Warmer cream for alternate sections |
| `--text-light` | `#C5D2E2` | Lead / paragraph on navy |
| `--text-mid` | `#4A5568` | Body text on paper |
| `--text-soft` | `#8B97A8` | Meta, dates, captions |
| `--line` | `#E5DDD0` | Subtle separators on light bg |

### Typography
- **Display Serif:** `Cormorant Garamond` — H1/H2, brand name, italic accents, quotes
- **Body Sans:** `Inter` — body, UI, meta, navigation
- **Mono (rare):** `JetBrains Mono` — only for code in technical articles
- **Weights:** 300 (light), 400, 500, 600. Inter `light` for long leads; serif at `400/500`.

### Type scale

| Token | Size / leading / weight | Notes |
| --- | --- | --- |
| H1 hero | 88 px / 1 / 500 | Cormorant Garamond, letter-spacing `-1.5px` |
| H2 section | 56 px / 1.1 / 500 | Cormorant Garamond, letter-spacing `-1px` |
| H3 sub-section | 38–48 px / 1.15 | Cormorant Garamond |
| H4 card | 22–26 px / 1.25 | Cormorant Garamond |
| Lead paragraph | 18 px / 1.6 / 300 | Inter light |
| Body | 16 px / 1.6 / 400 | Inter regular |
| Small / meta | 13 px / 1.5 | Inter regular |
| Eyebrow / labels | 10–11 px, letter-spacing `2.5–3px` | Inter, uppercase, weight 600 |

### Spacing & scale
- **Container max-width:** `1280px`, padded `40px` desktop / `24px` mobile.
- **Section vertical padding:** `120px` desktop / `80px` tablet / `60px` mobile (generous breathing room).
- **Border radius:** `8px` standard (cards, big buttons, stat cards) · `12px` for large cards (event banner, closing CTA) · `999px` pill (CTAs, tags, eyebrows).

### Motion
- **Standard transition:** `0.25s ease` — hover, color changes.
- **Page load fade-in:** `0.6s`, staggered `100ms` — hero order: eyebrow → H1 → lead → CTAs → image.
- **Pulse dot** (live event): `2s infinite` — gold or forest status.
- **Card hover lift:** `translateY(-3px) + shadow` on `idea-cards`, `shop-cards`.
- **Project row hover:** animated `padding-left: 16px` on project list rows.

---

## 7. Confirmed decisions (client) — and where the build differs

> Decisions from the xlsx "Decizii confirmate" tab. **Where the actual repo deviates from the client doc, the deviation is flagged in *italics*.**

| Element | Client decision | Rationale |
| --- | --- | --- |
| Visual palette | **Forest** — navy + champagne gold + ink green + pure white | Edgy, massive, premium |
| Content CMS | **Sanity** (cloud-hosted, free tier) — articles, podcast episodes, events, projects · *Repo uses **Strapi 5** instead; same model intent applies (dynamic-zone-based pages, draftAndPublish, i18n on user-facing strings).* | Editor-friendly content |
| Newsletter | **ConvertKit (Kit)** — automation sequences, subscriber tags, Sanity integration | Long-term relationship channel |
| Event booking | **Eventbrite embed** | Saves dev time — payments handled by Eventbrite |
| Comments on articles | **No comments** | Newsletter + email replies — no noise |
| Shop | **Shopify Headless** (separate from Nircura), Storefront API, checkout on `shop.costindamasaru.ro` | Launch with current book, structured for expansion |

### Stack confirmations (Sheet 5)
- **Forms:** React Hook Form + Zod (good UX + end-to-end type safety).
- **Transactional email:** Resend (form confirmations, shop orders).
- **Analytics:** GA4 (depth) + Plausible (privacy-friendly dashboard).
- **Booking events:** Eventbrite (handles payments, refunds, tax).
- *Frontend framework / styling / hosting / DB / media / search / error monitoring / DNS rows were left blank in the client doc — treat the repo's choices as canonical (Next.js 16 + Tailwind v4 + Strapi 5 + Postgres 16 + Turborepo, per `damasaru-ro/CLAUDE.md`).*

---

## 8. Rules of thumb when building from this spec

1. **Romanian copy first.** This spec captures Romanian phrasing verbatim — preserve it in CMS seeds.
2. **The chromatic rhythm is not decorative.** Z3 and Z5 are *intentional* dramatic beats. Don't add or remove a navy zone "for variety" — that breaks the system described in Sheet 3 ("REZUMAT RITM CROMATIC").
3. **Z1 has Hero AND Proiecte strip on the same navy.** No separator between them. If `home-page.sections` is missing the projects strip, the hero looks unfinished — that is the exact bug captured in memory observation #6144.
4. **Z5 (Event) and Z1 (Hero CTAs) are the conversion engine.** Anything that visually competes with them on the homepage should be questioned.
5. **No comments anywhere on articles or pages.** Even if a CMS field allows it, leave it disabled.
6. **GDPR is non-negotiable:** double opt-in on newsletter; legal pages are P0 — launch blockers.
7. **Magazin starts with 1 book.** Don't model future categories as required fields — model them as *possible* so the structure scales (books, programs, AI agents, meditations).
8. **Press kit and speaker-invite are dedicated CTAs**, not afterthoughts in a generic contact form. The `Motivul contactării` dropdown switches the fields.

---

*Last regenerated from `Documentation/Structura Site.xlsx`: 2026-05-20. Sheets covered: 1. Overview, 2. Sitemap, 3. Homepage Detalii, 4. Pagini Interioare, 5. Tech & Design.*
