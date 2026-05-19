import { SectionHeading } from '../molecules/SectionHeading'
import { TestimonialCard } from '../molecules/TestimonialCard'
import type { SectionTestimonials } from '@repo/types'

interface TestimonialsSectionProps {
  section: SectionTestimonials
  eyebrow?: string
  heading?: string
}

export function TestimonialsSection({ section, eyebrow, heading }: TestimonialsSectionProps) {
  return (
    <section className="py-24" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {heading && (
          <div className="mb-16 text-center">
            <SectionHeading eyebrow={eyebrow} heading={heading} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {section.items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
