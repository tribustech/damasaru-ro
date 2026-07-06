import type { ArticleDetailDTO } from '@repo/types'
import Image from 'next/image'
import { Eyebrow } from '../atoms/Eyebrow'
import { mdToHtml } from '@/lib/markdown'

interface ArticleDetailProps {
  article: ArticleDetailDTO
  locale: string
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const category = article.tags[0] ?? null
  const meta = [
    article.author ? `de ${article.author}` : null,
    article.date,
    article.readTime,
  ].filter(Boolean)

  return (
    <article className="max-w-3xl mx-auto px-6 py-24">
      <div className="mb-8">
        {category && <Eyebrow label={category} />}
        <h1
          className="text-5xl font-serif font-light leading-tight mb-4"
          style={{ color: '#2D241E' }}
        >
          {article.title}
        </h1>
        {meta.length > 0 && (
          <div className="flex items-center gap-3 text-sm" style={{ color: '#6B5F54' }}>
            {meta.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="mr-3">·</span>}
                {part}
              </span>
            ))}
          </div>
        )}
      </div>

      {article.cover && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12">
          <Image
            src={article.cover.url}
            alt={article.cover.alt ?? article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {article.body && (
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: mdToHtml(article.body) }}
        />
      )}
    </article>
  )
}
