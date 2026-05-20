import { notFound } from 'next/navigation'
import { getPodcastPage } from '@/lib/strapi'
import { DynamicZone } from '@/components/organisms/DynamicZone'

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getPodcastPage(locale).catch(() => null)
  if (!page) notFound()
  return <DynamicZone sections={page.sections} locale={locale} />
}
