import Link from 'next/link'

export function InvoiceListHeader() {
  return (
    <div className="mb-xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-xs label-sm text-on-surface-variant hover:text-primary transition-colors mb-md"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Dashboard
      </Link>
      <div className="flex items-start justify-between gap-md">
        <div>
          <h1 className="headline-lg text-on-surface">Invoices</h1>
          <p className="body-md text-on-surface-variant mt-xs">
            Manage and track all your invoices.
          </p>
        </div>
        <Link
          href="/invoice/create"
          className="inline-flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-full label-md hover:bg-primary/90 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Invoice
        </Link>
      </div>
    </div>
  )
}
