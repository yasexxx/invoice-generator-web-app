import Link from 'next/link'
import { BackLink } from '@/components/ui'

export function InvoiceListHeader() {
  return (
    <div className="mb-xl">
      <BackLink href="/dashboard" label="Dashboard" />
      <div className="flex items-start justify-between gap-md">
        <div>
          <h1 className="headline-lg text-on-surface">Invoices</h1>
          <p className="body-md text-on-surface-variant mt-xs">
            Manage and track all your invoices.
          </p>
        </div>
        <div className="flex items-center gap-sm shrink-0">
          <Link
            href="/invoices/drafts"
            className="inline-flex items-center gap-sm border border-outline-variant/40 text-on-surface-variant px-lg py-sm rounded-full label-md hover:border-primary/30 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">draft</span>
            Saved Drafts
          </Link>
          <Link
            href="/invoice/create"
            className="inline-flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-full label-md hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Invoice
          </Link>
        </div>
      </div>
    </div>
  )
}
