import { BackLink }             from '@/components/ui'
import { AccordionSection }     from './AccordionSection'
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

        <AccordionSection icon="palette" title="Template Style">
          <TemplateSelector
            selected={data.templateId}
            onChange={handlers.onTemplateChange}
          />
        </AccordionSection>

        <AccordionSection icon="description" title="Paper Size">
          <PaperSizeSelector
            selected={data.paperSize}
            onChange={handlers.onPaperSizeChange}
          />
        </AccordionSection>

        <AccordionSection icon="receipt_long" title="Invoice Details">
          <InvoiceDetailsSection
            invoiceNumber={data.invoiceNumber}
            issuedDate={data.issuedDate}
            dueDate={data.dueDate}
            onInvoiceNumberChange={handlers.onInvoiceNumberChange}
            onDateChange={handlers.onDateChange}
          />
        </AccordionSection>

        <AccordionSection icon="business" title="Your Organization">
          <IssuerInfoSection
            issuerName={data.issuerName}
            issuerAddress={data.issuerAddress}
            onChange={handlers.onIssuerChange}
          />
        </AccordionSection>

        <AccordionSection icon="person" title="Client Information">
          <ClientInfoSection
            clientName={data.clientName}
            clientEmail={data.clientEmail}
            clientAddress={data.clientAddress}
            onChange={handlers.onClientChange}
          />
        </AccordionSection>

        <AccordionSection icon="list_alt" title="Line Items">
          <LineItemsEditor
            lineItems={data.lineItems}
            onAdd={handlers.onAddLineItem}
            onUpdate={handlers.onUpdateLineItem}
            onRemove={handlers.onRemoveLineItem}
          />
        </AccordionSection>

        <AccordionSection icon="calculate" title="Tax & Discount">
          <TaxDiscountSection
            taxPercent={data.taxPercent}
            discount={data.discount}
            onTaxChange={handlers.onTaxChange}
            onDiscountChange={handlers.onDiscountChange}
          />
        </AccordionSection>

        <AccordionSection icon="sticky_note_2" title="Notes & Terms">
          <NotesSection notes={data.notes} onChange={handlers.onNotesChange} />
        </AccordionSection>

        <AccordionSection icon="draw" title="Signature">
          <SignatureSection signature={data.signature} onChange={handlers.onSignatureChange} />
        </AccordionSection>
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
