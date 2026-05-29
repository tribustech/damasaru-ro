import type { ReactNode } from 'react'
import Link from 'next/link'
import type { MediaLogoWallDTO } from '@repo/types'
import { accentRootClass, getZoneClass } from '@/lib/accent'

interface MediaLogoWallProps {
  section: MediaLogoWallDTO
  locale: string
}

/**
 * Inline SVG wordmarks keyed by `svgKey`. Each mark is a single <text> node so the
 * CSS hover rule (`.logo-cell:hover .logo-svg svg text { fill: forest }`) can recolour
 * it — keeping these as <text> (never <img>/<path>) is load-bearing for the green hover.
 * The default fill (#3A3D43) is the prescribed monochrome ink, not a brand colour.
 */
const WORDMARKS: Record<string, ReactNode> = {
  forbes: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Georgia, serif"
        fontWeight="900"
        fontSize="46"
        fontStyle="normal"
        letterSpacing="-1.5"
        fill="#3A3D43"
      >
        Forbes
      </text>
    </svg>
  ),
  protv: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="38"
        fontStyle="normal"
        letterSpacing="-1"
        fill="#3A3D43"
      >
        PRO TV
      </text>
    </svg>
  ),
  hotnews: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="36"
        fontStyle="normal"
        letterSpacing="-0.5"
        fill="#3A3D43"
      >
        HotNews
      </text>
    </svg>
  ),
  zf: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="26"
        fontStyle="italic"
        letterSpacing="-0.5"
        fill="#3A3D43"
      >
        Ziarul Financiar
      </text>
    </svg>
  ),
  adevarul: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Georgia, serif"
        fontWeight="900"
        fontSize="38"
        fontStyle="normal"
        letterSpacing="-1"
        fill="#3A3D43"
      >
        Adevărul
      </text>
    </svg>
  ),
  capital: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="36"
        fontStyle="normal"
        letterSpacing="2"
        fill="#3A3D43"
      >
        CAPITAL
      </text>
    </svg>
  ),
  tvr: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="52"
        fontStyle="normal"
        letterSpacing="-2"
        fill="#3A3D43"
      >
        TVR
      </text>
    </svg>
  ),
  wallstreet: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width="220" height="60">
      <text
        x="50%"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="32"
        fontStyle="normal"
        letterSpacing="-1"
        fill="#3A3D43"
      >
        wall-street
      </text>
    </svg>
  ),
}

export default function MediaLogoWall({ section }: MediaLogoWallProps) {
  const { eyebrow, heading, headingItalic, lead, accent, items } = section

  return (
    <section
      className={`mlw-root ${getZoneClass(accent)} ${accentRootClass(accent)}`}
    >
      {/* Scoped styles: the wordmark hover-recolour and hover-propagation to the
          count/description cannot be expressed with Tailwind utilities alone. Token
          names mirror globals.css (--color-*). */}
      <style>{`
        .mlw-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .mlw-cell {
          background: #fff;
          border: 1px solid var(--color-line);
          border-radius: 8px;
          padding: 36px 24px 28px;
          text-align: center;
          transition: all 0.3s ease;
          text-decoration: none;
          color: var(--color-ink, #1A1A1A);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          cursor: pointer;
        }
        .mlw-cell:hover {
          border-color: var(--color-gold);
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(20, 32, 46, 0.1);
        }
        .mlw-svg {
          width: 160px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: filter 0.3s;
        }
        .mlw-svg svg { max-width: 100%; max-height: 100%; }
        .mlw-cell:hover .mlw-svg svg text { fill: var(--color-forest) !important; }
        .mlw-count {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: var(--color-gold-deep);
        }
        .mlw-cell:hover .mlw-count,
        .mlw-cell:hover .mlw-desc { color: var(--color-forest); }
        .mlw-desc {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 13px;
          color: var(--color-text-mid);
          line-height: 1.4;
        }
        @media (max-width: 1024px) { .mlw-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .mlw-grid { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) {
          .mlw-cell, .mlw-svg { transition: none; }
          .mlw-cell:hover { transform: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-[70px]">
          {eyebrow && (
            <div className="section-eyebrow center" style={{ justifyContent: 'center' }}>
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="font-[family-name:var(--font-serif)] text-[42px] lg:text-[60px] font-medium text-[var(--color-navy)] leading-[1.1] tracking-[-1px] mt-6 mb-[18px]">
              {heading}
              {headingItalic && (
                <em className="block italic text-[var(--color-gold-deep)]">
                  {headingItalic}
                </em>
              )}
            </h2>
          )}
          {lead && (
            <p className="font-[family-name:var(--font-serif)] italic text-[var(--color-text-mid)] text-[20px] max-w-[680px] mx-auto leading-[1.5]">
              {lead}
            </p>
          )}
        </div>

        <div className="mlw-grid">
          {items.map((item) => {
            const mark = WORDMARKS[item.svgKey] ?? (
              <span className="text-[var(--color-ink,#1A1A1A)] font-semibold">
                {item.outletName}
              </span>
            )
            const inner = (
              <>
                <div className="mlw-svg" aria-label={item.outletName}>
                  {mark}
                </div>
                {item.count && <div className="mlw-count">{item.count}</div>}
                {item.description && <div className="mlw-desc">{item.description}</div>}
              </>
            )
            return item.href ? (
              <Link
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mlw-cell"
              >
                {inner}
              </Link>
            ) : (
              <div key={item.id} className="mlw-cell">
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
