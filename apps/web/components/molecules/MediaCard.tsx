import Image from 'next/image'
import type { MediaItem } from '@repo/types'
import { Badge } from '../atoms/Badge'

interface MediaCardProps {
  item: MediaItem
}

export function MediaCard({ item }: MediaCardProps) {
  const content = (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(45,36,30,0.08)] hover:shadow-md transition-shadow">
      {item.thumbnail && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={item.thumbnail.url}
            alt={item.thumbnail.alternativeText ?? item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <Badge label={item.type} variant="muted" />
        <h3 className="mt-3 text-base font-medium leading-snug" style={{ color: '#2D241E' }}>
          {item.title}
        </h3>
        {item.source && (
          <p className="mt-1 text-xs" style={{ color: '#6B5F54' }}>
            {item.source}
          </p>
        )}
      </div>
    </div>
  )

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return content
}
