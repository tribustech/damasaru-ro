# Damasaru.ro Presentation Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (RO/EN) presentation website for Costin Damașaru — a Next.js 16 SSG/ISR frontend consuming a Strapi 5 CMS with PostgreSQL, with shared TypeScript types, dynamic zone page composition, and webhook-based cache invalidation.

**Architecture:** Next.js 16 app router with `[locale]` dynamic segment for i18n (RO/EN), fetching content from Strapi 5 via tagged `fetch()` calls for ISR. Types are manually defined in `packages/types` to match the Strapi schemas. A `proxy.ts` file (Next.js 16's replacement for `middleware.ts`) handles locale detection and redirect.

**Tech Stack:** Next.js 16.2.2, React 19, Tailwind 4, Strapi 5.41.1, PostgreSQL 16, pnpm + Turborepo, Vercel (web), Railway (CMS + DB), Docker Compose (local dev), `motion`, `lucide-react`, `@formatjs/intl-localematcher`, `negotiator`

---

## File Map

```
# New files to create
docker-compose.yml
turbo.json                                          MODIFY

packages/types/package.json
packages/types/tsconfig.json
packages/types/src/index.ts
packages/types/src/shared.ts
packages/types/src/components/sections.ts
packages/types/src/api/article.ts
packages/types/src/api/event.ts
packages/types/src/api/media-item.ts
packages/types/src/api/home-page.ts
packages/types/src/api/about-page.ts
packages/types/src/api/book-page.ts
packages/types/src/api/media-page.ts

apps/cms/package.json                               MODIFY (add pg, @strapi/plugin-i18n)
apps/cms/.env                                       MODIFY (add postgres vars)
apps/cms/config/plugins.ts                          MODIFY (enable i18n)
apps/cms/src/components/sections/hero.json
apps/cms/src/components/sections/text-block.json
apps/cms/src/components/sections/cards-grid.json
apps/cms/src/components/sections/testimonials.json
apps/cms/src/components/sections/cta-banner.json
apps/cms/src/components/sections/featured-list.json
apps/cms/src/components/shared/cta-button.json
apps/cms/src/api/article/content-types/article/schema.json
apps/cms/src/api/event/content-types/event/schema.json
apps/cms/src/api/media-item/content-types/media-item/schema.json
apps/cms/src/api/home-page/content-types/home-page/schema.json
apps/cms/src/api/about-page/content-types/about-page/schema.json
apps/cms/src/api/book-page/content-types/book-page/schema.json
apps/cms/src/api/media-page/content-types/media-page/schema.json

apps/web/package.json                               MODIFY (add lucide-react, motion, negotiator, @formatjs/intl-localematcher)
apps/web/next.config.ts                             CREATE
apps/web/proxy.ts                                   CREATE (replaces middleware.ts — Next.js 16)
apps/web/dictionaries/ro.json
apps/web/dictionaries/en.json
apps/web/lib/dictionaries.ts
apps/web/lib/strapi.ts
apps/web/app/layout.tsx                             MODIFY (root layout redirect)
apps/web/app/[locale]/layout.tsx                    CREATE
apps/web/app/[locale]/page.tsx                      CREATE (replaces app/page.tsx)
apps/web/app/[locale]/despre/page.tsx
apps/web/app/[locale]/carte/page.tsx
apps/web/app/[locale]/evenimente/page.tsx
apps/web/app/[locale]/evenimente/[slug]/page.tsx
apps/web/app/[locale]/blog/page.tsx
apps/web/app/[locale]/blog/[slug]/page.tsx
apps/web/app/[locale]/media/page.tsx
apps/web/app/[locale]/contact/page.tsx
apps/web/app/[locale]/error.tsx
apps/web/app/[locale]/not-found.tsx
apps/web/app/api/revalidate/route.ts
apps/web/components/atoms/Button.tsx
apps/web/components/atoms/Badge.tsx
apps/web/components/atoms/Eyebrow.tsx
apps/web/components/atoms/Avatar.tsx
apps/web/components/atoms/Tag.tsx
apps/web/components/molecules/NavLink.tsx
apps/web/components/molecules/SectionHeading.tsx
apps/web/components/molecules/ArticleCard.tsx
apps/web/components/molecules/EventCard.tsx
apps/web/components/molecules/TestimonialCard.tsx
apps/web/components/molecules/TakeawayItem.tsx
apps/web/components/molecules/MediaCard.tsx
apps/web/components/organisms/Navigation.tsx        # 'use client'
apps/web/components/organisms/Footer.tsx
apps/web/components/organisms/HeroSection.tsx
apps/web/components/organisms/TextBlock.tsx
apps/web/components/organisms/CardsGrid.tsx
apps/web/components/organisms/TestimonialsSection.tsx
apps/web/components/organisms/CTABanner.tsx
apps/web/components/organisms/ArticlesList.tsx
apps/web/components/organisms/EventsList.tsx
apps/web/components/organisms/FeaturedList.tsx
apps/web/components/organisms/ProductCarousel.tsx   # 'use client'
apps/web/components/organisms/ArticleDetail.tsx
apps/web/components/organisms/EventDetail.tsx
apps/web/components/organisms/DynamicZone.tsx
```

---

## Task 1: Docker Compose + PostgreSQL

**Files:**
- Create: `docker-compose.yml`
- Modify: `apps/cms/.env`

- [ ] **Step 1: Create `docker-compose.yml` at monorepo root**

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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U strapi -d damasaru"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

- [ ] **Step 2: Update `apps/cms/.env` to use PostgreSQL**

Add these lines to `apps/cms/.env` (keep existing APP_KEYS etc.):
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=damasaru
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
```

- [ ] **Step 3: Install `pg` driver in CMS**

```bash
cd apps/cms && pnpm add pg
```

- [ ] **Step 4: Start Postgres and verify Strapi connects**

```bash
# From monorepo root
docker compose up -d
# Wait for health check, then:
cd apps/cms && pnpm dev
```

Expected: Strapi admin accessible at `http://localhost:1337/admin` with no database errors in console.

- [ ] **Step 5: Stop Strapi (keep Postgres running), commit**

```bash
git add docker-compose.yml apps/cms/.env apps/cms/package.json apps/cms/pnpm-lock.yaml
git commit -m "feat: add docker postgres + switch strapi to pg"
```

---

## Task 2: packages/types Scaffold

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/src/shared.ts`
- Create: `packages/types/src/index.ts`

- [ ] **Step 1: Create `packages/types/package.json`**

```json
{
  "name": "@repo/types",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "5.9.2"
  }
}
```

- [ ] **Step 2: Create `packages/types/tsconfig.json`**

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `packages/types/src/shared.ts`**

These are the base types for all Strapi 5 API responses:

```ts
export interface StrapiMedia {
  id: number
  documentId: string
  url: string
  alternativeText: string | null
  width: number | null
  height: number | null
  formats: Record<string, {
    url: string
    width: number
    height: number
  }> | null
}

export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface StrapiSingleResponse<T> {
  data: T
  meta: Record<string, unknown>
}

export interface StrapiListResponse<T> {
  data: T[]
  meta: { pagination: StrapiPagination }
}

export interface StrapiBase {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string
}

export interface CtaButton {
  id: number
  label: string
  href: string
  variant: 'primary' | 'outline'
}
```

- [ ] **Step 4: Create `packages/types/src/index.ts`** (empty re-export scaffold)

```ts
export * from './shared'
export * from './components/sections'
export * from './api/article'
export * from './api/event'
export * from './api/media-item'
export * from './api/home-page'
export * from './api/about-page'
export * from './api/book-page'
export * from './api/media-page'
```

- [ ] **Step 5: Install package in workspace**

```bash
cd /path/to/damasaru-ro && pnpm install
```

- [ ] **Step 6: Commit**

```bash
git add packages/types/
git commit -m "feat: scaffold packages/types shared base types"
```

---

## Task 3: Shared Types — Dynamic Zone Components

**Files:**
- Create: `packages/types/src/components/sections.ts`

- [ ] **Step 1: Create `packages/types/src/components/sections.ts`**

```ts
import type { StrapiMedia, CtaButton } from '../shared'

export interface SectionHero {
  __component: 'sections.hero'
  id: number
  title: string
  subtitle: string | null
  ctaButtons: CtaButton[]
}

export interface SectionTextBlock {
  __component: 'sections.text-block'
  id: number
  eyebrow: string | null
  heading: string
  body: string | null
}

export interface CardItem {
  id: number
  title: string
  text: string
  iconName: string | null
}

export interface SectionCardsGrid {
  __component: 'sections.cards-grid'
  id: number
  heading: string | null
  items: CardItem[]
}

export interface TestimonialItem {
  id: number
  quote: string
  author: string
  role: string | null
  photo: StrapiMedia | null
}

export interface SectionTestimonials {
  __component: 'sections.testimonials'
  id: number
  items: TestimonialItem[]
}

export interface SectionCtaBanner {
  __component: 'sections.cta-banner'
  id: number
  heading: string
  subtext: string | null
  buttonLabel: string
  buttonHref: string
}

export interface SectionFeaturedList {
  __component: 'sections.featured-list'
  id: number
  heading: string | null
  relation: 'articles' | 'events'
}

export type Section =
  | SectionHero
  | SectionTextBlock
  | SectionCardsGrid
  | SectionTestimonials
  | SectionCtaBanner
  | SectionFeaturedList
