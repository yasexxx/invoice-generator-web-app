import { InvoiceTotals } from './InvoiceTotals'
import type { InvoiceFormData, InvoiceTotals as Totals } from '../invoice.types'

interface InvoiceDocumentProps {
  data:   InvoiceFormData
  totals: Totals
}

const ISSUED = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const DUE    = new Date(Date.now() + 15 * 86400_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function InvoiceDocument({ data, totals }: InvoiceDocumentProps) {
  return (
    <div className="bg-white text-gray-900 rounded-none overflow-hidden p-[40px] flex flex-col font-sans aspect-[1/1.414]">
      <DocumentHeader clientName={data.clientName} />
      <BillingInfo clientName={data.clientName} clientEmail={data.clientEmail} clientAddress={data.clientAddress} />
      <LineItemsTable data={data} />
      <InvoiceTotals totals={totals} taxPercent={data.taxPercent} />
      {data.notes && <NotesFooter notes={data.notes} />}
    </div>
  )
}

function DocumentHeader({ clientName }: { clientName: string }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className="text-[28px] font-bold text-gray-800 tracking-tight">INVOICE</div>
        <div className="text-gray-500 font-medium text-sm">#INV-2024-001</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">
          {clientName || 'Your Business'}
        </div>
        <div className="text-gray-500 text-sm">San Francisco, CA</div>
      </div>
    </div>
  )
}

interface BillingInfoProps {
  clientName:    string
  clientEmail:   string
  clientAddress: string
}

function BillingInfo({ clientName, clientEmail, clientAddress }: BillingInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">BILLED TO</div>
        <div className="text-base font-bold text-gray-800">{clientName  || 'Client Name'}</div>
        <div className="text-sm text-gray-500">{clientAddress || '123 Client Street'}</div>
        <div className="text-sm text-gray-500">{clientEmail   || 'client@example.com'}</div>
      </div>
      <div className="text-right">
        <div className="inline-block text-left">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">DATES</div>
          <div className="text-sm text-gray-700">Issued: <span className="font-semibold">{ISSUED}</span></div>
          <div className="text-sm text-gray-700">Due: <span className="font-semibold">{DUE}</span></div>
        </div>
      </div>
    </div>
  )
}

function LineItemsTable({ data }: { data: InvoiceFormData }) {
  return (
    <div className="flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-100">
            {['Description', 'Qty', 'Price', 'Total'].map((h, i) => (
              <th
                key={h}
                className="py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                style={{ textAlign: i > 0 ? 'right' : 'left' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => {
            const lineTotal = item.qty * item.rate
            return (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-3 font-semibold text-gray-800">{item.description || '—'}</td>
                <td className="py-3 text-right text-gray-600">{item.qty}</td>
                <td className="py-3 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                <td className="py-3 text-right font-bold text-gray-800">${lineTotal.toFixed(2)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function NotesFooter({ notes }: { notes: string }) {
  return (
    <div className="mt-6">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">NOTES</div>
      <p className="text-[12px] text-gray-500 leading-relaxed italic">{notes}</p>
    </div>
  )
}
