import { SectionHeading } from '../molecules/SectionHeading'
import type { SectionTextBlock } from '@repo/types'

interface TextBlockProps {
  section: SectionTextBlock
  dark?: boolean
}

export function TextBlock({ section, dark = false }: TextBlockProps) {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: dark ? '#2D241E' : '#FAF8F5' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            dark={dark}
          />
          {section.body && (
            <div
              className="mt-6 prose prose-lg max-w-none"
              style={{ color: dark ? 'rgba(250,248,245,0.7)' : '#6B5F54' }}
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
