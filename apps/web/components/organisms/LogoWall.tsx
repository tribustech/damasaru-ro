import Link from 'next/link'
import Image from 'next/image'
import type { LogoWallDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass, getZoneClass } from '@/lib/accent'

interface LogoWallProps {
  section: LogoWallDTO
}

export function LogoWall({ section }: LogoWallProps) {
  const a = getAccent(section.accent)
  return (
    <section className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {(section.heading) && (
          <div className="mb-12 text-center">
            <SectionHeading
              heading={section.heading}
              accent={section.accent}
              align="center"
            />
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {section.items.map((item) => {
            if (!item.logo) return null
            const img = (
              <div className={`relative h-12 w-full grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition`}>
                <Image
                  src={item.logo.url.startsWith('http') ? item.logo.url : `${process.env.STRAPI_URL ?? 'http://localhost:1337'}${item.logo.url}`}
                  alt={item.logo.alt ?? item.name}
                  fill
                  sizes="200px"
                  className="object-contain"
                />
              </div>
            )
            return item.url ? (
              <Link key={item.id} href={item.url} target="_blank" rel="noreferrer">
                {img}
              </Link>
            ) : (
              <div key={item.id}>{img}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
