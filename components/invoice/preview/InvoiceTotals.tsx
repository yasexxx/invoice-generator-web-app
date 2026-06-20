import type { InvoiceTotals as Totals } from '../invoice.types'

export interface InvoiceTotalsProps {
  totals:     Totals
  taxPercent: number
}

const TOTALS_PANEL_WIDTH     = 192
const TOTALS_ROW_GAP         = 8
const TOTALS_LABEL_FONT_SIZE = 12
const TOTALS_TOTAL_FONT_SIZE = 15
const TOTALS_PADDING_TOP     = 16

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export function InvoiceTotals({ totals, taxPercent }: InvoiceTotalsProps) {
  return (
    <div style={{ borderTop: '2px solid var(--doc-border)', paddingTop: TOTALS_PADDING_TOP, marginTop: 'auto', transition: 'border-color 300ms ease' }}>
      <div className="flex justify-end">
        <div style={{ width: TOTALS_PANEL_WIDTH, display: 'flex', flexDirection: 'column', gap: TOTALS_ROW_GAP }}>
          <TotalRow label="Subtotal"              value={fmt(totals.subtotal)} />
          <TotalRow label={`Tax (${taxPercent}%)`} value={fmt(totals.taxAmount)} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: TOTALS_ROW_GAP,
              borderTop: '1px solid var(--doc-border)',
              transition: 'border-color 300ms ease',
            }}
          >
            <span style={{ fontSize: TOTALS_TOTAL_FONT_SIZE, fontWeight: 700, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
              Total
            </span>
            <span style={{ fontSize: TOTALS_TOTAL_FONT_SIZE, fontWeight: 800, color: 'var(--doc-accent)', transition: 'color 300ms ease' }}>
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
      <span style={{ fontSize: TOTALS_LABEL_FONT_SIZE, color: 'var(--doc-muted-text)', transition: 'color 300ms ease' }}>
        {label}
      </span>
      <span style={{ fontSize: TOTALS_LABEL_FONT_SIZE, fontWeight: 500, color: 'var(--doc-body-text)', transition: 'color 300ms ease' }}>
        {value}
      </span>
    </div>
  )
}
