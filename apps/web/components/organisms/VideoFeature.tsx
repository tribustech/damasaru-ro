import type { VideoFeatureDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass } from '@/lib/accent'

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
  return (
    <section className={`${a.background} ${accentRootClass(section.accent ?? 'navy')} py-24`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <SectionHeading
          heading={section.heading ?? ''}
          accent={section.accent}
          align="center"
        />
        {section.caption && (
          <p className={`mt-6 text-lg max-w-2xl mx-auto text-center ${a.textMuted}`}>{section.caption}</p>
        )}
        <div className={`mt-12 aspect-video w-full rounded-3xl overflow-hidden border ${a.border}`}>
          <iframe
            src={toEmbed(section.videoUrl)}
            title={section.heading ?? ''}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
