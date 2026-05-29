import type { Core } from '@strapi/strapi'
import fs from 'node:fs'
import path from 'node:path'

// Walk up from this file until we find a directory containing
// `Documentation/Pagini`. This makes the seed resilient to whether Strapi runs
// from `src/` (dev) or `dist/` (built mode), and to monorepo restructuring.
//
// Returns null instead of throwing: the client docs live outside the app
// (sibling `../Documentation`) and are NOT shipped to production, so in a
// deployed container this resolves to null. Callers (seedAll) must skip
// doc-dependent seeding in that case rather than crash the boot.
function findDocumentationRoot(): string | null {
  let dir = __dirname
  for (let i = 0; i < 12; i++) {
    const candidate = path.join(dir, 'Documentation', 'Pagini')
    if (fs.existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

export const DOCUMENTATION_ROOT = findDocumentationRoot()

export function docPath(...parts: string[]): string {
  // DOCUMENTATION_ROOT is null where the client docs aren't shipped (e.g.
  // production). We still return a path so callers can derive the file's
  // basename — uploadFile() reuses already-uploaded media by name and only
  // reads the local file when the media isn't in the library yet.
  return path.join(DOCUMENTATION_ROOT ?? path.join(__dirname, '__docs_unavailable__'), ...parts)
}

const mimeMap: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
}

const uploadCache = new Map<string, number>()

export async function uploadFile(
  strapi: Core.Strapi,
  filePath: string,
  options: { alt?: string; caption?: string } = {}
): Promise<number | null> {
  const name = path.basename(filePath)
  const cacheKey = name
  if (uploadCache.has(cacheKey)) return uploadCache.get(cacheKey)!

  // Reuse if already uploaded with the same name. This is the path that lets
  // the seed run without the local source files (e.g. in production, where the
  // client Documentation/ assets are not shipped): the media was uploaded once
  // and persists in S3 + the upload-library `files` table, so we just relink it.
  const existing = await strapi.db.query('plugin::upload.file').findOne({ where: { name } })
  if (existing) {
    uploadCache.set(cacheKey, existing.id)
    return existing.id
  }

  // Not in the library yet — uploading it requires the local source file.
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(
      `[seed] media "${name}" is not in the upload library and the source file is unavailable (${filePath}) — leaving unset`
    )
    return null
  }

  const ext = path.extname(filePath).toLowerCase()
  const mime = mimeMap[ext] ?? 'application/octet-stream'

  const stats = fs.statSync(filePath)
  const tmpPath = path.join('/tmp', `seed-${Date.now()}-${name}`)
  fs.copyFileSync(filePath, tmpPath)

  const file = {
    filepath: tmpPath,
    originalFilename: name,
    mimetype: mime,
    size: stats.size,
  } as unknown as Parameters<
    ReturnType<Core.Strapi['plugin']>['service']
  >[0]

  try {
    const uploaded = await (strapi
      .plugin('upload')
      .service('upload') as unknown as {
      upload: (args: { data: { fileInfo: Record<string, unknown> }; files: unknown }) => Promise<unknown>
    })
      .upload({
        data: {
          fileInfo: { alternativeText: options.alt ?? name, caption: options.caption ?? '' },
        },
        files: file,
      }) as Array<{ id: number }> | { id: number }
    const result = Array.isArray(uploaded) ? uploaded[0] : uploaded
    if (result?.id) {
      uploadCache.set(cacheKey, result.id)
      return result.id
    }
    return null
  } catch (err) {
    strapi.log.error(`[seed] failed to upload ${filePath}: ${(err as Error).message}`)
    return null
  } finally {
    try {
      fs.unlinkSync(tmpPath)
    } catch {}
  }
}

type ApiUID = `api::${string}.${string}`

// Strapi 5's documents() signature is strongly tied to a UID union — using a
// generic string makes its overload reject the call. The seed code legitimately
// works across many UIDs at runtime, so we route through `any` to keep this
// boundary loose without leaking it into the seed files.
function docs(strapi: Core.Strapi, uid: ApiUID) {
  return (strapi.documents as unknown as (uid: string) => ReturnType<typeof strapi.documents>)(uid)
}

export async function upsertSingleType<T extends Record<string, unknown>>(
  strapi: Core.Strapi,
  uid: ApiUID,
  data: T,
  locale: string = 'ro'
): Promise<void> {
  const existing = await docs(strapi, uid).findFirst({ locale }).catch(() => null)
  if (existing) {
    await docs(strapi, uid).update({
      documentId: existing.documentId,
      data: data as never,
      locale,
      status: 'published',
    })
  } else {
    await docs(strapi, uid).create({ data: data as never, locale, status: 'published' })
  }
}

export async function upsertBySlug<T extends Record<string, unknown> & { slug: string }>(
  strapi: Core.Strapi,
  uid: ApiUID,
  items: T[],
  locale: string = 'ro'
): Promise<void> {
  for (const item of items) {
    const existing = await docs(strapi, uid).findFirst({
      filters: { slug: item.slug },
      locale,
    } as never).catch(() => null)
    if (existing) {
      await docs(strapi, uid).update({
        documentId: (existing as { documentId: string }).documentId,
        data: item as never,
        locale,
        status: 'published',
      })
    } else {
      await docs(strapi, uid).create({ data: item as never, locale, status: 'published' })
    }
  }
}

export async function upsertList<T extends Record<string, unknown>>(
  strapi: Core.Strapi,
  uid: ApiUID,
  items: T[],
  uniqueField: keyof T,
  locale: string = 'ro'
): Promise<void> {
  for (const item of items) {
    const existing = await docs(strapi, uid).findFirst({
      filters: { [uniqueField]: item[uniqueField] },
      locale,
    } as never).catch(() => null)
    if (existing) {
      await docs(strapi, uid).update({
        documentId: (existing as { documentId: string }).documentId,
        data: item as never,
        locale,
        status: 'published',
      })
    } else {
      await docs(strapi, uid).create({ data: item as never, locale, status: 'published' })
    }
  }
}
