import type { InvoiceTotals as Totals } from '../invoice.types'

interface InvoiceTotalsProps {
  totals:     Totals
  taxPercent: number
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export function InvoiceTotals({ totals, taxPercent }: InvoiceTotalsProps) {
  return (
    <div className="border-t-2 border-gray-100 pt-4 mt-auto">
      <div className="flex justify-end">
        <div className="w-48 space-y-2">
          <TotalRow label="Subtotal"         value={fmt(totals.subtotal)} />
          <TotalRow label={`Tax (${taxPercent}%)`} value={fmt(totals.taxAmount)} />
          <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-indigo-600">{fmt(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  )
}
