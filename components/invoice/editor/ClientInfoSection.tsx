import { Input, Textarea } from '@/components/ui'

export interface ClientInfoSectionProps {
  clientName:    string
  clientEmail:   string
  clientAddress: string
  onChange:      (field: 'clientName' | 'clientEmail' | 'clientAddress', value: string) => void
}

export function ClientInfoSection({ clientName, clientEmail, clientAddress, onChange }: ClientInfoSectionProps) {
  return (
    <div className="flex flex-col gap-md">
        <Input
          id="client-name"
          label="CLIENT NAME"
          type="text"
          value={clientName}
          placeholder="Acme Corp Inc."
          onChange={(e) => onChange('clientName', e.target.value)}
        />
        <Input
          id="client-email"
          label="EMAIL ADDRESS"
          type="email"
          value={clientEmail}
          placeholder="billing@acme.com"
          onChange={(e) => onChange('clientEmail', e.target.value)}
        />
        <Textarea
          id="client-address"
          label="CLIENT ADDRESS"
          rows={2}
          value={clientAddress}
          placeholder="123 Innovation Way, Tech City"
          resize="none"
          onChange={(e) => onChange('clientAddress', e.target.value)}
        />
    </div>
  )
}
