import type { SectionAccent } from '@repo/types'
import { getAccent } from '@/lib/accent'

interface EyebrowProps {
  label: string
  accent?: SectionAccent | null
  align?: 'left' | 'center'
}

export function Eyebrow({ label, accent, align = 'left' }: EyebrowProps) {
  const a = getAccent(accent)
  const justify = align === 'center' ? 'justify-center' : ''
  return (
    <div className={`flex items-center gap-4 mb-5 ${justify}`}>
      <div className="h-px w-12" style={{ backgroundColor: 'var(--color-gold)' }} />
      <span className={`text-xs uppercase tracking-[0.25em] font-semibold ${a.eyebrow}`}>
        {label}
      </span>
      {align === 'center' && (
        <div className="h-px w-12" style={{ backgroundColor: 'var(--color-gold)' }} />
      )}
    </div>
  )
}
