'use client'

import { useMemo, useState } from 'react'
import type { PressMentionListItem } from '@/lib/strapi'

interface ArchiveFilterProps {
  items: PressMentionListItem[]
}

/** Type badge label + bg per press-mention type (mirrors MediaFeatured TYPE_BADGE). */
const TYPE_META: Record<string, { label: string; bg: string }> = {
  tv: { label: 'TV', bg: 'var(--color-forest)' },
  podcast: { label: 'PODCAST', bg: 'var(--color-navy)' },
  publicatie: { label: 'PUBLICAȚIE', bg: 'var(--color-gold-deep)' },
  radio: { label: 'RADIO', bg: 'var(--color-navy-soft)' },
  evenimente: { label: 'EVENIMENTE', bg: 'var(--color-forest-bright)' },
}

const BRAND_LABEL: Record<string, string> = {
  costin: 'Costin Dămășaru',
  veruvis: 'Veruvis',
  'veruvis-kids': 'Veruvis Kids',
}

type TypeKey = 'all' | 'tv' | 'podcast' | 'publicatie' | 'radio' | 'evenimente'
type BrandKey = 'all' | 'costin' | 'veruvis' | 'veruvis-kids'
type SortKey = 'notable' | 'recent' | 'alpha'

const TYPE_CHIPS: { key: TypeKey; label: string }[] = [
  { key: 'all', label: 'Toate' },
  { key: 'tv', label: 'TV' },
  { key: 'podcast', label: 'Podcast' },
  { key: 'publicatie', label: 'Publicație' },
  { key: 'radio', label: 'Radio' },
  { key: 'evenimente', label: 'Evenimente' },
]

const BRAND_CHIPS: { key: BrandKey; label: string }[] = [
  { key: 'all', label: 'Toate' },
  { key: 'costin', label: 'Costin Dămășaru' },
  { key: 'veruvis', label: 'Veruvis' },
  { key: 'veruvis-kids', label: 'Veruvis Kids' },
]

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'notable', label: 'Cele mai notabile' },
  { key: 'recent', label: 'Cele mai recente' },
  { key: 'alpha', label: 'Alfabetic' },
]

/** Extract a YouTube video id from watch?v= / youtu.be/ / shorts/ / embed/ urls. */
function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return v
      const m = u.pathname.match(/^\/(?:shorts|embed)\/([^/?]+)/)
      if (m) return m[1]
    }
    return null
  } catch {
    return null
  }
}

function timeValue(date: string | null): number {
  if (!date) return 0
  const t = new Date(date).getTime()
  return Number.isNaN(t) ? 0 : t
}

