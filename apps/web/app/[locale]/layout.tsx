import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Navigation } from '@/components/organisms/Navigation'
import { Footer } from '@/components/organisms/Footer'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/proxy'
import '../globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
})

const locales: Locale[] = ['ro', 'en']

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  const dict = await getDictionary(locale as Locale)

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-paper)] text-[var(--color-navy)]">
        <Navigation locale={locale} dict={dict.nav} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer locale={locale} dict={{ ...dict.footer, nav: dict.nav }} />
      </body>
    </html>
  )
}
