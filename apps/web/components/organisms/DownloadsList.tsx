import type { DownloadsListDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass, getZoneClass } from '@/lib/accent'

interface DownloadsListProps {
  section: DownloadsListDTO
}

export function DownloadsList({ section }: DownloadsListProps) {
  const a = getAccent(section.accent)
  return (
    <section className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)}`}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <SectionHeading
          heading={section.heading ?? ''}
          accent={section.accent}
          align="center"
        />
        <ul className={`mt-12 divide-y ${a.border}`}>
          {section.items.map((item) => {
            if (!item.file) return null
            return (
              <li key={item.id} className="flex items-center justify-between py-4 gap-4">
                <div className={`text-lg font-serif ${a.text}`}>{item.label}</div>
                <a
                  href={item.file.url.startsWith('http') ? item.file.url : `${process.env.STRAPI_URL ?? 'http://localhost:1337'}${item.file.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm px-5 py-2 rounded-full border border-[var(--color-gold)] text-[var(--color-gold-deep)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] transition-colors"
                >
                  Descarcă
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
