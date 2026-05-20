import { notFound } from 'next/navigation'
import { getMagazinPage } from '@/lib/strapi'
import { DynamicZone } from '@/components/organisms/DynamicZone'

export default async function MagazinPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getMagazinPage(locale).catch(() => null)
  if (!page) notFound()
  return <DynamicZone sections={page.sections} locale={locale} />
}
