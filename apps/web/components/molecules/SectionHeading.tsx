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
      {lead && <p className={`mt-6 text-lg lg:text-xl leading-relaxed ${a.textMuted}`}>{lead}</p>}
    </div>
  )
}
