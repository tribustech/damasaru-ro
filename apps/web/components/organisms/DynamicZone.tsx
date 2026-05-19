import type { Section } from '@repo/types'
import { HeroSection } from './HeroSection'
import { TextBlock } from './TextBlock'
import { CardsGrid } from './CardsGrid'
import { TestimonialsSection } from './TestimonialsSection'
import { CTABanner } from './CTABanner'
import { FeaturedList } from './FeaturedList'

interface DynamicZoneProps {
  sections: Section[]
  locale: string
  readMoreLabel: string
  registerLabel: string
}

export function DynamicZone({ sections, locale, readMoreLabel, registerLabel }: DynamicZoneProps) {
  return (
    <>
      {sections.map((section) => {
        const key = `${section.__component}-${section.id}`
        switch (section.__component) {
          case 'sections.hero':
            return <HeroSection key={key} section={section} />
          case 'sections.text-block':
            return <TextBlock key={key} section={section} />
          case 'sections.cards-grid':
            return <CardsGrid key={key} section={section} />
          case 'sections.testimonials':
            return <TestimonialsSection key={key} section={section} />
          case 'sections.cta-banner':
            return <CTABanner key={key} section={section} />
          case 'sections.featured-list':
            return (
              <FeaturedList
                key={key}
                section={section}
                locale={locale}
                readMoreLabel={readMoreLabel}
                registerLabel={registerLabel}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
