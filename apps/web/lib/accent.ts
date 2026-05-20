import type { SectionAccent } from '@repo/types'

export interface AccentClasses {
  background: string
  text: string
  textMuted: string
  eyebrow: string
  border: string
  italic: string
  isDark: boolean
}

export function getAccent(accent: SectionAccent | null | undefined): AccentClasses {
  switch (accent) {
    case 'navy':
      return {
        background: 'bg-[var(--color-navy)]',
        text: 'text-white',
        textMuted: 'text-[var(--color-text-light)]',
        eyebrow: 'text-[var(--color-gold)]',
        border: 'border-[var(--color-navy-line)]',
        italic: 'text-[var(--color-gold)] italic',
        isDark: true,
      }
    case 'navy-deep':
      return {
        background: 'bg-[var(--color-navy-deep)]',
        text: 'text-white',
        textMuted: 'text-[var(--color-text-light)]',
        eyebrow: 'text-[var(--color-gold)]',
        border: 'border-[var(--color-navy-line)]',
        italic: 'text-[var(--color-gold)] italic',
        isDark: true,
      }
    case 'paper-warm':
      return {
        background: 'bg-[var(--color-paper-warm)]',
        text: 'text-[var(--color-navy)]',
        textMuted: 'text-[var(--color-text-mid)]',
        eyebrow: 'text-[var(--color-gold-deep)]',
        border: 'border-[var(--color-line)]',
        italic: 'text-[var(--color-gold-deep)] italic',
        isDark: false,
      }
    case 'paper':
    default:
      return {
        background: 'bg-[var(--color-paper)]',
        text: 'text-[var(--color-navy)]',
        textMuted: 'text-[var(--color-text-mid)]',
        eyebrow: 'text-[var(--color-gold-deep)]',
        border: 'border-[var(--color-line)]',
        italic: 'text-[var(--color-gold-deep)] italic',
        isDark: false,
      }
  }
}

export function accentRootClass(accent: SectionAccent | null | undefined) {
  return `section-accent-${accent ?? 'paper'}`
}
