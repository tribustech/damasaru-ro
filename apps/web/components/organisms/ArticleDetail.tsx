import type { Article } from '@repo/types'
import Image from 'next/image'
import { Badge } from '../atoms/Badge'
import { Eyebrow } from '../atoms/Eyebrow'

interface ArticleDetailProps {
  article: Article
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-24">
      <div className="mb-8">
        {article.category && <Eyebrow label={article.category} />}
        <h1
          className="text-5xl font-serif font-light leading-tight mb-4"
          style={{ color: '#2D241E' }}
        >
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm" style={{ color: '#6B5F54' }}>
          {article.date && <span>{article.date}</span>}
          {article.readTime && <span>· {article.readTime}</span>}
        </div>
      </div>

      {article.coverImage && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12">
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alternativeText ?? article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {article.content && (
        <div
          className="prose prose-lg max-w-none"
          style={{ color: '#2D241E' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}
    </article>
  )
}
