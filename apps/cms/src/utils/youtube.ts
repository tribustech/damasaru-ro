/**
 * YouTube URL helpers — MUST stay in sync with the web grid's extractor in
 * `apps/web/components/organisms/MediaFeatured.tsx`. The Media "Top Apariții"
 * grid renders a YouTube thumbnail per card, so a featured press mention only
 * shows there if a video id can be pulled from its url. We mirror that rule on
 * the CMS side so (a) the resolver can apply the section `limit` to *renderable*
 * items only, and (b) the lifecycle can reject featuring a non-video mention.
 */

/** Extract a YouTube video id from watch?v= / youtu.be/ / shorts/ / embed/ urls. */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return v
      const m = u.pathname.match(/^\/(?:shorts|embed)\/([^/?]+)/)
      if (m) return m[1]
    }
    return null
  } catch {
    return null
  }
}

export function isYoutubeUrl(url: string | null | undefined): boolean {
  return youtubeId(url) !== null
}
