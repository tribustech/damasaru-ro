# Strapi custom page endpoints — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the web app's generic `populate=...` strategy with custom Strapi endpoints under `/api/pages/...` that return one render-ready DTO per page, with all related collection items resolved server-side.

**Architecture:** New `apps/cms/src/api/pages` module exposes one route per page (single types + detail pages). Each route runs a composer that fetches the page with a tightly scoped populate, resolves any `featured-list` / `event-feature` / `testimonials` relations against their collections, serializes everything into a flat DTO (absolute media URLs, no `{data, attributes}` envelope), and returns it. DTO types live in `packages/types/src/dto/` and are imported by both the CMS controller (return type) and the web fetcher (response type). Three async server-component organisms become pure presentational components.

**Tech Stack:** Strapi 5.41.1 (TypeScript), Next.js 16, React 19, TypeScript 5, `@repo/types` workspace, pnpm 9, Turborepo.

**Verification strategy:** No unit test framework is installed in this repo and adding one is out of scope. Verification leans on (a) `pnpm check-types` catching DTO drift across CMS ↔ types ↔ web, (b) curl smoke tests against the live CMS dev server with a Zod-shaped JSON assertion inline in each smoke step, (c) rendering each migrated page in `pnpm dev` and confirming HTTP 200 with non-empty section list. If the team later adds Vitest, the pure `serialize.ts` and `resolvers.ts` are the highest-ROI targets.

**Reference spec:** [`docs/superpowers/specs/2026-05-20-strapi-page-endpoints-design.md`](../specs/2026-05-20-strapi-page-endpoints-design.md)

---

## File structure

**Created:**
- `packages/types/src/dto/index.ts` — barrel
- `packages/types/src/dto/page.ts` — MediaDTO, SectionDTO base, PageDTO base, SeoDTO
- `packages/types/src/dto/section.ts` — discriminated union of all 17 section DTOs
- `packages/types/src/dto/entity.ts` — ArticleDTO, EventDTO, PodcastEpisodeDTO, ProjectDTO, ProductDTO, TestimonialDTO, PressMentionDTO, MediaItemDTO
- `packages/types/src/dto/pages.ts` — HomePageDTO … ContactPageDTO (per-page wrappers)
- `apps/cms/src/api/pages/routes/pages.ts`
- `apps/cms/src/api/pages/controllers/pages.ts`
- `apps/cms/src/api/pages/services/populate.ts`
- `apps/cms/src/api/pages/services/serialize.ts`
- `apps/cms/src/api/pages/services/resolvers.ts`
- `apps/cms/src/api/pages/services/compose.ts`

**Modified:**
- `packages/types/src/index.ts` — add `export * from './dto'`
- `apps/web/lib/strapi.ts` — replace populate logic with thin per-page fetchers
- `apps/web/components/organisms/FeaturedList.tsx` — drop async + own fetching, accept resolved items
- `apps/web/components/organisms/EventFeature.tsx` — drop async + own fetching, accept resolved event
- `apps/web/components/organisms/TestimonialsSection.tsx` — drop async + own fetching if applicable
- `apps/web/components/organisms/DynamicZone.tsx` — drop `locale` prop where no longer needed
- `apps/web/app/[locale]/page.tsx` and 9 sibling page routes — call new fetchers
- `packages/types/src/components/sections/featured-list.ts` (and event-feature, testimonials) — extend section types to include resolved `items` / `event` fields

---

## Task 1: Add DTO type skeleton to `@repo/types`

**Files:**
- Create: `packages/types/src/dto/page.ts`
- Create: `packages/types/src/dto/entity.ts`
- Create: `packages/types/src/dto/section.ts`
- Create: `packages/types/src/dto/pages.ts`
- Create: `packages/types/src/dto/index.ts`
- Modify: `packages/types/src/index.ts`

- [ ] **Step 1: Create `packages/types/src/dto/page.ts`**

```ts
export interface MediaFormat {
  url: string
  width: number
  height: number
}

export interface MediaDTO {
  url: string
  alt: string
  width: number
  height: number
  formats?: {
    thumbnail?: MediaFormat
    small?: MediaFormat
    medium?: MediaFormat
    large?: MediaFormat
  }
}

export interface SeoDTO {
  title: string | null
  description: string | null
}

export interface CtaButtonDTO {
  label: string
  href: string
  variant: 'primary' | 'outline'
}

export type AccentDTO = 'navy' | 'paper' | 'paper-warm' | 'navy-deep'

export interface PageDTO {
  id: number
  documentId: string
  locale: string
  slug: string
  seo: SeoDTO
}
```

- [ ] **Step 2: Create `packages/types/src/dto/entity.ts`**

```ts
import type { MediaDTO } from './page'

export interface ArticleDTO {
  id: number
  documentId: string
  slug: string
  title: string
  excerpt: string | null
  date: string
  readingMinutes: number | null
  cover: MediaDTO | null
  author: string | null
  tags: string[]
}

export interface EventDTO {
  id: number
  documentId: string
  slug: string
  title: string
  date: string
  status: 'viitor' | 'trecut'
  city: string | null
  venue: string | null
  cover: MediaDTO | null
  excerpt: string | null
}

export interface PodcastEpisodeDTO {
  id: number
  documentId: string
  slug: string
  number: number
  title: string
  description: string | null
  date: string
  durationMinutes: number | null
  cover: MediaDTO | null
  audioUrl: string | null
  spotifyUrl: string | null
  youtubeUrl: string | null
}

export interface ProjectDTO {
  id: number
  documentId: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  cover: MediaDTO | null
  url: string | null
  order: number
}

export interface ProductDTO {
  id: number
  documentId: string
  slug: string
  name: string
  price: string | null
  description: string | null
  cover: MediaDTO | null
  url: string | null
  order: number
}

export interface TestimonialDTO {
  id: number
  documentId: string
  quote: string
  author: string
  role: string | null
  avatar: MediaDTO | null
}

export interface PressMentionDTO {
  id: number
  documentId: string
  outlet: string
  title: string
  date: string
  url: string
  type: string | null
  logo: MediaDTO | null
}

export interface MediaItemDTO {
  id: number
  documentId: string
  title: string
  kind: string
  date: string | null
  url: string
  thumbnail: MediaDTO | null
  description: string | null
}
```

> If any field name above doesn't match the underlying Strapi schema for a collection, fix it during Task 5 when resolvers are implemented — the schemas are in `apps/cms/src/api/<type>/content-types/<type>/schema.json`. The DTO is allowed to rename fields for clarity; just stay consistent across resolver + serializer + frontend.

- [ ] **Step 3: Create `packages/types/src/dto/section.ts`**

