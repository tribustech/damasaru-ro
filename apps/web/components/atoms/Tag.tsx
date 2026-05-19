interface TagProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export function Tag({ label, active = false, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm capitalize transition-colors"
      style={
        active
          ? { backgroundColor: '#2D241E', color: '#FAF8F5' }
          : { backgroundColor: 'rgba(45,36,30,0.06)', color: '#6B5F54' }
      }
    >
      {label}
    </button>
  )
}
