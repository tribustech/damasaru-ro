import { getArticles } from '@/lib/strapi'
import { getDictionary } from '@/lib/dictionaries'
import { ArticlesList } from '@/components/organisms/ArticlesList'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import type { Locale } from '@/proxy'

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [articles, dict] = await Promise.all([
    getArticles(locale).catch(() => []),
    getDictionary(locale as Locale),
  ])

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-12">
          <Eyebrow label="Blog" />
          <h1 className="text-5xl font-serif font-light" style={{ color: '#2D241E' }}>
            Blog
          </h1>
        </div>
        <ArticlesList
          articles={articles}
          locale={locale}
          readMoreLabel={dict.blog.readMore}
          allLabel={dict.blog.allCategories}
          noArticlesLabel={dict.blog.noArticles}
        />
      </section>
    </div>
  )
}
