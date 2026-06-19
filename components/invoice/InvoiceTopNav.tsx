import { Brand } from '@/components/ui'
import styles from './InvoiceTopNav.module.css'

export interface InvoiceTopNavProps {
  saveStatus:  string
  onSend:      () => void
  onSaveDraft: () => void
}

export function InvoiceTopNav({ saveStatus, onSend, onSaveDraft }: InvoiceTopNavProps) {
  return (
    <nav className={styles.nav}>
      <NavLeft />
      <NavRight saveStatus={saveStatus} onSend={onSend} onSaveDraft={onSaveDraft} />
    </nav>
  )
}

function NavLeft() {
  return (
    <div className={styles.navLeft}>
      <Brand showIcon />
    </div>
  )
}

interface NavRightProps {
  saveStatus:  string
  onSend:      () => void
  onSaveDraft: () => void
}

function NavRight({ saveStatus, onSend, onSaveDraft }: NavRightProps) {
  return (
    <div className={styles.navRight}>
      <span className={styles.saveStatus}>{saveStatus}</span>
      <button
        type="button"
        onClick={onSaveDraft}
        className={styles.draftButton}
      >
        Save Draft
      </button>
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
