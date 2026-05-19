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
  const isActive = href === '/' ? pathname === href : pathname.startsWith(href)

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center justify-between py-3 border-b text-base"
        style={{
          color: isActive ? '#B8866F' : '#2D241E',
          borderColor: 'rgba(45,36,30,0.06)',
        }}
      >
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="text-sm transition-all relative"
      style={{ color: isActive ? '#2D241E' : '#6B5F54' }}
    >
      {label}
      {isActive && (
        <span
          className="absolute -bottom-1 left-0 right-0 h-px"
          style={{ backgroundColor: '#B8866F' }}
        />
      )}
    </Link>
  )
}
