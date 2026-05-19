# Damasaru.ro — Presentation Website Design

**Date:** 2026-04-05  
**Project:** damasaru-ro monorepo  
**Stack:** Next.js 16 (Vercel) + Strapi 5 (Railway) + PostgreSQL (Docker local / Railway prod)

---

## 1. Architecture Overview

### Monorepo Structure
```
damasaru-ro/
├── apps/
│   ├── web/                  # Next.js 16, React 19, Tailwind 4 — deployed on Vercel
│   └── cms/                  # Strapi 5 — deployed on Railway
├── packages/
│   ├── types/                # NEW — auto-generated Strapi TypeScript types
│   ├── ui/                   # existing shared UI primitives
│   ├── eslint-config/
│   └── typescript-config/
└── docker-compose.yml        # NEW — PostgreSQL for local development
```

### Data Flow
1. Editor publishes/updates content in Strapi admin (Railway)
2. Strapi fires a webhook → `apps/web/app/api/revalidate/route.ts` on Vercel
3. Route handler calls `revalidateTag()` — only affected pages are invalidated
4. Visitors receive fast static HTML; stale pages revalidate on-demand via ISR
5. New slugs not yet statically generated are rendered on first request and cached (`dynamicParams = true`)

### Turbo Pipeline
- `apps/cms` exposes a `generate:types` script that writes to `packages/types/src/`
- `apps/web#build` declares `dependsOn: ["cms#generate:types"]` — types are always fresh before the Next.js build
- `turbo.json` caches the type generation output at `packages/types/src/**`

---

## 2. Database

### Local Development
Docker Compose at monorepo root:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: damasaru
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapi
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

CMS `.env` (local):
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=damasaru
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

### Production (Railway)
Railway provides `DATABASE_URL` automatically when a Postgres plugin is attached. The existing `apps/cms/config/database.ts` already reads `connectionString: env('DATABASE_URL')` — no code changes needed. Set `DATABASE_CLIENT=postgres` in Railway environment variables.

---

## 3. Strapi Content Types

### i18n
All content types have i18n enabled via Strapi's built-in i18n plugin.  
Locales: `ro` (default), `en`.  
Media assets (images) are shared across locales.

### Single Types (one instance per locale)
| Type | Key Fields |
|------|-----------|
| `home-page` | hero (title, subtitle, cta), testimonials, sections (dynamic zone) |
| `about-page` | bio, photo, projects list, sections (dynamic zone) |
| `book-page` | title, description, takeaways, buy links, sections (dynamic zone) |
| `media-page` | page title, intro text, sections (dynamic zone) |

### Collection Types
| Type | Key Fields |
|------|-----------|
| `article` | title, slug, excerpt, content (rich text), date, category, readTime, coverImage |
| `event` | title, slug, description, date, time, location, venue, price, spots, status, coverImage |
| `media-item` | type (video/press/podcast), title, source, url, date, thumbnail |

### Dynamic Zone Components
Each page Single Type has a `sections` dynamic zone — an ordered list of components editors compose freely:

| Component | Fields |
|-----------|--------|
| `sections.hero` | title, subtitle, cta buttons array |
| `sections.text-block` | eyebrow label, heading, body (rich text) |
| `sections.cards-grid` | heading, items (title, text, icon name) |
| `sections.testimonials` | items (quote, author, role, photo) |
| `sections.cta-banner` | heading, subtext, button label + link |
| `sections.featured-list` | relation to articles or events |

---

## 4. Shared Types Package (`packages/types`)

Uses `strapi-plugin-schemas-to-ts` installed in `apps/cms`. A `generate:types` script exports schema types into the shared package.

### Structure
```
packages/types/
├── src/
│   ├── index.ts              # re-exports everything
│   ├── components/
│   │   └── sections.ts       # dynamic zone component interfaces
│   └── api/
│       ├── article.ts
│       ├── event.ts
│       ├── media-item.ts
│       ├── home-page.ts
│       ├── about-page.ts
│       ├── book-page.ts
│       └── media-page.ts
├── package.json              # name: "@repo/types"
└── tsconfig.json             # extends @repo/typescript-config/base
```

### Usage in `apps/web`
```ts
import type { Article, HomePage, SectionsHero } from '@repo/types'
```

---

## 5. Next.js Routing & i18n

### Strategy
`next-intl` with locale prefix. The `[locale]` dynamic segment is a single folder handling all locales — no code duplication.

