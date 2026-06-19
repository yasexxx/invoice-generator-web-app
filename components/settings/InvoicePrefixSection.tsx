'use client'

import { useState, useTransition } from 'react'
import { Input, Button }          from '@/components/ui'
import {
  saveInvoicePrefix,
  selectInvoicePrefix,
  deleteInvoicePrefix,
  getInvoiceSettings,
} from '@/app/settings/invoice-settings-actions'
import type { InvoicePrefix, InvoiceSettingsData } from '@/app/settings/invoice-settings-actions'

const MAX_PREFIX_LENGTH = 50

export interface InvoicePrefixSectionProps {
  initialData: InvoiceSettingsData | null
}

export function InvoicePrefixSection({ initialData }: InvoicePrefixSectionProps) {
  const [prefixes, setPrefixes]       = useState<InvoicePrefix[]>(initialData?.prefixes ?? [])
  const [nextNumber, setNextNumber]   = useState(initialData?.nextInvoiceNumber ?? '')
  const [prefixInput, setPrefixInput] = useState('')
  const [error, setError]             = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  const refreshNextNumber = async () => {
    const result = await getInvoiceSettings()
    if (result.success) setNextNumber(result.data.nextInvoiceNumber)
  }

  const handleAdd = () => {
    const trimmed = prefixInput.trim()
    if (!trimmed) return
    setError(null)
    startTransition(async () => {
      const result = await saveInvoicePrefix(trimmed)
      if (!result.success) { setError(result.error); return }
      setPrefixes((prev) =>
        prev.map((p) => ({ ...p, selected: false }))
            .filter((p) => p.id !== result.prefix.id)
            .concat(result.prefix),
      )
      setPrefixInput('')
      await refreshNextNumber()
    })
  }

  const handleSelect = (id: string) => {
    setError(null)
    startTransition(async () => {
      const result = await selectInvoicePrefix(id)
      if (!result.success) { setError(result.error); return }
      setPrefixes((prev) => prev.map((p) => ({ ...p, selected: p.id === result.prefix.id })))
      await refreshNextNumber()
    })
  }

  const handleDelete = (id: string) => {
    setError(null)
    startTransition(async () => {
      const wasSelected = prefixes.find((p) => p.id === id)?.selected ?? false
      const result = await deleteInvoicePrefix(id)
      if (!result.success) { setError(result.error); return }
      setPrefixes((prev) => prev.filter((p) => p.id !== id))
      if (wasSelected) await refreshNextNumber()
    })
  }

  const selectedPrefix = prefixes.find((p) => p.selected)

  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-lg">
      <PrefixSectionHeading />
      <NextNumberDisplay nextNumber={nextNumber} selectedPrefix={selectedPrefix?.prefix} isPending={isPending} />
      <PrefixInput value={prefixInput} onChange={setPrefixInput} onAdd={handleAdd} isPending={isPending} />
      {error && <p className="body-sm text-error">{error}</p>}
      <PrefixList prefixes={prefixes} isPending={isPending} onSelect={handleSelect} onDelete={handleDelete} />
    </div>
  )
}

function PrefixSectionHeading() {
  return (
    <div className="flex items-center gap-sm">
      <span className="material-symbols-outlined text-[22px] text-primary">receipt_long</span>
      <div>
        <h2 className="title-md text-on-surface">Invoice Numbering</h2>
        <p className="body-sm text-on-surface-variant mt-xs">
          Define prefix formats. The active prefix drives the auto-generated next number.
        </p>
      </div>
    </div>
  )
}

interface NextNumberDisplayProps {
  nextNumber:     string
  selectedPrefix: string | undefined
  isPending:      boolean
}

function NextNumberDisplay({ nextNumber, selectedPrefix, isPending }: NextNumberDisplayProps) {
  if (!nextNumber && !isPending) return null
  return (
    <div className="flex items-center gap-sm p-md bg-surface-container rounded-lg">
      <span className={['material-symbols-outlined text-[18px] text-primary transition-opacity', isPending ? 'opacity-50' : ''].join(' ')}>
        auto_awesome
      </span>
      <div>
        <span className="label-sm text-on-surface-variant">Next invoice number</span>
        <p className={['title-sm text-on-surface font-mono transition-opacity', isPending ? 'opacity-40' : ''].join(' ')}>
          {nextNumber || '—'}
        </p>
        {selectedPrefix && !isPending && (
          <p className="body-xs text-on-surface-variant">using prefix: <span className="font-mono">{selectedPrefix}</span></p>
        )}
      </div>
    </div>
  )
}

interface PrefixInputProps {
  value: string; onChange: (v: string) => void; onAdd: () => void; isPending: boolean
}

function PrefixInput({ value, onChange, onAdd, isPending }: PrefixInputProps) {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex gap-sm items-end">
        <div className="flex-1">
          <Input
            label="Prefix format"
            placeholder="e.g. INV-2024- or BILL-"
            value={value}
            maxLength={MAX_PREFIX_LENGTH}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onAdd() }}
          />
        </div>
        <Button type="button" variant="primary" size="md" disabled={!value.trim() || isPending} onClick={onAdd}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add
        </Button>
      </div>
      <p className="body-xs text-on-surface-variant">Use letters, numbers, and hyphens. The number is appended automatically.</p>
    </div>
  )
}

interface PrefixListProps {
  prefixes: InvoicePrefix[]; isPending: boolean
  onSelect: (id: string) => void; onDelete: (id: string) => void
}

function PrefixList({ prefixes, isPending, onSelect, onDelete }: PrefixListProps) {
  if (prefixes.length === 0) {
    return <p className="body-sm text-on-surface-variant text-center py-md">No prefixes saved yet. Add one above to get started.</p>
  }
  return (
    <div className="flex flex-col gap-xs">
      <span className="label-md text-on-surface-variant">Saved prefixes</span>
      <ul className="flex flex-col gap-xs">
        {prefixes.map((p) => (
          <PrefixRow key={p.id} prefix={p} isPending={isPending} onSelect={onSelect} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  )
}

interface PrefixRowProps {
  prefix: InvoicePrefix; isPending: boolean
  onSelect: (id: string) => void; onDelete: (id: string) => void
}

function PrefixRow({ prefix, isPending, onSelect, onDelete }: PrefixRowProps) {
  return (
    <li className={[
      'flex items-center justify-between gap-sm px-md py-sm rounded-lg border transition-colors',
      prefix.selected ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/20 bg-surface-container hover:border-outline-variant/40',
    ].join(' ')}>
      <div className="flex items-center gap-sm">
        {prefix.selected && <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>}
        <span className="font-mono body-md text-on-surface">{prefix.prefix}</span>
        {prefix.selected && <span className="label-xs text-primary uppercase tracking-wide">active</span>}
      </div>
      <div className="flex items-center gap-xs">
        {!prefix.selected && (
          <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={() => onSelect(prefix.id)}>Select</Button>
        )}
        <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={() => onDelete(prefix.id)} aria-label={`Delete prefix ${prefix.prefix}`}>
          <span className="material-symbols-outlined text-[16px] text-error">delete</span>
        </Button>
      </div>
    </li>
  )
}
