import type { PodcastEpisodeDTO } from '@repo/types'

export type EpisodePlatform = 'youtube' | 'spotify' | 'apple' | 'other'

export interface EpisodeLink {
  url: string
  platform: EpisodePlatform
  label: string
}

/**
 * Deduce the platform from the URL host itself, not from which CMS field it
 * came from — an editor can paste a YouTube link in `audioUrl` and it should
 * still read as YouTube. Unknown hosts fall back to a generic "Ascultă".
 */
function platformFromUrl(url: string): { platform: EpisodePlatform; label: string } {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com')
      return { platform: 'youtube', label: 'YouTube' }
    if (host.endsWith('spotify.com')) return { platform: 'spotify', label: 'Spotify' }
    if (host === 'podcasts.apple.com' || host === 'music.apple.com')
      return { platform: 'apple', label: 'Apple Podcasts' }
    return { platform: 'other', label: 'Ascultă' }
  } catch {
    return { platform: 'other', label: 'Ascultă' }
  }
}

/**
 * The places an episode can be played. `videoUrl` leads (YouTube is this
 * podcast's hero platform), then `audioUrl`. There is no on-site detail page —
 * an episode with no links is "În curând". Duplicate URLs are collapsed.
 */
export function episodeLinks(
  episode: Pick<PodcastEpisodeDTO, 'videoUrl' | 'audioUrl'>,
): EpisodeLink[] {
  const raw = [episode.videoUrl, episode.audioUrl]
  const links: EpisodeLink[] = []
  const seen = new Set<string>()
  for (const value of raw) {
    const url = value?.trim()
    if (!url || seen.has(url)) continue
    seen.add(url)
    links.push({ url, ...platformFromUrl(url) })
  }
  return links
}

export function hasEpisodeLinks(
  episode: Pick<PodcastEpisodeDTO, 'videoUrl' | 'audioUrl'>,
): boolean {
  return episodeLinks(episode).length > 0
}
