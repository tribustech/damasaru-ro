# Magazin · Cărți — full-fidelity 3-card design

**Date:** 2026-06-22
**Scope:** Make the three cards in the magazin page "Cărți" section match
`Documentation/Pagini/7. Magazin/Magazin_Mock-up - repozitionat poza.html`.

## Decisions (from brainstorm)

- **Visual fidelity:** full — reproduce all three per-format image treatments.
- **New content source:** extend the CMS schema + DTO (editable copy), not derived/hardcoded.
- **Card wiring:** keep the section as `sections.cards-grid` (`variant: 'products'`) and
  **enrich the shared `card-item` component** — do *not* migrate to `Product` collection /
  `featured-list`. New fields are optional and read only by the `products` variant.
- **E-book state:** keep as **"în curând"** (waitlist styling) — no Stripe checkout route exists.
  It still renders the **ebook tablet-frame visual**; only the *body* is in waitlist mode.

## The mockup's three treatments

| Card | Image area | Body state |
|------|-----------|-----------|
| 1 Carte fizică | real cover on warm gradient (`#F5F2EC→#EBE6DC`), 3D drop-shadow, `rotateY` tilt on hover | **available** — price `89 lei`, solid forest tag, primary CTA "Cumpără pe Bookzone" (external) |
| 2 E-book | cover inside navy **tablet frame** on navy gradient + gold radial glow | **waitlist** ("în curând") — `priceText`, dashed gold tag, ghost CTA |
| 3 Audiobook | white **player mock** (cover thumb + title + "Costin Dămășaru" + gold waveform bars) on paper-warm gradient | **waitlist** — `priceText`, dashed gold tag, ghost CTA |

`format` drives the **image treatment + tag base color** (hardcover→forest, ebook→gold).
Waitlist mode is **derived** (`priceText` set / `price` absent) and overrides the tag to the
dashed `.tag.waitlist` style + swaps the primary CTA for a ghost button. No `status` enum.

## 1. CMS data model

**New repeatable component** `apps/cms/src/components/sections/meta-item.json` (mirrors `stat-item`):
```json
{ "collectionName": "components_sections_meta_items",
  "info": { "displayName": "Meta Item", "icon": "bulletList" },
  "attributes": {
    "icon": { "type": "string" },
    "label": { "type": "string", "required": true } } }
```

**Enrich `apps/cms/src/components/sections/card-item.json`** (all optional; `iconImage` reused as cover):
```jsonc
"format":    { "type": "enumeration", "enum": ["hardcover","ebook","audiobook"] },
"eyebrow":   { "type": "string" },
"price":     { "type": "string" },
"priceText": { "type": "string" },
"fineprint": { "type": "string" },
"ctaLabel":  { "type": "string" },
"metaItems": { "type": "component", "repeatable": true, "component": "sections.meta-item" }
```

**Populate** — `apps/cms/src/api/pages/services/populate.ts`, the `sections.cards-grid` entry:
```ts
populate: { items: { populate: { iconImage: true, metaItems: true } } }
```
(Nested-component-populate gotcha: without `metaItems` here it seeds but returns empty. May
require a CMS reboot to create the join table.)

**Serialize** — `apps/cms/src/api/pages/services/serialize.ts`, `case 'sections.cards-grid'`,
extend the `items` map with: `format`, `eyebrow`, `price`, `priceText`, `fineprint`,
`ctaLabel`, and `metaItems: (i.metaItems ?? []).map(m => ({ icon: m.icon ?? null, label: m.label }))`.

**Type** — `packages/types` `CardsGridItemDTO`: add the same optional fields +
`metaItems?: { icon: string | null; label: string }[]`.

## 2. Frontend rendering + CSS

**`apps/web/components/organisms/CardsGrid.tsx`** — rewrite `ProductCardBody` for the
`products` variant. Drop the tag-text heuristics (`extractPrice`, `productKind`,
`isComingSoon`); branch on `item.format`. Per-card structure:

