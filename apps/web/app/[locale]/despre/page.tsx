import { notFound } from 'next/navigation'
import { getAboutPage } from '@/lib/strapi'
import { getDictionary } from '@/lib/dictionaries'
import { DynamicZone } from '@/components/organisms/DynamicZone'
import type { Locale } from '@/proxy'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [page, dict] = await Promise.all([
    getAboutPage(locale).catch(() => null),
    getDictionary(locale as Locale),
  ])

  if (!page) notFound()

  return (
    <DynamicZone
      sections={page.sections}
      locale={locale}
      readMoreLabel={dict.blog.readMore}
      registerLabel={dict.events.register}
    />
  )
}
