import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

const locales = ['ro', 'en'] as const
export type Locale = (typeof locales)[number]
const defaultLocale: Locale = 'ro'

function getLocale(request: NextRequest): Locale {
  const negotiator = new Negotiator({
    headers: { 'accept-language': request.headers.get('accept-language') ?? '' },
  })
  const languages = negotiator.languages()
  return match(languages, [...locales], defaultLocale) as Locale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
}
