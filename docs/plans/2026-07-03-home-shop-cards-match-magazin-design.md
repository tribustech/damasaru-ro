# Home "Magazin" cards → match the Magazin-page look

**Date:** 2026-07-03
**Goal:** The Home page shop zone ("MAGAZIN", Zone 6) should render its book/product cards with the same rich treatment used on the `/magazin` page — format-specific image mockups (portrait book cover / e-book tablet frame / audiobook player), a filled-button CTA, a format tag, a richer eyebrow, and a meta list — while keeping the current dynamic behaviour (auto-pull of `featured: true` products from the `product` collection).

## Decisions (locked)

- **Route B — pure code, stays dynamic.** Keep the Home zone as a `sections.featured-list` (`relation: products`). Do **not** convert it to a static `cards-grid`. The client does nothing in the CMS; the home cards keep auto-syncing with the `product` collection.
  - Rejected Route A (clone as static `cards-grid`) because seeds are disabled (`seedAll` commented in `apps/cms/src/index.ts`) and content is live-edited — Route A would force the non-technical client to rebuild the zone by hand in the Strapi admin and would break auto-sync.
- **Add the meta list** (📖 224 pagini · 🗓 …). The `product` collection has no field for it, so extend the schema with an optional repeatable `metaItems` (reusing the existing `sections.meta-item` component). Client fills meta rows per product.
- **Keep the event card.** The Iași non-conference (`format: 'event'`) must render in the shop zone. `ProductFormatCardBody` currently only handles `hardcover | ebook | audiobook`, so add an `event` branch + CSS.

## Current state (verified)

- Home Zone 6 = `sections.featured-list` (`relation: products`, `filterBy: { featured: true }`, `limit: 3`) → `FeaturedList.tsx` → `DefaultCards` products case → `ProductCard.tsx` (Tailwind, plainer card).
- Magazin page Zone 2 = `sections.cards-grid` (`variant: products`) → `CardsGrid.tsx` → `ProductFormatCardBody` (rich, format-driven, semantic CSS in `globals.css`).
- The 3 featured products (from `apps/cms/src/seed/collections/products.ts`, now live in the DB): printed book (`hardcover`, `available`, `89 lei`), e-book (`ebook`, `available`, `39 lei`), Iași event (`event`, `upcoming`, `350 lei`).

## Approach: extract one shared card, feed it from both surfaces

Extract the rich card markup into a shared presentational molecule so the Magazin page and the Home zone render **the same component** (no drift):

`apps/web/components/molecules/ProductFormatCard.tsx` — takes a normalized prop interface:
```
{ format, image, tag, tagTone, eyebrow, title, text, metaItems, price, priceText, fineprint, ctaLabel, href }
```
Body = today's `ProductFormatCardBody` markup, plus a new **`event`** image branch (full-bleed landscape photo, no mockup). Move `AUDIOBOOK_AUTHOR/CHAPTER` + `ProductCover` here.

- **Magazin page:** `CardsGrid.ProductFormatCardBody` becomes a thin adapter mapping `CardsGridItemDTO` → `ProductFormatCard` props (near 1:1). Visual output unchanged.
- **Home zone:** `ProductCard.tsx` becomes an adapter mapping `ProductDTO` → `ProductFormatCard` props, with derivations:
  - `eyebrow` derived from `format`: hardcover→"Carte tipărită", ebook→"E-book · PDF + EPUB", audiobook→"Audiobook · înregistrat de Costin", event→"Eveniment".
  - `tag` + tone derived from `availability`: available→"Bestseller"; upcoming→"În curând"; waitlist→"Listă așteptare"; sold_out→"Epuizat". Tone class: available+hardcover→`physical`, available+ebook→`digital`, otherwise→`waitlist`.
  - waitlist mode (`upcoming | waitlist | sold_out`): hide `price`, show `priceText` = availability label, ghost CTA "Listă așteptare". available: show `price`, primary CTA — "Cumpără pe Bookzone" when the `buyUrl` host is bookzone, else "Cumpără".
  - `metaItems` from the new `ProductDTO.metaItems` (guard `?? []`).
  - `href` = `product.url`; `image` = `product.cover`.
- **FeaturedList grid:** add a `layout === 'grid' && relation === 'products'` branch in `LayoutBody` that wraps the cards in `<div className="products-grid">` (matching the Magazin page) instead of the Tailwind fallback grid. The section already gets `zone-light` for the `paper` accent, so the shared `.product-card` CSS applies.

## File-by-file changes

**CMS (Strapi)**
1. `apps/cms/src/api/product/content-types/product/schema.json` — add
   `"metaItems": { "type": "component", "repeatable": true, "component": "sections.meta-item" }`.
2. `apps/cms/src/api/pages/services/populate.ts` — `PRODUCT_POPULATE = { image: true, metaItems: true }`.
3. `apps/cms/src/api/pages/services/serialize.ts` — `serializeProduct`: add
   `metaItems: (raw.metaItems ?? []).map((m) => ({ icon: m.icon ?? null, label: m.label }))`.

**Types**
4. `packages/types/src/dto/entity.ts` — `ProductDTO`: add `metaItems?: CardsGridMetaItemDTO[]` (import from `../dto/section`). Optional + runtime-guarded for rollout safety (web may build against a not-yet-migrated Strapi).

**Frontend (web)**
5. `apps/web/components/molecules/ProductFormatCard.tsx` — new shared card (extracted body + `event` branch).
6. `apps/web/components/organisms/CardsGrid.tsx` — `ProductFormatCardBody` → adapter over `ProductFormatCard`.
7. `apps/web/components/molecules/ProductCard.tsx` — rewrite as `ProductDTO` → `ProductFormatCard` adapter (derivations above). Delete old Tailwind markup + `formatLabel/availabilityLabel/overlayTag` no longer needed (or fold into derivation maps).
8. `apps/web/components/organisms/FeaturedList.tsx` — add the `.products-grid` products branch.
9. `apps/web/app/globals.css` — add `.product-image.event` (landscape cover, `object-fit: cover`) + `.event-cover-img`; reuse `.tag.waitlist` for the event tag.

## Rollout / migration notes

- **Reboot required:** adding a component field to `product` creates a new component-link table. Strapi migrates on boot — restart the CMS after the schema edit so the join table exists before populate/serialize touch it (per the nested-component-populate gotcha).
- **No reseed needed** — content stays dynamic; the client adds meta rows per product in the admin (optional; cards render fine without them).
- **Rollout order:** deploy Strapi (schema + serializer + populate) before/with web, but the `?? []` guard makes web safe even if it builds first against the old Strapi.
- **Verification:** `pnpm check-types` green; boot CMS + web; confirm the Magazin page cards are pixel-unchanged (shared-component regression) and the Home MAGAZIN zone now shows the rich cards incl. the event card and (once filled) the meta list.

## Out of scope

- Editable eyebrow / ctaLabel / fineprint fields on `product` (derived in code for now).
- Any change to the Magazin page content or the static `cards-grid` items.
- Course/bundle formats (not featured) — fall back to the `physical` cover treatment.
