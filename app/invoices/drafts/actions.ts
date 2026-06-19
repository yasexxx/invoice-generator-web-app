'use server'

import { headers }          from 'next/headers'
import type { InvoiceFormData } from '@/components/invoice/invoice.types'
import type { DraftRow }    from '@/components/invoices/draft-list.types'
import { devLog }           from '@/lib/logger'

const INVOICE_API_URL    = process.env.INVOICE_API_URL ?? 'http://localhost:8080'
const CORRELATION_HEADER = 'x-correlation-id'

async function getCorrelationId(): Promise<string> {
  const incoming = await headers()
  return incoming.get(CORRELATION_HEADER) ?? crypto.randomUUID()
}

type ApiLineItem = { id: string; description: string; qty: number; rate: number }

type DraftApiResponse = {
  draftId:       string
  templateId:    string
  paperSize:     string
  invoiceNumber: string
  issuedDate:    string
  dueDate:       string
  issuerName:    string
  issuerAddress: string
  clientName:    string
  clientEmail:   string
  clientAddress: string
  lineItems:     ApiLineItem[]
  taxPercent:    number
  discount:      number
  notes:         string
  signature:     string
  updatedAt:     string
}

type DraftSummaryApiResponse = {
  draftId:       string
  invoiceNumber: string
  clientName:    string
  updatedAt:     string
}

export type CreateDraftResult =
  | { success: true;  draftId: string }
  | { success: false; error: string }

export type GetDraftResult =
  | { success: true;  data: InvoiceFormData; draftId: string }
  | { success: false; error: string }

export type ListDraftsResult =
  | { success: true;  rows: DraftRow[] }
  | { success: false; error: string }

export type DeleteDraftResult =
  | { success: true }
  | { success: false; error: string }

function toRequestBody(data: InvoiceFormData) {
  return {
    templateId:    data.templateId.toUpperCase().replace(/-/g, '_'),
    paperSize:     data.paperSize,
    invoiceNumber: data.invoiceNumber,
    issuedDate:    data.issuedDate,
    dueDate:       data.dueDate,
    issuerName:    data.issuerName,
    issuerAddress: data.issuerAddress,
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
    signature:  data.signature,
  }
}

function toInvoiceFormData(api: DraftApiResponse): InvoiceFormData {
  return {
    templateId:    api.templateId.toLowerCase().replace(/_/g, '-') as InvoiceFormData['templateId'],
    paperSize:     api.paperSize as InvoiceFormData['paperSize'],
    invoiceNumber: api.invoiceNumber,
    issuedDate:    api.issuedDate,
    dueDate:       api.dueDate,
    issuerName:    api.issuerName,
    issuerAddress: api.issuerAddress,
    clientName:    api.clientName,
    clientEmail:   api.clientEmail,
    clientAddress: api.clientAddress,
    lineItems:     api.lineItems.map((li) => ({
      id:          li.id,
      description: li.description,
      qty:         li.qty,
      rate:        li.rate,
    })),
    taxPercent: api.taxPercent,
    discount:   api.discount,
    notes:      api.notes,
    signature:  api.signature,
  }
}

export async function createDraft(data: InvoiceFormData): Promise<CreateDraftResult> {
  const correlationId = await getCorrelationId()
  devLog('drafts/actions', 'createDraft called', { correlationId })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/drafts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Correlation-ID': correlationId },
      body: JSON.stringify(toRequestBody(data)),
    })
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string }
      return { success: false, error: detail.detail ?? `HTTP ${res.status}` }
    }
    const json = (await res.json()) as { draftId: string }
    devLog('drafts/actions', 'draft created', { correlationId, draftId: json.draftId })
    return { success: true, draftId: json.draftId }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function updateDraft(id: string, data: InvoiceFormData): Promise<CreateDraftResult> {
  const correlationId = await getCorrelationId()
  devLog('drafts/actions', 'updateDraft called', { correlationId, id })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/drafts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Correlation-ID': correlationId },
      body: JSON.stringify(toRequestBody(data)),
    })
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string }
      return { success: false, error: detail.detail ?? `HTTP ${res.status}` }
    }
    const json = (await res.json()) as { draftId: string }
    return { success: true, draftId: json.draftId }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function getDraftById(id: string): Promise<GetDraftResult> {
  const correlationId = await getCorrelationId()
  devLog('drafts/actions', 'getDraftById called', { correlationId, id })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/drafts/${id}`, {
      headers: { 'X-Correlation-ID': correlationId },
      cache: 'no-store',
    })
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` }
    const json = (await res.json()) as DraftApiResponse
    return { success: true, draftId: json.draftId, data: toInvoiceFormData(json) }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function listDrafts(): Promise<ListDraftsResult> {
  const correlationId = await getCorrelationId()
  devLog('drafts/actions', 'listDrafts called', { correlationId })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/drafts`, {
      headers: { 'X-Correlation-ID': correlationId },
      cache: 'no-store',
    })
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` }
    const json = (await res.json()) as DraftSummaryApiResponse[]
    const rows: DraftRow[] = json.map((d) => ({
      id:            d.draftId,
      invoiceNumber: d.invoiceNumber,
      clientName:    d.clientName,
      updatedAt:     d.updatedAt,
    }))
    devLog('drafts/actions', 'drafts listed', { correlationId, count: rows.length })
    return { success: true, rows }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function deleteDraft(id: string): Promise<DeleteDraftResult> {
  const correlationId = await getCorrelationId()
  devLog('drafts/actions', 'deleteDraft called', { correlationId, id })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/drafts/${id}`, {
      method: 'DELETE',
      headers: { 'X-Correlation-ID': correlationId },
    })
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