export function ArchiveFilter({ items }: ArchiveFilterProps) {
  const [type, setType] = useState<TypeKey>('all')
  const [brand, setBrand] = useState<BrandKey>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('notable')

  // Counts per type/brand, derived from the full dataset (not the filtered view).
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const it of items) if (it.type) counts[it.type] = (counts[it.type] ?? 0) + 1
    return counts
  }, [items])

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const it of items) if (it.brand) counts[it.brand] = (counts[it.brand] ?? 0) + 1
    return counts
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = items.filter((it) => {
      if (type !== 'all' && it.type !== type) return false
      if (brand !== 'all' && it.brand !== brand) return false
      if (q) {
        const hay = `${it.title} ${it.outlet}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    const sorted = [...rows]
    if (sort === 'recent') {
      sorted.sort((a, b) => timeValue(b.date) - timeValue(a.date))
    } else if (sort === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ro'))
    } else {
      // notable: featured first, then most recent.
      sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        return timeValue(b.date) - timeValue(a.date)
      })
    }
    return sorted
  }, [items, type, brand, query, sort])

  return (
    <div className="arh-root">
      <style>{ARCHIVE_CSS}</style>

      <div className="arh-controls">
        <div className="arh-chip-group" role="group" aria-label="Filtru după tip">
          <span className="arh-group-label">Tip</span>
          <div className="arh-chips">
            {TYPE_CHIPS.map((chip) => {
              const count =
                chip.key === 'all' ? items.length : (typeCounts[chip.key] ?? 0)
              return (
                <button
                  key={chip.key}
                  type="button"
                  className={`arh-chip${type === chip.key ? ' is-active' : ''}`}
                  aria-pressed={type === chip.key}
                  onClick={() => setType(chip.key)}
                >
                  {chip.label}
                  <span className="arh-chip-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="arh-chip-group" role="group" aria-label="Filtru după brand">
          <span className="arh-group-label">Brand</span>
          <div className="arh-chips">
            {BRAND_CHIPS.map((chip) => {
              const count =
                chip.key === 'all' ? items.length : (brandCounts[chip.key] ?? 0)
              return (
                <button
                  key={chip.key}
                  type="button"
                  className={`arh-chip${brand === chip.key ? ' is-active' : ''}`}
                  aria-pressed={brand === chip.key}
                  onClick={() => setBrand(chip.key)}
                >
                  {chip.label}
                  <span className="arh-chip-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="arh-toolbar">
          <label className="arh-search">
            <span className="arh-sr">Caută în arhivă</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută după titlu sau publicație…"
            />
          </label>
          <label className="arh-sort">
            <span className="arh-sr">Sortează</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="arh-result-count" aria-live="polite">
          {filtered.length}{' '}
          {filtered.length === 1 ? 'apariție' : 'apariții'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="arh-empty">Nicio apariție nu corespunde filtrelor selectate.</p>
      ) : (
        <ul className="arh-grid">
          {filtered.map((it) => {
            const meta = (it.type && TYPE_META[it.type]) || null
            const id = youtubeId(it.url)
            const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
            const brandName = it.brand ? BRAND_LABEL[it.brand] : null
            const CardTag = it.url ? 'a' : 'div'
            return (
              <li key={it.id}>
                <CardTag
                  className="arh-card"
                  {...(it.url
                    ? { href: it.url, target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <div className="arh-thumb">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" loading="lazy" />
                    ) : (
                      <span className="arh-thumb-fallback" aria-hidden="true">
                        {it.outlet.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="arh-thumb-overlay" aria-hidden="true" />
                    {meta && (
                      <span className="arh-badge" style={{ background: meta.bg }}>
                        {meta.label}
                      </span>
                    )}
                  </div>
                  <div className="arh-card-body">
                    <h3 className="arh-card-title">{it.title}</h3>
                    <p className="arh-card-meta">
                      {it.outlet}
                      {brandName ? <span className="arh-dot"> · </span> : null}
                      {brandName}
                    </p>
                  </div>
                </CardTag>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const ARCHIVE_CSS = `
.arh-root { width: 100%; }
.arh-sr {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0);
  white-space: nowrap; border: 0;
}
.arh-controls { margin-bottom: 48px; }
.arh-chip-group {
  display: flex;
  align-items: baseline;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.arh-group-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-text-mid);
  min-width: 52px;
}
.arh-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.arh-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-navy);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.arh-chip:hover { border-color: var(--color-gold); }
.arh-chip.is-active {
  background: var(--color-navy);
  border-color: var(--color-navy);
  color: #fff;
}
.arh-chip-count {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.6;
}
.arh-chip.is-active .arh-chip-count { color: var(--color-gold); opacity: 1; }
.arh-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-top: 28px;
}
.arh-search { flex: 1 1 280px; }
.arh-search input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  background: #fff;
  color: var(--color-navy);
  font-family: inherit;
  font-size: 15px;
}
.arh-search input:focus {
  outline: none;
  border-color: var(--color-gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 106, 0.15);
}
.arh-sort select {
  padding: 12px 16px;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  background: #fff;
  color: var(--color-navy);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}
.arh-sort select:focus {
  outline: none;
  border-color: var(--color-gold);
}
.arh-result-count {
  margin-top: 18px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-text-mid);
}
.arh-empty {
  padding: 48px 0;
  color: var(--color-text-mid);
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 20px;
}
.arh-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.arh-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
a.arh-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(20, 32, 46, 0.1);
  border-color: rgba(212, 175, 106, 0.4);
}
.arh-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-forest) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.arh-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 1;
  filter: saturate(0.35) contrast(0.92) brightness(0.85);
  transition: filter 0.45s ease;
}
a.arh-card:hover .arh-thumb img {
  filter: saturate(1.1) contrast(1) brightness(1);
}
.arh-thumb-fallback {
  font-family: var(--font-serif);
  font-size: 48px;
  color: rgba(255, 255, 255, 0.6);
  z-index: 1;
}
.arh-thumb-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    160deg,
    rgba(20, 32, 46, 0.45) 0%,
    rgba(45, 77, 67, 0.3) 60%,
    rgba(20, 32, 46, 0.45) 100%
  );
  mix-blend-mode: multiply;
  transition: opacity 0.45s ease;
}
a.arh-card:hover .arh-thumb-overlay { opacity: 0; }
.arh-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 4px 9px;
  border-radius: 100px;
}
.arh-card-body {
  padding: 14px 14px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.arh-card-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-navy);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.arh-card-meta {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.4px;
  color: var(--color-text-mid);
}
.arh-dot { opacity: 0.5; }
@media (max-width: 1024px) {
  .arh-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .arh-grid { grid-template-columns: 1fr; }
  .arh-toolbar { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) {
  .arh-card,
  .arh-thumb img,
  .arh-thumb-overlay { transition: none; }
  a.arh-card:hover { transform: none; }
}
`