```

- [ ] **Step 2: Verify type-check passes**

```bash
cd packages/types && pnpm check-types
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/types/src/components/
git commit -m "feat: add dynamic zone section types"
```

---

## Task 4: Shared Types — Content Types

**Files:**
- Create: `packages/types/src/api/article.ts`
- Create: `packages/types/src/api/event.ts`
- Create: `packages/types/src/api/media-item.ts`
- Create: `packages/types/src/api/home-page.ts`
- Create: `packages/types/src/api/about-page.ts`
- Create: `packages/types/src/api/book-page.ts`
- Create: `packages/types/src/api/media-page.ts`

- [ ] **Step 1: Create `packages/types/src/api/article.ts`**

```ts
import type { StrapiBase, StrapiMedia } from '../shared'

export interface Article extends StrapiBase {
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  date: string | null
  category: string | null
  readTime: string | null
  coverImage: StrapiMedia | null
}
```

- [ ] **Step 2: Create `packages/types/src/api/event.ts`**

```ts
import type { StrapiBase, StrapiMedia } from '../shared'

export type EventStatus = 'viitor' | 'trecut'

export interface Event extends StrapiBase {
  title: string
  slug: string
  description: string | null
  date: string | null
  time: string | null
  location: string | null
  venue: string | null
  price: string | null
  spots: string | null
  status: EventStatus
  coverImage: StrapiMedia | null
}
```

- [ ] **Step 3: Create `packages/types/src/api/media-item.ts`**

```ts
import type { StrapiBase, StrapiMedia } from '../shared'

export type MediaItemType = 'video' | 'press' | 'podcast'

export interface MediaItem extends StrapiBase {
  type: MediaItemType
  title: string
  source: string | null
  url: string | null
  date: string | null
  thumbnail: StrapiMedia | null
}
```

- [ ] **Step 4: Create `packages/types/src/api/home-page.ts`**

```ts
import type { StrapiBase, Section } from '../index'

export interface HomePage extends StrapiBase {
  sections: Section[]
}
```

- [ ] **Step 5: Create `packages/types/src/api/about-page.ts`**

```ts
import type { StrapiBase, Section } from '../index'

export interface AboutPage extends StrapiBase {
  sections: Section[]
}
```

- [ ] **Step 6: Create `packages/types/src/api/book-page.ts`**

```ts
import type { StrapiBase, Section } from '../index'

export interface BookPage extends StrapiBase {
  sections: Section[]
}
```

- [ ] **Step 7: Create `packages/types/src/api/media-page.ts`**

```ts
import type { StrapiBase, Section } from '../index'

export interface MediaPage extends StrapiBase {
  sections: Section[]
}
```

- [ ] **Step 8: Verify type-check**

```bash
cd packages/types && pnpm check-types
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add packages/types/src/api/
git commit -m "feat: add content type interfaces to packages/types"
```

---

## Task 5: Update turbo.json

**Files:**
- Modify: `turbo.json`

- [ ] **Step 1: Update `turbo.json` to add check-types dependency on types package**

Replace `turbo.json` content with:

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**", ".strapi/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 2: Add `@repo/types` as dependency of `apps/web`**

Edit `apps/web/package.json` — add to `dependencies`:
```json
"@repo/types": "workspace:*"
```

- [ ] **Step 3: Install**

```bash
pnpm install
```

- [ ] **Step 4: Verify web can import from types**

In `apps/web/app/page.tsx`, temporarily add:
```ts
import type { Article } from '@repo/types'
```
Then run:
```bash
cd apps/web && pnpm check-types
```
Expected: no errors (or only existing unrelated errors).

Remove the temporary import after verifying.

- [ ] **Step 5: Commit**

```bash
git add turbo.json apps/web/package.json pnpm-lock.yaml
git commit -m "feat: wire @repo/types into apps/web"
```

---

## Task 6: Strapi — i18n Plugin + Config

**Files:**
- Modify: `apps/cms/config/plugins.ts`
- Modify: `apps/cms/package.json` (add `@strapi/plugin-i18n`)

- [ ] **Step 1: Install i18n plugin**

```bash
cd apps/cms && pnpm add @strapi/plugin-i18n
```

- [ ] **Step 2: Update `apps/cms/config/plugins.ts`**

```ts
import type { Core } from '@strapi/strapi'

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'i18n': {
    enabled: true,
    config: {
      defaultLocale: 'ro',
      locales: ['ro', 'en'],
    },
  },
})

export default config
```

- [ ] **Step 3: Start Strapi and verify i18n appears in admin**

```bash
cd apps/cms && pnpm dev
```

Expected: Strapi admin → Settings → Internationalization shows `ro` (default) and `en` locales.

- [ ] **Step 4: Stop Strapi, commit**

```bash
git add apps/cms/config/plugins.ts apps/cms/package.json apps/cms/pnpm-lock.yaml
git commit -m "feat: enable strapi i18n plugin with ro/en locales"
```

---

## Task 7: Strapi — Dynamic Zone Component Schemas

**Files:**
- Create: `apps/cms/src/components/shared/cta-button.json`
- Create: `apps/cms/src/components/sections/hero.json`
- Create: `apps/cms/src/components/sections/text-block.json`
- Create: `apps/cms/src/components/sections/cards-grid.json`
- Create: `apps/cms/src/components/sections/testimonials.json`
- Create: `apps/cms/src/components/sections/cta-banner.json`
- Create: `apps/cms/src/components/sections/featured-list.json`

- [ ] **Step 1: Create `apps/cms/src/components/shared/cta-button.json`**

```json
{
  "collectionName": "components_shared_cta_buttons",
  "info": {
    "displayName": "CTA Button",
    "icon": "cursor"
  },
  "options": {},
  "attributes": {
    "label": { "type": "string", "required": true },
    "href": { "type": "string", "required": true },
    "variant": {
      "type": "enumeration",
      "enum": ["primary", "outline"],
      "default": "primary"
    }
  }
}
```

- [ ] **Step 2: Create `apps/cms/src/components/sections/hero.json`**

```json
{
  "collectionName": "components_sections_heroes",
  "info": {
    "displayName": "Hero",
    "icon": "tv"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string", "required": true },
    "subtitle": { "type": "text" },
    "ctaButtons": {
      "type": "component",
      "repeatable": true,
      "component": "shared.cta-button"
    }
  }
}
```

- [ ] **Step 3: Create `apps/cms/src/components/sections/text-block.json`**

```json
{
  "collectionName": "components_sections_text_blocks",
  "info": {
    "displayName": "Text Block",
    "icon": "layout"
  },
  "options": {},
  "attributes": {
    "eyebrow": { "type": "string" },
    "heading": { "type": "string", "required": true },
    "body": { "type": "richtext" }
  }
}
```

- [ ] **Step 4: Create `apps/cms/src/components/sections/cards-grid.json`**

```json
{
  "collectionName": "components_sections_cards_grids",
  "info": {
    "displayName": "Cards Grid",
    "icon": "apps"
  },
  "options": {},
  "attributes": {
    "heading": { "type": "string" },
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "sections.card-item"
    }
  }
}
```

- [ ] **Step 5: Create `apps/cms/src/components/sections/card-item.json`**

```json
{
  "collectionName": "components_sections_card_items",
  "info": {
    "displayName": "Card Item",
    "icon": "feather"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string", "required": true },
    "text": { "type": "text", "required": true },
    "iconName": { "type": "string" }
  }
}
```

- [ ] **Step 6: Create `apps/cms/src/components/sections/testimonials.json`**

```json
{
  "collectionName": "components_sections_testimonials",
  "info": {
    "displayName": "Testimonials",
    "icon": "quote"
  },
  "options": {},
  "attributes": {
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "sections.testimonial-item"
    }
  }
}
```

- [ ] **Step 7: Create `apps/cms/src/components/sections/testimonial-item.json`**

```json
{
  "collectionName": "components_sections_testimonial_items",
  "info": {
    "displayName": "Testimonial Item",
    "icon": "user"
  },
  "options": {},
  "attributes": {
    "quote": { "type": "text", "required": true },
    "author": { "type": "string", "required": true },
    "role": { "type": "string" },
    "photo": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

- [ ] **Step 8: Create `apps/cms/src/components/sections/cta-banner.json`**

```json
{
  "collectionName": "components_sections_cta_banners",
  "info": {
    "displayName": "CTA Banner",
    "icon": "megaphone"
  },
  "options": {},
  "attributes": {
    "heading": { "type": "string", "required": true },
    "subtext": { "type": "text" },
    "buttonLabel": { "type": "string", "required": true },
    "buttonHref": { "type": "string", "required": true }
  }
}
```

- [ ] **Step 9: Create `apps/cms/src/components/sections/featured-list.json`**

```json
{
  "collectionName": "components_sections_featured_lists",
  "info": {
    "displayName": "Featured List",
    "icon": "bulletList"
  },
  "options": {},
  "attributes": {
    "heading": { "type": "string" },
    "relation": {
      "type": "enumeration",
      "enum": ["articles", "events"],
      "required": true
    }
  }
}
```

- [ ] **Step 10: Start Strapi and verify components appear**

```bash
cd apps/cms && pnpm dev
```

Expected: Strapi admin → Content-Type Builder → Components shows `sections` and `shared` categories with all components listed.

- [ ] **Step 11: Stop Strapi, commit**

```bash
git add apps/cms/src/components/
git commit -m "feat: add strapi dynamic zone component schemas"
```

---

## Task 8: Strapi — Collection Type Schemas

**Files:**
- Create: `apps/cms/src/api/article/content-types/article/schema.json`
- Create: `apps/cms/src/api/event/content-types/event/schema.json`
- Create: `apps/cms/src/api/media-item/content-types/media-item/schema.json`

- [ ] **Step 1: Create `apps/cms/src/api/article/content-types/article/schema.json`**

```json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "title": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "excerpt": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "text"
    },
    "content": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "richtext"
    },
    "date": {
      "type": "date"
    },
    "category": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string"
    },
    "readTime": {
      "type": "string"
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

- [ ] **Step 2: Create `apps/cms/src/api/event/content-types/event/schema.json`**

```json
{
  "kind": "collectionType",
  "collectionName": "events",
  "info": {
    "singularName": "event",
    "pluralName": "events",
    "displayName": "Event"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "title": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "description": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "text"
    },
    "date": { "type": "date" },
    "time": { "type": "string" },
    "location": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string"
    },
    "venue": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string"
    },
    "price": { "type": "string" },
    "spots": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string"
    },
    "status": {
      "type": "enumeration",
      "enum": ["viitor", "trecut"],
      "default": "viitor",
      "required": true
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

- [ ] **Step 3: Create `apps/cms/src/api/media-item/content-types/media-item/schema.json`**

```json
{
  "kind": "collectionType",
  "collectionName": "media_items",
  "info": {
    "singularName": "media-item",
    "pluralName": "media-items",
    "displayName": "Media Item"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "type": {
      "type": "enumeration",
      "enum": ["video", "press", "podcast"],
      "required": true
    },
    "title": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string",
      "required": true
    },
    "source": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string"
    },
    "url": { "type": "string" },
    "date": { "type": "date" },
    "thumbnail": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

- [ ] **Step 4: Start Strapi and verify collection types**

```bash
cd apps/cms && pnpm dev
```

Expected: Strapi admin → Content-Type Builder shows Article, Event, Media Item collection types with correct fields.

- [ ] **Step 5: Stop Strapi, commit**

```bash
git add apps/cms/src/api/
git commit -m "feat: add strapi collection type schemas (article, event, media-item)"
```

---

## Task 9: Strapi — Single Type Schemas

**Files:**
- Create: `apps/cms/src/api/home-page/content-types/home-page/schema.json`
- Create: `apps/cms/src/api/about-page/content-types/about-page/schema.json`
- Create: `apps/cms/src/api/book-page/content-types/book-page/schema.json`
- Create: `apps/cms/src/api/media-page/content-types/media-page/schema.json`

- [ ] **Step 1: Create `apps/cms/src/api/home-page/content-types/home-page/schema.json`**

```json
{
  "kind": "singleType",
  "collectionName": "home_pages",
  "info": {
    "singularName": "home-page",
    "pluralName": "home-pages",
    "displayName": "Home Page"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.text-block",
        "sections.cards-grid",
        "sections.testimonials",
        "sections.cta-banner",
        "sections.featured-list"
      ]
    }
  }
}
```

- [ ] **Step 2: Create `apps/cms/src/api/about-page/content-types/about-page/schema.json`**

```json
{
  "kind": "singleType",
  "collectionName": "about_pages",
  "info": {
    "singularName": "about-page",
    "pluralName": "about-pages",
    "displayName": "About Page"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.text-block",
        "sections.cards-grid",
        "sections.testimonials",
        "sections.cta-banner",
        "sections.featured-list"
      ]
    }
  }
}
```

- [ ] **Step 3: Create `apps/cms/src/api/book-page/content-types/book-page/schema.json`**

```json
{
  "kind": "singleType",
  "collectionName": "book_pages",
  "info": {
    "singularName": "book-page",
    "pluralName": "book-pages",
    "displayName": "Book Page"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.text-block",
        "sections.cards-grid",
        "sections.testimonials",
        "sections.cta-banner",
        "sections.featured-list"
      ]
    }
  }
}
```

- [ ] **Step 4: Create `apps/cms/src/api/media-page/content-types/media-page/schema.json`**

```json
{
  "kind": "singleType",
  "collectionName": "media_pages",
  "info": {
    "singularName": "media-page",
    "pluralName": "media-pages",
    "displayName": "Media Page"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.text-block",
        "sections.cards-grid",
        "sections.testimonials",
        "sections.cta-banner",
        "sections.featured-list"
      ]
    }
  }
}
```

- [ ] **Step 5: Start Strapi and verify single types + API permissions**

```bash
cd apps/cms && pnpm dev
```

In Strapi admin:
1. Content-Type Builder → verify Home Page, About Page, Book Page, Media Page single types exist
2. Settings → Roles → Public → enable `find` permission for all content types and single types
3. Settings → API Tokens → create a read-only token for the web app, copy it

- [ ] **Step 6: Stop Strapi, commit**

```bash
git add apps/cms/src/api/home-page/ apps/cms/src/api/about-page/ apps/cms/src/api/book-page/ apps/cms/src/api/media-page/
git commit -m "feat: add strapi single type page schemas with dynamic zones"
```

---

## Task 10: Next.js — Install Dependencies

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/next.config.ts`

