import Image from 'next/image'
import Link from 'next/link'
import type { PodcastEpisodeDTO, PodcastEpisodeCategoryKind } from '@repo/types'

interface PodcastEpisodeCardProps {
  episode: PodcastEpisodeDTO
  locale: string
}

const CATEGORY_CLASS: Record<PodcastEpisodeCategoryKind, string> = {
  identity: 'cat-identity',
  ai: 'cat-ai',
  comm: 'cat-comm',
  business: 'cat-business',
  spirit: 'cat-spirit',
  community: 'cat-community',
}

function epNumberLabel(n: number): string {
  return String(n).padStart(2, '0')
}

export function PodcastEpisodeCard({ episode, locale }: PodcastEpisodeCardProps) {
  const href = `/${locale}/podcast/${episode.slug}`
  const isLive = episode.status === 'live'
  const coverUrl = episode.cover?.url ?? null
  const guestLine = (() => {
    const g = episode.guests?.[0]
    if (!g) return null
    return g.role ? `${g.name} · ${g.role}` : g.name
  })()
  const categoryClass = episode.categoryKind ? CATEGORY_CLASS[episode.categoryKind] : ''

  return (
    <article className={`episode-card ${isLive ? 'live' : 'upcoming'}`}>
      {isLive && coverUrl ? (
        <div className="ep-thumbnail ep-thumb-real">
          <Image
            src={coverUrl}
            alt={episode.cover?.alt || episode.title}
            width={episode.cover?.width || 1280}
            height={episode.cover?.height || 720}
            sizes="(max-width: 968px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div className="ep-thumbnail">
          <div className="ep-thumbnail-inner">
            <div className="ep-thumbnail-num">EP. {epNumberLabel(episode.number)}</div>
            <div className="ep-thumbnail-text">În curând</div>
          </div>
        </div>
      )}

      <div className="ep-meta-row">
        <div className="ep-num">{epNumberLabel(episode.number)}</div>
        <span className={`ep-status ${isLive ? 'live' : 'upcoming'}`}>
          {isLive ? '● Disponibil' : 'În curând'}
        </span>
      </div>

      {guestLine && <div className="ep-guest">{guestLine}</div>}
      <h3 className="ep-title">{episode.title}</h3>
      {episode.description && (
        <p className="ep-description">{`„${episode.description}"`}</p>
      )}
      {episode.category && (
        <span className={`ep-category ${categoryClass}`}>{episode.category}</span>
      )}

      {isLive ? (
        <Link href={href} className="ep-cta">
          Ascultă acum <span aria-hidden>→</span>
        </Link>
      ) : (
        <span className="ep-cta disabled">Te anunț când e gata →</span>
      )}
    </article>
  )
}
