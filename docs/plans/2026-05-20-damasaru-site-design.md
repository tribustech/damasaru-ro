# damasaru.ro — full site design (CMS + frontend)

Date: 2026-05-20
Status: locked, in implementation

This is the canonical schema spec for the whole site. Every new CMS schema, type, route, and organism we ship today derives from this document.

Client copy is in `../../Documentation/Pagini/<n>. <name>/*.docx` (already converted to `/tmp/damasaru-copy/`). Each page section list below is grounded in the client's mockup HTML + docx — not the Figma exploration.

---

## Brand tokens (verbatim from `Documentation/Look And Feel Homepage.html`)

```
--navy:        #14202E   --navy-deep:  #0E1822   --navy-soft: #1F2D40   --navy-line: #2D3F55
--gold:        #D4AF6A   --gold-bright:#E2BF7E   --gold-deep: #B8924D
--forest:      #2D4D43   --forest-bright: #3D6B5C
--white:       #FFFFFE   --paper:      #F5F2EC   --paper-warm: #EBE6DC
--text-light:  #C5D2E2   --text-mid:   #4A5568   --text-soft: #8B97A8   --text-dim:  #6B7B91
--line:        #E5DDD0   --line-dark:  #1F2D40
```

Fonts: **Cormorant Garamond** for display/serif, **Inter** for body/UI. Both loaded via `next/font/google` in `apps/web/app/[locale]/layout.tsx` (currently using Geist — to be swapped).

Section-zone background convention (used everywhere): `navy`, `paper`, `paper-warm`, `navy-deep`. Every section component accepts an `accent` enum so editors choose its background.

---

## Collection types

### New

| Name | Singular / Plural | i18n | Purpose | Key attributes |
| --- | --- | --- | --- | --- |
| `podcast-episode` | podcast-episode / podcast-episodes | yes | One row per episode. Sortable, archivable. | `number:int`, `title:string`, `slug:uid(title)`, `description:text`, `audioUrl:string`, `videoUrl:string`, `duration:string`, `publishedAt:datetime`, `season:int`, `coverImage:media`, `guests:json` (array of {name, role, link}) |
| `project` | project / projects | yes | Veruvis, Veruvis Kids, Nircura, Asociația, future. | `name:string`, `slug:uid(name)`, `tagline:string`, `manifesto:richtext`, `heroImage:media`, `galleryImages:media-multiple`, `externalUrl:string`, `status:enum(live,upcoming,archived)`, `accent:enum(navy,paper,paper-warm,navy-deep)`, `order:int` |
| `product` | product / products | yes | Catalog rows for `magazin-page` and `cartea-page`. Covers book formats AND event tickets (`format` enum). | `title:string`, `slug:uid(title)`, `format:enum(hardcover,ebook,audiobook,event,course,bundle)`, `price:string`, `currency:string`, `image:media`, `buyUrl:string`, `description:text`, `availability:enum(available,waitlist,sold_out,upcoming)`, `featured:boolean` |
| `testimonial` | testimonial / testimonials | yes | Pooled testimonials reusable across Home, Cartea, Podcast. | `quote:text`, `author:string`, `role:string`, `photo:media`, `source:enum(book,event,podcast,workshop,general)`, `rating:int(1-5, optional)`, `featured:boolean` |
| `press-mention` | press-mention / press-mentions | no | Logos + outlet links for Media page logo wall + Press magazines. | `title:string`, `outlet:string`, `url:string`, `date:date`, `logoImage:media`, `type:enum(article,interview,magazine,tv,radio,podcast)`, `featured:boolean`, `excerpt:text` |
| `newsletter-subscription` | newsletter-subscription / newsletter-subscriptions | no | Stores form submissions. Strapi admin views, no UI permissions for `public`. | `email:email`, `source:string` (which page submitted), `consent:boolean` |

### Existing (unchanged)

`article`, `event`, `media-item`.

### Existing (with edits)

- `event` — add `jsonLd:json` (allow editors or hooks to override generated Event schema), `subtitle:string`, `ticketsUrl:string`, `organizer:string`.
- `article` — add `featured:boolean`.

---

## Single types (one per page)

Each is a dynamic-zone single type. The `sections` field allow-list is the *full* set of section components so editors can compose freely.