- [ ] **Step 1: Install web app dependencies**

```bash
cd apps/web && pnpm add motion lucide-react negotiator @formatjs/intl-localematcher
pnpm add -D @types/negotiator
```

- [ ] **Step 2: Create `apps/web/next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: process.env.STRAPI_HOSTNAME ?? '',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 3: Add env vars to `apps/web/.env.local`**

Create `apps/web/.env.local`:
```env
STRAPI_URL=http://localhost:1337
STRAPI_HOSTNAME=localhost
STRAPI_API_TOKEN=<paste token from Task 9 Step 5>
REVALIDATE_SECRET=<generate a random string, e.g. openssl rand -hex 32>
```

- [ ] **Step 4: Add `.env.local` to `.gitignore` if not already there**

```bash
grep -q ".env.local" apps/web/.gitignore || echo ".env.local" >> apps/web/.gitignore
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json apps/web/pnpm-lock.yaml apps/web/next.config.ts apps/web/.gitignore
git commit -m "feat: add web app dependencies and next.config.ts"
```

---

## Task 11: Next.js — i18n (proxy.ts + Dictionaries)

**Files:**
- Create: `apps/web/proxy.ts`
- Create: `apps/web/dictionaries/ro.json`
- Create: `apps/web/dictionaries/en.json`
- Create: `apps/web/lib/dictionaries.ts`

> **Note:** Next.js 16 uses `proxy.ts` (not `middleware.ts`) for request interception. The export must be named `proxy` (not `middleware`).

- [ ] **Step 1: Create `apps/web/proxy.ts`**

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

const locales = ['ro', 'en'] as const
export type Locale = (typeof locales)[number]
const defaultLocale: Locale = 'ro'

function getLocale(request: NextRequest): Locale {
  const negotiator = new Negotiator({
    headers: { 'accept-language': request.headers.get('accept-language') ?? '' },
  })
  const languages = negotiator.languages()
  return match(languages, [...locales], defaultLocale) as Locale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
}
```

- [ ] **Step 2: Create `apps/web/dictionaries/ro.json`**

```json
{
  "nav": {
    "home": "Acasă",
    "about": "Despre Costin",
    "book": "Cartea",
    "events": "Evenimente",
    "media": "Media",
    "blog": "Blog",
    "contact": "Contact",
    "cta": "Contactează-mă"
  },
  "footer": {
    "navigation": "Navigare",
    "resources": "Resurse",
    "social": "Social",
    "rights": "Toate drepturile rezervate.",
    "tagline": "Neuroștiință · Psihologie · Educație"
  },
  "blog": {
    "readMore": "Citește mai mult",
    "readTime": "min citire",
    "allCategories": "toate",
    "noArticles": "Nu există articole."
  },
  "events": {
    "upcoming": "viitoare",
    "past": "trecute",
    "all": "toate",
    "register": "Înregistrează-te",
    "noEvents": "Nu există evenimente."
  },
  "contact": {
    "title": "Contact",
    "name": "Nume",
    "email": "Email",
    "message": "Mesaj",
    "send": "Trimite"
  }
}
```

- [ ] **Step 3: Create `apps/web/dictionaries/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "about": "About Costin",
    "book": "The Book",
    "events": "Events",
    "media": "Media",
    "blog": "Blog",
    "contact": "Contact",
    "cta": "Contact me"
  },
  "footer": {
    "navigation": "Navigation",
    "resources": "Resources",
    "social": "Social",
    "rights": "All rights reserved.",
    "tagline": "Neuroscience · Psychology · Education"
  },
  "blog": {
    "readMore": "Read more",
    "readTime": "min read",
    "allCategories": "all",
    "noArticles": "No articles found."
  },
  "events": {
    "upcoming": "upcoming",
    "past": "past",
    "all": "all",
    "register": "Register",
    "noEvents": "No events found."
  },
  "contact": {
    "title": "Contact",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "send": "Send"
  }
}
```

- [ ] **Step 4: Create `apps/web/lib/dictionaries.ts`**

```ts
import 'server-only'
import type { Locale } from '../proxy'

const dictionaries = {
  ro: () => import('../dictionaries/ro.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
```

- [ ] **Step 5: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web/proxy.ts apps/web/dictionaries/ apps/web/lib/dictionaries.ts
git commit -m "feat: add next.js i18n proxy and dictionaries"
```

---

## Task 12: Next.js — Strapi Fetch Helper + Revalidate Route

**Files:**
- Create: `apps/web/lib/strapi.ts`
- Create: `apps/web/app/api/revalidate/route.ts`

- [ ] **Step 1: Create `apps/web/lib/strapi.ts`**

```ts
import type {
  StrapiSingleResponse,
  StrapiListResponse,
  Article,
  Event,
  MediaItem,
  HomePage,
  AboutPage,
  BookPage,
  MediaPage,
} from '@repo/types'

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN ?? ''

