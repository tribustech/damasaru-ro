# Cartea — "Citește/Descarcă primul capitol" PDF download

**Date:** 2026-06-30
**Status:** Design approved, ready for implementation

## Goal

Wire the "Descarcă primul capitol (PDF)" button on the Cartea page so it
downloads a first-chapter PDF. The file is uploaded through Strapi (lands in
S3 via the `aws-s3` provider) and delivered same-origin as a forced download.

## Context

- **Page route:** `apps/web/app/[locale]/carte/page.tsx` → `getBookPage(locale)`
  → custom composed DTO endpoint `GET /api/pages/cartea` (not generic populate).
- **The button:** the real download action is the Zone 6 "Preview gratuit"
  `sections.text-block` CTA, currently `cta: { label: 'Descarcă primul
  capitol (PDF)', href: '#' }` — a dead placeholder. (The hero "Citește primul
  capitol" button is just a scroll anchor to `#preview-gratuit` and already
  works.)
- **Reused pattern:** the press-kit proxy route
  `apps/web/app/api/press-kit/[documentId]/route.ts` (anti-SSRF resolve +
  `Content-Disposition: attachment`).

## Decisions

- **Storage:** new optional media field `ctaFile` on the `text-block`
  component (file lives next to its CTA). Per-locale (RO/EN) supported.
- **Delivery:** same-origin proxy route that streams the S3 object as an
  attachment with a clean filename (not a direct S3 link).

## Implementation

### 1. CMS data model

`apps/cms/src/components/sections/text-block.json` — add:
```json
"ctaFile": { "type": "media", "multiple": false, "allowedTypes": ["files"] }
```
Optional, so all other text-blocks are unaffected.

### 2. DTO (populate + serialize)

`apps/cms/src/api/pages/services/populate.ts`:
```ts
'sections.text-block': { cta: true, ctaFile: true },
```

`apps/cms/src/api/pages/services/serialize.ts` — extend the `text-block`
serializer, reusing the press-kit downloadable-file shape:
```ts
const file = raw.ctaFile
const media = serializeMedia(file)
return {
  ...existing,
  ctaFile: media
    ? { ...media, documentId: file.documentId, name: file.name ?? null,
        ext: file.ext ?? null, size: file.size ?? null }
    : null,
}
```

**Gotcha:** reboot the CMS after adding the nested media field so Strapi
creates the component↔file join table; otherwise `ctaFile` returns null even
with populate set.

### 3. Web type

Add `ctaFile?: { url; documentId; name; ext; size; ... } | null` to the
text-block section type (`apps/web/lib/strapi.ts` / section types).

### 4. Proxy route

`apps/web/app/api/book-chapter/[documentId]/route.ts` — modeled on press-kit:
- Read `documentId` from path (default locale `ro`, or accept `?locale=`).
- `getBookPage(locale)`, walk `sections` for a `text-block` whose
  `ctaFile?.documentId` matches → anti-SSRF guard (only an attached file can
  stream).
- `fetch(ctaFile.url)` from S3, re-stream with
  `Content-Disposition: attachment; filename="primul-capitol.pdf"` and
  `Content-Type: application/pdf` (build filename from `name`/`ext`).
- 404 if no match.

### 5. Button rendering

`apps/web/components/organisms/TextBlock.tsx`:
```tsx
const href = section.ctaFile
  ? `/api/book-chapter/${section.ctaFile.documentId}`
  : section.cta.href
// when ctaFile: render plain <a href={href} download>, else existing <Link>
```

## Full chain

CMS field → populate → serialize → DTO type → proxy route → button.

## Out of scope (YAGNI)

- Email-capture / lead-gen gating before download.
- Page-level (book-page schema) PDF field — kept on the component instead.
