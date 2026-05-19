import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@repo/types'
import { Badge } from '../atoms/Badge'

interface ArticleCardProps {
  article: Article
  locale: string
  readMoreLabel: string
}

export function ArticleCard({ article, locale, readMoreLabel }: ArticleCardProps) {
  const href = `/${locale}/blog/${article.slug}`
  const imageUrl = article.coverImage
    ? article.coverImage.url
    : null

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(45,36,30,0.08)] hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.coverImage?.alternativeText ?? article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          {article.category && <Badge label={article.category} />}
          {article.readTime && (
            <span className="text-xs" style={{ color: '#6B5F54' }}>
              {article.readTime}
            </span>
          )}
        </div>
        <h3 className="text-xl font-serif font-light mb-2 leading-snug" style={{ color: '#2D241E' }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm mb-4 flex-1 leading-relaxed" style={{ color: '#6B5F54' }}>
            {article.excerpt}
          </p>
        )}
        <Link
          href={href}
          className="text-sm font-medium hover:opacity-70 transition-opacity mt-auto"
          style={{ color: '#B8866F' }}
        >
          {readMoreLabel} →
        </Link>
      </div>
    </article>
  )
}
