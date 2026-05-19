import { notFound } from 'next/navigation'
import { getArticles, getArticle } from '@/lib/strapi'
import { ArticleDetail } from '@/components/organisms/ArticleDetail'
import type { Locale } from '@/proxy'

const locales: Locale[] = ['ro', 'en']

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const articles = await getArticles(locale).catch(() => [])
      return articles.map((a) => ({ locale, slug: a.slug }))
    })
  )
  return params.flat()
}

export const dynamicParams = true

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const article = await getArticle(slug, locale)

  if (!article) notFound()

  return <ArticleDetail article={article} />
}
