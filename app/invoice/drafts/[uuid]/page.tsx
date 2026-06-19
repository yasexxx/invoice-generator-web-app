import { getDraftById }          from '@/app/invoices/drafts/actions'
import { InvoiceCreator }        from '@/components/invoice/InvoiceCreator'
import { BRAND_NAME }            from '@/components/ui'

export const metadata = { title: `Edit Draft — ${BRAND_NAME}` }

const DRAFTS_HREF  = '/invoices/drafts'
const DRAFTS_LABEL = 'Saved Drafts'

interface DraftInvoicePageProps {
  params: Promise<{ uuid: string }>
}

export default async function DraftInvoicePage({ params }: DraftInvoicePageProps) {
  const { uuid }  = await params
  const result    = await getDraftById(uuid)

  const initialData    = result.success ? result.data    : null
  const initialDraftId = result.success ? result.draftId : null
  const draftNotFound  = !result.success

  return (
    <InvoiceCreator
      initialData={initialData}
      initialDraftId={initialDraftId}
      draftNotFound={draftNotFound}
      backHref={DRAFTS_HREF}
      backLabel={DRAFTS_LABEL}
    />
  )
}
