# Strapi custom page endpoints — design

**Status:** draft for review
**Date:** 2026-05-20
**Author:** Costin / Andrew + Claude

## Goal

Replace the web app's reliance on Strapi's generic `populate` queries with **custom, page-specific Strapi endpoints** that return a single, render-ready DTO per page. The web app should be able to render any page with **exactly one HTTP call** to Strapi, no client-side joining, no `{data, attributes}` envelope unwrapping, and no over-fetching.

## Why

The current `apps/web/lib/strapi.ts` hand-builds a `populate[sections][on][component][populate][field][populate]=*` string for 17 component types. This has caused recurring incidents:

- **`populate=deep` removed in Strapi 5** → had to migrate (already done, but the replacement is brittle).
- **`qs` key conflict** when combining `populate[X][populate]=*` with `populate[X][populate][field][populate]=*` on the same component → silent 500s.
- **`on` strategy silently drops** any component type not listed → home page rendered only the hero until the omission was caught.
- **N+1 fetches per page**: `FeaturedList`, `EventFeature`, `TestimonialsSection` are async server components that each fire their own Strapi call. Rendering home does **1 page fetch + ~5 section fetches**.
- **Over-fetch**: every page pulls every field of every related entity.
- **Type drift**: web types in `@repo/types` model Strapi's wrapped shape, so every render touches `.attributes`, `.data`, optional unwrappers, etc.

The user's directive: *"I prefer the API calls to build the page to be custom created in Strapi so we are sure we get what we request and is performant, not a lot of populations."*

## Non-goals

- No GraphQL plugin.
- No content-model changes (no new collections, no schema migrations of existing types). The existing 10 single types, 8 collections, and 17 section components stay as-is.
- No CDN / image transformation work beyond making URLs absolute.
- No SSR caching changes beyond preserving `next: { tags }` semantics.

## Architecture

### New Strapi module: `apps/cms/src/api/pages`

```
apps/cms/src/api/pages/
├── routes/
│   └── pages.ts          # custom route definitions (no schema-bound CRUD)
├── controllers/
│   └── pages.ts          # one method per route
├── services/
│   ├── compose.ts        # orchestrates: fetch page → walk sections → resolve relations → serialize
│   ├── populate.ts       # the single source of truth for per-component populate shapes
│   ├── resolvers.ts      # one resolver per `featured-list.relation` enum value + event-feature, testimonials
│   └── serialize.ts      # flatten Strapi shape → DTO (media absolutize, drop `attributes`, etc.)
└── content-types/        # (not present — pages is a routes-only module, no DB)
```

### Routes

All endpoints accept `?locale=ro|en` (default `ro` per project config). All return JSON; all are read-only (`find`).

| Method | Path | DTO type | Purpose |
| --- | --- | --- | --- |
| GET | `/api/pages/home` | `HomePageDTO` | Home composed |
| GET | `/api/pages/despre` | `DesprePageDTO` | About |
| GET | `/api/pages/cartea` | `CarteaPageDTO` | Book |
| GET | `/api/pages/podcast` | `PodcastPageDTO` | Podcast landing + episodes embedded in `featured-list` sections |
| GET | `/api/pages/idei` | `IdeiPageDTO` | Ideas landing + articles embedded |
| GET | `/api/pages/proiecte` | `ProiectePageDTO` | Projects landing + projects embedded |
| GET | `/api/pages/evenimente` | `EvenimentePageDTO` | Events landing + events embedded |
| GET | `/api/pages/magazin` | `MagazinPageDTO` | Shop landing + products embedded |
| GET | `/api/pages/media` | `MediaPageDTO` | Press kit + press mentions + media items embedded |
| GET | `/api/pages/contact` | `ContactPageDTO` | Contact (sections only; form is client-side) |
| GET | `/api/pages/idei/:slug` | `ArticleDTO` | Article detail |
| GET | `/api/pages/podcast/:slug` | `PodcastEpisodeDTO` | Episode detail |
| GET | `/api/pages/proiecte/:slug` | `ProjectDTO` | Project detail |
| GET | `/api/pages/evenimente/:slug` | `EventDTO` | Event detail |
| GET | `/api/pages/magazin/:slug` | `ProductDTO` | Product detail |

