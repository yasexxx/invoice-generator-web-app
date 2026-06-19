'use client'

import { useState, useTransition }         from 'react'
import { EditorPanel }                      from './editor/EditorPanel'
import { PreviewPanel }                     from './preview/PreviewPanel'
import { InvoiceTopNav }                    from './InvoiceTopNav'
import { useInvoiceForm }                   from './useInvoiceForm'
import { createInvoice }                    from '@/app/invoice/actions'
import { createDraft, updateDraft }         from '@/app/invoices/drafts/actions'
import type { EditorHandlers, InvoiceFormData } from './invoice.types'
import styles                               from './InvoiceCreator.module.css'

const STATUS_IDLE        = 'All changes saved'
const STATUS_PENDING     = 'Saving…'
const STATUS_SUCCESS     = 'Invoice saved!'
const STATUS_DRAFT_SAVED = 'Draft saved!'

export interface InvoiceCreatorProps {
  initialData:    InvoiceFormData | null
  initialDraftId: string | null
  draftNotFound?: boolean
  backHref?:      string
  backLabel?:     string
}

export function InvoiceCreator({ initialData, initialDraftId, draftNotFound = false, backHref, backLabel }: InvoiceCreatorProps) {
  const { data, totals, ...hookHandlers } = useInvoiceForm(initialData)
  const [isPending, startTransition]      = useTransition()
  const [saveStatus, setSaveStatus]       = useState(STATUS_IDLE)
  const [draftId, setDraftId]             = useState<string | null>(initialDraftId)
  const [showDraftBanner, setShowDraftBanner] = useState(draftNotFound)

  const handlers: EditorHandlers = {
    onTemplateChange:      hookHandlers.onTemplateChange,
    onPaperSizeChange:     hookHandlers.onPaperSizeChange,
    onInvoiceNumberChange: hookHandlers.onInvoiceNumberChange,
    onDateChange:          hookHandlers.onDateChange,
    onIssuerChange:        hookHandlers.onIssuerChange,
    onClientChange:        hookHandlers.onClientChange,
    onAddLineItem:         hookHandlers.onAddLineItem,
    onUpdateLineItem:      hookHandlers.onUpdateLineItem,
    onRemoveLineItem:      hookHandlers.onRemoveLineItem,
    onTaxChange:           hookHandlers.onTaxChange,
    onDiscountChange:      hookHandlers.onDiscountChange,
    onNotesChange:         hookHandlers.onNotesChange,
    onSignatureChange:     hookHandlers.onSignatureChange,
  }

  function handleSend() {
    if (isPending) return
    setSaveStatus(STATUS_PENDING)
    startTransition(async () => {
      const result = await createInvoice(data)
      setSaveStatus(result.success ? STATUS_SUCCESS : `Error: ${result.error}`)
    })
  }

  function handleSaveDraft() {
    if (isPending) return
    setSaveStatus(STATUS_PENDING)
    startTransition(async () => {
      const result = draftId
        ? await updateDraft(draftId, data)
        : await createDraft(data)
      if (result.success) {
        setDraftId(result.draftId)
        setSaveStatus(STATUS_DRAFT_SAVED)
      } else {
        setSaveStatus(`Error: ${result.error}`)
      }
    })
  }

  return (
    <div className={styles.shell}>
      <InvoiceTopNav
        saveStatus={saveStatus}
        onSend={handleSend}
        onSaveDraft={handleSaveDraft}
      />
      {showDraftBanner && <DraftNotFoundBanner onDismiss={() => setShowDraftBanner(false)} />}
      <main className={styles.workspace}>
        <EditorPanel  data={data}   handlers={handlers} backHref={backHref} backLabel={backLabel} />
        <PreviewPanel data={data}   totals={totals} />
      </main>
    </div>
  )
}

interface DraftNotFoundBannerProps {
  onDismiss: () => void
}

function DraftNotFoundBanner({ onDismiss }: DraftNotFoundBannerProps) {
  return (
    <div className={styles.draftBanner} role="alert" aria-live="polite">
      <span className={`material-symbols-outlined ${styles.draftBannerIcon}`} aria-hidden="true">
        draft
      </span>
      <div className={styles.draftBannerBody}>
        <span className={styles.draftBannerTitle}>Draft not found</span>
        <span className={styles.draftBannerMessage}>
          The draft you requested no longer exists. Starting a fresh invoice instead.
        </span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className={styles.draftBannerDismiss}
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
  )
}
