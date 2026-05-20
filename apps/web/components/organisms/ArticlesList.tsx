'use client'

import { useState } from 'react'
import type { ArticleDTO } from '@repo/types'
import { ArticleCard } from '../molecules/ArticleCard'
import { Tag } from '../atoms/Tag'

interface ArticlesListProps {
  articles: ArticleDTO[]
  locale: string
  readMoreLabel: string
  allLabel: string
  noArticlesLabel: string
}

export function ArticlesList({
  articles,
  locale,
  readMoreLabel,
  allLabel,
  noArticlesLabel,
}: ArticlesListProps) {
  const categories = [
    allLabel,
    ...Array.from(new Set(articles.flatMap((a) => a.tags).filter(Boolean))) as string[],
  ]
  const [activeCategory, setActiveCategory] = useState(allLabel)

  const filtered =
    activeCategory === allLabel
      ? articles
      : articles.filter((a) => a.tags.includes(activeCategory))

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <Tag
            key={cat}
            label={cat}
            active={cat === activeCategory}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: '#6B5F54' }}>{noArticlesLabel}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale}
              readMoreLabel={readMoreLabel}
            />
          ))}
        </div>
      )}
    </div>
  )
}
