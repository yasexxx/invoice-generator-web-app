'use server'

import { headers }      from 'next/headers'
import { getUserEmail } from '@/lib/auth/session'
import { devLog }       from '@/lib/logger'
import type { TemplateId, PaperSize } from '@/components/invoice/invoice.types'

const INVOICE_API_URL    = process.env.INVOICE_API_URL ?? 'http://localhost:8080'
const CORRELATION_HEADER = 'x-correlation-id'
const USER_EMAIL_HEADER  = 'X-User-Email'

export interface InvoicePreferences {
  templateId:    TemplateId
  paperSize:     PaperSize
  issuerName:    string
  issuerAddress: string
  taxPercent:    number
  discount:      number
  signature:     string
}

export type InvoicePreferencesResult =
  | { success: true;  data: InvoicePreferences }
  | { success: false; error: string }

async function buildHeaders(includeContentType = true): Promise<Record<string, string>> {
  const incoming      = await headers()
  const correlationId = incoming.get(CORRELATION_HEADER) ?? crypto.randomUUID()
  const userEmail     = await getUserEmail()
  const base: Record<string, string> = {
    'X-Correlation-ID': correlationId,
    [USER_EMAIL_HEADER]: userEmail ?? '',
  }
  if (includeContentType) base['Content-Type'] = 'application/json'
  return base
}

type ApiPreferencesResponse = {
  templateId:    string
  paperSize:     string
  issuerName:    string
  issuerAddress: string
  taxPercent:    number
  discount:      number
  signature:     string
}

function toPreferences(api: ApiPreferencesResponse): InvoicePreferences {
  return {
    templateId:    api.templateId    as TemplateId,
    paperSize:     api.paperSize     as PaperSize,
    issuerName:    api.issuerName,
    issuerAddress: api.issuerAddress,
    taxPercent:    Number(api.taxPercent),
    discount:      Number(api.discount),
    signature:     api.signature,
  }
}

export async function getInvoicePreferences(): Promise<InvoicePreferencesResult> {
  const reqHeaders = await buildHeaders(false)
  devLog('settings/preferences', 'getInvoicePreferences called')

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/settings/invoice/preferences`, {
      headers: reqHeaders,
      cache: 'no-store',
    })
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` }
    const json = (await res.json()) as ApiPreferencesResponse
    return { success: true, data: toPreferences(json) }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function saveInvoicePreferences(data: InvoicePreferences): Promise<InvoicePreferencesResult> {
  const reqHeaders = await buildHeaders()
  devLog('settings/preferences', 'saveInvoicePreferences called')

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/settings/invoice/preferences`, {
      method: 'PUT',
      headers: reqHeaders,
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string }
      return { success: false, error: detail.detail ?? `HTTP ${res.status}` }
    }
    const json = (await res.json()) as ApiPreferencesResponse
    return { success: true, data: toPreferences(json) }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
