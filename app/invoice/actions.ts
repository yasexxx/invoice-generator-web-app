'use server'

import { headers }       from 'next/headers'
import { getUserEmail }  from '@/lib/auth/session'
import type { InvoiceFormData } from '@/components/invoice/invoice.types'
import { devLog }        from '@/lib/logger'

const INVOICE_API_URL    = process.env.INVOICE_API_URL ?? 'http://localhost:8080'
const CORRELATION_HEADER = 'x-correlation-id'
const USER_EMAIL_HEADER  = 'X-User-Email'

type TotalsPayload = { subtotal: number; taxAmount: number; total: number }

export type InvoiceActionResult =
  | { success: true; invoiceId: string; totals: TotalsPayload }
  | { success: false; error: string }

async function buildHeaders(): Promise<Record<string, string>> {
  const incomingHeaders = await headers()
  const correlationId   = incomingHeaders.get(CORRELATION_HEADER) ?? crypto.randomUUID()
  const userEmail       = await getUserEmail()
  return {
    'Content-Type':     'application/json',
    'X-Correlation-ID': correlationId,
    [USER_EMAIL_HEADER]: userEmail ?? '',
  }
}

export async function createInvoice(data: InvoiceFormData): Promise<InvoiceActionResult> {
  const reqHeaders = await buildHeaders()
  devLog('invoice/actions', 'createInvoice called', { clientEmail: data.clientEmail })

  const body = {
    templateId:    data.templateId.toUpperCase().replace(/-/g, '_'),
    invoiceNumber: data.invoiceNumber,
    clientName:    data.clientName,
    clientEmail:   data.clientEmail,
    clientAddress: data.clientAddress,
    lineItems:     data.lineItems.map((li) => ({
      description: li.description,
      qty:         li.qty,
      rate:        li.rate,
    })),
    taxPercent: data.taxPercent,
    discount:   data.discount,
    notes:      data.notes,
  }

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/invoices`, {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string }
      return { success: false, error: detail.detail ?? `HTTP ${res.status}` }
    }

    const json = (await res.json()) as { invoiceId: string; totals: TotalsPayload }
    devLog('invoice/actions', 'invoice created', { invoiceId: json.invoiceId })
    return { success: true, invoiceId: json.invoiceId, totals: json.totals }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
