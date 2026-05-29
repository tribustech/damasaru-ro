# damasaru.ro — Agent Briefing

This monorepo builds **damasaru.ro**, the personal website of **Costin Damasaru** (Romanian neuroscientist, author, facilitator). The site is content-driven: a Strapi CMS owns every page so the client can edit text/images without a developer.

The authoritative spec lives in `../Documentation/` (client-supplied copy, mockups, photography). `../Documentation Figma/` is a parallel exploration I did in Figma Make — useful for visual reference, but **the client's `Documentation/` folder always wins** if the two disagree.

> **Read `docs/site-spec.md` first** — it's the digested form of `../Documentation/Structura Site.xlsx` (binary, can't be read with text tools). It owns the canonical sitemap, the 7-zone homepage chromatic rhythm, the per-page section blueprint, the design tokens (Forest palette + Cormorant/Inter type scale), and the conversion priorities. Everything below is engineering convention; that file is product/design truth.

---

## Stack

| Layer | Tech | Path |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router, React 19, Tailwind v4) | `apps/web` |
| CMS | Strapi 5 (TypeScript) | `apps/cms` |
| DB | PostgreSQL 16 (via `docker-compose.yml`) | — |
| Shared TS types | `@repo/types` | `packages/types` |
| Shared React UI primitives | `@repo/ui` | `packages/ui` |
| Build orchestration | Turborepo + pnpm 9 workspaces | root |

Locales: `ro` (default) and `en`, served under `/ro/...` and `/en/...` via the proxy in `apps/web/proxy.ts`. Strapi i18n is enabled with the same two locales (see `apps/cms/config/plugins.ts`).

**Dev workflow**:
- `docker compose up -d` to start Postgres.
- `pnpm dev` (repo root) starts web on `:3000` and Strapi on `:1337`. First boot runs `bootstrap()` in `apps/cms/src/index.ts`, which seeds every page + collection from `apps/cms/src/seed/` using copy and images from `../Documentation/Pagini/`. Seeds are idempotent — single types upsert, collection items upsert by their unique field.
- **Reset content**: `pnpm --filter cms cleanup` truncates every collection + single-type table (keeps uploaded files + admin accounts), so the next `pnpm dev` re-runs the bootstrap from scratch. Use `pnpm --filter cms cleanup:full` to also wipe the `files` table (uploaded media on disk stays — Strapi just re-registers it on next seed via name lookup).

Dev: `pnpm dev` from the repo root (starts `web` on :3000 and `cms` on :1337). Postgres must be up first: `docker compose up -d`.

---

## Sitemap (drives the build order)

Pages are documented in `../Documentation/Pagini/` — they are numbered and that is the build order the client expects:

1. **Despre mine** — `/despre` (About) — single type `about-page`
2. **Cartea** — `/carte` (Book) — single type `book-page`
3. **Podcast** — `/podcast` *(not built yet — needs new single type + likely a `podcast-episode` collection)*
4. **Idei** — `/idei` (essays/blog) — currently routed at `/blog` and powered by the `article` collection; rename/alias to `/idei` per the client doc
5. **Proiecte** — `/proiecte` *(not built yet — needs `project` collection: Veruvis, Veruvis Kids, Neuro Performance, etc.)*
6. **Evenimente** — `/evenimente` (Events) — collection `event` (status enum `viitor` / `trecut`)
7. **Magazin** — `/magazin` *(not built yet — needs `product` collection or external shop integration; client doc has a "READ ME" worth reading first)*
8. **Media** — `/media` (press kit) — single type `media-page` + collection `media-item`
9. **Contact** — `/contact` (no CMS backing yet; form-only)

Home (`/`) is its own single type (`home-page`) that composes the above via a dynamic zone. See `../Documentation/Look And Feel Homepage.html` — it defines 7 zones in order: Hero, Podcast feature, Idei feature, Proiecte feature, Evenimente feature, Magazin feature, Big-quote CTA.

The site lives in **Romanian**, so prefer Romanian for any user-facing copy and slugs unless the work is explicitly bilingual.

---

## CMS modeling conventions

Every CMS content type belongs to one of three buckets — pick the right one before adding fields:

- **Single Types** = one-of pages with bespoke layouts. Always use a `sections` dynamic zone over hard-coded attributes so editors can rearrange blocks. Current: `home-page`, `about-page`, `book-page`, `media-page`.
- **Collection Types** = repeating entities (articles, events, projects, episodes, products, media items, testimonials when reused).
- **Dynamic Zone Components** = reusable section blocks under `apps/cms/src/components/sections/`. Current: `hero`, `text-block`, `cards-grid` (+ `card-item`), `testimonials` (+ `testimonial-item`), `cta-banner`, `featured-list`. Shared atoms live under `apps/cms/src/components/shared/` (`cta-button`).

