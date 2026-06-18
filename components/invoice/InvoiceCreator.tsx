'use client'

import { useState, useTransition } from 'react'
import { EditorPanel }     from './editor/EditorPanel'
import { PreviewPanel }    from './preview/PreviewPanel'
import { InvoiceTopNav }   from './InvoiceTopNav'
import { useInvoiceForm }  from './useInvoiceForm'
import { createInvoice }   from '@/app/invoice/actions'
import type { EditorHandlers } from './invoice.types'
import styles from './InvoiceCreator.module.css'

const STATUS_IDLE    = 'All changes saved'
const STATUS_PENDING = 'Saving…'
const STATUS_SUCCESS = 'Invoice saved!'

export function InvoiceCreator() {
  const { data, totals, ...hookHandlers } = useInvoiceForm()
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState(STATUS_IDLE)

  const handlers: EditorHandlers = {
    onTemplateChange:      hookHandlers.onTemplateChange,
    onPaperSizeChange:     hookHandlers.onPaperSizeChange,
    onInvoiceNumberChange: hookHandlers.onInvoiceNumberChange,
    onDateChange:          hookHandlers.onDateChange,
    onIssuerChange:        hookHandlers.onIssuerChange,
    onClientChange:        hookHandlers.onClientChange,
    onAddLineItem:       hookHandlers.onAddLineItem,
    onUpdateLineItem:    hookHandlers.onUpdateLineItem,
    onRemoveLineItem:    hookHandlers.onRemoveLineItem,
    onTaxChange:         hookHandlers.onTaxChange,
    onDiscountChange:    hookHandlers.onDiscountChange,
    onNotesChange:       hookHandlers.onNotesChange,
    onSignatureChange:   hookHandlers.onSignatureChange,
  }

  function handleSend() {
    if (isPending) return
    setSaveStatus(STATUS_PENDING)
    startTransition(async () => {
      const result = await createInvoice(data)
      setSaveStatus(result.success ? STATUS_SUCCESS : `Error: ${result.error}`)
    })
  }

  return (
    <div className={styles.shell}>
      <InvoiceTopNav saveStatus={saveStatus} onSend={handleSend} />
      <main className={styles.workspace}>
        <EditorPanel  data={data}   handlers={handlers} />
        <PreviewPanel data={data}   totals={totals} />
      </main>
    </div>
  )
}
