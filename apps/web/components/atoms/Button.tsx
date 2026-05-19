import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'

interface BaseProps {
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md'
}

type ButtonProps = BaseProps & ComponentPropsWithoutRef<'button'> & { href?: never }
type LinkProps = BaseProps & Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

type Props = ButtonProps | LinkProps

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-sans transition-opacity hover:opacity-90'
  const sizes = { sm: 'px-5 py-2.5 text-sm', md: 'px-8 py-4 text-base' }
  const variants = {
    primary: 'bg-[#B8866F] text-white',
    outline: 'border border-[rgba(45,36,30,0.2)] text-[#2D241E]',
  }

  const classes = [base, sizes[size], variants[variant], className].join(' ')

  if ('href' in props && props.href) {
    const { href, ...rest } = props as LinkProps
    return <Link href={href} className={classes} {...rest} />
  }

  const { ...rest } = props as ButtonProps
  return <button className={classes} {...rest} />
}
