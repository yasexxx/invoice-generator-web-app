import styles from './Badge.module.css'

export type BadgeStatus = 'success' | 'error' | 'warning' | 'info' | 'default'

export interface BadgeProps {
  status?: BadgeStatus
  children: React.ReactNode
  className?: string
}

export function Badge({ status = 'default', children, className }: BadgeProps) {
  const cls = [styles.badge, styles[status], className].filter(Boolean).join(' ')
  return <span className={cls}>{children}</span>
}
