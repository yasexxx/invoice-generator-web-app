import { useState, useCallback, useMemo } from 'react'
import type { InvoiceFormData, InvoiceTotals, LineItem, PaperSize, TemplateId } from './invoice.types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateForSend(data: InvoiceFormData): string | null {
  if (!data.clientName.trim())  return 'Client name is required'
  if (!data.clientEmail.trim()) return 'Client email is required'
  if (!EMAIL_PATTERN.test(data.clientEmail)) return 'Client email is not a valid address'
  const hasDescribedItem = data.lineItems.some((li) => li.description.trim())
  if (!hasDescribedItem) return 'At least one line item must have a description'
  return null
}

const CURRENT_YEAR           = new Date().getFullYear()
const DEFAULT_INVOICE_NUMBER = `INV-${CURRENT_YEAR}-001`
const DUE_DATE_OFFSET_MS     = 15 * 24 * 60 * 60 * 1000
const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }

const now = new Date()

const DEFAULT_DATA: InvoiceFormData = {
  templateId:    'minimalist',
  paperSize:     'a4',
  invoiceNumber: DEFAULT_INVOICE_NUMBER,
  issuedDate:    now.toLocaleDateString('en-US', DATE_FORMAT),
  dueDate:       new Date(now.getTime() + DUE_DATE_OFFSET_MS).toLocaleDateString('en-US', DATE_FORMAT),
  issuerName:    '',
  issuerAddress: '',
  clientName:    '',
  clientEmail:   '',
  clientAddress: '',
  lineItems:     [{ id: '1', description: '', qty: 1, rate: 0 }],
  taxPercent:    10,
  discount:      0,
  notes:         '',
  signature:     '',
}

export function useInvoiceForm(initialData?: InvoiceFormData | null) {
  const [data, setData] = useState<InvoiceFormData>(initialData ?? DEFAULT_DATA)

  const onTemplateChange = useCallback((templateId: TemplateId) => {
    setData((prev) => ({ ...prev, templateId }))
  }, [])

  const onPaperSizeChange = useCallback((paperSize: PaperSize) => {
    setData((prev) => ({ ...prev, paperSize }))
  }, [])

  const onInvoiceNumberChange = useCallback((invoiceNumber: string) => {
    setData((prev) => ({ ...prev, invoiceNumber }))
  }, [])

  const onDateChange = useCallback(
    (field: 'issuedDate' | 'dueDate', value: string) => {
      setData((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const onIssuerChange = useCallback(
    (field: 'issuerName' | 'issuerAddress', value: string) => {
      setData((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const onClientChange = useCallback(
    (field: 'clientName' | 'clientEmail' | 'clientAddress', value: string) => {
      setData((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const onAddLineItem = useCallback(() => {
    const id = crypto.randomUUID()
    setData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { id, description: '', qty: 1, rate: 0 }],
    }))
  }, [])

  const onUpdateLineItem = useCallback(
    (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
      setData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) =>
          item.id === id
            ? { ...item, [field]: field === 'description' ? value : Number(value) }
            : item,
        ),
      }))
    },
    [],
  )

  const onRemoveLineItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }, [])

  const onTaxChange = useCallback((value: number) => {
    setData((prev) => ({ ...prev, taxPercent: value }))
  }, [])

  const onDiscountChange = useCallback((value: number) => {
    setData((prev) => ({ ...prev, discount: value }))
  }, [])

  const onNotesChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, notes: value }))
  }, [])

  const onSignatureChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, signature: value }))
  }, [])

  const totals = useMemo<InvoiceTotals>(() => {
    const subtotal  = data.lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0)
    const taxAmount = subtotal * (data.taxPercent / 100)
    const total     = subtotal + taxAmount - data.discount
    return { subtotal, taxAmount, total }
  }, [data.lineItems, data.taxPercent, data.discount])

  return {
    data,
    totals,
    onTemplateChange,
    onPaperSizeChange,
    onInvoiceNumberChange,
    onDateChange,
    onIssuerChange,
    onClientChange,
    onAddLineItem,
    onUpdateLineItem,
    onRemoveLineItem,
    onTaxChange,
    onDiscountChange,
    onNotesChange,
    onSignatureChange,
  }
}
