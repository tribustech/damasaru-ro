import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'

interface BaseProps {
  variant?: 'primary' | 'outline' | 'ghost-light'
  size?: 'sm' | 'md'
}

type ButtonProps = BaseProps & ComponentPropsWithoutRef<'button'> & { href?: never }
type LinkProps = BaseProps & Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

type Props = ButtonProps | LinkProps

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-sans transition-all hover:-translate-y-px'
  const sizes = { sm: 'px-5 py-2.5 text-sm', md: 'px-8 py-4 text-base' }
  const variants = {
    primary:
      'bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-bright)]',
    outline:
      'border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white',
    'ghost-light':
      'border border-[var(--color-navy-line)] text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]',
  }

  const classes = [base, sizes[size], variants[variant], className].join(' ')

  if ('href' in props && props.href) {
    const { href, ...rest } = props as LinkProps
    return <Link href={href} className={classes} {...rest} />
  }

  const { ...rest } = props as ButtonProps
  return <button className={classes} {...rest} />
}