```ts
import type {
  MediaDTO,
  CtaButtonDTO,
  AccentDTO,
} from './page'
import type {
  ArticleDTO,
  EventDTO,
  PodcastEpisodeDTO,
  ProjectDTO,
  ProductDTO,
  TestimonialDTO,
  PressMentionDTO,
} from './entity'

interface SectionBase {
  id: number
}

export interface HeroDTO extends SectionBase {
  __component: 'sections.hero'
  eyebrow: string | null
  title: string
  titleItalic: string | null
  subtitle: string | null
  accent: AccentDTO
  media: MediaDTO | null
  mediaPosition: 'right' | 'left' | 'below' | 'none'
  ctaButtons: CtaButtonDTO[]
  statsStrip: StatsStripInline | null
}

interface StatsStripInline {
  items: { id: number; value: string; label: string }[]
}

export interface TextBlockDTO extends SectionBase {
  __component: 'sections.text-block'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  body: string
  accent: AccentDTO
}

export interface CardsGridDTO extends SectionBase {
  __component: 'sections.cards-grid'
  eyebrow: string | null
  heading: string | null
  accent: AccentDTO
  items: {
    id: number
    title: string
    body: string | null
    image: MediaDTO | null
    cta: CtaButtonDTO | null
  }[]
}

export interface TestimonialsDTO extends SectionBase {
  __component: 'sections.testimonials'
  eyebrow: string | null
  heading: string | null
  accent: AccentDTO
  items: TestimonialDTO[]
}

export interface CtaBannerDTO extends SectionBase {
  __component: 'sections.cta-banner'
  heading: string
  subheading: string | null
  accent: AccentDTO
  cta: CtaButtonDTO | null
}

type FeaturedListItems =
  | { relation: 'articles'; items: ArticleDTO[] }
  | { relation: 'events'; items: EventDTO[] }
  | { relation: 'podcast-episodes'; items: PodcastEpisodeDTO[] }
  | { relation: 'projects'; items: ProjectDTO[] }
  | { relation: 'products'; items: ProductDTO[] }
  | { relation: 'testimonials'; items: TestimonialDTO[] }
  | { relation: 'press-mentions'; items: PressMentionDTO[] }

export type FeaturedListDTO = SectionBase & {
  __component: 'sections.featured-list'
  eyebrow: string | null
  heading: string | null
  headingItalic: string | null
  subheading: string | null
  accent: AccentDTO
  layout: 'grid' | 'row' | 'marquee' | 'feature' | 'featured-with-list' | 'featured-with-grid'
  limit: number
  seeAllHref: string | null
  seeAllLabel: string | null
} & FeaturedListItems

export interface StatsStripDTO extends SectionBase {
  __component: 'sections.stats-strip'
  accent: AccentDTO
  items: { id: number; value: string; label: string }[]
}

export interface QuoteLargeDTO extends SectionBase {
  __component: 'sections.quote-large'
  quote: string
  author: string | null
  accent: AccentDTO
}

export interface ImageTextSplitDTO extends SectionBase {
  __component: 'sections.image-text-split'
  eyebrow: string | null
  heading: string | null
  body: string
  accent: AccentDTO
  image: MediaDTO | null
  imageSide: 'left' | 'right'
  cta: CtaButtonDTO | null
}

export interface NewsletterFormDTO extends SectionBase {
  __component: 'sections.newsletter-form'
  eyebrow: string | null
  heading: string
  body: string | null
  accent: AccentDTO
  source: string
  submitLabel: string
}

export interface FaqAccordionDTO extends SectionBase {
  __component: 'sections.faq-accordion'
  eyebrow: string | null
  heading: string | null
  accent: AccentDTO
  items: { id: number; question: string; answer: string }[]
}

export interface LogoWallDTO extends SectionBase {
  __component: 'sections.logo-wall'
  heading: string | null
  accent: AccentDTO
  items: { id: number; name: string; logo: MediaDTO | null; url: string | null }[]
}

export interface DownloadsListDTO extends SectionBase {
  __component: 'sections.downloads-list'
  heading: string | null
  accent: AccentDTO
  items: { id: number; label: string; file: MediaDTO | null }[]
}

export interface VideoFeatureDTO extends SectionBase {
  __component: 'sections.video-feature'
  heading: string | null
  videoUrl: string
  caption: string | null
  accent: AccentDTO
}

export interface CredentialsGridDTO extends SectionBase {
  __component: 'sections.credentials-grid'
  heading: string | null
  accent: AccentDTO
  groups: { id: number; title: string; items: { id: number; label: string; sub: string | null }[] }[]
}

export interface EventFeatureDTO extends SectionBase {
  __component: 'sections.event-feature'
  eyebrow: string | null
  accent: AccentDTO
  event: EventDTO | null
  cta: CtaButtonDTO | null
}

export interface ContactFormDTO extends SectionBase {
  __component: 'sections.contact-form'
  heading: string | null
  body: string | null
  accent: AccentDTO
  submitLabel: string
  successMessage: string
}

export type SectionDTO =
  | HeroDTO
  | TextBlockDTO
  | CardsGridDTO
  | TestimonialsDTO
  | CtaBannerDTO
  | FeaturedListDTO
  | StatsStripDTO
  | QuoteLargeDTO
  | ImageTextSplitDTO
  | NewsletterFormDTO
  | FaqAccordionDTO
  | LogoWallDTO
  | DownloadsListDTO
  | VideoFeatureDTO
  | CredentialsGridDTO
  | EventFeatureDTO
  | ContactFormDTO
```

> Field names mirror the schemas in `apps/cms/src/components/sections/*.json`. If a schema attribute differs from what's listed here (e.g. `body` vs `content`), use the schema as the source of truth and update both the DTO and the serializer.

- [ ] **Step 4: Create `packages/types/src/dto/pages.ts`**

```ts
import type { PageDTO } from './page'
import type { SectionDTO } from './section'
import type {
  ArticleDTO,
  EventDTO,
  PodcastEpisodeDTO,
  ProjectDTO,
  ProductDTO,
} from './entity'

export type PageSlug =
  | 'home'
  | 'despre'
  | 'cartea'
  | 'podcast'
  | 'idei'
  | 'proiecte'
  | 'evenimente'
  | 'magazin'
  | 'media'
  | 'contact'

export interface SingleTypePageDTO extends PageDTO {
  sections: SectionDTO[]
}

export interface ArticleDetailDTO extends ArticleDTO {
  body: string
  related: ArticleDTO[]
}

export interface PodcastEpisodeDetailDTO extends PodcastEpisodeDTO {
  showNotes: string | null
  related: PodcastEpisodeDTO[]
}

export interface ProjectDetailDTO extends ProjectDTO {
  body: string | null
  related: ProjectDTO[]
}

export interface EventDetailDTO extends EventDTO {
  body: string | null
  related: EventDTO[]
}

export interface ProductDetailDTO extends ProductDTO {
  body: string | null
  related: ProductDTO[]
}
```

- [ ] **Step 5: Create `packages/types/src/dto/index.ts`**

```ts
export * from './page'
export * from './entity'
export * from './section'
export * from './pages'
```

- [ ] **Step 6: Add the dto barrel to `packages/types/src/index.ts`**

Open `packages/types/src/index.ts` and add `export * from './dto'` as the **last** line. Do not remove any existing exports; the legacy `HomePage`, `Article` etc. types stay for code that still hits raw Strapi.

- [ ] **Step 7: Type-check**

Run: `pnpm --filter @repo/types check-types`
Expected: PASS (no output) — types compile in isolation.

- [ ] **Step 8: Commit**

```bash
git add packages/types/src/dto packages/types/src/index.ts
git commit -m "feat(types): add DTO type skeleton for custom page endpoints"
```

---

## Task 2: Scaffold the `pages` CMS module (hello-world endpoint)

**Files:**
- Create: `apps/cms/src/api/pages/routes/pages.ts`
- Create: `apps/cms/src/api/pages/controllers/pages.ts`

This task delivers a working `GET /api/pages/home` that returns `{ ok: true, slug: 'home' }` — proves the route is registered before composition logic lands on top.

- [ ] **Step 1: Create `apps/cms/src/api/pages/routes/pages.ts`**

```ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/pages/:slug',
      handler: 'pages.findSingle',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/pages/:type/:slug',
      handler: 'pages.findDetail',
      config: { auth: false },
    },
  ],
}
```

> `auth: false` makes these endpoints public for SSR. If the team later wants token auth, flip these and pass a bearer token from `apps/web/lib/strapi.ts` (already supports `STRAPI_API_TOKEN`).

- [ ] **Step 2: Create `apps/cms/src/api/pages/controllers/pages.ts` (stub)**

```ts
import type { Context } from 'koa'

export default {
  async findSingle(ctx: Context) {
    const { slug } = ctx.params
    ctx.body = { ok: true, slug, locale: ctx.query.locale ?? 'ro' }
  },
  async findDetail(ctx: Context) {
    const { type, slug } = ctx.params
    ctx.body = { ok: true, type, slug, locale: ctx.query.locale ?? 'ro' }
  },
}
```