async function fetchStrapi<T>(
  path: string,
  { locale, tags }: { locale: string; tags: string[] }
): Promise<T> {
  const url = new URL(`/api/${path}`, STRAPI_URL)
  url.searchParams.set('locale', locale)
  url.searchParams.set('populate', 'deep')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    next: { tags },
  })

  if (!res.ok) {
    throw new Error(`Strapi fetch failed [${res.status}]: ${path}`)
  }

  return res.json() as Promise<T>
}

export async function getHomePage(locale: string): Promise<HomePage> {
  const res = await fetchStrapi<StrapiSingleResponse<HomePage>>('home-page', {
    locale,
    tags: ['home-page'],
  })
  return res.data
}

export async function getAboutPage(locale: string): Promise<AboutPage> {
  const res = await fetchStrapi<StrapiSingleResponse<AboutPage>>('about-page', {
    locale,
    tags: ['about-page'],
  })
  return res.data
}

export async function getBookPage(locale: string): Promise<BookPage> {
  const res = await fetchStrapi<StrapiSingleResponse<BookPage>>('book-page', {
    locale,
    tags: ['book-page'],
  })
  return res.data
}

export async function getMediaPage(locale: string): Promise<MediaPage> {
  const res = await fetchStrapi<StrapiSingleResponse<MediaPage>>('media-page', {
    locale,
    tags: ['media-page'],
  })
  return res.data
}

export async function getArticles(locale: string): Promise<Article[]> {
  const res = await fetchStrapi<StrapiListResponse<Article>>('articles', {
    locale,
    tags: ['articles'],
  })
  return res.data
}

export async function getArticle(slug: string, locale: string): Promise<Article | null> {
  const res = await fetchStrapi<StrapiListResponse<Article>>(
    `articles?filters[slug][$eq]=${slug}`,
    { locale, tags: ['articles', `article:${slug}`] }
  )
  return res.data[0] ?? null
}

export async function getEvents(locale: string): Promise<Event[]> {
  const res = await fetchStrapi<StrapiListResponse<Event>>('events', {
    locale,
    tags: ['events'],
  })
  return res.data
}

export async function getEvent(slug: string, locale: string): Promise<Event | null> {
  const res = await fetchStrapi<StrapiListResponse<Event>>(
    `events?filters[slug][$eq]=${slug}`,
    { locale, tags: ['events', `event:${slug}`] }
  )
  return res.data[0] ?? null
}

export async function getMediaItems(locale: string): Promise<MediaItem[]> {
  const res = await fetchStrapi<StrapiListResponse<MediaItem>>('media-items', {
    locale,
    tags: ['media-items'],
  })
  return res.data
}
```

- [ ] **Step 2: Create `apps/web/app/api/revalidate/route.ts`**

```ts
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { model?: string; entry?: { slug?: string } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { model, entry } = body

  if (!model) {
    return NextResponse.json({ error: 'Missing model' }, { status: 400 })
  }

  // Use 'max' profile for stale-while-revalidate semantics (Next.js 16)
  revalidateTag(model, 'max')
  if (entry?.slug) {
    revalidateTag(`${model}:${entry.slug}`, 'max')
  }

  return NextResponse.json({ revalidated: true, model })
}
```

- [ ] **Step 3: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/lib/strapi.ts apps/web/app/api/
git commit -m "feat: add strapi fetch helper and revalidate route handler"
```

---

## Task 13: Atoms

**Files:**
- Create: `apps/web/components/atoms/Button.tsx`
- Create: `apps/web/components/atoms/Badge.tsx`
- Create: `apps/web/components/atoms/Eyebrow.tsx`
- Create: `apps/web/components/atoms/Avatar.tsx`
- Create: `apps/web/components/atoms/Tag.tsx`

> Port visual styles from `figmaMockup/src/app/`. Color palette: `#B8866F` (accent), `#2D241E` (dark), `#6B5F54` (muted), `#FAF8F5` (background).

- [ ] **Step 1: Create `apps/web/components/atoms/Button.tsx`**

```tsx
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

interface BaseProps {
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md'
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }
type LinkProps = BaseProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>

type Props = ButtonProps | LinkProps

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-sans transition-opacity hover:opacity-90'
  const sizes = { sm: 'px-5 py-2.5 text-sm', md: 'px-8 py-4 text-base' }
  const variants = {
    primary: 'text-white',
    outline: 'border',
  }
  const style =
    variant === 'primary'
      ? { backgroundColor: '#B8866F' }
      : { borderColor: 'rgba(45,36,30,0.2)', color: '#2D241E' }

  const classes = [base, sizes[size], variants[variant], className].join(' ')

  if ('href' in props && props.href) {
    const { href, ...rest } = props as LinkProps
    return <Link href={href} className={classes} style={style} {...rest} />
  }

  const { ...rest } = props as ButtonProps
  return <button className={classes} style={style} {...rest} />
}
```

- [ ] **Step 2: Create `apps/web/components/atoms/Eyebrow.tsx`**

```tsx
interface EyebrowProps {
  label: string
  dark?: boolean
}

export function Eyebrow({ label, dark = false }: EyebrowProps) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="h-px w-12" style={{ backgroundColor: '#B8866F' }} />
      <span
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: dark ? 'rgba(184,134,111,0.9)' : '#B8866F' }}
      >
        {label}
      </span>
    </div>
  )
}
```

- [ ] **Step 3: Create `apps/web/components/atoms/Badge.tsx`**

```tsx
interface BadgeProps {
  label: string
  variant?: 'accent' | 'muted'
}

export function Badge({ label, variant = 'accent' }: BadgeProps) {
  const styles =
    variant === 'accent'
      ? { border: '1px solid rgba(184,134,111,0.3)', color: '#B8866F' }
      : { border: '1px solid rgba(45,36,30,0.15)', color: '#6B5F54' }

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider"
      style={styles}
    >
      {label}
    </span>
  )
}
```

- [ ] **Step 4: Create `apps/web/components/atoms/Avatar.tsx`**

```tsx
import Image from 'next/image'
import type { StrapiMedia } from '@repo/types'

interface AvatarProps {
  photo: StrapiMedia | null
  name: string
  size?: number
}

export function Avatar({ photo, name, size = 48 }: AvatarProps) {
  if (!photo) {
    return (
      <div
        className="rounded-full flex items-center justify-center text-sm font-medium"
        style={{
          width: size,
          height: size,
          backgroundColor: 'rgba(184,134,111,0.15)',
          color: '#B8866F',
        }}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <Image
      src={photo.url}
      alt={photo.alternativeText ?? name}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  )
}
```

- [ ] **Step 5: Create `apps/web/components/atoms/Tag.tsx`**

```tsx
interface TagProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export function Tag({ label, active = false, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm capitalize transition-colors"
      style={
        active
          ? { backgroundColor: '#2D241E', color: '#FAF8F5' }
          : { backgroundColor: 'rgba(45,36,30,0.06)', color: '#6B5F54' }
      }
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 6: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add apps/web/components/atoms/
git commit -m "feat: add atom components (Button, Eyebrow, Badge, Avatar, Tag)"
```

---

## Task 14: Molecules

**Files:**
- Create: `apps/web/components/molecules/NavLink.tsx`
- Create: `apps/web/components/molecules/SectionHeading.tsx`
- Create: `apps/web/components/molecules/ArticleCard.tsx`
- Create: `apps/web/components/molecules/EventCard.tsx`
- Create: `apps/web/components/molecules/TestimonialCard.tsx`
- Create: `apps/web/components/molecules/TakeawayItem.tsx`
- Create: `apps/web/components/molecules/MediaCard.tsx`

- [ ] **Step 1: Create `apps/web/components/molecules/NavLink.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  label: string
  onClick?: () => void
  mobile?: boolean
}

export function NavLink({ href, label, onClick, mobile = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === href : pathname.startsWith(href)

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center justify-between py-3 border-b text-base"
        style={{
          color: isActive ? '#B8866F' : '#2D241E',
          borderColor: 'rgba(45,36,30,0.06)',
        }}
      >
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="text-sm transition-all relative"
      style={{ color: isActive ? '#2D241E' : '#6B5F54' }}
    >
      {label}
      {isActive && (
        <span
          className="absolute -bottom-1 left-0 right-0 h-px"
          style={{ backgroundColor: '#B8866F' }}
        />
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create `apps/web/components/molecules/SectionHeading.tsx`**

```tsx
import { Eyebrow } from '../atoms/Eyebrow'

interface SectionHeadingProps {
  eyebrow?: string | null
  heading: string
  centered?: boolean
  dark?: boolean
}

export function SectionHeading({ eyebrow, heading, centered = false, dark = false }: SectionHeadingProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {eyebrow && <Eyebrow label={eyebrow} dark={dark} />}
      <h2
        className="text-4xl lg:text-5xl font-serif font-light leading-tight"
        style={{ color: dark ? '#FAF8F5' : '#2D241E' }}
      >
        {heading}
      </h2>
    </div>
  )
}
```

- [ ] **Step 3: Create `apps/web/components/molecules/ArticleCard.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@repo/types'
import { Badge } from '../atoms/Badge'

interface ArticleCardProps {
  article: Article
  locale: string
  readMoreLabel: string
}

