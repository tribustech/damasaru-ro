import { SectionHeading } from '../molecules/SectionHeading'
import { TakeawayItem } from '../molecules/TakeawayItem'
import type { SectionCardsGrid } from '@repo/types'

interface CardsGridProps {
  section: SectionCardsGrid
  dark?: boolean
}

export function CardsGrid({ section, dark = false }: CardsGridProps) {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: dark ? '#2D241E' : '#FAF8F5' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {section.heading && (
          <div className="mb-16">
            <SectionHeading heading={section.heading} dark={dark} />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border"
              style={{
                borderColor: dark ? 'rgba(184,134,111,0.2)' : 'rgba(45,36,30,0.08)',
                backgroundColor: dark ? 'rgba(184,134,111,0.05)' : 'white',
              }}
            >
              <TakeawayItem
                iconName={item.iconName}
                title={item.title}
                text={item.text}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
