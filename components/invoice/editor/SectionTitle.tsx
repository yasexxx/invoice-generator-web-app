export interface SectionTitleProps {
  icon:  string
  title: string
}

export function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-sm text-primary">
      <span className="material-symbols-outlined">{icon}</span>
      <h2 className="title-md">{title}</h2>
    </div>
  )
}