- [ ] **Step 3: Restart CMS dev server**

If it's already running, stop it and re-run `pnpm --filter cms dev` from the repo root. Watch the boot log for `Welcome` and confirm no route registration errors.

- [ ] **Step 4: Smoke test the stub route**

Run: `curl -sS 'http://localhost:1337/api/pages/home?locale=ro' | head -c 200`
Expected output (exact): `{"ok":true,"slug":"home","locale":"ro"}`

If you get a 403 instead, open Strapi admin → Settings → Users & Permissions → Roles → Public, find the `pages` API in the list, check `findSingle` and `findDetail`, save. Re-run the curl.

- [ ] **Step 5: Smoke test the detail stub**

Run: `curl -sS 'http://localhost:1337/api/pages/idei/test-slug?locale=ro' | head -c 200`
Expected: `{"ok":true,"type":"idei","slug":"test-slug","locale":"ro"}`

- [ ] **Step 6: Commit**

```bash
git add apps/cms/src/api/pages
git commit -m "feat(cms): scaffold pages module with stub routes"
```

---

## Task 3: Add `populate.ts` and `serialize.ts` (pure helpers)

**Files:**
- Create: `apps/cms/src/api/pages/services/populate.ts`
- Create: `apps/cms/src/api/pages/services/serialize.ts`

- [ ] **Step 1: Create `apps/cms/src/api/pages/services/populate.ts`**

```ts
export const PAGE_POPULATE = {
  sections: {
    on: {
      'sections.hero': {
        populate: {
          media: true,
          ctaButtons: true,
          statsStrip: { populate: { items: true } },
        },
      },
      'sections.text-block': { populate: true },
      'sections.cards-grid': {
        populate: { items: { populate: { image: true, cta: true } } },
      },
      'sections.testimonials': {
        populate: { items: { populate: { avatar: true } } },
      },
      'sections.cta-banner': { populate: { cta: true } },
      'sections.featured-list': { populate: true },
      'sections.stats-strip': { populate: { items: true } },
      'sections.quote-large': { populate: true },
      'sections.image-text-split': { populate: { image: true, cta: true } },
      'sections.newsletter-form': { populate: true },
      'sections.faq-accordion': { populate: { items: true } },
      'sections.logo-wall': { populate: { items: { populate: { logo: true } } } },
      'sections.downloads-list': { populate: { items: { populate: { file: true } } } },
      'sections.video-feature': { populate: true },
      'sections.credentials-grid': {
        populate: { groups: { populate: { items: true } } },
      },
      'sections.event-feature': { populate: { cta: true } },
      'sections.contact-form': { populate: true },
    },
  },
}

export const ARTICLE_POPULATE = { cover: true }
export const EVENT_POPULATE = { cover: true }
export const PODCAST_EPISODE_POPULATE = { cover: true }
export const PROJECT_POPULATE = { cover: true }
export const PRODUCT_POPULATE = { cover: true }
export const TESTIMONIAL_POPULATE = { avatar: true }
export const PRESS_MENTION_POPULATE = { logo: true }
export const MEDIA_ITEM_POPULATE = { thumbnail: true }
```

- [ ] **Step 2: Create `apps/cms/src/api/pages/services/serialize.ts`**

```ts
import type {
  MediaDTO,
  ArticleDTO,
  EventDTO,
  PodcastEpisodeDTO,
  ProjectDTO,
  ProductDTO,
  TestimonialDTO,
  PressMentionDTO,
  MediaItemDTO,
} from '@repo/types'

function strapiBase(): string {
  return (strapi.config.get('server.url') as string) || 'http://localhost:1337'
}

function absolutize(url: string | null | undefined): string | null {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url
  return strapiBase().replace(/\/$/, '') + (url.startsWith('/') ? url : `/${url}`)
}

export function serializeMedia(raw: any): MediaDTO | null {
  if (!raw) return null
  const formats = raw.formats
    ? Object.fromEntries(
        Object.entries(raw.formats).map(([key, fmt]: [string, any]) => [
          key,
          { url: absolutize(fmt.url)!, width: fmt.width, height: fmt.height },
        ]),
      )
    : undefined
  return {
    url: absolutize(raw.url)!,
    alt: raw.alternativeText ?? '',
    width: raw.width ?? 0,
    height: raw.height ?? 0,
    formats,
  }
}

function ctaButton(raw: any) {
  if (!raw) return null
  return { label: raw.label, href: raw.href, variant: raw.variant ?? 'primary' }
}

function ctaButtons(raw: any[]): { label: string; href: string; variant: 'primary' | 'outline' }[] {
  return (raw ?? []).map((r) => ({ label: r.label, href: r.href, variant: r.variant ?? 'primary' }))
}

export function serializeArticle(raw: any): ArticleDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? null,
    date: raw.date,
    readingMinutes: raw.readingMinutes ?? null,
    cover: serializeMedia(raw.cover),
    author: raw.author ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  }
}

export function serializeEvent(raw: any): EventDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    title: raw.title,
    date: raw.date,
    status: raw.status,
    city: raw.city ?? null,
    venue: raw.venue ?? null,
    cover: serializeMedia(raw.cover),
    excerpt: raw.excerpt ?? null,
  }
}

export function serializePodcastEpisode(raw: any): PodcastEpisodeDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    number: raw.number,
    title: raw.title,
    description: raw.description ?? null,
    date: raw.date,
    durationMinutes: raw.durationMinutes ?? null,
    cover: serializeMedia(raw.cover),
    audioUrl: raw.audioUrl ?? null,
    spotifyUrl: raw.spotifyUrl ?? null,
    youtubeUrl: raw.youtubeUrl ?? null,
  }
}

export function serializeProject(raw: any): ProjectDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline ?? null,
    description: raw.description ?? null,
    cover: serializeMedia(raw.cover),
    url: raw.url ?? null,
    order: raw.order ?? 0,
  }
}

export function serializeProduct(raw: any): ProductDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    name: raw.name,
    price: raw.price ?? null,
    description: raw.description ?? null,
    cover: serializeMedia(raw.cover),
    url: raw.url ?? null,
    order: raw.order ?? 0,
  }
}

export function serializeTestimonial(raw: any): TestimonialDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    quote: raw.quote,
    author: raw.author,
    role: raw.role ?? null,
    avatar: serializeMedia(raw.avatar),
  }
}

export function serializePressMention(raw: any): PressMentionDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    outlet: raw.outlet,
    title: raw.title,
    date: raw.date,
    url: raw.url,
    type: raw.type ?? null,
    logo: serializeMedia(raw.logo),
  }
}

export function serializeMediaItem(raw: any): MediaItemDTO {
  return {
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
    kind: raw.kind,
    date: raw.date ?? null,
    url: raw.url,
    thumbnail: serializeMedia(raw.thumbnail),
    description: raw.description ?? null,
  }
}

export function serializeSection(raw: any): any {
  const base = { id: raw.id, __component: raw.__component }
  switch (raw.__component) {
    case 'sections.hero':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        title: raw.title,
        titleItalic: raw.titleItalic ?? null,
        subtitle: raw.subtitle ?? null,
        accent: raw.accent ?? 'navy',
        media: serializeMedia(raw.media),
        mediaPosition: raw.mediaPosition ?? 'right',
        ctaButtons: ctaButtons(raw.ctaButtons),
        statsStrip: raw.statsStrip
          ? { items: (raw.statsStrip.items ?? []).map((i: any) => ({ id: i.id, value: i.value, label: i.label })) }
          : null,
      }
    case 'sections.text-block':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        body: raw.body ?? '',
        accent: raw.accent ?? 'paper',
      }
    case 'sections.cards-grid':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          title: i.title,
          body: i.body ?? null,
          image: serializeMedia(i.image),
          cta: ctaButton(i.cta),
        })),
      }
    case 'sections.testimonials':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          documentId: i.documentId ?? '',
          quote: i.quote,
          author: i.author,
          role: i.role ?? null,
          avatar: serializeMedia(i.avatar),
        })),
      }
    case 'sections.cta-banner':
      return {
        ...base,
        heading: raw.heading,
        subheading: raw.subheading ?? null,
        accent: raw.accent ?? 'paper',
        cta: ctaButton(raw.cta),
      }
    case 'sections.featured-list':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        headingItalic: raw.headingItalic ?? null,
        subheading: raw.subheading ?? null,
        accent: raw.accent ?? 'paper',
        relation: raw.relation,
        layout: raw.layout ?? 'grid',
        limit: raw.limit ?? 3,
        filterBy: raw.filterBy ?? null,
        seeAllHref: raw.seeAllHref ?? null,
        seeAllLabel: raw.seeAllLabel ?? null,
        items: [],
      }
    case 'sections.stats-strip':
      return {
        ...base,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({ id: i.id, value: i.value, label: i.label })),
      }
    case 'sections.quote-large':
      return {
        ...base,
        quote: raw.quote,
        author: raw.author ?? null,
        accent: raw.accent ?? 'paper',
      }
    case 'sections.image-text-split':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        body: raw.body ?? '',
        accent: raw.accent ?? 'paper',
        image: serializeMedia(raw.image),
        imageSide: raw.imageSide ?? 'right',
        cta: ctaButton(raw.cta),
      }
    case 'sections.newsletter-form':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading,
        body: raw.body ?? null,
        accent: raw.accent ?? 'paper',
        source: raw.source ?? 'site',
        submitLabel: raw.submitLabel ?? 'Trimite',
      }
    case 'sections.faq-accordion':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({ id: i.id, question: i.question, answer: i.answer })),
      }
    case 'sections.logo-wall':
      return {
        ...base,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({
          id: i.id,
          name: i.name,
          logo: serializeMedia(i.logo),
          url: i.url ?? null,
        })),
      }
    case 'sections.downloads-list':
      return {
        ...base,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        items: (raw.items ?? []).map((i: any) => ({ id: i.id, label: i.label, file: serializeMedia(i.file) })),
      }
    case 'sections.video-feature':
      return {
        ...base,
        heading: raw.heading ?? null,
        videoUrl: raw.videoUrl,
        caption: raw.caption ?? null,
        accent: raw.accent ?? 'paper',
      }
    case 'sections.credentials-grid':
      return {
        ...base,
        heading: raw.heading ?? null,
        accent: raw.accent ?? 'paper',
        groups: (raw.groups ?? []).map((g: any) => ({
          id: g.id,
          title: g.title,
          items: (g.items ?? []).map((i: any) => ({ id: i.id, label: i.label, sub: i.sub ?? null })),
        })),
      }
    case 'sections.event-feature':
      return {
        ...base,
        eyebrow: raw.eyebrow ?? null,
        accent: raw.accent ?? 'paper',
        event: null,
        cta: ctaButton(raw.cta),
      }
    case 'sections.contact-form':
      return {
        ...base,
        heading: raw.heading ?? null,
        body: raw.body ?? null,
        accent: raw.accent ?? 'paper',
        submitLabel: raw.submitLabel ?? 'Trimite',
        successMessage: raw.successMessage ?? '',
      }
    default:
      strapi.log.warn(`[pages] unknown section component: ${raw.__component}`)
      return null
  }
}
```

