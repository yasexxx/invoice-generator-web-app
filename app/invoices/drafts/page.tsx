import { getUserEmail }    from '@/lib/auth/session'
import { DashboardNav }    from '@/components/dashboard/DashboardNav'
import { DraftListHeader } from '@/components/invoices/DraftListHeader'
import { DraftListClient } from '@/components/invoices/DraftListClient'
import { listDrafts }      from './actions'
import { BRAND_NAME }      from '@/components/ui'

export const metadata = { title: `Saved Drafts — ${BRAND_NAME}` }

export default async function DraftsPage() {
  const [email, result] = await Promise.all([getUserEmail(), listDrafts()])
  const rows = result.success ? result.rows : []

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <DashboardNav email={email} />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-lg py-xl">
        <DraftListHeader />
        <DraftListClient rows={rows} />
      </main>
    </div>
  )
}
