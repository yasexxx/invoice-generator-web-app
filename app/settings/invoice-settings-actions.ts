'use server'

import { headers }       from 'next/headers'
import { getUserEmail }  from '@/lib/auth/session'
import { devLog }        from '@/lib/logger'

const INVOICE_API_URL    = process.env.INVOICE_API_URL ?? 'http://localhost:8080'
const CORRELATION_HEADER = 'x-correlation-id'
const USER_EMAIL_HEADER  = 'X-User-Email'

export interface InvoicePrefix {
  id:       string
  prefix:   string
  selected: boolean
}

export type InvoiceSettingsData = {
  prefixes:          InvoicePrefix[]
  nextInvoiceNumber: string
}

export type InvoiceSettingsResult =
  | { success: true;  data: InvoiceSettingsData }
  | { success: false; error: string }

export type PrefixActionResult =
  | { success: true;  prefix: InvoicePrefix }
  | { success: false; error: string }

export type DeletePrefixResult =
  | { success: true }
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

type ApiSettingsResponse = {
  prefixes:          { id: string; prefix: string; selected: boolean }[]
  nextInvoiceNumber: string
}

type ApiPrefixResponse = { id: string; prefix: string; selected: boolean }

export async function getInvoiceSettings(): Promise<InvoiceSettingsResult> {
  const reqHeaders = await buildHeaders(false)
  devLog('settings/invoice', 'getInvoiceSettings called')

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/settings/invoice`, {
      headers: reqHeaders,
      cache: 'no-store',
    })
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` }
    const json = (await res.json()) as ApiSettingsResponse
    return { success: true, data: { prefixes: json.prefixes, nextInvoiceNumber: json.nextInvoiceNumber } }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function saveInvoicePrefix(prefix: string): Promise<PrefixActionResult> {
  const reqHeaders = await buildHeaders()
  devLog('settings/invoice', 'saveInvoicePrefix called', { prefix })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/settings/invoice/prefixes`, {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({ prefix }),
    })
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string }
      return { success: false, error: detail.detail ?? `HTTP ${res.status}` }
    }
    const json = (await res.json()) as ApiPrefixResponse
    return { success: true, prefix: json }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function selectInvoicePrefix(prefixId: string): Promise<PrefixActionResult> {
  const reqHeaders = await buildHeaders()
  devLog('settings/invoice', 'selectInvoicePrefix called', { prefixId })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/settings/invoice/prefixes/${prefixId}/select`, {
      method: 'PUT',
      headers: reqHeaders,
      body: JSON.stringify({}),
    })
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string }
      return { success: false, error: detail.detail ?? `HTTP ${res.status}` }
    }
    const json = (await res.json()) as ApiPrefixResponse
    return { success: true, prefix: json }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function deleteInvoicePrefix(prefixId: string): Promise<DeletePrefixResult> {
  const reqHeaders = await buildHeaders(false)
  devLog('settings/invoice', 'deleteInvoicePrefix called', { prefixId })

  try {
    const res = await fetch(`${INVOICE_API_URL}/api/v1/settings/invoice/prefixes/${prefixId}`, {
      method: 'DELETE',
      headers: reqHeaders,
    })
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
