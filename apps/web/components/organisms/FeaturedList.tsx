import Link from 'next/link'
import type { FeaturedListDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { ArticleCard } from '../molecules/ArticleCard'
import { EventCard } from '../molecules/EventCard'
import { PodcastEpisodeCard } from '../molecules/PodcastEpisodeCard'
import { ProjectCard } from '../molecules/ProjectCard'
import { ProductCard } from '../molecules/ProductCard'
import { TestimonialCard } from '../molecules/TestimonialCard'
import { PressMentionCard } from '../molecules/PressMentionCard'
import { accentRootClass, getAccent } from '@/lib/accent'

interface FeaturedListProps {
  section: FeaturedListDTO
  locale: string
}

const containerClass: Record<string, string> = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  row: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  marquee: 'flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4',
  feature: 'space-y-12',
  'featured-with-list': 'space-y-8',
  'featured-with-grid': 'space-y-8',
}

export function FeaturedList({ section, locale }: FeaturedListProps) {
  const a = getAccent(section.accent)
  const layout = section.layout ?? 'grid'

  let cards: React.ReactNode = null
  switch (section.relation) {
    case 'articles':
      cards = section.items.map((item) => (
        <ArticleCard key={item.id} article={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'events':
      cards = section.items.map((item) => (
        <EventCard key={item.id} event={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'podcast-episodes':
      cards = section.items.map((item) => (
        <PodcastEpisodeCard key={item.id} episode={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'projects':
      cards = section.items.map((item) => (
        <ProjectCard key={item.id} project={item} locale={locale} accent={section.accent} />
      ))
      break
    case 'products':
      cards = section.items.map((item) => (
        <ProductCard key={item.id} product={item} accent={section.accent} />
      ))
      break
    case 'testimonials':
      cards = section.items.map((item, idx) => (
        <TestimonialCard key={item.id} item={item} accent={section.accent} featured={idx === 0} />
      ))
      break
    case 'press-mentions':
      cards = section.items.map((item) => (
        <PressMentionCard key={item.id} mention={item} accent={section.accent} />
      ))
      break
  }

  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-20`}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={section.eyebrow}
          heading={section.heading ?? ''}
          headingItalic={section.headingItalic}
          lead={section.subheading}
          accent={section.accent}
        />
        <div className={containerClass[layout] ?? containerClass.grid}>{cards}</div>
        {section.seeAllHref && section.seeAllLabel && (
          <div className="mt-10">
            <Link href={section.seeAllHref} className="underline underline-offset-4">
              {section.seeAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
