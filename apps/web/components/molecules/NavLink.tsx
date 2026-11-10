'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  label: string
  onClick?: () => void
  mobile?: boolean
  /** Outbound link (e.g. platforma.damasaru.ro): plain <a>, same tab, never "active". */
  external?: boolean
}

export function NavLink({ href, label, onClick, mobile = false, external = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = !external && (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)))
  const Anchor = external ? 'a' : Link

  if (mobile) {
    return (
      <Anchor
        href={href}
        onClick={onClick}
        className={`flex items-center justify-between py-3 border-b border-[var(--color-navy-line)] text-base ${
          isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-light)] hover:text-white'
        }`}
      >
        {label}
      </Anchor>
    )
  }

  return (
    <Anchor
      href={href}
      className={`text-sm tracking-wide transition-colors relative pb-1 ${
        isActive ? 'text-white' : 'text-[var(--color-text-light)] hover:text-[var(--color-gold)]'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-0 left-0 right-0 h-px bg-[var(--color-gold)]" />
      )}
    </Anchor>
  )
}
