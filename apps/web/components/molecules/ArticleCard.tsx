import Image from 'next/image'
import Link from 'next/link'
import type { ArticleDTO, SectionAccent } from '@repo/types'
import { Badge } from '../atoms/Badge'
import { getAccent } from '@/lib/accent'

interface ArticleCardProps {
  article: ArticleDTO
  locale: string
  readMoreLabel?: string
  accent?: SectionAccent | null
}

export function ArticleCard({ article, locale, readMoreLabel = 'Citește mai mult', accent }: ArticleCardProps) {
  const a = getAccent(accent)
  const href = `/${locale}/idei/${article.slug}`
  const imageUrl = article.cover?.url ?? null
  const tag = article.tags[0] ?? null
  return (
    <article className={`group flex flex-col rounded-3xl overflow-hidden border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'} hover:border-[var(--color-gold)] transition-colors`}>
      {imageUrl && (
        <Link href={href} className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.cover?.alt ?? article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          {tag && <Badge label={tag} />}
          {article.readTime && <span className={`text-xs ${a.textMuted}`}>{article.readTime}</span>}
        </div>
        <Link href={href}>
          <h3 className={`text-xl font-serif font-medium mb-2 leading-snug ${a.text}`}>
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className={`text-sm mb-4 flex-1 leading-relaxed ${a.textMuted}`}>{article.excerpt}</p>
        )}
        <Link
          href={href}
          className="text-sm font-medium mt-auto text-[var(--color-gold-deep)] hover:opacity-70 transition-opacity"
        >
          {readMoreLabel} →
        </Link>
      </div>
    </article>
  )
}
