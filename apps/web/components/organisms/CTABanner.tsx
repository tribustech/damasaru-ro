import { Button } from '../atoms/Button'
import type { SectionCtaBanner } from '@repo/types'

interface CTABannerProps {
  section: SectionCtaBanner
}

export function CTABanner({ section }: CTABannerProps) {
  return (
    <section className="py-24" style={{ backgroundColor: '#2D241E' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <h2
          className="text-4xl lg:text-5xl font-serif font-light mb-6"
          style={{ color: '#FAF8F5' }}
        >
          {section.heading}
        </h2>
        {section.subtext && (
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(250,248,245,0.6)' }}>
            {section.subtext}
          </p>
        )}
        <Button href={section.buttonHref} variant="primary">
          {section.buttonLabel}
        </Button>
      </div>
    </section>
  )
}
