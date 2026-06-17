import { Brand } from '@/components/ui'

interface InvoiceTopNavProps {
  saveStatus: string
  onSend: () => void
}

export function InvoiceTopNav({ saveStatus, onSend }: InvoiceTopNavProps) {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-lg py-md bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <NavLeft />
      <NavRight saveStatus={saveStatus} onSend={onSend} />
    </nav>
  )
}

function NavLeft() {
  return (
    <div className="flex items-center gap-xl">
      <Brand showIcon />
      <button className="hidden md:flex items-center gap-1 text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        Dashboard
      </button>
    </div>
  )
}

interface NavRightProps {
  saveStatus: string
  onSend: () => void
}

function NavRight({ saveStatus, onSend }: NavRightProps) {
  return (
    <div className="flex items-center gap-md">
      <span className="hidden md:block label-md text-on-surface-variant">{saveStatus}</span>
      <button
        onClick={onSend}
        className="bg-primary-container text-text-primary px-lg py-sm rounded-lg font-semibold hover:brightness-110 active:scale-95 transition-transform"
      >
        Send Invoice
      </button>
    </div>
  )
}
