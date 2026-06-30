import { getBookPage } from '@/lib/strapi'

/**
 * Closed download proxy for the book's free first-chapter PDF.
 *
 * Resolves the requested upload by its documentId against the live book-page
 * DTO — so only a file actually attached to a text-block CTA on the Cartea
 * page can be streamed (no open proxy / SSRF). Streams the S3 object
 * same-origin with a clean `Content-Disposition: attachment` filename, which
 * the cross-origin HTML `download` attribute can't provide.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params

  // book-page is localized, so a PDF may be attached under either locale; check both.
  let file: { url: string; name: string | null; ext: string | null } | null = null
  for (const locale of ['ro', 'en']) {
    const page = await getBookPage(locale).catch(() => null)
    const match = page?.sections.find(
      (s) => s.__component === 'sections.text-block' && s.ctaFile?.documentId === documentId,
    )
    if (match && match.__component === 'sections.text-block' && match.ctaFile) {
      file = match.ctaFile
      break
    }
  }
  if (!file) return new Response('Not found', { status: 404 })

  const upstream = await fetch(file.url, { next: { revalidate: 3600 } })
  if (!upstream.ok || !upstream.body) return new Response('Upstream error', { status: 502 })

  const filename = file.name ?? `primul-capitol${file.ext ?? '.pdf'}`
  const headers = new Headers({
    'Content-Type': upstream.headers.get('content-type') ?? 'application/pdf',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'public, max-age=3600',
  })
  const len = upstream.headers.get('content-length')
  if (len) headers.set('Content-Length', len)

  return new Response(upstream.body, { headers })
}
