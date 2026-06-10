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
import { EventWaitlistForm } from '../molecules/EventWaitlistForm'
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

const ZONE_BY_ACCENT: Record<string, string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

export function FeaturedList({ section, locale }: FeaturedListProps) {
  const a = getAccent(section.accent)
  const layout = section.layout ?? 'grid'
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-light'

  return (
    <section className={`${zoneClass} ${accentRootClass(section.accent)}`}>
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
        {/* event-banner layouts render their own CTA inside the card; skip the outer link */}
        {layout !== 'event-banner' && section.seeAllHref && section.seeAllLabel && (
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
    return <ArticlesFeaturedWithGrid items={section.items} locale={locale} accent={section.accent} />
  }
  if (layout === 'list-rows' && section.relation === 'projects') {
    return <ProjectsListRows items={section.items} locale={locale} />
  }
  if (layout === 'event-banner' && section.relation === 'events') {
    return (
      <EventBanner
        items={section.items}
        locale={locale}
        ctaHref={section.seeAllHref ?? null}
        ctaLabel={section.seeAllLabel ?? null}
      />
    )
  }
  if (layout === 'marquee' && section.relation === 'testimonials') {
    return <TestimonialsScroller items={section.items} />
  }
  if (layout === 'grid' && section.relation === 'podcast-episodes') {
    const ordered = [...section.items].sort((a, b) => a.number - b.number)
    return (
      <div className="episodes-grid">
        {ordered.map((item) => (
          <PodcastEpisodeCard key={item.id} episode={item} locale={locale} />
        ))}
      </div>
    )
  }
  if (layout === 'feature' && section.relation === 'podcast-episodes') {
    return <LatestEpisodeFeature items={section.items} locale={locale} />
  }

  return (
    <div className={fallbackContainer[layout] ?? fallbackContainer.grid}>
      <DefaultCards section={section} locale={locale} />
    </div>
  )
}

function LatestEpisodeFeature({ items, locale }: { items: PodcastEpisodeDTO[]; locale: string }) {
  const ep = items[0]
  if (!ep) return null
  const href = `/${locale}/podcast/${ep.slug}`
  return (
    <div className="latest-card">
      <div className="latest-thumbnail-real">
        {ep.cover?.url && (
          <Image
            src={ep.cover.url}
            alt={ep.cover.alt || ep.title}
            width={ep.cover.width || 1280}
            height={ep.cover.height || 720}
            sizes="(max-width: 968px) 100vw, 60vw"
          />
        )}
        <Link href={href} className="latest-play-btn-overlay" aria-label="Ascultă episodul">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </Link>
      </div>
      <div>
        <div className="latest-meta">
          EP. {String(ep.number).padStart(2, '0')} · CE&rsquo;AI LA MANSARDĂ
        </div>
        <h3 className="latest-title">{ep.title}</h3>
        {ep.description && (
          <p className="latest-description">{`„${ep.description}"`}</p>
        )}
        <div className="latest-buttons">
          <Link href={href} className="btn btn-primary">
            Ascultă acum <span aria-hidden>→</span>
          </Link>
          <Link href={`/${locale}/podcast`} className="btn btn-ghost">
            Toate episoadele
          </Link>
        </div>
      </div>
    </div>
  )
}

function TestimonialsScroller({ items }: { items: import('@repo/types').TestimonialDTO[] }) {
  if (items.length === 0) return null
  const renderCard = (t: import('@repo/types').TestimonialDTO, key: string, ariaHidden = false) => (
    <div key={key} className="review-card" aria-hidden={ariaHidden || undefined}>
      <div className="review-stars">★★★★★</div>
      <div className="review-text">{`„${t.quote}"`}</div>
      <div className="review-author">
        {t.author}
        {t.role && <span>{t.role}</span>}
      </div>
    </div>
  )
  return (
    <div className="reviews-scroll">
      {/* Track is duplicated so the marquee loops seamlessly; the clone is
          hidden from assistive tech to avoid reading every quote twice. */}
      <div className="reviews-track">
        {items.map((t) => renderCard(t, `a-${t.id}`))}
        {items.map((t) => renderCard(t, `b-${t.id}`, true))}
      </div>
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
        <EventCard
          key={item.id}
          event={item}
          locale={locale}
          accent={section.accent}
          interactive={item.status === 'viitor'}
        />
      ))
    case 'podcast-episodes':
      return section.items.map((item) => (
        <PodcastEpisodeCard key={item.id} episode={item} locale={locale} />
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

      <div className="flex flex-col gap-px bg-[var(--color-line)] rounded-lg overflow-hidden">
        {rest.map((ep) => (
          <Link
            key={ep.id}
            href={`/${locale}/podcast/${ep.slug}`}
            className="bg-white p-6 flex justify-between items-start gap-5 hover:bg-[var(--color-paper-warm)] transition-colors"
          >
            <div className="flex-1">
              <div className="font-serif italic text-[var(--color-gold-deep)] text-sm">Ep. {ep.number}</div>
              <h4 className="text-[15px] font-medium leading-snug my-1.5 text-[var(--color-navy)]">{ep.title}</h4>
              <div className="text-xs text-[var(--color-text-soft)]">
                {ep.duration && <span>{ep.duration}</span>}
                {ep.duration && ep.date && <span> · </span>}
                {ep.date && <span>{formatDate(ep.date, locale)}</span>}
              </div>
            </div>
            <div className="font-serif italic text-[var(--color-gold-deep)] self-center">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ArticlesFeaturedWithGrid({
  items,
  locale,
  accent,
}: {
  items: ArticleDTO[]
  locale: string
  accent: FeaturedListDTO['accent']
}) {
  if (items.length === 0) return null
  const [feature, ...rest] = items
  const isDark = accent === 'navy' || accent === 'navy-deep'

  const titleCls = isDark
    ? 'text-white hover:text-[var(--color-gold)]'
    : 'text-[var(--color-navy)] hover:text-[var(--color-gold-deep)]'
  const excerptCls = isDark ? 'text-[var(--color-text-light)]' : 'text-[var(--color-text-mid)]'
  const metaCls = isDark ? 'text-[var(--color-text-soft)]' : 'text-[var(--color-text-mid)]'
  const lineCls = isDark ? 'border-[var(--color-navy-line)]' : 'border-[var(--color-line)]'
  const restHover = isDark ? 'hover:bg-[var(--color-navy-soft)]/40' : 'hover:bg-[var(--color-paper-warm)]/60'
  const coverBox = isDark
    ? 'border border-[var(--color-navy-line)] bg-gradient-to-br from-[var(--color-navy-soft)] to-[var(--color-navy)]'
    : 'border border-[var(--color-line)] bg-[var(--color-paper-warm)]'
  const newPill = isDark
    ? 'bg-[var(--color-forest)] text-white'
    : 'bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)]'
  const catPill = isDark
    ? 'bg-[var(--color-forest)] text-white'
    : 'bg-[var(--color-paper-warm)] text-[var(--color-text-mid)]'
  const ctaCls = isDark ? 'text-[var(--color-gold)]' : 'text-[var(--color-gold-deep)]'

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start mb-16 lg:mb-20">
        <Link href={`/${locale}/idei/${feature.slug}`} className="block">
          <div
            className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden border-t-[3px] border-t-[var(--color-gold)] ${coverBox}`}
          >
            {feature.cover && (
              <Image
                src={feature.cover.url}
                alt={feature.cover.alt || feature.title}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            )}
          </div>
        </Link>
        <div>
          <div className="flex gap-4 items-center mb-6 flex-wrap">
            <span
              className={`${newPill} text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 rounded-full`}
            >
              Articol nou
            </span>
            {feature.date && <span className={`${metaCls} text-xs`}>{formatDate(feature.date, locale)}</span>}
            {feature.readTime && (
              <>
                <span className={`${metaCls} text-xs`}>·</span>
                <span className={`${metaCls} text-xs`}>{feature.readTime}</span>
              </>
            )}
          </div>
          <Link href={`/${locale}/idei/${feature.slug}`}>
            <h3
              className={`font-serif text-4xl lg:text-5xl font-medium leading-tight tracking-tight mb-6 transition-colors ${titleCls}`}
            >
              {feature.title}
            </h3>
          </Link>
          {feature.excerpt && (
            <p className={`text-lg leading-relaxed mb-7 font-light ${excerptCls}`}>{feature.excerpt}</p>
          )}
          <Link
            href={`/${locale}/idei/${feature.slug}`}
            className={`inline-flex items-center gap-2 text-sm font-medium ${ctaCls} hover:gap-3 transition-all`}
          >
            Citește articolul <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {rest.length > 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t ${lineCls}`}>
          {rest.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/idei/${article.slug}`}
              className={`block py-8 px-2 -mx-2 border-b ${lineCls} ${restHover} transition-colors`}
            >
              {article.tags[0] && (
                <span
                  className={`inline-block ${catPill} text-[10px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 rounded-full`}
                >
                  {article.tags[0]}
                </span>
              )}
              <h4 className={`font-serif text-xl lg:text-2xl font-medium leading-snug my-3.5 ${isDark ? 'text-white' : 'text-[var(--color-navy)]'}`}>
                {article.title}
              </h4>
              {article.excerpt && (
                <p className={`text-[13px] leading-relaxed font-light line-clamp-3 ${excerptCls}`}>{article.excerpt}</p>
              )}
              <div className={`mt-4 text-[11px] tracking-wide ${metaCls}`}>
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

function EventBanner({
  items,
  locale,
  ctaHref,
  ctaLabel,
}: {
  items: EventDTO[]
  locale: string
  ctaHref: string | null
  ctaLabel: string | null
}) {
  if (items.length === 0) return null
  const event = items[0]
  const isExternal = !!ctaHref && /^https?:\/\//.test(ctaHref)
  // Waitlist signal: ctaHref === '#newsletter' means "no bilete yet — collect emails inline".
  const showWaitlist = ctaHref === '#newsletter'
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
        {!showWaitlist && ctaHref && ctaLabel && (
          isExternal ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-navy)] text-sm font-semibold px-6 py-3 rounded-full hover:bg-[var(--color-gold-bright)] transition-colors"
            >
              {ctaLabel} →
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-navy)] text-sm font-semibold px-6 py-3 rounded-full hover:bg-[var(--color-gold-bright)] transition-colors"
            >
              {ctaLabel} →
            </Link>
          )
        )}
      </div>
      <div className="relative z-10">
        {showWaitlist ? (
          <EventWaitlistForm
            source={event.slug}
            submitLabel={ctaLabel ? `${ctaLabel} →` : 'Anunță-mă →'}
          />
        ) : (
          <div className="bg-[var(--color-navy-soft)] border border-[var(--color-navy-line)] rounded-lg p-8 text-center">
            <div className="font-serif text-5xl lg:text-6xl text-[var(--color-gold)] font-medium leading-none">
              {event.date ? formatDay(event.date) : '—'}
            </div>
            <div className="text-xs text-[var(--color-text-light)] mt-2 tracking-wide">
              {event.date ? formatMonth(event.date, locale) : ''}
            </div>
          </div>
        )}
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
