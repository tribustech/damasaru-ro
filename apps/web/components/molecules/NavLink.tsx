'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  label: string
  onClick?: () => void
  mobile?: boolean
}

export function NavLink({ href, label, onClick, mobile = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center justify-between py-3 border-b border-[var(--color-navy-line)] text-base ${
          isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-light)] hover:text-white'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`text-sm tracking-wide transition-colors relative pb-1 ${
        isActive ? 'text-white' : 'text-[var(--color-text-light)] hover:text-[var(--color-gold)]'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-0 left-0 right-0 h-px bg-[var(--color-gold)]" />
      )}
    </Link>
  )
}
