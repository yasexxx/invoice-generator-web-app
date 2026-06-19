import { InvoiceCreator }        from '@/components/invoice/InvoiceCreator'
import { getDraftById }          from '@/app/invoices/drafts/actions'
import { getInvoiceSettings }    from '@/app/settings/invoice-settings-actions'
import { getInvoicePreferences } from '@/app/settings/invoice-preferences-actions'
import { BRAND_NAME }            from '@/components/ui'
import type { InvoiceFormData }  from '@/components/invoice/invoice.types'

export const metadata = { title: `Create Invoice — ${BRAND_NAME}` }

interface CreateInvoicePageProps {
  searchParams: Promise<{ draft?: string }>
}

export default async function CreateInvoicePage({ searchParams }: CreateInvoicePageProps) {
  const { draft: draftId } = await searchParams

  let initialData: InvoiceFormData | null = null
  let resolvedDraftId: string | null = null
  let draftNotFound = false

  if (draftId) {
    const result = await getDraftById(draftId)
    if (result.success) {
      initialData     = result.data
      resolvedDraftId = result.draftId
    } else {
      draftNotFound = true
    }
  } else {
    const [settingsResult, preferencesResult] = await Promise.all([
      getInvoiceSettings(),
      getInvoicePreferences(),
    ])
    const base = buildDefaultData()
    if (preferencesResult.success) {
      const p = preferencesResult.data
      base.templateId    = p.templateId
      base.paperSize     = p.paperSize
      base.issuerName    = p.issuerName
      base.issuerAddress = p.issuerAddress
      base.taxPercent    = p.taxPercent
      base.discount      = p.discount
      base.signature     = p.signature
    }
    if (settingsResult.success && settingsResult.data.nextInvoiceNumber) {
      base.invoiceNumber = settingsResult.data.nextInvoiceNumber
    }
    initialData = base
  }

  return <InvoiceCreator initialData={initialData} initialDraftId={resolvedDraftId} draftNotFound={draftNotFound} />
}

function buildDefaultData(): InvoiceFormData {
  const now             = new Date()
  const DUE_OFFSET_MS   = 15 * 24 * 60 * 60 * 1000
  const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return {
    templateId:    'minimalist',
    paperSize:     'a4',
    invoiceNumber: '',
    issuedDate:    now.toLocaleDateString('en-US', DATE_FORMAT),
    dueDate:       new Date(now.getTime() + DUE_OFFSET_MS).toLocaleDateString('en-US', DATE_FORMAT),
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
}
