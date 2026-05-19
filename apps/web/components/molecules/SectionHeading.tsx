import { Eyebrow } from '../atoms/Eyebrow'

interface SectionHeadingProps {
  eyebrow?: string | null
  heading: string
  centered?: boolean
  dark?: boolean
}

export function SectionHeading({ eyebrow, heading, centered = false, dark = false }: SectionHeadingProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {eyebrow && <Eyebrow label={eyebrow} dark={dark} />}
      <h2
        className="text-4xl lg:text-5xl font-serif font-light leading-tight"
        style={{ color: dark ? '#FAF8F5' : '#2D241E' }}
      >
        {heading}
      </h2>
    </div>
  )
}
