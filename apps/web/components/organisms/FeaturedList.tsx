import Link from 'next/link'
import Image from 'next/image'
import type {
  FeaturedListDTO,
  PodcastEpisodeDTO,
  ArticleDTO,
  ProjectDTO,
  EventDTO,
} from '@repo/types'
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

const fallbackContainer: Record<string, string> = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  row: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  marquee: 'flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4',
  feature: 'space-y-12',
}

export function FeaturedList({ section, locale }: FeaturedListProps) {
  const a = getAccent(section.accent)
  const layout = section.layout ?? 'grid'

  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-20 lg:py-28`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 max-w-3xl">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading ?? ''}
            headingItalic={section.headingItalic}
            lead={section.subheading}
            accent={section.accent}
          />
        </div>
        <LayoutBody section={section} layout={layout} locale={locale} />
        {section.seeAllHref && section.seeAllLabel && (
          <div className="mt-10">
            <Link
              href={section.seeAllHref}
              className={`inline-block text-sm font-medium border-b ${
                a.isDark
                  ? 'text-[var(--color-gold)] border-[var(--color-gold)] hover:text-white hover:border-white'
                  : 'text-[var(--color-gold-deep)] border-[var(--color-gold-deep)] hover:text-[var(--color-navy)] hover:border-[var(--color-navy)]'
              } pb-0.5 transition-colors`}
            >
              {section.seeAllLabel} →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function LayoutBody({ section, layout, locale }: { section: FeaturedListDTO; layout: string; locale: string }) {
  if (layout === 'featured-with-list' && section.relation === 'podcast-episodes') {
    return <PodcastFeaturedWithList items={section.items} locale={locale} />
  }
  if (layout === 'featured-with-grid' && section.relation === 'articles') {
    return <ArticlesFeaturedWithGrid items={section.items} locale={locale} />
  }
  if (layout === 'list-rows' && section.relation === 'projects') {
    return <ProjectsListRows items={section.items} locale={locale} />
  }
  if (layout === 'event-banner' && section.relation === 'events') {
    return <EventBanner items={section.items} locale={locale} />
  }

  return (
    <div className={fallbackContainer[layout] ?? fallbackContainer.grid}>
      <DefaultCards section={section} locale={locale} />
    </div>
  )
}

function DefaultCards({ section, locale }: { section: FeaturedListDTO; locale: string }) {
  switch (section.relation) {
    case 'articles':
      return section.items.map((item) => (
        <ArticleCard key={item.id} article={item} locale={locale} accent={section.accent} />
      ))
    case 'events':
      return section.items.map((item) => (
        <EventCard key={item.id} event={item} locale={locale} accent={section.accent} />
      ))
    case 'podcast-episodes':
      return section.items.map((item) => (
        <PodcastEpisodeCard key={item.id} episode={item} locale={locale} accent={section.accent} />
      ))
    case 'projects':
      return section.items.map((item) => (
        <ProjectCard key={item.id} project={item} locale={locale} accent={section.accent} />
      ))
    case 'products':
      return section.items.map((item) => (
        <ProductCard key={item.id} product={item} accent={section.accent} />
      ))
    case 'testimonials':
      return section.items.map((item, idx) => (
        <TestimonialCard key={item.id} item={item} accent={section.accent} featured={idx === 0} />
      ))
    case 'press-mentions':
      return section.items.map((item) => (
        <PressMentionCard key={item.id} mention={item} accent={section.accent} />
      ))
  }
}

function PodcastFeaturedWithList({ items, locale }: { items: PodcastEpisodeDTO[]; locale: string }) {
  if (items.length === 0) return null
  const [feature, ...rest] = items
  const featureHref = `/${locale}/podcast/${feature.slug}`
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
      <Link
        href={featureHref}
        className="group relative overflow-hidden bg-[var(--color-navy)] text-white rounded-xl border-l-4 border-l-[var(--color-forest-bright)] p-10 lg:p-12 min-h-[420px] flex flex-col justify-between shadow-[0_24px_48px_-16px_rgba(20,32,46,.25)]"
      >
        <div
          className="absolute -top-1/2 -right-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,106,.15) 0%, transparent 60%)' }}
        />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-forest)] text-[10px] tracking-[0.2em] uppercase font-semibold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FCBA8] animate-pulse" />
            Episod nou
          </span>
          <h3 className="font-serif text-3xl lg:text-4xl font-medium leading-tight my-6">{feature.title}</h3>
          <div className="flex gap-6 text-sm text-[var(--color-text-light)] mb-7">
            <span>Ep. {feature.number}</span>
            {feature.duration && (
              <>
                <span>·</span>
                <span>{feature.duration}</span>
              </>
            )}
            {feature.date && (
              <>
                <span>·</span>
                <span>{formatDate(feature.date, locale)}</span>
              </>
            )}
          </div>
        </div>
        <div className="relative z-10 inline-flex items-center gap-3.5 text-sm font-medium">
          <span className="w-12 h-12 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] flex items-center justify-center text-base group-hover:bg-[var(--color-gold-bright)] group-hover:scale-105 transition-all">
            ▶
          </span>
          Ascultă acum
        </div>
      </Link>

      <div className="flex flex-col gap-px bg-[var(--color-navy-line)] rounded-lg overflow-hidden">
        {rest.map((ep) => (
          <Link
            key={ep.id}
            href={`/${locale}/podcast/${ep.slug}`}
            className="bg-[var(--color-navy)] p-6 flex justify-between items-start gap-5 hover:bg-[var(--color-navy-soft)] transition-colors"
          >
            <div className="flex-1">
              <div className="font-serif italic text-[var(--color-gold-deep)] text-sm">Ep. {ep.number}</div>
              <h4 className="text-[15px] font-medium leading-snug my-1.5 text-white">{ep.title}</h4>
              <div className="text-xs text-[var(--color-text-soft)]">
                {ep.duration && <span>{ep.duration}</span>}
                {ep.duration && ep.date && <span> · </span>}
                {ep.date && <span>{formatDate(ep.date, locale)}</span>}
              </div>
            </div>
            <div className="font-serif italic text-[var(--color-gold-deep)]">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ArticlesFeaturedWithGrid({ items, locale }: { items: ArticleDTO[]; locale: string }) {
  if (items.length === 0) return null
  const [feature, ...rest] = items
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-start mb-16 lg:mb-20">
        <div>
          <div className="flex gap-4 items-center mb-6 flex-wrap">
            {feature.tags[0] && (
              <span className="bg-[var(--color-forest)] text-white text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 rounded-full">
                {feature.tags[0]}
              </span>
            )}
            {feature.date && (
              <span className="text-[var(--color-text-soft)] text-xs">{formatDate(feature.date, locale)}</span>
            )}
          </div>
          <Link href={`/${locale}/idei/${feature.slug}`}>
            <h3 className="font-serif text-4xl lg:text-5xl font-medium leading-tight tracking-tight mb-6 text-white hover:text-[var(--color-gold)] transition-colors">
              {feature.title}
            </h3>
          </Link>
          {feature.excerpt && (
            <p className="text-lg text-[var(--color-text-light)] leading-relaxed mb-7 font-light">{feature.excerpt}</p>
          )}
          {feature.readTime && (
            <div className="text-xs text-[var(--color-text-soft)] tracking-wide">{feature.readTime}</div>
          )}
        </div>
        <Link href={`/${locale}/idei/${feature.slug}`} className="block">
          <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden border border-[var(--color-navy-line)] border-t-[3px] border-t-[var(--color-forest-bright)] bg-gradient-to-br from-[var(--color-navy-soft)] to-[var(--color-navy)]">
            {feature.cover && (
              <Image
                src={feature.cover.url}
                alt={feature.cover.alt || feature.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            )}
          </div>
        </Link>
      </div>

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[var(--color-navy-line)]">
          {rest.map((article, idx) => (
            <Link
              key={article.id}
              href={`/${locale}/idei/${article.slug}`}
              className={`block py-8 ${idx > 0 ? 'md:pl-8' : ''} ${idx < rest.length - 1 ? 'md:pr-8 md:border-r border-[var(--color-navy-line)]' : ''} hover:bg-[var(--color-navy-soft)]/40 transition-colors`}
            >
              {article.tags[0] && (
                <span className="inline-block bg-[var(--color-forest)] text-white text-[10px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 rounded-full">
                  {article.tags[0]}
                </span>
              )}
              <h4 className="font-serif text-xl lg:text-2xl font-medium leading-snug my-3.5 text-white">
                {article.title}
              </h4>
              {article.excerpt && (
                <p className="text-[13px] text-[var(--color-text-light)] leading-relaxed font-light line-clamp-3">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-4 text-[11px] text-[var(--color-text-soft)] tracking-wide">
                {article.readTime}
                {article.readTime && article.date && ' · '}
                {article.date && formatDate(article.date, locale)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function ProjectsListRows({ items, locale }: { items: ProjectDTO[]; locale: string }) {
  return (
    <div className="flex flex-col">
      {items.map((project, idx) => {
        const href = project.url ?? `/${locale}/proiecte/${project.slug}`
        const isExternal = !!project.url
        const num = String(idx + 1).padStart(2, '0')
        const content = (
          <>
            <div className="font-serif italic text-2xl text-[var(--color-forest)]">{num}</div>
            <div className="font-serif text-2xl lg:text-3xl font-medium tracking-tight text-[var(--color-navy)]">
              {project.name}
            </div>
            <div className="text-[15px] text-[var(--color-text-mid)] leading-relaxed">
              {project.tagline ?? project.description}
            </div>
            <div className="justify-self-end inline-flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-[var(--color-navy)] hover:text-[var(--color-gold-deep)] transition-colors">
              Vezi →
            </div>
          </>
        )
        const className = `grid grid-cols-[60px_1fr_2fr_140px] lg:grid-cols-[80px_1fr_2fr_200px] gap-6 lg:gap-8 py-8 lg:py-9 border-b border-[var(--color-line)] items-center cursor-pointer transition-[padding] duration-300 hover:pl-4`
        return isExternal ? (
          <a key={project.id} href={href} target="_blank" rel="noreferrer" className={className}>
            {content}
          </a>
        ) : (
          <Link key={project.id} href={href} className={className}>
            {content}
          </Link>
        )
      })}
    </div>
  )
}

function EventBanner({ items, locale }: { items: EventDTO[]; locale: string }) {
  if (items.length === 0) return null
  const event = items[0]
  return (
    <div
      className="relative overflow-hidden bg-[var(--color-navy)] text-white rounded-xl p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-12 items-center border border-[var(--color-navy-line)] shadow-[0_32px_64px_-20px_rgba(20,32,46,.3)]"
    >
      <div
        className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,106,.12) 0%, transparent 70%)' }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 text-[var(--color-gold)] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
          {event.status === 'viitor' ? 'Înscrieri deschise' : 'Eveniment trecut'}
        </div>
        <h3 className="font-serif text-3xl lg:text-5xl font-medium leading-tight tracking-tight text-white mb-6">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="text-base lg:text-lg text-[var(--color-text-light)] leading-relaxed mb-6 font-light">
            {event.subtitle}
          </p>
        )}
        <div className="flex gap-8 my-6 flex-wrap">
          {event.date && (
            <div className="flex flex-col gap-1">
              <div className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[var(--color-text-dim)]">Data</div>
              <div className="text-[15px] text-white font-medium">{formatDate(event.date, locale)}</div>
            </div>
          )}
          {(event.city || event.venue) && (
            <div className="flex flex-col gap-1">
              <div className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[var(--color-text-dim)]">Locație</div>
              <div className="text-[15px] text-white font-medium">
                {[event.city, event.venue].filter(Boolean).join(' · ')}
              </div>
            </div>
          )}
        </div>
        <Link
          href={`/${locale}/evenimente/${event.slug}`}
          className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-navy)] text-sm font-semibold px-6 py-3 rounded-full hover:bg-[var(--color-gold-bright)] transition-colors"
        >
          Rezervă-ți locul →
        </Link>
      </div>
      <div className="relative z-10 bg-[var(--color-navy-soft)] border border-[var(--color-navy-line)] rounded-lg p-8 text-center">
        <div className="font-serif text-5xl lg:text-6xl text-[var(--color-gold)] font-medium leading-none">
          {event.date ? formatDay(event.date) : '—'}
        </div>
        <div className="text-xs text-[var(--color-text-light)] mt-2 mb-6 tracking-wide">
          {event.date ? formatMonth(event.date, locale) : ''}
        </div>
        <Link
          href={`/${locale}/evenimente/${event.slug}`}
          className="text-[var(--color-gold)] text-xs border-b border-[var(--color-gold)] hover:text-white hover:border-white transition-colors"
        >
          Detalii eveniment →
        </Link>
      </div>
    </div>
  )
}

function formatDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return new Intl.DateTimeFormat(locale === 'ro' ? 'ro-RO' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return iso
  }
}

function formatDay(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return String(d.getDate())
  } catch {
    return ''
  }
}

function formatMonth(iso: string, locale: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat(locale === 'ro' ? 'ro-RO' : 'en-US', {
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}
