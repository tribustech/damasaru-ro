'use client'

import { useEffect, useRef } from 'react'
import type { MediaStatStripDTO } from '@repo/types'
import { getAccent, accentRootClass, getZoneClass } from '@/lib/accent'

interface MediaStatStripProps {
  section: MediaStatStripDTO
  locale?: string
}

/**
 * Z2 paper stat strip. Three Cormorant counters separated by gold central rules,
 * counting up 0 -> value on first scroll-into-view (one-shot, ~1s). Non-numeric
 * suffixes ("40+") are preserved. Honors prefers-reduced-motion (jumps to final).
 */
export default function MediaStatStrip({ section }: MediaStatStripProps) {
  const a = getAccent(section.accent ?? 'paper')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-stat-value]'))
    if (nodes.length === 0) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const renderFinal = (el: HTMLElement, target: number, suffix: string) => {
      el.textContent = String(target)
      if (suffix) {
        const span = document.createElement('span')
        span.style.fontSize = '0.7em'
        span.textContent = suffix
        el.appendChild(span)
      }
    }

    const parse = (el: HTMLElement) => {
      const raw = el.dataset.statValue ?? ''
      const match = raw.match(/-?\d+/)
      const target = match ? parseInt(match[0], 10) : NaN
      const suffix = match ? raw.slice(raw.indexOf(match[0]) + match[0].length) : raw
      return { target, suffix, raw }
    }

    // Non-numeric or reduced-motion: render final immediately.
    if (reduceMotion) {
      nodes.forEach((el) => {
        const { target, suffix, raw } = parse(el)
        if (Number.isNaN(target)) el.textContent = raw
        else renderFinal(el, target, suffix)
      })
      return
    }

    const intervals = new Set<ReturnType<typeof setInterval>>()

    const animate = (el: HTMLElement) => {
      const { target, suffix, raw } = parse(el)
      if (Number.isNaN(target)) {
        el.textContent = raw
        return
      }
      let current = 0
      const step = target / 30
      const id = setInterval(() => {
        current += step
        if (current >= target) {
          renderFinal(el, target, suffix)
          clearInterval(id)
          intervals.delete(id)
        } else {
          el.textContent = String(Math.floor(current))
        }
      }, 30)
      intervals.add(id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 },
    )

    nodes.forEach((el) => {
      el.textContent = '0'
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
      intervals.forEach((id) => clearInterval(id))
    }
  }, [section.items])

  return (
    <section
      className={`${getZoneClass(section.accent)} ${accentRootClass(section.accent)} border-b ${a.border} !py-[70px]`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={rootRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-[30px] sm:gap-[60px] text-center"
        >
          {section.items?.map((stat, i) => {
            const isLast = i === (section.items?.length ?? 0) - 1
            return (
              <div key={stat.id} className="relative">
                <div className="font-serif font-medium leading-none text-[64px] lg:text-[88px] text-[var(--color-navy)] mb-2">
                  <em
                    data-stat-value={stat.value}
                    className="italic text-[var(--color-gold-deep)]"
                  >
                    {stat.value}
                  </em>
                </div>
                <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[var(--color-gold-deep)]">
                  {stat.label}
                </div>
                {!isLast && (
                  <span
                    aria-hidden
                    className="hidden sm:block absolute right-[-30px] top-[20%] bottom-[20%] w-px bg-[var(--color-line)]"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