```
<article class="product-card {format}">
  <div class="product-image {physical|ebook|audiobook}">
    <span class="tag {physical|digital|waitlist}">{tag}</span>
    physical : <Image class="book-cover-img" />            (warm gradient, hover tilt)
    ebook    : <div class="tablet-mockup"><Image class="tablet-mockup-img" /></div>
    audiobook: <div class="player-mockup"> thumb + title + author + waveform </div>
  </div>
  <div class="product-content">
    <div class="product-eyebrow">{eyebrow}</div>
    <h3 class="product-title">{title}</h3>
    <p class="product-desc">{text}</p>
    <ul class="product-meta">{metaItems → <li>{icon} {label}</li>}</ul>
    <div class="product-footer">
      {price ? <div class="product-price"> : <div class="product-price-text">{priceText}}
      {available ? <a class="btn-primary"> : <button class="btn-ghost">}{ctaLabel} →
      <p class="product-fineprint">{fineprint}</p>
    </div>
  </div>
</article>
```

- `available = !!price && !priceText`. External `href` (`http…`) → `<a target=_blank>`;
  internal → `<Link>`; none → `<button>` (waitlist).
- **Audiobook player labels:** author `"Costin Dămășaru"` and the "Capitolul 1 — Introducere"
  line are hardcoded constants (decorative). Waveform = static CSS bar heights (optional pulse).
- **Images** use `next/image`; `object-contain` for physical + ebook (show whole cover),
  fixed-size thumb for the audiobook player.

**`apps/web/app/[locale]/globals.css`** — port the mockup CSS onto brand tokens
(`--color-navy`, `--color-navy-soft`, `--color-gold`, `--color-gold-deep`, `--color-forest`,
`--color-paper-warm`, `--color-line`). Add: `.product-image` + `.physical/.ebook/.audiobook`,
`.book-cover-img` (+ hover tilt), `.tablet-mockup(-img)`, `.player-mockup` (cover/info/title/
author/waveform + `nth-child` heights), `.tag` (`.physical/.digital/.waitlist`),
`.product-eyebrow/-desc/-meta/-footer/-price/-price-text/-fineprint`, ensure `.btn-ghost`.
Existing `.product-card`/`.products-grid`/`.product-icon` rules are superseded for this variant
(card radius 16px, hover `translateY(-6px)`).

## 3. Seed data — `apps/cms/src/seed/pages/magazin.ts` (Cărți items, ~lines 56–77)

- **Card 1 hardcover (available):** eyebrow "Carte tipărită · 224 pagini", tag "Fizic",
  price "89 lei", cta "Cumpără pe Bookzone" → Bookzone url, fineprint "Livrare prin Bookzone…",
  meta 📖 224 pagini / 🗓 Publicată noiembrie 2024 / 🏢 Editura Bookzone.
- **Card 2 ebook (în curând / waitlist):** eyebrow "E-book · PDF + EPUB", tag "În curând",
  no price, priceText "Disponibil în curând", ghost cta "Anunță-mă când apare",
  fineprint "Primești un singur email — când lansez e-book-ul.",
  meta 📱 PDF + EPUB / ⚡ Download instant / 📖 Compatibil Kindle, Apple Books.
- **Card 3 audiobook (waitlist):** eyebrow "Audiobook · înregistrat de Costin",
  tag "În curând · listă de așteptare", priceText "Anunț prețul când lansez",
  ghost cta "Anunță-mă când lansez", fineprint "Primești un singur email — în ziua lansării…",
  meta 🎧 Audio MP3 + streaming / 🎙 Înregistrat personal de Costin / ⏱ ~8 ore /
  📅 Lansare: toamna 2026.

All three reuse the existing `bookCover` upload as `iconImage`.

**Reseed:** `pnpm --filter cms cleanup:full` then `pnpm dev` (schema change → reboot creates
the `metaItems` join table).

## Edits that must land together (dynamic-zone rule)

meta-item schema · card-item schema · populate.ts · serialize.ts · CardsGridItemDTO type ·
CardsGrid.tsx · globals.css · magazin.ts seed.
