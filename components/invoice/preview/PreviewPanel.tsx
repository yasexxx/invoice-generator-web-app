'use client'

import { useInvoicePagination }               from './useInvoicePagination'
import { useFullscreenPreview, ZOOM_DEFAULT } from './useFullscreenPreview'
import { InvoiceDocument }                    from './InvoiceDocument'
import { FullscreenPreview }                  from './FullscreenPreview'
import type { InvoiceFormData, InvoiceTotals } from '../invoice.types'
import styles from './PreviewPanel.module.css'

export interface PreviewPanelProps {
  data:   InvoiceFormData
  totals: InvoiceTotals
}

export function PreviewPanel({ data, totals }: PreviewPanelProps) {
  const fs = useFullscreenPreview()
  const { pages, registerBody } = useInvoicePagination(data.lineItems, fs.zoomLevel !== ZOOM_DEFAULT)

  return (
    <section className={`${styles.panel} custom-scrollbar`}>
      <PreviewBadge onFullscreen={fs.open} />
      <div className={styles.documentFrame}>
        <InvoiceDocument
          data={data}
          totals={totals}
          pages={pages}
          registerBody={registerBody}
        />
      </div>
      <MobileControls onFullscreen={fs.open} />

      <FullscreenPreview
        data={data}
        totals={totals}
        pages={pages}
        controls={fs}
      />
    </section>
  )
}

function PreviewBadge({ onFullscreen }: { onFullscreen: () => void }) {
  return (
    <div className={styles.previewBadge}>
      <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
      LIVE PREVIEW
      <button
        type="button"
        onClick={onFullscreen}
        className={styles.fullscreenTrigger}
        aria-label="Enter full-screen preview"
      >
        <span className="material-symbols-outlined" aria-hidden="true">open_in_full</span>
      </button>
    </div>
  )
}

function MobileControls({ onFullscreen }: { onFullscreen: () => void }) {
  return (
    <div className={styles.mobileControls}>
      <button
        type="button"
        onClick={onFullscreen}
        className={styles.controlButton}
        aria-label="Full-screen preview"
      >
        <span className="material-symbols-outlined" aria-hidden="true">open_in_full</span>
      </button>
      <button type="button" className={styles.controlButton} aria-label="Download invoice preview">
        <span className="material-symbols-outlined" aria-hidden="true">file_download</span>
      </button>
    </div>
  )
}
