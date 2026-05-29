'use client'

import { useState, type ReactNode } from 'react'
import type { PressWallDTO } from '@repo/types'

interface PressWallProps {
  section: PressWallDTO
}

const ZONE_BY_ACCENT: Record<PressWallDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-press',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

const BRAND_MARKUP: Record<string, ReactNode> = {
  forbes: <span className="logo-brand brand-forbes">Forbes</span>,
  protv: <span className="logo-brand brand-protv">PRO TV</span>,
  antena3: (
    <span className="logo-brand brand-antena3">
      antena3<span className="cnn">CNN</span>
    </span>
  ),
  hotnews: (
    <span className="logo-brand brand-hotnews">
      HotNews<span className="ro">.ro</span>
    </span>
  ),
  adevarul: <span className="logo-brand brand-adevarul">Adevărul</span>,
  zf: (
    <span className="logo-brand brand-zf">
      Ziarul
      <br />
      Financiar
    </span>
  ),
  capital: <span className="logo-brand brand-capital">Capital</span>,
  bm: (
    <span className="logo-brand brand-bm">
      Business
      <br />
      <span className="accent">Magazin</span>
    </span>
  ),
}

export function PressWall({ section }: PressWallProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-press'
  const [open, setOpen] = useState(false)

  return (
    <section id="press" className={zoneClass}>
      <div className="ds-container">
        <div className="press-header">
          {section.eyebrow && <div className="section-eyebrow center">{section.eyebrow}</div>}
          <h2 className="press-h2">
            {section.heading}
            {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
          </h2>
          {section.subtitle && <p className="press-subtitle">{section.subtitle}</p>}
        </div>

        <div className="logo-wall">
          {section.items.map((it) => {
            const card = (
              <div className="logo-card" title={it.title ?? undefined}>
                {BRAND_MARKUP[it.brandKey] ?? <span className="logo-brand">{it.brandKey}</span>}
                {it.info && <div className="logo-info">{it.info}</div>}
              </div>
            )
            return it.url ? (
              <a key={it.id} href={it.url} target="_blank" rel="noopener">
                {card}
              </a>
            ) : (
              <div key={it.id}>{card}</div>
            )
          })}
        </div>

        <div className="press-expand-wrap">
          <button
            type="button"
            className={`press-expand-btn${open ? ' expanded' : ''}`}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="btn-text">
              {open ? (section.collapseLabel ?? 'Restrânge lista') : (section.expandLabel ?? 'Vezi toate aparițiile')}
            </span>
            <span className="arrow">↓</span>
          </button>
        </div>

        <div className={`press-secondary${open ? ' show' : ''}`}>
          {section.secondaryLabel && <p className="press-secondary-label">{section.secondaryLabel}</p>}
          <div className="secondary-list">
            {section.secondaryItems.map((s) =>
              s.url ? (
                <a key={s.id} className="secondary-item" href={s.url} target="_blank" rel="noopener">
                  {s.label}
                </a>
              ) : (
                <div key={s.id} className="secondary-item">
                  {s.label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
