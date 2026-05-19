import Image from 'next/image'
import type { StrapiMedia } from '@repo/types'

interface AvatarProps {
  photo: StrapiMedia | null
  name: string
  size?: number
}

export function Avatar({ photo, name, size = 48 }: AvatarProps) {
  if (!photo) {
    return (
      <div
        className="rounded-full flex items-center justify-center text-sm font-medium"
        style={{
          width: size,
          height: size,
          backgroundColor: 'rgba(184,134,111,0.15)',
          color: '#B8866F',
        }}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <Image
      src={photo.url}
      alt={photo.alternativeText ?? name}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  )
}
