import { Input }        from '@/components/ui'
import { SectionTitle } from './SectionTitle'

export interface InvoiceDetailsSectionProps {
  invoiceNumber: string
  onChange:      (value: string) => void
}

export function InvoiceDetailsSection({ invoiceNumber, onChange }: InvoiceDetailsSectionProps) {
  return (
    <div className="space-y-md">
      <SectionTitle icon="receipt_long" title="Invoice Details" />
      <Input
        id="invoice-number"
        label="INVOICE NUMBER"
        type="text"
        value={invoiceNumber}
        placeholder="INV-2024-001"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