A 404 is returned for unknown slug-pages, and a 404 is returned for detail endpoints when no entity matches `slug + locale`. No drafts are surfaced (publish-only) unless `?preview=true` is set with a valid preview header (deferred to a follow-up — see open questions).

### Controller skeleton

```ts
// apps/cms/src/api/pages/controllers/pages.ts
import { factories } from '@strapi/strapi'
import { compose } from '../services/compose'

export default factories.createCoreController('api::pages.pages' as any, () => ({
  async findSingle(ctx) {
    const { slug } = ctx.params
    const locale = ctx.query.locale ?? 'ro'
    const dto = await compose.singleType(slug, locale)
    if (!dto) return ctx.notFound()
    ctx.body = dto
  },
  async findDetail(ctx) {
    const { type, slug } = ctx.params
    const locale = ctx.query.locale ?? 'ro'
    const dto = await compose.detail(type, slug, locale)
    if (!dto) return ctx.notFound()
    ctx.body = dto
  },
}))
```

### Compose service

`compose.singleType(slug, locale)`:

1. Map `slug` to a Strapi UID (`home` → `api::home-page.home-page`, etc.). Unknown slug → null.
2. Call `strapi.documents(uid).findFirst({ locale, status: 'published', populate: PAGE_POPULATE })`. `PAGE_POPULATE` is a single, explicit object defined in `services/populate.ts` — keyed by component name, with only the fields the renderer actually uses.
3. For each section in `sections`:
   - **`sections.featured-list`** → call `resolvers.resolveFeaturedList(section.relation, section.filterBy, section.limit, locale)` → returns array of resolved entities (e.g. PodcastEpisodeDTO[]). Set `section.items` on the DTO.
   - **`sections.event-feature`** → resolve the linked event with `resolvers.resolveEvent(section.event.documentId, locale)`. Set `section.event` to the resolved EventDTO.
   - **`sections.testimonials`** → if the schema has an embedded list, just serialize; if it references the testimonials collection, resolve via `resolvers.resolveTestimonials(locale)`. (Confirmed during implementation by reading `testimonials.json`.)
4. Pass everything through `serialize.page(...)` which:
   - drops Strapi `attributes` wrappers
   - absolutizes all media URLs (`/uploads/x.jpg` → `http://localhost:1337/uploads/x.jpg`) using `strapi.config.get('server.url')`
   - keeps `__component` on each section (the DynamicZone discriminator)
   - keeps `id` and `documentId` for React keys / future revalidation

`compose.detail(type, slug, locale)` follows the same pattern with the per-collection UID and entity-specific populate.

### Populate map — single source of truth

```ts
// apps/cms/src/api/pages/services/populate.ts
export const PAGE_POPULATE = {
  sections: {
    on: {
      'sections.hero': {
        populate: { media: true, ctaButtons: true, statsStrip: { populate: { items: true } } },
      },
      'sections.featured-list': { populate: true },            // items resolved separately
      'sections.event-feature': { populate: { cta: true } },   // event resolved separately
      'sections.cards-grid': { populate: { items: { populate: { image: true, cta: true } } } },
      'sections.testimonials': { populate: { items: { populate: { avatar: true } } } },
      'sections.cta-banner': { populate: { cta: true } },
      'sections.stats-strip': { populate: { items: true } },
      'sections.quote-large': { populate: true },
      'sections.image-text-split': { populate: { image: true, cta: true } },
      'sections.newsletter-form': { populate: true },
      'sections.faq-accordion': { populate: { items: true } },
      'sections.logo-wall': { populate: { items: { populate: { logo: true } } } },
      'sections.downloads-list': { populate: { items: { populate: { file: true } } } },
      'sections.video-feature': { populate: true },
      'sections.credentials-grid': { populate: { groups: { populate: { items: true } } } },
      'sections.text-block': { populate: true },
      'sections.contact-form': { populate: true },
    },
  },
}
```

