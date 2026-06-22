import { getMediaPage } from '@/lib/strapi'

/**
 * Closed download proxy for press-kit files (ZIP / bio PDF).
 *
 * Resolves the requested upload by its documentId against the live media-page
 * DTO — so only files actually attached to a press-kit card can be streamed
 * (no open proxy / SSRF). Streams the S3 object same-origin with a clean
 * `Content-Disposition: attachment` filename, which the cross-origin HTML
 * `download` attribute can't provide.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params

  // media-page is localized, so a file may be attached under either locale; check both.
  let file: { url: string; name: string | null; ext: string | null } | null = null
  for (const locale of ['ro', 'en']) {
    const page = await getMediaPage(locale).catch(() => null)
    const kit = page?.sections.find((s) => s.__component === 'sections.media-press-kit')
    const match = kit?.items.find((i) => i.file?.documentId === documentId)?.file
    if (match) {
      file = match
      break
    }
  }
  if (!file) return new Response('Not found', { status: 404 })

  const upstream = await fetch(file.url, { next: { revalidate: 3600 } })
  if (!upstream.ok || !upstream.body) return new Response('Upstream error', { status: 502 })

  const filename = file.name ?? `kit${file.ext ?? ''}`
  const headers = new Headers({
    'Content-Type': upstream.headers.get('content-type') ?? 'application/zip',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'public, max-age=3600',
  })
  const len = upstream.headers.get('content-length')
  if (len) headers.set('Content-Length', len)

  return new Response(upstream.body, { headers })
}
