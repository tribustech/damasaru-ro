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
    { label: dict.home, href: `/${locale}` },
    { label: dict.about, href: `/${locale}/despre` },
    { label: dict.book, href: `/${locale}/carte` },
    { label: dict.events, href: `/${locale}/evenimente` },
    { label: dict.media, href: `/${locale}/media` },
    { label: dict.blog, href: `/${locale}/blog` },
    { label: dict.contact, href: `/${locale}/contact` },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(250,248,245,0.92)',
        borderBottom: '1px solid rgba(45,36,30,0.08)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            href={`/${locale}`}
            className="text-xl tracking-tight font-serif"
            style={{ color: '#2D241E' }}
          >
            Costin Damașaru
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#B8866F' }}
          >
            {dict.cta}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: '#6B5F54' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid rgba(45,36,30,0.08)',
            backgroundColor: '#FAF8F5',
          }}
        >
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
                className="block text-center px-6 py-3 text-white rounded-full text-sm"
                style={{ backgroundColor: '#B8866F' }}
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
