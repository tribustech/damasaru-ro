import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navigation } from '@/components/organisms/Navigation'
import { Footer } from '@/components/organisms/Footer'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/proxy'
import '../globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

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
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: '#FAF8F5' }}>
        <Navigation locale={locale} dict={dict.nav} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer
          locale={locale}
          dict={{ ...dict.footer, nav: dict.nav }}
        />
      </body>
    </html>
  )
}