| Single type | Route | Default seed structure (from client docx/mockup) |
| --- | --- | --- |
| `home-page` (existing) | `/` | hero · featured-list(podcast-episodes) · featured-list(articles) · featured-list(projects) · featured-list(events) · featured-list(products) · quote-large |
| `about-page` (existing) | `/despre` | hero · image-text-split · image-text-split (navy) · cards-grid (4 convingeri) · image-text-split (navy, Credință) · credentials-grid (Formare) · cards-grid (3 CTA cards, accent=navy-deep) |
| `book-page` (existing) | `/carte` | hero (+ stats-strip) · image-text-split · cards-grid (Ce găsești) · cards-grid (Cum o citești) · cta-banner (Audiobook waitlist) · text-block (Preview) · featured-list(testimonials) · image-text-split (Despre autor) · newsletter-form |
| `podcast-page` (NEW) | `/podcast` | hero · image-text-split · featured-list(podcast-episodes) · cards-grid (Platforme) · cta-banner (Subscribe) · image-text-split (Despre gazdă) · featured-list(podcast-episodes, limit=1) · newsletter-form |
| `idei-page` (NEW) | `/idei` | hero · featured-list(articles, filterable) · image-text-split (Author) · newsletter-form |
| `proiecte-page` (NEW) | `/proiecte` | hero · featured-list(projects, layout=feature) · logo-wall (Press) · newsletter-form |
| `events-page` (NEW) | `/evenimente` | hero · event-feature (Iași Sep 2026) · featured-list(events, status=viitor) · video-feature (aftermovie) · featured-list(events, status=trecut) · cta-banner (Speaker booking) · newsletter-form |
| `magazin-page` (NEW) | `/magazin` | hero · featured-list(products, format=book-formats) · featured-list(products, format=event-formats) · faq-accordion · newsletter-form |
| `media-page` (existing) | `/media` | hero · stats-strip · logo-wall · image-text-split (Featured) · text-block (Press manifest) · featured-list(press-mentions, type=magazine) · featured-list(press-mentions, layout=marquee) · cta-banner (Archive) · downloads-list (Press kit) · newsletter-form |
| `contact-page` (NEW) | `/contact` | hero · text-block · contact-form |

`apps/web/app/[locale]/blog` is renamed to `apps/web/app/[locale]/idei` (same `article` collection, frontend slug only).

---

## Section components

### Existing (keep, with minor edits)

| Component | Edit | Reason |
| --- | --- | --- |
| `sections.hero` | add `eyebrow:string`, `accent:enum(navy,paper,paper-warm,navy-deep)`, `media:media`, `mediaPosition:enum(right,left,below,none)`, `statsStrip:component(sections.stats-strip, single, optional)` | every page hero in the docs has an eyebrow + uses a different background + many heroes embed stats |
| `sections.text-block` | add `accent:enum`, `align:enum(left,center)` | matches paper-warm/navy-deep text-only intros |
| `sections.cards-grid` | add `eyebrow:string`, `accent:enum`, `lead:text`, `columns:enum(2,3,4)` | Despre convingeri = 2col, Cartea "Cum o citești" = 3col |
| `sections.featured-list` | extend `relation` enum: add `podcast-episodes`, `projects`, `products`, `testimonials`, `press-mentions`. Add `eyebrow:string`, `subheading:text`, `accent:enum`, `layout:enum(grid,row,marquee,feature)`, `limit:int`, `filterBy:json` (e.g., `{status:"viitor"}` or `{format:"hardcover,ebook,audiobook"}`), `seeAllHref:string`, `seeAllLabel:string` | one component renders every "list of X" zone — Home featured zones, Idei article grid, Evenimente viitor/trecut, Magazin catalog, Media press list |
| `sections.cta-banner` | add `accent:enum`, `eyebrow:string` | matches all the dark closing CTAs |
| `sections.testimonials` | replace inline `testimonial-item` repeatable with `relation:enum(testimonials)` + `filterBy:json` so it pulls from the new `testimonial` collection | so testimonials are reusable across pages |
| `sections.card-item` | add `iconImage:media`, `href:string`, `tag:string` (forest tag like CITEȘTE/ASCULTĂ/VINO on Despre) | matches Despre CTA cards |

### New

