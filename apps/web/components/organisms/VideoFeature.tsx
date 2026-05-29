import type { VideoFeatureDTO } from '@repo/types'
import Image from 'next/image'
import { Button } from '../atoms/Button'
import { getAccent, accentRootClass, getZoneClass } from '@/lib/accent'

interface VideoFeatureProps {
  section: VideoFeatureDTO
}

function toEmbed(url: string): string {
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/')
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('youtube.com/watch?v=', 'youtube.com/embed/').split('&')[0]
  }
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    const id = url.split('vimeo.com/')[1]?.split(/[?#]/)[0]
    return `https://player.vimeo.com/video/${id}`
  }
  return url
}

export function VideoFeature({ section }: VideoFeatureProps) {
  const a = getAccent(section.accent ?? 'navy')
  const isPortrait = section.orientation === 'portrait'
  const paragraphs = (section.body ?? '').split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  const hasFile = !!section.videoFile?.url
  const hasUrl = !!section.videoUrl

  const videoContainerClasses = isPortrait
    ? 'w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-[0_30px_60px_-20px_rgba(212,175,106,0.3),0_0_0_1px_rgba(212,175,106,0.2)] relative mx-auto md:mx-0'
    : `w-full aspect-video rounded-3xl overflow-hidden border ${a.border}`

  return (
    <section className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div
          className={
            isPortrait
              ? 'grid md:grid-cols-[auto_1fr] gap-12 md:gap-20 items-center max-w-[1100px] mx-auto'
              : 'flex flex-col gap-10'
          }
        >
          <div className={videoContainerClasses}>
            {hasFile ? (
              <video
                controls
                preload="metadata"
                poster={section.posterImage?.url}
                className="w-full h-full object-cover"
              >
                <source src={section.videoFile!.url} type="video/mp4" />
              </video>
            ) : hasUrl ? (
              <iframe
                src={toEmbed(section.videoUrl!)}
                title={section.heading ?? ''}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : section.posterImage?.url ? (
              <Image
                src={section.posterImage.url}
                alt={section.posterImage.alt || section.heading || ''}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          <div className={a.text}>
            {section.posterBadgeLabel && section.posterBadgeQuote && (
              <div
                className="mb-7 flex items-center gap-4 p-3.5 rounded-[10px] max-w-[420px]"
                style={{
                  background: 'rgba(212, 175, 106, 0.06)',
                  border: '1px solid rgba(212, 175, 106, 0.18)',
                }}
              >
                {section.posterBadgeImage?.url && (
                  <div
                    className="flex-shrink-0 w-16 h-20 rounded-[4px] bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${section.posterBadgeImage.url}')`,
                      border: '1px solid rgba(212, 175, 106, 0.3)',
                    }}
                    aria-label={section.posterBadgeImage.alt || ''}
                  />
                )}
                <div>
                  <div
                    className={`mb-1.5 text-[10px] font-sans font-semibold tracking-[2px] uppercase ${a.eyebrow}`}
                  >
                    {section.posterBadgeLabel}
                  </div>
                  <div
                    className={`font-serif italic text-[15px] leading-snug ${a.textMuted}`}
                  >
                    {section.posterBadgeQuote}
                  </div>
                </div>
              </div>
            )}

            {section.eyebrow && (
              <div
                className={`mb-3 text-[10px] font-sans font-semibold tracking-[1.5px] uppercase ${a.eyebrow}`}
              >
                {section.eyebrow}
              </div>
            )}

            {section.badge && (
              <span
                className="inline-block mb-5 px-4 py-[7px] rounded-full font-sans text-[11px] font-bold tracking-[2px] uppercase"
                style={{
                  background: 'var(--color-forest)',
                  color: 'var(--color-paper-warm)',
                }}
              >
                {section.badge}
              </span>
            )}

            {section.heading && (
              <h2
                className={`font-serif font-medium text-[32px] md:text-[42px] leading-[1.1] tracking-[-1px] mb-3.5 ${a.text}`}
              >
                {section.heading}
                {section.headingItalic && (
                  <>
                    {' '}
                    <em className={a.italic}>{section.headingItalic}</em>
                  </>
                )}
              </h2>
            )}

            {section.meta && (
              <p
                className={`font-serif italic text-[17px] mb-7 pb-6 border-b ${a.border} text-[var(--color-gold)]`}
              >
                {section.meta}
              </p>
            )}

            {paragraphs.length > 0 && (
              <div className="space-y-[18px]">
                {paragraphs.map((p, i) => (
                  <p key={i} className={`text-base leading-[1.75] ${a.textMuted}`}>
                    {p}
                  </p>
                ))}
              </div>
            )}

            {section.ctaButton && (
              <div className="mt-7">
                <Button
                  href={section.ctaButton.href}
                  variant={a.isDark ? 'ghost-light' : section.ctaButton.variant}
                >
                  {section.ctaButton.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
