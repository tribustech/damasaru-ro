'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NavLink } from '../molecules/NavLink'
import type { Dictionary } from '../../lib/dictionaries'

interface NavigationProps {
  locale: string
  dict: Dictionary['nav']
}

export function Navigation({ locale, dict }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: dict.about, href: `/${locale}/despre` },
    { label: dict.book, href: `/${locale}/carte` },
    { label: dict.podcast, href: `/${locale}/podcast` },
    { label: dict.idei, href: `/${locale}/idei` },
    { label: dict.proiecte, href: `/${locale}/proiecte` },
    { label: dict.events, href: `/${locale}/evenimente` },
    { label: dict.magazin, href: `/${locale}/magazin` },
    { label: dict.media, href: `/${locale}/media` },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-navy)]/95 border-b border-[var(--color-navy-line)]">
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            href={`/${locale}`}
            className="text-2xl tracking-tight font-serif font-semibold text-white"
          >
            Costin <span className="italic text-[var(--color-gold)]">Dămășaru</span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold-bright)] transition-colors"
          >
            {dict.cta}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-navy-line)] bg-[var(--color-navy)]">
          <div className="px-6 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                mobile
                onClick={() => setMobileOpen(false)}
              />
            ))}
            <div className="pt-4">
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileOpen(false)}
                className="block text-center px-6 py-3 rounded-full text-sm font-semibold bg-[var(--color-gold)] text-[var(--color-navy)]"
              >
                {dict.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
