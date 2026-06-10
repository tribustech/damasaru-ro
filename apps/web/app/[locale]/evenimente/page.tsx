import { notFound } from 'next/navigation'
import { getEventsPage } from '@/lib/strapi'
import { DynamicZone } from '@/components/organisms/DynamicZone'

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getEventsPage(locale).catch(() => null)
  if (!page) notFound()
  return (
    <div className="page-evenimente">
      <DynamicZone sections={page.sections} locale={locale} />
    </div>
  )
}
