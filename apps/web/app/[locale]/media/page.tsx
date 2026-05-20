import { notFound } from 'next/navigation'
import { getMediaPage } from '@/lib/strapi'
import { DynamicZone } from '@/components/organisms/DynamicZone'

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getMediaPage(locale).catch(() => null)
  if (!page) notFound()
  return <DynamicZone sections={page.sections} locale={locale} />
}