> If a section component has a field that doesn't match (e.g. `text-block.json` actually calls the field `content` not `body`), `serializeSection` is the single place to fix the mapping. Cross-check each `case` against `apps/cms/src/components/sections/<component>.json` during implementation.

- [ ] **Step 3: Type-check CMS**

Run: `pnpm --filter cms exec tsc --noEmit`
Expected: PASS (no errors). The `@repo/types` imports resolve via workspaces. If you see "Cannot find module '@repo/types'", run `pnpm install` at the repo root.

- [ ] **Step 4: Commit**

```bash
git add apps/cms/src/api/pages/services/populate.ts apps/cms/src/api/pages/services/serialize.ts
git commit -m "feat(cms): add populate config and DTO serializers"
```

---

## Task 4: Add `resolvers.ts` and `compose.ts`

**Files:**
- Create: `apps/cms/src/api/pages/services/resolvers.ts`
- Create: `apps/cms/src/api/pages/services/compose.ts`

- [ ] **Step 1: Create `apps/cms/src/api/pages/services/resolvers.ts`**

```ts
import {
  ARTICLE_POPULATE,
  EVENT_POPULATE,
  PODCAST_EPISODE_POPULATE,
  PROJECT_POPULATE,
  PRODUCT_POPULATE,
  TESTIMONIAL_POPULATE,
  PRESS_MENTION_POPULATE,
} from './populate'
import {
  serializeArticle,
  serializeEvent,
  serializePodcastEpisode,
  serializeProject,
  serializeProduct,
  serializeTestimonial,
  serializePressMention,
} from './serialize'

interface ListOpts {
  locale: string
  limit: number
  filterBy: Record<string, unknown> | null
}

function whereFromFilterBy(filterBy: Record<string, unknown> | null) {
  if (!filterBy) return undefined
  const filters: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(filterBy)) {
    if (value === null || value === undefined) continue
    filters[key] = { $eq: value }
  }
  return Object.keys(filters).length ? filters : undefined
}

export async function resolveArticles({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::article.article').findMany({
    locale,
    status: 'published',
    sort: ['date:desc'],
    limit,
    populate: ARTICLE_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeArticle)
}

export async function resolveEvents({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::event.event').findMany({
    locale,
    status: 'published',
    sort: ['date:desc'],
    limit,
    populate: EVENT_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeEvent)
}

export async function resolvePodcastEpisodes({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::podcast-episode.podcast-episode').findMany({
    locale,
    status: 'published',
    sort: ['number:desc'],
    limit,
    populate: PODCAST_EPISODE_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializePodcastEpisode)
}

export async function resolveProjects({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::project.project').findMany({
    locale,
    status: 'published',
    sort: ['order:asc'],
    limit,
    populate: PROJECT_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeProject)
}

export async function resolveProducts({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::product.product').findMany({
    locale,
    status: 'published',
    sort: ['order:asc'],
    limit,
    populate: PRODUCT_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeProduct)
}

export async function resolveTestimonialsList({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::testimonial.testimonial').findMany({
    locale,
    status: 'published',
    limit,
    populate: TESTIMONIAL_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializeTestimonial)
}

export async function resolvePressMentions({ locale, limit, filterBy }: ListOpts) {
  const list = await strapi.documents('api::press-mention.press-mention').findMany({
    sort: ['date:desc'],
    limit,
    populate: PRESS_MENTION_POPULATE,
    filters: whereFromFilterBy(filterBy),
  } as any)
  return list.map(serializePressMention)
}

export async function resolveFeaturedList(
  section: { relation: string; limit?: number; filterBy?: Record<string, unknown> | null },
  locale: string,
) {
  const opts = { locale, limit: section.limit ?? 3, filterBy: section.filterBy ?? null }
  switch (section.relation) {
    case 'articles':
      return { items: await resolveArticles(opts) }
    case 'events':
      return { items: await resolveEvents(opts) }
    case 'podcast-episodes':
      return { items: await resolvePodcastEpisodes(opts) }
    case 'projects':
      return { items: await resolveProjects(opts) }
    case 'products':
      return { items: await resolveProducts(opts) }
    case 'testimonials':
      return { items: await resolveTestimonialsList(opts) }
    case 'press-mentions':
      return { items: await resolvePressMentions(opts) }
    default:
      return { items: [] }
  }
}

export async function resolveEventByDocumentId(documentId: string, locale: string) {
  if (!documentId) return null
  const event = await strapi.documents('api::event.event').findOne({
    documentId,
    locale,
    status: 'published',
    populate: EVENT_POPULATE,
  } as any)
  return event ? serializeEvent(event) : null
}
```

