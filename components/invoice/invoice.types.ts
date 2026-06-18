export type TemplateId = 'minimalist' | 'corporate' | 'modern-dark' | 'classic'
export type PaperSize  = 'a4' | 'letter' | 'legal'

export interface LineItem {
  id: string
  description: string
  qty: number
  rate: number
}

export interface InvoiceFormData {
  templateId:    TemplateId
  paperSize:     PaperSize
  invoiceNumber: string
  issuedDate:    string
  dueDate:       string
  issuerName:    string
  issuerAddress: string
  clientName:    string
  clientEmail:   string
  clientAddress: string
  lineItems:     LineItem[]
  taxPercent:    number
  discount:      number
  notes:         string
  signature:     string
}

export interface InvoiceTotals {
  subtotal:  number
  taxAmount: number
  total:     number
}

export interface EditorHandlers {
  onTemplateChange:      (id: TemplateId) => void
  onPaperSizeChange:     (size: PaperSize) => void
  onInvoiceNumberChange: (value: string) => void
  onDateChange:          (field: 'issuedDate' | 'dueDate', value: string) => void
  onIssuerChange:        (field: 'issuerName' | 'issuerAddress', value: string) => void
  onClientChange:        (field: 'clientName' | 'clientEmail' | 'clientAddress', value: string) => void
  onAddLineItem:       () => void
  onUpdateLineItem:    (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => void
  onRemoveLineItem:    (id: string) => void
  onTaxChange:         (value: number) => void
  onDiscountChange:    (value: number) => void
  onNotesChange:       (value: string) => void
  onSignatureChange:   (value: string) => void
}
