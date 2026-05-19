import { getEvents } from '@/lib/strapi'
import { getDictionary } from '@/lib/dictionaries'
import { EventsList } from '@/components/organisms/EventsList'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import type { Locale } from '@/proxy'

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [events, dict] = await Promise.all([
    getEvents(locale).catch(() => []),
    getDictionary(locale as Locale),
  ])

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-12">
          <Eyebrow label={dict.nav.events} />
          <h1 className="text-5xl font-serif font-light" style={{ color: '#2D241E' }}>
            {dict.nav.events}
          </h1>
        </div>
        <EventsList
          events={events}
          locale={locale}
          registerLabel={dict.events.register}
          allLabel={dict.events.all}
          upcomingLabel={dict.events.upcoming}
          pastLabel={dict.events.past}
          noEventsLabel={dict.events.noEvents}
        />
      </section>
    </div>
  )
}
