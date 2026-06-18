'use server'

import { headers } from 'next/headers'
import type { InvoiceRow } from '@/components/invoices/invoice-list.types'
import { devLog }          from '@/lib/logger'

const INVOICE_API_URL    = process.env.INVOICE_API_URL ?? 'http://localhost:8080'
const CORRELATION_HEADER = 'x-correlation-id'

export type ListInvoicesResult =
  | { success: true;  rows: InvoiceRow[] }
  | { success: false; error: string }

export async function listInvoices(): Promise<ListInvoicesResult> {
  const incomingHeaders = await headers()
  const correlationId   = incomingHeaders.get(CORRELATION_HEADER) ?? crypto.randomUUID()

  devLog('invoices/actions', 'listInvoices called', { correlationId })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/invoices`, {
      headers: { 'X-Correlation-ID': correlationId },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` }
    }

    const json = (await res.json()) as { invoices: InvoiceRow[] }
    devLog('invoices/actions', 'invoices fetched', { correlationId, count: json.invoices.length })
    return { success: true, rows: json.invoices }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
