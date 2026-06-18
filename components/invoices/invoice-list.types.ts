export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
export type StatusFilter  = 'all' | InvoiceStatus

export interface InvoiceRow {
  id:            string
  invoiceNumber: string
  clientName:    string
  clientEmail:   string
  total:         number
  currency:      string
  status:        InvoiceStatus
  createdAt:     string
  dueDate:       string | null
}
