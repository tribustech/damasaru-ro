import type { TestimonialDTO, SectionAccent } from '@repo/types'
import { Avatar } from '../atoms/Avatar'
import { getAccent } from '@/lib/accent'

interface TestimonialCardProps {
  item: TestimonialDTO
  accent?: SectionAccent | null
  featured?: boolean
}

export function TestimonialCard({ item, accent, featured = false }: TestimonialCardProps) {
  const a = getAccent(accent)
  return (
    <div
      className={`relative p-8 lg:p-10 rounded-3xl border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'} ${featured ? 'lg:col-span-7' : 'lg:col-span-5'} flex flex-col justify-between`}
    >
      <div
        className="absolute top-6 right-8 text-[100px] leading-none font-serif select-none pointer-events-none"
        style={{ color: a.isDark ? 'rgba(212,175,106,0.2)' : 'rgba(184,146,77,0.15)' }}
      >
        "
      </div>
      <p className={`relative text-lg leading-relaxed font-serif italic ${a.text}`}>"{item.quote}"</p>
      <div className="relative mt-8 flex items-center gap-4">
        <Avatar photo={item.avatar} name={item.author} size={44} />
        <div>
          <div className={`text-sm font-medium ${a.text}`}>{item.author}</div>
          {item.role && <div className={`text-xs mt-0.5 ${a.eyebrow}`}>{item.role}</div>}
        </div>
      </div>
    </div>
  )
}