> `strapi.documents` API on Strapi 5: `findMany({ locale, status, sort, limit, populate, filters })`. `findOne({ documentId, locale, status, populate })`. If a call fails with "no such field" in dev, open the schema for that collection and align the sort/filter key names.

- [ ] **Step 2: Create `apps/cms/src/api/pages/services/compose.ts`**

```ts
import { PAGE_POPULATE } from './populate'
import { serializeSection, serializeMedia } from './serialize'
import { resolveFeaturedList, resolveEventByDocumentId } from './resolvers'

const SLUG_TO_UID: Record<string, string> = {
  home: 'api::home-page.home-page',
  despre: 'api::about-page.about-page',
  cartea: 'api::book-page.book-page',
  podcast: 'api::podcast-page.podcast-page',
  idei: 'api::idei-page.idei-page',
  proiecte: 'api::proiecte-page.proiecte-page',
  evenimente: 'api::events-page.events-page',
  magazin: 'api::magazin-page.magazin-page',
  media: 'api::media-page.media-page',
  contact: 'api::contact-page.contact-page',
}

export async function composeSinglePage(slug: string, locale: string) {
  const uid = SLUG_TO_UID[slug]
  if (!uid) return null

  const raw = await strapi.documents(uid as any).findFirst({
    locale,
    status: 'published',
    populate: PAGE_POPULATE,
  } as any)
  if (!raw) return null

  const sections: any[] = []
  for (const rawSection of raw.sections ?? []) {
    const section = serializeSection(rawSection)
    if (!section) continue

    if (section.__component === 'sections.featured-list') {
      const { items } = await resolveFeaturedList(
        { relation: section.relation, limit: section.limit, filterBy: section.filterBy },
        locale,
      )
      section.items = items
    }

    if (section.__component === 'sections.event-feature' && rawSection.event?.documentId) {
      section.event = await resolveEventByDocumentId(rawSection.event.documentId, locale)
    }

    sections.push(section)
  }

  return {
    id: raw.id,
    documentId: raw.documentId,
    locale: raw.locale,
    slug,
    seo: {
      title: raw.seoTitle ?? null,
      description: raw.seoDescription ?? null,
    },
    sections,
  }
}

const DETAIL_RESOLVERS: Record<string, (slug: string, locale: string) => Promise<any>> = {
  async idei(slug, locale) {
    const item = await strapi.documents('api::article.article').findFirst({
      locale,
      status: 'published',
      filters: { slug: { $eq: slug } },
      populate: { cover: true },
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::article.article').findMany({
      locale,
      status: 'published',
      sort: ['date:desc'],
      limit: 3,
      filters: { slug: { $ne: slug } },
      populate: { cover: true },
    } as any)
    return {
      id: item.id,
      documentId: item.documentId,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt ?? null,
      date: item.date,
      readingMinutes: item.readingMinutes ?? null,
      cover: serializeMedia(item.cover),
      author: item.author ?? null,
      tags: Array.isArray(item.tags) ? item.tags : [],
      body: item.body ?? '',
      related: related.map((r: any) => ({
        id: r.id,
        documentId: r.documentId,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt ?? null,
        date: r.date,
        readingMinutes: r.readingMinutes ?? null,
        cover: serializeMedia(r.cover),
        author: r.author ?? null,
        tags: Array.isArray(r.tags) ? r.tags : [],
      })),
    }
  },

  async podcast(slug, locale) {
    const item = await strapi.documents('api::podcast-episode.podcast-episode').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: { cover: true },
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::podcast-episode.podcast-episode').findMany({
      locale, status: 'published', sort: ['number:desc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: { cover: true },
    } as any)
    return {
      id: item.id, documentId: item.documentId, slug: item.slug, number: item.number,
      title: item.title, description: item.description ?? null, date: item.date,
      durationMinutes: item.durationMinutes ?? null, cover: serializeMedia(item.cover),
      audioUrl: item.audioUrl ?? null, spotifyUrl: item.spotifyUrl ?? null, youtubeUrl: item.youtubeUrl ?? null,
      showNotes: item.showNotes ?? null,
      related: related.map((r: any) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, number: r.number,
        title: r.title, description: r.description ?? null, date: r.date,
        durationMinutes: r.durationMinutes ?? null, cover: serializeMedia(r.cover),
        audioUrl: r.audioUrl ?? null, spotifyUrl: r.spotifyUrl ?? null, youtubeUrl: r.youtubeUrl ?? null,
      })),
    }
  },

  async proiecte(slug, locale) {
    const item = await strapi.documents('api::project.project').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: { cover: true },
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::project.project').findMany({
      locale, status: 'published', sort: ['order:asc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: { cover: true },
    } as any)
    return {
      id: item.id, documentId: item.documentId, slug: item.slug, name: item.name,
      tagline: item.tagline ?? null, description: item.description ?? null,
      cover: serializeMedia(item.cover), url: item.url ?? null, order: item.order ?? 0,
      body: item.body ?? null,
      related: related.map((r: any) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, name: r.name,
        tagline: r.tagline ?? null, description: r.description ?? null,
        cover: serializeMedia(r.cover), url: r.url ?? null, order: r.order ?? 0,
      })),
    }
  },

  async evenimente(slug, locale) {
    const item = await strapi.documents('api::event.event').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: { cover: true },
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::event.event').findMany({
      locale, status: 'published', sort: ['date:desc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: { cover: true },
    } as any)
    return {
      id: item.id, documentId: item.documentId, slug: item.slug, title: item.title,
      date: item.date, status: item.status, city: item.city ?? null, venue: item.venue ?? null,
      cover: serializeMedia(item.cover), excerpt: item.excerpt ?? null,
      body: item.body ?? null,
      related: related.map((r: any) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, title: r.title,
        date: r.date, status: r.status, city: r.city ?? null, venue: r.venue ?? null,
        cover: serializeMedia(r.cover), excerpt: r.excerpt ?? null,
      })),
    }
  },

  async magazin(slug, locale) {
    const item = await strapi.documents('api::product.product').findFirst({
      locale, status: 'published', filters: { slug: { $eq: slug } }, populate: { cover: true },
    } as any)
    if (!item) return null
    const related = await strapi.documents('api::product.product').findMany({
      locale, status: 'published', sort: ['order:asc'], limit: 3,
      filters: { slug: { $ne: slug } }, populate: { cover: true },
    } as any)
    return {
      id: item.id, documentId: item.documentId, slug: item.slug, name: item.name,
      price: item.price ?? null, description: item.description ?? null,
      cover: serializeMedia(item.cover), url: item.url ?? null, order: item.order ?? 0,
      body: item.body ?? null,
      related: related.map((r: any) => ({
        id: r.id, documentId: r.documentId, slug: r.slug, name: r.name,
        price: r.price ?? null, description: r.description ?? null,
        cover: serializeMedia(r.cover), url: r.url ?? null, order: r.order ?? 0,
      })),
    }
  },
}

export async function composeDetailPage(type: string, slug: string, locale: string) {
  const resolver = DETAIL_RESOLVERS[type]
  if (!resolver) return null
  return resolver(slug, locale)
}
```

- [ ] **Step 3: Type-check CMS**

Run: `pnpm --filter cms exec tsc --noEmit`
Expected: PASS. If you see errors about `strapi.documents` signatures, use the `as any` cast shown — Strapi's TS types for `documents()` are loose in 5.41.

- [ ] **Step 4: Commit**

```bash
git add apps/cms/src/api/pages/services/resolvers.ts apps/cms/src/api/pages/services/compose.ts
git commit -m "feat(cms): add page composer and collection resolvers"
```

---

## Task 5: Wire controller to composer and smoke-test home