One object, refactor-safe, lives in CMS code (TypeScript) instead of being string-built by the web app. Adding a new section component is a one-line addition here + a new resolver if it references a collection.

### DTO types

New folder: `packages/types/src/dto/`

```
packages/types/src/dto/
├── index.ts          # barrel
├── page.ts           # base types: PageDTO, MediaDTO, SectionDTO, SeoDTO
├── home.ts           # HomePageDTO
├── despre.ts
├── cartea.ts
├── podcast.ts        # PodcastPageDTO + PodcastEpisodeDTO
├── idei.ts           # IdeiPageDTO + ArticleDTO
├── proiecte.ts
├── evenimente.ts
├── magazin.ts
├── media.ts
├── contact.ts
└── section.ts        # discriminated union of all section DTOs (keyed by __component)
```

`MediaDTO`:

```ts
export interface MediaDTO {
  url: string                 // absolute
  alt: string
  width: number
  height: number
  formats?: {
    thumbnail?: { url: string; width: number; height: number }
    small?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
  }
}
```

The DTO types are imported by both the CMS controller (return type) and the web fetcher (response type), so TypeScript catches any drift. The existing `Article`, `Event`, etc. types in `@repo/types` stay for the seed scripts and any code that still hits raw `/api/articles`. They're orthogonal.

### Per-page composition rules

| Page slug | Sections | Embedded related content |
| --- | --- | --- |
| `home` | hero, featured-list ×N, event-feature, quote-large, etc. | featured-list `items`, event-feature `event` |
| `despre` | hero, text-block, credentials-grid, stats-strip, etc. | none |
| `cartea` | hero, image-text-split, testimonials, cta-banner, faq | testimonials.items (if relation-backed), press-mentions if a featured-list points to it |
| `podcast` | hero, featured-list (relation: `podcast-episodes`) | episodes list |
| `idei` | hero, featured-list (relation: `articles`) | articles list |
| `proiecte` | hero, featured-list (relation: `projects`) | projects list |
| `evenimente` | hero, featured-list (relation: `events`) | events list |
| `magazin` | hero, featured-list (relation: `products`) | products list |
| `media` | hero, downloads-list, featured-list (relation: `press-mentions`), cards-grid | press mentions + media items |
| `contact` | hero, contact-form | none |

### Web side

`apps/web/lib/strapi.ts` becomes minimal:

```ts
const BASE = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN || ''

async function fetchPage<T>(path: string, locale: string, tag: string): Promise<T> {
  const url = `${BASE}/api/pages/${path}?locale=${locale}`
  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    next: { tags: [tag] },
  })
  if (res.status === 404) throw new Error('not-found')
  if (!res.ok) throw new Error(`pages fetch failed [${res.status}]: ${path}`)
  return res.json() as Promise<T>
}

export const getHome = (locale: string) => fetchPage<HomePageDTO>('home', locale, 'home-page')
export const getDespre = (locale: string) => fetchPage<DesprePageDTO>('despre', locale, 'about-page')
// ... one per page
export const getArticle = (slug: string, locale: string) =>
  fetchPage<ArticleDTO>(`idei/${slug}`, locale, `article:${slug}`)
// ... one per detail kind
```

`submitNewsletter` stays on its current `POST /api/newsletter-subscriptions` path (writes are unchanged; this refactor is read-side only).

### Frontend organism changes

Three organisms drop their internal data fetching and become pure presentational components:

- **`FeaturedList`**: no longer async; `section.items` is already typed as `ArticleDTO[] | EventDTO[] | ...` per the discriminated union on `section.relation`.
- **`EventFeature`**: no longer async; `section.event: EventDTO | null`.
- **`TestimonialsSection`**: no longer async; `section.items: TestimonialDTO[]`.

