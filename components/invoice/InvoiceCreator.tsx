'use client'

import { EditorPanel }     from './editor/EditorPanel'
import { PreviewPanel }    from './preview/PreviewPanel'
import { InvoiceTopNav }   from './InvoiceTopNav'
import { useInvoiceForm }  from './useInvoiceForm'
import type { EditorHandlers } from './invoice.types'
import styles from './InvoiceCreator.module.css'

export function InvoiceCreator() {
  const { data, totals, ...hookHandlers } = useInvoiceForm()
  const saveStatus = 'All changes saved'

  const handlers: EditorHandlers = {
    onTemplateChange:  hookHandlers.onTemplateChange,
    onClientChange:    hookHandlers.onClientChange,
    onAddLineItem:     hookHandlers.onAddLineItem,
    onUpdateLineItem:  hookHandlers.onUpdateLineItem,
    onRemoveLineItem:  hookHandlers.onRemoveLineItem,
    onTaxChange:       hookHandlers.onTaxChange,
    onDiscountChange:  hookHandlers.onDiscountChange,
    onNotesChange:     hookHandlers.onNotesChange,
  }

  return (
    <div className={styles.shell}>
      <InvoiceTopNav saveStatus={saveStatus} onSend={() => undefined} />
      <main className={styles.workspace}>
        <EditorPanel  data={data}   handlers={handlers} />
        <PreviewPanel data={data}   totals={totals} />
      </main>
    </div>
  )
}
