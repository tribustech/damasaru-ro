import type { SectionDTO } from '@repo/types'
import { HeroSection } from './HeroSection'
import { TextBlock } from './TextBlock'
import { CardsGrid } from './CardsGrid'
import { TestimonialsSection } from './TestimonialsSection'
import { CTABanner } from './CTABanner'
import { FeaturedList } from './FeaturedList'
import { StatsStrip } from './StatsStrip'
import { QuoteLarge } from './QuoteLarge'
import { ImageTextSplit } from './ImageTextSplit'
import { NewsletterForm } from './NewsletterForm'
import { FaqAccordion } from './FaqAccordion'
import { LogoWall } from './LogoWall'
import { DownloadsList } from './DownloadsList'
import { VideoFeature } from './VideoFeature'
import { CredentialsGrid } from './CredentialsGrid'
import { EventFeature } from './EventFeature'
import { ContactForm } from './ContactForm'
import { ProiecteHero } from './ProiecteHero'
import { ProjectFeature } from './ProjectFeature'
import { PressWall } from './PressWall'
import MediaHero from './MediaHero'
import MediaStatStrip from './MediaStatStrip'
import MediaLogoWall from './MediaLogoWall'
import MediaFeatured from './MediaFeatured'
import MediaMagazines from './MediaMagazines'
import MediaMarquee from './MediaMarquee'
import MediaPressKit from './MediaPressKit'

interface DynamicZoneProps {
  sections: SectionDTO[]
  locale: string
}

export function DynamicZone({ sections, locale }: DynamicZoneProps) {
  return (
    <>
      {sections.map((section) => {
        const key = `${section.__component}-${section.id}`
        switch (section.__component) {
          case 'sections.hero':
            return <HeroSection key={key} section={section} locale={locale} />
          case 'sections.text-block':
            return <TextBlock key={key} section={section} />
          case 'sections.cards-grid':
            return <CardsGrid key={key} section={section} />
          case 'sections.testimonials':
            return <TestimonialsSection key={key} section={section} locale={locale} />
          case 'sections.cta-banner':
            return <CTABanner key={key} section={section} />
          case 'sections.featured-list':
            return <FeaturedList key={key} section={section} locale={locale} />
          case 'sections.stats-strip':
            return <StatsStrip key={key} section={section} />
          case 'sections.quote-large':
            return <QuoteLarge key={key} section={section} />
          case 'sections.image-text-split':
            return <ImageTextSplit key={key} section={section} />
          case 'sections.newsletter-form':
            return <NewsletterForm key={key} section={section} />
          case 'sections.faq-accordion':
            return <FaqAccordion key={key} section={section} />
          case 'sections.logo-wall':
            return <LogoWall key={key} section={section} />
          case 'sections.downloads-list':
            return <DownloadsList key={key} section={section} />
          case 'sections.video-feature':
            return <VideoFeature key={key} section={section} />
          case 'sections.credentials-grid':
            return <CredentialsGrid key={key} section={section} />
          case 'sections.event-feature':
            return <EventFeature key={key} section={section} locale={locale} />
          case 'sections.contact-form':
            return <ContactForm key={key} section={section} />
          case 'sections.proiecte-hero':
            return <ProiecteHero key={key} section={section} />
          case 'sections.project-feature':
            return <ProjectFeature key={key} section={section} />
          case 'sections.press-wall':
            return <PressWall key={key} section={section} />
          case 'sections.media-hero':
            return <MediaHero key={key} section={section} locale={locale} />
          case 'sections.media-stat-strip':
            return <MediaStatStrip key={key} section={section} locale={locale} />
          case 'sections.media-logo-wall':
            return <MediaLogoWall key={key} section={section} locale={locale} />
          case 'sections.media-featured':
            return <MediaFeatured key={key} section={section} locale={locale} />
          case 'sections.media-magazines':
            return <MediaMagazines key={key} section={section} locale={locale} />
          case 'sections.media-marquee':
            return <MediaMarquee key={key} section={section} locale={locale} />
          case 'sections.media-press-kit':
            return <MediaPressKit key={key} section={section} locale={locale} />
          default:
            return null
        }
      })}
    </>
  )
}
