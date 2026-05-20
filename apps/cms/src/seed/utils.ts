import type { Core } from '@strapi/strapi'
import fs from 'node:fs'
import path from 'node:path'

// Walk up from this file until we find a directory containing
// `Documentation/Pagini`. This makes the seed resilient to whether Strapi runs
// from `src/` (dev) or `dist/` (built mode), and to monorepo restructuring.
function findDocumentationRoot(): string {
  let dir = __dirname
  for (let i = 0; i < 12; i++) {
    const candidate = path.join(dir, 'Documentation', 'Pagini')
    if (fs.existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    `[seed] could not find Documentation/Pagini walking up from ${__dirname}`
  )
}

const DOCUMENTATION_ROOT = findDocumentationRoot()

export function docPath(...parts: string[]): string {
  return path.join(DOCUMENTATION_ROOT, ...parts)
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
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(`[seed] missing file ${filePath}`)
    return null
  }
  const cacheKey = filePath
  if (uploadCache.has(cacheKey)) return uploadCache.get(cacheKey)!

  const ext = path.extname(filePath).toLowerCase()
  const mime = mimeMap[ext] ?? 'application/octet-stream'
  const name = path.basename(filePath)

  // Reuse if already uploaded with the same name
  const existing = await strapi.db.query('plugin::upload.file').findOne({ where: { name } })
  if (existing) {
    uploadCache.set(cacheKey, existing.id)
    return existing.id
  }

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
