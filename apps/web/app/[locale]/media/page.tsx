import { getMediaItems } from '@/lib/strapi'
import { getDictionary } from '@/lib/dictionaries'
import { MediaCard } from '@/components/molecules/MediaCard'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import type { Locale } from '@/proxy'

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [items, dict] = await Promise.all([
    getMediaItems(locale).catch(() => []),
    getDictionary(locale as Locale),
  ])

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-12">
          <Eyebrow label={dict.nav.media} />
          <h1 className="text-5xl font-serif font-light" style={{ color: '#2D241E' }}>
            {dict.nav.media}
          </h1>
        </div>
        {items.length === 0 ? (
          <p style={{ color: '#6B5F54' }}>—</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