`DynamicZone.tsx` no longer needs to pass `locale` to children that fetch — only the few that genuinely need it for link hrefs.

### Caching & revalidation

- `next: { tags: [...] }` semantics preserved; the web fetcher tags each call with a single, stable tag (e.g. `home-page`, `article:<slug>`).
- Revalidation webhook from Strapi (not built yet) can target `revalidateTag('home-page')`. Each page = one tag = one HTTP-call worth of invalidation.

## Approaches considered

| Approach | Verdict |
| --- | --- |
| **Composed page DTO module (chosen)** | Best tradeoff: one place for all DTO logic, shared helpers, single source of truth for populate, frontend collapses to a thin fetcher. |
| Custom controller per content-type (`home-page/full`) | Rejected: spreads composition logic across 10 folders; harder to keep DTOs consistent; shared helpers either duplicated or pushed to a top-level utils. |
| Strapi response middleware | Rejected: implicit, hard to debug; couples DTO shape to URL conventions. |
| GraphQL plugin | Rejected: too heavy; adds a query planner and schema management cost; the project doesn't need ad-hoc queries. |

## Testing

- **Unit (Vitest in `apps/cms`):** `serialize.page` correctly absolutizes URLs, drops `attributes`, preserves `__component`. `resolvers.resolveFeaturedList` respects `limit` and `filterBy`. Pure functions; mock `strapi.documents`.
- **Integration (CMS dev server boot):** start Strapi, run seed, hit `GET /api/pages/home?locale=ro` and assert the DTO shape against a Zod schema (used only in tests, not at runtime).
- **Type-check (existing `pnpm check-types`):** the DTO types in `@repo/types/dto` flow into both CMS and web; any drift is a compile error.
- **Smoke (web side):** render every locale-prefixed page route in dev and confirm HTTP 200 + non-empty section list.

## Migration steps (summary — full plan in writing-plans output)

1. **CMS-side**:
   1. Add `packages/types/src/dto/` skeleton with `MediaDTO`, `SectionDTO`, `PageDTO`.
   2. Add `apps/cms/src/api/pages/` module with routes + controller + compose/populate/resolvers/serialize services.
   3. Implement single-type endpoints first (home → despre → cartea → podcast → idei → proiecte → evenimente → magazin → media → contact).
   4. Add Vitest tests for serialize + resolvers.
   5. Add detail endpoints last.
2. **Web-side** (only after CMS endpoints are smoke-tested):
   1. Add new fetchers in `apps/web/lib/strapi.ts` alongside the old ones.
   2. Migrate organisms one at a time: `FeaturedList` → `EventFeature` → `TestimonialsSection` → pure presentational, props become DTO types.
   3. Migrate `app/[locale]/<page>/page.tsx` to call the new fetcher.
   4. Delete the old `applyPagePopulate` / `populate=page` code path.
   5. `pnpm check-types`, `pnpm dev`, manually verify every page.

## Open questions (deferred — not blocking)

- **Preview / draft mode:** if/when the client needs to review unpublished drafts, add `?preview=true` + a preview token check in the controller. Out of scope for this refactor.
- **Authentication:** the existing endpoints are public with an optional bearer token. Keep that; if Strapi's default permissions block the new routes, grant `find` on the `pages` API to the public role via Strapi admin (or a bootstrap call).
- **Strapi response caching at the CMS layer:** out of scope; Next.js `next: { tags }` is sufficient for the SSR caching story.

## Definition of done

- `pnpm check-types` green from a fresh checkout.
- All 10 single-type page routes and all 5 detail-page routes return a typed DTO that the frontend renders without any envelope unwrapping.
- `apps/web/lib/strapi.ts` is under 100 lines.
- `FeaturedList`, `EventFeature`, `TestimonialsSection` are no longer async — confirmed by reading.
- The old `applyPagePopulate` + `COMPONENT_FIELDS` map is deleted.
- Rendering home, despre, podcast, idei in dev shows the same content as before the refactor.
