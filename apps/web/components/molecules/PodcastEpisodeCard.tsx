import Image from 'next/image'
import Link from 'next/link'
import type { PodcastEpisodeDTO, SectionAccent } from '@repo/types'
import { getAccent } from '@/lib/accent'

interface PodcastEpisodeCardProps {
  episode: PodcastEpisodeDTO
  locale: string
  accent?: SectionAccent | null
}

export function PodcastEpisodeCard({ episode, locale, accent }: PodcastEpisodeCardProps) {
  const a = getAccent(accent)
  const href = `/${locale}/podcast/${episode.slug}`
  const imageUrl = episode.cover?.url ?? null
  return (
    <article className={`group flex gap-6 p-6 rounded-3xl border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'} hover:border-[var(--color-gold)] transition-colors`}>
      {imageUrl && (
        <Link href={href} className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden">
          <Image src={imageUrl} alt={episode.cover?.alt ?? episode.title} fill sizes="128px" className="object-cover" />
        </Link>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <div className={`text-xs uppercase tracking-[0.2em] font-semibold ${a.eyebrow}`}>
          Episodul {episode.number}{episode.duration ? ` · ${episode.duration}` : ''}
        </div>
        <Link href={href}>
          <h3 className={`text-xl font-serif mt-1 mb-2 ${a.text}`}>{episode.title}</h3>
        </Link>
        {episode.description && (
          <p className={`text-sm leading-relaxed line-clamp-3 ${a.textMuted}`}>{episode.description}</p>
        )}
      </div>
    </article>
  )
}
