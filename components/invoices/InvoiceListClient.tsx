'use client'

import { useState }                         from 'react'
import Link                                  from 'next/link'
import { Badge, DataTable }                  from '@/components/ui'
import type { Column }                       from '@/components/ui'
import type { BadgeStatus }                  from '@/components/ui'
import type { InvoiceRow, InvoiceStatus, StatusFilter } from './invoice-list.types'
import { InvoiceEmptyState }                 from './InvoiceEmptyState'

const STATUS_FILTERS: StatusFilter[] = ['all', 'draft', 'sent', 'paid', 'overdue']

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'All', draft: 'Draft', sent: 'Sent', paid: 'Paid', overdue: 'Overdue',
}

const STATUS_BADGE_MAP: Record<InvoiceStatus, BadgeStatus> = {
  draft:   'default',
  sent:    'info',
  paid:    'success',
  overdue: 'error',
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso))
}

const INVOICE_COLUMNS: Column<InvoiceRow>[] = [
  { key: 'invoiceNumber', header: 'Invoice #' },
  { key: 'clientName',    header: 'Client' },
  {
    key: 'createdAt',
    header: 'Issued',
    render: (val) => formatDate(val as string),   // T[keyof T] union — createdAt is string
  },
  {
    key: 'dueDate',
    header: 'Due',
    render: (val) => {
      const d = val as string | null              // T[keyof T] union — dueDate is string | null
      return d ? formatDate(d) : '—'
    },
  },
  {
    key: 'total',
    header: 'Amount',
    align: 'right',
    render: (val, row) => formatCurrency(val as number, row.currency), // T[keyof T] union
  },
  {
    key: 'status',
    header: 'Status',
    render: (val) => {
      const s = val as InvoiceStatus              // T[keyof T] union — status is InvoiceStatus
      return <Badge status={STATUS_BADGE_MAP[s]}>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
    },
  },
  {
    key: 'id',
    header: '',
    align: 'right',
    render: (val) => (
      <Link
        href={`/invoice/${val as string}`}        // T[keyof T] union — id is string
        className="label-sm text-primary hover:text-primary/80 transition-colors"
      >
        View
      </Link>
    ),
  },
]

export interface InvoiceListClientProps {
  rows: InvoiceRow[]
}

export function InvoiceListClient({ rows }: InvoiceListClientProps) {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter)

  return (
    <div className="flex flex-col gap-lg">
      <StatusTabs rows={rows} selected={filter} onChange={setFilter} />
      {filtered.length === 0 ? (
        <InvoiceEmptyState filtered={rows.length > 0} />
      ) : (
        <DataTable
          columns={INVOICE_COLUMNS}
          rows={filtered}
          keyExtractor={(row) => row.id}
        />
      )}
    </div>
  )
}

interface StatusTabsProps {
  rows:     InvoiceRow[]
  selected: StatusFilter
  onChange: (f: StatusFilter) => void
}

function StatusTabs({ rows, selected, onChange }: StatusTabsProps) {
  return (
    <div className="flex gap-xs flex-wrap" role="tablist" aria-label="Filter invoices by status">
      {STATUS_FILTERS.map((f) => {
        const count = f === 'all' ? rows.length : rows.filter((r) => r.status === f).length
        const isSelected = selected === f
        return (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(f)}
            className={[
              'label-md px-md py-sm rounded-full border transition-colors',
              isSelected
                ? 'bg-primary-container text-on-primary-container border-primary/30'
                : 'bg-transparent text-on-surface-variant border-outline-variant/30 hover:border-primary/20 hover:text-on-surface',
            ].join(' ')}
          >
            {FILTER_LABELS[f]} ({count})
          </button>
        )
      })}
    </div>
  )
}
