import { notFound } from 'next/navigation'
import { getEvents, getEvent } from '@/lib/strapi'
import { getDictionary } from '@/lib/dictionaries'
import { EventDetail } from '@/components/organisms/EventDetail'
import type { Locale } from '@/proxy'

const locales: Locale[] = ['ro', 'en']

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const events = await getEvents(locale).catch(() => [])
      return events.map((e) => ({ locale, slug: e.slug }))
    })
  )
  return params.flat()
}

export const dynamicParams = true

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const [event, dict] = await Promise.all([
    getEvent(slug, locale),
    getDictionary(locale as Locale),
  ])

  if (!event) notFound()

  return <EventDetail event={event} registerLabel={dict.events.register} />
}
