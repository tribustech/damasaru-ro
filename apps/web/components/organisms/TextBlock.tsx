import type { TextBlockDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass } from '@/lib/accent'

interface TextBlockProps {
  section: TextBlockDTO
}

export function TextBlock({ section }: TextBlockProps) {
  const a = getAccent(section.accent)
  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-24`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading ?? ''}
            headingItalic={section.headingItalic}
            accent={section.accent}
          />
          {section.body && (
            <div
              className={`mt-8 text-lg leading-relaxed ${a.textMuted} prose ${a.isDark ? 'prose-navy' : 'prose-paper'} max-w-none`}
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
