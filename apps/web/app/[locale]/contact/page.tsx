import { getDictionary } from '@/lib/dictionaries'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Button } from '@/components/atoms/Button'
import type { Locale } from '@/proxy'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div style={{ backgroundColor: '#FAF8F5' }}>
      <section className="max-w-2xl mx-auto px-6 py-24">
        <Eyebrow label={dict.contact.title} />
        <h1 className="text-5xl font-serif font-light mb-12" style={{ color: '#2D241E' }}>
          {dict.contact.title}
        </h1>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm" style={{ color: '#6B5F54' }}>
              {dict.contact.name}
            </label>
            <input
              type="text"
              name="name"
              className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#B8866F] transition-colors"
              style={{ borderColor: 'rgba(45,36,30,0.2)', color: '#2D241E' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm" style={{ color: '#6B5F54' }}>
              {dict.contact.email}
            </label>
            <input
              type="email"
              name="email"
              className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#B8866F] transition-colors"
              style={{ borderColor: 'rgba(45,36,30,0.2)', color: '#2D241E' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm" style={{ color: '#6B5F54' }}>
              {dict.contact.message}
            </label>
            <textarea
              name="message"
              rows={6}
              className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#B8866F] transition-colors resize-none"
              style={{ borderColor: 'rgba(45,36,30,0.2)', color: '#2D241E' }}
            />
          </div>
          <Button type="submit" variant="primary">
            {dict.contact.send}
          </Button>
        </form>
      </section>
    </div>
  )
}