### App Directory Structure
```
apps/web/app/
├── [locale]/
│   ├── layout.tsx              # next-intl provider wrapper
│   ├── page.tsx                # home
│   ├── despre/page.tsx         # about
│   ├── carte/page.tsx          # book
│   ├── evenimente/
│   │   ├── page.tsx            # events listing
│   │   └── [slug]/page.tsx     # event detail
│   ├── blog/
│   │   ├── page.tsx            # blog listing
│   │   └── [slug]/page.tsx     # article detail
│   ├── media/page.tsx
│   └── contact/page.tsx        # static — no CMS data
├── api/
│   └── revalidate/route.ts     # webhook endpoint
└── middleware.ts               # next-intl locale detection + redirect
```

### Data Fetching Helper
```ts
// apps/web/lib/strapi.ts
export async function fetchStrapi<T>(
  path: string,
  { locale, tags }: { locale: string; tags: string[] }
): Promise<T> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/${path}?locale=${locale}&populate=deep`,
    { next: { tags } }
  )
  if (!res.ok) throw new Error(`Strapi fetch failed: ${path}`)
  return res.json()
}
```

### Static Generation
Pages use `generateStaticParams` to pre-render all locale + slug combinations at build time:
```ts
const locales = ['ro', 'en']

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const articles = await fetchStrapi<Article[]>('articles', { locale, tags: [] })
      return articles.map(a => ({ locale, slug: a.slug }))
    })
  )
  return params.flat()
}
export const dynamicParams = true  // render new slugs on first request
```

---

## 6. ISR + Webhook Cache Invalidation

### Tag Strategy
| Fetch | Tags |
|-------|------|
| Articles listing | `['articles']` |
| Article detail | `['articles', 'article:{slug}']` |
| Events listing | `['events']` |
| Event detail | `['events', 'event:{slug}']` |
| Home page | `['home-page']` |
| About page | `['about-page']` |
| Book page | `['book-page']` |
| Media page | `['media-page']` |

### Webhook Route Handler
```ts
// app/api/revalidate/route.ts
export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET)
    return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { model, entry } = await req.json()

  revalidateTag(model)
  if (entry?.slug) revalidateTag(`${model}:${entry.slug}`)

  return Response.json({ revalidated: true })
}
```

### Strapi Webhook Configuration
- URL: `https://damasaru.ro/api/revalidate`
- Header: `x-revalidate-secret: <shared secret>`
- Events: `entry.publish`, `entry.update`, `entry.delete`

### Fallback Behavior
Strapi retries failed webhooks 5 times by default. The endpoint is idempotent so retries are safe. If revalidation fails, pages remain stale until the next successful trigger — acceptable for a presentation site.

---

## 7. Component Architecture (Atomic Design)

All components ported from `figmaMockup/src/` and adapted to:
- Receive props from Strapi data (no hardcoded arrays)
- Follow Next.js Server/Client Component split
- Be organized by atomic design tier

### Structure
```
apps/web/components/
├── atoms/
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── Eyebrow.tsx           # label + decorative line
│   ├── Avatar.tsx
│   └── Tag.tsx
├── molecules/
│   ├── NavLink.tsx
│   ├── ArticleCard.tsx
│   ├── EventCard.tsx
│   ├── TestimonialCard.tsx
│   ├── TakeawayItem.tsx
│   ├── MediaCard.tsx
│   └── SectionHeading.tsx
└── organisms/
    ├── Navigation.tsx        # CLIENT — mobile menu toggle state
    ├── Footer.tsx
    ├── DynamicZone.tsx       # SERVER — maps __component to organism
    ├── HeroSection.tsx
    ├── TextBlock.tsx
    ├── CardsGrid.tsx
    ├── TestimonialsSection.tsx
    ├── CTABanner.tsx
    ├── FeaturedList.tsx
    ├── ArticlesList.tsx
    ├── EventsList.tsx
    └── ProductCarousel.tsx   # CLIENT — scroll/swipe state
```

### Server vs Client Rule
- **Default: Server Component** — organisms that render Strapi data have no reason to be client-side
- **Client Component** only when the component needs `useState`, `useEffect`, or event handlers: `Navigation`, `ProductCarousel`, and any filter UI (blog category filter, events status filter)
- `DynamicZone` itself is a Server Component — individual organisms it renders may be client or server independently

---

## 8. Error Handling

- **Strapi fetch errors**: `fetchStrapi` throws on non-2xx. Next.js `error.tsx` files per route segment display a fallback UI.
- **Missing locale content**: If Strapi returns no data for a locale, fall back to the default locale (`ro`).
- **Build failures**: `generateStaticParams` errors abort the Vercel build — Strapi data issues are surfaced at build time, not silently at runtime.

---

## 9. Type Safety & CI

- `turbo check-types` runs `tsc --noEmit` across all packages — catches type drift between Strapi schema changes and frontend usage.
- No unit tests for components — visual correctness verified against the Figma mockup.
- Optional: Playwright smoke tests against staging to verify key pages render with real Strapi data before production deploys.
