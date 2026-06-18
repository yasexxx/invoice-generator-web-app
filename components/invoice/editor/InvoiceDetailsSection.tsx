import { Input }        from '@/components/ui'
import { SectionTitle } from './SectionTitle'

export interface InvoiceDetailsSectionProps {
  invoiceNumber: string
  issuedDate:    string
  dueDate:       string
  onInvoiceNumberChange: (value: string) => void
  onDateChange:  (field: 'issuedDate' | 'dueDate', value: string) => void
}

export function InvoiceDetailsSection({
  invoiceNumber,
  issuedDate,
  dueDate,
  onInvoiceNumberChange,
  onDateChange,
}: InvoiceDetailsSectionProps) {
  return (
    <div className="space-y-md">
      <SectionTitle icon="receipt_long" title="Invoice Details" />
      <div className="flex flex-col gap-md">
        <Input
          id="invoice-number"
          label="INVOICE NUMBER"
          type="text"
          value={invoiceNumber}
          placeholder="INV-2024-001"
          onChange={(e) => onInvoiceNumberChange(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-md">
          <Input
            id="issued-date"
            label="ISSUED DATE"
            type="text"
            value={issuedDate}
            placeholder="Jun 18, 2024"
            onChange={(e) => onDateChange('issuedDate', e.target.value)}
            trailingSlot={issuedDate ? <ClearButton onClear={() => onDateChange('issuedDate', '')} /> : undefined}
          />
          <Input
            id="due-date"
            label="DUE DATE"
            type="text"
            value={dueDate}
            placeholder="Jul 3, 2024"
            onChange={(e) => onDateChange('dueDate', e.target.value)}
            trailingSlot={dueDate ? <ClearButton onClear={() => onDateChange('dueDate', '')} /> : undefined}
          />
        </div>
      </div>
    </div>
  )
}

function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label="Clear"
      style={{ display: 'flex', cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'var(--color-text-muted)' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 'var(--spacing-md)' }}>close</span>
    </button>
  )
}
