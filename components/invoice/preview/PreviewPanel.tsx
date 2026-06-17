import { InvoiceDocument } from './InvoiceDocument'
import type { InvoiceFormData, InvoiceTotals } from '../invoice.types'
import styles from './PreviewPanel.module.css'

export interface PreviewPanelProps {
  data:   InvoiceFormData
  totals: InvoiceTotals
}

export function PreviewPanel({ data, totals }: PreviewPanelProps) {
  return (
    <section className={`${styles.panel} custom-scrollbar`}>
      <LivePreviewBadge />
      <div className={styles.documentFrame}>
        <InvoiceDocument data={data} totals={totals} />
      </div>
      <MobileControls />
    </section>
  )
}

function LivePreviewBadge() {
  return (
    <div className={styles.previewBadge}>
      <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
      LIVE PREVIEW
    </div>
  )
}

function MobileControls() {
  return (
    <div className={styles.mobileControls}>
      <button type="button" className={styles.controlButton} aria-label="Zoom invoice preview">
        <span className="material-symbols-outlined" aria-hidden="true">zoom_in</span>
      </button>
      <button type="button" className={styles.controlButton} aria-label="Download invoice preview">
        <span className="material-symbols-outlined" aria-hidden="true">file_download</span>
      </button>
    </div>
  )
}
