import Image from 'next/image'
import type { PressMentionDTO, SectionAccent } from '@repo/types'
import { getAccent } from '@/lib/accent'

interface PressMentionCardProps {
  mention: PressMentionDTO
  accent?: SectionAccent | null
}

export function PressMentionCard({ mention, accent }: PressMentionCardProps) {
  const a = getAccent(accent)
  const logoUrl = mention.logo?.url ?? null
  const card = (
    <article className={`flex flex-col h-full rounded-3xl overflow-hidden border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'}`}>
      {logoUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={logoUrl} alt={mention.logo?.alt ?? mention.outlet} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        </div>
      )}
      <div className="p-6 flex-1">
        <div className={`text-xs uppercase tracking-[0.2em] font-semibold ${a.eyebrow}`}>
          {mention.outlet}
        </div>
        <h3 className={`text-lg font-serif mt-2 mb-3 ${a.text}`}>{mention.title}</h3>
      </div>
    </article>
  )
  return mention.url ? (
    <a href={mention.url} target="_blank" rel="noreferrer" className="block h-full">{card}</a>
  ) : (
    card
  )
}
