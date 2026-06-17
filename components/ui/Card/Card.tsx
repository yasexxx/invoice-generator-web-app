import styles from './Card.module.css'

export type CardElevation = 0 | 1 | 2

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation
  size?: 'sm' | 'lg'
}

export function Card({
  elevation = 1,
  size      = 'lg',
  className,
  children,
  ...props
}: CardProps) {
  const cls = [
    styles.card,
    styles[`elevation${elevation}`],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} {...props}>
      {children}
    </div>
  )
}
