import type { StatsStripDTO } from '@repo/types'
import { getAccent, accentRootClass } from '@/lib/accent'

interface StatsStripProps {
  section: StatsStripDTO
}

export function StatsStrip({ section }: StatsStripProps) {
  const a = getAccent(section.accent ?? 'navy')
  return (
    <section className={`${a.background} ${accentRootClass(section.accent ?? 'navy')} py-16 border-t border-b ${a.border}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(section.items?.length || 3, 4)} gap-8 text-center`}>
          {section.items?.map((stat) => (
            <div key={stat.id}>
              <div className={`text-3xl lg:text-4xl font-serif ${a.italic.split(' ')[0]}`}>{stat.value}</div>
              <div className={`text-xs uppercase tracking-[0.2em] mt-2 font-semibold ${a.textMuted}`}>
                {stat.label}
              </div>
              {stat.caption && <div className={`text-xs mt-1 ${a.textMuted}`}>{stat.caption}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
