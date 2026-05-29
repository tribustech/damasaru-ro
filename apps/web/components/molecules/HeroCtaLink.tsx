'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'

interface Props {
  href: string
  label: string
  className: string
}

function smoothScrollTo(targetTop: number, duration = 600) {
  const startTop = window.scrollY
  const distance = targetTop - startTop
  if (distance === 0) return
  const startTime = performance.now()
  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

  function step(now: number) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startTop + distance * easeInOut(t))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function HeroCtaLink({ href, label, className }: Props) {
  if (!href.startsWith('#')) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    )
  }

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    smoothScrollTo(top)
    history.replaceState(null, '', href)
  }

  return (
    <a href={href} onClick={onClick} className={className}>
      {label}
    </a>
  )
}
