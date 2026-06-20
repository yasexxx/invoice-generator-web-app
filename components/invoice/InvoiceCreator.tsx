'use client'

import { useState, useTransition }              from 'react'
import { EditorPanel }                           from './editor/EditorPanel'
import { PreviewPanel }                          from './preview/PreviewPanel'
import { InvoiceTopNav }                         from './InvoiceTopNav'
import { SendSheet }                             from './send/SendSheet'
import { useInvoiceForm, validateForSend }       from './useInvoiceForm'
import { createInvoice }                         from '@/app/invoice/actions'
import { createDraft, updateDraft }              from '@/app/invoices/drafts/actions'
import type { EditorHandlers, InvoiceFormData }  from './invoice.types'
import type { SendStatus }                       from './send/SendSheet'
import styles                                    from './InvoiceCreator.module.css'

const STATUS_IDLE        = 'All changes saved'
const STATUS_PENDING     = 'Saving…'
const STATUS_SUCCESS     = 'Invoice sent!'
const STATUS_DRAFT_SAVED = 'Draft saved!'

const DOC_VAR_NAMES = [
  '--doc-bg', '--doc-header-bar-bg', '--doc-header-bar-text',
  '--doc-title-text', '--doc-body-text', '--doc-muted-text',
  '--doc-accent', '--doc-border', '--doc-top-accent-border',
  '--doc-font-family', '--doc-heading-weight', '--doc-label-spacing',
] as const

// Physical paper widths in CSS px (1px = 1/96 in).
// Used to scale the popup page from preview size up to full-paper size via CSS zoom.
const PAPER_SPECS: Record<InvoiceFormData['paperSize'], { cssWidth: number; pageSize: string }> = {
  a4:     { cssWidth: 794, pageSize: 'A4 portrait' },
  letter: { cssWidth: 816, pageSize: 'letter portrait' },
  legal:  { cssWidth: 816, pageSize: 'legal portrait' },
}

function buildDocVarsCss(cs: CSSStyleDeclaration): string {
  const decls = DOC_VAR_NAMES
    .map((v) => [v, cs.getPropertyValue(v).trim()] as const)
    .filter(([, val]) => val)
    .map(([v, val]) => `${v}: ${val}`)
    .join('; ')
  return `[data-invoice-page] { ${decls}; }`
}

export interface InvoiceCreatorProps {
  initialData:    InvoiceFormData | null
  initialDraftId: string | null
  draftNotFound?: boolean
  backHref?:      string
  backLabel?:     string
}

export function InvoiceCreator({
  initialData,
  initialDraftId,
  draftNotFound = false,
  backHref,
  backLabel,
}: InvoiceCreatorProps) {
  const { data, totals, ...hookHandlers } = useInvoiceForm(initialData)
  const [isPending, startTransition]      = useTransition()
  const [saveStatus, setSaveStatus]       = useState(STATUS_IDLE)
  const [draftId, setDraftId]             = useState<string | null>(initialDraftId)
  const [showDraftBanner, setShowDraftBanner] = useState(draftNotFound)

  const [sheetOpen, setSheetOpen]     = useState(false)
  const [sendStatus, setSendStatus]   = useState<SendStatus>('confirm')
  const [sendError, setSendError]     = useState<string | null>(null)

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
    const validationError = validateForSend(data)
    if (validationError) {
      setSaveStatus(`Error: ${validationError}`)
      return
    }
    setSendStatus('confirm')
    setSendError(null)
    setSheetOpen(true)
  }

  function handleConfirmSend(email: string) {
    if (sendStatus === 'sending') return
    setSendStatus('sending')
    startTransition(async () => {
      const invoiceData = email !== data.clientEmail ? { ...data, clientEmail: email } : data
      const result = await createInvoice(invoiceData)
      if (result.success) {
        setSendStatus('success')
        setSaveStatus(STATUS_SUCCESS)
      } else {
        setSendStatus('error')
        setSendError(result.error)
      }
    })
  }

  function handleCloseSheet() {
    setSheetOpen(false)
    setSendStatus('confirm')
    setSendError(null)
  }

  async function handleDownloadPdf(): Promise<void> {
    const pages = Array.from(document.querySelectorAll<HTMLElement>('[data-invoice-page]'))
    if (!pages.length) return

    // Snapshot the rendered width of the live preview page.
    // All inline px font-sizes in InvoiceDocument.tsx were authored for this
    // width. The popup renders each page at previewWidth so proportions match
    // the preview, then CSS zoom scales it up to the physical paper width so
    // the content fills the full page in the PDF.
    const { cssWidth: paperWidth, pageSize } = PAPER_SPECS[data.paperSize]
    const previewWidth = Math.round(pages[0].getBoundingClientRect().width) || paperWidth
    const zoomScale    = (paperWidth / previewWidth).toFixed(4)

    // Fetch all external stylesheets and inline them to avoid race conditions.
    // In production Next.js uses <link> tags; in dev it uses <style> tags.
    const linkHrefs = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
    ).map((l) => l.href).filter(Boolean)

    const externalCss = (
      await Promise.all(
        linkHrefs.map((url) => fetch(url).then((r) => r.text()).catch(() => ''))
      )
    ).join('\n')

    const inlinedStyles = Array.from(document.head.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n')

    // Read live --doc-* CSS variable values from the first page so theme
    // colours survive the move to the blob document where cascade may differ.
    const resolvedDocVars = buildDocVarsCss(getComputedStyle(pages[0]))

    const printCss = [
      `*, *::before, *::after {`,
      `  -webkit-print-color-adjust: exact !important;`,
      `  print-color-adjust: exact !important;`,
      `  box-sizing: border-box;`,
      `}`,
      `@page { margin: 0; size: ${pageSize}; }`,
      `body { margin: 0; padding: 0; background: #fff; width: ${paperWidth}px; }`,
      `[data-invoice-page] {`,
      `  page-break-after: always; break-after: page;`,
      `  width: ${previewWidth}px !important;`,
      `  zoom: ${zoomScale};`,
      `  overflow: visible !important;`,
      `}`,
      resolvedDocVars,
    ].join('\n')

    const bodyHtml = pages.map((p) => p.outerHTML).join('\n')

    const html = [
      '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
      `<style>${externalCss}</style>`,
      `<style>${inlinedStyles}</style>`,
      `<style>${printCss}</style>`,
      `</head><body>${bodyHtml}</body></html>`,
    ].join('\n')

    const blob   = new Blob([html], { type: 'text/html' })
    const blobUrl = URL.createObjectURL(blob)
    const popup  = window.open(blobUrl, '_blank', 'width=900,height=700')
    if (!popup) { URL.revokeObjectURL(blobUrl); return }

    popup.addEventListener('load', () => {
      void (popup.document.fonts?.ready ?? Promise.resolve()).then(() => {
        popup.focus()
        popup.print()
      })
      popup.addEventListener('afterprint', () => {
        popup.close()
        URL.revokeObjectURL(blobUrl)
      })
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

      <SendSheet
        isOpen={sheetOpen}
        clientEmail={data.clientEmail}
        status={sendStatus}
        errorMessage={sendError}
        onClose={handleCloseSheet}
        onConfirm={handleConfirmSend}
        onDownload={handleDownloadPdf}
      />
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