| Component | Attributes |
| --- | --- |
| `sections.stats-strip` | `eyebrow:string`, `heading:string`, `accent:enum`, `items: component(sections.stat-item) repeatable` |
| `sections.stat-item` | `value:string` (e.g. "18.000+"), `label:string`, `caption:string` (optional, e.g. "ANI DE CERCETARE") |
| `sections.quote-large` | `eyebrow:string`, `quote:text`, `attribution:string`, `accent:enum` |
| `sections.image-text-split` | `eyebrow:string`, `heading:string`, `body:richtext`, `image:media`, `imagePosition:enum(left,right)`, `accent:enum`, `cta:component(shared.cta-button, single, optional)` |
| `sections.newsletter-form` | `eyebrow:string`, `heading:string`, `subtext:text`, `buttonLabel:string`, `placeholder:string`, `accent:enum`, `formId:string` (so different pages can be tracked) |
| `sections.faq-accordion` | `eyebrow:string`, `heading:string`, `intro:text`, `items: component(sections.faq-item) repeatable` |
| `sections.faq-item` | `question:string`, `answer:richtext` |
| `sections.logo-wall` | `eyebrow:string`, `heading:string`, `accent:enum`, `items: component(sections.logo-item) repeatable` |
| `sections.logo-item` | `name:string`, `logo:media`, `url:string` |
| `sections.downloads-list` | `eyebrow:string`, `heading:string`, `accent:enum`, `items: component(sections.download-item) repeatable` |
| `sections.download-item` | `label:string`, `file:media`, `group:string` (e.g. "Press kit", "Bio") |
| `sections.video-feature` | `eyebrow:string`, `heading:string`, `body:text`, `videoUrl:string` (YouTube/Vimeo embed URL), `posterImage:media`, `accent:enum` |
| `sections.credentials-grid` | `eyebrow:string`, `heading:string`, `lead:text`, `accent:enum`, `groups: component(sections.credential-group) repeatable` |
| `sections.credential-group` | `title:string`, `items:json` (array of strings — the bullet list) |
| `sections.event-feature` | `eyebrow:string`, `event:relation(event)`, `accent:enum`, `cta:component(shared.cta-button)` |
| `sections.contact-form` | `heading:string`, `subtext:text`, `nameLabel:string`, `emailLabel:string`, `messageLabel:string`, `submitLabel:string`, `successMessage:string`, `accent:enum` |

### Section allow-list (every single type gets this set)

```
sections.hero, sections.text-block, sections.cards-grid, sections.testimonials,
sections.cta-banner, sections.featured-list, sections.stats-strip, sections.quote-large,
sections.image-text-split, sections.newsletter-form, sections.faq-accordion,
sections.logo-wall, sections.downloads-list, sections.video-feature,
sections.credentials-grid, sections.event-feature, sections.contact-form
```

---

## Frontend architecture

- Locale-prefixed App Router (existing) `app/[locale]/<route>/page.tsx`.
- One organism per section component under `apps/web/components/organisms/`. Existing organisms get the `accent` prop and render the right background colour.
- `apps/web/lib/strapi.ts` gains: `getPodcastPage`, `getIdeiPage`, `getProiectePage`, `getEventsPage`, `getMagazinPage`, `getContactPage`, plus `getPodcastEpisodes`, `getProjects`, `getProducts`, `getTestimonials`, `getPressMentions`. All single-type fetchers use the existing `fetchStrapi` helper with `populate=deep` (since dynamic zones nest).
- `DynamicZone.tsx` switch grows to cover every new component. The `featured-list` organism reads `relation` + `filterBy` and dispatches to the right collection fetcher internally — single component, many shapes.
- Navigation adds 4 links: Podcast, Idei, Proiecte, Magazin. Footer mirrors the nav set.
- Brand: swap Geist for Cormorant Garamond + Inter in `app/[locale]/layout.tsx`. Move palette tokens into `globals.css` so organisms can use them.

---

## Build order (Phase B → C → D)

### Phase B — Foundation (this session, sequential)

1. Strapi schemas (collection types, then components, then single-type allow-list expansion).
2. `@repo/types` interfaces + `Section` union.
3. Organism per new section (props mirror the schema).
4. Wire `DynamicZone.tsx` switch.
5. Strapi fetchers in `apps/web/lib/strapi.ts`.
6. Restart Strapi → admin sanity check.

### Phase C — Page seeds + routes (parallel subagents)

One subagent per page. Each gets the page's docx + mockup HTML and writes:
- `apps/cms/src/api/<page>/...` lifecycle/bootstrap (if needed for initial seed) OR a JSON content file to import via admin.
- `apps/web/app/[locale]/<route>/page.tsx` — almost always just `getXPage` + `<DynamicZone />`. Pages with collection-specific routes (`/idei/[slug]`, `/podcast/[slug]`, `/proiecte/[slug]`, `/evenimente/[slug]`, `/magazin/[slug]`) also build their detail organism.

Subagents run **after** Phase B completes — they only touch files in their own page subtree, so they can't conflict.

### Phase D — Polish (sequential, final)

Nav + Footer updates, dictionaries, font swap, `pnpm check-types && pnpm lint`, browser smoke test of every `/ro/*` route.

---

## Out of scope for today

- Real newsletter integration (Mailerlite/ConvertKit) — capture to `newsletter-subscription` collection only.
- Magazin checkout (Stripe/SEPA) — buy buttons link to external URLs (`buyUrl`) per product.
- English copy — site ships ro-only complete; en route renders ro fallback (Strapi `i18n` returns ro if en is missing).
- Search/algolia, comments, analytics — explicit no-go for v1.
