import Image from 'next/image'
import type { ImageTextSplitDTO } from '@repo/types'
import { Button } from '../atoms/Button'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass } from '@/lib/accent'

interface ImageTextSplitProps {
  section: ImageTextSplitDTO
}

export function ImageTextSplit({ section }: ImageTextSplitProps) {
  const a = getAccent(section.accent)
  const reverse = section.imageSide === 'left'
  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-24`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reverse ? 'lg:[&>:first-child]:order-2' : ''}`}>
          <div>
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading ?? ''}
              accent={section.accent}
            />
            {section.body && (
              <div
                className={`mt-6 space-y-4 text-lg leading-relaxed ${a.textMuted} prose ${a.isDark ? 'prose-navy' : 'prose-paper'} max-w-none`}
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            )}
            {section.cta && (
              <div className="mt-8">
                <Button href={section.cta.href} variant={a.isDark ? 'ghost-light' : section.cta.variant}>
                  {section.cta.label}
                </Button>
              </div>
            )}
          </div>
          {section.image && (
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden">
              <Image
                src={section.image.url.startsWith('http') ? section.image.url : `${process.env.STRAPI_URL ?? 'http://localhost:1337'}${section.image.url}`}
                alt={section.image.alt ?? section.heading ?? ''}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