**Files:**
- Modify: `apps/cms/src/api/pages/controllers/pages.ts`

- [ ] **Step 1: Replace controller stubs with real composition**

Open `apps/cms/src/api/pages/controllers/pages.ts` and replace the file with:

```ts
import type { Context } from 'koa'
import { composeSinglePage, composeDetailPage } from '../services/compose'

export default {
  async findSingle(ctx: Context) {
    const { slug } = ctx.params
    const locale = (ctx.query.locale as string) ?? 'ro'
    try {
      const dto = await composeSinglePage(slug, locale)
      if (!dto) return ctx.notFound(`no page for slug "${slug}"`)
      ctx.body = dto
    } catch (err) {
      strapi.log.error('[pages] findSingle failed', { slug, locale, err })
      ctx.throw(500, 'page composition failed')
    }
  },

  async findDetail(ctx: Context) {
    const { type, slug } = ctx.params
    const locale = (ctx.query.locale as string) ?? 'ro'
    try {
      const dto = await composeDetailPage(type, slug, locale)
      if (!dto) return ctx.notFound(`no ${type} for slug "${slug}"`)
      ctx.body = dto
    } catch (err) {
      strapi.log.error('[pages] findDetail failed', { type, slug, locale, err })
      ctx.throw(500, 'detail composition failed')
    }
  },
}
```

- [ ] **Step 2: Restart CMS dev server and watch logs**

Run: `pnpm --filter cms dev` (kill the previous instance first). Wait for `Welcome` banner. Look for any TypeScript-related errors.

- [ ] **Step 3: Smoke test home**

Run:
```bash
curl -sS 'http://localhost:1337/api/pages/home?locale=ro' | python3 -c "
import sys, json
d = json.load(sys.stdin)
assert d['slug'] == 'home', f\"slug={d['slug']}\"
assert isinstance(d['sections'], list), 'sections not a list'
assert len(d['sections']) > 0, 'sections is empty'
assert all('__component' in s for s in d['sections']), 'missing __component'
print(f\"OK — {len(d['sections'])} sections, components: {[s['__component'] for s in d['sections']]}\")"
```

Expected output (variation in section list is fine): `OK — 7 sections, components: ['sections.hero', 'sections.featured-list', ...]`

If a section is missing `__component`, check `serializeSection` for that component and confirm the `case` exists.

If a `featured-list` section has `items: []` despite the collection being seeded, restart CMS (the resolver may have failed on first request — check logs).

- [ ] **Step 4: Smoke test despre (no relations)**

Run: `curl -sS 'http://localhost:1337/api/pages/despre?locale=ro' | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'OK — {len(d[\"sections\"])} sections')"`
Expected: `OK — N sections` (N matches what the despre seed put in).

- [ ] **Step 5: Smoke test 404**

Run: `curl -sS -o /dev/null -w '%{http_code}\n' 'http://localhost:1337/api/pages/nonexistent?locale=ro'`
Expected: `404`

- [ ] **Step 6: Smoke test detail (article)**

Pick a known article slug from the seed: `curl -sS 'http://localhost:1337/api/articles?locale=ro&pagination[limit]=1' | python3 -c "import sys,json; print(json.load(sys.stdin)['data'][0]['slug'])"`

Then: `curl -sS "http://localhost:1337/api/pages/idei/<that-slug>?locale=ro" | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['slug']; assert isinstance(d['related'], list); print(f'OK — {d[\"title\"]} + {len(d[\"related\"])} related')"`
Expected: `OK — <title> + N related`

- [ ] **Step 7: Commit**

```bash
git add apps/cms/src/api/pages/controllers/pages.ts
git commit -m "feat(cms): wire pages controller to composer and verify endpoints"
```

---

## Task 6: Update section type definitions in `@repo/types` to include resolved items

The `SectionDTO` union already includes the resolved fields. But the legacy `Section` union (in `packages/types/src/components/sections/`) is what the current organisms import. To migrate organisms, switch the organism prop types from legacy `SectionFeaturedList` to `FeaturedListDTO`.

**Files:**
- No file changes in this task — verify the shape match.

- [ ] **Step 1: Confirm `FeaturedListDTO.items` shape matches what `FeaturedList.tsx` already renders**

Read `apps/web/components/organisms/FeaturedList.tsx`. Each `case` of `section.relation` maps the list to a card component (`ArticleCard`, `EventCard`, etc.). The card components accept `{ article: Article }`, `{ event: Event }`, etc. — confirm those `Article`, `Event` types (in `@repo/types`) have the same field names as `ArticleDTO`, `EventDTO`.

If a card component reads `article.attributes.title`, that's the legacy Strapi shape — the card itself will need a small update in Task 9.

If a card reads `article.title` directly (already flat), no change is needed.

Record any mismatches in a scratch note for Task 9.

- [ ] **Step 2: No commit (verification task)**

---

## Task 7: Replace `apps/web/lib/strapi.ts` with thin per-page fetchers

**Files:**
- Modify: `apps/web/lib/strapi.ts` (replace the entire file)

- [ ] **Step 1: Replace `apps/web/lib/strapi.ts`**

```ts
import type {
  SingleTypePageDTO,
  ArticleDetailDTO,
  PodcastEpisodeDetailDTO,
  ProjectDetailDTO,
  EventDetailDTO,
  ProductDetailDTO,
  PageSlug,
} from '@repo/types'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

class NotFoundError extends Error {
  constructor(path: string) {
    super(`not-found: ${path}`)
    this.name = 'NotFoundError'
  }
}

async function fetchPage<T>(path: string, locale: string, tags: string[]): Promise<T> {
  const url = `${STRAPI_URL}/api/pages/${path}?locale=${encodeURIComponent(locale)}`
  const res = await fetch(url, {
    headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
    next: { tags },
  })
  if (res.status === 404) throw new NotFoundError(path)
  if (!res.ok) throw new Error(`pages fetch failed [${res.status}]: ${path}`)
  return res.json() as Promise<T>
}

export { NotFoundError }

// Single-type pages
export const getHomePage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('home', locale, ['home-page'])
export const getAboutPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('despre', locale, ['about-page'])
export const getBookPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('cartea', locale, ['book-page'])
export const getPodcastPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('podcast', locale, ['podcast-page'])
export const getIdeiPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('idei', locale, ['idei-page'])
export const getProiectePage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('proiecte', locale, ['proiecte-page'])
export const getEventsPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('evenimente', locale, ['events-page'])
export const getMagazinPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('magazin', locale, ['magazin-page'])
export const getMediaPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('media', locale, ['media-page'])
export const getContactPage = (locale: string) =>
  fetchPage<SingleTypePageDTO>('contact', locale, ['contact-page'])

// Detail pages
export const getArticle = (slug: string, locale: string) =>
  fetchPage<ArticleDetailDTO>(`idei/${slug}`, locale, ['articles', `article:${slug}`])
export const getPodcastEpisode = (slug: string, locale: string) =>
  fetchPage<PodcastEpisodeDetailDTO>(`podcast/${slug}`, locale, [
    'podcast-episodes',
    `podcast-episode:${slug}`,
  ])
export const getProject = (slug: string, locale: string) =>
  fetchPage<ProjectDetailDTO>(`proiecte/${slug}`, locale, ['projects', `project:${slug}`])
export const getEvent = (slug: string, locale: string) =>
  fetchPage<EventDetailDTO>(`evenimente/${slug}`, locale, ['events', `event:${slug}`])
export const getProduct = (slug: string, locale: string) =>
  fetchPage<ProductDetailDTO>(`magazin/${slug}`, locale, ['products', `product:${slug}`])

// Newsletter submit (unchanged write surface)
export async function submitNewsletter(email: string, source: string): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/newsletter-subscriptions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: { email, source, consent: true } }),
  })
  if (!res.ok) throw new Error(`Newsletter subscribe failed [${res.status}]`)
}
```

