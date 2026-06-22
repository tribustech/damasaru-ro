# Media Press Kit — real ZIP download (and bio PDF) — design

**Date:** 2026-06-22
**Page:** `/media` → `sections.media-press-kit` (Z6, "La îndemână")
**Goal:** The "Foto presă" card's **Descarcă ZIP** button downloads the real
`Kit Foto Presa - Costin Damasaru.zip` (high-res press portraits) off S3, with a clean
filename. Same mechanism readies the bio card for a **Descarcă PDF** the moment a bio PDF
is uploaded.

## Why it isn't working today

The press-kit section has one flat `files: media[]`, and `MediaPressKit.tsx` guesses which
file belongs to which card by counting non-mail cards before it
(`MediaPressKit.tsx:104`, seed `media.ts:226`). The camera card therefore positionally maps
to `portretFiles[1]` — so **"Descarcă ZIP" currently downloads `Costin_Damasaru_Portret_2.jpg`,
not a kit.** There is no real ZIP wired at all.

Two problems to fix together: (1) the brittle positional mapping, (2) no real ZIP + clean
download filename. Files live on S3 (aws-s3 provider), a different origin, so the HTML
`download` attribute is ignored cross-origin and the saved name would be the hashed S3 key.

## Decisions

- **Download UX:** proxy through a same-origin Next route that sets
  `Content-Disposition: attachment; filename="…"`. Gives the clean filename and hides the
  bucket. (Direct-S3 + per-object `Content-Disposition`, or a plain link, were rejected.)
- **ZIP size:** under ~50 MB → uploaded via the CMS media library; streamed by the proxy
  (no in-memory buffering).
- **Plumbing:** move the file **onto each card** (`file` media field) instead of one flat
  section-level `files[]`. Each download button owns its file explicitly.
- **Bio PDF:** card behavior is **file-presence-driven**, not `iconKey`-driven — bio card
  falls back to `mailto` today, auto-flips to "Descarcă PDF" the day a PDF is uploaded. No
  future code change.
- **File source:** files are uploaded through the **CMS media library** (locally now, prod
  when ready). The seed leaves `card.file = null` so reseeding never clobbers
  editor/prod-edited content. (Prod→local DB sync is deferred; not needed for this change.)
- **Migration:** additive, nullable media relation → **non-destructive**. Apply + **reboot
  Strapi** (schema reload, per the nested-populate rule). **No `cleanup:full`, no wipe.**

## Change set

### CMS

1. **`apps/cms/src/components/media/press-kit-card.json`** — add per-card file:
   ```json
   "file": { "type": "media", "multiple": false, "allowedTypes": ["images", "files"] }
   ```

2. **`apps/cms/src/components/sections/media-press-kit.json`** — drop the now-dead
   section-level `files` field. (Non-destructive; orphaned morph rows are harmless. If zero
   prod churn is preferred, leave it deprecated-in-place instead.)

3. **`apps/cms/src/api/pages/services/populate.ts`** — `PAGE_POPULATE` for
   `sections.media-press-kit`:
   ```ts
   'sections.media-press-kit': { populate: { items: { populate: { file: true } } } }
   ```
   Required because `file` is nested inside `items` inside a section (nested-populate rule),
   else the DTO returns it empty. **Reboot** after this change so the relation is wired.

4. **`apps/cms/src/api/pages/services/serialize.ts`** (`sections.media-press-kit` case) —
   serialize the per-item file with download metadata; remove the section `files` block:
   ```ts
   items: (raw.items ?? []).map((i: any) => ({
     id: i.id,
     iconKey: i.iconKey ?? 'document',
     title: i.title,
     description: i.description ?? null,
     file: i.file
       ? { ...serializeMedia(i.file), documentId: i.file.documentId,
           name: i.file.name ?? null, ext: i.file.ext ?? null, size: i.file.size ?? null }
       : null,
   })),
   // (delete the top-level `files: (...)` array)
   ```

