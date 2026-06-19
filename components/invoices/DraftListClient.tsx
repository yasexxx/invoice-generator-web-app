'use client'

import { useState, useCallback, useMemo, useTransition } from 'react'
import { useRouter }                                       from 'next/navigation'
import Link                                                from 'next/link'
import { DataTable }                                       from '@/components/ui'
import type { Column }                                     from '@/components/ui'
import type { DraftRow }                                   from './draft-list.types'
import { deleteDraft }                                     from '@/app/invoices/drafts/actions'

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(iso))
}

export interface DraftListClientProps {
  rows: DraftRow[]
}

export function DraftListClient({ rows: initialRows }: DraftListClientProps) {
  const [rows, setRows]         = useState(initialRows)
  const [isPending, startTransition] = useTransition()
  const router                  = useRouter()

  const handleDelete = useCallback((id: string) => {
    setRows((prev) => prev.filter((d) => d.id !== id))
    startTransition(async () => {
      await deleteDraft(id)
      router.refresh()
    })
  }, [router])

  const columns = useMemo<Column<DraftRow>[]>(() => [
    { key: 'invoiceNumber', header: 'Invoice #' },
    {
      key: 'clientName',
      header: 'Client',
      render: (val) => {
        const name = val as string
        return name || <span className="text-on-surface-variant/50 italic">No client</span>
      },
    },
    {
      key: 'updatedAt',
      header: 'Last saved',
      render: (val) => formatDate(val as string),
    },
    {
      key: 'id',
      header: '',
      align: 'right',
      render: (val) => (
        <DraftRowActions id={val as string} onDelete={handleDelete} disabled={isPending} />
      ),
    },
  ], [handleDelete, isPending])

  if (rows.length === 0) return <DraftEmptyState />

  return (
    <DataTable
      columns={columns}
      rows={rows}
      keyExtractor={(row) => row.id}
    />
  )
}

interface DraftRowActionsProps {
  id:       string
  onDelete: (id: string) => void
  disabled: boolean
}

function DraftRowActions({ id, onDelete, disabled }: DraftRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-md">
      <Link
        href={`/invoice/create?draft=${id}`}
        className="label-sm text-primary hover:text-primary/80 transition-colors"
      >
        Continue editing
      </Link>
      <button
        type="button"
        onClick={() => onDelete(id)}
        disabled={disabled}
        className="label-sm text-error hover:text-error/80 transition-colors disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  )
}

function DraftEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
      <span className="material-symbols-outlined text-[56px] text-on-surface-variant/40">
        draft
      </span>
      <div>
        <p className="title-md text-on-surface">No saved drafts</p>
        <p className="body-md text-on-surface-variant mt-xs">
          Save a draft while creating an invoice to continue later.
        </p>
      </div>
      <Link
        href="/invoice/create"
        className="inline-flex items-center gap-sm text-primary label-md hover:text-primary/80 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
        Create invoice
      </Link>
    </div>
  )
}
