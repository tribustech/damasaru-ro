import type { ReactNode } from 'react'
import Link from 'next/link'
import type { SectionAccent } from '@repo/types'
import { Eyebrow } from '../atoms/Eyebrow'
import { getAccent } from '@/lib/accent'

interface SectionHeadingProps {
  eyebrow?: string | null
  heading: string
  headingItalic?: string | null
  lead?: string | null
  accent?: SectionAccent | null
  align?: 'left' | 'center'
  level?: 1 | 2
}

const MD_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

/** Render inline `[label](href)` markdown links inside otherwise-plain CMS text. */
function renderInlineLinks(text: string): ReactNode {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  MD_LINK.lastIndex = 0
  while ((match = MD_LINK.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    const [, label, href] = match
    const isExternal = /^https?:\/\//.test(href)
    nodes.push(
      isExternal ? (
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[var(--color-gold-deep)] text-[var(--color-gold-deep)] hover:text-[var(--color-navy)] transition-colors"
        >
          {label}
        </a>
      ) : (
        <Link
          key={match.index}
          href={href}
          className="underline decoration-[var(--color-gold-deep)] text-[var(--color-gold-deep)] hover:text-[var(--color-navy)] transition-colors"
        >
          {label}
        </Link>
      ),
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

export function SectionHeading({
  eyebrow,
  heading,
  headingItalic,
  lead,
  accent,
  align = 'left',
  level = 2,
}: SectionHeadingProps) {
  const a = getAccent(accent)
  const Tag = level === 1 ? 'h1' : 'h2'
  const size = level === 1 ? 'text-5xl lg:text-7xl' : 'text-4xl lg:text-5xl'
  const wrap = align === 'center' ? 'text-center max-w-3xl mx-auto' : ''
  return (
    <div className={wrap}>
      {eyebrow && <Eyebrow label={eyebrow} accent={accent} align={align} />}
      <Tag className={`${size} font-serif font-medium leading-[1.1] ${a.text}`}>
        {heading}
        {headingItalic && (
          <>
            {' '}
            <span className={a.italic}>{headingItalic}</span>
          </>
        )}
      </Tag>
      {lead && (
        <p className={`mt-6 text-lg lg:text-xl leading-relaxed ${a.textMuted}`}>
          {renderInlineLinks(lead)}
        </p>
      )}
    </div>
  )
}