Rules of thumb:
- Localize any user-visible string with `"pluginOptions": { "i18n": { "localized": true } }`.
- Keep `draftAndPublish: true` on all content types so editors can stage drafts.
- When a new section is needed, add the JSON schema under `apps/cms/src/components/sections/`, add it to the relevant single type's `sections` dynamic zone allow-list, add the TS interface in `packages/types/src/components/sections/`, add it to `Section` union, then add a React organism in `apps/web/components/organisms/` and wire it in `apps/web/components/organisms/DynamicZone.tsx`. **All five edits must land together** or the dynamic zone breaks.
- `featured-list` has a `relation` enum — extend it when a new collection (podcast episodes, projects, products) needs to surface in dynamic zones.

---

## Frontend conventions

- App Router with locale-prefixed routes: `apps/web/app/[locale]/.../page.tsx`. Always read `locale` from `await params` (Next 16).
- Server-side fetching only — `apps/web/lib/strapi.ts` wraps `fetch(STRAPI_URL/api/...)` with `next: { tags: [...] }` for on-demand revalidation. Add new fetchers there, not in components.
- Component layering follows atomic design: `components/atoms`, `components/molecules`, `components/organisms`. Section-level building blocks go in `organisms/`.
- Tailwind v4 (CSS-first config). Brand palette lives inline in `app/[locale]/layout.tsx` (`#FAF8F5` page bg) and the Look And Feel HTML — refer to those swatches before inventing new colors.
- Dictionaries (UI chrome strings) in `apps/web/dictionaries/{ro,en}.json`. Everything page-specific should come from Strapi, not dictionaries.

---

## What's done vs. what's left

**Phase B foundation (2026-05-20):** all 10 single types and 6 collection types are modeled, plus 17 dynamic-zone section components. Frontend has every organism wired through `DynamicZone.tsx`, an `accent` system (`navy` / `paper` / `paper-warm` / `navy-deep`) via `lib/accent.ts`, and locale-prefixed routes for every page. `pnpm check-types` is green.

- Single types: `home-page`, `about-page`, `book-page`, `media-page`, `podcast-page`, `idei-page`, `proiecte-page`, `events-page`, `magazin-page`, `contact-page`. All share the same 17-component dynamic-zone allow-list.
- Collection types: `article`, `event`, `media-item`, `podcast-episode`, `project`, `product`, `testimonial`, `press-mention`, `newsletter-subscription`.
- Section components (dynamic-zone allow-listed): `hero`, `text-block`, `cards-grid`, `testimonials`, `cta-banner`, `featured-list`, `stats-strip`, `quote-large`, `image-text-split`, `newsletter-form`, `faq-accordion`, `logo-wall`, `downloads-list`, `video-feature`, `credentials-grid`, `event-feature`, `contact-form`. Sub-components (used inside repeatables): `card-item`, `stat-item`, `faq-item`, `logo-item`, `download-item`, `credential-group`.
- `featured-list.relation` enum covers: `articles`, `events`, `podcast-episodes`, `projects`, `products`, `testimonials`, `press-mentions`.
- The full design lives at `docs/plans/2026-05-20-damasaru-site-design.md`.

**Phase C — pages are still empty in the CMS.** Every single type renders an empty `<DynamicZone />` until an editor (or a seed script) populates `sections`. Build order from `Documentation/Pagini/`: Home → Despre → Cartea → Podcast → Idei → Proiecte → Evenimente → Magazin → Media → Contact.

**Phase D — polish not done yet.** Navigation/Footer link sets still miss Podcast, Idei, Proiecte, Magazin. Dictionaries (`apps/web/dictionaries/{ro,en}.json`) need those four labels. Fonts: `app/[locale]/layout.tsx` still loads Geist — swap for Cormorant Garamond + Inter to match the brand. The old `/blog` route was deleted in favour of `/idei/[slug]`.

**Always start with the client docs in `../Documentation/Pagini/<n>. <name>/`** — they include a `.docx` with final copy, mockups (`*.html` or `*.pdf`), and the photography to use. Plain-text versions of every docx live at `/tmp/damasaru-copy/` after one `textutil` pass. The Figma copy may be lorem-ipsum; the docx is the source of truth for words.

---

## House rules

- Romanian copy by default. English is a secondary locale and can lag.
- Editors are non-technical — never require code changes to add content. If you find yourself hard-coding a list, move it to Strapi.
- Don't add abstractions for pages that aren't built yet. Build the next page on the list, then look at what could be shared.
- The Figma project (`../Documentation Figma/`) was a Vite/React-Router SPA exploration — treat its components as **inspiration only**, not code to lift. The production app is Next 16 + Strapi.
