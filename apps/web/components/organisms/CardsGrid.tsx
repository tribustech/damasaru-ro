import Link from 'next/link'
import type { CardsGridDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass } from '@/lib/accent'

interface CardsGridProps {
  section: CardsGridDTO
}

export function CardsGrid({ section }: CardsGridProps) {
  const a = getAccent(section.accent)
  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-24`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {(section.heading || section.eyebrow) && (
          <div className="mb-16">
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading ?? ''}
              accent={section.accent}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.items.map((item) => {
            const inner = (
              <div
                className={`h-full p-8 rounded-2xl border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'} transition-colors hover:border-[var(--color-gold)]`}
              >
                <h3 className={`text-2xl font-serif mb-3 ${a.text}`}>{item.title}</h3>
                <p className={`text-base leading-relaxed ${a.textMuted}`}>{item.body}</p>
              </div>
            )
            return item.cta?.href ? (
              <Link key={item.id} href={item.cta.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={item.id}>{inner}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
