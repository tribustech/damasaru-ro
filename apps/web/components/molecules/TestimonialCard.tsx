import type { TestimonialItem } from '@repo/types'
import { Avatar } from '../atoms/Avatar'

interface TestimonialCardProps {
  item: TestimonialItem
}

export function TestimonialCard({ item }: TestimonialCardProps) {
  return (
    <div
      className="p-8 rounded-2xl border"
      style={{ borderColor: 'rgba(45,36,30,0.08)', backgroundColor: 'white' }}
    >
      <p
        className="text-lg font-serif font-light leading-relaxed mb-6"
        style={{ color: '#2D241E' }}
      >
        "{item.quote}"
      </p>
      <div className="flex items-center gap-3">
        <Avatar photo={item.photo} name={item.author} size={40} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#2D241E' }}>
            {item.author}
          </p>
          {item.role && (
            <p className="text-xs" style={{ color: '#6B5F54' }}>
              {item.role}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