export function ArticleCard({ article, locale, readMoreLabel }: ArticleCardProps) {
  const href = `/${locale}/blog/${article.slug}`
  const imageUrl = article.coverImage
    ? article.coverImage.url
    : null

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(45,36,30,0.08)] hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.coverImage?.alternativeText ?? article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          {article.category && <Badge label={article.category} />}
          {article.readTime && (
            <span className="text-xs" style={{ color: '#6B5F54' }}>
              {article.readTime}
            </span>
          )}
        </div>
        <h3 className="text-xl font-serif font-light mb-2 leading-snug" style={{ color: '#2D241E' }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm mb-4 flex-1 leading-relaxed" style={{ color: '#6B5F54' }}>
            {article.excerpt}
          </p>
        )}
        <Link
          href={href}
          className="text-sm font-medium hover:opacity-70 transition-opacity mt-auto"
          style={{ color: '#B8866F' }}
        >
          {readMoreLabel} →
        </Link>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Create `apps/web/components/molecules/EventCard.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import type { Event } from '@repo/types'
import { Button } from '../atoms/Button'

interface EventCardProps {
  event: Event
  locale: string
  registerLabel: string
}

export function EventCard({ event, locale, registerLabel }: EventCardProps) {
  const href = `/${locale}/evenimente/${event.slug}`
  const imageUrl = event.coverImage?.url ?? null

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(45,36,30,0.08)] hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={event.coverImage?.alternativeText ?? event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-serif font-light mb-3 leading-snug" style={{ color: '#2D241E' }}>
          {event.title}
        </h3>
        <div className="space-y-2 mb-4">
          {event.date && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5F54' }}>
              <Calendar size={14} style={{ color: '#B8866F' }} />
              {event.date}{event.time ? ` · ${event.time}` : ''}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5F54' }}>
              <MapPin size={14} style={{ color: '#B8866F' }} />
              {event.location}
            </div>
          )}
        </div>
        {event.price && (
          <p className="text-lg font-medium mb-4" style={{ color: '#2D241E' }}>
            {event.price}
          </p>
        )}
        <Button href={href} variant="primary" size="sm" className="mt-auto">
          {registerLabel}
        </Button>
      </div>
    </article>
  )
}
```

- [ ] **Step 5: Create `apps/web/components/molecules/TestimonialCard.tsx`**

```tsx
import type { TestimonialItem } from '@repo/types'
import { Avatar } from '../atoms/Avatar'

interface TestimonialCardProps {
  item: TestimonialItem
}

export function TestimonialCard({ item }: TestimonialCardProps) {
  return (
    <div
      className="p-8 rounded-2xl border"
      style={{ borderColor: 'rgba(45,36,30,0.08)', backgroundColor: 'white' }}
    >
      <p
        className="text-lg font-serif font-light leading-relaxed mb-6"
        style={{ color: '#2D241E' }}
      >
        "{item.quote}"
      </p>
      <div className="flex items-center gap-3">
        <Avatar photo={item.photo} name={item.author} size={40} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#2D241E' }}>
            {item.author}
          </p>
          {item.role && (
            <p className="text-xs" style={{ color: '#6B5F54' }}>
              {item.role}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `apps/web/components/molecules/TakeawayItem.tsx`**

```tsx
interface TakeawayItemProps {
  iconName: string | null
  title: string
  text: string
}

export function TakeawayItem({ title, text }: TakeawayItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-medium text-base" style={{ color: '#2D241E' }}>
        {title}
      </h4>
      <p className="text-sm leading-relaxed" style={{ color: '#6B5F54' }}>
        {text}
      </p>
    </div>
  )
}
```

- [ ] **Step 7: Create `apps/web/components/molecules/MediaCard.tsx`**

```tsx
import Image from 'next/image'
import type { MediaItem } from '@repo/types'
import { Badge } from '../atoms/Badge'

interface MediaCardProps {
  item: MediaItem
}

export function MediaCard({ item }: MediaCardProps) {
  const content = (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(45,36,30,0.08)] hover:shadow-md transition-shadow">
      {item.thumbnail && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={item.thumbnail.url}
            alt={item.thumbnail.alternativeText ?? item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <Badge label={item.type} variant="muted" />
        <h3 className="mt-3 text-base font-medium leading-snug" style={{ color: '#2D241E' }}>
          {item.title}
        </h3>
        {item.source && (
          <p className="mt-1 text-xs" style={{ color: '#6B5F54' }}>
            {item.source}
          </p>
        )}
      </div>
    </div>
  )

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return content
}
```

- [ ] **Step 8: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add apps/web/components/molecules/
git commit -m "feat: add molecule components"
```

---

## Task 15: Organisms — Navigation + Footer

**Files:**
- Create: `apps/web/components/organisms/Navigation.tsx`
- Create: `apps/web/components/organisms/Footer.tsx`

> Port visual structure from `figmaMockup/src/app/components/Layout.tsx`. Navigation is a Client Component because of mobile menu `useState`. Footer is a Server Component.

- [ ] **Step 1: Create `apps/web/components/organisms/Navigation.tsx`**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NavLink } from '../molecules/NavLink'
import type { Dictionary } from '../../lib/dictionaries'

interface NavigationProps {
  locale: string
  dict: Dictionary['nav']
}