5. **Seed `apps/cms/src/seed/pages/media.ts`** — remove `portretFiles` upload + the
   section-level `files: portretFiles`. Cards seed with **no** `file` (attached via CMS).
   Copy unchanged.

### Shared types

6. **`packages/types/src/dto/section.ts`** (`MediaPressKitDTO`) — move file onto the item,
   drop top-level `files`:
   ```ts
   items: {
     id: number
     iconKey: 'document' | 'camera' | 'mail'
     title: string
     description: string | null
     file: (MediaDTO & { documentId: string; name: string | null;
                          ext: string | null; size: number | null }) | null
   }[]
   // remove: files: MediaDTO[]
   ```

### Web

7. **`apps/web/app/api/press-kit/[documentId]/route.ts`** — *closed* proxy (no raw URL in
   the param → no SSRF). Resolves the file from the media-page DTO by `documentId`, streams
   it from S3 with a clean attachment filename. `/api/*` is excluded from the locale proxy
   matcher, so placement outside `[locale]` is safe.
   ```ts
   import { getMediaPage } from '@/lib/strapi'

   export async function GET(_req: Request, { params }: { params: Promise<{ documentId: string }> }) {
     const { documentId } = await params
     const page = await getMediaPage('ro').catch(() => null)
     const kit = page?.sections.find((s) => s.__component === 'sections.media-press-kit')
     const item = kit?.items.find((i) => i.file?.documentId === documentId)
     if (!item?.file) return new Response('Not found', { status: 404 })

     const upstream = await fetch(item.file.url, { next: { revalidate: 3600 } })
     if (!upstream.ok || !upstream.body) return new Response('Upstream error', { status: 502 })

     const filename = item.file.name ?? `kit${item.file.ext ?? ''}`
     const headers = new Headers({
       'Content-Type': upstream.headers.get('content-type') ?? 'application/zip',
       'Content-Disposition': `attachment; filename="${filename}"`,
       'Cache-Control': 'public, max-age=3600',
     })
     const len = upstream.headers.get('content-length')
     if (len) headers.set('Content-Length', len)
     return new Response(upstream.body, { headers })
   }
   ```

8. **`apps/web/components/organisms/MediaPressKit.tsx`** — drop the positional lookup
   (`files`, lines ~82, 102–107, and `download=''`/`target` on the `<a>`). File-presence-driven CTA:
   ```ts
   const hasFile = item.iconKey !== 'mail' && !!item.file
   const href  = hasFile ? `/api/press-kit/${item.file!.documentId}` : `mailto:${PRESS_EMAIL}`
   const label = hasFile ? DEFAULT_LABEL[item.iconKey] : 'Scrie-ne'
   const arrow = hasFile ? '↓' : '→'
   ```
   `iconKey` now only selects the glyph. Mail card unchanged.

## Apply order

1. Land all six code edits (component schema, populate, serialize, types, route, organism)
   + seed cleanup together.
2. **Reboot Strapi** (schema reload — no `cleanup:full`).
3. Upload `Kit Foto Presa - Costin Damasaru.zip` into the camera card's `file` field via the
   CMS media library (local now; prod when ready).
4. Verify: `/media` camera card → **Descarcă ZIP** → `GET /api/press-kit/<documentId>` →
   200, `Content-Disposition: attachment; filename="Kit Foto Presa - Costin Damasaru.zip"`,
   bytes match the upload.

## Bio PDF (later, no code change)

Upload the bio PDF into the **document** card's `file` field. The file-presence-driven CTA
flips it from `mailto` to "Descarcă PDF" automatically through the same proxy route.

## Verification

- `pnpm check-types` green (DTO change touches CMS serialize + web organism).
- Camera card downloads the real ZIP with the clean filename; bytes match.
- Bio card still `mailto` (no PDF yet); mail card unchanged.
- Reboot only — confirm no data was wiped.
