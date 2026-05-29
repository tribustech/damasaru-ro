import type { Core } from '@strapi/strapi'
import { MEDIA_MANIFEST } from './media-manifest'

// Pre-seed the Strapi upload library from a committed manifest of the real S3
// file metadata.
//
// Why: the client media is uploaded once (from the Documentation/ assets) and
// lives in S3. The page/collection seeds relink media by name via uploadFile().
// On a fresh database (e.g. a brand-new production deploy) the upload library
// has no records, so that name lookup finds nothing and — because the source
// docs aren't shipped — images would be left unset. Recreating the file rows
// from this manifest, pointing at the already-uploaded S3 objects, makes media
// available without the local source files and without re-uploading anything.
//
// Idempotent: a file is only created when no record with the same `name` exists,
// so this is a no-op once the library is populated (dev, or a re-run).
export async function seedMediaLibrary(strapi: Core.Strapi): Promise<void> {
  let created = 0
  let present = 0
  for (const e of MEDIA_MANIFEST) {
    const existing = await strapi.db
      .query('plugin::upload.file')
      .findOne({ where: { name: e.name } })
    if (existing) {
      present++
      continue
    }
    await strapi.db.query('plugin::upload.file').create({
      data: {
        name: e.name,
        alternativeText: e.alternativeText ?? undefined,
        caption: e.caption ?? undefined,
        width: e.width ?? undefined,
        height: e.height ?? undefined,
        formats: e.formats ?? undefined,
        hash: e.hash,
        ext: e.ext,
        mime: e.mime,
        size: e.size ?? undefined,
        url: e.url,
        previewUrl: e.previewUrl ?? undefined,
        provider: e.provider,
        providerMetadata: e.providerMetadata ?? undefined,
        folderPath: e.folderPath ?? '/',
      },
    })
    created++
  }
  strapi.log.info(
    `[seed] ✓ media-library (${created} created, ${present} already present, ${MEDIA_MANIFEST.length} total)`
  )
}
