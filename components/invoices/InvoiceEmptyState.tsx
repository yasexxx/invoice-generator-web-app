import Link from 'next/link'

interface InvoiceEmptyStateProps {
  filtered?: boolean
}

export function InvoiceEmptyState({ filtered = false }: InvoiceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
      <span className="material-symbols-outlined text-[56px] text-on-surface-variant/40">
        {filtered ? 'filter_list_off' : 'receipt_long'}
      </span>
      <div>
        <p className="title-md text-on-surface">
          {filtered ? 'No invoices match this filter' : 'No invoices yet'}
        </p>
        <p className="body-md text-on-surface-variant mt-xs">
          {filtered
            ? 'Try selecting a different status.'
            : 'Create your first invoice to get started.'}
        </p>
      </div>
      {!filtered && (
        <Link
          href="/invoice/create"
          className="inline-flex items-center gap-sm text-primary label-md hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Create invoice
        </Link>
      )}
    </div>
  )
}