export function Navigation({ locale, dict }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: dict.home, href: `/${locale}` },
    { label: dict.about, href: `/${locale}/despre` },
    { label: dict.book, href: `/${locale}/carte` },
    { label: dict.events, href: `/${locale}/evenimente` },
    { label: dict.media, href: `/${locale}/media` },
    { label: dict.blog, href: `/${locale}/blog` },
    { label: dict.contact, href: `/${locale}/contact` },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(250,248,245,0.92)',
        borderBottom: '1px solid rgba(45,36,30,0.08)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            href={`/${locale}`}
            className="text-xl tracking-tight font-serif"
            style={{ color: '#2D241E' }}
          >
            Costin Damașaru
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#B8866F' }}
          >
            {dict.cta}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: '#6B5F54' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid rgba(45,36,30,0.08)',
            backgroundColor: '#FAF8F5',
          }}
        >
          <div className="px-6 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                mobile
                onClick={() => setMobileOpen(false)}
              />
            ))}
            <div className="pt-4">
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileOpen(false)}
                className="block text-center px-6 py-3 text-white rounded-full text-sm"
                style={{ backgroundColor: '#B8866F' }}
              >
                {dict.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Create `apps/web/components/organisms/Footer.tsx`**

```tsx
import Link from 'next/link'
import type { Dictionary } from '../../lib/dictionaries'

interface FooterProps {
  locale: string
  dict: Dictionary['footer'] & { nav: Dictionary['nav'] }
}

export function Footer({ locale, dict }: FooterProps) {
  const navLinks = [
    { label: dict.nav.about, href: `/${locale}/despre` },
    { label: dict.nav.events, href: `/${locale}/evenimente` },
    { label: dict.nav.media, href: `/${locale}/media` },
    { label: dict.nav.blog, href: `/${locale}/blog` },
  ]

  const resourceLinks = [
    { label: dict.nav.book, href: `/${locale}/carte` },
    { label: dict.nav.contact, href: `/${locale}/contact` },
  ]

  return (
    <footer style={{ backgroundColor: '#2D241E' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <div className="text-2xl tracking-tight mb-4 font-serif" style={{ color: '#FAF8F5' }}>
              Costin Damașaru
            </div>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(250,248,245,0.5)' }}>
              Neurocercetător, autor și facilitator — dedicat să ajut oamenii să înțeleagă puterea creierului lor.
            </p>
            <div
              className="inline-block px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{ border: '1px solid rgba(184,134,111,0.3)', color: '#B8866F' }}
            >
              Veruvis · Veruvis Kids · Neuro Performance
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2" />

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-wider mb-6" style={{ color: '#B8866F' }}>
              {dict.navigation}
            </h3>
            <ul className="space-y-4">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-[#B8866F]"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-wider mb-6" style={{ color: '#B8866F' }}>
              {dict.resources}
            </h3>
            <ul className="space-y-4">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-[#B8866F]"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-wider mb-6" style={{ color: '#B8866F' }}>
              {dict.social}
            </h3>
            <ul className="space-y-4">
              {['LinkedIn', 'Instagram', 'YouTube', 'Twitter'].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-sm transition-colors hover:text-[#B8866F]"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(250,248,245,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(250,248,245,0.3)' }}>
            © {new Date().getFullYear()} Costin Damașaru. {dict.rights}
          </p>
          <p className="text-xs" style={{ color: 'rgba(250,248,245,0.3)' }}>
            {dict.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/organisms/Navigation.tsx apps/web/components/organisms/Footer.tsx
git commit -m "feat: add Navigation and Footer organisms"
```

---

## Task 16: Organisms — Dynamic Zone Sections

**Files:**
- Create: `apps/web/components/organisms/HeroSection.tsx`
- Create: `apps/web/components/organisms/TextBlock.tsx`
- Create: `apps/web/components/organisms/CardsGrid.tsx`
- Create: `apps/web/components/organisms/TestimonialsSection.tsx`
- Create: `apps/web/components/organisms/CTABanner.tsx`
- Create: `apps/web/components/organisms/FeaturedList.tsx`
- Create: `apps/web/components/organisms/DynamicZone.tsx`

> Port from `figmaMockup/src/app/pages/Home.tsx` and `figmaMockup/src/app/pages/Book.tsx` for visual reference.

- [ ] **Step 1: Create `apps/web/components/organisms/HeroSection.tsx`**

```tsx
import { Button } from '../atoms/Button'
import { Eyebrow } from '../atoms/Eyebrow'
import type { SectionHero } from '@repo/types'

interface HeroSectionProps {
  section: SectionHero
  eyebrow?: string
}

export function HeroSection({ section, eyebrow }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow label={eyebrow} />}
          <h1
            className="text-6xl lg:text-7xl mb-6 leading-[1.05] font-serif font-light"
            style={{ color: '#2D241E' }}
          >
            {section.title}
          </h1>
          {section.subtitle && (
            <p
              className="text-lg lg:text-xl mb-10 leading-relaxed max-w-xl"
              style={{ color: '#6B5F54' }}
            >
              {section.subtitle}
            </p>
          )}
          {section.ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {section.ctaButtons.map((btn) => (
                <Button key={btn.id} href={btn.href} variant={btn.variant}>
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `apps/web/components/organisms/TextBlock.tsx`**

```tsx
import { SectionHeading } from '../molecules/SectionHeading'
import type { SectionTextBlock } from '@repo/types'

interface TextBlockProps {
  section: SectionTextBlock
  dark?: boolean
}

export function TextBlock({ section, dark = false }: TextBlockProps) {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: dark ? '#2D241E' : '#FAF8F5' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            dark={dark}
          />
          {section.body && (
            <div
              className="mt-6 prose prose-lg max-w-none"
              style={{ color: dark ? 'rgba(250,248,245,0.7)' : '#6B5F54' }}
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `apps/web/components/organisms/CardsGrid.tsx`**

```tsx
import { SectionHeading } from '../molecules/SectionHeading'
import { TakeawayItem } from '../molecules/TakeawayItem'
import type { SectionCardsGrid } from '@repo/types'

interface CardsGridProps {
  section: SectionCardsGrid
  dark?: boolean
}

export function CardsGrid({ section, dark = false }: CardsGridProps) {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: dark ? '#2D241E' : '#FAF8F5' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {section.heading && (
          <div className="mb-16">
            <SectionHeading heading={section.heading} dark={dark} />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border"
              style={{
                borderColor: dark ? 'rgba(184,134,111,0.2)' : 'rgba(45,36,30,0.08)',
                backgroundColor: dark ? 'rgba(184,134,111,0.05)' : 'white',
              }}
            >
              <TakeawayItem
                iconName={item.iconName}
                title={item.title}
                text={item.text}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `apps/web/components/organisms/TestimonialsSection.tsx`**

```tsx
import { SectionHeading } from '../molecules/SectionHeading'
import { TestimonialCard } from '../molecules/TestimonialCard'
import type { SectionTestimonials } from '@repo/types'

interface TestimonialsSectionProps {
  section: SectionTestimonials
  eyebrow?: string
  heading?: string
}

export function TestimonialsSection({ section, eyebrow, heading }: TestimonialsSectionProps) {
  return (
    <section className="py-24" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {heading && (
          <div className="mb-16 text-center">
            <SectionHeading eyebrow={eyebrow} heading={heading} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {section.items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `apps/web/components/organisms/CTABanner.tsx`**

```tsx
import { Button } from '../atoms/Button'
import type { SectionCtaBanner } from '@repo/types'

interface CTABannerProps {
  section: SectionCtaBanner
}

export function CTABanner({ section }: CTABannerProps) {
  return (
    <section className="py-24" style={{ backgroundColor: '#2D241E' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <h2
          className="text-4xl lg:text-5xl font-serif font-light mb-6"
          style={{ color: '#FAF8F5' }}
        >
          {section.heading}
        </h2>
        {section.subtext && (
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(250,248,245,0.6)' }}>
            {section.subtext}
          </p>
        )}
        <Button href={section.buttonHref} variant="primary">
          {section.buttonLabel}
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `apps/web/components/organisms/FeaturedList.tsx`**

```tsx
import type { SectionFeaturedList, Article, Event } from '@repo/types'
import { getArticles, getEvents } from '../../lib/strapi'
import { ArticleCard } from '../molecules/ArticleCard'
import { EventCard } from '../molecules/EventCard'
import { SectionHeading } from '../molecules/SectionHeading'

interface FeaturedListProps {
  section: SectionFeaturedList
  locale: string
  readMoreLabel: string
  registerLabel: string
}

export async function FeaturedList({ section, locale, readMoreLabel, registerLabel }: FeaturedListProps) {
  let articles: Article[] = []
  let events: Event[] = []

  if (section.relation === 'articles') {
    const all = await getArticles(locale)
    articles = all.slice(0, 3)
  } else {
    const all = await getEvents(locale)
    events = all.slice(0, 3)
  }

  return (
    <section className="py-24" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {section.heading && (
          <div className="mb-12">
            <SectionHeading heading={section.heading} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} readMoreLabel={readMoreLabel} />
          ))}
          {events.map((e) => (
            <EventCard key={e.id} event={e} locale={locale} registerLabel={registerLabel} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Create `apps/web/components/organisms/DynamicZone.tsx`**

```tsx
import type { Section } from '@repo/types'
import { HeroSection } from './HeroSection'
import { TextBlock } from './TextBlock'
import { CardsGrid } from './CardsGrid'
import { TestimonialsSection } from './TestimonialsSection'
import { CTABanner } from './CTABanner'
import { FeaturedList } from './FeaturedList'

interface DynamicZoneProps {
  sections: Section[]
  locale: string
  readMoreLabel: string
  registerLabel: string
}

export function DynamicZone({ sections, locale, readMoreLabel, registerLabel }: DynamicZoneProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section.__component) {
          case 'sections.hero':
            return <HeroSection key={section.id} section={section} />
          case 'sections.text-block':
            return <TextBlock key={section.id} section={section} />
          case 'sections.cards-grid':
            return <CardsGrid key={section.id} section={section} />
          case 'sections.testimonials':
            return <TestimonialsSection key={section.id} section={section} />
          case 'sections.cta-banner':
            return <CTABanner key={section.id} section={section} />
          case 'sections.featured-list':
            return (
              <FeaturedList
                key={section.id}
                section={section}
                locale={locale}
                readMoreLabel={readMoreLabel}
                registerLabel={registerLabel}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
```

- [ ] **Step 8: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add apps/web/components/organisms/HeroSection.tsx apps/web/components/organisms/TextBlock.tsx apps/web/components/organisms/CardsGrid.tsx apps/web/components/organisms/TestimonialsSection.tsx apps/web/components/organisms/CTABanner.tsx apps/web/components/organisms/FeaturedList.tsx apps/web/components/organisms/DynamicZone.tsx
git commit -m "feat: add dynamic zone section organisms and DynamicZone renderer"
```

---

## Task 17: Organisms — Listing + Detail Views

**Files:**
- Create: `apps/web/components/organisms/ArticlesList.tsx`
- Create: `apps/web/components/organisms/EventsList.tsx`
- Create: `apps/web/components/organisms/ArticleDetail.tsx`
- Create: `apps/web/components/organisms/EventDetail.tsx`
- Create: `apps/web/components/organisms/ProductCarousel.tsx`

- [ ] **Step 1: Create `apps/web/components/organisms/ArticlesList.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Article } from '@repo/types'
import { ArticleCard } from '../molecules/ArticleCard'
import { Tag } from '../atoms/Tag'

interface ArticlesListProps {
  articles: Article[]
  locale: string
  readMoreLabel: string
  allLabel: string
  noArticlesLabel: string
}

export function ArticlesList({
  articles,
  locale,
  readMoreLabel,
  allLabel,
  noArticlesLabel,
}: ArticlesListProps) {
  const categories = [
    allLabel,
    ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean))) as string[],
  ]
  const [activeCategory, setActiveCategory] = useState(allLabel)

  const filtered =
    activeCategory === allLabel
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <Tag
            key={cat}
            label={cat}
            active={cat === activeCategory}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: '#6B5F54' }}>{noArticlesLabel}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale}
              readMoreLabel={readMoreLabel}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `apps/web/components/organisms/EventsList.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Event } from '@repo/types'
import { EventCard } from '../molecules/EventCard'
import { Tag } from '../atoms/Tag'

interface EventsListProps {
  events: Event[]
  locale: string
  registerLabel: string
  allLabel: string
  upcomingLabel: string
  pastLabel: string
  noEventsLabel: string
}

export function EventsList({
  events,
  locale,
  registerLabel,
  allLabel,
  upcomingLabel,
  pastLabel,
  noEventsLabel,
}: EventsListProps) {
  const [filter, setFilter] = useState(upcomingLabel)

  const filters = [upcomingLabel, pastLabel, allLabel]

  const filtered =
    filter === allLabel
      ? events
      : filter === upcomingLabel
        ? events.filter((e) => e.status === 'viitor')
        : events.filter((e) => e.status === 'trecut')

  return (
    <div>
      <div className="flex gap-3 mb-10">
        {filters.map((f) => (
          <Tag key={f} label={f} active={f === filter} onClick={() => setFilter(f)} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: '#6B5F54' }}>{noEventsLabel}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} registerLabel={registerLabel} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `apps/web/components/organisms/ArticleDetail.tsx`**

```tsx
import type { Article } from '@repo/types'
import Image from 'next/image'
import { Badge } from '../atoms/Badge'
import { Eyebrow } from '../atoms/Eyebrow'

interface ArticleDetailProps {
  article: Article
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-24">
      <div className="mb-8">
        {article.category && <Eyebrow label={article.category} />}
        <h1
          className="text-5xl font-serif font-light leading-tight mb-4"
          style={{ color: '#2D241E' }}
        >
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm" style={{ color: '#6B5F54' }}>
          {article.date && <span>{article.date}</span>}
          {article.readTime && <span>· {article.readTime}</span>}
        </div>
      </div>

      {article.coverImage && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12">
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alternativeText ?? article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {article.content && (
        <div
          className="prose prose-lg max-w-none"
          style={{ color: '#2D241E' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}
    </article>
  )
}
```

- [ ] **Step 4: Create `apps/web/components/organisms/EventDetail.tsx`**

```tsx
import type { Event } from '@repo/types'
import Image from 'next/image'
import { Calendar, MapPin, Users, Ticket } from 'lucide-react'
import { Eyebrow } from '../atoms/Eyebrow'
import { Button } from '../atoms/Button'

interface EventDetailProps {
  event: Event
  registerLabel: string
}

export function EventDetail({ event, registerLabel }: EventDetailProps) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Eyebrow label={event.status === 'viitor' ? 'Eveniment viitor' : 'Eveniment trecut'} />
        <h1
          className="text-5xl font-serif font-light leading-tight mb-6"
          style={{ color: '#2D241E' }}
        >
          {event.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {event.date && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <Calendar size={18} style={{ color: '#B8866F' }} />
              <span>{event.date}{event.time ? ` · ${event.time}` : ''}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <MapPin size={18} style={{ color: '#B8866F' }} />
              <span>{event.venue ? `${event.venue}, ` : ''}{event.location}</span>
            </div>
          )}
          {event.price && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <Ticket size={18} style={{ color: '#B8866F' }} />
              <span>{event.price}</span>
            </div>
          )}
          {event.spots && (
            <div className="flex items-center gap-3" style={{ color: '#6B5F54' }}>
              <Users size={18} style={{ color: '#B8866F' }} />
              <span>{event.spots}</span>
            </div>
          )}
        </div>

        {event.status === 'viitor' && (
          <Button href="#register" variant="primary">
            {registerLabel}
          </Button>
        )}
      </div>

      {event.coverImage && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-12">
          <Image
            src={event.coverImage.url}
            alt={event.coverImage.alternativeText ?? event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {event.description && (
        <p className="text-lg leading-relaxed" style={{ color: '#6B5F54' }}>
          {event.description}
        </p>
      )}
    </article>
  )
}
```

- [ ] **Step 5: Create `apps/web/components/organisms/ProductCarousel.tsx`**

> Port from `figmaMockup/src/app/components/ProductCarousel.tsx`. This is a Client Component due to scroll state.

```tsx
'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  id: number | string
  label: string
  description?: string
}

interface ProductCarouselProps {
  items: CarouselItem[]
  heading?: string
}

export function ProductCarousel({ items, heading }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {heading && (
        <h3 className="text-2xl font-serif font-light mb-8" style={{ color: '#2D241E' }}>
          {heading}
        </h3>
      )}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none w-72 snap-start p-6 rounded-2xl border"
              style={{
                borderColor: 'rgba(45,36,30,0.08)',
                backgroundColor: 'white',
              }}
            >
              <p className="font-medium mb-2" style={{ color: '#2D241E' }}>
                {item.label}
              </p>
              {item.description && (
                <p className="text-sm" style={{ color: '#6B5F54' }}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          style={{ borderColor: 'rgba(45,36,30,0.12)' }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} style={{ color: '#2D241E' }} />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          style={{ borderColor: 'rgba(45,36,30,0.12)' }}
          aria-label="Scroll right"
        >
          <ChevronRight size={18} style={{ color: '#2D241E' }} />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add apps/web/components/organisms/
git commit -m "feat: add listing, detail, and carousel organisms"
```

---

## Task 18: Next.js — App Directory Restructure + Layouts

**Files:**
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/app/page.tsx` (delete content, keep as redirect)
- Create: `apps/web/app/[locale]/layout.tsx`

> In Next.js 16: `params` is a Promise — always `await params`. Use `LayoutProps<'/[locale]'>` for type safety.

- [ ] **Step 1: Update `apps/web/app/layout.tsx`** (minimal root — locale redirect is handled by proxy.ts)

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Delete `apps/web/app/page.tsx`** and replace with a redirect to default locale

```tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/ro')
}
```

- [ ] **Step 3: Create `apps/web/app/[locale]/layout.tsx`**

```tsx
import type { LayoutProps } from 'next/types'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navigation } from '../../components/organisms/Navigation'
import { Footer } from '../../components/organisms/Footer'
import { getDictionary } from '../../lib/dictionaries'
import type { Locale } from '../../proxy'
import '../globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const locales: Locale[] = ['ro', 'en']

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  const dict = await getDictionary(locale as Locale)

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: '#FAF8F5' }}>
        <Navigation locale={locale} dict={dict.nav} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer
          locale={locale}
          dict={{ ...dict.footer, nav: dict.nav }}
        />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/
git commit -m "feat: restructure app directory for i18n [locale] routing"
```

---

## Task 19: Pages — Home + About + Book

**Files:**
- Create: `apps/web/app/[locale]/page.tsx`
- Create: `apps/web/app/[locale]/despre/page.tsx`
- Create: `apps/web/app/[locale]/carte/page.tsx`

- [ ] **Step 1: Create `apps/web/app/[locale]/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { notFound } from 'next/navigation'
import { getHomePage } from '../../../lib/strapi'
import { getDictionary } from '../../../lib/dictionaries'
import { DynamicZone } from '../../../components/organisms/DynamicZone'
import type { Locale } from '../../../proxy'

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  const [page, dict] = await Promise.all([
    getHomePage(locale).catch(() => null),
    getDictionary(locale as Locale),
  ])

  if (!page) notFound()

  return (
    <DynamicZone
      sections={page.sections}
      locale={locale}
      readMoreLabel={dict.blog.readMore}
      registerLabel={dict.events.register}
    />
  )
}
```

- [ ] **Step 2: Create `apps/web/app/[locale]/despre/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { notFound } from 'next/navigation'
import { getAboutPage } from '../../../../lib/strapi'
import { getDictionary } from '../../../../lib/dictionaries'
import { DynamicZone } from '../../../../components/organisms/DynamicZone'
import type { Locale } from '../../../../proxy'

export default async function AboutPage({ params }: PageProps<'/[locale]/despre'>) {
  const { locale } = await params
  const [page, dict] = await Promise.all([
    getAboutPage(locale).catch(() => null),
    getDictionary(locale as Locale),
  ])

  if (!page) notFound()

  return (
    <DynamicZone
      sections={page.sections}
      locale={locale}
      readMoreLabel={dict.blog.readMore}
      registerLabel={dict.events.register}
    />
  )
}
```

- [ ] **Step 3: Create `apps/web/app/[locale]/carte/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { notFound } from 'next/navigation'
import { getBookPage } from '../../../../lib/strapi'
import { getDictionary } from '../../../../lib/dictionaries'
import { DynamicZone } from '../../../../components/organisms/DynamicZone'
import type { Locale } from '../../../../proxy'

export default async function BookPage({ params }: PageProps<'/[locale]/carte'>) {
  const { locale } = await params
  const [page, dict] = await Promise.all([
    getBookPage(locale).catch(() => null),
    getDictionary(locale as Locale),
  ])

  if (!page) notFound()

  return (
    <DynamicZone
      sections={page.sections}
      locale={locale}
      readMoreLabel={dict.blog.readMore}
      registerLabel={dict.events.register}
    />
  )
}
```

- [ ] **Step 4: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/[locale]/page.tsx apps/web/app/[locale]/despre/ apps/web/app/[locale]/carte/
git commit -m "feat: add home, about, and book pages"
```

---

## Task 20: Pages — Events + Blog

**Files:**
- Create: `apps/web/app/[locale]/evenimente/page.tsx`
- Create: `apps/web/app/[locale]/evenimente/[slug]/page.tsx`
- Create: `apps/web/app/[locale]/blog/page.tsx`
- Create: `apps/web/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Create `apps/web/app/[locale]/evenimente/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { getEvents } from '../../../../lib/strapi'
import { getDictionary } from '../../../../lib/dictionaries'
import { EventsList } from '../../../../components/organisms/EventsList'
import { Eyebrow } from '../../../../components/atoms/Eyebrow'
import type { Locale } from '../../../../proxy'

export default async function EventsPage({ params }: PageProps<'/[locale]/evenimente'>) {
  const { locale } = await params
  const [events, dict] = await Promise.all([
    getEvents(locale),
    getDictionary(locale as Locale),
  ])

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-12">
          <Eyebrow label={dict.nav.events} />
          <h1 className="text-5xl font-serif font-light" style={{ color: '#2D241E' }}>
            {dict.nav.events}
          </h1>
        </div>
        <EventsList
          events={events}
          locale={locale}
          registerLabel={dict.events.register}
          allLabel={dict.events.all}
          upcomingLabel={dict.events.upcoming}
          pastLabel={dict.events.past}
          noEventsLabel={dict.events.noEvents}
        />
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Create `apps/web/app/[locale]/evenimente/[slug]/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { notFound } from 'next/navigation'
import { getEvents, getEvent } from '../../../../../lib/strapi'
import { getDictionary } from '../../../../../lib/dictionaries'
import { EventDetail } from '../../../../../components/organisms/EventDetail'
import type { Locale } from '../../../../../proxy'

const locales: Locale[] = ['ro', 'en']

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const events = await getEvents(locale)
      return events.map((e) => ({ locale, slug: e.slug }))
    })
  )
  return params.flat()
}

export const dynamicParams = true

export default async function EventDetailPage({ params }: PageProps<'/[locale]/evenimente/[slug]'>) {
  const { locale, slug } = await params
  const [event, dict] = await Promise.all([
    getEvent(slug, locale),
    getDictionary(locale as Locale),
  ])

  if (!event) notFound()

  return <EventDetail event={event} registerLabel={dict.events.register} />
}
```

- [ ] **Step 3: Create `apps/web/app/[locale]/blog/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { getArticles } from '../../../../lib/strapi'
import { getDictionary } from '../../../../lib/dictionaries'
import { ArticlesList } from '../../../../components/organisms/ArticlesList'
import { Eyebrow } from '../../../../components/atoms/Eyebrow'
import type { Locale } from '../../../../proxy'

export default async function BlogPage({ params }: PageProps<'/[locale]/blog'>) {
  const { locale } = await params
  const [articles, dict] = await Promise.all([
    getArticles(locale),
    getDictionary(locale as Locale),
  ])

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-12">
          <Eyebrow label="Blog" />
          <h1 className="text-5xl font-serif font-light" style={{ color: '#2D241E' }}>
            Blog
          </h1>
        </div>
        <ArticlesList
          articles={articles}
          locale={locale}
          readMoreLabel={dict.blog.readMore}
          allLabel={dict.blog.allCategories}
          noArticlesLabel={dict.blog.noArticles}
        />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Create `apps/web/app/[locale]/blog/[slug]/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { notFound } from 'next/navigation'
import { getArticles, getArticle } from '../../../../../lib/strapi'
import { ArticleDetail } from '../../../../../components/organisms/ArticleDetail'
import type { Locale } from '../../../../../proxy'

const locales: Locale[] = ['ro', 'en']

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const articles = await getArticles(locale)
      return articles.map((a) => ({ locale, slug: a.slug }))
    })
  )
  return params.flat()
}

export const dynamicParams = true

export default async function ArticleDetailPage({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params
  const article = await getArticle(slug, locale)

  if (!article) notFound()

  return <ArticleDetail article={article} />
}
```

- [ ] **Step 5: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/[locale]/evenimente/ apps/web/app/[locale]/blog/
git commit -m "feat: add events and blog pages with generateStaticParams"
```

---

## Task 21: Pages — Media + Contact + Error Boundaries

**Files:**
- Create: `apps/web/app/[locale]/media/page.tsx`
- Create: `apps/web/app/[locale]/contact/page.tsx`
- Create: `apps/web/app/[locale]/error.tsx`
- Create: `apps/web/app/[locale]/not-found.tsx`

- [ ] **Step 1: Create `apps/web/app/[locale]/media/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { getMediaItems } from '../../../../lib/strapi'
import { getDictionary } from '../../../../lib/dictionaries'
import { MediaCard } from '../../../../components/molecules/MediaCard'
import { Eyebrow } from '../../../../components/atoms/Eyebrow'
import type { Locale } from '../../../../proxy'

export default async function MediaPage({ params }: PageProps<'/[locale]/media'>) {
  const { locale } = await params
  const [items, dict] = await Promise.all([
    getMediaItems(locale),
    getDictionary(locale as Locale),
  ])

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-12">
          <Eyebrow label={dict.nav.media} />
          <h1 className="text-5xl font-serif font-light" style={{ color: '#2D241E' }}>
            {dict.nav.media}
          </h1>
        </div>
        {items.length === 0 ? (
          <p style={{ color: '#6B5F54' }}>—</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Create `apps/web/app/[locale]/contact/page.tsx`**

```tsx
import type { PageProps } from 'next/types'
import { getDictionary } from '../../../../lib/dictionaries'
import { Eyebrow } from '../../../../components/atoms/Eyebrow'
import { Button } from '../../../../components/atoms/Button'
import type { Locale } from '../../../../proxy'

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-2xl mx-auto px-6 py-24">
        <Eyebrow label={dict.contact.title} />
        <h1 className="text-5xl font-serif font-light mb-12" style={{ color: '#2D241E' }}>
          {dict.contact.title}
        </h1>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm" style={{ color: '#6B5F54' }}>
              {dict.contact.name}
            </label>
            <input
              type="text"
              name="name"
              className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#B8866F] transition-colors"
              style={{ borderColor: 'rgba(45,36,30,0.2)', color: '#2D241E' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm" style={{ color: '#6B5F54' }}>
              {dict.contact.email}
            </label>
            <input
              type="email"
              name="email"
              className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#B8866F] transition-colors"
              style={{ borderColor: 'rgba(45,36,30,0.2)', color: '#2D241E' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm" style={{ color: '#6B5F54' }}>
              {dict.contact.message}
            </label>
            <textarea
              name="message"
              rows={6}
              className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#B8866F] transition-colors resize-none"
              style={{ borderColor: 'rgba(45,36,30,0.2)', color: '#2D241E' }}
            />
          </div>
          <Button type="submit" variant="primary">
            {dict.contact.send}
          </Button>
        </form>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Create `apps/web/app/[locale]/error.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import { Button } from '../../../components/atoms/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="text-center">
        <h2 className="text-2xl font-serif font-light mb-4" style={{ color: '#2D241E' }}>
          Ceva nu a funcționat corect.
        </h2>
        <Button onClick={reset} variant="outline">
          Încearcă din nou
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `apps/web/app/[locale]/not-found.tsx`**

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider mb-4" style={{ color: '#B8866F' }}>
          404
        </p>
        <h2 className="text-4xl font-serif font-light mb-6" style={{ color: '#2D241E' }}>
          Pagina nu a fost găsită.
        </h2>
        <Link
          href="/ro"
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ color: '#B8866F' }}
        >
          ← Înapoi acasă
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify type-check**

```bash
cd apps/web && pnpm check-types
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/[locale]/media/ apps/web/app/[locale]/contact/ apps/web/app/[locale]/error.tsx apps/web/app/[locale]/not-found.tsx
git commit -m "feat: add media, contact pages and error/not-found boundaries"
```

---

## Task 22: Strapi — Configure Webhook + API Permissions

> This task is done in the Strapi admin UI (Railway prod or local dev).

- [ ] **Step 1: Set API permissions (local, for development)**

Start Strapi locally: `cd apps/cms && pnpm dev`

In Strapi admin → Settings → Roles → **Public**:
- Enable `find` and `findOne` for: `article`, `event`, `media-item`
- Enable `find` for: `home-page`, `about-page`, `book-page`, `media-page`
- Save

- [ ] **Step 2: Create API token**

Settings → API Tokens → Create new token:
- Name: `web-readonly`
- Type: `Read-only`
- Copy the token and set as `STRAPI_API_TOKEN` in `apps/web/.env.local`

- [ ] **Step 3: Configure webhook**

Settings → Webhooks → Add new webhook:
- Name: `ISR Revalidate`
- URL: `http://localhost:3000/api/revalidate` (dev) or `https://your-domain.vercel.app/api/revalidate` (prod)
- Headers: `x-revalidate-secret: <value from REVALIDATE_SECRET env var>`
- Events: check `Entry: publish`, `Entry: update`, `Entry: unpublish`, `Entry: delete`
- Save

- [ ] **Step 4: Test webhook locally**

With both Strapi and Next.js dev running:
1. Create a test article in Strapi and publish it
2. Verify the Next.js console logs show the revalidate endpoint was called
3. Verify `/api/revalidate` returns `{ revalidated: true }`

- [ ] **Step 5: Add sample content**

In Strapi admin, add sample content for all content types and single types to verify the frontend renders correctly.

For Home Page:
- Add a `sections.hero` component: title "Claritate în minte.", subtitle "Neurocercetător, autor și facilitator", two CTA buttons
- Add a `sections.testimonials` component with 2 testimonials
- Publish

- [ ] **Step 6: Verify full dev stack**

```bash
# Terminal 1
docker compose up -d
cd apps/cms && pnpm dev

# Terminal 2
cd apps/web && pnpm dev
```

Visit `http://localhost:3000` — expect redirect to `http://localhost:3000/ro` — expect home page renders content from Strapi.

---

## Task 23: Production Deploy

- [ ] **Step 1: Configure Railway CMS environment variables**

In Railway → CMS service → Variables, set:
```
DATABASE_CLIENT=postgres
DATABASE_URL=<Railway PostgreSQL URL>
APP_KEYS=<generate 4 random base64 strings>
API_TOKEN_SALT=<random string>
ADMIN_JWT_SECRET=<random string>
TRANSFER_TOKEN_SALT=<random string>
JWT_SECRET=<random string>
ENCRYPTION_KEY=<random string>
```

- [ ] **Step 2: Configure Railway PostgreSQL addon**

Railway → Add plugin → PostgreSQL → attach to CMS service. `DATABASE_URL` is automatically injected.

- [ ] **Step 3: Configure Vercel environment variables**

In Vercel → Project → Settings → Environment Variables:
```
STRAPI_URL=https://<your-railway-cms-url>
STRAPI_HOSTNAME=<your-railway-cms-hostname>
STRAPI_API_TOKEN=<token from Task 22 Step 2, regenerated for prod>
REVALIDATE_SECRET=<random string, same as in Strapi webhook header>
```

- [ ] **Step 4: Update Strapi webhook URL to production**

In Railway CMS admin → Settings → Webhooks → Update URL to `https://damasaru.ro/api/revalidate`

- [ ] **Step 5: Verify production deploy**

Push to `main` → Vercel builds and deploys → visit production URL → verify home page loads, blog lists articles, locale switching works.

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete presentation website implementation"
```

---

## Spec Coverage Checklist

| Requirement | Tasks |
|-------------|-------|
| Docker + PostgreSQL | Task 1 |
| packages/types shared types | Tasks 2, 3, 4, 5 |
| Strapi i18n (RO/EN) | Task 6 |
| Dynamic zone components | Task 7 |
| Collection types (Article, Event, MediaItem) | Task 8 |
| Single type pages with dynamic zones | Task 9 |
| Next.js i18n routing ([locale]) | Tasks 11, 18 |
| Strapi fetch helper | Task 12 |
| ISR with revalidateTag | Task 12 |
| Webhook revalidate endpoint | Task 12 |
| Atoms | Task 13 |
| Molecules | Task 14 |
| Navigation + Footer organisms | Task 15 |
| Dynamic zone organisms + DynamicZone renderer | Task 16 |
| Listing + detail + carousel organisms | Task 17 |
| All CMS-managed pages | Tasks 18, 19, 20, 21 |
| Contact page (static) | Task 21 |
| Error boundaries | Task 21 |
| Strapi webhook config | Task 22 |
| Production deploy | Task 23 |
