interface ClientInfoSectionProps {
  clientName:    string
  clientEmail:   string
  clientAddress: string
  onChange: (field: 'clientName' | 'clientEmail' | 'clientAddress', value: string) => void
}

const INPUT_CLS = 'w-full bg-surface-container border border-outline-variant/40 rounded-lg px-md py-sm text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all'
const LABEL_CLS = 'block label-md text-text-muted mb-xs'

export function ClientInfoSection({ clientName, clientEmail, clientAddress, onChange }: ClientInfoSectionProps) {
  return (
    <div className="space-y-md">
      <SectionTitle icon="person" title="Client Information" />

      <div className="grid grid-cols-1 gap-md">
        <div>
          <label className={LABEL_CLS} htmlFor="client-name">CLIENT NAME</label>
          <input
            id="client-name"
            type="text"
            value={clientName}
            placeholder="Acme Corp Inc."
            onChange={(e) => onChange('clientName', e.target.value)}
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="client-email">EMAIL ADDRESS</label>
          <input
            id="client-email"
            type="email"
            value={clientEmail}
            placeholder="billing@acme.com"
            onChange={(e) => onChange('clientEmail', e.target.value)}
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="client-address">CLIENT ADDRESS</label>
          <textarea
            id="client-address"
            rows={2}
            value={clientAddress}
            placeholder="123 Innovation Way, Tech City"
            onChange={(e) => onChange('clientAddress', e.target.value)}
            className={INPUT_CLS}
          />
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-sm text-primary">
      <span className="material-symbols-outlined">{icon}</span>
      <h2 className="title-md">{title}</h2>
    </div>
  )
}
