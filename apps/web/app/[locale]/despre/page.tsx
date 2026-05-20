import { notFound } from 'next/navigation'
import { getAboutPage } from '@/lib/strapi'
import { DynamicZone } from '@/components/organisms/DynamicZone'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getAboutPage(locale).catch(() => null)
  if (!page) notFound()
  return <DynamicZone sections={page.sections} locale={locale} />
}
