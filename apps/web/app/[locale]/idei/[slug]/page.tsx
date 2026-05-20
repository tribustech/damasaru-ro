import { notFound } from 'next/navigation'
import { getArticle, NotFoundError } from '@/lib/strapi'
import { ArticleDetail } from '@/components/organisms/ArticleDetail'

export const dynamicParams = true

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  try {
    const article = await getArticle(slug, locale)
    return <ArticleDetail article={article} locale={locale} />
  } catch (e) {
    if (e instanceof NotFoundError) notFound()
    throw e
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params
  try {
    const article = await getArticle(slug, locale)
    return { title: article.title, description: article.excerpt ?? undefined }
  } catch (e) {
    if (e instanceof NotFoundError) return {}
    throw e
  }
}