- [ ] **Step 2: Type-check web**

Run: `pnpm --filter web check-types`
Expected: many errors because organisms still import old types (`Article`, `Event`, etc.) and `lib/strapi.ts` no longer exports the old helpers (`getArticles`, etc.). That's expected — Tasks 8-9 fix them. Capture the error list to use as a checklist for the next tasks.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/strapi.ts
git commit -m "feat(web): replace strapi.ts with thin per-page fetchers"
```

> The commit intentionally breaks the type-check. The next tasks restore green.

---

## Task 8: Make `FeaturedList` a pure presentational component

**Files:**
- Modify: `apps/web/components/organisms/FeaturedList.tsx`

- [ ] **Step 1: Rewrite `FeaturedList.tsx` to consume `FeaturedListDTO`**

Replace the file with:

```tsx
import type { FeaturedListDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { ArticleCard } from '../molecules/ArticleCard'
import { EventCard } from '../molecules/EventCard'
import { PodcastEpisodeCard } from '../molecules/PodcastEpisodeCard'
import { ProjectCard } from '../molecules/ProjectCard'
import { ProductCard } from '../molecules/ProductCard'
import { TestimonialCard } from '../molecules/TestimonialCard'
import { PressMentionCard } from '../molecules/PressMentionCard'
import { getAccent, accentRootClass } from '@/lib/accent'
import Link from 'next/link'

interface FeaturedListProps {
  section: FeaturedListDTO
  locale: string
}

const containerClass: Record<string, string> = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  row: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  marquee: 'flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4',
  feature: 'space-y-12',
}

