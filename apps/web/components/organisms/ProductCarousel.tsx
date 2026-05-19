'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  id: number | string
  label: string
  description?: string
}

interface ProductCarouselProps {
  items: CarouselItem[]
  heading?: string
}

export function ProductCarousel({ items, heading }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {heading && (
        <h3 className="text-2xl font-serif font-light mb-8" style={{ color: '#2D241E' }}>
          {heading}
        </h3>
      )}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none w-72 snap-start p-6 rounded-2xl border"
              style={{
                borderColor: 'rgba(45,36,30,0.08)',
                backgroundColor: 'white',
              }}
            >
              <p className="font-medium mb-2" style={{ color: '#2D241E' }}>
                {item.label}
              </p>
              {item.description && (
                <p className="text-sm" style={{ color: '#6B5F54' }}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          style={{ borderColor: 'rgba(45,36,30,0.12)' }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} style={{ color: '#2D241E' }} />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          style={{ borderColor: 'rgba(45,36,30,0.12)' }}
          aria-label="Scroll right"
        >
          <ChevronRight size={18} style={{ color: '#2D241E' }} />
        </button>
      </div>
    </div>
  )
}
