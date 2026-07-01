'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import type { EpisodeLink, EpisodePlatform } from '@/lib/episode'

interface EpisodePlayLinkProps {
  links: EpisodeLink[]
  /** Classes for the clickable surface (anchor when single, role=button when multi). */
  className?: string
  /** Trigger content (label, card body, row — whatever should be clickable). */
  children: ReactNode
  /** Append a ▾ caret to the trigger when a chooser will open (multi-link only). */
  caret?: boolean
  /** Wrapper classes used in the multi-link case; defaults to inline-flex.
   *  Pass a block/full-width value when the trigger is a card or a row. */
  wrapperClassName?: string
  /** Heading shown at the top of the chooser modal. */
  title?: string
}

function PlatformIcon({ platform }: { platform: EpisodePlatform }) {
  const common = { width: 26, height: 26, 'aria-hidden': true, className: 'shrink-0' }
  if (platform === 'spotify') {
    return (
      <svg viewBox="0 0 24 24" fill="#1DB954" {...common}>
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.6.6 0 01-.86.2c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.2c3.8-.87 7.07-.5 9.71 1.11.29.18.38.56.22.85zm1.23-2.74a.78.78 0 01-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.16a.78.78 0 11-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.36.22.48.7.25 1.06zm.1-2.85C14.8 8.9 9.5 8.72 6.4 9.66a.94.94 0 11-.54-1.8c3.56-1.08 9.4-.87 13.1 1.33a.94.94 0 01-.96 1.61z" />
      </svg>
    )
  }
  if (platform === 'apple') {
    return (
      <svg viewBox="0 0 24 24" fill="#9933CC" {...common}>
        <path d="M12 2a10 10 0 00-2 19.8V17a2 2 0 114 0v4.8A10 10 0 0012 2zm0 5a3 3 0 110 6 3 3 0 010-6z" />
      </svg>
    )
  }
  // youtube + generic fallback: a play glyph
  return (
    <svg viewBox="0 0 24 24" fill={platform === 'youtube' ? '#FF0000' : 'currentColor'} {...common}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function ChooserModal({
  links,
  title,
  onClose,
}: {
  links: EpisodeLink[]
  title: string
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(20,32,46,.6)] backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-[0_32px_80px_-20px_rgba(20,32,46,.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl font-medium text-[var(--color-navy)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl leading-none text-[var(--color-text-soft)] hover:bg-[var(--color-paper-warm)] hover:text-[var(--color-navy)] transition-colors"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-4 rounded-xl border border-[var(--color-line)] px-5 py-4 text-base font-medium text-[var(--color-navy)] hover:border-[var(--color-gold-deep)] hover:bg-[var(--color-paper-warm)] transition-colors"
            >
              <PlatformIcon platform={link.platform} />
              <span className="flex-1">{link.label}</span>
              <span aria-hidden className="text-[var(--color-gold-deep)]">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function EpisodePlayLink({
  links,
  className,
  children,
  caret,
  wrapperClassName,
  title = 'Ascultă pe',
}: EpisodePlayLinkProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (links.length === 0) return null

  if (links.length === 1) {
    return (
      <a href={links[0].url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <div className={wrapperClassName ?? 'relative inline-flex'}>
      {/* role=button (not <button>) because triggers can wrap block content
          — a whole feature card or list row — which <button> may not contain. */}
      <div
        role="button"
        tabIndex={0}
        className={className}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        {children}
        {caret && (
          <span aria-hidden className="ml-1.5">
            ▾
          </span>
        )}
      </div>
      {mounted && open && (
        <ChooserModal links={links} title={title} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
