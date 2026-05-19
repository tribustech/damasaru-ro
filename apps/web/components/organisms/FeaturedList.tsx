import type { SectionFeaturedList, Article, Event } from '@repo/types'
import { getArticles, getEvents } from '../../lib/strapi'
import { ArticleCard } from '../molecules/ArticleCard'
import { EventCard } from '../molecules/EventCard'
import { SectionHeading } from '../molecules/SectionHeading'

interface FeaturedListProps {
  section: SectionFeaturedList
  locale: string
  readMoreLabel: string
  registerLabel: string
}

export async function FeaturedList({ section, locale, readMoreLabel, registerLabel }: FeaturedListProps) {
  let articles: Article[] = []
  let events: Event[] = []

  if (section.relation === 'articles') {
    const all = await getArticles(locale).catch(() => [])
    articles = all.slice(0, 3)
  } else {
    const all = await getEvents(locale).catch(() => [])
    events = all.slice(0, 3)
  }

  return (
    <section className="py-24" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {section.heading && (
          <div className="mb-12">
            <SectionHeading heading={section.heading} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} readMoreLabel={readMoreLabel} />
          ))}
          {events.map((e) => (
            <EventCard key={e.id} event={e} locale={locale} registerLabel={registerLabel} />
          ))}
        </div>
      </div>
    </section>
  )
}
