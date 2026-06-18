import { getUserEmail }       from '@/lib/auth/session'
import { DashboardNav }      from '@/components/dashboard/DashboardNav'
import { InvoiceListHeader } from '@/components/invoices/InvoiceListHeader'
import { InvoiceListClient } from '@/components/invoices/InvoiceListClient'
import { listInvoices }      from './actions'

export default async function InvoicesPage() {
  const [email, result] = await Promise.all([getUserEmail(), listInvoices()])
  const rows = result.success ? result.rows : []

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <DashboardNav email={email} />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-lg py-xl">
        <InvoiceListHeader />
        <InvoiceListClient rows={rows} />
      </main>
    </div>
  )
}
