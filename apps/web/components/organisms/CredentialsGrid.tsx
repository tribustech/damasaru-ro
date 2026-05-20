import type { CredentialsGridDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass } from '@/lib/accent'

interface CredentialsGridProps {
  section: CredentialsGridDTO
}

export function CredentialsGrid({ section }: CredentialsGridProps) {
  const a = getAccent(section.accent ?? 'paper-warm')
  return (
    <section className={`${a.background} ${accentRootClass(section.accent ?? 'paper-warm')} py-24`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <SectionHeading
          heading={section.heading ?? ''}
          accent={section.accent}
        />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {section.groups.map((group) => (
            <div key={group.id}>
              <h3 className={`text-xs uppercase tracking-[0.25em] font-semibold mb-4 ${a.eyebrow}`}>
                {group.title}
              </h3>
              <ul className={`space-y-2 text-sm ${a.textMuted}`}>
                {group.items.map((item) => (
                  <li key={item.id} className="leading-relaxed">
                    {item.label}
                    {item.sub && <span className="block text-xs opacity-70">{item.sub}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
