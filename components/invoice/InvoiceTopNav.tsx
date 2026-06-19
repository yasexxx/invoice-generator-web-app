import { Brand, BackLink } from '@/components/ui'
import styles from './InvoiceTopNav.module.css'

export interface InvoiceTopNavProps {
  saveStatus:  string
  onSend:      () => void
  onSaveDraft: () => void
  backHref?:   string
  backLabel?:  string
}

export function InvoiceTopNav({ saveStatus, onSend, onSaveDraft, backHref, backLabel }: InvoiceTopNavProps) {
  return (
    <nav className={styles.nav}>
      <NavLeft backHref={backHref} backLabel={backLabel} />
      <NavRight saveStatus={saveStatus} onSend={onSend} onSaveDraft={onSaveDraft} />
    </nav>
  )
}

interface NavLeftProps {
  backHref?:  string
  backLabel?: string
}

function NavLeft({ backHref, backLabel }: NavLeftProps) {
  return (
    <div className={styles.navLeft}>
      {backHref && <BackLink href={backHref} label={backLabel ?? 'Back'} />}
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
