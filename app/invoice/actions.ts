'use server'

import { headers } from 'next/headers'
import type { InvoiceFormData } from '@/components/invoice/invoice.types'
import { devLog } from '@/lib/logger'

// Server-only: no NEXT_PUBLIC_ prefix — this URL never reaches the client bundle
const INVOICE_API_URL = process.env.INVOICE_API_URL ?? 'http://localhost:8080'
const CORRELATION_HEADER = 'x-correlation-id'

type TotalsPayload = { subtotal: number; taxAmount: number; total: number }

export type InvoiceActionResult =
  | { success: true; invoiceId: string; totals: TotalsPayload }
  | { success: false; error: string }

export async function createInvoice(data: InvoiceFormData): Promise<InvoiceActionResult> {
  const incomingHeaders = await headers()
  const correlationId = incomingHeaders.get(CORRELATION_HEADER) ?? crypto.randomUUID()

  const body = {
    templateId: data.templateId.toUpperCase().replace(/-/g, '_'),
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientAddress: data.clientAddress,
    lineItems: data.lineItems.map((li) => ({
      description: li.description,
      qty: li.qty,
      rate: li.rate,
    })),
    taxPercent: data.taxPercent,
    discount: data.discount,
    notes: data.notes,
  }

  devLog('invoice/actions', 'createInvoice called', { correlationId, clientEmail: data.clientEmail })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string }
      return { success: false, error: detail.detail ?? `HTTP ${res.status}` }
    }

    const json = (await res.json()) as { invoiceId: string; totals: TotalsPayload }
    devLog('invoice/actions', 'invoice created', { correlationId, invoiceId: json.invoiceId })
    return { success: true, invoiceId: json.invoiceId, totals: json.totals }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
