import type { CtaBannerDTO } from '@repo/types'
import { Button } from '../atoms/Button'
import { getAccent, accentRootClass } from '@/lib/accent'

interface CTABannerProps {
  section: CtaBannerDTO
}

export function CTABanner({ section }: CTABannerProps) {
  const a = getAccent(section.accent ?? 'navy')
  return (
    <section className={`${a.background} ${accentRootClass(section.accent ?? 'navy')} py-24`}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <h2 className={`text-4xl lg:text-5xl font-serif font-medium mb-6 leading-tight ${a.text}`}>
          {section.heading}
        </h2>
        {section.subheading && (
          <p className={`text-lg mb-10 leading-relaxed ${a.textMuted}`}>{section.subheading}</p>
        )}
        {section.cta && (
          <Button href={section.cta.href} variant="primary">
            {section.cta.label}
          </Button>
        )}
      </div>
    </section>
  )
}
