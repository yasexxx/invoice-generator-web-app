import { Brand } from '@/components/ui'
import styles from './InvoiceTopNav.module.css'

export interface InvoiceTopNavProps {
  saveStatus: string
  onSend: () => void
}

export function InvoiceTopNav({ saveStatus, onSend }: InvoiceTopNavProps) {
  return (
    <nav className={styles.nav}>
      <NavLeft />
      <NavRight saveStatus={saveStatus} onSend={onSend} />
    </nav>
  )
}

function NavLeft() {
  return (
    <div className={styles.navLeft}>
      <Brand showIcon />
      <button type="button" className={styles.dashboardButton}>
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Dashboard
      </button>
    </div>
  )
}

export interface NavRightProps {
  saveStatus: string
  onSend: () => void
}

function NavRight({ saveStatus, onSend }: NavRightProps) {
  return (
    <div className={styles.navRight}>
      <span className={styles.saveStatus}>{saveStatus}</span>
      <button
        type="button"
        onClick={onSend}
        className={styles.sendButton}
      >
        Send Invoice
      </button>
    </div>
  )
}
