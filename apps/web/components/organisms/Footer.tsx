import Link from 'next/link'
import type { Dictionary } from '../../lib/dictionaries'

interface FooterProps {
  locale: string
  dict: Dictionary['footer'] & { nav: Dictionary['nav'] }
}

export function Footer({ locale, dict }: FooterProps) {
  const navLinks = [
    { label: dict.nav.about, href: `/${locale}/despre` },
    { label: dict.nav.book, href: `/${locale}/carte` },
    { label: dict.nav.podcast, href: `/${locale}/podcast` },
    { label: dict.nav.idei, href: `/${locale}/idei` },
  ]

  const activityLinks = [
    { label: dict.nav.proiecte, href: `/${locale}/proiecte` },
    { label: dict.nav.events, href: `/${locale}/evenimente` },
    { label: dict.nav.magazin, href: `/${locale}/magazin` },
    { label: dict.nav.media, href: `/${locale}/media` },
  ]

  const socialLinks = [
    { label: 'YouTube', href: 'https://www.youtube.com/@costindamasaru' },
    { label: 'Spotify', href: 'https://open.spotify.com' },
    { label: 'Instagram', href: 'https://www.instagram.com/costindamasaru' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/costindamasaru' },
  ]

  return (
    <footer className="bg-[var(--color-navy)] border-t border-[var(--color-navy-line)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <div className="text-3xl font-serif font-semibold text-white mb-4">
              Costin <span className="italic text-[var(--color-gold)]">Dămășaru</span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-text-light)]/70 mb-8 max-w-sm">
              Neurocercetător, autor și fondator. Construiesc instrumente prin care oamenii își recapătă claritatea — în minte și în viață.
            </p>
            <div className="inline-block px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-[var(--color-gold)]/30 text-[var(--color-gold)]">
              Veruvis · Veruvis Kids · Nircura
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1" />

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.25em] mb-6 text-[var(--color-gold)] font-semibold">
              {dict.navigation}
            </h3>
            <ul className="space-y-4">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-text-light)]/70 hover:text-[var(--color-gold)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.25em] mb-6 text-[var(--color-gold)] font-semibold">
              {dict.resources}
            </h3>
            <ul className="space-y-4">
              {activityLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-text-light)]/70 hover:text-[var(--color-gold)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.25em] mb-6 text-[var(--color-gold)] font-semibold">
              {dict.social}
            </h3>
            <ul className="space-y-4">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[var(--color-text-light)]/70 hover:text-[var(--color-gold)] transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-navy-line)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-light)]/40">
            © {new Date().getFullYear()} Costin Dămășaru. {dict.rights}
          </p>
          <p className="text-xs text-[var(--color-text-light)]/40">{dict.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
