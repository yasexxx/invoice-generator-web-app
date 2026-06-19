import { InvoiceCreator }  from '@/components/invoice/InvoiceCreator'
import { getDraftById }    from '@/app/invoices/drafts/actions'
import { BRAND_NAME }      from '@/components/ui'
import type { InvoiceFormData } from '@/components/invoice/invoice.types'

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
  }

  return <InvoiceCreator initialData={initialData} initialDraftId={resolvedDraftId} draftNotFound={draftNotFound} />
}
