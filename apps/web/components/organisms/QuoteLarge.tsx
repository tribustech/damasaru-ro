import type { QuoteLargeDTO } from '@repo/types'
import { getAccent, accentRootClass, getZoneClass } from '@/lib/accent'

interface QuoteLargeProps {
  section: QuoteLargeDTO
}

export function QuoteLarge({ section }: QuoteLargeProps) {
  const a = getAccent(section.accent ?? 'navy')
  return (
    <section className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)}`}>
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <blockquote
          className={`text-3xl lg:text-5xl font-serif italic leading-[1.2] ${a.text}`}
          style={{ color: 'var(--color-gold)' }}
        >
          "{section.quote}"
        </blockquote>
        {section.author && (
          <div className={`mt-8 text-sm uppercase tracking-[0.2em] ${a.textMuted}`}>
            {section.author}
          </div>
        )}
      </div>
    </section>
  )
}
