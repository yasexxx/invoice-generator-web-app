import { BackLink }             from '@/components/ui'
import { TemplateSelector }     from './TemplateSelector'
import { PaperSizeSelector }    from './PaperSizeSelector'
import { InvoiceDetailsSection } from './InvoiceDetailsSection'
import { IssuerInfoSection }    from './IssuerInfoSection'
import { ClientInfoSection }    from './ClientInfoSection'
import { LineItemsEditor }      from './LineItemsEditor'
import { TaxDiscountSection }   from './TaxDiscountSection'
import { NotesSection }         from './NotesSection'
import { SignatureSection }     from './SignatureSection'
import type { EditorHandlers, InvoiceFormData } from '../invoice.types'
import styles from './EditorPanel.module.css'

export interface EditorPanelProps {
  data:     InvoiceFormData
  handlers: EditorHandlers
}

export function EditorPanel({ data, handlers }: EditorPanelProps) {
  return (
    <section className={`${styles.panel} custom-scrollbar`}>
      <div className={styles.content}>
        <EditorHeader />

        <TemplateSelector
          selected={data.templateId}
          onChange={handlers.onTemplateChange}
        />

        <PaperSizeSelector
          selected={data.paperSize}
          onChange={handlers.onPaperSizeChange}
        />

        <InvoiceDetailsSection
          invoiceNumber={data.invoiceNumber}
          issuedDate={data.issuedDate}
          dueDate={data.dueDate}
          onInvoiceNumberChange={handlers.onInvoiceNumberChange}
          onDateChange={handlers.onDateChange}
        />

        <IssuerInfoSection
          issuerName={data.issuerName}
          issuerAddress={data.issuerAddress}
          onChange={handlers.onIssuerChange}
        />

        <ClientInfoSection
          clientName={data.clientName}
          clientEmail={data.clientEmail}
          clientAddress={data.clientAddress}
          onChange={handlers.onClientChange}
        />

        <LineItemsEditor
          lineItems={data.lineItems}
          onAdd={handlers.onAddLineItem}
          onUpdate={handlers.onUpdateLineItem}
          onRemove={handlers.onRemoveLineItem}
        />

        <TaxDiscountSection
          taxPercent={data.taxPercent}
          discount={data.discount}
          onTaxChange={handlers.onTaxChange}
          onDiscountChange={handlers.onDiscountChange}
        />

        <NotesSection notes={data.notes} onChange={handlers.onNotesChange} />

        <SignatureSection signature={data.signature} onChange={handlers.onSignatureChange} />
      </div>
    </section>
  )
}

function EditorHeader() {
  return (
    <header className={styles.header}>
      <BackLink href="/dashboard" label="Dashboard" />
      <h1 className="headline-lg text-primary">Create Invoice</h1>
      <p className="body-md text-text-muted">
        Complete the details below to generate your professional invoice.
      </p>
    </header>
  )
}
