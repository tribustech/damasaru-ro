import type { TestimonialsDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { TestimonialCard } from '../molecules/TestimonialCard'
import { getAccent, accentRootClass, getZoneClass } from '@/lib/accent'

interface TestimonialsSectionProps {
  section: TestimonialsDTO
  locale: string
}

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const a = getAccent(section.accent)
  return (
    <section className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {(section.heading || section.eyebrow) && (
          <div className="mb-16 text-center">
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading ?? ''}
              accent={section.accent}
              align="center"
            />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {section.items.map((item, idx) => (
            <TestimonialCard key={item.id} item={item} accent={section.accent} featured={idx === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
