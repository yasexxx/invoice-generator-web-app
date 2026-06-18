import type { InvoiceTotals as Totals } from '../invoice.types'

export interface InvoiceTotalsProps {
  totals:     Totals
  taxPercent: number
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export function InvoiceTotals({ totals, taxPercent }: InvoiceTotalsProps) {
  return (
    <div style={{ borderTop: '2px solid var(--doc-border)', paddingTop: 16, marginTop: 'auto', transition: 'border-color 300ms ease' }}>
      <div className="flex justify-end">
        <div style={{ width: 192, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TotalRow label="Subtotal"              value={fmt(totals.subtotal)} />
          <TotalRow label={`Tax (${taxPercent}%)`} value={fmt(totals.taxAmount)} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 8,
              borderTop: '1px solid var(--doc-border)',
              transition: 'border-color 300ms ease',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
              Total
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--doc-accent)', transition: 'color 300ms ease' }}>
              {fmt(totals.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--doc-muted-text)', transition: 'color 300ms ease' }}>
        {label}
      </span>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--doc-body-text)', transition: 'color 300ms ease' }}>
        {value}
      </span>
    </div>
  )
}
