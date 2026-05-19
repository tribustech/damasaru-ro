import Link from 'next/link'
import type { Dictionary } from '../../lib/dictionaries'

interface FooterProps {
  locale: string
  dict: Dictionary['footer'] & { nav: Dictionary['nav'] }
}

export function Footer({ locale, dict }: FooterProps) {
  const navLinks = [
    { label: dict.nav.about, href: `/${locale}/despre` },
    { label: dict.nav.events, href: `/${locale}/evenimente` },
    { label: dict.nav.media, href: `/${locale}/media` },
    { label: dict.nav.blog, href: `/${locale}/blog` },
  ]

  const resourceLinks = [
    { label: dict.nav.book, href: `/${locale}/carte` },
    { label: dict.nav.contact, href: `/${locale}/contact` },
  ]

  return (
    <footer style={{ backgroundColor: '#2D241E' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <div className="text-2xl tracking-tight mb-4 font-serif" style={{ color: '#FAF8F5' }}>
              Costin Damașaru
            </div>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(250,248,245,0.5)' }}>
              Neurocercetător, autor și facilitator — dedicat să ajut oamenii să înțeleagă puterea creierului lor.
            </p>
            <div
              className="inline-block px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{ border: '1px solid rgba(184,134,111,0.3)', color: '#B8866F' }}
            >
              Veruvis · Veruvis Kids · Neuro Performance
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2" />

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-wider mb-6" style={{ color: '#B8866F' }}>
              {dict.navigation}
            </h3>
            <ul className="space-y-4">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-[#B8866F]"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-wider mb-6" style={{ color: '#B8866F' }}>
              {dict.resources}
            </h3>
            <ul className="space-y-4">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-[#B8866F]"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-wider mb-6" style={{ color: '#B8866F' }}>
              {dict.social}
            </h3>
            <ul className="space-y-4">
              {['LinkedIn', 'Instagram', 'YouTube', 'Twitter'].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-sm transition-colors hover:text-[#B8866F]"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(250,248,245,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(250,248,245,0.3)' }}>
            © {new Date().getFullYear()} Costin Damașaru. {dict.rights}
          </p>
          <p className="text-xs" style={{ color: 'rgba(250,248,245,0.3)' }}>
            {dict.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
