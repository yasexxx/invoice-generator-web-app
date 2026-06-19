'use client'

import { useState, useTransition }   from 'react'
import { Input, Textarea, Button }   from '@/components/ui'
import { TemplateSelector }          from '@/components/invoice/editor/TemplateSelector'
import { PaperSizeSelector }         from '@/components/invoice/editor/PaperSizeSelector'
import { SignatureSection }          from '@/components/invoice/editor/SignatureSection'
import { saveInvoicePreferences }    from '@/app/settings/invoice-preferences-actions'
import type { InvoicePreferences }   from '@/app/settings/invoice-preferences-actions'
import type { TemplateId, PaperSize } from '@/components/invoice/invoice.types'

const FALLBACK_PREFERENCES: InvoicePreferences = {
  templateId:    'minimalist',
  paperSize:     'a4',
  issuerName:    '',
  issuerAddress: '',
  taxPercent:    10,
  discount:      0,
  signature:     '',
}

export interface InvoiceDefaultsSectionProps {
  initialPreferences: InvoicePreferences | null
}

export function InvoiceDefaultsSection({ initialPreferences }: InvoiceDefaultsSectionProps) {
  const [prefs, setPrefs]            = useState<InvoicePreferences>(initialPreferences ?? FALLBACK_PREFERENCES)
  const [error, setError]            = useState<string | null>(null)
  const [saved, setSaved]            = useState(false)
  const [isPending, startTransition] = useTransition()

  const update = <K extends keyof InvoicePreferences>(key: K, value: InvoicePreferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveInvoicePreferences(prefs)
      if (!result.success) { setError(result.error); return }
      setPrefs(result.data)
      setSaved(true)
    })
  }

  return (
    <div className="flex flex-col gap-lg">
      <TemplateDefaultCard value={prefs.templateId} onChange={(v) => update('templateId', v)} />
      <PaperSizeDefaultCard value={prefs.paperSize} onChange={(v) => update('paperSize', v)} />
      <OrganizationDefaults
        issuerName={prefs.issuerName}
        issuerAddress={prefs.issuerAddress}
        onNameChange={(v) => update('issuerName', v)}
        onAddressChange={(v) => update('issuerAddress', v)}
      />
      <TaxDiscountDefaults
        taxPercent={prefs.taxPercent}
        discount={prefs.discount}
        onTaxChange={(v) => update('taxPercent', v)}
        onDiscountChange={(v) => update('discount', v)}
      />
      <SignatureDefault signature={prefs.signature} onChange={(v) => update('signature', v)} />
      <DefaultsSaveRow isPending={isPending} saved={saved} error={error} onSave={handleSave} />
    </div>
  )
}

interface TemplateDefaultCardProps { value: TemplateId; onChange: (id: TemplateId) => void }

function TemplateDefaultCard({ value, onChange }: TemplateDefaultCardProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-md">
      <DefaultsHeading icon="style" title="Template Style" description="Default template applied to new invoices." />
      <TemplateSelector selected={value} onChange={onChange} />
    </div>
  )
}

interface PaperSizeDefaultCardProps { value: PaperSize; onChange: (size: PaperSize) => void }

function PaperSizeDefaultCard({ value, onChange }: PaperSizeDefaultCardProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-md">
      <DefaultsHeading icon="description" title="Paper Size" description="Default paper format for new invoices." />
      <PaperSizeSelector selected={value} onChange={onChange} />
    </div>
  )
}

interface OrganizationDefaultsProps {
  issuerName: string; issuerAddress: string
  onNameChange: (v: string) => void; onAddressChange: (v: string) => void
}

function OrganizationDefaults({ issuerName, issuerAddress, onNameChange, onAddressChange }: OrganizationDefaultsProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-md">
      <DefaultsHeading icon="business" title="Your Organization" description="Pre-fill your business details on new invoices." />
      <div className="flex flex-col gap-sm">
        <Input
          label="Business name"
          placeholder="Acme Corp"
          value={issuerName}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Textarea
          label="Business address"
          placeholder="123 Main St, City, Country"
          value={issuerAddress}
          rows={3}
          resize="none"
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>
    </div>
  )
}

interface TaxDiscountDefaultsProps {
  taxPercent: number; discount: number
  onTaxChange: (v: number) => void; onDiscountChange: (v: number) => void
}

function TaxDiscountDefaults({ taxPercent, discount, onTaxChange, onDiscountChange }: TaxDiscountDefaultsProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-md">
      <DefaultsHeading icon="percent" title="Tax & Discount" description="Default tax rate and discount applied to new invoices." />
      <div className="grid grid-cols-2 gap-sm">
        <Input
          type="number"
          label="Tax rate (%)"
          placeholder="10"
          min={0}
          max={100}
          value={String(taxPercent)}
          onChange={(e) => onTaxChange(Number(e.target.value))}
        />
        <Input
          type="number"
          label="Discount"
          placeholder="0"
          min={0}
          value={String(discount)}
          onChange={(e) => onDiscountChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

interface SignatureDefaultProps { signature: string; onChange: (v: string) => void }

function SignatureDefault({ signature, onChange }: SignatureDefaultProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-md">
      <DefaultsHeading icon="draw" title="Default Signature" description="Signature pre-applied to new invoices." />
      <SignatureSection signature={signature} onChange={onChange} />
    </div>
  )
}

interface DefaultsHeadingProps { icon: string; title: string; description: string }

function DefaultsHeading({ icon, title, description }: DefaultsHeadingProps) {
  return (
    <div className="flex items-center gap-sm">
      <span className="material-symbols-outlined text-[22px] text-primary">{icon}</span>
      <div>
        <h2 className="title-md text-on-surface">{title}</h2>
        <p className="body-sm text-on-surface-variant">{description}</p>
      </div>
    </div>
  )
}

interface DefaultsSaveRowProps {
  isPending: boolean; saved: boolean; error: string | null; onSave: () => void
}

function DefaultsSaveRow({ isPending, saved, error, onSave }: DefaultsSaveRowProps) {
  return (
    <div className="flex items-center justify-between gap-md">
      <div>
        {error && <p className="body-sm text-error">{error}</p>}
        {saved && !isPending && <p className="body-sm text-primary">Defaults saved.</p>}
      </div>
      <Button type="button" variant="primary" size="md" disabled={isPending} onClick={onSave}>
        {isPending
          ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          : <span className="material-symbols-outlined text-[18px]">save</span>
        }
        Save Defaults
      </Button>
    </div>
  )
}
