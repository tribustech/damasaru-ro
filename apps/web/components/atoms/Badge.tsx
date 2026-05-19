interface BadgeProps {
  label: string
  variant?: 'accent' | 'muted'
}

export function Badge({ label, variant = 'accent' }: BadgeProps) {
  const styles =
    variant === 'accent'
      ? { border: '1px solid rgba(184,134,111,0.3)', color: '#B8866F' }
      : { border: '1px solid rgba(45,36,30,0.15)', color: '#6B5F54' }

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider"
      style={styles}
    >
      {label}
    </span>
  )
}
