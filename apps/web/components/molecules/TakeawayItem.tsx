interface TakeawayItemProps {
  iconName: string | null
  title: string
  text: string
}

export function TakeawayItem({ title, text }: TakeawayItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-medium text-base" style={{ color: '#2D241E' }}>
        {title}
      </h4>
      <p className="text-sm leading-relaxed" style={{ color: '#6B5F54' }}>
        {text}
      </p>
    </div>
  )
}
