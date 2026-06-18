import Link from 'next/link'
import styles from './BackLink.module.css'

export interface BackLinkProps {
  href:      string
  label:     string
  className?: string
}

export function BackLink({ href, label, className }: BackLinkProps) {
  const cls = [styles.link, className].filter(Boolean).join(' ')

  return (
    <Link href={href} className={cls}>
      <span className={`material-symbols-outlined ${styles.backIcon}`} aria-hidden="true">
        arrow_back
      </span>
      <div className={styles.label}>{label}</div>
    </Link>
  )
}
