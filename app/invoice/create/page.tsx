import { InvoiceCreator } from '@/components/invoice/InvoiceCreator'
import { BRAND_NAME } from '@/components/ui'

export const metadata = { title: `Create Invoice — ${BRAND_NAME}` }

export default function CreateInvoicePage() {
  return <InvoiceCreator />
}
