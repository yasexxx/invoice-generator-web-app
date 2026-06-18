import { useState, useCallback, useMemo } from 'react'
import type { InvoiceFormData, InvoiceTotals, LineItem, TemplateId } from './invoice.types'

const CURRENT_YEAR = new Date().getFullYear()
const DEFAULT_INVOICE_NUMBER = `INV-${CURRENT_YEAR}-001`

const DEFAULT_DATA: InvoiceFormData = {
  templateId:    'minimalist',
  invoiceNumber: DEFAULT_INVOICE_NUMBER,
  issuerName:    '',
  issuerAddress: '',
  clientName:    '',
  clientEmail:   '',
  clientAddress: '',
  lineItems:     [{ id: '1', description: '', qty: 1, rate: 0 }],
  taxPercent:    10,
  discount:      0,
  notes:         '',
}

export function useInvoiceForm() {
  const [data, setData] = useState<InvoiceFormData>(DEFAULT_DATA)

  const onTemplateChange = useCallback((templateId: TemplateId) => {
    setData((prev) => ({ ...prev, templateId }))
  }, [])

  const onInvoiceNumberChange = useCallback((invoiceNumber: string) => {
    setData((prev) => ({ ...prev, invoiceNumber }))
  }, [])

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
    onInvoiceNumberChange,
    onIssuerChange,
    onClientChange,
    onAddLineItem,
    onUpdateLineItem,
    onRemoveLineItem,
    onTaxChange,
    onDiscountChange,
    onNotesChange,
  }
}
