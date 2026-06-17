'use client'

import { useState } from 'react'
import { EditorPanel }     from './editor/EditorPanel'
import { PreviewPanel }    from './preview/PreviewPanel'
import { InvoiceTopNav }   from './InvoiceTopNav'
import { useInvoiceForm }  from './useInvoiceForm'
import type { EditorHandlers } from './invoice.types'

export function InvoiceCreator() {
  const { data, totals, ...hookHandlers } = useInvoiceForm()
  const [saveStatus] = useState('All changes saved')

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
    <div className="flex flex-col h-screen overflow-hidden">
      <InvoiceTopNav saveStatus={saveStatus} onSend={() => undefined} />
      <div className="flex-1 grid lg:grid-cols-12 mt-xxl overflow-hidden">
        <EditorPanel  data={data}   handlers={handlers} />
        <PreviewPanel data={data}   totals={totals} />
      </div>
    </div>
  )
}
