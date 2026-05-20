import Image from 'next/image'
import type { HeroDTO } from '@repo/types'
import { Button } from '../atoms/Button'
import { Eyebrow } from '../atoms/Eyebrow'
import { getAccent, accentRootClass } from '@/lib/accent'

interface HeroSectionProps {
  section: HeroDTO
  locale: string
}

export function HeroSection({ section, locale: _locale }: HeroSectionProps) {
  const a = getAccent(section.accent)
  const hasMedia = !!section.media && section.mediaPosition !== 'none'
  const reverse = section.mediaPosition === 'left'
  const statsItems = section.statsStrip?.items ?? []
  const overlayStats = hasMedia ? statsItems.slice(0, 2) : []
  const stripStats = hasMedia && overlayStats.length > 0 ? [] : statsItems

  const grid = hasMedia
    ? `grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center ${reverse ? 'lg:[&>:first-child]:order-2' : ''}`
    : 'max-w-3xl'

  return (
    <section
      className={`${a.background} ${accentRootClass(section.accent)} relative overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-24`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={grid}>
          <div>
            {section.eyebrow && <Eyebrow label={section.eyebrow} accent={section.accent} />}
            <h1 className={`text-5xl lg:text-7xl font-serif font-medium leading-[1] ${a.text} mb-6`}>
              {section.title}
              {section.titleItalic && (
                <>
                  <br />
                  <span className={a.italic}>{section.titleItalic}</span>
                </>
              )}
            </h1>
            {section.subtitle && (
              <p className={`text-lg lg:text-xl max-w-xl leading-relaxed ${a.textMuted} mb-10`}>
                {section.subtitle}
              </p>
            )}
            {section.ctaButtons?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {section.ctaButtons.map((btn) => (
                  <Button
                    key={btn.href}
                    href={btn.href}
                    variant={a.isDark && btn.variant === 'outline' ? 'ghost-light' : btn.variant}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
            {stripStats.length > 0 && (
              <div className={`mt-12 pt-8 border-t ${a.border} grid grid-cols-2 sm:grid-cols-3 gap-6`}>
                {stripStats.map((stat) => (
                  <div key={stat.id}>
                    <div className={`text-2xl lg:text-3xl font-serif ${a.italic.split(' ')[0]}`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs uppercase tracking-[0.2em] mt-1 ${a.textMuted}`}>
                      {stat.label}
                    </div>
                    {stat.caption && (
                      <div className={`text-xs mt-1 ${a.textMuted}`}>{stat.caption}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {hasMedia && section.media && (
            <div className="relative w-full">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[620px] w-full rounded-lg overflow-hidden border border-[var(--color-navy-line)]">
                <Image
                  src={section.media.url}
                  alt={section.media.alt || section.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {overlayStats[0] && (
                <div className="hidden md:block absolute top-10 -left-6 lg:-left-10 bg-[var(--color-navy-soft)] border border-[var(--color-navy-line)] border-l-[3px] border-l-[var(--color-forest-bright)] rounded-lg py-4 px-6 backdrop-blur-sm shadow-xl">
                  <div className="text-3xl font-serif font-medium text-white leading-none">
                    {overlayStats[0].value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] mt-1.5 font-semibold text-[var(--color-forest-bright)]">
                    {overlayStats[0].label}
                  </div>
                </div>
              )}
              {overlayStats[1] && (
                <div className="hidden md:block absolute bottom-14 -right-4 lg:-right-5 bg-[var(--color-navy-soft)] border border-[var(--color-navy-line)] border-l-[3px] border-l-[var(--color-forest-bright)] rounded-lg py-4 px-6 backdrop-blur-sm shadow-xl">
                  <div className="text-3xl font-serif font-medium text-white leading-none">
                    {overlayStats[1].value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] mt-1.5 font-semibold text-[var(--color-forest-bright)]">
                    {overlayStats[1].label}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
