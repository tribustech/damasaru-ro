import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ro', 'en'] as const
export type Locale = (typeof locales)[number]
const defaultLocale: Locale = 'ro'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return

  // Always default to Romanian; English is reachable only via an explicit /en URL.
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
}
