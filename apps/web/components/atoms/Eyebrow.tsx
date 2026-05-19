interface EyebrowProps {
  label: string
  dark?: boolean
}

export function Eyebrow({ label, dark = false }: EyebrowProps) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="h-px w-12" style={{ backgroundColor: '#B8866F' }} />
      <span
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: dark ? 'rgba(184,134,111,0.9)' : '#B8866F' }}
      >
        {label}
      </span>
    </div>
  )
}
