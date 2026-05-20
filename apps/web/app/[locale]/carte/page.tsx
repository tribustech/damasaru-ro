import { notFound } from 'next/navigation'
import { getBookPage } from '@/lib/strapi'
import { DynamicZone } from '@/components/organisms/DynamicZone'

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getBookPage(locale).catch(() => null)
  if (!page) notFound()
  return <DynamicZone sections={page.sections} locale={locale} />
}
