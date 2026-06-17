import { InvoiceDocument } from './InvoiceDocument'
import type { InvoiceFormData, InvoiceTotals } from '../invoice.types'

interface PreviewPanelProps {
  data:   InvoiceFormData
  totals: InvoiceTotals
}

export function PreviewPanel({ data, totals }: PreviewPanelProps) {
  return (
    <section className="lg:col-span-7 bg-background h-full flex items-center justify-center p-lg relative overflow-hidden">
      <LivePreviewBadge />
      <div className="relative z-10 w-full max-w-2xl transform scale-90 md:scale-100 transition-all">
        <InvoiceDocument data={data} totals={totals} />
      </div>
      <MobileControls />
    </section>
  )
}

function LivePreviewBadge() {
  return (
    <div className="absolute top-4 right-4 z-20 bg-primary text-on-primary-fixed label-md px-md py-xs rounded-full shadow-lg flex items-center gap-xs animate-bounce">
      <span className="material-symbols-outlined text-[16px]">visibility</span>
      LIVE PREVIEW
    </div>
  )
}

function MobileControls() {
  return (
    <div className="absolute bottom-lg left-1/2 -translate-x-1/2 flex gap-md lg:hidden z-20">
      <button className="bg-surface-elevated/90 backdrop-blur-md p-md rounded-full shadow-xl">
        <span className="material-symbols-outlined">zoom_in</span>
      </button>
      <button className="bg-surface-elevated/90 backdrop-blur-md p-md rounded-full shadow-xl">
        <span className="material-symbols-outlined">file_download</span>
      </button>
    </div>
  )
}