export function FeaturedList({ section, locale }: FeaturedListProps) {
  const a = getAccent(section.accent)
  const layout = section.layout ?? 'grid'

  let cards: React.ReactNode = null
  switch (section.relation) {
    case 'articles':
      cards = section.items.map((item) => (
        <ArticleCard key={item.id} article={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'events':
      cards = section.items.map((item) => (
        <EventCard key={item.id} event={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'podcast-episodes':
      cards = section.items.map((item) => (
        <PodcastEpisodeCard key={item.id} episode={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'projects':
      cards = section.items.map((item) => (
        <ProjectCard key={item.id} project={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'products':
      cards = section.items.map((item) => (
        <ProductCard key={item.id} product={item} accent={section.accent} />
      ))
      break
    case 'testimonials':
      cards = section.items.map((item, idx) => (
        <TestimonialCard key={item.id} item={item} accent={section.accent} featured={idx === 0} />
      ))
      break
    case 'press-mentions':
      cards = section.items.map((item) => (
        <PressMentionCard key={item.id} mention={item} accent={section.accent} />
      ))
      break
  }

  return (
    <section className={`${accentRootClass(a)} py-20`}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={section.eyebrow}
          heading={section.heading}
          headingItalic={section.headingItalic}
          subheading={section.subheading}
          accent={section.accent}
        />
        <div className={containerClass[layout] ?? containerClass.grid}>{cards}</div>
        {section.seeAllHref && section.seeAllLabel && (
          <div className="mt-10">
            <Link href={section.seeAllHref} className="underline underline-offset-4">
              {section.seeAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Card components — update prop types where needed**

For each card component (`ArticleCard`, `EventCard`, `PodcastEpisodeCard`, `ProjectCard`, `ProductCard`, `TestimonialCard`, `PressMentionCard`) in `apps/web/components/molecules/`:

1. Open the file.
2. Change its prop type from the legacy entity type (e.g. `Article` from `@repo/types`) to the DTO type (e.g. `ArticleDTO`).
3. If the component reads `entity.attributes.<field>` anywhere, change it to `entity.<field>`. The DTO is already flat.
4. If the component reads `entity.cover?.data?.attributes?.url`, change it to `entity.cover?.url` (already absolute).

This is a mechanical change — do all 7 card components in this step.

- [ ] **Step 3: Type-check web**

Run: `pnpm --filter web check-types`
Expected: error list shrinks. Remaining errors should now point only at organisms (`EventFeature`, `TestimonialsSection`) and page routes.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/organisms/FeaturedList.tsx apps/web/components/molecules/
git commit -m "refactor(web): FeaturedList + cards consume DTO types directly"
```

---

## Task 9: Convert `EventFeature` and `TestimonialsSection` to pure components

**Files:**
- Modify: `apps/web/components/organisms/EventFeature.tsx`
- Modify: `apps/web/components/organisms/TestimonialsSection.tsx`

- [ ] **Step 1: Rewrite `EventFeature.tsx`**

Open the existing file and convert it to:

```tsx
import type { EventFeatureDTO } from '@repo/types'
import { EventCard } from '../molecules/EventCard'
import { getAccent, accentRootClass } from '@/lib/accent'

interface EventFeatureProps {
  section: EventFeatureDTO
  locale: string
}

export function EventFeature({ section, locale }: EventFeatureProps) {
  const a = getAccent(section.accent)
  if (!section.event) return null
  return (
    <section className={`${accentRootClass(a)} py-20`}>
      <div className="mx-auto max-w-6xl px-6">
        {section.eyebrow && <p className="uppercase tracking-wider mb-4">{section.eyebrow}</p>}
        <EventCard event={section.event} locale={locale} accent={section.accent} />
        {section.cta && (
          <a href={section.cta.href} className="mt-6 inline-block underline underline-offset-4">
            {section.cta.label}
          </a>
        )}
      </div>
    </section>
  )
}
```

Drop any `await getEvents(...)` / `async function` markers; this is now synchronous.

- [ ] **Step 2: Rewrite `TestimonialsSection.tsx`**

```tsx
import type { TestimonialsDTO } from '@repo/types'
import { TestimonialCard } from '../molecules/TestimonialCard'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass } from '@/lib/accent'

interface TestimonialsSectionProps {
  section: TestimonialsDTO
  locale: string
}

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const a = getAccent(section.accent)
  return (
    <section className={`${accentRootClass(a)} py-20`}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={section.eyebrow} heading={section.heading} accent={section.accent} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.items.map((item, idx) => (
            <TestimonialCard key={item.id} item={item} accent={section.accent} featured={idx === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

> The `locale` prop is unused now but kept in the signature so `DynamicZone.tsx` doesn't need to special-case the call site. Linter may warn — accept the warning, or drop the prop from the call in `DynamicZone` if you prefer.

- [ ] **Step 3: Update `DynamicZone.tsx` to use DTO types**

Replace its import:
```tsx
import type { SectionDTO } from '@repo/types'
```

Change `sections: Section[]` to `sections: SectionDTO[]` in the props interface.

The switch statement keeps working — `__component` is a TypeScript discriminator across the union.

- [ ] **Step 4: Type-check web**

Run: `pnpm --filter web check-types`
Expected: errors now point only at page route files (`app/[locale]/<page>/page.tsx`).

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/organisms/EventFeature.tsx apps/web/components/organisms/TestimonialsSection.tsx apps/web/components/organisms/DynamicZone.tsx
git commit -m "refactor(web): EventFeature + TestimonialsSection consume DTOs, drop async fetches"
```

---

## Task 10: Migrate all 10 single-type page routes

**Files (one repeat pattern for each):**
- Modify: `apps/web/app/[locale]/page.tsx` (home)
- Modify: `apps/web/app/[locale]/despre/page.tsx`
- Modify: `apps/web/app/[locale]/carte/page.tsx`
- Modify: `apps/web/app/[locale]/podcast/page.tsx`
- Modify: `apps/web/app/[locale]/idei/page.tsx`
- Modify: `apps/web/app/[locale]/proiecte/page.tsx`
- Modify: `apps/web/app/[locale]/evenimente/page.tsx`
- Modify: `apps/web/app/[locale]/magazin/page.tsx`
- Modify: `apps/web/app/[locale]/media/page.tsx`
- Modify: `apps/web/app/[locale]/contact/page.tsx`

- [ ] **Step 1: Migrate the home route as the canonical pattern**

Open `apps/web/app/[locale]/page.tsx`. Replace its body with this shape (preserve any locale-typing helpers it already uses, e.g. `Locale` from `proxy.ts`):

```tsx
import { getHomePage } from '@/lib/strapi'
import { DynamicZone } from '@/components/organisms/DynamicZone'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const page = await getHomePage(locale)
  return <DynamicZone sections={page.sections} locale={locale} />
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const page = await getHomePage(locale)
  return { title: page.seo.title ?? undefined, description: page.seo.description ?? undefined }
}
```

- [ ] **Step 2: Repeat for each remaining single-type page**

For each of the 9 other page files, apply the same pattern with the matching fetcher:

| File | Fetcher |
| --- | --- |
| `[locale]/despre/page.tsx` | `getAboutPage` |
| `[locale]/carte/page.tsx` | `getBookPage` |
| `[locale]/podcast/page.tsx` | `getPodcastPage` |
| `[locale]/idei/page.tsx` | `getIdeiPage` |
| `[locale]/proiecte/page.tsx` | `getProiectePage` |
| `[locale]/evenimente/page.tsx` | `getEventsPage` |
| `[locale]/magazin/page.tsx` | `getMagazinPage` |
| `[locale]/media/page.tsx` | `getMediaPage` |
| `[locale]/contact/page.tsx` | `getContactPage` |

Same body: fetch page → `<DynamicZone sections={page.sections} locale={locale} />` → metadata from `page.seo`.

- [ ] **Step 3: Type-check web**

Run: `pnpm --filter web check-types`
Expected: PASS (or only errors from detail pages, addressed in Task 11).

- [ ] **Step 4: Smoke render in dev**

Start the web dev server if not running: `pnpm --filter web dev`. Then for each path, run:

```bash
for path in / /ro /ro/despre /ro/carte /ro/podcast /ro/idei /ro/proiecte /ro/evenimente /ro/magazin /ro/media /ro/contact; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  printf "%-25s %s\n" "$path" "$code"
done
```

Expected: every status code is `200` (or `307` for `/` redirecting to `/ro`).

If a page returns 500, open the dev server logs — the error stack will point to the section type that doesn't match.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/\[locale\]
git commit -m "refactor(web): migrate single-type pages to composed DTO fetchers"
```

---

## Task 11: Migrate detail page routes

**Files:**
- Modify: `apps/web/app/[locale]/idei/[slug]/page.tsx`
- Modify: `apps/web/app/[locale]/evenimente/[slug]/page.tsx`
- Create (if missing): `apps/web/app/[locale]/podcast/[slug]/page.tsx`, `apps/web/app/[locale]/proiecte/[slug]/page.tsx`, `apps/web/app/[locale]/magazin/[slug]/page.tsx`

- [ ] **Step 1: Migrate `idei/[slug]/page.tsx`**

Replace the body with:

```tsx
import { notFound } from 'next/navigation'
import { getArticle, NotFoundError } from '@/lib/strapi'
import { ArticleDetail } from '@/components/organisms/ArticleDetail'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ArticleDetailRoute({ params }: PageProps) {
  const { locale, slug } = await params
  let article
  try {
    article = await getArticle(slug, locale)
  } catch (e) {
    if (e instanceof NotFoundError) notFound()
    throw e
  }
  return <ArticleDetail article={article} locale={locale} />
}
```

- [ ] **Step 2: Update `ArticleDetail` to accept `ArticleDetailDTO`**

Open `apps/web/components/organisms/ArticleDetail.tsx`. Change its prop type from the legacy `Article` to `ArticleDetailDTO`. Verify it reads `article.body`, `article.related`, etc. directly (already flat).

- [ ] **Step 3: Migrate `evenimente/[slug]/page.tsx`**

Same pattern, with `getEvent`. Update `EventDetail.tsx` to accept `EventDetailDTO`.

- [ ] **Step 4: Add the remaining 3 detail pages only if the project's sitemap currently calls for them**

Check `apps/web/app/[locale]/` — if `podcast/[slug]`, `proiecte/[slug]`, `magazin/[slug]` don't exist yet, leave them for a future page-build task. The detail endpoints in CMS are ready when needed.

- [ ] **Step 5: Type-check web**

Run: `pnpm --filter web check-types`
Expected: PASS.

- [ ] **Step 6: Smoke test article detail in browser**

Pick a known article slug (from the seed) and navigate to `http://localhost:3000/ro/idei/<slug>`. Expect HTTP 200 + content rendered.

Run: `curl -sS -o /dev/null -w "%{http_code}\n" "http://localhost:3000/ro/idei/<slug>"`
Expected: `200`

- [ ] **Step 7: Commit**

```bash
git add apps/web/app/\[locale\]/idei apps/web/app/\[locale\]/evenimente apps/web/components/organisms/ArticleDetail.tsx apps/web/components/organisms/EventDetail.tsx
git commit -m "refactor(web): migrate detail page routes to composed DTOs"
```

---

## Task 12: Final verification

- [ ] **Step 1: Repo-wide type-check**

Run: `pnpm -r check-types`
Expected: every workspace passes.

- [ ] **Step 2: Repo-wide build (catches anything check-types misses)**

Run: `pnpm --filter web build`
Expected: build succeeds, no warnings about unresolved imports.

- [ ] **Step 3: Manual page tour**

Restart `pnpm dev` (Strapi + web). Open each in a browser and confirm full render with images:

- `http://localhost:3000/ro` — home (7 sections)
- `http://localhost:3000/ro/despre`
- `http://localhost:3000/ro/carte`
- `http://localhost:3000/ro/podcast`
- `http://localhost:3000/ro/idei`
- `http://localhost:3000/ro/proiecte`
- `http://localhost:3000/ro/evenimente`
- `http://localhost:3000/ro/magazin`
- `http://localhost:3000/ro/media`
- `http://localhost:3000/ro/contact`

For each, in the browser network tab confirm exactly **one** request to `/api/pages/...`. No `/api/articles?populate=*` / `/api/events?...` calls from the home or list pages.

- [ ] **Step 4: Compare network behavior to before**

Before this refactor: home page issued 1 + ~5 Strapi calls. After: 1 Strapi call. Confirm in the Strapi dev console output that you see a single `GET /api/pages/home` line per home render, not a cluster of follow-up `GET /api/articles`, `GET /api/podcast-episodes`, etc.

- [ ] **Step 5: Commit anything pending**

`git status` should be clean. If there are stray edits (e.g. an unused import you removed), commit them:

```bash
git add -A
git commit -m "chore(web): cleanup unused imports after DTO migration"
```

- [ ] **Step 6: Tag the refactor in the commit log**

Skip if the team doesn't tag refactors. Otherwise:

```bash
git log --oneline | head -15
```

Confirm the commit chain reads like a coherent feature branch.

---

## Self-review checklist (applied during writing)

- **Spec coverage:** Routes table → Tasks 2 + 5 + 11. Populate map → Task 3. Composer → Task 4. DTO types → Task 1. Web fetcher → Task 7. Organism migration → Tasks 8-9. Page route migration → Tasks 10-11. Old code deletion → integrated into Task 7 (lib/strapi.ts is fully replaced).
- **Placeholders:** None. Every code step contains complete code; every command has expected output.
- **Type consistency:** `SingleTypePageDTO` defined in Task 1 → consumed in Task 7. `FeaturedListDTO` defined in Task 1 → consumed in Tasks 8 + 10. `composeSinglePage` defined in Task 4 → called in Task 5. Names match across tasks.
- **Open delta noted:** Task 6 is a verification-only task (no commit). Card component touch-ups are bundled into Task 8 Step 2 instead of getting their own task — they're a single mechanical pass.
