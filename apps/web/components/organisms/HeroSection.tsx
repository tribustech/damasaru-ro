import { Button } from '../atoms/Button'
import { Eyebrow } from '../atoms/Eyebrow'
import type { SectionHero } from '@repo/types'

interface HeroSectionProps {
  section: SectionHero
  eyebrow?: string
}

export function HeroSection({ section, eyebrow }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow label={eyebrow} />}
          <h1
            className="text-6xl lg:text-7xl mb-6 leading-[1.05] font-serif font-light"
            style={{ color: '#2D241E' }}
          >
            {section.title}
          </h1>
          {section.subtitle && (
            <p
              className="text-lg lg:text-xl mb-10 leading-relaxed max-w-xl"
              style={{ color: '#6B5F54' }}
            >
              {section.subtitle}
            </p>
          )}
          {section.ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {section.ctaButtons.map((btn) => (
                <Button key={btn.id} href={btn.href} variant={btn.variant}>
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
